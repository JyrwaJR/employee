import { handleApiErrors } from "@src/utils/errors/handleApiErrors";
import { requireAuth } from "@src/utils/middleware/requiredAuth";
import { SuccessResponse } from "@src/utils/next-response";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    return SuccessResponse({ data: auth });
  } catch (error) {
    return handleApiErrors(error);
  }
}
