import { useEffect, useState } from "react";
import {
  getAssetErc20ByChainAndSymbol,
  getAssetPriceInfo,
} from "@funkit/api-base";
import TokenCard from "./components/TokenCard";
import ExchangeRate from "./components/ExchangeRate";
import TokenSelector from "./components/TokenSelector";

const API_KEY = import.meta.env.VITE_FUNKIT_API_KEY;

const tokens = [
  {
    symbol: "USDC",
    chainId: "1",
    icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
  },
  {
    symbol: "USDT",
    chainId: "137",
    icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
  },
  {
    symbol: "ETH",
    chainId: "8453",
    icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png",
  },
  {
    symbol: "WBTC",
    chainId: "1",
    icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png",
  },
];

export default function App() {
  const [usdAmount, setUsdAmount] = useState(100);
  const [sourceToken, setSourceToken] = useState(null);
  const [targetToken, setTargetToken] = useState(null);
  const [sourceAmount, setSourceAmount] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [rateValue, setRateValue] = useState("");
  const [sourcePrice, setSourcePrice] = useState(null);
  const [targetPrice, setTargetPrice] = useState(null);
  const [loadingSource, setLoadingSource] = useState(false);
  const [loadingTarget, setLoadingTarget] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes pulse {
        0% { opacity: 1 }
        50% { opacity: 0.4 }
        100% { opacity: 1 }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    async function fetchSourcePrice() {
      if (!usdAmount || isNaN(usdAmount) || !sourceToken) return;
      setLoadingSource(true);
      setError(false);
      try {
        const info = await getAssetErc20ByChainAndSymbol({
          chainId: sourceToken.chainId,
          symbol: sourceToken.symbol,
          apiKey: API_KEY,
        });
        const address = info?.tokenAddress ?? info?.address;
        const res = await getAssetPriceInfo({
          chainId: sourceToken.chainId,
          assetTokenAddress: address,
          apiKey: API_KEY,
        });
        const price = parseFloat(res?.unitPrice ?? res?.price);
        if (isNaN(price)) throw new Error("Invalid price");
        setSourcePrice(price);
        setSourceAmount((usdAmount / price).toFixed(6));
      } catch (err) {
        setError(true);
        setSourcePrice(null);
        setSourceAmount("");
      } finally {
        setLoadingSource(false);
      }
    }
    fetchSourcePrice();
  }, [usdAmount, sourceToken]);

  useEffect(() => {
    async function fetchTargetPriceAndRate() {
      if (!usdAmount || isNaN(usdAmount)) return;
      if (!sourceToken || !sourcePrice || !targetToken) return;
      setLoadingTarget(true);
      setError(false);
      try {
        const info = await getAssetErc20ByChainAndSymbol({
          chainId: targetToken.chainId,
          symbol: targetToken.symbol,
          apiKey: API_KEY,
        });
        const address = info?.tokenAddress ?? info?.address;
        const res = await getAssetPriceInfo({
          chainId: targetToken.chainId,
          assetTokenAddress: address,
          apiKey: API_KEY,
        });
        const price = parseFloat(res?.unitPrice ?? res?.price);
        if (isNaN(price)) throw new Error("Invalid price");
        setTargetPrice(price);
        setTargetAmount((usdAmount / price).toFixed(6));
        setRateValue((sourcePrice / price).toFixed(6));
      } catch (err) {
        setError(true);
        setTargetPrice(null);
        setTargetAmount("");
        setRateValue("");
      } finally {
        setLoadingTarget(false);
      }
    }
    fetchTargetPriceAndRate();
  }, [usdAmount, sourceToken, sourcePrice, targetToken]);

  const handleSelectToken = (t) => {
    if (!sourceToken && !targetToken) {
      setSourceToken(t);
    } else if (sourceToken && !targetToken && t.symbol !== sourceToken.symbol) {
      setTargetToken(t);
    } else {
      setSourceToken(t);
      setTargetToken(null);
      setTargetAmount("");
      setRateValue("");
    }
  };

  const handleSwap = () => {
    if (sourceToken && targetToken) {
      setSourceToken(targetToken);
      setTargetToken(sourceToken);
    }
  };

  const canSwap = Boolean(sourceToken && targetToken);

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100svh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to right, #e3f2fd, #fce4ec)",
        padding: 0,
      }}
    >
      <div
        className="app-card"
        style={{
          width: "100%",
          maxWidth: 760,
          backgroundColor: "#ffffff",
          padding: 32,
          borderRadius: 8,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          minHeight: 590,
          border: "1px solid #e5e5e5",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            fontSize: 32,
            fontWeight: "600",
            marginBottom: 8,
            background: "linear-gradient(to right, #1976d2, #c2185b)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Token Price Explorer
        </h1>
        <p
          style={{
            textAlign: "center",
            color: "#666666",
            marginTop: 0,
            fontSize: 16,
          }}
        >
          Enter an amount in USD and select two tokens to compare.
        </p>

        <div style={{ marginTop: 24, marginBottom: 24 }}>
          <label
            style={{
              fontWeight: "500",
              color: "#000000",
              fontSize: 14,
              marginBottom: 8,
              display: "block",
            }}
          >
            Enter USD Amount:
          </label>
          <input
            type="number"
            value={usdAmount}
            onChange={(e) => setUsdAmount(Number(e.target.value))}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 6,
              border: "1px solid #e5e5e5",
              fontSize: 16,
              backgroundColor: "#ffffff",
              color: "#000000",
            }}
          />
        </div>

        <TokenSelector
          tokens={tokens}
          sourceToken={sourceToken}
          targetToken={targetToken}
          onSelect={handleSelectToken}
          onReset={() => {
            setSourceToken(null);
            setTargetToken(null);
            setSourceAmount("");
            setTargetAmount("");
            setRateValue("");
          }}
        />

        <div className="cards-grid">
          <div className="grid-left">
            <TokenCard
              token={sourceToken}
              usdAmount={usdAmount}
              amount={sourceAmount}
              loading={loadingSource}
              error={error}
              labelColor="#90caf9"
            />
          </div>
          <button
            className="swap-btn"
            onClick={handleSwap}
            disabled={!canSwap}
            style={{
              backgroundColor: canSwap ? "#ffffff" : "#f5f5f5",
              border: canSwap ? "1px solid transparent" : "1px solid #e5e5e5",
              borderRadius: "50%",
              width: 52,
              height: 52,
              padding: 10,
              cursor: canSwap ? "pointer" : "not-allowed",
              opacity: canSwap ? 1 : 0.6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
              boxShadow: canSwap ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
              background: canSwap
                ? "linear-gradient(#ffffff, #ffffff) padding-box, linear-gradient(to right, #1976d2, #c2185b) border-box"
                : "linear-gradient(#f5f5f5, #f5f5f5) padding-box, linear-gradient(to right, #e5e5e5, #e5e5e5) border-box",
            }}
            aria-label="Swap tokens"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M8 7h8m0 0l-3-3m3 3l-3 3"
                stroke={canSwap ? "#90caf9" : "#9ca3af"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 17H8m0 0l3-3m-3 3l3 3"
                stroke={canSwap ? "#f48fb1" : "#9ca3af"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div className="grid-right">
            <TokenCard
              token={targetToken}
              usdAmount={usdAmount}
              amount={targetAmount}
              loading={loadingTarget}
              error={error}
              labelColor="#f48fb1"
            />
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <ExchangeRate
            loading={loadingTarget}
            error={error}
            sourceToken={sourceToken}
            targetToken={targetToken}
            rateValue={rateValue}
          />
        </div>
      </div>
    </div>
  );
}
