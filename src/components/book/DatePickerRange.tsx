"use client";

import * as z from "zod";
import { addDays, differenceInCalendarDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import React, { useEffect, useState } from "react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useRouter } from "@/i18n/routing";
import { RoomStatus } from "@/types/room-status";
import { checkRoomBooking } from "@/helpers/check-room-booking";
import { checkRoomPrice } from "@/helpers/check-room-price";
import { useUserStore } from "@/stores/useUserStore";
import { currency } from "@/helpers/currency";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookDateSchema, FormTypeBookDate } from "@/schemas/booking-schema";
import DatePickerError from "@/components/book/DatePickerError";

interface DatePickerFormProps extends React.HTMLAttributes<HTMLDivElement> {
   roomId: string;
   currencyRate: number | null;
}

export default function DatePickerForm({ className, roomId, currencyRate }: DatePickerFormProps) {
   const { user } = useUserStore();
   const form = useForm<z.infer<typeof bookDateSchema>>({
      resolver: zodResolver(bookDateSchema),
      mode: "onBlur",
   });

   const {
      setValue,
      formState: { isSubmitting },
   } = form;

   const [totalPrice, setTotalPrice] = useState<number>(0);
   const [totalNights, setTotalNights] = useState<number>(0);
   const [error, setError] = useState<string | undefined>("");

   const [roomStatus, setRoomStatus] = useState<RoomStatus>();
   const [numberOfMonths, setNumberOfMonths] = useState<number>(2);

   const router = useRouter();

   const onSubmit: SubmitHandler<FormTypeBookDate> = async (values) => {
      try {
         if (!values) {
            setError("Please select the booking dates");
            return;
         } else if (!values.date?.to || !values.date?.from) {
            setError("Please select the check in and check out dates");
            return;
         }

         setError("");
         const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/bookings/${roomId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
            credentials: "include",
         });

         if (!res.ok) {
            toast.error("Unable to book", { duration: 1500 });
         } else {
            toast("Booking Successfully Created", { duration: 1500 });
            router.push("/user/bookings");
         }
      } catch (error) {
         console.error(error);
      }
   };

   useEffect(() => {
      // Custom hook to handle resizing and adjust the number of months displayed in the calendar

      function handleResize() {
         setNumberOfMonths(window.innerWidth < 768 ? 1 : 2);
      }

      handleResize();

      window.addEventListener("resize", handleResize);
      handleResize(); // Call immediately to set initial value

      return () => window.removeEventListener("resize", handleResize);
   }, []);

   useEffect(() => {
      async function fetchPrices() {
         const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/bookings/${roomId}/status`, {
            method: "GET",
            credentials: "include",
         });
         const data = await response.json();

         setRoomStatus(data.data);
      }

      fetchPrices();
   }, [roomId]);

   function handleSelect(selectedDate: any) {
      if (selectedDate) {
         const { from, to } = selectedDate;

         if (from && to && from.getTime() === to.getTime()) {
            setValue("date", undefined);
            setTotalPrice(0);
            setTotalNights(0);
            return;
         }

         if (from && to) {
            const selectedDatesArray: Date[] = [];
            let currentDate = from;
            let sum = 0;

            const nights = differenceInCalendarDays(to, from);
            setTotalNights(nights);

            while (currentDate < to) {
               selectedDatesArray.push(currentDate);
               sum += checkRoomPrice(currentDate, roomStatus) || 0;
               currentDate = addDays(currentDate, 1);
            }

            const isBooked = selectedDatesArray.some((date) => checkRoomBooking(date, roomStatus));

            if (isBooked) {
               setValue("date", { from: to, to: undefined });
               setTotalPrice(0);
               setTotalNights(0);
               return;
            }
            setTotalPrice(sum);
         }

         setValue("date", selectedDate);
      } else {
         setValue("date", undefined);
         setTotalPrice(0);
      }
   }

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className={cn("grid gap-6", className)}>
               <DatePickerError message={error} />
               <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                     <FormItem className="relative">
                        <Popover>
                           <PopoverTrigger asChild>
                              <FormControl>
                                 <Button
                                    id="date"
                                    variant={"outline"}
                                    className={cn(
                                       "w-full justify-start text-left font-normal",
                                       !field && "text-muted-foreground",
                                    )}
                                 >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field?.value?.from ? (
                                       field.value?.to ? (
                                          <>
                                             {format(field.value.from, "LLL dd, y")} -{" "}
                                             {format(field.value.to, "LLL dd, y")}
                                          </>
                                       ) : (
                                          format(field.value.from, "LLL dd, y")
                                       )
                                    ) : (
                                       <span>Select your dates</span>
                                    )}
                                 </Button>
                              </FormControl>
                           </PopoverTrigger>
                           <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                 mode="range"
                                 defaultMonth={field?.value?.from}
                                 selected={field?.value}
                                 onSelect={handleSelect}
                                 numberOfMonths={numberOfMonths}
                                 components={{
                                    DayContent: ({ date }) => {
                                       return (
                                          <div className="flex flex-col items-center justify-center">
                                             <span>{date.getDate()}</span>
                                             <span className="text-[10px] text-green-500">
                                                {user?.currency != "IDR"
                                                   ? checkRoomPrice(date, roomStatus, currencyRate)
                                                   : checkRoomPrice(date, roomStatus)}
                                             </span>
                                          </div>
                                       );
                                    },
                                 }}
                                 disabled={(date) => checkRoomBooking(date, roomStatus)}
                              />
                           </PopoverContent>
                           <FormMessage className="bg-destructive/80 text-background absolute -top-2 mx-1 text-nowrap rounded-lg px-2" />
                        </Popover>
                     </FormItem>
                  )}
               />
               <div className="flex flex-col gap-2">
                  <div>Total Nights: {totalNights}</div>
                  <div>
                     Total Price:{" "}
                     {!currencyRate
                        ? currency(totalPrice * 1000, "IDR", 1)
                        : currency(totalPrice * 1000, user?.currency, currencyRate)}
                  </div>
               </div>
               <Button disabled={isSubmitting}>Create Booking</Button>
            </div>
         </form>
      </Form>
   );
}
