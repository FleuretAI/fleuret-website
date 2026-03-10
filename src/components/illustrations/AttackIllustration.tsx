import { motion } from "framer-motion";

/** Step 2 — "Automated Attack": Multiple AI agents (nodes) converge
 *  on a central target system, with attack paths lighting up
 *  as agents discover and exploit vulnerabilities. */
const AttackIllustration = () => {
  // Agents positioned around the perimeter, attacking the center target
  const agents = [
    { x: -80, y: -60, delay: 0.6 },
    { x: 70, y: -75, delay: 0.9 },
    { x: -90, y: 30, delay: 1.2 },
    { x: 85, y: 45, delay: 1.5 },
    { x: -30, y: -90, delay: 1.0 },
    { x: 40, y: 80, delay: 1.8 },
  ];

  // Breach points on the target perimeter
  const breaches = [
    { x: -18, y: -22, delay: 2.2 },
    { x: 20, y: -10, delay: 2.6 },
    { x: -8, y: 18, delay: 3.0 },
  ];

  return (
    <svg
      viewBox="0 0 280 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full max-w-[260px] mx-auto"
    >
      <g transform="translate(140,140)">
        {/* Target system — central rectangle representing infrastructure */}
        <motion.rect
          x="-32" y="-28" width="64" height="56" rx="6"
          stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3"
          fill="currentColor" fillOpacity="0.05"
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
        {/* Inner lines — representing services/ports */}
        {[-12, 0, 12].map((y, i) => (
          <motion.line
            key={i}
            x1="-20" y1={y} x2="20" y2={y}
            stroke="currentColor" strokeWidth="1" strokeOpacity="0.1"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.4 + i * 0.1 }}
          />
        ))}

        {/* Agent nodes + attack paths to center */}
        {agents.map((agent, i) => (
          <g key={i}>
            {/* Attack path — line from agent to target */}
            <motion.line
              x1={agent.x} y1={agent.y} x2={0} y2={0}
              stroke="currentColor" strokeWidth="1"
              strokeDasharray="4 4"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.15 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: agent.delay, ease: "easeOut" }}
            />

            {/* Travelling pulse along path */}
            <motion.circle
              r="2" fill="currentColor" fillOpacity="0.5"
              initial={{ cx: agent.x, cy: agent.y, opacity: 0 }}
              whileInView={{
                cx: [agent.x, 0],
                cy: [agent.y, 0],
                opacity: [0.6, 0],
              }}
              viewport={{ once: true }}
              transition={{
                duration: 1.2,
                delay: agent.delay + 0.4,
                ease: "easeIn",
                repeat: Infinity,
                repeatDelay: 2 + i * 0.3,
              }}
            />

            {/* Agent node — small diamond shape */}
            <motion.g
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: agent.delay, type: "spring", stiffness: 300 }}
            >
              <rect
                x={agent.x - 6} y={agent.y - 6} width="12" height="12" rx="2"
                fill="currentColor" fillOpacity="0.1"
                stroke="currentColor" strokeWidth="1" strokeOpacity="0.3"
                transform={`rotate(45,${agent.x},${agent.y})`}
              />
              <circle
                cx={agent.x} cy={agent.y} r="2"
                fill="currentColor" fillOpacity="0.6"
              />
            </motion.g>
          </g>
        ))}

        {/* Breach indicators — flashing on the target perimeter */}
        {breaches.map((b, i) => (
          <g key={`breach-${i}`}>
            <motion.circle
              cx={b.x} cy={b.y} r="3"
              fill="currentColor" fillOpacity="0"
              initial={{ fillOpacity: 0 }}
              whileInView={{ fillOpacity: [0, 0.6, 0.3] }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: b.delay }}
            />
            {/* Ripple */}
            <motion.circle
              cx={b.x} cy={b.y} r="3"
              stroke="currentColor" fill="none"
              initial={{ scale: 1, opacity: 0 }}
              whileInView={{ scale: [1, 3], opacity: [0.5, 0] }}
              viewport={{ once: true }}
              transition={{
                duration: 1,
                delay: b.delay + 0.2,
                repeat: Infinity,
                repeatDelay: 2.5,
              }}
            />
          </g>
        ))}

        {/* Outer perimeter ring — represents the attack surface */}
        <motion.circle
          cx="0" cy="0" r="110"
          stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.06"
          strokeDasharray="3 6"
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        />
      </g>
    </svg>
  );
};

export default AttackIllustration;
