import { useState } from 'preact/hooks';

type Node = {
  id: string;
  question: string;
  options: { label: string; next?: string; result?: string; resultTitle?: string }[];
};

const TREE: Record<string, Node> = {
  root: {
    id: 'root',
    question: 'What went wrong?',
    options: [
      { label: 'A commit I just made is wrong', next: 'commit-wrong' },
      { label: "I'm confused about branches or HEAD", next: 'branch-confused' },
      { label: "There's a merge or rebase conflict", next: 'conflict' },
      { label: 'Push or pull is failing', next: 'sync-failing' },
      { label: 'I exposed a secret or huge file', next: 'sensitive' },
      { label: 'I just want to start clean, or lost some work', next: 'cleanup' },
    ],
  },
  'commit-wrong': {
    id: 'commit-wrong',
    question: 'What exactly is wrong with it?',
    options: [
      { label: 'Wrong branch entirely', result: 'committed-to-wrong-branch', resultTitle: 'I committed to the wrong branch' },
      { label: 'Wrong or messy commit message', result: 'wrong-commit-message', resultTitle: 'I need to fix a commit message' },
      { label: 'I just want it gone', result: 'undo-last-commit', resultTitle: 'Undo my last commit' },
      { label: 'Staged the wrong file', result: 'unstage-a-file', resultTitle: 'I staged a file by mistake' },
    ],
  },
  'branch-confused': {
    id: 'branch-confused',
    question: "What's happening?",
    options: [
      { label: '"detached HEAD" warning appeared', result: 'detached-head', resultTitle: "I'm in a detached HEAD state" },
      { label: 'I deleted a branch I needed', result: 'recover-deleted-branch', resultTitle: 'I deleted a branch I still needed' },
      { label: "Git won't let me switch branches", result: 'cant-switch-branch', resultTitle: "Git won't let me switch branches" },
    ],
  },
  conflict: {
    id: 'conflict',
    question: 'Which command triggered it?',
    options: [
      { label: 'git rebase', result: 'resolve-rebase-conflict', resultTitle: 'I have a conflict during a rebase' },
      { label: 'git merge (or git pull)', result: 'merge-conflict-basics', resultTitle: 'I have a merge conflict' },
    ],
  },
  'sync-failing': {
    id: 'sync-failing',
    question: 'What does the error say?',
    options: [
      { label: '"Updates were rejected"', result: 'push-rejected', resultTitle: 'My push was rejected' },
      { label: 'Connecting to the wrong repository', result: 'wrong-remote-url', resultTitle: 'My remote points to the wrong URL' },
      { label: 'File too large / rejected for size', result: 'large-file-rejected', resultTitle: 'GitHub rejected my push for a large file' },
    ],
  },
  sensitive: {
    id: 'sensitive',
    question: 'Which one?',
    options: [
      { label: 'A password, key, or .env file', result: 'remove-secret-from-history', resultTitle: 'I committed a secret or credential' },
      { label: 'A huge binary or dataset file', result: 'large-file-rejected', resultTitle: 'GitHub rejected my push for a large file' },
    ],
  },
  cleanup: {
    id: 'cleanup',
    question: 'What do you need?',
    options: [
      { label: 'Discard everything, start fresh', result: 'discard-all-local-changes', resultTitle: 'I want to throw away all my local changes' },
      { label: 'Find a lost stash', result: 'lost-stash', resultTitle: "I can't find my stash" },
      { label: 'Find a deleted branch', result: 'recover-deleted-branch', resultTitle: 'I deleted a branch I still needed' },
    ],
  },
};

export default function DecisionTree({ base }: { base: string }) {
  const [path, setPath] = useState<string[]>(['root']);
  const current = TREE[path[path.length - 1]];

  return (
    <div class="glass-card p-6">
      <div class="mb-4 flex items-center justify-between">
        <p class="text-[13px] font-semibold uppercase tracking-wide text-[var(--color-ink-faint)]">What went wrong?</p>
        {path.length > 1 && (
          <button type="button" onClick={() => setPath((p) => p.slice(0, -1))} class="text-[12px] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]">
            ← Back
          </button>
        )}
      </div>
      <p class="mb-4 text-[17px] font-semibold text-[var(--color-ink)]">{current.question}</p>
      <div class="grid gap-2 sm:grid-cols-2">
        {current.options.map((opt) => (
          <button
            type="button"
            class="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3.5 py-2.5 text-left text-[13.5px] text-[var(--color-ink-muted)] transition hover:border-[var(--color-git-orange)]/50 hover:text-[var(--color-ink)]"
            onClick={() => {
              if (opt.result) {
                window.location.href = `${base}/${opt.result}`;
              } else if (opt.next) {
                setPath((p) => [...p, opt.next!]);
              }
            }}
          >
            {opt.label}
            <span class="ml-2 shrink-0 text-[var(--color-ink-faint)]">→</span>
          </button>
        ))}
      </div>
    </div>
  );
}
