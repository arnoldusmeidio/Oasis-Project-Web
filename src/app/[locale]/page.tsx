"use client";

import { useUserStore } from "@/stores/useUserStore";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Link, useRouter } from "@/i18n/routing";
import { toast } from "sonner";
import SearchNavbar from "@/components/header/SearchNavbar";
import Banner from "@/components/Banner";
import SmallCard from "@/components/SmallCard";
import { exploreData } from "@/static-db";
import MediumCard from "@/components/MediumCard";
import Footer from "@/components/Footer";
import { useTranslations } from "next-intl";
import MainMap from "@/components/user/userGeolocation";

import HomeSkeleton from "@/components/HomeSkeleton";
import { Property } from "@/types/property-types";

export default function Home() {
   const t = useTranslations("HomePage");
   const [isLoading, setIsLoading] = useState(true);
   const [properties, setProperties] = useState<Property[]>([]);
   const { user, setUser } = useUserStore();
   const searchParams = useSearchParams();
   const successMessage = searchParams.get("success");

   const router = useRouter();

   // default search date
   const defaultCheckin = new Date(new Date().setHours(0, 0, 0, 0));
   const defaultCheckout = new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(0, 0, 0, 0));

   const checkin_monthday = defaultCheckin.getDate().toString();
   const checkin_month = (defaultCheckin.getMonth() + 1).toString();
   const checkin_year = defaultCheckin.getFullYear().toString();
   const checkout_monthday = defaultCheckout.getDate().toString();
   const checkout_month = (defaultCheckout.getMonth() + 1).toString();
   const checkout_year = defaultCheckout.getFullYear().toString();

   const checkin = `${checkin_year}-${checkin_month}-${checkin_monthday}`;
   const checkout = `${checkout_year}-${checkout_month}-${checkout_monthday}`;

   useEffect(() => {
      const fetchData = async () => {
         try {
            setIsLoading(true);

            // Fetch user and properties concurrently
            const [userResponse, propertiesResponse] = await Promise.all([
               fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/users`, { credentials: "include" }),
               fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/property/popular`, { credentials: "include" }),
            ]);

            const userData = await userResponse.json();
            const propertiesData = await propertiesResponse.json();

            if (!userData.ok) {
               console.error(userData.message);
            } else {
               setUser(userData.data);
               if (!userData.data.tenant && !userData.data.customer) {
                  router.push("/select-role");
                  router.refresh();
               }
               if (successMessage) {
                  toast(successMessage, { duration: 1500 });
               }
            }

            if (!propertiesData.ok) {
               toast.error(propertiesData.message);
            } else {
               setProperties(propertiesData.data);
            }
         } catch (error) {
            console.error(error);
            toast.error("Something went wrong!");
         } finally {
            setIsLoading(false); // Set loading state only once, at the end
         }
      };

      fetchData();
   }, [successMessage]);

   return (
      <>
         <SearchNavbar />
         <main className="bg-background mt-4 flex h-full min-h-screen flex-col items-center justify-center px-4">
            {isLoading ? (
               <HomeSkeleton />
            ) : (
               <>
                  <Banner properties={properties} />
                  <div className="mx auto mt-2 w-full max-w-7xl px-8 sm:px-16">
                     <section className="w-full justify-start pt-6">
                        <h2 className="pb-5 text-3xl font-semibold sm:text-4xl">{t("explore")}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-4">
                           {exploreData?.map((item, idx) => (
                              <Link
                                 key={idx}
                                 href={`/search?location=${item.location}&group_adults=1&group_children=0&no_rooms=1&checkin=${checkin}&checkout=${checkout}`}
                              >
                                 <SmallCard img={item.img} location={item.location} />
                              </Link>
                           ))}
                        </div>
                     </section>

                     <section className="mt-4">
                        <h2 className="py-8 pb-5 text-3xl font-semibold sm:text-4xl">{t("popular")}</h2>
                        <div className="mb-4 grid grid-cols-1 items-center gap-8 align-middle sm:grid-cols-2 lg:grid-cols-3">
                           {properties?.map((item) => (
                              <Link key={item.id} href={`/search/property/${item.id}`}>
                                 <MediumCard
                                    img={item.propertyPictures?.[0]?.url}
                                    propertyName={item.name}
                                    location={item.city}
                                    rating={item.averageRating.star}
                                 />
                              </Link>
                           ))}
                        </div>
                     </section>
                     <h2 className="py-8 pb-5 text-3xl font-semibold sm:text-4xl">{t("map")}</h2>
                     <div className="relative mb-4 h-96 w-full rounded-lg">
                        <MainMap />
                     </div>
                  </div>
               </>
            )}
         </main>
         <Footer />
      </>
   );
}
