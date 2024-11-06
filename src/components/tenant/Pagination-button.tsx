"use client";

import { useEffect, useState } from "react";
import {
   Pagination,
   PaginationContent,
   PaginationItem,
   PaginationNext,
   PaginationPrevious,
   PaginationLink,
   PaginationEllipsis,
} from "@/components/ui/pagination";

interface Paginations {
   currentPage: number;
   totalPages: number;
   onPageChange: (page: number) => void;
}

const PaginationComponent: React.FC<Paginations> = ({ currentPage, totalPages, onPageChange }) => {
   const renderPageNumbers = () => {
      const pages = [];

      for (let i = 1; i <= totalPages; i++) {
         if (i === currentPage || i === 1 || i === totalPages) {
            pages.push(
               <PaginationItem key={i}>
                  <PaginationLink
                     onClick={() => onPageChange(i)}
                     className={i === currentPage ? "rouded-lg cursor-pointer border-2" : "cursor-pointer"}
                  >
                     {i}
                  </PaginationLink>
               </PaginationItem>,
            );
         } else if (i === currentPage + 1 || i === currentPage - 1) {
            pages.push(
               <PaginationItem key={i}>
                  <PaginationLink onClick={() => onPageChange(i)}>{i}</PaginationLink>
               </PaginationItem>,
            );
         } else if (i === currentPage - 2 || i === currentPage + 2) {
            pages.push(
               <PaginationItem key={`ellipsis-${i}`}>
                  <PaginationEllipsis />
               </PaginationItem>,
            );
         }
      }
      return pages;
   };

   return (
      <Pagination>
         <PaginationContent>
            <PaginationItem>
               <PaginationPrevious
                  onClick={() => {
                     if (currentPage > 1) {
                        onPageChange(currentPage - 1);
                     }
                  }}
                  className={currentPage <= 1 ? "disabled-button" : "cursor-pointer"}
               />
            </PaginationItem>
            {renderPageNumbers()}
            <PaginationItem>
               <PaginationNext
                  onClick={() => {
                     if (currentPage < totalPages) {
                        onPageChange(currentPage + 1);
                     }
                  }}
                  className={currentPage >= totalPages ? "disabled-button" : "cursor-pointer"}
               />
            </PaginationItem>
         </PaginationContent>
      </Pagination>
   );
};

export default PaginationComponent;
