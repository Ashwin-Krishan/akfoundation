"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { todayInToronto, type StudioEvent } from "./event-data";
import styles from "./Events.module.css";

// Event dates are calendar days, so format them at noon UTC to avoid
// slipping a day in either direction.
function eventDate(date: string, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "UTC", ...options }).format(
    new Date(`${date}T12:00:00Z`),
  );
}

function formatPrice(price?: number | string) {
  if (!price) return "Free";
  if (typeof price === "string") return price;
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: price % 1 === 0 ? 0 : 2,
  }).format(price);
}

const palettes = [
  ["#7a2f1d", "#d1784a", "#f3c98b"],
  ["#3b1f3a", "#a8495b", "#f0b48a"],
  ["#1f2e3b", "#4f7c8a", "#e6b48c"],
  ["#2d2a1a", "#8a7a3a", "#f1d9a0"],
  ["#401a12", "#b5673a", "#f7e1c0"],
];

function hash(text: string) {
  let h = 0;
  for (const ch of text) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h;
}

/** Fallback poster for events without an image, derived from the slug. */
function GeneratedArt({ event }: { event: StudioEvent }) {
  const h = hash(event.slug);
  const [deep, mid, light] = palettes[h % palettes.length];
  const id = `art-${event.slug}`;
  const ringX = 60 + (h % 220);
  const day = eventDate(event.date, { day: "numeric" });
  const month = eventDate(event.date, { month: "short" }).toUpperCase();

  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className={styles.art}
      role="img"
      aria-label={`${event.name} graphic`}
    >
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={deep} />
          <stop offset="1" stopColor={mid} />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={light} stopOpacity="0.55" />
          <stop offset="1" stopColor={light} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#${id}-bg)`} />
      <circle cx={ringX} cy="70" r="150" fill={`url(#${id}-glow)`} />
      {[60, 95, 130].map((r) => (
        <circle
          key={r}
          cx={ringX + 120}
          cy="250"
          r={r}
          fill="none"
          stroke={light}
          strokeOpacity="0.18"
          strokeWidth="1.5"
        />
      ))}
      {/* Oil lamp flame, a nod to the stage lamps */}
      <g transform="translate(0 110)">
        <path
          d="M340 40 C352 58 354 72 340 84 C326 72 328 58 340 40 Z"
          fill={light}
          fillOpacity="0.85"
        />
        <rect x="326" y="86" width="28" height="6" rx="3" fill={light} fillOpacity="0.6" />
      </g>
      <text x="28" y="62" fill={light} fontSize="16" letterSpacing="4" fontWeight="600">
        {month}
      </text>
      <text x="26" y="112" fill="#fbf6ee" fontSize="52" fontFamily="var(--font-serif)">
        {day}
      </text>
    </svg>
  );
}

function EventArt({ event, sizes }: { event: StudioEvent; sizes: string }) {
  if (event.image) {
    return (
      <Image
        src={event.image}
        alt={`${event.name} poster`}
        fill
        sizes={sizes}
        className={styles.image}
      />
    );
  }
  return <GeneratedArt event={event} />;
}

const noopSubscribe = () => () => {};

export default function Events({
  events,
  builtOn,
}: {
  events: StudioEvent[];
  /** Toronto date at build time; used for the prerendered HTML. */
  builtOn: string;
}) {
  // The prerendered page filters by build date; once hydrated, the visitor's
  // clock takes over so events that have passed since the build drop off.
  const today =
    useSyncExternalStore(
      noopSubscribe,
      () => todayInToronto(Date.now()),
      () => null,
    ) ?? builtOn;
  const [selected, setSelected] = useState<StudioEvent | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (selected && !dialog.open) dialog.showModal();
    if (!selected && dialog.open) dialog.close();
  }, [selected]);

  const upcoming = events
    .filter((e) => e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <>
      {upcoming.length === 0 ? (
        <p className={styles.empty}>
          No upcoming events right now. Check back soon!
        </p>
      ) : (
        <ul className={styles.grid}>
          {upcoming.map((event) => (
            <li key={event.slug}>
              <button
                type="button"
                className={styles.card}
                onClick={() => setSelected(event)}
                aria-haspopup="dialog"
              >
                <div className={styles.artWrap}>
                  <EventArt
                    event={event}
                    sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                  />
                </div>
                <div className={styles.cardBody}>
                  <h3>{event.name}</h3>
                  <p>
                    {eventDate(event.date, {
                      weekday: "short",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <span className={styles.more}>View details →</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        onClose={() => setSelected(null)}
        onClick={(e) => {
          // Clicking the backdrop (the dialog element itself) closes it.
          if (e.target === e.currentTarget) setSelected(null);
        }}
        aria-labelledby="event-dialog-title"
      >
        {selected && (
          <div
            className={`${styles.dialogInner} ${selected.image ? styles.withPoster : ""}`}
          >
            <button
              type="button"
              className={styles.close}
              onClick={() => setSelected(null)}
              aria-label="Close"
            >
              ×
            </button>
            <div
              className={`${styles.dialogArt} ${selected.image ? styles.dialogPoster : ""}`}
            >
              <EventArt event={selected} sizes="(max-width: 760px) 100vw, 420px" />
            </div>
            <div className={styles.dialogBody}>
              <h2 id="event-dialog-title">{selected.name}</h2>
              <p className={styles.description}>{selected.description}</p>
              <dl className={styles.details}>
                <div>
                  <dt>Date</dt>
                  <dd>
                    {eventDate(selected.date, {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </dd>
                </div>
                <div>
                  <dt>Time</dt>
                  <dd>{selected.time}</dd>
                </div>
                <div>
                  <dt>Tickets</dt>
                  <dd>{formatPrice(selected.price)}</dd>
                </div>
                <div className={styles.wide}>
                  <dt>Artists</dt>
                  <dd>
                    {selected.artists.map((artist) => (
                      <span key={artist} className={styles.artist}>
                        {artist}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>
              {selected.ticketUrl && (
                <a
                  href={selected.ticketUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.tickets}
                >
                  Get Tickets ↗
                </a>
              )}
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
