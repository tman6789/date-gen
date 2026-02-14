
export default function Pill({ selected, onClick, children, small }) {
    return (
        <button
            onClick={onClick}
            style={{
                padding: small ? "6px 14px" : "8px 18px",
                borderRadius: "999px",
                border: selected ? "2px solid #a855f7" : "2px solid rgba(168,85,247,0.2)",
                background: selected
                    ? "linear-gradient(135deg, #a855f7, #7c3aed)"
                    : "rgba(168,85,247,0.06)",
                color: selected ? "#fff" : "#c4b5fd",
                cursor: "pointer",
                fontSize: small ? "13px" : "14px",
                fontWeight: selected ? 600 : 500,
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
            }}
        >
            {children}
        </button>
    );
}
