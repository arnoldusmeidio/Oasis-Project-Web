import { Property } from "@/types/property-types";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

type Props = {
   property: Property;
};

export default function PropertyPicturesCarousel({ property }: Props) {
   return (
      <>
         {property.propertyPictures?.length > 1 ? (
            // Carousel Display for Multiple Images
            <Carousel
               className="w-full rounded-lg shadow-md"
               plugins={[
                  Autoplay({
                     delay: 5000,
                  }),
               ]}
            >
               <CarouselContent>
                  {property.propertyPictures.map((picture, index) => (
                     <CarouselItem key={index}>
                        <div>
                           <Image
                              src={picture.url || "/placeholder.jpg"}
                              alt={`Property picture ${index + 1}`}
                              width={1500}
                              height={1000}
                              className="w-full rounded-lg object-cover"
                           />
                        </div>
                     </CarouselItem>
                  ))}
               </CarouselContent>
            </Carousel>
         ) : (
            // Single Card Display
            <Image
               src={property.propertyPictures[0]?.url || "/placeholder.jpg"}
               alt="Property picture"
               width={1500}
               height={1000}
               className="w-full rounded-lg object-cover"
            />
         )}
      </>
   );
}
