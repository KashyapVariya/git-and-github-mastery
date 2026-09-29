import { useEffect, useState } from 'preact/hooks';
import { completedCount } from '../../lib/progress';

type Props = {
  slugs: string[];
  size?: number;
  label?: string;
};

export default function ProgressRing({ slugs, size = 56, label }: Props) {
  const [done, setDone] = useState(0);

  useEffect(() => {
    const update = () => setDone(completedCount(slugs));
    update();
    document.addEventListener('progress:change', update);
    return () => document.removeEventListener('progress:change', update);
  }, [slugs]);

  const total = slugs.length || 1;
  const pct = Math.round((done / total) * 100);
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;

  return (
    <div class="flex items-center gap-3">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} class="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-border)" stroke-width="5" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#ring-gradient)"
          stroke-width="5"
          stroke-linecap="round"
          stroke-dasharray={c}
          stroke-dashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
        <defs>
          <linearGradient id="ring-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="var(--color-git-orange)" />
            <stop offset="100%" stop-color="var(--color-violet)" />
          </linearGradient>
        </defs>
      </svg>
      <div class="text-sm">
        <p class="font-semibold text-[var(--color-ink)]">
          {done}/{slugs.length} <span class="font-normal text-[var(--color-ink-faint)]">({pct}%)</span>
        </p>
        {label && <p class="text-xs text-[var(--color-ink-faint)]">{label}</p>}
      </div>
    </div>
  );
}
