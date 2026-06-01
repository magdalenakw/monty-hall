import { useState } from "react";
import GameView from "./views/GameView";
import AlreadyPlayedView from "./views/AlreadyPlayedView";
import TrainingView from "./views/TrainingView";
import { RESULT_KEY } from "./consts";
import "./App.css";

const getIsGameView = () => {
  const hash = window.location.hash.slice(1);

  return hash === "game";
};

const App = () => {
  const [isGameView, setIsGameView] = useState(getIsGameView);
  const [alreadyPlayed] = useState(() => Boolean(localStorage.getItem(RESULT_KEY)));

  const goToTraining = () => {
    history.replaceState(null, "", window.location.pathname);
    setIsGameView(false);
  };

  if (isGameView) {
    if (alreadyPlayed) {
      return <AlreadyPlayedView onGoToTraining={goToTraining} />;
    }

    return <GameView onGoToTraining={goToTraining} />;
  }

  return <TrainingView />;
};

export default App;
