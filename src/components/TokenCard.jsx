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
  editable = false,
  onUsdChange,
  onAmountChange,
  onUsdBlur,
  onAmountBlur,
}) {
  return (
    <div
      className="token-card"
      style={{
        width: 320,
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
      
      <div style={{ textAlign: "left", marginTop: 12 }}>
        {loading ? (
          <Skeleton width="120px" />
        ) : error ? (
          <p style={{ margin: 0, color: "red" }}>Error fetching price</p>
        ) : token ? (
          <>
            {editable ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => onAmountChange && onAmountChange(e.target.value)}
                    style={{
                      flex: 1,
                      padding: 8,
                      borderRadius: 6,
                      border: "1px solid #e5e5e5",
                      fontSize: 16,
                      fontWeight: "600",
                      backgroundColor: "#ffffff",
                      color: "#000000",
                      textAlign: "left",
                    }}
                  />
                  <img
                    src={token.icon}
                    alt={token.symbol}
                    style={{ width: 24, height: 24 }}
                  />
                  <span style={{ fontSize: 14, fontWeight: "500", color: "#333" }}>{token.symbol}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "center", color: "#666", fontSize: 14 }}>≈</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: "500", color: "#333" }}>$</span>
                  <input
                    type="number"
                    value={Number.isFinite(usdAmount) ? usdAmount : ""}
                    onChange={(e) => onUsdChange && onUsdChange(e.target.value)}
                    style={{
                      flex: 1,
                      padding: 8,
                      borderRadius: 6,
                      border: "1px solid #e5e5e5",
                      fontSize: 16,
                      fontWeight: "600",
                      backgroundColor: "#ffffff",
                      color: "#000000",
                      textAlign: "left",
                    }}
                  />
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 18, fontWeight: "700", color: "#000" }}>{amount}</span>
                  <img
                    src={token.icon}
                    alt={token.symbol}
                    style={{ width: 24, height: 24 }}
                  />
                  <span style={{ fontSize: 16, fontWeight: "600", color: "#333" }}>{token.symbol}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "center", color: "#666", fontSize: 14, marginBottom: 8 }}>≈</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 16, fontWeight: "600", color: "#333" }}>$</span>
                  <span style={{ fontSize: 18, fontWeight: "700", color: "#000" }}>{usdAmount}</span>
                </div>
              </>
            )}
          </>
        ) : (
          <p style={{ margin: 0, color: "#888" }}>Please select token</p>
        )}
      </div>
    </div>
  );
}
