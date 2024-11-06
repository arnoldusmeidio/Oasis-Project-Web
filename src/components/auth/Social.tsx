// "use client";

import { FcGoogle } from "react-icons/fc";

import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/routing";

interface LabelProps {
   label: string | undefined;
}

export default function Social({ label }: LabelProps) {
   const router = useRouter();
   const onClick = () => {
      router.push(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/auth/google`);
   };

   return (
      <div className="flex w-full items-center">
         <Button className="w-full gap-2" size={"lg"} variant={"outline"} onClick={onClick}>
            <span>{label}</span>
            <FcGoogle className="h-5 w-5" />
         </Button>
      </div>
   );
}
