import { z } from "zod";

export const propertyDraftSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  type: z.string().min(1),
  locality: z.string().min(1),
  address: z.string().min(1),
  price: z.number().positive(),
  areaSqft: z.number().positive(),
  bedrooms: z.number().int().min(0),
  bathrooms: z.number().int().min(0),
  furnishing: z.string().min(1),
  possessionStatus: z.string().min(1),
  ageOfProperty: z.string().min(1),
  facing: z.string().min(1),
  floorNumber: z.number().int().min(0),
  totalFloors: z.number().int().min(0),
  amenities: z.array(z.string()),
  description: z.string().min(1),
  images: z.array(z.string().min(1)).min(1),
  listedDate: z.string().min(1),
  ownerContactName: z.string().min(1),
  ownerContactPhone: z.string().min(1),
});

export type PropertyDraftInput = z.infer<typeof propertyDraftSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
