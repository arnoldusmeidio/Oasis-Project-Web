"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { AdvancedMarker, Pin, useMap } from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import type { Marker } from "@googlemaps/markerclusterer";
import Image from "next/image";
import Link from "next/link";

interface PropertyPicture {
   id: string;
   url: string;
   createdAt: string;
   updatedAt: string;
   propertyId: string;
}

interface Place {
   propertyPictures: PropertyPicture[]; // <-- should be an array of PropertyPicture objects
   id: string;
   type: string;
   name: string;
   lat: number;
   lng: number;
}

function SelectedPlaceInfo({ place }: { place: Place | undefined }) {
   if (!place) return null;

   const propertyPicture = place.propertyPictures?.[0]?.url; // Access the first picture's URL

   return (
      <AdvancedMarker position={{ lat: place.lat, lng: place.lng }} zIndex={9999999} onClick={() => {}}>
         <div className="-mt-12 rounded-md bg-white shadow-md">
            <div className="relative h-32 w-64 overflow-hidden rounded-t-md">
               {propertyPicture ? (
                  <Image src={propertyPicture} alt={place.name || "Place image"} fill className="object-cover" />
               ) : (
                  <div className="h-full w-full bg-gray-300" />
               )}
            </div>
            <div className="p-4">
               <h2 className="text-base font-semibold">{place.name}</h2>
               <Link
                  href={`/search/property/${place.id}`}
                  className="mt-1 block w-fit rounded-md bg-gray-400 p-2 text-white"
               >
                  See detail
               </Link>
            </div>
         </div>
      </AdvancedMarker>
   );
}

export default function Places() {
   const [places, setPlaces] = useState([]);
   const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
   const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
   const clusterer = useRef<MarkerClusterer | null>(null);
   const markerAnchorRef = useRef<{
      [key: string]: Marker;
   }>({});
   const map = useMap();

   useEffect(() => {
      async function getPlaces() {
         try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/property`);
            const { data } = await response.json();
            setPlaces(data);
         } catch (error) {
            console.error("Error fetching property location:", error);
         }
      }

      getPlaces();
   }, []);

   useEffect(() => {
      if (map && !clusterer.current) {
         clusterer.current = new MarkerClusterer({ map });
         if (Location) {
            map.setCenter(Location as any);
         }
      }
   }, [map]);

   useEffect(() => {
      clusterer.current?.clearMarkers();
      clusterer.current?.addMarkers(Object.values(markers));
   }, [markers]);

   const setMarkerRef = useCallback(
      (marker: Marker | null, key: string) => {
         if (marker && markers[key]) return;
         if (!marker && !markers[key]) return;

         setMarkers((prev) => {
            const newMarkers = { ...prev };
            if (marker) {
               newMarkers[key] = marker;
            } else {
               delete newMarkers[key];
            }
            return newMarkers;
         });

         markerAnchorRef.current[key] = marker as Marker;
      },
      [markers],
   );

   const renderMarkers = useMemo(
      () =>
         places.map((place: Place) => (
            <AdvancedMarker
               key={place.id}
               position={{ lat: place.lat, lng: place.lng }}
               ref={(marker) => setMarkerRef(marker, place.id)}
               onMouseEnter={() => setSelectedPlace(place.id)}
               zIndex={1}
            >
               <Pin
                  glyph={place.type === "HOTEL" ? "🏩" : place.type === "APARTMENT" ? "🏦" : "🏰"}
                  background={"transparent"}
                  borderColor={"transparent"}
                  scale={1.5}
               />
            </AdvancedMarker>
         )),
      [places, setMarkerRef],
   );

   return (
      <div onMouseLeave={() => setSelectedPlace(null)}>
         {renderMarkers}
         {selectedPlace && (
            <SelectedPlaceInfo place={places.find((place: { id: string }) => place.id === selectedPlace)} />
         )}
      </div>
   );
}
