import { Header } from "@/components/Header";
import { HackerLayout } from "@/components/hacker/HackerLayout";

export default function Home() {
  return (
    <>
      <div id="top" aria-hidden="true" />
      <Header />
      <HackerLayout />
    </>
  );
}
