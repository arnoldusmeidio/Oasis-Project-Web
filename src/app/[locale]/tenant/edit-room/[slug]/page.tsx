"use client";

import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { editRoomSchema } from "@/schemas/edit-room-schema";
import { useForm } from "react-hook-form";
import { Form, FormField, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import TenantDatePicker from "@/components/tenant/Tenant-date-picker";

export default function Room() {
   const [error, setError] = useState<string | undefined>("");
   const [success, setSuccess] = useState<string | undefined>("");
   const [images, setImages] = useState<File[]>([]);
   const [imagesPreview, setImagesPreview] = useState<string[]>([]);
   const [specialDates, setSpecialDates] = useState<{ date: Date; price: number }[]>([]);
   const [roomStatus, setRoomStatus] = useState<any>(null); // Change this type based on your roomStatus structure

   const searchParams = useSearchParams();
   const propertyId = searchParams.get(`propertyId`);
   const roomId = searchParams.get(`roomId`);

   const form = useForm<z.infer<typeof editRoomSchema>>({
      resolver: zodResolver(editRoomSchema),
      defaultValues: {
         roomName: "",
         roomDescription: "",
         roomPictures: [],
         roomPrice: 0,
         roomCapacity: 0,
         specialDates: [],
      },
      mode: "onBlur",
   });

   useEffect(() => {
      const fetchRoomStatus = async () => {
         if (!roomId) return;

         const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/room/${roomId}`, {
            method: "GET",
            credentials: "include",
         });
         const data = await response.json();
         if (data.ok) {
            setRoomStatus(data.roomStatus); // Assuming the API response includes roomStatus
         } else {
            console.error("Failed to fetch room status:", data.message);
         }
      };

      fetchRoomStatus();
   }, [roomId]);

   const addSpecialDate = () => {
      setSpecialDates((prevDates) => [
         ...prevDates,
         { date: new Date(), price: 0 }, // Default values
      ]);
   };

   const updateSpecialDate = (index: number, field: keyof { date: Date; price: number }, value: any) => {
      const updatedDates = specialDates.map((item, idx) => (idx === index ? { ...item, [field]: value } : item));
      setSpecialDates(updatedDates);
   };

   const {
      formState: { isSubmitting },
   } = form;

   const router = useRouter();

   const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newFiles = Array.from(e.target.files || []);

      const updatedFiles = [...images, ...newFiles];

      setImages(updatedFiles);

      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setImagesPreview((prevPreviews) => [...prevPreviews, ...newPreviews]);
   };

   const onSubmit = async (values: z.infer<typeof editRoomSchema>) => {
      try {
         if (!propertyId) {
            setError("Property ID is missing.");
            return;
         }

         const formData = new FormData();
         formData.append("roomName", values.roomName);
         formData.append("roomDescription", values.roomDescription);
         formData.append("defaultPrice", values.roomPrice.toString());
         formData.append("roomCapacity", values.roomCapacity.toString());
         images.forEach((file) => formData.append("roomPictures", file));
         formData.append("specialDates", JSON.stringify(specialDates));

         const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/room/${roomId}`, {
            method: "PUT",
            body: formData,
            credentials: "include",
         });

         const data = await response.json();
         if (data.ok) {
            toast(data.message, { duration: 1000 });
            setSuccess(data.message);
            form.reset();
            setImages([]); // Clear images after form reset
            setImagesPreview([]); // Clear previews after form reset
            router.push(`/tenant/property-detail/${propertyId}`);
         } else {
            toast.error(data.message, { duration: 1000 });
            setError(data.message);
         }
      } catch (error) {
         console.error(error);
         setError("Something went wrong!");
      }
   };

   return (
      <main className="flex h-screen items-center justify-center">
         <div className="w-full max-w-md px-2">
            <Card className="w-full rounded-lg bg-white p-4 shadow-md">
               <h2 className="mb-4 text-center text-2xl font-semibold">Edit Room</h2>
               <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                     <FormField
                        control={form.control}
                        name="roomName"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Room Name</FormLabel>
                              <FormControl>
                                 <Input {...field} placeholder="Room Name" className="w-full" />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={form.control}
                        name="roomDescription"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Room Description</FormLabel>
                              <FormControl>
                                 <Input {...field} placeholder="Room Description" className="w-full" />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={form.control}
                        name="roomPrice"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Default Room Price in IDR</FormLabel>
                              <FormControl>
                                 <Input
                                    type="number"
                                    {...field}
                                    placeholder="Room Price"
                                    className="w-full"
                                    onChange={(e) => {
                                       const value = e.target.value;
                                       field.onChange(value ? value : "0");
                                    }}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={form.control}
                        name="roomCapacity"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Room Capacity</FormLabel>
                              <FormControl>
                                 <Input
                                    type="number"
                                    {...field}
                                    placeholder="Capacity"
                                    className="w-full"
                                    onChange={(e) => {
                                       const value = e.target.value;
                                       field.onChange(value ? value : "0");
                                    }}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={form.control}
                        name="roomPictures"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Room Images</FormLabel>
                              <div>
                                 <Input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={onChange}
                                    disabled={images.length >= 5}
                                    className="w-full"
                                 />
                                 <div className="mt-2 flex flex-wrap gap-2">
                                    {imagesPreview?.map((img, index) => (
                                       <Image
                                          src={img}
                                          key={index}
                                          alt={`preview-${index}`}
                                          className="h-20 w-20 rounded border border-gray-300 object-cover"
                                          width={80}
                                          height={80}
                                       />
                                    ))}
                                 </div>
                              </div>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <TenantDatePicker roomId={roomId || ""} roomStatus={roomStatus} setTanggal={setSpecialDates} />
                     <Button className="w-full rounded-lg bg-blue-500 py-2 text-white hover:bg-blue-600" type="submit">
                        Edit Room
                     </Button>
                  </form>
               </Form>
            </Card>
         </div>
      </main>
   );
}
