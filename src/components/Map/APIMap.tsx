import { useEffect, useState } from "react";
import { Box } from "@mui/material";

import {
  AdvancedMarker,
  ControlPosition,
  Map,
  MapControl,
  Pin,
  useMap,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { Home } from "shared/lib/types";
import MapTable from "./MapTable";

interface APIMapProps {
  searchGeometry: google.maps.GeocoderGeometry | null;
  homes: Home[];
  disabled: boolean;
  onSort: () => void;
}

// The main map component. Contains the map itself, a marker for the
// searched home, as well as markers for all homes in db.
// Container for the table containing available homes.
// Receives the searched location and homes from the parent.
function APIMap({ searchGeometry, homes, disabled, onSort }: APIMapProps) {
  const map = useMap();
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [rowGeometry, setRowGeometry] =
    useState<google.maps.GeocoderGeometry | null>(null);

  // Triggered by search change.
  // Will add a marker to the corresponding location,
  // and perform a not-so-deep zoom on that location
  useEffect(() => {
    if (!map || !searchGeometry || !marker) return;

    if (searchGeometry?.viewport) {
      map.fitBounds(searchGeometry?.viewport);
      map.setZoom(12);
    }
    if (searchGeometry?.location) {
      marker.position = searchGeometry?.location;
    }
  }, [map, searchGeometry, marker]);

  // Triggered by a row in the table being clicked.
  // Will perform a deep zoom onto the location
  // corresponding to the row
  useEffect(() => {
    if (!map || !rowGeometry) return;

    if (rowGeometry?.viewport) {
      map.fitBounds(rowGeometry?.viewport);
    }
  }, [map, rowGeometry]);

  return (
    <Box
      position={"absolute"}
      sx={{ top: 0, bottom: 0, left: 0, right: 0, zIndex: -1 }}
    >
      <Map
        mapId={"663505692a16ecbb"}
        defaultCenter={{ lat: 45.0019088, lng: -76.2177276 }}
        minZoom={4}
        defaultZoom={6}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
      >
        <MapControl position={ControlPosition.LEFT_TOP}>
          <MapTable
            onRowClick={setRowGeometry}
            homes={homes}
            disabled={disabled}
            onSort={onSort}
          />
        </MapControl>

        <AdvancedMarker key={"my_home"} ref={markerRef} position={null} />
        {homes?.map(({ address, city, name, latitude, longitude, id }) => (
          <AdvancedMarker
            key={id}
            position={{ lat: latitude, lng: longitude }}
            title={`${name}\n${address}\n${city}`}
          >
            <Pin
              background={"#edcc1f"}
              glyphColor={"#000"}
              borderColor={"#000"}
            />
          </AdvancedMarker>
        ))}
      </Map>
    </Box>
  );
}

export default APIMap;
