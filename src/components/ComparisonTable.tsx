import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import ScrollReveal from "./motion/ScrollReveal";
import StaggerGroup from "./motion/StaggerGroup";
import { staggerItem } from "@/lib/animations";

const CheckMark = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="mx-auto">
    <circle cx="10" cy="10" r="10" fill="#22c55e" fillOpacity="0.2" />
    <path d="M6 10.5L8.5 13L14 7.5" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CrossMark = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="mx-auto">
    <circle cx="10" cy="10" r="10" fill="#ef4444" fillOpacity="0.15" />
    <path d="M7 7L13 13M13 7L7 13" stroke="#ef4444" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const ComparisonTable = () => {
  const { t } = useLanguage();

  const capabilities = [
    { label: t("comparison.depth"), traditional: t("comparison.depth.traditional"), fleuret: t("comparison.depth.fleuret"), automated: t("comparison.depth.automated") },
    { label: t("comparison.speed"), traditional: t("comparison.speed.traditional"), fleuret: t("comparison.speed.fleuret"), automated: t("comparison.speed.automated") },
    { label: t("comparison.cost"), traditional: t("comparison.cost.traditional"), fleuret: t("comparison.cost.fleuret"), automated: t("comparison.cost.automated") },
    { label: t("comparison.falsePositives"), traditional: t("comparison.falsePositives.traditional"), fleuret: t("comparison.falsePositives.fleuret"), automated: t("comparison.falsePositives.automated") },
    { label: t("comparison.frequency"), traditional: t("comparison.frequency.traditional"), fleuret: t("comparison.frequency.fleuret"), automated: t("comparison.frequency.automated") },
    { label: t("comparison.compliance"), traditional: { check: true }, fleuret: { check: true }, automated: { check: false } },
    { label: t("comparison.adaptability"), traditional: { check: true }, fleuret: { check: true }, automated: { check: false } },
  ];

  const renderCell = (value: string | { check: boolean }, isFleuret = false) => {
    if (typeof value === "object") {
      return value.check ? <CheckMark /> : <CrossMark />;
    }
    return (
      <span className={`text-sm leading-tight ${isFleuret ? "font-semibold text-white" : "text-white/35"}`}>
        {value}
      </span>
    );
  };

  const renderCellInline = (value: string | { check: boolean }) => {
    if (typeof value === "object") {
      return value.check ? <CheckMark /> : <CrossMark />;
    }
    return <span className="text-sm text-white/50">{value}</span>;
  };

  return (
    <section id="comparison" className="py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-10 md:mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white max-w-3xl mx-auto">
              {t("comparison.title")}
            </h2>
          </div>
        </ScrollReveal>

        {/* Desktop table */}
        <div className="hidden md:block max-w-5xl mx-auto">
          <StaggerGroup>
            <table className="w-full">
              <thead>
                <motion.tr variants={staggerItem}>
                  <th className="text-left py-4 px-4 text-sm font-medium text-white/30 uppercase tracking-wider">
                    {t("comparison.header.capability")}
                  </th>
                  <th className="text-center py-4 px-4 text-sm font-medium text-white/30 uppercase tracking-wider">
                    {t("comparison.header.traditional")}
                  </th>
                  <th className="text-center py-4 px-4">
                    <span
                      className="inline-block text-sm font-bold text-white rounded-full px-4 py-1.5"
                      style={{ background: "linear-gradient(135deg, var(--accent-blue), var(--accent-violet))" }}
                    >
                      {t("comparison.header.fleuret")}
                    </span>
                  </th>
                  <th className="text-center py-4 px-4 text-sm font-medium text-white/30 uppercase tracking-wider">
                    {t("comparison.header.automated")}
                  </th>
                </motion.tr>
              </thead>
              <tbody>
                {capabilities.map((cap) => (
                  <motion.tr
                    key={cap.label}
                    variants={staggerItem}
                    className="border-t border-white/5 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-5 px-4 text-sm font-medium text-white/60">{cap.label}</td>
                    <td className="py-5 px-4 text-center">{renderCell(cap.traditional)}</td>
                    <td className="py-5 px-4 text-center bg-[var(--accent-blue)]/[0.03] border-x border-[var(--accent-blue)]/10">
                      {renderCell(cap.fleuret, true)}
                    </td>
                    <td className="py-5 px-4 text-center">{renderCell(cap.automated)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </StaggerGroup>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden max-w-sm mx-auto">
          <StaggerGroup className="space-y-3">
            {capabilities.map((cap) => (
              <motion.div
                key={cap.label}
                variants={staggerItem}
                className="p-4 rounded-xl border border-white/8 bg-white/[0.02]"
              >
                <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">
                  {cap.label}
                </p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-[10px] text-white/25 uppercase tracking-wider mb-1.5">
                      {t("comparison.header.traditional")}
                    </p>
                    {renderCellInline(cap.traditional)}
                  </div>
                  <div className="bg-[var(--accent-blue)]/[0.05] rounded-lg py-1.5 -my-1.5 px-1">
                    <p className="text-[10px] text-[var(--accent-blue)] uppercase tracking-wider mb-1.5 font-semibold">
                      Fleuret
                    </p>
                    <span className="text-sm font-semibold text-white">
                      {typeof cap.fleuret === "object" ? (
                        cap.fleuret.check ? <CheckMark /> : <CrossMark />
                      ) : (
                        cap.fleuret
                      )}
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/25 uppercase tracking-wider mb-1.5">
                      {t("comparison.header.automated")}
                    </p>
                    {renderCellInline(cap.automated)}
                  </div>
                </div>
              </motion.div>
            ))}
          </StaggerGroup>
        </div>
      </div>
    </section>
  );
};

export default ComparisonTable;
