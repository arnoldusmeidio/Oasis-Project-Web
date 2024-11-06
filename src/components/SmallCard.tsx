import Image from "next/image";

interface Props {
   img: string;
   location: string;
}

export default function SmallCard({ img, location }: Props) {
   return (
      <div className="hover:bg-secondary m-2 mt-5 flex cursor-pointer items-center gap-2 rounded-xl transition-transform duration-200 ease-out hover:scale-105">
         {/* Left */}
         <div className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 xl:h-28 xl:w-28">
            <Image className="rounded-lg" src={img} alt={location} width={375} height={375} />
         </div>

         {/* Right */}
         <div>
            <h3 className="font-semibold">{location}</h3>
         </div>
      </div>
   );
}
