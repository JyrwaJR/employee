import { EmployeeService } from "@src/services/employee";
import { handleApiErrors } from "@src/utils/errors/handleApiErrors";
import { requireAuth } from "@src/utils/middleware/requiredAuth";
import { SuccessResponse } from "@src/utils/next-response";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth(req);
    const id = (await params).id;
    const employee = await EmployeeService.getUnique({
      where: { id },
      include: { salary_slips: true, user: true, current_structure: true },
    });
    return SuccessResponse({ data: employee });
  } catch (error) {
    return handleApiErrors(error);
  }
}
