export default function Skeleton({ width = "100px", height = "16px" }) {
  return (
    <div
      style={{
        backgroundColor: "#eee",
        height,
        width,
        borderRadius: "4px",
        animation: "pulse 1.2s infinite ease-in-out",
      }}
    />
  );
}
