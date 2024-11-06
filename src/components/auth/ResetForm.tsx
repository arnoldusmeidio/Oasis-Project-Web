"use client";

import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { resetSchema } from "@/schemas/auth-schemas";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";

import CardWrapper from "@/components/auth/CardWrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FormError from "@/components/FormError";
import FormSuccess from "@/components/FormSuccess";
import { useRouter } from "@/i18n/routing";

export default function ResetForm() {
   const [error, setError] = useState<string | undefined>("");
   const [success, setSuccess] = useState<string | undefined>("");

   const router = useRouter();

   const form = useForm<z.infer<typeof resetSchema>>({
      resolver: zodResolver(resetSchema),
      defaultValues: {
         email: "",
      },
      mode: "onBlur",
   });

   const {
      formState: { isSubmitting },
   } = form;

   const onSubmit = async (values: z.infer<typeof resetSchema>) => {
      try {
         const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/auth/user/password`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
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
            router.refresh();
         }
      } catch (error) {
         console.error(error);
         setError("Something went wrong!");
      }
   };

   return (
      <CardWrapper
         headerLabel="Forgot your password?"
         backButtonLabel="Back to login"
         backButtonHref="/login"
         showBackButton
      >
         <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
               <div className="space-y-4">
                  <FormField
                     control={form.control}
                     name="email"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Email</FormLabel>
                           <FormControl>
                              <Input {...field} disabled={isSubmitting} placeholder="john.doe@email.com" type="email" />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
               </div>
               <FormError message={error} />
               <FormSuccess message={success} />
               <Button className="w-full" type="submit" disabled={isSubmitting}>
                  Send reset email
               </Button>
            </form>
         </Form>
      </CardWrapper>
   );
}
