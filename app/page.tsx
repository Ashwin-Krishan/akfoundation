import Image from "next/image";
import styles from "./page.module.css";
import Events from "./Events";
import Watch from "./Watch";
import { InstagramIcon, MailIcon, YouTubeIcon } from "./icons";
import { getLatestVideos, thumbnail, type Video } from "./youtube";
import { events, todayInToronto, type StudioEvent } from "./event-data";
import {
  ADDRESS,
  DESCRIPTION,
  EMAIL,
  INSTAGRAM,
  SITE_NAME,
  SITE_URL,
  VENUE_NAME,
  YOUTUBE,
  YOUTUBE_HANDLE,
} from "./site";

const studioShots = [
  {
    src: "/studio/stage.jpg",
    alt: "The stage at Aayakalaihal Arangam, seen from the back of the seating area",
    title: "The Stage",
    copy: "A well-lit stage framed by traditional oil lamps, seen from the back of the room — ready for recitals, dance, and live performance.",
  },
  {
    src: "/studio/seating.jpg",
    alt: "Rows of auditorium seating seen from the stage",
    title: "The Seating",
    copy: "Tiered auditorium seating, seen from the stage — room for family, friends, and community to gather for every show.",
  },
  {
    src: "/studio/sound-system.jpg",
    alt: "QSC K.2 series speakers mounted on stage",
    title: "The Sound System",
    copy: "QSC K.2 series speakers deliver clear, powerful audio throughout the hall.",
  },
];

// Module scope runs once per build, so this is the build date.
const builtOn = todayInToronto(Date.now());

const venue = {
  "@type": "PerformingArtsTheater",
  "@id": `${SITE_URL}/#venue`,
  name: VENUE_NAME,
  image: `${SITE_URL}/brand/aayakalaihal-arangam-emblem.png`,
  address: ADDRESS,
  url: SITE_URL,
};

// "4:00 PM" on 2026-10-17 -> "2026-10-17T16:00:00-04:00".
function startDate({ date, time }: StudioEvent) {
  const m = time.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i);
  if (!m) return date;
  const hour = (Number(m[1]) % 12) + (m[3].toUpperCase() === "PM" ? 12 : 0);
  const local = `${date}T${String(hour).padStart(2, "0")}:${m[2] ?? "00"}`;
  // Toronto's UTC offset on that day (EDT/EST), e.g. "GMT-04:00" -> "-04:00".
  const offset = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Toronto",
    timeZoneName: "longOffset",
  })
    .formatToParts(new Date(`${date}T12:00:00Z`))
    .find((p) => p.type === "timeZoneName")
    ?.value.replace("GMT", "");
  return `${local}:00${offset || "Z"}`;
}

function eventOffers(event: StudioEvent) {
  if (!event.price) return { "@type": "Offer", price: 0, priceCurrency: "CAD", url: event.ticketUrl };
  const prices =
    typeof event.price === "number"
      ? [event.price]
      : [...event.price.matchAll(/\$(\d+(?:\.\d+)?)/g)].map((m) => Number(m[1]));
  return {
    "@type": "AggregateOffer",
    lowPrice: Math.min(...prices),
    highPrice: Math.max(...prices),
    priceCurrency: "CAD",
    url: event.ticketUrl,
    availability: "https://schema.org/InStock",
  };
}

// Structured data so search engines understand the org, venue, events and videos.
const structuredData = (videos: Video[]) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "NGO",
      "@id": `${SITE_URL}/#org`,
      name: SITE_NAME,
      alternateName: "AK Foundation",
      url: SITE_URL,
      logo: `${SITE_URL}/brand/ak-foundation-logo.png`,
      description: DESCRIPTION,
      email: EMAIL,
      address: ADDRESS,
      sameAs: [INSTAGRAM, YOUTUBE],
    },
    venue,
    ...events
      .filter((e) => e.date >= builtOn)
      .map((e) => ({
        "@type": "MusicEvent",
        name: e.name,
        description: e.description,
        startDate: startDate(e),
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: venue,
        image: e.image ? [`${SITE_URL}${e.image}`] : undefined,
        performer: e.artists.map((name) => ({
          "@type": "Person",
          name: name.replace(/\s*\(.*\)$/, ""),
        })),
        organizer: { "@id": `${SITE_URL}/#org` },
        offers: eventOffers(e),
      })),
    ...videos.map((v) => ({
      "@type": "VideoObject",
      name: v.title,
      description: `${v.title} at ${VENUE_NAME}, Markham.`,
      thumbnailUrl: thumbnail(v.id),
      uploadDate: v.published,
      embedUrl: `https://www.youtube.com/embed/${v.id}`,
      url: `https://www.youtube.com/watch?v=${v.id}`,
      publisher: { "@id": `${SITE_URL}/#org` },
    })),
  ],
});

export default async function Home() {
  const videos = await getLatestVideos();
  const jsonLd = structuredData(videos);

  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <header className={styles.nav}>
        <a href="#top" className={styles.navBrand}>
          A&amp;K Foundation
        </a>
        <nav className={styles.navLinks}>
          <a href="#about">About</a>
          <a href="#studio">Studio</a>
          <a href="#events">Events</a>
          <a href="#watch">Watch</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <section id="top" className={styles.hero}>
        <video
          className={styles.heroVideo}
          src="/video/studio.mp4"
          poster="/video/poster.jpg"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className={styles.heroScrim} />
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Non-profit in Markham, Ontario</p>
          <h1 className={styles.title}>A&amp;K Foundation</h1>
          <p className={styles.lede}>
            Cultivating community through music and performance.
          </p>
          <div className={styles.heroActions}>
            <a href="#studio" className={styles.buttonPrimary}>
              Tour the Studio
            </a>
            <a href="#contact" className={styles.buttonGhost}>
              Get in Touch
            </a>
          </div>
        </div>
      </section>

      <main>
        <section id="about" className={styles.section}>
          <div className={styles.sectionInner}>
            <p className={styles.eyebrowDark}>About Us</p>
            <h2 className={styles.sectionTitle}>
              A home for music and performance
            </h2>
            <p className={styles.sectionLede}>
              A&amp;K Foundation is a non-profit organization based in
              Markham, Ontario, dedicated to preserving and celebrating
              traditional arts. Through our performance studio and community
              events, we give artists of every age a stage to grow, perform,
              and connect with one another.
            </p>
            <div className={styles.pillars}>
              <div className={styles.pillar}>
                <h3>Music</h3>
                <p>
                  Recitals and performances that keep classical and
                  contemporary traditions alive.
                </p>
              </div>
              <div className={styles.pillar}>
                <h3>Performance</h3>
                <p>
                  A professionally equipped stage where every event becomes a
                  moment to remember.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="studio" className={styles.studioSection}>
          <div className={styles.sectionInner}>
            <p className={styles.eyebrow}>Our Space</p>
            <h2 className={styles.sectionTitleLight}>Aayakalaihal Arangam</h2>
            <p className={styles.sectionLedeLight}>
              Our music performance studio at 80 Travail Road in Markham is
              built for live sound and live audiences — a proper stage,
              tiered seating, and a professional sound system, all under one
              roof.
            </p>

            <div className={styles.gallery}>
              {studioShots.map((shot) => (
                <figure key={shot.src} className={styles.galleryItem}>
                  <div className={styles.galleryImageWrap}>
                    <Image
                      src={shot.src}
                      alt={shot.alt}
                      fill
                      sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                      className={styles.galleryImage}
                    />
                  </div>
                  <figcaption>
                    <h3>{shot.title}</h3>
                    <p>{shot.copy}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section id="events" className={styles.section}>
          <div className={styles.sectionInner}>
            <p className={styles.eyebrowDark}>What&apos;s On</p>
            <h2 className={styles.sectionTitle}>Upcoming Events</h2>
            <p className={styles.sectionLede}>
              Recitals, showcases, and concerts at Aayakalaihal Arangam. Tap
              an event for the full details.
            </p>
            <Events events={events} builtOn={builtOn} />
          </div>
        </section>

        <section id="watch" className={styles.watchSection}>
          <div className={styles.sectionInner}>
            <p className={styles.eyebrow}>Watch &amp; Listen</p>
            <h2 className={styles.sectionTitleLight}>Recent Performances</h2>
            <p className={styles.sectionLedeLight}>
              Recordings and live streams from Aayakalaihal Arangam, straight
              from our YouTube channel. Press play to watch right here.
            </p>
            <Watch videos={videos} />
          </div>
        </section>

        <section id="contact" className={styles.section}>
          <div className={styles.sectionInner}>
            <p className={styles.eyebrowDark}>Visit Us</p>
            <h2 className={styles.sectionTitle}>Location &amp; Contact</h2>
            <div className={styles.meta}>
              <div>
                <h3>Location</h3>
                <p>80 Travail Road, Unit 16, Markham, Ontario, Canada</p>
              </div>
              <div>
                <h3>Contact</h3>
                <p>
                  <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                </p>
              </div>
              <div>
                <h3>Follow</h3>
                <ul className={styles.follow}>
                  <li>
                    <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer">
                      <InstagramIcon size={18} />
                      @aayakalaihalarangam
                    </a>
                  </li>
                  <li>
                    <a href={YOUTUBE} target="_blank" rel="noopener noreferrer">
                      <YouTubeIcon size={18} />
                      {YOUTUBE_HANDLE}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <nav className={styles.social} aria-label="A&K Foundation elsewhere">
          <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <InstagramIcon />
          </a>
          <a href={YOUTUBE} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
            <YouTubeIcon />
          </a>
          <a href={`mailto:${EMAIL}`} aria-label="Email">
            <MailIcon />
          </a>
        </nav>
        <p>&copy; {new Date().getFullYear()} A&amp;K Foundation. All rights reserved.</p>
      </footer>
    </div>
  );
}
