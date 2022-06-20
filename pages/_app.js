import "../styles/globals.css";
import { WagmiConfig } from "wagmi";
import { wagmiClient, chains } from "../wagmiConfig";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";

function MyApp({ Component, pageProps }) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={darkTheme()}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
