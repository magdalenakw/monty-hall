import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useMontyHall, hostReveal, getOtherDoor, type Door } from "./useMontyHall";
import { GAME_PHASE } from "../consts";

describe("getOtherDoor", () => {
  it("returns third door (0,1) => 2", () => expect(getOtherDoor(0, 1)).toBe(2));
  it("returns third door (0,2) => 1", () => expect(getOtherDoor(0, 2)).toBe(1));
  it("returns third door (1,2) => 0", () => expect(getOtherDoor(1, 2)).toBe(0));
  it("result is symmetric", () => expect(getOtherDoor(2, 0)).toBe(getOtherDoor(0, 2)));
});

describe("hostReveal", () => {
  const allDoors = [0, 1, 2] as Door[];

  it("never reveals the prize door", () => {
    for (const prize of allDoors) {
      for (const selected of allDoors) {
        expect(hostReveal(prize, selected)).not.toBe(prize);
      }
    }
  });

  it("never reveals the player's selected door", () => {
    for (const prize of allDoors) {
      for (const selected of allDoors) {
        expect(hostReveal(prize, selected)).not.toBe(selected);
      }
    }
  });

  it("when only one option exists, always returns it", () => {
    expect(hostReveal(0, 1)).toBe(2);
    expect(hostReveal(1, 2)).toBe(0);
    expect(hostReveal(2, 0)).toBe(1);
  });
});

describe("useMontyHall — game phases", () => {
  it("starts in SELECTING phase", () => {
    const { result } = renderHook(() => useMontyHall());
    expect(result.current.phase).toBe(GAME_PHASE.SELECTING);
  });

  it("selectDoor transitions to DECIDING phase", () => {
    const { result } = renderHook(() => useMontyHall());
    act(() => {
      result.current.selectDoor(0);
    });
    expect(result.current.phase).toBe(GAME_PHASE.DECIDING);
  });

  it("decide() transitions to RESULT phase", () => {
    const { result } = renderHook(() => useMontyHall());
    act(() => {
      result.current.selectDoor(0);
    });
    act(() => {
      result.current.decide(false);
    });
    expect(result.current.phase).toBe(GAME_PHASE.RESULT);
  });

  it("resetGame returns to SELECTING and clears state", () => {
    const { result } = renderHook(() => useMontyHall());
    act(() => {
      result.current.selectDoor(1);
    });
    act(() => {
      result.current.resetGame();
    });
    expect(result.current.phase).toBe(GAME_PHASE.SELECTING);
    expect(result.current.selectedDoor).toBeNull();
    expect(result.current.prizeDoor).toBeNull();
  });
});

describe("useMontyHall - decide", () => {
  it("decide(false) — finalDoor equals selectedDoor (no switch)", () => {
    const { result } = renderHook(() => useMontyHall());
    act(() => {
      result.current.selectDoor(0);
    });
    const selected = result.current.selectedDoor;
    act(() => {
      result.current.decide(false);
    });
    expect(result.current.finalDoor).toBe(selected);
  });

  it("decide(true) — finalDoor differs from selectedDoor and revealedDoor", () => {
    const { result } = renderHook(() => useMontyHall());
    act(() => {
      result.current.selectDoor(0);
    });
    const selected = result.current.selectedDoor;
    const revealed = result.current.revealedDoor;
    act(() => {
      result.current.decide(true);
    });
    expect(result.current.finalDoor).not.toBe(selected);
    expect(result.current.finalDoor).not.toBe(revealed);
  });

  it("decide() updates stats", () => {
    const { result } = renderHook(() => useMontyHall());
    act(() => {
      result.current.selectDoor(0);
    });
    act(() => {
      result.current.decide(false);
    });
    const { stayWins, stayLosses } = result.current.stats;
    expect(stayWins + stayLosses).toBe(1);
  });

  it("decide() adds an entry to history", () => {
    const { result } = renderHook(() => useMontyHall());
    act(() => {
      result.current.selectDoor(2);
    });
    act(() => {
      result.current.decide(true);
    });
    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0].doSwitch).toBe(true);
  });
});

describe("useMontyHall — autoplay", () => {
  it("history does not exceed 10 000 entries", () => {
    const { result } = renderHook(() => useMontyHall());
    act(() => {
      result.current.runAutoGames(10_001, "random");
    });
    expect(result.current.history.length).toBe(10_000);
  });

  it("resetStats clears stats and history", () => {
    const { result } = renderHook(() => useMontyHall());
    act(() => {
      result.current.runAutoGames(50, "switch");
    });
    act(() => {
      result.current.resetStats();
    });
    expect(result.current.stats.switchWins).toBe(0);
    expect(result.current.history).toHaveLength(0);
  });
});
