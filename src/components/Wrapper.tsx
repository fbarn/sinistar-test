import { useState } from "react";

import Box from "@mui/material/Box";

import Header from "./Header/Header";
import APIMap from "./Map/APIMap";

import data from "data/database.json";
import { Home, WeightContext } from "shared/lib/types";
import { getMaxDistance, quickSort } from "utils/quickSort";

function Wrapper() {
  const [selectedLocation, setSelectedLocation] =
    useState<google.maps.GeocoderGeometry | null>(null);
  const [distanceWeight, setDistanceWeight] = useState<number>(50);
  const [reviewWeight, setReviewWeight] = useState<number>(50);
  const [responseWeight, setResponseWeight] = useState<number>(50);
  const [flexibilityWeight, setFlexibilityWeight] = useState<number>(50);
  const weightContext: WeightContext = {
    distanceWeight: distanceWeight,
    setDistanceWeight: setDistanceWeight,
    reviewWeight: reviewWeight,
    setReviewWeight: setReviewWeight,
    responseWeight: responseWeight,
    setResponseWeight: setResponseWeight,
    flexibilityWeight: flexibilityWeight,
    setFlexibilityWeight: setFlexibilityWeight,
  };
  const [homes, setHomes] = useState<Home[]>(data);
  const sortHomes = () => {
    if (selectedLocation === null) return;
    quickSort(homes, {
      selectedLocation: selectedLocation,
      maxDistance: getMaxDistance(homes, selectedLocation),
      distanceWeight: distanceWeight,
      reviewWeight: reviewWeight / 5,
      responseWeight: responseWeight,
      flexibilityWeight: flexibilityWeight,
    });
    setHomes([...homes]);
  };
  return (
    <div>
      <Header
        height="64px"
        weightContext={weightContext}
        disabled={selectedLocation === null}
        onSort={sortHomes}
        onSearchChange={setSelectedLocation}
      />
      <Box height="calc(100%-64px)">
        <APIMap homes={homes} geometry={selectedLocation} />
      </Box>
    </div>
  );
}

export default Wrapper;
