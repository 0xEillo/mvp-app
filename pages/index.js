import styles from "../styles/Home.module.css";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { Leaderboard } from "../components/Leaderboard";
import { signer, VotesGovernorContract, WKND } from "../utils";
import { Navbar } from "../components//Navbar";
import { useAccount } from "wagmi";

export default function Home() {
  const [connected, setConnected] = useState(false);
  const [voterAddress, setVoterAddress] = useState("0x00");
  const [tokenBalance, setTokenBalance] = useState(0);
  const [id, setId] = useState(0);
  const [weight, setWeight] = useState(0);

  const { data: account } = useAccount();
  console.log(account?.address);

  useEffect(() => {
    getTokenBalance();
    if (account) {
      setConnected(true);
      setVoterAddress(account.address);
    }
  });

  const getTokenBalance = () => {
    if (connected) {
      _getTokenBalance(voterAddress, signer, WKND)
        .then((balance) => {
          setTokenBalance(balance);
          console.log(balance);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const claimToken = () => {
    _claimToken(voterAddress, signer, WKND);
  };

  return (
    <div>
      <Navbar></Navbar>
      <div className={styles.container}>
        <div className={styles.balanceSection}>
          <div>
            <h3>Your WKND token balance: {tokenBalance}</h3>
          </div>
          <button
            className={styles.darkButton}
            onClick={() => {
              console.log(connected);
              if (connected) {
                claimToken();
              }
            }}
          >
            Claim WKND Token
          </button>
        </div>
        <div className={styles.vote}>
          <input
            id="id"
            type="number"
            placeholder="candidate-id"
            onChange={(event) => setId(event.target.value)}
          ></input>
          <input
            id="weight"
            type="number"
            placeholder="weight"
            onChange={(event) => setWeight(event.target.value)}
          ></input>
          <button
            className={styles.darkButton}
            onClick={() => {
              console.log(connected);
              if (connected) {
                _vote(voterAddress, weight, id);
              }
            }}
          >
            VOTE
          </button>
        </div>

        <Leaderboard></Leaderboard>
      </div>
    </div>
  );
}

async function _claimToken(voterAddress, signer, WKND) {
  let tx = await WKND.connect(signer).mint(voterAddress, {
    gasPrice: 100,
    gasLimit: 9000000,
  });
  console.log(tx);
}

async function _getTokenBalance(voterAddress, signer, WKND) {
  let tx = await WKND.connect(signer).balanceOf(voterAddress, {
    gasPrice: 100,
    gasLimit: 9000000,
  });
  console.log(tx.toNumber());
  return tx.toNumber();
}

async function _vote(voterAddress, id, weight) {
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  // Prompt user for account connections
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  const signerAddress = await signer.getAddress();
  console.log("Account:", signerAddress);
  console.log(id, weight);
  if (signerAddress == voterAddress) {
    const tx = await VotesGovernorContract.connect(signer).vote(weight, id, {
      gasPrice: ethers.utils.parseEther("0.0000001"),
    });
    console.log("voted");
    console.log(tx);
  }
}
