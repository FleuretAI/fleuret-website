import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import ScrollReveal from "./motion/ScrollReveal";
import StaggerGroup from "./motion/StaggerGroup";
import { staggerItem } from "@/lib/animations";

const CheckMark = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="mx-auto">
    <circle cx="10" cy="10" r="10" fill="var(--accent-blue)" fillOpacity="0.2" />
    <path d="M6 10.5L8.5 13L14 7.5" stroke="var(--accent-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CrossMark = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="mx-auto">
    <circle cx="10" cy="10" r="10" fill="white" fillOpacity="0.05" />
    <path d="M7 7L13 13M13 7L7 13" stroke="white" strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const ComparisonTable = () => {
  const { t } = useLanguage();

  const capabilities = [
    { label: t("comparison.accuracy"), traditional: t("comparison.accuracy.traditional"), fleuret: t("comparison.accuracy.fleuret"), automated: t("comparison.accuracy.automated") },
    { label: t("comparison.adaptability"), traditional: { check: true }, fleuret: { check: true }, automated: { check: false } },
    { label: t("comparison.depth"), traditional: t("comparison.depth.traditional"), fleuret: t("comparison.depth.fleuret"), automated: t("comparison.depth.automated") },
    { label: t("comparison.context"), traditional: t("comparison.context.traditional"), fleuret: t("comparison.context.fleuret"), automated: t("comparison.context.automated") },
    { label: t("comparison.frequency"), traditional: t("comparison.frequency.traditional"), fleuret: t("comparison.frequency.fleuret"), automated: t("comparison.frequency.automated") },
    { label: t("comparison.coverage"), traditional: t("comparison.coverage.traditional"), fleuret: t("comparison.coverage.fleuret"), automated: t("comparison.coverage.automated") },
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

  return (
    <section id="comparison" className="py-24 md:py-32">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white max-w-3xl mx-auto">
              {t("comparison.title")}
            </h2>
          </div>
        </ScrollReveal>

        <div className="max-w-5xl mx-auto overflow-x-auto">
          <StaggerGroup>
            <table className="w-full min-w-[640px]">
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
      </div>
    </section>
  );
};

export default ComparisonTable;
