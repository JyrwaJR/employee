import { EmployeeService } from "@src/services/employee";
import { handleApiErrors } from "@src/utils/errors/handleApiErrors";
import { requireAuth } from "@src/utils/middleware/requiredAuth";
import { SuccessResponse } from "@src/utils/next-response";
import { withValidation } from "@src/utils/next-response/withValidiation";
import z from "zod";

const paramsSchema = z.object({
  id: z.uuid("Employee id must be a valid uuid"),
});

export const GET = withValidation(
  { params: paramsSchema },
  async ({ params }, req) => {
    try {
      await requireAuth(req);
      const id = params.id;
      const employee = await EmployeeService.getUnique({
        where: { id },
        include: { salary_slips: true, user: true, current_structure: true },
      });
      return SuccessResponse({ data: employee });
    } catch (error) {
      return handleApiErrors(error);
    }
  },
);
