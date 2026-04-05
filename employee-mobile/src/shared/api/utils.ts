import { z } from 'zod';

/**
 * Validated API Path Factory
 * 
 * Supports both single string arguments (using ":id") 
 * and objects with multiple parameters (using ":[key]").
 */
export const path = <T extends Record<string, any>>(
  template: string,
  schema?: z.ZodType<any>
) => (params: T | string) => {
  // 1. Single parameter (string)
  if (typeof params === 'string') {
    const s = schema || z.string().min(1, 'ID is required');
    s.parse(params);
    return template.replace(':id', params);
  }

  // 2. Object parameters
  if (schema) schema.parse(params);
  let result = template;
  for (const [key, value] of Object.entries(params)) {
    result = result.replace(`:${key}`, String(value));
  }
  return result;
};
