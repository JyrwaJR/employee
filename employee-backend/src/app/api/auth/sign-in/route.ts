import { handleApiErrors } from "@utils/errors/handleApiErrors";
import { ErrorResponse, SuccessResponse } from "@utils/next-response";
import { LoginSchema } from "@utils/validation/auth";
import { AuthServices } from "@services/auth";
import { BcryptService } from "@src/libs/auth/bcrypt";
import { TokenServices } from "@src/services/tokens";
import { JWT } from "@src/libs/auth/jwt";
import { logger } from "@src/utils/logger";
import { withValidation } from "@src/utils/next-response/withValidiation";
import { UsePasswordServices } from "@src/services/auth/usePassword";

const checkIfDateIsThreeMonth = (date: Date) => {
  return Date.now() - date.getTime() > 3 * 30 * 24 * 60 * 60 * 1000; // 3 months
};

export const POST = withValidation({ body: LoginSchema }, async ({ body }) => {
  try {
    const auth = await AuthServices.getUnique({
      where: { phone_no: body.phone_no },
    });

    if (auth?.isFirstTimeLogin) {
      return ErrorResponse({
        message: "This account is new. Please reset your password",
        status: 401,
      });
    }
    const isInvalidCredentail =
      !auth ||
      !(await BcryptService.compare(body.password, auth.hash_password));

    if (isInvalidCredentail) {
      return ErrorResponse({ message: "Invalid credentials", status: 401 });
    }

    // TODO: implement check if password has expire
    const accessToken = await JWT.signAccessToken({ userId: auth.user_id });

    const hashedRefresh = await JWT.signRefreshToken({
      userId: auth.user_id,
    });

    // Store hashed refresh in DB
    await TokenServices.createToken({
      user_id: auth.user_id,
      hash: hashedRefresh,
      auth_id: auth.id,
    });

    return SuccessResponse({
      token: accessToken,
      data: {
        ...auth.user,
        refresh_token: hashedRefresh,
      },
      message: "Successfully logged in",
    });
  } catch (error) {
    logger.log("Signing in error", error);
    return handleApiErrors(error);
  }
});
