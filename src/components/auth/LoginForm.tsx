"use client";

import * as z from "zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema } from "@/schemas/auth-schemas";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

import CardWrapper from "@/components/auth/CardWrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FormError from "@/components/FormError";
import FormSuccess from "@/components/FormSuccess";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { Link } from "@/i18n/routing";

export default function LoginForm() {
   const [error, setError] = useState<string | undefined>("");
   const [success, setSuccess] = useState<string | undefined>("");

   const searchParams = useSearchParams();
   const errorMessage = searchParams.get("error");

   useEffect(() => {
      if (errorMessage) setError(errorMessage);
   }, []);

   const router = useRouter();

   const form = useForm<z.infer<typeof loginSchema>>({
      resolver: zodResolver(loginSchema),
      defaultValues: {
         email: "",
         password: "",
         rememberMe: false,
      },
      mode: "onBlur",
   });

   const {
      formState: { isSubmitting },
   } = form;

   const onSubmit = async (values: z.infer<typeof loginSchema>) => {
      try {
         const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/auth/login`, {
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
            form.reset();
            if (data.role == "tenant") {
               router.push(`/tenant/?success=${encodeURIComponent(data.message)}`);
            } else {
               router.push(`/?success=${encodeURIComponent(data.message)}`);
            }
            router.refresh();
         }
      } catch (error) {
         console.error(error);
         setError("Something went wrong!");
      }
   };

   return (
      <CardWrapper
         headerLabel="Welcome back"
         backButtonLabel="Don't have an account?"
         backButtonHref="/register"
         showSocial
         showBackButton
         socialLabel="Continue with Google"
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
                  <FormField
                     control={form.control}
                     name="password"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Password</FormLabel>
                           <FormControl>
                              <Input {...field} disabled={isSubmitting} placeholder="********" type="password" />
                           </FormControl>
                           <Button size={"sm"} variant={"link"} asChild className="px-0 font-normal">
                              <Link href={"/reset"}>Forgot password?</Link>
                           </Button>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="rememberMe"
                     render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                           <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                           </FormControl>
                           <div className="space-y-1 leading-none">
                              <FormLabel>Remember Me</FormLabel>
                              <FormMessage />
                           </div>
                        </FormItem>
                     )}
                  />
               </div>
               <FormError message={error} />
               <FormSuccess message={success} />
               <Button className="w-full" type="submit" disabled={isSubmitting}>
                  Login
               </Button>
            </form>
         </Form>
      </CardWrapper>
   );
}
