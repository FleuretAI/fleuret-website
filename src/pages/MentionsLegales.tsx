import { Link } from "react-router-dom";
import { SEO } from "@/seo/SEO";

const MentionsLegales = () => {
  return (
    <main id="main-content" className="min-h-screen pt-32 pb-20 px-4">
      <SEO pageKey="mentionsLegales" />
      <div className="max-w-3xl mx-auto">
        <Link
          to="/"
          className="text-[var(--accent-blue)] hover:underline text-sm inline-block mb-8"
        >
          &larr; Retour
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
          Mentions légales
        </h1>

        {/* Éditeur du site */}
        <h2 className="text-xl font-semibold text-white mb-4 mt-10">
          1. Éditeur du site
        </h2>
        <div className="text-white/50 leading-relaxed text-sm space-y-1">
          <p>Le site <a href="https://fleuret.ai" className="text-[var(--accent-blue)] hover:underline">https://fleuret.ai</a> est édité par :</p>
          <p className="mt-3"><strong className="text-white/70">FLEURET AI</strong></p>
          <p>Société par actions simplifiée (SAS) au capital variable</p>
          <p>Siège social : 60 Rue François 1er, 75008 Paris, France</p>
          <p>SIREN : 999 515 604</p>
          <p>SIRET : 999 515 604 00018</p>
          <p>RCS Paris</p>
          <p>Code APE : 6201Z, Programmation informatique</p>
          <p>N° TVA intracommunautaire : FR83999515604</p>
          <p>Président : Yanis Grigy</p>
          <p>Directeurs Généraux : Pierre-Gabriel Berlureau, Augustin Ponsin</p>
          <p className="mt-3">
            Email :{" "}
            <a
              href="mailto:contact@fleuret.ai"
              className="text-[var(--accent-blue)] hover:underline"
            >
              contact@fleuret.ai
            </a>
          </p>
        </div>

        {/* Directeur de la publication */}
        <h2 className="text-xl font-semibold text-white mb-4 mt-10">
          2. Directeur de la publication
        </h2>
        <p className="text-white/50 leading-relaxed text-sm">
          Le directeur de la publication est Yanis Grigy, en qualité de Président de FLEURET AI.
        </p>

        {/* Hébergeur */}
        <h2 className="text-xl font-semibold text-white mb-4 mt-10">
          3. Hébergeur
        </h2>
        <div className="text-white/50 leading-relaxed text-sm space-y-1">
          <p><strong className="text-white/70">Vercel Inc.</strong></p>
          <p>340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</p>
          <p>
            Site web :{" "}
            <a
              href="https://vercel.com"
              className="text-[var(--accent-blue)] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://vercel.com
            </a>
          </p>
        </div>

        {/* Propriété intellectuelle */}
        <h2 className="text-xl font-semibold text-white mb-4 mt-10">
          4. Propriété intellectuelle
        </h2>
        <div className="text-white/50 leading-relaxed text-sm space-y-3">
          <p>
            L'ensemble du contenu du site fleuret.ai (incluant, sans limitation, les textes,
            graphismes, images, logos, icônes, logiciels, noms de domaine, marques, bases de
            données et architecture) est la propriété exclusive de FLEURET AI ou de ses
            concédants, et est protégé par les lois françaises et internationales relatives à la
            propriété intellectuelle.
          </p>
          <p>
            Toute reproduction, représentation, modification, distribution ou exploitation, totale
            ou partielle, de ces éléments, par quelque procédé que ce soit, sans l'autorisation
            écrite préalable de FLEURET AI, est strictement interdite et constitue une contrefaçon
            sanctionnée par les articles L.335-2 et suivants du Code de la propriété intellectuelle.
          </p>
        </div>

        {/* Limitation de responsabilité */}
        <h2 className="text-xl font-semibold text-white mb-4 mt-10">
          5. Limitation de responsabilité
        </h2>
        <div className="text-white/50 leading-relaxed text-sm space-y-3">
          <p>
            FLEURET AI s'efforce d'assurer l'exactitude et la mise à jour des informations
            diffusées sur le site, mais ne saurait garantir l'exhaustivité, la précision ou
            l'actualité de l'ensemble des informations mises à disposition.
          </p>
          <p>
            En conséquence, FLEURET AI décline toute responsabilité en cas d'imprécision,
            d'inexactitude ou d'omission portant sur des informations disponibles sur le site.
          </p>
          <p>
            FLEURET AI ne pourra être tenue responsable des dommages directs ou indirects résultant
            de l'accès au site ou de l'utilisation de son contenu, ni des dysfonctionnements ou
            interruptions du service, quelle qu'en soit la cause.
          </p>
          <p>
            Le site peut contenir des liens hypertextes vers d'autres sites. FLEURET AI n'exerce
            aucun contrôle sur le contenu de ces sites tiers et n'assume aucune responsabilité à
            leur égard.
          </p>
        </div>

        {/* Droit applicable et juridiction */}
        <h2 className="text-xl font-semibold text-white mb-4 mt-10">
          6. Droit applicable et juridiction compétente
        </h2>
        <div className="text-white/50 leading-relaxed text-sm space-y-3">
          <p>
            Les présentes mentions légales sont régies par le droit français. En cas de litige
            relatif à l'interprétation ou l'exécution des présentes, et à défaut de résolution
            amiable, compétence exclusive est attribuée au Tribunal de commerce de Paris.
          </p>
        </div>

        {/* Date */}
        <p className="text-white/30 text-xs mt-16">
          Dernière mise à jour : 11 mars 2026
        </p>
      </div>
    </main>
  );
};

export default MentionsLegales;
