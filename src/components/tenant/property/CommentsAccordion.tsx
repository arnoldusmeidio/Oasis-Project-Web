import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Property } from "@/types/property-types";
import CommentCard from "./CommentCard";

type Props = {
   reviews: Property["reviews"];
};

export default function CommentsAccordion({ reviews }: Props) {
   return (
      <Accordion type="single" collapsible className="w-full">
         <AccordionItem value="item-1">
            <AccordionTrigger>Reviews</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-2">
               {reviews.length > 0
                  ? reviews.map((review, idx) => <CommentCard key={review.id} review={review} />)
                  : "No reviews yet"}
            </AccordionContent>
         </AccordionItem>
      </Accordion>
   );
}
