"use client";

import { AnimatePresence, motion } from "framer-motion";

export default function FieldError({ children }) {
  return (
    <AnimatePresence initial={false}>
      {children && (
        <motion.p
          initial={{ opacity: 0, y: -4, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -4, height: 0 }}
          transition={{ duration: 0.15 }}
          className="mt-1.5 overflow-hidden text-xs font-medium text-destructive"
        >
          {children}
        </motion.p>
      )}
    </AnimatePresence>
  );
}
