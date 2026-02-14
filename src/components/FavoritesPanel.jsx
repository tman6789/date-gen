
import DateCard from "./DateCard";

export default function FavoritesPanel({ favorites, onRemove, onClose }) {
    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.7)",
                backdropFilter: "blur(8px)",
                zIndex: 100,
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                padding: "40px 16px",
                overflowY: "auto",
            }}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div
                style={{
                    background: "linear-gradient(180deg, #1e1033, #0f0a1a)",
                    borderRadius: "24px",
                    padding: "32px",
                    maxWidth: "560px",
                    width: "100%",
                    border: "1px solid rgba(168,85,247,0.2)",
                }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                    <h2 style={{ margin: 0, color: "#f5f3ff", fontSize: "22px" }}>💜 Saved Dates</h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: "rgba(168,85,247,0.15)",
                            border: "none",
                            color: "#c4b5fd",
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            cursor: "pointer",
                            fontSize: "18px",
                        }}
                    >
                        ✕
                    </button>
                </div>
                {favorites.length === 0 ? (
                    <p style={{ color: "#8b7fad", textAlign: "center", padding: "40px 0" }}>
                        No saved dates yet. Hit generate and save your favorites!
                    </p>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {favorites.map((fav, i) => (
                            <DateCard key={i} date={fav} onFavorite={() => onRemove(i)} isFavorited={true} isAlternate={true} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
