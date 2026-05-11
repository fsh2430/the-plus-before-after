import { createClient } from "@supabase/supabase-js";

export const supabaseConfig = {
  url: import.meta.env.VITE_SUPABASE_URL,
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  table: import.meta.env.VITE_SUPABASE_CASES_TABLE || "cases",
  bucket: import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || "case-images"
};

export const isSupabaseConfigured = Boolean(
  supabaseConfig.url &&
  supabaseConfig.anonKey &&
  !supabaseConfig.url.includes("your-project-ref")
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseConfig.url, supabaseConfig.anonKey)
  : null;

export function toCase(row) {
  return {
    id: row.id,
    title: row.title,
    doctor: row.doctor,
    category: row.category,
    subcategory: row.subcategory || "General",
    tags: row.tags || [],
    timeline: row.timeline || "",
    summary: row.summary || "",
    beforeImage: row.before_image,
    afterImage: row.after_image,
    consent: Boolean(row.consent),
    featured: Boolean(row.featured)
  };
}

export function toRow(item) {
  return {
    id: item.id,
    title: item.title,
    doctor: item.doctor,
    category: item.category,
    subcategory: item.subcategory || "General",
    tags: item.tags || [],
    timeline: item.timeline || "",
    summary: item.summary || "",
    before_image: item.beforeImage,
    after_image: item.afterImage,
    consent: Boolean(item.consent),
    featured: Boolean(item.featured),
    updated_at: new Date().toISOString()
  };
}
