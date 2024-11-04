import { useState } from "react";

import Box from "@mui/material/Box";

import Header from "./Header/Header";
import APIMap from "./Map/APIMap";

import data from "data/database.json";
import { Home, WeightContext } from "shared/lib/types";
import { getLinearFitFromHomes, quickSort } from "utils/quickSort";

// Container for the entire application.
// Has for children the header and the map itself.
// Used to relay information to and from these children.
function Dashboard() {
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
      linearFitParameters: getLinearFitFromHomes(homes, selectedLocation),
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
        onSearchChange={setSelectedLocation}
      />
      <Box height="calc(100%-64px)">
        <APIMap
          homes={homes}
          searchGeometry={selectedLocation}
          disabled={
            selectedLocation === null ||
            distanceWeight +
              reviewWeight +
              flexibilityWeight +
              responseWeight ===
              0
          }
          onSort={sortHomes}
        />
      </Box>
    </div>
  );
}

export default Dashboard;
