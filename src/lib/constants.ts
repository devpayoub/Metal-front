/* ------------------------------------------------------------------ */
/* Shared UI constants — theme tokens reused across multiple pages.    */
/* ------------------------------------------------------------------ */

/**
 * Dark hero gradient used by About / Services / Contact / section headers
 * (`from-secondary via-[#0a1029] to-secondary`).
 */
export const HERO_GRADIENT =
  "bg-gradient-to-br from-secondary via-[#0a1029] to-secondary";

/**
 * Decorative white 1px grid overlay — appears in 9+ places across the site.
 * Apply as the `style` prop of an absolutely-positioned div with low opacity.
 */
export const GRID_OVERLAY_STYLE: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(90deg, white 1px, transparent 1px), linear-gradient(white 1px, transparent 1px)",
  backgroundSize: "56px 56px",
};
