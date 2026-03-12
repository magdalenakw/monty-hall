import React from "react";
import { HISTORIC_DATA_PAGE_SIZE } from "../consts";

type Props = {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  total: number;
};

const GameHistoryPagination = ({ page, setPage, totalPages, total }: Props) => {
  const onPagePrev = () => setPage((p) => p - 1);
  const onPageNext = () => setPage((p) => p + 1);

  return (
    <div className="history-panel__pagination">
      <button className="btn btn--sm" disabled={page === 1} onClick={onPagePrev}>
        ‹
      </button>
      <span className="history-panel__page-info">
        {page}/{totalPages}
        &nbsp;·&nbsp;({(page - 1) * HISTORIC_DATA_PAGE_SIZE + 1}–{Math.min(page * HISTORIC_DATA_PAGE_SIZE, total)})
      </span>
      <button className="btn btn--sm" disabled={page === totalPages} onClick={onPageNext}>
        ›
      </button>
    </div>
  );
};

export default GameHistoryPagination;
