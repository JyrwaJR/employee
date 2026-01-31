import { SalaryService } from "@src/services/salary";
import { handleApiErrors } from "@src/utils/errors/handleApiErrors";
import { requireAuth } from "@src/utils/middleware/requiredAuth";
import { SuccessResponse } from "@src/utils/next-response";
import { withValidation } from "@src/utils/next-response/withValidiation";
import { NextRequest } from "next/server";
import z from "zod";

const paramsSchema = z.object({
  id: z.uuid("Salary Id must be a valid uuid"),
});

export const GET = withValidation(
  { params: paramsSchema },
  async ({ params }, req) => {
    try {
      await requireAuth(req);

      const id = params.id;

      const employee = await SalaryService.getUnique({ where: { id: id } });

      return SuccessResponse({ data: employee });
    } catch (error) {
      return handleApiErrors(error);
    }
  },
);
