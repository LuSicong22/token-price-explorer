import { useEffect, useRef, useState } from "react";
import {
  getAssetErc20ByChainAndSymbol,
  getAssetPriceInfo,
} from "@funkit/api-base";
import TokenCard from "./components/TokenCard";
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

// App is the single stateful container responsible for:
// - Managing selected tokens, their live USD unit prices, and user-entered amounts
// - Converting between token amounts and USD using API prices
// - Keeping both cards in sync while preserving UX (no flicker while typing)
export default function App() {
  const [usdAmount, setUsdAmount] = useState(0);
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
  const [skipSourceInitOnSwap, setSkipSourceInitOnSwap] = useState(false);
  const [swapping, setSwapping] = useState(false);
  const swapAnimTimeoutRef = useRef(null);

  // Fetch USD unit price for the left (source) token whenever it changes.
  // By default we initialize to 1 unit and its USD value, except during a swap
  // where we purposely keep the user-entered amounts intact.
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

  // Cleanup any pending swap animation timeout on unmount
  useEffect(() => {
    return () => {
      if (swapAnimTimeoutRef.current) {
        clearTimeout(swapAnimTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    async function fetchSourcePrice() {
      if (!sourceToken) return;
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
        // If this source token change comes from a normal select, initialize default
        // If it comes from a swap, preserve the existing amounts/values
        if (!skipSourceInitOnSwap) {
          setSourceAmount("1");
          setUsdAmount(price);
        }
      } catch (err) {
        setError(true);
        setSourcePrice(null);
        setSourceAmount("");
      } finally {
        setLoadingSource(false);
        if (skipSourceInitOnSwap) setSkipSourceInitOnSwap(false);
      }
    }
    fetchSourcePrice();
  }, [sourceToken]);

  // Fetch USD unit price for the right (target) token when it changes.
  // We avoid fetching on every keystroke so the right card does not flicker
  // into a loading state while users are editing values.
  useEffect(() => {
    async function fetchTargetPrice() {
      if (!targetToken) return;
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
      } catch (err) {
        setError(true);
        setTargetPrice(null);
      } finally {
        setLoadingTarget(false);
      }
    }
    fetchTargetPrice();
  }, [targetToken]);

  // Recompute derived amounts/rates whenever relevant inputs or prices change.
  // This effect is purely computational – it does not trigger network calls or
  // loading states to keep the UI responsive during typing.
  useEffect(() => {
    if (!sourceToken || !targetToken) return;
    if (!sourcePrice || !targetPrice) return;
    if (usdAmount && !isNaN(usdAmount)) {
      setTargetAmount(formatTokenAmount(usdAmount / targetPrice));
    }
    setRateValue((sourcePrice / targetPrice).toFixed(6));
  }, [usdAmount, sourceToken, targetToken, sourcePrice, targetPrice]);

  // Handle token button clicks in the selector.
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

  // Swap left/right tokens and amounts while preserving user-entered values.
  const handleSwap = () => {
    if (!sourceToken || !targetToken) return;
    // Trigger quick UI feedback
    setSwapping(true);
    if (swapAnimTimeoutRef.current) clearTimeout(swapAnimTimeoutRef.current);
    swapAnimTimeoutRef.current = setTimeout(() => setSwapping(false), 500);

    // Prevent source init effect from resetting to 1
    setSkipSourceInitOnSwap(true);
    // Swap tokens
    setSourceToken(targetToken);
    setTargetToken(sourceToken);
    // Swap amounts
    setSourceAmount(targetAmount);
    setTargetAmount(sourceAmount);
    // Swap prices to avoid transient blanks while refetching
    setSourcePrice(targetPrice);
    setTargetPrice(sourcePrice);
  };

  const canSwap = Boolean(sourceToken && targetToken);

  // Format token amount dynamically
  const formatTokenAmount = (value) => {
    const num = Number(value);
    if (!Number.isFinite(num)) return "";
    const decimals = Math.abs(num) >= 1 ? 2 : 8;
    let str = num.toFixed(decimals);
    str = str.replace(/\.0+$/, "");
    str = str.replace(/(\.\d*?[1-9])0+$/, "$1");
    str = str.replace(/\.$/, "");
    if (str === "-0") return "0";
    return str;
  };

  // Derived USD values for display for each card based on its token amount
  // and that token's API price. This guarantees each card reflects its own
  // authoritative price instead of mirroring another card.
  const sourceUsdDisplay =
    sourcePrice && sourceAmount !== ""
      ? parseFloat(sourceAmount || 0) * sourcePrice
      : usdAmount || 0;
  const targetUsdDisplay =
    targetPrice && targetAmount !== ""
      ? parseFloat(targetAmount || 0) * targetPrice
      : usdAmount || 0;

  // User edited the USD field on the left (source) card.
  // We recompute both the source and target token amounts from this USD value.
  const handleSourceUsdChange = (nextUsd) => {
    if (!sourcePrice) return;
    const numericUsd = Number(nextUsd);
    if (isNaN(numericUsd)) return;
    setUsdAmount(numericUsd);
    if (numericUsd <= 0) {
      setSourceAmount("");
      setTargetAmount("");
      return;
    }
    const nextAmount = numericUsd / sourcePrice;
    setSourceAmount(formatTokenAmount(nextAmount));
    // Update target amount based on new USD value
    if (targetPrice) {
      const nextTargetAmount = numericUsd / targetPrice;
      setTargetAmount(formatTokenAmount(nextTargetAmount));
    }
  };

  // User edited the source token amount. We recompute USD, then target amount.
  const handleSourceAmountChange = (nextAmountStr) => {
    if (!sourcePrice) return;
    // Allow empty input
    if (nextAmountStr === "") {
      setSourceAmount("");
      setUsdAmount(0);
      setTargetAmount("");
      return;
    }
    const numericAmount = parseFloat(nextAmountStr);
    if (isNaN(numericAmount)) return;
    setSourceAmount(nextAmountStr);
    const nextUsd = numericAmount * sourcePrice;
    setUsdAmount(nextUsd);
    // Update target amount based on new USD value
    if (targetPrice) {
      const nextTargetAmount = (nextUsd / targetPrice).toFixed(2);
      setTargetAmount(nextTargetAmount);
    }
  };

  // User edited the USD field on the right (target) card.
  // We recompute both the target and source token amounts from this USD value.
  const handleTargetUsdChange = (nextUsd) => {
    if (!targetPrice) return;
    const numericUsd = Number(nextUsd);
    if (isNaN(numericUsd)) return;
    setUsdAmount(numericUsd);
    if (numericUsd <= 0) {
      setTargetAmount("");
      setSourceAmount("");
      return;
    }
    const nextAmount = numericUsd / targetPrice;
    setTargetAmount(formatTokenAmount(nextAmount));
    // Update source amount based on new USD value immediately
    if (sourcePrice) {
      const nextSourceAmount = (numericUsd / sourcePrice).toFixed(2);
      setSourceAmount(nextSourceAmount);
    }
  };

  // User edited the target token amount. We recompute USD, then source amount.
  const handleTargetAmountChange = (nextAmountStr) => {
    if (!targetPrice) return;
    // Allow empty input
    if (nextAmountStr === "") {
      setTargetAmount("");
      setUsdAmount(0);
      setSourceAmount("");
      return;
    }
    const numericAmount = parseFloat(nextAmountStr);
    if (isNaN(numericAmount)) return;
    setTargetAmount(nextAmountStr);
    const nextUsd = numericAmount * targetPrice;
    setUsdAmount(nextUsd);
    // Update source amount based on new USD value immediately
    if (sourcePrice) {
      const nextSourceAmount = (nextUsd / sourcePrice).toFixed(2);
      setSourceAmount(nextSourceAmount);
    }
  };

  return (
    <div className="app-shell">
      <div
        className="app-card"
        style={{
          width: "100%",
          maxWidth: 820,
          background: "linear-gradient(#ffffff, #ffffff) padding-box, linear-gradient(135deg, #90caf9, #f48fb1) border-box",
          padding: 32,
          borderRadius: 16,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          minHeight: 460,
          border: "1px solid transparent",
          backdropFilter: "saturate(180%) blur(10px)",
        }}
      >
        <h1
          className="app-title"
          style={{
            textAlign: "center",
            fontSize: 32,
            fontWeight: "700",
            marginBottom: 36,
            letterSpacing: 0.2,
          }}
        >
          <span className="gradient-text">Token Price Explorer</span>
        </h1>
    


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

        <div className={`cards-grid ${swapping ? "swapping" : ""}`}>
          <div className="grid-left">
            <TokenCard
              token={sourceToken}
              usdAmount={sourceUsdDisplay}
              amount={sourceAmount}
              loading={loadingSource}
              error={error}
              editable
              onUsdChange={handleSourceUsdChange}
              onAmountChange={handleSourceAmountChange}
              labelColor="#90caf9"
              cornerLabel="FROM"
              cornerColor="#1976d2"
            />
          </div>
          <button
            className={`swap-btn ${swapping ? "is-swapping" : ""}`}
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
              usdAmount={targetUsdDisplay}
              amount={targetAmount}
              loading={loadingTarget}
              error={error}
              editable
              onUsdChange={handleTargetUsdChange}
              onAmountChange={handleTargetAmountChange}
              labelColor="#f48fb1"
              cornerLabel="TO"
              cornerColor="#c2185b"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
