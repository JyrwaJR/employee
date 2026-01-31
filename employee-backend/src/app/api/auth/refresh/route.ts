import { handleApiErrors } from "@src/utils/errors/handleApiErrors";
import { UnauthorizedError } from "@src/utils/errors/unAuthError";
import { TokenServices } from "@src/services/tokens";
import { JWT } from "@src/libs/auth/jwt";
import { SuccessResponse } from "@src/utils/next-response";
import { TokenSchema } from "@src/utils/validation/token";
import { withValidation } from "@src/utils/next-response/withValidiation";

export const POST = withValidation({ body: TokenSchema }, async ({ body }) => {
  try {
    const { refresh_token } = body;

    if (!refresh_token) {
      throw new UnauthorizedError("Refresh token required");
    }

    // check if someone is using the old refresh token
    const isTokenRevoked = await TokenServices.getUnique({
      where: { hash: refresh_token, is_revoked: true },
    });

    if (isTokenRevoked) {
      // revoke all tokens seem like user is using the old refresh token
      await TokenServices.updateMany({
        where: { user_id: isTokenRevoked.user_id },
        data: { is_revoked: true },
      });

      throw new UnauthorizedError("Unauthorized");
    }

    const tokenRecord = await TokenServices.getUnique({
      where: {
        hash: refresh_token,
        is_revoked: false,
        expires_at: { gt: new Date() },
      },
    });

    if (!tokenRecord) {
      throw new UnauthorizedError("Unauthorized");
    }

    const userId = tokenRecord.user_id;

    const authId = tokenRecord.auth_id;

    const newRefreshToken = await JWT.signRefreshToken({ userId });

    await TokenServices.createToken({
      user_id: userId,
      hash: newRefreshToken,
      auth_id: authId,
    });

    const newAccessToken = await JWT.signAccessToken({ userId });

    return SuccessResponse({
      data: {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      },
      message: "Successfull refresh",
    });
  } catch (error) {
    return handleApiErrors(error);
  }
});
