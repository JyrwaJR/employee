import { AuthServices } from "@src/services/auth";
import { OtpServices } from "@src/services/auth/otp";
import { handleApiErrors } from "@src/utils/errors/handleApiErrors";
import { isOtpExpired } from "@src/utils/helper/isOtpExpired";
import { ErrorResponse, SuccessResponse } from "@src/utils/next-response";
import { withValidation } from "@src/utils/next-response/withValidiation";
import { otpValidiation, phoneValidiation } from "@src/utils/validation";
import z from "zod";

const initSchema = z.object({
  phone_no: phoneValidiation,
  otp: otpValidiation,
});

export const POST = withValidation({ body: initSchema }, async ({ body }) => {
  try {
    const { phone_no, otp } = body;

    const user = await AuthServices.getUnique({ where: { phone_no } });

    if (!user) return ErrorResponse({ message: "User not found", status: 404 });

    const isOtpExist = await OtpServices.findFirst({
      where: { auth_id: user.id, is_revoked: false },
    });

    if (!isOtpExist)
      return ErrorResponse({ message: "Invalid otp", status: 404 });

    if (isOtpExpired(isOtpExist.created_at))
      return ErrorResponse({
        message: "Otp expired, please try again",
      });

    if (isOtpExist.otp !== otp)
      return ErrorResponse({ message: "Invalid otp", status: 404 });

    if (otp === isOtpExist.otp) {
      await OtpServices.update({
        where: { id: isOtpExist.id },
        data: { is_revoked: true },
      });
    }

    return SuccessResponse({
      message: "Otp verified successfully",
      status: 200,
    });
  } catch (error) {
    return handleApiErrors(error);
  }
});
