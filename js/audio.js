// ===== AUDIO MODULE (Signal Processing: Web Audio API) =====

const AudioFX = (() => {
  let ctx = null;

  function getCtx() {
    if (!ctx) {
      try {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch(e) {
        return null;
      }
    }
    return ctx;
  }

  // Generate tone using oscillator (signal processing)
  function playTone(frequency, duration, type = 'sine', volume = 0.3) {
    const audioCtx = getCtx();
    if (!audioCtx) return;

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    
    // Envelope: attack + decay (signal envelope)
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, audioCtx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + duration);
  }

  // Play chord: multiple tones
  function playChord(frequencies, duration, type = 'sine', volume = 0.2) {
    frequencies.forEach(f => playTone(f, duration, type, volume));
  }

  return {
    correct() {
      // Happy ascending chord (C major arpeggio)
      const times = [0, 0.1, 0.2];
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      const audioCtx = getCtx();
      if (!audioCtx) return;
      notes.forEach((freq, i) => {
        setTimeout(() => playTone(freq, 0.3, 'triangle', 0.25), times[i] * 1000);
      });
    },

    wrong() {
      // Descending dissonant (signal: wrong)
      playTone(220, 0.2, 'sawtooth', 0.2);
      setTimeout(() => playTone(185, 0.3, 'sawtooth', 0.15), 150);
    },

    complete() {
      // Fanfare: C major scale up
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99];
      notes.forEach((freq, i) => {
        setTimeout(() => playTone(freq, 0.25, 'triangle', 0.2), i * 100);
      });
    },

    click() {
      playTone(800, 0.05, 'sine', 0.1);
    },

    tick() {
      playTone(600, 0.08, 'square', 0.08);
    }
  };
})();
