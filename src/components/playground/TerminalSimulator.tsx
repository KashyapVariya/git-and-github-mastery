import { useEffect, useRef, useState } from 'preact/hooks';

type Line = { kind: 'input' | 'output' | 'error'; text: string };

type SimState = {
  initialized: boolean;
  branch: string;
  branches: string[];
  tracked: Set<string>;
  staged: Set<string>;
  modified: Set<string>;
  untracked: Set<string>;
  commits: { id: string; message: string; files: string[] }[];
};

function freshState(): SimState {
  return {
    initialized: false,
    branch: 'main',
    branches: ['main'],
    tracked: new Set(),
    staged: new Set(),
    modified: new Set(),
    untracked: new Set(['README.md', 'index.html']),
    commits: [],
  };
}

function shortId(n: number) {
  return (n * 2654435761 % 0xfffff).toString(16).padStart(5, '0');
}

export default function TerminalSimulator() {
  const [state, setState] = useState<SimState>(freshState);
  const [lines, setLines] = useState<Line[]>([
    { kind: 'output', text: 'Sandbox terminal — try: git init, git status, git add <file>, git commit -m "message", git log, git branch, touch <file>, help' },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  function print(text: string, kind: Line['kind'] = 'output') {
    setLines((l) => [...l, { kind, text }]);
  }

  function run(raw: string) {
    const cmd = raw.trim();
    setLines((l) => [...l, { kind: 'input', text: cmd }]);
    if (!cmd) return;

    setState((s) => {
      const next: SimState = {
        ...s,
        branches: [...s.branches],
        tracked: new Set(s.tracked),
        staged: new Set(s.staged),
        modified: new Set(s.modified),
        untracked: new Set(s.untracked),
        commits: [...s.commits],
      };
      const parts = cmd.split(/\s+/);
      const head = parts[0];

      if (cmd === 'clear') {
        setLines([]);
        return next;
      }
      if (cmd === 'help') {
        print('Commands: git init | git status | git add <file|.> | git commit -m "msg" | git log [--oneline] | git branch [name] | git switch <name> | touch <file> | ls | clear');
        return next;
      }
      if (head === 'touch' && parts[1]) {
        next.untracked.add(parts[1]);
        return next;
      }
      if (cmd === 'ls') {
        const all = [...next.tracked, ...next.untracked];
        print(all.length ? all.join('  ') : '(empty directory)');
        return next;
      }
      if (head !== 'git') {
        print(`command not found: ${head}`, 'error');
        return next;
      }

      const sub = parts[1];

      if (sub === 'init') {
        if (next.initialized) {
          print('Reinitialized existing Git repository in ~/sandbox/.git/');
        } else {
          next.initialized = true;
          print('Initialized empty Git repository in ~/sandbox/.git/');
        }
        return next;
      }

      if (!next.initialized) {
        print("fatal: not a git repository (or any of the parent directories): .git", 'error');
        return next;
      }

      if (sub === 'status') {
        print(`On branch ${next.branch}`);
        if (next.staged.size === 0 && next.modified.size === 0 && next.untracked.size === 0) {
          print('nothing to commit, working tree clean');
        } else {
          if (next.staged.size) {
            print('Changes to be committed:');
            next.staged.forEach((f) => print(`\tnew file:   ${f}`));
          }
          if (next.modified.size) {
            print('Changes not staged for commit:');
            next.modified.forEach((f) => print(`\tmodified:   ${f}`));
          }
          if (next.untracked.size) {
            print('Untracked files:');
            next.untracked.forEach((f) => print(`\t${f}`));
          }
        }
        return next;
      }

      if (sub === 'add') {
        const target = parts[2];
        if (!target) {
          print('nothing specified, nothing added.', 'error');
          return next;
        }
        const files = target === '.' ? [...next.untracked, ...next.modified] : [target];
        files.forEach((f) => {
          next.untracked.delete(f);
          next.modified.delete(f);
          next.staged.add(f);
          next.tracked.add(f);
        });
        return next;
      }

      if (sub === 'commit') {
        const mFlagIdx = parts.indexOf('-m');
        const message = mFlagIdx >= 0 ? cmd.slice(cmd.indexOf('-m') + 3).replace(/^["']|["']$/g, '') : '';
        if (next.staged.size === 0) {
          print('nothing to commit, working tree clean', 'error');
          return next;
        }
        if (!message) {
          print('error: commit message required — use git commit -m "message"', 'error');
          return next;
        }
        const files = [...next.staged];
        next.commits.push({ id: shortId(next.commits.length + 1), message, files });
        next.staged.clear();
        print(`[${next.branch} ${shortId(next.commits.length)}] ${message}`);
        print(` ${files.length} file${files.length === 1 ? '' : 's'} changed`);
        return next;
      }

      if (sub === 'log') {
        if (next.commits.length === 0) {
          print('fatal: your current branch does not have any commits yet', 'error');
          return next;
        }
        const oneline = parts.includes('--oneline');
        [...next.commits].reverse().forEach((c) => {
          if (oneline) print(`${c.id} ${c.message}`);
          else {
            print(`commit ${c.id}`);
            print(`    ${c.message}`);
            print('');
          }
        });
        return next;
      }

      if (sub === 'branch') {
        const name = parts[2];
        if (!name) {
          next.branches.forEach((b) => print(b === next.branch ? `* ${b}` : `  ${b}`));
          return next;
        }
        if (next.branches.includes(name)) {
          print(`fatal: a branch named '${name}' already exists`, 'error');
          return next;
        }
        next.branches.push(name);
        return next;
      }

      if (sub === 'switch' || sub === 'checkout') {
        const name = parts[2];
        if (!name || !next.branches.includes(name)) {
          print(`error: pathspec '${name ?? ''}' did not match any file(s) known to git`, 'error');
          return next;
        }
        next.branch = name;
        print(`Switched to branch '${name}'`);
        return next;
      }

      print(`git: '${sub}' is not a supported command in this sandbox.`, 'error');
      return next;
    });
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      run(input);
      if (input.trim()) setHistory((h) => [...h, input]);
      setInput('');
      setHistIdx(null);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const idx = histIdx === null ? history.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(idx);
      setInput(history[idx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx === null) return;
      const idx = histIdx + 1;
      if (idx >= history.length) {
        setHistIdx(null);
        setInput('');
      } else {
        setHistIdx(idx);
        setInput(history[idx]);
      }
    }
  }

  return (
    <div class="gradient-border overflow-hidden">
      <div class="flex items-center gap-1.5 border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-2.5">
        <span class="h-2.5 w-2.5 rounded-full bg-[#fb7185]" />
        <span class="h-2.5 w-2.5 rounded-full bg-[#fbbf24]" />
        <span class="h-2.5 w-2.5 rounded-full bg-[#34d399]" />
        <span class="ml-2 font-mono text-[11px] text-[var(--color-ink-faint)]">~/sandbox — git sandbox</span>
        <button
          type="button"
          class="ml-auto text-[11px] text-[var(--color-ink-faint)] hover:text-[var(--color-ink)]"
          onClick={() => {
            setState(freshState());
            setLines([{ kind: 'output', text: 'Sandbox reset.' }]);
          }}
        >
          Reset sandbox
        </button>
      </div>
      <div ref={scrollRef} class="h-[320px] overflow-y-auto bg-[var(--color-bg-card)] p-4 font-mono text-[12.5px] leading-relaxed" onClick={() => document.getElementById('term-input')?.focus()}>
        {lines.map((l) => (
          <p class={l.kind === 'input' ? 'text-[var(--color-ink)]' : l.kind === 'error' ? 'text-[var(--color-danger)]' : 'whitespace-pre-wrap text-[var(--color-ink-muted)]'}>
            {l.kind === 'input' && <span class="text-[var(--color-git-orange-soft)]">➜ {state.branch} </span>}
            {l.text}
          </p>
        ))}
        <div class="flex items-center gap-1.5">
          <span class="text-[var(--color-git-orange-soft)]">➜ {state.branch}</span>
          <input
            id="term-input"
            value={input}
            onInput={(e) => setInput((e.target as HTMLInputElement).value)}
            onKeyDown={onKeyDown}
            class="flex-1 bg-transparent text-[var(--color-ink)] outline-none"
            autocomplete="off"
            spellcheck={false}
            aria-label="Sandbox terminal input"
          />
        </div>
      </div>
    </div>
  );
}
