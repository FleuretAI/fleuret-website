import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { SEO } from "@/seo/SEO";

const TermsOfUse = () => {
  const { language, localize } = useLanguage();
  const isFr = language === "fr";

  return (
    <main id="main-content" className="min-h-screen pt-32 pb-20 px-4">
      <SEO pageKey="terms" />
      <div className="max-w-3xl mx-auto">
        <Link
          to={localize("/")}
          className="text-[var(--accent-blue)] hover:underline text-sm inline-block mb-8"
        >
          {isFr ? "← Retour" : "← Back"}
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          {isFr ? "Conditions générales d'utilisation" : "Terms of Use"}
        </h1>
        <p className="text-white/30 text-sm mb-8">
          {isFr ? "Dernière mise à jour : 11 mars 2026" : "Last updated: March 11, 2026"}
        </p>

        {/* Section 1 */}
        <h2 className="text-xl font-semibold text-white mb-4 mt-10">
          {isFr ? "1. Acceptation des conditions" : "1. Acceptance of Terms"}
        </h2>
        <div className="text-white/50 leading-relaxed text-sm space-y-3">
          {isFr ? (
            <>
              <p>
                L'accès et l'utilisation du site <a href="https://fleuret.ai" className="text-[var(--accent-blue)] hover:underline">https://fleuret.ai</a> et
                de la plateforme Fleuret (ci-après « le Service ») sont soumis aux présentes conditions générales d'utilisation (ci-après « les CGU »).
              </p>
              <p>
                En accédant au Service, vous reconnaissez avoir pris connaissance des présentes CGU et les accepter sans réserve. Si vous n'acceptez pas ces conditions, vous devez cesser toute utilisation du Service.
              </p>
            </>
          ) : (
            <>
              <p>
                Access to and use of <a href="https://fleuret.ai" className="text-[var(--accent-blue)] hover:underline">https://fleuret.ai</a> and
                the Fleuret platform (hereinafter "the Service") are subject to these terms of use (hereinafter "the Terms").
              </p>
              <p>
                By accessing the Service, you acknowledge that you have read and accept these Terms without reservation. If you do not accept these Terms, you must discontinue all use of the Service.
              </p>
            </>
          )}
        </div>

        {/* Section 2 */}
        <h2 className="text-xl font-semibold text-white mb-4 mt-10">
          {isFr ? "2. Description du service" : "2. Description of the Service"}
        </h2>
        <div className="text-white/50 leading-relaxed text-sm space-y-3">
          {isFr ? (
            <>
              <p>
                Fleuret est une plateforme de tests d'intrusion (pentest) automatisés par intelligence artificielle. Le Service permet aux utilisateurs de :
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Cartographier leur surface d'attaque externe.</li>
                <li>Lancer des tests d'intrusion automatisés sur leurs actifs numériques (applications web, API).</li>
                <li>Recevoir des rapports détaillés incluant les vulnérabilités identifiées, leur criticité et des recommandations de remédiation.</li>
              </ul>
              <p>
                Le Service est destiné exclusivement à des utilisations légitimes de sécurité offensive, sur des actifs dont l'utilisateur est propriétaire ou pour lesquels il dispose d'une autorisation écrite.
              </p>
            </>
          ) : (
            <>
              <p>
                Fleuret is an AI-powered automated penetration testing (pentest) platform. The Service enables users to:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Map their external attack surface.</li>
                <li>Launch automated penetration tests on their digital assets (web applications, APIs).</li>
                <li>Receive detailed reports including identified vulnerabilities, severity ratings, and remediation recommendations.</li>
              </ul>
              <p>
                The Service is intended exclusively for legitimate offensive security purposes, on assets owned by the user or for which the user has written authorization.
              </p>
            </>
          )}
        </div>

        {/* Section 3 */}
        <h2 className="text-xl font-semibold text-white mb-4 mt-10">
          {isFr ? "3. Compte et accès" : "3. Account and Access"}
        </h2>
        <div className="text-white/50 leading-relaxed text-sm space-y-3">
          {isFr ? (
            <>
              <p>
                L'accès à certaines fonctionnalités du Service nécessite la création d'un compte utilisateur. Vous êtes responsable de :
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>L'exactitude des informations fournies lors de l'inscription.</li>
                <li>La confidentialité de vos identifiants de connexion.</li>
                <li>Toute activité réalisée depuis votre compte.</li>
              </ul>
              <p>
                Vous vous engagez à nous notifier immédiatement tout accès non autorisé à votre compte à l'adresse{" "}
                <a href="mailto:contact@fleuret.ai" className="text-[var(--accent-blue)] hover:underline">contact@fleuret.ai</a>.
              </p>
            </>
          ) : (
            <>
              <p>
                Access to certain features of the Service requires creating a user account. You are responsible for:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>The accuracy of the information provided during registration.</li>
                <li>The confidentiality of your login credentials.</li>
                <li>All activity conducted from your account.</li>
              </ul>
              <p>
                You agree to notify us immediately of any unauthorized access to your account at{" "}
                <a href="mailto:contact@fleuret.ai" className="text-[var(--accent-blue)] hover:underline">contact@fleuret.ai</a>.
              </p>
            </>
          )}
        </div>

        {/* Section 4 */}
        <h2 className="text-xl font-semibold text-white mb-4 mt-10">
          {isFr ? "4. Utilisations interdites" : "4. Prohibited Uses"}
        </h2>
        <div className="text-white/50 leading-relaxed text-sm space-y-3">
          {isFr ? (
            <>
              <p>Il est strictement interdit de :</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Utiliser le Service pour tester des systèmes sans autorisation légitime du propriétaire.</li>
                <li>Procéder à de l'ingénierie inverse, décompiler, désassembler ou tenter d'extraire le code source du Service.</li>
                <li>Contourner, désactiver ou interférer avec les mécanismes de sécurité du Service.</li>
                <li>Collecter automatiquement (scraping) des données du Service sans autorisation écrite préalable.</li>
                <li>Revendre, sous-licencier ou redistribuer l'accès au Service à des tiers.</li>
                <li>Utiliser le Service à des fins illégales ou en violation de la législation applicable.</li>
              </ul>
              <p>
                Tout manquement à ces interdictions pourra entraîner la suspension ou la résiliation immédiate de votre compte, sans préjudice de toute action en justice.
              </p>
            </>
          ) : (
            <>
              <p>It is strictly prohibited to:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Use the Service to test systems without legitimate authorization from the owner.</li>
                <li>Reverse engineer, decompile, disassemble, or attempt to extract the source code of the Service.</li>
                <li>Circumvent, disable, or interfere with the security mechanisms of the Service.</li>
                <li>Automatically scrape data from the Service without prior written authorization.</li>
                <li>Resell, sublicense, or redistribute access to the Service to third parties.</li>
                <li>Use the Service for illegal purposes or in violation of applicable law.</li>
              </ul>
              <p>
                Any breach of these prohibitions may result in the immediate suspension or termination of your account, without prejudice to any legal action.
              </p>
            </>
          )}
        </div>

        {/* Section 5 */}
        <h2 className="text-xl font-semibold text-white mb-4 mt-10">
          {isFr ? "5. Propriété intellectuelle" : "5. Intellectual Property"}
        </h2>
        <div className="text-white/50 leading-relaxed text-sm space-y-3">
          {isFr ? (
            <>
              <p>
                Le Service, son contenu, ses fonctionnalités, son architecture, ses algorithmes, ses modèles d'intelligence artificielle et l'ensemble des éléments qui le composent sont la propriété exclusive de FLEURET AI et sont protégés par le droit de la propriété intellectuelle.
              </p>
              <p>
                L'utilisation du Service ne vous confère aucun droit de propriété intellectuelle sur celui-ci. Vous bénéficiez uniquement d'un droit d'utilisation limité, non exclusif, non transférable et révocable, pour la durée de votre abonnement.
              </p>
              <p>
                Les rapports générés par le Service sont mis à votre disposition pour votre usage interne. Vous en conservez la propriété des données qu'ils contiennent concernant vos systèmes.
              </p>
            </>
          ) : (
            <>
              <p>
                The Service, its content, features, architecture, algorithms, artificial intelligence models, and all its constituent elements are the exclusive property of FLEURET AI and are protected by intellectual property law.
              </p>
              <p>
                Use of the Service does not grant you any intellectual property rights over it. You are granted only a limited, non-exclusive, non-transferable, and revocable right of use for the duration of your subscription.
              </p>
              <p>
                Reports generated by the Service are made available for your internal use. You retain ownership of the data they contain regarding your systems.
              </p>
            </>
          )}
        </div>

        {/* Section 6 */}
        <h2 className="text-xl font-semibold text-white mb-4 mt-10">
          {isFr ? "6. Limitation de responsabilité" : "6. Limitation of Liability"}
        </h2>
        <div className="text-white/50 leading-relaxed text-sm space-y-3">
          {isFr ? (
            <>
              <p>
                Le Service est fourni en l'état. FLEURET AI ne garantit pas que le Service identifiera l'ensemble des vulnérabilités existantes sur vos systèmes. Les résultats des tests d'intrusion sont fournis à titre informatif et ne se substituent pas à un audit de sécurité complet par un professionnel qualifié.
              </p>
              <p>
                Dans les limites autorisées par la loi, FLEURET AI ne pourra être tenue responsable des dommages indirects, consécutifs, accessoires ou punitifs résultant de l'utilisation ou de l'impossibilité d'utiliser le Service, y compris la perte de données, la perte de revenus ou l'interruption d'activité.
              </p>
              <p>
                La responsabilité totale de FLEURET AI au titre des présentes CGU est limitée au montant des sommes effectivement versées par l'utilisateur au cours des douze (12) mois précédant l'événement générateur de responsabilité.
              </p>
            </>
          ) : (
            <>
              <p>
                The Service is provided as is. FLEURET AI does not guarantee that the Service will identify all existing vulnerabilities on your systems. Penetration test results are provided for informational purposes and do not substitute for a comprehensive security audit by a qualified professional.
              </p>
              <p>
                To the extent permitted by law, FLEURET AI shall not be liable for indirect, consequential, incidental, or punitive damages arising from the use of or inability to use the Service, including loss of data, loss of revenue, or business interruption.
              </p>
              <p>
                FLEURET AI's total liability under these Terms is limited to the amounts actually paid by the user during the twelve (12) months preceding the event giving rise to liability.
              </p>
            </>
          )}
        </div>

        {/* Section 7 */}
        <h2 className="text-xl font-semibold text-white mb-4 mt-10">
          {isFr ? "7. Exclusion de garantie" : "7. Warranty Disclaimer"}
        </h2>
        <div className="text-white/50 leading-relaxed text-sm space-y-3">
          {isFr ? (
            <>
              <p>
                Le Service est fourni « en l'état » et « selon disponibilité », sans garantie d'aucune sorte, expresse ou implicite, y compris, sans limitation, les garanties implicites de qualité marchande, d'adéquation à un usage particulier et de non-contrefaçon.
              </p>
              <p>
                FLEURET AI ne garantit pas que le Service sera ininterrompu, sécurisé, exempt d'erreurs, ni que les défauts seront corrigés. L'utilisation du Service se fait à vos propres risques.
              </p>
            </>
          ) : (
            <>
              <p>
                The Service is provided "as is" and "as available," without warranty of any kind, express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
              </p>
              <p>
                FLEURET AI does not warrant that the Service will be uninterrupted, secure, error-free, or that defects will be corrected. Use of the Service is at your own risk.
              </p>
            </>
          )}
        </div>

        {/* Section 8 */}
        <h2 className="text-xl font-semibold text-white mb-4 mt-10">
          {isFr ? "8. Droit applicable et juridiction" : "8. Governing Law and Jurisdiction"}
        </h2>
        <div className="text-white/50 leading-relaxed text-sm space-y-3">
          {isFr ? (
            <>
              <p>
                Les présentes CGU sont régies par le droit français. Tout litige relatif à leur interprétation, exécution ou résiliation sera soumis à la compétence exclusive du Tribunal de commerce de Paris, y compris en cas de pluralité de défendeurs ou d'appel en garantie.
              </p>
              <p>
                Les présentes CGU n'affectent pas les droits dont vous bénéficiez en tant que consommateur en vertu de la législation impérative applicable.
              </p>
            </>
          ) : (
            <>
              <p>
                These Terms are governed by French law. Any dispute relating to their interpretation, performance, or termination shall be subject to the exclusive jurisdiction of the Commercial Court of Paris (Tribunal de commerce de Paris), including in cases of multiple defendants or warranty claims.
              </p>
              <p>
                These Terms do not affect any rights you may have as a consumer under applicable mandatory legislation.
              </p>
            </>
          )}
        </div>

        {/* Section 9 */}
        <h2 className="text-xl font-semibold text-white mb-4 mt-10">
          {isFr ? "9. Modifications" : "9. Modifications"}
        </h2>
        <div className="text-white/50 leading-relaxed text-sm space-y-3">
          {isFr ? (
            <p>
              FLEURET AI se réserve le droit de modifier les présentes CGU à tout moment. Les modifications prennent effet dès leur publication sur le site. En cas de modification substantielle, nous vous en informerons par email au moins trente (30) jours avant leur entrée en vigueur. La poursuite de l'utilisation du Service après l'entrée en vigueur des modifications vaut acceptation des nouvelles CGU.
            </p>
          ) : (
            <p>
              FLEURET AI reserves the right to modify these Terms at any time. Modifications take effect upon publication on the site. In the event of a material change, we will notify you by email at least thirty (30) days before the change takes effect. Continued use of the Service after the effective date of modifications constitutes acceptance of the new Terms.
            </p>
          )}
        </div>

        {/* Section 10 */}
        <h2 className="text-xl font-semibold text-white mb-4 mt-10">
          {isFr ? "10. Contact" : "10. Contact"}
        </h2>
        <div className="text-white/50 leading-relaxed text-sm space-y-3">
          {isFr ? (
            <>
              <p>Pour toute question relative aux présentes conditions, vous pouvez nous contacter :</p>
              <p>
                <strong className="text-white/70">FLEURET AI</strong><br />
                60 Rue François 1er, 75008 Paris, France<br />
                Email :{" "}
                <a href="mailto:contact@fleuret.ai" className="text-[var(--accent-blue)] hover:underline">contact@fleuret.ai</a>
              </p>
            </>
          ) : (
            <>
              <p>For any questions regarding these Terms, you can contact us:</p>
              <p>
                <strong className="text-white/70">FLEURET AI</strong><br />
                60 Rue François 1er, 75008 Paris, France<br />
                Email:{" "}
                <a href="mailto:contact@fleuret.ai" className="text-[var(--accent-blue)] hover:underline">contact@fleuret.ai</a>
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default TermsOfUse;
