import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import UpdateProfileForm from "@/components/user/UpdateProfileForm";
import EditProfilePictureButton from "@/components/user/EditProfilePictureButton";
import { useUserStore } from "@/stores/useUserStore";
import ChangeEmailButton from "@/components/user/ChangeEmailButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "lucide-react";
import RefCodeCard from "./RefCodeCard";
import RedeemCodeCard from "./RedeemCodeCard";
import WalletCard from "./WalletCard";
import { useTranslations } from "next-intl";

interface Props {
   getUser: () => void;
}

export default function UserCard({ getUser }: Props) {
   const { user } = useUserStore();
   const t = useTranslations("UserProfile");

   return (
      <Card>
         <CardHeader>
            <span className="text-2xl font-bold">{t("title")}</span>
         </CardHeader>
         <CardContent className="flex flex-col">
            <div className="flex flex-col gap-4 xl:flex-row xl:justify-center xl:gap-10">
               <div className="flex flex-col items-center gap-2 self-center">
                  <Avatar className="h-20 w-20 sm:h-32 sm:w-32">
                     <AvatarImage src={user?.pictureUrl} alt="Profile picture" />
                     <AvatarFallback>
                        <User className="h-10 w-10 lg:h-14 lg:w-14" />
                     </AvatarFallback>
                  </Avatar>
                  {user?.accountProvider === "CREDENTIALS" && <EditProfilePictureButton getUser={getUser} />}
               </div>
               {user?.customer && (
                  <div>
                     <div className="flex items-center justify-center gap-4 py-4 sm:flex-col sm:items-start">
                        <Tabs defaultValue="refcode" className="w-full min-w-[300px] xl:w-[450px]">
                           <TabsList>
                              <TabsTrigger value="refcode">{t("ReferralCode.title")}</TabsTrigger>
                              <TabsTrigger value="redeem">{t("RedeemCode.title")}</TabsTrigger>
                           </TabsList>
                           <TabsContent value="refcode">
                              <RefCodeCard getUser={getUser} />
                           </TabsContent>
                           <TabsContent value="redeem">
                              <RedeemCodeCard getUser={getUser} />
                           </TabsContent>
                        </Tabs>
                     </div>
                     <WalletCard />
                  </div>
               )}
            </div>

            <div className="mt-6 flex items-end justify-between gap-2">
               <div className="w-full space-y-2">
                  <Label>{t("Email.email")}</Label>
                  <Input placeholder={user?.email || "example@mail.com"} type="email" disabled={true} />
               </div>
               {user?.accountProvider === "CREDENTIALS" && <ChangeEmailButton />}
            </div>

            <hr className="bg-foreground/50 my-6 h-[2px] border-0" />

            <UpdateProfileForm getUser={getUser} />
         </CardContent>
      </Card>
   );
}
