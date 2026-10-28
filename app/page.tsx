"use client";
import { useRef, useState, useEffect } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  MapPin,
  Search,
  Plus,
  X,
  Compass,
  Sparkles,
  Music2,
  BookOpen,
  Film,
  House,
  RefreshCw,
  ChevronDown,
  Check,
  LoaderCircle,
} from "lucide-react";
import type {
  CityChoice,
  EntityChoice,
  DiscoveryRequest,
  DiscoveryResult,
  Discovery,
} from "../lib/discovery/types";
async function post<T>(path: string, body: unknown): Promise<T> {
  const r = await fetch("/api/" + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const d = (await r.json()) as T & { error?: { message?: string } };
  if (!r.ok) throw new Error(d.error?.message || "Please try again.");
  return d;
}
function CitySketch() {
  return (
    <div className="city-art" aria-hidden="true">
      <div className="art-orbit" />
      <div className="art-sun" />
      <div className="art-caption">
        <span>✳</span>A little familiar.
        <br />A whole new world.
      </div>
      <svg className="city-drawing" viewBox="0 0 520 330" fill="none">
        <path d="M20 291H502M35 306H472" stroke="#a4aa8c" />
        <path
          d="M82 283V158L143 128L204 158V283"
          fill="#d9dfc4"
          stroke="#5d7055"
          strokeWidth="2"
        />
        <path
          d="M76 158L143 114L211 158M143 114V88M133 88H154"
          stroke="#5d7055"
          strokeWidth="2"
        />
        <path
          d="M102 181H125V211H102ZM159 181H182V211H159ZM102 229H125V259H102ZM158 241Q171 217 184 241V283H158Z"
          fill="#fcf9ee"
          stroke="#5d7055"
          strokeWidth="2"
        />
        <path
          d="M220 283V109H324V283"
          fill="#e9cfad"
          stroke="#946a4d"
          strokeWidth="2"
        />
        <path d="M214 109H330L318 96H226Z" fill="#946a4d" />
        <path
          d="M237 128H256V155H237ZM286 128H305V155H286ZM237 176H256V203H237ZM286 176H305V203H286ZM230 245H315V283H230Z"
          fill="#fff9ec"
          stroke="#946a4d"
          strokeWidth="2"
        />
        <path d="M226 226H318L325 244H219Z" fill="#57705b" />
        <path
          d="M239 226L236 244M257 226L256 244M277 226V244M296 226L298 244M311 226L316 244"
          stroke="#f8f4e5"
          strokeWidth="6"
        />
        <text x="252" y="220" fontSize="10" fill="#5e644c" fontFamily="Georgia">
          CAFÉ
        </text>
        <path
          d="M344 283V172L386 139L430 172V283Z"
          fill="#e7e8d8"
          stroke="#67775c"
          strokeWidth="2"
        />
        <path d="M339 172L386 132L436 172" stroke="#67775c" strokeWidth="3" />
        <path
          d="M360 192H377V215H360ZM398 192H415V215H398ZM377 246Q387 227 397 246V283H377Z"
          fill="#faf7ec"
          stroke="#67775c"
          strokeWidth="2"
        />
        <path
          d="M453 283V203M437 214Q452 184 469 215Q478 227 463 233Q447 246 433 232Q421 222 437 214Z"
          fill="#98aa7c"
          stroke="#607653"
          strokeWidth="2"
        />
        <path
          d="M47 283V223M32 232Q43 202 59 224Q72 237 58 244Q40 255 29 243Q20 235 32 232Z"
          fill="#aaba8e"
          stroke="#607653"
          strokeWidth="2"
        />
        <path
          d="M183 77Q192 69 202 77M353 87Q362 79 371 87"
          stroke="#8c9677"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <div className="art-pin">
        <MapPin size={17} />
        Your next chapter
      </div>
      <div className="art-stamp">
        <Compass size={25} />
        <span>
          GO WHERE
          <br />
          YOU FEEL YOU
        </span>
      </div>
    </div>
  );
}
function DiscoveryCard({
  item,
  index,
  busy,
  onReplace,
}: {
  item: Discovery;
  index: number;
  busy: boolean;
  onReplace: (id: string, feedback: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  return (
    <article className="discovery-card">
      <div className={"place-visual visual-" + index}>
        <Compass size={62} strokeWidth={0.8} />
        {item.place.image && (
          <img
            src={item.place.image}
            alt={item.place.name}
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        )}
        <span className="place-number">0{index + 1}</span>
        <span className="place-category">
          {item.place.category || "A new discovery"}
        </span>
      </div>
      <div className="place-content">
        <p className="place-address">
          <MapPin size={12} />
          {item.place.address || "Address not available"}
        </p>
        <h3>{item.place.name}</h3>
        {item.place.description && (
          <p className="place-description">{item.place.description}</p>
        )}
        <div className="why">
          <span>
            <Sparkles size={14} />
            THE TASTE CONNECTION
          </span>
          <p>{item.reason}</p>
        </div>
        <p className="place-details">
          {item.place.price !== undefined
            ? "Qloo price level: " + item.place.price + " · "
            : "Price unknown · "}
          Check current hours before visiting.
        </p>
        <div className="card-actions">
          <a href={item.mapUrl} target="_blank" rel="noreferrer">
            Find on map <ArrowUpRight size={16} />
          </a>
          <button
            type="button"
            aria-label="Try another place"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <RefreshCw size={15} />
            Try another
          </button>
        </div>
        {open && (
          <div className="feedback">
            <p>What would feel more like you?</p>
            <div className="feedback-pills">
              {["Quieter", "Cheaper", "Closer", "Something different"].map(
                (f) => (
                  <button
                    type="button"
                    key={f}
                    disabled={busy}
                    onClick={() => onReplace(item.place.id, f)}
                  >
                    {f}
                  </button>
                ),
              )}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (feedback.trim()) onReplace(item.place.id, feedback);
              }}
            >
              <input
                aria-label={"Feedback for " + item.place.name}
                placeholder="Or tell us what to change…"
                value={feedback}
                maxLength={200}
                onChange={(e) => setFeedback(e.target.value)}
              />
              <button
                aria-label="Send feedback"
                disabled={busy || !feedback.trim()}
              >
                {busy ? (
                  <LoaderCircle className="spin" size={17} />
                ) : (
                  <ArrowRight size={17} />
                )}
              </button>
            </form>
            <small>
              Closer uses the city centre. Other preferences depend on available
              place details.
            </small>
          </div>
        )}
      </div>
    </article>
  );
}
export default function Home() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const [cityText, setCityText] = useState("");
  const [city, setCity] = useState<CityChoice | null>(null);
  const [cityChoices, setCityChoices] = useState<CityChoice[]>([]);
  const [tasteText, setTasteText] = useState("");
  const [tastes, setTastes] = useState<EntityChoice[]>([]);
  const [tasteChoices, setTasteChoices] = useState<EntityChoice[]>([]);
  const [budget, setBudget] = useState("");
  const [atmosphere, setAtmosphere] = useState("");
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<DiscoveryResult | null>(null);
  const [context, setContext] = useState<DiscoveryRequest | null>(null);
  const [excluded, setExcluded] = useState<string[]>([]);
  const [searched, setSearched] = useState("");
  const version = useRef(0);
  const resultsRef = useRef<HTMLElement>(null);
  async function resolve(kind: "city" | "taste") {
    const token = ++version.current;
    setBusy(kind);
    setError("");
    setSearched("");
    try {
      const d = await post<{ choices: any[] }>("resolve", {
        kind,
        text: kind === "city" ? cityText : tasteText,
      });
      if (token !== version.current) return;
      if (kind === "city") setCityChoices(d.choices);
      else setTasteChoices(d.choices);
      if (!d.choices.length)
        setSearched("No matches found. Try a more specific name.");
    } catch (e) {
      if (token === version.current) setError((e as Error).message);
    } finally {
      if (token === version.current) setBusy("");
    }
  }
  async function discover() {
    if (!city) return;
    const token = ++version.current;
    const request = { city, tastes, preferences: { budget, atmosphere } };
    setBusy("discover");
    setError("");
    try {
      const d = await post<DiscoveryResult>("discover", request);
      if (token !== version.current) return;
      setResult(d);
      setContext(request);
      setExcluded([]);
      setTimeout(
        () =>
          resultsRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          }),
        100,
      );
    } catch (e) {
      if (token === version.current) setError((e as Error).message);
    } finally {
      if (token === version.current) setBusy("");
    }
  }
  async function replace(id: string, feedback: string) {
    if (!context || !result) return;
    const token = ++version.current;
    setBusy("replace");
    setError("");
    try {
      const d = await post<DiscoveryResult>("replace", {
        context,
        current: result.items,
        replaceId: id,
        feedback,
        excludedIds: excluded,
      });
      if (token !== version.current) return;
      setResult(d);
      if (!d.items.some((i) => i.place.id === id))
        setExcluded([...excluded, id].slice(-50));
    } catch (e) {
      if (token === version.current) setError((e as Error).message);
    } finally {
      if (token === version.current) setBusy("");
    }
  }
  const invalidate = () => {
    version.current++;
    setBusy("");
  };
  return (
    <>
      <header className="site-header">
        <a className="brand" href="/" aria-label="Second Home">
          <span className="brand-mark">
            <House size={21} strokeWidth={1.6} />
          </span>
          second home<span className="brand-dot">.</span>
        </a>
        <nav>
          <a href="#how-it-works">How it works</a>
          <a href="#discover" className="nav-start">
            Find your places <ArrowUpRight size={15} />
          </a>
        </nav>
      </header>
      <main>
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">
              <span />
              FOR NEW CITIES & NEW BEGINNINGS
            </div>
            <h1>
              Somewhere new.
              <br />
              <em>Something you.</em>
            </h1>
            <p className="hero-description">
              A new city doesn’t have to feel unfamiliar.
              <br className="desktop-break" />
              Find three places that connect with the things you love.
            </p>
            <a className="hero-link" href="#discover">
              Find your little corner <ArrowRight size={17} />
            </a>
            <div className="hero-note">
              <Compass size={16} />
              Guided by your taste. Made for exploring on your own.
            </div>
          </div>
          <CitySketch />
        </section>
        <section className="discovery-builder" id="discover">
          <div className="builder-heading">
            <div>
              <p className="eyebrow">YOUR NEXT FAVOURITE PLACE STARTS HERE</p>
              <h2>Bring a little of you.</h2>
            </div>
            <span className="powered">
              <span />
              Cultural intelligence by <strong>Qloo</strong>
            </span>
          </div>
          <div className="builder-grid">
            <div className="city-step">
              <div className="step-label">
                <span>01</span>Where are you settling in?
              </div>
              <label htmlFor="city">Your new city</label>
              <form
                className="search-field"
                onSubmit={(e) => {
                  e.preventDefault();
                  resolve("city");
                }}
              >
                <MapPin size={18} />
                <input
                  id="city"
                  disabled={!ready}
                  placeholder="e.g. London, Lisbon, Tokyo"
                  value={cityText}
                  maxLength={150}
                  onChange={(e) => {
                    setCityText(e.target.value);
                    setCity(null);
                    setCityChoices([]);
                    invalidate();
                  }}
                />
                <button
                  aria-label="Search cities"
                  disabled={!!busy || cityText.trim().length < 2}
                >
                  {busy === "city" ? (
                    <LoaderCircle size={17} className="spin" />
                  ) : (
                    <Search size={17} />
                  )}
                </button>
              </form>
              {city && (
                <p className="selected-city">
                  <Check size={14} />
                  {city.label}
                </p>
              )}
              {cityChoices.length > 0 && (
                <div className="choice-list" aria-label="City matches">
                  {cityChoices.map((c) => (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => {
                        setCity(c);
                        setCityText(c.label.split(",")[0]);
                        setCityChoices([]);
                      }}
                    >
                      <MapPin size={14} />
                      <span>{c.label}</span>
                      <Plus size={14} />
                    </button>
                  ))}
                </div>
              )}
              <p className="field-help">
                Choose a match so we find the right city.
              </p>
              <div className="optional-fields">
                <div>
                  <label htmlFor="budget">
                    Budget <span>optional</span>
                  </label>
                  <div className="select-wrap">
                    <select
                      id="budget"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                    >
                      <option value="">Any budget</option>
                      <option value="budget">Budget-friendly</option>
                      <option value="flexible">A little treat</option>
                    </select>
                    <ChevronDown size={14} />
                  </div>
                </div>
                <div>
                  <label htmlFor="atmosphere">
                    Atmosphere <span>optional</span>
                  </label>
                  <div className="select-wrap">
                    <select
                      id="atmosphere"
                      value={atmosphere}
                      onChange={(e) => setAtmosphere(e.target.value)}
                    >
                      <option value="">Surprise me</option>
                      <option value="quiet">Quiet & calm</option>
                    </select>
                    <ChevronDown size={14} />
                  </div>
                </div>
              </div>
            </div>
            <div className="taste-step">
              <div className="step-label">
                <span>02</span>What feels like you?
              </div>
              <label htmlFor="taste">Search a favourite</label>
              <form
                className="search-field"
                onSubmit={(e) => {
                  e.preventDefault();
                  resolve("taste");
                }}
              >
                <Sparkles size={18} />
                <input
                  id="taste"
                  disabled={!ready}
                  placeholder="An artist, film, book, brand or place…"
                  value={tasteText}
                  maxLength={150}
                  onChange={(e) => {
                    setTasteText(e.target.value);
                    setTasteChoices([]);
                    invalidate();
                  }}
                />
                <button
                  aria-label="Search favourites"
                  disabled={
                    !!busy || tasteText.trim().length < 2 || tastes.length >= 5
                  }
                >
                  {busy === "taste" ? (
                    <LoaderCircle size={17} className="spin" />
                  ) : (
                    <Plus size={19} />
                  )}
                </button>
              </form>
              {tasteChoices.length > 0 && (
                <div className="choice-list" aria-label="Favourite matches">
                  {tasteChoices
                    .filter((c) => !tastes.some((t) => t.id === c.id))
                    .map((c) => (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => {
                          setTastes([...tastes, c]);
                          setTasteText("");
                          setTasteChoices([]);
                        }}
                      >
                        <span>
                          <strong>
                            {c.name} — {c.kind}
                          </strong>
                          {c.detail && <small>{c.detail}</small>}
                        </span>
                        <Plus size={14} />
                      </button>
                    ))}
                </div>
              )}
              <div className="taste-chips">
                {tastes.map((t) => (
                  <span key={t.id}>
                    {t.kind === "artist" ? (
                      <Music2 size={13} />
                    ) : t.kind === "movie" ? (
                      <Film size={13} />
                    ) : (
                      <BookOpen size={13} />
                    )}{" "}
                    {t.name}
                    <button
                      type="button"
                      aria-label={"Remove " + t.name}
                      disabled={!!busy}
                      onClick={() =>
                        setTastes(tastes.filter((x) => x.id !== t.id))
                      }
                    >
                      <X size={13} />
                    </button>
                  </span>
                ))}
              </div>
              <p className="field-help">
                Add 3–5 favourites. The unexpected combinations are the good
                ones.
              </p>
              {!tastes.length && (
                <div className="taste-examples">
                  <span>
                    <Music2 size={13} />
                    Your on-repeat artist
                  </span>
                  <span>
                    <Film size={13} />A film you love
                  </span>
                  <span>
                    <BookOpen size={13} />A favourite book
                  </span>
                </div>
              )}
            </div>
          </div>
          {searched && (
            <p className="search-message" role="status">
              {searched}
            </p>
          )}
          <div className="builder-bottom">
            <p>
              <span />
              No account. No personality quiz. Just your taste.
            </p>
            <button
              type="button"
              className="primary-button"
              disabled={!city || tastes.length < 3 || !!busy}
              onClick={discover}
            >
              {busy === "discover" ? (
                <>
                  <LoaderCircle size={17} className="spin" />
                  Finding your places…
                </>
              ) : (
                <>
                  Find my three discoveries <ArrowRight size={17} />
                </>
              )}
            </button>
          </div>
        </section>
        {error && (
          <div className="error-banner" role="alert">
            {error}
          </div>
        )}
        {result && (
          <section
            className="results-section"
            ref={resultsRef}
            aria-live="polite"
          >
            <div className="results-heading">
              <div>
                <p className="eyebrow">A NEW CITY, THROUGH YOUR EYES</p>
                <h2>
                  Your little corners of {context?.city.label.split(",")[0]}.
                </h2>
              </div>
              <span>{result.items.length} personal discoveries</span>
            </div>
            <div className="agent-steps">
              {result.steps.map((s) => (
                <span key={s}>
                  <Check size={13} />
                  {s}
                </span>
              ))}
            </div>
            {result.warnings.map((w, i) => (
              <p className="result-warning" key={i}>
                {w}
              </p>
            ))}
            <div className="results-grid">
              {result.items.map((item, i) => (
                <DiscoveryCard
                  key={item.place.id}
                  item={item}
                  index={i}
                  busy={!!busy}
                  onReplace={replace}
                />
              ))}
            </div>
          </section>
        )}
        <section className="how-section" id="how-it-works">
          <div className="how-intro">
            <p className="eyebrow">LESS SEARCHING. MORE BELONGING.</p>
            <h2>
              A familiar feeling,
              <br />
              in an unfamiliar place.
            </h2>
          </div>
          {[
            {
              Icon: Music2,
              title: "Start with what you love",
              text: "The music, stories and places that make you, you.",
            },
            {
              Icon: Sparkles,
              title: "Follow the connections",
              text: "Qloo’s taste graph connects your favourites to real places.",
            },
            {
              Icon: Compass,
              title: "Make the city your own",
              text: "Explore three discoveries. Tell us what fits, and what doesn’t.",
            },
          ].map(({ Icon, title, text }) => (
            <div className="how-item" key={title}>
              <span className="how-icon">
                <Icon size={21} />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </section>
        <div className="closing-note">
          <span>✳</span>
          <p>
            You don’t have to know anyone
            <br />
            to find somewhere you belong.
          </p>
          <span>✳</span>
        </div>
      </main>
      <footer>
        <a className="brand" href="/">
          second home<span className="brand-dot">.</span>
        </a>
        <p>A little familiar, wherever you land.</p>
        <span>
          Built with Qloo <ArrowUpRight size={13} />
        </span>
      </footer>
    </>
  );
}
