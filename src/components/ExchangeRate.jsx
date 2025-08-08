import Skeleton from "./Skeleton";

export default function ExchangeRate({
  loading,
  error,
  sourceToken,
  targetToken,
  rateValue,
}) {
  if (error || !sourceToken || !targetToken || !rateValue) return null;
  return loading ? (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Skeleton width="220px" height="20px" />
    </div>
  ) : (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <img
        src={sourceToken.icon}
        alt={sourceToken.symbol}
        style={{ width: 24, height: 24 }}
      />
      1 {sourceToken.symbol} ≈
      <img
        src={targetToken.icon}
        alt={targetToken.symbol}
        style={{ width: 24, height: 24 }}
      />
      {rateValue} {targetToken.symbol}
    </div>
  );
}
