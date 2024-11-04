import type { Home, SortingContext } from "shared/lib/types";

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 3958.8; // Radius of the Earth in miles
  const rlat1 = lat1 * (Math.PI / 180); // Convert degrees to radians
  const rlat2 = lat2 * (Math.PI / 180); // Convert degrees to radians
  const difflat = rlat2 - rlat1; // Radian difference (latitudes)
  const difflon = (lng2 - lng1) * (Math.PI / 180); // Radian difference (longitudes)

  const d =
    2 *
    R *
    Math.asin(
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

export function getMaxDistance(
  homes: Home[],
  selectedLocation: google.maps.GeocoderGeometry,
) {
  const selectedLat = selectedLocation.location.lat();
  const selectedLng = selectedLocation.location.lng();
  let maxCloseness = 0;
  for (let i = 0; i < homes.length; i++) {
    maxCloseness = Math.max(
      maxCloseness,
      getDistance(
        homes[i].latitude,
        homes[i].longitude,
        selectedLat,
        selectedLng,
      ),
    );
  }
  return maxCloseness;
}

function getCloseness(home: Home, sortingContext: SortingContext) {
  if (
    sortingContext.selectedLocation === null ||
    sortingContext.maxDistance === 0
  )
    return 0;

  const selectedLat = sortingContext.selectedLocation.location.lat();
  const selectedLng = sortingContext.selectedLocation.location.lng();
  return (
    1 -
    getDistance(home.latitude, home.longitude, selectedLat, selectedLng) /
      sortingContext.maxDistance
  );
}

function getHomeScore(home: Home, sortingContext: SortingContext) {
  return (
    sortingContext.distanceWeight * getCloseness(home, sortingContext) +
    sortingContext.reviewWeight * home.review_score +
    sortingContext.responseWeight * home.host_response_rate +
    sortingContext.flexibilityWeight * home.extension_flexibility
  );
}

function moreDesirableThan(
  home1: Home,
  home2: Home,
  sortingContext: SortingContext,
) {
  return (
    getHomeScore(home1, sortingContext) > getHomeScore(home2, sortingContext)
  );
}

// Swap function
function swapHomes(homes: Home[], i: number, j: number) {
  const temp = homes[i];
  homes[i] = homes[j];
  homes[j] = temp;
}

function partitionHomes(
  homes: Home[],
  low: number,
  high: number,
  sortingContext: SortingContext,
) {
  const pivot = homes[high];

  // Index of smaller element and indicates
  // the right position of pivot found so far
  let i = low - 1;

  // Traverse arr[low..high] and move all smaller
  // elements to the left side. Elements from low to
  // i are smaller after every iteration
  for (let j = low; j <= high - 1; j++) {
    if (moreDesirableThan(homes[j], pivot, sortingContext)) {
      i++;
      swapHomes(homes, i, j);
    }
  }

  // Move pivot after smaller elements and
  // return its position
  swapHomes(homes, i + 1, high);
  return i + 1;
}

// The QuickSort function implementation
function quickSortHomes(
  homes: Home[],
  low: number,
  high: number,
  sortingContext: SortingContext,
) {
  if (low < high) {
    // pi is the partition return index of pivot
    const pi = partitionHomes(homes, low, high, sortingContext);

    // Recursion calls for smaller elements
    // and greater or equals elements
    quickSortHomes(homes, low, pi - 1, sortingContext);
    quickSortHomes(homes, pi + 1, high, sortingContext);
  }
}

export function quickSort(homes: Home[], sortingContext: SortingContext) {
  return quickSortHomes(homes, 0, homes.length - 1, sortingContext);
}
