"use client";

import Logo from "@/components/header/Logo";
import { Button } from "@/components/ui/button";
import { Menu, User } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserStore } from "@/stores/useUserStore";
import { Link } from "@/i18n/routing";
import LogoutButton from "@/components/auth/LogoutButton";
import LoginButton from "@/components/auth/LoginButton";
import RegisterButton from "@/components/auth/RegisterButton";
import { useTranslations } from "next-intl";

export default function Navbar() {
   const t = useTranslations("Layout.Navigation");
   const { user } = useUserStore();

   return (
      <header className="bg-main-theme w-full">
         <nav className="mx-auto flex max-w-[100rem] flex-col gap-4 p-3 shadow-sm sm:p-6">
            <div className="flex justify-between">
               {/* Left */}
               <div className="flex sm:basis-1/3">
                  <Logo />
               </div>

               {/* Middle tagline */}
               <div className="text-background hidden self-center font-bold sm:basis-1/3 md:flex md:justify-center">
                  <span className="font-rokkitt text-xl tracking-wide xl:text-2xl 2xl:text-3xl">{t("tagLine")}</span>
               </div>

               {/* Right */}
               {/* Desktop menu */}
               <div className="flex items-center justify-end gap-2 align-middle sm:basis-1/3">
                  {/* Burger menu */}
                  <Popover>
                     <PopoverTrigger asChild>
                        <Button variant="outline" className="flex justify-between gap-4 rounded-full py-7 pl-4 pr-2">
                           <Menu className="text-foreground h-6 w-6" />
                           <Avatar>
                              <AvatarImage src={user?.pictureUrl} alt="Profile picture" />
                              <AvatarFallback>
                                 <User />
                              </AvatarFallback>
                           </Avatar>
                        </Button>
                     </PopoverTrigger>

                     <PopoverContent className="mr-10 grid w-36 divide-y px-0 py-0">
                        {/* Conditinially render the button list */}
                        {user ? (
                           <>
                              <div>
                                 <Button variant={"ghost"} className="w-full justify-start" asChild>
                                    <Link href={"/user/profile"}>Profile</Link>
                                 </Button>
                                 <Button variant={"ghost"} className="w-full justify-start" asChild>
                                    <Link href={"/tenant/create-property"}>Create Property</Link>
                                 </Button>
                                 <Button variant={"ghost"} className="w-full justify-start" asChild>
                                    <Link href={"/tenant/orders"}>Check Orders</Link>
                                 </Button>
                              </div>
                              <div>
                                 <LogoutButton>
                                    <Button variant={"ghost"} className="w-full justify-start">
                                       Log out
                                    </Button>
                                 </LogoutButton>
                              </div>
                           </>
                        ) : (
                           <>
                              <div>
                                 <RegisterButton>
                                    <Button variant={"ghost"} className="w-full justify-start">
                                       {t("signUp")}
                                    </Button>
                                 </RegisterButton>
                                 <LoginButton>
                                    <Button variant={"ghost"} className="w-full justify-start">
                                       {t("logIn")}
                                    </Button>
                                 </LoginButton>
                              </div>
                           </>
                        )}
                     </PopoverContent>
                  </Popover>
               </div>
            </div>
         </nav>
      </header>
   );
}
