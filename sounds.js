/* =======================================================
   WATER JUG TRIALS — Procedural Sound Engine
   Uses Web Audio API — no external files needed.
   ======================================================= */

window.SoundEngine = (() => {
    let ctx = null;
    let masterGain = null;

    /* lazy init — AudioContext must be created after a user gesture */
    function init() {
        if (!ctx) {
            ctx = new (window.AudioContext || window.webkitAudioContext)();
            masterGain = ctx.createGain();
            masterGain.gain.value = 0.75;
            masterGain.connect(ctx.destination);
        }
        // Always resume in case browser suspended it
        if (ctx.state === 'suspended') ctx.resume();
    }

    /* ---- helpers ---- */

    /** Create a buffer of pink-ish noise */
    function makeNoiseBuffer(seconds) {
        const length = ctx.sampleRate * seconds;
        const buf = ctx.createBuffer(1, length, ctx.sampleRate);
        const data = buf.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0;
        for (let i = 0; i < length; i++) {
            const white = Math.random() * 2 - 1;
            // Paul Kellet's pink-noise filter
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + white * 0.5362) / 7;
        }
        return buf;
    }

    /** Play filtered noise with an envelope */
    function playNoise({
        duration = 0.8,
        freq = 800,
        Q = 1.5,
        filterType = 'bandpass',
        attackTime = 0.05,
        releaseTime = 0.25,
        gainPeak = 0.55,
        detune = 0,
        tremoloRate = 0,   // optional amplitude modulation (Hz)
        tremoloDepth = 0,
    } = {}) {
        init();
        if (!ctx) return;

        const buf = makeNoiseBuffer(duration + 0.1);
        const source = ctx.createBufferSource();
        source.buffer = buf;

        const filter = ctx.createBiquadFilter();
        filter.type = filterType;
        filter.frequency.value = freq;
        filter.Q.value = Q;
        filter.detune.value = detune;

        const env = ctx.createGain();
        const now = ctx.currentTime;
        env.gain.setValueAtTime(0, now);
        env.gain.linearRampToValueAtTime(gainPeak, now + attackTime);
        env.gain.setValueAtTime(gainPeak, now + duration - releaseTime);
        env.gain.linearRampToValueAtTime(0, now + duration);

        // optional tremolo (gurgle effect)
        if (tremoloRate > 0) {
            const lfo = ctx.createOscillator();
            const lfoGain = ctx.createGain();
            lfo.frequency.value = tremoloRate;
            lfoGain.gain.value = tremoloDepth;
            lfo.connect(lfoGain);
            lfoGain.connect(env.gain);
            lfo.start(now);
            lfo.stop(now + duration);
        }

        source.connect(filter);
        filter.connect(env);
        env.connect(masterGain);

        source.start(now);
        source.stop(now + duration);
    }

    /** Short tonal ping (used for empty klonk) */
    function playTone({ freq = 300, duration = 0.4, gainPeak = 0.3, type = 'sine' } = {}) {
        init();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const env = ctx.createGain();
        const now = ctx.currentTime;

        osc.type = type;
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.5, now + duration);

        env.gain.setValueAtTime(0, now);
        env.gain.linearRampToValueAtTime(gainPeak, now + 0.01);
        env.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.connect(env);
        env.connect(masterGain);
        osc.start(now);
        osc.stop(now + duration);
    }

    /* ================================================================
       PUBLIC SOUNDS
       ================================================================ */

    /**
     * Fill — water pouring from tap into jug.
     * Rising bandpass noise that swells and sustains.
     */
    function fill(durationMs = 900) {
        const secs = durationMs / 1000;
        // main stream
        playNoise({
            duration: secs,
            freq: 1100,
            Q: 1.2,
            filterType: 'bandpass',
            attackTime: 0.12,
            releaseTime: 0.30,
            gainPeak: 0.50,
        });
        // low rumble underneath
        playNoise({
            duration: secs,
            freq: 220,
            Q: 0.8,
            filterType: 'lowpass',
            attackTime: 0.18,
            releaseTime: 0.35,
            gainPeak: 0.18,
        });
    }

    /**
     * Pour — jug-to-jug transfer.
     * Slightly more turbulent mid-frequency noise.
     */
    function pour(durationMs = 700) {
        const secs = durationMs / 1000;
        playNoise({
            duration: secs,
            freq: 900,
            Q: 2.0,
            filterType: 'bandpass',
            attackTime: 0.08,
            releaseTime: 0.25,
            gainPeak: 0.45,
            tremoloRate: 8,
            tremoloDepth: 0.08,
        });
        playNoise({
            duration: secs,
            freq: 350,
            Q: 0.7,
            filterType: 'lowpass',
            attackTime: 0.10,
            releaseTime: 0.20,
            gainPeak: 0.15,
        });
    }

    /**
     * Empty — water draining out.
     * Gurgling turbulent noise that fades quickly.
     */
    function empty(durationMs = 600) {
        const secs = durationMs / 1000;
        // gurgling mid noise
        playNoise({
            duration: secs,
            freq: 700,
            Q: 3.5,
            filterType: 'bandpass',
            attackTime: 0.04,
            releaseTime: 0.25,
            gainPeak: 0.40,
            tremoloRate: 14,
            tremoloDepth: 0.12,
        });
        // hollow klonk at start
        playTone({ freq: 380, duration: 0.30, gainPeak: 0.20, type: 'triangle' });
    }

    /**
     * Win jingle — soft ascending tones.
     */
    function win() {
        init();
        if (!ctx) return;
        const notes = [523, 659, 784, 1047]; // C5 E5 G5 C6
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const env = ctx.createGain();
            const now = ctx.currentTime + i * 0.18;
            osc.type = 'sine';
            osc.frequency.value = freq;
            env.gain.setValueAtTime(0, now);
            env.gain.linearRampToValueAtTime(0.30, now + 0.05);
            env.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
            osc.connect(env);
            env.connect(masterGain);
            osc.start(now);
            osc.stop(now + 0.6);
        });
    }

    return { fill, pour, empty, win, init };
})();
