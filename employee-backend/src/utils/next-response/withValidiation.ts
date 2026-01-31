import { z, ZodError } from "zod";
import { NextRequest } from "next/server";
import { ErrorResponse } from "./errorResponse";

type Schemas<P extends z.ZodTypeAny, Q extends z.ZodTypeAny> = {
  params?: P;
  query?: Q;
};

export function withValidation<
  P extends z.ZodTypeAny = z.ZodTypeAny,
  Q extends z.ZodTypeAny = z.ZodTypeAny,
>(
  schemas: Schemas<P, Q>,
  handler: (
    data: {
      params: P extends z.ZodTypeAny ? z.infer<P> : undefined;
      query: Q extends z.ZodTypeAny ? z.infer<Q> : undefined;
    },
    req: NextRequest,
  ) => Promise<Response>,
) {
  return async (
    req: NextRequest,
    // In Next.js 15, params is a Promise
    segmentData: { params: Promise<Record<string, string | string[]>> },
  ): Promise<Response> => {
    try {
      // 2. Extract Search Params from the URL
      const { searchParams } = new URL(req.url);
      const queryObj = Object.fromEntries(searchParams.entries());

      // 3. Await and Validate Params
      const resolvedParams = await segmentData.params;

      const validatedParams = schemas.params
        ? schemas.params.parse(resolvedParams)
        : undefined;

      const validatedQuery = schemas.query
        ? schemas.query.parse(queryObj)
        : undefined;
      return await handler(
        {
          params: validatedParams as P extends z.ZodTypeAny
            ? z.infer<P>
            : undefined,
          query: validatedQuery as Q extends z.ZodTypeAny
            ? z.infer<Q>
            : undefined,
        },
        req,
      );
    } catch (error) {
      if (error instanceof ZodError) {
        return ErrorResponse({
          message: "URL validiation failed",
          error: error.issues,
          status: 400,
        });
      }

      return ErrorResponse({
        message: "URL validiation failed",
        status: 400,
        error,
      });
    }
  };
}
