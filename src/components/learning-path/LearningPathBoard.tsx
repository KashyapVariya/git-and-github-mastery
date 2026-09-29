import { useEffect, useState } from 'preact/hooks';
import { completedCount, isComplete, setComplete } from '../../lib/progress';
import type { LearningPlan } from '../../data/learning-path';

function toId(href: string) {
  return href.replace(/^\//, '');
}

function withBase(href: string) {
  const base = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '');
  return `${base}${href}`;
}

function StageRing({ ids }: { ids: string[] }) {
  const [done, setDone] = useState(0);
  useEffect(() => {
    const update = () => setDone(completedCount(ids));
    update();
    document.addEventListener('progress:change', update);
    return () => document.removeEventListener('progress:change', update);
  }, [ids]);
  const pct = Math.round((done / ids.length) * 100);
  return (
    <span class="chip shrink-0" style={pct === 100 ? { color: 'var(--color-success)', borderColor: 'color-mix(in srgb, var(--color-success) 45%, var(--color-border))' } : {}}>
      {done}/{ids.length} done
    </span>
  );
}

function TaskRow({ title, href }: { title: string; href: string }) {
  const id = toId(href);
  const [done, setDone] = useState(false);
  useEffect(() => setDone(isComplete(id)), [id]);

  return (
    <div class="flex items-center gap-2.5 py-1.5">
      <button
        type="button"
        aria-pressed={done}
        aria-label={done ? `Mark ${title} incomplete` : `Mark ${title} complete`}
        onClick={() => {
          setComplete(id, !done);
          setDone(!done);
        }}
        class={`grid h-4.5 w-4.5 shrink-0 place-items-center rounded border transition ${done ? 'border-[var(--color-success)] bg-[var(--color-success)]/20 text-[var(--color-success)]' : 'border-[var(--color-border)] text-transparent'}`}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <path d="M5 12.5 9.5 17 19 7" />
        </svg>
      </button>
      <a href={withBase(href)} class={`text-[13.5px] transition hover:text-[var(--color-git-orange-soft)] ${done ? 'text-[var(--color-ink-faint)] line-through' : 'text-[var(--color-ink-muted)]'}`}>
        {title}
      </a>
    </div>
  );
}

export default function LearningPathBoard({ plan }: { plan: LearningPlan }) {
  return (
    <div class="relative space-y-8 border-l-2 border-[var(--color-border)] pl-6 sm:pl-8">
      {plan.stages.map((stage, i) => {
        const ids = stage.tasks.map((t) => toId(t.href));
        return (
          <div class="relative" data-reveal>
            <span class="absolute -left-[31px] top-1 grid h-4 w-4 place-items-center rounded-full border-2 border-[var(--color-bg)] bg-gradient-to-br from-[var(--color-git-orange)] to-[var(--color-violet)] text-[9px] font-bold text-black sm:-left-[39px]">
              {i + 1}
            </span>
            <div class="glass-card p-5">
              <div class="mb-1 flex flex-wrap items-center justify-between gap-2">
                <h3 class="text-[15px] font-semibold text-[var(--color-ink)]">{stage.title}</h3>
                <StageRing ids={ids} />
              </div>
              <p class="mb-3 text-[13px] text-[var(--color-ink-muted)]">{stage.focus}</p>
              <div class="mb-3 divide-y divide-[var(--color-border-soft)]">
                {stage.tasks.map((t) => (
                  <TaskRow title={t.title} href={t.href} />
                ))}
              </div>
              <div class="rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-2.5 text-[12.5px] leading-relaxed text-[var(--color-ink-muted)]">
                <strong class="text-[var(--color-ink)]">Practice:</strong> {stage.practice}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
