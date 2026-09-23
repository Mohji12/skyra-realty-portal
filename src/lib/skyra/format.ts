export function formatPrice(value: number): string {
  if (value >= 10000000) {
    const cr = value / 10000000;
    return `₹${cr.toFixed(cr >= 10 ? 1 : 2)} Cr`;
  }
  if (value >= 100000) {
    const lakh = value / 100000;
    return `₹${lakh.toFixed(lakh >= 10 ? 1 : 2)} L`;
  }
  return `₹${value.toLocaleString("en-IN")}`;
}

export function formatArea(value: number): string {
  return `${value.toLocaleString("en-IN")} sq.ft`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function pricePerSqft(price: number, area: number): string {
  if (!area) return "—";
  return `₹${Math.round(price / area).toLocaleString("en-IN")}/sq.ft`;
}

/** Opens Google Maps search for the given address (new tab). */
export function googleMapsUrl(address: string): string {
  const query = address.trim();
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
