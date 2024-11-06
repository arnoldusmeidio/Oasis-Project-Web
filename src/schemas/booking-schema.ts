import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const bookingSchema = z.object({
   id: z.string(),
   title: z.string(),
   status: z.string(),
   label: z.string(),
   priority: z.string(),
});

export type Task = z.infer<typeof bookingSchema>;

export const bookDateSchema = z.object({
   date: z
      .object(
         {
            from: z.date({ required_error: "From date is required" }),
            to: z.date({ invalid_type_error: "To date is required" }).optional(),
         },
         {
            required_error: "Please select a date range",
         },
      )
      .optional(),
});

export type FormTypeBookDate = z.infer<typeof bookDateSchema>;
