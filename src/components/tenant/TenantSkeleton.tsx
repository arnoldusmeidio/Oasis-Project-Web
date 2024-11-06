import { Skeleton } from "../ui/skeleton";

export default function TenantSkeleton() {
   return (
      <>
         <Skeleton className="h-[300px] w-full max-w-[80rem] rounded-lg sm:h-[400px] lg:h-[500px] xl:h-[600px] 2xl:h-[700px]" />
         <div className="mx auto mt-4 w-full max-w-7xl px-8 sm:px-16">
            <section className="w-full justify-start pt-6">
               <Skeleton className="mb-6 h-[60px] w-[260px]" />
               <div className="mb-6 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-4">
                  {[...Array(8)].map((_, idx) => (
                     <Skeleton
                        key={idx}
                        className="m-2 flex h-16 w-full items-center gap-2 rounded-xl sm:h-20 lg:h-24 xl:h-28"
                     />
                  ))}
               </div>
            </section>
         </div>
      </>
   );
}
