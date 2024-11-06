import { Currency, Language } from "@/types/user-types";

import * as z from "zod";

export const profileSchema = z
   .object({
      name: z.optional(z.string()),
      password: z.optional(z.string()),
      newPassword: z.optional(z.string().min(8, { message: "Password must be at least 8 characters long" })),
      confirmNewPassword: z.optional(z.string().min(1, { message: "Confirmation password is required" })),
      language: z.optional(z.nativeEnum(Language)),
      currency: z.optional(z.nativeEnum(Currency)),
   })
   .refine(
      (values) => {
         if (values.password && !values.newPassword) {
            return false;
         }

         return true;
      },
      {
         message: "New password is required",
         path: ["newPassword"],
      },
   )
   .refine(
      (values) => {
         if (!values.password && values.newPassword) {
            return false;
         }

         return true;
      },
      {
         message: "Password is required",
         path: ["password"],
      },
   )
   .refine(
      (values) => {
         return values.newPassword === values.confirmNewPassword;
      },
      {
         message: "Password do not match",
         path: ["confirmNewPassword"],
      },
   );

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const MAX_FILE_SIZE = 1000000;

export const profilePictureSchema = z.object({
   pictureUrl: z
      .instanceof(File)
      .refine(
         (files) => ACCEPTED_IMAGE_TYPES.includes(files.type),
         "Only .jpg, .jpeg, .png and .webp formats are supported",
      )
      .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 1MB.`),
});
