"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { Booking } from "@/types/booking";

type CardProps = React.ComponentProps<typeof Card>;

export default function BookingCheckout({ className, ...props }: CardProps) {
   const router = useRouter();
   const params = useParams();
   const bookingNumber = params.slug;

   const [isLoading, setIsLoading] = useState(true);
   const [bookingData, setBookingData] = useState<Booking>();

   //midtrans
   useEffect(() => {
      const myMidtransClientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
      const script = document.createElement("script");
      script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
      script.setAttribute("data-client-key", myMidtransClientKey as string);

      document.body.appendChild(script);

      return () => {
         document.body.removeChild(script);
      };
   }, []);

   const eventGetter = async () => {
      try {
         const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/bookings/${bookingNumber}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
         });

         const resData = await res.json();
         if (resData.ok) {
            setBookingData(resData.data);
         }
         setIsLoading(false);
      } catch (error) {
         console.error(error);
      }
   };
   useEffect(() => {
      eventGetter();
   }, []);

   const methods = [
      {
         title: "Manual Transfer",
         description: "Transfer to designated bank account. You are REQUIRED to upload payment proof.",
         function: () => {
            router.push(`../transfer/${bookingNumber}`);
         },
      },
      {
         title: "Oasis Wallet",
         description: "Pay using your digital wallet in OASIS website.",
         function: () => {
            router.push(`../digital/${bookingNumber}`);
         },
      },
      {
         title: "Payment Gateway",
         description: "Pay using midtrans.",
         function: async (ev: React.MouseEvent<HTMLButtonElement>) => {
            ev.preventDefault();
            try {
               const response = await fetch(
                  `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/payments/midtrans/${bookingNumber}`,
                  {
                     method: "POST",
                     headers: {
                        "Content-Type": "application/json",
                     },
                     credentials: "include",
                  },
               );
               const data = await response.json();

               router.push(data.data.transaction.redirect_url);
            } catch (error) {
               console.error(error);
            }
         },
      },
   ];

   return (
      <Card className={cn("w-[380px]", className)} {...props}>
         <CardHeader>
            <CardTitle>Checkout</CardTitle>
            <CardDescription>Please select the payment method.</CardDescription>
         </CardHeader>
         <CardContent className="grid gap-4">
            <div>
               {methods.map((method, index) => (
                  <div key={index} className="grid-cols mb-4 grid items-start pb-4 last:mb-0 last:pb-0">
                     <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">✓ {method.title}</p>
                        <p className="text-muted-foreground text-sm">{method.description}</p>
                        <Button
                           className="w-full"
                           onClick={method.function}
                           disabled={bookingData?.paymentStatus !== "PENDING" ? true : false}
                        >
                           Pay with {method.title}
                        </Button>
                     </div>
                  </div>
               ))}
            </div>
         </CardContent>
         <CardFooter>
            <Button
               className="w-full"
               variant={"link"}
               onClick={() => {
                  router.back();
               }}
            >
               Back
            </Button>
         </CardFooter>
      </Card>
   );
}
