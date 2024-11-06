// "use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

interface RoleCard {
   roleType: string;
   description: string;
   roleImageUrl: string;
}

export default function RoleSelectionCard({ roleType, description, roleImageUrl }: RoleCard) {
   return (
      <Card className="w-full px-3 py-5 shadow-md">
         <CardContent className="flex flex-row items-center justify-center gap-5 pl-8">
            <Image src={roleImageUrl} alt="Role Image" height={0} width={0} className="h-[150px] w-auto" />
            <div className="grid h-[150px] grid-cols-1 content-around">
               <div className="font-montserrat text-lg font-bold">{roleType}</div>
               <div className="font-montserrat leading-5">{description}</div>
            </div>
         </CardContent>
      </Card>
   );
}
