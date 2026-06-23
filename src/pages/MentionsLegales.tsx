import { Link } from "react-router-dom";
import { SEO } from "@/seo/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const MentionsLegales = () => {
  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen pt-40 md:pt-48 pb-20 px-4">
      <SEO pageKey="mentionsLegales" />
      <div className="max-w-3xl mx-auto">
        <Link
          to="/"
          className="text-[var(--accent-blue)] hover:underline text-sm inline-block mb-8"
        >
          &larr; Back
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
          Legal Notice
        </h1>

        {/* Publisher */}
        <h2 className="text-xl font-semibold text-white mb-4 mt-10">
          1. Site publisher
        </h2>
        <div className="text-white/50 leading-relaxed text-sm space-y-1">
          <p>
            The site{" "}
            <a href="https://fleuret.ai" className="text-[var(--accent-blue)] hover:underline">
              https://fleuret.ai
            </a>{" "}
            is published by:
          </p>
          <p className="mt-3"><strong className="text-white/70">FLEURET AI</strong></p>
          <p>French simplified joint-stock company (SAS) with variable capital</p>
          <p>Registered office: 60 Rue François 1er, 75008 Paris, France</p>
          <p>SIREN: 999 515 604</p>
          <p>SIRET: 999 515 604 00018</p>
          <p>RCS Paris</p>
          <p>NAF code: 6201Z, Computer programming</p>
          <p>EU VAT number: FR83999515604</p>
          <p>President: Yanis Grigy</p>
          <p>Managing Director: Augustin Ponsin</p>
          <p className="mt-3">
            Email:{" "}
            <a
              href="mailto:contact@fleuret.ai"
              className="text-[var(--accent-blue)] hover:underline"
            >
              contact@fleuret.ai
            </a>
          </p>
        </div>

        {/* Publication director */}
        <h2 className="text-xl font-semibold text-white mb-4 mt-10">
          2. Publication director
        </h2>
        <p className="text-white/50 leading-relaxed text-sm">
          The publication director is Yanis Grigy, in his capacity as President of FLEURET AI.
        </p>

        {/* Host */}
        <h2 className="text-xl font-semibold text-white mb-4 mt-10">
          3. Hosting provider
        </h2>
        <div className="text-white/50 leading-relaxed text-sm space-y-1">
          <p><strong className="text-white/70">Vercel Inc.</strong></p>
          <p>340 S Lemon Ave #4133, Walnut, CA 91789, United States</p>
          <p>
            Website:{" "}
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

        {/* IP */}
        <h2 className="text-xl font-semibold text-white mb-4 mt-10">
          4. Intellectual property
        </h2>
        <div className="text-white/50 leading-relaxed text-sm space-y-3">
          <p>
            All content on the fleuret.ai website (including, without limitation, text, graphics,
            images, logos, icons, software, domain names, trademarks, databases and architecture)
            is the exclusive property of FLEURET AI or its licensors, and is protected by French
            and international intellectual property law.
          </p>
          <p>
            Any reproduction, representation, modification, distribution or exploitation, in whole
            or in part, of these elements, by any process whatsoever, without the prior written
            authorization of FLEURET AI, is strictly prohibited and constitutes infringement
            sanctioned by articles L.335-2 et seq. of the French Intellectual Property Code.
          </p>
        </div>

        {/* Liability */}
        <h2 className="text-xl font-semibold text-white mb-4 mt-10">
          5. Liability limitation
        </h2>
        <div className="text-white/50 leading-relaxed text-sm space-y-3">
          <p>
            FLEURET AI strives to ensure the accuracy and timeliness of the information published
            on the site, but cannot guarantee the completeness, accuracy or currency of all
            information made available.
          </p>
          <p>
            FLEURET AI therefore disclaims any liability in the event of imprecision, inaccuracy
            or omission relating to information available on the site.
          </p>
          <p>
            FLEURET AI shall not be held liable for direct or indirect damages resulting from
            access to the site or use of its content, nor for service malfunctions or
            interruptions, whatever the cause.
          </p>
          <p>
            The site may contain hyperlinks to other sites. FLEURET AI exercises no control over
            the content of these third-party sites and assumes no responsibility for them.
          </p>
        </div>

        {/* Law + jurisdiction */}
        <h2 className="text-xl font-semibold text-white mb-4 mt-10">
          6. Applicable law and jurisdiction
        </h2>
        <div className="text-white/50 leading-relaxed text-sm space-y-3">
          <p>
            This legal notice is governed by French law. In the event of a dispute relating to
            the interpretation or execution of these terms, and failing amicable resolution,
            exclusive jurisdiction is granted to the Commercial Court of Paris.
          </p>
        </div>

        {/* Date */}
        <p className="text-white/30 text-xs mt-16">
          Last updated: 13 May 2026
        </p>
      </div>
      </main>
      <Footer />
    </>
  );
};

export default MentionsLegales;
