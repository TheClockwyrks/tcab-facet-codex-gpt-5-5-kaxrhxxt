import type {
  Game,
  InitApi,
  PointerDevice as EnginePointerDevice,
  RenderApi,
  UpdateApi,
} from "@clockwyrks/simple-2d";
import type { DeepReadonly } from "ts-essentials";
import {
  ACTIONS,
  BACK_LABEL,
  BASE_SCORE,
  BEST_CHAIN_LABEL,
  BEST_MOVE_LABEL,
  BINDINGS,
  BOARD_CX,
  BOARD_CY,
  CELL_PITCH,
  CUES,
  FALL_SECONDS_PER_ROW,
  FACET_DEBUG_VERSION,
  FLAWED_SCORE,
  GAMEOVER_ITEMS,
  GAMEOVER_TITLE_TEXT,
  GEM_HIT_R,
  GEM_KINDS,
  GEM_R,
  GRID_COLS,
  GRID_ROWS,
  HUD_CHAIN_LABEL,
  HUD_LEVEL_LABEL,
  HUD_SCORE_LABEL,
  LAND_MIN_ROWS,
  LEVELCLEAR_ITEMS,
  LEVELCLEAR_TITLE_TEXT,
  LEVEL_TARGET_STEP,
  MATCH_MIN,
  MAX_MULTIPLIER,
  MAX_STRAIN,
  PAUSED_ITEMS,
  PAUSED_TITLE_TEXT,
  PAUSE_LABEL,
  REFUSAL_SECONDS,
  STAGE_CX,
  STAGE_H,
  STAGE_W,
  STEP_SECONDS,
  SWAP_SECONDS,
  TAGLINE_TEXT,
  TARGET_MIN_H,
  TITLE_ITEMS,
  TITLE_TEXT,
  WAVE_SECONDS,
} from "./constants";

export type GemKind =
  "ruby" | "amber" | "citrine" | "jade" | "beryl" | "sapphire" | "amethyst";

export type Cut = "plain" | "brilliant" | "star" | "prism";

export type Screen =
  "title" | "howto" | "playing" | "paused" | "levelclear" | "gameover";

export type Phase = "idle" | "swapping" | "resolving";

export type PointerDevice = "mouse" | "pen" | "touch";

export interface CellRef {
  readonly col: number;
  readonly row: number;
}

export interface GemState {
  readonly col: number;
  readonly row: number;
  readonly kind: GemKind | null;
  readonly cut: Cut;
  readonly strain: number;
  readonly fell: number;
}

export interface BoardState {
  readonly cols: number;
  readonly rows: number;
  readonly cells: readonly GemState[];
}

export interface RefusalState {
  readonly a: CellRef;
  readonly b: CellRef;
  readonly timer: number;
}

export interface PointerState {
  readonly x: number;
  readonly y: number;
  readonly down: boolean;
  readonly device: PointerDevice;
}

interface Target {
  readonly id: string;
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
}

interface WaveCell extends CellRef {
  readonly wave: number;
  readonly kind: GemKind | null;
  readonly strain: number;
}

interface FxState {
  readonly kind: "clear" | "flawed" | "cut";
  readonly col: number;
  readonly row: number;
  readonly age: number;
}

interface Assets {
  readonly images: Readonly<Record<string, unknown>>;
}

export interface FacetState {
  readonly screen: Screen;
  readonly menuIndex: number;

  readonly board: BoardState;
  readonly phase: Phase;
  readonly chainStep: number;
  readonly swapTimer: number;
  readonly stepTimer: number;

  readonly score: number;
  readonly level: number;
  readonly levelScore: number;
  readonly lastCleared: number;
  readonly lastPoints: number;
  readonly lastWaves: number;

  readonly moveScore: number;
  readonly bestMove: number;
  readonly bestChain: number;

  readonly selection: CellRef | null;
  readonly offer: CellRef | null;
  readonly refusal: RefusalState | null;
  readonly armedTarget: string | null;

  readonly pointer: PointerState;
  readonly simTime: number;
  readonly muted: boolean;
  readonly refillKinds: readonly string[];

  readonly assets?: Assets;
  readonly swapA?: CellRef | null;
  readonly swapB?: CellRef | null;
  readonly waveCells?: readonly WaveCell[];
  readonly activeFx?: readonly FxState[];
  readonly rngSeed?: number;
}

interface SnapshotCell extends GemState {
  readonly x: number;
  readonly y: number;
}

interface FacetSnapshot {
  readonly version: number;
  readonly screen: Screen;
  readonly menuIndex: number;
  readonly score: number;
  readonly level: number;
  readonly levelScore: number;
  readonly levelTarget: number;
  readonly phase: Phase;
  readonly chainStep: number;
  readonly multiplier: number;
  readonly swapTimer: number;
  readonly stepTimer: number;
  readonly stepHold: number;
  readonly board: {
    readonly cols: number;
    readonly rows: number;
    readonly cells: readonly SnapshotCell[];
  };
  readonly selection: CellRef | null;
  readonly offer: CellRef | null;
  readonly refusal: { readonly a: CellRef; readonly b: CellRef } | null;
  readonly lastCleared: number;
  readonly lastPoints: number;
  readonly lastWaves: number;
  readonly lastFall: number;
  readonly moveScore: number;
  readonly bestMove: number;
  readonly bestChain: number;
  readonly legalSwap: boolean;
  readonly refillKinds: readonly string[];
  readonly pointer: PointerState;
  readonly armedTarget: string | null;
  readonly targets: readonly Target[];
  readonly muted: boolean;
  readonly simTime: number;
}

export interface FacetDebugApi {
  readonly version: number;
  reset(state: DeepReadonly<FacetState>): FacetState;
  reconcile(state: DeepReadonly<FacetState>): FacetState;
  snapshot(state: DeepReadonly<FacetState>): FacetSnapshot;
  setScreen(state: DeepReadonly<FacetState>, screen: Screen): FacetState;
  setMenuIndex(state: DeepReadonly<FacetState>, index: number): FacetState;
  loadBoard(
    state: DeepReadonly<FacetState>,
    rows: readonly string[],
  ): FacetState;
  dealBoard(state: DeepReadonly<FacetState>): FacetState;
  clearBoard(state: DeepReadonly<FacetState>): FacetState;
  setGem(
    state: DeepReadonly<FacetState>,
    col: number,
    row: number,
    token: string,
  ): FacetState;
  setRefillKinds(
    state: DeepReadonly<FacetState>,
    col: number,
    kinds: string,
  ): FacetState;
  clearRefillKinds(state: DeepReadonly<FacetState>): FacetState;
  setScore(state: DeepReadonly<FacetState>, points: number): FacetState;
  setLevel(state: DeepReadonly<FacetState>, level: number): FacetState;
  setLevelScore(state: DeepReadonly<FacetState>, points: number): FacetState;
  setBestChain(state: DeepReadonly<FacetState>, chainStep: number): FacetState;
  setBestMove(state: DeepReadonly<FacetState>, points: number): FacetState;
  setMoveScore(state: DeepReadonly<FacetState>, points: number): FacetState;
  setSelection(
    state: DeepReadonly<FacetState>,
    col: number,
    row: number,
  ): FacetState;
  clearSelection(state: DeepReadonly<FacetState>): FacetState;
  setOffer(
    state: DeepReadonly<FacetState>,
    col: number,
    row: number,
  ): FacetState;
  clearOffer(state: DeepReadonly<FacetState>): FacetState;
  clearRefusal(state: DeepReadonly<FacetState>): FacetState;
  clearChain(state: DeepReadonly<FacetState>): FacetState;
  requestSwap(
    state: DeepReadonly<FacetState>,
    colA: number,
    rowA: number,
    colB: number,
    rowB: number,
  ): FacetState;
  pointerDown(
    state: DeepReadonly<FacetState>,
    x: number,
    y: number,
    device?: PointerDevice,
  ): FacetState;
  pointerMove(
    state: DeepReadonly<FacetState>,
    x: number,
    y: number,
    device?: PointerDevice,
  ): FacetState;
  pointerUp(
    state: DeepReadonly<FacetState>,
    device?: PointerDevice,
  ): FacetState;
}

type MutableBoard = (GemState | null)[];

export const BACKGROUND = "#100d16";

const BOARD_EMPTY: BoardState = { cols: 0, rows: 0, cells: [] };
const KIND_LETTERS: Record<string, GemKind> = {
  R: "ruby",
  A: "amber",
  C: "citrine",
  J: "jade",
  B: "beryl",
  S: "sapphire",
  M: "amethyst",
};
function clone<T>(value: DeepReadonly<T>): T {
  return value as unknown as T;
}

function idx(col: number, row: number): number {
  return row * GRID_COLS + col;
}

function cellX(col: number): number {
  return BOARD_CX - ((GRID_COLS - 1) * CELL_PITCH) / 2 + col * CELL_PITCH;
}

function cellY(row: number): number {
  return BOARD_CY - ((GRID_ROWS - 1) * CELL_PITCH) / 2 + row * CELL_PITCH;
}

function sameCell(a: CellRef | null, b: CellRef | null): boolean {
  return !!a && !!b && a.col === b.col && a.row === b.row;
}

function adjacent(a: CellRef, b: CellRef): boolean {
  return Math.abs(a.col - b.col) + Math.abs(a.row - b.row) === 1;
}

function assertCell(col: number, row: number): void {
  if (
    !Number.isInteger(col) ||
    !Number.isInteger(row) ||
    col < 0 ||
    row < 0 ||
    col >= GRID_COLS ||
    row >= GRID_ROWS
  ) {
    throw new RangeError(`cell (${col}, ${row}) is outside the board`);
  }
}

function tokenToGem(token: string, col: number, row: number): GemState {
  const match = /^([RACJBSMX])([0-3])([bs])?$/.exec(token);
  if (!match) throw new Error(`invalid Facet token "${token}"`);
  const [, letter, strainText, cutText] = match;
  const strain = Number(strainText);
  if (letter === "X")
    return { col, row, kind: null, cut: "prism", strain, fell: 0 };
  const kind = KIND_LETTERS[letter];
  const cut =
    cutText === "b" ? "brilliant" : cutText === "s" ? "star" : "plain";
  return { col, row, kind, cut, strain, fell: 0 };
}

function boardFromRows(rows: readonly string[]): BoardState {
  if (rows.length !== GRID_ROWS)
    throw new Error("board notation must have 8 rows");
  const cells = rows.flatMap((line, row) => {
    const tokens = line.trim().split(/\s+/);
    if (tokens.length !== GRID_COLS)
      throw new Error("board notation row must have 8 cells");
    return tokens.map((token, col) => tokenToGem(token, col, row));
  });
  return { cols: GRID_COLS, rows: GRID_ROWS, cells };
}

function boardArray(board: DeepReadonly<BoardState>): MutableBoard {
  return Array.from({ length: GRID_COLS * GRID_ROWS }, (_, i) => {
    const gem = board.cells[i];
    return gem ? { ...gem } : null;
  });
}

function fromArray(cells: MutableBoard): BoardState {
  return {
    cols: GRID_COLS,
    rows: GRID_ROWS,
    cells: cells.map((gem, i) => {
      if (gem) return gem;
      const col = i % GRID_COLS;
      const row = Math.floor(i / GRID_COLS);
      return { col, row, kind: "ruby", cut: "plain", strain: 0, fell: 0 };
    }),
  };
}

function initialState(assets?: Assets, muted = false): FacetState {
  return {
    screen: "title",
    menuIndex: 0,
    board: BOARD_EMPTY,
    phase: "idle",
    chainStep: 0,
    swapTimer: 0,
    stepTimer: 0,
    score: 0,
    level: 1,
    levelScore: 0,
    lastCleared: 0,
    lastPoints: 0,
    lastWaves: 0,
    moveScore: 0,
    bestMove: 0,
    bestChain: 0,
    selection: null,
    offer: null,
    refusal: null,
    armedTarget: null,
    pointer: { x: 0, y: 0, down: false, device: "mouse" },
    simTime: 0,
    muted,
    refillKinds: Array.from({ length: GRID_COLS }, () => ""),
    assets,
    swapA: null,
    swapB: null,
    waveCells: [],
    activeFx: [],
    rngSeed: 0x5eed1234,
  };
}

function nextRand(seed: number): [number, number] {
  const next = (seed * 1664525 + 1013904223) >>> 0;
  return [next, next / 0x100000000];
}

function drawKind(seed: number): [number, GemKind] {
  const [next, value] = nextRand(seed);
  return [next, GEM_KINDS[Math.floor(value * GEM_KINDS.length)]];
}

function findRuns(board: DeepReadonly<BoardState>): CellRef[][] {
  if (board.cols !== GRID_COLS || board.rows !== GRID_ROWS) return [];
  const runs: CellRef[][] = [];
  for (let row = 0; row < GRID_ROWS; row++) {
    let start = 0;
    while (start < GRID_COLS) {
      const kind = board.cells[idx(start, row)]?.kind;
      let end = start + 1;
      while (
        kind &&
        end < GRID_COLS &&
        board.cells[idx(end, row)]?.kind === kind
      )
        end++;
      if (kind && end - start >= MATCH_MIN)
        runs.push(
          Array.from({ length: end - start }, (_, n) => ({
            col: start + n,
            row,
          })),
        );
      start = end;
    }
  }
  for (let col = 0; col < GRID_COLS; col++) {
    let start = 0;
    while (start < GRID_ROWS) {
      const kind = board.cells[idx(col, start)]?.kind;
      let end = start + 1;
      while (
        kind &&
        end < GRID_ROWS &&
        board.cells[idx(col, end)]?.kind === kind
      )
        end++;
      if (kind && end - start >= MATCH_MIN)
        runs.push(
          Array.from({ length: end - start }, (_, n) => ({
            col,
            row: start + n,
          })),
        );
      start = end;
    }
  }
  return runs;
}

function swappedBoard(
  board: DeepReadonly<BoardState>,
  a: CellRef,
  b: CellRef,
): BoardState {
  const cells = board.cells.map((gem) => ({ ...gem }));
  const ai = idx(a.col, a.row);
  const bi = idx(b.col, b.row);
  const ga = cells[ai];
  const gb = cells[bi];
  cells[ai] = { ...gb, col: a.col, row: a.row, fell: 0 };
  cells[bi] = { ...ga, col: b.col, row: b.row, fell: 0 };
  return { cols: GRID_COLS, rows: GRID_ROWS, cells };
}

function productive(
  board: DeepReadonly<BoardState>,
  a: CellRef,
  b: CellRef,
): boolean {
  const ga = board.cells[idx(a.col, a.row)];
  const gb = board.cells[idx(b.col, b.row)];
  if (ga?.cut === "prism" || gb?.cut === "prism") return true;
  return findRuns(swappedBoard(board, a, b)).length > 0;
}

function hasLegalSwap(board: DeepReadonly<BoardState>): boolean {
  if (board.cols !== GRID_COLS || board.rows !== GRID_ROWS) return false;
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      const a = { col, row };
      if (col + 1 < GRID_COLS && productive(board, a, { col: col + 1, row }))
        return true;
      if (row + 1 < GRID_ROWS && productive(board, a, { col, row: row + 1 }))
        return true;
    }
  }
  return false;
}

function dealBoard(seed: number): [BoardState, number] {
  let rng = seed;
  for (let attempt = 0; attempt < 500; attempt++) {
    const cells: GemState[] = [];
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        let kind: GemKind;
        do {
          [rng, kind] = drawKind(rng);
        } while (
          (col >= 2 &&
            cells[idx(col - 1, row)]?.kind === kind &&
            cells[idx(col - 2, row)]?.kind === kind) ||
          (row >= 2 &&
            cells[idx(col, row - 1)]?.kind === kind &&
            cells[idx(col, row - 2)]?.kind === kind)
        );
        cells.push({ col, row, kind, cut: "plain", strain: 0, fell: row + 1 });
      }
    }
    const board = { cols: GRID_COLS, rows: GRID_ROWS, cells };
    if (hasLegalSwap(board)) return [board, rng];
  }
  throw new Error("could not deal a legal Facet board");
}

function initialRound(state: DeepReadonly<FacetState>): FacetState {
  const [board, rngSeed] = dealBoard(state.rngSeed ?? 0x5eed1234);
  return {
    ...clone(state),
    screen: "playing",
    menuIndex: 0,
    board,
    phase: "idle",
    chainStep: 0,
    swapTimer: 0,
    stepTimer: 0,
    score: 0,
    level: 1,
    levelScore: 0,
    lastCleared: 0,
    lastPoints: 0,
    lastWaves: 0,
    moveScore: 0,
    bestMove: 0,
    bestChain: 0,
    selection: null,
    offer: null,
    refusal: null,
    armedTarget: null,
    refillKinds: Array.from({ length: GRID_COLS }, () => ""),
    swapA: null,
    swapB: null,
    waveCells: [],
    activeFx: [],
    rngSeed,
  };
}

function seedClear(
  board: DeepReadonly<BoardState>,
  swapA: CellRef | null,
  swapB: CellRef | null,
  step: number,
): { seed: Map<number, number>; runs: CellRef[][] } {
  const seed = new Map<number, number>();
  const runs = findRuns(board);
  if (step === 1 && swapA && swapB) {
    const ga = board.cells[idx(swapA.col, swapA.row)];
    const gb = board.cells[idx(swapB.col, swapB.row)];
    const prism = ga?.cut === "prism" ? ga : gb?.cut === "prism" ? gb : null;
    const other = prism === ga ? gb : prism === gb ? ga : null;
    if (prism) {
      if (other?.cut === "prism") {
        board.cells.forEach((gem) => seed.set(idx(gem.col, gem.row), 0));
      } else if (other?.kind) {
        seed.set(idx(prism.col, prism.row), 0);
        board.cells.forEach((gem) => {
          if (gem.kind === other.kind) seed.set(idx(gem.col, gem.row), 0);
        });
      }
      return { seed, runs: [] };
    }
  }
  for (const run of runs) for (const c of run) seed.set(idx(c.col, c.row), 0);
  return { seed, runs };
}

function expandClear(
  board: DeepReadonly<BoardState>,
  seed: Map<number, number>,
): Map<number, number> {
  const waves = new Map(seed);
  const queue = [...seed.entries()];
  for (let q = 0; q < queue.length; q++) {
    const [i, wave] = queue[q] ?? [0, 0];
    const gem = board.cells[i];
    const add = (col: number, row: number): void => {
      if (col < 0 || row < 0 || col >= GRID_COLS || row >= GRID_ROWS) return;
      const ni = idx(col, row);
      if (!waves.has(ni)) {
        waves.set(ni, wave + 1);
        queue.push([ni, wave + 1]);
      }
    };
    if (gem.cut === "brilliant") {
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++)
          if (dc || dr) add(gem.col + dc, gem.row + dr);
    }
    if (gem.cut === "star") {
      for (let col = 0; col < GRID_COLS; col++) add(col, gem.row);
      for (let row = 0; row < GRID_ROWS; row++) add(gem.col, row);
    }
    for (const n of [
      { col: gem.col + 1, row: gem.row },
      { col: gem.col - 1, row: gem.row },
      { col: gem.col, row: gem.row + 1 },
      { col: gem.col, row: gem.row - 1 },
    ]) {
      if (n.col >= 0 && n.row >= 0 && n.col < GRID_COLS && n.row < GRID_ROWS) {
        const ng = board.cells[idx(n.col, n.row)];
        if (ng.strain >= MAX_STRAIN) add(n.col, n.row);
      }
    }
  }
  return waves;
}

function cutCreations(
  board: DeepReadonly<BoardState>,
  runs: CellRef[][],
  swapA: CellRef | null,
  swapB: CellRef | null,
): Map<number, GemState> {
  const result = new Map<number, GemState>();
  const horizontal = runs.filter((r) => r.every((c) => c.row === r[0]?.row));
  const vertical = runs.filter((r) => r.every((c) => c.col === r[0]?.col));
  for (const h of horizontal) {
    for (const v of vertical) {
      const hit = h.find((hc) => v.some((vc) => sameCell(hc, vc)));
      if (hit) {
        const kind = board.cells[idx(hit.col, hit.row)]?.kind;
        if (kind)
          result.set(idx(hit.col, hit.row), {
            ...hit,
            kind,
            cut: "star",
            strain: 0,
            fell: 0,
          });
      }
    }
  }
  for (const run of runs) {
    const kind = board.cells[idx(run[0]?.col ?? 0, run[0]?.row ?? 0)]?.kind;
    if (!kind || run.length < 4) continue;
    const preferred = [swapA, swapB].find(
      (s) => s && run.some((c) => sameCell(c, s)),
    );
    const place = preferred ?? run[Math.floor((run.length - 1) / 2)];
    if (!place) continue;
    const at = idx(place.col, place.row);
    const cut: Cut = run.length >= 5 ? "prism" : "brilliant";
    if (cut === "brilliant" && result.get(at)?.cut === "star") continue;
    result.set(at, {
      col: place.col,
      row: place.row,
      kind: cut === "prism" ? null : kind,
      cut,
      strain: 0,
      fell: 0,
    });
  }
  return result;
}

function resolveStep(state: DeepReadonly<FacetState>): FacetState {
  const { seed, runs } = seedClear(
    state.board,
    state.swapA ?? null,
    state.swapB ?? null,
    state.chainStep,
  );
  const waves = expandClear(state.board, seed);
  if (waves.size === 0) return clone(state);

  const cells = boardArray(state.board);
  let points = 0;
  let flawed = false;
  const waveCells: WaveCell[] = [];
  for (const [i, wave] of waves) {
    const gem = state.board.cells[i];
    points +=
      (gem.strain >= MAX_STRAIN ? FLAWED_SCORE : BASE_SCORE) *
      Math.min(state.chainStep, MAX_MULTIPLIER);
    flawed ||= gem.strain >= MAX_STRAIN;
    waveCells.push({
      col: gem.col,
      row: gem.row,
      wave,
      kind: gem.kind,
      strain: gem.strain,
    });
  }

  let flawCue = false;
  for (const [i] of waves) {
    const gem = state.board.cells[i];
    for (const n of [
      { col: gem.col + 1, row: gem.row },
      { col: gem.col - 1, row: gem.row },
      { col: gem.col, row: gem.row + 1 },
      { col: gem.col, row: gem.row - 1 },
    ]) {
      if (n.col < 0 || n.row < 0 || n.col >= GRID_COLS || n.row >= GRID_ROWS)
        continue;
      const ni = idx(n.col, n.row);
      if (waves.has(ni)) continue;
      const old = cells[ni];
      if (old) {
        const strain = Math.min(MAX_STRAIN, old.strain + 1);
        flawCue ||= old.strain < MAX_STRAIN && strain === MAX_STRAIN;
        cells[ni] = { ...old, strain };
      }
    }
  }
  for (const [i] of waves) cells[i] = null;
  const creations = cutCreations(
    state.board,
    runs,
    state.swapA ?? null,
    state.swapB ?? null,
  );
  let madeCut = false;
  for (const [i, gem] of creations) {
    cells[i] = gem;
    madeCut = true;
  }

  let rng = state.rngSeed ?? 0x5eed1234;
  let maxFall = 0;
  for (let col = 0; col < GRID_COLS; col++) {
    const survivors: GemState[] = [];
    for (let row = GRID_ROWS - 1; row >= 0; row--) {
      const gem = cells[idx(col, row)];
      if (gem) survivors.push(gem);
    }
    for (let row = GRID_ROWS - 1, s = 0; row >= 0; row--, s++) {
      const survivor = survivors[s];
      if (survivor) {
        const fell = row - survivor.row;
        maxFall = Math.max(maxFall, fell);
        cells[idx(col, row)] = { ...survivor, col, row, fell };
      } else {
        const posed = state.refillKinds[col]?.[row];
        let kind: GemKind;
        if (posed && KIND_LETTERS[posed]) {
          kind = KIND_LETTERS[posed];
        } else {
          [rng, kind] = drawKind(rng);
        }
        const fell = row + 1 + Math.floor((GRID_ROWS - 1 - row) / 2);
        maxFall = Math.max(maxFall, fell);
        cells[idx(col, row)] = {
          col,
          row,
          kind,
          cut: "plain",
          strain: 0,
          fell,
        };
      }
    }
  }

  const activeFx: FxState[] = [
    ...(state.activeFx ?? []),
    ...waveCells.map((c) => ({
      kind:
        c.strain >= MAX_STRAIN || flawed
          ? ("flawed" as const)
          : ("clear" as const),
      col: c.col,
      row: c.row,
      age: -c.wave * WAVE_SECONDS,
    })),
    ...[...creations.values()].map((c) => ({
      kind: "cut" as const,
      col: c.col,
      row: c.row,
      age: 0,
    })),
  ];
  return {
    ...clone(state),
    board: fromArray(cells),
    stepTimer: 0,
    score: state.score + points,
    levelScore: state.levelScore + points,
    lastCleared: waves.size,
    lastPoints: points,
    lastWaves: Math.max(...waves.values()),
    moveScore: state.moveScore + points,
    bestChain: Math.max(state.bestChain, state.chainStep),
    waveCells,
    activeFx,
    rngSeed: rng,
    ...(madeCut ? { lastPoints: points } : {}),
    ...(flawCue ? { lastCleared: waves.size } : {}),
  };
}

function stepHold(state: DeepReadonly<FacetState>): number {
  return (
    state.lastWaves * WAVE_SECONDS +
    lastFall(state.board) * FALL_SECONDS_PER_ROW +
    STEP_SECONDS
  );
}

function lastFall(board: DeepReadonly<BoardState>): number {
  return board.cells.reduce((max, gem) => Math.max(max, gem.fell), 0);
}

function settleAfterChain(state: DeepReadonly<FacetState>): FacetState {
  const base: FacetState = {
    ...clone(state),
    phase: "idle",
    chainStep: 0,
    stepTimer: 0,
    swapA: null,
    swapB: null,
    bestMove: Math.max(state.bestMove, state.moveScore),
  };
  if (base.levelScore >= base.level * LEVEL_TARGET_STEP) {
    return { ...base, screen: "levelclear", menuIndex: 0, armedTarget: null };
  }
  if (!hasLegalSwap(base.board))
    return { ...base, screen: "gameover", menuIndex: 0, armedTarget: null };
  return base;
}

function continueLevel(state: DeepReadonly<FacetState>): FacetState {
  const [board, rngSeed] = dealBoard(state.rngSeed ?? 0x5eed1234);
  return {
    ...clone(state),
    screen: "playing",
    menuIndex: 0,
    board,
    level: state.level + 1,
    levelScore: 0,
    bestChain: 0,
    bestMove: 0,
    phase: "idle",
    chainStep: 0,
    swapTimer: 0,
    stepTimer: 0,
    selection: null,
    offer: null,
    refusal: null,
    armedTarget: null,
    rngSeed,
  };
}

function abandonRound(state: DeepReadonly<FacetState>): FacetState {
  return {
    ...clone(state),
    screen: "title",
    menuIndex: 0,
    board: BOARD_EMPTY,
    phase: "idle",
    chainStep: 0,
    swapTimer: 0,
    stepTimer: 0,
    selection: null,
    offer: null,
    refusal: null,
    armedTarget: null,
    swapA: null,
    swapB: null,
    waveCells: [],
  };
}

function requestSwapState(
  state: DeepReadonly<FacetState>,
  a: CellRef,
  b: CellRef,
): FacetState {
  assertCell(a.col, a.row);
  assertCell(b.col, b.row);
  if (
    state.phase !== "idle" ||
    state.board.cols !== GRID_COLS ||
    !adjacent(a, b) ||
    !productive(state.board, a, b)
  ) {
    return { ...clone(state), refusal: { a, b, timer: 0 } };
  }
  return {
    ...clone(state),
    board: swappedBoard(state.board, a, b),
    phase: "swapping",
    chainStep: 0,
    swapTimer: 0,
    moveScore: 0,
    refusal: null,
    swapA: a,
    swapB: b,
  };
}

function targetAt(screen: Screen, x: number, y: number): Target | null {
  return (
    targetsFor(screen).find(
      (t) => x >= t.x && y >= t.y && x <= t.x + t.w && y <= t.y + t.h,
    ) ?? null
  );
}

function targetsFor(screen: Screen): Target[] {
  const menu = (count: number, startY: number): Target[] =>
    Array.from({ length: count }, (_, i) => ({
      id: `menu-${i}`,
      x: STAGE_CX - 150,
      y: startY + i * 88,
      w: 300,
      h: TARGET_MIN_H,
    }));
  if (screen === "title") return menu(TITLE_ITEMS.length, 440);
  if (screen === "paused") return menu(PAUSED_ITEMS.length, 380);
  if (screen === "levelclear") return menu(LEVELCLEAR_ITEMS.length, 470);
  if (screen === "gameover") return menu(GAMEOVER_ITEMS.length, 455);
  if (screen === "howto")
    return [{ id: "back", x: 56, y: 596, w: 150, h: TARGET_MIN_H }];
  if (screen === "playing")
    return [{ id: "pause", x: 1070, y: 30, w: 150, h: TARGET_MIN_H }];
  return [];
}

function menuLength(screen: Screen): number {
  if (screen === "title") return TITLE_ITEMS.length;
  if (screen === "paused") return PAUSED_ITEMS.length;
  if (screen === "levelclear") return LEVELCLEAR_ITEMS.length;
  if (screen === "gameover") return GAMEOVER_ITEMS.length;
  return 0;
}

function takeMenu(
  state: DeepReadonly<FacetState>,
  index = state.menuIndex,
): FacetState {
  if (state.screen === "title")
    return index === 0
      ? initialRound(state)
      : { ...clone(state), screen: "howto", armedTarget: null };
  if (state.screen === "paused")
    return index === 0
      ? { ...clone(state), screen: "playing", menuIndex: 0, armedTarget: null }
      : abandonRound(state);
  if (state.screen === "levelclear")
    return index === 0 ? continueLevel(state) : abandonRound(state);
  if (state.screen === "gameover")
    return index === 0 ? initialRound(state) : abandonRound(state);
  return clone(state);
}

function takeTarget(
  state: DeepReadonly<FacetState>,
  target: Target,
): FacetState {
  if (target.id.startsWith("menu-"))
    return takeMenu(state, Number(target.id.slice(5)));
  if (target.id === "back" && state.screen === "howto")
    return {
      ...clone(state),
      screen: "title",
      menuIndex: 1,
      armedTarget: null,
    };
  if (target.id === "pause" && state.screen === "playing")
    return {
      ...clone(state),
      screen: "paused",
      menuIndex: 0,
      armedTarget: null,
    };
  return clone(state);
}

function targetedCell(x: number, y: number): CellRef | null {
  let best: { cell: CellRef; d: number } | null = null;
  for (let row = GRID_ROWS - 1; row >= 0; row--) {
    for (let col = GRID_COLS - 1; col >= 0; col--) {
      const d = Math.hypot(x - cellX(col), y - cellY(row));
      if (
        d <= GEM_HIT_R &&
        (!best || d < best.d || Math.abs(d - best.d) < 0.00001)
      ) {
        best = { cell: { col, row }, d };
      }
    }
  }
  return best?.cell ?? null;
}

function pointerDownState(
  state: DeepReadonly<FacetState>,
  x: number,
  y: number,
  device: PointerDevice = "mouse",
): FacetState {
  const pointer = { x, y, down: true, device };
  const target = targetAt(state.screen, x, y);
  if (target) {
    const menuIndex = target.id.startsWith("menu-")
      ? Number(target.id.slice(5))
      : state.menuIndex;
    return { ...clone(state), pointer, menuIndex, armedTarget: target.id };
  }
  if (state.screen !== "playing")
    return { ...clone(state), pointer, armedTarget: null };
  const cell = targetedCell(x, y);
  if (!cell)
    return {
      ...clone(state),
      pointer,
      selection: null,
      offer: null,
      armedTarget: null,
    };
  if (!state.selection)
    return {
      ...clone(state),
      pointer,
      selection: cell,
      offer: null,
      armedTarget: null,
    };
  if (sameCell(state.selection, cell))
    return { ...clone(state), pointer, offer: null, armedTarget: null };
  if (adjacent(state.selection, cell))
    return { ...clone(state), pointer, offer: cell, armedTarget: null };
  return {
    ...clone(state),
    pointer,
    selection: cell,
    offer: null,
    armedTarget: null,
  };
}

function pointerMoveState(
  state: DeepReadonly<FacetState>,
  x: number,
  y: number,
  device: PointerDevice = "mouse",
): FacetState {
  const pointer = { x, y, down: state.pointer.down, device };
  const target = targetAt(state.screen, x, y);
  if (target && !state.pointer.down && target.id.startsWith("menu-")) {
    return { ...clone(state), pointer, menuIndex: Number(target.id.slice(5)) };
  }
  if (state.screen !== "playing" || !state.pointer.down || !state.selection)
    return { ...clone(state), pointer };
  const cell = targetedCell(x, y);
  if (sameCell(state.selection, cell))
    return { ...clone(state), pointer, offer: null };
  if (cell && adjacent(state.selection, cell))
    return { ...clone(state), pointer, offer: cell };
  return { ...clone(state), pointer };
}

function pointerUpState(
  state: DeepReadonly<FacetState>,
  device: PointerDevice = "mouse",
): FacetState {
  const pointer = { ...state.pointer, down: false, device };
  const target = state.armedTarget
    ? targetAt(state.screen, state.pointer.x, state.pointer.y)
    : null;
  let next: FacetState = { ...clone(state), pointer, armedTarget: null };
  if (target && target.id === state.armedTarget)
    return takeTarget(next, target);
  if (state.screen === "playing" && state.offer && state.selection) {
    next = requestSwapState(next, state.selection, state.offer);
    return { ...next, selection: null, offer: null };
  }
  return next;
}

function snapshot(state: DeepReadonly<FacetState>): FacetSnapshot {
  return {
    version: FACET_DEBUG_VERSION,
    screen: state.screen,
    menuIndex: state.menuIndex,
    score: state.score,
    level: state.level,
    levelScore: state.levelScore,
    levelTarget: state.level * LEVEL_TARGET_STEP,
    phase: state.phase,
    chainStep: state.chainStep,
    multiplier: Math.min(state.chainStep, MAX_MULTIPLIER),
    swapTimer: state.swapTimer,
    stepTimer: state.stepTimer,
    stepHold: stepHold(state),
    board: {
      cols: state.board.cols,
      rows: state.board.rows,
      cells: state.board.cells.map((gem) => ({
        ...gem,
        x: cellX(gem.col),
        y: cellY(gem.row),
      })),
    },
    selection: state.selection,
    offer: state.offer,
    refusal: state.refusal ? { a: state.refusal.a, b: state.refusal.b } : null,
    lastCleared: state.lastCleared,
    lastPoints: state.lastPoints,
    lastWaves: state.lastWaves,
    lastFall: lastFall(state.board),
    moveScore: state.moveScore,
    bestMove: state.bestMove,
    bestChain: state.bestChain,
    legalSwap: hasLegalSwap(state.board),
    refillKinds: state.refillKinds,
    pointer: state.pointer,
    armedTarget: state.armedTarget,
    targets: targetsFor(state.screen),
    muted: state.muted,
    simTime: state.simTime,
  };
}

function makeDebug(assets?: Assets): FacetDebugApi {
  return {
    version: FACET_DEBUG_VERSION,
    reset: (state) => initialState(assets, state.muted),
    reconcile: (state) => clone(state),
    snapshot,
    setScreen: (state, screen) => {
      if (
        ![
          "title",
          "howto",
          "playing",
          "paused",
          "levelclear",
          "gameover",
        ].includes(screen)
      )
        throw new Error("invalid screen");
      return { ...clone(state), screen };
    },
    setMenuIndex: (state, index) => {
      if (!Number.isInteger(index) || index < 0)
        throw new RangeError("menu index must be at least 0");
      return { ...clone(state), menuIndex: index };
    },
    loadBoard: (state, rows) => ({
      ...clone(state),
      board: boardFromRows(rows),
    }),
    dealBoard: (state) => {
      const [board, rngSeed] = dealBoard(state.rngSeed ?? 0x5eed1234);
      return { ...clone(state), board, rngSeed };
    },
    clearBoard: (state) => ({ ...clone(state), board: BOARD_EMPTY }),
    setGem: (state, col, row, token) => {
      assertCell(col, row);
      const cells = state.board.cells.map((gem) => ({ ...gem }));
      cells[idx(col, row)] = tokenToGem(token, col, row);
      return {
        ...clone(state),
        board: { cols: GRID_COLS, rows: GRID_ROWS, cells },
      };
    },
    setRefillKinds: (state, col, kinds) => {
      if (!Number.isInteger(col) || col < 0 || col >= GRID_COLS)
        throw new RangeError("invalid refill column");
      if (![...kinds].every((c) => KIND_LETTERS[c]))
        throw new Error("invalid refill kind string");
      const refillKinds = state.refillKinds.map((s, i) =>
        i === col ? kinds : s,
      );
      return { ...clone(state), refillKinds };
    },
    clearRefillKinds: (state) => ({
      ...clone(state),
      refillKinds: Array.from({ length: GRID_COLS }, () => ""),
    }),
    setScore: (state, points) => ({ ...clone(state), score: points }),
    setLevel: (state, level) => {
      if (!Number.isInteger(level) || level < 1)
        throw new RangeError("level must be at least 1");
      return { ...clone(state), level };
    },
    setLevelScore: (state, points) => ({ ...clone(state), levelScore: points }),
    setBestChain: (state, bestChain) => ({ ...clone(state), bestChain }),
    setBestMove: (state, bestMove) => ({ ...clone(state), bestMove }),
    setMoveScore: (state, moveScore) => ({ ...clone(state), moveScore }),
    setSelection: (state, col, row) => {
      assertCell(col, row);
      return { ...clone(state), selection: { col, row } };
    },
    clearSelection: (state) => ({ ...clone(state), selection: null }),
    setOffer: (state, col, row) => {
      assertCell(col, row);
      return { ...clone(state), offer: { col, row } };
    },
    clearOffer: (state) => ({ ...clone(state), offer: null }),
    clearRefusal: (state) => ({ ...clone(state), refusal: null }),
    clearChain: (state) => ({
      ...clone(state),
      phase: "idle",
      chainStep: 0,
      swapTimer: 0,
      stepTimer: 0,
    }),
    requestSwap: (state, colA, rowA, colB, rowB) =>
      requestSwapState(
        state,
        { col: colA, row: rowA },
        { col: colB, row: rowB },
      ),
    pointerDown: pointerDownState,
    pointerMove: pointerMoveState,
    pointerUp: pointerUpState,
  };
}

async function loadAssets(api: InitApi<FacetState>): Promise<Assets> {
  const paths: string[] = [];
  for (const kind of GEM_KINDS) {
    for (let strain = 0; strain <= MAX_STRAIN; strain++)
      paths.push(`gems/${kind}-${strain}.png`);
    for (let frame = 0; frame < 6; frame++)
      paths.push(`gems/break/${kind}/${String(frame).padStart(2, "0")}.png`);
  }
  for (let strain = 0; strain <= MAX_STRAIN; strain++)
    paths.push(`gems/prism-${strain}.png`);
  for (let frame = 0; frame < 8; frame++)
    paths.push(`gems/prism-turn/${String(frame).padStart(2, "0")}.png`);
  paths.push("gems/brilliant.png", "gems/star.png", "gems/board-frame.png");
  const entries = await Promise.all(
    paths.map(async (path) => {
      const image = await api.assets.loadImage(path).catch(() => null);
      return [path, image] as const;
    }),
  );
  const images = Object.fromEntries(
    entries.filter(([, image]) => image),
  ) as Record<string, unknown>;
  return { images };
}

function registerDiagnostics(api: InitApi<FacetState>): void {
  api.diagnostics.register("screen", (s) => s.screen);
  api.diagnostics.register("phase", (s) => s.phase);
  api.diagnostics.register("board", (s) => `${s.board.cols}x${s.board.rows}`);
  api.diagnostics.register("score", (s) => s.score);
  api.diagnostics.register(
    "level",
    (s) => `${s.level} ${s.levelScore}/${s.level * LEVEL_TARGET_STEP}`,
  );
  api.diagnostics.register(
    "chain",
    (s) => `${s.chainStep} x${Math.min(s.chainStep, MAX_MULTIPLIER)}`,
  );
  api.diagnostics.register(
    "cleared",
    (s) =>
      `${s.lastCleared} +${s.lastPoints} w${s.lastWaves} f${lastFall(s.board)}`,
  );
  api.diagnostics.register("selected", (s) =>
    s.selection ? `${s.selection.col},${s.selection.row}` : "-",
  );
  api.diagnostics.register("offer", (s) =>
    s.offer ? `${s.offer.col},${s.offer.row}` : "-",
  );
  api.diagnostics.register("best", (s) => `${s.bestMove}/${s.bestChain}`);
  api.diagnostics.register("legal", (s) => hasLegalSwap(s.board));
  api.diagnostics.register(
    "pointer",
    (s) =>
      `${s.pointer.device} ${s.pointer.x.toFixed(0)},${s.pointer.y.toFixed(0)}`,
  );
}

function playOnce(api: UpdateApi, cue: string): void {
  try {
    api.audio.play(cue);
  } catch {
    // Missing audio support in a test host should not change the simulation.
  }
}

function updateAudioLoops(
  state: DeepReadonly<FacetState>,
  api: UpdateApi,
): void {
  const title = state.screen === "title" || state.screen === "howto";
  try {
    if (title && !api.audio.looping("music-title"))
      api.audio.loop("music-title");
    if (!title && api.audio.looping("music-title"))
      api.audio.stop("music-title");
    if (!title && !api.audio.looping("music-play"))
      api.audio.loop("music-play");
    if (title && api.audio.looping("music-play")) api.audio.stop("music-play");
  } catch {
    // Audio can be absent in tests; the visual game still advances.
  }
}

export const game: Game<FacetState, FacetDebugApi> = {
  async initialize(
    api: InitApi<FacetState>,
  ): Promise<[FacetState, FacetDebugApi]> {
    for (const action of ACTIONS)
      api.input.register(action, { keys: [...BINDINGS[action]] });
    for (const cue of Object.values(CUES))
      api.audio.define(cue, { freq: 440, durationMs: 90, gain: 0.15 });
    for (let i = 1; i <= MAX_MULTIPLIER; i++)
      api.audio.define(`chain-${i}`, {
        freq: 360 + i * 90,
        durationMs: 120,
        gain: 0.16,
      });
    api.audio.define("music-title", {
      freq: 210,
      durationMs: 1000,
      gain: 0.04,
    });
    api.audio.define("music-play", {
      freq: 170,
      durationMs: 1000,
      gain: 0.035,
    });

    const audioLoads = [
      api.audio.load(CUES.select, "audio/select.wav"),
      api.audio.load(CUES.swap, "audio/swap.wav"),
      api.audio.load(CUES.refuse, "audio/refuse.wav"),
      api.audio.load(CUES.clear, "audio/shatter.wav"),
      api.audio.load(CUES.land, "audio/land.wav"),
      api.audio.load(CUES.flaw, "audio/flaw.wav"),
      api.audio.load(CUES.cut, "audio/cut.wav"),
      api.audio.load(CUES.levelUp, "audio/levelup.wav"),
      api.audio.load(CUES.gameOver, "audio/gameover.wav"),
      api.audio.load("music-title", "audio/title.wav"),
      api.audio.load("music-play", "audio/play.wav"),
      ...Array.from({ length: MAX_MULTIPLIER }, (_, i) =>
        api.audio.load(`chain-${i + 1}`, `audio/chain-${i + 1}.wav`),
      ),
    ].map((p) => p.catch(() => undefined));
    const fxLoads = [
      "fx/clear-burst.json",
      "fx/flawed-detonation.json",
      "fx/cut-flash.json",
      "fx/cut-aura.json",
    ].map((p) => api.assets.load(p).catch(() => undefined));
    const [assets] = await Promise.all([
      loadAssets(api),
      ...audioLoads,
      ...fxLoads,
    ]);
    registerDiagnostics(api);
    const state = initialState(assets, false);
    return [state, makeDebug(assets)];
  },

  update(
    state: DeepReadonly<FacetState>,
    api: UpdateApi,
    dt: number,
  ): FacetState {
    let next: FacetState = {
      ...clone(state),
      simTime: state.simTime + dt,
      pointer: api.input.pointer(),
      muted: api.audio.muted(),
      activeFx: (state.activeFx ?? [])
        .map((fx) => ({ ...fx, age: fx.age + dt }))
        .filter((fx) => fx.age < 0.8),
    };
    updateAudioLoops(next, api);
    if (api.input.pressed("mute")) api.audio.setMuted(!api.audio.muted());

    if (api.input.pressed("up") && menuLength(next.screen)) {
      const n = menuLength(next.screen);
      next = { ...next, menuIndex: (next.menuIndex + n - 1) % n };
    }
    if (api.input.pressed("down") && menuLength(next.screen)) {
      const n = menuLength(next.screen);
      next = { ...next, menuIndex: (next.menuIndex + 1) % n };
    }
    if (api.input.pressed("confirm")) next = takeMenu(next);
    if (api.input.pressed("pause")) {
      if (next.screen === "playing")
        next = { ...next, screen: "paused", menuIndex: 0, armedTarget: null };
      else if (next.screen === "paused")
        next = { ...next, screen: "playing", menuIndex: 0, armedTarget: null };
    }
    if (api.input.pressed("back")) {
      if (next.screen === "howto")
        next = { ...next, screen: "title", menuIndex: 1, armedTarget: null };
      else if (next.screen === "gameover")
        next = { ...next, screen: "title", menuIndex: 0, armedTarget: null };
    }

    for (const sample of api.input.pointerSamples().filter((s) => s.primary)) {
      if (sample.type === "down") {
        const before = next.selection;
        next = pointerDownState(
          next,
          sample.x,
          sample.y,
          sample.device as EnginePointerDevice,
        );
        if (!before && next.selection) playOnce(api, CUES.select);
      } else if (sample.type === "move") {
        next = pointerMoveState(
          next,
          sample.x,
          sample.y,
          sample.device as EnginePointerDevice,
        );
      } else {
        const phaseBefore = next.phase;
        next = pointerUpState(next, sample.device as EnginePointerDevice);
        if (phaseBefore !== "swapping" && next.phase === "swapping")
          playOnce(api, CUES.swap);
        if (next.refusal?.timer === 0) playOnce(api, CUES.refuse);
      }
    }

    if (next.screen !== "playing") return { ...next, muted: api.audio.muted() };

    if (next.refusal) {
      const timer = next.refusal.timer + dt;
      next = {
        ...next,
        refusal: timer >= REFUSAL_SECONDS ? null : { ...next.refusal, timer },
      };
    }

    if (next.phase === "swapping") {
      const swapTimer = next.swapTimer + dt;
      if (swapTimer >= SWAP_SECONDS) {
        next = {
          ...next,
          phase: "resolving",
          chainStep: 1,
          swapTimer: 0,
          stepTimer: 0,
        };
        next = resolveStep(next);
        playOnce(api, CUES.clear);
        playOnce(api, `chain-${Math.min(next.chainStep, MAX_MULTIPLIER)}`);
        if (
          next.lastCleared > 0 &&
          next.waveCells?.some((c) => c.strain >= MAX_STRAIN)
        )
          playOnce(api, CUES.flaw);
        if (next.waveCells && next.waveCells.length !== next.lastCleared)
          playOnce(api, CUES.cut);
      } else {
        next = { ...next, swapTimer };
      }
    } else if (next.phase === "resolving") {
      const stepTimer = next.stepTimer + dt;
      const landAt =
        next.lastWaves * WAVE_SECONDS +
        lastFall(next.board) * FALL_SECONDS_PER_ROW;
      if (
        next.stepTimer < landAt &&
        stepTimer >= landAt &&
        lastFall(next.board) > LAND_MIN_ROWS
      )
        playOnce(api, CUES.land);
      if (stepTimer >= stepHold(next)) {
        const maybe = { ...next, stepTimer: 0, chainStep: next.chainStep + 1 };
        const seeded = seedClear(maybe.board, null, null, maybe.chainStep).seed;
        if (seeded.size > 0) {
          next = resolveStep(maybe);
          playOnce(api, CUES.clear);
          playOnce(api, `chain-${Math.min(next.chainStep, MAX_MULTIPLIER)}`);
        } else {
          next = settleAfterChain(next);
          if (next.screen === "levelclear") playOnce(api, CUES.levelUp);
          if (next.screen === "gameover") playOnce(api, CUES.gameOver);
        }
      } else {
        next = { ...next, stepTimer };
      }
    }
    return { ...next, muted: api.audio.muted() };
  },

  render(state: DeepReadonly<FacetState>, api: RenderApi): void {
    const ctx = api.ctx;
    drawBackground(ctx);
    if (state.board.cols === GRID_COLS) drawBoard(ctx, state);
    drawHud(ctx, state);
    if (state.screen === "title") drawTitle(ctx, state);
    if (state.screen === "howto") drawHowTo(ctx);
    if (state.screen === "paused")
      drawOverlayMenu(ctx, state, PAUSED_TITLE_TEXT, PAUSED_ITEMS);
    if (state.screen === "levelclear") drawLevelClear(ctx, state);
    if (state.screen === "gameover") drawGameOver(ctx, state);
  },
};

function drawBackground(ctx: CanvasRenderingContext2D): void {
  const grad = ctx.createLinearGradient(0, 0, STAGE_W, STAGE_H);
  grad.addColorStop(0, "#100d16");
  grad.addColorStop(0.55, "#1b1722");
  grad.addColorStop(1, "#0b1115");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, STAGE_W, STAGE_H);
  ctx.strokeStyle = "rgba(255,255,255,.05)";
  for (let x = 20; x < STAGE_W; x += 36) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x - 240, STAGE_H);
    ctx.stroke();
  }
}

function gemImage(
  state: DeepReadonly<FacetState>,
  gem: DeepReadonly<GemState>,
): CanvasImageSource | undefined {
  const key =
    gem.cut === "prism"
      ? `gems/prism-${gem.strain}.png`
      : `gems/${gem.kind}-${gem.strain}.png`;
  return state.assets?.images[key] as CanvasImageSource | undefined;
}

function drawBoard(
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<FacetState>,
): void {
  ctx.save();
  ctx.fillStyle = "rgba(9,8,12,.78)";
  roundRect(ctx, 338, 94, 604, 604, 20);
  ctx.fill();
  ctx.strokeStyle = "#8e7d57";
  ctx.lineWidth = 4;
  ctx.stroke();
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      ctx.fillStyle =
        (row + col) % 2 ? "rgba(255,255,255,.035)" : "rgba(0,0,0,.12)";
      ctx.fillRect(cellX(col) - 34, cellY(row) - 34, 68, 68);
    }
  }
  for (const gem of state.board.cells)
    drawGemAt(ctx, state, gem, displayX(state, gem), displayY(state, gem));
  for (const fx of state.activeFx ?? []) drawFx(ctx, fx);
  drawMarks(ctx, state);
  ctx.restore();
}

function displayX(
  state: DeepReadonly<FacetState>,
  gem: DeepReadonly<GemState>,
): number {
  if (state.phase === "swapping" && state.swapA && state.swapB) {
    const t = Math.min(1, state.swapTimer / SWAP_SECONDS);
    if (gem.col === state.swapA.col && gem.row === state.swapA.row)
      return (
        cellX(state.swapB.col) +
        (cellX(state.swapA.col) - cellX(state.swapB.col)) * t
      );
    if (gem.col === state.swapB.col && gem.row === state.swapB.row)
      return (
        cellX(state.swapA.col) +
        (cellX(state.swapB.col) - cellX(state.swapA.col)) * t
      );
  }
  if (state.offer && state.selection) {
    if (gem.col === state.selection.col && gem.row === state.selection.row)
      return cellX(state.offer.col);
    if (gem.col === state.offer.col && gem.row === state.offer.row)
      return cellX(state.selection.col);
  }
  return cellX(gem.col);
}

function displayY(
  state: DeepReadonly<FacetState>,
  gem: DeepReadonly<GemState>,
): number {
  if (state.phase === "swapping" && state.swapA && state.swapB) {
    const t = Math.min(1, state.swapTimer / SWAP_SECONDS);
    if (gem.col === state.swapA.col && gem.row === state.swapA.row)
      return (
        cellY(state.swapB.row) +
        (cellY(state.swapA.row) - cellY(state.swapB.row)) * t
      );
    if (gem.col === state.swapB.col && gem.row === state.swapB.row)
      return (
        cellY(state.swapA.row) +
        (cellY(state.swapB.row) - cellY(state.swapA.row)) * t
      );
  }
  if (state.offer && state.selection) {
    if (gem.col === state.selection.col && gem.row === state.selection.row)
      return cellY(state.offer.row);
    if (gem.col === state.offer.col && gem.row === state.offer.row)
      return cellY(state.selection.row);
  }
  if (gem.fell > 0) {
    const fallStart = state.lastWaves * WAVE_SECONDS;
    const progress =
      state.phase === "resolving"
        ? Math.max(
            0,
            Math.min(
              1,
              (state.stepTimer - fallStart) /
                Math.max(0.01, gem.fell * FALL_SECONDS_PER_ROW),
            ),
          )
        : 1;
    return (
      cellY(gem.row - gem.fell) +
      (cellY(gem.row) - cellY(gem.row - gem.fell)) * easeOut(progress)
    );
  }
  return cellY(gem.row);
}

function drawGemAt(
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<FacetState>,
  gem: DeepReadonly<GemState>,
  x: number,
  y: number,
): void {
  const image = gemImage(state, gem);
  if (image) ctx.drawImage(image, x - 32, y - 32, 64, 64);
  if (!image) {
    ctx.fillStyle = gem.kind ? "#6ee7ff" : "#ffffff";
    ctx.beginPath();
    ctx.arc(x, y, GEM_R, 0, Math.PI * 2);
    ctx.fill();
  }
  const t = state.simTime;
  if (gem.cut === "brilliant" || gem.cut === "star" || gem.cut === "prism") {
    ctx.save();
    ctx.globalAlpha = 0.35 + Math.sin(t * 6 + gem.col) * 0.12;
    ctx.strokeStyle = gem.cut === "star" ? "#fff6a5" : "#9ffcff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 34 + Math.sin(t * 4) * 2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
  const overlay = (
    gem.cut === "brilliant"
      ? state.assets?.images["gems/brilliant.png"]
      : gem.cut === "star"
        ? state.assets?.images["gems/star.png"]
        : undefined
  ) as CanvasImageSource | undefined;
  if (overlay) ctx.drawImage(overlay, x - 32, y - 32, 64, 64);
}

function drawMarks(
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<FacetState>,
): void {
  if (state.selection) {
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 4;
    ctx.strokeRect(
      cellX(state.selection.col) - 38,
      cellY(state.selection.row) - 38,
      76,
      76,
    );
  }
  if (state.refusal) {
    ctx.strokeStyle = "#ff4d6a";
    ctx.lineWidth = 5;
    for (const c of [state.refusal.a, state.refusal.b]) {
      ctx.beginPath();
      ctx.moveTo(cellX(c.col) - 28, cellY(c.row) - 28);
      ctx.lineTo(cellX(c.col) + 28, cellY(c.row) + 28);
      ctx.moveTo(cellX(c.col) + 28, cellY(c.row) - 28);
      ctx.lineTo(cellX(c.col) - 28, cellY(c.row) + 28);
      ctx.stroke();
    }
  }
}

function drawFx(
  ctx: CanvasRenderingContext2D,
  fx: DeepReadonly<FxState>,
): void {
  if (fx.age < 0) return;
  const p = Math.min(1, fx.age / 0.6);
  const x = cellX(fx.col);
  const y = cellY(fx.row);
  const radius = (fx.kind === "flawed" ? 58 : 38) * easeOut(p);
  const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
  grad.addColorStop(
    0,
    fx.kind === "cut" ? "rgba(255,249,170,.85)" : "rgba(174,238,255,.7)",
  );
  grad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
}

function drawHud(
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<FacetState>,
): void {
  if (state.screen !== "playing") return;
  text(ctx, `${HUD_SCORE_LABEL} ${state.score}`, 64, 60, 28, "#f7ecda", "left");
  text(ctx, `${HUD_LEVEL_LABEL} ${state.level}`, 64, 98, 22, "#d5c8b5", "left");
  ctx.fillStyle = "rgba(255,255,255,.14)";
  ctx.fillRect(245, 50, 520, 18);
  ctx.fillStyle = "#77e7ff";
  ctx.fillRect(
    245,
    50,
    520 * Math.min(1, state.levelScore / (state.level * LEVEL_TARGET_STEP)),
    18,
  );
  if (state.phase === "resolving")
    text(
      ctx,
      `${HUD_CHAIN_LABEL} x${Math.min(state.chainStep, MAX_MULTIPLIER)}`,
      810,
      66,
      28,
      "#fff6a5",
      "left",
    );
  drawButton(ctx, targetsFor("playing")[0], PAUSE_LABEL, false);
}

function drawTitle(
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<FacetState>,
): void {
  text(ctx, TITLE_TEXT, STAGE_CX, 190, 96, "#f7ecda", "center");
  text(ctx, TAGLINE_TEXT, STAGE_CX, 270, 26, "#9ffcff", "center");
  TITLE_ITEMS.forEach((item, i) =>
    drawButton(ctx, targetsFor("title")[i], item, state.menuIndex === i),
  );
}

function drawHowTo(ctx: CanvasRenderingContext2D): void {
  text(ctx, "HOW TO PLAY", STAGE_CX, 72, 42, "#f7ecda", "center");
  const lines = [
    "Take hold of a gem, carry it onto a neighbor, and let go to swap.",
    "Three or more of one kind shatter. A move that clears nothing is refused.",
    "Gems beside a clear take strain. A flawed gem breaks with any clear touching it and scores double.",
    "Four makes a brilliant, five makes a prism, and crossing lines make a star.",
    "Brilliants burst around themselves, stars cut a row and column, and prisms take a whole kind.",
    "Falling gems can chain again. Each chain step raises the multiplier.",
    "Reach the level target to advance. A round ends when no clearing swap remains.",
    "Pointer plays the board. Menus use pointer, arrows, Enter, Space, Escape, P, and M.",
  ];
  lines.forEach((line, i) =>
    text(ctx, line, STAGE_CX, 150 + i * 44, 22, "#ded6cb", "center"),
  );
  drawButton(ctx, targetsFor("howto")[0], BACK_LABEL, false);
}

function drawOverlayMenu(
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<FacetState>,
  title: string,
  items: readonly string[],
): void {
  ctx.fillStyle = "rgba(10,8,12,.72)";
  ctx.fillRect(0, 0, STAGE_W, STAGE_H);
  text(ctx, title, STAGE_CX, 265, 56, "#f7ecda", "center");
  const targets = targetsFor(state.screen);
  items.forEach((item, i) =>
    drawButton(ctx, targets[i], item, state.menuIndex === i),
  );
}

function drawLevelClear(
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<FacetState>,
): void {
  drawOverlayMenu(ctx, state, LEVELCLEAR_TITLE_TEXT, LEVELCLEAR_ITEMS);
  text(
    ctx,
    `${BEST_CHAIN_LABEL}: ${state.bestChain}`,
    STAGE_CX,
    380,
    24,
    "#9ffcff",
    "center",
  );
  text(
    ctx,
    `${BEST_MOVE_LABEL}: ${state.bestMove}`,
    STAGE_CX,
    414,
    24,
    "#fff6a5",
    "center",
  );
}

function drawGameOver(
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<FacetState>,
): void {
  drawOverlayMenu(ctx, state, GAMEOVER_TITLE_TEXT, GAMEOVER_ITEMS);
  text(
    ctx,
    `SCORE ${state.score}  LEVEL ${state.level}`,
    STAGE_CX,
    384,
    24,
    "#d8f6ff",
    "center",
  );
}

function drawButton(
  ctx: CanvasRenderingContext2D,
  target: Target | undefined,
  label: string,
  selected: boolean,
): void {
  if (!target) return;
  ctx.fillStyle = selected ? "#f7ecda" : "rgba(255,255,255,.08)";
  ctx.strokeStyle = selected ? "#9ffcff" : "rgba(255,255,255,.22)";
  ctx.lineWidth = 3;
  roundRect(ctx, target.x, target.y, target.w, target.h, 8);
  ctx.fill();
  ctx.stroke();
  text(
    ctx,
    label,
    target.x + target.w / 2,
    target.y + target.h / 2 + 9,
    24,
    selected ? "#111018" : "#f7ecda",
    "center",
  );
}

function text(
  ctx: CanvasRenderingContext2D,
  value: string,
  x: number,
  y: number,
  size: number,
  color: string,
  align: CanvasTextAlign,
): void {
  ctx.fillStyle = color;
  ctx.font = `700 ${size}px system-ui, Segoe UI, sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.fillText(value, x, y);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function easeOut(t: number): number {
  return 1 - (1 - t) * (1 - t);
}
