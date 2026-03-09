# 🏺 The Water Jug Trials — An Ancient Arcane Puzzle

> *Measure the sacred volume — by your own hand, or let the arcane intelligence guide the way.*

---

## 📖 About the Project

**The Water Jug Trials** is an interactive, browser-based puzzle game built around the classic **Water Jug Problem** — a well-known problem in Artificial Intelligence and Mathematics. The game challenges players to measure an exact target amount of water using two vessels (jugs) of different capacities through a series of **Fill**, **Empty**, and **Pour** operations.

The project is wrapped in an immersive **fantasy/arcane theme** with glowing runes, star fields, animated water, sound effects, and a mystical dark UI — making it both an educational tool and an engaging experience.

---

## 🌟 Key Features

### ⚗️ Manual Mode
- Solve the Water Jug puzzle **by hand** using interactive buttons
- **Fill**, **Empty**, and **Pour** water between two vessels
- **Drag & Drop** support — drag jugs to the tap to fill, or drag one jug to another to pour
- Real-time move counter tracks your progress
- Animated **water flow from tap** using GSAP when filling jugs
- Win celebration with **confetti animation** and a modal popup on reaching the goal

### 🔮 AI Oracle Mode
- The **BFS (Breadth-First Search) algorithm** automatically finds the **optimal (shortest) solution**
- Step-by-step **animated playback** — watch each operation execute with smooth animations
- **Oracle Scroll panel** displays the solution path in real-time as it plays
- Completion popup shows the full solution path with total step count
- Jugs **glow** when the goal is reached

### 🎨 Visual & Audio Design
- **Fantasy-themed dark UI** with deep blues, glowing accents, and arcane aesthetics
- **Star field** — dynamically generated twinkling stars in the hero section
- **Rune rings** — rotating mystical circles with Norse rune characters
- **Animated water** — smooth water level transitions with GSAP bounce effects
- **Water stream from tap** — visible flowing water animation during fill operations
- **Wisp particles** — floating glowing particles around mode selection cards
- **Confetti celebration** — 120 colorful confetti pieces on puzzle completion
- **Sound effects** generated via **Web Audio API** (no external audio files needed):
  - Water fill sound (rising tone)
  - Pour/transfer sound
  - Empty/drain sound
  - Victory fanfare on win

### 📱 Progressive Web App (PWA)
- Fully installable on **mobile phones and desktops**
- **Offline support** — all game files are cached via Service Worker
- **Forced landscape mode** — shows a "Rotate Thy Device" overlay on portrait-oriented mobile screens
- Custom app icon (512×512) for home screen installation
- Splash screen with theme colors

---

## 🧠 How the BFS Algorithm Works

The AI solver is implemented in [`ai_bfs.js`](ai_bfs.js) (Lines 40–80) using **Breadth-First Search (BFS)**:

### Algorithm Overview

1. **State Representation**: Each state is a pair `(a, b)` — the current water amount in Vessel A and Vessel B
2. **Initial State**: `(0, 0)` — both jugs start empty
3. **Goal State**: Any state where `a == goal` or `b == goal`
4. **Transitions (6 possible moves per state)**:
   - **Fill A** → `(capA, b)` — fill Vessel A to its full capacity
   - **Fill B** → `(a, capB)` — fill Vessel B to its full capacity
   - **Empty A** → `(0, b)` — dump all water from Vessel A
   - **Empty B** → `(a, 0)` — dump all water from Vessel B
   - **Pour A → B** → transfer water from A to B (limited by B's remaining capacity)
   - **Pour B → A** → transfer water from B to A (limited by A's remaining capacity)
5. **Visited Set**: Prevents revisiting the same `(a, b)` state
6. **Path Tracking**: Each queue entry carries its full path history for solution reconstruction

### Why BFS?
BFS explores all states **level by level** (shortest moves first), guaranteeing the **optimal (minimum-step) solution**. Unlike DFS which may find a longer path first, BFS always finds the shortest path in an unweighted state-space graph.

### Time & Space Complexity
- **Time**: O(capA × capB) — at most `capA × capB` unique states
- **Space**: O(capA × capB) — for the visited set and queue

### Example
For `capA = 4, capB = 3, goal = 2`:
```
Step 1: Fill B        → [0, 3]
Step 2: Pour B → A    → [3, 0]
Step 3: Fill B        → [3, 3]
Step 4: Pour B → A    → [4, 2]  ← Goal reached! (B = 2)
```

---

## 🛠️ Tech Stack

| Technology         | Usage                                                   |
|--------------------|---------------------------------------------------------|
| **HTML5**          | Page structure with semantic markup                     |
| **CSS3**           | Styling, gradients, keyframe animations, glassmorphism  |
| **JavaScript (ES6+)** | Game logic, BFS solver, DOM manipulation, async/await |
| **GSAP 3.12**      | Smooth water animations, jug movements, transitions    |
| **Web Audio API**  | Procedurally generated sound effects                    |
| **Service Worker** | Offline caching for PWA functionality                   |
| **Web App Manifest** | PWA installation and app metadata                    |

---

## 📂 Project Structure

```
AI GAME PROJECT/
│
├── index.html             # Landing page — hero section + mode selection
├── manual_mode.html       # Manual puzzle mode — solve it yourself
├── ai_mode.html           # AI Oracle mode — BFS auto-solver with animation
│
├── landing.css            # Landing page styles (stars, rune rings, cards)
├── landing.js             # Star field generator + wisp particle effects
├── gamepage.css           # Master stylesheet (imports all game CSS modules)
│
├── css/
│   ├── game-base.css      # Body, game container, title bar, back link
│   ├── game-controls.css  # Control bar (inputs, buttons, layout)
│   ├── game-jugs.css      # Tap image, jug styling, water fill, animations
│   ├── game-ai-panel.css  # Oracle Scroll panel (AI mode only)
│   └── game-modals.css    # Win modal overlay + confetti styles
│
├── state.js               # Shared game state management
├── operations.js          # Fill, pour, empty operations + event listeners
├── animations.js          # GSAP water animations, tap flow, jug movement
├── sounds.js              # Web Audio API — procedural sound generation
├── drag.js                # Drag-and-drop for jugs (Manual Mode)
├── ai_bfs.js              # BFS solver + animated step playback (AI Mode)
│
├── sw.js                  # Service Worker — caches all files for offline play
├── manifest.json          # PWA manifest (name, icon, orientation, colors)
│
├── background_image.png   # Game board background texture
├── tap_image.png          # Water tap/faucet image
├── icon-512.png           # App icon (512×512) for PWA installation
└── .gitignore             # Git ignore rules
```

---

## 🚀 How to Run

### Option 1: Open Directly
Simply double-click `index.html` or open it in any modern browser (Chrome, Edge, Firefox, Safari).

> ⚠️ Some features (Service Worker, PWA install) require a proper server — see Option 2.

### Option 2: Local Server (Recommended)
```bash
# Using Python 3
python -m http.server 8000

# OR using Node.js
npx serve .

# OR using PHP
php -S localhost:8000
```
Then open `http://localhost:8000` in your browser.

### Option 3: Install as PWA
1. Open the game in **Chrome** or **Edge** (on phone or desktop)
2. Look for the **Install** button in the address bar, or go to **Menu → Install App**
3. The game is added to your home screen / desktop and works **fully offline**

---

## 🎮 How to Play

### Manual Mode
1. Enter capacities for **Vessel A** and **Vessel B** (e.g., 4 and 3)
2. Enter the **Goal** (target amount, e.g., 2)
3. Click **Set** to configure the puzzle
4. Use the **Fill**, **Pour**, and **Empty** buttons to manipulate the jugs
5. You can also **drag** a jug to the tap (fill) or drag one jug over another (pour)
6. Reach the goal amount in either jug to win! 🎉

### AI Oracle Mode
1. Enter capacities for **Vessel A**, **Vessel B**, and the **Goal**
2. Click **Set** to configure, then click **Invoke Oracle**
3. Watch the BFS algorithm solve the puzzle step-by-step with animations
4. The **Oracle Scroll** panel shows each operation in real-time
5. On completion, a popup displays the full solution path

---

## 📱 Converting to a Mobile App (Play Store / APK)

Since this is already a **Progressive Web App**, it can be converted to a native Android app:

### Option 1: PWABuilder (Easiest)
1. Host the game on **HTTPS** (e.g., GitHub Pages, Netlify, Vercel)
2. Visit [pwabuilder.com](https://www.pwabuilder.com/)
3. Enter your hosted URL → click **Package**
4. Download the generated **APK / AAB** file
5. Upload to the **Google Play Store**

### Option 2: TWA (Trusted Web Activity)
- Uses [Bubblewrap CLI](https://github.com/nicedoc/nicedoc.io) to wrap the PWA
- Runs in Chrome (not a WebView) — best performance
- Requires HTTPS hosting + Digital Asset Links verification

### Option 3: Capacitor (Ionic)
```bash
npm install @capacitor/core @capacitor/cli
npx cap init "Water Jug Trials" com.waterjug.trials
npx cap add android
npx cap sync
npx cap open android    # Opens in Android Studio → Build APK
```

### Requirements for Play Store
- Google Play Developer account (**$25 one-time fee**)
- App must be hosted on **HTTPS**
- App icons in required sizes (512×512 already included ✅)
- Privacy policy page (for Play Store listing)

---

## 🎓 Academic Relevance

This project demonstrates several concepts from **Computer Science** and **AI**:

| Concept                       | Implementation                              |
|-------------------------------|---------------------------------------------|
| **BFS (Breadth-First Search)**| Optimal state-space search in `ai_bfs.js`   |
| **State-Space Problem**       | Water Jug as a graph search problem         |
| **Graph Traversal**           | Explored via queue with visited set         |
| **Progressive Web Apps**      | Service Worker, Manifest, offline-first     |
| **Procedural Audio**          | Web Audio API oscillator-based sound effects|
| **Animation Systems**         | GSAP timeline for sequenced animations      |

---

## 👥 Credits

- **Game Design & Development**: Project Team
- **BFS Algorithm**: Classic AI state-space search implementation
- **Fonts**: [Cinzel](https://fonts.google.com/specimen/Cinzel) & [Raleway](https://fonts.google.com/specimen/Raleway) (Google Fonts)
- **Animation Library**: [GSAP 3.12](https://greensock.com/gsap/)

---

<p align="center"><em>✦ &nbsp; The Water Jug Trials &nbsp; ✦ &nbsp; An Ancient Arcane Puzzle &nbsp; ✦</em></p>
