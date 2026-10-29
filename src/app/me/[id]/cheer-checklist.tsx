"use client";

import { useOptimistic, useState, useTransition } from "react";
import { CHEER_KINDS, type CheerKind } from "@/lib/week";
import { toggleCheer } from "./cheer-actions";

type Props = {
  workId: string;
  // 今週チェック済みの応援
  checked: CheerKind[];
  pinch: boolean;
};

// F-08: 今週の応援チェックリスト。押した瞬間にチェックが付き、保存はあとから追いつく
export function CheerChecklist({ workId, checked, pinch }: Props) {
  const [optimistic, setOptimistic] = useOptimistic(
    checked,
    (current: CheerKind[], change: { kind: CheerKind; on: boolean }) =>
      change.on
        ? [...current, change.kind]
        : current.filter((k) => k !== change.kind),
  );
  const [, startTransition] = useTransition();
  const [failed, setFailed] = useState(false);
  const done = optimistic.length;
  const complete = done === CHEER_KINDS.length;

  function toggle(kind: CheerKind, on: boolean) {
    setFailed(false);
    startTransition(async () => {
      setOptimistic({ kind, on });
      const result = await toggleCheer(workId, kind, on);
      if (!result.ok) setFailed(true);
    });
  }

  return (
    <section
      aria-labelledby="cheer-title"
      className={`mb-6 border-[2.5px] bg-panel p-4 shadow-[4px_4px_0_var(--color-ink)] sm:p-5 ${pinch ? "border-accent" : "border-ink"}`}
    >
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="cheer-title" className="font-display text-xl">
          今週の応援
        </h2>
        <p className="text-sm font-bold" aria-live="polite">
          {complete ? (
            <span className="text-accent">今週の応援コンプリート！</span>
          ) : (
            <span className="text-ink-soft">
              {done} / {CHEER_KINDS.length} できた
            </span>
          )}
        </p>
      </div>

      <ul className="grid gap-2">
        {CHEER_KINDS.map(({ kind, label, hint }) => {
          const on = optimistic.includes(kind);
          return (
            <li key={kind}>
              <label
                className={`flex cursor-pointer items-center gap-3 border-[2.5px] px-3 py-2.5 transition-colors ${on ? "border-ink bg-accent-wash" : "border-line hover:border-ink"}`}
              >
                <input
                  type="checkbox"
                  checked={on}
                  onChange={(e) => toggle(kind, e.target.checked)}
                  className="h-5 w-5 shrink-0 accent-[var(--color-accent)]"
                />
                <span className="min-w-0">
                  <span
                    className="block font-bold"
                  >
                    {label}
                  </span>
                  <span className="block text-xs text-ink-soft">{hint}</span>
                </span>
              </label>
            </li>
          );
        })}
      </ul>

      {failed && (
        <p role="alert" className="mt-3 text-sm font-bold text-accent">
          保存できませんでした。もう一度押してください。
        </p>
      )}
      <p className="mt-3 text-xs text-ink-soft">
        毎週月曜日に、チェックはまっさらに戻ります。
      </p>
    </section>
  );
}
