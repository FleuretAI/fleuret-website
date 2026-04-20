import React, { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { buildLocalePath, detectLocaleFromPath, swapLocalePath } from '@/seo/routes';

type Language = 'fr' | 'en';

const LANG_STORAGE_KEY = 'fleuret_lang';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  localize: (basePath: string) => string;
}

const translations = {
  fr: {
    // Navbar
    'nav.home': 'Accueil',
    'nav.problem': 'Le problème',
    'nav.platform': 'Plateforme',
    'nav.pricing': 'Tarifs',
    'nav.resources': 'Ressources',
    'nav.blog': 'Blog',
    'nav.company': 'Entreprise',
    'nav.about': 'À propos',
    'nav.aboutUs': 'À propos',
    'nav.careers': 'Carrières',
    'nav.cta': 'Réserver une démo',

    // Common
    'common.back': '← Retour',

    // Footer (additional)
    'footer.designPartners': 'Design Partners',
    'footer.legal': 'Légal',
    'footer.legal.terms': "Conditions d'utilisation",
    'footer.legal.privacy': 'Politique de confidentialité',
    'footer.legal.security': 'Politique de sécurité',
    'footer.legal.mentions': 'Mentions légales',
    'footer.about': 'À propos',
    'footer.careers': 'Carrières',
    'footer.askAi': "Demander à l'IA un résumé de Fleuret",
    'footer.openIn': 'Ouvrir dans',

    // Cookie banner
    'cookie.region': 'Paramètres de confidentialité',
    'cookie.close': 'Fermer',
    'cookie.title': 'Paramètres de confidentialité',
    'cookie.body': "Ce site utilise des technologies tierces de suivi pour fournir et améliorer nos services en continu, et afficher des informations selon les centres d'intérêt des utilisateurs. J'accepte et peux révoquer ou modifier mon consentement à tout moment avec effet pour l'avenir.",
    'cookie.privacy': 'Politique de confidentialité',
    'cookie.legalNotice': 'Mentions légales',
    'cookie.moreInfo': "Plus d'informations",
    'cookie.deny': 'Refuser',
    'cookie.accept': 'Tout accepter',

    // Announcement banner (top of site)
    'announce.label': 'Annonce',
    'announce.text': 'Fleuret lève 4M€ en pre-seed',
    'announce.cta': 'Lire l’annonce',
    'announce.dismiss': 'Fermer l’annonce',

    // Hero
    'hero.badge': 'Fleuret lève 4M€ pre-seed pour construire le futur de la sécurité IA',
    'hero.badge.label': 'Actualité',
    'hero.badge.text': 'Fleuret lève 4M€ pre-seed pour construire le futur de la sécurité IA',
    'hero.badge.text.short': 'Fleuret lève 4M€ pre-seed',
    'hero.title.line1': 'Sécurité offensive incisive.',
    'hero.title.line2': 'Scalabilité infinie.',
    'hero.subtitle': 'Fleuret combine IA agentique et expertise offensive pour délivrer des pentests de niveau humain en heures, pas en semaines.',
    'hero.cta': 'Réserver une démo',
    'hero.cta.secondary': 'Voir la plateforme',

    // Partners (social proof)
    'partners.title': 'Issus de',

    // Problem section (WhySection)
    'problem.main.title': 'Vous déployez tous les jours.',
    'problem.main.broken': 'Votre pentest, une fois par an.',
    'problem.main.subtitle': 'Ce calcul ne tient plus. Vos déploiements dépassent vos audits. Entre chaque rapport de niveau cabinet, 3 à 12 mois d\'exposition aveugle.',
    'problem.delay.title': 'Lent',
    'problem.delay.desc': '2 à 4 semaines pour un rapport. Entre les pentests, 3 à 12 mois d\'angles morts.',
    'problem.friction.title': 'Enfermé chez un cabinet',
    'problem.friction.desc': 'Trouver un cabinet, négocier le scope, attendre un créneau. Chaque pentest devient un projet achat.',
    'problem.cost.title': 'Coûteux',
    'problem.cost.desc': '25 000€+ pour un audit complet. Un budget qui vous limite à une fois par an, peu importe votre vitesse de déploiement.',
    'problem.exposure': 'Pendant ce temps, votre surface d\'attaque change à chaque déploiement.',

    // Platform section (replaces Benchmark)
    'platform.main.title': 'Pas un cabinet.',
    'platform.main.highlight': 'Pas un scanner. Une plateforme.',
    'platform.main.subtitle': 'Fleuret fonctionne comme votre infra. À la demande, répétable, API-first. Profondeur humaine. Vitesse machine.',
    'platform.asm.title': 'Cartographie de surface',
    'platform.asm.desc': 'Donnez-nous un domaine. Fleuret trouve chaque asset exposé que vous aviez oublié. Automatiquement.',
    'platform.pentest.title': 'Pentest à la demande',
    'platform.pentest.desc': 'Applications web, APIs REST et GraphQL. Pentest complet avec chaînes d\'exploitation sur n\'importe quel asset, en un clic. Résultats en heures.',
    'platform.scanners.title': 'Scanners connectés',
    'platform.scanners.desc': 'Cloud, Active Directory, réseau, mobile, repos Git. Reliés à votre ASM, lancés en un clic.',
    'platform.reports.title': 'Rapports audit-ready',
    'platform.reports.desc': 'PDF accepté par vos auditeurs (ISO 27001, SOC 2, NIS2, DORA). Dashboard temps réel. PoC pour chaque finding. Remédiation priorisée.',

    // How it Works
    'process.main.title': 'Comment ça',
    'process.main.works': 'fonctionne',
    'process.main.subtitle': 'De votre périmètre au rapport signé. Pas de cabinet. Pas d\'appel d\'offres.',
    'process.deploy.title': 'Connectez votre périmètre',
    'process.deploy.desc': 'Entrez vos domaines, IPs, URLs. Notre ASM cartographie votre surface externe en minutes.',
    'process.attack.title': 'Lancez un pentest',
    'process.attack.desc': 'Choisissez un asset. Nos agents IA l\'attaquent comme le ferait un pentester humain. Recon, chaînes d\'exploits, escalade, pivot.',
    'process.exploits.title': 'Recevez votre rapport audit-ready',
    'process.exploits.desc': 'Chaque finding validé par proof-of-concept. Zéro faux positif. Impact métier, remédiation priorisée, PDF audit-ready. Livré en heures.',

    // Comparison Table
    'comparison.title': 'Pourquoi Fleuret',
    'comparison.header.capability': 'Critère',
    'comparison.header.traditional': 'Cabinet de conseil',
    'comparison.header.fleuret': 'Fleuret',
    'comparison.header.automated': 'Scanner classique',
    'comparison.depth': 'Profondeur',
    'comparison.depth.traditional': 'Approfondie',
    'comparison.depth.fleuret': 'Approfondie',
    'comparison.depth.automated': 'Superficielle',
    'comparison.speed': 'Rapidité',
    'comparison.speed.traditional': '2-4 semaines',
    'comparison.speed.fleuret': 'Quelques heures',
    'comparison.speed.automated': 'Minutes',
    'comparison.cost': 'Coût',
    'comparison.cost.traditional': '25 000€+',
    'comparison.cost.fleuret': '2 500€ forfait',
    'comparison.cost.automated': 'Peu cher, mais bruyant',
    'comparison.falsePositives': 'Faux positifs',
    'comparison.falsePositives.traditional': 'Rares',
    'comparison.falsePositives.fleuret': 'Zéro. Chaque finding a un PoC.',
    'comparison.falsePositives.automated': 'Nombreux',
    'comparison.frequency': 'Fréquence',
    'comparison.frequency.traditional': 'Trimestrielle-Annuelle',
    'comparison.frequency.fleuret': 'À la demande. À chaque release.',
    'comparison.frequency.automated': 'Continue',
    'comparison.compliance': 'Rapport audit-ready',
    'comparison.adaptability': 'Adaptabilité',

    // Problem legend
    'problem.legend.pentest': 'Pentest',
    'problem.legend.audited': 'Déploiement (audité)',
    'problem.legend.unaudited': 'Déploiement (non audité)',
    'problem.legend.stat': 'déploiements partent sans audit',

    // Pricing
    'pricing.title': 'Pricing',
    'pricing.subtitle': 'transparent',
    'pricing.title.main': 'Tarification',
    'pricing.title.accent': 'transparente',
    'pricing.description': 'Des résultats de niveau pentest, sans la facture de cabinet.',
    'pricing.standard.name': 'Standard',
    'pricing.startingAt': 'À partir de',
    'pricing.standard.price': '2 500€',
    'pricing.standard.unit': '/ pentest / an',
    'pricing.standard.desc': 'Pentest complet. Sans engagement. Résultats en heures.',
    'pricing.standard.feature1': 'Pentest WebApp ou API',
    'pricing.standard.feature2': 'Rapport PDF audit-ready',
    'pricing.standard.feature3': 'Accès plateforme & dashboard',
    'pricing.standard.feature4': 'Re-test inclus',
    'pricing.standard.f1': 'Pentest WebApp ou API',
    'pricing.standard.f2': 'Rapport PDF audit-ready',
    'pricing.standard.f3': 'Accès plateforme & dashboard',
    'pricing.standard.f4': 'Re-test inclus',
    'pricing.standard.cta': 'Réserver une démo',
    'pricing.enterprise.name': 'Entreprise',
    'pricing.enterprise.price': 'Sur mesure',
    'pricing.enterprise.desc': 'Volume, engagement long terme, tarifs dégressifs.',
    'pricing.enterprise.feature1': 'Tout Standard +',
    'pricing.enterprise.feature2': 'Tarifs dégressifs sur volume',
    'pricing.enterprise.feature3': 'Scanners intégrés (infra, cloud, AD)',
    'pricing.enterprise.feature4': 'Support dédié & intégrations',
    'pricing.enterprise.f1': 'Tout Standard +',
    'pricing.enterprise.f2': 'Tarifs dégressifs sur volume',
    'pricing.enterprise.f3': 'Scanners intégrés (infra, cloud, AD)',
    'pricing.enterprise.f4': 'Support dédié & intégrations',
    'pricing.enterprise.cta': 'Nous contacter',
    'pricing.cta': 'Réserver une démo',
    'pricing.guarantee': '0 finding, 0 facture.',
    'pricing.guarantee.title': '0 finding, 0 facture.',
    'pricing.guarantee.subtitle': 'Si Fleuret ne trouve rien d\'exploitable, vous ne payez rien.',
    'pricing.guarantee.desc': 'Si Fleuret ne trouve rien d\'exploitable, vous ne payez rien.',
    'pricing.anchor': 'vs 25 000€+ pour un pentest de cabinet',

    // Compliance
    'compliance.title': 'Conçu pour la',
    'compliance.highlight': 'conformité européenne.',
    'compliance.subtitle': 'Hébergé en Europe, données souveraines. Fleuret vous aide à cocher les cases réglementaires.',
    'compliance.nis2.title': 'NIS2',
    'compliance.nis2.desc': 'Tests de pénétration réguliers exigés pour les entités essentielles et importantes.',
    'compliance.iso.title': 'ISO 27001',
    'compliance.iso.desc': 'Pentests requis dans le cadre de l\'annexe A : contrôle de la gestion des vulnérabilités.',
    'compliance.soc2.title': 'SOC 2',
    'compliance.soc2.desc': 'Tests d\'intrusion attendus pour valider les contrôles de sécurité du Trust Service Criteria.',
    'compliance.dora.title': 'DORA',
    'compliance.dora.desc': 'Tests de résilience opérationnelle numérique obligatoires pour le secteur financier européen.',
    'compliance.sovereignty': 'Données hébergées en Europe. Conformité RGPD garantie.',

    // CTA
    'cta.title': 'Lancez votre premier pentest cette semaine.',
    'cta.subtitle': '15 minutes avec l\'équipe. On scope sur votre vrai périmètre.',
    'cta.button': 'Réserver une démo',

    // Footer
    'footer.tagline': 'Pentest IA européen. Construit en France. Souverain par design.',
    'footer.contact': 'Contact',
    'footer.rights': '© 2026 fleuret.ai. Tous droits réservés.',

    // Careers
    'careers.hero.title': 'Faites le meilleur',
    'careers.hero.highlight': 'travail de votre vie.',
    'careers.hero.subtitle': 'On construit le futur du pentest. Rejoignez une équipe d\'ingénieurs et de chercheurs passionnés par l\'IA et la cybersécurité.',
    'careers.hero.cta': 'Candidature spontanée',
    'careers.perks.title': 'Pourquoi nous rejoindre',
    'careers.perks.equity': 'BSPCE early-stage',
    'careers.perks.equipment': 'Setup top niveau',
    'careers.perks.hybrid': 'Travail hybride',
    'careers.perks.salary': 'Salaire compétitif',
    'careers.perks.holidays': '30+ jours de congés',
    'careers.perks.healthcare': 'Mutuelle premium',
    'careers.values.title': 'Nos valeurs',
    'careers.values.newIdeas.title': 'On accueille les idées nouvelles',
    'careers.values.newIdeas.desc': 'Chaque voix compte. On crée un espace sûr pour proposer, expérimenter, et itérer.',
    'careers.values.outcomeFocused.title': 'On vise le résultat',
    'careers.values.outcomeFocused.desc': 'Ce qui compte, c\'est l\'impact. Pas la méthode, pas les heures. Le résultat.',
    'careers.values.integrity.title': 'On agit avec intégrité',
    'careers.values.integrity.desc': 'Transparence, honnêteté, responsabilité. On fait ce qu\'on dit.',
    'careers.values.gsd.title': 'On livre.',
    'careers.values.gsd.desc': 'On aime les défis. On exécute vite, on apprend vite, on avance.',
    'careers.positions.title': 'Postes ouverts',
    'careers.positions.subtitle': 'On recrute les meilleurs talents en IA et cybersécurité.',
    'careers.positions.empty': 'Aucun poste ouvert pour le moment, mais on cherche toujours des profils exceptionnels.',
    'careers.positions.spontaneous': 'Envoyer une candidature spontanée →',
    'careers.back': 'Retour à l\'accueil',

    // About
    'about.hero.title': 'On construit le futur',
    'about.hero.highlight': 'du pentest.',
    'about.hero.subtitle': 'Fleuret AI combine intelligence artificielle et expertise offensive pour rendre le pentest accessible, continu et souverain.',
    'about.mission.title': 'Notre mission',
    'about.mission.desc': 'Le pentest traditionnel est lent, cher et ponctuel. On croit qu\'il devrait être rapide, abordable et continu. Fleuret utilise l\'IA agentique pour simuler de vraies attaques sur vos systèmes, avec la même rigueur qu\'un pentester humain, mais en heures, pas en semaines.',
    'about.team.title': 'L\'équipe fondatrice',
    'about.investors.title': 'Business Angels',
    'about.investors.subtitle': 'Opérateurs cyber et SaaS qui soutiennent Fleuret.',
    'about.vcs.title': 'Fonds',
    'about.vcs.subtitle': 'Investisseurs institutionnels.',
    'about.cta.title': 'Prêt à travailler avec nous ?',
    'about.cta.demo': 'Réserver une démo',
    'about.cta.careers': 'Voir les postes',
    'about.back': 'Retour à l\'accueil',

    // Design Partners
    'designPartners.meta.title': 'Programme Design Partner',
    'designPartners.hero.badge.label': 'Design Partner',
    'designPartners.hero.remaining': '{remaining} sur {total} places ouvertes',
    'designPartners.hero.full': 'Cohorte complète, liste d\'attente ouverte',
    'designPartners.hero.title': 'Construisez le futur du pentest',
    'designPartners.hero.highlight': 'avec nous.',
    'designPartners.hero.offer': '{price} forfait · {pentests} pentests IA · {weeks} semaines · rapport NIS2 / DORA ready',
    'designPartners.hero.subtitle': '5 équipes sécurité européennes lancent une cohorte pilote au 1er juin 2026. Prix fixe, scope fixe, livrable audit-ready.',
    'designPartners.hero.cta': 'Candidater maintenant',
    'designPartners.hero.ctaWaitlist': 'Rejoindre la liste d\'attente',
    'designPartners.hero.cta.secondary': 'Voir le déroulé',

    'designPartners.countdown.prefix': 'Cohorte démarre le {date}',
    'designPartners.countdown.started': 'Cohorte démarrée, candidatures à la liste d\'attente',
    'designPartners.countdown.d': 'j',
    'designPartners.countdown.h': 'h',
    'designPartners.countdown.m': 'min',
    'designPartners.countdown.aria': 'Reste {days} jours, {hours} heures, {minutes} minutes avant le démarrage de la cohorte',

    'designPartners.timeline.title': 'Le déroulé, semaine par semaine',
    'designPartners.timeline.subtitle': 'Pas de mystère. Scope signé semaine 1, rapport livré semaine 6.',
    'designPartners.timeline.week': 'Semaine {n}',
    'designPartners.timeline.w1.title': 'Scope & kickoff',
    'designPartners.timeline.w1.desc': 'Atelier 90 min. Vous nommez un propriétaire scope, on signe le SOW, on aligne sur les 3 périmètres (webapp, API, infra externe).',
    'designPartners.timeline.w2.title': 'Reconnaissance',
    'designPartners.timeline.w2.desc': 'Nos agents IA cartographient l\'exposition. Vous recevez une première ASM filtrée et priorisée.',
    'designPartners.timeline.w3.title': 'Pentest WebApp + API',
    'designPartners.timeline.w3.desc': 'Attaques authentifiées et non authentifiées. Chaque finding validé par un PoC reproductible.',
    'designPartners.timeline.w4.title': 'Pentest Infra externe',
    'designPartners.timeline.w4.desc': 'Surface externe, sous-domaines, endpoints exposés. Corrélation avec les deux périmètres précédents.',
    'designPartners.timeline.w5.title': 'Rapport audit-ready',
    'designPartners.timeline.w5.desc': 'Rapport PDF avec mapping NIS2 / DORA, plan de remédiation priorisé, slides executive pour votre COMEX.',
    'designPartners.timeline.w6.title': 'Revue & roadmap',
    'designPartners.timeline.w6.desc': 'Retex 60 min avec les fondateurs. Vos retours entrent dans la roadmap Q3. Case study co-signée si l\'engagement est probant.',

    'designPartners.proof.title': 'Pourquoi nous faire confiance sur le premier pilote',
    'designPartners.proof.founder': 'Yanis a construit et défendu des systèmes chez ses précédents employeurs avant de fonder Fleuret. L\'équipe combine offensive humaine et IA agentique, pas du scanning repackagé.',
    'designPartners.proof.methodology': 'Chaque finding est accompagné d\'un PoC reproductible, d\'un impact métier clair et d\'une remédiation priorisée. Zéro faux positif toléré, parce que votre RSSI n\'a pas de temps à perdre.',
    'designPartners.proof.pipelineLabel': 'Chaîne de validation',
    'designPartners.proof.step1': 'Input : scope signé, credentials isolés dans un vault éphémère.',
    'designPartners.proof.step2': 'Exécution : agents IA, chaque action journalisée (qui, quoi, quand, depuis où).',
    'designPartners.proof.step3': 'Validation : PoC reproductible exigé avant qu\'un finding apparaisse dans le rapport.',
    'designPartners.proof.step4': 'Export : rapport PDF horodaté + journal signé, prêt pour votre auditeur.',

    'designPartners.qualify.title': 'Profil recherché',
    'designPartners.qualify.qualifyGeo': 'Entreprise basée en Europe (UE, UK, Suisse).',
    'designPartners.qualify.qualifyIndustry': 'SaaS, fintech, healthtech, ou toute activité avec une surface web/API significative.',
    'designPartners.qualify.qualifySize': '50 à 1 000 salariés : assez mature pour avoir un budget sécurité, assez agile pour itérer avec nous.',
    'designPartners.qualify.qualifyCompliance': 'Conformité NIS2 ou DORA en cours, ou obligation imminente.',
    'designPartners.qualify.qualifyTeam': 'Au moins un responsable sécurité (RSSI) ou conformité (DPO) actif.',

    'designPartners.apply.title': 'Candidater au pilote',
    'designPartners.apply.subtitle': '3 min, 5 champs. Si votre profil match, on vous envoie le lien de calendrier immédiatement.',
    'designPartners.apply.waitlistTitle': 'Rejoindre la liste d\'attente',
    'designPartners.apply.waitlistSubtitle': 'Les 5 places sont prises. Laissez vos coordonnées, on vous prévient en premier pour la prochaine cohorte.',
    'designPartners.apply.emailLabel': 'Email professionnel',
    'designPartners.apply.emailPlaceholder': 'prenom.nom@entreprise.fr',
    'designPartners.apply.emailError': 'Email invalide.',
    'designPartners.apply.roleLabel': 'Votre rôle',
    'designPartners.apply.role.ciso': 'RSSI / CISO',
    'designPartners.apply.role.security_lead': 'Responsable sécurité',
    'designPartners.apply.role.devops_lead': 'Lead DevOps / SRE',
    'designPartners.apply.role.cto': 'CTO',
    'designPartners.apply.role.ceo': 'CEO',
    'designPartners.apply.role.dpo': 'DPO',
    'designPartners.apply.role.other': 'Autre',
    'designPartners.apply.sizeLabel': 'Taille entreprise',
    'designPartners.apply.size.lt50': 'Moins de 50',
    'designPartners.apply.size.gt1000': '1 000 et plus',
    'designPartners.apply.companyLabel': 'Entreprise (optionnel)',
    'designPartners.apply.companyPlaceholder': 'Nom de l\'entreprise',
    'designPartners.apply.assetLabel': 'Périmètre principal à tester',
    'designPartners.apply.assetPlaceholder': 'Ex. plateforme SaaS B2B + API partenaires + portail client',
    'designPartners.apply.assetError': 'Merci de préciser au moins 3 caractères.',
    'designPartners.apply.consent': 'J\'accepte que Fleuret me contacte au sujet du programme Design Partner et conserve ces informations selon sa politique de confidentialité (base légale : consentement, durée 12 mois).',
    'designPartners.apply.consentError': 'Consentement requis pour traiter votre candidature.',
    'designPartners.apply.submit': 'Envoyer ma candidature',
    'designPartners.apply.submitting': 'Envoi en cours…',
    'designPartners.apply.error.validation': 'Vérifiez les champs et réessayez.',
    'designPartners.apply.error.server': 'Erreur serveur. Écrivez-nous à yanis@fleuret.ai.',
    'designPartners.apply.error.network': 'Connexion échouée. Réessayez ou écrivez à yanis@fleuret.ai.',
    'designPartners.apply.qualifiedTitle': 'Votre profil match. Réservez 30 min.',
    'designPartners.apply.qualifiedBody': 'On revient vers vous sous 24 h avec un créneau confirmé et un bref questionnaire de scope à pré-remplir.',
    'designPartners.apply.qualifiedCta': 'Bloquer un créneau maintenant',
    'designPartners.apply.unqualifiedTitle': 'Merci, candidature enregistrée',
    'designPartners.apply.unqualifiedBody': 'Votre profil est en dehors du scope cohorte actuelle (50-1 000 salariés, RSSI / CTO / DPO). On garde vos coordonnées et on revient si une cohorte adaptée s\'ouvre.',

    'designPartners.faq.title': 'Questions fréquentes',
    'designPartners.faq.q1.question': 'Combien coûte le pilote ?',
    'designPartners.faq.q1.answer': '4 900 € HT forfait, sans frais cachés. Inclus : 3 pentests IA (webapp + API + infra externe), rapport PDF audit-ready, mapping NIS2 / DORA, 2 sessions avec les fondateurs.',
    'designPartners.faq.q2.question': 'Que se passe-t-il après les 6 semaines ?',
    'designPartners.faq.q2.answer': 'Tarif préférentiel design partner à -30 % sur les pentests suivants pendant 12 mois. Sinon, aucun engagement de reconduction.',
    'designPartners.faq.q3.question': 'Quels périmètres sont couverts ?',
    'designPartners.faq.q3.answer': 'Une application web, une API REST ou GraphQL, et une surface infra externe. Les scanners cloud et AD arrivent plus tard dans la roadmap et seront accessibles en alpha aux design partners.',
    'designPartners.faq.q4.question': 'Qu\'attendez-vous de nous ?',
    'designPartners.faq.q4.answer': 'Un propriétaire scope nommé, un contact IT pour les credentials, et 3 créneaux de 30 min répartis sur les 6 semaines. Case study publiée seulement après livraison réussie, anonymisable.',

    'designPartners.back': 'Retour à l\'accueil',

    // Demo page
    'demo.pageTitle': 'Réserver une démo, Fleuret',
    'demo.pageDescription': 'Voyez Fleuret en action. Réservez un appel de 30 minutes avec notre équipe.',
    'demo.title': 'Voyez Fleuret en action.',
    'demo.subtitle': 'Réservez un appel de 30 minutes. On vous montre la plateforme sur votre périmètre.',
    'demo.pullquote': 'Pentest niveau humain en heures, pas en semaines.',
    'demo.stat1.value': '100%',
    'demo.stat1.label': 'Niveau humain',
    'demo.stat2.value': '100x',
    'demo.stat2.label': 'Scalabilité',
    'demo.stat3.value': '3x',
    'demo.stat3.label': 'Moins cher',
    'demo.iframe.title': 'Planificateur de démo Fleuret',
    'demo.fallback.prefix': 'Le planificateur ne charge pas ?',
    'demo.fallback.link': 'Réserver directement',

    // Resources hub
    'resources.hero.title': 'Ressources',
    'resources.hero.subtitle': 'Analyses et retours d\'expérience sur le pentest continu par IA agentique, la conformité européenne et la sécurité offensive.',
    'resources.blog.label': 'Blog',
    'resources.blog.title': 'Dernières analyses',
    'resources.blog.description': 'Nos équipes partagent leur travail sur le pentest automatisé, NIS2, DORA, et l\'IA agentique appliquée à la sécurité offensive.',
    'resources.blog.cta': 'Voir tous les articles',

    // Blog
    'blog.hero.title': 'Blog',
    'blog.hero.subtitle': 'Analyses et retours d\'expérience sur le pentest continu par IA agentique et la conformité européenne.',
    'blog.empty': 'Pas encore d\'articles. Repassez bientôt.',
    'blog.readingTime': 'min de lecture',
    'blog.share.prompt': 'Partager cet article',
    'blog.share.label': 'Partager',
    'blog.share.linkedIn': 'Partager sur LinkedIn',
    'blog.share.copyLink': 'Copier le lien',

    // 404
    'notfound.title': '404',
    'notfound.subtitle': 'Page introuvable',
    'notfound.home': 'Retour à l\'accueil',
  },
  en: {
    // Navbar
    'nav.home': 'Home',
    'nav.problem': 'The problem',
    'nav.platform': 'Platform',
    'nav.pricing': 'Pricing',
    'nav.resources': 'Resources',
    'nav.blog': 'Blog',
    'nav.company': 'Company',
    'nav.about': 'About',
    'nav.aboutUs': 'About us',
    'nav.careers': 'Careers',
    'nav.cta': 'Book a demo',

    // Common
    'common.back': '← Back',

    // Footer (additional)
    'footer.designPartners': 'Design Partners',
    'footer.legal': 'Legal',
    'footer.legal.terms': 'Terms of Use',
    'footer.legal.privacy': 'Privacy Policy',
    'footer.legal.security': 'Security Policy',
    'footer.legal.mentions': 'Mentions légales',
    'footer.about': 'About',
    'footer.careers': 'Careers',
    'footer.askAi': 'Ask AI for summary of Fleuret',
    'footer.openIn': 'Open in',

    // Cookie banner
    'cookie.region': 'Privacy settings',
    'cookie.close': 'Close',
    'cookie.title': 'Privacy Settings',
    'cookie.body': "This site uses third-party website tracking technologies to provide and continually improve our services, and to display information according to users' interests. I agree and may revoke or change my consent at any time with effect for the future.",
    'cookie.privacy': 'Privacy Policy',
    'cookie.legalNotice': 'Legal Notice',
    'cookie.moreInfo': 'More Information',
    'cookie.deny': 'Deny',
    'cookie.accept': 'Accept All',

    // Announcement banner (top of site)
    'announce.label': 'Announcement',
    'announce.text': 'Fleuret raises 4M€ pre-seed',
    'announce.cta': 'Read the announcement',
    'announce.dismiss': 'Dismiss announcement',

    // Hero
    'hero.badge': 'Fleuret raised 4M€ pre-seed to build the future of AI security',
    'hero.badge.label': 'News',
    'hero.badge.text': 'Fleuret raised 4M€ pre-seed to build the future of AI security',
    'hero.badge.text.short': 'Fleuret raised 4M€ pre-seed',
    'hero.title.line1': 'Incisive offensive security.',
    'hero.title.line2': 'Infinite scalability.',
    'hero.subtitle': 'Fleuret combines agentic AI and offensive expertise to deliver human-level pentests in hours, not weeks.',
    'hero.cta': 'Book a demo',
    'hero.cta.secondary': 'See the platform',

    // Partners
    'partners.title': 'Alumni of',

    // Problem
    'problem.main.title': 'You ship every day.',
    'problem.main.broken': 'Your pentest ships once a year.',
    'problem.main.subtitle': 'That math stopped working. Deployments outrun audits. Between each cabinet-grade report, 3 to 12 months of blind exposure.',
    'problem.delay.title': 'Slow',
    'problem.delay.desc': '2 to 4 weeks per report. Between pentests, 3 to 12 months of blind spots.',
    'problem.friction.title': 'Locked behind a firm',
    'problem.friction.desc': 'Find a consultancy, negotiate scope, wait for a slot. Every pentest becomes a procurement project.',
    'problem.cost.title': 'Expensive',
    'problem.cost.desc': '€25,000+ for a full audit. A budget that caps you at once a year, no matter how fast you ship.',
    'problem.exposure': 'Meanwhile, your attack surface changes with every deploy.',

    // Platform
    'platform.main.title': 'Not a firm.',
    'platform.main.highlight': 'Not a scanner. A platform.',
    'platform.main.subtitle': 'Fleuret runs the way your infra runs. On-demand, repeatable, API-first. Human-grade depth. Machine-grade speed.',
    'platform.asm.title': 'Attack-surface mapping',
    'platform.asm.desc': 'Point us at your domain. Fleuret finds every exposed asset you forgot you had. Automatically.',
    'platform.pentest.title': 'On-demand pentest',
    'platform.pentest.desc': 'Web apps, REST and GraphQL APIs. Full exploit-chain pentest on any asset, in a click. Results in hours.',
    'platform.scanners.title': 'Connected scanners',
    'platform.scanners.desc': 'Cloud, Active Directory, network, mobile, Git repos. Tied to your ASM, one click away.',
    'platform.reports.title': 'Audit-grade reports',
    'platform.reports.desc': 'PDF your auditor accepts (ISO 27001, SOC 2, NIS2, DORA). Real-time dashboard. PoC for every finding. Prioritized remediation.',

    // How it Works
    'process.main.title': 'How it',
    'process.main.works': 'works',
    'process.main.subtitle': 'From your perimeter to a signed report. No firm. No procurement call.',
    'process.deploy.title': 'Connect your perimeter',
    'process.deploy.desc': 'Drop in your domains, IPs, URLs. Our ASM maps your external surface in minutes.',
    'process.attack.title': 'Launch a pentest',
    'process.attack.desc': 'Pick an asset. Our AI agents attack it the way a human pentester would. Recon, exploit chains, escalation, pivot.',
    'process.exploits.title': 'Get an audit-grade report',
    'process.exploits.desc': 'Every finding validated by proof-of-concept. Zero false positives. Business impact, prioritized remediation, audit-grade PDF. Delivered in hours.',

    // Comparison
    'comparison.title': 'Why Fleuret',
    'comparison.header.capability': 'Criteria',
    'comparison.header.traditional': 'Consulting firm',
    'comparison.header.fleuret': 'Fleuret',
    'comparison.header.automated': 'Legacy scanner',
    'comparison.depth': 'Depth',
    'comparison.depth.traditional': 'Deep',
    'comparison.depth.fleuret': 'Deep',
    'comparison.depth.automated': 'Shallow',
    'comparison.speed': 'Speed',
    'comparison.speed.traditional': '2-4 weeks',
    'comparison.speed.fleuret': 'Hours',
    'comparison.speed.automated': 'Minutes',
    'comparison.cost': 'Cost',
    'comparison.cost.traditional': '€25,000+',
    'comparison.cost.fleuret': '€2,500 flat',
    'comparison.cost.automated': 'Cheap, but noisy',
    'comparison.falsePositives': 'False positives',
    'comparison.falsePositives.traditional': 'Rare',
    'comparison.falsePositives.fleuret': 'Zero. Every finding has a PoC.',
    'comparison.falsePositives.automated': 'Many',
    'comparison.frequency': 'Frequency',
    'comparison.frequency.traditional': 'Quarterly-Annual',
    'comparison.frequency.fleuret': 'On-demand. Every release.',
    'comparison.frequency.automated': 'Continuous',
    'comparison.compliance': 'Audit-grade report',
    'comparison.adaptability': 'Adaptability',

    // Problem legend
    'problem.legend.pentest': 'Pentest',
    'problem.legend.audited': 'Deploy (audited)',
    'problem.legend.unaudited': 'Deploy (unaudited)',
    'problem.legend.stat': 'deploys ship unaudited',

    // Pricing
    'pricing.title': 'Transparent',
    'pricing.subtitle': 'pricing',
    'pricing.title.main': 'Transparent',
    'pricing.title.accent': 'pricing',
    'pricing.description': 'Pentest-grade results without a firm-grade invoice.',
    'pricing.standard.name': 'Standard',
    'pricing.startingAt': 'Starting at',
    'pricing.standard.price': '2,500€',
    'pricing.standard.unit': '/ pentest / year',
    'pricing.standard.desc': 'Full pentest. No commitment. Results in hours.',
    'pricing.standard.feature1': 'WebApp or API pentest',
    'pricing.standard.feature2': 'Audit-grade PDF report',
    'pricing.standard.feature3': 'Platform & dashboard access',
    'pricing.standard.feature4': 'Re-test included',
    'pricing.standard.f1': 'WebApp or API pentest',
    'pricing.standard.f2': 'Audit-grade PDF report',
    'pricing.standard.f3': 'Platform & dashboard access',
    'pricing.standard.f4': 'Re-test included',
    'pricing.standard.cta': 'Book a demo',
    'pricing.enterprise.name': 'Enterprise',
    'pricing.enterprise.price': 'Custom',
    'pricing.enterprise.desc': 'Volume, long-term commitment, volume discounts.',
    'pricing.enterprise.feature1': 'Everything in Standard +',
    'pricing.enterprise.feature2': 'Volume discounts',
    'pricing.enterprise.feature3': 'Integrated scanners (infra, cloud, AD)',
    'pricing.enterprise.feature4': 'Dedicated support & integrations',
    'pricing.enterprise.f1': 'Everything in Standard +',
    'pricing.enterprise.f2': 'Volume discounts',
    'pricing.enterprise.f3': 'Integrated scanners (infra, cloud, AD)',
    'pricing.enterprise.f4': 'Dedicated support & integrations',
    'pricing.enterprise.cta': 'Contact us',
    'pricing.cta': 'Book a demo',
    'pricing.guarantee': '0 findings, 0 invoice.',
    'pricing.guarantee.title': '0 findings, 0 invoice.',
    'pricing.guarantee.subtitle': 'If Fleuret finds nothing exploitable, you pay nothing.',
    'pricing.guarantee.desc': 'If Fleuret finds nothing exploitable, you pay nothing.',
    'pricing.anchor': 'vs €25,000+ for a consulting-firm pentest',

    // Compliance
    'compliance.title': 'Built for',
    'compliance.highlight': 'European compliance.',
    'compliance.subtitle': 'Hosted in Europe, sovereign data. Fleuret helps you check the regulatory boxes.',
    'compliance.nis2.title': 'NIS2',
    'compliance.nis2.desc': 'Regular penetration testing required for essential and important entities.',
    'compliance.iso.title': 'ISO 27001',
    'compliance.iso.desc': 'Pentests required under Annex A: vulnerability management controls.',
    'compliance.soc2.title': 'SOC 2',
    'compliance.soc2.desc': 'Penetration testing expected to validate Trust Service Criteria security controls.',
    'compliance.dora.title': 'DORA',
    'compliance.dora.desc': 'Mandatory digital operational resilience testing for the European financial sector.',
    'compliance.sovereignty': 'Data hosted in Europe. GDPR compliance guaranteed.',

    // CTA
    'cta.title': 'Run your first pentest this week.',
    'cta.subtitle': '15 minutes with the team. We scope it on your real perimeter.',
    'cta.button': 'Book a demo',

    // Footer
    'footer.tagline': 'European AI pentest. Built in France. Sovereign by design.',
    'footer.contact': 'Contact',
    'footer.rights': '© 2026 fleuret.ai. All rights reserved.',

    // Careers
    'careers.hero.title': 'Do the best',
    'careers.hero.highlight': 'work of your life.',
    'careers.hero.subtitle': 'We\'re building the future of pentesting. Join a team of engineers and researchers passionate about AI and cybersecurity.',
    'careers.hero.cta': 'Spontaneous application',
    'careers.perks.title': 'Why you\'ll love it here',
    'careers.perks.equity': 'Early-stage equity',
    'careers.perks.equipment': 'Top-notch equipment',
    'careers.perks.hybrid': 'Hybrid working',
    'careers.perks.salary': 'Competitive salary',
    'careers.perks.holidays': '30+ days paid holiday',
    'careers.perks.healthcare': 'Premium healthcare',
    'careers.values.title': 'Our values',
    'careers.values.newIdeas.title': 'We welcome new ideas',
    'careers.values.newIdeas.desc': 'Every voice matters. We create a safe space to propose, experiment, and iterate.',
    'careers.values.outcomeFocused.title': 'We\'re outcome-focused',
    'careers.values.outcomeFocused.desc': 'What matters is impact. Not the method, not the hours. The result.',
    'careers.values.integrity.title': 'We act with integrity',
    'careers.values.integrity.desc': 'Transparency, honesty, accountability. We do what we say.',
    'careers.values.gsd.title': 'We ship.',
    'careers.values.gsd.desc': 'We love challenges. We execute fast, learn fast, move forward.',
    'careers.positions.title': 'Open positions',
    'careers.positions.subtitle': 'We\'re hiring top talent in AI and cybersecurity.',
    'careers.positions.empty': 'No open positions right now, but we\'re always looking for exceptional people.',
    'careers.positions.spontaneous': 'Send a spontaneous application →',
    'careers.back': 'Back to home',

    // About
    'about.hero.title': 'Building the future',
    'about.hero.highlight': 'of pentesting.',
    'about.hero.subtitle': 'Fleuret AI combines artificial intelligence and offensive expertise to make pentesting accessible, continuous, and sovereign.',
    'about.mission.title': 'Our mission',
    'about.mission.desc': 'Traditional pentesting is slow, expensive, and infrequent. We believe it should be fast, affordable, and continuous. Fleuret uses agentic AI to simulate real attacks on your systems, with the same rigor as a human pentester, but in hours, not weeks.',
    'about.team.title': 'Founding team',
    'about.investors.title': 'Business Angels',
    'about.investors.subtitle': 'Cyber and SaaS operators backing Fleuret.',
    'about.vcs.title': 'Funds',
    'about.vcs.subtitle': 'Institutional investors.',
    'about.cta.title': 'Ready to work with us?',
    'about.cta.demo': 'Book a demo',
    'about.cta.careers': 'View open positions',
    'about.back': 'Back to home',

    // Design Partners
    'designPartners.meta.title': 'Design Partner Program',
    'designPartners.hero.badge.label': 'Design Partner',
    'designPartners.hero.remaining': '{remaining} of {total} spots open',
    'designPartners.hero.full': 'Cohort full, waitlist open',
    'designPartners.hero.title': 'Build the future of pentest',
    'designPartners.hero.highlight': 'with us.',
    'designPartners.hero.offer': '{price} flat · {pentests} AI pentests · {weeks} weeks · NIS2 / DORA-ready report',
    'designPartners.hero.subtitle': 'Five European security teams run a pilot cohort kicking off June 1, 2026. Fixed price, fixed scope, audit-ready deliverable.',
    'designPartners.hero.cta': 'Apply now',
    'designPartners.hero.ctaWaitlist': 'Join the waitlist',
    'designPartners.hero.cta.secondary': 'See how it runs',

    'designPartners.countdown.prefix': 'Cohort starts {date}',
    'designPartners.countdown.started': 'Cohort started, applications go to the waitlist',
    'designPartners.countdown.d': 'd',
    'designPartners.countdown.h': 'h',
    'designPartners.countdown.m': 'min',
    'designPartners.countdown.aria': '{days} days, {hours} hours, {minutes} minutes until cohort kickoff',

    'designPartners.timeline.title': 'How it runs, week by week',
    'designPartners.timeline.subtitle': 'No mystery. Scope signed in week 1, report delivered in week 6.',
    'designPartners.timeline.week': 'Week {n}',
    'designPartners.timeline.w1.title': 'Scope & kickoff',
    'designPartners.timeline.w1.desc': '90-min workshop. You name a scope owner, we sign the SOW, we align on the three perimeters (webapp, API, external infra).',
    'designPartners.timeline.w2.title': 'Reconnaissance',
    'designPartners.timeline.w2.desc': 'Our AI agents map your exposure. You get a first filtered, prioritized ASM view.',
    'designPartners.timeline.w3.title': 'WebApp + API pentest',
    'designPartners.timeline.w3.desc': 'Authenticated and unauthenticated attacks. Every finding backed by a reproducible PoC.',
    'designPartners.timeline.w4.title': 'External infra pentest',
    'designPartners.timeline.w4.desc': 'External surface, subdomains, exposed endpoints. Correlated with the two prior perimeters.',
    'designPartners.timeline.w5.title': 'Audit-ready report',
    'designPartners.timeline.w5.desc': 'PDF with NIS2 / DORA mapping, prioritized remediation plan, executive slides for your board.',
    'designPartners.timeline.w6.title': 'Review & roadmap',
    'designPartners.timeline.w6.desc': '60-min retrospective with the founders. Your feedback lands in the Q3 roadmap. Co-signed case study if the engagement proves out.',

    'designPartners.proof.title': 'Why trust us on the first pilot',
    'designPartners.proof.founder': 'Yanis built and defended systems before founding Fleuret. The team combines human offensive security with agentic AI, not repackaged scanning.',
    'designPartners.proof.methodology': 'Every finding ships with a reproducible PoC, a clear business-impact statement, and prioritized remediation. Zero false positives tolerated, because your CISO has no time to waste.',
    'designPartners.proof.pipelineLabel': 'Audit trail',
    'designPartners.proof.step1': 'Input: signed scope, credentials isolated in an ephemeral vault.',
    'designPartners.proof.step2': 'Execution: AI agents, every action logged (who, what, when, from where).',
    'designPartners.proof.step3': 'Validation: reproducible PoC required before a finding enters the report.',
    'designPartners.proof.step4': 'Export: timestamped PDF report plus signed log, ready for your auditor.',

    'designPartners.qualify.title': 'Who qualifies',
    'designPartners.qualify.qualifyGeo': 'Company based in Europe (EU, UK, Switzerland).',
    'designPartners.qualify.qualifyIndustry': 'SaaS, fintech, healthtech, or any business with significant web/API surface.',
    'designPartners.qualify.qualifySize': '50 to 1,000 employees: mature enough for a security budget, agile enough to iterate with us.',
    'designPartners.qualify.qualifyCompliance': 'NIS2 or DORA compliance in progress, or imminent obligation.',
    'designPartners.qualify.qualifyTeam': 'At least one active security lead (CISO, Head of Security) or compliance lead (DPO).',

    'designPartners.apply.title': 'Apply to the pilot',
    'designPartners.apply.subtitle': '3 minutes, 5 fields. If you qualify we send the calendar link right away.',
    'designPartners.apply.waitlistTitle': 'Join the waitlist',
    'designPartners.apply.waitlistSubtitle': 'All 5 spots are taken. Leave your details and we\'ll reach out first for the next cohort.',
    'designPartners.apply.emailLabel': 'Work email',
    'designPartners.apply.emailPlaceholder': 'first.last@company.com',
    'designPartners.apply.emailError': 'Invalid email.',
    'designPartners.apply.roleLabel': 'Your role',
    'designPartners.apply.role.ciso': 'CISO',
    'designPartners.apply.role.security_lead': 'Head of Security',
    'designPartners.apply.role.devops_lead': 'DevOps / SRE lead',
    'designPartners.apply.role.cto': 'CTO',
    'designPartners.apply.role.ceo': 'CEO',
    'designPartners.apply.role.dpo': 'DPO',
    'designPartners.apply.role.other': 'Other',
    'designPartners.apply.sizeLabel': 'Company size',
    'designPartners.apply.size.lt50': 'Under 50',
    'designPartners.apply.size.gt1000': '1,000+',
    'designPartners.apply.companyLabel': 'Company (optional)',
    'designPartners.apply.companyPlaceholder': 'Company name',
    'designPartners.apply.assetLabel': 'Primary scope to test',
    'designPartners.apply.assetPlaceholder': 'E.g. B2B SaaS platform + partner API + customer portal',
    'designPartners.apply.assetError': 'Please provide at least 3 characters.',
    'designPartners.apply.consent': 'I agree that Fleuret may contact me about the Design Partner program and store this information per its privacy policy (legal basis: consent, retention 12 months).',
    'designPartners.apply.consentError': 'Consent is required to process your application.',
    'designPartners.apply.submit': 'Send application',
    'designPartners.apply.submitting': 'Sending…',
    'designPartners.apply.error.validation': 'Check the fields and try again.',
    'designPartners.apply.error.server': 'Server error. Email us at yanis@fleuret.ai.',
    'designPartners.apply.error.network': 'Connection failed. Retry or email yanis@fleuret.ai.',
    'designPartners.apply.qualifiedTitle': 'You qualify. Book 30 min.',
    'designPartners.apply.qualifiedBody': 'We\'ll come back within 24h with a confirmed slot and a short scope questionnaire to pre-fill.',
    'designPartners.apply.qualifiedCta': 'Grab a slot now',
    'designPartners.apply.unqualifiedTitle': 'Thanks, application saved',
    'designPartners.apply.unqualifiedBody': 'Your profile is outside the current cohort scope (50 to 1,000 employees, CISO / CTO / DPO). We keep your details and reach out if a matching cohort opens.',

    'designPartners.faq.title': 'Frequently asked',
    'designPartners.faq.q1.question': 'What does the pilot cost?',
    'designPartners.faq.q1.answer': '€4,900 flat, no hidden fees. Included: 3 AI pentests (webapp + API + external infra), audit-ready PDF report, NIS2 / DORA mapping, 2 sessions with the founders.',
    'designPartners.faq.q2.question': 'What happens after the 6 weeks?',
    'designPartners.faq.q2.answer': 'Design partner preferred rate at 30% off follow-on pentests for 12 months. No renewal lock-in.',
    'designPartners.faq.q3.question': 'What scopes are covered?',
    'designPartners.faq.q3.answer': 'One web app, one REST or GraphQL API, and one external infrastructure surface. Cloud and AD scanners come later in the roadmap and design partners access them in alpha.',
    'designPartners.faq.q4.question': 'What do you need from us?',
    'designPartners.faq.q4.answer': 'A named scope owner, an IT contact for credentials, and three 30-min slots spread across the 6 weeks. Case study published only after successful delivery, anonymizable.',

    'designPartners.back': 'Back to home',

    // Demo page
    'demo.pageTitle': 'Book a demo, Fleuret',
    'demo.pageDescription': 'See Fleuret in action. Book a 30-minute call with our team.',
    'demo.title': 'See Fleuret in action.',
    'demo.subtitle': 'Book a 30-minute call. We will show you the platform on your perimeter.',
    'demo.pullquote': 'Human-grade pentests in hours, not weeks.',
    'demo.stat1.value': '100%',
    'demo.stat1.label': 'Human-grade',
    'demo.stat2.value': '100x',
    'demo.stat2.label': 'Scalability',
    'demo.stat3.value': '3x',
    'demo.stat3.label': 'Cheaper',
    'demo.iframe.title': 'Fleuret demo booking scheduler',
    'demo.fallback.prefix': 'Scheduler not loading?',
    'demo.fallback.link': 'Book directly',

    // Resources hub
    'resources.hero.title': 'Resources',
    'resources.hero.subtitle': 'Insights and field notes on continuous AI pentesting, European compliance and offensive security.',
    'resources.blog.label': 'Blog',
    'resources.blog.title': 'Latest insights',
    'resources.blog.description': 'Our team shares work on automated pentesting, NIS2, DORA, and agentic AI applied to offensive security.',
    'resources.blog.cta': 'See all posts',

    // Blog
    'blog.hero.title': 'Blog',
    'blog.hero.subtitle': 'Insights and field notes on continuous AI pentesting and European compliance.',
    'blog.empty': 'No posts yet. Check back soon.',
    'blog.readingTime': 'min read',
    'blog.share.prompt': 'Share this post',
    'blog.share.label': 'Share',
    'blog.share.linkedIn': 'Share on LinkedIn',
    'blog.share.copyLink': 'Copy link',

    // 404
    'notfound.title': '404',
    'notfound.subtitle': 'Page not found',
    'notfound.home': 'Back to home',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const readStoredLang = (): Language | null => {
  if (typeof window === 'undefined') return null;
  try {
    const v = window.localStorage.getItem(LANG_STORAGE_KEY);
    return v === 'fr' || v === 'en' ? v : null;
  } catch {
    return null;
  }
};

const writeStoredLang = (lang: Language) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    // ignore (private mode, quota, etc.)
  }
};

// Paths that exist only in French (no EN mirror). Never redirect these.
const FR_ONLY_PATHS = new Set<string>(['/mentions-legales']);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const language: Language = detectLocaleFromPath(location.pathname);
  const didInitialRedirect = useRef(false);

  // One-shot: honor stored language preference, or default to EN for new visitors.
  // Runs once per session; after first navigation, URL is the source of truth.
  useEffect(() => {
    if (didInitialRedirect.current) return;
    didInitialRedirect.current = true;

    if (FR_ONLY_PATHS.has(location.pathname)) return;

    const stored = readStoredLang();
    const desired: Language = stored ?? 'en';

    if (desired !== language) {
      const target = swapLocalePath(location.pathname, desired);
      if (target !== location.pathname) {
        navigate(target + (location.search || '') + (location.hash || ''), { replace: true });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo<LanguageContextType>(() => ({
    language,
    setLanguage: (lang: Language) => {
      writeStoredLang(lang);
      const target = swapLocalePath(location.pathname, lang);
      const search = location.search || '';
      const hash = location.hash || '';
      navigate(target + search + hash);
    },
    t: (key: string): string => translations[language][key] || key,
    localize: (basePath: string) => buildLocalePath(basePath, language),
  }), [language, location.pathname, location.search, location.hash, navigate]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
