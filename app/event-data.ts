export type StudioEvent = {
  /** Unique id, also used for the generated graphic's colours. */
  slug: string;
  name: string;
  description: string;
  /** YYYY-MM-DD. The event drops off the site the day after this date. */
  date: string;
  /** Free text, e.g. "6:30 PM" or "6:30 – 9:00 PM". */
  time: string;
  artists: string[];
  /**
   * Ticket cost in CAD, or text for tiered pricing (e.g. "$20 single / $50 family").
   * Leave out (or set to 0) for a free event.
   */
  price?: number | string;
  /** Optional link to buy tickets; shows a "Get Tickets" button in the popup. */
  ticketUrl?: string;
  /** Optional poster in /public/events. Leave out to use a generated graphic. */
  image?: string;
};

// en-CA formats as YYYY-MM-DD, so it compares directly against event.date.
export function todayInToronto(now: number) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Toronto" }).format(now);
}

// Add upcoming events here. Past events are hidden automatically.
export const events: StudioEvent[] = [
  {
    slug: "carnatic-violin-concert-2026",
    name: "Carnatic Violin Concert",
    description:
      "Saadhana Conservatory of Music, in collaboration with Naadalayam Arts & Music, presents a Carnatic violin concert: a special evening of classical melody and rhythm, raising funds for Naadalayam Arts & Music.\n\nLimited seats remaining, first come, first served! Come support Naadalayam and celebrate the beauty, tradition, and artistry of Carnatic music. Bring your family and friends and support live classical music!",
    date: "2026-10-17",
    time: "4:00 PM",
    artists: [
      "Shri Mithuran Manogaran (violin)",
      "Shri R Sankaranarayanan (mridangam)",
      "Shri Anirudh Athreya (kanjira)",
      "Adhira Suganthan (violin support)",
    ],
    price: "$20 single / $50 family",
    ticketUrl:
      "https://www.eventbrite.ca/e/fundrasing-concert-for-naadalayam-arts-music-tickets-2002912314650",
    image: "/events/carnatic-violin-concert.jpg",
  },
];
