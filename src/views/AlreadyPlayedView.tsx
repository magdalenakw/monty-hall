import Layout from "../components/shared/Layout";

type Props = {
  onGoToTraining: () => void;
};

const AlreadyPlayedView = ({ onGoToTraining }: Props) => {
  return (
    <Layout>
      <div className="already-played">
        <p>Gra właściwa została już przez Ciebie rozegrana.</p>
        <button className="btn" onClick={onGoToTraining}>
          Przejdź do trybu treningowego
        </button>
      </div>
    </Layout>
  );
};

export default AlreadyPlayedView;
