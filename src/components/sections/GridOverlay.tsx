import { GRID_OVERLAY_STYLE } from "@/lib/constants";

/**
 * The decorative white-grid overlay used at low opacity on dark sections.
 * Just a thin wrapper so pages don't repeat the inline style block (9 copies).
 */
export function GridOverlay({ className = "" }: { className?: string }) {
  return (
    <div
      className={`absolute inset-0 opacity-[0.04] ${className}`}
      style={GRID_OVERLAY_STYLE}
    />
  );
}
