import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import ChangeEmailForm from "@/components/auth/ChangeEmailForm";
import { useTranslations } from "next-intl";

export default function ChangeEmailButton() {
   const t = useTranslations("UserProfile.Email");

   return (
      <div>
         <Dialog>
            <DialogTrigger asChild>
               <Button type="button" variant={"secondary"} size={"sm"}>
                  {t("change")}
               </Button>
            </DialogTrigger>
            <DialogContent className="w-[300px] sm:w-[375px]">
               <DialogHeader>
                  <DialogTitle>{t("header")}</DialogTitle>
                  <DialogDescription>{t("description")}</DialogDescription>
               </DialogHeader>
               <ChangeEmailForm />
            </DialogContent>
         </Dialog>
      </div>
   );
}
