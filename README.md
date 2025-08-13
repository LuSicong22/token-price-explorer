# 🪙 Token Price Explorer

A React + Vite app for exploring and converting between different cryptocurrency tokens with real-time pricing. Features a refined, Fun.xyz‑inspired minimalist design, responsive layout, and interactive token conversion cards.

🔗 **Live Demo**: [https://token-price-explorer-rosy.vercel.app/](https://token-price-explorer-rosy.vercel.app/)

---

## ✨ Features

- 🔘 Choose a source and target token from a centered selector (Reset on the right)
- ✏️ Edit either the token amount or USD value on both cards
- 💱 Instant two‑way conversion with smart syncing across fields
- 📊 Live prices via Funkit API; each card computes USD from its own price
- 🔁 Gradient swap button with blue/pink arrows
- 🏷️ FROM/TO badges for clear context
- ⏳ Two‑line loading skeletons sized like the inputs (stable layout)
- 🧱 Responsive grid; stacks on small screens and rotates the swap icon
- 🎨 Cohesive web3 look: gradient title, glassy cards, aurora backdrop
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

## 🧠 Notes

- Supports USDC, USDT, ETH, and WBTC
- Same token cannot be selected for both sides; selecting the same token again resets the pair
- Swap reverses sides while preserving values

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
