import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import FormError from "@/components/FormError";
import FormSuccess from "@/components/FormSuccess";
import { profileSchema } from "@/schemas/profile-schemas";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Locale, usePathname, useRouter } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { useState } from "react";
import { useUserStore } from "@/stores/useUserStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
   getUser: () => void;
}

export default function UpdateProfileForm({ getUser }: Props) {
   const t = useTranslations("UserProfile");
   const [error, setError] = useState<string | undefined>("");
   const [success, setSuccess] = useState<string | undefined>("");
   const router = useRouter();
   const pathname = usePathname();
   const params = useParams();

   const { user } = useUserStore();

   const form = useForm<z.infer<typeof profileSchema>>({
      resolver: zodResolver(profileSchema),
      defaultValues: {
         name: user?.name || undefined,
         password: undefined,
         newPassword: undefined,
         confirmNewPassword: undefined,
         language: user?.language || undefined,
         currency: user?.currency || undefined,
      },
      mode: "onBlur",
   });

   const {
      formState: { isSubmitting },
   } = form;

   const onSubmit = async (values: z.infer<typeof profileSchema>) => {
      try {
         const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/users`, {
            method: "PUT",
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
            form.reset();
         } else {
            const nextLocale = values.language == "INDONESIA" ? "id" : ("en" as Locale);

            setError("");
            setSuccess(data.message);

            router.replace(
               // @ts-expect-error -- TypeScript will validate that only known `params`
               // are used in combination with a given `pathname`. Since the two will
               // always match for the current route, we can skip runtime checks.
               { pathname, params },
               { locale: nextLocale },
            );
            getUser();
         }
      } catch (error) {
         console.error(error);
         setError(`${t("error")}`);
      }
   };

   return (
      <Form {...form}>
         <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-6">
               <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>{t("name")}</FormLabel>
                        <FormControl>
                           <Input
                              {...field}
                              placeholder={user?.name || `${t("namePlaceholder")}`}
                              disabled={isSubmitting}
                              value={field.value ?? ""}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               {user?.accountProvider === "CREDENTIALS" && (
                  <>
                     <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>{t("currentPassword")}</FormLabel>
                              <FormControl>
                                 <Input
                                    {...field}
                                    placeholder="********"
                                    type="password"
                                    disabled={isSubmitting}
                                    value={field.value ?? ""}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={form.control}
                        name="newPassword"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>{t("newPassword")}</FormLabel>
                              <FormControl>
                                 <Input
                                    {...field}
                                    placeholder="********"
                                    type="password"
                                    disabled={isSubmitting}
                                    value={field.value ?? ""}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={form.control}
                        name="confirmNewPassword"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>{t("confirmNewPassword")}</FormLabel>
                              <FormControl>
                                 <Input
                                    {...field}
                                    placeholder="********"
                                    type="password"
                                    disabled={isSubmitting}
                                    value={field.value ?? ""}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </>
               )}
               <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>{t("language.label")}</FormLabel>
                        <Select disabled={isSubmitting} onValueChange={field.onChange} defaultValue={field.value}>
                           <FormControl>
                              <SelectTrigger>
                                 <SelectValue placeholder={t("language.placeholder")} />
                              </SelectTrigger>
                           </FormControl>
                           <SelectContent>
                              <SelectItem value="ENGLISH">{t("language.english")}</SelectItem>
                              <SelectItem value="INDONESIA">{t("language.indonesia")}</SelectItem>
                           </SelectContent>
                        </Select>

                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>{t("currency.label")}</FormLabel>
                        <Select disabled={isSubmitting} onValueChange={field.onChange} defaultValue={field.value}>
                           <FormControl>
                              <SelectTrigger>
                                 <SelectValue placeholder={t("currency.placeholder")} />
                              </SelectTrigger>
                           </FormControl>
                           <SelectContent>
                              <SelectItem value="IDR">{t("currency.idr")}</SelectItem>
                              <SelectItem value="USD">{t("currency.usd")}</SelectItem>
                           </SelectContent>
                        </Select>
                        <FormMessage />
                     </FormItem>
                  )}
               />
            </div>
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button className="w-full" type="submit">
               {t("update")}
            </Button>
         </form>
      </Form>
   );
}
