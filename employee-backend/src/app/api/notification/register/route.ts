import { AuthServices } from "@src/services/auth";
import { NotificationServices } from "@src/services/notification";
import { handleApiErrors } from "@src/utils/errors/handleApiErrors";
import { UnauthorizedError } from "@src/utils/errors/unAuthError";
import { requireAuth } from "@src/utils/middleware/requiredAuth";
import { SuccessResponse } from "@src/utils/next-response";
import { withValidation } from "@src/utils/next-response/withValidiation";
import z from "zod";

const bodySchema = z.object({
  token: z.string("Invalid token"),
  user_id: z.uuid("Invalid user id"),
});

export const POST = withValidation(
  { body: bodySchema },
  async ({ body }, req) => {
    try {
      await requireAuth(req);

      const { user_id, token } = body;

      const isUserExist = await AuthServices.getUnique({ where: { user_id } });

      if (!isUserExist) {
        throw new UnauthorizedError("User does not exist");
      }

      await NotificationServices.addToken({
        where: { user_id },
        update: { token, user: { connect: { id: user_id } } },
        data: {
          token: token,
          user: { connect: { id: user_id } },
        },
      });

      return SuccessResponse({
        data: null,
        message: "Notification token added successfully",
        status: 201,
      });
    } catch (error) {
      return handleApiErrors(error);
    }
  },
);
