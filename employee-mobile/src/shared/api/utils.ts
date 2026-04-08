import { z } from 'zod';

/**
 * Validated API Path & Query Factory
 *
 * Supports:
 * 1. Simple displacement: path('/user/:id')('123')
 * 2. Multi-param: path('/org/:orgId/user/:userId')({ orgId: 'A', userId: 'B' })
 * 3. Validation: path('/user/:id', { params: z.object({ id: z.uuid() }) })
 * 4. Query strings: path('/search', { query: z.object({ q: z.string() }) })({ q: 'test' })
 */

type SchemaDefinition = {
  params?: z.ZodTypeAny;
  query?: z.ZodTypeAny;
};

export const path = (template: string, schemas?: SchemaDefinition) => {
  return (input: any) => {
    let resolvedParams = input;
    let queryString = '';

    /**
     * 1. Schema Validation (Pre-processing)
     */
    if (schemas) {
      // Handle Params
      if (schemas.params) {
        // Fallback: If template has :id but input is a string, wrap it for validation
        const paramsInput =
          typeof input === 'string' && template.includes(':id') ? { id: input } : input;
        resolvedParams = schemas.params.parse(paramsInput);
      }

      // Handle Query
      if (schemas.query) {
        const validatedQuery = schemas.query.parse(input);
        const searchParams = new URLSearchParams();
        Object.entries(validatedQuery as Record<string, any>).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
          }
        });
        const qs = searchParams.toString();
        if (qs) queryString = `?${qs}`;
      }
    }

    /**
     * 2. Path Replacement
     */
    let resultPath = template;
    const placeholders = template.match(/:([a-zA-Z0-9_]+)/g) || [];

    placeholders.forEach((placeholder) => {
      const key = placeholder.slice(1); // remove ':'
      
      // Resolve value from input (string fallback or object key)
      const value =
        typeof resolvedParams === 'string' && key === 'id' ? resolvedParams : (resolvedParams as any)?.[key];

      if (value === undefined || value === null) {
        throw new Error(
          `[Path Builder Error]: Missing placeholder value for "${placeholder}" in template "${template}". Received params: ${JSON.stringify(input)}`
        );
      }

      // precise replacement using regex \b boundary logic
      resultPath = resultPath.replace(new RegExp(`${placeholder}\\b`, 'g'), String(value));
    });

    return `${resultPath}${queryString}`;
  };
};
