import { ethers } from "ethers";
import { TOKEN_ABI, GOVERNANCE_ABI } from "./constants";
import { GOERLI_API_KEY, GOERLI_PRIVATE_KEY } from "./secrets";

const TOKEN_ADDRESS = "0x90b335B944abef5C74dEfA0F3Bad62E2c08CE52A";
const GOVERNANCE_ADDRESS = "0x1B8d468Ca95F08A82EC45f5bb0250e000c96F718";

export const provider = new ethers.providers.JsonRpcProvider(GOERLI_API_KEY);
export const signer = new ethers.Wallet(GOERLI_PRIVATE_KEY, provider);
export const WKND = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, provider);
export const VotesGovernorContract = new ethers.Contract(
  GOVERNANCE_ADDRESS,
  GOVERNANCE_ABI,
  provider
);
