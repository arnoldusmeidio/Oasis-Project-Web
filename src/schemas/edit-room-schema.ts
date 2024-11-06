import * as z from "zod";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const editRoomSchema = z.object({
   roomName: z.string().min(1, { message: "Room Name is required" }),
   roomDescription: z.string().min(1, { message: "Room Description is required" }),
   roomPictures: z
      .array(z.instanceof(File))
      .refine(
         (files) => files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
         "Only .jpg, .jpeg, .png, and .webp formats are supported",
      ),
   roomCapacity: z
      .string()
      .min(1, { message: "Room Capacity is required" })
      .transform((val) => Number(val)), // Transform string to number for validation
   roomPrice: z
      .string()
      .min(1, { message: "Price is required" })
      .transform((val) => Number(val)),
   specialDates: z
      .array(
         z.object({
            date: z.date(),
            price: z.number().nonnegative({ message: "Price must be a positive number" }),
         }),
      )
      .optional()
      .default([]),
});
