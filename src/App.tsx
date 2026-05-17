import { lazy, Suspense } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import CookieBanner from "./components/CookieBanner";
import AnnouncementBanner from "./components/AnnouncementBanner";
import Analytics from "./components/Analytics";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
// BlogPost is EAGER-imported (not React.lazy). Prerender Puppeteer waits for
// `article[data-post-slug][data-rendered="true"]`; a lazy route would render
// the Suspense fallback before the chunk resolves and ship empty HTML.
import BlogPost from "./pages/BlogPost";
// CompliancePage is also EAGER-imported for the same prerender reason. It
// waits on `article[data-compliance-framework][data-rendered="true"]`.
import CompliancePage from "./pages/CompliancePage";

const About = lazy(() => import("./pages/About"));
const Careers = lazy(() => import("./pages/Careers"));
const DesignPartners = lazy(() => import("./pages/DesignPartners"));
const Demo = lazy(() => import("./pages/Demo"));
const MentionsLegales = lazy(() => import("./pages/MentionsLegales"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfUse = lazy(() => import("./pages/TermsOfUse"));
const SecurityPolicy = lazy(() => import("./pages/SecurityPolicy"));
const SubProcessors = lazy(() => import("./pages/SubProcessors"));
const Resources = lazy(() => import("./pages/Resources"));
const BlogIndex = lazy(() => import("./pages/BlogIndex"));
const ComplianceIndex = lazy(() => import("./pages/ComplianceIndex"));
const NotFound = lazy(() => import("./pages/NotFound"));
// Unlinked, noindex-ed fundraise announcement page. Kept out of sitemap and
// prerender list until press embargo drops. URL resolves via SPA routing only.
const FleuretRaises = lazy(() => import("./pages/FleuretRaises"));

const queryClient = new QueryClient();

type RouteDef = { path: string; element: JSX.Element };

const APP_ROUTES: RouteDef[] = [
  { path: "/", element: <Index /> },
  { path: "/about", element: <About /> },
  { path: "/careers", element: <Careers /> },
  { path: "/design-partners", element: <DesignPartners /> },
  { path: "/demo", element: <Demo /> },
  { path: "/mentions-legales", element: <MentionsLegales /> },
  { path: "/privacy", element: <PrivacyPolicy /> },
  { path: "/terms", element: <TermsOfUse /> },
  { path: "/security", element: <SecurityPolicy /> },
  { path: "/sub-processors", element: <SubProcessors /> },
  { path: "/resources", element: <Resources /> },
  { path: "/blog", element: <BlogIndex /> },
  { path: "/blog/:slug", element: <BlogPost /> },
  { path: "/compliance", element: <ComplianceIndex /> },
  {
    path: "/compliance/:framework/:industry",
    element: <CompliancePage />,
  },
  { path: "/news/fleuret-raises-3-5m", element: <FleuretRaises /> },
];

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <LanguageProvider>
          <ScrollToTop />
          <Analytics />
          {import.meta.env.VITE_ANNOUNCE_VISIBLE !== "false" && <AnnouncementBanner />}
          <Suspense fallback={null}>
            <Routes>
              {APP_ROUTES.map((r) => (
                <Route key={r.path} path={r.path} element={r.element} />
              ))}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <CookieBanner />
        </LanguageProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
