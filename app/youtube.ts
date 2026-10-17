export type Video = {
  /** The id from the YouTube URL: youtube.com/watch?v=<id> */
  id: string;
  /** "Series - Day - Name" titles show the series as a small label above the name. */
  title: string;
  /** YYYY-MM-DD the performance took place. */
  date: string;
};

// Performances shown in the "Recent Performances" section, newest first.
// Only videos listed here appear on the site (trailers etc. stay off).
export const videos: Video[] = [];

/** hqdefault always exists; maxresdefault (1280px) only for HD uploads. */
export const thumbnail = (id: string, size: "hq" | "maxres" = "hq") =>
  `https://i.ytimg.com/vi/${id}/${size}default.jpg`;
