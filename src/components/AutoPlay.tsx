import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import GameHistory from "./GameHistory";
import Select from "./shared/Select";
import Input from "./shared/Input";
import { type Strategy } from "../hooks/useMontyHall";
import { useMontyHallContext } from "../context/MontyHallContext";

const AutoPlay = () => {
  const { runAutoGames } = useMontyHallContext();
  const [count, setCount] = useState(1000);
  const [strategy, setStrategy] = useState<Strategy>("random");
  const [runId, setRunId] = useState(0);

  return (
    <section className="autoplay">
      <h2>Symulacja automatyczna</h2>
      <p className="autoplay__desc">
        Rozegraj wiele partii automatycznie, by zobaczyć, jak statystyki zbliżają się do wartości teoretycznych:
        <br />- 2/3 (≈ 66.7%) przy zamianie pierwotnego wyboru,
        <br />- 1/3 (≈ 33.3%) przy pozostaniu przy pierwotnym wyborze.
      </p>

      <div className="autoplay__controls">
        <Input
          className="autoplay__input"
          label="Liczba gier"
          type="number"
          min={1}
          max={10_000}
          value={count}
          onChange={(e) => setCount(Math.max(1, Math.min(10_000, Number(e.target.value))))}
        />

        <Select
          className="autoplay__select"
          label="Strategia"
          options={[
            { label: "Losowo 50/50", value: "random" },
            { label: "Zawsze zmieniaj", value: "switch" },
            { label: "Zawsze pozostań", value: "stay" },
          ]}
          value={strategy}
          onChange={(e) => setStrategy(e.target.value as Strategy)}
        />

        <div className="autoplay__presets">
          {[10, 100, 1000, 10_000].map((n) => (
            <button key={n} className={`btn btn--sm${n === count ? " btn--pressed" : ""}`} onClick={() => setCount(n)}>
              {n.toLocaleString()}
            </button>
          ))}
        </div>
      </div>
      <div className="autoplay__start">
        <button
          className="btn"
          onClick={() => {
            runAutoGames(count, strategy);
            setRunId((id) => id + 1);
          }}
        >
          <FontAwesomeIcon icon={faCaretRight} size="lg" />
          Uruchom symulację
        </button>
      </div>

      <GameHistory resetToken={runId} />
    </section>
  );
};

export default AutoPlay;
