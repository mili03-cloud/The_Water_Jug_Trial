/* =======================================================
   THE WATER JUG TRIALS — Landing Page Script
   ======================================================= */

// ---- generate star field ----
const starsEl = document.getElementById('stars');
for (let i = 0; i < 180; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    const size = Math.random() * 2 + 0.5;
    s.style.cssText = `
        left:${Math.random() * 100}%;
        top:${Math.random() * 100}%;
        width:${size}px;
        height:${size}px;
        animation-duration:${2 + Math.random() * 4}s;
        animation-delay:${Math.random() * 4}s;
        opacity:${0.2 + Math.random() * 0.5};
    `;
    starsEl.appendChild(s);
}

// ---- wisp particles on hero ----
const hero = document.getElementById('hero');
for (let i = 0; i < 18; i++) {
    const w = document.createElement('div');
    w.className = 'wisp';
    const hue = Math.random() > 0.5 ? '200' : '170';
    w.style.cssText = `
        left:${20 + Math.random() * 60}%;
        bottom:${5 + Math.random() * 30}%;
        background:hsl(${hue},100%,75%);
        box-shadow:0 0 6px hsl(${hue},100%,75%);
        animation-duration:${3 + Math.random() * 4}s;
        animation-delay:${Math.random() * 5}s;
        --drift:${(Math.random() - 0.5) * 40}px;
    `;
    hero.appendChild(w);
}
