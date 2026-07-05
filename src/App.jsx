import { useState, useEffect, useMemo, useRef } from "react";

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
  { id: "v9C44PCDNkw", title: "A1 Story · The Tennis Match", channel: "Natürlich German", level: "superbeginner", min: 8, desc: "A very slow A1 story told with drawings and gestures for total beginners." },
  { id: "i1WRkJOQBSY", title: "5 Things I Like About Germany", channel: "Natürlich German", level: "superbeginner", min: 8, desc: "Five things the host loves about Germany, in slow German with visual support." },
  { id: "a_Tp7qTa5Jk", title: "Things We Find Creepy", channel: "Natürlich German", level: "superbeginner", min: 8, desc: "Total-beginner episode about creepy things, with pictures, gestures and simple German." },
  { id: "lwc1_Dukv_o", title: "Comprehensible Input A1 · mit Untertiteln", channel: "Chill German", level: "superbeginner", min: 12, desc: "Slow A1 comprehensible input with English and German subtitles for near-zero beginners." },
  { id: "huwi-cjPPXU", title: "Introduce Yourself in Slow German", channel: "Super Easy German", level: "superbeginner", min: 12, desc: "People introduce themselves in very slow German with dual subtitles." },
  { id: "18CBczwqARs", title: "A Day in my Life in Slow German", channel: "Super Easy German", level: "superbeginner", min: 10, desc: "A host narrates her daily routine in very slow German with on-screen visuals." },
  // Beginner
  { id: "r94aqLUO0wo", title: "Sich vorstellen", channel: "Super Easy German", level: "beginner", min: 5, desc: "The first Super Easy German episode: introductions on the street, slowly." },
  { id: "Ep3zb15gnUM", title: "Comprehensible Input A1–A2", channel: "Chill German", level: "beginner", min: 15, desc: "Relaxed beginner German with German subtitles throughout." },
  { id: "4-eDoThe6qo", title: "Nicos Weg — Der Film (A1)", channel: "DW Deutsch lernen", level: "beginner", min: 90, desc: "A feature-length learner film from Deutsche Welle: Nico arrives in Germany with no German. Subtitles available." },
  { id: "meChQ0YaqPQ", title: "Peppa Wutz · Schwimmen mit Schorsch (ganze Folge)", channel: "Peppa Pig Deutsch", level: "beginner", min: 25, desc: "Kids' cartoon with simple sentences and total visual support — classic easy input." },
  { id: "LwJfk1NUeg4", title: "10 Min Conversation in Slow German", channel: "Super Easy German", level: "beginner", min: 11, desc: "An everyday conversation spoken in deliberately slow German with subtitles." },
  { id: "hhuNW1COrSM", title: "14 Min. Conversation in Slow German", channel: "Super Easy German", level: "beginner", min: 15, desc: "A longer slow-German conversation with subtitles for beginner listening practice." },
  { id: "kYEBu6dG2MM", title: "A Day in our Office in Slow German", channel: "Super Easy German", level: "beginner", min: 10, desc: "A slow-German office tour showing the Easy German team's workday." },
  { id: "eKLtI48rvtw", title: "Top 50 Everyday Objects in Slow German", channel: "Super Easy German", level: "beginner", min: 13, desc: "Fifty common household objects named and described in slow, subtitled German." },
  { id: "qYtsk5yH_nw", title: "Our Lunch Break in Slow German", channel: "Super Easy German", level: "beginner", min: 12, desc: "The team films their lunch break while speaking slow, simple German about food." },
  { id: "foW3fVWaxm4", title: "Slow & Easy Listening Practice (A1)", channel: "Chill German", level: "beginner", min: 12, desc: "Slow A1 German listening practice with subtitles, filmed as visual comprehensible input." },
  { id: "hSdSsFSPtN0", title: "Beginner Vlog · Learn German Naturally", channel: "Chill German", level: "beginner", min: 10, desc: "A real-life vlog in slow A1 German — acquire German from visual context, Dreaming-Spanish style." },
  { id: "OZE7_hMNKqw", title: "Super Easy Listening Practice (A1)", channel: "Chill German", level: "beginner", min: 12, desc: "Super easy A1 listening practice with English subtitles for absolute beginners." },
  { id: "dC6ZGLzdaTs", title: "Nicos Weg · Folge 1: Hallo!", channel: "DW Deutsch lernen", level: "beginner", min: 3, desc: "The first bite-sized episode of DW's A1 story series — Nico lands in Germany." },
  { id: "upvuC9FR-xU", title: "Nicos Weg · Folge 2: Kein Problem!", channel: "DW Deutsch lernen", level: "beginner", min: 3, desc: "A short scripted scene using very simple everyday German." },
  { id: "_7L8pEFJGB4", title: "Peppa Wutz · Amerikanisches Frühstück (Folgen-Mix)", channel: "Peppa Pig Deutsch", level: "beginner", min: 60, desc: "Official German Peppa Pig full-episode compilation — simple, clearly spoken dialogue." },
  { id: "sQLE6r_9L-I", title: "Wichtige Dialoge für Anfänger (A1)", channel: "Hallo Deutschschule", level: "beginner", min: 30, desc: "Simple everyday dialogues spoken slowly with on-screen vocabulary support." },
  { id: "kNDFYgvvHjI", title: "Dialoge A2 · Deutsch lernen durch Hören", channel: "Deutsch lernen durch Hören", level: "beginner", min: 60, desc: "A long compilation of slow A2 everyday dialogues with subtitles." },
  // Intermediate
  { id: "cGQZ8lTHn1M", title: "Was macht dich sympathisch? (Straßeninterview)", channel: "Easy German", level: "intermediate", min: 12, desc: "Real Berliners answer at natural speed — dual German/English subtitles help you follow." },
  { id: "Lfoai_nP7lc", title: "Wie wichtig ist dir Geld? (Straßeninterview)", channel: "Easy German", level: "intermediate", min: 12, desc: "Street interviews about money — authentic everyday German with subtitles." },
  { id: "3iV2WK1-IV8", title: "Learn German with Street Interviews (Dresden)", channel: "Easy German", level: "intermediate", min: 12, desc: "Street interviews from Dresden — everyday spoken German with dual subtitles." },
  { id: "kRq3WzSwUw0", title: "Street Interviews in Magdeburg", channel: "Easy German", level: "intermediate", min: 10, desc: "Passers-by in Magdeburg at natural speed with dual German/English subtitles." },
  { id: "Q7UcjxyjFO8", title: "Wie habt ihr euch kennengelernt? (Paare in Berlin)", channel: "Easy German", level: "intermediate", min: 10, desc: "Berlin couples tell the story of how they met, with dual subtitles." },
  { id: "yyJ-dhmff-o", title: "Beschreibe dein Aussehen (Straßeninterview)", channel: "Easy German", level: "intermediate", min: 9, desc: "Berliners describe their own appearance — great vocabulary for physical descriptions." },
  { id: "8kX2jsUnZck", title: "Trip to West Berlin in Slow German", channel: "Super Easy German", level: "intermediate", min: 11, desc: "A slower-paced subtitled walking tour through West Berlin — lower-intermediate friendly." },
  { id: "Lg5P2w_Ro1c", title: "Nicos Weg — Der Film (A2)", channel: "DW Deutsch lernen", level: "intermediate", min: 90, desc: "The A2 sequel film: everyday life in Germany in clear, natural German with subtitles." },
  { id: "LkufozluseI", title: "Nicos Weg — Der Film (B1)", channel: "DW Deutsch lernen", level: "intermediate", min: 90, desc: "The B1 finale: faster, longer conversations — a bridge toward native content." },
  { id: "A5xmAlPXBBM", title: "Jojo sucht das Glück · Staffel 1, Folge 1 (B1/B2)", channel: "DW Deutsch lernen", level: "intermediate", min: 3, desc: "DW's telenovela for learners: Brazilian student Jojo arrives in Cologne." },
  { id: "23rU7Gm_5d8", title: "Wie heizt man heute? · Sachgeschichte", channel: "Die Maus (WDR)", level: "intermediate", min: 8, desc: "Germany's beloved kids' show explains things clearly — spoken plainly with strong visuals." },
  { id: "GE6MmgLXX8w", title: "Wie erntet man Pinienkerne? · Sachgeschichte", channel: "Die Maus (WDR)", level: "intermediate", min: 7, desc: "Step by step how pine nuts are harvested — highly visual narration." },
  { id: "_qO1P-hju6k", title: "Der Mauerfall-Check", channel: "Checker Tobi (BR)", level: "intermediate", min: 25, desc: "Full kids' documentary: Tobi explains the fall of the Berlin Wall with strong visual support." },
  { id: "BOSTMpXuies", title: "Der Bahnhofs-Check", channel: "Checker Tobi (BR)", level: "intermediate", min: 25, desc: "How a big train station works — clear, visually supported German reportage." },
  { id: "3t35dISKHhY", title: "Der Gehirn-Check", channel: "Checker Tobi (BR)", level: "intermediate", min: 25, desc: "How the human brain works, explained for kids in clear natural German." },
  { id: "hEXYJJAxIvU", title: "Die deutsche Sprache in der Welt · Karambolage", channel: "ARTE", level: "intermediate", min: 4, desc: "Short animated segment about where German is spoken around the world." },
  { id: "eNwb0LbftVc", title: "Das Westpaket · Karambolage", channel: "ARTE", level: "intermediate", min: 4, desc: "Animated short about care packages sent from West to East Germany during the division." },
  { id: "3ECAYBJoqlU", title: "Der größte Mensch Deutschlands", channel: "Galileo", level: "intermediate", min: 12, desc: "Short documentary following the everyday life of Germany's tallest man, in clear natural German." },
  // Advanced
  { id: "3z0gnXgK8Do", title: "Corona geht gerade erst los", channel: "maiLab", level: "advanced", min: 20, desc: "Germany's most-watched YouTube video of 2020 — dense, fast science journalism by Mai Thi Nguyen-Kim." },
  { id: "VaiwC1icfEY", title: "Wir müssen reden.", channel: "maiLab", level: "advanced", min: 31, desc: "In-depth essay on free speech, the tolerance paradox and online discourse." },
  { id: "VOYuMywDnXI", title: "Können Schwarze Löcher das Universum löschen?", channel: "Dinge Erklärt – Kurzgesagt", level: "advanced", min: 8, desc: "Science at native speed — the information paradox, beautifully animated." },
  { id: "LeX1ALuxcwI", title: "Das Schwarze Loch, das Galaxien killt", channel: "Dinge Erklärt – Kurzgesagt", level: "advanced", min: 10, desc: "Quasars explained in fast, technical, native German." },
  { id: "EzXKlg0EmN8", title: "Kann man ein Schwarzes Loch zerstören?", channel: "Dinge Erklärt – Kurzgesagt", level: "advanced", min: 9, desc: "Advanced vocabulary, native narration speed, German subtitles available." },
  { id: "ICuT4TqEHsE", title: "Krasser als Schwarze Löcher: Gravasterne", channel: "Dinge Erklärt – Kurzgesagt", level: "advanced", min: 11, desc: "Animated explainer on gravastars, a hypothetical alternative to black holes." },
  { id: "r0Af_AT31tc", title: "Was bist du?", channel: "Dinge Erklärt – Kurzgesagt", level: "advanced", min: 12, desc: "Philosophical biology: are you your body? Cells, emergence and identity." },
  { id: "WaHs0mzd5N0", title: "Hier endet das Universum", channel: "Terra X Lesch & Co", level: "advanced", min: 16, desc: "Harald Lesch on whether the universe has an edge — natural lecture-speed German." },
  { id: "Kpvd4QdetOs", title: "Die unfaire Wahrheit hinter der Erderwärmung", channel: "Terra X Lesch & Co", level: "advanced", min: 17, desc: "Who causes emissions and who bears the consequences — argumentative native German." },
  { id: "GlOWIeJk5tA", title: "So wird die Milchstraße sterben", channel: "Terra X Lesch & Co", level: "advanced", min: 15, desc: "The past and eventual death of the Milky Way, traced with current models." },
  { id: "cC1H4aQhvjk", title: "Deutschland 2084: Wetterchaos, Krankheiten & Dürren", channel: "Quarks", level: "advanced", min: 45, desc: "Long-form science feature on how climate change will reshape everyday life in Germany." },
  { id: "Mm33uQBo8G0", title: "Warum junge Deutsche freiwillig im Ukraine-Krieg kämpfen", channel: "Y-Kollektiv", level: "advanced", min: 40, desc: "Documentary reportage with unscripted native-speed interviews." },
  { id: "Y-4-KCIxYZU", title: "Kokainflut im Hamburger Hafen", channel: "Y-Kollektiv", level: "advanced", min: 35, desc: "Investigative reportage on the cocaine trade through the Port of Hamburg." },
  { id: "_dAtdSVeiLM", title: "Werden wir immer dümmer? · 42", channel: "ARTE", level: "advanced", min: 26, desc: "Science documentary on the stalled Flynn effect and whether digitalization lowers IQ." },
  { id: "MG9IVDRBCx0", title: "Was war vor dem Urknall? · 42", channel: "ARTE", level: "advanced", min: 26, desc: "What, if anything, preceded the Big Bang — cosmology at native documentary pace." },
  { id: "QSVQR_7fAFQ", title: "Die gefährlichsten Hacker der Welt", channel: "Simplicissimus", level: "advanced", min: 40, desc: "Fast-paced investigative video essay on state-linked hacker groups and cyberwarfare." },
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
    note: "The complete first season, official and free in German from The Pokémon Company & TOGGO. Native speed, but the visual storytelling makes it strong intermediate input.",
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
const PROGRESS_KEY = "dreaming-german-progress-v1";
const PLAYLIST_CACHE_KEY = "dreaming-german-playlists-v1";
const TITLE_CACHE_KEY = "dreaming-german-titles-v1";

// ————— YouTube IFrame API —————
let ytApiPromise = null;
function loadYT() {
  if (!ytApiPromise) {
    ytApiPromise = new Promise((resolve) => {
      if (window.YT && window.YT.Player) return resolve(window.YT);
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => { if (prev) prev(); resolve(window.YT); };
      const s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(s);
    });
  }
  return ytApiPromise;
}

// ————— Watch-position store: { videos: {id: {t, d}}, lists: {listId: {index, videoId}} } —————
function readProgress() {
  try {
    const p = JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {};
    return { videos: p.videos || {}, lists: p.lists || {} };
  } catch (e) { return { videos: {}, lists: {} }; }
}
function writeVideoProgress(videoId, t, d, listId, listIndex) {
  try {
    const p = readProgress();
    p.videos[videoId] = { t: Math.floor(t), d: Math.floor(d) };
    if (listId) p.lists[listId] = { index: listIndex || 0, videoId };
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
  } catch (e) { /* storage full or private mode */ }
}

// Fetch the video ids of a playlist by cueing it in a hidden IFrame API player.
async function fetchPlaylistIds(listId) {
  try {
    const cache = JSON.parse(localStorage.getItem(PLAYLIST_CACHE_KEY)) || {};
    const hit = cache[listId];
    if (hit && hit.ids && hit.ids.length && Date.now() - hit.at < 86400000) return hit.ids;
  } catch (e) { /* ignore bad cache */ }
  const YT = await loadYT();
  return new Promise((resolve, reject) => {
    const div = document.createElement("div");
    div.style.cssText = "position:fixed;left:-9999px;top:0;width:2px;height:2px;";
    document.body.appendChild(div);
    let done = false, player = null, poll = null, timer = null;
    const finish = (ids) => {
      if (done) return;
      done = true;
      clearInterval(poll);
      clearTimeout(timer);
      setTimeout(() => { try { if (player) player.destroy(); } catch (e) {} div.remove(); }, 0);
      if (ids && ids.length) {
        try {
          const cache = JSON.parse(localStorage.getItem(PLAYLIST_CACHE_KEY)) || {};
          cache[listId] = { ids, at: Date.now() };
          localStorage.setItem(PLAYLIST_CACHE_KEY, JSON.stringify(cache));
        } catch (e) { /* cache is best-effort */ }
        resolve(ids);
      } else reject(new Error("playlist unavailable"));
    };
    timer = setTimeout(() => finish(null), 20000);
    player = new YT.Player(div, {
      host: "https://www.youtube-nocookie.com",
      width: 2, height: 2,
      playerVars: { listType: "playlist", list: listId },
      events: { onError: () => finish(null) },
    });
    poll = setInterval(() => {
      try {
        const ids = player.getPlaylist();
        if (ids && ids.length) finish(ids.slice());
      } catch (e) { /* not ready yet */ }
    }, 300);
  });
}

// Episode titles via noembed (CORS-friendly oEmbed proxy); cached, fails soft.
async function fetchTitle(videoId) {
  let cache = {};
  try { cache = JSON.parse(localStorage.getItem(TITLE_CACHE_KEY)) || {}; } catch (e) { /* ignore */ }
  if (cache[videoId]) return cache[videoId];
  try {
    const r = await fetch(`https://noembed.com/embed?url=${encodeURIComponent("https://www.youtube.com/watch?v=" + videoId)}`);
    const j = await r.json();
    if (j && j.title) {
      cache[videoId] = j.title;
      try { localStorage.setItem(TITLE_CACHE_KEY, JSON.stringify(cache)); } catch (e) { /* best-effort */ }
      return j.title;
    }
  } catch (e) { /* offline or blocked */ }
  return null;
}

const fmtTime = (s) => {
  const m = Math.floor(s / 60), sec = Math.floor(s % 60);
  const h = Math.floor(m / 60);
  return h ? `${h}:${String(m % 60).padStart(2, "0")}:${String(sec).padStart(2, "0")}` : `${m}:${String(sec).padStart(2, "0")}`;
};

function Shape({ level, size = 14, color }) {
  const c = color || LEVELS[level].color;
  const s = LEVELS[level].shape;
  const st = { width: size, height: size, display: "inline-block", flexShrink: 0 };
  if (s === "circle") return <span style={{ ...st, background: c, borderRadius: "50%" }} />;
  if (s === "triangle") return <span style={{ ...st, width: 0, height: 0, background: "none", borderLeft: `${size / 2}px solid transparent`, borderRight: `${size / 2}px solid transparent`, borderBottom: `${size}px solid ${c}` }} />;
  if (s === "square") return <span style={{ ...st, background: c }} />;
  return <span style={{ ...st, background: c, transform: "rotate(45deg) scale(0.85)" }} />;
}

// IFrame-API-backed player: saves the watch position every few seconds,
// resumes where you left off, and reports finished videos.
function ApiPlayer({ videoId, playlistId, index, onEnded }) {
  const holder = useRef(null);
  const endedRef = useRef(onEnded);
  endedRef.current = onEnded;

  useEffect(() => {
    let player = null, interval = null, destroyed = false;
    let lastVid = null, resumedFor = null;

    const currentId = () => {
      try { return (player.getVideoData() || {}).video_id || videoId || null; } catch (e) { return videoId || null; }
    };
    const saveNow = () => {
      try {
        const vid = currentId();
        const d = player.getDuration();
        if (vid && d > 0) {
          let li = 0;
          try { li = Math.max(0, player.getPlaylistIndex()); } catch (e) { /* no playlist */ }
          writeVideoProgress(vid, player.getCurrentTime(), d, playlistId, li);
        }
      } catch (e) { /* player mid-teardown */ }
    };
    const maybeFinish = (vid) => {
      const p = readProgress().videos[vid];
      if (p && p.d > 60 && p.t >= p.d * 0.9 && endedRef.current) endedRef.current(vid, Math.round(p.d / 60));
    };

    // Build the iframe ourselves so fullscreen permissions are guaranteed
    // (API-constructed iframes can miss allowfullscreen) and the video plays
    // even if the API script is blocked; the API attaches via enablejsapi
    // afterwards for progress tracking and control.
    const params = new URLSearchParams({
      autoplay: "1", rel: "0", playsinline: "1", fs: "1",
      // German player UI, German captions on by default; hl also steers
      // YouTube's default caption/audio pick on multi-language uploads
      hl: "de", cc_lang_pref: "de", cc_load_policy: "1",
      enablejsapi: "1", origin: window.location.origin,
    });
    if (playlistId) {
      params.set("listType", "playlist");
      params.set("list", playlistId);
      params.set("index", String(index || 0));
    }
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube-nocookie.com/embed/${playlistId ? "videoseries" : videoId}?${params}`;
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen";
    iframe.allowFullscreen = true;
    iframe.style.cssText = "position:absolute;inset:0;width:100%;height:100%;border:0;";
    holder.current.appendChild(iframe);

    loadYT().then((YT) => {
      if (destroyed) return;
      player = new YT.Player(iframe, {
        events: {
          onStateChange: (e) => {
            const vid = currentId();
            if (vid && vid !== lastVid) {
              if (lastVid) maybeFinish(lastVid); // playlist auto-advanced past a finished episode
              lastVid = vid;
            }
            if (e.data === 1 && vid && resumedFor !== vid) {
              resumedFor = vid;
              // prefer the German caption track when the upload has one
              try { player.setOption("captions", "track", { languageCode: "de" }); } catch (err) { /* module not loaded */ }
              const p = readProgress().videos[vid];
              if (p && p.t > 20 && p.d > 0 && p.t < p.d - 20) {
                try { player.seekTo(p.t, true); } catch (err) { /* ignore */ }
              }
            }
            if (e.data === 2) saveNow(); // paused
            if (e.data === 0) {          // ended
              try {
                const d = player.getDuration();
                if (vid && d > 0) writeVideoProgress(vid, d, d, playlistId, 0);
              } catch (err) { /* ignore */ }
              if (vid) maybeFinish(vid);
            }
          },
        },
      });
      interval = setInterval(() => {
        try { if (player.getPlayerState() === 1) saveNow(); } catch (e) { /* not ready */ }
      }, 4000);
    });

    return () => {
      destroyed = true;
      clearInterval(interval);
      try { if (player) { saveNow(); player.destroy(); } } catch (e) { /* already gone */ }
    };
  }, [videoId, playlistId, index]);

  return <div ref={holder} style={{ position: "absolute", inset: 0 }} />;
}

// Thumbnail with play button and a red "already started" bar, like YouTube's.
// While playing, a ⛶ button expands the player to fill the screen in-page
// (theater mode) — unlike native fullscreen, YouTube's subtitles stay visible.
// The same element is only restyled, never remounted, so playback continues.
function PlayerFrame({ id, playlist, thumb, title, now, onPlay, onEnded }) {
  const [big, setBig] = useState(false);
  const prog = !now && id ? readProgress().videos[id] : null;
  const pct = prog && prog.d > 0 ? Math.min(100, (prog.t / prog.d) * 100) : 0;

  useEffect(() => {
    if (!big) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") setBig(false); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [big]);

  const bigNow = big && !!now;
  return (
    <div style={bigNow
      ? { position: "fixed", inset: 0, zIndex: 100, background: "#000" }
      : { position: "relative", paddingTop: "56.25%", background: INK }}>
      {now && (
        <button
          onClick={() => setBig(!bigNow)}
          aria-label={bigNow ? "Vollbild verlassen" : "Vollbild (Untertitel bleiben sichtbar)"}
          title={bigNow ? "Schließen (Esc)" : "Vollbild mit Untertiteln"}
          style={{
            position: bigNow ? "fixed" : "absolute", zIndex: 110,
            top: bigNow ? "max(12px, env(safe-area-inset-top))" : 8,
            right: bigNow ? "max(12px, env(safe-area-inset-right))" : 8,
            width: 40, height: 40, borderRadius: "50%", border: "2px solid #fff",
            background: "rgba(0,0,0,0.65)", color: "#fff", fontSize: 16, fontWeight: 900,
            cursor: "pointer", lineHeight: 1, boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
          }}>
          {bigNow ? "✕" : "⛶"}
        </button>
      )}
      {now ? (
        <ApiPlayer key={now.nonce || `${now.videoId || id || ""}-${now.index || 0}`} videoId={now.videoId || id} playlistId={playlist} index={now.index} onEnded={onEnded} />
      ) : (
        <button
          onClick={onPlay}
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
          {pct > 2 && (
            <>
              <span style={{ position: "absolute", left: 0, bottom: 0, height: 5, width: "100%", background: "rgba(255,255,255,0.3)" }} />
              <span style={{ position: "absolute", left: 0, bottom: 0, height: 5, width: `${pct}%`, background: RED }} />
              <span style={{ position: "absolute", left: 8, bottom: 12, background: "rgba(0,0,0,0.75)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 6px" }}>
                ▶ Weiter bei {fmtTime(prog.t)}
              </span>
            </>
          )}
        </button>
      )}
    </div>
  );
}

// Expandable list of every video inside a playlist.
function EpisodeList({ listId, epMin, T, display, watched, onPlay, onLog }) {
  const [ids, setIds] = useState(null);
  const [error, setError] = useState(false);
  const [titles, setTitles] = useState({});
  const [limit, setLimit] = useState(25);

  useEffect(() => {
    let alive = true;
    fetchPlaylistIds(listId)
      .then((v) => { if (alive) setIds(v); })
      .catch(() => { if (alive) setError(true); });
    return () => { alive = false; };
  }, [listId]);

  useEffect(() => {
    if (!ids) return;
    let alive = true;
    const want = ids.slice(0, limit).filter((id) => titles[id] === undefined);
    if (!want.length) return;
    // Cached titles render instantly; each network fetch fills in as it resolves.
    let cache = {};
    try { cache = JSON.parse(localStorage.getItem(TITLE_CACHE_KEY)) || {}; } catch (e) { /* ignore */ }
    const hits = want.filter((id) => cache[id]);
    if (hits.length) setTitles((prev) => ({ ...prev, ...Object.fromEntries(hits.map((id) => [id, cache[id]])) }));
    want.filter((id) => !cache[id]).forEach((id) => {
      fetchTitle(id).then((t) => { if (alive && t) setTitles((prev) => ({ ...prev, [id]: t })); });
    });
    return () => { alive = false; };
  }, [ids, limit]); // eslint-disable-line react-hooks/exhaustive-deps

  if (error) return <p style={{ fontSize: 13, opacity: 0.7, padding: "12px 16px", margin: 0 }}>Couldn't load the episode list — open the playlist on YouTube instead.</p>;
  if (!ids) return <p style={{ fontSize: 13, opacity: 0.7, padding: "12px 16px", margin: 0 }}>Loading episodes…</p>;

  const prog = readProgress().videos;
  return (
    <div style={{ borderTop: `2px solid ${T.ink}` }}>
      <div style={{ maxHeight: 420, overflowY: "auto" }}>
        {ids.slice(0, limit).map((id, i) => {
          const p = prog[id];
          const pct = p && p.d > 0 ? Math.min(100, (p.t / p.d) * 100) : 0;
          const done = watched.includes(id);
          return (
            <div key={id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderBottom: `1px solid ${T.ink}33` }}>
              <button onClick={() => onPlay(i, id)} aria-label={`Play Folge ${i + 1}`}
                style={{ position: "relative", width: 92, height: 52, flexShrink: 0, border: `1px solid ${T.ink}`, padding: 0, cursor: "pointer", background: INK, overflow: "hidden" }}>
                <img src={`https://i.ytimg.com/vi/${id}/mqdefault.jpg`} alt="" loading="lazy"
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                {pct > 2 && <span style={{ position: "absolute", left: 0, bottom: 0, height: 3, width: `${pct}%`, background: RED }} />}
              </button>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                  <span style={{ opacity: 0.55, fontWeight: 800 }}>{i + 1} · </span>
                  {titles[id] || `Folge ${i + 1}`}
                </p>
                {pct > 2 && <p style={{ margin: "2px 0 0", fontSize: 11, opacity: 0.6 }}>{done ? "✓ watched · " : ""}▶ {fmtTime(p.t)} / {fmtTime(p.d)}</p>}
                {pct <= 2 && done && <p style={{ margin: "2px 0 0", fontSize: 11, color: T.green, fontWeight: 700 }}>✓ watched</p>}
              </div>
              <button onClick={() => onLog(id)} disabled={done} title={done ? "Already logged" : `Log ${epMin} min`}
                style={{ ...display, flexShrink: 0, padding: "6px 10px", border: `2px solid ${T.ink}`, background: done ? T.green : T.bg, color: done ? "#fff" : T.ink, fontWeight: 800, fontSize: 12, cursor: done ? "default" : "pointer" }}>
                ✓
              </button>
            </div>
          );
        })}
      </div>
      {limit < ids.length && (
        <button onClick={() => setLimit(limit + 25)}
          style={{ ...display, width: "100%", padding: "10px", border: 0, borderTop: `2px solid ${T.ink}`, background: T.bg, color: T.ink, fontWeight: 800, fontSize: 12, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Mehr anzeigen ({ids.length - limit} weitere)
        </button>
      )}
    </div>
  );
}

// A playlist card (classic seasons + Horizonte): player, episode browser, log button.
function PlaylistCard({ title, badge, count, playlist, thumb, epMin, borderPx = 2, shadow, T, display, watched, addMinutes, markWatched }) {
  const [now, setNow] = useState(null);
  const [open, setOpen] = useState(false);
  const resume = readProgress().lists[playlist];
  return (
    <div style={{ border: `${borderPx}px solid ${T.ink}`, background: T.card, boxShadow: shadow }}>
      <PlayerFrame
        playlist={playlist}
        thumb={thumb || (resume && resume.videoId)}
        id={resume && resume.videoId}
        title={title}
        now={now}
        onPlay={() => setNow({ index: resume ? resume.index : 0, videoId: resume && resume.videoId, nonce: Date.now() })}
        onEnded={(vid, min) => markWatched({ id: vid, min })}
      />
      <div style={{ padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
          <span style={{ ...display, fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", background: YELLOW, color: INK, padding: "3px 8px", border: `2px solid ${T.ink}` }}>{badge}</span>
          <span style={{ fontSize: 12, opacity: 0.6 }}>{count}</span>
        </div>
        <h3 style={{ ...display, fontSize: 17, fontWeight: 800, margin: "0 0 12px", lineHeight: 1.25 }}>{title}</h3>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={() => setOpen(!open)}
            style={{ ...display, padding: "8px 12px", border: `2px solid ${T.ink}`, background: open ? T.ink : T.bg, color: open ? T.bg : T.ink, fontWeight: 700, fontSize: 12, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.04em" }}>
            ☰ {open ? "Folgen ausblenden" : "Alle Folgen"}
          </button>
          <button onClick={() => addMinutes(epMin, title)}
            style={{ ...display, padding: "8px 12px", border: `2px solid ${T.ink}`, background: T.bg, color: T.ink, fontWeight: 700, fontSize: 12, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.04em" }}>
            + Log {epMin} min
          </button>
        </div>
      </div>
      {open && (
        <EpisodeList
          listId={playlist} epMin={epMin} T={T} display={display} watched={watched}
          onPlay={(index, videoId) => setNow({ index, videoId, nonce: Date.now() })}
          onLog={(id) => markWatched({ id, min: epMin })}
        />
      )}
    </div>
  );
}

// A single-video card with watch-position resume and auto-log on finish.
function VideoCard({ v, watched, inList, T, display, levelColor, markWatched, toggleList }) {
  const [now, setNow] = useState(null);
  return (
    <div style={{ border: `2px solid ${T.ink}`, background: T.card, boxShadow: `6px 6px 0 ${levelColor(v.level)}` }}>
      <PlayerFrame id={v.id} title={v.title} now={now} onPlay={() => setNow({ nonce: Date.now() })} onEnded={() => markWatched(v)} />
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
            style={{ ...display, padding: "8px 12px", border: `2px solid ${T.ink}`, background: inList ? YELLOW : T.bg, color: inList ? INK : T.ink, fontWeight: 700, fontSize: 12, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.04em" }}>
            {inList ? "★ Saved" : "☆ Watch later"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Compact card for hand-picked episodes (Horizonte highlights).
function EpisodeCard({ e, watched, T, display, markWatched, shadow }) {
  const [now, setNow] = useState(null);
  return (
    <div style={{ border: `2px solid ${T.ink}`, background: T.card, boxShadow: shadow }}>
      <PlayerFrame id={e.id} title={e.title} now={now} onPlay={() => setNow({ nonce: Date.now() })} onEnded={() => markWatched({ id: e.id, min: e.min })} />
      <div style={{ padding: 16 }}>
        <h3 style={{ ...display, fontSize: 16, fontWeight: 800, margin: "0 0 10px", lineHeight: 1.3 }}>{e.title}</h3>
        <button onClick={() => markWatched({ id: e.id, min: e.min })} disabled={watched}
          style={{ ...display, padding: "8px 12px", border: `2px solid ${T.ink}`, background: watched ? T.green : T.bg, color: watched ? "#fff" : T.ink, fontWeight: 700, fontSize: 12, cursor: watched ? "default" : "pointer", textTransform: "uppercase" }}>
          {watched ? "✓ Watched" : `Watched · log ${e.min} min`}
        </button>
      </div>
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist whatever the latest state is (player callbacks update it asynchronously).
  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { console.error("save failed", e); }
  }, [state, loaded]);

  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const addMinutes = (min, note) => {
    setState((prev) => {
      const t = prev.today.date === todayStr ? prev.today.minutes : 0;
      return { ...prev, minutes: prev.minutes + min, today: { date: todayStr, minutes: t + min } };
    });
    flash(`+${min} min logged${note ? " · " + note : ""}`);
  };

  const markWatched = (v) => {
    setState((prev) => {
      if (prev.watched.includes(v.id)) return prev;
      const t = prev.today.date === todayStr ? prev.today.minutes : 0;
      // flash from inside the updater would double-fire in StrictMode; safe here as plain reads
      setTimeout(() => flash(`+${v.min} min · marked as watched`), 0);
      return { ...prev, watched: [...prev.watched, v.id], minutes: prev.minutes + v.min, today: { date: todayStr, minutes: t + v.min } };
    });
  };

  const toggleList = (id) => {
    setState((prev) => ({
      ...prev,
      watchlist: prev.watchlist.includes(id) ? prev.watchlist.filter((x) => x !== id) : [...prev.watchlist, id],
    }));
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
              {shown.map((v) => (
                <VideoCard key={v.id} v={v} watched={state.watched.includes(v.id)} inList={state.watchlist.includes(v.id)}
                  T={T} display={display} levelColor={levelColor} markWatched={markWatched} toggleList={toggleList} />
              ))}
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
              All nine classic seasons, official and free from the Pokémon TV channel. The player is set to German — subtitles default to <strong>Deutsch</strong> automatically. The uploads also carry a German audio dub on most seasons: if an episode starts in English, switch once via the player's ⚙ → Audiotrack → <strong>Deutsch</strong> (YouTube remembers your choice). Tap <strong>☰ Alle Folgen</strong> to browse every episode; your spot in each video is saved automatically.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
              {CLASSIC_SEASONS.map((s) => (
                <PlaylistCard key={s.n} title={s.title} badge={`Staffel ${s.n}`} count={s.count} playlist={s.playlist} thumb={s.thumb}
                  epMin={21} shadow={`6px 6px 0 ${YELLOW}`} T={T} display={display} watched={state.watched}
                  addMinutes={addMinutes} markWatched={markWatched} />
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
              <div style={{ marginBottom: 24, maxWidth: 720 }}>
                <PlaylistCard title={s.playlist.title} badge="Ganze Staffel" count={s.playlist.count} playlist={s.playlist.id} thumb={s.playlist.thumb}
                  epMin={s.playlist.epMin} borderPx={3} shadow={`8px 8px 0 ${RED}`} T={T} display={display} watched={state.watched}
                  addMinutes={addMinutes} markWatched={markWatched} />
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
              {s.episodes.map((e) => (
                <EpisodeCard key={e.id} e={e} watched={state.watched.includes(e.id)} T={T} display={display}
                  markWatched={markWatched} shadow={`6px 6px 0 ${BLUE}`} />
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
                    <button key={g} onClick={() => setState((prev) => ({ ...prev, dailyGoal: g }))}
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
