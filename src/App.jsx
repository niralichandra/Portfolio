import { useState } from "react";
import data from "./data";
import { Cursor, LinkTransition, PageIntro, ScrollProgress } from "./components/Effects";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import CommandPalette from "./components/CommandPalette";
import { About, Contact, Education, Experience, Honors, Journey, Leadership, Profiles, Projects, Skills, Strengths } from "./components/Sections";
import { useClock } from "./hooks/motion";

function Footer() {
  const time = useClock(data.timezone);
  const tz = data.timezone === "Asia/Kolkata" ? "IST" : data.timezone;
  return (
    <footer>
      <div className="footer-live"><span className="live-dot" />{time} {tz}</div>
      <div className="footer-tagline">{data.tagline}</div>
      <div className="footer-copy">© {new Date().getFullYear()} {data.name}. All rights reserved.</div>
    </footer>
  );
}

export default function App() {
  const [palette, setPalette] = useState(false);
  return (
    <>
      <PageIntro text={data.logo} />
      <LinkTransition />
      <ScrollProgress />
      <Cursor />
      <Nav data={data} onSearch={() => setPalette(true)} />
      <Hero data={data} />
      <main>
        <About data={data} />
        <Strengths data={data} />
        <Experience data={data} />
        <Projects data={data} />
        <Education data={data} />
        <Skills data={data} />
        <Honors data={data} />
        <Profiles data={data} />
        <Leadership data={data} />
        <Journey data={data} />
        <Contact data={data} />
      </main>
      <Footer />
      <CommandPalette data={data} open={palette} setOpen={setPalette} />
    </>
  );
}
