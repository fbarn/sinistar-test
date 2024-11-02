import { useEffect } from 'react';
import {
  useMap,
} from '@vis.gl/react-google-maps';

interface MapHandlerProps {
  place: google.maps.places.PlaceResult | null;
  marker: google.maps.marker.AdvancedMarkerElement | null;
}

function MapHandler({ place }: MapHandlerProps) {
  const map = useMap();

  useEffect(() => {
    if (!map || !place) return;

    if (place.geometry?.viewport) {
      map.fitBounds(place.geometry?.viewport);
    }
  }, [map, place]);

  return null;
};


export default MapHandler;
