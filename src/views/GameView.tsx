import { useMontyHall } from "../hooks/useMontyHall";
import { MontyHallProvider } from "../context/MontyHallContext";
import { RESULT_KEY } from "../consts";
import Game from "../components/Game";
import Layout from "../components/shared/Layout";

type Props = {
  onGoToTraining: () => void;
};

const GameView = ({ onGoToTraining }: Props) => {
  const montyHall = useMontyHall();

  const handleDecide = (switchDoor: boolean) => {
    montyHall.decide(switchDoor);
    // TODO: consider sending results to some backend (+ verify by email, not a flag in localStorage)
    localStorage.setItem(RESULT_KEY, JSON.stringify({ switched: switchDoor }));
  };

  return (
    <MontyHallProvider value={{ ...montyHall, decide: handleDecide, resetGame: onGoToTraining }}>
      <Layout>
        <Game resetLabel="Przejdź do trybu treningowego" />
      </Layout>
    </MontyHallProvider>
  );
};

export default GameView;
