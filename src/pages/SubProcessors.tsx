import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { SEO } from "@/seo/SEO";

const LAST_UPDATED = "2026-04-28";

type Row = {
  vendor: string;
  country: string;
  purposeFr: string;
  purposeEn: string;
  dataFr: string;
  dataEn: string;
  dpa: string;
};

const ACTIVE: Row[] = [
  {
    vendor: "Scaleway SAS",
    country: "🇫🇷 France (Paris)",
    purposeFr:
      "Hébergement applicatif, base PostgreSQL, inférence LLM (gpt-oss, Kimi K2.5) sur GPU H100",
    purposeEn:
      "Application hosting, PostgreSQL database, LLM inference (gpt-oss, Kimi K2.5) on H100 GPUs",
    dataFr: "Données client (workspaces, scans, findings, rapports), métadonnées tenant",
    dataEn: "Customer data (workspaces, scans, findings, reports), tenant metadata",
    dpa: "https://www.scaleway.com/en/dpa/",
  },
  {
    vendor: "Supabase, Inc.",
    country: "🇪🇺 EU (eu-west-3, Frankfurt)",
    purposeFr: "Authentification, base centrale (profils, billing, métadonnées), Edge Functions",
    purposeEn: "Authentication, central database (profiles, billing, metadata), Edge Functions",
    dataFr: "Identifiants utilisateur, sessions, données de facturation",
    dataEn: "User credentials, sessions, billing data",
    dpa: "https://supabase.com/dpa",
  },
  {
    vendor: "Vercel, Inc.",
    country: "🇫🇷 fra1 (Paris)",
    purposeFr: "Hébergement frontend statique fleuret.ai + serverless functions API",
    purposeEn: "Static frontend hosting fleuret.ai + serverless API functions",
    dataFr: "Métadonnées de navigation. Aucune donnée client sensible.",
    dataEn: "Navigation metadata. No sensitive customer data.",
    dpa: "https://vercel.com/legal/dpa",
  },
  {
    vendor: "Resend",
    country: "🇪🇺 EU",
    purposeFr: "Emails transactionnels (notifications findings, rapports prêts)",
    purposeEn: "Transactional email (findings notifications, report-ready alerts)",
    dataFr: "Adresses email destinataires, métadonnées d'envoi",
    dataEn: "Recipient email addresses, send metadata",
    dpa: "https://resend.com/legal/dpa",
  },
  {
    vendor: "Make.com (Celonis)",
    country: "🇨🇿 Czech Republic (EU)",
    purposeFr: "Synchronisation Airtable → Google Sheets pour pipeline interne",
    purposeEn: "Airtable → Google Sheets sync for internal pipeline",
    dataFr: "Aucune donnée client. Métadonnées commerciales internes uniquement.",
    dataEn: "No customer data. Internal commercial metadata only.",
    dpa: "https://www.make.com/en/legal/dpa",
  },
  {
    vendor: "Slack Technologies (Salesforce)",
    country: "🇺🇸 United States",
    purposeFr: "Communication équipe interne",
    purposeEn: "Internal team communication",
    dataFr: "Aucune donnée client. Communications internes uniquement.",
    dataEn: "No customer data. Internal communications only.",
    dpa: "https://slack.com/trust/compliance/data-processing-agreement",
  },
  {
    vendor: "Granola",
    country: "🇺🇸 United States",
    purposeFr: "Notes de réunion internes",
    purposeEn: "Internal meeting notes",
    dataFr: "Aucune donnée client. Notes internes uniquement.",
    dataEn: "No customer data. Internal notes only.",
    dpa: "https://www.granola.ai/legal",
  },
];

const EVALUATING: Array<{ vendor: string; purposeFr: string; purposeEn: string }> = [
  {
    vendor: "Stripe (EU)",
    purposeFr: "Facturation client + paiement par carte",
    purposeEn: "Customer billing + card payments",
  },
  {
    vendor: "Plain (EU)",
    purposeFr: "Support client (Q3 2026)",
    purposeEn: "Customer support (Q3 2026)",
  },
  {
    vendor: "Sentry (EU)",
    purposeFr: "Monitoring erreurs application",
    purposeEn: "Application error monitoring",
  },
];

const SubProcessors = () => {
  const { language, localize } = useLanguage();
  const isFr = language === "fr";

  return (
    <main id="main-content" className="min-h-screen pt-40 md:pt-48 pb-20 px-4">
      <SEO pageKey="subProcessors" />
      <div className="max-w-5xl mx-auto">
        <Link
          to={localize("/")}
          className="text-[var(--accent-blue)] hover:underline text-sm inline-block mb-8"
        >
          {isFr ? "← Retour" : "← Back"}
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          {isFr ? "Sous-processeurs" : "Sub-processors"}
        </h1>
        <p className="text-white/30 text-sm mb-10">
          {isFr ? "Dernière mise à jour : " : "Last updated: "}
          {LAST_UPDATED}
        </p>

        <div className="text-white/60 leading-relaxed text-sm space-y-3 mb-10 max-w-3xl">
          {isFr ? (
            <p>
              Conformément au RGPD (art. 28) et aux obligations sous-processeurs des plateformes partenaires (DPA), Fleuret AI maintient ci-dessous la liste exhaustive de ses sous-processeurs. Tout ajout ou modification fait l'objet d'une notification écrite aux clients sous 30 jours via l'adresse email enregistrée dans le contrat.
            </p>
          ) : (
            <p>
              In line with GDPR art. 28 and partner-platform sub-processor obligations (DPA), Fleuret AI maintains the exhaustive list of its sub-processors below. Any addition or change is notified in writing to customers 30 days in advance, at the contractual email address.
            </p>
          )}
        </div>

        <h2 className="text-xl font-semibold text-white mb-4 mt-10">
          {isFr ? "Sous-processeurs actifs" : "Active sub-processors"}
        </h2>

        <div className="overflow-x-auto rounded-2xl border border-white/8 bg-white/[0.02]">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-white/40 text-xs uppercase tracking-wider border-b border-white/8">
                <th className="px-4 py-3 font-medium">{isFr ? "Fournisseur" : "Vendor"}</th>
                <th className="px-4 py-3 font-medium">{isFr ? "Pays" : "Country"}</th>
                <th className="px-4 py-3 font-medium">{isFr ? "Finalité" : "Purpose"}</th>
                <th className="px-4 py-3 font-medium">{isFr ? "Données traitées" : "Data processed"}</th>
                <th className="px-4 py-3 font-medium">DPA</th>
              </tr>
            </thead>
            <tbody>
              {ACTIVE.map((r) => (
                <tr key={r.vendor} className="border-b border-white/5 last:border-0 align-top">
                  <td className="px-4 py-4 text-white font-medium whitespace-nowrap">{r.vendor}</td>
                  <td className="px-4 py-4 text-white/70 whitespace-nowrap">{r.country}</td>
                  <td className="px-4 py-4 text-white/60">{isFr ? r.purposeFr : r.purposeEn}</td>
                  <td className="px-4 py-4 text-white/60">{isFr ? r.dataFr : r.dataEn}</td>
                  <td className="px-4 py-4">
                    <a
                      href={r.dpa}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--accent-blue)] hover:underline text-xs"
                    >
                      {isFr ? "Lien" : "Link"}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-semibold text-white mb-4 mt-12">
          {isFr ? "En évaluation (à ajouter Q3 2026)" : "Under evaluation (Q3 2026)"}
        </h2>

        <ul className="space-y-2 text-sm text-white/60 max-w-3xl">
          {EVALUATING.map((e) => (
            <li key={e.vendor}>
              <span className="text-white">{e.vendor}</span>
              <span className="text-white/40"> &middot; </span>
              {isFr ? e.purposeFr : e.purposeEn}
            </li>
          ))}
        </ul>

        <h2 className="text-xl font-semibold text-white mb-4 mt-12">
          {isFr ? "Localisation des données" : "Data residency"}
        </h2>
        <ul className="text-sm text-white/60 leading-relaxed list-disc list-inside space-y-2 max-w-3xl">
          {isFr ? (
            <>
              <li>
                <strong className="text-white/80">Données client</strong> (workspaces, scans, findings, rapports) : stockées exclusivement en France (Scaleway Paris) et région UE (Supabase eu-west-3).
              </li>
              <li>
                <strong className="text-white/80">Inférence LLM</strong> : modèles open-weight (gpt-oss, Kimi K2.5) servis sur Scaleway GPU France. Aucun appel à API LLM tiers (OpenAI, Anthropic, Google).
              </li>
              <li>
                <strong className="text-white/80">Frontend / API</strong> : Vercel région fra1 (Paris).
              </li>
              <li>
                <strong className="text-white/80">Emails transactionnels</strong> : Resend région UE.
              </li>
              <li>
                <strong className="text-white/80">Backups</strong> : chiffrés AES-256, stockés Scaleway France (zone géographiquement séparée).
              </li>
            </>
          ) : (
            <>
              <li>
                <strong className="text-white/80">Customer data</strong> (workspaces, scans, findings, reports): stored exclusively in France (Scaleway Paris) and the EU region (Supabase eu-west-3).
              </li>
              <li>
                <strong className="text-white/80">LLM inference</strong>: open-weight models (gpt-oss, Kimi K2.5) served on Scaleway GPU France. No third-party LLM API calls (OpenAI, Anthropic, Google).
              </li>
              <li>
                <strong className="text-white/80">Frontend / API</strong>: Vercel fra1 region (Paris).
              </li>
              <li>
                <strong className="text-white/80">Transactional email</strong>: Resend EU region.
              </li>
              <li>
                <strong className="text-white/80">Backups</strong>: AES-256 encrypted, stored on Scaleway France (geographically separated zone).
              </li>
            </>
          )}
        </ul>

        <h2 className="text-xl font-semibold text-white mb-4 mt-12">
          {isFr ? "Garanties RGPD" : "GDPR safeguards"}
        </h2>
        <ul className="text-sm text-white/60 leading-relaxed list-disc list-inside space-y-2 max-w-3xl">
          {isFr ? (
            <>
              <li>Tous les sous-processeurs listés disposent d'un DPA signé avec Fleuret AI conforme aux Clauses Contractuelles Types (CCT) UE.</li>
              <li>Pour les sous-processeurs hors UE (Slack, Granola, données internes uniquement), Fleuret applique les mécanismes de transfert RGPD-compliants (CCT 2021 + analyse d'impact transfert).</li>
              <li>Aucun sous-processeur ne traite de données client personnellement identifiables hors UE.</li>
            </>
          ) : (
            <>
              <li>All listed sub-processors have a signed DPA with Fleuret AI matching EU Standard Contractual Clauses.</li>
              <li>For non-EU sub-processors (Slack, Granola, internal data only), Fleuret applies GDPR-compliant transfer mechanisms (2021 SCCs + transfer impact assessment).</li>
              <li>No sub-processor processes personally identifiable customer data outside the EU.</li>
            </>
          )}
        </ul>

        <h2 className="text-xl font-semibold text-white mb-4 mt-12">
          {isFr ? "Notification de changements" : "Change notification"}
        </h2>
        <ul className="text-sm text-white/60 leading-relaxed list-disc list-inside space-y-2 max-w-3xl">
          {isFr ? (
            <>
              <li>
                <strong className="text-white/80">Clients sous contrat actif</strong> : email à l'adresse contractuelle, 30 jours avant prise d'effet.
              </li>
              <li>
                <strong className="text-white/80">Partenaires distribution sous MSA</strong> : notification additionnelle au point de contact technique du partenaire.
              </li>
              <li>
                <strong className="text-white/80">Public</strong> : mise à jour de cette page.
              </li>
            </>
          ) : (
            <>
              <li>
                <strong className="text-white/80">Active customers</strong>: email at the contractual address, 30 days before the change takes effect.
              </li>
              <li>
                <strong className="text-white/80">Distribution partners under MSA</strong>: extra notification to the partner's technical contact.
              </li>
              <li>
                <strong className="text-white/80">Public</strong>: this page is updated.
              </li>
            </>
          )}
        </ul>

        <h2 className="text-xl font-semibold text-white mb-4 mt-12">Contact</h2>
        <ul className="text-sm text-white/60 leading-relaxed space-y-2 max-w-3xl">
          <li>
            {isFr ? "Questions sous-processeurs : " : "Sub-processor questions: "}
            <a className="text-[var(--accent-blue)] hover:underline" href="mailto:yanis@fleuret.ai">
              yanis@fleuret.ai
            </a>
          </li>
          <li>
            {isFr ? "Disclosure responsable : " : "Responsible disclosure: "}
            <a
              className="text-[var(--accent-blue)] hover:underline"
              href="mailto:security@fleuret.ai"
            >
              security@fleuret.ai
            </a>
          </li>
        </ul>
      </div>
    </main>
  );
};

export default SubProcessors;
