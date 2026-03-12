import { useState } from "react";
import { HISTORIC_DATA_PAGE_SIZE } from "../consts";
import { useMontyHallContext } from "../context/useMontyHallContext";
import GameHistoryRow from "./GameHistoryRow";
import GameHistoryPagination from "./GameHistoryPagination";

type Props = {
  resetToken?: number;
};

const GameHistory = ({ resetToken }: Props) => {
  const { history } = useMontyHallContext();
  const [page, setPage] = useState(1);
  const [prevResetToken, setPrevResetToken] = useState(resetToken);

  if (resetToken !== prevResetToken) {
    setPrevResetToken(resetToken);
    setPage(1);
  }

  const hasData = history.length > 0;
  const totalPages = hasData ? Math.ceil(history.length / HISTORIC_DATA_PAGE_SIZE) : 1;
  const visibleHistory = history.slice((page - 1) * HISTORIC_DATA_PAGE_SIZE, page * HISTORIC_DATA_PAGE_SIZE);
  const paginationProps = { page, setPage, totalPages, total: history.length };

  return (
    <div className="history-panel">
      <div className="history-panel__header">
        <span className="history-panel__title">Historia rozgrywek (ostatnich {history.length} partii)</span>
      </div>
      <div className="history-panel__body">
        <div className="history-panel__table-wrap">
          <table className="history-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Pierwotny wybór</th>
                <th>Ujawniona bramka</th>
                <th>Strategia</th>
                <th>Ostateczny wybór</th>
                <th>Położenie nagrody</th>
                <th>Wynik</th>
                <th>Tryb automatyczny</th>
              </tr>
            </thead>
            <tbody>
              {hasData ? (
                visibleHistory.map((entry) => <GameHistoryRow key={entry.id} entry={entry} />)
              ) : (
                <tr>
                  <td className="history-cell history-cell--empty" colSpan={8}>
                    Brak danych do wyświetlenia
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {hasData && <GameHistoryPagination {...paginationProps} />}
      </div>
    </div>
  );
};

export default GameHistory;
