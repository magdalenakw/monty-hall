import { useState, useCallback, useRef } from "react";
import { GAME_PHASE } from "../consts";

export type Door = 0 | 1 | 2;
export type GamePhase = (typeof GAME_PHASE)[keyof typeof GAME_PHASE];
export type Strategy = "switch" | "stay" | "random";

export type Stats = {
  switchWins: number;
  switchLosses: number;
  stayWins: number;
  stayLosses: number;
};

export type HistoryEntry = {
  id: number;
  prize: Door;
  initial: Door;
  revealed: Door;
  final: Door;
  doSwitch: boolean;
  won: boolean;
  auto: boolean;
};

const pickPrizeDoor = (): Door => {
  return Math.floor(Math.random() * 3) as Door;
};

export const getOtherDoor = (a: Door, b: Door): Door => ([0, 1, 2] as Door[]).find((d) => d !== a && d !== b)!;

export const hostReveal = (prizeDoor: Door, selectedDoor: Door): Door => {
  const available = ([0, 1, 2] as Door[]).filter((door) => door !== prizeDoor && door !== selectedDoor);

  return available[Math.floor(Math.random() * available.length)];
};

const initialStats: Stats = {
  switchWins: 0,
  switchLosses: 0,
  stayWins: 0,
  stayLosses: 0,
};

export const useMontyHall = () => {
  const [phase, setPhase] = useState<GamePhase>(GAME_PHASE.SELECTING);
  const [prizeDoor, setPrizeDoor] = useState<Door | null>(null);
  const [selectedDoor, setSelectedDoor] = useState<Door | null>(null);
  const [revealedDoor, setRevealedDoor] = useState<Door | null>(null);
  const [finalDoor, setFinalDoor] = useState<Door | null>(null);
  const [stats, setStats] = useState<Stats>(initialStats);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const nextId = useRef(1);

  const selectDoor = useCallback(
    (door: Door) => {
      if (phase !== GAME_PHASE.SELECTING) return;
      const prize = pickPrizeDoor();
      const revealed = hostReveal(prize, door);
      setPrizeDoor(prize);
      setSelectedDoor(door);
      setRevealedDoor(revealed);
      setPhase(GAME_PHASE.DECIDING);
    },
    [phase],
  );

  const decide = useCallback(
    (switchDoor: boolean) => {
      if (phase !== GAME_PHASE.DECIDING) return;
      let final: Door;
      if (switchDoor) {
        final = getOtherDoor(selectedDoor!, revealedDoor!);
      } else {
        final = selectedDoor!;
      }
      const won = final === prizeDoor;
      setFinalDoor(final);
      setPhase(GAME_PHASE.RESULT);
      setStats((prev) => ({
        ...prev,
        switchWins: switchDoor && won ? prev.switchWins + 1 : prev.switchWins,
        switchLosses: switchDoor && !won ? prev.switchLosses + 1 : prev.switchLosses,
        stayWins: !switchDoor && won ? prev.stayWins + 1 : prev.stayWins,
        stayLosses: !switchDoor && !won ? prev.stayLosses + 1 : prev.stayLosses,
      }));
      setHistory((prev) =>
        [
          {
            id: nextId.current++,
            prize: prizeDoor!,
            initial: selectedDoor!,
            revealed: revealedDoor!,
            final,
            doSwitch: switchDoor,
            won,
            auto: false,
          },
          ...prev,
        ].slice(0, 10_000),
      );
    },
    [phase, selectedDoor, revealedDoor, prizeDoor],
  );

  const resetGame = useCallback(() => {
    setPrizeDoor(null);
    setSelectedDoor(null);
    setRevealedDoor(null);
    setFinalDoor(null);
    setPhase(GAME_PHASE.SELECTING);
  }, []);

  const resetStats = useCallback(() => {
    setStats(initialStats);
    setHistory([]);
    nextId.current = 1;
  }, []);

  const runAutoGames = useCallback((count: number, strategy: Strategy) => {
    const results: HistoryEntry[] = [];
    let switchWins = 0,
      switchLosses = 0,
      stayWins = 0,
      stayLosses = 0;

    for (let i = 0; i < count; i++) {
      const prizeDoor = pickPrizeDoor();
      const initialDoor = Math.floor(Math.random() * 3) as Door;
      const revealedDoor = hostReveal(prizeDoor, initialDoor);
      let didSwitch: boolean;
      if (strategy === "switch") didSwitch = true;
      else if (strategy === "stay") didSwitch = false;
      else didSwitch = Math.random() < 0.5;

      let finalDoor: Door;
      if (didSwitch) {
        finalDoor = getOtherDoor(initialDoor, revealedDoor);
      } else {
        finalDoor = initialDoor;
      }
      const won = finalDoor === prizeDoor;

      if (didSwitch && won) switchWins++;
      else if (didSwitch && !won) switchLosses++;
      else if (!didSwitch && won) stayWins++;
      else stayLosses++;

      results.push({
        id: nextId.current++,
        prize: prizeDoor,
        initial: initialDoor,
        revealed: revealedDoor,
        final: finalDoor,
        doSwitch: didSwitch,
        won,
        auto: true,
      });
    }

    setStats((prev) => ({
      switchWins: prev.switchWins + switchWins,
      switchLosses: prev.switchLosses + switchLosses,
      stayWins: prev.stayWins + stayWins,
      stayLosses: prev.stayLosses + stayLosses,
    }));
    setHistory((prev) => [...results.reverse(), ...prev].slice(0, 10_000));
  }, []);

  return {
    phase,
    prizeDoor,
    selectedDoor,
    revealedDoor,
    finalDoor,
    stats,
    history,
    selectDoor,
    decide,
    resetGame,
    resetStats,
    runAutoGames,
  };
};
