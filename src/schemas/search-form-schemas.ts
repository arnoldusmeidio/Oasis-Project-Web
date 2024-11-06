import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export const searchSchema = z.object({
   location: z.string().min(1, { message: "Enter a destination to start searching" }).max(50),
   dates: z
      .object(
         {
            from: z.date({ required_error: "From date is required" }),
            to: z.date({ invalid_type_error: "To date is required" }),
         },
         {
            required_error: "Please select a date range",
         },
      )
      .refine((data) => data.from < data.to, {
         path: ["dates"],
         message: "From date must be before to date",
      }),
   adults: z
      .string()
      .min(1, { message: "Please select at least 1 adult" })
      .max(12, { message: "Max 12 adults occupancy" }),
   children: z.string().min(0).max(12, { message: "Max 12 children occupancy" }),
   rooms: z.string().min(1, { message: "Please select at least 1 room" }),
});

type SearchedQuery = {
   searchedLocation: string | null;
   groupAdults: string | null;
   groupChildren: string | null;
   noOfRooms: string | null;
   checkin: string | null;
   checkout: string | null;
};

export type FormTypeSearch = z.infer<typeof searchSchema>;

export const useFormSearch = (searchedQuery: SearchedQuery) =>
   useForm<FormTypeSearch>({
      resolver: zodResolver(searchSchema),
      defaultValues: {
         location: searchedQuery.searchedLocation || "",
         dates: {
            from: searchedQuery.checkin ? new Date(searchedQuery.checkin) : new Date(new Date().setHours(0, 0, 0, 0)),
            to: searchedQuery.checkout
               ? new Date(searchedQuery.checkout)
               : new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(0, 0, 0, 0)),
         },
         adults: searchedQuery.groupAdults || "1",
         children: searchedQuery.groupChildren || "0",
         rooms: searchedQuery.noOfRooms || "1",
      },
      mode: "onSubmit",
   });
