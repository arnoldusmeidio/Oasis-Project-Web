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
import { User } from "@/types/user-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import useCurrencyStore from "@/stores/useCurrencyStore";
import { useUserStore } from "@/stores/useUserStore";
import { currency } from "@/helpers/currency";

type CardProps = React.ComponentProps<typeof Card>;

const FormSchema = z.object({
   usePoints: z.boolean().default(false),
});

export default function DigitalPaymentCard({ className, ...props }: CardProps) {
   const router = useRouter();
   const params = useParams();
   const bookingNumber = params.slug;

   const { currencyRate, getCurrencyRate } = useCurrencyStore();
   const { user } = useUserStore();
   const [currencyLoading, setCurrencyLoading] = useState(true);

   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | undefined>("");
   const [success, setSuccess] = useState<string | undefined>("");
   const [bookingData, setBookingData] = useState<Booking>();
   const [userData, setUserData] = useState<User>();

   const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
         usePoints: false,
      },
   });

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

   const userGetter = async () => {
      try {
         const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/users`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
         });

         const resData = await res.json();
         if (resData.ok) {
            setUserData(resData.data);
         }
         setIsLoading(false);
      } catch (error) {
         console.error(error);
      }
   };

   useEffect(() => {
      userGetter();
      if (user?.currency && user.currency != "IDR") {
         setCurrencyLoading(true);
         getCurrencyRate();
         setCurrencyLoading(false);
      } else {
         setCurrencyLoading(false);
      }
   }, [user?.currency, getCurrencyRate]);

   async function onSubmit(value: z.infer<typeof FormSchema>) {
      try {
         const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/payments/digital/${bookingNumber}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(value),
         });

         const data = await res.json();
         if (!data.ok) {
            setSuccess("");
            setError(data.message);
            toast.error(data.message, { duration: 1500 });
            router.push("../");
         } else {
            setError("");
            setSuccess(data.message);

            form.reset();
            toast(data.message, { duration: 1500 });
            router.push("../");
         }
      } catch (error) {
         console.error(error);
      }
   }

   return (
      <Card className={cn("w-[380px]", className)} {...props}>
         <CardHeader>
            <CardTitle>Pay With Oasis Wallet</CardTitle>
            <CardDescription>Your Digital Wallet</CardDescription>
         </CardHeader>
         <CardContent className="grid gap-4">
            <div>
               <div className="grid-cols mb-4 grid items-start pb-4 last:mb-0 last:pb-0">
                  <div className="space-y-1">
                     <p className="text-sm font-medium leading-none">• Balance:</p>
                     <p className="text-muted-foreground text-sm">
                        {currencyLoading || !userData || !bookingData || isLoading
                           ? "Loading..."
                           : !currencyRate
                             ? currency(userData?.wallet.balance, "IDR", 1)
                             : currency(userData?.wallet.balance, user?.currency, currencyRate)}
                     </p>
                     <p className="text-sm font-medium leading-none">• Points:</p>
                     <p className="text-muted-foreground text-sm">
                        {currencyLoading || !userData || !bookingData || isLoading
                           ? "Loading..."
                           : !currencyRate
                             ? currency(userData?.wallet.points, "IDR", 1)
                             : currency(userData?.wallet.points, user?.currency, currencyRate)}
                     </p>
                     <p className="text-sm font-medium leading-none">• Total Price</p>
                     <p className="text-muted-foreground text-sm">
                        {currencyLoading || !bookingData || isLoading
                           ? "Loading..."
                           : !currencyRate
                             ? currency(bookingData?.amountToPay, "IDR", 1)
                             : currency(bookingData?.amountToPay, user?.currency, currencyRate)}
                     </p>
                     <p className="text-sm font-medium leading-none">• Booking Details</p>
                     <p className="text-muted-foreground text-sm">Booking Number: {bookingData?.bookingNumber}</p>
                     <p className="text-muted-foreground text-sm">{bookingData?.room.property.name}</p>
                     <p className="text-muted-foreground text-sm">{bookingData?.room.type}</p>
                     <p className="text-muted-foreground text-sm">
                        {" "}
                        {bookingData
                           ? bookingData.startDate === bookingData.endDate
                              ? `${format(bookingData.startDate, "LLL dd, y")}`
                              : `${format(bookingData.startDate, "LLL dd, y")} - ${format(bookingData.endDate, "LLL dd, y")}`
                           : ""}
                     </p>
                  </div>
               </div>
            </div>
            <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                  <div>
                     <h3 className="mb-4 text-lg font-medium">Digital Wallet Payment</h3>
                     <div className="space-y-4">
                        <FormField
                           control={form.control}
                           name="usePoints"
                           render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                 <div className="space-y-0.5">
                                    <FormLabel className="text-base">Use Points</FormLabel>
                                    <FormDescription>NOTE: Remaining points will be stored.</FormDescription>
                                 </div>
                                 <FormControl>
                                    <Switch
                                       checked={field.value}
                                       onCheckedChange={field.onChange}
                                       disabled={
                                          userData && bookingData
                                             ? userData?.wallet.points === 0
                                                ? true
                                                : false
                                             : false
                                       }
                                    />
                                 </FormControl>
                              </FormItem>
                           )}
                        />
                     </div>
                  </div>
                  <Button
                     type="submit"
                     className="w-full"
                     disabled={bookingData?.paymentStatus !== "PENDING" ? true : false}
                  >
                     Submit
                  </Button>
               </form>
            </Form>
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
