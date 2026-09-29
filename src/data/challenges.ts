import { ancestors, reachableSet, type GraphState } from '../lib/git-graph-engine';

export type Challenge = {
  id: string;
  title: string;
  description: string;
  check: (state: GraphState) => boolean;
};

export const challenges: Challenge[] = [
  {
    id: 'second-branch',
    title: 'Create a second branch',
    description: 'Use the Branch action to create any branch besides main.',
    check: (s) => Object.keys(s.branches).length >= 2,
  },
  {
    id: 'two-commits',
    title: 'Commit twice on a feature branch',
    description: 'Switch to a non-main branch and make at least 2 commits on it.',
    check: (s) =>
      Object.entries(s.branches).some(([name, head]) => {
        if (name === 'main') return false;
        let count = 0;
        let cur = head;
        while (s.commits[cur] && s.commits[cur].parents.length <= 1) {
          if (s.laneOf[name] !== s.commits[cur].lane) break;
          count++;
          cur = s.commits[cur].parents[0];
          if (!cur) break;
        }
        return count >= 2;
      }),
  },
  {
    id: 'merge-commit',
    title: 'Merge with a real merge commit',
    description: "Merge a branch into main so that main's tip has two parents.",
    check: (s) => s.commits[s.branches.main]?.parents.length === 2,
  },
  {
    id: 'fast-forward',
    title: 'Fast-forward a branch',
    description: 'Merge a branch that results in a fast-forward (no merge commit needed).',
    check: (s) => Object.entries(s.branches).some(([a, h1]) => Object.entries(s.branches).some(([b, h2]) => a !== b && h1 === h2)),
  },
  {
    id: 'cherry-pick-done',
    title: 'Cherry-pick a commit',
    description: 'Bring one commit from another branch onto your current branch with cherry-pick.',
    check: (s) => Object.values(s.commits).some((c) => c.message.includes('(cherry-picked)')),
  },
  {
    id: 'orphan-commit',
    title: 'Reset and leave a commit behind',
    description: 'Use Reset to move a branch backward, leaving a commit unreachable.',
    check: (s) => {
      const reachable = reachableSet(s);
      return Object.keys(s.commits).some((id) => !reachable.has(id));
    },
  },
  {
    id: 'straight-line',
    title: 'Rebase into a straight line',
    description: 'Rebase a branch so it has at least 4 commits in a row with no merge commits.',
    check: (s) =>
      Object.values(s.branches).some((head) => {
        const chain = ancestors(s, head);
        if (chain.size < 4) return false;
        return [...chain].every((id) => s.commits[id].parents.length <= 1);
      }),
  },
  {
    id: 'revert-done',
    title: 'Revert a commit',
    description: 'Undo a commit safely by creating a revert commit.',
    check: (s) => Object.values(s.commits).some((c) => c.message.startsWith('Revert "')),
  },
];
