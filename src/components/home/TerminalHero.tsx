import { useEffect, useRef, useState } from 'preact/hooks';

type Line = { prompt?: boolean; text: string; delay?: number };

const SCRIPT: Line[] = [
  { prompt: true, text: 'git init' },
  { text: 'Initialized empty Git repository in ~/project/.git/' },
  { prompt: true, text: 'git add README.md' },
  { prompt: true, text: 'git commit -m "docs: initial commit"' },
  { text: '[main (root-commit) a1b2c3d] docs: initial commit' },
  { text: ' 1 file changed, 1 insertion(+)' },
  { prompt: true, text: 'git switch -c feature/login' },
  { text: "Switched to a new branch 'feature/login'" },
  { prompt: true, text: 'git push -u origin feature/login' },
  { text: 'Branch published. Opening a pull request…' },
];

export default function TerminalHero() {
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const reduceMotion = useRef(false);

  useEffect(() => {
    reduceMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion.current) {
      setLineIdx(SCRIPT.length);
      return;
    }
  }, []);

  useEffect(() => {
    if (reduceMotion.current || lineIdx >= SCRIPT.length) return;
    const current = SCRIPT[lineIdx];
    const isPrompt = current.prompt;
    const speed = isPrompt ? 38 : 8;

    if (charIdx < current.text.length) {
      const t = window.setTimeout(() => setCharIdx((c) => c + 1), speed);
      return () => window.clearTimeout(t);
    }
    const pause = isPrompt ? 380 : 260;
    const t = window.setTimeout(() => {
      setLineIdx((i) => i + 1);
      setCharIdx(0);
    }, pause);
    return () => window.clearTimeout(t);
  }, [lineIdx, charIdx]);

  useEffect(() => {
    if (lineIdx < SCRIPT.length || reduceMotion.current) return;
    const t = window.setTimeout(() => {
      setLineIdx(0);
      setCharIdx(0);
    }, 2200);
    return () => window.clearTimeout(t);
  }, [lineIdx]);

  const doneLines = SCRIPT.slice(0, lineIdx);
  const typingLine = SCRIPT[lineIdx];

  return (
    <div class="gradient-border overflow-hidden">
      <div class="flex items-center gap-1.5 border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-2.5">
        <span class="h-2.5 w-2.5 rounded-full bg-[#fb7185]" />
        <span class="h-2.5 w-2.5 rounded-full bg-[#fbbf24]" />
        <span class="h-2.5 w-2.5 rounded-full bg-[#34d399]" />
        <span class="ml-2 font-mono text-[11px] text-[var(--color-ink-faint)]">~/project — zsh</span>
      </div>
      <div class="min-h-[220px] bg-[var(--color-bg-card)] p-4 font-mono text-[12.5px] leading-relaxed sm:text-[13px]">
        {doneLines.map((l) => (
          <p class={l.prompt ? 'text-[var(--color-ink)]' : 'text-[var(--color-ink-muted)]'}>
            {l.prompt && <span class="text-[var(--color-git-orange-soft)]">➜ </span>}
            {l.text}
          </p>
        ))}
        {typingLine && (
          <p class={typingLine.prompt ? 'text-[var(--color-ink)]' : 'text-[var(--color-ink-muted)]'}>
            {typingLine.prompt && <span class="text-[var(--color-git-orange-soft)]">➜ </span>}
            {typingLine.text.slice(0, charIdx)}
            <span class="animate-pulse-glow inline-block h-3.5 w-1.5 translate-y-0.5 bg-[var(--color-git-orange)]" />
          </p>
        )}
      </div>
    </div>
  );
}
