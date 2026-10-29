"use client";

import { useActionState, useState } from "react";
import type { RankingFormState } from "../rank-actions";

type Props = {
  action: (
    prev: RankingFormState,
    formData: FormData,
  ) => Promise<RankingFormState>;
  defaultYear: number;
  defaultNo: number | null;
  // すでに記録がある号（"2026-47" の形）。入れ直すと上書きになる
  recordedIssues: string[];
};

const inputClass =
  "shrink-0 border-[2.5px] border-ink bg-panel px-3 py-2 text-lg focus:outline-3 focus:outline-offset-2 focus:outline-accent aria-invalid:border-accent";

export function RankForm({
  action,
  defaultYear,
  defaultNo,
  recordedIssues,
}: Props) {
  const [state, formAction, pending] = useActionState(action, {});
  const [year, setYear] = useState(String(defaultYear));
  const [no, setNo] = useState(defaultNo ? String(defaultNo) : "");
  const overwriting = recordedIssues.includes(`${Number(year)}-${Number(no)}`);

  return (
    <form action={formAction} className="grid gap-5" noValidate>
      {state.message && (
        <p
          role="alert"
          className="border-[2.5px] border-accent bg-accent-wash p-3 text-sm font-bold text-accent"
        >
          {state.message}
        </p>
      )}

      <fieldset>
        <legend className="mb-1 font-bold">号数</legend>
        <div className="flex items-center gap-2">
          <input
            name="issue_year"
            aria-label="年"
            inputMode="numeric"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            aria-invalid={Boolean(state.errors?.issue_year)}
            className={`${inputClass} w-28`}
          />
          <span>年</span>
          <input
            name="issue_no"
            aria-label="号"
            inputMode="numeric"
            value={no}
            onChange={(e) => setNo(e.target.value)}
            placeholder="47"
            aria-invalid={Boolean(state.errors?.issue_no)}
            className={`${inputClass} w-20`}
          />
          <span>号</span>
        </div>
        {[state.errors?.issue_year, state.errors?.issue_no]
          .filter(Boolean)
          .map((error) => (
            <p key={error} className="mt-1 text-sm font-bold text-accent">
              {error}
            </p>
          ))}
        {overwriting && (
          <p className="mt-1 text-sm text-ink-soft">
            この号はもう記録があります。保存すると上書きします。
          </p>
        )}
      </fieldset>

      <div>
        <label htmlFor="position" className="mb-1 block font-bold">
          掲載順
        </label>
        <div className="flex items-center gap-2">
          <input
            id="position"
            name="position"
            inputMode="numeric"
            defaultValue={state.values?.position ?? ""}
            placeholder="5"
            aria-invalid={Boolean(state.errors?.position)}
            aria-describedby="position-hint"
            className={`${inputClass} w-20`}
          />
          <span>番目</span>
        </div>
        <p id="position-hint" className="mt-1 text-xs text-ink-soft">
          巻頭なら 1。目次で前から何番目に載っていたかを入れます。
        </p>
        {state.errors?.position && (
          <p className="mt-1 text-sm font-bold text-accent">
            {state.errors.position}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="border-[2.5px] border-ink bg-accent px-6 py-3 font-bold text-white shadow-[4px_4px_0_var(--color-ink)] transition-transform hover:-translate-x-px hover:-translate-y-px active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_var(--color-ink)] disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? "記録しています…" : overwriting ? "上書きする" : "記録する"}
      </button>
    </form>
  );
}
