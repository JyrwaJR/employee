import { BcryptService } from "@src/libs/auth/bcrypt";
import { AuthServices } from "@src/services/auth";
import { OtpServices } from "@src/services/auth/otp";
import { UsePasswordServices } from "@src/services/auth/usePassword";
import { handleApiErrors } from "@src/utils/errors/handleApiErrors";
import { logger } from "@src/utils/logger";
import { ErrorResponse, SuccessResponse } from "@src/utils/next-response";
import { withValidation } from "@src/utils/next-response/withValidiation";
import { ForgotPasswordSchema } from "@src/utils/validation/auth";

const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

const isOtpExpired = (data: Date) => {
  const createdAt = new Date(data).getTime();

  if (Number.isNaN(createdAt)) {
    throw new Error("Invalid date format for OTP");
  }

  return Date.now() - createdAt > OTP_EXPIRY_MS;
};

export const POST = withValidation(
  { body: ForgotPasswordSchema },
  async ({ body }) => {
    // TODO: implement forgot password
    // should check if otp is valid or is not expired
    // should update user is first time login
    // should check for the password if its not use in our system
    // should add the new password to usepassword model
    try {
      const { otp, phone_no, password } = body;
      const user = await AuthServices.getUnique({ where: { phone_no } });

      if (!user)
        return ErrorResponse({ message: "User not found", status: 404 });

      const isOtpExist = await OtpServices.findFirst({
        where: { auth_id: user.id, is_revoked: false },
      });

      if (!isOtpExist)
        return ErrorResponse({ message: "Invalid otp", status: 404 });

      if (isOtpExpired(isOtpExist.created_at))
        return ErrorResponse({
          message: "Otp expired, please try again",
          status: 404,
        });

      if (isOtpExist.otp !== otp)
        return ErrorResponse({ message: "Invalid otp", status: 404 });

      await AuthServices.updateUnique({
        authId: user.id,
        password,
      }).then((val) => {
        OtpServices.update({
          where: { id: isOtpExist.id },
          data: { is_revoked: true },
        });
        return val;
      });

      return SuccessResponse({
        message: "Password updated successfully",
        status: 200,
      });
    } catch (error) {
      return handleApiErrors(error);
    }
  },
);
