export default function TokenSelector({
  tokens,
  sourceToken,
  targetToken,
  onSelect,
  onReset,
}) {
  return (
            <div style={{ marginBottom: 24 }}>
          <label style={{ fontWeight: "500", fontSize: 14, color: "#000000", marginBottom: 8, display: "block" }}>Select Tokens:</label>
      <div
        className="token-buttons"
        style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}
      >
        {tokens.map((t) => {
          const isSource = sourceToken?.symbol === t.symbol;
          const isTarget = targetToken?.symbol === t.symbol;
          const borderBase = isSource ? "#1976d2" : isTarget ? "#c2185b" : "#ccc";
          const ringColor = isSource ? "#90caf9" : isTarget ? "#f48fb1" : "transparent";
          const backgroundTint = isSource
            ? "rgba(25, 118, 210, 0.10)"
            : isTarget
            ? "rgba(194, 24, 91, 0.10)"
            : "#ffffff";

          return (
            <button
              key={t.symbol}
              onClick={() => onSelect(t)}
                          style={{
              padding: "12px 18px",
              borderRadius: 12,
              border: `${isSource || isTarget ? 2 : 1}px solid ${borderBase}`,
              backgroundColor: backgroundTint,
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              fontSize: 14,
              fontWeight: "500",
              color: "#000000",
              transition: "all 0.2s ease",
              position: "relative",
              boxShadow: (isSource || isTarget) ? `0 8px 24px ${ringColor}33` : "0 2px 6px rgba(0,0,0,0.05)",
              transform: (isSource || isTarget) ? "translateY(-2px)" : "none",
            }}
            >
              <img
                src={t.icon}
                alt={t.symbol}
                style={{ width: 20, height: 20 }}
              />
              {t.symbol}
            </button>
          );
        })}
        <button
          onClick={onReset}
          style={{
            background: "transparent",
            border: "none",
            color: "#666666",
            cursor: "pointer",
            textDecoration: "underline",
            fontSize: 14,
            fontWeight: "500",
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
