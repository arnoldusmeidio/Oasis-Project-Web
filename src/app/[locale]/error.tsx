"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { useUserStore } from "@/stores/useUserStore";

export default function Error() {
   const { user } = useUserStore();
   return (
      <html>
         <body>
            <main className="bg-background flex h-screen text-center">
               {/* Error */}
               <div className="m-auto flex w-full max-w-xl flex-col items-center gap-5 p-5 md:p-0">
                  <figure className="flex items-center justify-center py-4">
                     <Image
                        className="h-[150px] w-auto md:h-[250px]"
                        src={"/illustration-confused.svg"}
                        alt="Illustration of a person confused"
                        height={328}
                        width={216}
                     />
                  </figure>
                  <h3 className="font-inter text-third mb-7 text-2xl font-semibold md:text-5xl">
                     <span className="text-third"> Uh oh.. Something went wrong. We are very sorry.</span>
                  </h3>
                  <Link href={user?.tenant ? "/tenant" : "/"}>
                     <Button className="w-[300px] text-sm md:text-base">Back to Home Page</Button>
                  </Link>
               </div>
               {/* Error */}
            </main>
         </body>
      </html>
   );
}
