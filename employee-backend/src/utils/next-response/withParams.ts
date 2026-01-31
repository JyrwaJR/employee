import { z } from "zod";
import { NextResponse } from "next/server";

/**
 * Reusable params validator for Next App Router
 */
export function withParams<T extends z.ZodTypeAny>(
  schema: T,
  handler: (params: z.infer<T>) => Promise<Response>,
) {
  return async (_req: Request, ctx: { params: Promise<unknown> }) => {
    // ✅ unwrap promise (required in Next 15+)
    const rawParams = await ctx.params;

    const parsed = schema.safeParse(rawParams);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid parameters", error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    return handler(parsed.data);
  };
}
