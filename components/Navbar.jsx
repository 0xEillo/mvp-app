import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import styles from "../styles/Navbar.module.css";

export const Navbar = () => {
  return (
    <div className={styles.navbar}>
      <div className={styles.menu}>
        <h1 className={styles.title}>wakanda.gov</h1>
        <Link href="/">
          <h3 className={styles.menuItem}>Home</h3>
        </Link>
        <Link href="/vote">
          <h3 className={styles.menuItem}>Vote</h3>
        </Link>
      </div>

      <ConnectButton />
    </div>
  );
};
