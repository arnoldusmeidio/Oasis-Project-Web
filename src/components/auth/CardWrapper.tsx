// "use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import BackButton from "@/components/auth/BackButton";
import Header from "@/components/auth/Header";
import Social from "@/components/auth/Social";

interface CardWrapperProps {
   children: React.ReactNode;
   headerLabel: string;
   showBackButton?: boolean;
   backButtonLabel?: string;
   backButtonHref?: string;
   showSocial?: boolean;
   socialLabel?: string;
}

export default function CardWrapper({
   children,
   headerLabel,
   showBackButton,
   backButtonLabel,
   backButtonHref,
   showSocial,
   socialLabel,
}: CardWrapperProps) {
   return (
      <Card className="w-full shadow-md">
         <CardHeader>
            <Header label={headerLabel} />
         </CardHeader>
         <CardContent>{children}</CardContent>
         {showSocial && (
            <CardFooter className="flex flex-col">
               <div className="mb-4 flex w-full items-center justify-between gap-2">
                  <div className="w-full border-[1px] border-slate-300"></div>
                  <div>or</div>
                  <div className="w-full border-[1px] border-slate-300"></div>
               </div>
               <Social label={socialLabel} />
            </CardFooter>
         )}

         {showBackButton && (
            <CardFooter>
               <BackButton href={backButtonHref} label={backButtonLabel} />
            </CardFooter>
         )}
      </Card>
   );
}
