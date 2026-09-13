export type PropertyType =
  | "Flat / Apartment"
  | "Villa"
  | "Penthouse"
  | "Independent House"
  | "Commercial Building"
  | "Shop"
  | "PG / Co-living Building"
  | "Farm / Farmhouse"
  | "Plot / Land";

export type Furnishing = "Unfurnished" | "Semi-furnished" | "Fully-furnished";
export type PossessionStatus = "Ready to move" | "Under construction";
export type PropertyAge = "New" | "0-5 years" | "5-10 years" | "10+ years";
export type Facing = "North" | "South" | "East" | "West" | "North-East" | "North-West" | "South-East" | "South-West";

export interface Property {
  id: string;
  title: string;
  type: PropertyType;
  locality: string;
  address: string;
  price: number;
  areaSqft: number;
  bedrooms: number;
  bathrooms: number;
  furnishing: Furnishing;
  possessionStatus: PossessionStatus;
  ageOfProperty: PropertyAge;
  facing: Facing;
  floorNumber: number;
  totalFloors: number;
  amenities: string[];
  description: string;
  images: string[];
  listedDate: string;
  ownerContactName: string;
  ownerContactPhone: string;
  viewCount: number;
}

export interface PageViewEntry {
  page: string;
  timestamp: number;
}
