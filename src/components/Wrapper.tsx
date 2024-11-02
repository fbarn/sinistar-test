import React from 'react';

import Box from '@mui/material/Box';

import Header from './Header/Header';
import APIMap from './Map/APIMap';

function Wrapper() {
  const [location, setLocation] = React.useState<google.maps.GeocoderGeometry | null>(null);
  return (
    <div>
      <Header height='64px' onSearchChange={setLocation} />
      <Box
        height='calc(100%-64px)'
      >
        <APIMap geometry={location} />
      </Box>
    </div>
  );
}

export default Wrapper;
