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
    <div>
      <div>
        <button
          onClick={() => {
            getTopCandidates();
          }}
        >
          Top Candidates
        </button>
      </div>
      <div>
        {topCandidates.map((candidate, index) => (
          <div
            key={candidate?.id.toString()}
            className={styles.winningCandidate}
          >
            <div>
              <p> Name: {candidate?.name || ""} </p>
            </div>
            <div>
              <p> Age: {(candidate?.age).toString() || 0} </p>
            </div>
            <div>
              <p> Cult: {candidate?.cult || ""} </p>
            </div>
            <div>
              <p> Votes: {(candidate?.votes).toString() || 0} </p>
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
