import type {
  Facing,
  Furnishing,
  PossessionStatus,
  PropertyAge,
  PropertyType,
} from "./types";

export const CITY = "Bengaluru";

export const PROPERTY_TYPES: PropertyType[] = [
  "Flat / Apartment",
  "Villa",
  "Penthouse",
  "Independent House",
  "Commercial Building",
  "Shop",
  "PG / Co-living Building",
  "Farm / Farmhouse",
  "Plot / Land",
];

export const LOCALITIES = [
  "Indiranagar",
  "Koramangala",
  "HSR Layout",
  "Whitefield",
  "Sarjapur Road",
  "Electronic City",
  "Jayanagar",
  "JP Nagar",
  "Marathahalli",
  "Bellandur",
  "Hebbal",
  "Yelahanka",
  "Malleshwaram",
  "Basavanagudi",
  "Rajajinagar",
  "BTM Layout",
  "Bannerghatta Road",
  "Kanakapura Road",
  "RT Nagar",
  "Banashankari",
  "Hennur",
  "CV Raman Nagar",
];

export const FURNISHINGS: Furnishing[] = [
  "Unfurnished",
  "Semi-furnished",
  "Fully-furnished",
];

export const POSSESSION_STATUSES: PossessionStatus[] = [
  "Ready to move",
  "Under construction",
];

export const PROPERTY_AGES: PropertyAge[] = [
  "New",
  "0-5 years",
  "5-10 years",
  "10+ years",
];

export const FACINGS: Facing[] = [
  "North",
  "South",
  "East",
  "West",
  "North-East",
  "North-West",
  "South-East",
  "South-West",
];

export const AMENITIES = [
  "Parking",
  "Lift",
  "Power backup",
  "Gym",
  "Swimming pool",
  "Security",
  "Park",
  "Clubhouse",
  "Water supply 24x7",
  "Play area",
  "Rain water harvesting",
  "Servant room",
];

/** Types where bedroom/bathroom counts do not apply. */
export const NON_RESIDENTIAL: PropertyType[] = [
  "Plot / Land",
  "Commercial Building",
  "Shop",
];

export const ADMIN_PASSWORD = "skyra2026";
