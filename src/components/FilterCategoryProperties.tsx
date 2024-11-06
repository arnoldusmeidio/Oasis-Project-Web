import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox"; // Adjust the path based on your structure

interface CategoryFilterProps {
   selectedCategories: string[];
   onCategoryChange: (categories: string[]) => void;
}

const categories = ["Villa", "Hotel", "Apartment"]; // Define your available categories

const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategories, onCategoryChange }) => {
   const handleCheckboxChange = (category: string) => {
      if (selectedCategories.includes(category)) {
         // Remove category if already selected
         onCategoryChange(selectedCategories.filter((cat) => cat !== category));
      } else {
         // Add category if not already selected
         onCategoryChange([...selectedCategories, category]);
      }
   };

   return (
      <div className="flex flex-col gap-3">
         <h3 className="font-bold">Filter by Category</h3>
         <div className="flex gap-4">
            {categories.map((category) => (
               <div key={category} className="flex items-center">
                  <Checkbox
                     id={category}
                     checked={selectedCategories.includes(category)}
                     onCheckedChange={() => handleCheckboxChange(category)}
                     className="mr-2"
                  />
                  <label htmlFor={category}>{category}</label>
               </div>
            ))}
         </div>
      </div>
   );
};

export default CategoryFilter;
