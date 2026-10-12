"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowUpRightIcon, PlayIcon, YouTubeIcon } from "./icons";
import { YOUTUBE, YOUTUBE_HANDLE } from "./site";
import { thumbnail, type Video } from "./youtube";
import styles from "./Watch.module.css";

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Toronto",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));

// "Navarathiri 2026 - Day 1 - Performance by …" → series "Navarathiri 2026 · Day 1",
// name "Performance by …". Titles without separators stay whole.
function splitTitle(title: string) {
  const parts = title.split(/\s+[-–—|]\s+/);
  if (parts.length < 2) return { series: null, name: title };
  return { series: parts.slice(0, -1).join(" · "), name: parts[parts.length - 1] };
}

function ChannelCard() {
  return (
    <aside className={styles.channel}>
      <div className={styles.channelHead}>
        <Image
          src="/brand/social/youtube-profile-800.png"
          alt=""
          width={56}
          height={56}
          className={styles.avatar}
        />
        <div>
          <p className={styles.channelName}>Aayakalaihal Arangam</p>
          <p className={styles.channelHandle}>{YOUTUBE_HANDLE}</p>
        </div>
      </div>
      <p className={styles.channelCopy}>
        Concerts, recitals, student showcases and live streams from the
        Arangam. Subscribe to catch the next performance as it happens.
      </p>
      <div className={styles.channelActions}>
        <a
          href={`${YOUTUBE}?sub_confirmation=1`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.subscribe}
        >
          <YouTubeIcon size={18} />
          Subscribe
        </a>
        <a href={YOUTUBE} target="_blank" rel="noopener noreferrer" className={styles.visit}>
          View channel
          <ArrowUpRightIcon size={16} />
        </a>
      </div>
    </aside>
  );
}

export default function Watch({ videos }: { videos: Video[] }) {
  const [activeId, setActiveId] = useState(videos[0]?.id);
  const [playing, setPlaying] = useState(false);
  // Videos whose 1280px thumbnail failed to load fall back to hqdefault.
  const [noMaxres, setNoMaxres] = useState<Set<string>>(new Set());
  const stageRef = useRef<HTMLDivElement>(null);

  if (videos.length === 0) {
    return (
      <div className={styles.empty}>
        <p>New performances are on their way — follow the channel to see them first.</p>
        <ChannelCard />
      </div>
    );
  }

  const active = videos.find((v) => v.id === activeId) ?? videos[0];
  const rest = videos.filter((v) => v.id !== active.id).slice(0, 5);
  const { series, name } = splitTitle(active.title);

  function play(id: string) {
    setActiveId(id);
    setPlaying(true);
    // On narrow screens the list sits below the player; bring the player back into view.
    stageRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  return (
    <div className={styles.layout}>
      <div className={styles.featured} ref={stageRef}>
        <div className={styles.stage}>
          {playing ? (
            <iframe
              key={active.id}
              src={`https://www.youtube-nocookie.com/embed/${active.id}?autoplay=1&rel=0&modestbranding=1`}
              title={active.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className={styles.frame}
            />
          ) : (
            <button
              type="button"
              className={styles.poster}
              onClick={() => setPlaying(true)}
              aria-label={`Play ${active.title}`}
            >
              <Image
                src={thumbnail(active.id, noMaxres.has(active.id) ? "hq" : "maxres")}
                alt=""
                fill
                sizes="(max-width: 900px) 100vw, 680px"
                className={styles.posterImage}
                onError={() => setNoMaxres((s) => new Set(s).add(active.id))}
              />
              <span className={styles.play}>
                <PlayIcon size={30} />
              </span>
            </button>
          )}
        </div>
        <div className={styles.caption}>
          {series && <p className={styles.series}>{series}</p>}
          <h3 className={styles.videoTitle}>{name}</h3>
          <p className={styles.meta}>
            <time dateTime={active.published}>{formatDate(active.published)}</time>
            <span aria-hidden="true">·</span>
            <a
              href={`https://www.youtube.com/watch?v=${active.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Watch on YouTube
            </a>
          </p>
        </div>
      </div>

      <div className={styles.side}>
        {rest.length > 0 && (
          <ul className={styles.list} aria-label="More performances">
            {rest.map((v) => {
              const t = splitTitle(v.title);
              return (
                <li key={v.id}>
                  <button type="button" className={styles.item} onClick={() => play(v.id)}>
                    <span className={styles.itemThumb}>
                      <Image src={thumbnail(v.id)} alt="" fill sizes="132px" className={styles.posterImage} />
                    </span>
                    <span className={styles.itemText}>
                      {t.series && <span className={styles.itemSeries}>{t.series}</span>}
                      <span className={styles.itemTitle}>{t.name}</span>
                      <time className={styles.itemDate} dateTime={v.published}>
                        {formatDate(v.published)}
                      </time>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        <ChannelCard />
      </div>
    </div>
  );
}
