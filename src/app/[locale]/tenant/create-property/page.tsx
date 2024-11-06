"use client";

import * as z from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { propertySchema } from "@/schemas/property-schemas";
import { Form, FormField, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/routing";
import Image from "next/image";
import FormError from "@/components/FormError";
import FormSuccess from "@/components/FormSuccess";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Category } from "@/types/property-types";

export default function CreateProperty() {
   const [error, setError] = useState<string | undefined>(undefined);
   const [success, setSuccess] = useState<string | undefined>(undefined);
   const [images, setImages] = useState<File[]>([]);
   const [imagesPreview, setImagesPreview] = useState<string[]>([]);

   // Updated onChange handler to allow multiple file uploads
   const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newFiles = Array.from(e.target.files || []);

      // Append new files to existing ones
      const updatedFiles = [...images, ...newFiles];

      // Update the state with the new list of files
      setImages(updatedFiles);

      // Create new previews for the newly added files
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setImagesPreview((prevPreviews) => [...prevPreviews, ...newPreviews]);
   };

   const router = useRouter();
   const form = useForm<z.infer<typeof propertySchema>>({
      resolver: zodResolver(propertySchema),
      defaultValues: {
         propertyName: "",
         propertyAddress: "",
         propertyDescription: "",
         category: Category.Hotel,
         propertyPictures: [],
         propertyCity: "",
      },
      mode: "onBlur",
   });

   const {
      formState: { isSubmitting },
   } = form;

   const onSubmit = async (values: z.infer<typeof propertySchema>) => {
      try {
         const formData = new FormData();
         formData.append("propertyName", values.propertyName);
         formData.append("propertyAddress", values.propertyAddress);
         formData.append("propertyDescription", values.propertyDescription);
         formData.append("category", values.category);
         formData.append("propertyCity", values.propertyCity);
         images.forEach((file) => formData.append("propertyPictures", file));

         const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/tenant/`, {
            method: "POST",
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
            router.push("/tenant");
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
      <div className="flex min-h-screen items-center justify-center">
         <Form {...form}>
            <form
               onSubmit={form.handleSubmit(onSubmit)}
               className="w-full max-w-md rounded-lg border-2 bg-white p-8 shadow-md"
            >
               <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">Create Property</h2>

               {/* Property Name */}
               <FormField
                  control={form.control}
                  name="propertyName"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Property Name</FormLabel>
                        <FormControl>
                           <Input disabled={isSubmitting} placeholder="Property Name" {...field} type="text" />
                        </FormControl>
                     </FormItem>
                  )}
               />

               {/* Property Address */}
               <FormField
                  control={form.control}
                  name="propertyAddress"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Property Address</FormLabel>
                        <FormControl>
                           <Input disabled={isSubmitting} placeholder="Property Address" {...field} type="text" />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={form.control}
                  name="propertyCity"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Property City</FormLabel>
                        <FormControl>
                           <Input disabled={isSubmitting} placeholder="Property City" {...field} type="text" />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               {/* Property Description */}
               <FormField
                  control={form.control}
                  name="propertyDescription"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Property Description</FormLabel>
                        <FormControl>
                           <Input disabled={isSubmitting} placeholder="Property Description" {...field} type="text" />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               {/* Property Categories */}
               <div className="mt-4">
                  <h3 className="text-lg font-semibold">Property Categories</h3>
                  {Object.values(Category).map((cat) => (
                     <div key={cat} className="gap-5">
                        <FormField
                           control={form.control}
                           name="category"
                           render={({ field }) => (
                              <FormItem>
                                 <RadioGroup
                                    className="my-1 flex items-center space-x-2"
                                    value={field.value}
                                    onValueChange={field.onChange}
                                 >
                                    <RadioGroupItem id={cat} value={cat} />
                                    <Label htmlFor={cat}>{cat}</Label>
                                 </RadioGroup>
                              </FormItem>
                           )}
                        />
                     </div>
                  ))}
               </div>

               {/* Property Images */}
               <FormField
                  control={form.control}
                  name="propertyPictures"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Property Images</FormLabel>
                        <div>
                           <Input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={onChange}
                              disabled={images.length >= 5}
                           />
                           <div className="mt-2 flex max-h-32 flex-wrap space-x-2 overflow-auto">
                              {imagesPreview?.map((img, index) => (
                                 <Image
                                    src={img}
                                    key={index}
                                    alt={`preview-${index}`}
                                    className="h-24 w-24 rounded border-2 object-contain p-2 shadow"
                                    width={50}
                                    height={50}
                                 />
                              ))}
                           </div>
                        </div>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormError message={error} />
               <FormSuccess message={success} />
               <Button className="mt-4 w-full" type="submit" disabled={isSubmitting}>
                  Create Property
               </Button>
            </form>
         </Form>
      </div>
   );
}
