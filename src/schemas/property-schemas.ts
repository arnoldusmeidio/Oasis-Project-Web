import * as z from "zod";
import { Category } from "@/types/property-types";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const propertySchema = z.object({
   propertyName: z.string().min(1, { message: "Property Name is required" }),
   propertyAddress: z.string().min(1, { message: "Property Address is required" }),
   propertyDescription: z.string().min(1, { message: "Property Description is required" }),
   category: z.nativeEnum(Category),
   propertyCity: z.string().min(1, { message: "Property City is required" }),
   propertyPictures: z
      .array(z.instanceof(File))
      .refine(
         (files) => files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
         "Only .jpg, .jpeg, .png, and .webp formats are supported",
      ),
});
