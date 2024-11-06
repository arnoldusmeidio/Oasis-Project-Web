import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// Define all props you intend to pass to PropertyCard
interface PropertyCardProps {
   name: string;
   address: string;
   description: string;
   category: string;
   pictureUrls: string[]; // Array of image URLs
}

const PropertyCard: React.FC<PropertyCardProps> = ({ name, address, description, category, pictureUrls }) => {
   const mainImageUrl = pictureUrls.length > 0 ? pictureUrls[0] : "/default-image.jpg"; // fallback if no image

   return (
      <Card className="w-full max-w-xs overflow-hidden shadow-lg">
         <div className="relative h-48 w-full">
            <Image src={mainImageUrl} alt={name} layout="fill" objectFit="cover" />
            <Badge className="absolute left-2 top-2">{category}</Badge>
         </div>
         <CardContent>
            <CardHeader>
               <CardTitle>{name}</CardTitle>
               <CardDescription>{address}</CardDescription>
            </CardHeader>
            <p className="mt-2 text-sm text-gray-700">{description}</p>
            <div className="mt-2 flex items-center justify-between">
               <Button size="sm">View Details</Button>
            </div>
         </CardContent>
      </Card>
   );
};

export default PropertyCard;
