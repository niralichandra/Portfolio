import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { reduceMotion } from "../hooks/motion";

/* Splits paragraphs into word tokens; **double stars** mark highlighted words. */
function tokenize(paragraphs) {
  return paragraphs.map(p =>
    p.split(/(\*\*[^*]+\*\*)/).filter(Boolean).flatMap(part => {
      const hl = part.startsWith("**");
      return (hl ? part.slice(2, -2) : part).match(/\S+\s*|\s+/g).map(w => ({ w, hl }));
    }),
  );
}

/* Chat-style reply that "thinks", then streams in word by word like an AI answer. */
export default function GenText({ prompt, answer, name }) {
  const paras = useMemo(() => tokenize(answer), [answer]);
  const total = paras.reduce((n, p) => n + p.length, 0);
  const [phase, setPhase] = useState(reduceMotion ? "done" : "idle"); // idle → asking → thinking → streaming → done
  const [shown, setShown] = useState(reduceMotion ? total : 0);
  const box = useRef(null);

  // Start once the box is properly on screen.
  useEffect(() => {
    if (phase !== "idle") return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { io.disconnect(); setPhase("asking"); }
    }, { threshold: 0.45 });
    io.observe(box.current);
    return () => io.disconnect();
  }, [phase]);

  useEffect(() => {
    let t;
    if (phase === "asking") t = setTimeout(() => setPhase("thinking"), 700);
    else if (phase === "thinking") t = setTimeout(() => setPhase("streaming"), 1300);
    else if (phase === "streaming") {
      if (shown >= total) t = setTimeout(() => setPhase("done"), 600);
      // Uneven chunks and timing, like real token streaming.
      else t = setTimeout(() => setShown(s => Math.min(total, s + 1 + (Math.random() < 0.3 ? 1 : 0))), 28 + Math.random() * 55);
    }
    return () => clearTimeout(t);
  }, [phase, shown, total]);

  let i = 0;
  const cursorAt = phase === "streaming" ? shown : -1;
  const status = { idle: name, asking: name, thinking: "Thinking", streaming: "Generating", done: name }[phase];

  return (
    <div className={`gen gen-${phase}`} ref={box}>
      <div className="gen-prompt">
        <span className="gen-you">You</span>
        <p>{prompt}</p>
      </div>

      <div className="gen-reply">
        <div className="gen-head">
          <span className="gen-avatar">{name[0]}</span>
          <span className="gen-status">
            {status}
            {(phase === "thinking" || phase === "streaming") && <span className="gen-dots"><i /><i /><i /></span>}
          </span>
        </div>

        <div className="gen-body">
          {paras.map((p, pi) => (
            <p key={pi}>
              {p.map((tok, ti) => {
                const idx = i++;
                // Keyed fragment: moving the cursor never remounts (and re-fades) the words.
                return (
                  <Fragment key={ti}>
                    <span className={"gen-tok" + (idx < shown ? " on" : "") + (tok.hl ? " hl" : "")}>{tok.w}</span>
                    {idx === cursorAt - 1 && <span className="gen-cursor" />}
                  </Fragment>
                );
              })}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
