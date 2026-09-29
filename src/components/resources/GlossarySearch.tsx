import { useMemo, useState } from 'preact/hooks';
import Fuse from 'fuse.js';
import type { GlossaryTerm } from '../../data/glossary';

export default function GlossarySearch({ terms }: { terms: GlossaryTerm[] }) {
  const [query, setQuery] = useState('');
  const fuse = useMemo(() => new Fuse(terms, { keys: ['term', 'definition'], threshold: 0.32, ignoreLocation: true }), [terms]);
  const results = query.trim() ? fuse.search(query).map((r) => r.item) : terms;

  return (
    <div>
      <div class="sticky top-[calc(var(--header-h,64px)+8px)] z-20 mb-8 flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/90 px-4 py-3 backdrop-blur">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" class="text-[var(--color-ink-faint)]">
          <circle cx="10.5" cy="10.5" r="6.5" />
          <line x1="20" y1="20" x2="15.3" y2="15.3" />
        </svg>
        <input
          value={query}
          onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
          placeholder="Search terms — e.g. rebase, HEAD, fork…"
          aria-label="Search glossary terms"
          class="flex-1 bg-transparent text-sm text-[var(--color-ink)] outline-none placeholder:text-[var(--color-ink-faint)]"
        />
        <span class="shrink-0 text-[11px] text-[var(--color-ink-faint)]">{results.length} terms</span>
      </div>

      <dl class="grid gap-3 sm:grid-cols-2">
        {results.map((t) => (
          <div class="glass-card p-4">
            <dt class="mb-1 font-mono text-[13.5px] font-semibold text-[var(--color-git-orange-soft)]">{t.term}</dt>
            <dd class="text-[13px] leading-relaxed text-[var(--color-ink-muted)]">{t.definition}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
