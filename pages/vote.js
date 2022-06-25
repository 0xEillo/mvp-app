import { Leaderboard } from "../components/Leaderboard";
import { Navbar } from "../components/Navbar";
import { Vote } from "../components/Vote";
import styles from "../styles/Vote.module.css";

export default function vote() {
  return (
    <div>
      <Navbar></Navbar>
      <div className={styles.vote}>
        <div>
          <Vote></Vote>
        </div>
        <div>
          <Leaderboard></Leaderboard>
        </div>
      </div>
    </div>
  );
}
