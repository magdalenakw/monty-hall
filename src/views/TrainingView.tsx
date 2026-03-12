import { useMontyHall } from "../hooks/useMontyHall";
import { MontyHallProvider } from "../context/MontyHallContext";
import Game from "../components/Game";
import Statistics from "../components/Statistics";
import AutoPlay from "../components/AutoPlay";
import Layout from "../components/shared/Layout";

const TrainingView = () => {
  const montyHall = useMontyHall();

  return (
    <MontyHallProvider value={montyHall}>
      <Layout
        headerSlot={
          <p className="app-header__rules">
            Uczestnik ma do wyboru trzy bramki. W jednej znajduje się nagroda. Uczestnik typuje bramkę. Prowadzący, który
            zna lokalizację nagrody, otwiera jedną z pozostałych (niewytypowanych przez uczestnika) bramek, zawsze pustą,
            a następnie proponuje uczestnikowi zmianę pierwotnego wyboru. Czy warto zmienić swój pierwotny wybór?
            Przekonaj się sam!
          </p>
        }
        footer="Problem Monty'ego Halla"
      >
        <Game />
        <Statistics />
        <AutoPlay />
      </Layout>
    </MontyHallProvider>
  );
};

export default TrainingView;
