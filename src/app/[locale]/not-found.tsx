"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { useUserStore } from "@/stores/useUserStore";

export default function NotFound() {
   const { user } = useUserStore();
   return (
      <main className="bg-background flex h-screen text-center">
         {/* Not Found */}
         <div className="m-auto flex w-full max-w-xl flex-col items-center gap-5 p-5 md:p-0">
            <figure className="flex items-center justify-center py-4 pr-4">
               <Image
                  className="h-[150px] w-auto md:h-[250px]"
                  src={"/question-mark.svg"}
                  alt="Illustration of a person questioning"
                  height={328}
                  width={216}
               />
            </figure>
            <h3 className="font-inter text-third mb-7 text-2xl font-semibold md:text-5xl">
               <span className="text-third">Sorry, but we don&apos;t have what you are looking for</span>
            </h3>
            <Link href={user?.tenant ? "/tenant" : "/"}>
               <Button className="w-[300px] text-sm md:text-base">Back to Home Page</Button>
            </Link>
         </div>
         {/* Not Found */}
      </main>
   );
}
