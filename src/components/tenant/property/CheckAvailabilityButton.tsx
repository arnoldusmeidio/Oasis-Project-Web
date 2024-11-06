"use client";
import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import DatePickerForm from "@/components/book/DatePickerRange";
import { useUserStore } from "@/stores/useUserStore";
import Image from "next/image";
import { Link } from "@/i18n/routing";

export default function CheckAvailabilityButton({
   roomId,
   propertyName,
   roomType,
   currencyRate,
}: {
   roomId: string;
   propertyName: string;
   roomType: string;
   currencyRate: number | null;
}) {
   const { user } = useUserStore();

   return (
      <Dialog>
         <DialogTrigger asChild>
            <Button
               type="button"
               variant={"default"}
               size={"sm"}
               className="bg-blue-600 px-4 py-2 text-white hover:bg-blue-600"
            >
               Check Availability
            </Button>
         </DialogTrigger>
         <DialogContent className="h-[400px] w-[350px] sm:w-[375px]">
            <DialogHeader className="text-left">
               <DialogTitle>{user ? "Select Booking Dates" : "Please Log in to Continue"}</DialogTitle>

               <DialogDescription className="flex flex-col gap-1">
                  {user ? (
                     <>
                        <span>Property Name: {propertyName}</span>
                        <span>Room Type: {roomType}</span>
                     </>
                  ) : (
                     <span>You need to log in first in order to continue the booking process</span>
                  )}
               </DialogDescription>
            </DialogHeader>
            {user ? (
               <DatePickerForm roomId={roomId} currencyRate={currencyRate} />
            ) : (
               <div className="-mt-6 flex flex-col items-center justify-between">
                  <figure className="bg-main-theme flex w-[180px] items-center justify-center overflow-hidden rounded-full py-4">
                     <Image
                        className="h-[150px] w-auto"
                        src={"/illustration-login.svg"}
                        alt="Illustration of a person loggging in"
                        height={328}
                        width={216}
                     />
                  </figure>
                  <Link href={"/login"} className="w-full">
                     <Button type="button" className="w-full">
                        Log in
                     </Button>
                  </Link>
               </div>
            )}
         </DialogContent>
      </Dialog>
   );
}
