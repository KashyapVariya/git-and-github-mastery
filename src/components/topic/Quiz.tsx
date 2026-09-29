import { useState } from 'preact/hooks';
import type { Quiz as QuizType } from '../../data/quizzes';

export default function Quiz({ quiz }: { quiz: QuizType }) {
  const [answers, setAnswers] = useState<(number | null)[]>(Array(quiz.questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);

  const score = answers.reduce<number>((acc, a, i) => (a === quiz.questions[i].correctIndex ? acc + 1 : acc), 0);
  const allAnswered = answers.every((a) => a !== null);

  function pick(qi: number, oi: number) {
    if (submitted) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[qi] = oi;
      return next;
    });
  }

  if (submitted) {
    const pct = Math.round((score / quiz.questions.length) * 100);
    return (
      <div class="glass-card relative overflow-hidden p-6 text-center">
        {pct >= 80 && <Particles />}
        <p class="text-sm font-semibold uppercase tracking-wide text-[var(--color-ink-faint)]">Your score</p>
        <p class="my-2 text-4xl font-bold text-gradient">
          {score}/{quiz.questions.length}
        </p>
        <p class="mb-5 text-sm text-[var(--color-ink-muted)]">
          {pct === 100 ? 'Perfect score — this section has clicked.' : pct >= 60 ? 'Solid! Revisit the missed ones below.' : 'Worth another pass through this section.'}
        </p>
        <div class="mb-5 space-y-3 text-left">
          {quiz.questions.map((q, i) => {
            const correct = answers[i] === q.correctIndex;
            return (
              <div class={`rounded-lg border px-3.5 py-3 text-sm ${correct ? 'border-[var(--color-success)]/40 bg-[var(--color-success)]/5' : 'border-[var(--color-danger)]/40 bg-[var(--color-danger)]/5'}`}>
                <p class="mb-1 font-medium text-[var(--color-ink)]">{q.question}</p>
                <p class="text-[var(--color-ink-muted)]">
                  {correct ? 'Correct — ' : `Correct answer: ${q.options[q.correctIndex]}. `}
                  {q.explanation}
                </p>
              </div>
            );
          })}
        </div>
        <button
          type="button"
          class="btn-magnetic rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-2 text-sm font-medium text-[var(--color-ink)] hover:border-[var(--color-git-orange)]/50"
          onClick={() => {
            setAnswers(Array(quiz.questions.length).fill(null));
            setSubmitted(false);
          }}
        >
          Retake quiz
        </button>
      </div>
    );
  }

  return (
    <div class="space-y-5">
      {quiz.questions.map((q, qi) => (
        <div class="glass-card p-5">
          <p class="mb-3 text-sm font-medium text-[var(--color-ink)]">
            {qi + 1}. {q.question}
          </p>
          <div class="grid gap-2 sm:grid-cols-2">
            {q.options.map((opt, oi) => (
              <button
                type="button"
                onClick={() => pick(qi, oi)}
                class={`rounded-lg border px-3 py-2 text-left text-[13.5px] transition ${
                  answers[qi] === oi
                    ? 'border-[var(--color-git-orange)] bg-[var(--color-git-orange)]/10 text-[var(--color-ink)]'
                    : 'border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-ink-muted)] hover:border-[var(--color-ink-faint)]'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button
        type="button"
        disabled={!allAnswered}
        onClick={() => setSubmitted(true)}
        class="btn-magnetic w-full rounded-xl bg-gradient-to-r from-[var(--color-git-orange)] to-[var(--color-violet)] px-4 py-3 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
      >
        Submit answers
      </button>
    </div>
  );
}

function Particles() {
  const dots = Array.from({ length: 18 });
  return (
    <div class="pointer-events-none absolute inset-0">
      {dots.map((_, i) => (
        <span
          class="absolute h-1.5 w-1.5 rounded-full"
          style={{
            left: `${(i * 53) % 100}%`,
            top: `${(i * 31) % 100}%`,
            background: i % 2 === 0 ? 'var(--color-git-orange)' : 'var(--color-violet)',
            animation: `float ${3 + (i % 4)}s ease-in-out ${i * 0.15}s infinite`,
            opacity: 0.55,
          }}
        />
      ))}
    </div>
  );
}
