import { useEffect, useMemo, useRef, useState } from "react";
import { SECTIONS } from "./Nav";
import { transitionTo } from "./Effects";

export default function CommandPalette({ data, open, setOpen }) {
  const [query, setQuery] = useState("");
  const [sel, setSel] = useState(0);
  const input = useRef(null);

  const commands = useMemo(() => {
    const go = (id, label) => () => transitionTo(label, () => document.getElementById(id).scrollIntoView({ behavior: "smooth" }));
    return [
      ...SECTIONS.map(([id, l]) => ({ label: `Go to ${l}`, hint: "Section", run: go(id, l) })),
      { label: "Contact me", hint: "Section", run: go("contact", "Let's talk") },
      { label: "Open CV", hint: "Action", run: () => window.open(data.cv, "_blank", "noopener") },
      { label: "Copy email", hint: "Action", run: () => navigator.clipboard?.writeText(data.email) },
      ...data.socials.map(s => ({ label: `Open ${s.label}`, hint: "Link", run: () => window.open(s.url, "_blank", "noopener") })),
    ];
  }, [data]);

  const shown = commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase().trim()));

  useEffect(() => {
    const onKey = e => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen(o => !o); }
      else if (e.key === "Escape") setOpen(false);
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [setOpen]);

  useEffect(() => { if (open) { setQuery(""); setSel(0); setTimeout(() => input.current?.focus(), 0); } }, [open]);

  if (!open) return null;

  const run = c => { setOpen(false); c?.run(); };
  const onKeyDown = e => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSel(s => (s + 1) % shown.length); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSel(s => (s - 1 + shown.length) % shown.length); }
    else if (e.key === "Enter") run(shown[sel]);
  };

  return (
    <div className="palette" onClick={e => e.target === e.currentTarget && setOpen(false)}>
      <div className="palette-box" role="dialog" aria-label="Command menu">
        <input ref={input} value={query} onChange={e => { setQuery(e.target.value); setSel(0); }} onKeyDown={onKeyDown}
               placeholder="Jump to a section or action…" autoComplete="off" />
        <ul>
          {shown.length ? shown.map((c, i) => (
            <li key={c.label} className={i === sel ? "sel" : ""} onMouseEnter={() => setSel(i)} onClick={() => run(c)}>
              <span>{c.label}</span><small>{c.hint}</small>
            </li>
          )) : <li className="empty">No results</li>}
        </ul>
        <div className="palette-foot"><span>↑↓ navigate</span><span>↵ select</span><span>esc close</span></div>
      </div>
    </div>
  );
}
