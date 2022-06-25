import styles from "../styles/Home.module.css";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { GOVERNANCE_ABI } from "../constants";

const GOVERNANCE_ADDRESS = "0xae3aF753cDbD3f1611337317C851dB59de97cD4E";

export const Vote = () => {
  const [connected, setConnected] = useState(false);
  const [voterAddress, setVoterAddress] = useState("0x00");
  const [id, setId] = useState(0);
  const [weight, setWeight] = useState(0);

  const { data: account } = useAccount();

  useEffect(() => {
    if (account) {
      setConnected(true);
      setVoterAddress(account.address);
    }
  });

  return (
    <div>
      <div>
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
          className={styles.lightButton}
          onClick={() => {
            if (connected) {
              _vote(voterAddress, weight, id);
            }
          }}
        >
          VOTE
        </button>
      </div>
    </div>
  );
};

async function _vote(voterAddress, weight, id) {
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
  if (signerAddress == voterAddress) {
    const tx = await VotesGovernorContract.connect(signer).vote(weight, id, {
      gasPrice: ethers.utils.parseEther("0.00000001"),
      gasLimit: 1000001,
    });
    console.log("voted");
    console.log(tx);
  }
}
