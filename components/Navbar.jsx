import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import styles from "../styles/Navbar.module.css";

export const Navbar = () => {
  return (
    <div className={styles.navbar}>
      <div className={styles.menu}>
        <h1 className={styles.title}>wakanda.gov</h1>
        <Link href="/">
          <h3 className={styles.menuItem}>Token</h3>
        </Link>
        <Link href="/candidates">
          <h3 className={styles.menuItem}>Candidates</h3>
        </Link>
        <Link href="/leaders">
          <h3 className={styles.menuItem}>Leaders</h3>
        </Link>
      </div>

      <ConnectButton />
    </div>
  );
};
