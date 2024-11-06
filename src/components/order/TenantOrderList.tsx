"use client";

import React from "react";
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
import { Property } from "@/types/property-types";

interface Props {
   eventGetter: () => void;
   orderData: Property[];
}

export default function OrderList({ eventGetter, orderData }: Props) {
   return (
      <>
         <Accordion type="single" collapsible>
            {(orderData as any)?.map((property: Property, index: number) => (
               <div key={property.id}>
                  {/* <h1 className="font-bold">{e.name}</h1> */}
                  {(property as Property)?.room.map((room: any, index: number) => (
                     <div key={room.id}>
                        {/* <h2>{ev.type}</h2> */}
                        {(room as any)?.bookings.map((booking: Booking, index: number) => (
                           <AccordionItem value={booking.id} key={booking.id}>
                              <AccordionTrigger>
                                 <div className="grid grid-cols-1 sm:grid-cols-2">
                                    <div>Booking Number</div>
                                    <div>
                                       <h6 className="font-bold"> {booking.bookingNumber}</h6>
                                    </div>
                                 </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                 <Card className="w-full shadow-md">
                                    <CardHeader>
                                       <CardTitle>Info</CardTitle>
                                       <CardDescription>
                                          {booking.startDate === booking.endDate
                                             ? `${format(booking.startDate, "LLL dd, y")}`
                                             : `${format(booking.startDate, "LLL dd, y")} - ${format(booking.endDate, "LLL dd, y")}`}
                                       </CardDescription>
                                    </CardHeader>
                                    <CardContent className="grid gap-4">
                                       <div>
                                          <div className="grid-cols mb-4 grid items-start pb-4 last:mb-0 last:pb-0">
                                             <div className="space-y-1">
                                                <p className="text-sm font-medium leading-none">〒 {property.name}</p>
                                                <p className="text-muted-foreground text-sm">{property.description}</p>
                                                <p className="text-muted-foreground text-sm">
                                                   {property.address}, {property.city}
                                                </p>
                                             </div>
                                          </div>
                                       </div>
                                       <div>
                                          <div className="grid-cols mb-4 grid items-start pb-4 last:mb-0 last:pb-0">
                                             <div className="space-y-1">
                                                <p className="text-sm font-medium leading-none">✓ {room.type}</p>
                                                <p className="text-muted-foreground text-sm">{room.description}</p>
                                             </div>
                                          </div>
                                       </div>
                                       <div className="flex items-center space-x-4 rounded-md border p-4">
                                          <div className="flex-1 space-y-1">
                                             <p className="text-sm font-medium leading-none">Payment Status:</p>
                                             <p className="text-muted-foreground text-sm">{booking.paymentStatus}</p>
                                          </div>
                                       </div>
                                    </CardContent>
                                    <CardFooter className="flex gap-4">
                                       <CardFooter className="flex gap-4">
                                          {booking.paymentStatus == "PROCESSING" ||
                                          booking.paymentStatus == "APPROVED" ? (
                                             <Link href={`/tenant/orders/${booking.bookingNumber}`}>
                                                <Button className="w-full">Review Payment Proof</Button>
                                             </Link>
                                          ) : (
                                             ""
                                          )}
                                          {booking.paymentStatus == "PENDING" ? (
                                             <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                   <Button>Reject Booking</Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                   <AlertDialogHeader>
                                                      <AlertDialogTitle>Reject their booking?</AlertDialogTitle>
                                                      <AlertDialogDescription>
                                                         Process cannot be UNDONE. Are you sure?
                                                      </AlertDialogDescription>
                                                   </AlertDialogHeader>
                                                   <AlertDialogFooter>
                                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                      <AlertDialogAction
                                                         onClick={async () => {
                                                            try {
                                                               const res = await fetch(
                                                                  `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/orders/${booking.bookingNumber}`,
                                                                  {
                                                                     method: "DELETE",
                                                                     headers: { "Content-Type": "application/json" },
                                                                     credentials: "include",
                                                                  },
                                                               );
                                                               toast("Booking Successfully Rejected", {
                                                                  duration: 1500,
                                                               });
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
                                    </CardFooter>
                                 </Card>
                              </AccordionContent>
                           </AccordionItem>
                        ))}
                     </div>
                  ))}
               </div>
            ))}
         </Accordion>
      </>
   );
}
