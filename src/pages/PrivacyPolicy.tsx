import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const PrivacyPolicy = () => {
  const { language } = useLanguage();
  const isFr = language === "fr";

  return (
    <main className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/"
          className="text-[var(--accent-blue)] hover:underline text-sm inline-block mb-8"
        >
          {isFr ? "← Retour" : "← Back"}
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          {isFr ? "Politique de confidentialité" : "Privacy Policy"}
        </h1>
        <p className="text-white/30 text-sm mb-8">
          {isFr ? "Dernière mise à jour : 11 mars 2026" : "Last updated: March 11, 2026"}
        </p>

        {/* Section 1 */}
        <h2 className="text-xl font-semibold text-white mb-4 mt-10">
          {isFr ? "1. Responsable du traitement" : "1. Data Controller"}
        </h2>
        <div className="text-white/50 leading-relaxed text-sm space-y-2">
          {isFr ? (
            <>
              <p>
                Le responsable du traitement des données à caractère personnel collectées
                via le site <a href="https://fleuret.ai" className="text-[var(--accent-blue)] hover:underline">https://fleuret.ai</a> est :
              </p>
              <p><strong className="text-white/70">FLEURET AI</strong>, SAS immatriculée au RCS de Paris sous le numéro 999 515 604.</p>
              <p>Siège social : 60 Rue François 1er, 75008 Paris, France</p>
              <p>Email : <a href="mailto:contact@fleuret.ai" className="text-[var(--accent-blue)] hover:underline">contact@fleuret.ai</a></p>
            </>
          ) : (
            <>
              <p>
                The data controller for personal data collected through{" "}
                <a href="https://fleuret.ai" className="text-[var(--accent-blue)] hover:underline">https://fleuret.ai</a> is:
              </p>
              <p><strong className="text-white/70">FLEURET AI</strong>, a French SAS registered with the Paris Trade and Companies Register under number 999 515 604.</p>
              <p>Registered office: 60 Rue François 1er, 75008 Paris, France</p>
              <p>Email: <a href="mailto:contact@fleuret.ai" className="text-[var(--accent-blue)] hover:underline">contact@fleuret.ai</a></p>
            </>
          )}
        </div>

        {/* Section 2 */}
        <h2 className="text-xl font-semibold text-white mb-4 mt-10">
          {isFr ? "2. Données collectées" : "2. Data Collected"}
        </h2>
        <div className="text-white/50 leading-relaxed text-sm space-y-3">
          {isFr ? (
            <>
              <p>Nous collectons les catégories de données suivantes :</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong className="text-white/70">Données d'identification :</strong> adresse email, nom (si fourni), informations de compte.</li>
                <li><strong className="text-white/70">Données d'utilisation :</strong> pages visitées, durée des sessions, actions réalisées sur la plateforme, adresse IP, type de navigateur.</li>
                <li><strong className="text-white/70">Données techniques :</strong> cookies et traceurs (voir section 7).</li>
              </ul>
              <p>
                Nous ne collectons aucune donnée sensible au sens de l'article 9 du Règlement (UE) 2016/679 (RGPD).
              </p>
            </>
          ) : (
            <>
              <p>We collect the following categories of data:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong className="text-white/70">Identification data:</strong> email address, name (if provided), account information.</li>
                <li><strong className="text-white/70">Usage data:</strong> pages visited, session duration, platform actions, IP address, browser type.</li>
                <li><strong className="text-white/70">Technical data:</strong> cookies and trackers (see section 7).</li>
              </ul>
              <p>
                We do not collect any sensitive data within the meaning of Article 9 of Regulation (EU) 2016/679 (GDPR).
              </p>
            </>
          )}
        </div>

        {/* Section 3 */}
        <h2 className="text-xl font-semibold text-white mb-4 mt-10">
          {isFr ? "3. Finalités et bases légales" : "3. Purposes and Legal Bases"}
        </h2>
        <div className="text-white/50 leading-relaxed text-sm space-y-3">
          {isFr ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-2 pr-4 text-white/70 font-medium">Finalité</th>
                  <th className="py-2 text-white/70 font-medium">Base légale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr><td className="py-2 pr-4">Fourniture et gestion du service</td><td className="py-2">Exécution du contrat (art. 6.1.b RGPD)</td></tr>
                <tr><td className="py-2 pr-4">Communication commerciale (newsletter, mises à jour produit)</td><td className="py-2">Consentement (art. 6.1.a RGPD)</td></tr>
                <tr><td className="py-2 pr-4">Amélioration du service et analyse d'utilisation</td><td className="py-2">Intérêt légitime (art. 6.1.f RGPD)</td></tr>
                <tr><td className="py-2 pr-4">Respect des obligations légales et réglementaires</td><td className="py-2">Obligation légale (art. 6.1.c RGPD)</td></tr>
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-2 pr-4 text-white/70 font-medium">Purpose</th>
                  <th className="py-2 text-white/70 font-medium">Legal basis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr><td className="py-2 pr-4">Service delivery and management</td><td className="py-2">Contract performance (Art. 6.1.b GDPR)</td></tr>
                <tr><td className="py-2 pr-4">Commercial communications (newsletter, product updates)</td><td className="py-2">Consent (Art. 6.1.a GDPR)</td></tr>
                <tr><td className="py-2 pr-4">Service improvement and usage analytics</td><td className="py-2">Legitimate interest (Art. 6.1.f GDPR)</td></tr>
                <tr><td className="py-2 pr-4">Compliance with legal and regulatory obligations</td><td className="py-2">Legal obligation (Art. 6.1.c GDPR)</td></tr>
              </tbody>
            </table>
          )}
        </div>

        {/* Section 4 */}
        <h2 className="text-xl font-semibold text-white mb-4 mt-10">
          {isFr ? "4. Destinataires" : "4. Recipients"}
        </h2>
        <div className="text-white/50 leading-relaxed text-sm space-y-3">
          {isFr ? (
            <>
              <p>Vos données peuvent être transmises aux sous-traitants suivants, dans le cadre strict des finalités décrites ci-dessus :</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong className="text-white/70">Supabase Inc.</strong> — Hébergement de la base de données et authentification.</li>
                <li><strong className="text-white/70">Vercel Inc.</strong> — Hébergement du site web et déploiement.</li>
                <li><strong className="text-white/70">Brevo (ex-Sendinblue)</strong> — Envoi d'emails transactionnels et marketing.</li>
              </ul>
              <p>
                Nous ne vendons, ne louons et ne partageons jamais vos données personnelles avec des tiers à des fins publicitaires.
              </p>
            </>
          ) : (
            <>
              <p>Your data may be shared with the following processors, strictly for the purposes described above:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong className="text-white/70">Supabase Inc.</strong> — Database hosting and authentication.</li>
                <li><strong className="text-white/70">Vercel Inc.</strong> — Website hosting and deployment.</li>
                <li><strong className="text-white/70">Brevo (formerly Sendinblue)</strong> — Transactional and marketing email delivery.</li>
              </ul>
              <p>
                We never sell, rent, or share your personal data with third parties for advertising purposes.
              </p>
            </>
          )}
        </div>

        {/* Section 5 */}
        <h2 className="text-xl font-semibold text-white mb-4 mt-10">
          {isFr ? "5. Durée de conservation" : "5. Retention Period"}
        </h2>
        <div className="text-white/50 leading-relaxed text-sm space-y-3">
          {isFr ? (
            <>
              <p>Vos données personnelles sont conservées pour la durée nécessaire à la réalisation des finalités pour lesquelles elles ont été collectées :</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong className="text-white/70">Données de compte :</strong> durée de la relation contractuelle, puis 3 ans après la dernière activité à des fins de prospection commerciale.</li>
                <li><strong className="text-white/70">Données de facturation :</strong> 10 ans conformément aux obligations comptables.</li>
                <li><strong className="text-white/70">Données d'utilisation et logs :</strong> 12 mois maximum.</li>
                <li><strong className="text-white/70">Cookies :</strong> 13 mois maximum conformément aux recommandations de la CNIL.</li>
              </ul>
            </>
          ) : (
            <>
              <p>Your personal data is retained for the time necessary to fulfill the purposes for which it was collected:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong className="text-white/70">Account data:</strong> duration of the contractual relationship, then 3 years after last activity for prospecting purposes.</li>
                <li><strong className="text-white/70">Billing data:</strong> 10 years in accordance with accounting obligations.</li>
                <li><strong className="text-white/70">Usage data and logs:</strong> 12 months maximum.</li>
                <li><strong className="text-white/70">Cookies:</strong> 13 months maximum in accordance with CNIL guidelines.</li>
              </ul>
            </>
          )}
        </div>

        {/* Section 6 */}
        <h2 className="text-xl font-semibold text-white mb-4 mt-10">
          {isFr ? "6. Vos droits" : "6. Your Rights"}
        </h2>
        <div className="text-white/50 leading-relaxed text-sm space-y-3">
          {isFr ? (
            <>
              <p>
                Conformément au RGPD, vous disposez des droits suivants sur vos données personnelles :
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong className="text-white/70">Droit d'accès</strong> (art. 15) : obtenir la confirmation que vos données sont traitées et en recevoir une copie.</li>
                <li><strong className="text-white/70">Droit de rectification</strong> (art. 16) : corriger des données inexactes ou incomplètes.</li>
                <li><strong className="text-white/70">Droit à l'effacement</strong> (art. 17) : demander la suppression de vos données.</li>
                <li><strong className="text-white/70">Droit à la portabilité</strong> (art. 20) : recevoir vos données dans un format structuré et interopérable.</li>
                <li><strong className="text-white/70">Droit d'opposition</strong> (art. 21) : vous opposer au traitement fondé sur l'intérêt légitime.</li>
                <li><strong className="text-white/70">Droit à la limitation</strong> (art. 18) : demander la suspension du traitement.</li>
              </ul>
              <p>
                Pour exercer ces droits, contactez-nous à{" "}
                <a href="mailto:contact@fleuret.ai" className="text-[var(--accent-blue)] hover:underline">contact@fleuret.ai</a>.
                Nous répondrons dans un délai de 30 jours.
              </p>
              <p>
                Vous disposez également du droit d'introduire une réclamation auprès de la Commission Nationale de l'Informatique et des Libertés (CNIL) :{" "}
                <a href="https://www.cnil.fr" className="text-[var(--accent-blue)] hover:underline" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>.
              </p>
            </>
          ) : (
            <>
              <p>
                Under the GDPR, you have the following rights regarding your personal data:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong className="text-white/70">Right of access</strong> (Art. 15): obtain confirmation that your data is being processed and receive a copy.</li>
                <li><strong className="text-white/70">Right to rectification</strong> (Art. 16): correct inaccurate or incomplete data.</li>
                <li><strong className="text-white/70">Right to erasure</strong> (Art. 17): request the deletion of your data.</li>
                <li><strong className="text-white/70">Right to data portability</strong> (Art. 20): receive your data in a structured, interoperable format.</li>
                <li><strong className="text-white/70">Right to object</strong> (Art. 21): object to processing based on legitimate interest.</li>
                <li><strong className="text-white/70">Right to restriction</strong> (Art. 18): request the suspension of processing.</li>
              </ul>
              <p>
                To exercise these rights, contact us at{" "}
                <a href="mailto:contact@fleuret.ai" className="text-[var(--accent-blue)] hover:underline">contact@fleuret.ai</a>.
                We will respond within 30 days.
              </p>
              <p>
                You also have the right to lodge a complaint with the French data protection authority (CNIL):{" "}
                <a href="https://www.cnil.fr" className="text-[var(--accent-blue)] hover:underline" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>.
              </p>
            </>
          )}
        </div>

        {/* Section 7 */}
        <h2 className="text-xl font-semibold text-white mb-4 mt-10">
          {isFr ? "7. Cookies et traceurs" : "7. Cookies and Trackers"}
        </h2>
        <div className="text-white/50 leading-relaxed text-sm space-y-3">
          {isFr ? (
            <>
              <p>
                Le site utilise des cookies strictement nécessaires au fonctionnement du service (préférences de langue, authentification). Ces cookies ne nécessitent pas votre consentement.
              </p>
              <p>
                Si des cookies analytiques ou publicitaires sont mis en place à l'avenir, votre consentement explicite sera recueilli préalablement via un bandeau de consentement conforme aux recommandations de la CNIL.
              </p>
              <p>
                Vous pouvez à tout moment paramétrer votre navigateur pour refuser les cookies. Veuillez noter que cela peut altérer votre expérience de navigation.
              </p>
            </>
          ) : (
            <>
              <p>
                The site uses cookies strictly necessary for the operation of the service (language preferences, authentication). These cookies do not require your consent.
              </p>
              <p>
                If analytics or advertising cookies are implemented in the future, your explicit consent will be collected beforehand via a consent banner compliant with CNIL guidelines.
              </p>
              <p>
                You can configure your browser to refuse cookies at any time. Please note that this may affect your browsing experience.
              </p>
            </>
          )}
        </div>

        {/* Section 8 */}
        <h2 className="text-xl font-semibold text-white mb-4 mt-10">
          {isFr ? "8. Transferts hors UE" : "8. International Transfers"}
        </h2>
        <div className="text-white/50 leading-relaxed text-sm space-y-3">
          {isFr ? (
            <>
              <p>
                Certains de nos sous-traitants (Vercel, Supabase) sont établis aux États-Unis. Ces transferts sont encadrés par :
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Le Data Privacy Framework UE-États-Unis (décision d'adéquation de la Commission européenne du 10 juillet 2023), lorsque le sous-traitant est certifié.</li>
                <li>Des clauses contractuelles types (CCT) adoptées par la Commission européenne, le cas échéant.</li>
              </ul>
              <p>
                Nous veillons à ce que tout transfert de données hors de l'Espace économique européen bénéficie de garanties appropriées conformément au chapitre V du RGPD.
              </p>
            </>
          ) : (
            <>
              <p>
                Some of our processors (Vercel, Supabase) are established in the United States. These transfers are governed by:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>The EU-U.S. Data Privacy Framework (European Commission adequacy decision of July 10, 2023), where the processor is certified.</li>
                <li>Standard Contractual Clauses (SCCs) adopted by the European Commission, where applicable.</li>
              </ul>
              <p>
                We ensure that any transfer of data outside the European Economic Area benefits from appropriate safeguards in accordance with Chapter V of the GDPR.
              </p>
            </>
          )}
        </div>

        {/* Section 9 */}
        <h2 className="text-xl font-semibold text-white mb-4 mt-10">
          {isFr ? "9. Modifications" : "9. Changes"}
        </h2>
        <div className="text-white/50 leading-relaxed text-sm space-y-3">
          {isFr ? (
            <p>
              Nous nous réservons le droit de modifier la présente politique de confidentialité à tout moment. En cas de modification substantielle, nous vous en informerons par email ou via une notification sur le site. La date de dernière mise à jour est indiquée en haut de cette page.
            </p>
          ) : (
            <p>
              We reserve the right to modify this privacy policy at any time. In the event of a material change, we will notify you by email or via a notice on the site. The last update date is indicated at the top of this page.
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
              <p>
                Pour toute question relative à la protection de vos données personnelles, vous pouvez nous contacter :
              </p>
              <p>
                Délégué à la protection des données (DPO) :{" "}
                <a href="mailto:contact@fleuret.ai" className="text-[var(--accent-blue)] hover:underline">contact@fleuret.ai</a>
              </p>
              <p>
                Autorité de contrôle : CNIL —{" "}
                <a href="https://www.cnil.fr" className="text-[var(--accent-blue)] hover:underline" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>
              </p>
            </>
          ) : (
            <>
              <p>
                For any questions regarding the protection of your personal data, you can contact us:
              </p>
              <p>
                Data Protection Officer (DPO):{" "}
                <a href="mailto:contact@fleuret.ai" className="text-[var(--accent-blue)] hover:underline">contact@fleuret.ai</a>
              </p>
              <p>
                Supervisory authority: CNIL —{" "}
                <a href="https://www.cnil.fr" className="text-[var(--accent-blue)] hover:underline" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
