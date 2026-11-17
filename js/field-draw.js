// @ts-check
// Dessin d'une image de la piste : la grille de beats en pointillés, puis
// la forme d'onde en barres verticales, en miroir autour du milieu de l'écran.

/** @typedef {import("./field-track.js").Track} Track */
/** @typedef {{ outer: string, core: string, grid: string }} FieldColors */
/**
 * middle : ligne médiane de la forme d'onde (le milieu de la plaque d'en-tête)
 * @typedef {{ width: number, height: number, dpr: number, offset: number, middle: number }} FieldView
 */

export const BAR_PITCH = 3;
const BAR_WIDTH = 2;
const BEATS_PER_BAR = 4;
const GRID_DASH = [1, 3];
const AMPLITUDE_SCALE = 0.92;

/**
 * Couleurs lues dans les jetons CSS (css/jetons.css).
 * @returns {FieldColors}
 */
export function readFieldColors() {
  const style = getComputedStyle(document.documentElement);
  const read = (/** @type {string} */ name) => style.getPropertyValue(name).trim();
  return {
    outer: read("--wave-outer"),
    core: read("--wave-core"),
    grid: read("--wave-grid"),
  };
}

/**
 * @param {Track} track
 * @returns {number} longueur de la boucle, en pixels CSS
 */
export function loopLength(track) {
  return track.outer.length * BAR_PITCH;
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {Track} track
 * @param {FieldView} view
 * @param {string} color
 */
function drawGrid(ctx, track, view, color) {
  const beatPx = track.barsPerBeat * BAR_PITCH;
  const firstBeat = Math.floor(view.offset / beatPx);
  const weak = new Path2D();
  const strong = new Path2D();
  for (let beat = firstBeat; ; beat += 1) {
    const x = Math.round(beat * beatPx - view.offset) + 0.5;
    if (x > view.width) {
      break;
    }
    const path = beat % BEATS_PER_BAR === 0 ? strong : weak;
    path.moveTo(x, 0);
    path.lineTo(x, view.height);
  }
  ctx.lineWidth = 1;
  ctx.setLineDash(GRID_DASH);
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.45;
  ctx.stroke(weak);
  ctx.globalAlpha = 1;
  ctx.stroke(strong);
  ctx.setLineDash([]);
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {Float32Array} amplitudes
 * @param {FieldView} view
 * @param {string} color
 */
function drawBars(ctx, amplitudes, view, color) {
  const count = amplitudes.length;
  const middle = view.middle;
  const reach = middle * AMPLITUDE_SCALE;
  const first = Math.floor(view.offset / BAR_PITCH);
  const shift = view.offset - first * BAR_PITCH;
  ctx.beginPath();
  for (let x = -shift, index = first; x < view.width; x += BAR_PITCH, index += 1) {
    const half = (amplitudes[index % count] ?? 0) * reach;
    ctx.rect(x, middle - half, BAR_WIDTH, half * 2);
  }
  ctx.fillStyle = color;
  ctx.fill();
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {Track} track
 * @param {FieldView} view
 * @param {FieldColors} colors
 */
export function drawField(ctx, track, view, colors) {
  ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
  ctx.clearRect(0, 0, view.width, view.height);
  drawGrid(ctx, track, view, colors.grid);
  drawBars(ctx, track.outer, view, colors.outer);
  drawBars(ctx, track.core, view, colors.core);
}
