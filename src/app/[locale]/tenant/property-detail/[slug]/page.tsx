"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Property } from "@/types/property-types";
import { Card, CardContent } from "@/components/ui/card";
import { APIProvider, Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import Autoplay from "embla-carousel-autoplay";
import useCurrencyStore from "@/stores/useCurrencyStore";
import { useUserStore } from "@/stores/useUserStore";
import {
   AlertDialog,
   AlertDialogTrigger,
   AlertDialogContent,
   AlertDialogTitle,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogCancel,
   AlertDialogAction,
   AlertDialogHeader,
} from "@/components/ui/alert-dialog";

import { currency } from "@/helpers/currency";
import { toast } from "sonner";

export default function PropertyDetails({ params }: { params: { slug: string } }) {
   const [getProperty, setGetProperty] = useState<Property>();
   const [isLoading, setIsLoading] = useState(true);
   const [userLoc, setUserLoc] = useState<{ lat: number; lng: number }>();
   const { currencyRate, getCurrencyRate } = useCurrencyStore();
   const { user } = useUserStore();
   const [currencyLoading, setCurrencyLoading] = useState(true);
   const [roomToDelete, setRoomToDelete] = useState<string | null>(null); // State to store room ID to delete
   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

   useEffect(() => {
      const propertyGetter = async () => {
         try {
            const get = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/property/${params.slug}`, {
               method: "GET",
               headers: { "Content-Type": "application/json" },
               credentials: "include",
            });
            if (navigator.geolocation) {
               navigator.geolocation.getCurrentPosition((loc) => {
                  setUserLoc({ lat: loc.coords.latitude, lng: loc.coords.longitude });
               });
            }

            const getData = await get.json();
            setGetProperty(getData.data);
         } catch (error) {
            console.error(error);
         } finally {
            setIsLoading(false);
         }
      };

      if (user?.currency && user.currency != "IDR") {
         setCurrencyLoading(true);
         getCurrencyRate();
         setCurrencyLoading(false);
      } else {
         setCurrencyLoading(false);
      }

      propertyGetter();
   }, [params.slug, user?.currency, getCurrencyRate]);

   const deleteRoom = async (roomId: string) => {
      try {
         const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/room/${roomId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
         });

         if (response.ok) {
            setGetProperty((prev) => {
               if (!prev) return prev;
               return {
                  ...prev,
                  room: prev.room.filter((room) => room.id !== roomId),
               };
            });
            toast("room deleted successfully!");
         } else {
            toast.error("Failed to delete the room.");
         }
      } catch (error) {
         console.error("Error deleting room:", error);
      }
   };

   return (
      <div className="mx-auto w-full max-w-6xl p-4">
         {isLoading ? (
            <h1>Loading....</h1>
         ) : getProperty ? (
            <>
               <h1 className="my-5 text-2xl font-bold text-gray-800">{getProperty.name}</h1>

               {/* Property Image Section */}
               {getProperty.propertyPictures.length > 1 ? (
                  <Carousel
                     className="w-full rounded-lg shadow-md"
                     plugins={[
                        Autoplay({
                           delay: 5000,
                        }),
                     ]}
                  >
                     <CarouselContent>
                        {getProperty.propertyPictures.map((picture, index) => (
                           <CarouselItem key={index}>
                              <Link href={`/tenant/room-detail/${getProperty.id}`}>
                                 <Image
                                    src={picture.url || "/placeholder.jpg"}
                                    alt={`Property picture ${index + 1}`}
                                    width={1500}
                                    height={1000}
                                    className="h-72 w-full rounded-lg object-cover"
                                 />
                              </Link>
                           </CarouselItem>
                        ))}
                     </CarouselContent>
                  </Carousel>
               ) : (
                  <Link href={`/tenant/room-detail/${getProperty.id}`}>
                     <Image
                        src={getProperty.propertyPictures[0]?.url || "/placeholder.jpg"}
                        alt="Property picture"
                        width={1500}
                        height={1000}
                        className="h-72 w-full rounded-lg object-cover"
                     />
                  </Link>
               )}

               {/* Property Details */}
               <div className="my-5 flex flex-col md:flex-row">
                  <div className="w-full pr-4 md:w-2/3">
                     <h2 className="text-xl font-semibold">{getProperty.name}</h2>
                     <p className="mt-1 text-gray-600">{getProperty.description}</p>
                     <p className="mt-1 text-gray-500">
                        📍 {getProperty.address}, {getProperty.city}
                     </p>

                     {/* Property Category */}
                     <Badge className="mt-2 w-fit bg-blue-100 text-blue-800 hover:bg-blue-100">
                        {getProperty.category}
                     </Badge>

                     {/* Rooms */}
                     {getProperty.room.map((room) => (
                        <Card key={room.id} className="mt-5 rounded-lg shadow-lg">
                           <CardContent>
                              {/* Room Image Carousel without Arrow Buttons */}
                              {room.roomPictures.length > 1 ? (
                                 <Carousel
                                    className="w-full rounded-lg shadow-md"
                                    plugins={[
                                       Autoplay({
                                          delay: 6000,
                                       }),
                                    ]}
                                 >
                                    <CarouselContent>
                                       {room.roomPictures.map((pic, i) => (
                                          <CarouselItem key={i}>
                                             <Link href={`/tenant/room-detail/${room.id}`}>
                                                <Image
                                                   src={pic.url || "/placeholder.jpg"}
                                                   alt={`Room picture ${i + 1}`}
                                                   width={1500}
                                                   height={1000}
                                                   className="h-60 w-full rounded-lg object-cover"
                                                />
                                             </Link>
                                          </CarouselItem>
                                       ))}
                                    </CarouselContent>
                                 </Carousel>
                              ) : (
                                 <Link href={`/tenant/room-detail/${room.id}`}>
                                    <Image
                                       src={room.roomPictures[0]?.url || "/placeholder.jpg"}
                                       alt="Room picture"
                                       width={1500}
                                       height={1000}
                                       className="h-60 w-full rounded-lg object-cover"
                                    />
                                 </Link>
                              )}

                              {/* Room Details */}
                              <div className="flex justify-between">
                                 <div>
                                    <h3 className="mt-3 text-lg font-semibold">
                                       {room.type} (Capacity: {room.roomCapacity})
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                       Default Price in IDR:{" "}
                                       {currencyLoading || !user || isLoading
                                          ? "Loading..."
                                          : !currencyRate
                                            ? currency(room.defaultPrice, "IDR", 1)
                                            : currency(room.defaultPrice, user?.currency, currencyRate)}
                                    </p>
                                 </div>
                                 <div className="flex gap-2">
                                    <Button className="my-3 bg-blue-600 px-4 py-2 text-white hover:bg-blue-600">
                                       <Link
                                          href={`/tenant/edit-room/${room.id}?propertyId=${getProperty.id}&roomId=${room.id}`}
                                       >
                                          Edit Room
                                       </Link>
                                    </Button>
                                    {/* Delete Button */}
                                    <Button
                                       className="my-3 bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                                       onClick={() => {
                                          setRoomToDelete(room.id); // Set the selected room ID
                                          setDeleteDialogOpen(true); // Open the delete confirmation dialog
                                       }}
                                    >
                                       Delete Room
                                    </Button>
                                 </div>
                              </div>
                           </CardContent>
                        </Card>
                     ))}
                  </div>

                  {/* Google Maps */}
                  <div className="mt-5 h-80 w-full rounded-lg md:mt-0 md:w-1/3">
                     <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
                        <Map
                           defaultCenter={{ lat: getProperty.lat, lng: getProperty.lng }}
                           defaultZoom={15}
                           disableDefaultUI={true}
                           mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID}
                        >
                           <AdvancedMarker position={{ lat: getProperty.lat, lng: getProperty.lng }}>
                              <Pin />
                           </AdvancedMarker>
                           {userLoc && (
                              <AdvancedMarker position={userLoc}>
                                 <Pin />
                              </AdvancedMarker>
                           )}
                        </Map>
                     </APIProvider>
                  </div>
               </div>

               {/* Delete Confirmation Dialog */}
               <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                  <AlertDialogContent>
                     <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                        <AlertDialogDescription>
                           Are you sure you want to delete this room? This action cannot be undone.
                        </AlertDialogDescription>
                     </AlertDialogHeader>
                     <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                           onClick={() => {
                              if (roomToDelete) {
                                 deleteRoom(roomToDelete);
                              }
                              setDeleteDialogOpen(false);
                           }}
                        >
                           Confirm
                        </AlertDialogAction>
                     </AlertDialogFooter>
                  </AlertDialogContent>
               </AlertDialog>

               {/* Booking and Amenities */}
               <div className="mt-10 flex justify-between">
                  <div className="flex flex-wrap space-x-2 text-sm text-gray-600">
                     <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Wi-Fi</Badge>
                     <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Breakfast</Badge>
                     {/* Add more amenities as needed */}
                  </div>
                  <Button className="bg-blue-600 px-4 py-2 text-white hover:bg-blue-600">
                     <Link href={`/tenant/create-room?propertyId=${getProperty.id}`}>Create Room</Link>
                  </Button>
               </div>
            </>
         ) : (
            <h2>Property not found</h2>
         )}
      </div>
   );
}
