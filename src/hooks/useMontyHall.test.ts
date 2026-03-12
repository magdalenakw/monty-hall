import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useMontyHall, hostReveal, getOtherDoor, type Door } from "./useMontyHall";
import { GAME_PHASE } from "../consts";

// ─── Czyste funkcje pomocnicze ────────────────────────────────────────────────

describe("getOtherDoor", () => {
  it("zwraca trzecią bramkę (0,1) → 2", () => expect(getOtherDoor(0, 1)).toBe(2));
  it("zwraca trzecią bramkę (0,2) → 1", () => expect(getOtherDoor(0, 2)).toBe(1));
  it("zwraca trzecią bramkę (1,2) → 0", () => expect(getOtherDoor(1, 2)).toBe(0));
  it("wynik jest symetryczny", () => expect(getOtherDoor(2, 0)).toBe(getOtherDoor(0, 2)));
});

describe("hostReveal", () => {
  const allDoors = [0, 1, 2] as Door[];

  it("nigdy nie otwiera bramki z nagrodą", () => {
    for (const prize of allDoors) {
      for (const selected of allDoors) {
        expect(hostReveal(prize, selected)).not.toBe(prize);
      }
    }
  });

  it("nigdy nie otwiera bramki wybranej przez gracza", () => {
    for (const prize of allDoors) {
      for (const selected of allDoors) {
        expect(hostReveal(prize, selected)).not.toBe(selected);
      }
    }
  });

  it("gdy jest tylko jedna opcja, zawsze ją zwraca", () => {
    // prize=0, selected=1 → jedyna opcja to 2
    expect(hostReveal(0, 1)).toBe(2);
    // prize=1, selected=2 → jedyna opcja to 0
    expect(hostReveal(1, 2)).toBe(0);
    // prize=2, selected=0 → jedyna opcja to 1
    expect(hostReveal(2, 0)).toBe(1);
  });
});

// ─── Hook ─────────────────────────────────────────────────────────────────────

describe("useMontyHall — fazy gry", () => {
  it("startuje w fazie SELECTING", () => {
    const { result } = renderHook(() => useMontyHall());
    expect(result.current.phase).toBe(GAME_PHASE.SELECTING);
  });

  it("selectDoor zmienia fazę na DECIDING", () => {
    const { result } = renderHook(() => useMontyHall());
    act(() => { result.current.selectDoor(0); });
    expect(result.current.phase).toBe(GAME_PHASE.DECIDING);
  });

  it("decide() zmienia fazę na RESULT", () => {
    const { result } = renderHook(() => useMontyHall());
    act(() => { result.current.selectDoor(0); });
    act(() => { result.current.decide(false); });
    expect(result.current.phase).toBe(GAME_PHASE.RESULT);
  });

  it("resetGame wraca do SELECTING i czyści stan", () => {
    const { result } = renderHook(() => useMontyHall());
    act(() => { result.current.selectDoor(1); });
    act(() => { result.current.resetGame(); });
    expect(result.current.phase).toBe(GAME_PHASE.SELECTING);
    expect(result.current.selectedDoor).toBeNull();
    expect(result.current.prizeDoor).toBeNull();
  });
});

describe("useMontyHall — logika decyzji", () => {
  it("decide(false) — finalDoor równa się selectedDoor (brak zmiany)", () => {
    const { result } = renderHook(() => useMontyHall());
    act(() => { result.current.selectDoor(0); });
    const selected = result.current.selectedDoor;
    act(() => { result.current.decide(false); });
    expect(result.current.finalDoor).toBe(selected);
  });

  it("decide(true) — finalDoor różni się od selectedDoor i revealedDoor", () => {
    const { result } = renderHook(() => useMontyHall());
    act(() => { result.current.selectDoor(0); });
    const selected = result.current.selectedDoor;
    const revealed = result.current.revealedDoor;
    act(() => { result.current.decide(true); });
    expect(result.current.finalDoor).not.toBe(selected);
    expect(result.current.finalDoor).not.toBe(revealed);
  });

  it("decide() aktualizuje statystyki", () => {
    const { result } = renderHook(() => useMontyHall());
    act(() => { result.current.selectDoor(0); });
    act(() => { result.current.decide(false); });
    const { stayWins, stayLosses } = result.current.stats;
    expect(stayWins + stayLosses).toBe(1);
  });

  it("decide() dodaje wpis do historii", () => {
    const { result } = renderHook(() => useMontyHall());
    act(() => { result.current.selectDoor(2); });
    act(() => { result.current.decide(true); });
    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0].doSwitch).toBe(true);
  });
});

describe("useMontyHall — autoplay", () => {
  it("runAutoGames(100, 'switch') wygrywa ok. 2/3 gier", () => {
    const { result } = renderHook(() => useMontyHall());
    act(() => { result.current.runAutoGames(100, "switch"); });
    const { switchWins, switchLosses } = result.current.stats;
    const rate = switchWins / (switchWins + switchLosses);
    // przedział ±15pp — przy 100 grach wystarczający margines
    expect(rate).toBeGreaterThan(0.50);
    expect(rate).toBeLessThan(0.85);
  });

  it("runAutoGames(100, 'stay') wygrywa ok. 1/3 gier", () => {
    const { result } = renderHook(() => useMontyHall());
    act(() => { result.current.runAutoGames(100, "stay"); });
    const { stayWins, stayLosses } = result.current.stats;
    const rate = stayWins / (stayWins + stayLosses);
    expect(rate).toBeGreaterThan(0.15);
    expect(rate).toBeLessThan(0.50);
  });

  it("historia nie przekracza 10 000 wpisów", () => {
    const { result } = renderHook(() => useMontyHall());
    act(() => { result.current.runAutoGames(10_001, "random"); });
    expect(result.current.history.length).toBe(10_000);
  });

  it("resetStats czyści statystyki i historię", () => {
    const { result } = renderHook(() => useMontyHall());
    act(() => { result.current.runAutoGames(50, "switch"); });
    act(() => { result.current.resetStats(); });
    expect(result.current.stats.switchWins).toBe(0);
    expect(result.current.history).toHaveLength(0);
  });
});
