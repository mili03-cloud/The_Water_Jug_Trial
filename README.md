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



