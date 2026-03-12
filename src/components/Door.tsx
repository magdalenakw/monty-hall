import { GAME_PHASE } from "../consts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faTrophy } from "@fortawesome/free-solid-svg-icons";
import { type Door, type GamePhase } from "../hooks/useMontyHall";

type Props = {
  index: Door;
  phase: GamePhase;
  isSelected: boolean;
  isRevealed: boolean;
  isFinal: boolean;
  isPrize: boolean;
  onClick: () => void;
};

const Door = ({ index, phase, isSelected, isRevealed, isFinal, isPrize, onClick }: Props) => {
  const isOpen = isRevealed || phase === GAME_PHASE.RESULT;

  let stateClass: string;
  if (phase === GAME_PHASE.RESULT && isFinal && isPrize) stateClass = "door--win";
  else if (phase === GAME_PHASE.RESULT && isFinal && !isPrize) stateClass = "door--lose";
  else if (phase === GAME_PHASE.RESULT) stateClass = "door--revealed";
  else if (isRevealed) stateClass = "door--revealed";
  else if (isSelected && phase === GAME_PHASE.DECIDING) stateClass = "door--selected";
  else stateClass = "door--selectable";

  const clickable = phase === GAME_PHASE.SELECTING || (phase === GAME_PHASE.DECIDING && !isRevealed);

  return (
    <div className="door__wrapper">
      <div className="door__number">{index + 1}</div>
      <div
        className={`door ${stateClass}`}
        onClick={clickable ? onClick : undefined}
        role="button"
        tabIndex={clickable ? 0 : -1}
        onKeyDown={clickable ? (e) => e.key === "Enter" && onClick() : undefined}
        aria-label={`Bramka ${index + 1}`}
        aria-pressed={isSelected}
        aria-disabled={!clickable}
      >
        <div className="door__face">
          {isPrize ? (
            <FontAwesomeIcon icon={faTrophy} className="door__icon" />
          ) : (
            <FontAwesomeIcon icon={faClose} className="door__icon door__icon--zonk" />
          )}
        </div>

        <div className={`door__curtain${isOpen ? " door__curtain--open" : ""}`}>
          <div className="door__curtain-rail"></div>
          <div className="door__curtain-left">
            <div className="door__panel"></div>
            <div className="door__panel"></div>
            <div className="door__panel"></div>
            <div className="door__panel"></div>
          </div>
          <div className="door__curtain-right">
            <div className="door__panel"></div>
            <div className="door__panel"></div>
            <div className="door__panel"></div>
            <div className="door__panel"></div>
          </div>
        </div>
      </div>

      {isSelected && phase === GAME_PHASE.DECIDING && (
        <div className="door__badge door__badge--selected">Twój wybór</div>
      )}
      {phase === GAME_PHASE.RESULT && isFinal && (
        <div className={`door__badge ${isPrize ? "door__badge--win" : "door__badge--lose"}`}>
          {isPrize ? "Wygrana!" : "Przegrana"}
        </div>
      )}
    </div>
  );
};

export default Door;
