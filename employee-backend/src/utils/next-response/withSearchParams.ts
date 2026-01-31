import { z } from "zod";
import { NextResponse } from "next/server";

/**
 * Validate query/search params using Zod
 *
 * Usage:
 * export const GET = withSearchParams(schema, async (query) => {})
 */
export function withSearchParams<T extends z.ZodTypeAny>(
  schema: T,
  handler: (query: z.infer<T>) => Promise<Response>,
) {
  return async (
    _req: Request,
    ctx: { searchParams: Promise<Record<string, string | string[]>> },
  ) => {
    // ✅ Next 15+ requires await
    const raw = await ctx.searchParams;

    const parsed = schema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Invalid query parameters",
          error: parsed.error,
        },
        { status: 400 },
      );
    }

    return handler(parsed.data);
  };
}
