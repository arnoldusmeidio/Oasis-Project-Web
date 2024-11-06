import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import ChangeProfilePictureForm from "@/components/user/ChangeProfilePictureForm";
import { useTranslations } from "next-intl";

interface Props {
   getUser: () => void;
}

export default function EditProfilePictureButton({ getUser }: Props) {
   const t = useTranslations("UserProfile.ProfilePicture");

   return (
      <Dialog>
         <DialogTrigger asChild>
            <Button type="button" variant={"secondary"} size={"sm"}>
               {t("edit")}
            </Button>
         </DialogTrigger>
         <DialogContent className="w-[300px] sm:w-[375px]">
            <DialogHeader>
               <DialogTitle>{t("header")}</DialogTitle>
               <DialogDescription>{t("description")}</DialogDescription>
            </DialogHeader>
            <ChangeProfilePictureForm getUser={getUser} />
         </DialogContent>
      </Dialog>
   );
}
