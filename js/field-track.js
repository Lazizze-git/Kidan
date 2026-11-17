// @ts-check
// La piste du fond : la forme d'onde d'un morceau imaginaire à 124 BPM,
// calculée une fois. Quatre phrases de 16 temps (intro, montée, pause,
// reprise) bouclent sans couture, comme un morceau qu'on mixe en boucle.

/** @typedef {{ outer: Float32Array, core: Float32Array, barsPerBeat: number, bpm: number }} Track */

export const BPM = 124;
export const BARS_PER_BEAT = 6;
const BEATS = 64;
const BEATS_PER_PHRASE = 16;
const PHRASE_ENERGY = [0.62, 0.9, 0.48, 1];
const SEED = 45;

/**
 * Générateur pseudo-aléatoire déterministe (mulberry32) : la même piste
 * à chaque visite, sur chaque page.
 * @param {number} seed
 * @returns {() => number}
 */
function createRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value = (value + 0x6d2b79f5) >>> 0;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * @param {number} value
 * @param {number} min
 * @param {number} max
 */
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Amplitude d'une barre : la frappe du kick en début de temps, le charley
 * à contretemps, le corps du son qui ondule, un peu de grain.
 * @param {number} index
 * @param {() => number} random
 */
function barAmplitude(index, random) {
  const beat = Math.floor(index / BARS_PER_BEAT);
  const phase = (index % BARS_PER_BEAT) / BARS_PER_BEAT;
  const phrase = Math.floor(beat / BEATS_PER_PHRASE) % PHRASE_ENERGY.length;
  const energy = PHRASE_ENERGY[phrase] ?? 1;
  const kick = Math.exp(-phase * 5);
  const hat = phase >= 0.5 && phase < 0.67 ? 0.18 : 0;
  const body = 0.42 + 0.22 * Math.sin(index * 0.37) * Math.sin(index * 0.053);
  const grain = random() * 0.16;
  return {
    outer: clamp(energy * (0.34 * kick + body + hat + grain), 0.08, 1),
    kick,
  };
}

/** @returns {Track} */
export function buildTrack() {
  const total = BEATS * BARS_PER_BEAT;
  const outer = new Float32Array(total);
  const core = new Float32Array(total);
  const random = createRandom(SEED);
  for (let index = 0; index < total; index += 1) {
    const bar = barAmplitude(index, random);
    outer[index] = bar.outer;
    core[index] = bar.outer * (0.42 + 0.3 * bar.kick);
  }
  return { outer, core, barsPerBeat: BARS_PER_BEAT, bpm: BPM };
}
