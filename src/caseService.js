import { initialCases } from "./data";
import { isSupabaseConfigured, supabase, supabaseConfig, toCase, toRow } from "./supabaseClient";

const STORAGE_KEY = "the-plus-before-after-cases";

export function loadLocalCases() {
  try {
    return normalizeCases(JSON.parse(localStorage.getItem(STORAGE_KEY)) || initialCases);
  } catch {
    return normalizeCases(initialCases);
  }
}

export function saveLocalCases(cases) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
}

export async function fetchCases() {
  if (!isSupabaseConfigured) {
    return loadLocalCases();
  }

  const { data, error } = await supabase
    .from(supabaseConfig.table)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return normalizeCases(data.map(toCase));
}

function normalizeCases(cases) {
  return cases.map((item) => ({
    ...item,
    subcategory: item.subcategory || "General",
    tags: item.tags || []
  }));
}

export async function upsertCase(item) {
  if (!isSupabaseConfigured) {
    const current = loadLocalCases();
    const exists = current.some((stored) => stored.id === item.id);
    const next = exists
      ? current.map((stored) => (stored.id === item.id ? item : stored))
      : [item, ...current];
    saveLocalCases(next);
    return item;
  }

  const { data, error } = await supabase
    .from(supabaseConfig.table)
    .upsert(toRow(item))
    .select()
    .single();

  if (error) throw error;
  return toCase(data);
}

export async function deleteCase(id) {
  if (!isSupabaseConfigured) {
    saveLocalCases(loadLocalCases().filter((item) => item.id !== id));
    return;
  }

  const { error } = await supabase.from(supabaseConfig.table).delete().eq("id", id);
  if (error) throw error;
}

export async function uploadCaseImage(file, side) {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
  }

  const extension = file.name.split(".").pop() || "jpg";
  const safeName = file.name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const path = `${side}/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${safeName}.${extension}`;

  const { error } = await supabase.storage.from(supabaseConfig.bucket).upload(path, file, {
    cacheControl: "31536000",
    upsert: false
  });

  if (error) throw error;

  const { data } = supabase.storage.from(supabaseConfig.bucket).getPublicUrl(path);
  return data.publicUrl;
}
