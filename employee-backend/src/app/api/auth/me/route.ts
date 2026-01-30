import { handleApiErrors } from "@src/utils/errors/handleApiErrors";
import { requireAuth } from "@src/utils/middleware/requiredAuth";
import { SuccessResponse } from "@src/utils/next-response";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req);

    const data = {
      id: auth.user_id,
      employee_id: auth.user.employee_id,
      email: auth.email,
      phone: "0987654321",
      first_name: auth.user.first_name,
      avatar: "https://i.pravatar.cc/300?u=" + auth.user.first_name,
      department: "Ministry of Electronics & IT",
      location: "New Delhi",
      last_name: auth.user.last_name,
      role: auth.user.role,
      created_at: auth.user.created_at,
      updated_at: auth.user.updated_at,
    };

    return SuccessResponse({
      data,
      message: "Successfully fetched user details",
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
