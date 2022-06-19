import { ConnectButton } from "@rainbow-me/rainbowkit";
import styles from "../styles/Navbar.module.css";

export const Navbar = () => {
  return (
    <div className={styles.navbar}>
      <h1>Wakanda.gov</h1>
      <ConnectButton />
    </div>
  );
};
