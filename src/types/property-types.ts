import { ReactNode } from "react";

export enum Category {
   Villa = "Villa",
   Hotel = "Hotel",
   Apartment = "Apartment",
}

export interface Property {
   type: ReactNode;
   defaultPrice: ReactNode;
   roomCapacity: ReactNode;
   roomPictures: any;
   address: string;
   category: Category;
   description: string;
   id: string;
   lat: number;
   lng: number;
   name: string;
   tenantId: string;
   city: string;
   averageRating: { star: number };
   propertyPictures: {
      url: string;
   }[];
   reviews: {
      createdAt: Date;
      bookingId: string;
      customerId: string;
      id: string;
      review: string;
      star: number;
      customer: {
         user: {
            name: string;
         };
      };
   }[];
   room: {
      defaultPrice: number;
      id: string;
      roomCapacity: number;
      type: string;
      roomPrice: {
         price: number;
         startDate: Date;
         endDate: Date;
      }[];
      roomPictures: {
         url: string;
      }[];
      bookings: {
         id: string;
         bookingNumber: string;
         paymentStatus: string;
         paymentType: string;
         startDate: Date;
         endDate: Date;
         amountToPay: number;
         type: string;
         room: {
            price: number;
            type: string;
            description: string;
         };
      }[];
   }[];
}
