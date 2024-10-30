import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps';
import Box from '@mui/material/Box';

function APIMap() {

  return (
    <Box
      position={'absolute'}
      sx={{ top: 0, bottom: 0, left: 0, right: 0, zIndex: -1 }}>

      <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string}>
        <Map
          defaultCenter={{ lat: 45.0019088, lng: -76.2177276 }}
          minZoom={4}
          defaultZoom={6}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
        />
      </APIProvider>
    </Box>
  )
}

export default APIMap;
