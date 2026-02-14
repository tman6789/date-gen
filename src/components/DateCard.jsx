import { useState } from "react";

export default function DateCard({ date, onFavorite, isFavorited, isAlternate }) {
    const [copied, setCopied] = useState(false);

    const share = () => {
        const text = `${date.title}\n\n${date.steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n\n⏱ ${date.time} · ${date.budget} · ${date.bestTime}\n💡 ${date.why}`;
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div
            style={{
                background: isAlternate
                    ? "rgba(168,85,247,0.08)"
                    : "linear-gradient(135deg, rgba(168,85,247,0.15), rgba(124,58,237,0.1))",
                borderRadius: "20px",
                padding: isAlternate ? "20px 24px" : "28px 32px",
                border: isAlternate
                    ? "1px solid rgba(168,85,247,0.15)"
                    : "1px solid rgba(168,85,247,0.25)",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {!isAlternate && (
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "3px",
                        background: "linear-gradient(90deg, #a855f7, #ec4899, #a855f7)",
                    }}
                />
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                <h3
                    style={{
                        margin: 0,
                        fontSize: isAlternate ? "18px" : "22px",
                        fontWeight: 700,
                        color: "#f5f3ff",
                        lineHeight: 1.3,
                    }}
                >
                    {date.title}
                </h3>
                <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                    <button
                        onClick={onFavorite}
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "20px",
                            padding: "4px",
                            filter: isFavorited ? "none" : "grayscale(1) opacity(0.5)",
                            transition: "all 0.2s",
                        }}
                        title={isFavorited ? "Remove from favorites" : "Save to favorites"}
                    >
                        {isFavorited ? "💜" : "🤍"}
                    </button>
                    <button
                        onClick={share}
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "18px",
                            padding: "4px",
                            opacity: 0.6,
                            transition: "opacity 0.2s",
                        }}
                        title="Copy to clipboard"
                    >
                        {copied ? "✅" : "📋"}
                    </button>
                </div>
            </div>

            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                    margin: "14px 0",
                }}
            >
                {[
                    { icon: "⏱", text: date.time },
                    { icon: "💰", text: date.budget },
                    { icon: "🕐", text: date.bestTime },
                    { icon: date.setting === "Outdoor" ? "🌳" : date.setting === "Indoor" ? "🏠" : "🔄", text: date.setting },
                ].map((tag, i) => (
                    <span
                        key={i}
                        style={{
                            background: "rgba(168,85,247,0.15)",
                            color: "#d8b4fe",
                            padding: "4px 12px",
                            borderRadius: "999px",
                            fontSize: "12px",
                            fontWeight: 500,
                        }}
                    >
                        {tag.icon} {tag.text}
                    </span>
                ))}
            </div>

            <div style={{ margin: "16px 0" }}>
                {date.steps.map((step, i) => (
                    <div
                        key={i}
                        style={{
                            display: "flex",
                            gap: "12px",
                            alignItems: "flex-start",
                            marginBottom: i < date.steps.length - 1 ? "10px" : 0,
                        }}
                    >
                        <span
                            style={{
                                background: "linear-gradient(135deg, #a855f7, #7c3aed)",
                                color: "#fff",
                                borderRadius: "50%",
                                width: "24px",
                                height: "24px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "12px",
                                fontWeight: 700,
                                flexShrink: 0,
                                marginTop: "1px",
                            }}
                        >
                            {i + 1}
                        </span>
                        <p style={{ margin: 0, color: "#e9d5ff", fontSize: "14px", lineHeight: 1.5 }}>{step}</p>
                    </div>
                ))}
            </div>

            <p
                style={{
                    margin: 0,
                    color: "#c4b5fd",
                    fontSize: "13px",
                    fontStyle: "italic",
                    borderTop: "1px solid rgba(168,85,247,0.15)",
                    paddingTop: "12px",
                }}
            >
                💡 {date.why}
            </p>
        </div>
    );
}
