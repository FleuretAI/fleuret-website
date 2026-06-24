import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { NewsletterCTA } from "@/components/blog/NewsletterCTA";

const trackCTAClick = vi.fn();
vi.mock("@/lib/gtag", () => ({
  trackCTAClick: (...args: unknown[]) => trackCTAClick(...args),
}));

vi.mock("@/lib/captureUtm", () => ({
  captureUtm: () => ({ source: "linkedin", medium: "dm" }),
}));

function renderCTA(props?: React.ComponentProps<typeof NewsletterCTA>) {
  return render(
    <LanguageProvider>
      <NewsletterCTA {...props} />
    </LanguageProvider>,
  );
}

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  fetchMock = vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 }));
  vi.stubGlobal("fetch", fetchMock);
  trackCTAClick.mockClear();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("NewsletterCTA", () => {
  it("renders the form with the subscribe CTA", () => {
    renderCTA();
    expect(screen.getByRole("button", { name: /subscribe/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/you@company\.com/i)).toBeInTheDocument();
  });

  it("submits valid email + consent → POST /api/newsletter, success state, GA4 fires", async () => {
    renderCTA({ trackingLocation: "blog_post_footer" });

    fireEvent.change(screen.getByPlaceholderText(/you@company\.com/i), {
      target: { value: "subscriber@example.com" },
    });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: /subscribe/i }));

    await waitFor(() => {
      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("/api/newsletter");
    expect(init.method).toBe("POST");
    const body = JSON.parse(String(init.body));
    expect(body.email).toBe("subscriber@example.com");
    expect(body.consent).toBe(true);
    expect(typeof body.submissionId).toBe("string");
    expect(body.utm).toEqual({ source: "linkedin", medium: "dm" });

    expect(trackCTAClick).toHaveBeenCalledWith({
      location: "blog_post_footer",
      label: "newsletter_subscribe",
      destination: "/api/newsletter",
    });
  });

  it("submitting an empty email shows the inline email error and skips fetch", () => {
    const { container } = renderCTA();

    // No email typed. Consent ticked so the consent guard does not steal the
    // failure mode. fireEvent.submit bypasses jsdom's HTML5 `required` check.
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.submit(container.querySelector("form") as HTMLFormElement);

    const errors = screen.getAllByRole("alert");
    expect(errors.some((el) => /invalid email/i.test(el.textContent || ""))).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("submitting a valid email without consent shows the consent error", () => {
    const { container } = renderCTA();

    fireEvent.change(screen.getByPlaceholderText(/you@company\.com/i), {
      target: { value: "subscriber@example.com" },
    });
    fireEvent.submit(container.querySelector("form") as HTMLFormElement);

    const errors = screen.getAllByRole("alert");
    expect(errors.some((el) => /gdpr consent/i.test(el.textContent || ""))).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("non-2xx fetch response renders the network error", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ error: "boom" }), { status: 500 }),
    );
    renderCTA();

    fireEvent.change(screen.getByPlaceholderText(/you@company\.com/i), {
      target: { value: "subscriber@example.com" },
    });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: /subscribe/i }));

    await waitFor(() => {
      const errors = screen.getAllByRole("alert");
      expect(errors.some((el) => /network|réessayez|try again/i.test(el.textContent || ""))).toBe(
        true,
      );
    });
    expect(screen.queryByRole("status")).toBeNull();
  });
});
