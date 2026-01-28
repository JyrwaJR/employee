import { NextRequest } from "next/server";
import { UnauthorizedError } from "../errors/unAuthError";
import { JWT } from "@src/libs/auth/jwt";
import { AuthServices } from "@src/services/auth";

export async function requireAuth(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const accessToken = authHeader?.split(" ")[1];

  if (!accessToken) {
    throw new UnauthorizedError("Unauthorized");
  }
  // Parse the Clerk session JWT and get claims

  const claims = await JWT.verifyAccessToken(accessToken);

  if (!claims) {
    throw new UnauthorizedError("Unauthorized");
  }

  // Try to find user
  const auth = await AuthServices.getUnique({
    where: { user_id: claims.userId },
  });

  if (!auth) {
    throw new UnauthorizedError("Unauthorized");
  }

  return auth.user;
}
