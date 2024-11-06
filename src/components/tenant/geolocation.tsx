"use client";

import { useState, useEffect, useRef } from "react";
import { AdvancedMarker, Pin, useMap } from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import type { Marker } from "@googlemaps/markerclusterer";

export default function Places() {
   const [places, setPlaces] = useState<{ id: string; latitude: number; longitude: number }[]>([]);
   const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});

   const clusterer = useRef<MarkerClusterer | null>(null);

   const map = useMap();

   useEffect(() => {
      if (!map) return;
      if (!clusterer.current) {
         clusterer.current = new MarkerClusterer({ map });
      }
   }, [map]);

   useEffect(() => {
      clusterer.current?.clearMarkers();
      clusterer.current?.addMarkers(Object.values(markers));
   }, [markers]);

   useEffect(() => {
      async function getPlaces() {
         try {
            const response = await fetch("http://localhost:8000//api/v1/property");
            const { data } = await response.json();
            setPlaces(data);
         } catch (error) {
            console.error(error);
         }
      }

      getPlaces();
   }, []);

   function setMarkerRef(marker: Marker | null, key: string) {
      if (marker && markers[key]) return;
      if (!marker && !markers[key]) return;

      setMarkers((prev) => {
         if (marker) {
            return { ...prev, [key]: marker };
         } else {
            const newMarkers = { ...prev };
            delete newMarkers[key];
            return newMarkers;
         }
      });
   }

   function handleClick(e: google.maps.MapMouseEvent) {
      if (!map) return;
      if (!e.latLng) return;
      map.panTo(e.latLng);
      map.setZoom(25);
   }

   return (
      <>
         {places &&
            places.map((place) => (
               <AdvancedMarker
                  key={place.id}
                  position={{ lat: place.latitude, lng: place.longitude }}
                  clickable={true}
                  onClick={handleClick}
                  ref={(marker) => setMarkerRef(marker, place.id)}
               >
                  <Pin background={"#AB12CD"} glyphColor={"#FFF"} />
               </AdvancedMarker>
            ))}
      </>
   );
}
