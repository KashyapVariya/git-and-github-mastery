import { useEffect, useRef, useState } from 'preact/hooks';
import Fuse from 'fuse.js';

type Entry = {
  type: 'topic' | 'fix' | 'glossary' | 'command' | 'page';
  title: string;
  description: string;
  url: string;
  tags?: string[];
  level?: string;
};

const RECENT_KEY = 'git-mastery:recent-searches:v1';

function readRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function pushRecent(term: string) {
  try {
    const list = readRecent().filter((t) => t !== term);
    list.unshift(term);
    localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, 6)));
  } catch {
    /* ignore */
  }
}

const typeLabel: Record<Entry['type'], string> = {
  topic: 'Topic',
  fix: 'Fix It',
  glossary: 'Glossary',
  command: 'Command',
  page: 'Page',
};

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [active, setActive] = useState(0);
  const [recent, setRecent] = useState<string[]>([]);
  const fuseRef = useRef<Fuse<Entry> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function ensureIndex() {
    if (loaded) return;
    try {
      const base = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '');
      const res = await fetch(`${base}/search-index.json`);
      const data: Entry[] = await res.json();
      setEntries(data);
      fuseRef.current = new Fuse(data, {
        keys: [
          { name: 'title', weight: 0.6 },
          { name: 'tags', weight: 0.25 },
          { name: 'description', weight: 0.15 },
        ],
        threshold: 0.34,
        ignoreLocation: true,
      });
      setLoaded(true);
    } catch {
      /* offline / not yet generated — palette just stays empty */
    }
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isK = e.key.toLowerCase() === 'k';
      if ((e.metaKey || e.ctrlKey) && isK) {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    const onTrigger = () => setOpen(true);
    document.addEventListener('keydown', onKey);
    document.querySelectorAll('[data-cmdk-trigger]').forEach((el) => el.addEventListener('click', onTrigger));
    return () => {
      document.removeEventListener('keydown', onKey);
      document.querySelectorAll('[data-cmdk-trigger]').forEach((el) => el.removeEventListener('click', onTrigger));
    };
  }, []);

  useEffect(() => {
    if (open) {
      ensureIndex();
      setRecent(readRecent());
      setQuery('');
      setActive(0);
      document.body.style.overflow = 'hidden';
      window.setTimeout(() => inputRef.current?.focus(), 30);
    } else {
      document.body.style.overflow = '';
    }
  }, [open]);

  const results: Entry[] = query.trim()
    ? (fuseRef.current?.search(query).slice(0, 8).map((r) => r.item) ?? [])
    : entries.slice(0, 6);

  function go(entry: Entry) {
    if (query.trim()) pushRecent(query.trim());
    setOpen(false);
    window.location.href = entry.url;
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter' && results[active]) {
      e.preventDefault();
      go(results[active]);
    }
  }

  if (!open) return null;

  return (
    <div class="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[12vh]" role="dialog" aria-modal="true" aria-label="Command palette">
      <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div class="glass-card relative w-full max-w-xl overflow-hidden !bg-[var(--color-bg-elevated)]">
        <div class="flex items-center gap-2 border-b border-[var(--color-border)] px-4 py-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" class="text-[var(--color-ink-faint)]">
            <circle cx="10.5" cy="10.5" r="6.5" />
            <line x1="20" y1="20" x2="15.3" y2="15.3" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onInput={(e) => {
              setQuery((e.target as HTMLInputElement).value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Search topics, commands, glossary…"
            aria-label="Search topics, commands, and glossary"
            class="flex-1 bg-transparent py-1 text-sm text-[var(--color-ink)] outline-none placeholder:text-[var(--color-ink-faint)]"
          />
          <kbd class="rounded border border-[var(--color-border)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--color-ink-faint)]">esc</kbd>
        </div>

        <div class="max-h-[55vh] overflow-y-auto p-2">
          {!query.trim() && recent.length > 0 && (
            <div class="px-2 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-ink-faint)]">Recent</div>
          )}
          {!query.trim() &&
            recent.map((term) => (
              <button
                type="button"
                class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-[var(--color-ink-muted)] hover:bg-white/5"
                onClick={() => setQuery(term)}
              >
                {term}
              </button>
            ))}

          <div class="px-2 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-ink-faint)]">
            {query.trim() ? `Results` : 'Jump to'}
          </div>
          {results.length === 0 && <p class="px-3 py-6 text-center text-sm text-[var(--color-ink-faint)]">No matches yet.</p>}
          {results.map((entry, i) => (
            <button
              type="button"
              class={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition ${
                i === active ? 'bg-white/8' : 'hover:bg-white/5'
              }`}
              onMouseEnter={() => setActive(i)}
              onClick={() => go(entry)}
            >
              <span class="min-w-0">
                <span class="block truncate text-sm text-[var(--color-ink)]">{entry.title}</span>
                <span class="block truncate text-xs text-[var(--color-ink-faint)]">{entry.description}</span>
              </span>
              <span class="chip shrink-0">{typeLabel[entry.type]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
