import Image from "next/image";
import styles from "./page.module.css";

const studioShots = [
  {
    src: "/studio/stage.jpg",
    alt: "The stage at Aayakalaihal Arangam, framed by traditional oil lamps",
    title: "The Stage",
    copy: "A clean, warmly lit stage framed by traditional oil lamps — ready for recitals, dance, and live performance.",
  },
  {
    src: "/studio/seating.jpg",
    alt: "Rows of auditorium seating facing the stage",
    title: "The Seating",
    copy: "Tiered auditorium seating brings family, friends, and community together for every show.",
  },
  {
    src: "/studio/soundboard.jpg",
    alt: "A digital mixing console glowing in the dark",
    title: "The Sound Board",
    copy: "A full digital mixing console gives every performance professional, concert-grade sound.",
  },
  {
    src: "/studio/sound-system.jpg",
    alt: "QSC K.2 series speakers mounted on stage",
    title: "The Sound System",
    copy: "QSC K.2 series speakers deliver clear, powerful audio throughout the hall.",
  },
  {
    src: "/studio/ganesha.jpg",
    alt: "A brass Ganesha statue on stage",
    title: "A Blessing on Stage",
    copy: "A brass Ganesha watches over every performance from the wings.",
  },
  {
    src: "/studio/lamp.jpg",
    alt: "A traditional brass kuthuvilakku ceremonial lamp",
    title: "The Kuthuvilakku",
    copy: "A traditional ceremonial lamp, lit before every event to honor the space and its purpose.",
  },
];

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.nav}>
        <a href="#top" className={styles.navBrand}>
          A&amp;K Foundation
        </a>
        <nav className={styles.navLinks}>
          <a href="#about">About</a>
          <a href="#studio">Studio</a>
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
            Cultivating community through music, mentorship, and performance.
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
              A home for music, mentorship, and performance
            </h2>
            <p className={styles.sectionLede}>
              A&amp;K Foundation is a non-profit organization based in
              Markham, Ontario, dedicated to preserving and celebrating
              traditional arts. Through our performance studio, mentorship
              programs, and community events, we give artists of every age a
              stage to grow, perform, and connect with one another.
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
                <h3>Mentorship</h3>
                <p>
                  Guidance and training that helps emerging artists find
                  their voice.
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

        <section id="contact" className={styles.section}>
          <div className={styles.sectionInner}>
            <p className={styles.eyebrowDark}>Visit Us</p>
            <h2 className={styles.sectionTitle}>Location &amp; Contact</h2>
            <div className={styles.meta}>
              <div>
                <h3>Location</h3>
                <p>80 Travail Road, Markham, Ontario, Canada</p>
              </div>
              <div>
                <h3>Contact</h3>
                <p>info@akfoundation.ca</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} A&amp;K Foundation. All rights reserved.</p>
      </footer>
    </div>
  );
}
