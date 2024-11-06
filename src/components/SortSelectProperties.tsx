import * as React from "react";
import {
   Select,
   SelectContent,
   SelectGroup,
   SelectItem,
   SelectLabel,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface SortSelectProps {
   sortField: string;
   sortOrder: "asc" | "desc";
   onSortFieldChange: (value: string) => void;
   onSortOrderChange: (value: "asc" | "desc") => void;
}

export default function SortSelect({ sortField, sortOrder, onSortFieldChange, onSortOrderChange }: SortSelectProps) {
   const [tempSortField, setTempSortField] = useState<string>("name");
   const [tempSortOrder, setTempSortOrder] = useState<"asc" | "desc">("asc");

   return (
      <div className="flex flex-col gap-3">
         <h3 className="font-bold">Sort by</h3>

         <div className="flex w-full justify-between gap-3">
            {/* Sort Field Select */}
            <Select value={sortField} onValueChange={onSortFieldChange}>
               <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sort by" />
               </SelectTrigger>
               <SelectContent>
                  <SelectGroup>
                     <SelectLabel>Sort by</SelectLabel>
                     <SelectItem value="name">Name</SelectItem>
                     <SelectItem value="price">Price</SelectItem>
                  </SelectGroup>
               </SelectContent>
            </Select>

            {/* Sort Order Select */}
            <Select value={sortOrder} onValueChange={(value) => onSortOrderChange(value as "asc" | "desc")}>
               <SelectTrigger className="w-full">
                  <SelectValue placeholder="Order" />
               </SelectTrigger>
               <SelectContent>
                  <SelectGroup>
                     <SelectLabel>Order</SelectLabel>
                     <SelectItem value="asc">Ascending</SelectItem>
                     <SelectItem value="desc">Descending</SelectItem>
                  </SelectGroup>
               </SelectContent>
            </Select>
         </div>
      </div>
   );
}
