"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserStore } from "@/stores/useUserStore";
import { toast } from "sonner";
import { useState } from "react";
import { useTranslations } from "next-intl";

interface Props {
   getUser: () => void;
}

export default function RedeemCodeCard({ getUser }: Props) {
   const { user } = useUserStore();
   const t = useTranslations("UserProfile.RedeemCode");
   const [refCode, setRefCode] = useState("");

   async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>): Promise<void | undefined> {
      e.preventDefault();

      const data = { refCode };

      try {
         const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/wallets`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
            credentials: "include",
         });

         const resData = await res.json();
         if (resData.ok) {
            toast(resData.message, { duration: 1500 });
            getUser();
         } else {
            toast.error(`${t("toastError")}`, {
               description: `${resData.message}`,
            });
         }
      } catch (error) {
         console.error(error);
      }
   }
   return (
      <Card>
         <CardHeader>
            <CardTitle>{t("header")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
         </CardHeader>
         <CardContent className="space-y-2">
            <div className="flex items-center space-x-2">
               {user?.customer.hasRedeemedRefCode ? (
                  <div className="flex flex-col items-center max-sm:space-y-4 sm:flex-row sm:space-x-2">
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                           {t("code")}
                        </Label>
                        <Input
                           id="name"
                           placeholder={t("placeholderRedeemed")}
                           className="col-span-3"
                           value={refCode}
                           onChange={(e) => setRefCode(e.target.value)}
                           disabled
                        />
                     </div>
                     <Button className="max-sm:w-full" type="submit" disabled>
                        {t("redeem")}
                     </Button>
                  </div>
               ) : (
                  <div className="flex flex-col items-center gap-2 max-sm:space-y-4 sm:flex-row sm:space-x-2">
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                           {t("code")}
                        </Label>
                        <Input
                           id="name"
                           placeholder={t("placeholder")}
                           className="col-span-3"
                           value={refCode}
                           onChange={(e) => setRefCode(e.target.value)}
                        />
                     </div>
                     <Button className="max-sm:w-full" type="submit" onClick={handleSubmit}>
                        {t("redeem")}
                     </Button>
                  </div>
               )}
            </div>
         </CardContent>
      </Card>
   );
}
