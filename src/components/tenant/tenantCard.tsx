import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import React, { Children } from "react";
import { Link } from "@/i18n/routing";

interface Props {
   img: string;
   propertyName: string;
   children: React.ReactNode;
   link: string;
}

export default function TenantCard({ img, propertyName, children, link }: Props) {
   return (
      <div className="transform cursor-pointer gap-4 transition duration-300 ease-out hover:scale-105">
         <div className="h-auto max-h-96 w-auto max-w-96 sm:max-h-80 sm:max-w-80">
            <Link href={link}>
               <AspectRatio ratio={1 / 1}>
                  <Image
                     className="rounded-lg object-cover"
                     src={img}
                     alt={propertyName}
                     loading="lazy"
                     fill
                     sizes="max-width: 348px"
                  />
               </AspectRatio>
            </Link>
         </div>
         <div className="mb-2 flex flex-col gap-2">
            <h3 className="mt-3 w-fit text-lg font-semibold">{propertyName}</h3>
         </div>
         <div>{children}</div>
      </div>
   );
}
