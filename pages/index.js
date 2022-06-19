import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { ethers } from "ethers";
import { WagmiConfig } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { wagmiClient, chains } from "../wagmiConfig";
import React, { useEffect, useState } from "react";
import { Leaderboard } from "../components/Leaderboard";
import { signer, VotesGovernorContract, WKND } from "../utils";
import { Navbar } from "../components//Navbar";
import { useAccount } from "wagmi";

export default function Home() {
  let tokenBalancee = 0;

  const [connected, setConnected] = useState(false);
  const [voterAddress, setVoterAddress] = useState("0x00");
  const [tokenBalance, setTokenBalance] = useState(0);
  const [id, setId] = useState(0);
  const [weight, setWeight] = useState(0);

  useEffect(() => {
    getTokenBalance();
    getVoterAddress().then((res) => {
      setVoterAddress(res.account);
      if (res != "0x00") {
        setConnected(true);
      }
    });
  });

  const getTokenBalance = () => {
    _getTokenBalance(voterAddress, signer, WKND)
      .then((balance) => {
        setTokenBalance(balance);
        console.log(balance);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const claimToken = () => {
    tokenBalancee = _claimToken(voterAddress, signer, WKND);
  };

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={darkTheme()}>
        <div>
          <Navbar></Navbar>
          <div className={styles.container}>
            <div className={styles.balanceSection}>
              <div>
                <h3>Your WKND token balance: {tokenBalance}</h3>
              </div>
              <button
                className={styles.claimButton}
                onClick={() => {
                  if (voterAddress.toString() != "0x00") {
                    setConnected(true);
                    getAccount().then((res) => {
                      setVoterAddress(res);
                      setHasClaimed(true);
                      claimToken();
                    });
                  }
                  console.log(hasClaimed);
                  if (hasClaimed == true) {
                    console.log("hasClaimed", hasClaimed);
                    return <h1>Hello</h1>;
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
                onClick={() => {
                  console.log(connected);
                  if (connected) {
                    _vote(weight, id);
                  }
                }}
              >
                VOTE
              </button>
            </div>

            <Leaderboard></Leaderboard>
          </div>
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
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

async function _vote(id, weight) {
  console.log(id, weight);
  const tx = await VotesGovernorContract.connect(signer).vote(weight, id, {
    gasPrice: 104,
    gasLimit: 9000000,
  });
  console.log(tx);
}

async function getAccount() {
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  // Prompt user for account connections
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  const signerAddress = signer.getAddress();
  return signerAddress;
}

async function getVoterAddress() {
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  // Prompt user for account connections
  const accounts = await provider.send("eth_requestAccounts", []);
  return { account: accounts[0] };
}
