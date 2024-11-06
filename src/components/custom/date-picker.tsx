"use client";

import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { checkRoomPrice } from "@/helpers/check-room-price";
import { checkRoomBooking } from "@/helpers/check-room-booking";
import { RoomStatus } from "@/types/room-status";
import { useParams } from "next/navigation";

export function DatePicker({ className }: React.HTMLAttributes<HTMLDivElement>) {
   const [date, setDate] = React.useState<DateRange | undefined>({
      from: undefined,
      to: undefined,
   });
   const [roomStatus, setRoomStatus] = React.useState<RoomStatus>();
   const [numberOfMonths, setNumberOfMonths] = React.useState<number>(2);

   const params = useParams<any>();
   const roomId = params.slug;

   React.useEffect(() => {
      function handleResize() {
         if (window.innerWidth < 650) {
            setNumberOfMonths(1);
         } else {
            setNumberOfMonths(2);
         }
      }

      handleResize();

      window.addEventListener("resize", handleResize);

      return () => window.removeEventListener("resize", handleResize);
   }, []);

   React.useEffect(() => {
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

   function handleSelect(selectedDate: DateRange | undefined) {
      if (selectedDate) {
         const { from, to } = selectedDate;

         if (from && to && from.getTime() === to.getTime()) {
            setDate(undefined);
            return;
         }

         if (from && to) {
            const selectedDatesArray: Date[] = [];
            let currentDate = from;

            while (currentDate <= to) {
               selectedDatesArray.push(currentDate);
               currentDate = addDays(currentDate, 1);
            }

            const isBooked = selectedDatesArray.some((date) => checkRoomBooking(date, roomStatus));

            if (isBooked) {
               setDate({ from: to, to: undefined });
               return;
            }
         }

         setDate(selectedDate);
      } else {
         setDate(undefined);
      }
   }

   return (
      <div className={cn("grid gap-2", className)}>
         <Popover>
            <PopoverTrigger asChild>
               <Button
                  id="date"
                  variant={"outline"}
                  className={cn("w-[300px] justify-start text-left font-normal", !date && "text-muted-foreground")}
               >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                     date.to ? (
                        <>
                           {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                        </>
                     ) : (
                        format(date.from, "LLL dd, y")
                     )
                  ) : (
                     <span>Pick a date</span>
                  )}
               </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
               <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={handleSelect}
                  numberOfMonths={numberOfMonths}
                  components={{
                     DayContent: ({ date }) => {
                        return (
                           <div className="flex flex-col items-center justify-center">
                              <span>{date.getDate()}</span>
                              <span className="text-[10px] text-green-500">{checkRoomPrice(date, roomStatus)}</span>
                           </div>
                        );
                     },
                  }}
                  disabled={(date) => checkRoomBooking(date, roomStatus)}
               />
            </PopoverContent>
         </Popover>
      </div>
   );
}
