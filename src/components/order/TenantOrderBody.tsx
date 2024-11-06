"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "@/i18n/routing";
import { Skeleton } from "../ui/skeleton";
import { Property } from "@/types/property-types";
import OrderList from "./TenantOrderList";

export default function OrderBody() {
   const router = useRouter();

   const [isLoading, setIsLoading] = useState(true);
   const [orderData, setOrderData] = useState<Property[]>([]);
   const eventGetter = async () => {
      try {
         const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/orders`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
         });

         const resData = await res.json();
         if (resData.ok) {
            setOrderData(resData.data);
         }
         setIsLoading(false);
         return orderData;
      } catch (error) {
         console.error(error);
      }
   };
   useEffect(() => {
      eventGetter();
   }, []);

   if (isLoading) return <Skeleton className="flex flex-col gap-4 px-4 py-4" />;

   if (orderData.length == 0) {
      return (
         <div className="flex flex-col gap-4 px-4 py-4">
            <div className="flex justify-center gap-2 align-middle">
               <Image
                  alt="picture of people going on holiday"
                  width={100}
                  height={100}
                  src={"/laptop.svg"}
                  className="h-[300px] w-[300px] md:h-[500px] md:w-[500px]"
               />
            </div>
            <h3 className="flex justify-center gap-2 align-middle">All cleared!</h3>
            <div className="flex justify-center gap-2 align-middle"></div>
         </div>
      );
   }

   return (
      <>
         <OrderList eventGetter={eventGetter} orderData={orderData} />
      </>
   );
}
