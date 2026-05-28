// SKEUOFIT - Tactile Sound Synthesizer via Web Audio API

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Synthesizes a tactile mechanical button click sound
 */
export function playClickSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Primary metallic click
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.05);
    
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.05);
    
    // High-pitched metal click component (spring/switch toggle)
    const oscHigh = ctx.createOscillator();
    const gainHigh = ctx.createGain();
    
    oscHigh.type = 'sine';
    oscHigh.frequency.setValueAtTime(1200, now);
    oscHigh.frequency.exponentialRampToValueAtTime(800, now + 0.015);
    
    gainHigh.gain.setValueAtTime(0.15, now);
    gainHigh.gain.exponentialRampToValueAtTime(0.001, now + 0.015);
    
    oscHigh.connect(gainHigh);
    gainHigh.connect(ctx.destination);
    
    oscHigh.start(now);
    oscHigh.stop(now + 0.015);
  } catch (e) {
    console.warn("Audio synthesis blocked or unsupported:", e);
  }
}

/**
 * Synthesizes a water drop/splash sound when adding water
 */
export function playSplashSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Bubble 1 (Lower pitch droplet)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(300, now);
    osc1.frequency.exponentialRampToValueAtTime(900, now + 0.15); // Rising pitch for bubble
    
    gain1.gain.setValueAtTime(0.0, now);
    gain1.gain.linearRampToValueAtTime(0.2, now + 0.03);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.18);

    // Bubble 2 (Higher pitch chime, offset slightly)
    setTimeout(() => {
      const insideCtx = getAudioContext();
      const t = insideCtx.currentTime;
      const osc2 = insideCtx.createOscillator();
      const gain2 = insideCtx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(600, t);
      osc2.frequency.exponentialRampToValueAtTime(1600, t + 0.1);
      
      gain2.gain.setValueAtTime(0.0, t);
      gain2.gain.linearRampToValueAtTime(0.15, t + 0.02);
      gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      
      osc2.connect(gain2);
      gain2.connect(insideCtx.destination);
      osc2.start(t);
      osc2.stop(t + 0.12);
    }, 60);
  } catch (e) {
    console.warn("Audio splash blocked:", e);
  }
}

/**
 * Synthesizes a whirring/click camera sound (shutter release and motor wind)
 */
export function playCameraSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // 1. Mirror Slap / Shutter Click (Noise blast)
    const bufferSize = ctx.sampleRate * 0.12; // 120ms
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    
    // Filter the noise to sound mechanical
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1000, now);
    filter.Q.setValueAtTime(2, now);
    
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.35, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    
    noise.start(now);
    noise.stop(now + 0.12);
    
    // 2. Polaroid film eject motor whir
    const oscMotor = ctx.createOscillator();
    const motorGain = ctx.createGain();
    
    oscMotor.type = 'sawtooth';
    // Frequency starts low, goes up, then down simulating a motor engaging
    oscMotor.frequency.setValueAtTime(80, now + 0.12);
    oscMotor.frequency.linearRampToValueAtTime(250, now + 0.3);
    oscMotor.frequency.linearRampToValueAtTime(200, now + 0.8);
    oscMotor.frequency.exponentialRampToValueAtTime(10, now + 1.2);
    
    // Low pass filter to make the motor sound deep and inside casing
    const motorFilter = ctx.createBiquadFilter();
    motorFilter.type = 'lowpass';
    motorFilter.frequency.setValueAtTime(400, now);
    
    motorGain.gain.setValueAtTime(0.0, now);
    motorGain.gain.setValueAtTime(0.15, now + 0.12);
    motorGain.gain.linearRampToValueAtTime(0.12, now + 0.8);
    motorGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    
    oscMotor.connect(motorFilter);
    motorFilter.connect(motorGain);
    motorGain.connect(ctx.destination);
    
    oscMotor.start(now + 0.12);
    oscMotor.stop(now + 1.2);
  } catch (e) {
    console.warn("Audio camera sound blocked:", e);
  }
}

/**
 * Synthesizes printer whir and tearing paper when printing receipts
 */
export function playPrinterSound(durationSeconds = 1.5) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // We will generate a recurring thermal stepper motor whirr
    // It's a combination of a low hum and short ticks of noise
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(90, now);
    
    // Stepper motor sound modulation
    const mod = ctx.createOscillator();
    const modGain = ctx.createGain();
    mod.frequency.setValueAtTime(18, now); // stepper rate
    modGain.gain.setValueAtTime(15, now);
    
    mod.connect(modGain);
    modGain.connect(osc.frequency);
    
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(250, now);
    
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.setValueAtTime(0.05, now + durationSeconds - 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + durationSeconds);
    
    osc.connect(lp);
    lp.connect(gain);
    gain.connect(ctx.destination);
    
    mod.start(now);
    osc.start(now);
    
    mod.stop(now + durationSeconds);
    osc.stop(now + durationSeconds);
    
    // Paper tear at the end
    setTimeout(() => {
      try {
        const tearCtx = getAudioContext();
        const t = tearCtx.currentTime;
        const bufferSize = tearCtx.sampleRate * 0.15; // 150ms
        const buffer = tearCtx.createBuffer(1, bufferSize, tearCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        
        const tearNoise = tearCtx.createBufferSource();
        tearNoise.buffer = buffer;
        
        const hp = tearCtx.createBiquadFilter();
        hp.type = 'highpass';
        hp.frequency.setValueAtTime(1500, t);
        
        const tearGain = tearCtx.createGain();
        tearGain.gain.setValueAtTime(0.2, t);
        tearGain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        
        tearNoise.connect(hp);
        hp.connect(tearGain);
        tearGain.connect(tearCtx.destination);
        
        tearNoise.start(t);
        tearNoise.stop(t + 0.15);
      } catch (e) {
        console.warn("Tear audio failed:", e);
      }
    }, durationSeconds * 1000);
    
  } catch (e) {
    console.warn("Audio printer sound blocked:", e);
  }
}
