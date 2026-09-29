export type CommitNode = {
  id: string;
  parents: string[];
  lane: number;
  row: number;
  message: string;
};

export type GraphState = {
  commits: Record<string, CommitNode>;
  branches: Record<string, string>;
  laneOf: Record<string, number>;
  head: string;
  nextLane: number;
  rowCounter: number;
  commitCounter: number;
  log: string[];
};

const LANE_COLORS = ['#f05032', '#22d3ee', '#8b6cf5', '#34d399', '#fbbf24', '#fb7185'];
export function laneColor(lane: number) {
  return LANE_COLORS[lane % LANE_COLORS.length];
}

export function shortId(id: string) {
  return id.slice(0, 7);
}

export function initialState(): GraphState {
  const id = 'c' + Math.random().toString(36).slice(2, 8);
  return {
    commits: { [id]: { id, parents: [], lane: 0, row: 0, message: 'Initial commit' } },
    branches: { main: id },
    laneOf: { main: 0 },
    head: 'main',
    nextLane: 1,
    rowCounter: 1,
    commitCounter: 1,
    log: ['git init', 'git commit -m "Initial commit"'],
  };
}

function clone(state: GraphState): GraphState {
  return {
    commits: { ...state.commits },
    branches: { ...state.branches },
    laneOf: { ...state.laneOf },
    head: state.head,
    nextLane: state.nextLane,
    rowCounter: state.rowCounter,
    commitCounter: state.commitCounter,
    log: [...state.log],
  };
}

export function ancestors(state: GraphState, id: string): Set<string> {
  const seen = new Set<string>();
  const stack = [id];
  while (stack.length) {
    const cur = stack.pop()!;
    if (seen.has(cur) || !state.commits[cur]) continue;
    seen.add(cur);
    stack.push(...state.commits[cur].parents);
  }
  return seen;
}

export function isAncestor(state: GraphState, a: string, b: string): boolean {
  return ancestors(state, b).has(a);
}

export function reachableSet(state: GraphState): Set<string> {
  const all = new Set<string>();
  for (const head of Object.values(state.branches)) {
    for (const id of ancestors(state, head)) all.add(id);
  }
  return all;
}

function newId(state: GraphState): string {
  state.commitCounter += 1;
  return 'c' + state.commitCounter.toString(36) + Math.random().toString(36).slice(2, 5);
}

export function commit(state: GraphState, message?: string): GraphState {
  const next = clone(state);
  const id = newId(next);
  const msg = message?.trim() || `Work in progress ${next.commitCounter}`;
  next.commits[id] = { id, parents: [next.branches[next.head]], lane: next.laneOf[next.head], row: next.rowCounter++, message: msg };
  next.branches[next.head] = id;
  next.log.push(`git commit -m "${msg}"`);
  return next;
}

export function createBranch(state: GraphState, name: string): GraphState {
  if (!name || state.branches[name]) return state;
  const next = clone(state);
  next.laneOf[name] = next.nextLane++;
  next.branches[name] = next.branches[next.head];
  next.log.push(`git branch ${name}`);
  return next;
}

export function switchBranch(state: GraphState, name: string): GraphState {
  if (!state.branches[name] || name === state.head) return state;
  const next = clone(state);
  next.head = name;
  next.log.push(`git switch ${name}`);
  return next;
}

export function mergeBranch(state: GraphState, other: string): GraphState {
  if (other === state.head || !state.branches[other]) return state;
  const myHead = state.branches[state.head];
  const otherHead = state.branches[other];
  const next = clone(state);
  if (isAncestor(next, otherHead, myHead)) {
    next.log.push(`git merge ${other}  # already up to date`);
    return next;
  }
  if (isAncestor(next, myHead, otherHead)) {
    next.branches[next.head] = otherHead;
    next.log.push(`git merge ${other}  # fast-forward`);
    return next;
  }
  const id = newId(next);
  next.commits[id] = { id, parents: [myHead, otherHead], lane: next.laneOf[next.head], row: next.rowCounter++, message: `Merge branch '${other}' into ${next.head}` };
  next.branches[next.head] = id;
  next.log.push(`git merge ${other}`);
  return next;
}

export function rebaseOnto(state: GraphState, onto: string): GraphState {
  if (onto === state.head || !state.branches[onto]) return state;
  const myHead = state.branches[state.head];
  const ontoHead = state.branches[onto];
  if (isAncestor(state, ontoHead, myHead)) {
    const next = clone(state);
    next.log.push(`git rebase ${onto}  # already up to date`);
    return next;
  }
  const next = clone(state);
  const ontoAncestors = ancestors(next, ontoHead);
  // Walk back from myHead collecting the unique chain not shared with `onto`.
  const chain: CommitNode[] = [];
  let cur = myHead;
  while (cur && !ontoAncestors.has(cur)) {
    chain.unshift(next.commits[cur]);
    cur = next.commits[cur].parents[0];
  }
  let parent = ontoHead;
  for (const old of chain) {
    const id = newId(next);
    next.commits[id] = { id, parents: [parent], lane: next.laneOf[next.head], row: next.rowCounter++, message: old.message };
    parent = id;
  }
  next.branches[next.head] = parent;
  next.log.push(`git rebase ${onto}`);
  return next;
}

export function cherryPick(state: GraphState, commitId: string): GraphState {
  if (!state.commits[commitId]) return state;
  const next = clone(state);
  const id = newId(next);
  const src = next.commits[commitId];
  next.commits[id] = { id, parents: [next.branches[next.head]], lane: next.laneOf[next.head], row: next.rowCounter++, message: `${src.message} (cherry-picked)` };
  next.branches[next.head] = id;
  next.log.push(`git cherry-pick ${shortId(commitId)}`);
  return next;
}

export function resetTo(state: GraphState, commitId: string, mode: 'soft' | 'mixed' | 'hard'): GraphState {
  if (!state.commits[commitId]) return state;
  const next = clone(state);
  next.branches[next.head] = commitId;
  next.log.push(`git reset --${mode} ${shortId(commitId)}`);
  return next;
}

export function revertCommit(state: GraphState, commitId: string): GraphState {
  if (!state.commits[commitId]) return state;
  const next = clone(state);
  const id = newId(next);
  const src = next.commits[commitId];
  next.commits[id] = { id, parents: [next.branches[next.head]], lane: next.laneOf[next.head], row: next.rowCounter++, message: `Revert "${src.message}"` };
  next.branches[next.head] = id;
  next.log.push(`git revert ${shortId(commitId)}`);
  return next;
}
