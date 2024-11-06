import * as z from "zod";

export const reviewSchema = z.object({
   review: z.string().min(1, "Review cannot be empty").max(500, "Review should not exceed 500 characters"),
   star: z.number().min(1, "Rating must be at least 1 star").max(5, "Rating cannot be more than 5 stars"),
});
