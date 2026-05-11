import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowLeftRight,
  Check,
  Download,
  Edit3,
  Eye,
  Filter,
  Lock,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload
} from "lucide-react";
import { categories, doctors, subcategories } from "./data";
import {
  deleteCase,
  fetchCases,
  loadLocalCases,
  saveLocalCases,
  uploadCaseImage,
  upsertCase
} from "./caseService";
import { isSupabaseConfigured, supabase } from "./supabaseClient";
import "./styles.css";

const ADMIN_KEY = "the-plus-admin-ok";
const DEFAULT_ALIGNMENT = { x: 50, y: 50, zoom: 1 };

function App() {
  const [view, setView] = useState(location.hash === "#admin" ? "admin" : "gallery");
  const [cases, setCases] = useState(loadLocalCases);
  const [status, setStatus] = useState("Loading cases...");

  React.useEffect(() => {
    let alive = true;
    fetchCases()
      .then((items) => {
        if (!alive) return;
        setCases(items);
        if (!isSupabaseConfigured) saveLocalCases(items);
        setStatus(isSupabaseConfigured ? "Connected to Supabase" : "Demo mode: add Supabase keys to enable uploads");
      })
      .catch((error) => {
        if (!alive) return;
        setStatus(`Supabase error: ${error.message}`);
      });
    return () => {
      alive = false;
    };
  }, []);

  const reloadCases = async () => {
    const items = await fetchCases();
    setCases(items);
    if (!isSupabaseConfigured) saveLocalCases(items);
  };

  return (
    <>
      <Header view={view} setView={setView} status={status} />
      {view === "admin" ? <Admin cases={cases} setCases={setCases} reloadCases={reloadCases} /> : <Gallery cases={cases} />}
    </>
  );
}

function Header({ view, setView, status }) {
  const go = (next) => {
    setView(next);
    location.hash = next === "admin" ? "admin" : "";
  };

  return (
    <header className="site-header">
      <a className="brand" href="#" onClick={() => go("gallery")}>
        <span className="brand-mark" aria-label="The Plus logo">THE PLUS</span>
        <span>
          <strong>The Plus Plastic Surgery</strong>
          <small>Before & After Archive</small>
        </span>
      </a>
      <nav className="top-actions" aria-label="Primary">
        <button className={view === "gallery" ? "active" : ""} onClick={() => go("gallery")}>
          <Eye size={17} /> Gallery
        </button>
      </nav>
    </header>
  );
}

function Gallery({ cases }) {
  const [doctor, setDoctor] = useState("All");
  const [category, setCategory] = useState("All");
  const [subcategory, setSubcategory] = useState("All");
  const [selected, setSelected] = useState(null);

  const subcategoryOptions = category === "All"
    ? ["All", ...Array.from(new Set(Object.values(subcategories).flat().filter((item) => item !== "All")))]
    : subcategories[category] || ["All"];

  React.useEffect(() => {
    if (!subcategoryOptions.includes(subcategory)) {
      setSubcategory("All");
    }
  }, [category, subcategory, subcategoryOptions]);

  const filtered = useMemo(() => {
    return cases.filter((item) => {
      const doctorMatch = doctor === "All" || item.doctor === doctor;
      const categoryMatch = category === "All" || item.category === category;
      const subcategoryMatch = subcategory === "All" || item.subcategory === subcategory;
      return doctorMatch && categoryMatch && subcategoryMatch;
    });
  }, [cases, doctor, category, subcategory]);

  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Seoul, Korea</p>
          <h1>
            THE PLUS <span>Before &amp; After</span>
          </h1>
          <p>
            A premium consultation gallery that allows you to quickly explore before-and-after results
            by doctor, treatment area, and recovery timeline.
          </p>
        </div>
      </section>

      <section className="filter-bar" aria-label="Case filters">
        <SelectIcon icon={<Filter size={18} />} value={doctor} onChange={setDoctor} options={["All", ...doctors]} />
        <SelectIcon icon={<Sparkles size={18} />} value={category} onChange={setCategory} options={["All", ...categories]} />
        <SelectIcon icon={<Search size={18} />} value={subcategory} onChange={setSubcategory} options={subcategoryOptions} />
      </section>

      <section className="results-heading">
        <div>
          <p className="eyebrow">Case Library</p>
          <h2>{filtered.length} curated results</h2>
        </div>
      </section>

      <section className="case-grid">
        {filtered.map((item) => (
          <CaseCard key={item.id} item={item} onOpen={() => setSelected(item)} />
        ))}
      </section>

      {selected && <CaseModal item={selected} onClose={() => setSelected(null)} />}
    </main>
  );
}

function SelectIcon({ icon, value, onChange, options }) {
  return (
    <label className="select-box">
      {icon}
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function CaseCard({ item, onOpen }) {
  return (
    <article className="case-card">
      <button className="ba-preview" onClick={onOpen} aria-label={`${item.title} before and after`}>
        <div>
          <AlignedImage src={item.beforeImage} alt={`${item.title} before`} alignment={item.beforeAlignment} />
          <span>Before</span>
        </div>
        <div>
          <AlignedImage src={item.afterImage} alt={`${item.title} after`} alignment={item.afterAlignment} />
          <span>After</span>
        </div>
      </button>
      <div className="case-body">
        <div className="meta-row">
          <span>{item.doctor}</span>
          <span>{item.category} / {item.subcategory}</span>
        </div>
        <h3>{item.title}</h3>
        <p>{item.summary}</p>
        <div className="tag-row">
          {item.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
    </article>
  );
}

function CaseModal({ item, onClose }) {
  const [slider, setSlider] = useState(50);

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <button className="close" onClick={onClose}>Close</button>
        <div className="comparison" style={{ "--split": `${slider}%` }}>
          <AlignedImage className="after" src={item.afterImage} alt={`${item.title} after`} alignment={item.afterAlignment} />
          <AlignedImage className="before" src={item.beforeImage} alt={`${item.title} before`} alignment={item.beforeAlignment} />
          <span className="divider" />
          <input
            type="range"
            min="5"
            max="95"
            value={slider}
            onChange={(e) => setSlider(e.target.value)}
            aria-label="Before after comparison"
          />
        </div>
        <div className="modal-copy">
          <p className="eyebrow">{item.doctor} / {item.category} / {item.subcategory}</p>
          <h2>{item.title}</h2>
          <p>{item.summary}</p>
          <div className="modal-facts">
            <span><ArrowLeftRight size={17} /> {item.timeline}</span>
            <span><ShieldCheck size={17} /> Consent checked</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Admin({ cases, setCases, reloadCases }) {
  const [authed, setAuthed] = useState(!isSupabaseConfigured && localStorage.getItem(ADMIN_KEY) === "true");
  const [editing, setEditing] = useState(null);
  const [notice, setNotice] = useState("");

  React.useEffect(() => {
    if (!isSupabaseConfigured) return;
    let alive = true;
    supabase.auth.getSession().then(({ data }) => {
      if (alive) setAuthed(Boolean(data.session));
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthed(Boolean(session));
    });
    return () => {
      alive = false;
      data.subscription.unsubscribe();
    };
  }, []);

  if (!authed) {
    return <AdminLogin onLogin={() => {
      localStorage.setItem(ADMIN_KEY, "true");
      setAuthed(true);
    }} />;
  }

  const removeCase = async (id) => {
    setNotice("Deleting case...");
    await deleteCase(id);
    setCases(cases.filter((item) => item.id !== id));
    setNotice("Deleted.");
  };
  const saveCase = async (item) => {
    setNotice("Saving case...");
    const saved = await upsertCase(item);
    const exists = cases.some((current) => current.id === saved.id);
    setCases(exists ? cases.map((current) => current.id === saved.id ? saved : current) : [saved, ...cases]);
    setEditing(null);
    setNotice("Saved.");
  };
  const exportJson = () => {
    const blob = new Blob([JSON.stringify(cases, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "the-plus-cases.json";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <main className="admin-layout">
      <section className="admin-toolbar">
        <div>
          <p className="eyebrow">Admin Console</p>
          <h1>Case management</h1>
        </div>
        <div className="top-actions">
          <button onClick={() => setEditing(emptyCase())}><Plus size={17} /> New Case</button>
          <button onClick={exportJson}><Download size={17} /> Export</button>
          <button onClick={async () => {
            setNotice("Refreshing...");
            await reloadCases();
            setNotice("Refreshed.");
          }}>Refresh</button>
          {isSupabaseConfigured && <button onClick={() => supabase.auth.signOut()}>Sign out</button>}
        </div>
      </section>
      {notice && <p className="admin-notice">{notice}</p>}

      <section className="admin-grid">
        <div className="case-table">
          {cases.map((item) => (
            <div className="table-row" key={item.id}>
              <img src={item.afterImage} alt="" />
              <div>
                <strong>{item.title}</strong>
                <span>{item.doctor} / {item.category} / {item.subcategory} / {item.timeline}</span>
              </div>
              <button title="Edit" onClick={() => setEditing(item)}><Edit3 size={17} /></button>
              <button title="Delete" onClick={() => removeCase(item.id)}><Trash2 size={17} /></button>
            </div>
          ))}
        </div>
        <aside className="admin-note">
          <ShieldCheck size={24} />
          <h2>?댁쁺 ??泥댄겕</h2>
          <p>
            Supabase ?곌껐 ?꾩뿉??愿由ъ옄 怨꾩젙, ?대?吏 ?낅줈????μ냼,
            ?섏옄 ?숈쓽 ?곹깭, 怨듦컻 耳?댁뒪 ?곗씠?곕? ?쒕쾭?먯꽌 愿由ы빀?덈떎.
          </p>
        </aside>
      </section>

      {editing && <CaseEditor item={editing} onSave={saveCase} onCancel={() => setEditing(null)} />}
    </main>
  );
}

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  return (
    <main className="login-page">
      <form className="login-card" onSubmit={async (e) => {
        e.preventDefault();
        setError("");
        if (!isSupabaseConfigured) {
          if (password === "theplus2026") onLogin();
          return;
        }

        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) {
          setError(signInError.message);
          return;
        }
        onLogin();
      }}>
        <Lock size={32} />
        <h1>Admin access</h1>
        <p>{isSupabaseConfigured ? "Sign in with your Supabase admin account." : "Demo password: theplus2026"}</p>
        {isSupabaseConfigured && (
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Admin email" required />
        )}
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        {error && <p className="admin-error">{error}</p>}
        <button><Check size={17} /> Enter</button>
      </form>
    </main>
  );
}

function CaseEditor({ item, onSave, onCancel }) {
  const [draft, setDraft] = useState({
    ...item,
    beforeAlignment: normalizeAlignment(item.beforeAlignment),
    afterAlignment: normalizeAlignment(item.afterAlignment),
    tagsText: item.tags.join(", ")
  });
  const [uploading, setUploading] = useState("");
  const [error, setError] = useState("");
  const update = (field, value) => setDraft((current) => ({ ...current, [field]: value }));

  const submit = (event) => {
    event.preventDefault();
    onSave({
      ...draft,
      id: draft.id || slugify(draft.title),
      tags: draft.tagsText.split(",").map((tag) => tag.trim()).filter(Boolean),
      featured: Boolean(draft.featured),
      consent: Boolean(draft.consent)
    });
  };

  const uploadImage = async (field, side, file) => {
    if (!file) return;
    setError("");
    setUploading(`${side} image uploading...`);
    try {
      const url = await uploadCaseImage(file, side);
      update(field, url);
      setUploading(`${side} image uploaded.`);
    } catch (uploadError) {
      setError(uploadError.message);
      setUploading("");
    }
  };

  const updateAlignment = (field, key, value) => {
    setDraft((current) => ({
      ...current,
      [field]: {
        ...normalizeAlignment(current[field]),
        [key]: Number(value)
      }
    }));
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <form className="editor" onSubmit={submit}>
        <div className="editor-head">
          <h2>{item.id ? "Edit case" : "New case"}</h2>
          <button type="button" onClick={onCancel}>Close</button>
        </div>
        <label>Title<input value={draft.title} onChange={(e) => update("title", e.target.value)} required /></label>
        <div className="form-split">
          <label>Doctor<select value={draft.doctor} onChange={(e) => update("doctor", e.target.value)}>{doctors.map((value) => <option key={value}>{value}</option>)}</select></label>
          <label>Category<select value={draft.category} onChange={(e) => {
            update("category", e.target.value);
            update("subcategory", subcategories[e.target.value]?.[1] || "General");
          }}>{categories.map((value) => <option key={value}>{value}</option>)}</select></label>
        </div>
        <label>
          Surgery detail
          <select value={draft.subcategory || "General"} onChange={(e) => update("subcategory", e.target.value)}>
            {(subcategories[draft.category] || ["All", "General"]).filter((value) => value !== "All").map((value) => <option key={value}>{value}</option>)}
          </select>
        </label>
        <label>Timeline<input value={draft.timeline} onChange={(e) => update("timeline", e.target.value)} /></label>
        <label>Summary<textarea value={draft.summary} onChange={(e) => update("summary", e.target.value)} rows="3" /></label>
        <label>
          Before image
          <input type="file" accept="image/*" onChange={(e) => uploadImage("beforeImage", "before", e.target.files?.[0])} />
          <input value={draft.beforeImage} onChange={(e) => update("beforeImage", e.target.value)} placeholder="Uploaded URL or external image URL" />
        </label>
        <AlignmentControl
          title="Before face position"
          image={draft.beforeImage}
          alignment={draft.beforeAlignment}
          onChange={(key, value) => updateAlignment("beforeAlignment", key, value)}
        />
        <label>
          After image
          <input type="file" accept="image/*" onChange={(e) => uploadImage("afterImage", "after", e.target.files?.[0])} />
          <input value={draft.afterImage} onChange={(e) => update("afterImage", e.target.value)} placeholder="Uploaded URL or external image URL" />
        </label>
        <AlignmentControl
          title="After face position"
          image={draft.afterImage}
          alignment={draft.afterAlignment}
          onChange={(key, value) => updateAlignment("afterAlignment", key, value)}
        />
        <label>Tags<input value={draft.tagsText} onChange={(e) => update("tagsText", e.target.value)} placeholder="Rhinoplasty, 6 months" /></label>
        {uploading && <p className="admin-notice">{uploading}</p>}
        {error && <p className="admin-error">{error}</p>}
        <div className="check-row">
          <label><input type="checkbox" checked={draft.featured} onChange={(e) => update("featured", e.target.checked)} /> Featured</label>
          <label><input type="checkbox" checked={draft.consent} onChange={(e) => update("consent", e.target.checked)} /> Consent checked</label>
        </div>
        <button className="save-button"><Upload size={17} /> Save case</button>
      </form>
    </div>
  );
}

function emptyCase() {
  return {
    id: "",
    title: "",
    doctor: doctors[0],
    category: categories[0],
    subcategory: subcategories[categories[0]]?.[1] || "General",
    tags: [],
    timeline: "",
    summary: "",
    beforeImage: "",
    afterImage: "",
    beforeAlignment: DEFAULT_ALIGNMENT,
    afterAlignment: DEFAULT_ALIGNMENT,
    consent: true,
    featured: false
  };
}

function AlignmentControl({ title, image, alignment = DEFAULT_ALIGNMENT, onChange }) {
  const safe = normalizeAlignment(alignment);

  return (
    <section className="alignment-control">
      <div className="alignment-preview">
        {image ? (
          <AlignedImage src={image} alt={`${title} preview`} alignment={safe} />
        ) : (
          <span>Upload image first</span>
        )}
        <i className="face-guide horizontal" />
        <i className="face-guide vertical" />
      </div>
      <div className="alignment-fields">
        <h3>{title}</h3>
        <label>
          Left / Right
          <input type="range" min="0" max="100" value={safe.x} onChange={(e) => onChange("x", e.target.value)} />
        </label>
        <label>
          Up / Down
          <input type="range" min="0" max="100" value={safe.y} onChange={(e) => onChange("y", e.target.value)} />
        </label>
        <label>
          Zoom
          <input type="range" min="1" max="2.5" step="0.01" value={safe.zoom} onChange={(e) => onChange("zoom", e.target.value)} />
        </label>
        <button type="button" onClick={() => {
          onChange("x", 50);
          onChange("y", 50);
          onChange("zoom", 1);
        }}>Reset</button>
      </div>
    </section>
  );
}

function AlignedImage({ src, alt, alignment = DEFAULT_ALIGNMENT, className = "" }) {
  const safe = normalizeAlignment(alignment);
  return (
    <img
      className={className}
      src={src}
      alt={alt}
      style={{
        objectPosition: `${safe.x}% ${safe.y}%`,
        transform: `scale(${safe.zoom})`,
        transformOrigin: `${safe.x}% ${safe.y}%`
      }}
    />
  );
}

function normalizeAlignment(value) {
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

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || crypto.randomUUID();
}

createRoot(document.getElementById("root")).render(<App />);


