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

export default function EditProperty({ params }: { params: { slug: string } }) {
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
         formData.append("propertyCity", values.propertyCity);
         formData.append("category", values.category);
         images.forEach((file) => formData.append("propertyPictures", file));

         const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/tenant/${params.slug}`, {
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
      <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10 space-y-6 rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">Edit Property</h2>

            {/* Property Name */}
            <FormField
               control={form.control}
               name="propertyName"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel className="text-lg font-medium">Property Name</FormLabel>
                     <FormControl>
                        <Input
                           disabled={isSubmitting}
                           placeholder="Enter Property Name"
                           {...field}
                           type="text"
                           className="mt-1"
                        />
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
                     <FormLabel className="text-lg font-medium">Property Address</FormLabel>
                     <FormControl>
                        <Input
                           disabled={isSubmitting}
                           placeholder="Enter Property Address"
                           {...field}
                           type="text"
                           className="mt-1"
                        />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />

            {/* Property City */}
            <FormField
               control={form.control}
               name="propertyCity"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel className="text-lg font-medium">Property City</FormLabel>
                     <FormControl>
                        <Input
                           disabled={isSubmitting}
                           placeholder="Enter Property City"
                           {...field}
                           type="text"
                           className="mt-1"
                        />
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
                     <FormLabel className="text-lg font-medium">Property Description</FormLabel>
                     <FormControl>
                        <Input
                           disabled={isSubmitting}
                           placeholder="Brief Description"
                           {...field}
                           type="text"
                           className="mt-1"
                        />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />

            {/* Property Categories */}
            <fieldset className="mt-4">
               <legend className="text-lg font-medium">Property Categories</legend>
               <RadioGroup onValueChange={form.setValue.bind(form, "category")} className="mt-2 space-y-2">
                  {Object.values(Category).map((cat) => (
                     <FormItem key={cat} className="flex items-center gap-3">
                        <RadioGroupItem value={cat} id={cat} />
                        <Label htmlFor={cat} className="text-base text-gray-600">
                           {cat}
                        </Label>
                     </FormItem>
                  ))}
               </RadioGroup>
            </fieldset>

            {/* Property Images */}
            <FormField
               control={form.control}
               name="propertyPictures"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel className="text-lg font-medium">Property Images</FormLabel>
                     <div>
                        <Input
                           type="file"
                           accept="image/*"
                           multiple
                           onChange={onChange}
                           disabled={images.length >= 5}
                           className="mt-2"
                        />
                        <div className="mt-2 flex flex-wrap gap-2">
                           {imagesPreview?.map((img, index) => (
                              <Image
                                 src={img}
                                 key={index}
                                 alt={`preview-${index}`}
                                 className="h-24 w-24 rounded-lg border border-gray-300 object-cover shadow-md"
                                 width={96}
                                 height={96}
                              />
                           ))}
                        </div>
                     </div>
                     <FormMessage />
                  </FormItem>
               )}
            />

            {/* Success and Error Messages */}
            <div className="mt-4">
               <FormError message={error} />
               <FormSuccess message={success} />
            </div>

            {/* Submit Button */}
            <Button
               className="mt-6 w-full rounded-md bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700"
               type="submit"
               disabled={isSubmitting}
            >
               Update Property
            </Button>
         </form>
      </Form>
   );
}
