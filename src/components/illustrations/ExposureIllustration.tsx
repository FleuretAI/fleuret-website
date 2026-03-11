import { motion } from "framer-motion";

const ExposureIllustration = () => {
  return (
    <svg viewBox="0 0 360 120" fill="none" className="w-full h-auto">
      {/* Timeline bar */}
      <rect x="20" y="45" width="320" height="10" rx="5" fill="white" fillOpacity="0.05" />

      {/* Pentest zone (left, tiny) */}
      <motion.rect
        x="20"
        y="45"
        width="20"
        height="10"
        rx="5"
        fill="var(--accent-blue)"
        fillOpacity="0.4"
        initial={{ width: 0 }}
        animate={{ width: 20 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      />

      {/* Danger zone (huge exposed gap) */}
      <motion.rect
        x="40"
        y="45"
        width="0"
        height="10"
        fill="var(--accent-red)"
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: 280, opacity: [0, 0.6, 0.35] }}
        transition={{ duration: 1.4, delay: 0.8, ease: "easeOut" }}
      />

      {/* Pentest zone (right, tiny) */}
      <motion.rect
        x="320"
        y="45"
        width="20"
        height="10"
        rx="5"
        fill="var(--accent-blue)"
        fillOpacity="0.4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 2.2 }}
      />

      {/* Labels */}
      <motion.text
        x="30"
        y="36"
        textAnchor="middle"
        fill="var(--accent-blue)"
        fontSize="8"
        fontWeight="600"
        fontFamily="var(--font-sans)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 0.5 }}
      >
        PENTEST
      </motion.text>

      <motion.text
        x="180"
        y="36"
        textAnchor="middle"
        fill="var(--accent-red)"
        fontSize="9"
        fontWeight="700"
        fontFamily="var(--font-sans)"
        letterSpacing="0.1em"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.8] }}
        transition={{ delay: 1.4, duration: 0.6 }}
      >
        EXPOSED — 3 TO 12 MONTHS
      </motion.text>

      <motion.text
        x="330"
        y="36"
        textAnchor="middle"
        fill="var(--accent-blue)"
        fontSize="8"
        fontWeight="600"
        fontFamily="var(--font-sans)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 2.3 }}
      >
        PENTEST
      </motion.text>

      {/* Impact bursts on the timeline */}
      {[100, 155, 210, 265].map((cx, i) => (
        <motion.circle
          key={cx}
          cx={cx}
          cy={50}
          r="0"
          fill="var(--accent-red)"
          initial={{ r: 0, opacity: 0 }}
          animate={{ r: [0, 8, 0], opacity: [0, 0.4, 0] }}
          transition={{
            duration: 1.2,
            delay: 2.0 + i * 0.25,
            repeat: Infinity,
            repeatDelay: 2.5,
          }}
        />
      ))}

      {/* Warning triangles */}
      {[110, 180, 260].map((cx, i) => (
        <motion.g key={`warn-${cx}`}>
          <motion.path
            d={`M${cx} ${72} L${cx - 7} ${85} L${cx + 7} ${85} Z`}
            stroke="var(--accent-red)"
            strokeWidth="1.2"
            fill="var(--accent-red)"
            fillOpacity="0.15"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: [0, 0.8, 0.5], y: 0 }}
            transition={{
              duration: 0.8,
              delay: 2.2 + i * 0.3,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          />
          <motion.text
            x={cx}
            y={83}
            textAnchor="middle"
            fill="var(--accent-red)"
            fontSize="8"
            fontWeight="800"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.6] }}
            transition={{
              duration: 0.8,
              delay: 2.4 + i * 0.3,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          >
            !
          </motion.text>
        </motion.g>
      ))}

      {/* Shield icons on safe zones */}
      {[30, 330].map((cx) => (
        <motion.path
          key={`shield-${cx}`}
          d={`M${cx} ${68} L${cx - 8} ${74} L${cx - 8} ${82} C${cx - 8} ${88} ${cx} ${92} ${cx} ${92} C${cx} ${92} ${cx + 8} ${88} ${cx + 8} ${82} L${cx + 8} ${74} Z`}
          stroke="var(--accent-blue)"
          strokeWidth="1.2"
          fill="var(--accent-blue)"
          fillOpacity="0.1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: cx === 30 ? 0.6 : 2.4 }}
        />
      ))}

      {/* Checkmarks inside shields */}
      {[30, 330].map((cx) => (
        <motion.path
          key={`check-${cx}`}
          d={`M${cx - 3} ${80} L${cx} ${83} L${cx + 4} ${76}`}
          stroke="var(--accent-blue)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, delay: cx === 30 ? 0.8 : 2.6 }}
        />
      ))}

      {/* Pulsing red glow on the danger zone */}
      <motion.rect
        x="40"
        y="42"
        width="280"
        height="16"
        rx="8"
        fill="var(--accent-red)"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.08, 0] }}
        transition={{
          duration: 2,
          delay: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </svg>
  );
};

export default ExposureIllustration;
