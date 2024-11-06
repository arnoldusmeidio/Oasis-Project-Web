"use client";

import { useMap } from "@vis.gl/react-google-maps";

export default function CurrentLocButton({ userLoc }: { userLoc: { lat: number; lng: number } }) {
   const map = useMap();

   function handleClick() {
      if (map && userLoc) {
         map.panTo(userLoc);
         map.setZoom(15);
      }
   }

   return (
      <button
         onClick={handleClick}
         className="fixed bottom-5 left-0 right-0 mx-auto w-fit rounded-md bg-white px-4 py-2 font-semibold shadow-md"
      >
         Current Location
      </button>
   );
}
