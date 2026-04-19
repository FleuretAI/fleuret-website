export interface UtmParams {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
}

const KEYS = ["source", "medium", "campaign", "content", "term"] as const;

export function captureUtm(search: string): UtmParams {
  if (!search) return {};
  const params = new URLSearchParams(search);
  const out: UtmParams = {};
  for (const k of KEYS) {
    const v = params.get(`utm_${k}`);
    if (v) out[k] = v.slice(0, 120);
  }
  return out;
}
