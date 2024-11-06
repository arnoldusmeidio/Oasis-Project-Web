"use client";
import React, { useEffect, useState } from "react";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuLabel,
   DropdownMenuRadioGroup,
   DropdownMenuRadioItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Booking } from "@/types/booking";
import { Button, buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";
import BookingList from "./BookingList";

export default function BookingCard() {
   const [isLoading, setIsLoading] = useState(true);
   const [bookingData, setBookingData] = useState<Booking[]>([]);
   const [sort, setSort] = useState<string>("1");
   const [filter, setFilter] = useState<string>("X");

   const eventGetter = async () => {
      try {
         const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/bookings/advanced/${sort}${filter}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
         });

         const resData = await res.json();
         if (resData.ok) {
            setBookingData(resData.data);
         }
         setIsLoading(false);
         return bookingData;
      } catch (error) {
         console.error(error);
      }
   };
   useEffect(() => {
      eventGetter();
   }, []);

   useEffect(() => {
      eventGetter();
   }, [sort, filter]);

   if (isLoading) return <Skeleton className="flex flex-col gap-4 px-4 py-4" />;

   if (bookingData.length == 0) {
      return (
         <div className="flex flex-col gap-4 px-4 py-4">
            <div className="flex justify-center gap-2 align-middle">
               <Image
                  alt="picture of people going on holiday"
                  width={100}
                  height={100}
                  src={"/drive.svg"}
                  className="h-[300px] w-[300px] md:h-[500px] md:w-[500px]"
               />
            </div>
            <h3 className="flex justify-center gap-2 align-middle">No booking found!</h3>
            <div className="flex justify-center gap-2 align-middle">
               <Link href="/" className="w-[30%] max-w-[30%]">
                  <Button className="w-full">Book Now</Button>
               </Link>
            </div>
         </div>
      );
   }

   return (
      <>
         <div className="flex justify-end gap-4 px-4 py-4">
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <Button variant="outline">Sort/Filter</Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Sort by:</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup>
                     <DropdownMenuRadioItem
                        value="recent_asc"
                        onClick={async () => {
                           setSort("1");
                           setIsLoading(true);
                           eventGetter();
                        }}
                     >
                        Recent (Asc)
                     </DropdownMenuRadioItem>
                     <DropdownMenuRadioItem
                        value="recent_desc"
                        onClick={async () => {
                           setSort("2");
                           setIsLoading(true);
                           eventGetter();
                        }}
                     >
                        Recent (Desc)
                     </DropdownMenuRadioItem>
                     <DropdownMenuRadioItem
                        value="date_asc"
                        onClick={async () => {
                           setSort("3");
                           setIsLoading(true);
                           eventGetter();
                        }}
                     >
                        Date (Asc)
                     </DropdownMenuRadioItem>
                     <DropdownMenuRadioItem
                        value="date_desc"
                        onClick={async () => {
                           setSort("4");
                           setIsLoading(true);
                           eventGetter();
                        }}
                     >
                        Date (Desc)
                     </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Filter by Payment Status:</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup>
                     <DropdownMenuRadioItem
                        value="all"
                        onClick={async () => {
                           setFilter("X");
                           setIsLoading(true);
                           eventGetter();
                        }}
                     >
                        ALL
                     </DropdownMenuRadioItem>
                     <DropdownMenuRadioItem
                        value="pending"
                        onClick={async () => {
                           setFilter("A");
                           setIsLoading(true);
                           eventGetter();
                        }}
                     >
                        PENDING
                     </DropdownMenuRadioItem>
                     <DropdownMenuRadioItem
                        value="paid"
                        onClick={() => {
                           setFilter("B");
                           setIsLoading(true);
                           eventGetter();
                        }}
                     >
                        PAID
                     </DropdownMenuRadioItem>
                     <DropdownMenuRadioItem
                        value="canceled"
                        onClick={() => {
                           setFilter("C");
                           setIsLoading(true);
                           eventGetter();
                        }}
                     >
                        CANCELED
                     </DropdownMenuRadioItem>
                     <DropdownMenuRadioItem
                        value="processing"
                        onClick={() => {
                           setFilter("D");
                           setIsLoading(true);
                           eventGetter();
                        }}
                     >
                        PROCESSING
                     </DropdownMenuRadioItem>
                     <DropdownMenuRadioItem
                        value="approved"
                        onClick={() => {
                           setFilter("E");
                           setIsLoading(true);
                           eventGetter();
                        }}
                     >
                        APPROVED
                     </DropdownMenuRadioItem>
                     <DropdownMenuRadioItem
                        value="completed"
                        onClick={() => {
                           setFilter("F");
                           setIsLoading(true);
                           eventGetter();
                        }}
                     >
                        COMPLETED
                     </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
               </DropdownMenuContent>
            </DropdownMenu>
         </div>

         {/*booking data*/}
         <BookingList eventGetter={eventGetter} bookingData={bookingData} />
      </>
   );
}
