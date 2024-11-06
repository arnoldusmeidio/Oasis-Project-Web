"use client";

import { BeatLoader } from "react-spinners";
import CardWrapper from "@/components/auth/CardWrapper";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { useEffect, useState } from "react";
import FormError from "@/components/FormError";
import FormSuccess from "@/components/FormSuccess";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function NewVerificationForm() {
   const [error, setError] = useState<string | undefined>("");
   const [success, setSuccess] = useState<string | undefined>("");
   const searchParams = useSearchParams();
   const token = searchParams.get("token");
   const t = useTranslations("UserProfile");

   const router = useRouter();

   if (!token) {
      router.push("/");
      router.refresh();
   }

   useEffect(() => {
      async function updateEmail() {
         try {
            const user = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/auth/user/email`, {
               method: "PUT",
               headers: {
                  "Content-Type": "application/json",
               },
               body: JSON.stringify({ token }),
               credentials: "include",
            });
            const data = await user.json();
            if (!data.ok) {
               setSuccess("");
               setError(data.message);
               router.push("/");
            } else {
               setError("");
               setSuccess(data.message);
               toast(data.message);
               router.push("/user/profile");
               router.refresh();
            }
         } catch (error) {
            console.error(error);
            setError(`${t("error")}`);
         }
      }
      updateEmail();
   }, []);

   return (
      <CardWrapper headerLabel={t("confirmEmail")}>
         <div className="flex h-[200px] w-full items-center justify-center">
            {!success && !error && <BeatLoader />}
            <FormError message={error} />
            <FormSuccess message={success} />
         </div>
      </CardWrapper>
   );
}
