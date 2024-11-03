import React from 'react';

import Box from '@mui/material/Box';

import Header from './Header/Header';
import APIMap from './Map/APIMap';

import data from 'data/database.json'
import { Home, WeightContext } from 'shared/lib/types';
import { getMaxCloseness, quickSort, getHomeScore } from 'utils/quickSort';

function Wrapper() {
  const [selectedLocation, setSelectedLocation] = React.useState<google.maps.GeocoderGeometry | null>(null);
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
  const sortHomes = () => {
    if (selectedLocation === null)
      return;
    quickSort(homes, {
      selectedLocation: selectedLocation,
      distanceWeight: distanceWeight / getMaxCloseness(homes, selectedLocation),
      reviewWeight: reviewWeight / 5,
      responseWeight: responseWeight,
      flexibilityWeight: flexibilityWeight,
    });
    setHomes([...homes]);
    // for (let i = 0; i < homes.length; i++) {
    //   console.log(homes[i]);
    //   console.log(getHomeScore(homes[i], {
    //     selectedLocation: selectedLocation,
    //     distanceWeight: distanceWeight / getMaxCloseness(homes, selectedLocation),
    //     reviewWeight: reviewWeight / 5,
    //     responseWeight: responseWeight,
    //     flexibilityWeight: flexibilityWeight,
    //   }));
    // }
    // console.log(homes);
    // console.log(weightContext);
  }
  return (
    <div>
      <Header
        height='64px'
        weightContext={weightContext}
        disabled={selectedLocation === null}
        onSort={sortHomes}
        onSearchChange={setSelectedLocation} />
      <Box
        height='calc(100%-64px)'
      >
        <APIMap homes={homes} geometry={selectedLocation} />
      </Box>
    </div>
  );
}

export default Wrapper;
