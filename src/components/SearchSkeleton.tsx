import { Skeleton } from "./ui/skeleton";

export default function SearchSkeleton() {
   return (
      <main>
         <div className="mx-auto max-w-7xl">
            <p className="animate-pulse pt-10 text-center font-bold text-[#1a61ef]">
               Sit tight - we are finding you the best deals!
            </p>
         </div>

         <div className="flex justify-center py-5 sm:py-10">
            <div className="h-10 w-10 animate-bounce rounded-full bg-[#1a61ef]"></div>
         </div>

         <div className="space-y-2 p-5">
            {[...Array(5)].map((_, idx) => (
               <div key={idx} className="mx-auto flex max-w-7xl space-x-2 px-6 lg:px-8">
                  <Skeleton className="h-32 w-32 rounded-lg md:h-64 md:w-64" />
                  <Skeleton className="h-32 w-full rounded-lg md:h-64" />
               </div>
            ))}
         </div>
      </main>
   );
}
