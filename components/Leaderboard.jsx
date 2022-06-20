import { useState } from "react";
import styles from "../styles/Leaderboard.module.css";
import { ethers } from "ethers";
import { GOVERNANCE_ABI } from "../constants";

const GOVERNANCE_ADDRESS = "0xae3aF753cDbD3f1611337317C851dB59de97cD4E";

export const Leaderboard = () => {
  const [topCandidates, setTopCandidates] = useState([]);
  const getTopCandidates = () => {
    _getTopCandidates().then((response) => {
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

async function _getTopCandidates() {
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
