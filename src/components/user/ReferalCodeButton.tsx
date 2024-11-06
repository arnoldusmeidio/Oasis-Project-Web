import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Copy } from "lucide-react";
import { useUserStore } from "@/stores/useUserStore";
import { FaSquareWhatsapp } from "react-icons/fa6";
import { Link } from "@/i18n/routing";

interface Props {
   getUser: () => void;
}

export default function RefCodeButton({ getUser }: Props) {
   const { user } = useUserStore();
   return (
      <Dialog>
         <DialogTrigger asChild>
            <Button type="button" variant={"secondary"} size={"sm"}>
               Referal Code
            </Button>
         </DialogTrigger>
         <DialogContent className="w-[375px]">
            <DialogHeader>
               <DialogTitle>Your Referal Code</DialogTitle>
               <DialogDescription>Share your code to friends to redeem points.</DialogDescription>
            </DialogHeader>
            <div className="flex items-center space-x-2">
               <div className="grid flex-1 gap-2">
                  <Label htmlFor="link" className="sr-only">
                     Referal Code
                  </Label>
                  <Input id="link" defaultValue={user?.customer?.refCode} readOnly />
               </div>
               <Button type="submit" size="sm" className="px-3">
                  <span className="sr-only">Copy</span>
                  <Copy className="h-4 w-4" />
               </Button>
               <Link
                  href={`https://api.whatsapp.com/send?text=Redeem my code on Oasis Resort! Code: *${user?.customer?.refCode}*`}
                  target="_blank"
               >
                  <FaSquareWhatsapp className="hover:bg-accent/90 hover:text-primary/90 h-[42px] w-[42px]" />
               </Link>
            </div>
            <DialogFooter className="sm:justify-start">
               <DialogClose asChild>
                  <Button type="button" variant="secondary">
                     Close
                  </Button>
               </DialogClose>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}
