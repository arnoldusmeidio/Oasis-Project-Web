import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "./Header";
import BackButton from "./BackButton";
import Social from "@/components/auth/Social";

interface CardWrapperProps {
   children: React.ReactNode;
   headerLabel: string;
   backButtonLabel: string;
   backButtonHref: string;
   showSocial?: boolean;
   socialLabel?: string;
}

export default function Cards({
   children,
   headerLabel,
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

         <CardFooter>
            <BackButton href={backButtonHref} label={backButtonLabel} />
         </CardFooter>
      </Card>
   );
}
