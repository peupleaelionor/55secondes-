/**
 * Lightweight sound + haptic utilities. No heavy dependencies.
 * Sound is generated via the Web Audio API on demand; haptics use the
 * Vibration API where available. Everything degrades to a no-op silently.
 */

export type SoundType = "tap" | "success" | "fail" | "risk" | "reveal" | "tick";
export type HapticType = "light" | "medium" | "heavy" | "success" | "warning";

let audioCtx: AudioContext | null = null;
let enabled = true;

function ctx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!enabled) return null;
  try {
    if (!audioCtx) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AC) return null;
      audioCtx = new AC();
    }
    if (audioCtx.state === "suspended") void audioCtx.resume();
    return audioCtx;
  } catch {
    return null;
  }
}

function blip(freq: number, duration: number, type: OscillatorType = "sine", gain = 0.06) {
  const ac = ctx();
  if (!ac) return;
  try {
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0, ac.currentTime);
    g.gain.linearRampToValueAtTime(gain, ac.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + duration);
    osc.connect(g).connect(ac.destination);
    osc.start();
    osc.stop(ac.currentTime + duration + 0.02);
  } catch {
    /* no-op */
  }
}

export function playSound(type: SoundType): void {
  switch (type) {
    case "tap":
      blip(420, 0.08, "triangle", 0.05);
      break;
    case "success":
      blip(523, 0.12, "sine", 0.07);
      setTimeout(() => blip(784, 0.18, "sine", 0.07), 90);
      break;
    case "fail":
      blip(220, 0.18, "sawtooth", 0.05);
      setTimeout(() => blip(160, 0.22, "sawtooth", 0.05), 110);
      break;
    case "risk":
      blip(300, 0.1, "square", 0.04);
      break;
    case "reveal":
      blip(660, 0.1, "sine", 0.06);
      setTimeout(() => blip(990, 0.16, "sine", 0.06), 80);
      break;
    case "tick":
      blip(880, 0.03, "square", 0.02);
      break;
  }
}

export function triggerHaptic(type: HapticType): void {
  if (typeof navigator === "undefined" || !("vibrate" in navigator)) return;
  try {
    const patterns: Record<HapticType, number | number[]> = {
      light: 10,
      medium: 20,
      heavy: 35,
      success: [12, 40, 18],
      warning: [20, 50, 20],
    };
    navigator.vibrate(patterns[type]);
  } catch {
    /* no-op */
  }
}

export function setAudioEnabled(value: boolean): void {
  enabled = value;
}
