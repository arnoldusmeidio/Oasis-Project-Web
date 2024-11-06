"use client";

import { Search, Plus, Minus, BedDouble, User } from "lucide-react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useRouter } from "@/i18n/routing";
import { FormTypeSearch, useFormSearch } from "@/schemas/search-form-schemas";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { SubmitHandler } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

type FormFields = "location" | "dates" | "adults" | "children" | "rooms" | "dates.from" | "dates.to";

export default function Searchbar() {
   const searchParams = useSearchParams();
   const searchedQuery = {
      searchedLocation: searchParams.get("location"),
      groupAdults: searchParams.get("group_adults"),
      groupChildren: searchParams.get("group_children"),
      noOfRooms: searchParams.get("no_rooms"),
      checkin: searchParams.get("checkin"),
      checkout: searchParams.get("checkout"),
   };
   const now = new Date(new Date().setHours(0, 0, 0, 0));
   const ninetyDaysFromNow = new Date(now.valueOf() + 90 * 24 * 60 * 60 * 1000);

   const router = useRouter();
   const t = useTranslations("Layout.SearchBar");
   const form = useFormSearch(searchedQuery);

   const {
      setValue,
      watch,
      formState: { isSubmitting },
   } = form;

   const adults = watch("adults");
   const children = watch("children");
   const rooms = watch("rooms");

   const increment = (field: FormFields) => setValue(field, (Number(watch(field)) + 1).toString());
   const decrement = (field: FormFields) => setValue(field, Math.max(0, Number(watch(field)) - 1).toString()); // Prevent negative values

   const onSubmit: SubmitHandler<FormTypeSearch> = async (values) => {
      const checkin_monthday = values.dates.from.getDate().toString();
      const checkin_month = (values.dates.from.getMonth() + 1).toString();
      const checkin_year = values.dates.from.getFullYear().toString();
      const checkout_monthday = values.dates.to.getDate().toString();
      const checkout_month = (values.dates.to.getMonth() + 1).toString();
      const checkout_year = values.dates.to.getFullYear().toString();

      const checkin = `${checkin_year}-${checkin_month}-${checkin_monthday}`;
      const checkout = `${checkout_year}-${checkout_month}-${checkout_monthday}`;

      router.push(
         `/search?location=${values.location}&group_adults=${values.adults}&group_children=${values.children}&no_rooms=${values.rooms}&checkin=${checkin}&checkout=${checkout}`,
      );
   };

   return (
      <Form {...form}>
         <form
            className="w-full min-w-[300px] max-w-5xl lg:flex lg:items-center lg:justify-center"
            onSubmit={form.handleSubmit(onSubmit)}
         >
            <div className="-mb-12 flex flex-col justify-center gap-1 rounded-lg bg-yellow-300 p-1 align-middle shadow-md lg:w-fit lg:flex-row">
               <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                     <FormItem className="relative">
                        <FormControl>
                           <div className="bg-background flex items-center rounded-lg">
                              <BedDouble className="ml-4 mr-1 h-4 w-4" />
                              <Input
                                 {...field}
                                 type="text"
                                 className="w-full border-none bg-transparent pl-2 text-sm focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 xl:w-72"
                                 placeholder={t("location")}
                              />
                           </div>
                        </FormControl>
                        <FormMessage className="bg-destructive/80 text-background absolute -top-5 z-10 mx-1 text-nowrap rounded-lg px-2" />
                     </FormItem>
                  )}
               />

               <FormField
                  control={form.control}
                  name="dates"
                  render={({ field }) => (
                     <FormItem className="relative">
                        <div className="grid gap-2">
                           <Popover>
                              <PopoverTrigger asChild>
                                 <FormControl>
                                    <Button
                                       id="date"
                                       variant={"outline"}
                                       className={cn(
                                          "min-w-64 justify-start text-left font-normal",
                                          !field && "text-muted-foreground",
                                       )}
                                    >
                                       <CalendarIcon className="mr-2 h-4 w-4" />
                                       {field?.value.from ? (
                                          field.value.to ? (
                                             <>
                                                {format(field.value.from, "LLL dd, y")} -{" "}
                                                {format(field.value.to, "LLL dd, y")}
                                             </>
                                          ) : (
                                             format(field.value.from, "LLL dd, y")
                                          )
                                       ) : (
                                          <span>Select your dates</span>
                                       )}
                                    </Button>
                                 </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                 <Calendar
                                    initialFocus
                                    mode="range"
                                    defaultMonth={field?.value.from}
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    numberOfMonths={2}
                                    disabled={(date) => date < now || date > ninetyDaysFromNow}
                                 />
                              </PopoverContent>
                              <FormMessage className="bg-destructive/80 text-background absolute -top-2 mx-1 text-nowrap rounded-lg px-2" />
                           </Popover>
                        </div>
                     </FormItem>
                  )}
               />

               <div className="min-w-72">
                  <Popover>
                     <PopoverTrigger asChild>
                        <Button variant="outline" className="flex w-full items-center justify-start gap-2">
                           <User className="h-4 w-4" />
                           <span>
                              {adults} {Number(adults) > 1 ? `${t("adult.headerPlural")}` : `${t("adult.header")}`}
                           </span>
                           <span>·</span>
                           <span>
                              {children}{" "}
                              {Number(children) > 0 ? `${t("children.headerPlural")}` : `${t("children.header")}`}
                           </span>
                           <span>·</span>
                           <span>
                              {rooms} {Number(rooms) > 1 ? `${t("room.headerPlural")}` : `${t("room.header")}`}
                           </span>
                        </Button>
                     </PopoverTrigger>

                     <PopoverContent align="start" className="flex flex-col gap-2 text-sm">
                        {/* Adults */}
                        <div className="flex items-center justify-between">
                           <span>{t("adult.label")}</span>
                           <div className="flex w-32 items-center justify-between gap-2 rounded-md border-2">
                              <Button
                                 disabled={Number(adults) <= 1}
                                 variant={"ghost"}
                                 onClick={() => decrement("adults")}
                              >
                                 <Minus className="h-3 w-3" />
                              </Button>
                              <span>{adults}</span>
                              <Button variant={"ghost"} onClick={() => increment("adults")}>
                                 <Plus className="h-3 w-3" />
                              </Button>
                           </div>
                        </div>

                        {/* Children */}
                        <div className="flex items-center justify-between">
                           <span>{t("children.label")}</span>
                           <div className="flex w-32 items-center justify-between gap-2 rounded-md border-2">
                              <Button
                                 disabled={Number(children) <= 0}
                                 variant={"ghost"}
                                 onClick={() => decrement("children")}
                              >
                                 <Minus className="h-3 w-3" />
                              </Button>
                              <span>{children}</span>
                              <Button variant={"ghost"} onClick={() => increment("children")}>
                                 <Plus className="h-3 w-3" />
                              </Button>
                           </div>
                        </div>

                        {/* Rooms */}
                        <div className="flex items-center justify-between">
                           <span>{t("room.label")}</span>
                           <div className="flex w-32 items-center justify-between gap-2 rounded-md border-2">
                              <Button
                                 disabled={Number(rooms) <= 1}
                                 variant={"ghost"}
                                 onClick={() => decrement("rooms")}
                              >
                                 <Minus className="h-3 w-3" />
                              </Button>
                              <span>{rooms}</span>
                              <Button variant={"ghost"} onClick={() => increment("rooms")}>
                                 <Plus className="h-3 w-3" />
                              </Button>
                           </div>
                        </div>
                     </PopoverContent>
                  </Popover>
               </div>

               <Button
                  disabled={isSubmitting}
                  variant={"ghost"}
                  className="text-background bg-main-theme hover:text-background hover:bg-main-theme/80 flex w-full items-center justify-center lg:w-28"
               >
                  <span>{t("search")}</span>
                  <Search className="text-background h-7 w-7" />
               </Button>
            </div>
         </form>
      </Form>
   );
}
