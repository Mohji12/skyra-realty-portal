import { cn } from "@/lib/utils";

/** Gold line-art mark: bird, skyline, house and ground line inside a ring. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("h-10 w-10 text-gold", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="45" strokeWidth="2.6" />
      <path d="M30 27c3-3 6-1 7 1 1-2 4-4 7-1" strokeWidth="2" />
      <path d="M55 33h9v33h-9z" />
      <path d="M64 39h7v27h-7z" />
      <path d="M28 47l12-11 12 11v19H28z" />
      <path d="M38 56h5v10h-5z" strokeWidth="1.8" />
      <path d="M22 68h56c-3 10-14 16-28 16S25 78 22 68z" />
      <path d="M33 69l6 14M48 69l4 14M62 69l1 12" strokeWidth="1.5" />
    </svg>
  );
}

export function Logo({
  className,
  showWordmark = true,
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <span className={cn("flex min-w-0 items-center gap-3", className)}>
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-navy-deep ring-1 ring-gold/40">
        <LogoMark className="h-8 w-8" />
      </span>
      {showWordmark && (
        <span className="flex min-w-0 flex-col leading-none">
          <span className="font-display text-xl font-bold tracking-wide text-gold">
            SKYRA
          </span>
          <span className="eyebrow text-gold/70">Realty</span>
        </span>
      )}
    </span>
  );
}

/** Subtle line-art skyline used as a section divider / empty-state illustration. */
export function SkylineDivider({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 60"
      preserveAspectRatio="none"
      className={cn("h-12 w-full text-gold/40", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
    >
      <path d="M0 56h60V34h22v22h30V22h26v34h34V12h24v44h40V30h30v26h36V18h26v38h44V38h28v18h50V26h30v30h70" />
      <path d="M0 58h600" strokeWidth="1" />
      <path d="M120 12c3-3 6-1 7 1 1-2 4-4 7-1" strokeWidth="1.2" />
    </svg>
  );
}
