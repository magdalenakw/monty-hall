import { createContext, type ReactNode } from "react";
import { type Door, type GamePhase, type Strategy, type Stats, type HistoryEntry } from "../hooks/useMontyHall";

export type MontyHallContextValue = {
  phase: GamePhase;
  prizeDoor: Door | null;
  selectedDoor: Door | null;
  revealedDoor: Door | null;
  finalDoor: Door | null;
  stats: Stats;
  history: HistoryEntry[];
  selectDoor: (door: Door) => void;
  decide: (switchDoor: boolean) => void;
  resetGame: () => void;
  resetStats: () => void;
  runAutoGames: (count: number, strategy: Strategy) => void;
};

const MontyHallContext = createContext<MontyHallContextValue | null>(null);

export const MontyHallProvider = ({ value, children }: { value: MontyHallContextValue; children: ReactNode }) => (
  <MontyHallContext.Provider value={value}>{children}</MontyHallContext.Provider>
);

export default MontyHallContext;
