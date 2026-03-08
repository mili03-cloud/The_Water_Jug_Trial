/* ================= DRAG SYSTEM ================= */

let activeJug = null;
let offsetX = 0;
let offsetY = 0;
let dragParent = null;

function startDrag(e, jug){
    if(!gameActive) return;
    activeJug = jug;

    if(e.touches) e.preventDefault();

    const rect = jug.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    offsetX = clientX - rect.left;
    offsetY = clientY - rect.top;

    // remember positioned parent so absolute coords are calculated correctly
    dragParent = activeJug.offsetParent || document.body;
    const parentRect = dragParent.getBoundingClientRect();

    activeJug.style.position = "absolute";
    activeJug.style.zIndex = 1000;
    document.body.style.userSelect = 'none';

    // place the jug at the initial pointer location (relative to parent)
    activeJug.style.left = (clientX - offsetX - parentRect.left) + "px";
    activeJug.style.top  = (clientY - offsetY - parentRect.top) + "px";
}

function dragMove(e){
    if(!activeJug) return;

    if(e.touches) e.preventDefault();

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const parentRect = (dragParent || activeJug.offsetParent || document.body).getBoundingClientRect();

    // compute position relative to parent and clamp inside parent bounds
    let left = clientX - offsetX - parentRect.left;
    let top  = clientY - offsetY - parentRect.top;

    const maxLeft = parentRect.width - activeJug.offsetWidth;
    const maxTop  = parentRect.height - activeJug.offsetHeight;

    left = Math.max(0, Math.min(left, maxLeft));
    top  = Math.max(0, Math.min(top, maxTop));

    activeJug.style.left = left + "px";
    activeJug.style.top  = top + "px";
}

function stopDrag(){
    if(!activeJug) return;

    checkInteractions(activeJug);

    // restore original layout rules so the jug returns to normal flow
    activeJug.style.position = "";
    activeJug.style.left = "";
    activeJug.style.top = "";
    activeJug.style.zIndex = "";
    document.body.style.userSelect = "";

    activeJug = null;
    dragParent = null;
}

/* ================= INTERACTION CHECK ================= */

function checkInteractions(jug){

    const jugRect = jug.getBoundingClientRect();
    const tapRect = tap.getBoundingClientRect();
    const otherJug = (jug.id === "jugA") ? jugB : jugA;
    const otherRect = otherJug.getBoundingClientRect();

    /* ---- CHECK TAP COLLISION ---- */
    if(isColliding(jugRect, tapRect)){
        if(jug.id === "jugA") fillA();
        else fillB();
    }

    /* ---- CHECK POUR COLLISION ---- */
    if(isColliding(jugRect, otherRect)){
        if(jug.id === "jugA") pourAtoB();
        else pourBtoA();
    }
}

/* ================= COLLISION ================= */

function isColliding(r1, r2){
    return !(
        r1.right < r2.left ||
        r1.left > r2.right ||
        r1.bottom < r2.top ||
        r1.top > r2.bottom
    );
}

/* ================= EVENT LISTENERS ================= */

// Mouse
if(jugA) jugA.addEventListener("mousedown", e => startDrag(e, jugA));
if(jugB) jugB.addEventListener("mousedown", e => startDrag(e, jugB));
document.addEventListener("mousemove", dragMove);
document.addEventListener("mouseup", stopDrag);

// Touch
if(jugA) jugA.addEventListener("touchstart", e => startDrag(e, jugA));
if(jugB) jugB.addEventListener("touchstart", e => startDrag(e, jugB));
document.addEventListener("touchmove", dragMove, {passive:false});
document.addEventListener("touchend", stopDrag);

// wire buttons and inputs
if(fillABtn) fillABtn.addEventListener('click', fillA);
if(emptyABtn) emptyABtn.addEventListener('click', emptyA);
if(fillBBtn) fillBBtn.addEventListener('click', fillB);
if(emptyBBtn) emptyBBtn.addEventListener('click', emptyB);
if(pourABtn) pourABtn.addEventListener('click', pourAtoB);
if(pourBBtn) pourBBtn.addEventListener('click', pourBtoA);
if(clearBtn) clearBtn.addEventListener('click', clearAll);
if(setBtn) setBtn.addEventListener('click', applySettings);

// initialize UI with defaults
updateUI();
