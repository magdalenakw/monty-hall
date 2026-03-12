import { useContext } from "react";
import MontyHallContext from "./MontyHallContext";
import type { MontyHallContextValue } from "./MontyHallContext";

export const useMontyHallContext = (): MontyHallContextValue => {
  const ctx = useContext(MontyHallContext);
  if (!ctx) throw new Error("useMontyHallContext must be used inside MontyHallProvider");

  return ctx;
};
