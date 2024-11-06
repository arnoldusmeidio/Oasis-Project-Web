"use client";

import * as z from "zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "lucide-react";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useUserStore } from "@/stores/useUserStore";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FormError from "@/components/FormError";
import FormSuccess from "@/components/FormSuccess";

import { profilePictureSchema } from "@/schemas/profile-schemas";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslations } from "next-intl";

interface Props {
   getUser: () => void;
}

export default function ChangeProfilePictureForm({ getUser }: Props) {
   const { user } = useUserStore();
   const t = useTranslations("UserProfile");

   const [error, setError] = useState<string | undefined>("");
   const [success, setSuccess] = useState<string | undefined>("");
   const [picture, setPicture] = useState(user?.pictureUrl);

   const form = useForm<z.infer<typeof profilePictureSchema>>({
      resolver: zodResolver(profilePictureSchema),
      mode: "onSubmit",
      defaultValues: {
         pictureUrl: new File([], ""),
      },
   });

   const {
      formState: { isSubmitting },
   } = form;

   const onSubmit = async (values: z.infer<typeof profilePictureSchema>) => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
         formData.append("pictureUrl", value);
      });

      try {
         const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/users/picture`, {
            method: "PUT",
            body: formData,
            credentials: "include",
         });
         const data = await response.json();
         if (!data.ok) {
            setSuccess("");
            setError(data.message);
         } else {
            setError("");
            setSuccess(data.message);

            getUser();
            form.reset();
         }
      } catch (error) {
         console.error(error);
         setError(`${t("error")}`);
      }
   };

   return (
      <>
         <Avatar className="h-20 w-20 justify-self-center">
            <AvatarImage src={picture} alt="Profile picture" />
            <AvatarFallback>
               <User className="h-10 w-10" />
            </AvatarFallback>
         </Avatar>
         <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
               <div className="space-y-4">
                  <FormField
                     control={form.control}
                     name="pictureUrl"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>{t("ProfilePicture.profilePicture")}</FormLabel>
                           <FormControl>
                              <Input
                                 disabled={isSubmitting}
                                 type="file"
                                 accept="image/*"
                                 onChange={(event) => {
                                    field.onChange(event.target?.files?.[0] ?? undefined);
                                    setPicture(
                                       event.target?.files?.[0]
                                          ? URL.createObjectURL(event.target?.files?.[0])
                                          : undefined,
                                    );
                                 }}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
               </div>
               <FormError message={error} />
               <FormSuccess message={success} />
               <Button className="w-full" type="submit" disabled={isSubmitting}>
                  {t("ProfilePicture.save")}
               </Button>
            </form>
         </Form>
      </>
   );
}
