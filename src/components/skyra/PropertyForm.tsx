import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  AMENITIES,
  FACINGS,
  FURNISHINGS,
  LOCALITIES,
  POSSESSION_STATUSES,
  PROPERTY_AGES,
  PROPERTY_TYPES,
} from "@/lib/skyra/constants";
import type {
  Facing,
  Furnishing,
  PossessionStatus,
  Property,
  PropertyAge,
  PropertyType,
} from "@/lib/skyra/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Draft = Omit<Property, "viewCount">;

const blankDraft = (): Draft => ({
  id: "",
  title: "",
  type: "Flat / Apartment",
  locality: LOCALITIES[0] as string,
  address: "",
  price: 0,
  areaSqft: 0,
  bedrooms: 0,
  bathrooms: 0,
  furnishing: "Unfurnished",
  possessionStatus: "Ready to move",
  ageOfProperty: "New",
  facing: "East",
  floorNumber: 0,
  totalFloors: 0,
  amenities: [],
  description: "",
  images: [""],
  listedDate: new Date().toISOString().slice(0, 10),
  ownerContactName: "",
  ownerContactPhone: "",
});

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold text-navy">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function PropertyForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel = "Save property",
}: {
  initial?: Property;
  onSubmit: (values: Draft) => void;
  onCancel?: () => void;
  submitLabel?: string;
}) {
  const [draft, setDraft] = useState<Draft>(() =>
    initial ? { ...initial } : blankDraft(),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  function validate() {
    const e: Record<string, string> = {};
    if (!draft.title.trim()) e["title"] = "Title is required";
    if (!draft.address.trim()) e["address"] = "Address is required";
    if (draft.price <= 0) e["price"] = "Enter a price in rupees";
    if (draft.areaSqft <= 0) e["areaSqft"] = "Enter the area in sq.ft";
    if (!draft.description.trim()) e["description"] = "Add a short description";
    if (!draft.ownerContactName.trim()) e["ownerContactName"] = "Owner name is required";
    if (!/^[+\d][\d\s-]{7,}$/.test(draft.ownerContactPhone.trim()))
      e["ownerContactPhone"] = "Enter a valid phone number";
    if (draft.images.filter((i) => i.trim()).length === 0)
      e["images"] = "Add at least one image URL";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...draft,
      images: draft.images.map((i) => i.trim()).filter(Boolean),
    });
  }

  return (
    <form onSubmit={submit} className="space-y-8">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <Field label="Title" error={errors["title"]}>
            <Input
              value={draft.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="3 BHK Apartment at Skyline Crest"
            />
          </Field>
        </div>

        <Field label="Property type">
          <Select
            value={draft.type}
            onValueChange={(v) => set("type", v as PropertyType)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PROPERTY_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Locality (Bengaluru)">
          <Select value={draft.locality} onValueChange={(v) => set("locality", v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LOCALITIES.map((l) => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <div className="md:col-span-2">
          <Field label="Address" error={errors["address"]}>
            <Input
              value={draft.address}
              onChange={(e) => set("address", e.target.value)}
              placeholder="42, 5th Cross, Indiranagar, Bengaluru 560038"
            />
          </Field>
        </div>

        <Field label="Price (INR)" error={errors["price"]}>
          <Input
            type="number"
            min={0}
            value={draft.price || ""}
            onChange={(e) => set("price", Number(e.target.value))}
          />
        </Field>

        <Field label="Area (sq.ft)" error={errors["areaSqft"]}>
          <Input
            type="number"
            min={0}
            value={draft.areaSqft || ""}
            onChange={(e) => set("areaSqft", Number(e.target.value))}
          />
        </Field>

        <Field label="Bedrooms (0 for plots / commercial)">
          <Input
            type="number"
            min={0}
            value={draft.bedrooms}
            onChange={(e) => set("bedrooms", Number(e.target.value))}
          />
        </Field>

        <Field label="Bathrooms">
          <Input
            type="number"
            min={0}
            value={draft.bathrooms}
            onChange={(e) => set("bathrooms", Number(e.target.value))}
          />
        </Field>

        <Field label="Furnishing">
          <Select
            value={draft.furnishing}
            onValueChange={(v) => set("furnishing", v as Furnishing)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FURNISHINGS.map((f) => (
                <SelectItem key={f} value={f}>
                  {f}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Possession status">
          <Select
            value={draft.possessionStatus}
            onValueChange={(v) => set("possessionStatus", v as PossessionStatus)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {POSSESSION_STATUSES.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Age of property">
          <Select
            value={draft.ageOfProperty}
            onValueChange={(v) => set("ageOfProperty", v as PropertyAge)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PROPERTY_AGES.map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Facing">
          <Select value={draft.facing} onValueChange={(v) => set("facing", v as Facing)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FACINGS.map((f) => (
                <SelectItem key={f} value={f}>
                  {f}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Floor number">
          <Input
            type="number"
            min={0}
            value={draft.floorNumber}
            onChange={(e) => set("floorNumber", Number(e.target.value))}
          />
        </Field>

        <Field label="Total floors">
          <Input
            type="number"
            min={0}
            value={draft.totalFloors}
            onChange={(e) => set("totalFloors", Number(e.target.value))}
          />
        </Field>

        <Field label="Listed date">
          <Input
            type="date"
            value={draft.listedDate}
            onChange={(e) => set("listedDate", e.target.value)}
          />
        </Field>

        <Field label="Owner name" error={errors["ownerContactName"]}>
          <Input
            value={draft.ownerContactName}
            onChange={(e) => set("ownerContactName", e.target.value)}
          />
        </Field>

        <Field label="Owner phone" error={errors["ownerContactPhone"]}>
          <Input
            value={draft.ownerContactPhone}
            onChange={(e) => set("ownerContactPhone", e.target.value)}
            placeholder="+91 98450 21134"
          />
        </Field>
      </div>

      <div>
        <Label className="text-xs font-semibold text-navy">Amenities</Label>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4">
          {AMENITIES.map((a) => (
            <label key={a} className="flex min-h-10 cursor-pointer items-center gap-2 text-sm">
              <Checkbox
                checked={draft.amenities.includes(a)}
                onCheckedChange={() =>
                  set(
                    "amenities",
                    draft.amenities.includes(a)
                      ? draft.amenities.filter((x) => x !== a)
                      : [...draft.amenities, a],
                  )
                }
                className="data-[state=checked]:border-gold data-[state=checked]:bg-gold data-[state=checked]:text-gold-foreground"
              />
              <span className="min-w-0 whitespace-normal">{a}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-xs font-semibold text-navy">Image URLs</Label>
        <div className="mt-3 space-y-2">
          {draft.images.map((img, i) => (
            <div key={i} className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
              <Input
                value={img}
                onChange={(e) =>
                  set(
                    "images",
                    draft.images.map((v, idx) => (idx === i ? e.target.value : v)),
                  )
                }
                placeholder="/listings/shop-01.jpg or https://…"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Remove image"
                onClick={() =>
                  set(
                    "images",
                    draft.images.filter((_, idx) => idx !== i),
                  )
                }
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
        {errors["images"] && (
          <p className="mt-2 text-xs text-destructive">{errors["images"]}</p>
        )}
        <Button
          type="button"
          variant="goldOutline"
          size="sm"
          className="mt-3"
          onClick={() => set("images", [...draft.images, ""])}
        >
          <Plus className="h-3.5 w-3.5" /> Add image URL
        </Button>
        {draft.images.filter(Boolean).length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {draft.images.filter(Boolean).map((src) => (
              <img
                key={src}
                src={src}
                alt="Preview"
                className="aspect-4/3 w-full rounded-lg border border-border object-cover"
              />
            ))}
          </div>
        )}
      </div>

      <Field label="Description" error={errors["description"]}>
        <Textarea
          rows={5}
          value={draft.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Describe the property, neighbourhood and highlights."
        />
      </Field>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" variant="gold">
          {submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

export type { Draft as PropertyDraft };
