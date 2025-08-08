import Skeleton from "./Skeleton";

function hexToRgba(hex, alpha) {
  const sanitized = hex.replace("#", "");
  const bigint = parseInt(sanitized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function TokenCard({
  token,
  usdAmount,
  amount,
  loading,
  error,
  labelColor = "#000",
}) {
  return (
    <div
      className="token-card"
      style={{
        width: 280,
        height: 180,
        border: `1px solid ${labelColor}`,
        padding: 20,
        borderRadius: 8,
        backgroundColor: hexToRgba(labelColor, 0.06),
        color: "#000000",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        cursor: "default",
      }}
    >
      
      {token && (
        <img
          src={token.icon}
          alt={token.symbol}
          style={{ width: 40, height: 40 }}
        />
      )}
      <div style={{ textAlign: "left", marginTop: 12 }}>
        {loading ? (
          <Skeleton width="120px" />
        ) : error ? (
          <p style={{ margin: 0, color: "red" }}>Error fetching price</p>
        ) : token ? (
          <>
            <strong>{usdAmount} USD</strong>
            <p style={{ margin: 0 }}>
              ≈ {amount} {token.symbol}
            </p>
          </>
        ) : (
          <p style={{ margin: 0, color: "#888" }}>Please select token</p>
        )}
      </div>
    </div>
  );
}
