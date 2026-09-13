import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import type { Property } from "@/lib/skyra/types";

/** Auto-scrolling banner. Each slide shows only the locality as a caption. */
export function BannerCarousel({ properties }: { properties: Property[] }) {
  const slides = properties.slice(0, 8);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;
    const timer = window.setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      4000,
    );
    return () => window.clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  function go(delta: number) {
    setIndex((i) => (i + delta + slides.length) % slides.length);
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gold/20 bg-navy-deep shadow-elegant">
      <div
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((p) => (
          <figure key={p.id} className="relative min-w-full">
            <img
              src={p.images[0]}
              alt={`Property in ${p.locality}`}
              className="h-56 w-full object-cover sm:h-80 md:h-[26rem]"
            />
            <div className="absolute inset-0 bg-linear-to-t from-navy-deep/90 via-navy-deep/25 to-transparent" />
            <figcaption className="absolute bottom-14 left-4 flex max-w-[calc(100%-5rem)] items-center gap-2 rounded-full border border-gold/30 bg-navy-deep/70 px-3 py-2 backdrop-blur sm:bottom-6 sm:left-6 sm:max-w-none sm:px-4">
              <MapPin className="h-4 w-4 shrink-0 text-gold" />
              <span className="eyebrow truncate text-navy-foreground">
                {p.locality}, Bengaluru
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => go(-1)}
            className="absolute top-1/2 left-2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-gold/30 bg-navy-deep/70 text-gold backdrop-blur sm:left-4"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => go(1)}
            className="absolute top-1/2 right-2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-gold/30 bg-navy-deep/70 text-gold backdrop-blur sm:right-4"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 sm:right-6 sm:bottom-6 sm:left-auto sm:translate-x-0">
        {slides.map((p, i) => (
          <button
            key={p.id}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={
              i === index
                ? "h-3 w-8 rounded-full bg-gold"
                : "h-3 w-3 rounded-full bg-navy-foreground/40"
            }
          />
        ))}
      </div>
    </div>
  );
}
