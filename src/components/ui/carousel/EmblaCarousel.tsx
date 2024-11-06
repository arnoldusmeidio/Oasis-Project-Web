import React from "react";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import Fade from "embla-carousel-fade";
import { NextButton, PrevButton, usePrevNextButtons } from "./EmblaCarouselArrowButtons";
import { DotButton, useDotButton } from "./EmblaCarouselDotButton";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { Property } from "@/types/property-types";
import { Link } from "@/i18n/routing";

type PropType = {
   properties: Property[];
   options?: EmblaOptionsType;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
   const { properties, options } = props;
   const [emblaRef, emblaApi] = useEmblaCarousel(options, [
      Fade() as any,
      Autoplay({ playOnInit: true, stopOnMouseEnter: true, stopOnInteraction: false, delay: 5000 }),
   ]);

   const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);

   const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi);

   return (
      <div className="embla h-auto">
         <div className="embla__viewport" ref={emblaRef}>
            <div className="embla__container">
               {properties?.map((item) => (
                  <Link
                     href={`/search/property/${item.id}`}
                     className="embla__slide relative h-[300px] sm:h-[400px] lg:h-[500px] xl:h-[600px] 2xl:h-[700px]"
                     key={item.id}
                  >
                     <Image
                        className="embla__slide__img"
                        src={item.propertyPictures?.[0]?.url}
                        alt="Your alt text"
                        width={1920}
                        height={1080}
                     />
                     <div className="text-background text-shadow bg-foreground/30 absolute left-10 top-5 flex flex-col gap-2 rounded-2xl p-2 align-middle lg:left-16 lg:top-10">
                        <div className="flex flex-col">
                           <span className="text-xs sm:text-base md:text-lg lg:text-xl">{item.name}</span>
                           <span className="text-xs lg:text-base">{item.city}</span>
                        </div>
                        <span className="text-xs lg:text-sm">Rating: {item.averageRating?.star.toFixed(1)} / 10</span>
                     </div>
                  </Link>
               ))}
            </div>
         </div>

         <div className="embla__controls">
            <div className="embla__buttons">
               <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
               <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
            </div>

            <div className="embla__dots">
               {scrollSnaps.map((_, index) => (
                  <DotButton
                     key={index}
                     onClick={() => onDotButtonClick(index)}
                     className={"embla__dot".concat(index === selectedIndex ? `${" "}embla__dot--selected` : "")}
                  />
               ))}
            </div>
         </div>
      </div>
   );
};

export default EmblaCarousel;
