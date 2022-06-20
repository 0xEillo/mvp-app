import { useState } from "react";
import styles from "../styles/Leaderboard.module.css";
import { ethers } from "ethers";
import { GOVERNANCE_ABI } from "../constants";

const GOVERNANCE_ADDRESS = "0x50594c945C0b4e48E84EBd26196bD2fBbe7A0D3f";

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
          className={styles.lightButton}
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
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  // Prompt user for account connections
  await provider.send("eth_requestAccounts", []);
  const VotesGovernorContract = new ethers.Contract(
    GOVERNANCE_ADDRESS,
    GOVERNANCE_ABI,
    provider
  );
  let leaderboard = await VotesGovernorContract.connect(
    provider
  ).winningCandidates();
  return leaderboard;
}
