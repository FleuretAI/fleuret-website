import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { SEO } from "@/seo/SEO";

const SecurityPolicy = () => {
  const { language, localize } = useLanguage();
  const isFr = language === "fr";

  return (
    <main id="main-content" className="min-h-screen pt-40 md:pt-48 pb-20 px-4">
      <SEO pageKey="security" />
      <div className="max-w-3xl mx-auto">
        <Link
          to={localize("/")}
          className="text-[var(--accent-blue)] hover:underline text-sm inline-block mb-8"
        >
          {isFr ? "← Retour" : "← Back"}
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          {isFr ? "Politique de sécurité" : "Security Policy"}
        </h1>
        <p className="text-white/30 text-sm mb-8">
          {isFr ? "Dernière mise à jour : 11 mars 2026" : "Last updated: March 11, 2026"}
        </p>

        {/* Section 1 */}
        <h2 className="text-xl font-semibold text-white mb-4 mt-10">
          {isFr ? "1. Notre engagement en matière de sécurité" : "1. Our Commitment to Security"}
        </h2>
        <div className="text-white/50 leading-relaxed text-sm space-y-3">
          {isFr ? (
            <>
              <p>
                La sécurité est au cœur de la mission de FLEURET AI. En tant que fournisseur de solutions de pentest par intelligence artificielle, nous appliquons à nos propres systèmes les standards les plus exigeants que nous attendons de ceux de nos clients.
              </p>
              <p>
                Nous adoptons une approche de sécurité en profondeur (defense in depth) couvrant l'ensemble de notre pile technologique, de l'infrastructure au code applicatif, en passant par les processus organisationnels.
              </p>
            </>
          ) : (
            <>
              <p>
                Security is at the core of FLEURET AI's mission. As a provider of AI-powered penetration testing solutions, we hold our own systems to the same rigorous standards we expect of our clients' systems.
              </p>
              <p>
                We adopt a defense-in-depth approach covering our entire technology stack, from infrastructure to application code and organizational processes.
              </p>
            </>
          )}
        </div>

        {/* Section 2 */}
        <h2 className="text-xl font-semibold text-white mb-4 mt-10">
          {isFr ? "2. Sécurité de l'infrastructure" : "2. Infrastructure Security"}
        </h2>
        <div className="text-white/50 leading-relaxed text-sm space-y-3">
          {isFr ? (
            <>
              <p>Notre infrastructure repose sur les principes suivants :</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>
                  <strong className="text-white/70">Hébergement européen :</strong> nos données de production sont hébergées dans des centres de données situés dans l'Union européenne, conformes aux exigences du RGPD.
                </li>
                <li>
                  <strong className="text-white/70">Chiffrement en transit :</strong> toutes les communications sont chiffrées via TLS 1.2 ou supérieur. Nous appliquons le HSTS (HTTP Strict Transport Security) sur l'ensemble de nos domaines.
                </li>
                <li>
                  <strong className="text-white/70">Chiffrement au repos :</strong> les données stockées sont chiffrées avec AES-256. Les clés de chiffrement sont gérées de manière sécurisée et font l'objet d'une rotation régulière.
                </li>
                <li>
                  <strong className="text-white/70">Accès restreint :</strong> l'accès aux systèmes de production est limité selon le principe du moindre privilège, avec authentification multi-facteurs obligatoire.
                </li>
                <li>
                  <strong className="text-white/70">Surveillance continue :</strong> nos systèmes sont surveillés en permanence. Toute activité suspecte déclenche une alerte immédiate auprès de l'équipe sécurité.
                </li>
              </ul>
            </>
          ) : (
            <>
              <p>Our infrastructure is built on the following principles:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>
                  <strong className="text-white/70">European hosting:</strong> our production data is hosted in data centers located within the European Union, compliant with GDPR requirements.
                </li>
                <li>
                  <strong className="text-white/70">Encryption in transit:</strong> all communications are encrypted using TLS 1.2 or higher. We enforce HSTS (HTTP Strict Transport Security) across all our domains.
                </li>
                <li>
                  <strong className="text-white/70">Encryption at rest:</strong> stored data is encrypted with AES-256. Encryption keys are securely managed and regularly rotated.
                </li>
                <li>
                  <strong className="text-white/70">Restricted access:</strong> access to production systems follows the principle of least privilege, with mandatory multi-factor authentication.
                </li>
                <li>
                  <strong className="text-white/70">Continuous monitoring:</strong> our systems are monitored around the clock. Any suspicious activity triggers an immediate alert to the security team.
                </li>
              </ul>
            </>
          )}
        </div>

        {/* Section 3 */}
        <h2 className="text-xl font-semibold text-white mb-4 mt-10">
          {isFr ? "3. Protection des données" : "3. Data Protection"}
        </h2>
        <div className="text-white/50 leading-relaxed text-sm space-y-3">
          {isFr ? (
            <>
              <p>
                FLEURET AI est pleinement conforme au Règlement Général sur la Protection des Données (RGPD). Nos pratiques incluent :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>
                  <strong className="text-white/70">Isolation des données :</strong> les données de chaque client sont strictement isolées. Aucun croisement de données entre clients n'est possible.
                </li>
                <li>
                  <strong className="text-white/70">Minimisation des données :</strong> nous ne collectons que les données strictement nécessaires à la fourniture du service.
                </li>
                <li>
                  <strong className="text-white/70">Conservation limitée :</strong> les données sont supprimées à l'expiration des délais de conservation définis dans notre{" "}
                  <Link to={localize("/privacy")} className="text-[var(--accent-blue)] hover:underline">politique de confidentialité</Link>.
                </li>
                <li>
                  <strong className="text-white/70">Registre des traitements :</strong> nous maintenons un registre des activités de traitement conformément à l'article 30 du RGPD.
                </li>
              </ul>
            </>
          ) : (
            <>
              <p>
                FLEURET AI is fully compliant with the General Data Protection Regulation (GDPR). Our practices include:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>
                  <strong className="text-white/70">Data isolation:</strong> each client's data is strictly isolated. No cross-client data access is possible.
                </li>
                <li>
                  <strong className="text-white/70">Data minimization:</strong> we only collect data strictly necessary for the delivery of the service.
                </li>
                <li>
                  <strong className="text-white/70">Limited retention:</strong> data is deleted upon expiration of the retention periods defined in our{" "}
                  <Link to={localize("/privacy")} className="text-[var(--accent-blue)] hover:underline">privacy policy</Link>.
                </li>
                <li>
                  <strong className="text-white/70">Processing records:</strong> we maintain a record of processing activities in accordance with Article 30 of the GDPR.
                </li>
              </ul>
            </>
          )}
        </div>

        {/* Section 4 */}
        <h2 className="text-xl font-semibold text-white mb-4 mt-10">
          {isFr ? "4. Divulgation responsable" : "4. Responsible Disclosure"}
        </h2>
        <div className="text-white/50 leading-relaxed text-sm space-y-3">
          {isFr ? (
            <>
              <p>
                Nous encourageons la communauté de la sécurité informatique à nous signaler de manière responsable toute vulnérabilité découverte dans nos systèmes.
              </p>
              <p><strong className="text-white/70">Comment signaler une vulnérabilité :</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>
                  Envoyez un email à{" "}
                  <a href="mailto:security@fleuret.ai" className="text-[var(--accent-blue)] hover:underline">security@fleuret.ai</a>{" "}
                  avec une description détaillée de la vulnérabilité.
                </li>
                <li>Incluez les étapes de reproduction, l'impact potentiel et, si possible, une preuve de concept.</li>
                <li>Utilisez notre clé PGP publique (disponible sur demande) pour chiffrer les informations sensibles.</li>
              </ul>
              <p><strong className="text-white/70">Notre engagement :</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Accusé de réception sous 48 heures ouvrées.</li>
                <li>Évaluation et première réponse sous 5 jours ouvrés.</li>
                <li>Communication transparente sur l'avancement de la correction.</li>
                <li>Nous ne poursuivrons pas en justice les chercheurs en sécurité agissant de bonne foi et dans le respect des règles de divulgation responsable.</li>
              </ul>
              <p><strong className="text-white/70">Règles à respecter :</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Ne pas accéder, modifier ou supprimer les données d'autres utilisateurs.</li>
                <li>Ne pas provoquer de déni de service ou de dégradation du service.</li>
                <li>Ne pas divulguer publiquement la vulnérabilité avant correction et accord mutuel.</li>
              </ul>
            </>
          ) : (
            <>
              <p>
                We encourage the security community to responsibly disclose any vulnerabilities discovered in our systems.
              </p>
              <p><strong className="text-white/70">How to report a vulnerability:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>
                  Send an email to{" "}
                  <a href="mailto:security@fleuret.ai" className="text-[var(--accent-blue)] hover:underline">security@fleuret.ai</a>{" "}
                  with a detailed description of the vulnerability.
                </li>
                <li>Include reproduction steps, potential impact, and if possible, a proof of concept.</li>
                <li>Use our public PGP key (available upon request) to encrypt sensitive information.</li>
              </ul>
              <p><strong className="text-white/70">Our commitment:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Acknowledgment within 48 business hours.</li>
                <li>Assessment and initial response within 5 business days.</li>
                <li>Transparent communication on remediation progress.</li>
                <li>We will not pursue legal action against security researchers acting in good faith and in compliance with responsible disclosure guidelines.</li>
              </ul>
              <p><strong className="text-white/70">Rules to follow:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Do not access, modify, or delete other users' data.</li>
                <li>Do not cause denial of service or service degradation.</li>
                <li>Do not publicly disclose the vulnerability before it is fixed and mutual agreement is reached.</li>
              </ul>
            </>
          )}
        </div>

        {/* Section 5 */}
        <h2 className="text-xl font-semibold text-white mb-4 mt-10">
          {isFr ? "5. Réponse aux incidents" : "5. Incident Response"}
        </h2>
        <div className="text-white/50 leading-relaxed text-sm space-y-3">
          {isFr ? (
            <>
              <p>
                FLEURET AI dispose d'un plan de réponse aux incidents de sécurité structuré autour des étapes suivantes :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>
                  <strong className="text-white/70">Détection et identification :</strong> surveillance continue et systèmes d'alerte automatisés permettant la détection rapide de toute anomalie.
                </li>
                <li>
                  <strong className="text-white/70">Confinement :</strong> isolation immédiate des systèmes affectés pour limiter l'impact de l'incident.
                </li>
                <li>
                  <strong className="text-white/70">Analyse et remédiation :</strong> investigation approfondie de la cause racine, correction des vulnérabilités identifiées et restauration des services.
                </li>
                <li>
                  <strong className="text-white/70">Notification :</strong> en cas de violation de données personnelles, notification à la CNIL dans les 72 heures et information des personnes concernées dans les meilleurs délais, conformément aux articles 33 et 34 du RGPD.
                </li>
                <li>
                  <strong className="text-white/70">Retour d'expérience :</strong> analyse post-incident et mise à jour des procédures pour prévenir la récurrence.
                </li>
              </ul>
            </>
          ) : (
            <>
              <p>
                FLEURET AI maintains a security incident response plan structured around the following stages:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>
                  <strong className="text-white/70">Detection and identification:</strong> continuous monitoring and automated alerting systems enabling rapid detection of any anomaly.
                </li>
                <li>
                  <strong className="text-white/70">Containment:</strong> immediate isolation of affected systems to limit the impact of the incident.
                </li>
                <li>
                  <strong className="text-white/70">Analysis and remediation:</strong> thorough root cause investigation, patching of identified vulnerabilities, and restoration of services.
                </li>
                <li>
                  <strong className="text-white/70">Notification:</strong> in the event of a personal data breach, notification to the CNIL within 72 hours and notification to affected individuals without undue delay, in accordance with Articles 33 and 34 of the GDPR.
                </li>
                <li>
                  <strong className="text-white/70">Post-mortem:</strong> post-incident analysis and procedure updates to prevent recurrence.
                </li>
              </ul>
            </>
          )}
        </div>

        {/* Section 6 */}
        <h2 className="text-xl font-semibold text-white mb-4 mt-10">
          {isFr ? "6. Contact" : "6. Contact"}
        </h2>
        <div className="text-white/50 leading-relaxed text-sm space-y-3">
          {isFr ? (
            <>
              <p>Pour toute question relative à la sécurité de nos services :</p>
              <p>
                <strong className="text-white/70">Sécurité :</strong>{" "}
                <a href="mailto:security@fleuret.ai" className="text-[var(--accent-blue)] hover:underline">security@fleuret.ai</a>
              </p>
              <p>
                <strong className="text-white/70">Général :</strong>{" "}
                <a href="mailto:contact@fleuret.ai" className="text-[var(--accent-blue)] hover:underline">contact@fleuret.ai</a>
              </p>
              <p>
                <strong className="text-white/70">Adresse :</strong> 60 Rue François 1er, 75008 Paris, France
              </p>
            </>
          ) : (
            <>
              <p>For any questions regarding the security of our services:</p>
              <p>
                <strong className="text-white/70">Security:</strong>{" "}
                <a href="mailto:security@fleuret.ai" className="text-[var(--accent-blue)] hover:underline">security@fleuret.ai</a>
              </p>
              <p>
                <strong className="text-white/70">General:</strong>{" "}
                <a href="mailto:contact@fleuret.ai" className="text-[var(--accent-blue)] hover:underline">contact@fleuret.ai</a>
              </p>
              <p>
                <strong className="text-white/70">Address:</strong> 60 Rue François 1er, 75008 Paris, France
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default SecurityPolicy;
