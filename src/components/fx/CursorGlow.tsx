"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

export function CursorGlow() {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: fine)").matches) setEnabled(true);
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  if (!enabled) return null;
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[55] h-[420px] w-[420px] rounded-full mix-blend-screen"
      style={{
        background:
          "radial-gradient(circle, rgba(255,107,0,0.18) 0%, rgba(255,107,0,0.06) 35%, rgba(255,107,0,0) 70%)",
      }}
      animate={{ x: pos.x - 210, y: pos.y - 210 }}
      transition={{ type: "spring", stiffness: 120, damping: 18, mass: 0.4 }}
    />
  );
}
