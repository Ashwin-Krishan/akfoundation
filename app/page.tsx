import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.shell}>
        <p className={styles.eyebrow}>Non-profit in Markham, Ontario</p>
        <h1 className={styles.title}>AK Foundation</h1>
        <p className={styles.lede}>
          Cultivating community through music, mentorship, and performance.
        </p>

        <section className={styles.panel}>
          <h2>Aayakalaihal Arangam</h2>
          <p>
            Our music performance studio located at 80 Travail Road in Markham.
          </p>
          <p className={styles.muted}>Website launching soon.</p>
        </section>

        <section className={styles.meta}>
          <div>
            <h3>Location</h3>
            <p>80 Travail Road, Markham, Ontario, Canada</p>
          </div>
          <div>
            <h3>Contact</h3>
            <p>info@akfoundation.ca</p>
          </div>
        </section>
      </main>
    </div>
  );
}
