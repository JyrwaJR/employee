import { SalaryService } from "@src/services/salary";
import { handleApiErrors } from "@src/utils/errors/handleApiErrors";
import { requireAuth } from "@src/utils/middleware/requiredAuth";
import { SuccessResponse } from "@src/utils/next-response";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);

    const employee = await SalaryService.getSalary();

    return SuccessResponse({ data: employee });
  } catch (error) {
    return handleApiErrors(error);
  }
}
