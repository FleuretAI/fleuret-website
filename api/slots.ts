import type { VercelRequest, VercelResponse } from "@vercel/node";
import { serverSupabase } from "./_lib/supabase.js";

export const config = {
  runtime: "nodejs",
  regions: ["fra1"],
};

const TOTAL_SLOTS = 5;
const FALLBACK_REMAINING = TOTAL_SLOTS;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=300, stale-while-revalidate=86400",
  );
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  try {
    const supabase = serverSupabase();
    const { data, error } = await supabase.rpc(
      "design_partner_slots_remaining",
      { total: TOTAL_SLOTS },
    );
    if (error) throw error;
    const remaining = typeof data === "number" ? data : FALLBACK_REMAINING;
    return res.status(200).json({ remaining, total: TOTAL_SLOTS });
  } catch {
    return res
      .status(200)
      .json({ remaining: FALLBACK_REMAINING, total: TOTAL_SLOTS, fallback: true });
  }
}
