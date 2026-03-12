import Door from "./Door";
import { GAME_PHASE } from "../consts";
import { type Door as DoorType } from "../hooks/useMontyHall";
import { useMontyHallContext } from "../context/useMontyHallContext";

type Props = {
  resetLabel?: string;
};

const DOORS = [0, 1, 2] as DoorType[];

const Game = ({ resetLabel = "Zagraj ponownie" }: Props) => {
  const { phase, prizeDoor, selectedDoor, revealedDoor, finalDoor, selectDoor, decide, resetGame } =
    useMontyHallContext();

  const getInstruction = () => {
    switch (phase) {
      case GAME_PHASE.SELECTING:
        return "Wybierz jedną z bramek!";
      case GAME_PHASE.DECIDING:
        return `Prowadzący otworzył pustą bramkę (${revealedDoor! + 1}). Czy chcesz zmienić swój pierwotny wybór?`;
      case GAME_PHASE.RESULT:
        return finalDoor === prizeDoor ? (
          <span>{`Gratulacje! W bramce ${finalDoor! + 1} była nagroda!`}</span>
        ) : (
          <span>{`Niestety, przegrałeś! Nagroda była w bramce ${prizeDoor! + 1}.`}</span>
        );
      default:
        return "";
    }
  };

  return (
    <section className="gameboard">
      <div className="gameboard__doors">
        {DOORS.map((i) => (
          <Door
            key={i}
            index={i}
            phase={phase}
            isSelected={selectedDoor === i}
            isRevealed={revealedDoor === i}
            isFinal={finalDoor === i}
            isPrize={prizeDoor === i}
            onClick={() => {
              if (phase === GAME_PHASE.SELECTING) selectDoor(i);
              else if (phase === GAME_PHASE.DECIDING && revealedDoor !== i) {
                decide(i !== selectedDoor);
              }
            }}
          />
        ))}
      </div>

      <p className="gameboard__instruction">{getInstruction()}</p>

      {phase === GAME_PHASE.DECIDING && (
        <div className="gameboard__actions">
          <button className="btn btn--stay" onClick={() => decide(false)}>
            Pozostań przy bramce {selectedDoor! + 1}
          </button>
          <button className="btn btn--switch" onClick={() => decide(true)}>
            Zmień wybór
          </button>
        </div>
      )}

      {phase === GAME_PHASE.RESULT && (
        <div className="gameboard__result-info">
          <button className="btn" onClick={resetGame}>
            {resetLabel}
          </button>
        </div>
      )}
    </section>
  );
};

export default Game;
