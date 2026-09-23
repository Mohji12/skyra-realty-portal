import { Link } from "@tanstack/react-router";
import { Logo, SkylineDivider } from "./Logo";
import {
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
  CONTACT_WHATSAPP_URL,
  LOCALITIES,
  PROPERTY_TYPES,
} from "@/lib/skyra/constants";

export function Footer() {
  return (
    <footer className="bg-navy-deep text-navy-foreground">
      <SkylineDivider className="h-10 opacity-60" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <Logo />
          <p className="mt-4 text-sm text-navy-foreground/65">
            Bengaluru property specialists. Homes, land and commercial spaces across
            the city, curated with care.
          </p>
        </div>

        <div>
          <h3 className="eyebrow text-gold">Property types</h3>
          <ul className="mt-4 space-y-1 text-sm text-navy-foreground/70">
            {PROPERTY_TYPES.slice(0, 6).map((t) => (
              <li key={t}>
                <Link
                  to="/listings"
                  search={{ type: t }}
                  className="inline-flex min-h-10 items-center transition-colors hover:text-gold"
                >
                  {t}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="eyebrow text-gold">Popular localities</h3>
          <ul className="mt-4 space-y-1 text-sm text-navy-foreground/70">
            {LOCALITIES.slice(0, 6).map((l) => (
              <li key={l}>
                <Link
                  to="/listings"
                  search={{ locality: l }}
                  className="inline-flex min-h-10 items-center transition-colors hover:text-gold"
                >
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="eyebrow text-gold">Reach us</h3>
          <address className="mt-4 space-y-3 text-sm not-italic text-navy-foreground/70">
            <p>Skyra Realty</p>
            <p>4th Floor, 100 Ft Road, Indiranagar, Bengaluru 560038</p>
            <p>
              <a href={`tel:${CONTACT_PHONE_TEL}`} className="hover:text-gold">
                {CONTACT_PHONE_DISPLAY}
              </a>
            </p>
            <p>
              <a
                href={CONTACT_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold"
              >
                WhatsApp
              </a>
            </p>
            <p>
              <a href="mailto:hello@skyrarealty.in" className="hover:text-gold">
                hello@skyrarealty.in
              </a>
            </p>
          </address>
        </div>
      </div>
      <div className="border-t border-gold/15 px-4 py-5 text-center text-xs text-navy-foreground/50">
        © {new Date().getFullYear()} Skyra Realty. Listings served from Skyra Realty.
      </div>
    </footer>
  );
}
