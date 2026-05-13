/* ------------------------------------------------------------------ */
/* Shared media helpers — image URLs, fallbacks, error handlers.       */
/* Single source of truth to replace copies in pages-content/*.tsx      */
/* ------------------------------------------------------------------ */

/** placehold.co placeholder used as the last-resort image. */
export const FALLBACK_IMG =
  "https://placehold.co/900x600/141414/d4d4d4?text=MIS+Metal+Construction";

/** Build an Unsplash CDN URL from an image id. */
export const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

/**
 * `onError` handler for `<img>` tags — swaps a broken image for the fallback
 * exactly once (avoids infinite loops if the placeholder also fails).
 */
export const onImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  const el = e.currentTarget;
  if (el.src !== FALLBACK_IMG) el.src = FALLBACK_IMG;
};
