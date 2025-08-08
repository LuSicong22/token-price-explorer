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
          const borderColor =
            sourceToken?.symbol === t.symbol
              ? "#90caf9"
              : targetToken?.symbol === t.symbol
              ? "#f48fb1"
              : "#ccc";

          return (
            <button
              key={t.symbol}
              onClick={() => onSelect(t)}
                          style={{
              padding: "10px 16px",
              borderRadius: 6,
              border: `1px solid ${borderColor}`,
              backgroundColor: "#ffffff",
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              fontSize: 14,
              fontWeight: "500",
              color: "#000000",
              transition: "all 0.2s ease",
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
