import React, { useMemo } from "react";
import { Source, Layer, Marker } from "react-map-gl";
import { LngLat } from "mapbox-gl";
import { Polygon as GeoJSONPolygon } from "geojson";

import "mapbox-gl/dist/mapbox-gl.css";

type Props = {
  id: string;
  lngLats: LngLat[];
  fillColor?: string;
  strokeColor?: string;
  markerColor?: string;
};

export default function LngLatPolygon({
  id,
  lngLats,
  fillColor,
  strokeColor,
  markerColor,
}: Props) {
  const geoJson = useMemo((): GeoJSONPolygon => {
    const pointArray = lngLats.map((point) => {
      return [point.lng, point.lat];
    });
    // per the geo json spec, the first and last point must be the same
    pointArray.push(pointArray[0]);
    return {
      type: "Polygon" as const,
      coordinates: [pointArray],
    };
  }, [lngLats]);

  let polygonContent;
  if (lngLats.length < 3) {
    polygonContent = null;
  } else {
    polygonContent = (
      <Source id={id} type="geojson" data={geoJson}>
        <Layer
          id={id + "fill"}
          type="fill"
          paint={{
            "fill-color": fillColor ?? "#0080ff", // blue color fill
            "fill-opacity": 0.5,
          }}
        />
        <Layer
          id={id + "outline"}
          type="line"
          paint={{
            "line-color": strokeColor ?? "#000",
            "line-width": 2,
          }}
        />
      </Source>
    );
  }

  return (
    <>
      {polygonContent}
      {lngLats.map((point, index) => {
        return (
          <Marker
            key={`${id}-${index}`}
            latitude={point.lat}
            longitude={point.lng}
            draggable
            color={markerColor}
          />
        );
      })}
    </>
  );
}
