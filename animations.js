/* ================= ANIMATION HELPERS ================= */

// Shared tap nozzle position constants — tweak these to align tap image spout
const NOZZLE_X_RATIO = 0.42;   // fraction of tap image width  (spout tip X)
const NOZZLE_Y_OFFSET = 2;    // px from bottom of tap image  (spout tip Y)


function createAnimatedClone(jug) {
    const rect = jug.getBoundingClientRect();

    const clone = jug.cloneNode(true);
    clone.style.pointerEvents = 'none';
    clone.style.margin = '0';
    clone.style.boxSizing = 'border-box';
    clone.style.width = rect.width + 'px';
    clone.style.height = rect.height + 'px';

    clone.style.position = 'fixed';
    clone.style.left = rect.left + 'px';
    clone.style.top = rect.top + 'px';
    clone.style.transform = "none";   //changed here me
    clone.style.zIndex = 9999;


    // remove duplicate ids
    if (clone.id) clone.removeAttribute('id');
    clone.querySelectorAll('[id]').forEach(n => n.removeAttribute('id'));

    clone.classList.add('jug-clone');
    clone.dataset.cloneFor = jug.id;

    document.body.appendChild(clone);

    // hide original safely
    jug.style.visibility = "hidden";

    return clone;
}

/* ================= MOVE JUG TO TAP ================= */

/* ================= MOVE JUG TO TAP ================= */

function animateJugToTap(jug) {
    const clone = createAnimatedClone(jug);
    const tapRect = tap.getBoundingClientRect();

    // ⭐ nozzle position — shared constants keep jug + stream in sync
    const nozzleX = tapRect.left + tapRect.width * NOZZLE_X_RATIO;
    const nozzleY = tapRect.bottom - NOZZLE_Y_OFFSET;

    // ⭐ center jug opening under tap nozzle
    const targetLeft = nozzleX - (clone.offsetWidth * 0.10);

    // ⭐ top of jug sits just below the nozzle (10% down from top)
    const targetTop = nozzleY - 0;   // 2px gap

    return new Promise(resolve => {

        if (window.gsap) {
            gsap.to(clone, {
                left: targetLeft,
                top: targetTop,
                duration: 0.7,
                ease: "power2.inOut",
                onComplete: () => resolve(clone)
            });
        } else {
            clone.style.transition = "all 0.7s ease";
            clone.style.left = targetLeft + "px";
            clone.style.top = targetTop + "px";
            setTimeout(() => resolve(clone), 700);
        }

    });
}



/* ================= RESTORE ORIGINAL JUG ================= */

function restoreJug(jug) {
    // show original again
    jug.style.visibility = "visible";
    jug.style.position = "";
    jug.style.left = "";
    jug.style.top = "";
    jug.style.zIndex = "";

    // remove clones
    const clones = document.querySelectorAll(`[data-clone-for="${jug.id}"]`);
    clones.forEach(c => c.remove());
}

function restoreBothJugs() {
    restoreJug(jugA);
    restoreJug(jugB);
}

/* ================= WATER STREAM ================= */




function showStreamForJug(jug) {
    return new Promise(resolve => {

        const tapRect = tap.getBoundingClientRect();
        const jugRect = jug.getBoundingClientRect();

        const stream = document.createElement("div");
        stream.className = "water-stream";   // width comes from CSS (18px)
        stream.style.position = "fixed";
        stream.style.zIndex = 9998;

        document.body.appendChild(stream);

        // nozzle position — same shared constants as animateJugToTap
        const nozzleX = tapRect.left + tapRect.width * NOZZLE_X_RATIO;
        const nozzleY = tapRect.bottom - NOZZLE_Y_OFFSET;

        // stream height = gap from nozzle to top of jug
        const height = jugRect.top - nozzleY + 70;

        // center the 18px-wide stream over the nozzle
        const streamWidth = stream.offsetWidth;
        stream.style.left = (nozzleX - streamWidth / 2 + 58) + "px";
        stream.style.top = (nozzleY) + "px";
        stream.style.height = "0px";
        stream.style.opacity = "1";


        // smooth stream grow
        if (window.gsap) {
            gsap.to(stream, {
                height: height,
                duration: 0.5,
                ease: "power2.out"
            });
        } else {
            stream.style.transition = "height 0.5s ease";
            setTimeout(() => stream.style.height = height + "px", 50);
        }

        // droplet
        setTimeout(() => {
            const drop = document.createElement("div");
            drop.className = "water-droplet";
            drop.style.position = "absolute";
            drop.style.left = "50%";
            drop.style.transform = "translateX(-50%)";
            stream.appendChild(drop);

            if (window.gsap) {
                gsap.to(drop, {
                    y: height + 20,
                    opacity: 0,
                    duration: 0.8,
                    ease: "linear",
                    onComplete: () => drop.remove()
                });
            }
        }, 200);

        // remove stream
        setTimeout(() => {
            if (window.gsap) {
                gsap.to(stream, {
                    opacity: 0,
                    duration: 0.3,
                    onComplete: () => {
                        stream.remove();
                        resolve();
                    }
                });
            } else {
                stream.remove();
                resolve();
            }
        }, 1000);

    });
}



/* ================= CONFETTI ================= */

function spawnConfetti(count = 40, originX = window.innerWidth / 2, originY = window.innerHeight / 3) {
    const colors = ['#ff3b3b', '#ff9f1c', '#ffd60a', '#2ec4b6', '#2d6cdf', '#c67cf0'];
    const container = document.createElement('div');
    container.className = 'confetti-container';
    container.style.position = 'fixed';
    container.style.left = '0';
    container.style.top = '0';
    container.style.width = '100vw';
    container.style.height = '100vh';
    container.style.pointerEvents = 'none';
    container.style.overflow = 'visible';
    container.style.zIndex = 10000;
    document.body.appendChild(container);

    for (let i = 0; i < count; i++) {
        const el = document.createElement('div');
        el.className = 'confetti-piece';
        const w = Math.round(6 + Math.random() * 10);
        const h = Math.round(8 + Math.random() * 14);
        el.style.width = w + 'px';
        el.style.height = h + 'px';
        el.style.background = colors[Math.floor(Math.random() * colors.length)];
        el.style.position = 'absolute';
        el.style.left = originX + (Math.random() * 40 - 20) + 'px';
        el.style.top = originY + (Math.random() * 20 - 10) + 'px';
        el.style.opacity = '1';
        el.style.borderRadius = (Math.random() > 0.5 ? '2px' : '50%');
        container.appendChild(el);

        const angle = -90 + (Math.random() * 120 - 60);
        const distance = 120 + Math.random() * 260;
        const destX = Math.cos(angle * Math.PI / 180) * distance;
        const destY = Math.sin(angle * Math.PI / 180) * distance + (50 + Math.random() * 120);
        const rot = (Math.random() * 720 - 360);

        if (window.gsap) {
            gsap.to(el, { x: destX, y: destY, rotation: rot, duration: 1.6 + Math.random() * 0.6, ease: 'power2.out' });
            gsap.to(el, { opacity: 0, delay: 1.0, duration: 0.6, onComplete: () => { if (el.parentNode) el.parentNode.removeChild(el); } });
        } else {
            // fallback simple animation
            setTimeout(() => { el.style.transform = `translate(${destX}px, ${destY}px) rotate(${rot}deg)`; el.style.opacity = '0'; }, 20);
            setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 2000);
        }
    }

    // remove container after animations
    setTimeout(() => { if (container.parentNode) container.parentNode.removeChild(container); }, 2600);
}