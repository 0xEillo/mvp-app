import { Button } from "antd";
import styles from "../styles/Candidates.module.css";

import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { GOVERNANCE_ABI } from "../constants";

const GOVERNANCE_ADDRESS = "0xefBBA49F5FE544ecc2e352bD3C44c0cF1eCAFD65";

export function Candidates(data) {
  const [connected, setConnected] = useState(false);
  const [weight, setWeight] = useState(1);
  const [votesRemaining, setVotesRemaining] = useState(1);
  const { data: account } = useAccount();

  useEffect(() => {
    if (account) {
      setConnected(true);
      _getvotesRemaining().then((res) => {
        console.log(res);
        if (res == true) {
          setVotesRemaining(0);
        }
      });
    } else {
      setVotesRemaining(0);
    }
  });

  const vote = (id, weight) => {
    _vote(id, weight);
    setVotesRemaining(0);
  };

  let candidates = data.candidates.candidates;

  return (
    <div>
      <h3 className={styles.votesRemaining}>
        Votes Remaining: {votesRemaining}
      </h3>

      <div className={styles.section}>
        <div className={styles.titles}>
          <div className={styles.stat}>
            <div className={styles.title}>Name</div>
            <div className={styles.hidden}>{candidates[0].name}</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.title}>Age</div>
            <div className={styles.hidden}>{candidates[0].age}</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.title}>Cult</div>
            <div className={styles.hidden}>{candidates[0].cult}</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.title}>Vote</div>
            <div className={styles.hidden}>
              <div className={styles.vote}>
                <input
                  id="weight"
                  type="number"
                  placeholder="weight"
                  className={styles.input}
                />
                <Button>vote</Button>
              </div>
            </div>
          </div>
        </div>

        {candidates.map((element, i) => (
          <div className={styles.candidates} key={i + 1}>
            <div className={styles.stat}>{element.name}</div>
            <div className={styles.stat}>{element.age}</div>
            <div className={styles.stat}>{element.cult}</div>
            <div className={styles.stat}>
              <div className={styles.vote}>
                <input
                  id="weight"
                  type="number"
                  placeholder="weight"
                  className={styles.input}
                  onChange={(event) => setWeight(event.target.value)}
                />
                <Button
                  className={styles.darkButton}
                  onClick={() => {
                    if (connected) {
                      vote(i + 1, weight);
                    }
                  }}
                >
                  vote
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

async function _vote(id, weight) {
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  // Prompt user for account connections
  await provider.send("eth_requestAccounts", []);
  const VotesGovernorContract = new ethers.Contract(
    GOVERNANCE_ADDRESS,
    GOVERNANCE_ABI,
    provider
  );
  const signer = provider.getSigner();
  try {
    const tx = await VotesGovernorContract.connect(signer).vote(id, weight);
    console.log(tx);
  } catch (e) {
    console.log(e);
    try {
      const tx = await VotesGovernorContract.connect(signer).vote(id, weight, {
        gasPrice: ethers.utils.parseEther("0.000000001"),
        gasLimit: 100000,
      });
      console.log(tx);
    } catch (e) {}
  }
}

async function _getvotesRemaining() {
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  // Prompt user for account connections
  await provider.send("eth_requestAccounts", []);
  const VotesGovernorContract = new ethers.Contract(
    GOVERNANCE_ADDRESS,
    GOVERNANCE_ABI,
    provider
  );
  const signer = provider.getSigner();
  const signerAddress = await signer.getAddress();
  try {
    const tx = await VotesGovernorContract.connect(signer).hasVoted(
      signerAddress
    );
    return tx;
  } catch (e) {
    console.log(e);
  }
}
