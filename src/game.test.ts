import { describe, expect, it } from "vitest";
import { game } from "./game";
import type { FacetDebugApi, FacetState } from "./game";

async function debugOnly(): Promise<[FacetState, FacetDebugApi]> {
  const input = { register: () => undefined, layout: () => null };
  const audio = {
    define: () => undefined,
    load: () => Promise.resolve(),
  };
  const assets = {
    loadImage: () => Promise.reject(new Error("no image decoder")),
    loadAudio: () => Promise.reject(new Error("no audio decoder")),
    load: () => Promise.resolve(new Blob()),
    resolve: (path: string) => `assets/${path}`,
  };
  const diagnostics = { register: () => undefined };
  const events = { on: () => () => undefined };
  return await game.initialize({
    input,
    audio,
    assets,
    diagnostics,
    events,
    viewport: () => ({
      width: 1280,
      height: 720,
      scale: 1,
      offsetX: 0,
      offsetY: 0,
    }),
  });
}

describe("Facet debug surface", () => {
  it("loads notation and reports derived snapshot fields", async () => {
    const [state, debug] = await debugOnly();
    const posed = debug.loadBoard(state, [
      "R0 A0 C0 J0 B0 S0 M0 R0",
      "C0 J0 B0 S0 M0 R0 A0 C0",
      "B0 S0 M0 R0 A0 C0 J0 B0",
      "M0 R0 A0 C0 J0 B0 S0 M0",
      "A0 C0 J0 B0 S0 M0 R0 A0",
      "J0 B0 S0 M0 R0 A0 C0 J0",
      "S0 M0 R0 A0 X0 J0 B0 S0",
      "R0 A0 C0 J0 B0 S0 M0 R0",
    ]);
    const snap = debug.snapshot(posed);
    expect(snap.board.cells).toHaveLength(64);
    expect(snap.board.cells[0]).toMatchObject({ kind: "ruby", x: 388, y: 144 });
    expect(snap.board.cells[52]).toMatchObject({ kind: null, cut: "prism" });
  });

  it("accepts a productive swap and refuses an unproductive one", async () => {
    const [state, debug] = await debugOnly();
    const board = debug.loadBoard(state, [
      "R0 A0 R0 J0 B0 S0 M0 A0",
      "A0 R0 C0 S0 M0 A0 C0 J0",
      "B0 S0 M0 C0 A0 C0 J0 B0",
      "M0 C0 A0 R0 J0 B0 S0 M0",
      "A0 C0 J0 B0 S0 M0 R0 A0",
      "J0 B0 S0 M0 R0 A0 C0 J0",
      "S0 M0 R0 A0 C0 J0 B0 S0",
      "R0 A0 C0 J0 B0 S0 M0 R0",
    ]);
    const accepted = debug.requestSwap(board, 1, 0, 1, 1);
    expect(accepted.phase).toBe("swapping");
    const refused = debug.requestSwap(board, 6, 0, 7, 0);
    expect(refused.phase).toBe("idle");
    expect(refused.refusal).toMatchObject({
      a: { col: 6, row: 0 },
      b: { col: 7, row: 0 },
    });
  });

  it("deals opening boards without immediate runs", async () => {
    const [state, debug] = await debugOnly();
    const dealt = debug.dealBoard(state);
    const snap = debug.snapshot(dealt);
    expect(snap.board.cells).toHaveLength(64);
    expect(snap.legalSwap).toBe(true);
    expect(
      snap.board.cells.every(
        (cell) => cell.cut === "plain" && cell.strain === 0,
      ),
    ).toBe(true);
  });
});
