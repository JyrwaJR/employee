import { AuthServices } from "@services/auth";
import { handleApiErrors } from "@utils/errors/handleApiErrors";
import { ErrorResponse, SuccessResponse } from "@utils/next-response";
import { SignUpSchema } from "@utils/validation/auth";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // validate user using zod
    const body = SignUpSchema.parse(await req.json());
    // extract email from body
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
}
