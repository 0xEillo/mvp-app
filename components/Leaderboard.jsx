import { useState } from "react";
import { signer, VotesGovernorContract } from "../utils";
import styles from "../styles/Leaderboard.module.css";

export const Leaderboard = () => {
  const [weight, setWeight] = useState(0);
  const [id, setId] = useState(0);
  const [topCandidates, setTopCandidates] = useState([]);
  const getTopCandidates = () => {
    _getTopCandidates(weight, id).then((response) => {
      setTopCandidates(response);
    });
  };
  return (
    <div className={styles.leaderboard}>
      <div>
        <button
          className={styles.leadsButton}
          onClick={() => {
            getTopCandidates();
          }}
        >
          Show Leads
        </button>
      </div>
      <div>
        {topCandidates.map((candidate, index) => (
          <div
            key={candidate?.id.toString()}
            className={styles.winningCandidate}
          >
            <div className={styles.stat}>
              <p>
                Name: <strong>{candidate?.name || ""}</strong>
              </p>
            </div>
            <div className={styles.stat}>
              <p>
                Age: <strong>{(candidate?.age).toString() || 0}</strong>
              </p>
            </div>
            <div className={styles.stat}>
              <p>
                Cult: <strong>{candidate?.cult || ""}</strong>
              </p>
            </div>
            <div className={styles.stat}>
              <p>
                Votes: <strong>{(candidate?.votes).toString() || 0}</strong>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

async function _getTopCandidates(weight, id) {
  let leaderboard = await VotesGovernorContract.connect(
    signer
  ).winningCandidates();
  return leaderboard;
}
