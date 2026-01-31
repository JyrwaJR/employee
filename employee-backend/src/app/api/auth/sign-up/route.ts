import { AuthServices } from "@services/auth";
import { withValidation } from "@src/utils/next-response/withValidiation";
import { handleApiErrors } from "@utils/errors/handleApiErrors";
import { ErrorResponse, SuccessResponse } from "@utils/next-response";
import { SignUpSchema } from "@utils/validation/auth";

export const POST = withValidation({ body: SignUpSchema }, async ({ body }) => {
  try {
    const email = body.email;
    // check if user already exists under the same email address
    const user = await AuthServices.getUnique({ where: { email } });

    if (user)
      return ErrorResponse({ message: "User already exists", status: 400 });

    const newUser = await AuthServices.create({
      email: body.email,
      first_name: body.first_name,
      last_name: body.last_name,
      password: body.password,
    });

    return SuccessResponse({
      data: newUser,
      message: "User created successfully. Please login",
      status: 201,
    });
  } catch (error) {
    return handleApiErrors(error);
  }
});
