// @ts-check
// La piste qui joue derrière le panneau : elle défile au tempo du morceau,
// et s'arrête quand l'onglet est caché, quand le système demande moins
// d'animations, ou quand le visiteur appuie sur pause (choix mémorisé).
import { buildTrack } from "./field-track.js";
import { BAR_PITCH, drawField, loopLength, readFieldColors } from "./field-draw.js";

const MAX_DPR = 2;
const MAX_FRAME_GAP_MS = 100;
const STORAGE_KEY = "45-syndicate-piste";
const LABEL_PAUSE = "Mettre la piste du fond en pause";
const LABEL_PLAY = "Relancer la piste du fond";

/**
 * La forme d'onde se centre sur la plaque d'en-tête, comme la tête de
 * lecture d'une platine ; sans plaque, au milieu de l'écran.
 * @param {number} fallback
 */
function readTrackMiddle(fallback) {
  const plate = document.querySelector(".plate");
  if (!plate) {
    return fallback;
  }
  const box = plate.getBoundingClientRect();
  return box.top + window.scrollY + box.height / 2;
}

/** @returns {boolean} */
function readUserPaused() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "pause";
  } catch {
    return false;
  }
}

/** @param {boolean} paused */
function writeUserPaused(paused) {
  try {
    window.localStorage.setItem(STORAGE_KEY, paused ? "pause" : "lecture");
  } catch {
    // Stockage indisponible (navigation privée) : le choix vaut pour cette page
  }
}

/**
 * @param {HTMLButtonElement | null} button
 * @param {boolean} paused
 * @param {boolean} available
 */
function syncButton(button, paused, available) {
  if (!button) {
    return;
  }
  button.hidden = !available;
  button.setAttribute("aria-pressed", String(paused));
  const label = button.querySelector("[data-field-toggle-label]");
  if (label) {
    label.textContent = paused ? LABEL_PLAY : LABEL_PAUSE;
  }
}

export function initField() {
  const canvas = document.querySelector("[data-field]");
  if (!(canvas instanceof HTMLCanvasElement)) {
    return;
  }
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }

  const track = buildTrack();
  const colors = readFieldColors();
  const loop = loopLength(track);
  const speed = (track.bpm / 60_000) * track.barsPerBeat * BAR_PITCH;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const button = document.querySelector("[data-field-toggle]");
  const toggle = button instanceof HTMLButtonElement ? button : null;

  // La piste repart là où elle en est « dans le temps » : d'une page à
  // l'autre, le morceau semble continuer.
  const view = { width: 0, height: 0, dpr: 1, middle: 0, offset: (Date.now() * speed) % loop };
  let userPaused = readUserPaused();
  let frame = 0;
  let last = 0;

  const draw = () => drawField(ctx, track, view, colors);

  const resize = () => {
    view.dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    view.width = canvas.clientWidth;
    view.height = canvas.clientHeight;
    view.middle = readTrackMiddle(view.height / 2);
    canvas.width = Math.round(view.width * view.dpr);
    canvas.height = Math.round(view.height * view.dpr);
    draw();
  };

  /** @param {number} now */
  const tick = (now) => {
    const gap = last === 0 ? 16 : Math.min(now - last, MAX_FRAME_GAP_MS);
    last = now;
    view.offset = (view.offset + gap * speed) % loop;
    draw();
    frame = window.requestAnimationFrame(tick);
  };

  const sync = () => {
    const shouldPlay = !reducedMotion.matches && !userPaused && !document.hidden;
    window.cancelAnimationFrame(frame);
    frame = 0;
    last = 0;
    if (shouldPlay) {
      frame = window.requestAnimationFrame(tick);
    }
    syncButton(toggle, userPaused, !reducedMotion.matches);
  };

  let resizeFrame = 0;
  window.addEventListener("resize", () => {
    window.cancelAnimationFrame(resizeFrame);
    resizeFrame = window.requestAnimationFrame(resize);
  });
  document.addEventListener("visibilitychange", sync);
  reducedMotion.addEventListener("change", sync);
  toggle?.addEventListener("click", () => {
    userPaused = !userPaused;
    writeUserPaused(userPaused);
    sync();
  });

  resize();
  sync();
}
