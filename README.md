# 🪙 Token Price Explorer

A React + Vite app for comparing token values from a USD amount. It now features a refined, Fun.xyz‑inspired minimalist design, responsive layout, and polished interactions.

🔗 **Live Demo**: [https://token-price-explorer-rosy.vercel.app/](https://token-price-explorer-rosy.vercel.app/)

---

## ✨ Features

- 🔘 Select two tokens (source & target)
- 💰 Enter USD amount, get precise token amounts
- 📉 Live exchange rate between selected tokens
- 🔁 Modern swap button with gradient border and color‑coded arrows (blue/pink)
- 🧱 Responsive layout with grid; auto switches to vertical stack on small screens
- ↕️ Swap button auto-rotates 90° when cards stack vertically
- 📱 Mobile‑first fixes using `svh` and media queries; default no scrollbars on desktop but scrolls when needed
- 🧩 Consistent card heights; app card uses a minimum height to prevent layout jump
- ⚠️ Clear loading, error, and disabled states

---

## 🛠️ Tech Stack

- ⚛️ [React](https://reactjs.org/)
- ⚡ [Vite](https://vitejs.dev/)
- 🔌 [`@funkit/api-base`](https://www.npmjs.com/package/@funkit/api-base) for token metadata & price info
- 🎨 Vanilla CSS (no framework) with design tokens and media queries
- ☁️ [Vercel](https://vercel.com/) for deployment

---

## 📦 Getting Started

```bash
git clone https://github.com/LuSicong22/token-price-explorer.git
cd token-price-explorer
npm install
npm run dev
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_FUNKIT_API_KEY=Z9SZaOwpmE40KX61mUKWm5hrpGh7WHVkaTvQJpQk
```

This key is used to fetch token metadata and live prices from the Funkit API.

---

## 🧠 Assumptions & Design Notes

- 🔒 Only four tokens are supported (USDC, USDT, ETH, WBTC) for simplicity
- ❌ Same token cannot be selected for both source and target
- 🎯 Selecting the same token again resets the pair
- 🔁 Swap button reverses source/target instantly
- 💡 Token addresses and pricing are dynamically fetched via `getAssetErc20ByChainAndSymbol()` and `getAssetPriceInfo()`
- 🧭 App card has `min-height: 580px`; prevents ExchangeRate from stretching the card
- 🧱 Token cards use fixed size to avoid layout shift between states
- 🔁 Grid layout centers cards on desktop; when viewport is narrow the grid stacks (1 column) and the swap button rotates vertically

---

## 🧪 Potential Improvements

- Add historical chart for token price movement
- Enable dynamic token list loading from API
- Copyable exchange summary + share link
- Theme tokens and dark mode
- Integration tests/E2E for responsive behavior

---

## 📤 Deployment

Deployed via [Vercel](https://vercel.com) with the default React + Vite setup. You can deploy your own version by:

1. Forking the repo
2. Linking it to Vercel
3. Adding your `.env` variable in the dashboard

---

## 📄 License

MIT
