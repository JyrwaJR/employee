import { z, ZodError } from "zod";
import { NextRequest } from "next/server";
import { ErrorResponse } from "./errorResponse";

type Schemas<
  P extends z.ZodTypeAny,
  Q extends z.ZodTypeAny,
  B extends z.ZodTypeAny,
> = {
  params?: P;
  query?: Q;
  body?: B;
};

export function withValidation<
  P extends z.ZodTypeAny = z.ZodTypeAny,
  Q extends z.ZodTypeAny = z.ZodTypeAny,
  B extends z.ZodTypeAny = z.ZodTypeAny,
>(
  schemas: Schemas<P, Q, B>,
  handler: (
    data: {
      params: P extends z.ZodTypeAny ? z.infer<P> : undefined;
      query: Q extends z.ZodTypeAny ? z.infer<Q> : undefined;
      body: B extends z.ZodTypeAny ? z.infer<B> : undefined;
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

      // 3. Await and Validate body
      const validatedBody = schemas.body
        ? schemas.body.parse(await req.json())
        : undefined;

      return await handler(
        {
          params: validatedParams as P extends z.ZodTypeAny
            ? z.infer<P>
            : undefined,
          query: validatedQuery as Q extends z.ZodTypeAny
            ? z.infer<Q>
            : undefined,
          body: validatedBody as B extends z.ZodTypeAny
            ? z.infer<B>
            : undefined,
        },
        req,
      );
    } catch (error) {
      if (error instanceof ZodError) {
        return ErrorResponse({
          message: "Validiation failed",
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
