"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useRouter } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { Booking } from "@/types/booking";
import { format } from "date-fns";
import { toast } from "sonner";

type CardProps = React.ComponentProps<typeof Card>;

export default function ReviewPaymentProof({ className, ...props }: CardProps) {
   const router = useRouter();
   const params = useParams();
   const bookingNumber = params.slug;

   const [isLoading, setIsLoading] = useState(true);
   const [orderData, setOrderData] = useState<Booking>();

   const eventGetter = async () => {
      try {
         const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/orders/${bookingNumber}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
         });

         const resData = await res.json();
         if (resData.ok) {
            setOrderData(resData.data);
         }
         setIsLoading(false);
      } catch (error) {
         console.error(error);
      }
   };
   useEffect(() => {
      eventGetter();
   }, []);

   return (
      <Card className={cn("w-[380px]", className)} {...props}>
         <CardHeader>
            <CardTitle>Review Payment</CardTitle>
            <CardDescription>Customer has submitted their payment proof.</CardDescription>
         </CardHeader>
         <CardContent className="grid gap-4">
            <div>
               <div className="grid-cols mb-4 grid items-start pb-4 last:mb-0 last:pb-0">
                  <div className="space-y-1">
                     <p className="text-sm font-medium leading-none">From:</p>
                     <p className="text-muted-foreground text-sm">{orderData?.customer.user.name}</p>
                     <p className="text-muted-foreground text-sm">{orderData?.customer.user.email}</p>
                     <p className="text-sm font-medium leading-none">For:</p>
                     <p className="text-muted-foreground text-sm">Booking Number: {orderData?.bookingNumber}</p>
                     <p className="text-muted-foreground text-sm">{orderData?.room.property.name}</p>
                     <p className="text-muted-foreground text-sm">{orderData?.room.type}</p>
                     <p className="text-muted-foreground text-sm">
                        {" "}
                        {orderData
                           ? orderData.startDate === orderData.endDate
                              ? `${format(orderData.startDate, "LLL dd, y")}`
                              : `${format(orderData.startDate, "LLL dd, y")} - ${format(orderData.endDate, "LLL dd, y")}`
                           : ""}
                     </p>
                     <Link href={orderData ? orderData?.pictureUrl : "/tenant/orders"} target="_blank">
                        <Button className="w-full" disabled={!orderData?.pictureUrl} variant={"link"}>
                           Review Payment Proof
                        </Button>
                     </Link>

                     <Button
                        className="w-full"
                        onClick={async () => {
                           try {
                              const res = await fetch(
                                 `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/orders/${bookingNumber}/1`,
                                 {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    credentials: "include",
                                 },
                              );
                              toast("Booking Successfully Approved", {
                                 duration: 1500,
                              });
                              router.push("../orders");
                           } catch (error) {
                              console.error(error);
                           }
                        }}
                        disabled={orderData?.paymentStatus !== "PROCESSING" ? true : false}
                     >
                        Approve
                     </Button>

                     <Button
                        className="w-full"
                        onClick={async () => {
                           try {
                              const res = await fetch(
                                 `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/orders/${bookingNumber}/0`,
                                 {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    credentials: "include",
                                 },
                              );
                              toast("Booking Successfully Rejected", {
                                 duration: 1500,
                              });
                              router.push("../orders");
                           } catch (error) {
                              console.error(error);
                           }
                        }}
                        disabled={orderData?.paymentStatus !== "PROCESSING" ? true : false}
                        variant={"outline"}
                     >
                        Reject
                     </Button>
                  </div>
               </div>
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
