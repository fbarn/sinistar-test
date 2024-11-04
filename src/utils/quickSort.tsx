import type { Home, SortingContext } from "shared/lib/types";

// Determine the distance between two lat-lng pairs.
// Distance is returned number of earth circumferences. (i.e.) it will always be <= 1
function getDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const rlat1 = lat1 * (Math.PI / 180); // Convert degrees to radians
  const rlat2 = lat2 * (Math.PI / 180); // Convert degrees to radians
  const difflat = rlat2 - rlat1; // Radian difference (latitudes)
  const difflon = (lng2 - lng1) * (Math.PI / 180); // Radian difference (longitudes)

  const d = Math.asin(
    Math.sqrt(
      Math.sin(difflat / 2) * Math.sin(difflat / 2) +
        Math.cos(rlat1) *
          Math.cos(rlat2) *
          Math.sin(difflon / 2) *
          Math.sin(difflon / 2),
    ),
  );
  return d;
}

function getMaxDistance(
  homes: Home[],
  selectedLocation: google.maps.GeocoderGeometry,
) {
  const selectedLat = selectedLocation.location.lat();
  const selectedLng = selectedLocation.location.lng();
  let maxDistance = 0;
  for (let i = 0; i < homes.length; i++) {
    const distance = getDistance(
      homes[i].latitude,
      homes[i].longitude,
      selectedLat,
      selectedLng,
    );
    maxDistance = Math.max(maxDistance, distance);
  }
  return maxDistance;
}

function getMinDistance(
  homes: Home[],
  selectedLocation: google.maps.GeocoderGeometry,
) {
  const selectedLat = selectedLocation.location.lat();
  const selectedLng = selectedLocation.location.lng();
  let minDistance = 1;
  for (let i = 0; i < homes.length; i++) {
    const distance = getDistance(
      homes[i].latitude,
      homes[i].longitude,
      selectedLat,
      selectedLng,
    );
    minDistance = Math.min(minDistance, distance);
  }
  return minDistance;
}

function getFitFromDistances(maxDistance: number, minDistance: number) {
  const slope = 1 / (minDistance - maxDistance);
  const intercept = 1 - slope * minDistance;
  return { slope, intercept };
}

export function getLinearFitFromHomes(
  homes: Home[],
  selectedLocation: google.maps.GeocoderGeometry,
) {
  const maxDistance = getMaxDistance(homes, selectedLocation);
  const minDistance = getMinDistance(homes, selectedLocation);
  return getFitFromDistances(maxDistance, minDistance);
}

function getCloseness(home: Home, sortingContext: SortingContext) {
  if (sortingContext.selectedLocation === null) return 0;

  const selectedLat = sortingContext.selectedLocation.location.lat();
  const selectedLng = sortingContext.selectedLocation.location.lng();
  return (
    sortingContext.linearFitParameters.slope *
      getDistance(home.latitude, home.longitude, selectedLat, selectedLng) +
    sortingContext.linearFitParameters.intercept
  );
}

// Determine a home's score based on the weighted sum of the home's criteria.
function getHomeScore(home: Home, sortingContext: SortingContext) {
  return (
    sortingContext.distanceWeight * getCloseness(home, sortingContext) +
    sortingContext.reviewWeight * home.review_score +
    sortingContext.responseWeight * home.host_response_rate +
    sortingContext.flexibilityWeight * home.extension_flexibility
  );
}

// Returns true if home1 has a better score than home2; false otherwise
function moreDesirableThan(
  home1: Home,
  home2: Home,
  sortingContext: SortingContext,
) {
  return (
    getHomeScore(home1, sortingContext) > getHomeScore(home2, sortingContext)
  );
}

// Basic swap functionality used by partitionHomes
function swapHomes(homes: Home[], i: number, j: number) {
  const temp = homes[i];
  homes[i] = homes[j];
  homes[j] = temp;
}

// Selects the last element in the list to be a pivot,
// then moves all more desirable elements on the left
// of the pivot, and all less desirable ones on the right.
function partitionHomes(
  homes: Home[],
  low: number,
  high: number,
  sortingContext: SortingContext,
) {
  const pivot = homes[high];

  let i = low - 1;

  for (let j = low; j <= high - 1; j++) {
    if (moreDesirableThan(homes[j], pivot, sortingContext)) {
      i++;
      swapHomes(homes, i, j);
    }
  }
  swapHomes(homes, i + 1, high);
  return i + 1;
}

// A recursive, in-place implementation of the quicksort algorithm
// Calls on partitionHomes to split the list in two lists,
// then runs repeats on those two lists.
function quickSortHomes(
  homes: Home[],
  low: number,
  high: number,
  sortingContext: SortingContext,
) {
  if (low < high) {
    const pi = partitionHomes(homes, low, high, sortingContext);

    quickSortHomes(homes, low, pi - 1, sortingContext);
    quickSortHomes(homes, pi + 1, high, sortingContext);
  }
}

// Endpoint for the quickSort functionality.
export function quickSort(homes: Home[], sortingContext: SortingContext) {
  return quickSortHomes(homes, 0, homes.length - 1, sortingContext);
}
