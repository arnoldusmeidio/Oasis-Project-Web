"use client";

import FormError from "@/components/FormError";
import PropertyPicturesCarousel from "@/components/tenant/property/PropertyPicturesCarousel";
import CurrentLocButton from "@/components/tenant/maps-button";
import { Property } from "@/types/property-types";
import { useEffect, useState } from "react";
import { APIProvider, Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { currency } from "@/helpers/currency";
import useCurrencyStore from "@/stores/useCurrencyStore";
import { useUserStore } from "@/stores/useUserStore";
import PropertySkeleton from "@/components/PropertySkeleton";
import CheckAvailabilityButton from "@/components/tenant/property/CheckAvailabilityButton";
import CommentsAccordion from "@/components/tenant/property/CommentsAccordion";
import RoomPicturesCarousel from "@/components/tenant/property/RoomPicturesCarousel";

export default function SearchedPropertyPage({ params }: { params: { slug: string } }) {
   const [property, setProperty] = useState<Property>();
   const [isLoading, setIsLoading] = useState(true);
   const [currencyLoading, setCurrencyLoading] = useState(true);
   const { user } = useUserStore();
   const [errorMessage, setErrorMessage] = useState("");
   const [userLoc, setUserLoc] = useState<{ lat: number; lng: number }>();
   const { currencyRate, error, getCurrencyRate } = useCurrencyStore();

   const getProperty = async () => {
      try {
         const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/property/${params.slug}`, {
            credentials: "include",
         });
         const data = await response.json();
         if (!data.ok) {
            setErrorMessage(data.message);
         } else {
            setProperty(data.data);
         }
         setIsLoading(false);
      } catch (error) {
         console.error(error);
      }
   };

   useEffect(() => {
      getProperty();
      if (user?.currency && user.currency != "IDR") {
         setCurrencyLoading(true);
         getCurrencyRate();
         setCurrencyLoading(false);
      } else {
         setCurrencyLoading(false);
      }
   }, [user?.currency, getCurrencyRate]);

   if (!isLoading && !property) {
      return (
         <div className="max-w-[500px] justify-self-center">
            <FormError message={errorMessage} />
         </div>
      );
   }

   return (
      <>
         {isLoading || !property || currencyLoading ? (
            <PropertySkeleton />
         ) : (
            <div className="mx-auto w-[375px] max-w-7xl p-4 pt-0 min-[500px]:w-[500px] sm:w-[640px] md:w-[768px] lg:w-[1024px] lg:px-8 xl:w-[1280px] 2xl:w-[80rem]">
               {/* Carousel of property pics */}
               <div className="h-auto w-auto overflow-hidden rounded-lg sm:h-[300px] lg:h-[400px] xl:h-[500px] 2xl:h-[600px]">
                  <PropertyPicturesCarousel property={property} />
               </div>

               {/* Property Details */}
               <div className="my-5 flex flex-col lg:flex-row">
                  <div className="w-full lg:w-2/3 lg:pr-4">
                     <div className="mb-2 flex items-center justify-between">
                        <h2 className="text-xl font-semibold">{property.name}</h2>
                        <div className="flex items-center gap-2">
                           <span className="text-lg">Rating:</span>
                           <span className="text-background flex-shink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold">
                              {property.averageRating.star ? `${property.averageRating.star.toFixed(1)}` : "N/A"}
                           </span>
                        </div>
                     </div>
                     <p className="mt-1 text-gray-600">{property.description}</p>
                     <p className="mt-1 text-gray-500">
                        📍 {property.address}, {property.city}
                     </p>

                     {/* Property Category */}
                     <Badge className="mt-2 w-fit bg-blue-100 text-blue-800 hover:bg-blue-100">
                        {property.category}
                     </Badge>

                     {/* Amenities */}
                     <div className="mt-4 flex justify-between">
                        <div className="flex flex-col gap-2">
                           <span className="block">Amenities:</span>
                           <div className="flex flex-wrap space-x-2 text-sm text-gray-600">
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Wi-Fi</Badge>
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Breakfast</Badge>
                           </div>
                        </div>
                     </div>

                     {/* Rooms */}
                     {property.room.map((room) => (
                        <Card key={room.id} className="mt-5 rounded-lg shadow-lg">
                           <CardContent>
                              {/* Room Image Carousel without Arrow Buttons */}
                              <RoomPicturesCarousel room={room} />

                              {/* Room Details */}
                              <div className="flex items-end justify-between">
                                 <div>
                                    <h3 className="mt-3 text-lg font-semibold">
                                       {room.type} (Capacity: {room.roomCapacity} person
                                       {room.roomCapacity > 1 ? "s" : ""})
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                       Price per night starts from:
                                       {!currencyRate
                                          ? currency(room?.defaultPrice, "IDR", 1)
                                          : currency(room?.defaultPrice, user?.currency, currencyRate)}
                                    </p>
                                 </div>
                                 <CheckAvailabilityButton
                                    roomId={room?.id}
                                    propertyName={property?.name}
                                    roomType={room?.type}
                                    currencyRate={currencyRate}
                                 />
                              </div>
                           </CardContent>
                        </Card>
                     ))}
                  </div>

                  <div className="mt-5 flex w-full flex-col gap-2 lg:mt-0 lg:w-1/3">
                     {/* Google Maps */}
                     <div className="relative h-80 w-full">
                        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
                           <Map
                              defaultCenter={{ lat: property.lat, lng: property.lng }}
                              defaultZoom={15}
                              disableDefaultUI={true}
                              mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID}
                           >
                              <AdvancedMarker position={{ lat: property.lat, lng: property.lng }}>
                                 <Pin />
                              </AdvancedMarker>
                              {userLoc && (
                                 <>
                                    <AdvancedMarker position={userLoc}>
                                       <Pin />
                                    </AdvancedMarker>
                                    <CurrentLocButton userLoc={userLoc} />
                                 </>
                              )}
                           </Map>
                        </APIProvider>
                     </div>

                     {/* Comments */}
                     <div>
                        <CommentsAccordion reviews={property.reviews} />
                     </div>
                  </div>
               </div>
            </div>
         )}
      </>
   );
}
