const themes = [
  { id: "tokyo-night", label: "Tokyo Night" },
  { id: "catppuccin-mocha", label: "Catppuccin" },
  { id: "gruvbox", label: "Gruvbox" },
  { id: "nord", label: "Nord" },
  { id: "rose-pine", label: "Rosé Pine" },
  { id: "catppuccin-latte", label: "Catppuccin Latte" },
];

const themeKey = "mangrs-theme";

const GLYPHS = {
  M: [
    "1110000000111",
    "1111000001111",
    "1111100011111",
    "1111110111111",
    "1111111111111",
    ...Array(12).fill("1110011100111"),
  ],
  O: [
    "001111100",
    "011111110",
    ...Array(13).fill("111000111"),
    "011111110",
    "001111100",
  ],
  R: [
    "001111100",
    "011111110",
    "111000111",
    "111000111",
    "111000111",
    "111000111",
    "111111110",
    "111111100",
    "111000000",
    "111000000",
    "111100000",
    "111110000",
    "111111000",
    "111011100",
    "111001110",
    "111000111",
    "111000111",
  ],
  S: [
    "001111100",
    "011111110",
    "111000000",
    "111000000",
    "111000000",
    "011110000",
    "001111100",
    "000011110",
    "000000111",
    "000000111",
    "000000111",
    "000000111",
    "000000111",
    "111000111",
    "111111110",
    "011111100",
    "001111000",
  ],
  "ă": [
    "000000000",
    "000000000",
    "011000110",
    "001111100",
    "000000000",
    "000000000",
    "001111100",
    "011111110",
    "000000111",
    "001111111",
    "011000111",
    "111000111",
    "111000111",
    "111000111",
    "011000111",
    "001111111",
    "000111100",
    "000000000",
    "000000000",
  ],
  n: [
    "000000000",
    "000000000",
    "000000000",
    "000000000",
    "000000000",
    "000000000",
    "111000111",
    "111100111",
    "111111111",
    "111000111",
    "111000111",
    "111000111",
    "111000111",
    "111000111",
    "111000111",
    "111000111",
    "111000111",
    "000000000",
    "000000000",
  ],
  g: [
    "000000000",
    "000000000",
    "000000000",
    "000000000",
    "000000000",
    "000000000",
    "001111100",
    "011111110",
    "111000111",
    "111000111",
    "111000111",
    "111000111",
    "011111111",
    "000000111",
    "000000111",
    "000000111",
    "011000111",
    "001111110",
    "000111100",
  ],
};

const GAP_CELLS = 1;
const WORD = [..."MăngRS"].map((ch) => GLYPHS[ch] || GLYPHS.O);

const INK_CELLS = [];
WORD.forEach((grid, li) => {
  grid.forEach((row, r) => {
    for (let c = 0; c < row.length; c++) {
      if (row[c] === "1") INK_CELLS.push({ li, r, c });
    }
  });
});

const FALLBACK_COLORS = ["#eef2ff", "#c9d6ff", "#99b5fb", "#7290dd", "#5468b0"];

const RIPPLE_PATTERN = [
  "111111111111111",
  "100000010000001",
  "101111110001101",
  "101000000000101",
  "101000000000101",
  "101000000000101",
  "101100000000101",
  "111000000000101",
  "101000000000101",
  "101000000000101",
  "101000000000101",
  "101000000000101",
  "101111111111101",
  "100000010000001",
  "111111110111111",
];

const GHOST_MARKER = [".1.", "1.1", ".1."];

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let wordPointer = { active: false, x: -1e4, y: -1e4 };
let wordFx = [];
let wordFxRaf = 0;
let wordFxBag = [];
let wordFxLast = "";
let wordFxPrimed = false;
let wordHoverRaf = 0;
let themeColorCache = { theme: null, colors: null };

const WORD_FX = [
  { id: "ripple", duration: 950 },
  { id: "shockwave", duration: 1050 },
  { id: "vortex", duration: 1250 },
  { id: "gravity", duration: 1150 },
  { id: "scatter", duration: 1000 },
  { id: "wave", duration: 1250 },
  { id: "glitch", duration: 720 },
  { id: "implode", duration: 1150 },
  { id: "heartbeat", duration: 1050 },
  { id: "rain", duration: 1350 },
  { id: "dither", duration: 900 },
  { id: "blockshift", duration: 1000 },
  { id: "scanline", duration: 1000 },
  { id: "cascade", duration: 1150 },
  { id: "tetris", duration: 1500 },
  { id: "pixrain", duration: 1450 },
  { id: "laserbeam", duration: 1250 },
  { id: "matrix", duration: 1600 },
  { id: "firework", duration: 1400 },
  { id: "tvnoise", duration: 900 },
  { id: "lineslide", duration: 1100 },
  { id: "dissolve", duration: 1300 },
  { id: "checker", duration: 1000 },
  { id: "laser", duration: 950 },
  { id: "letterflicker", duration: 1100 },
  { id: "loadbar", duration: 1200 },
];

const BAYER4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

function hashRand(a, b, c, d) {
  let h = Math.imul(a + 1, 374761393) ^ Math.imul(b + 1, 668265263);
  h = Math.imul(h ^ (c + 1), 1274126177);
  h = Math.imul(h ^ (d + 1), 2654435761);
  h ^= h >>> 15;
  h = Math.imul(h, 2246822519);
  h ^= h >>> 13;
  return (h >>> 0) / 4294967296;
}

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

const easeOutBack = (t) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

function nextWordFx() {
  if (!wordFxPrimed) {
    wordFxPrimed = true;
    wordFxLast = "ripple";
    return WORD_FX[0];
  }
  if (!wordFxBag.length) {
    wordFxBag = WORD_FX.filter((fx) => fx.id !== wordFxLast);
    for (let i = wordFxBag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [wordFxBag[i], wordFxBag[j]] = [wordFxBag[j], wordFxBag[i]];
    }
  }
  const fx = wordFxBag.pop();
  wordFxLast = fx.id;
  return fx;
}

function readCssVar(name, fallback) {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return value || fallback;
}

function getThemeColors() {
  const map = {
    "tokyo-night": ["#eef2ff", "#c9d6ff", "#99b5fb", "#7290dd", "#5468b0"],
    "catppuccin-mocha": ["#f0f3ff", "#cfd9f8", "#a6b7e6", "#8194c8", "#5f70a6"],
    gruvbox: ["#fff6d8", "#f3e2b3", "#e3c88b", "#c2a364", "#94784a"],
    nord: ["#f5f9ff", "#d7e4f2", "#b0c6de", "#8da5c4", "#6b82a1"],
    "rose-pine": ["#fff2f1", "#f4d6d7", "#ddb3ba", "#be8d9d", "#956c7f"],
    "catppuccin-latte": ["#5b7ede", "#3f63c9", "#2a4aa8", "#1a3179", "#0c1c4a"],
  };
  const t =
    document.documentElement.getAttribute("data-theme") || "gruvbox";
  if (themeColorCache.theme === t && themeColorCache.colors)
    return themeColorCache.colors;
  const colors = [...(map[t] || FALLBACK_COLORS)];
  themeColorCache = { theme: t, colors };
  return colors;
}

let rowBandCache = { key: "", bands: [] };

function luminance(value) {
  const match = /^#([0-9a-f]{6})$/i.exec((value || "").trim());
  if (!match) return 0;
  const n = parseInt(match[1], 16);
  return (
    0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)
  );
}

function getRowBands(colors, rows) {
  const key = colors.join("|") + "|" + rows;
  if (rowBandCache.key === key) return rowBandCache.bands;
  const ordered = [...colors].sort((a, b) => luminance(b) - luminance(a));
  const bands = [];
  for (let r = 0; r < rows; r++) {
    const index = Math.min(
      ordered.length - 1,
      Math.floor((r / rows) * ordered.length),
    );
    bands.push(ordered[index]);
  }
  rowBandCache = { key, bands };
  return bands;
}

function drawWordmark(now = performance.now()) {
  const canvas = document.getElementById("wordmarkCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const bw = Math.round(rect.width * dpr);
  const bh = Math.round(rect.height * dpr);
  if (canvas.width !== bw || canvas.height !== bh) {
    canvas.width = bw;
    canvas.height = bh;
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, rect.width, rect.height);
  const cw = rect.width;
  const ch = rect.height;
  const snap = (value) => Math.round(value * dpr) / dpr;
  const glyphWidths = WORD.map((grid) => grid[0].length);
  const columnStarts = [];
  let columnCount = 0;
  glyphWidths.forEach((width, index) => {
    columnStarts.push(columnCount);
    columnCount += width + (index < glyphWidths.length - 1 ? GAP_CELLS : 0);
  });
  const totalCells = columnCount;
  const rows = Math.max(...WORD.map((grid) => grid.length));
  let scale = Math.min(cw / totalCells, ch / rows) * 0.95;
  scale = Math.max(1 / dpr, Math.round(scale * dpr) / dpr);
  const letterH = rows * scale;
  let x = snap((cw - totalCells * scale) / 2);
  let y = snap((ch - letterH) / 2);
  const originX = x;
  const colors = getThemeColors();
  const bands = getRowBands(colors, rows);
  const reduce = reduceMotion.matches;
  const pointer = wordPointer;
  const effects = reduce ? [] : wordFx;
  const maxR = Math.hypot(cw, ch) || 1;
  WORD.forEach((grid, li) => {
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        if (grid[r][c] !== "1") continue;
        const cellX = x + c * scale;
        const cellY = y + r * scale;
        const cx = cellX + scale / 2;
        const cy = cellY + scale / 2;
        let color = bands[r];
        let override = null;
        let offX = 0;
        let offY = 0;
        let mul = 1;
        let alpha = 1;
        let hide = false;
        let mark = null;

        if (!reduce && pointer.active) {
          const dist = Math.sqrt((cx - pointer.x) ** 2 + (cy - pointer.y) ** 2);
          if (dist < scale * 3.4) color = colors[0];
          else if (dist < scale * 6.5) color = colors[1];
        }

        for (let i = 0; i < effects.length; i++) {
          const fx = effects[i];
          const age = (now - fx.start) / fx.duration;
          if (age < 0 || age >= 1) continue;
          const dx = cx - fx.x;
          const dy = cy - fx.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;

          switch (fx.id) {
            case "ripple": {
              const radius = age * cw * 1.08;
              const band = scale * 6;
              const delta = Math.abs(dist - radius);
              if (delta < band) {
                const k = 1 - delta / band;
                override = k > 0.3 ? colors[0] : colors[1];
                offX += (dx / dist) * k * 3.5;
                offY += (dy / dist) * k * 3.5;
                mul *= 1 + k * 0.2;
              }
              break;
            }
            case "shockwave": {
              const nd = dist / maxR;
              const ring = Math.abs(nd - age * 1.05);
              if (ring < 0.075) {
                override = ring < 0.03 ? colors[0] : colors[1];
                if (ring < 0.045) {
                  offX += Math.round((dx / dist) * 1) * scale;
                  offY += Math.round((dy / dist) * 1) * scale;
                }
              }
              break;
            }
            case "vortex": {
              const pull = Math.sin(age * Math.PI);
              const decay = Math.exp(-dist / (cw * 0.42));
              const steps = Math.round(pull * 2 * decay);
              if (steps) {
                offX += Math.round((-dy / dist) * steps) * scale;
                offY += Math.round((dx / dist) * steps) * scale;
              }
              const strength = pull * decay;
              if (strength > 0.5) override = colors[0];
              else if (strength > 0.22) override = colors[1];
              break;
            }
            case "gravity": {
              const delay = hashRand(li, r, c, 1) * 0.18;
              const t2 = Math.min(1, Math.max(0, (age - delay) / (1 - delay)));
              const ampCells = 2 + Math.round(hashRand(li, r, c, 2) * 5);
              const drop =
                t2 < 0.42
                  ? Math.pow(t2 / 0.42, 2)
                  : 1 - easeOutBack((t2 - 0.42) / 0.58);
              offY += Math.round(drop * ampCells) * scale;
              if (t2 > 0.38 && t2 < 0.52) override = colors[0];
              break;
            }
            case "scatter": {
              const phase = Math.sin(age * Math.PI);
              const gx =
                originX +
                (columnStarts[li] + glyphWidths[li] / 2) * scale -
                fx.x;
              const gy = y + rows * scale * 0.5 - fx.y;
              const gd = Math.hypot(gx, gy) || 1;
              const amp = Math.round(phase * 2);
              if (amp) {
                offX += Math.round((gx / gd) * amp) * scale;
                offY += Math.round((gy / gd) * amp) * scale;
              }
              if (phase > 0.3 && hashRand(li, r, c, 5) < 0.12) {
                offX += Math.round(gx / gd) * scale;
                offY += Math.round(gy / gd) * scale;
                override = colors[0];
              }
              break;
            }
            case "wave": {
              const fade = Math.sin(age * Math.PI);
              const dir = fx.x < cw / 2 ? 1 : -1;
              const phase = columnStarts[li] * 0.09 * dir - age * Math.PI * 2.2;
              const sway = Math.sin(phase) * fade;
              offY -= Math.round(sway * 1.6) * scale;
              offX += Math.round(Math.cos(phase) * fade) * scale;
              if (sway > 0.55) override = colors[0];
              else if (sway < -0.55) override = colors[3];
              break;
            }
            case "glitch": {
              const step = Math.floor(age * 12);
              const noise = hashRand(li, r, c, 10 + step);
              const band = Math.floor(cy / (scale * 2));
              const shift =
                band % 3 === step % 3
                  ? (step % 2 ? 1 : -1) * (step % 3 === 0 ? 2 : 1)
                  : 0;
              if (noise < 0.12) {
                offX +=
                  Math.round(
                    (hashRand(li, r, c, 30 + step) - 0.5) * 2 + shift,
                  ) * scale;
                override = noise < 0.05 ? colors[0] : colors[4];
              } else if (shift) {
                offX += shift * scale;
                override = colors[3];
              }
              break;
            }
            case "implode": {
              const cheb = Math.max(Math.abs(dx), Math.abs(dy)) / scale;
              const ring = (1 - age) * totalCells * 0.55;
              if (cheb > ring) hide = true;
              else if (cheb > ring - 1.2) override = colors[0];
              break;
            }
            case "heartbeat": {
              const nd = Math.min(1, dist / maxR);
              const local = Math.min(1, Math.max(0, (age - nd * 0.22) / 0.78));
              const beat =
                Math.sin(local * Math.PI * 2) * Math.exp(-local * 1.2);
              offY -= Math.round(beat * 1.2) * scale;
              if (beat > 0.5) override = colors[0];
              else if (beat > 0.22) override = colors[1];
              break;
            }
            case "rain": {
              const delay = hashRand(li, r, c, 7) * 0.35;
              const local = Math.min(
                1,
                Math.max(0, (age - delay) / (1 - delay)),
              );
              const steps = Math.round(
                Math.pow(local, 1.7) * 4 * (0.5 + hashRand(li, r, c, 8)),
              );
              offY += steps * scale;
              alpha *= 1 - local * 0.55;
              break;
            }
            case "dither": {
              const raw = age < 0.5 ? age * 2 : (1 - age) * 2;
              const phase = raw * 0.86;
              const threshold = (BAYER4[r & 3][c & 3] + 0.5) / 16;
              if (threshold < phase) hide = true;
              else if (threshold < phase + 0.18) override = colors[0];
              break;
            }
            case "blockshift": {
              const frames = [0, 1, -1, 1, -1, 0];
              const frame = Math.floor(age * frames.length);
              const shift =
                age < 0.88 ? frames[(frame + r) % frames.length] : 0;
              if (shift) {
                offX += shift * scale;
                override = shift > 0 ? colors[1] : colors[3];
                alpha *= 0.94;
              }
              break;
            }
            case "scanline": {
              const bandRow =
                age < 0.92 ? Math.floor(age * (rows + 2)) - 1 : -99;
              const gapRow = Math.abs(r - bandRow);
              if (gapRow < 0.5) {
                override = colors[0];
                offY -= scale;
              } else if (gapRow < 1.5) {
                override = colors[1];
              } else if (age > 0.08) {
                alpha *= 0.85;
              }
              break;
            }
            case "cascade": {
              const column = columnStarts[li] + c;
              const delay = (column / totalCells) * 0.4;
              const local = Math.min(
                1,
                Math.max(0, (age - delay) / (1 - delay)),
              );
              const fall = local < 0.5 ? local * 2 : (1 - local) * 2;
              const steps = Math.round(fall * 3);
              offY += steps * scale;
              if (steps) override = steps >= 2 ? colors[0] : colors[1];
              break;
            }
            case "tetris": {
              const column = columnStarts[li] + c;
              const delay = Math.min(
                0.72,
                (column / totalCells) * 0.42 + ((rows - 1 - r) / rows) * 0.22,
              );
              const t = Math.min(1, Math.max(0, (age - delay) / (1 - delay)));
              if (t < 1) {
                const fall = 1 - t;
                offY -= Math.round(fall * (r + 10)) * scale;
                if (hashRand(li, r, c, 616) < 0.14) {
                  const drift = hashRand(li, r, c, 617) > 0.5 ? 1 : -1;
                  offX += Math.round(fall * drift) * scale;
                }
                if (fall < 0.16) override = colors[1];
              }
              break;
            }
            case "pixrain": {
              const seed = hashRand(li, r, c, 911);
              const delay = seed * 0.6;
              const t = Math.min(1, Math.max(0, (age - delay) / (1 - delay)));
              if (t < 1) {
                const fall = 1 - t;
                offY -= Math.round(fall * fall * (10 + seed * 18)) * scale;
                alpha *= 0.75;
                if (fall < 0.1) override = colors[1];
              }
              break;
            }
            case "laserbeam": {
              if (age < 0.3) {
                hide = true;
                break;
              }
              const radius = ((age - 0.3) / 0.7) * maxR * 0.62;
              if (dist > radius) hide = true;
              else if (dist > radius - scale * 3) override = colors[0];
              break;
            }
            case "matrix": {
              const column = columnStarts[li] + c;
              const speed = 0.8 + hashRand(column, 0, 0, 912) * 1.2;
              const head =
                ((age * speed + hashRand(column, 1, 0, 913)) % 1.4) *
                  (rows + 8) -
                4;
              const drop = r - head;
              if (drop > 0.6) hide = true;
              else if (drop > -3) override = colors[0];
              else alpha *= 0.22;
              break;
            }
            case "firework": {
              if (age < 0.18) {
                alpha *= 0.5;
                break;
              }
              const burst = Math.min(1, (age - 0.18) / 0.82);
              const ring = easeOutCubic(burst) * maxR * 0.8;
              const delta = Math.abs(dist - ring);
              if (burst < 0.12) override = colors[0];
              else if (delta < scale * 2.5) override = colors[0];
              else if (delta < scale * 5) override = colors[1];
              const push = Math.round(Math.sin(burst * Math.PI) * 2);
              if (push) {
                offX += Math.round((dx / dist) * push) * scale;
                offY += Math.round((dy / dist) * push) * scale;
              }
              if (burst > 0.4) alpha *= Math.max(0, 1 - (burst - 0.4) / 0.6);
              break;
            }
            case "tvnoise": {
              const step = Math.floor(age * 24);
              const noise = hashRand(li, r, c, 914 + step);
              if (noise < 0.24) hide = true;
              else if (noise < 0.4) override = colors[0];
              else if (noise > 0.92)
                offX += (hashRand(c, r, step, 915) > 0.5 ? 1 : -1) * scale;
              const band = Math.floor((cy - y) / (scale * 3));
              if ((band + step) % 8 === 0) offX += scale;
              alpha *= 0.7 + hashRand(li, step, 7, 916) * 0.3;
              break;
            }
            case "lineslide": {
              const slide = Math.sin(age * Math.PI) * (1 + (r % 3));
              offX += Math.round(slide * (r % 2 ? 1 : -1)) * scale;
              alpha *= 0.55 + 0.45 * Math.abs(Math.cos(age * Math.PI * 6));
              const sweep = (age * 1.4 - 0.2) * rows;
              if (Math.abs(r - sweep) < 1.5) override = colors[0];
              break;
            }
            case "dissolve": {
              const burst = age < 0.5 ? age * 2 : (1 - age) * 2;
              const angle = hashRand(li, r, c, 404) * Math.PI * 2;
              const away = Math.round(easeOutCubic(burst) * 3);
              offX += Math.round(Math.cos(angle) * away) * scale;
              offY += Math.round(Math.sin(angle) * away) * scale;
              mul *= 1 - burst * 0.65;
              alpha *= 1 - burst * 0.85;
              break;
            }
            case "checker": {
              const spread =
                (age < 0.5 ? age * 2 : (1 - age) * 2) * maxR;
              if (dist < spread) {
                if ((Math.floor(cx / scale) + Math.floor(cy / scale)) % 2)
                  hide = true;
                else override = colors[1];
              }
              break;
            }
            case "laser": {
              const beam = Math.abs(cx - fx.x + (cy - fx.y)) / Math.SQRT2;
              if (age < 0.55 && beam < scale) hide = true;
              else if (age < 0.55 && beam < scale * 2.4) override = colors[0];
              break;
            }
            case "letterflicker": {
              const step = Math.floor(age * 10);
              if (hashRand(li, step, 0, 505) < 0.35) hide = true;
              else if (hashRand(li, r, c, 606 + step) < 0.035) {
                mark = hashRand(c, r, step, 707) > 0.5 ? "+" : "x";
                override = colors[0];
              }
              break;
            }
            case "loadbar": {
              const column = columnStarts[li] + c;
              const barRow = 8;
              const colPos = column / totalCells;
              if (age < 0.32) {
                if (r !== barRow || colPos > age / 0.32) hide = true;
                else override = colors[0];
              } else {
                const rise = Math.min(
                  1,
                  Math.max(0, (age - 0.32 - colPos * 0.34) / 0.34),
                );
                if (rise === 0) hide = true;
                else offY += Math.round((barRow - r) * (1 - rise)) * scale;
              }
              break;
            }
          }
        }

        if (hide) continue;
        if (mark) {
          const unit = Math.max(1 / dpr, snap(scale * 0.2));
          const mx = cellX + offX + scale / 2;
          const my = cellY + offY + scale / 2;
          const arms =
            mark === "+"
              ? [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]]
              : [[0, 0], [-1, -1], [1, 1], [-1, 1], [1, -1]];
          ctx.globalAlpha = alpha;
          ctx.fillStyle = override || color;
          for (let a = 0; a < arms.length; a++) {
            const px = snap(mx + arms[a][0] * unit - unit / 2);
            const py = snap(my + arms[a][1] * unit - unit / 2);
            ctx.fillRect(px, py, unit, unit);
          }
          continue;
        }
        const size = Math.max(1 / dpr, scale * mul);
        const left = cellX + offX + (scale - size) / 2;
        const top = cellY + offY + (scale - size) / 2;
        const px = snap(left);
        const py = snap(top);
        const pw = Math.max(1 / dpr, snap(left + size) - px);
        const ph = Math.max(1 / dpr, snap(top + size) - py);
        ctx.globalAlpha = alpha < 0.02 ? 0 : alpha;
        ctx.fillStyle = override || color;
        ctx.fillRect(px, py, pw, ph);
      }
    }
    x += (glyphWidths[li] + GAP_CELLS) * scale;
  });
  if (!reduce && effects.length) {
    const geom = {
      originX,
      originY: y,
      scale,
      snap,
      colors,
      dpr,
      cw,
      ch,
      maxR,
      columnStarts,
    };
    for (let i = 0; i < effects.length; i++) {
      const fx = effects[i];
      const age = (now - fx.start) / fx.duration;
      if (age < 0 || age >= 1) continue;
      if (fx.id === "laserbeam") drawLaserBolt(ctx, fx, age, geom);
      drawWordParticles(ctx, fx, age, geom);
    }
  }
  ctx.globalAlpha = 1;
}

function drawLaserBolt(ctx, fx, age, geom) {
  if (age >= 0.3) return;
  const { scale, snap, colors, dpr } = geom;
  const t = easeOutCubic(Math.min(1, age / 0.3));
  const x = -scale * 8 + (fx.x + scale * 8) * t;
  const y = fx.y;
  const unit = Math.max(1 / dpr, snap(scale));
  ctx.globalAlpha = 1;
  ctx.fillStyle = colors[0];
  ctx.fillRect(
    snap(x - unit * 5),
    snap(y - unit * 0.3),
    snap(unit * 5),
    Math.max(1, snap(unit * 0.6)),
  );
  ctx.fillRect(
    snap(x - unit * 0.7),
    snap(y - unit * 0.7),
    snap(unit * 1.4),
    snap(unit * 1.4),
  );
}

const FX_PIXELS = {
  shockwave: {
    mode: "ring",
    density: 0.34,
    life: 0.6,
    delay: 0.15,
    speed: 1.15,
    size: [0.16, 0.34],
  },
  vortex: {
    mode: "orbit",
    density: 0.18,
    life: 0.9,
    delay: 0.2,
    speed: 3.2,
    size: [0.18, 0.38],
  },
  gravity: {
    mode: "fall",
    density: 0.16,
    life: 0.6,
    delay: 0.2,
    speed: 6,
    size: [0.2, 0.4],
  },
  scatter: {
    mode: "burst",
    density: 0.5,
    life: 0.65,
    delay: 0.15,
    speed: 7,
    size: [0.16, 0.34],
  },
  wave: {
    mode: "foam",
    density: 0.12,
    life: 0.7,
    delay: 0.3,
    speed: 2,
    size: [0.16, 0.32],
  },
  glitch: {
    mode: "streak",
    density: 0.1,
    life: 0.35,
    delay: 0.4,
    speed: 7,
    size: [0.16, 0.3],
  },
  implode: {
    mode: "implode",
    density: 0.3,
    life: 0.8,
    delay: 0.2,
    speed: 2.5,
    size: [0.18, 0.38],
  },
  heartbeat: {
    mode: "ring",
    density: 0.12,
    life: 0.6,
    delay: 0.3,
    speed: 0.5,
    size: [0.18, 0.36],
  },
  rain: {
    mode: "fall",
    density: 0.3,
    life: 0.7,
    delay: 0.35,
    speed: 5,
    size: [0.18, 0.38],
  },
  dither: {
    mode: "dust",
    density: 0.18,
    life: 0.5,
    delay: 0.4,
    speed: 1.6,
    size: [0.16, 0.3],
  },
  blockshift: {
    mode: "streak",
    density: 0.12,
    life: 0.35,
    delay: 0.4,
    speed: 5,
    size: [0.16, 0.3],
  },
  scanline: {
    mode: "streak",
    density: 0.16,
    life: 0.3,
    delay: 0.4,
    speed: 6,
    size: [0.14, 0.26],
  },
  cascade: {
    mode: "fall",
    density: 0.2,
    life: 0.6,
    delay: 0.3,
    speed: 5,
    size: [0.18, 0.36],
  },
  tetris: {
    mode: "fall",
    density: 0.18,
    life: 0.55,
    delay: 0.3,
    speed: 5,
    size: [0.2, 0.42],
  },
  pixrain: {
    mode: "fall",
    density: 0.3,
    life: 0.6,
    delay: 0.3,
    speed: 7,
    size: [0.14, 0.32],
  },
  laserbeam: {
    mode: "streak",
    density: 0.5,
    life: 0.4,
    delay: 0.1,
    speed: 9,
    size: [0.12, 0.28],
  },
  matrix: {
    mode: "fall",
    density: 0.1,
    life: 0.7,
    delay: 0.4,
    speed: 3,
    size: [0.14, 0.3],
  },
  firework: {
    mode: "burst",
    density: 0.7,
    life: 0.7,
    delay: 0.15,
    speed: 8,
    size: [0.12, 0.3],
  },
  tvnoise: {
    mode: "dust",
    density: 0.12,
    life: 0.35,
    delay: 0.5,
    speed: 2,
    size: [0.12, 0.24],
  },
  lineslide: {
    mode: "streak",
    density: 0.14,
    life: 0.35,
    delay: 0.4,
    speed: 6,
    size: [0.18, 0.4],
  },
  dissolve: {
    mode: "dust",
    density: 0.3,
    life: 0.8,
    delay: 0.25,
    speed: 2.2,
    size: [0.12, 0.28],
  },
  checker: {
    mode: "dust",
    density: 0.14,
    life: 0.55,
    delay: 0.45,
    speed: 1.4,
    size: [0.14, 0.26],
  },
  laser: {
    mode: "spark",
    density: 0.55,
    life: 0.55,
    delay: 0.12,
    speed: 7,
    size: [0.12, 0.26],
  },
  letterflicker: {
    mode: "dust",
    density: 0.1,
    life: 0.5,
    delay: 0.5,
    speed: 1.2,
    size: [0.14, 0.26],
  },
  loadbar: {
    mode: "streak",
    density: 0.16,
    life: 0.4,
    delay: 0.4,
    speed: 5,
    size: [0.16, 0.34],
  },
};

function drawWordParticles(ctx, fx, age, geom) {
  const cfg = FX_PIXELS[fx.id];
  if (!cfg) return;
  const { originX, originY, scale, snap, colors, dpr, maxR, columnStarts } =
    geom;
  const minPx = 1 / dpr;
  for (let i = 0; i < INK_CELLS.length; i++) {
    const cell = INK_CELLS[i];
    const h = hashRand(cell.li, cell.r, cell.c, 101);
    if (h > cfg.density) continue;
    const h2 = hashRand(cell.li, cell.r, cell.c, 202);
    const h3 = hashRand(cell.li, cell.r, cell.c, 303);
    const local = (age - h * cfg.delay) / cfg.life;
    if (local <= 0 || local >= 1) continue;
    const cx = originX + (columnStarts[cell.li] + cell.c + 0.5) * scale;
    const cy = originY + (cell.r + 0.5) * scale;
    const angle = Math.atan2(cy - fx.y, cx - fx.x);
    const ux = Math.cos(angle);
    const uy = Math.sin(angle);
    let px = cx;
    let py = cy;
    let w = scale * (cfg.size[0] + h2 * (cfg.size[1] - cfg.size[0]));
    let ph = w;
    let alpha = 1 - local;

    switch (cfg.mode) {
      case "ring": {
        const radius = local * cfg.speed * maxR + (h2 - 0.5) * scale * 2;
        px = fx.x + ux * radius;
        py = fx.y + uy * radius;
        alpha *= 1 - local;
        break;
      }
      case "orbit": {
        const theta = (h2 > 0.5 ? 1 : -1) * local * cfg.speed;
        const rx =
          (cx - fx.x) * Math.cos(theta) - (cy - fx.y) * Math.sin(theta);
        const ry =
          (cx - fx.x) * Math.sin(theta) + (cy - fx.y) * Math.cos(theta);
        px = fx.x + rx;
        py = fx.y + ry;
        break;
      }
      case "fall": {
        px = cx + Math.sin(local * 5 + h2 * 6) * scale * 0.5;
        py = cy + local * cfg.speed * scale * (0.6 + h2);
        alpha = Math.sin((1 - local) * Math.PI * 0.5);
        break;
      }
      case "burst": {
        const d = easeOutCubic(local) * cfg.speed * scale;
        px = cx + ux * d;
        py = cy + uy * d + local * local * scale * 2;
        break;
      }
      case "foam": {
        px = cx + Math.sin(local * 7 + h2 * 6) * scale * 0.6;
        py = cy - Math.sin(local * Math.PI) * scale * (0.8 + h2 * 2.5);
        alpha = Math.sin(local * Math.PI);
        break;
      }
      case "streak": {
        const dir = h2 > 0.5 ? 1 : -1;
        px = cx + dir * local * cfg.speed * scale;
        py = cy + (h3 - 0.5) * scale * 0.4;
        w = scale * (0.55 + h3 * 0.7);
        ph = scale * 0.22;
        break;
      }
      case "implode": {
        const k = easeOutCubic(local);
        px = cx + (fx.x - cx) * k;
        py = cy + (fx.y - cy) * k;
        break;
      }
      case "dust": {
        px = cx + (h2 - 0.5) * local * scale * 2;
        py = cy - local * scale * (0.8 + h3 * 2);
        break;
      }
      case "spark": {
        const dir = h2 > 0.5 ? 1 : -1;
        px = cx + dir * local * cfg.speed * scale;
        py = cy - local * cfg.speed * scale * 0.6 + local * local * scale * 4;
        w = scale * (0.14 + h3 * 0.22);
        ph = w;
        alpha = 1 - local;
        break;
      }
    }

    const pw = Math.max(minPx, snap(w));
    const pph = Math.max(minPx, snap(ph));
    const sx = snap(px - pw / 2);
    const sy = snap(py - pph / 2);
    ctx.globalAlpha = alpha < 0.02 ? 0 : Math.min(1, alpha);
    ctx.fillStyle = colors[Math.min(2, Math.floor(h3 * 3))];
    ctx.fillRect(sx, sy, pw, pph);
  }
}

function setupWordmarkFx() {
  const canvas = document.getElementById("wordmarkCanvas");
  if (!canvas) return;

  const localPoint = (event) => {
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  canvas.addEventListener(
    "pointermove",
    (event) => {
      if (reduceMotion.matches) return;
      const point = localPoint(event);
      wordPointer = { active: true, x: point.x, y: point.y };
      if (wordHoverRaf) return;
      wordHoverRaf = requestAnimationFrame(() => {
        wordHoverRaf = 0;
        drawWordmark();
      });
    },
    { passive: true },
  );

  canvas.addEventListener("pointerleave", () => {
    wordPointer.active = false;
    drawWordmark();
  });

  canvas.addEventListener("pointerdown", (event) => {
    if (reduceMotion.matches) return;
    if (event.button !== undefined && event.button !== 0) return;
    const point = localPoint(event);
    const fx = nextWordFx();
    wordFx.push({
      id: fx.id,
      x: point.x,
      y: point.y,
      start: performance.now(),
      duration: fx.duration,
    });
    if (wordFx.length > 3) wordFx = wordFx.slice(-3);
    startWordmarkFx();
  });
}

function startWordmarkFx() {
  if (wordFxRaf) return;
  const tick = (now) => {
    wordFx = wordFx.filter((fx) => now - fx.start < fx.duration);
    drawWordmark(now);
    if (wordFx.length) {
      wordFxRaf = requestAnimationFrame(tick);
    } else {
      wordFxRaf = 0;
      drawWordmark();
    }
  };
  wordFxRaf = requestAnimationFrame(tick);
}

function playWordFx(id, x, y) {
  const canvas = document.getElementById("wordmarkCanvas");
  const def = WORD_FX.find((fx) => fx.id === id);
  if (!canvas || !def || reduceMotion.matches) return;
  const rect = canvas.getBoundingClientRect();
  wordFx.push({
    id,
    x: x ?? rect.width / 2,
    y: y ?? rect.height / 2,
    start: performance.now(),
    duration: def.duration,
  });
  if (wordFx.length > 3) wordFx = wordFx.slice(-3);
  startWordmarkFx();
}

let heroFieldRefresh = null;

function getFieldPalette() {
  return {
    bg: readCssVar("--field-bg", readCssVar("--bg", "#eff1f5")),
    dim: readCssVar("--field-dim", readCssVar("--muted", "#8c8fa1")),
    mid: readCssVar("--field-mid", readCssVar("--border", "#bcc0cc")),
    lit: readCssVar("--field-lit", readCssVar("--accent", "#1e66f5")),
    hover: readCssVar("--field-hover", readCssVar("--fg", "#4c4f69")),
    crest: readCssVar("--field-crest", readCssVar("--fg", "#4c4f69")),
  };
}

function colorLuminance(value) {
  let r = 0;
  let g = 0;
  let b = 0;
  const hex = value.trim();
  const short = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(hex);
  const long = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
  const rgb = /^rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/i.exec(hex);
  if (long) {
    r = parseInt(long[1], 16);
    g = parseInt(long[2], 16);
    b = parseInt(long[3], 16);
  } else if (short) {
    r = parseInt(short[1] + short[1], 16);
    g = parseInt(short[2] + short[2], 16);
    b = parseInt(short[3] + short[3], 16);
  } else if (rgb) {
    r = Number(rgb[1]);
    g = Number(rgb[2]);
    b = Number(rgb[3]);
  } else {
    return 0;
  }
  return (r * 0.299 + g * 0.587 + b * 0.114) / 255;
}

function makeNoiseField(seed) {
  const size = 128;
  let state = seed >>> 0;
  const random = () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
  let field = new Float32Array(size * size);
  for (let i = 0; i < field.length; i++) field[i] = random();
  for (let pass = 0; pass < 2; pass++) {
    const next = new Float32Array(size * size);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        let total = 0;
        for (let oy = -1; oy <= 1; oy++) {
          for (let ox = -1; ox <= 1; ox++) {
            const sx = (x + ox + size) % size;
            const sy = (y + oy + size) % size;
            total += field[sy * size + sx];
          }
        }
        next[y * size + x] = total / 9;
      }
    }
    field = next;
  }
  let min = Infinity;
  let max = -Infinity;
  for (const value of field) {
    if (value < min) min = value;
    if (value > max) max = value;
  }
  const span = max - min || 1;
  for (let i = 0; i < field.length; i++) field[i] = (field[i] - min) / span;
  return field;
}

function makeRandomField(seed, size) {
  let state = seed >>> 0;
  const field = new Float32Array(size);
  for (let i = 0; i < size; i++) {
    state = (state * 1664525 + 1013904223) >>> 0;
    field[i] = state / 4294967296;
  }
  return field;
}

function sampleNoise(field, x, y) {
  const size = 128;
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const fx = x - x0;
  const fy = y - y0;
  const ix = ((x0 % size) + size) % size;
  const iy = ((y0 % size) + size) % size;
  const ix1 = (ix + 1) % size;
  const iy1 = (iy + 1) % size;
  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);
  const a = field[iy * size + ix];
  const b = field[iy * size + ix1];
  const c = field[iy1 * size + ix];
  const d = field[iy1 * size + ix1];
  return (a * (1 - sx) + b * sx) * (1 - sy) + (c * (1 - sx) + d * sx) * sy;
}

function initHeroField() {
  const canvas = document.getElementById("heroFieldCanvas");
  const section = document.getElementById("hero");
  if (!canvas || !section) return;
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) return;

  const reduce = reduceMotion.matches;
  const noise = makeNoiseField(10407530);
  const dither = makeRandomField(663316, 4096);
  const pointer = { x: -1e4, y: -1e4, strength: 0, target: 0 };
  const fieldDensity = 1.09;
  const quietSelector = [
    ".hero-header .header-left",
    ".hero-header .header-right",
    ".banner-pill",
    ".wordmark-canvas",
    ".tagline",
    ".hero-line",
    ".hero-cta-row",
    ".hero-scroll",
  ].join(", ");
  let quietRects = [];

  const measureQuiet = () => {
    quietRects = [...document.querySelectorAll(quietSelector)].map((el) =>
      el.getBoundingClientRect(),
    );
  };

  const quietFactor = (x, y) => {
    let nearest = Infinity;
    for (const r of quietRects) {
      const dx = Math.max(r.left - x, 0, x - r.right);
      const dy = Math.max(r.top - y, 0, y - r.bottom);
      const d = dx * dx + dy * dy;
      if (d < nearest) nearest = d;
    }
    if (nearest === Infinity) return 1;
    const reach = 96;
    const dist = Math.sqrt(nearest);
    return dist >= reach ? 1 : Math.pow(dist / reach, 3);
  };

  let ripples = [];
  let ghost = null;
  let ghostTrail = [];
  let lastAutoPoint = null;
  const GHOST_TRAVEL = 3200;
  let palette = getFieldPalette();
  let fieldFactor = colorLuminance(palette.bg) > 0.55 ? 0.82 : 1;
  let width = 1;
  let height = 1;
  let cell = 9;
  let cols = 0;
  let rows = 0;
  let frameRaf = 0;
  let lastFrame = 0;
  let lastQuietMeasure = 0;
  let visible = true;
  let running = false;

  const resize = () => {
    const rect = section.getBoundingClientRect();
    width = Math.max(1, Math.round(rect.width));
    height = Math.max(1, Math.round(rect.height));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cell = width < 640 ? 7 : 9;
    cols = Math.ceil(width / cell);
    rows = Math.ceil(height / cell);
    measureQuiet();
  };

  const drawGhostCursor = (x, y, alpha) => {
    const block = Math.max(2, Math.round(cell * 0.55));
    const originX = x - (GHOST_MARKER[0].length * block) / 2;
    const originY = y - (GHOST_MARKER.length * block) / 2;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = palette.crest;
    for (let row = 0; row < GHOST_MARKER.length; row++) {
      for (let col = 0; col < GHOST_MARKER[row].length; col++) {
        if (GHOST_MARKER[row][col] !== "1") continue;
        ctx.fillRect(
          originX + col * block,
          originY + row * block,
          block,
          block,
        );
      }
    }
  };

  const appendGhostTrail = (x, y) => {
    const last = ghostTrail[ghostTrail.length - 1];
    if (!last) {
      ghostTrail.push({ x, y });
      return;
    }
    const dx = x - last.x;
    const dy = y - last.y;
    const steps = Math.max(
      1,
      Math.ceil(Math.hypot(dx, dy) / Math.max(3, cell * 0.8)),
    );
    for (let i = 1; i <= steps; i++) {
      ghostTrail.push({
        x: last.x + (dx * i) / steps,
        y: last.y + (dy * i) / steps,
      });
    }
  };

  const draw = (now) => {
    const t = now / 1000;
    ctx.fillStyle = palette.bg;
    ctx.fillRect(0, 0, width, height);

    pointer.strength += (pointer.target - pointer.strength) * 0.12;
    if (ripples.length)
      ripples = ripples.filter((ripple) => now - ripple.born < ripple.life);

    let ghostPos = null;
    if (ghost) {
      const progress = Math.min(
        1,
        Math.max(0, (now - ghost.start) / ghost.duration),
      );
      const gx = ghost.from.x + (ghost.to.x - ghost.from.x) * progress;
      const gy = ghost.from.y + (ghost.to.y - ghost.from.y) * progress;
      ghostPos = { x: gx, y: gy };
      if (progress < 1) {
        appendGhostTrail(gx, gy);
      } else {
        ripples.push({ x: ghost.to.x, y: ghost.to.y, born: now, life: 760 });
        ghost = null;
        ghostPos = null;
      }
    }
    if (ghostPos && ghostTrail.length) {
      ghostTrail = ghostTrail.filter(
        (point) =>
          Math.hypot(point.x - ghostPos.x, point.y - ghostPos.y) <= cell * 26,
      );
    }

    const pointerReach = cell * 11 * (0.55 + 0.45 * pointer.strength);

    for (let gy = 0; gy < rows; gy++) {
      const cy = (gy + 0.5) * cell;
      const ny = (cy / height) * 2 - 1;
      for (let gx = 0; gx < cols; gx++) {
        const cx = (gx + 0.5) * cell;
        const nx = (cx / width) * 2 - 1;
        const radial = Math.sqrt(nx * nx + ny * ny * 0.82);
        const edge = Math.min(1, Math.max(0, (radial - 0.38) / 0.86));
        const n1 = sampleNoise(
          noise,
          cx / (cell * 9) + t * 0.14,
          cy / (cell * 9) - t * 0.055,
        );
        const n2 = sampleNoise(
          noise,
          cx / (cell * 16) - t * 0.08,
          cy / (cell * 16) + t * 0.06,
        );
        const field = 0.6 * n1 + 0.4 * n2;
        const flickerSeed = dither[((gy * 37) & 63) * 64 + ((gx * 11) & 63)];
        const flicker = 0.5 + 0.5 * Math.sin(t * 1.1 + flickerSeed * 6.283);
        const topFade = Math.min(1, cy / (height * 0.16));
        let intensity =
          edge *
          edge *
          (0.3 + 0.52 * field * field + 0.18 * flicker) *
          0.62 *
          fieldFactor *
          topFade;

        let boost = 0;
        if (pointer.strength > 0.01) {
          const dx = cx - pointer.x;
          const dy = cy - pointer.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < pointerReach) {
            const k = 1 - dist / pointerReach;
            boost = k * k * 0.85 * pointer.strength;
          }
        }

        if (ghostPos) {
          const dx = cx - ghostPos.x;
          const dy = cy - ghostPos.y;
          const reach = cell * 5.5;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < reach) {
            const k = 1 - dist / reach;
            const amount = k * k * 0.6;
            if (amount > boost) boost = amount;
          }
        }

        for (const ripple of ripples) {
          const age = (now - ripple.born) / ripple.life;
          if (age < 0 || age >= 1) continue;
          const coarse = cell * (0.5 + 1.7 * (1 - Math.pow(1 - age, 3)));
          const ix = Math.floor((cx - ripple.x) / coarse + 7.5);
          const iy = Math.floor((cy - ripple.y) / coarse + 7.5);
          if (
            ix >= 0 &&
            ix < 15 &&
            iy >= 0 &&
            iy < 15 &&
            RIPPLE_PATTERN[iy][ix] === "1"
          ) {
            const amount = Math.pow(1 - age, 1.7) * 1.25;
            if (amount > boost) boost = amount;
          }
          const dx = cx - ripple.x;
          const dy = cy - ripple.y;
          const flash = 1 - Math.min(1, age * 3.6);
          if (flash > 0) {
            const reach = cell * 7 * flash;
            const distToClick = Math.sqrt(dx * dx + dy * dy);
            if (distToClick < reach) {
              const amount = (1 - distToClick / reach) * flash * 0.85;
              if (amount > boost) boost = amount;
            }
          }
        }

        const threshold =
          (0.14 + 0.34 * dither[(gy & 63) * 64 + ((gx * 13) & 63)]) /
          fieldDensity;
        const value = intensity + boost;
        if (value <= threshold) continue;

        let color = palette.dim;
        if (boost > 0.55) color = palette.crest;
        else if (boost > 0.2) color = palette.hover;
        else if (value > 0.3) color = palette.lit;
        else if (value > 0.18) color = palette.mid;

        ctx.fillStyle = color;
        ctx.fillRect(gx * cell, gy * cell, cell - 1, cell - 1);
      }
    }

    if (ghostTrail.length) {
      const trailLength = cell * 26;
      ctx.fillStyle = palette.hover;
      for (const point of ghostTrail) {
        let alpha;
        let size;
        if (ghostPos) {
          const k =
            1 -
            Math.hypot(point.x - ghostPos.x, point.y - ghostPos.y) /
              trailLength;
          if (k <= 0) continue;
          alpha = 0.38 * Math.pow(k, 1.1);
          size = cell * (0.42 + 0.42 * k);
        } else {
          alpha = 0.14;
          size = cell * 0.5;
        }
        ctx.globalAlpha = alpha;
        ctx.fillRect(point.x - size / 2, point.y - size / 2, size, size);
      }
    }

    if (ghostPos) {
      drawGhostCursor(ghostPos.x, ghostPos.y, 0.4);
    }
    ctx.globalAlpha = 1;
  };

  const pickAutoPoint = () => {
    const pad = cell * 9;
    const rect = section.getBoundingClientRect();
    const minDistance = Math.min(width, height) * 0.5;
    let x = width / 2;
    let y = height / 2;
    for (let attempt = 0; attempt < 18; attempt++) {
      x = pad + Math.random() * Math.max(1, width - pad * 2);
      y = pad + Math.random() * Math.max(1, height - pad * 2);
      const vx = x + rect.left;
      const vy = y + rect.top;
      const clear = quietRects.every(
        (r) =>
          vx < r.left - cell * 5 ||
          vx > r.right + cell * 5 ||
          vy < r.top - cell * 5 ||
          vy > r.bottom + cell * 5,
      );
      const far =
        !lastAutoPoint ||
        Math.hypot(x - lastAutoPoint.x, y - lastAutoPoint.y) >= minDistance;
      if (clear && far) break;
    }
    return { x, y };
  };

  const triggerAutoGhost = (now) => {
    const from = lastAutoPoint || { x: width / 2, y: height / 2 };
    const to = pickAutoPoint();
    lastAutoPoint = to;
    ghost = { from, to, start: now, duration: GHOST_TRAVEL };
    ghostTrail = [{ x: from.x, y: from.y }];
  };

  const tick = (now) => {
    if (!running) return;
    frameRaf = requestAnimationFrame(tick);
    if (!visible || now - lastFrame < 32) return;
    lastFrame = now;
    if (now - lastQuietMeasure > 400) {
      lastQuietMeasure = now;
      measureQuiet();
    }
    if (!ghost) triggerAutoGhost(now);
    draw(now);
  };

  const start = () => {
    if (reduce || running) return;
    running = true;
    const startTime = performance.now();
    if (!ghost) triggerAutoGhost(startTime);
    frameRaf = requestAnimationFrame(tick);
  };

  const stop = () => {
    running = false;
    cancelAnimationFrame(frameRaf);
    frameRaf = 0;
    if (ghost) {
      ghost = null;
      ghostTrail = [];
    }
  };

  const pointInSection = (event) => {
    const rect = section.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return {
      x,
      y,
      inside: x >= 0 && y >= 0 && x <= rect.width && y <= rect.height,
    };
  };

  if (!reduce) {
    window.addEventListener(
      "pointermove",
      (event) => {
        const point = pointInSection(event);
        if (point.inside) {
          pointer.x = point.x;
          pointer.y = point.y;
          pointer.target = quietFactor(event.clientX, event.clientY);
        } else {
          pointer.target = 0;
        }
      },
      { passive: true },
    );

    section.addEventListener("pointerleave", () => {
      pointer.target = 0;
    });

    window.addEventListener(
      "pointerdown",
      (event) => {
        if (event.button !== 0) return;
        if (
          event.target instanceof Element &&
          event.target.closest(
            'a, button, input, select, textarea, label, [role="button"], header, .wordmark-canvas',
          )
        )
          return;
        const point = pointInSection(event);
        if (!point.inside) return;
        ripples.push({
          x: point.x,
          y: point.y,
          born: performance.now(),
          life: 760,
        });
      },
      { passive: true },
    );
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    },
    { rootMargin: "64px" },
  );
  observer.observe(section);

  const resizeObserver = new ResizeObserver(() => {
    resize();
    if (reduce) draw(performance.now());
  });
  resizeObserver.observe(section);

  resize();
  if (reduce) draw(performance.now());
  else start();

  heroFieldRefresh = () => {
    palette = getFieldPalette();
    fieldFactor = colorLuminance(palette.bg) > 0.55 ? 0.82 : 1;
    if (!running) draw(performance.now());
  };
}

function refreshHeroField() {
  if (heroFieldRefresh) heroFieldRefresh();
}

function applyTheme(theme) {
  if (!themes.find((t) => t.id === theme)) return;
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(themeKey, theme);
  } catch (e) {}
  const meta = document.querySelector('meta[name="theme-color"]');
  const map = {
    "tokyo-night": "#20232b",
    "catppuccin-mocha": "#1e1e2e",
    gruvbox: "#282828",
    nord: "#2e3440",
    "rose-pine": "#191724",
    "catppuccin-latte": "#eff1f5",
  };
  if (meta) meta.setAttribute("content", map[theme] || "#eff1f5");
  refreshHeroField();
  drawWordmark();
}

function cycleTheme() {
  const current =
    document.documentElement.getAttribute("data-theme") || "catppuccin-latte";
  const index = themes.findIndex((t) => t.id === current);
  const next = themes[(index + 1) % themes.length];
  applyTheme(next.id);
}

function setupKeybind() {
  window.addEventListener("keydown", (e) => {
    const target = e.target;
    if (target instanceof HTMLElement) {
      const tag = target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable)
        return;
    }
    if (e.key.toLowerCase() === "t") {
      e.preventDefault();
      cycleTheme();
    }
  });
}

function setupThemeBtn() {
  const btn = document.getElementById("themeToggleBtn");
  if (btn) btn.addEventListener("click", cycleTheme);
}

function setupEmail() {
  const btn = document.getElementById("emailBtn");
  if (!btn) return;
  const email = btn.getAttribute("data-email") || "";
  btn.addEventListener("click", () => {
    if (!email) return;
    window.location.href = "mailto:" + email;
  });
}

function navOffset() {
  const header = document.querySelector(".hero-header");
  return header ? Math.max(0, header.offsetHeight - 1) : 80;
}

function scrollToSection(target) {
  const top = target.getBoundingClientRect().top + window.scrollY - navOffset();
  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
}

function setupSmoothNav() {
  const links = document.querySelectorAll("a[data-nav]");
  const sections = [];
  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || !href.startsWith("#")) return;
    const target = document.querySelector(href);
    if (!target) return;
    sections.push({ link, target });
    link.addEventListener("click", (e) => {
      e.preventDefault();
      scrollToSection(target);
      history.replaceState(null, "", window.location.pathname);
    });
  });
  if (!sections.length) return;
  const header = document.querySelector(".hero-header");
  const setActive = (id) => {
    links.forEach((l) =>
      l.classList.toggle("active", l.getAttribute("href") === "#" + id),
    );
  };
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    {
      rootMargin: `-${(header ? header.offsetHeight : 80) + 10}px 0px -60% 0px`,
      threshold: 0,
    },
  );
  sections.forEach(({ target }) => observer.observe(target));
  const clearActive = () => links.forEach((l) => l.classList.remove("active"));
  const onScroll = () => {
    if (window.scrollY < 80) clearActive();
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

function setupFadeIn() {
  const reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    document
      .querySelectorAll(".fade-in")
      .forEach((el) => el.classList.add("visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));
}

function updateWorkToggleLabel() {
  const btn = document.getElementById("workMoreBtn");
  if (!btn) return;
  const key =
    btn.getAttribute("aria-expanded") === "true" ? "modes.less" : "modes.more";
  btn.setAttribute("data-i18n", key);
  const text = t(key);
  if (text !== null) btn.textContent = text;
}

function setupWorkToggle() {
  const btn = document.getElementById("workMoreBtn");
  const list = document.getElementById("workList");
  if (!btn || !list) return;
  btn.addEventListener("click", () => {
    const expand = btn.getAttribute("aria-expanded") !== "true";
    list.querySelectorAll(".experience-card[data-extra]").forEach((card) => {
      card.hidden = !expand;
      if (expand) card.classList.add("visible");
    });
    btn.setAttribute("aria-expanded", String(expand));
    updateWorkToggleLabel();
  });
  updateWorkToggleLabel();
}

function setupExpToggles() {
  const mobile = window.matchMedia("(max-width: 720px)");
  const cards = [...document.querySelectorAll("[data-exp-card]")];

  const setOpen = (card, open) => {
    const body = card.querySelector(".exp-body");
    const inner = body && body.firstElementChild;
    if (!body || !inner) return;
    const start = body.getBoundingClientRect().height;
    body.style.transition = "none";
    body.style.height = start + "px";
    card.classList.toggle("is-open", open);
    card.setAttribute("aria-expanded", String(open));
    if (reduceMotion.matches) {
      body.style.height = "";
      body.style.transition = "";
      return;
    }
    void body.offsetHeight;
    body.style.transition = "height 300ms ease";
    // Đóng thì gỡ inline height để CSS height:0 làm đích, vẫn animate từ chiều cao cũ.
    body.style.height = open ? inner.scrollHeight + "px" : "";
    let timer = 0;
    const done = () => {
      clearTimeout(timer);
      body.removeEventListener("transitionend", done);
      body.style.height = "";
      body.style.transition = "";
    };
    body.addEventListener("transitionend", done);
    timer = setTimeout(done, 400);
  };

  const syncMode = () => {
    const on = mobile.matches;
    cards.forEach((card) => {
      const body = card.querySelector(".exp-body");
      if (on) {
        card.setAttribute("role", "button");
        card.setAttribute("tabindex", "0");
        card.setAttribute("aria-controls", body ? body.id : "");
        if (!card.hasAttribute("aria-expanded"))
          card.setAttribute("aria-expanded", "false");
      } else {
        card.removeAttribute("role");
        card.removeAttribute("tabindex");
        card.removeAttribute("aria-controls");
        card.removeAttribute("aria-expanded");
        card.classList.remove("is-open");
      }
      if (body) {
        body.style.height = "";
        body.style.transition = "";
      }
    });
  };

  cards.forEach((card) => {
    card.addEventListener("click", (event) => {
      if (!mobile.matches) return;
      if (event.target.closest("a, button, input, select, textarea")) return;
      setOpen(card, !card.classList.contains("is-open"));
    });
    card.addEventListener("keydown", (event) => {
      if (!mobile.matches || event.target !== card) return;
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      setOpen(card, !card.classList.contains("is-open"));
    });
  });

  syncMode();
  if (mobile.addEventListener) mobile.addEventListener("change", syncMode);
  else if (mobile.addListener) mobile.addListener(syncMode);
}

function setupLogoHome() {
  const logo = document.getElementById("logoHome");
  if (!logo) return;
  logo.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    try {
      history.replaceState(null, "", window.location.pathname);
    } catch (err) {}
  });
}

function setupMobileNav() {
  const toggle = document.getElementById("navToggle");
  const panel = document.getElementById("mobileNav");
  if (!toggle || !panel) return;
  const header = toggle.closest(".hero-header");
  const isOpen = () => toggle.getAttribute("aria-expanded") === "true";
  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    panel.classList.toggle("open", open);
  };
  toggle.addEventListener("click", () => setOpen(!isOpen()));
  panel.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape" || !isOpen()) return;
    setOpen(false);
    toggle.focus();
  });
  document.addEventListener("click", (e) => {
    if (!isOpen()) return;
    if (header && header.contains(e.target)) return;
    setOpen(false);
  });
  const desktopQuery = window.matchMedia("(min-width: 1025px)");
  const onDesktop = (e) => {
    if (e.matches) setOpen(false);
  };
  if (desktopQuery.addEventListener)
    desktopQuery.addEventListener("change", onDesktop);
  else if (desktopQuery.addListener) desktopQuery.addListener(onDesktop);
}

function runTypewriterOnEl(el) {
  const runId = String((Number(el.dataset.twRun) || 0) + 1);
  el.dataset.twRun = runId;
  if (el.dataset.twTyping) {
    el.innerHTML = el.dataset.twOriginal || el.innerHTML;
    delete el.dataset.twTyping;
  }
  if (!el.dataset.twOriginal) {
    el.dataset.twOriginal = el.innerHTML;
    el.dataset.twText = el.textContent;
  }
  el.dataset.twTyping = "1";
  const original = el.dataset.twOriginal;
  const text = el.dataset.twText;
  el.innerHTML =
    '<span class="tw-text"></span><span class="tw-cursor" aria-hidden="true">|</span>';
  const tw = el.querySelector(".tw-text");
  let i = 0;
  const step = () => {
    if (el.dataset.twRun !== runId) return;
    if (i < text.length) {
      tw.textContent += text.charAt(i);
      i++;
      setTimeout(step, 40);
    } else {
      el.innerHTML =
        original + '<span class="tw-cursor" aria-hidden="true">|</span>';
      delete el.dataset.twTyping;
    }
  };
  step();
}

let typewriterObserver = null;

function setupTypewriter() {
  const els = document.querySelectorAll(".section-sub");
  typewriterObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        runTypewriterOnEl(entry.target);
      });
    },
    { threshold: 0.3 },
  );
  els.forEach((el) => typewriterObserver.observe(el));
}
function setupFooterNav() {
  const links = document.querySelectorAll(".footer-list a[data-footer]");
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      if (href === "#hero") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        try {
          history.replaceState(null, "", window.location.pathname);
        } catch (err) {}
        return;
      }
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      scrollToSection(target);
      try {
        history.replaceState(null, "", window.location.pathname);
      } catch (err) {}
    });
  });
}

const langKey = "mangrs-lang";
let translations = {};
let currentLang = "vi";
const langs = ["en", "vi", "zh-CN", "zh-TW"];
const langNames = {
  en: "English",
  vi: "Tiếng Việt",
  "zh-CN": "简体中文",
  "zh-TW": "繁體中文",
};
const langHintFallback = {
  en: "Click here to change to a language that suits you",
  vi: "Nhấn vào đây để thay đổi ngôn ngữ phù hợp với bạn",
  "zh-CN": "点击此处，切换到适合您的语言",
  "zh-TW": "點擊此處，切換為適合您的語言",
};
let langHintTimer = null;
let langHintHideTimer = null;

async function loadTranslations() {
  try {
    const res = await fetch("assets/languages/languages.json");
    translations = await res.json();
  } catch (e) {
    translations = { en: {} };
  }
}

function t(key) {
  return key
    .split(".")
    .reduce(
      (obj, part) => (obj && obj[part] !== undefined ? obj[part] : null),
      translations[currentLang],
    );
}

function clearTypewriterCache() {
  document.querySelectorAll(".section-sub").forEach((el) => {
    el.dataset.twRun = String((Number(el.dataset.twRun) || 0) + 1);
    delete el.dataset.twTyping;
    delete el.dataset.twOriginal;
    delete el.dataset.twText;
  });
}

function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return rect.bottom > 0 && rect.top < window.innerHeight;
}

function applyLanguage(lang) {
  if (!translations[lang]) return;
  currentLang = lang;
  try {
    localStorage.setItem(langKey, lang);
  } catch (e) {}
  document.documentElement.setAttribute("lang", lang);
  clearTypewriterCache();
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (!key) return;
    const text = t(key);
    if (text !== null) el.textContent = text;
  });
  document.querySelectorAll(".section-sub").forEach((el) => {
    if (isInViewport(el)) runTypewriterOnEl(el);
  });
  updateWorkToggleLabel();
  updateLangButton();
  hideLangHint();
}

function setLangMenuOpen(open, focusSelected) {
  const btn = document.getElementById("langToggleBtn");
  const menu = document.getElementById("langMenu");
  if (!btn || !menu) return;
  btn.setAttribute("aria-expanded", open ? "true" : "false");
  menu.hidden = !open;
  if (!open) return;
  hideLangHint();
  if (focusSelected) {
    const current = menu.querySelector(`[data-lang="${currentLang}"]`);
    (current || menu.querySelector("[data-lang]")).focus();
  }
}

function setupLangPicker() {
  const btn = document.getElementById("langToggleBtn");
  const menu = document.getElementById("langMenu");
  if (!btn || !menu) return;

  btn.addEventListener("click", () => {
    setLangMenuOpen(menu.hidden, false);
  });

  btn.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    setLangMenuOpen(true, true);
  });

  menu.querySelectorAll("[data-lang]").forEach((option) => {
    option.addEventListener("click", () => {
      applyLanguage(option.dataset.lang);
      setLangMenuOpen(false);
      btn.focus();
    });
  });

  menu.addEventListener("keydown", (e) => {
    const options = Array.from(menu.querySelectorAll("[data-lang]"));
    const idx = options.indexOf(document.activeElement);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const dir = e.key === "ArrowDown" ? 1 : -1;
      options[(idx + dir + options.length) % options.length].focus();
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      options[e.key === "Home" ? 0 : options.length - 1].focus();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setLangMenuOpen(false);
      btn.focus();
    } else if (e.key === "Tab") {
      setLangMenuOpen(false);
    }
  });

  document.addEventListener("click", (e) => {
    if (menu.hidden) return;
    if (btn.contains(e.target) || menu.contains(e.target)) return;
    setLangMenuOpen(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape" || menu.hidden) return;
    setLangMenuOpen(false);
    btn.focus();
  });

  window.addEventListener("resize", positionLangHint);
}

function updateLangButton() {
  const btn = document.getElementById("langToggleBtn");
  const menu = document.getElementById("langMenu");
  const name = langNames[currentLang] || langNames.en;
  if (btn) {
    btn.setAttribute("title", name);
    btn.setAttribute(
      "aria-label",
      `${t("lang.menuLabel") || "Select language"}: ${name}`,
    );
  }
  if (menu) {
    menu.setAttribute("aria-label", t("lang.menuLabel") || "Select language");
    menu.querySelectorAll("[data-lang]").forEach((option) => {
      option.setAttribute(
        "aria-checked",
        option.dataset.lang === currentLang ? "true" : "false",
      );
    });
  }
}

function positionLangHint() {
  const hint = document.getElementById("langHint");
  const btn = document.getElementById("langToggleBtn");
  const header = document.querySelector(".hero-header");
  if (!hint || !btn || !header || hint.hidden) return;
  const headerRect = header.getBoundingClientRect();
  const btnRect = btn.getBoundingClientRect();
  const hintRect = hint.getBoundingClientRect();
  const tailWidth = 10;
  const top = Math.round(btnRect.bottom - headerRect.top + 8);
  const tailLeft = Math.round(
    btnRect.left + btnRect.width / 2 - hintRect.left - tailWidth / 2,
  );
  hint.style.setProperty("--lang-hint-top", `${top}px`);
  hint.style.setProperty(
    "--lang-hint-tail-left",
    `${Math.max(8, Math.min(tailLeft, Math.round(hintRect.width) - 18))}px`,
  );
}

function showLangHint() {
  if (currentLang == "en") {
    const hint = document.getElementById("langHint");
    if (!hint) return;
    hint.textContent = "";
    langs.forEach((lang) => {
      const line = document.createElement("span");
      line.className = "lang-hint-line";
      line.lang = lang;

      const menuFlag = document.querySelector(
        `#langMenu .lang-option[data-lang="${lang}"] .lang-flag`,
      );
      if (menuFlag) line.appendChild(menuFlag.cloneNode(true));

      const text = document.createElement("span");
      text.className = "lang-hint-line-text";
      text.textContent =
        (translations[lang] &&
          translations[lang].lang &&
          translations[lang].lang.hint) ||
        langHintFallback[lang] ||
        "";
      line.appendChild(text);

      hint.appendChild(line);
    });
    if (langHintTimer) clearTimeout(langHintTimer);
    if (langHintHideTimer) {
      clearTimeout(langHintHideTimer);
      langHintHideTimer = null;
    }
    hint.hidden = false;
    positionLangHint();
    requestAnimationFrame(() => hint.classList.add("is-visible"));
    langHintTimer = setTimeout(hideLangHint, 5000);
  }
}

function hideLangHint() {
  const hint = document.getElementById("langHint");
  if (langHintTimer) {
    clearTimeout(langHintTimer);
    langHintTimer = null;
  }
  if (!hint || hint.hidden) return;
  hint.classList.remove("is-visible");
  if (langHintHideTimer) clearTimeout(langHintHideTimer);
  langHintHideTimer = setTimeout(() => {
    hint.hidden = true;
    langHintHideTimer = null;
  }, 220);
}

document.addEventListener("DOMContentLoaded", () => {
  loadTranslations().then(() => {
    const saved = localStorage.getItem(langKey);
    const migrated = saved === "zh" ? "zh-CN" : saved;
    currentLang = langs.includes(migrated) ? migrated : "vi";
    applyLanguage(currentLang);
    showLangHint();
  });
  initHeroField();
  drawWordmark();
  setupWordmarkFx();
  requestAnimationFrame(() => {
    const fx = WORD_FX[Math.floor(Math.random() * WORD_FX.length)];
    wordFxLast = fx.id;
    playWordFx(fx.id);
  });
  window.addEventListener("resize", drawWordmark);
  setupKeybind();
  setupThemeBtn();
  setupEmail();
  setupFadeIn();
  setupSmoothNav();
  setupLogoHome();
  setupWorkToggle();
  setupExpToggles();
  setupMobileNav();
  setupTypewriter();
  setupFooterNav();
  setupLangPicker();
});
