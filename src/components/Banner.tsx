import * as React from "react";
import EmblaCarousel from "@/components/ui/carousel/EmblaCarousel";
import { EmblaOptionsType } from "embla-carousel";
import { Property } from "@/types/property-types";
const OPTIONS: EmblaOptionsType = { loop: true, duration: 30 };

interface Props {
   properties: Property[];
}

export default function Banner({ properties }: Props) {
   return (
      <div>
         <EmblaCarousel properties={properties} options={OPTIONS} />
      </div>
   );
}
