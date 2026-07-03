import { useState, useEffect, useMemo } from "react";

// ————— Bauhaus token system —————
const INK = "#161616";
const PAPER = "#FAF8F2";
const BLUE = "#2743C6";   // kobalt
const RED = "#E0311B";    // vermilion
const YELLOW = "#F2B707"; // signal
const GREEN = "#1E7A4C";

const THEMES = {
  light: { bg: PAPER, card: "#fff", ink: INK, blue: BLUE, green: GREEN },
  dark: { bg: "#111113", card: "#1C1C21", ink: "#F2EFE7", blue: "#8FA0FF", green: "#3FA875" },
};

const LEVELS = {
  superbeginner: { label: "Superbeginner", color: YELLOW, shape: "circle", blurb: "Very slow speech, drawings & gestures. Start here with zero German." },
  beginner: { label: "Beginner", color: RED, shape: "triangle", blurb: "Slow, clear German about everyday topics. Simple sentences." },
  intermediate: { label: "Intermediate", color: BLUE, shape: "square", blurb: "Natural speed with subtitles and visual support." },
  advanced: { label: "Advanced", color: INK, shape: "diamond", blurb: "Native speed, native content. Slurring, slang, speed and all." },
};

// ————— Real, verified German videos from YouTube —————
const VIDEOS = [
  // Superbeginner
  { id: "8llf3ykCwak", title: "Meine Morgenroutine", channel: "Natürlich German", level: "superbeginner", min: 7, desc: "Anna walks through her morning with drawings and gestures — pre-beginner comprehensible input." },
  { id: "zUEjBGiBCsM", title: "Das Gesicht (The Face)", channel: "Comprehensible Input German", level: "superbeginner", min: 10, desc: "Parts of the face in very slow, clear German for absolute beginners." },
  { id: "Yaelm87PTvg", title: "Sich vorstellen — für absolute Anfänger", channel: "Super Easy German", level: "superbeginner", min: 8, desc: "Introduce yourself in German, spoken extra slowly with dual subtitles." },
  { id: "otfoiKjFYBA", title: "Was ist Comprehensible Input?", channel: "Natürlich German", level: "superbeginner", min: 4, desc: "The channel's method explained in simple, comprehensible German." },
  // Beginner
  { id: "r94aqLUO0wo", title: "Sich vorstellen", channel: "Super Easy German", level: "beginner", min: 5, desc: "The first Super Easy German episode: introductions on the street, slowly." },
  { id: "Ep3zb15gnUM", title: "Comprehensible Input A1–A2", channel: "Chill German", level: "beginner", min: 15, desc: "Relaxed beginner German with German subtitles throughout." },
  { id: "4-eDoThe6qo", title: "Nicos Weg — Der Film (A1)", channel: "DW Deutsch lernen", level: "beginner", min: 90, desc: "A feature-length learner film from Deutsche Welle: Nico arrives in Germany with no German. Subtitles available." },
  { id: "meChQ0YaqPQ", title: "Peppa Wutz · Schwimmen mit Schorsch (ganze Folge)", channel: "Peppa Pig Deutsch", level: "beginner", min: 25, desc: "Kids' cartoon with simple sentences and total visual support — classic easy input." },
  // Intermediate
  { id: "cGQZ8lTHn1M", title: "Was macht dich sympathisch? (Straßeninterview)", channel: "Easy German", level: "intermediate", min: 12, desc: "Real Berliners answer at natural speed — dual German/English subtitles help you follow." },
  { id: "Lfoai_nP7lc", title: "Wie wichtig ist dir Geld? (Straßeninterview)", channel: "Easy German", level: "intermediate", min: 12, desc: "Street interviews about money — authentic everyday German with subtitles." },
  { id: "3iV2WK1-IV8", title: "Learn German with Street Interviews (Dresden)", channel: "Easy German", level: "intermediate", min: 12, desc: "Street interviews from Dresden — everyday spoken German with dual subtitles." },
  { id: "Lg5P2w_Ro1c", title: "Nicos Weg — Der Film (A2)", channel: "DW Deutsch lernen", level: "intermediate", min: 90, desc: "The A2 sequel film: everyday life in Germany in clear, natural German with subtitles." },
  { id: "LkufozluseI", title: "Nicos Weg — Der Film (B1)", channel: "DW Deutsch lernen", level: "intermediate", min: 90, desc: "The B1 finale: faster, longer conversations — a bridge toward native content." },
  { id: "23rU7Gm_5d8", title: "Wie heizt man heute? · Sachgeschichte", channel: "Die Maus (WDR)", level: "intermediate", min: 8, desc: "Germany's beloved kids' show explains things clearly — spoken plainly with strong visuals." },
  // Advanced
  { id: "3z0gnXgK8Do", title: "Corona geht gerade erst los", channel: "maiLab", level: "advanced", min: 20, desc: "Germany's most-watched YouTube video of 2020 — dense, fast science journalism by Mai Thi Nguyen-Kim." },
  { id: "VOYuMywDnXI", title: "Können Schwarze Löcher das Universum löschen?", channel: "Dinge Erklärt – Kurzgesagt", level: "advanced", min: 8, desc: "Science at native speed — the information paradox, beautifully animated." },
  { id: "LeX1ALuxcwI", title: "Das Schwarze Loch, das Galaxien killt", channel: "Dinge Erklärt – Kurzgesagt", level: "advanced", min: 10, desc: "Quasars explained in fast, technical, native German." },
  { id: "EzXKlg0EmN8", title: "Kann man ein Schwarzes Loch zerstören?", channel: "Dinge Erklärt – Kurzgesagt", level: "advanced", min: 9, desc: "Advanced vocabulary, native narration speed, German subtitles available." },
];

// Official Pokémon TV channel season playlists. The player's ⚙ settings let you
// switch the audio track to Deutsch on episodes that carry the German dub.
const CLASSIC_SEASONS = [
  { n: 1, title: "Indigo League", playlist: "PLRcHmntfmJ8CnSmj4C284-a1euH518aQa", thumb: "Zyt2GKb6qWw", count: "52 videos" },
  { n: 2, title: "Adventures in the Orange Islands", playlist: "PLRcHmntfmJ8AtnKq7EHNIQBUNTs85bqwS", count: "60 videos" },
  { n: 3, title: "The Johto Journeys", playlist: "PLRcHmntfmJ8DB8wgMrUZwf3JGkLM17yeL", thumb: "EaOMsueW9v0", count: "41 videos" },
  { n: 4, title: "Johto League Champions", playlist: "PLRcHmntfmJ8A7vV0RYnAu0farLTV_T1i2", count: "52 videos" },
  { n: 5, title: "Master Quest", playlist: "PLRcHmntfmJ8BNWmL3MICuc1Oh5Mxf2qEh", thumb: "dHPTV4AHUyc", count: "64 videos" },
  { n: 6, title: "Pokémon Advanced", playlist: "PLRcHmntfmJ8AYULKvzhleQPgPRinNDpc0", count: "40 videos" },
  { n: 7, title: "Advanced Challenge", playlist: "PLRcHmntfmJ8BWeT4kzalbhx1r43bJv7pI", thumb: "99HJRv6TDvE", count: "52 videos" },
  { n: 8, title: "Advanced Battle", playlist: "PLRcHmntfmJ8BdccTC3w86qIBdUjNDfPGV", count: "52 videos" },
  { n: 9, title: "Battle Frontier", playlist: "PLRcHmntfmJ8DzeYoWwk7RsAbl2w-sg0zR", count: "33 videos" },
];

const SERIES = [
  {
    name: "Pokémon Horizonte · Staffel 1",
    level: "intermediate",
    note: "The complete first season, official and free in German from The Pokémon Company & TOGGO. Native speed, but the visual storytelling makes it strong intermediate input. Use the playlist player to binge every episode in order — the ☰ icon in the player opens the episode list.",
    playlist: { id: "PLXxoD6545cq803nkjh7d1RnBpVttwmYkt", thumb: "Lm3T9tesWaw", title: "Alle Folgen · Komplette Playlist (Offizieller Pokémon Kanal)", count: "140 videos", epMin: 21 },
    episodes: [
      { id: "Lm3T9tesWaw", title: "Folge 1 · Der Anhänger, mit dem alles anfängt! (Teil 1)", min: 21 },
      { id: "0CPfL7VO9Hg", title: "Folge 2 · Der Anhänger, mit dem alles anfängt! (Teil 2)", min: 21 },
      { id: "OZZM2-6vPzs", title: "Folge 3 · Bestimmt! Weil Felori bei mir ist!", min: 21 },
    ],
  },
  {
    name: "Pokémon Horizonte · Staffel 2 — Die Suche nach Laqua",
    level: "intermediate",
    note: "Season 2, uploaded as full episodes in German by TOGGO (Super RTL's official kids channel). New episodes appear on TOGGO's YouTube channel as they air.",
    episodes: [
      { id: "UNlAEtEqY4s", title: "Staffel 2, Folge 1 · Willkommen an der Orangen-Akademie!", min: 21 },
      { id: "DMFqP-wqbMU", title: "Staffel 2, Folge 2 · Mit Herz bei der Sache!", min: 21 },
    ],
  },
];

// Dreaming-Spanish-style 7-level roadmap (hours of input)
const ROADMAP = [
  { lvl: 1, hours: 0, name: "Starting out", desc: "You know a few words. Watch superbeginner videos." },
  { lvl: 2, hours: 50, name: "Familiar phrases", desc: "You recognize common words and simple sentences." },
  { lvl: 3, hours: 150, name: "Simple stories", desc: "You follow beginner videos comfortably." },
  { lvl: 4, hours: 300, name: "Everyday topics", desc: "Intermediate content and slow shows start to click." },
  { lvl: 5, hours: 600, name: "Native content, with help", desc: "Series like Pokémon work with visual context." },
  { lvl: 6, hours: 1000, name: "Comfortable", desc: "You understand most native speech on familiar topics." },
  { lvl: 7, hours: 1500, name: "Near-native listening", desc: "Fast speech, slang and jokes mostly make sense." },
];

const STORAGE_KEY = "dreaming-german-v1";
const THEME_KEY = "dreaming-german-theme";

function Shape({ level, size = 14, color }) {
  const c = color || LEVELS[level].color;
  const s = LEVELS[level].shape;
  const st = { width: size, height: size, display: "inline-block", flexShrink: 0 };
  if (s === "circle") return <span style={{ ...st, background: c, borderRadius: "50%" }} />;
  if (s === "triangle") return <span style={{ ...st, width: 0, height: 0, background: "none", borderLeft: `${size / 2}px solid transparent`, borderRight: `${size / 2}px solid transparent`, borderBottom: `${size}px solid ${c}` }} />;
  if (s === "square") return <span style={{ ...st, background: c }} />;
  return <span style={{ ...st, background: c, transform: "rotate(45deg) scale(0.85)" }} />;
}

function Player({ id, title, playlist, thumb }) {
  const [playing, setPlaying] = useState(false);
  const src = playlist
    ? `https://www.youtube-nocookie.com/embed/videoseries?list=${playlist}&autoplay=1&rel=0`
    : `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
  return (
    <div style={{ position: "relative", paddingTop: "56.25%", background: INK }}>
      {playing ? (
        <iframe
          src={src}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
        />
      ) : (
        <button
          onClick={() => setPlaying(true)}
          aria-label={`Play ${title}`}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0, padding: 0, cursor: "pointer", background: "none" }}
        >
          {(thumb || id) && (
            <img
              src={`https://i.ytimg.com/vi/${thumb || id}/hqdefault.jpg`}
              alt=""
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.9 }}
            />
          )}
          <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 62, height: 62, background: RED, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 0 rgba(0,0,0,0.35)" }}>
            <span style={{ width: 0, height: 0, borderTop: "12px solid transparent", borderBottom: "12px solid transparent", borderLeft: `20px solid ${PAPER}`, marginLeft: 5 }} />
          </span>
        </button>
      )}
    </div>
  );
}

export default function DreamingGerman() {
  const [tab, setTab] = useState("videos");
  const [filter, setFilter] = useState("all");
  const [state, setState] = useState({ minutes: 0, dailyGoal: 30, watched: [], watchlist: [], today: { date: "", minutes: 0 }, outsideLog: [] });
  const [loaded, setLoaded] = useState(false);
  const [outsideMin, setOutsideMin] = useState("");
  const [outsideWhat, setOutsideWhat] = useState("");
  const [toast, setToast] = useState("");
  const [dark, setDark] = useState(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved) return saved === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch (e) { return false; }
  });

  const T = dark ? THEMES.dark : THEMES.light;
  // Advanced level's ink-colored shape would vanish on a dark background
  const levelColor = (lvl) => (lvl === "advanced" ? T.ink : LEVELS[lvl].color);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    try { localStorage.setItem(THEME_KEY, next ? "dark" : "light"); } catch (e) { /* private mode */ }
  };

  useEffect(() => {
    document.body.style.background = T.bg;
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
  }, [dark, T.bg]);

  const todayStr = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    try {
      const r = localStorage.getItem(STORAGE_KEY);
      if (r) {
        const s = JSON.parse(r);
        if (s.today?.date !== todayStr) s.today = { date: todayStr, minutes: 0 };
        setState((p) => ({ ...p, ...s }));
      }
    } catch (e) { /* first visit — nothing saved yet */ }
    setLoaded(true);
  }, []);

  const save = (next) => {
    setState(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch (e) { console.error("save failed", e); }
  };

  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const addMinutes = (min, note) => {
    const t = state.today.date === todayStr ? state.today.minutes : 0;
    save({ ...state, minutes: state.minutes + min, today: { date: todayStr, minutes: t + min } });
    flash(`+${min} min logged${note ? " · " + note : ""}`);
  };

  const markWatched = (v) => {
    if (state.watched.includes(v.id)) return;
    const t = state.today.date === todayStr ? state.today.minutes : 0;
    save({ ...state, watched: [...state.watched, v.id], minutes: state.minutes + v.min, today: { date: todayStr, minutes: t + v.min } });
    flash(`+${v.min} min · marked as watched`);
  };

  const toggleList = (id) => {
    const inList = state.watchlist.includes(id);
    save({ ...state, watchlist: inList ? state.watchlist.filter((x) => x !== id) : [...state.watchlist, id] });
  };

  const hours = state.minutes / 60;
  const current = [...ROADMAP].reverse().find((r) => hours >= r.hours) || ROADMAP[0];
  const next = ROADMAP.find((r) => r.hours > hours);
  const pctToNext = next ? Math.min(100, ((hours - current.hours) / (next.hours - current.hours)) * 100) : 100;
  const goalPct = Math.min(100, (state.today.minutes / state.dailyGoal) * 100);

  const shown = useMemo(() => {
    let list = VIDEOS;
    if (filter === "watchlist") list = VIDEOS.filter((v) => state.watchlist.includes(v.id));
    else if (filter !== "all") list = VIDEOS.filter((v) => v.level === filter);
    return list;
  }, [filter, state.watchlist]);

  const display = { fontFamily: "Futura, 'Century Gothic', 'Trebuchet MS', 'Avenir Next', sans-serif" };
  const chip = (active, color) => ({
    ...display, display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 14px",
    border: `2px solid ${T.ink}`, background: active ? T.ink : T.bg, color: active ? T.bg : T.ink,
    fontWeight: 700, fontSize: 13, letterSpacing: "0.04em", textTransform: "uppercase", cursor: "pointer",
    boxShadow: active ? `4px 4px 0 ${color || YELLOW}` : "none",
  });

  const Card = ({ v, watched }) => (
    <div style={{ border: `2px solid ${T.ink}`, background: T.card, boxShadow: `6px 6px 0 ${levelColor(v.level)}` }}>
      <Player id={v.id} title={v.title} />
      <div style={{ padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <Shape level={v.level} color={levelColor(v.level)} />
          <span style={{ ...display, fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>{LEVELS[v.level].label}</span>
          <span style={{ marginLeft: "auto", fontSize: 12, opacity: 0.6 }}>{v.min} min</span>
        </div>
        <h3 style={{ ...display, fontSize: 18, fontWeight: 800, margin: "0 0 4px", lineHeight: 1.2 }}>{v.title}</h3>
        <p style={{ fontSize: 13, margin: "0 0 4px", fontWeight: 600, color: T.blue }}>{v.channel}</p>
        <p style={{ fontSize: 13, margin: "0 0 14px", lineHeight: 1.5, opacity: 0.8 }}>{v.desc}</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={() => markWatched(v)} disabled={watched}
            style={{ ...display, padding: "8px 12px", border: `2px solid ${T.ink}`, background: watched ? T.green : T.bg, color: watched ? "#fff" : T.ink, fontWeight: 700, fontSize: 12, cursor: watched ? "default" : "pointer", textTransform: "uppercase", letterSpacing: "0.04em" }}>
            {watched ? "✓ Watched" : `Watched · log ${v.min} min`}
          </button>
          <button onClick={() => toggleList(v.id)}
            style={{ ...display, padding: "8px 12px", border: `2px solid ${T.ink}`, background: state.watchlist.includes(v.id) ? YELLOW : T.bg, color: state.watchlist.includes(v.id) ? INK : T.ink, fontWeight: 700, fontSize: 12, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.04em" }}>
            {state.watchlist.includes(v.id) ? "★ Saved" : "☆ Watch later"}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.ink, fontFamily: "'Avenir Next', 'Segoe UI', system-ui, sans-serif" }}>
      {/* Header */}
      <header style={{ borderBottom: `3px solid ${T.ink}`, padding: "20px 16px 0", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 6, alignItems: "flex-end" }}>
            <span style={{ width: 22, height: 22, background: YELLOW, borderRadius: "50%" }} />
            <span style={{ width: 0, height: 0, borderLeft: "11px solid transparent", borderRight: "11px solid transparent", borderBottom: `22px solid ${RED}` }} />
            <span style={{ width: 22, height: 22, background: BLUE }} />
          </div>
          <h1 style={{ ...display, fontSize: "clamp(26px, 6vw, 44px)", fontWeight: 900, margin: 0, letterSpacing: "-0.02em", textTransform: "uppercase" }}>
            Dreaming <span style={{ color: T.blue }}>German</span>
          </h1>
          <button onClick={toggleTheme} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} title={dark ? "Light mode" : "Dark mode"}
            style={{ ...display, marginLeft: "auto", padding: "8px 14px", border: `2px solid ${T.ink}`, background: T.bg, color: T.ink, fontWeight: 800, fontSize: 13, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.06em", boxShadow: `3px 3px 0 ${dark ? YELLOW : INK}` }}>
            {dark ? "☀ Hell" : "● Dunkel"}
          </button>
        </div>
        <p style={{ margin: "6px 0 16px", fontSize: 14, opacity: 0.75, maxWidth: 560 }}>
          Learn German the way Dreaming Spanish teaches Spanish: watch comprehensible videos at your level, rack up input hours, and let your brain do the grammar.
        </p>
        <nav style={{ display: "flex", gap: 0 }}>
          {[["videos", "Videos"], ["series", "Serien"], ["progress", "Fortschritt"]].map(([k, label]) => (
            <button key={k} onClick={() => setTab(k)}
              style={{ ...display, padding: "10px 18px", fontSize: 14, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", cursor: "pointer", border: `2px solid ${T.ink}`, borderBottom: "none", marginRight: -2, background: tab === k ? T.ink : T.card, color: tab === k ? T.bg : T.ink }}>
              {label}
            </button>
          ))}
        </nav>
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 16px 60px" }}>
        {/* Daily goal strip — always visible */}
        <div style={{ border: `2px solid ${T.ink}`, background: T.card, padding: "12px 16px", marginBottom: 24, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <span style={{ ...display, fontWeight: 800, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em" }}>Today</span>
          <div style={{ flex: 1, minWidth: 140, height: 14, border: `2px solid ${T.ink}`, background: T.bg }}>
            <div style={{ width: `${goalPct}%`, height: "100%", background: goalPct >= 100 ? T.green : YELLOW, transition: "width .4s" }} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 700 }}>{state.today.minutes} / {state.dailyGoal} min {goalPct >= 100 && "· Goal reached! 🎉"}</span>
        </div>

        {toast && (
          <div style={{ position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", background: T.ink, color: T.bg, padding: "10px 18px", fontWeight: 700, fontSize: 13, zIndex: 50, boxShadow: `4px 4px 0 ${YELLOW}` }}>{toast}</div>
        )}

        {/* ————— VIDEOS ————— */}
        {tab === "videos" && (
          <>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
              <button style={chip(filter === "all")} onClick={() => setFilter("all")}>All levels</button>
              {Object.entries(LEVELS).map(([k, l]) => (
                <button key={k} style={chip(filter === k, levelColor(k))} onClick={() => setFilter(k)}>
                  <Shape level={k} size={12} color={filter === k ? (k === "advanced" ? T.bg : l.color) : levelColor(k)} /> {l.label}
                </button>
              ))}
              <button style={chip(filter === "watchlist", YELLOW)} onClick={() => setFilter("watchlist")}>★ Watchlist</button>
            </div>
            {filter !== "all" && filter !== "watchlist" && (
              <p style={{ fontSize: 13, margin: "0 0 16px", opacity: 0.75 }}>{LEVELS[filter].blurb}</p>
            )}
            {shown.length === 0 && (
              <p style={{ fontSize: 14, opacity: 0.7 }}>Nothing saved yet — tap “Watch later” on any video to build your list.</p>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
              {shown.map((v) => <Card key={v.id} v={v} watched={state.watched.includes(v.id)} />)}
            </div>
          </>
        )}

        {/* ————— SERIES ————— */}
        {tab === "series" && (
          <section style={{ marginBottom: 44 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
              <h2 style={{ ...display, fontSize: 26, fontWeight: 900, margin: 0, textTransform: "uppercase" }}>Pokémon · Die klassischen Staffeln</h2>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, border: `2px solid ${T.ink}`, padding: "4px 10px", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", background: T.card }}>
                <Shape level="intermediate" size={11} /> {LEVELS.intermediate.label}
              </span>
            </div>
            <p style={{ fontSize: 13, opacity: 0.8, maxWidth: 640, margin: "0 0 20px", lineHeight: 1.5 }}>
              All nine classic seasons, official and free from the Pokémon TV channel. The uploads carry multiple audio tracks — open the player's ⚙ settings and switch the audio track to <strong>Deutsch</strong> (available on most seasons). Ash's adventures make native-speed German followable thanks to the visual storytelling.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
              {CLASSIC_SEASONS.map((s) => (
                <div key={s.n} style={{ border: `2px solid ${T.ink}`, background: T.card, boxShadow: `6px 6px 0 ${YELLOW}` }}>
                  <Player playlist={s.playlist} thumb={s.thumb} title={`Pokémon Staffel ${s.n} · ${s.title}`} />
                  <div style={{ padding: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span style={{ ...display, fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", background: YELLOW, color: INK, padding: "3px 8px", border: `2px solid ${T.ink}` }}>Staffel {s.n}</span>
                      <span style={{ fontSize: 12, opacity: 0.6 }}>{s.count}</span>
                    </div>
                    <h3 style={{ ...display, fontSize: 17, fontWeight: 800, margin: "0 0 12px", lineHeight: 1.25 }}>{s.title}</h3>
                    <button onClick={() => addMinutes(21, `Pokémon Staffel ${s.n}`)}
                      style={{ ...display, padding: "8px 12px", border: `2px solid ${T.ink}`, background: T.bg, color: T.ink, fontWeight: 700, fontSize: 12, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      + Log one episode (21 min)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        {tab === "series" && SERIES.map((s) => (
          <section key={s.name} style={{ marginBottom: 44 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
              <h2 style={{ ...display, fontSize: 26, fontWeight: 900, margin: 0, textTransform: "uppercase" }}>{s.name}</h2>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, border: `2px solid ${T.ink}`, padding: "4px 10px", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", background: T.card }}>
                <Shape level={s.level} size={11} color={levelColor(s.level)} /> {LEVELS[s.level].label}
              </span>
            </div>
            <p style={{ fontSize: 13, opacity: 0.8, maxWidth: 640, margin: "0 0 20px", lineHeight: 1.5 }}>{s.note}</p>
            {s.playlist && (
              <div style={{ border: `3px solid ${T.ink}`, background: T.card, boxShadow: `8px 8px 0 ${RED}`, marginBottom: 24, maxWidth: 720 }}>
                <Player playlist={s.playlist.id} thumb={s.playlist.thumb} title={s.playlist.title} />
                <div style={{ padding: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ ...display, fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", background: YELLOW, color: INK, padding: "3px 8px", border: `2px solid ${T.ink}` }}>Ganze Staffel</span>
                    <span style={{ fontSize: 12, opacity: 0.6 }}>{s.playlist.count}</span>
                  </div>
                  <h3 style={{ ...display, fontSize: 18, fontWeight: 800, margin: "0 0 12px", lineHeight: 1.25 }}>{s.playlist.title}</h3>
                  <button onClick={() => addMinutes(s.playlist.epMin, "Pokémon episode")}
                    style={{ ...display, padding: "8px 12px", border: `2px solid ${T.ink}`, background: T.bg, color: T.ink, fontWeight: 700, fontSize: 12, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    + Log one episode ({s.playlist.epMin} min)
                  </button>
                  <p style={{ fontSize: 11, opacity: 0.55, margin: "8px 0 0" }}>Tap once per episode you finish — you can log as many as you watch.</p>
                </div>
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
              {s.episodes.map((e) => (
                <div key={e.id} style={{ border: `2px solid ${T.ink}`, background: T.card, boxShadow: `6px 6px 0 ${BLUE}` }}>
                  <Player id={e.id} title={e.title} />
                  <div style={{ padding: 16 }}>
                    <h3 style={{ ...display, fontSize: 16, fontWeight: 800, margin: "0 0 10px", lineHeight: 1.3 }}>{e.title}</h3>
                    <button onClick={() => markWatched({ id: e.id, min: e.min })} disabled={state.watched.includes(e.id)}
                      style={{ ...display, padding: "8px 12px", border: `2px solid ${T.ink}`, background: state.watched.includes(e.id) ? T.green : T.bg, color: state.watched.includes(e.id) ? "#fff" : T.ink, fontWeight: 700, fontSize: 12, cursor: state.watched.includes(e.id) ? "default" : "pointer", textTransform: "uppercase" }}>
                      {state.watched.includes(e.id) ? "✓ Watched" : `Watched · log ${e.min} min`}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* ————— PROGRESS ————— */}
        {tab === "progress" && (
          <div style={{ maxWidth: 720 }}>
            <div style={{ border: `2px solid ${T.ink}`, background: T.card, padding: 20, boxShadow: `8px 8px 0 ${YELLOW}`, marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
                <span style={{ ...display, fontSize: 56, fontWeight: 900, lineHeight: 1 }}>{hours.toFixed(1)}</span>
                <span style={{ ...display, fontSize: 16, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em" }}>hours of German input</span>
              </div>
              <p style={{ margin: "10px 0 6px", fontWeight: 700 }}>Level {current.lvl} · {current.name}</p>
              <p style={{ margin: "0 0 12px", fontSize: 13, opacity: 0.75 }}>{current.desc}</p>
              {next && (
                <>
                  <div style={{ height: 18, border: `2px solid ${T.ink}`, background: T.bg }}>
                    <div style={{ width: `${pctToNext}%`, height: "100%", background: T.blue, transition: "width .4s" }} />
                  </div>
                  <p style={{ fontSize: 12, margin: "6px 0 0", opacity: 0.75 }}>{(next.hours - hours).toFixed(1)} hours to Level {next.lvl} ({next.hours}h)</p>
                </>
              )}
            </div>

            {/* Daily goal + outside hours */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20, marginBottom: 28 }}>
              <div style={{ border: `2px solid ${T.ink}`, background: T.card, padding: 16 }}>
                <h3 style={{ ...display, fontSize: 14, fontWeight: 800, textTransform: "uppercase", margin: "0 0 10px" }}>Daily goal</h3>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[15, 30, 60, 120].map((g) => (
                    <button key={g} onClick={() => save({ ...state, dailyGoal: g })}
                      style={{ ...display, padding: "8px 12px", border: `2px solid ${T.ink}`, background: state.dailyGoal === g ? T.ink : T.bg, color: state.dailyGoal === g ? T.bg : T.ink, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                      {g} min
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ border: `2px solid ${T.ink}`, background: T.card, padding: 16 }}>
                <h3 style={{ ...display, fontSize: 14, fontWeight: 800, textTransform: "uppercase", margin: "0 0 10px" }}>Log outside hours</h3>
                <p style={{ fontSize: 12, opacity: 0.7, margin: "0 0 10px" }}>Watched German Netflix, a podcast, or YouTube elsewhere? It counts.</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <input type="number" min="1" placeholder="min" value={outsideMin} onChange={(e) => setOutsideMin(e.target.value)}
                    style={{ width: 70, padding: "8px", border: `2px solid ${T.ink}`, background: T.bg, color: T.ink, fontSize: 13, fontWeight: 700 }} />
                  <input type="text" placeholder="what did you watch?" value={outsideWhat} onChange={(e) => setOutsideWhat(e.target.value)}
                    style={{ flex: 1, minWidth: 120, padding: "8px", border: `2px solid ${T.ink}`, background: T.bg, color: T.ink, fontSize: 13 }} />
                  <button onClick={() => { const m = parseInt(outsideMin, 10); if (m > 0) { addMinutes(m, outsideWhat || "outside input"); setOutsideMin(""); setOutsideWhat(""); } }}
                    style={{ ...display, padding: "8px 14px", border: `2px solid ${T.ink}`, background: RED, color: "#fff", fontWeight: 800, fontSize: 13, cursor: "pointer", textTransform: "uppercase" }}>
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Roadmap */}
            <h3 style={{ ...display, fontSize: 18, fontWeight: 900, textTransform: "uppercase", margin: "0 0 14px" }}>The roadmap · 1,500 hours to near-native listening</h3>
            {ROADMAP.map((r) => {
              const reached = hours >= r.hours;
              return (
                <div key={r.lvl} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "12px 14px", border: `2px solid ${T.ink}`, marginBottom: -2, background: reached ? T.card : T.bg, opacity: reached ? 1 : 0.65 }}>
                  <span style={{ ...display, fontSize: 20, fontWeight: 900, width: 34, color: reached ? T.blue : T.ink }}>{r.lvl}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 800, fontSize: 14 }}>{r.name} <span style={{ fontWeight: 600, opacity: 0.6 }}>· {r.hours}h</span></p>
                    <p style={{ margin: "2px 0 0", fontSize: 13, opacity: 0.8 }}>{r.desc}</p>
                  </div>
                  {reached && <span style={{ color: T.green, fontWeight: 900, fontSize: 18 }}>✓</span>}
                </div>
              );
            })}
            <p style={{ fontSize: 12, opacity: 0.6, marginTop: 20 }}>
              Method inspired by Dreaming Spanish & Stephen Krashen's comprehensible input hypothesis. Hour thresholds mirror the Dreaming Spanish roadmap. Your progress is saved automatically on this device.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
