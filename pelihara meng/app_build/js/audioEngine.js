/**
 * MIMI & MOCHI — A LITTLE COZY CAT LIFE
 * Procedural Web Audio API Synthesizer (Zero External Dependencies)
 */

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.masterGain = null;

    this.musicEnabled = true;
    this.sfxEnabled = true;
    this.musicVolume = 0.45;
    this.sfxVolume = 0.65;

    this.isPlayingMusic = false;
    this.musicStep = 0;
    this.musicTimer = null;

    // Purr oscillator reference
    this.purrGain = null;
    this.purrSource = null;
    this.isPurring = false;
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(this.musicEnabled ? this.musicVolume : 0, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.sfxEnabled ? this.sfxVolume : 0, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      this.startLoFiMusic();
    } catch (e) {
      console.warn('Web Audio API not supported or autoplay blocked:', e);
    }
  }

  ensureContext() {
    if (!this.ctx) {
      this.init();
    } else if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMusicVolume(vol) {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setValueAtTime(this.musicEnabled ? this.musicVolume : 0, this.ctx.currentTime);
    }
  }

  setSfxVolume(vol) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(this.sfxEnabled ? this.sfxVolume : 0, this.ctx.currentTime);
    }
  }

  toggleMusic() {
    this.musicEnabled = !this.musicEnabled;
    this.setMusicVolume(this.musicVolume);
    return this.musicEnabled;
  }

  toggleSfx() {
    this.sfxEnabled = !this.sfxEnabled;
    this.setSfxVolume(this.sfxVolume);
    return this.sfxEnabled;
  }

  /* ==========================================================================
     PROCEDURAL LO-FI AMBIENT MUSIC PROGRESSION
     ========================================================================== */
  startLoFiMusic() {
    if (this.isPlayingMusic || !this.ctx) return;
    this.isPlayingMusic = true;

    // Cozy jazz/lo-fi chords (frequencies in Hz for electric piano voice)
    // Progression: Fmaj9 -> Em7 -> Dm9 -> Cmaj7
    const chords = [
      [174.61, 261.63, 329.63, 392.00, 440.00], // F3, C4, E4, G4, A4 (Fmaj9)
      [164.81, 246.94, 293.66, 392.00, 493.88], // E3, B3, D4, G4, B4 (Em7)
      [146.83, 220.00, 261.63, 329.63, 392.00], // D3, A3, C4, E4, G4 (Dm9)
      [130.81, 196.00, 246.94, 329.63, 392.00]  // C3, G3, B3, E4, G4 (Cmaj7)
    ];

    const playNextChord = () => {
      if (!this.isPlayingMusic) return;

      const chord = chords[this.musicStep % chords.length];
      this.musicStep++;

      const now = this.ctx.currentTime;
      const chordDuration = 4.2;

      // Play soft arpeggiated/strummed chord
      chord.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        // Warm electric piano tone (sine with subtle triangle overtone)
        osc.type = idx === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        // Low-pass filter for cozy muffled warm feel
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(850 + Math.sin(this.musicStep) * 150, now);

        // Note envelope (soft attack, long release)
        const noteStart = now + idx * 0.08;
        noteGain.gain.setValueAtTime(0.0001, noteStart);
        noteGain.gain.linearRampToValueAtTime(0.12 / (idx + 1), noteStart + 0.15);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, noteStart + chordDuration - 0.2);

        osc.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(this.musicGain);

        osc.start(noteStart);
        osc.stop(noteStart + chordDuration);
      });

      // Ambient chime flourish occasionally
      if (Math.random() > 0.4) {
        setTimeout(() => {
          this.playBellNote(chords[this.musicStep % chords.length][3] * 2);
        }, 1800);
      }

      this.musicTimer = setTimeout(playNextChord, 3800);
    };

    playNextChord();
  }

  playBellNote(freq) {
    if (!this.ctx || !this.musicEnabled) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.05, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);

    osc.connect(gain);
    gain.connect(this.musicGain);

    osc.start(now);
    osc.stop(now + 2.0);
  }

  /* ==========================================================================
     CAT VOCALIZER: PROCEDURAL MEOWS & PURRS
     ========================================================================== */
  playMeow(pitch = 1.0, type = 'friendly') {
    this.ensureContext();
    if (!this.ctx || !this.sfxEnabled) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const formant = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';

    // Base pitch modulation (the characteristic "Mee-oww" curve)
    let baseFreq = 480 * pitch;
    let duration = 0.55;

    if (type === 'chirp') {
      baseFreq = 620 * pitch;
      duration = 0.22;
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.3, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.9, now + duration);
    } else if (type === 'sleepy') {
      baseFreq = 380 * pitch;
      duration = 0.65;
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.linearRampToValueAtTime(baseFreq * 1.15, now + 0.25);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.75, now + duration);
    } else {
      // Classic friendly meow
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.45, now + 0.16);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.82, now + duration);
    }

    // Formant filter (vowel synthesis shaping "ee" -> "ow")
    formant.type = 'bandpass';
    formant.Q.setValueAtTime(4.0, now);
    formant.frequency.setValueAtTime(1200, now);
    formant.frequency.exponentialRampToValueAtTime(2200, now + 0.15);
    formant.frequency.exponentialRampToValueAtTime(700, now + duration);

    // Amplitude envelope
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(formant);
    formant.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + duration);
  }

  startPurr() {
    this.ensureContext();
    if (!this.ctx || !this.sfxEnabled || this.isPurring) return;

    this.isPurring = true;
    const now = this.ctx.currentTime;

    // Dual low-frequency oscillator for realistic 26Hz purr vibration
    const osc = this.ctx.createOscillator();
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    const purrGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(28, now); // 28Hz cat purr resonance

    // Modulate purr intensity with slow breathing rate
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.8, now); // breath cycle

    lfoGain.gain.setValueAtTime(10, now);
    lfo.connect(osc.frequency);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(180, now);

    purrGain.gain.setValueAtTime(0.001, now);
    purrGain.gain.linearRampToValueAtTime(0.25, now + 0.4);

    osc.connect(filter);
    filter.connect(purrGain);
    purrGain.connect(this.sfxGain);

    osc.start(now);
    lfo.start(now);

    this.purrSource = { osc, lfo };
    this.purrGain = purrGain;
  }

  stopPurr() {
    if (!this.isPurring || !this.ctx || !this.purrGain) return;
    const now = this.ctx.currentTime;
    this.purrGain.gain.linearRampToValueAtTime(0.0001, now + 0.3);

    setTimeout(() => {
      if (this.purrSource) {
        try {
          this.purrSource.osc.stop();
          this.purrSource.lfo.stop();
        } catch (e) {}
        this.purrSource = null;
      }
      this.isPurring = false;
    }, 350);
  }

  /* ==========================================================================
     INTERACTION SFX: FEEDING, BUBBLES, SHUTTER, TAPS
     ========================================================================== */
  playCrunch() {
    this.ensureContext();
    if (!this.ctx || !this.sfxEnabled) return;

    // Series of 3 quick crisp crunches
    [0, 0.09, 0.18].forEach(offset => {
      const now = this.ctx.currentTime + offset;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(200 + Math.random() * 80, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.06);

      filter.type = 'highpass';
      filter.frequency.setValueAtTime(150, now);

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.07);
    });
  }

  playBubblePop() {
    this.ensureContext();
    if (!this.ctx || !this.sfxEnabled) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const startF = 350 + Math.random() * 200;
    osc.frequency.setValueAtTime(startF, now);
    osc.frequency.exponentialRampToValueAtTime(startF * 2.2, now + 0.08);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  playChime() {
    this.ensureContext();
    if (!this.ctx || !this.sfxEnabled) return;

    // Sweet sparkling triple chime (C6, E6, G6)
    [1046.50, 1318.51, 1567.98].forEach((freq, idx) => {
      const now = this.ctx.currentTime + idx * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.8);
    });
  }

  playCameraShutter() {
    this.ensureContext();
    if (!this.ctx || !this.sfxEnabled) return;

    const now = this.ctx.currentTime;
    // Two fast clicks: mirror up + shutter click
    [0, 0.07].forEach(offset => {
      const t = now + offset;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1400, t);
      osc.frequency.exponentialRampToValueAtTime(200, t + 0.04);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.05);
    });
  }

  playWoodTap() {
    this.ensureContext();
    if (!this.ctx || !this.sfxEnabled) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.04);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.05);
  }
}

export const audio = new AudioEngine();
