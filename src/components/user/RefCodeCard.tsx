"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useUserStore } from "@/stores/useUserStore";
import { FaSquareWhatsapp } from "react-icons/fa6";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface Props {
   getUser: () => void;
}

export default function RefCodeCard({ getUser }: Props) {
   const { user } = useUserStore();
   const t = useTranslations("UserProfile.ReferralCode");
   const myRefCode = user?.customer?.refCode || "";

   const handleCopyClick = async () => {
      try {
         await window.navigator.clipboard.writeText(myRefCode);
         toast(`${t("toastSuccess")}`);
      } catch (err) {
         console.error("Unable to copy to clipboard.", err);
         toast.error(`${t("toastError")}`);
      }
   };

   return (
      <Card>
         <CardHeader>
            <CardTitle>{t("header")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
         </CardHeader>
         <CardContent className="space-y-2">
            <div className="flex items-center space-x-2">
               <div className="grid flex-1 gap-2">
                  <Label htmlFor="link" className="sr-only">
                     Referral Code
                  </Label>
                  <Input id="link" defaultValue={user?.customer?.refCode} readOnly />
               </div>
               <Button type="submit" size="sm" className="px-3" onClick={handleCopyClick}>
                  <span className="sr-only">Copy</span>
                  <Copy className="h-4 w-4" />
               </Button>
               <Link
                  href={`https://api.whatsapp.com/send?text=Redeem my code on Oasis Resort! Code: *${user?.customer?.refCode}*`}
                  target="_blank"
               >
                  <FaSquareWhatsapp className="hover:bg-accent/90 hover:text-primary/90 h-[42px] w-[42px]" />
               </Link>
            </div>
         </CardContent>
      </Card>
   );
}
