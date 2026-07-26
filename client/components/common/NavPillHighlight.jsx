"use client";

import { motion } from "framer-motion";

export default function NavPillHighlight({ layoutId, className }) {
  return (
    <motion.span
      layoutId={layoutId}
      className={className}
      transition={{ type: "spring", stiffness: 500, damping: 34 }}
    />
  );
}
