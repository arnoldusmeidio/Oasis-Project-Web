import { Skeleton } from "./ui/skeleton";

export default function PropertySkeleton() {
   return (
      <>
         <div className="mx auto w-full max-w-7xl px-8">
            <Skeleton className="h-[300px] w-full max-w-[80rem] rounded-lg lg:h-[400px] xl:h-[500px] 2xl:h-[600px]" />
            <div className="my-4 flex flex-col gap-4 lg:flex-row">
               <div className="w-full flex-col space-y-4 lg:w-2/3 lg:pr-4">
                  <Skeleton className="h-[100px] w-full max-w-[80rem] rounded-lg" />
                  {[...Array(3)].map((_, idx) => (
                     <Skeleton key={idx} className="h-[300px] w-full max-w-[80rem] rounded-lg lg:h-[400px]" />
                  ))}
               </div>
               <Skeleton className="h-[300px] w-full max-w-[80rem] rounded-lg lg:mt-0 lg:h-[400px] lg:w-1/3" />
            </div>
         </div>
      </>
   );
}
