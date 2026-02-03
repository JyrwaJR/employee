import { LeaveService } from "@src/services/leave";
import { handleApiErrors } from "@src/utils/errors/handleApiErrors";
import { requireAuth } from "@src/utils/middleware/requiredAuth";
import { SuccessResponse } from "@src/utils/next-response";
import { withValidation } from "@src/utils/next-response/withValidiation";
import z from "zod";

const paramsSchema = z.object({ id: z.uuid() });

export const GET = withValidation(
  { params: paramsSchema },
  async ({ params }, req) => {
    try {
      await requireAuth(req);
      const id = params.id;
      const data = await LeaveService.getAll({ where: { employee_id: id } });
      return SuccessResponse({ data, message: "Successfully fetched leave" });
    } catch (error) {
      return handleApiErrors(error);
    }
  },
);
