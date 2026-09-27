import Activities from "@/components/sections/Activities";
import Facts from "@/components/sections/Facts";
import Footer from "@/components/sections/Footer";
import Hero from "@/components/sections/Hero";
import MultiverseFile from "@/components/sections/MultiverseFile";
import PortalTransition from "@/components/sections/PortalTransition";
import Register from "@/components/sections/Register";
import Schedule from "@/components/sections/Schedule";
import Ticker from "@/components/sections/Ticker";

/**
 * The narrative order is the whole design:
 * hero → ticker → the red portal → the brief → activities → the file →
 * schedule → registration → ticker → footer.
 *
 * One section leads into the next; nothing moves constantly, and the only
 * scroll-linked scene sits in the middle where it can be a centrepiece. The two
 * ticker bands bookend the story and are the one element that reacts to scroll
 * velocity rather than scroll position.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Ticker />
      <PortalTransition />
      <Facts />
      <Activities />
      <MultiverseFile />
      <Schedule />
      <Register />
      <Ticker tone="ink" baseVelocity={-2.6} />
      <Footer />
    </>
  );
}
