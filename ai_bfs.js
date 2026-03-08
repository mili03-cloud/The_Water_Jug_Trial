document.addEventListener('DOMContentLoaded', () => {

    const capAInput = document.getElementById('capAInput');
    const capBInput = document.getElementById('capBInput');
    const goalInput = document.getElementById('goalInput');
    const solveBtn = document.getElementById('solveAnimateBtn');

    const jugA = document.getElementById('jugA');
    const jugB = document.getElementById('jugB');
    const waterA = document.getElementById('waterA');
    const waterB = document.getElementById('waterB');
    const amountA = document.getElementById('amountA');
    const amountB = document.getElementById('amountB');

    const aiStats = document.getElementById('aiStats');
    const aiSteps = document.getElementById('aiSteps');

    let capA = 0;
    let capB = 0;
    let goal = 0;

    let currA = 0;
    let currB = 0;

    let isAnimating = false;   // guard against overlapping solves

    /* ================= DISPLAY ================= */
    function updateDisplay() {
        amountA.textContent = capA > 0 ? `${currA} / ${capA}` : '0 / 0';
        amountB.textContent = capB > 0 ? `${currB} / ${capB}` : '0 / 0';

        waterA.style.height = capA > 0 ? (currA / capA * 100) + "%" : "0%";
        waterB.style.height = capB > 0 ? (currB / capB * 100) + "%" : "0%";

        // smooth water bounce
        gsap.fromTo(waterA, { scaleY: 0.95 }, { scaleY: 1, duration: 0.3 });
        gsap.fromTo(waterB, { scaleY: 0.95 }, { scaleY: 1, duration: 0.3 });
    }

    /* ================= BFS SOLVER ================= */
    function bfsSolve(capA, capB, goal) {

        if (goal > capA && goal > capB) return null;

        let visited = new Set();
        let queue = [];
        queue.push({ a: 0, b: 0, path: [] });

        while (queue.length) {
            let { a, b, path } = queue.shift();
            let key = `${a},${b}`;
            if (visited.has(key)) continue;
            visited.add(key);

            let newPath = [...path, { a, b }];
            if (a === goal || b === goal) return newPath;

            let moves = [];

            moves.push({ a: capA, b: b });
            moves.push({ a: a, b: capB });
            moves.push({ a: 0, b: b });
            moves.push({ a: a, b: 0 });

            let pourAB = Math.min(a, capB - b);
            moves.push({ a: a - pourAB, b: b + pourAB });

            let pourBA = Math.min(b, capA - a);
            moves.push({ a: a + pourBA, b: b - pourBA });

            for (let m of moves) {
                let mKey = `${m.a},${m.b}`;
                if (!visited.has(mKey)) {
                    queue.push({ a: m.a, b: m.b, path: newPath });
                }
            }
        }

        return null;
    }

    /* ================= FILL ANIMATION ================= */
    function animateFill(jug) {
        return new Promise(resolve => {
            if (window.SoundEngine) SoundEngine.fill(900);
            animateJugToTap(jug).then(clone => {
                return showStreamForJug(clone).then(() => {
                    try {
                        const cw = clone.querySelector('.water');
                        if (cw) cw.style.height = '100%';
                    } catch (e) { }
                    // slowed down — was 320ms
                    return new Promise(res => setTimeout(res, 700));
                }).then(() => {
                    restoreJug(jug);
                    resolve();
                });
            });
        });
    }

    /* ================= CONFETTI (standalone) ================= */
    function launchConfetti() {
        for (let i = 0; i < 120; i++) {
            const c = document.createElement("div");
            c.className = "confetti";
            c.style.left = Math.random() * window.innerWidth + "px";
            c.style.top = '-10px';
            c.style.background = `hsl(${Math.random() * 360},80%,60%)`;
            c.style.width = (6 + Math.random() * 8) + 'px';
            c.style.height = (6 + Math.random() * 8) + 'px';
            document.body.appendChild(c);

            gsap.to(c, {
                y: window.innerHeight + 80,
                x: (Math.random() - 0.5) * 200,
                rotation: Math.random() * 720,
                duration: 2.5 + Math.random() * 1.5,
                ease: "power1.out",
                delay: Math.random() * 0.8,
                onComplete: () => c.remove()
            });
        }
    }

    /* ================= COMPLETION POPUP ================= */
    function showCompletionPopup(solution, stepCount) {
        launchConfetti();
        if (window.SoundEngine) SoundEngine.win();

        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed; inset: 0;
            background: rgba(0,0,0,0.75);
            backdrop-filter: blur(6px);
            display: flex; align-items: center; justify-content: center;
            z-index: 9999;
        `;

        const box = document.createElement('div');
        box.style.cssText = `
            position: relative;
            width: 420px;
            max-height: 80vh;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            border-radius: 14px;
            background: rgba(4, 10, 36, 0.96);
            border: 1px solid rgba(80, 150, 255, 0.35);
            border-top: 2px solid rgba(100, 170, 255, 0.6);
            box-shadow:
                0 0 60px rgba(40, 100, 255, 0.15),
                0 24px 60px rgba(0,0,0,0.8),
                inset 0 1px 0 rgba(120,180,255,0.12);
            padding: 32px 28px 28px;
            text-align: center;
            backdrop-filter: blur(12px);
        `;

        // corner ornaments
        ['tl', 'tr', 'bl', 'br'].forEach(pos => {
            const corner = document.createElement('div');
            const styles = {
                tl: 'top:10px;left:10px;border-top:1px solid rgba(100,170,255,0.4);border-left:1px solid rgba(100,170,255,0.4)',
                tr: 'top:10px;right:10px;border-top:1px solid rgba(100,170,255,0.4);border-right:1px solid rgba(100,170,255,0.4)',
                bl: 'bottom:10px;left:10px;border-bottom:1px solid rgba(100,170,255,0.4);border-left:1px solid rgba(100,170,255,0.4)',
                br: 'bottom:10px;right:10px;border-bottom:1px solid rgba(100,170,255,0.4);border-right:1px solid rgba(100,170,255,0.4)'
            };
            corner.style.cssText = `position:absolute;width:18px;height:18px;${styles[pos]}`;
            box.appendChild(corner);
        });

        const eyebrow = document.createElement('p');
        eyebrow.textContent = '✦  The Oracle Has Spoken  ✦';
        eyebrow.style.cssText = `
            font-family: 'Cinzel', serif;
            font-size: 0.6rem; letter-spacing: 5px;
            color: rgba(140, 200, 255, 0.6);
            text-transform: uppercase; margin-bottom: 10px;
        `;

        const title = document.createElement('h2');
        title.textContent = 'Trial Complete!';
        title.style.cssText = `
            font-family: 'Cinzel', serif;
            font-size: 2rem; font-weight: 900; letter-spacing: 3px;
            background: linear-gradient(135deg, #ffe8a0, #ffb040, #ffd060);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            background-clip: text; margin-bottom: 8px;
        `;

        const statsBar = document.createElement('p');
        statsBar.textContent = `Total Steps: ${stepCount}`;
        statsBar.style.cssText = `
            font-family: 'Cinzel', serif;
            font-size: 0.85rem; letter-spacing: 3px;
            color: rgba(140, 210, 255, 0.85);
            margin-bottom: 16px;
        `;

        const divider = document.createElement('div');
        divider.style.cssText = `
            width: 80%; margin: 0 auto 16px;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(80,150,255,0.4), transparent);
        `;

        const pathTitle = document.createElement('p');
        pathTitle.textContent = 'Sacred Path';
        pathTitle.style.cssText = `
            font-family: 'Cinzel', serif;
            font-size: 0.62rem; letter-spacing: 4px;
            text-transform: uppercase;
            color: rgba(140, 200, 255, 0.6);
            margin-bottom: 10px;
        `;

        const pathBox = document.createElement('div');
        pathBox.style.cssText = `
            max-height: 220px; overflow-y: auto;
            text-align: left;
            background: rgba(0,0,0,0.3);
            border: 1px solid rgba(60,120,255,0.2);
            border-radius: 6px;
            padding: 10px 12px;
            margin-bottom: 20px;
        `;
        pathBox.style.scrollbarWidth = 'thin';

        // build path lines
        for (let i = 1; i < solution.length; i++) {
            const prev = solution[i - 1];
            const next = solution[i];
            const action = classifyAction(prev, next);
            const line = document.createElement('div');
            line.textContent = `${i}. ${action}  →  [${next.a}, ${next.b}]`;
            line.style.cssText = `
                font-family: 'Raleway', sans-serif;
                font-size: 0.82rem; line-height: 1.9;
                color: rgba(180, 215, 255, 0.85);
                padding: 1px 4px;
            `;
            pathBox.appendChild(line);
        }

        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Return to Trial';
        closeBtn.style.cssText = `
            padding: 11px 34px;
            font-family: 'Cinzel', serif;
            font-size: 0.72rem; font-weight: 700;
            letter-spacing: 3px; text-transform: uppercase;
            border: 1px solid rgba(80,140,255,0.4);
            border-radius: 5px;
            background: linear-gradient(135deg, #1a4fa0, #2a72e0);
            color: #d8eeff;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(30,80,200,0.35),
                        inset 0 1px 0 rgba(120,180,255,0.15);
            transition: all 0.25s;
        `;
        closeBtn.onmouseover = () => closeBtn.style.filter = 'brightness(1.2)';
        closeBtn.onmouseout = () => closeBtn.style.filter = '';
        closeBtn.addEventListener('click', () => overlay.remove());

        box.appendChild(eyebrow);
        box.appendChild(title);
        box.appendChild(statsBar);
        box.appendChild(divider);
        box.appendChild(pathTitle);
        box.appendChild(pathBox);
        box.appendChild(closeBtn);
        overlay.appendChild(box);
        document.body.appendChild(overlay);

        // entrance animation
        gsap.fromTo(box,
            { scale: 0.85, opacity: 0, y: 30 },
            { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.6)' }
        );
    }

    /* ================= GOAL GLOW ================= */
    function glowWin(solution) {
        if (currA === goal) jugA.classList.add("goal-glow");
        if (currB === goal) jugB.classList.add("goal-glow");
        // show popup after short delay so glow is visible first
        setTimeout(() => showCompletionPopup(solution, solution.length - 1), 600);
    }

    /* ================= ACTION CLASSIFIER ================= */
    function classifyAction(prev, next) {
        const dA = next.a - prev.a;
        const dB = next.b - prev.b;

        if (dA < 0 && dB > 0 && dA === -dB) return "Pour A → B";
        if (dB < 0 && dA > 0 && dB === -dA) return "Pour B → A";
        if (next.a === capA && dA > 0 && dB === 0) return "Fill A";
        if (next.b === capB && dB > 0 && dA === 0) return "Fill B";
        if (next.a === 0 && dA < 0 && dB === 0) return "Empty A";
        if (next.b === 0 && dB < 0 && dA === 0) return "Empty B";

        return "Unknown";
    }

    /* ================= MAIN ANIMATION ================= */
    async function animateSolution(solution) {

        aiSteps.innerHTML = "";

        for (let i = 1; i < solution.length; i++) {

            const prev = solution[i - 1];
            const next = solution[i];

            const action = classifyAction(prev, next);

            // Log the step in the solution panel
            const div = document.createElement("div");
            div.textContent = `${i}. ${action} → [${next.a}, ${next.b}]`;
            aiSteps.appendChild(div);
            aiSteps.scrollTop = aiSteps.scrollHeight;

            // Only fill operations get an animation (jug moves to tap)
            if (action === "Fill A") {
                await animateFill(jugA);
            }
            else if (action === "Fill B") {
                await animateFill(jugB);
            }

            // Update state ONLY after animation completes
            currA = next.a;
            currB = next.b;
            updateDisplay();

            // Brief pause between steps (slowed — was 400ms)
            await new Promise(res => setTimeout(res, 800));

        }

        // All steps done — check for win
        if (currA === goal || currB === goal) {
            glowWin(solution);
        }


        isAnimating = false;
        solveBtn.disabled = false;
        solveBtn.style.opacity = "1";
    }

    /* ================= SOLVE BUTTON ================= */
    solveBtn.addEventListener('click', () => {

        if (isAnimating) return;   // block overlapping solves

        jugA.classList.remove("goal-glow");
        jugB.classList.remove("goal-glow");

        capA = parseInt(capAInput.value);
        capB = parseInt(capBInput.value);
        goal = parseInt(goalInput.value);

        // reset state
        currA = 0;
        currB = 0;
        updateDisplay();

        const solution = bfsSolve(capA, capB, goal);

        if (solution) {
            isAnimating = true;
            solveBtn.disabled = true;
            solveBtn.style.opacity = "0.5";

            aiStats.textContent = `Steps: ${solution.length - 1}`;
            animateSolution(solution);
        } else {
            aiStats.textContent = "No solution";
            aiSteps.textContent = "Impossible configuration.";
        }
    });

    /* ================= CLEAR BUTTON ================= */
    /* ================= SET BUTTON ================= */
    const setBtn = document.getElementById('setBtn');
    if (setBtn) {
        setBtn.addEventListener('click', () => {
            const a = parseInt(capAInput.value);
            const b = parseInt(capBInput.value);
            const g = parseInt(goalInput.value);
            if (a > 0) capA = a;
            if (b > 0) capB = b;
            if (g > 0) goal = g;
            // clamp current water to new capacities
            if (currA > capA) currA = capA;
            if (currB > capB) currB = capB;
            updateDisplay();
        });
    }

    /* ================= CLEAR BUTTON ================= */
    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            currA = 0;
            currB = 0;
            capA = 0;
            capB = 0;
            goal = 0;
            capAInput.value = '';
            capBInput.value = '';
            goalInput.value = '';
            isAnimating = false;
            solveBtn.disabled = false;
            solveBtn.style.opacity = "1";
            jugA.classList.remove("goal-glow");
            jugB.classList.remove("goal-glow");
            aiStats.textContent = "Awaiting invocation\u2026";
            aiSteps.innerHTML = "Set the vessels and invoke the Oracle to reveal the sacred path.";
            updateDisplay();
        });
    }

    updateDisplay();
});
