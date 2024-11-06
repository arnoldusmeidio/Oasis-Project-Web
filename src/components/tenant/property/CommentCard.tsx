import { Property } from "@/types/property-types";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
   review: Property["reviews"][number];
};

export default function CommentCard({ review }: Props) {
   return (
      <Card>
         <CardHeader>
            <CardDescription className="text-foreground text-sm">{review.review}</CardDescription>
         </CardHeader>
         <CardFooter className="flex w-full items-end justify-between justify-self-start">
            <div className="flex-col">
               <p>{review.customer.user.name}</p>
               <p className="text-muted-foreground text-xs">{format(review.createdAt, "LLL dd, y")}</p>
            </div>
            <div>
               <span className="text-background flex-shink-0 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold">
                  {review.star.toFixed(1)}
               </span>
            </div>
         </CardFooter>
      </Card>
   );
}
