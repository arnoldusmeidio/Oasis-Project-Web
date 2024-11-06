"use client";

import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { newPasswordSchema } from "@/schemas/auth-schemas";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import CardWrapper from "@/components/auth/CardWrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FormError from "@/components/FormError";
import FormSuccess from "@/components/FormSuccess";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";

export default function NewPasswordForm() {
   const searchParams = useSearchParams();
   const token = searchParams.get("token");

   const [error, setError] = useState<string | undefined>("");
   const [success, setSuccess] = useState<string | undefined>("");

   const router = useRouter();

   const form = useForm<z.infer<typeof newPasswordSchema>>({
      resolver: zodResolver(newPasswordSchema),
      defaultValues: {
         password: "",
         confirmPassword: "",
      },
      mode: "onBlur",
   });

   const {
      formState: { isSubmitting },
   } = form;

   const onSubmit = async (values: z.infer<typeof newPasswordSchema>) => {
      try {
         const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/auth/user/password`, {
            method: "PUT",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...values, token }),
            credentials: "include",
         });
         const data = await response.json();
         if (!data.ok) {
            setSuccess("");
            setError(data.message);
         } else {
            setError("");
            setSuccess(data.message);
            toast(data.message);
            form.reset();
            router.push("/login");
            router.refresh();
         }
      } catch (error) {
         console.error(error);
         setError("Something went wrong!");
      }
   };

   return (
      <CardWrapper
         headerLabel="Enter a new password"
         backButtonLabel="Back to login"
         backButtonHref="/login"
         showBackButton
      >
         <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
               <div className="space-y-4">
                  <FormField
                     control={form.control}
                     name="password"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Password</FormLabel>
                           <FormControl>
                              <Input {...field} disabled={isSubmitting} placeholder="********" type="password" />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="confirmPassword"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Confirm Password</FormLabel>
                           <FormControl>
                              <Input {...field} disabled={isSubmitting} placeholder="********" type="password" />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
               </div>
               <FormError message={error} />
               <FormSuccess message={success} />
               <Button className="w-full" type="submit" disabled={isSubmitting}>
                  Update password
               </Button>
            </form>
         </Form>
      </CardWrapper>
   );
}
