"use client";
import { motion } from "framer-motion";

export default function Loader() {
  const bars = [0, 1, 2, 3];

  return (
    <div className="flex items-end space-x-2 h-12">
      {bars.map((i) => (
        <motion.span
          key={i}
          className="w-2 h-10 bg-green rounded-full"
          animate={{
            scaleY: [0.4, 1.3, 0.4],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  );
}
