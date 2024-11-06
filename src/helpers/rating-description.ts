export function getRatingDescription(rating: number) {
   if (rating < 1 || rating > 10) {
      return "Invalid rating";
   }
   if (rating >= 1 && rating <= 2) {
      return "Very Bad";
   } else if (rating >= 3 && rating <= 4) {
      return "Poor";
   } else if (rating > 4 && rating <= 6) {
      return "Average";
   } else if (rating > 6 && rating <= 8) {
      return "Good";
   } else if (rating > 8 && rating <= 9) {
      return "Excellent";
   } else if (rating > 9 && rating <= 10) {
      return "Exceptional";
   }
}
