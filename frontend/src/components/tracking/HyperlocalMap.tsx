"use client";

import { useEffect, useRef, useState } from "react";
import { importLibrary, setOptions } from "@googlemaps/js-api-loader";

type Point = {
  lat: number;
  lng: number;
  label: string;
};

export type HyperlocalMapProps = {
  merchant?: Point;
  customer?: Point;
  rider?: Point;
  className?: string;
};

export default function HyperlocalMap({ merchant, customer, rider, className = "" }: HyperlocalMapProps) {
  const mapNode = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const routeRef = useRef<google.maps.Polyline | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const points = [merchant, customer, rider].filter(Boolean) as Point[];
    if (!mapNode.current || points.length < 2) return;
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setError("Google Maps is not configured for this deployment.");
      return;
    }

    let cancelled = false;
    setOptions({ key: apiKey, v: "weekly" });
    importLibrary("maps").then(() => {
      if (cancelled || !mapNode.current) return;
      const bounds = new google.maps.LatLngBounds();
      points.forEach((point) => bounds.extend({ lat: point.lat, lng: point.lng }));
      const map = new google.maps.Map(mapNode.current, {
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        clickableIcons: false,
        styles: [
          { elementType: "geometry", stylers: [{ color: "#f1f5f9" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#475569" }] },
          { featureType: "water", elementType: "geometry", stylers: [{ color: "#dbeafe" }] },
        ],
      });
      map.fitBounds(bounds, 52);
      mapRef.current = map;
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = points.map((point, index) => new google.maps.Marker({
        map,
        position: { lat: point.lat, lng: point.lng },
        title: point.label,
        label: { text: String(index + 1), color: "#ffffff", fontWeight: "700" },
      }));
      routeRef.current?.setMap(null);
      routeRef.current = new google.maps.Polyline({
        map,
        path: points.map((point) => ({ lat: point.lat, lng: point.lng })),
        geodesic: true,
        strokeColor: "#0284c7",
        strokeOpacity: 0.9,
        strokeWeight: 4,
      });
    }).catch(() => setError("Google Maps could not be loaded."));

    return () => {
      cancelled = true;
      markersRef.current.forEach((marker) => marker.setMap(null));
      routeRef.current?.setMap(null);
      mapRef.current = null;
    };
  }, [merchant, customer, rider]);

  return <div className={`relative min-h-72 overflow-hidden rounded-[26px] bg-slate-100 ${className}`}><div ref={mapNode} className="h-full min-h-72 w-full" />{error && <div className="absolute inset-0 grid place-items-center bg-slate-100/95 p-6 text-center text-sm font-bold text-slate-500">{error}</div>}</div>;
}
