import { useMemo, useState } from 'preact/hooks';
import Fuse from 'fuse.js';

type FixEntry = { slug: string; title: string; symptom: string; severity: 'minor' | 'moderate' | 'scary' };

const severityColor: Record<FixEntry['severity'], string> = {
  minor: 'var(--color-level-beginner)',
  moderate: 'var(--color-warning)',
  scary: 'var(--color-danger)',
};

export default function FixList({ entries, base }: { entries: FixEntry[]; base: string }) {
  const [query, setQuery] = useState('');
  const fuse = useMemo(() => new Fuse(entries, { keys: ['title', 'symptom'], threshold: 0.36, ignoreLocation: true }), [entries]);
  const results = query.trim() ? fuse.search(query).map((r) => r.item) : entries;

  return (
    <div>
      <div class="mb-6 flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" class="text-[var(--color-ink-faint)]">
          <circle cx="10.5" cy="10.5" r="6.5" />
          <line x1="20" y1="20" x2="15.3" y2="15.3" />
        </svg>
        <input
          value={query}
          onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
          placeholder="I want to… / I have a problem where…"
          aria-label="Search Fix It guides"
          class="flex-1 bg-transparent text-sm text-[var(--color-ink)] outline-none placeholder:text-[var(--color-ink-faint)]"
        />
      </div>
      <div class="grid gap-3 sm:grid-cols-2">
        {results.map((f) => (
          <a href={`${base}/${f.slug}`} class="glass-card flex flex-col gap-1.5 p-4">
            <div class="flex items-center justify-between gap-2">
              <h3 class="text-[14px] font-semibold text-[var(--color-ink)]">{f.title}</h3>
              <span class="h-2 w-2 shrink-0 rounded-full" style={{ background: severityColor[f.severity] }} title={f.severity} />
            </div>
            <p class="line-clamp-2 text-[12.5px] leading-relaxed text-[var(--color-ink-muted)]">{f.symptom}</p>
          </a>
        ))}
        {results.length === 0 && <p class="text-sm text-[var(--color-ink-faint)]">No matches — try the decision tree above instead.</p>}
      </div>
    </div>
  );
}
