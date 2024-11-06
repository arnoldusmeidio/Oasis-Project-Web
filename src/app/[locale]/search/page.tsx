"use client";

import SearchNavbar from "@/components/header/SearchNavbar";
import SearchSkeleton from "@/components/SearchSkeleton";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useEffect, useState } from "react";
import { currency } from "@/helpers/currency";
import { useUserStore } from "@/stores/useUserStore";
import { Property } from "@/types/property-types";
import { toast } from "sonner";
import FormError from "@/components/FormError";
import useCurrencyStore from "@/stores/useCurrencyStore";
import PaginationComponent from "@/components/tenant/Pagination-button";
import Footer from "@/components/Footer";
import SortSelect from "@/components/SortSelectProperties";
import { Button } from "@/components/ui/button";
import CategoryFilter from "@/components/FilterCategoryProperties";
import { getRatingDescription } from "@/helpers/rating-description";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

type Props = {
   searchParams: SearchParams;
};

type SearchParams = {
   location: string;
   group_adults: string;
   group_children: string;
   no_rooms: string;
   checkin: string;
   checkout: string;
};

interface Paginations {
   currentPage: number;
   totalPages: number;
   totalProperties: number;
}

export default function SearchPage({ searchParams }: Props) {
   const [properties, setProperties] = useState<Property[]>([]);
   const [totalPropertiesFound, setTotalPropertiesFound] = useState(0);
   const [sortField, setSortField] = useState<string>("price");
   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
   const [tempSortField, setTempSortField] = useState<string>("price");
   const [tempSortOrder, setTempSortOrder] = useState<"asc" | "desc">("asc");
   const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [currencyLoading, setCurrencyLoading] = useState(true);
   const { user } = useUserStore();
   const [page, setPage] = useState<Paginations>();
   const { currencyRate, error, getCurrencyRate } = useCurrencyStore();
   const totalPerson = Number(searchParams.group_adults) + Number(searchParams.group_children);

   const searchedQueries = `?location=${searchParams.location}&group_adults=${searchParams.group_adults}&group_children=${searchParams.group_children}&checkin=${searchParams.checkin}&checkout=${searchParams.checkout}`;

   async function getProperties(pages = 1, sortBy = sortField, order = sortOrder, categories: string[] = []) {
      try {
         setIsLoading(true);
         const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/property/search?page=${pages}&location=${searchParams.location}&totalperson=${totalPerson}&checkin=${searchParams.checkin}&checkout=${searchParams.checkout}&roomsrequired=${searchParams.no_rooms}&sortBy=${sortBy}&order=${order}&categories=${categories.join(`,`)}`,
            {
               credentials: "include",
            },
         );
         const data = await response.json();
         if (data.ok) {
            setProperties(data.data);
            setPage(data.meta);
            setTotalPropertiesFound(data.meta.totalProperties);
            setIsLoading(false);
         }
      } catch (error) {
         console.error(error);
         toast.error("Something went wrong!");
         setIsLoading(false);
      }
   }

   const handleSearchClick = () => {
      setSortField(tempSortField);
      setSortOrder(tempSortOrder);
      getProperties(1, tempSortField, tempSortOrder, selectedCategories);
   };

   const handlePageChange = (newPage: number) => {
      getProperties(newPage, sortField, sortOrder, selectedCategories);
      window.scrollTo({ top: 0, behavior: "smooth" });
   };

   const handleCategoryChange = (categories: string[]) => {
      setSelectedCategories(categories);
   };

   useEffect(() => {
      getProperties();
      if (user?.currency && user.currency != "IDR") {
         setCurrencyLoading(true);
         getCurrencyRate();
         setCurrencyLoading(false);
      } else {
         setCurrencyLoading(false);
      }
   }, [user?.currency, getCurrencyRate, searchParams]);

   if (error)
      return (
         <>
            <main className="bg-background flex h-full min-h-screen w-full min-w-full flex-col items-center justify-center">
               <div className="max-w-[500px] justify-self-center">
                  <FormError message={error} />
               </div>
            </main>
         </>
      );

   return (
      <>
         <SearchNavbar />
         {isLoading || currencyLoading ? (
            <SearchSkeleton />
         ) : (
            <main className="bg-background flex h-full min-h-screen w-full flex-col items-center">
               <div className="mx-auto w-full max-w-7xl p-6 lg:px-8">
                  <div className="flex flex-col justify-between min-[500px]:flex-row">
                     <div>
                        <h2 className="pb-3 text-3xl font-bold">Your Search Results</h2>

                        <h3 className="pb-3">
                           Dates of trips
                           <span className="ml-2 italic">
                              {searchParams.checkin} to {searchParams.checkout}
                           </span>
                        </h3>
                     </div>

                     <Popover modal={false}>
                        <PopoverTrigger asChild>
                           <Button variant="outline" className="w-full self-center min-[500px]:w-[170px]">
                              Sort and Filter
                           </Button>
                        </PopoverTrigger>
                        <PopoverContent className="flex w-[325px] flex-col gap-6 min-[500px]:mr-6 lg:mr-8 xl:mr-4">
                           {/* SortSelect Component */}
                           <SortSelect
                              sortField={tempSortField}
                              sortOrder={tempSortOrder}
                              onSortFieldChange={setTempSortField}
                              onSortOrderChange={setTempSortOrder}
                           />
                           <CategoryFilter
                              selectedCategories={selectedCategories}
                              onCategoryChange={handleCategoryChange}
                           />

                           {/* Search Button */}
                           <Button type="button" onClick={handleSearchClick}>
                              Search
                           </Button>
                        </PopoverContent>
                     </Popover>
                  </div>

                  <hr className="mb-5" />

                  <h3 className="text-xl font-semibold">
                     {searchParams.location}: {totalPropertiesFound} properties found
                  </h3>
                  <div className="search-result mt-5 space-y-2">
                     {properties.map((item, idx: number) => (
                        <div key={idx} className="flex justify-between space-x-4 space-y-2 rounded-lg border p-5">
                           <div className="h-auto w-64 content-center max-sm:basis-1/2">
                              <Link href={`/search/property/${item.id}${searchedQueries}`}>
                                 <AspectRatio ratio={1 / 1}>
                                    <Image
                                       className="rounded-lg object-cover"
                                       src={item.propertyPictures?.[0]?.url}
                                       alt="image of property"
                                       loading="lazy"
                                       fill
                                       sizes="max-width: 256px"
                                    />
                                 </AspectRatio>
                              </Link>
                           </div>

                           <div className="flex flex-1 flex-col justify-around gap-2 max-sm:basis-1/2 sm:flex-row sm:justify-between sm:space-x-5">
                              <div className="flex flex-col gap-2">
                                 <Link
                                    href={`/search/property/${item.id}${searchedQueries}`}
                                    className="text-base font-bold text-[#1a61ef] hover:underline md:text-xl lg:text-2xl"
                                 >
                                    {item.name}
                                 </Link>
                                 <Badge className="w-fit bg-blue-100 text-blue-800 hover:bg-blue-100">
                                    {item.category}
                                 </Badge>
                                 <p className="hidden text-xs sm:flex lg:text-base">{item.description}</p>
                              </div>

                              <div className="flex flex-col justify-between gap-2">
                                 <div className="flex items-center gap-2 sm:items-start sm:justify-end sm:space-x-2 sm:text-right">
                                    <div className="items-start gap-2 max-sm:order-2 max-sm:items-center sm:flex sm:flex-col sm:items-end">
                                       <p className="text-xs sm:font-bold md:text-sm lg:text-base">
                                          {item.reviews.length > 0
                                             ? getRatingDescription(
                                                  item.reviews.reduce((acc: number, review) => {
                                                     return acc + review.star;
                                                  }, 0) / item.reviews.length,
                                               )
                                             : null}
                                       </p>
                                       <p className="text-xs sm:flex md:text-sm lg:text-base">
                                          {item.reviews.length > 0 && `${item.reviews.length} reviews`}
                                       </p>
                                    </div>
                                    <p className="text-background flex-shink-0 flex h-8 w-8 items-center justify-center rounded-lg bg-[#1a61ef] text-sm font-bold max-sm:order-1 lg:h-12 lg:w-12 lg:text-lg">
                                       {item.reviews.length > 0
                                          ? (
                                               item.reviews.reduce((acc: number, review) => {
                                                  return acc + review.star;
                                               }, 0) / item.reviews.length
                                            ).toFixed(1)
                                          : "N/A"}
                                    </p>
                                 </div>

                                 <div className="flex flex-col gap-2 sm:text-right">
                                    <p className="text-xs md:text-sm lg:text-base">
                                       capacity: {item.room?.[0]?.roomCapacity} persons
                                    </p>
                                    <div>
                                       <p className="text-xs md:text-sm lg:text-base">Price per night starts from:</p>
                                       <p className="font-bold md:text-xl lg:text-2xl">
                                          {!currencyRate
                                             ? currency(item.room?.[0]?.defaultPrice, "IDR", 1)
                                             : currency(item.room?.[0]?.defaultPrice, user?.currency, currencyRate)}
                                       </p>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     ))}
                     {page && (
                        <div className="my-10">
                           <PaginationComponent
                              currentPage={page.currentPage}
                              totalPages={page.totalPages}
                              onPageChange={handlePageChange}
                           />
                        </div>
                     )}
                  </div>
               </div>
            </main>
         )}
         <Footer />
      </>
   );
}
