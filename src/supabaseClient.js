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
    beforeAlignment: normalizeAlignment(row.before_alignment),
    afterAlignment: normalizeAlignment(row.after_alignment),
    views: normalizeViews(row.view_images, row),
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
    before_alignment: normalizeAlignment(item.beforeAlignment),
    after_alignment: normalizeAlignment(item.afterAlignment),
    view_images: normalizeViews(item.views, item),
    consent: Boolean(item.consent),
    featured: Boolean(item.featured),
    updated_at: new Date().toISOString()
  };
}

export function normalizeViews(value, fallback = {}) {
  const source = value || {};
  return {
    front: normalizeView(source.front, {
      beforeImage: fallback.before_image || fallback.beforeImage || "",
      afterImage: fallback.after_image || fallback.afterImage || "",
      beforeAlignment: fallback.before_alignment || fallback.beforeAlignment,
      afterAlignment: fallback.after_alignment || fallback.afterAlignment
    }),
    angle45: normalizeView(source.angle45),
    angle90: normalizeView(source.angle90)
  };
}

function normalizeView(value = {}, fallback = {}) {
  return {
    beforeImage: value.beforeImage || fallback.beforeImage || "",
    afterImage: value.afterImage || fallback.afterImage || "",
    beforeAlignment: normalizeAlignment(value.beforeAlignment || fallback.beforeAlignment),
    afterAlignment: normalizeAlignment(value.afterAlignment || fallback.afterAlignment)
  };
}

export function normalizeAlignment(value) {
  return {
    x: clampNumber(value?.x, 50, 0, 100),
    y: clampNumber(value?.y, 50, 0, 100),
    zoom: clampNumber(value?.zoom, 1, 1, 2.5)
  };
}

function clampNumber(value, fallback, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}
