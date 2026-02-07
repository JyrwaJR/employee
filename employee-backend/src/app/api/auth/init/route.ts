import { AuthServices } from "@src/services/auth";
import { OtpServices } from "@src/services/auth/otp";
import { handleApiErrors } from "@src/utils/errors/handleApiErrors";
import { generateSixDigitOtp } from "@src/utils/helper/generateSixDigitOtp";
import { logger } from "@src/utils/logger";
import { ErrorResponse, SuccessResponse } from "@src/utils/next-response";
import { withValidation } from "@src/utils/next-response/withValidiation";
import { phoneValidiation } from "@src/utils/validation";
import z from "zod";

const initSchema = z.object({
  phone_no: phoneValidiation,
});

export const POST = withValidation({ body: initSchema }, async ({ body }) => {
  try {
    const phone_no = body.phone_no;

    const user = await AuthServices.getUnique({ where: { phone_no } });

    if (!user) return ErrorResponse({ message: "User not found", status: 404 });

    const otp = generateSixDigitOtp();

    await OtpServices.create({
      data: {
        otp: otp.toString(),
        auth: { connect: { id: user.id } },
      },
    });

    logger.info("OTP sent", { otp: otp });

    return SuccessResponse({
      message: "OTP sent successfully",
      status: 200,
    });
  } catch (error) {
    return handleApiErrors(error);
  }
});
