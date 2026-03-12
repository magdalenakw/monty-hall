import { type HistoryEntry } from "../hooks/useMontyHall";

const DOOR_LABELS = ["1", "2", "3"];

type Props = {
  entry: HistoryEntry;
};

const GameHistoryRow = ({ entry }: Props) => {
  const { id, prize, initial, revealed, final, doSwitch, won, auto } = entry;

  return (
    <tr className={`history-row ${won ? "history-row--win" : "history-row--lose"}`}>
      <td className="history-cell">{id}</td>
      <td className="history-cell">{DOOR_LABELS[initial]}</td>
      <td className="history-cell">{DOOR_LABELS[revealed]}</td>
      <td className="history-cell">{doSwitch ? "zmiana" : "pozostanie"}</td>
      <td className="history-cell">{DOOR_LABELS[final]}</td>
      <td className="history-cell">{DOOR_LABELS[prize]}</td>
      <td className={`history-cell history-cell--result ${won ? "text-win" : "text-lose"}`}>{won ? "✓" : "✗"}</td>
      <td className="history-cell">{auto ? "tak" : "nie"}</td>
    </tr>
  );
};

export default GameHistoryRow;
