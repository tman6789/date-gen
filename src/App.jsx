import { useState, useEffect, useRef } from "react";
import Pill from "./components/Pill";
import DateCard from "./components/DateCard";
import FavoritesPanel from "./components/FavoritesPanel";
import { VIBES, BUDGETS, TIMES, SETTINGS, TRANSPORT, SEASONS, TIME_OF_DAY } from "./constants";

export default function App() {
  const [location, setLocation] = useState("dc");
  const [customCity, setCustomCity] = useState("");
  const [selectedVibes, setSelectedVibes] = useState([]);
  const [budget, setBudget] = useState("$$");
  const [timeAvail, setTimeAvail] = useState("Evening (2-3hr)");
  const [setting, setSetting] = useState("Either");
  const [drinking, setDrinking] = useState(null);
  const [transport, setTransport] = useState("Either");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [recentTitles, setRecentTitles] = useState([]);
  const [error, setError] = useState(null);
  const resultRef = useRef(null);

  useEffect(() => {
    const storedFavs = localStorage.getItem("date-favorites");
    if (storedFavs) setFavorites(JSON.parse(storedFavs));

    const storedRecents = localStorage.getItem("date-recents");
    if (storedRecents) setRecentTitles(JSON.parse(storedRecents));
  }, []);

  const saveFavorites = (newFavs) => {
    setFavorites(newFavs);
    localStorage.setItem("date-favorites", JSON.stringify(newFavs));
  };

  const saveRecents = (newRecents) => {
    const trimmed = newRecents.slice(-20);
    setRecentTitles(trimmed);
    localStorage.setItem("date-recents", JSON.stringify(trimmed));
  };

  const toggleVibe = (id) => {
    setSelectedVibes((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const getLocationText = () => {
    if (location === "dc") return "Washington DC / DMV area";
    if (location === "generic") return "any city (generic ideas)";
    return customCity || "a city";
  };

  const generate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    const vibeText = selectedVibes.length > 0
      ? selectedVibes.map((v) => VIBES.find((vb) => vb.id === v)?.label).join(", ")
      : "any vibe";

    const prompt = `You are a creative date planner. Generate a spontaneous, specific, actually-doable date idea.

CONTEXT:
- Location: ${getLocationText()}
- Season: ${SEASONS}
- Current time of day: ${TIME_OF_DAY}
- Vibe: ${vibeText}
- Budget: ${budget}
- Time available: ${timeAvail}
- Setting preference: ${setting}
- Drinking: ${drinking === null ? "no preference" : drinking ? "yes, include drinks" : "no alcohol"}
- Transport: ${transport}
${recentTitles.length > 0 ? `- AVOID these recent ideas (do NOT repeat): ${recentTitles.join("; ")}` : ""}

${location === "dc" ? `Use SPECIFIC DC/DMV locations: real neighborhoods (Georgetown, Dupont Circle, Adams Morgan, Capitol Hill, Old Town Alexandria, U Street, Shaw, Navy Yard, Bethesda, etc.), real landmarks, types of real venues. Be specific about WHERE to go, not generic.` : ""}

RULES:
- Be specific and actionable — someone should be able to do this RIGHT NOW
- Follow a "date recipe" structure: activity → food/drink → capstone moment
- Make it feel spontaneous and fun, not like a checklist
- Adjust for season (${SEASONS}) and time of day (${TIME_OF_DAY})
- Keep it real — no fictional places

Respond in EXACTLY this JSON format (no markdown, no code fences, raw JSON only):
{
  "main": {
    "title": "Short fun title (4-7 words)",
    "steps": ["Step 1 with specific details", "Step 2...", "Step 3..."],
    "time": "estimated duration like 2-3 hours",
    "budget": "$ or $$ or $$$",
    "bestTime": "e.g. Late Afternoon, Evening, Morning",
    "setting": "Indoor or Outdoor or Both",
    "why": "One sentence why this date works — make it compelling"
  },
  "alternates": [
    {
      "title": "Alternate idea title",
      "steps": ["Step 1...", "Step 2...", "Step 3..."],
      "time": "duration",
      "budget": "$ or $$ or $$$",
      "bestTime": "time",
      "setting": "Indoor or Outdoor or Both",
      "why": "Why sentence"
    },
    {
      "title": "Second alternate",
      "steps": ["Step 1...", "Step 2..."],
      "time": "duration",
      "budget": "$ or $$ or $$$",
      "bestTime": "time",
      "setting": "Indoor or Outdoor or Both",
      "why": "Why sentence"
    }
  ]
}`;

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to generate idea");
      }

      const parsed = await response.json();
      setResult(parsed);

      const newTitles = [
        parsed.main.title,
        ...parsed.alternates.map((a) => a.title),
      ];
      saveRecents([...recentTitles, ...newTitles]);

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      setError(err.message || "Something went wrong generating your date. Try again!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (date) => {
    const exists = favorites.findIndex((f) => f.title === date.title);
    if (exists >= 0) {
      saveFavorites(favorites.filter((_, i) => i !== exists));
    } else {
      saveFavorites([...favorites, date]);
    }
  };

  const isFavorited = (date) => favorites.some((f) => f.title === date.title);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #0f0520 0%, #1a0a2e 30%, #0d0618 70%, #120825 100%)",
        color: "#f5f3ff",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "fixed",
          top: "-30%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "800px",
          height: "800px",
          background: "radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "560px", margin: "0 auto", padding: "24px 20px 60px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px", paddingTop: "20px" }}>
          <div style={{ fontSize: "40px", marginBottom: "8px" }}>✨</div>
          <h1
            style={{
              margin: "0 0 6px",
              fontSize: "28px",
              fontWeight: 800,
              background: "linear-gradient(135deg, #e9d5ff, #a855f7, #ec4899)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.5px",
            }}
          >
            Spontaneous Date
          </h1>
          <p style={{ margin: 0, color: "#8b7fad", fontSize: "14px", fontWeight: 400 }}>
            One tap. One plan. Go have fun.
          </p>
        </div>

        {/* Location */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
            <Pill selected={location === "dc"} onClick={() => setLocation("dc")} small>📍 DC / DMV</Pill>
            <Pill selected={location === "generic"} onClick={() => setLocation("generic")} small>🌍 Anywhere</Pill>
            <Pill selected={location === "custom"} onClick={() => setLocation("custom")} small>✏️ Custom</Pill>
          </div>
          {location === "custom" && (
            <input
              type="text"
              placeholder="Enter city name..."
              value={customCity}
              onChange={(e) => setCustomCity(e.target.value)}
              style={{
                width: "100%",
                marginTop: "12px",
                padding: "12px 16px",
                borderRadius: "12px",
                border: "2px solid rgba(168,85,247,0.25)",
                background: "rgba(168,85,247,0.08)",
                color: "#f5f3ff",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          )}
        </div>

        {/* Vibes */}
        <div style={{ marginBottom: "20px" }}>
          <p style={{ color: "#8b7fad", fontSize: "13px", fontWeight: 600, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "1px" }}>
            Set the vibe
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {VIBES.map((v) => (
              <Pill key={v.id} selected={selectedVibes.includes(v.id)} onClick={() => toggleVibe(v.id)} small>
                {v.icon} {v.label}
              </Pill>
            ))}
          </div>
        </div>

        {/* Filters toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "12px",
            border: "1px solid rgba(168,85,247,0.15)",
            background: "rgba(168,85,247,0.06)",
            color: "#8b7fad",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: 500,
            marginBottom: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "6px",
          }}
        >
          {showFilters ? "▲ Hide" : "▼ More"} constraints
        </button>

        {/* Constraints */}
        {showFilters && (
          <div
            style={{
              background: "rgba(168,85,247,0.05)",
              borderRadius: "16px",
              padding: "20px",
              marginBottom: "20px",
              border: "1px solid rgba(168,85,247,0.1)",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <div>
              <p style={{ color: "#8b7fad", fontSize: "12px", fontWeight: 600, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Budget</p>
              <div style={{ display: "flex", gap: "8px" }}>
                {BUDGETS.map((b) => (
                  <Pill key={b} selected={budget === b} onClick={() => setBudget(b)} small>{b}</Pill>
                ))}
              </div>
            </div>
            <div>
              <p style={{ color: "#8b7fad", fontSize: "12px", fontWeight: 600, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Time available</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {TIMES.map((t) => (
                  <Pill key={t} selected={timeAvail === t} onClick={() => setTimeAvail(t)} small>{t}</Pill>
                ))}
              </div>
            </div>
            <div>
              <p style={{ color: "#8b7fad", fontSize: "12px", fontWeight: 600, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Setting</p>
              <div style={{ display: "flex", gap: "8px" }}>
                {SETTINGS.map((s) => (
                  <Pill key={s} selected={setting === s} onClick={() => setSetting(s)} small>{s}</Pill>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: "24px" }}>
              <div style={{ flex: 1 }}>
                <p style={{ color: "#8b7fad", fontSize: "12px", fontWeight: 600, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Drinks?</p>
                <div style={{ display: "flex", gap: "8px" }}>
                  <Pill selected={drinking === true} onClick={() => setDrinking(drinking === true ? null : true)} small>🍷 Yes</Pill>
                  <Pill selected={drinking === false} onClick={() => setDrinking(drinking === false ? null : false)} small>🚫 No</Pill>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: "#8b7fad", fontSize: "12px", fontWeight: 600, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Transport</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {TRANSPORT.map((t) => (
                    <Pill key={t} selected={transport === t} onClick={() => setTransport(t)} small>{t}</Pill>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={generate}
          disabled={loading}
          style={{
            width: "100%",
            padding: "18px 24px",
            borderRadius: "16px",
            border: "none",
            background: loading
              ? "rgba(168,85,247,0.3)"
              : "linear-gradient(135deg, #a855f7, #7c3aed, #6d28d9)",
            color: "#fff",
            fontSize: "18px",
            fontWeight: 700,
            cursor: loading ? "wait" : "pointer",
            marginBottom: "12px",
            boxShadow: loading ? "none" : "0 8px 32px rgba(168,85,247,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
            transition: "all 0.3s ease",
            letterSpacing: "0.3px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {loading ? (
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
              <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>✨</span>
              Planning something amazing...
            </span>
          ) : (
            "✨ Generate Date"
          )}
        </button>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

        {/* Favorites button */}
        <button
          onClick={() => setShowFavorites(true)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "12px",
            border: "1px solid rgba(168,85,247,0.15)",
            background: "transparent",
            color: "#8b7fad",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 500,
            marginBottom: "28px",
          }}
        >
          💜 Saved Dates {favorites.length > 0 && `(${favorites.length})`}
        </button>

        {/* Error */}
        {error && (
          <div
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: "12px",
              padding: "16px",
              color: "#fca5a5",
              textAlign: "center",
              marginBottom: "20px",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div ref={resultRef} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <DateCard
              date={result.main}
              onFavorite={() => toggleFavorite(result.main)}
              isFavorited={isFavorited(result.main)}
            />

            {result.alternates?.length > 0 && (
              <>
                <p
                  style={{
                    color: "#6b5f8a",
                    fontSize: "12px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                    margin: "8px 0 -8px",
                    textAlign: "center",
                  }}
                >
                  Or try these instead
                </p>
                {result.alternates.map((alt, i) => (
                  <DateCard
                    key={i}
                    date={alt}
                    onFavorite={() => toggleFavorite(alt)}
                    isFavorited={isFavorited(alt)}
                    isAlternate
                  />
                ))}
              </>
            )}

            <button
              onClick={generate}
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                border: "2px solid rgba(168,85,247,0.3)",
                background: "transparent",
                color: "#a855f7",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: 600,
                marginTop: "4px",
              }}
            >
              🔄 Try Again
            </button>
          </div>
        )}
      </div>

      {/* Favorites modal */}
      {showFavorites && (
        <FavoritesPanel
          favorites={favorites}
          onRemove={(i) => saveFavorites(favorites.filter((_, idx) => idx !== i))}
          onClose={() => setShowFavorites(false)}
        />
      )}
    </div>
  );
}
