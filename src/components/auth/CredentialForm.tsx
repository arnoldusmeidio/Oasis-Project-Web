"use client";

import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { registerSchema } from "@/schemas/auth-schemas";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import CardWrapper from "@/components/auth/CardWrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FormError from "@/components/FormError";
import FormSuccess from "@/components/FormSuccess";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";

interface RoleProps {
   role: string;
}

export default function CredentialForm({ role }: RoleProps) {
   const searchParams = useSearchParams();
   const token = searchParams.get("token");
   const email = searchParams.get("email");

   const [error, setError] = useState<string | undefined>("");
   const [success, setSuccess] = useState<string | undefined>("");

   const router = useRouter();

   if (!token || !email) {
      router.push("/register");
      router.refresh();
   }

   const form = useForm<z.infer<typeof registerSchema>>({
      resolver: zodResolver(registerSchema),
      mode: "onBlur",
      defaultValues: {
         name: "",
         email: email ? email : "",
         password: "",
         confirmPassword: "",
      },
   });

   const {
      formState: { isSubmitting },
   } = form;

   const onSubmit = async (values: z.infer<typeof registerSchema>) => {
      try {
         const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/auth/register`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...values, role, token }),
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
         headerLabel={role == "customer" ? "Create a customer account" : "Create a tenant account"}
         showBackButton
         backButtonLabel="Already have an account"
         backButtonHref="/login"
      >
         <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
               <div className="space-y-4">
                  <FormField
                     control={form.control}
                     name="name"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Name</FormLabel>
                           <FormControl>
                              <Input {...field} disabled={isSubmitting} placeholder="John Doe" type="text" />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="email"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Email</FormLabel>
                           <FormControl>
                              <Input {...field} disabled={true} placeholder="john.doe@email.com" type="email" />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
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
                  Create account
               </Button>
            </form>
         </Form>
      </CardWrapper>
   );
}
