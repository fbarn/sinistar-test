import Box from '@mui/material/Box';

import { Map } from '@vis.gl/react-google-maps';

function APIMap() {

  return (
    <Box
      position={'absolute'}
      sx={{ top: 0, bottom: 0, left: 0, right: 0, zIndex: -1 }}>

      <Map
        defaultCenter={{ lat: 45.0019088, lng: -76.2177276 }}
        minZoom={4}
        defaultZoom={6}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
      />
    </Box>
  )
}

export default APIMap;
