import { useMemo, useState } from 'preact/hooks';
import type { CheatCategory } from '../../data/cheatsheet';
import Fuse from 'fuse.js';

export default function CheatSheetFilter({ categories }: { categories: CheatCategory[] }) {
  const [query, setQuery] = useState('');

  const flat = useMemo(
    () => categories.flatMap((cat) => cat.commands.map((c) => ({ ...c, category: cat.title, categoryId: cat.id }))),
    [categories],
  );

  const fuse = useMemo(
    () => new Fuse(flat, { keys: ['command', 'description', 'category'], threshold: 0.35, ignoreLocation: true }),
    [flat],
  );

  const results = query.trim() ? fuse.search(query).map((r) => r.item) : null;

  async function copy(cmd: string, btn: HTMLButtonElement) {
    try {
      await navigator.clipboard.writeText(cmd);
    } catch {
      /* ignore */
    }
    btn.dataset.copied = 'true';
    window.setTimeout(() => delete btn.dataset.copied, 1200);
  }

  return (
    <div>
      <div class="sticky top-[calc(var(--header-h,64px)+8px)] z-20 mb-8 flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/90 px-4 py-3 backdrop-blur print:hidden">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" class="text-[var(--color-ink-faint)]">
          <circle cx="10.5" cy="10.5" r="6.5" />
          <line x1="20" y1="20" x2="15.3" y2="15.3" />
        </svg>
        <input
          value={query}
          onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
          placeholder="Filter commands — e.g. rebase, undo, stash…"
          aria-label="Filter commands"
          class="flex-1 bg-transparent text-sm text-[var(--color-ink)] outline-none placeholder:text-[var(--color-ink-faint)]"
        />
        <button
          type="button"
          onClick={() => window.print()}
          class="flex shrink-0 items-center gap-1.5 rounded-md border border-[var(--color-border)] px-2.5 py-1 text-[12px] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
        >
          Print
        </button>
      </div>

      {results && (
        <div class="mb-10 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {results.length === 0 && <p class="text-sm text-[var(--color-ink-faint)]">No commands match "{query}".</p>}
          {results.map((c) => (
            <button
              type="button"
              onClick={(e) => copy(c.command, e.currentTarget)}
              class="group relative rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-3 text-left transition hover:border-[var(--color-git-orange)]/50 data-[copied=true]:border-[var(--color-success)]/60"
            >
              <code class="mb-1 block truncate font-mono text-[12.5px] text-[var(--color-git-orange-soft)]">{c.command}</code>
              <p class="text-[12px] leading-snug text-[var(--color-ink-muted)]">{c.description}</p>
              <span class="absolute right-2 top-2 text-[10px] text-[var(--color-ink-faint)] opacity-0 group-hover:opacity-100">copy</span>
            </button>
          ))}
        </div>
      )}

      <div class={results ? 'hidden' : 'space-y-10'}>
        {categories.map((cat) => (
          <section id={cat.id}>
            <h2 class="mb-3 text-lg font-bold text-[var(--color-ink)]">{cat.title}</h2>
            <div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {cat.commands.map((c) => (
                <button
                  type="button"
                  onClick={(e) => copy(c.command, e.currentTarget)}
                  class="group relative rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-3 text-left transition hover:border-[var(--color-git-orange)]/50 data-[copied=true]:border-[var(--color-success)]/60 print:break-inside-avoid"
                >
                  <code class="mb-1 block truncate font-mono text-[12.5px] text-[var(--color-git-orange-soft)]">{c.command}</code>
                  <p class="text-[12px] leading-snug text-[var(--color-ink-muted)]">{c.description}</p>
                  <span class="absolute right-2 top-2 text-[10px] text-[var(--color-ink-faint)] opacity-0 group-hover:opacity-100 print:hidden">copy</span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
