// "use client";

import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

interface BackButtonProps {
   href: string | undefined;
   label: string | undefined;
}

export default function BackButton({ href, label }: BackButtonProps) {
   return (
      <Button className="w-full font-normal" variant={"link"} size={"sm"} asChild>
         {href && <Link href={href}>{label}</Link>}
      </Button>
   );
}
