import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { listPosts } from "@/content/posts.generated";

const LatestBlog = () => {
  const { language, t, localize } = useLanguage();
  const posts = listPosts(language).slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <section className="fl-section" style={{ padding: "6rem 0 7rem" }}>
      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: "2.5rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(24px, 2.4vw, 32px)",
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              color: "#fff",
              margin: 0,
            }}
          >
            {t("home.latestBlog.title")}
          </h2>
          <Link
            to={localize("/blog")}
            style={{
              fontSize: "14px",
              color: "rgba(79,143,255,0.85)",
              textDecoration: "none",
              letterSpacing: "0.02em",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            {t("home.latestBlog.viewAll")}
            <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              to={localize(post.path)}
              style={{
                display: "block",
                background: "rgba(15,16,28,0.55)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 4,
                padding: "1.5rem",
                textDecoration: "none",
                transition: "border-color 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "rgba(79,143,255,0.4)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")
              }
            >
              <time
                dateTime={post.date}
                style={{
                  display: "block",
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.4)",
                  letterSpacing: "0.06em",
                  marginBottom: "0.75rem",
                }}
              >
                {new Date(post.date + "T00:00:00").toLocaleDateString(
                  language === "fr" ? "fr-FR" : "en-GB",
                  { year: "numeric", month: "long", day: "numeric" },
                )}
              </time>
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: 400,
                  color: "#F6F6FB",
                  margin: "0 0 0.75rem",
                  lineHeight: 1.4,
                }}
              >
                {post.title}
              </h3>
              <span
                style={{
                  fontSize: "13px",
                  color: "rgba(79,143,255,0.85)",
                  letterSpacing: "0.02em",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.3rem",
                }}
              >
                {t("home.latestBlog.readMore")}
                <span aria-hidden>→</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestBlog;
