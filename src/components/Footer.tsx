import Image from "next/image";
import { Link } from "@/i18n/routing";

import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaGoogle } from "react-icons/fa6";

export default function Footer() {
   return (
      <footer className="bg-secondary mt-auto flex content-center justify-center px-10 pt-4 sm:px-5 md:px-10">
         <div className="w-full max-w-[100rem]">
            <div className="grid grid-cols-1 md:grid-cols-2">
               <nav className="mx-auto pb-2 md:mx-0">
                  <Link href={"/"}>
                     <div className="flex justify-start gap-2 align-middle">
                        <Image
                           alt="OASIS logo"
                           className="h-[50px] w-auto cursor-pointer"
                           width={173}
                           height={50}
                           src={"/oasis-logo-with-text.svg"}
                        />
                     </div>
                  </Link>
               </nav>
               <nav className="mx-auto my-auto flex flex-col gap-5 pb-3 text-base capitalize sm:flex-row md:mx-0 md:ms-auto md:gap-7 md:pb-0">
                  <Link
                     href="/offers"
                     className="link link-hover hover:text-third mx-auto text-center underline-offset-2 transition-all ease-in hover:underline sm:text-start"
                  >
                     Offers
                  </Link>
                  <Link
                     href="/help"
                     className="link link-hover hover:text-third mx-auto text-center underline-offset-2 transition-all ease-in hover:underline sm:text-start"
                  >
                     Help
                  </Link>
               </nav>
            </div>
            <div className="bg-secondary grid grid-cols-1 items-center justify-between border-t py-3 md:grid-cols-2">
               <aside className="mx-auto grid-flow-col items-center text-center md:mx-0 md:justify-self-start">
                  <p>Copyright © 2024 OASIS - All right reserved</p>
               </aside>
               <nav className="mx-auto flex gap-4 text-xl md:mx-0 md:place-self-center md:justify-self-end">
                  <Link href="#" className="rounded-xl p-2">
                     <FaInstagram />
                  </Link>
                  <Link href="#" className="rounded-xl p-2 transition-all ease-in-out">
                     <FaXTwitter />
                  </Link>
                  <Link href="#" className="rounded-xl p-2">
                     <FaGoogle />
                  </Link>
               </nav>
            </div>
         </div>
      </footer>
   );
}
