import { motion } from "framer-motion";

/** Step 1 — "1-Click Deploy": a crosshair locking onto a target node,
 *  with connection lines radiating outward. */
const DeployIllustration = () => {
  const lineDelay = 0.6;

  return (
    <svg
      viewBox="0 0 280 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full max-w-[260px] mx-auto"
    >
      {/* Outer ring — fades in and scales */}
      <motion.circle
        cx="140"
        cy="140"
        r="110"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.1"
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />

      {/* Mid ring — dashed, rotates slowly */}
      <motion.circle
        cx="140"
        cy="140"
        r="80"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.15"
        strokeDasharray="6 8"
        initial={{ rotate: 0 }}
        whileInView={{ rotate: 360 }}
        viewport={{ once: true }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />

      {/* Crosshair lines */}
      {[
        { x1: 140, y1: 30, x2: 140, y2: 90 },
        { x1: 140, y1: 190, x2: 140, y2: 250 },
        { x1: 30, y1: 140, x2: 90, y2: 140 },
        { x1: 190, y1: 140, x2: 250, y2: 140 },
      ].map((line, i) => (
        <motion.line
          key={i}
          {...line}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeOpacity="0.25"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease: "easeOut" }}
        />
      ))}

      {/* Connection lines to satellite nodes */}
      {[
        { x: 60, y: 60 },
        { x: 220, y: 60 },
        { x: 60, y: 220 },
        { x: 220, y: 220 },
      ].map((node, i) => (
        <g key={i}>
          <motion.line
            x1="140"
            y1="140"
            x2={node.x}
            y2={node.y}
            stroke="currentColor"
            strokeWidth="1"
            strokeOpacity="0.1"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: lineDelay + i * 0.15,
              ease: "easeOut",
            }}
          />
          {/* Satellite dot */}
          <motion.circle
            cx={node.x}
            cy={node.y}
            r="5"
            fill="currentColor"
            fillOpacity="0.15"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.3,
              delay: lineDelay + 0.4 + i * 0.15,
              type: "spring",
            }}
          />
        </g>
      ))}

      {/* Center target — pulses */}
      <motion.circle
        cx="140"
        cy="140"
        r="18"
        fill="currentColor"
        fillOpacity="0.08"
        initial={{ scale: 0 }}
        whileInView={{ scale: [0, 1.2, 1] }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.5 }}
      />
      <motion.circle
        cx="140"
        cy="140"
        r="6"
        fill="currentColor"
        fillOpacity="0.3"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.7, type: "spring" }}
      />

      {/* Pulse ring */}
      <motion.circle
        cx="140"
        cy="140"
        r="18"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        initial={{ scale: 1, opacity: 0.3 }}
        whileInView={{
          scale: [1, 2.5],
          opacity: [0.3, 0],
        }}
        viewport={{ once: true }}
        transition={{
          duration: 2,
          delay: 1,
          repeat: Infinity,
          repeatDelay: 1,
          ease: "easeOut",
        }}
      />
    </svg>
  );
};

export default DeployIllustration;
