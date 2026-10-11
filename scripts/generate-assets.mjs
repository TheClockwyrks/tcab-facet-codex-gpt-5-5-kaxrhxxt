import { createCanvas } from "@napi-rs/canvas";
import { Buffer } from "node:buffer";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const kinds = [
  ["ruby", "#e53b57", "#7c1028", "octagon"],
  ["amber", "#f08a2d", "#7b3f12", "shield"],
  ["citrine", "#f3d34a", "#8a7414", "kite"],
  ["jade", "#42c96c", "#116b35", "hex"],
  ["beryl", "#42d6b9", "#0e7167", "round"],
  ["sapphire", "#4478ef", "#142d82", "diamond"],
  ["amethyst", "#a65be8", "#4c1a7a", "heart"],
];

const strains = [
  [],
  [[18, 17, 33, 36]],
  [
    [17, 17, 34, 37],
    [42, 19, 28, 45],
  ],
  [
    [15, 14, 34, 40],
    [43, 17, 25, 47],
    [22, 45, 48, 32],
  ],
];

async function png(path, draw) {
  await mkdir(dirname(path), { recursive: true });
  const canvas = createCanvas(64, 64);
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  draw(ctx);
  await writeFile(path, await canvas.encode("png"));
}

function poly(ctx, points, fill, stroke) {
  ctx.beginPath();
  points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 3;
  ctx.stroke();
}

function shapePoints(shape, r = 27, ox = 0, oy = 0) {
  const cx = 32 + ox;
  const cy = 32 + oy;
  if (shape === "octagon")
    return [
      [cx - 12, cy - r],
      [cx + 12, cy - r],
      [cx + r, cy - 12],
      [cx + r, cy + 12],
      [cx + 12, cy + r],
      [cx - 12, cy + r],
      [cx - r, cy + 12],
      [cx - r, cy - 12],
    ];
  if (shape === "shield")
    return [
      [cx, cy - r],
      [cx + 25, cy - 12],
      [cx + 18, cy + 20],
      [cx, cy + r],
      [cx - 18, cy + 20],
      [cx - 25, cy - 12],
    ];
  if (shape === "kite")
    return [
      [cx, cy - r],
      [cx + 24, cy],
      [cx + 7, cy + r],
      [cx - 7, cy + r],
      [cx - 24, cy],
    ];
  if (shape === "hex")
    return [
      [cx - 15, cy - 25],
      [cx + 15, cy - 25],
      [cx + 28, cy],
      [cx + 15, cy + 25],
      [cx - 15, cy + 25],
      [cx - 28, cy],
    ];
  if (shape === "round") {
    const pts = [];
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
    return pts;
  }
  if (shape === "heart")
    return [
      [cx, cy + 24],
      [cx - 24, cy + 4],
      [cx - 20, cy - 20],
      [cx, cy - 10],
      [cx + 20, cy - 20],
      [cx + 24, cy + 4],
    ];
  return [
    [cx, cy - r],
    [cx + r, cy],
    [cx, cy + r],
    [cx - r, cy],
  ];
}

function gem(ctx, color, dark, shape, strain = 0, alpha = 1) {
  ctx.globalAlpha = alpha;
  poly(ctx, shapePoints(shape), color, dark);
  ctx.strokeStyle = "rgba(255,255,255,.55)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(32, 7);
  ctx.lineTo(32, 57);
  ctx.moveTo(9, 32);
  ctx.lineTo(55, 32);
  ctx.moveTo(15, 15);
  ctx.lineTo(49, 49);
  ctx.moveTo(49, 15);
  ctx.lineTo(15, 49);
  ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,.35)";
  ctx.beginPath();
  ctx.ellipse(25, 20, 10, 6, -0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = strain === 3 ? "#fff7d6" : "#1d1022";
  ctx.lineWidth = strain === 3 ? 4 : 3;
  for (const [x1, y1, x2, y2] of strains[strain]) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo((x1 + x2) / 2 + 5, (y1 + y2) / 2 - 4);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
  if (strain === 3) {
    ctx.strokeStyle = "rgba(255,255,255,.8)";
    ctx.strokeRect(6, 6, 52, 52);
  }
  ctx.globalAlpha = 1;
}

for (const [name, color, dark, shape] of kinds) {
  for (let s = 0; s <= 3; s++) {
    await png(`public/assets/gems/${name}-${s}.png`, (ctx) =>
      gem(ctx, color, dark, shape, s),
    );
  }
  for (let f = 0; f < 6; f++) {
    await png(
      `public/assets/gems/break/${name}/${String(f).padStart(2, "0")}.png`,
      (ctx) => {
        const spread = f * 5;
        gem(ctx, color, dark, shape, Math.min(3, f), 1 - f * 0.12);
        ctx.fillStyle = "#fff4bd";
        for (let i = 0; i < 8; i++) {
          const a = (i / 8) * Math.PI * 2 + f * 0.2;
          ctx.fillRect(
            30 + Math.cos(a) * spread,
            30 + Math.sin(a) * spread,
            4,
            4,
          );
        }
      },
    );
  }
}

await png("public/assets/gems/brilliant.png", (ctx) => {
  ctx.strokeStyle = "#fff9b8";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(32, 32, 25, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    ctx.fillRect(30 + Math.cos(a) * 24, 30 + Math.sin(a) * 24, 4, 4);
  }
});

await png("public/assets/gems/star.png", (ctx) => {
  ctx.strokeStyle = "#ffffff";
  ctx.fillStyle = "#fff3a0";
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let i = 0; i < 16; i++) {
    const a = -Math.PI / 2 + (i / 16) * Math.PI * 2;
    const r = i % 2 === 0 ? 29 : 10;
    const x = 32 + Math.cos(a) * r;
    const y = 32 + Math.sin(a) * r;
    if (i) ctx.lineTo(x, y);
    else ctx.moveTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
});

for (let s = 0; s <= 3; s++) {
  await png(`public/assets/gems/prism-${s}.png`, (ctx) => {
    const grad = ctx.createLinearGradient(8, 8, 56, 56);
    grad.addColorStop(0, "#ffffff");
    grad.addColorStop(0.22, "#77e7ff");
    grad.addColorStop(0.5, "#ffe76f");
    grad.addColorStop(0.76, "#f068e8");
    grad.addColorStop(1, "#6ef2a0");
    gem(ctx, grad, "#ecfaff", "diamond", s);
  });
}

for (let f = 0; f < 8; f++) {
  await png(
    `public/assets/gems/prism-turn/${String(f).padStart(2, "0")}.png`,
    (ctx) => {
      ctx.save();
      ctx.translate(32, 32);
      ctx.scale(Math.max(0.35, Math.abs(Math.cos((f / 8) * Math.PI * 2))), 1);
      ctx.translate(-32, -32);
      const grad = ctx.createLinearGradient(8 + f * 2, 8, 56, 56);
      grad.addColorStop(0, "#fff");
      grad.addColorStop(0.35, "#75eaff");
      grad.addColorStop(0.7, "#ff7bea");
      grad.addColorStop(1, "#f9f871");
      gem(ctx, grad, "#f4ffff", "diamond", 0);
      ctx.restore();
    },
  );
}

await png("public/assets/gems/board-frame.png", (ctx) => {
  ctx.fillStyle = "#17131c";
  ctx.fillRect(0, 0, 64, 64);
  ctx.strokeStyle = "#9e8d62";
  ctx.lineWidth = 5;
  ctx.strokeRect(5, 5, 54, 54);
  ctx.strokeStyle = "#352b3c";
  ctx.lineWidth = 2;
  ctx.strokeRect(13, 13, 38, 38);
});

const systems = {
  "clear-burst": { count: 18, color: "#aeeeff", loop: false, duration: 520 },
  "flawed-detonation": {
    count: 42,
    color: "#fff0a6",
    loop: false,
    duration: 720,
  },
  "cut-flash": { count: 26, color: "#fff8c9", loop: false, duration: 600 },
  "cut-aura": { count: 9, color: "#9ffcff", loop: true, duration: 1000 },
};
for (const [name, s] of Object.entries(systems)) {
  await writeFile(
    `public/assets/fx/${name}.json`,
    JSON.stringify(
      {
        dimensions: 2,
        field: { width: 72, height: 72 },
        durationMs: s.duration,
        fps: 60,
        loop: s.loop,
        forces: { drag: 0.5, radial: s.loop ? 8 : 25 },
        emitters: [
          {
            name: "spark",
            shape: "disc",
            position: [36, 36, 0],
            extent: { radius: s.loop ? 18 : 5, size: [0, 0, 0] },
            emission: s.loop
              ? { mode: "rate", rate: s.count }
              : { mode: "burst", count: s.count, atMs: 0 },
            lifetimeMs: s.loop ? 650 : s.duration,
            lifetimeSpread: 140,
            speed: s.loop ? 18 : 90,
            speedSpread: 35,
            direction: [0, 1, 0],
            coneAngle: 360,
            particle: {
              sizeCurve: {
                interp: "easeOut",
                from: s.loop ? 0.7 : 1.3,
                to: 0.05,
              },
              opacityCurve: { interp: "easeIn", from: 0.72, to: 0 },
              colorGradient: [
                { color: s.color, at: 0 },
                { color: "#ffffff", at: 0.4 },
                { color: "#6356ff", at: 1 },
              ],
              rotation: 120,
              stretch: 1.5,
            },
          },
        ],
      },
      null,
      2,
    ),
  );
}

function wav(path, freq = 440, dur = 0.16, sweep = 1, noise = 0) {
  const sr = 44100;
  const n = Math.floor(sr * dur);
  const data = Buffer.alloc(44 + n * 2);
  data.write("RIFF", 0);
  data.writeUInt32LE(36 + n * 2, 4);
  data.write("WAVEfmt ", 8);
  data.writeUInt32LE(16, 16);
  data.writeUInt16LE(1, 20);
  data.writeUInt16LE(1, 22);
  data.writeUInt32LE(sr, 24);
  data.writeUInt32LE(sr * 2, 28);
  data.writeUInt16LE(2, 32);
  data.writeUInt16LE(16, 34);
  data.write("data", 36);
  data.writeUInt32LE(n * 2, 40);
  let seed = 7;
  for (let i = 0; i < n; i++) {
    const t = i / sr;
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const f = freq + (freq * sweep - freq) * (i / n);
    const env = Math.pow(1 - i / n, 2);
    const sample =
      Math.sin(Math.PI * 2 * f * t) * 0.42 * env +
      Math.sin(Math.PI * 2 * f * 2.01 * t) * 0.14 * env +
      ((seed / 0xffffffff) * 2 - 1) * noise * env;
    data.writeInt16LE(Math.max(-1, Math.min(1, sample)) * 32767, 44 + i * 2);
  }
  return writeFile(path, data);
}

function musicWav(path, notes, dur = 6) {
  const sr = 44100;
  const n = Math.floor(sr * dur);
  const data = Buffer.alloc(44 + n * 2);
  data.write("RIFF", 0);
  data.writeUInt32LE(36 + n * 2, 4);
  data.write("WAVEfmt ", 8);
  data.writeUInt32LE(16, 16);
  data.writeUInt16LE(1, 20);
  data.writeUInt16LE(1, 22);
  data.writeUInt32LE(sr, 24);
  data.writeUInt32LE(sr * 2, 28);
  data.writeUInt16LE(2, 32);
  data.writeUInt16LE(16, 34);
  data.write("data", 36);
  data.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) {
    const t = i / sr;
    let sample = 0;
    for (const note of notes) {
      const local = t - note.start;
      if (local < 0 || local > note.dur) continue;
      const env =
        Math.min(1, local / 0.03) * Math.pow(1 - local / note.dur, 1.7);
      sample +=
        Math.sin(Math.PI * 2 * note.freq * local) * note.gain * env +
        Math.sin(Math.PI * 4 * note.freq * local) * note.gain * 0.22 * env;
    }
    data.writeInt16LE(Math.max(-1, Math.min(1, sample)) * 32767, 44 + i * 2);
  }
  return writeFile(path, data);
}

function midi(path, pitches) {
  const bytes = [];
  const push = (...values) => bytes.push(...values);
  push(...Buffer.from("MThd"), 0, 0, 0, 6, 0, 0, 0, 1, 0, 96);
  const track = [];
  const add = (...values) => track.push(...values);
  add(0, 0xff, 0x51, 3, 0x09, 0x27, 0xc0);
  for (const pitch of pitches) {
    add(0, 0x90, pitch, 82);
    add(96, 0x80, pitch, 0);
  }
  add(0, 0xff, 0x2f, 0);
  push(...Buffer.from("MTrk"));
  push(
    (track.length >>> 24) & 255,
    (track.length >>> 16) & 255,
    (track.length >>> 8) & 255,
    track.length & 255,
  );
  push(...track);
  return writeFile(path, Buffer.from(bytes));
}

const cueDefs = [
  ["select", 780, 0.08, 1.18, 0.02],
  ["swap", 520, 0.12, 1.55, 0.03],
  ["refuse", 130, 0.16, 0.55, 0.06],
  ["land", 180, 0.2, 0.75, 0.08],
  ["flaw", 310, 0.18, 0.4, 0.22],
  ["cut", 1080, 0.22, 1.8, 0.04],
  ["levelup", 540, 0.46, 2.4, 0.01],
  ["gameover", 300, 0.55, 0.35, 0.05],
  ["shatter", 420, 0.28, 0.8, 0.28],
];
for (const [name, f, d, sw, nz] of cueDefs)
  await wav(`public/assets/audio/${name}.wav`, f, d, sw, nz);
for (let i = 1; i <= 8; i++)
  await wav(
    `public/assets/audio/chain-${i}.wav`,
    360 + i * 90,
    0.13,
    1.08,
    0.03,
  );
const titleNotes = [
  0, 0.35, 0.7, 1.05, 1.6, 1.95, 2.3, 2.65, 3.2, 3.55, 3.9, 4.25,
].flatMap((start, i) => {
  const melody = [72, 76, 79, 83, 81, 79, 76, 72, 74, 79, 86, 84];
  const freq = 440 * 2 ** ((melody[i] - 69) / 12);
  return [
    { start, dur: 0.32, freq, gain: 0.22 },
    { start, dur: 0.7, freq: freq / 2, gain: 0.08 },
  ];
});
const playNotes = Array.from({ length: 24 }, (_, i) => {
  const scale = [57, 60, 64, 67, 69, 67, 64, 60];
  return {
    start: i * 0.28,
    dur: 0.55,
    freq: 440 * 2 ** ((scale[i % scale.length] - 69) / 12),
    gain: i % 4 === 0 ? 0.16 : 0.1,
  };
});
await musicWav("public/assets/audio/title.wav", titleNotes, 4.9);
await musicWav("public/assets/audio/play.wav", playNotes, 6.8);
await midi(
  "public/assets/audio/title.mid",
  [72, 76, 79, 83, 81, 79, 76, 72, 74, 79, 86, 84],
);
await midi(
  "public/assets/audio/play.mid",
  [57, 60, 64, 67, 69, 67, 64, 60, 57, 60, 64, 67],
);
