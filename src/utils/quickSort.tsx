import type { Home, SortingContext } from 'shared/lib/types'

function getCloseness(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number) {
  let R = 3958.8; // Radius of the Earth in miles
  let rlat1 = lat1 * (Math.PI / 180); // Convert degrees to radians
  let rlat2 = lat2 * (Math.PI / 180); // Convert degrees to radians
  let difflat = rlat2 - rlat1; // Radian difference (latitudes)
  let difflon = (lng2 - lng1) * (Math.PI / 180); // Radian difference (longitudes)

  let d = 2 * R * Math.asin(
    Math.sqrt(
      Math.sin(difflat / 2) * Math.sin(difflat / 2) +
      Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(difflon / 2) * Math.sin(difflon / 2)
    ));
  return 1 / d;
}

export function getMaxCloseness(
  homes: Home[],
  selectedLocation: google.maps.GeocoderGeometry
) {
  let selectedLat = selectedLocation.location.lat();
  let selectedLng = selectedLocation.location.lng();
  let maxCloseness = 0;
  for (let i = 0; i < homes.length; i++) {
    maxCloseness = Math.max(maxCloseness, getCloseness(homes[i].latitude, homes[i].longitude, selectedLat, selectedLng))
  }
  return maxCloseness;
}

function getHomeScore(home: Home, sortingContext: SortingContext) {
  if (sortingContext.selectedLocation === null)
    return 0;

  let selectedLat = sortingContext.selectedLocation.location.lat();
  let selectedLng = sortingContext.selectedLocation.location.lng();
  return sortingContext.distanceWeight * getCloseness(home.latitude, home.longitude, selectedLat, selectedLng) +
    sortingContext.reviewWeight * (home.review_score) +
    sortingContext.responseWeight * home.host_response_rate +
    sortingContext.flexibilityWeight * home.extension_flexibility;
}

function moreDesirableThan(
  home1: Home,
  home2: Home,
  sortingContext: SortingContext) {

  return getHomeScore(home1, sortingContext) > getHomeScore(home2, sortingContext);
}

// Swap function
function swapHomes(homes: Home[], i: number, j: number) {
  let temp = homes[i];
  homes[i] = homes[j];
  homes[j] = temp;
}

function partitionHomes(
  homes: Home[],
  low: number,
  high: number,
  sortingContext: SortingContext) {

  let pivot = homes[high];

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
function quickSortHomes(homes: Home[], low: number, high: number, sortingContext: SortingContext) {
  if (low < high) {

    // pi is the partition return index of pivot
    let pi = partitionHomes(homes, low, high, sortingContext);

    // Recursion calls for smaller elements
    // and greater or equals elements
    quickSortHomes(homes, low, pi - 1, sortingContext);
    quickSortHomes(homes, pi + 1, high, sortingContext);
  }
}

export function quickSort(homes: Home[], sortingContext: SortingContext) {

  return quickSortHomes(homes, 0, homes.length - 1, sortingContext);

}

