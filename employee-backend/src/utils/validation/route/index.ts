import z from "zod";

export const RouteSchema = {
  params: z.object({ id: z.uuid() }),
};
