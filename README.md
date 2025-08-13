# 🪙 Token Price Explorer

A React + Vite app for exploring and converting between different cryptocurrency tokens with real-time pricing. Features a refined, Fun.xyz‑inspired minimalist design, responsive layout, and interactive token conversion cards.

🔗 **Live Demo**: [https://token-price-explorer-rosy.vercel.app/](https://token-price-explorer-rosy.vercel.app/)

---

## ✨ Features

- 🔘 Select two tokens (source & target) from supported list
- ✏️ **Editable token cards** - input either token amount or USD value directly in each card
- 💱 **Two-way conversion** - change any field and all others update automatically
- 📊 **Real-time API pricing** - each token's USD value calculated independently from live data
- 🔁 Modern swap button with gradient border and color‑coded arrows (blue/pink)
- 🧱 Responsive layout with grid; auto switches to vertical stack on small screens
- ↕️ Swap button auto-rotates 90° when cards stack vertically
- 📱 Mobile‑first design using `svh` and media queries
- 🧩 Optimized card sizing with no excess whitespace
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

## 🧠 Key Features & Design Notes

- 🔒 **Four supported tokens**: USDC, USDT, ETH, WBTC
- ❌ Same token cannot be selected for both source and target
- 🎯 Selecting the same token again resets the pair
- 🔁 **Swap button** reverses source/target instantly
- 💡 **Live API pricing**: Token addresses and pricing fetched dynamically
- ✏️ **Editable fields**: Both token amount and USD value can be edited in each card
- 🔄 **Smart syncing**: Changes in any field automatically update all related values
- 🎨 **Clean UI**: Removed separate USD input section for streamlined experience
- 📱 **Responsive design**: Grid layout centers cards on desktop, stacks vertically on mobile

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
