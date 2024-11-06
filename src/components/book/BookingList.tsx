"use client";

import React, { useEffect, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { format } from "date-fns";
import { Booking } from "@/types/booking";
import { Button, buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { currency } from "@/helpers/currency";
import { useUserStore } from "@/stores/useUserStore";
import useCurrencyStore from "@/stores/useCurrencyStore";

interface Props {
   eventGetter: () => void;
   bookingData: Booking[];
}

export default function BookingList({ eventGetter, bookingData }: Props) {
   const { currencyRate, error, getCurrencyRate } = useCurrencyStore();
   const { user } = useUserStore();
   const [currencyLoading, setCurrencyLoading] = useState(true);

   useEffect(() => {
      if (user?.currency && user.currency != "IDR") {
         setCurrencyLoading(true);
         getCurrencyRate();
         setCurrencyLoading(false);
      } else {
         setCurrencyLoading(false);
      }
   }, [user?.currency, getCurrencyRate]);

   return (
      <>
         <Accordion type="single" collapsible>
            {(bookingData as any)?.map((e: Booking, index: number) => (
               <AccordionItem value={e.id} key={e.id}>
                  <AccordionTrigger>
                     <div className="grid grid-cols-1 sm:grid-cols-2">
                        <div>Booking Number:</div>
                        <div>
                           <h6 className="font-bold"> {e.bookingNumber}</h6>
                        </div>
                     </div>
                  </AccordionTrigger>
                  <AccordionContent>
                     <Card className="w-full shadow-md">
                        <CardHeader>
                           <CardTitle>Booking Info</CardTitle>
                           <CardDescription>
                              {e.startDate === e.endDate
                                 ? `${format(e.startDate, "LLL dd, y")}`
                                 : `${format(e.startDate, "LLL dd, y")} - ${format(e.endDate, "LLL dd, y")}`}
                           </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                           <div>
                              <div className="grid-cols mb-4 grid items-start pb-4 last:mb-0 last:pb-0">
                                 <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">〒 {e.room.property.name}</p>
                                    <p className="text-muted-foreground text-sm">{e.room.property.description}</p>
                                    <p className="text-muted-foreground text-sm">
                                       {e.room.property.address}, {e.room.property.city}
                                    </p>
                                 </div>
                              </div>
                           </div>
                           <div>
                              <div className="grid-cols mb-4 grid items-start pb-4 last:mb-0 last:pb-0">
                                 <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">✓ {e.room.type}</p>
                                    <p className="text-muted-foreground text-sm">{e.room.description}</p>
                                 </div>
                              </div>
                           </div>
                           <div className="flex items-center space-x-4 rounded-md border p-4">
                              <div className="flex-1 space-y-1">
                                 <p className="text-sm font-medium leading-none">Payment Status:</p>
                                 <p className="text-muted-foreground text-sm">{e.paymentStatus}</p>
                              </div>

                              <div className="flex-1 space-y-1">
                                 <p className="text-sm font-medium leading-none">Total Price:</p>
                                 <p className="text-muted-foreground text-sm">
                                    {currencyLoading
                                       ? "Loading..."
                                       : !currencyRate
                                         ? currency(e.amountToPay, "IDR", 1)
                                         : currency(e.amountToPay, user?.currency, currencyRate)}
                                 </p>
                              </div>
                           </div>
                        </CardContent>
                        <CardFooter className="flex gap-4">
                           {e.paymentStatus == "PENDING" ? (
                              <Link href={`bookings/checkout/${e.bookingNumber}`}>
                                 <Button className="w-full">Pay Now</Button>
                              </Link>
                           ) : e.paymentStatus == "APPROVED" ? (
                              <Button
                                 className="w-full"
                                 onClick={async () => {
                                    try {
                                       const res = await fetch(
                                          `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/payments/confirm/${e.bookingNumber}`,
                                          {
                                             method: "POST",
                                             headers: { "Content-Type": "application/json" },
                                             credentials: "include",
                                          },
                                       );
                                       toast("Booking Successfully Confirmed", { duration: 1500 });
                                       eventGetter();
                                    } catch (error) {
                                       toast.error("Something went wrong.", { duration: 1500 });
                                       console.error(error);
                                    }
                                 }}
                              >
                                 Confirm Booking
                              </Button>
                           ) : e.paymentStatus === "COMPLETED" ||
                             (e.paymentStatus === "PAID" && new Date(e.endDate) < new Date(Date.now())) ? (
                              <Link href={`/user/review/${e.bookingNumber}`}>
                                 <Button className="w-full">Write Review</Button>
                              </Link>
                           ) : (
                              ""
                           )}
                           {e.paymentStatus == "PENDING" ? (
                              <AlertDialog>
                                 <AlertDialogTrigger asChild>
                                    <Button variant="outline">Cancel Booking</Button>
                                 </AlertDialogTrigger>
                                 <AlertDialogContent>
                                    <AlertDialogHeader>
                                       <AlertDialogTitle>Cancel your booking?</AlertDialogTitle>
                                       <AlertDialogDescription>
                                          By confirming cancellation, all associated reservations will be released.
                                          Please review our policies regarding cancellations carefully.
                                       </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                       <AlertDialogCancel>Cancel</AlertDialogCancel>
                                       <AlertDialogAction
                                          onClick={async () => {
                                             try {
                                                const res = await fetch(
                                                   `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/bookings/${e.bookingNumber}`,
                                                   {
                                                      method: "DELETE",
                                                      headers: { "Content-Type": "application/json" },
                                                      credentials: "include",
                                                   },
                                                );
                                                toast("Booking Successfully Cancelled", { duration: 1500 });
                                                eventGetter();
                                             } catch (error) {
                                                console.error(error);
                                             }
                                          }}
                                       >
                                          Continue
                                       </AlertDialogAction>
                                    </AlertDialogFooter>
                                 </AlertDialogContent>
                              </AlertDialog>
                           ) : (
                              ""
                           )}
                        </CardFooter>
                     </Card>
                  </AccordionContent>
               </AccordionItem>
            ))}
         </Accordion>
      </>
   );
}
