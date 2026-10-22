import {
  siJavascript, siTypescript, siPython, siOpenjdk, siCplusplus, siMysql, siReact, siNextdotjs, siHtml5, siCss,
  siTailwindcss, siNodedotjs, siExpress, siFastapi, siOpenapiinitiative, siGraphql, siPostgresql, siMongodb,
  siFirebase, siDocker, siGit, siGithubactions, siFigma, siPostman, siLinux,
  siPandas, siNumpy, siOpencv, siYolo, siGithub,
} from "simple-icons";

/* Skill name (as written in data.js) → Simple Icons entry. `hex` overrides the icon's own brand colour. */
const icons = {
  "JavaScript": siJavascript, "TypeScript": siTypescript, "Python": siPython, "Java": { ...siOpenjdk, hex: "ED8B00" },
  "C++": siCplusplus, "SQL": siMysql, "React": siReact, "Next.js": siNextdotjs, "HTML": siHtml5, "CSS": siCss,
  "Tailwind": siTailwindcss, "Node.js": siNodedotjs, "Express": siExpress, "FastAPI": siFastapi, "REST": siOpenapiinitiative,
  "GraphQL": siGraphql, "PostgreSQL": siPostgresql, "MongoDB": siMongodb, "Firebase": siFirebase, "Docker": siDocker,
  "Git": siGit, "GitHub Actions": siGithubactions, "Figma": siFigma, "Postman": siPostman, "Linux": siLinux,
  "REST APIs": siOpenapiinitiative, "MySQL Workbench": siMysql, "Pandas": siPandas, "NumPy": { ...siNumpy, hex: "4DABCF" },
  "OpenCV": siOpencv, "YOLO": siYolo, "GitHub": siGithub,
};

/* Near-black brand colours (Next.js, Express…) would vanish on the dark page, so they fall back to the text colour. */
const isDark = hex => {
  const [r, g, b] = [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 60;
};

export function brand(name) {
  const icon = icons[name];
  if (!icon) return { path: null, color: "var(--text-strong)" };
  return { path: icon.path, color: isDark(icon.hex) ? "var(--text-strong)" : `#${icon.hex}` };
}
