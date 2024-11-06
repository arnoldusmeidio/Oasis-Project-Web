"use client";
import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { useUserStore } from "@/stores/useUserStore";
import { useState, useEffect } from "react";
import { currency } from "@/helpers/currency";
import { useTranslations } from "next-intl";
import useCurrencyStore from "@/stores/useCurrencyStore";
import { WalletTypes } from "@/types/wallet";

export default function WalletCard() {
   const { user } = useUserStore();
   const [currencyLoading, setCurrencyLoading] = useState(true);
   const { currencyRate, error, getCurrencyRate } = useCurrencyStore();
   const t = useTranslations("UserProfile.Wallet");

   useEffect(() => {
      if (user?.currency && user.currency != "IDR") {
         getCurrencyRate();
         setCurrencyLoading(false);
      } else {
         setCurrencyLoading(false);
      }
   }, [user?.currency, getCurrencyRate]);

   return (
      <Dialog>
         <DialogTrigger asChild>
            <Button type="button" variant={"default"} size={"sm"} className="w-full">
               {t("trigger")}
            </Button>
         </DialogTrigger>
         <DialogContent className="w-[300px] sm:w-[375px]">
            <DialogHeader>
               <DialogTitle>{t("header")}</DialogTitle>
               <DialogDescription></DialogDescription>
            </DialogHeader>
            {user?.customer && (
               <div className="flex items-center space-x-2">
                  {!currencyLoading && (
                     <div className="flex items-center justify-center gap-4 sm:flex-col sm:items-start">
                        <div className="space-y-1">
                           <p className="text-muted-foreground text-sm">{t("balance")}</p>
                           <p className="text-sm font-medium leading-none">
                              {!currencyRate
                                 ? currency(user?.wallet.balance, "IDR", 1)
                                 : currency(user?.wallet?.balance, user?.currency, currencyRate)}
                           </p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-muted-foreground text-sm">{t("points")}</p>
                           <p className="text-sm font-medium leading-none">
                              {!currencyRate
                                 ? currency(user?.wallet.points, "IDR", 1)
                                 : currency(user?.wallet?.points, user?.currency, currencyRate)}
                           </p>
                        </div>
                     </div>
                  )}
               </div>
            )}
            <DialogFooter className="sm:justify-end">
               <DialogClose asChild>
                  <Button type="button" variant="secondary">
                     {t("close")}
                  </Button>
               </DialogClose>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}
