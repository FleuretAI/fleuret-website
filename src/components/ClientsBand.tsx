import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import stoikLogo from "@/assets/investors/stoik.svg";

type Client = {
  name: string;
  logo: string;
  href?: string;
};

const clients: Client[] = [
  { name: "Stoïk", logo: stoikLogo, href: "https://stoik.io" },
];

const ClientsBand = () => {
  const { t } = useLanguage();

  if (clients.length === 0) return null;

  return (
    <section
      aria-labelledby="clients-band-title"
      className="border-y border-white/5 bg-black/40 py-10 sm:py-12"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2
          id="clients-band-title"
          className="text-center text-xs sm:text-sm font-medium uppercase tracking-[0.2em] text-white/50"
        >
          {t("clients.title")}
        </h2>

        <motion.ul
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-8 sm:gap-12"
        >
          {clients.map((client) => {
            const inner = (
              <img
                src={client.logo}
                alt={client.name}
                loading="lazy"
                className="h-8 w-auto opacity-60 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 sm:h-10"
              />
            );
            return (
              <li key={client.name}>
                {client.href ? (
                  <a
                    href={client.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={client.name}
                    className="block rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400"
                  >
                    {inner}
                  </a>
                ) : (
                  inner
                )}
              </li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
};

export default ClientsBand;
