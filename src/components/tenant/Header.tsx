import Image from "next/image";
import Link from "next/link";

interface HeaderProps {
   label: string;
}

export default function Header({ label }: HeaderProps) {
   return (
      <div className="flex w-full flex-col items-center justify-center gap-y-4">
         <div className="flex flex-col items-center justify-center">
            <Link className="flex flex-col items-center justify-center" href={"/"}>
               <Image src="/OASIS LOGO only.svg" alt="OASIS logo" height={50} width={50} />
               <h1 className={"font-rokkitt text-5xl font-semibold text-[#1A61EF]"}>OASIS</h1>
            </Link>
            <h2 className={"font-rokkitt text-lg font-normal text-[#1A61EF]"}>Discover Hidden Havens</h2>
         </div>
         <p className="text-muted-foreground text-sm">{label}</p>
      </div>
   );
}
