import { handleApiErrors } from "@src/utils/errors/handleApiErrors";
import { requireAuth } from "@src/utils/middleware/requiredAuth";
import { SuccessResponse } from "@src/utils/next-response";
import { NextRequest } from "next/server";

const EMPLOYEES = [
  {
    id: "1",
    name: "Amit Sharma",
    role: "Senior Tech Officer",
    dept: "IT",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?u=1",
  },
  {
    id: "2",
    name: "Priya Verma",
    role: "Assistant Officer",
    dept: "Admin",
    status: "On Leave",
    avatar: "https://i.pravatar.cc/150?u=2",
  },
  {
    id: "3",
    name: "Rahul Singh",
    role: "Scientist C",
    dept: "Research",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?u=3",
  },
  {
    id: "4",
    name: "Sneha Gupta",
    role: "Jr. Secretariat Asst",
    dept: "Accounts",
    status: "Probation",
    avatar: "https://i.pravatar.cc/150?u=4",
  },
  {
    id: "5",
    name: "Vikram Malhotra",
    role: "Director",
    dept: "Management",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?u=5",
  },
  {
    id: "6",
    name: "Arjun Nair",
    role: "Tech Assistant",
    dept: "Lab",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?u=6",
  },
];

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);
    return SuccessResponse({ data: EMPLOYEES });
  } catch (error) {
    return handleApiErrors(error);
  }
}
