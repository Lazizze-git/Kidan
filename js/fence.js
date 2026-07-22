// Grillage photocopié en fond de page : la tuile pixel art fournie par
// le client est dessinée une fois sur un petit canvas, puis répétée en
// image de fond sur toute la hauteur de chaque page. Statique.
import { FENCE_TILE } from "./data/fence-tile.js";

// 141px de large → 564px à l'écran, pixels apparents (image-rendering)
const TILE_SCALE = 4;
// Fondu pour que les affiches et le texte restent bien lisibles
const TILE_ALPHA = 0.32;

export function initFence() {
  const { palette, rows } = FENCE_TILE;
  if (!rows || rows.length === 0) {
    return;
  }

  const cols = rows[0].length;
  const tile = document.createElement("canvas");
  tile.width = cols;
  tile.height = rows.length;
  const ctx = tile.getContext("2d");
  if (!ctx) {
    return;
  }

  ctx.globalAlpha = TILE_ALPHA;
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x += 1) {
      const color = palette[row[x]];
      if (!color) {
        continue;
      }
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 1, 1);
    }
  });

  // La tuile est exposée en variables CSS : le body l'utilise, et le
  // menu mobile (ou tout autre panneau) peut afficher le même mur
  const root = document.documentElement;
  root.style.setProperty("--fence-tile", `url(${tile.toDataURL("image/png")})`);
  root.style.setProperty(
    "--fence-size",
    `${cols * TILE_SCALE}px ${rows.length * TILE_SCALE}px`
  );
}
