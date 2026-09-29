import { useEffect, useState } from 'preact/hooks';
import { isComplete, setComplete } from '../../lib/progress';

export default function CompleteCheckbox({ slug }: { slug: string }) {
  const [done, setDone] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setDone(isComplete(slug));
    setMounted(true);
  }, [slug]);

  return (
    <button
      type="button"
      onClick={() => {
        const next = !done;
        setDone(next);
        setComplete(slug, next);
      }}
      class={`btn-magnetic flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
        done
          ? 'border-[var(--color-success)]/50 bg-[var(--color-success)]/10 text-[var(--color-success)]'
          : 'border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-ink-muted)] hover:border-[var(--color-git-orange)]/50 hover:text-[var(--color-ink)]'
      } ${mounted ? '' : 'opacity-0'}`}
      aria-pressed={done}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        {done ? <path d="M5 12.5 9.5 17 19 7" /> : <circle cx="12" cy="12" r="9" />}
      </svg>
      {done ? 'Marked as complete' : 'Mark as complete'}
    </button>
  );
}
