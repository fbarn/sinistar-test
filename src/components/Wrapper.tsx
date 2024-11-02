import React from 'react';

import Box from '@mui/material/Box';

import Header from './Header/Header';
import APIMap from './Map/APIMap';

import data from 'data/database.json'
import { Home, WeightContext } from 'shared/lib/types';

function Wrapper() {
  const [location, setLocation] = React.useState<google.maps.GeocoderGeometry | null>(null);
  const [distanceWeight, setDistanceWeight] = React.useState<number>(50);
  const [reviewWeight, setReviewWeight] = React.useState<number>(50);
  const [responseWeight, setResponseWeight] = React.useState<number>(50);
  const [flexibilityWeight, setFlexibilityWeight] = React.useState<number>(50);
  const weightContext: WeightContext = {
    distanceWeight: distanceWeight,
    setDistanceWeight: setDistanceWeight,
    reviewWeight: reviewWeight,
    setReviewWeight: setReviewWeight,
    responseWeight: responseWeight,
    setResponseWeight: setResponseWeight,
    flexibilityWeight: flexibilityWeight,
    setFlexibilityWeight: setFlexibilityWeight,
  }
  const [homes, setHomes] = React.useState<Home[]>(data)
  return (
    <div>
      <Header
        height='64px'
        onSearchChange={setLocation}
        weightContext={weightContext} />
      <Box
        height='calc(100%-64px)'
      >
        <APIMap homes={homes} geometry={location} />
      </Box>
    </div>
  );
}

export default Wrapper;
