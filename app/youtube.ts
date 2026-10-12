import { YOUTUBE_CHANNEL_ID } from "./site";

export type Video = {
  id: string;
  title: string;
  /** ISO timestamp from the feed. */
  published: string;
};

const FEED = `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;

function tag(xml: string, name: string) {
  return xml.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`))?.[1].trim() ?? "";
}

function decode(text: string) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'");
}

/**
 * Latest uploads from the channel's public feed (newest first). Re-fetched at
 * most once an hour, so new uploads show up without a redeploy. Returns []
 * if YouTube can't be reached, and the section falls back to the channel link.
 */
export async function getLatestVideos(limit = 7): Promise<Video[]> {
  try {
    const res = await fetch(FEED, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const xml = await res.text();
    return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)]
      .slice(0, limit)
      .map(([, entry]) => ({
        id: tag(entry, "yt:videoId"),
        title: decode(tag(entry, "title")),
        published: tag(entry, "published"),
      }))
      .filter((v) => v.id);
  } catch {
    return [];
  }
}

/** hqdefault always exists; maxresdefault (1280px) only for HD uploads. */
export const thumbnail = (id: string, size: "hq" | "maxres" = "hq") =>
  `https://i.ytimg.com/vi/${id}/${size}default.jpg`;
