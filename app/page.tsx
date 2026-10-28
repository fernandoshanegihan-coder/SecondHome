"use client";
import { useRef, useState, useEffect } from "react";
import { CityPoster } from "../components/city-poster";
import {
  ArrowUpRight,
  ArrowDownRight,
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
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
              .matches
              ? "auto"
              : "smooth",
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
          <span className="brand-symbol" aria-hidden="true">
            sh.
          </span>
          <span>Second Home</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#how-it-works">The idea</a>
          <a href="#discover" className="nav-start">
            Find your places <ArrowUpRight size={16} />
          </a>
        </nav>
      </header>
      <main>
        <section className="hero">
          <div className="hero-topline">
            <span>A FIELD GUIDE TO FEELING AT HOME</span>
            <span>FOR NEW BEGINNINGS · VOL. 01</span>
          </div>
          <h1 className="hero-masthead">
            Second Home<span>.</span>
          </h1>
          <div className="hero-scene">
            <div className="hero-copy">
              <p className="eyebrow">YOUR TASTE. A NEW PLACE.</p>
              <h2>
                Somewhere new.
                <br />
                <em>Something you.</em>
              </h2>
              <p className="hero-description">
                Three places in a new city, connected to the things you already
                love.
              </p>
              <a className="hero-link" href="#discover">
                Find your little corner <ArrowUpRight size={20} />
              </a>
              <p className="hero-note">
                A city becomes home, one discovery at a time.
              </p>
            </div>
            <CityPoster />
          </div>
          <div className="hero-colophon">
            <span>EXPLORE AT YOUR OWN PACE.</span>
            <span>
              CULTURAL CONNECTIONS BY QLOO <ArrowDownRight />
            </span>
          </div>
        </section>
        <section className="discovery-builder" id="discover">
          <div className="builder-heading">
            <div>
              <p className="eyebrow">
                <span className="section-index">01 /</span> THE DISCOVERY DESK
              </p>
              <h2>
                Your kind of
                <br />
                <em>somewhere.</em>
              </h2>
              <p className="builder-intro">
                Bring a few favourites. We’ll find the places that feel like
                you.
              </p>
            </div>
            <span className="powered">
              <span />
              Recommendations grounded in <strong>Qloo</strong>
            </span>
          </div>
          <div className="builder-grid">
            <div className="city-step">
              <div className="step-label">
                <span>A.</span>Where are you settling in?
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
                <span>B.</span>What feels like you?
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
                Choose 3–5 different favourites from the search results.
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
              No account needed. A few favourites are enough.
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
                <p className="eyebrow">
                  <span className="section-index">02 /</span> YOUR FIELD NOTES
                </p>
                <h2>
                  A little more at home in{" "}
                  <em>{context?.city.label.split(",")[0]}.</em>
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
            <p className="eyebrow">THE IDEA BEHIND IT</p>
            <h2>
              A few favourites.
              <br />A fresh perspective.
            </h2>
          </div>
          {[
            {
              title: "Start with what you love",
              text: "The music, stories and places that make you, you.",
            },
            {
              title: "Follow the connections",
              text: "Qloo’s taste graph connects your favourites to real places.",
            },
            {
              title: "Make the city your own",
              text: "Explore three discoveries. Tell us what fits, and what doesn’t.",
            },
          ].map(({ title, text }, index) => (
            <div className="how-item" key={title}>
              <span className="how-number">0{index + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </section>
        <section className="closing-note">
          <p className="eyebrow">A NEW CHAPTER, YOUR WAY.</p>
          <h2>
            Make yourself
            <br />
            <em>at home.</em>
          </h2>
          <a href="#discover" className="closing-link">
            Start exploring <ArrowUpRight size={24} />
          </a>
          <span className="closing-star" aria-hidden="true">
            ✳
          </span>
        </section>
      </main>
      <footer>
        <a className="brand" href="/">
          Second Home<span className="brand-dot">.</span>
        </a>
        <p>Independent discoveries. A familiar feeling.</p>
        <span>
          Cultural intelligence by Qloo <ArrowUpRight size={13} />
        </span>
      </footer>
    </>
  );
}
