import { Property } from "@/types/property-types";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

type Props = {
   room: Property["room"][number];
};

export default function RoomPicturesCarousel({ room }: Props) {
   return (
      <>
         {room.roomPictures.length > 1 ? (
            <Carousel
               className="w-full rounded-lg pt-5 shadow-md"
               plugins={[
                  Autoplay({
                     delay: 5000,
                  }),
               ]}
            >
               <CarouselContent>
                  {room.roomPictures.map((pic, i) => (
                     <CarouselItem key={i}>
                        <Image
                           src={pic.url || "/placeholder.jpg"}
                           alt={`Room picture ${i + 1}`}
                           width={1500}
                           height={1000}
                           className="h-60 w-full rounded-lg object-cover"
                        />
                     </CarouselItem>
                  ))}
               </CarouselContent>
            </Carousel>
         ) : (
            <Image
               src={room.roomPictures[0]?.url || "/placeholder.jpg"}
               alt="Room picture"
               width={1500}
               height={1000}
               className="h-60 w-full rounded-lg object-cover pt-5"
            />
         )}
      </>
   );
}
