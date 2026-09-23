import type { Property } from "@/lib/skyra/types";
import type { PropertyRow } from "@/db/schema";

export function rowToProperty(row: PropertyRow): Property {
  return {
    id: row.id,
    title: row.title,
    type: row.type as Property["type"],
    locality: row.locality,
    address: row.address,
    price: row.price,
    areaSqft: row.areaSqft,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    furnishing: row.furnishing as Property["furnishing"],
    possessionStatus: row.possessionStatus as Property["possessionStatus"],
    ageOfProperty: row.ageOfProperty as Property["ageOfProperty"],
    facing: row.facing as Property["facing"],
    floorNumber: row.floorNumber,
    totalFloors: row.totalFloors,
    amenities: Array.isArray(row.amenities) ? row.amenities : [],
    description: row.description,
    images: Array.isArray(row.images) ? row.images : [],
    listedDate: row.listedDate,
    ownerContactName: row.ownerContactName,
    ownerContactPhone: row.ownerContactPhone,
    viewCount: row.viewCount ?? 0,
  };
}

export function propertyToInsert(property: Property) {
  return {
    id: property.id,
    title: property.title,
    type: property.type,
    locality: property.locality,
    address: property.address,
    price: property.price,
    areaSqft: property.areaSqft,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    furnishing: property.furnishing,
    possessionStatus: property.possessionStatus,
    ageOfProperty: property.ageOfProperty,
    facing: property.facing,
    floorNumber: property.floorNumber,
    totalFloors: property.totalFloors,
    amenities: property.amenities,
    description: property.description,
    images: property.images,
    listedDate: property.listedDate,
    ownerContactName: property.ownerContactName,
    ownerContactPhone: property.ownerContactPhone,
    viewCount: property.viewCount ?? 0,
  };
}
