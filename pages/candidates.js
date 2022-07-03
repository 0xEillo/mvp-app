import { Candidates } from "../components/Candidates";
import { Navbar } from "../components/Navbar";

export default function vote({ data }) {
  return (
    <div>
      <Navbar></Navbar>
      <Candidates candidates={data}></Candidates>
    </div>
  );
}

export async function getStaticProps() {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  const res = await fetch("https://wakanda-task.3327.io/list");
  const data = await res.json();

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      data,
    },
  };
}
