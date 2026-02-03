import { PensionService } from "@src/services/pension";
import { handleApiErrors } from "@src/utils/errors/handleApiErrors";
import { requireAuth } from "@src/utils/middleware/requiredAuth";
import { SuccessResponse } from "@src/utils/next-response";
import { withValidation } from "@src/utils/next-response/withValidiation";
import { RouteSchema } from "@src/utils/validation/route";

export const GET = withValidation(
  { params: RouteSchema.params },
  async ({ params }, req) => {
    try {
      await requireAuth(req);
      const id = params.id;
      const data = await PensionService.getAll({ where: { employee_id: id } });
      return SuccessResponse({ data, message: "Successfully fetched pension" });
    } catch (error) {
      return handleApiErrors(error);
    }
  },
);
