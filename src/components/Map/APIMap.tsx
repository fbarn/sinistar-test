import React from 'react';
import { Box } from '@mui/material';

import { AdvancedMarker, Map, Pin, useMap, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';
import { Home } from 'shared/lib/types';


interface APIMapProps {
  geometry: google.maps.GeocoderGeometry | null;
  homes: Home[] | null;
}

function APIMap({ geometry, homes }: APIMapProps) {

  const map = useMap()
  const [markerRef, marker] = useAdvancedMarkerRef();

  React.useEffect(() => {
    if (!map || !geometry || !marker) return;

    if (geometry?.viewport) {
      map.fitBounds(geometry?.viewport);
      map.setZoom(12);
    }
    if (geometry?.location) {
      marker.position = geometry?.location;
    }
  }, [map, geometry, marker]);

  return (
    <Box
      position={'absolute'}
      sx={{ top: 0, bottom: 0, left: 0, right: 0, zIndex: -1 }}>

      <Map
        mapId={'663505692a16ecbb'}
        defaultCenter={{ lat: 45.0019088, lng: -76.2177276 }}
        minZoom={4}
        defaultZoom={6}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
      >
        <AdvancedMarker key={'my_home'} ref={markerRef} position={null} />
        {homes?.map(({ latitude, longitude, id }) => (
          <AdvancedMarker
            key={id}
            position={{ lat: latitude, lng: longitude }}
          >
            <Pin
              background={'#edcc1f'}
              glyphColor={'#000'}
              borderColor={'#000'}
            />
          </AdvancedMarker>
        ))}
      </Map>
    </Box >
  )
}

export default APIMap;
