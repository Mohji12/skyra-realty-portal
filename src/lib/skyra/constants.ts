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

/** Primary Skyra contact for call & WhatsApp CTAs */
export const CONTACT_PHONE_DISPLAY = "83103 02076";
export const CONTACT_PHONE_TEL = "+918310302076";
const WHATSAPP_NUMBER = "918310302076";

/** WhatsApp chat link; include property name + locality when available. */
export function contactWhatsAppUrl(opts?: {
  title?: string;
  locality?: string;
}): string {
  const title = opts?.title?.trim();
  const locality = opts?.locality?.trim();

  let message =
    "Hi Skyra Realty, I am interested in a Bengaluru property.";
  if (title && locality) {
    message = `Hi Skyra Realty, I am interested in "${title}" located in ${locality}, Bengaluru. Please share more details.`;
  } else if (title) {
    message = `Hi Skyra Realty, I am interested in "${title}". Please share more details.`;
  }

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Generic footer / site-wide WhatsApp link */
export const CONTACT_WHATSAPP_URL = contactWhatsAppUrl();
