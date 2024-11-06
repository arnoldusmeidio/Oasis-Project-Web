"use client";
import { useState, useEffect } from "react";
import { Property } from "@/types/property-types";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import useCurrencyStore from "@/stores/useCurrencyStore";
import { useUserStore } from "@/stores/useUserStore";
import { currency } from "@/helpers/currency";

export default function RoomDetail({ params }: { params: { slug: string } }) {
   const [roomGet, setRoomGet] = useState<Property | undefined>(undefined);
   const [isLoading, setIsLoading] = useState(true);
   const { user } = useUserStore();
   const [currencyLoading, setCurrencyLoading] = useState(true);
   const { currencyRate, getCurrencyRate } = useCurrencyStore();

   useEffect(() => {
      const roomGetter = async () => {
         try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/room/${params.slug}`, {
               method: "GET",
               headers: { "Content-Type": "application/json" },
               credentials: "include",
            });

            const data = await response.json();
            setRoomGet(data.data);
         } catch (error) {
            console.error("Error fetching room details:", error);
         } finally {
            setIsLoading(false);
         }
      };

      roomGetter();

      if (user?.currency && user.currency != "IDR") {
         setCurrencyLoading(true);
         getCurrencyRate();
         setCurrencyLoading(false);
      } else {
         setCurrencyLoading(false);
      }
   }, [params.slug, user?.currency, getCurrencyRate]);

   return (
      <div className="mx-auto w-full max-w-6xl p-4">
         {isLoading ? (
            <h1 className="text-center text-2xl font-semibold text-gray-600">Loading, please wait...</h1>
         ) : roomGet ? (
            <>
               {/* Carousel for Room Images */}
               <div className="mb-6 w-full overflow-hidden rounded-lg shadow-lg">
                  {roomGet.roomPictures && roomGet.roomPictures.length > 1 ? (
                     <Carousel className="w-full" plugins={[Autoplay({ delay: 5000 })]}>
                        <CarouselContent>
                           {roomGet.roomPictures.map((picture: any, index: any) => (
                              <CarouselItem key={index}>
                                 <Image
                                    src={roomGet.roomPictures?.[0]?.url || "/placeholder.jpg"}
                                    alt={`Room picture ${index + 1}`}
                                    width={1500}
                                    height={1000}
                                    className="h-96 w-full rounded-lg object-cover"
                                 />
                              </CarouselItem>
                           ))}
                        </CarouselContent>
                     </Carousel>
                  ) : (
                     <Image
                        src={roomGet.roomPictures?.[0]?.url || "/placeholder.jpg"}
                        alt="Room picture"
                        width={1500}
                        height={1000}
                        className="h-96 w-full rounded-lg object-cover"
                     />
                  )}
               </div>

               {/* Room Details */}
               <div className="rounded-lg bg-white p-6 shadow-lg">
                  {/* Header Section */}
                  <div className="mb-4 flex items-center justify-between border-b pb-4">
                     <h1 className="text-2xl font-bold text-gray-800">{roomGet.type}</h1>
                     <span className="text-xl font-semibold text-blue-600">
                        {currencyLoading || !user
                           ? "Loading..."
                           : !currencyRate
                             ? currency(roomGet.defaultPrice as any, "IDR", 1)
                             : currency(roomGet.defaultPrice as any, user?.currency, currencyRate)}
                        <span className="font-normal text-gray-600">/ night</span>
                     </span>
                  </div>

                  {/* Description and Details Section */}
                  <div className="space-y-4">
                     <p className="leading-relaxed text-gray-700">{roomGet.description}</p>
                     <div className="flex items-center space-x-4">
                        <p className="font-semibold text-gray-600">
                           Capacity: <span className="font-normal">{roomGet.roomCapacity} guests</span>
                        </p>
                     </div>
                  </div>
               </div>
            </>
         ) : (
            <p className="text-center text-xl font-semibold text-gray-500">No room found.</p>
         )}
      </div>
   );
}
