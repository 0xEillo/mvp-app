import styles from "../styles/Home.module.css";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { Navbar } from "../components//Navbar";
import { useAccount } from "wagmi";
import { TOKEN_ABI } from "../constants";

const TOKEN_ADDRESS = "0xBE4BDEd02E60B7929a5b9D2c932a26E5Ed5e91FF";

export default function Home() {
  const [connected, setConnected] = useState(false);
  const [voterAddress, setVoterAddress] = useState("0x00");
  const [tokenBalance, setTokenBalance] = useState(0);

  const { data: account } = useAccount();

  useEffect(() => {
    getTokenBalance();
    if (account) {
      setConnected(true);
      setVoterAddress(account.address);
    }
  });

  const getTokenBalance = () => {
    if (connected) {
      _getTokenBalance(voterAddress)
        .then((balance) => {
          setTokenBalance(balance);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const claimToken = () => {
    _claimToken(voterAddress);
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
              if (connected) {
                claimToken();
              }
            }}
          >
            Claim WKND Token
          </button>
        </div>
      </div>
    </div>
  );
}

async function _claimToken(voterAddress) {
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  // Prompt user for account connections
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();

  const WKND = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, provider);

  let tx = await WKND.connect(signer).mint(voterAddress, {
    gasPrice: ethers.utils.parseEther("0.00000001"),
    gasLimit: 1000001,
  });
  console.log(tx);
}

async function _getTokenBalance(voterAddress) {
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  // Prompt user for account connections
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  const WKND = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, provider);

  let tx = await WKND.connect(signer).balanceOf(voterAddress, {
    gasPrice: ethers.utils.parseEther("0.00000001"),
    gasLimit: 1000001,
  });
  console.log("returned token balance", tx.toNumber());
  return tx.toNumber();
}
