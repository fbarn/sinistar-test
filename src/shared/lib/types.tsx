export interface WeightContext {
  distanceWeight: number;
  setDistanceWeight: (weight: number) => void;
  reviewWeight: number;
  setReviewWeight: (weight: number) => void;
  responseWeight: number;
  setResponseWeight: (weight: number) => void;
  flexibilityWeight: number;
  setFlexibilityWeight: (weight: number) => void;
}

export interface Home {
  id: number;
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  host_response_rate: number;
  review_score: number;
  extension_flexibility: number;
}

export interface SortingContext {
  selectedLocation: google.maps.GeocoderGeometry | null;
  linearFitParameters: LinearFitParameters;
  distanceWeight: number;
  reviewWeight: number;
  responseWeight: number;
  flexibilityWeight: number;
}

export interface LinearFitParameters {
  slope: number;
  intercept: number;
}
