import { useMemo, useState } from 'preact/hooks';
import {
  initialState,
  commit,
  createBranch,
  switchBranch,
  mergeBranch,
  rebaseOnto,
  cherryPick,
  resetTo,
  revertCommit,
  reachableSet,
  laneColor,
  shortId,
  type GraphState,
} from '../../lib/git-graph-engine';
import { challenges } from '../../data/challenges';
import { isComplete, setComplete } from '../../lib/progress';

const ROW_H = 64;
const LANE_W = 92;
const PAD = 50;

function GraphSVG({ state }: { state: GraphState }) {
  const reachable = reachableSet(state);
  const nodes = Object.values(state.commits);
  const maxLane = Math.max(0, ...nodes.map((n) => n.lane));
  const maxRow = Math.max(0, ...nodes.map((n) => n.row));
  const width = PAD * 2 + maxLane * LANE_W + 24;
  const height = PAD * 2 + maxRow * ROW_H + 24;

  const headsAt: Record<string, string[]> = {};
  for (const [name, id] of Object.entries(state.branches)) {
    headsAt[id] = [...(headsAt[id] ?? []), name];
  }
  const branchCount = Object.keys(state.branches).length;

  return (
    <div class="overflow-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-2">
      <svg role="img" aria-label={`Commit graph with ${nodes.length} commits across ${branchCount} branch${branchCount === 1 ? '' : 'es'}. Current branch: ${state.head}.`} width={Math.max(width, 320)} height={Math.max(height, 200)} class="block">
        {nodes.map((n) =>
          n.parents.map((p) => {
            const parent = state.commits[p];
            if (!parent) return null;
            const x1 = PAD + n.lane * LANE_W;
            const y1 = PAD + n.row * ROW_H;
            const x2 = PAD + parent.lane * LANE_W;
            const y2 = PAD + parent.row * ROW_H;
            const dim = !reachable.has(n.id) || !reachable.has(p);
            const path = x1 === x2 ? `M${x1},${y1} L${x2},${y2}` : `M${x1},${y1} C${x1},${(y1 + y2) / 2} ${x2},${(y1 + y2) / 2} ${x2},${y2}`;
            return <path d={path} fill="none" stroke={dim ? '#3a3a48' : laneColor(n.lane)} stroke-width="2.5" stroke-linecap="round" opacity={dim ? 0.4 : 0.9} />;
          }),
        )}
        {nodes.map((n) => {
          const x = PAD + n.lane * LANE_W;
          const y = PAD + n.row * ROW_H;
          const dim = !reachable.has(n.id);
          const heads = headsAt[n.id] ?? [];
          return (
            <g>
              <circle cx={x} cy={y} r={heads.length ? 8 : 6.5} fill={dim ? '#4b4b5a' : laneColor(n.lane)} opacity={dim ? 0.5 : 1} stroke={dim ? 'none' : 'rgba(255,255,255,0.25)'} stroke-width="1.5" />
              <title>{`${n.message} (${shortId(n.id)})`}</title>
              {heads.map((h, i) => (
                <g transform={`translate(${x + 12}, ${y - 9 - i * 18})`}>
                  <rect width={Math.max(30, h.length * 6.5 + (h === state.head ? 26 : 14))} height="16" rx="8" fill={dim ? '#2a2a35' : 'rgba(255,255,255,0.06)'} stroke={laneColor(n.lane)} stroke-width="1" />
                  <text x="7" y="11.5" font-size="10" font-family="var(--font-mono)" fill={dim ? '#8a8a9a' : '#f4f4f8'}>
                    {h === state.head ? `● ${h}` : h}
                  </text>
                </g>
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

const selectClass =
  'rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-2.5 py-2 text-[13px] text-[var(--color-ink)] outline-none focus:border-[var(--color-git-orange)]/50';
const btnClass =
  'rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-2 text-[13px] font-medium text-[var(--color-ink)] transition hover:border-[var(--color-git-orange)]/50 hover:bg-[var(--color-git-orange)]/10 disabled:cursor-not-allowed disabled:opacity-40';

export default function GitGraphPlayground() {
  const [state, setState] = useState<GraphState>(() => initialState());
  const [showChallenges, setShowChallenges] = useState(false);
  const [, force] = useState(0);

  const branchNames = Object.keys(state.branches);
  const otherBranches = branchNames.filter((b) => b !== state.head);
  const commitList = Object.values(state.commits).sort((a, b) => b.row - a.row);

  const [mergeTarget, setMergeTarget] = useState('');
  const [rebaseTarget, setRebaseTarget] = useState('');
  const [pickTarget, setPickTarget] = useState('');
  const [resetTarget, setResetTarget] = useState('');
  const [resetMode, setResetMode] = useState<'soft' | 'mixed' | 'hard'>('mixed');
  const [revertTarget, setRevertTarget] = useState('');
  const [newBranchName, setNewBranchName] = useState('');

  function apply(fn: (s: GraphState) => GraphState) {
    setState((s) => fn(s));
  }

  const passedCount = useMemo(() => challenges.filter((c) => isComplete(`playground:${c.id}`) || c.check(state)).length, [state]);

  function checkChallenges() {
    challenges.forEach((c) => {
      if (c.check(state)) setComplete(`playground:${c.id}`, true);
    });
    force((n) => n + 1);
  }

  return (
    <div class="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div>
        <div class="mb-4 flex flex-wrap items-center gap-2">
          <span class="text-[13px] text-[var(--color-ink-muted)]">Current branch:</span>
          <select aria-label="Current branch (switch)" class={selectClass} value={state.head} onChange={(e) => apply((s) => switchBranch(s, (e.target as HTMLSelectElement).value))}>
            {branchNames.map((b) => (
              <option value={b}>{b}</option>
            ))}
          </select>
          <button type="button" class={`${btnClass} ml-auto`} onClick={() => setState(initialState())}>
            Reset playground
          </button>
          <button type="button" class={btnClass} onClick={() => setShowChallenges((v) => !v)}>
            {showChallenges ? 'Hide challenges' : `Challenges (${passedCount}/${challenges.length})`}
          </button>
        </div>

        <GraphSVG state={state} />

        <div class="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <button type="button" class={btnClass} onClick={() => apply((s) => commit(s))}>
            ● Commit
          </button>

          <div class="flex gap-1.5">
            <input
              value={newBranchName}
              onInput={(e) => setNewBranchName((e.target as HTMLInputElement).value)}
              placeholder="branch name"
              aria-label="New branch name"
              class={`${selectClass} w-full`}
            />
            <button
              type="button"
              class={btnClass}
              disabled={!newBranchName.trim()}
              onClick={() => {
                apply((s) => createBranch(s, newBranchName.trim()));
                setNewBranchName('');
              }}
            >
              Branch
            </button>
          </div>

          <div class="flex gap-1.5">
            <select aria-label="Branch to merge into current branch" class={`${selectClass} w-full`} value={mergeTarget} onChange={(e) => setMergeTarget((e.target as HTMLSelectElement).value)}>
              <option value="">merge…</option>
              {otherBranches.map((b) => (
                <option value={b}>{b}</option>
              ))}
            </select>
            <button type="button" class={btnClass} disabled={!mergeTarget} onClick={() => { apply((s) => mergeBranch(s, mergeTarget)); setMergeTarget(''); }}>
              Merge
            </button>
          </div>

          <div class="flex gap-1.5">
            <select aria-label="Branch to rebase onto" class={`${selectClass} w-full`} value={rebaseTarget} onChange={(e) => setRebaseTarget((e.target as HTMLSelectElement).value)}>
              <option value="">onto…</option>
              {otherBranches.map((b) => (
                <option value={b}>{b}</option>
              ))}
            </select>
            <button type="button" class={btnClass} disabled={!rebaseTarget} onClick={() => { apply((s) => rebaseOnto(s, rebaseTarget)); setRebaseTarget(''); }}>
              Rebase
            </button>
          </div>

          <div class="flex gap-1.5">
            <select aria-label="Commit to cherry-pick" class={`${selectClass} w-full`} value={pickTarget} onChange={(e) => setPickTarget((e.target as HTMLSelectElement).value)}>
              <option value="">commit…</option>
              {commitList.map((c) => (
                <option value={c.id}>{shortId(c.id)} · {c.message.slice(0, 22)}</option>
              ))}
            </select>
            <button type="button" class={btnClass} disabled={!pickTarget} onClick={() => { apply((s) => cherryPick(s, pickTarget)); setPickTarget(''); }}>
              Cherry-pick
            </button>
          </div>

          <div class="flex gap-1.5">
            <select aria-label="Reset mode" class={selectClass} value={resetMode} onChange={(e) => setResetMode((e.target as HTMLSelectElement).value as any)}>
              <option value="soft">soft</option>
              <option value="mixed">mixed</option>
              <option value="hard">hard</option>
            </select>
            <select aria-label="Commit to reset to" class={`${selectClass} w-full`} value={resetTarget} onChange={(e) => setResetTarget((e.target as HTMLSelectElement).value)}>
              <option value="">to…</option>
              {commitList.map((c) => (
                <option value={c.id}>{shortId(c.id)} · {c.message.slice(0, 18)}</option>
              ))}
            </select>
            <button type="button" class={btnClass} disabled={!resetTarget} onClick={() => { apply((s) => resetTo(s, resetTarget, resetMode)); setResetTarget(''); }}>
              Reset
            </button>
          </div>

          <div class="flex gap-1.5">
            <select aria-label="Commit to revert" class={`${selectClass} w-full`} value={revertTarget} onChange={(e) => setRevertTarget((e.target as HTMLSelectElement).value)}>
              <option value="">commit…</option>
              {commitList.map((c) => (
                <option value={c.id}>{shortId(c.id)} · {c.message.slice(0, 22)}</option>
              ))}
            </select>
            <button type="button" class={btnClass} disabled={!revertTarget} onClick={() => { apply((s) => revertCommit(s, revertTarget)); setRevertTarget(''); }}>
              Revert
            </button>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        {showChallenges && (
          <div class="glass-card p-4">
            <div class="mb-3 flex items-center justify-between">
              <p class="text-[13px] font-semibold text-[var(--color-ink)]">Challenges</p>
              <button type="button" onClick={checkChallenges} class="text-[11px] text-[var(--color-git-orange-soft)] hover:underline">
                Check progress
              </button>
            </div>
            <ul class="space-y-2">
              {challenges.map((c) => {
                const done = isComplete(`playground:${c.id}`) || c.check(state);
                return (
                  <li class={`rounded-lg border px-3 py-2 text-[12.5px] ${done ? 'border-[var(--color-success)]/40 bg-[var(--color-success)]/5' : 'border-[var(--color-border)] bg-[var(--color-bg-elevated)]'}`}>
                    <p class={`font-medium ${done ? 'text-[var(--color-success)]' : 'text-[var(--color-ink)]'}`}>{done ? '✓ ' : ''}{c.title}</p>
                    <p class="text-[var(--color-ink-muted)]">{c.description}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div class="glass-card p-4">
          <p class="mb-3 text-[13px] font-semibold text-[var(--color-ink)]">Command log</p>
          <div class="max-h-[360px] space-y-1 overflow-y-auto rounded-lg bg-[var(--color-bg)] p-3 font-mono text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
            {state.log.map((l) => (
              <p><span class="text-[var(--color-git-orange-soft)]">➜</span> {l}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
