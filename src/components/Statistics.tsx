import { THEORETICAL_SWITCH_WIN_RATE, THEORETICAL_STAY_WIN_RATE } from "../consts";
import { useMontyHallContext } from "../context/useMontyHallContext";

type StatRowProps = {
  label: string;
  wins: number;
  losses: number;
  theoretical: number;
};

const StatRow = ({ label, wins, losses, theoretical }: StatRowProps) => {
  const total = wins + losses;
  const winRate = total > 0 ? (wins / total) * 100 : null;

  return (
    <div className="stat-row">
      <div className="stat-row__label">{label}</div>
      <div className="stat-row__numbers">
        <span className="stat-win">{wins} wygranych</span>
        <span className="stat-sep">/</span>
        <span className="stat-loss">{losses} przegranych</span>
        <span className="stat-total">({total} gier)</span>
      </div>
      <div className="stat-row__bar-wrap">
        <div className="stat-row__bar" style={{ width: total > 0 ? `${(wins / total) * 100}%` : "0%" }} />
        <div
          className="stat-row__bar stat-row__bar--theoretical"
          style={{ left: `${theoretical}%` }}
          title={`Teoretyczne: ${theoretical}%`}
        />
      </div>
      <div className="stat-row__pct">
        {winRate !== null ? winRate.toFixed(1) : "—"}%
        <span className="stat-theoretical"> (teoret. {theoretical}%)</span>
      </div>
    </div>
  );
};

const Statistics = () => {
  const { stats, resetStats } = useMontyHallContext();
  const { switchWins, switchLosses, stayWins, stayLosses } = stats;
  const totalGames = switchWins + switchLosses + stayWins + stayLosses;

  return (
    <section className="statistics">
      <div className="statistics__header">
        <h2>Statystyki</h2>
        <button className="btn btn--danger btn--sm" onClick={resetStats} disabled={totalGames === 0}>
          Resetuj statystyki
        </button>
      </div>

      <div className="statistics__total">
        Łącznie rozegranych: <strong>{totalGames}</strong>
      </div>

      <StatRow label="Zmiana wyboru" wins={switchWins} losses={switchLosses} theoretical={THEORETICAL_SWITCH_WIN_RATE} />
      <StatRow label="Pozostanie" wins={stayWins} losses={stayLosses} theoretical={THEORETICAL_STAY_WIN_RATE} />

      <div className="statistics__note">
        <strong>Dlaczego warto zmieniać swój pierwotny wybór?</strong>
        <p>
          Typujesz jedną z trzech bramek - szansa na trafienie nagrody to 1/3. Oznacza to, że szansa, że nagroda jest
          poza wytypowaną bramką, wynosi 2/3. Przy czym prowadzący, który zna położenie nagrody, pokazuje Ci, która z
          dwóch niewytypowanych bramek jest na pewno pusta - a zatem całe 2/3 szansy skupia się odtąd na drugiej
          niewytypowanej bramce. Zmiana pierwotnego wyboru podwaja prawdopodobieństwo wygranej: podnosi je z 1/3 do 2/3.
        </p>
      </div>
    </section>
  );
};

export default Statistics;
