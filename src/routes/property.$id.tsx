import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Building,
  CalendarDays,
  CheckCircle2,
  Compass,
  Eye,
  GitCompareArrows,
  MapPin,
  Phone,
  Ruler,
  Sofa,
  User,
} from "lucide-react";
import { SiteLayout } from "@/components/skyra/SiteLayout";
import { PropertyCard } from "@/components/skyra/PropertyCard";
import { SkylineDivider } from "@/components/skyra/Logo";
import { Button } from "@/components/ui/button";
import { useProperties } from "@/hooks/useProperties";
import { useCompareSelection, MAX_COMPARE } from "@/hooks/useCompareSelection";
import { logPageView } from "@/lib/skyra/storage";
import { incrementPropertyViewCount } from "@/lib/skyra/properties.functions";
import { formatArea, formatDate, formatPrice, googleMapsUrl, pricePerSqft } from "@/lib/skyra/format";
import {
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
  contactWhatsAppUrl,
} from "@/lib/skyra/constants";

export const Route = createFileRoute("/property/$id")({
  head: () => ({
    meta: [
      { title: "Property details — Skyra Realty Bengaluru" },
      {
        name: "description",
        content:
          "Full specifications, amenities, photos and owner contact details for this Bengaluru property listed with Skyra Realty.",
      },
      { property: "og:title", content: "Property details — Skyra Realty" },
      {
        property: "og:description",
        content: "Photos, specs, amenities and owner contact for this Bengaluru listing.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PropertyDetail,
});

function PropertyDetail() {
  const { id } = Route.useParams();
  const { properties, ready, refresh } = useProperties();
  const { isSelected, toggle, ids: compareIds } = useCompareSelection();
  const [activeImage, setActiveImage] = useState(0);
  const [compareNotice, setCompareNotice] = useState<string | null>(null);

  useEffect(() => {
    logPageView(`Property ${id}`);
    void incrementPropertyViewCount({ data: { id } }).then(() => refresh());
  }, [id, refresh]);

  const property = properties.find((p) => p.id === id);
  const inCompare = property ? isSelected(property.id) : false;
  const whatsappUrl = property
    ? contactWhatsAppUrl({ title: property.title, locality: property.locality })
    : contactWhatsAppUrl();

  function handleCompareToggle() {
    if (!property) return;
    const result = toggle(property.id);
    if (result.rejected) {
      setCompareNotice(`You can compare only ${MAX_COMPARE} properties. Remove one first.`);
      window.setTimeout(() => setCompareNotice(null), 2800);
    } else {
      setCompareNotice(null);
    }
  }

  const similar = useMemo(() => {
    if (!property) return [];
    return properties
      .filter(
        (p) =>
          p.id !== property.id &&
          (p.locality === property.locality || p.type === property.type),
      )
      .slice(0, 4);
  }, [properties, property]);

  if (!property) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-3xl px-4 py-24 text-center">
          <SkylineDivider className="mx-auto max-w-md" />
          <h1 className="mt-6 font-display text-3xl font-bold text-navy">
            {ready ? "This property is no longer listed" : "Loading property…"}
          </h1>
          {ready && (
            <Button asChild variant="gold" className="mt-6">
              <Link to="/listings">Browse all listings</Link>
            </Button>
          )}
        </div>
      </SiteLayout>
    );
  }

  const specs = [
    { icon: Ruler, label: "Built-up area", value: formatArea(property.areaSqft) },
    ...(property.bedrooms
      ? [{ icon: BedDouble, label: "Bedrooms", value: `${property.bedrooms}` }]
      : []),
    { icon: Bath, label: "Bathrooms", value: `${property.bathrooms}` },
    { icon: Sofa, label: "Furnishing", value: property.furnishing },
    { icon: CheckCircle2, label: "Possession", value: property.possessionStatus },
    { icon: CalendarDays, label: "Age", value: property.ageOfProperty },
    { icon: Compass, label: "Facing", value: property.facing },
    {
      icon: Building,
      label: "Floor",
      value: property.totalFloors
        ? `${property.floorNumber} of ${property.totalFloors}`
        : "—",
    },
  ];

  return (
    <SiteLayout>
      <div className="bg-navy text-navy-foreground">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
          <Link
            to="/listings"
            className="inline-flex min-h-10 items-center gap-2 text-sm text-navy-foreground/70 hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" /> Back to listings
          </Link>
          <p className="eyebrow mt-4 text-gold sm:mt-5">{property.type}</p>
          <h1 className="mt-2 max-w-3xl font-display text-2xl font-bold sm:text-3xl md:text-4xl">
            {property.title}
          </h1>
          <p className="mt-3 flex items-start gap-2 text-sm text-navy-foreground/70">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
            <a
              href={googleMapsUrl(property.address)}
              target="_blank"
              rel="noopener noreferrer"
              className="min-w-0 break-words text-gold underline-offset-2 hover:underline"
            >
              {property.address}
            </a>
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 pb-28 sm:py-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:pb-10">
        <div className="min-w-0 space-y-8 sm:space-y-10">
          {/* Gallery */}
          <div>
            <div className="overflow-hidden rounded-xl border border-border bg-muted">
              <img
                src={property.images[activeImage]}
                alt={`${property.title} photo ${activeImage + 1}`}
                className="aspect-16/10 w-full object-cover"
              />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
              {property.images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={
                    i === activeImage
                      ? "overflow-hidden rounded-lg ring-2 ring-gold"
                      : "overflow-hidden rounded-lg opacity-70 hover:opacity-100"
                  }
                >
                  <img
                    src={src}
                    alt={`Thumbnail ${i + 1}`}
                    loading="lazy"
                    className="aspect-4/3 w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Specs */}
          <section>
            <h2 className="font-display text-xl font-bold text-navy sm:text-2xl">Overview</h2>
            <dl className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
              {specs.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="min-w-0 rounded-lg border border-border bg-card p-3 sm:p-4"
                >
                  <Icon className="h-4 w-4 text-gold-deep" />
                  <dt className="mt-3 text-[11px] uppercase tracking-wider text-muted-foreground">
                    {label}
                  </dt>
                  <dd className="mt-1 break-words text-sm font-semibold text-navy">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Description */}
          <section>
            <h2 className="font-display text-xl font-bold text-navy sm:text-2xl">Description</h2>
            <p className="mt-4 text-sm leading-relaxed text-foreground/80">
              {property.description}
            </p>
          </section>

          {/* Amenities */}
          <section>
            <h2 className="font-display text-xl font-bold text-navy sm:text-2xl">Amenities</h2>
            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              {property.amenities.map((a) => (
                <li
                  key={a}
                  className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-sm"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-gold-deep" />
                  <span className="min-w-0">{a}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Locality — opens Google Maps */}
          <section>
            <h2 className="font-display text-xl font-bold text-navy sm:text-2xl">Locality</h2>
            <a
              href={googleMapsUrl(property.address)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 grid place-items-center rounded-xl border border-dashed border-gold/40 bg-navy-deep px-4 py-14 text-center transition-colors hover:border-gold hover:bg-navy"
            >
              <MapPin className="h-6 w-6 text-gold" />
              <p className="mt-3 font-display text-lg text-navy-foreground sm:text-xl">
                {property.locality}, Bengaluru
              </p>
              <p className="mt-1 text-xs text-gold underline-offset-2 hover:underline">
                Open in Google Maps
              </p>
              <SkylineDivider className="mt-6 max-w-md opacity-50" />
            </a>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="hidden space-y-5 lg:sticky lg:top-24 lg:block lg:self-start">
          <div className="rounded-xl border border-border bg-card p-6 shadow-elegant">
            <p className="font-display text-3xl font-bold text-gold-deep">
              {formatPrice(property.price)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {pricePerSqft(property.price, property.areaSqft)} ·{" "}
              {formatArea(property.areaSqft)}
            </p>
            <div className="mt-5 space-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
              <p className="flex items-center gap-2">
                <CalendarDays className="h-3.5 w-3.5 text-gold-deep" /> Listed{" "}
                {formatDate(property.listedDate)}
              </p>
              <p className="flex items-center gap-2">
                <Eye className="h-3.5 w-3.5 text-gold-deep" /> {property.viewCount} views
              </p>
              <p className="font-mono text-[11px]">Ref {property.id}</p>
            </div>
            <Button
              type="button"
              variant={inCompare ? "gold" : "goldOutline"}
              className="mt-5 w-full"
              onClick={handleCompareToggle}
            >
              <GitCompareArrows className="h-4 w-4" />
              {inCompare ? "Selected for compare" : "Add to compare"}
            </Button>
            {compareNotice && (
              <p className="mt-2 text-xs text-destructive">{compareNotice}</p>
            )}
          </div>

          <div className="rounded-xl border border-border bg-navy p-6 text-navy-foreground">
            <h2 className="eyebrow text-gold">Contact Skyra</h2>
            <p className="mt-4 flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-gold" /> Skyra Realty
            </p>
            <p className="mt-2 flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-gold" /> {CONTACT_PHONE_DISPLAY}
            </p>
            <div className="mt-5 grid gap-2">
              <Button asChild variant="gold" className="w-full">
                <a href={`tel:${CONTACT_PHONE_TEL}`}>Call now</a>
              </Button>
              <Button asChild variant="goldOutline" className="w-full border-gold/40 text-gold hover:bg-navy-deep">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile sticky CTA — hidden while compare tray is open */}
      {compareIds.length === 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-elegant backdrop-blur lg:hidden">
          <div className="mx-auto flex max-w-7xl items-center gap-2">
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-xl font-bold text-gold-deep">
                {formatPrice(property.price)}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {CONTACT_PHONE_DISPLAY}
              </p>
            </div>
            <Button
              type="button"
              variant={inCompare ? "gold" : "goldOutline"}
              size="sm"
              className="shrink-0 rounded-full"
              onClick={handleCompareToggle}
            >
              <GitCompareArrows className="h-4 w-4" />
            </Button>
            <Button asChild variant="goldOutline" size="sm" className="shrink-0 rounded-full px-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Chat
              </a>
            </Button>
            <Button asChild variant="gold" className="shrink-0 rounded-full px-5">
              <a href={`tel:${CONTACT_PHONE_TEL}`}>
                <Phone className="h-4 w-4" /> Call
              </a>
            </Button>
          </div>
        </div>
      )}

      {similar.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-16">
          <h2 className="font-display text-xl font-bold text-navy sm:text-2xl">
            Similar properties
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </section>
      )}
    </SiteLayout>
  );
}
