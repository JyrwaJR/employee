import { TokenServices } from "@src/services/tokens";
import { handleApiErrors } from "@src/utils/errors/handleApiErrors";
import { UnauthorizedError } from "@src/utils/errors/unAuthError";
import { SuccessResponse } from "@src/utils/next-response";
import { TokenSchema } from "@src/utils/validation/token";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = TokenSchema.parse(await req.json());
    const refreshToken = body.refresh_token;

    if (!refreshToken) throw new UnauthorizedError("Unauthorized");

    const tokenExists = await TokenServices.getUnique({
      where: {
        hash: refreshToken,
        is_revoked: false,
        expires_at: { gt: new Date() },
      },
    });

    if (!tokenExists) throw new UnauthorizedError("Unauthorized");

    // Revoke token
    await TokenServices.updateUnique({
      where: { hash: refreshToken },
      data: { is_revoked: true },
    });

    return SuccessResponse({ message: "Logout successful" });
  } catch (error) {
    return handleApiErrors(error);
  }
}
