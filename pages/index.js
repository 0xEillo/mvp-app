import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { ethers } from "ethers";
import { WagmiConfig } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
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
    getVoterAddress().then((res) => {
      setVoterAddress(res);
      if (res != "0x00") {
        setConnected(true);
      }
    });
  });

  console.log("tokenBalance", tokenBalance);
  console.log("voterAddress", voterAddress);

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
      <RainbowKitProvider chains={chains}>
        <div>
          <Navbar></Navbar>
          <div>
            <button
              onClick={() => {
                if (voterAddress.toString() != "0x00") {
                  setConnected(true);
                  getAccount().then((res) => {
                    console.log(voterAddress);
                    console.log("res", res);
                    setVoterAddress(res);
                    claimToken();
                  });
                }
              }}
            >
              Claim WKND Token
            </button>
          </div>
          <div>
            <button
              onClick={() => {
                getTokenBalance();
              }}
            >
              Get WKND Balance
            </button>
            <p>Your WKND token balance: {tokenBalance}</p>
          </div>
          <input
            id="id"
            type="number"
            onChange={(event) => setId(event.target.value)}
          ></input>
          <input
            id="weight"
            type="number"
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
            Vote
          </button>
          <Leaderboard></Leaderboard>
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

async function _claimToken(voterAddress, signer, WKND) {
  await WKND.connect(signer).mint(voterAddress, {
    gasPrice: 100,
    gasLimit: 9000000,
  });
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
  return accounts[0];
}
