# Skyra Realty Portal

AI Build Prompt — Skyra Realty (Bengaluru Property Listing Platform)

Copy everything below into your AI coding tool (e.g. Claude, Cursor, v0, bolt.new, etc.) as the project brief.

PROMPT START

Build a frontend-only property listing web platform for Bengaluru called "Skyra Realty". There is no backend and no database — all data must be seeded in the frontend code and persisted using browser storage (localStorage) so that anything added, edited, or viewed during a session survives a page refresh.

1. Brand identity

Name: Skyra Realty

Logo concept: A navy circular badge containing a gold line-art mark of a house in front of city skyscrapers, a bird in flight, and a ground/field line beneath — with "SKYRA" in a serif wordmark and "REALTY" in a smaller letter-spaced sans-serif below it, both in gold on navy.

Brand mood: premium, trustworthy, established — a mix of skyline (aspiration/height) and rooted ground (stability), rendered in a refined navy-and-gold palette.

2. Color theme (derived from the logo — use these as the design tokens)

Primary Navy (brand base): #12253F

Deep Navy (headers/footer/dark sections): #0B1626

Gold / Brass (primary accent, CTAs, active states, icons): #D9A94E

Deep Gold (hover/pressed states): #B5872F

Paper / Background: #F8F6F0 (warm off-white, not stark white)

Ink (body text): #1B1F27

Muted stone (secondary text, borders): #8A8C91

Use navy as the dominant structural color (header, footer, key sections, buttons' text-on-gold or gold-on-navy combinations) and gold strictly as an accent — for CTAs, active filters, price highlights, icons, and the logo itself. Avoid overusing gold as a background fill; it should read as a highlight, not a wash.

3. Typography

Headings/display: a serif typeface echoing the "SKYRA" wordmark (e.g. Playfair Display, Fraunces, or similar elegant serif).

Body/UI text: a clean sans-serif echoing "REALTY" (e.g. Inter, Work Sans, or similar), with slightly letter-spaced uppercase used sparingly for labels/eyebrows (mirroring the logo's spaced "REALTY" treatment) — but not overused across the whole UI.

4. Tech stack

React (functional components + hooks)

React Router for navigation between pages

Context API or plain useState/useReducer for state — no Redux needed

localStorage as the only persistence layer (no server, no API calls)

Recharts (or similar) for the analytics charts in the admin panel

5. Property types to support

Flat / Apartment

Villa

Penthouse

Independent House

Commercial Building

Shop

PG / Co-living Building

Farm / Farmhouse

Plot / Land

6. Scope

City is fixed to Bengaluru only. Include a realistic list of Bengaluru localities/areas for filters and seed data, e.g.: Indiranagar, Koramangala, HSR Layout, Whitefield, Sarjapur Road, Electronic City, Jayanagar, JP Nagar, Marathahalli, Bellandur, Hebbal, Yelahanka, Malleshwaram, Basavanagudi, Rajajinagar, BTM Layout, Bannerghatta Road, Kanakapura Road, RT Nagar, Banashankari, Hennur, and CV Raman Nagar.

7. Data model

Define a Property object shape like:

{
  id,
  title,
  type,              // one of the property types above
  locality,          // Bengaluru area from the list above
  address,
  price,             // in INR
  areaSqft,
  bedrooms,          // 0 for plots/land/commercial/shop
  bathrooms,
  furnishing,        // Unfurnished / Semi-furnished / Fully-furnished
  possessionStatus,  // Ready to move / Under construction
  ageOfProperty,     // New / 0-5 years / 5-10 years / 10+ years
  facing,            // North / South / East / West / etc.
  floorNumber,
  totalFloors,
  amenities,         // array: parking, lift, power backup, gym, swimming pool, security, park, clubhouse, etc.
  description,
  images,            // array of image URLs (use picsum.photos or unsplash source placeholders)
  listedDate,
  ownerContactName,
  ownerContactPhone,
  viewCount           // used for per-property analytics
}


Seed 40–60 realistic properties spread across all property types and localities above, with varied prices, sizes, and images.

8. Pages required

a) Landing page

Navy header/navbar with the Skyra Realty logo mark and gold wordmark, search bar, and nav links.

Hero section (navy or deep-navy background) with a serif headline, short subtext, and a prominent search bar (locality/keyword search) with a gold CTA button.

A running/auto-scrolling banner carousel of property images — each banner slide shows only the property's location/locality as a caption, not full details.

Quick links/cards for browsing by property type (Flats, Villas, Plots, Commercial, PG, Farms, etc.), using the gold accent for icons.

A "Featured/Recently listed" property grid section.

A short "Why Skyra Realty" / trust section, and a navy footer with gold links/logo.

b) Listings page

Full property grid/list with pagination or infinite scroll.

Advanced filter sidebar/panel, comparable to real portals (NoBroker/99acres/MagicBricks style), including:

Property type (multi-select)

Locality (multi-select or searchable dropdown)

Price range (min–max slider, gold slider handle)

Area/sqft range

Bedrooms (BHK: 1/2/3/4/5+)

Bathrooms

Furnishing status

Possession status

Age of property

Facing direction

Amenities (multi-select checkboxes)

Sort options: price low–high, high–low, newest, area.

Search bar that filters by keyword (title/locality/address).

Result count and empty state when no matches.

Active filter chips in gold-on-navy or navy-on-gold outline style.

c) Property detail page

Dedicated route per property (e.g. /property/:id).

Image gallery, full price (in gold, prominent) and specs, description, amenities list, locality map placeholder, owner/contact section, and similar-properties section.

Every visit to this page should increment that property's viewCount in localStorage (for analytics).

d) Admin section (no auth needed, or a simple hardcoded password gate)

Add Property form covering every field in the data model above, with validation, image URL inputs (or file-to-base64 preview), and a submit that saves the new property into localStorage (merged with seed data).

Manage Properties: table/list of all properties (seed + admin-added) with edit and delete actions.

Analytics dashboard:

Total platform visits (track via localStorage counter incremented on app load)

Page-wise views (landing page, listings page, admin page, each property detail page — track per route)

Per-property view count, sortable/rankable (most viewed properties)

Simple charts (bar/line, styled in navy/gold) showing this data, plus a raw table view

9. Analytics implementation notes (no backend)

Since there's no backend, simulate analytics entirely client-side:

On each route change, log a { page, timestamp } entry to localStorage.

On each property detail page visit, increment viewCount for that property ID in localStorage.

Admin dashboard reads and aggregates this localStorage data to render totals, per-page counts, and per-property rankings.

Clearly note in the code comments that this is session/browser-local analytics (not real multi-user tracking), since there's no server.

10. Design direction

Premium real-estate feel built around the navy-and-gold brand — not a generic SaaS template, and not a copy of the flagged "warm cream + terracotta" AI-default look.

Consistent typography: serif for headings, sans-serif for body/UI, as defined above.

Navy as the dominant structural color; gold reserved for accents, CTAs, active states, and highlights.

Fully responsive: mobile, tablet, desktop.

Reusable components: Navbar, Footer, PropertyCard, FilterPanel, Banner/Carousel, AdminTable, AnalyticsChart.

Use the logo (house + skyline + bird motif) as a visual cue elsewhere in the UI where appropriate — e.g. a subtle line-art skyline as a section divider or empty-state illustration — without overusing it.

11. Non-functional requirements

No backend, no external API keys, no authentication service — everything runs client-side.

All state changes (add/edit/delete property, analytics counters) must persist via localStorage so a refresh doesn't lose data.

Include a "Reset to seed data" option in the admin panel to clear localStorage and restore the original seed dataset.

Code should be modular and componentized, not a single giant file.

PROMPT END

Notes for you (not part of the prompt)

Since there's no backend, "analytics" here will only reflect activity on the same browser/device — it can't track visits across different users' devices. If you eventually want real multi-user analytics, you'll need a backend + database at that point.

You can paste this prompt as-is, or trim sections (e.g. drop analytics or admin) if you want a smaller first version.

If your AI tool supports image uploads, attach the Skyra Realty logo file alongside this prompt so it can match the exact gold/navy shades and mark style.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
