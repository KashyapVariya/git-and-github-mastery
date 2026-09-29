const KEY = 'git-mastery:progress:v1';

function read(): Set<string> {
  try {
    const raw = localStorage.getItem(KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function write(set: Set<string>) {
  try {
    localStorage.setItem(KEY, JSON.stringify([...set]));
  } catch {
    /* storage unavailable (private mode, quota, etc.) — progress just won't persist */
  }
}

export function isComplete(slug: string): boolean {
  return read().has(slug);
}

export function setComplete(slug: string, complete: boolean) {
  const set = read();
  complete ? set.add(slug) : set.delete(slug);
  write(set);
  document.dispatchEvent(new CustomEvent('progress:change', { detail: { slug, complete } }));
}

export function completedCount(slugs: string[]): number {
  const set = read();
  return slugs.filter((s) => set.has(s)).length;
}

export function allCompleted(): string[] {
  return [...read()];
}
