# 🏺 The Water Jug Trials

> *An ancient arcane puzzle — measure the sacred volume by your own hand, or let the AI Oracle guide the way.*

## 🎮 About

**The Water Jug Trials** is a browser-based puzzle game built around the classic **Water Jug Problem** from mathematics and computer science. Set in a fantasy/arcane theme, players must measure a specific amount of water using two vessels of different capacities through fill, empty, and pour operations.

The game offers two modes:
- **⚗️ Manual Mode** — Solve the puzzle yourself using fill, pour, and empty operations.
- **🔮 AI Oracle Mode** — Watch the AI solve the puzzle optimally using a Breadth-First Search (BFS) algorithm, animated step-by-step.

---

## ✨ Features

- 🎨 **Fantasy-themed UI** — Arcane rune rings, star fields, mystic animations, and a premium dark design
- 🧠 **AI Solver (BFS)** — The Oracle finds the optimal (shortest) solution path automatically
- 💧 **Water Animations** — GSAP-powered fluid animations, tap water flow, and smooth jug transitions
- 🔊 **Sound Effects** — Immersive audio with Web Audio API (fill, pour, empty, and win sounds)
- 📱 **PWA (Progressive Web App)** — Install on your phone or desktop, works offline
- 🔄 **Forced Landscape Mode** — Automatically prompts rotation on portrait-mode mobile devices
- 🖱️ **Drag & Drop** — Drag jugs to pour water between them (Manual Mode)
- 🎊 **Win Celebration** — Confetti animation and modal on reaching the goal

---

## 🛠️ Tech Stack

| Technology       | Usage                                       |
|------------------|---------------------------------------------|
| HTML5            | Structure and semantic markup               |
| CSS3             | Styling, animations, gradients, glassmorphism|
| JavaScript (ES6) | Game logic, state management, DOM manipulation|
| GSAP 3.12        | Smooth water and jug animations             |
| Web Audio API    | Sound effects generation                    |
| Service Worker   | Offline caching for PWA functionality       |

---

## 📂 Project Structure

```
AI GAME PROJECT/
├── index.html           # Landing page (hero + mode selection)
├── manual_mode.html     # Manual puzzle mode
├── ai_mode.html         # AI Oracle solver mode
├── landing.css          # Landing page styles
├── landing.js           # Star field & wisp particle generators
├── gamepage.css         # Master stylesheet (imports all game CSS)
├── css/
│   ├── game-base.css    # Body, game container, title, back link
│   ├── game-controls.css# Control bar, inputs, buttons
│   ├── game-jugs.css    # Tap, jugs, water fill, animations
│   ├── game-ai-panel.css# Oracle Scroll AI panel (AI mode)
│   └── game-modals.css  # Win modal, confetti
├── state.js             # Game state management
├── operations.js        # Fill, pour, empty operations + event wiring
├── animations.js        # GSAP water animations, tap flow, confetti
├── sounds.js            # Web Audio API sound effects
├── drag.js              # Drag-and-drop for jugs (Manual Mode)
├── ai_bfs.js            # BFS solver + animated step playback
├── sw.js                # Service Worker for offline caching
├── manifest.json        # PWA manifest (name, icons, orientation)
├── background_image.png # Game background texture
├── tap_image.png        # Tap/faucet image
└── icon-512.png         # App icon (512×512)
```

---

## 🚀 How to Run

### Option 1: Open Directly
Simply open `index.html` in any modern browser (Chrome, Edge, Firefox, Safari).

### Option 2: Local Server (Recommended for PWA)
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .
```
Then visit `http://localhost:8000` in your browser.

### Option 3: Install as PWA
1. Open the game in **Chrome** or **Edge** on your phone/desktop
2. Look for the **"Install"** prompt or go to **Menu → Install App**
3. The game will be added to your home screen and work offline!

---

## 📱 Converting to a Mobile App (Play Store)

**Yes, it is possible to publish this as an Android app on the Google Play Store!** Since this project is already a PWA, here are the best approaches:

### 1. 🏆 TWA (Trusted Web Activity) — Recommended
A TWA wraps your hosted PWA in a lightweight Android shell with **no WebView overhead**. It runs in Chrome and feels native.

- **Tool**: [Bubblewrap CLI](https://github.com/nicedoc/nicedoc.io) or [PWABuilder](https://www.pwabuilder.com/)
- **Steps**: Host your PWA → Generate APK/AAB with Bubblewrap → Publish to Play Store
- **Requirement**: Your PWA must be hosted on HTTPS with a valid domain

### 2. ⚡ Capacitor (Ionic)
Wraps your web app in a native WebView with access to native device APIs (camera, GPS, etc.).

```bash
npm install @capacitor/core @capacitor/cli
npx cap init
npx cap add android
npx cap sync
npx cap open android   # Opens in Android Studio
```

### 3. 🔧 PWABuilder.com (Easiest)
1. Host your PWA on any HTTPS URL
2. Visit [pwabuilder.com](https://www.pwabuilder.com/)
3. Enter your URL → it generates a ready-to-publish APK/AAB
4. Upload to Google Play Store

### Requirements for Play Store
- Google Play Developer account ($25 one-time fee)
- The PWA must be hosted on **HTTPS**
- A valid **Digital Asset Links** file for TWA verification
- App icons in required sizes (you already have 512×512 ✅)

---

## 🎓 Academic Context

This project demonstrates:
- **BFS (Breadth-First Search)** algorithm for state-space search
- **State-space problem solving** (Water Jug as a classic AI problem)
- **Progressive Web App** architecture
- **CSS animations** and **GSAP** for rich UI/UX
- **Web Audio API** for sound design without external files

---

## 📜 License

This project is created for educational and demonstration purposes.

---

<p align="center">✦ &nbsp; The Water Jug Trials &nbsp; ✦ &nbsp; An Ancient Arcane Puzzle &nbsp; ✦</p>
