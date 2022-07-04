import { useState } from "react";
import styles from "../styles/Leaderboard.module.css";
import { ethers } from "ethers";
import { GOVERNANCE_ABI } from "../constants";
import { Button } from "antd";

const GOVERNANCE_ADDRESS = "0xb9d1Be379529bd38F011B9d49dC64111fBab7Fa9";

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
        <Button
          type="primary"
          className={styles.lightButton}
          onClick={() => {
            getTopCandidates();
          }}
        >
          Show Leads
        </Button>
      </div>
      <div>
        <div className={styles.titles}>
          <div className={styles.stat}>
            <div className={styles.title}>Name</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.title}>Age</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.title}>Cult</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.title}>Votes</div>
          </div>
        </div>
        <div>
          {topCandidates.map((candidate, index) => (
            <div
              key={candidate?.id.toString()}
              className={styles.winningCandidate}
            >
              <div className={styles.stat}>
                <p>
                  <strong>{candidate?.name || ""}</strong>
                </p>
              </div>
              <div className={styles.stat}>
                <p>
                  <strong>{(candidate?.age).toString() || 0}</strong>
                </p>
              </div>
              <div className={styles.stat}>
                <p>
                  <strong>{candidate?.cult || ""}</strong>
                </p>
              </div>
              <div className={styles.stat}>
                <p>
                  <strong>{(candidate?.votes).toString() || 0}</strong>
                </p>
              </div>
            </div>
          ))}
        </div>
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
