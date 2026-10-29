"use client";

import { useActionState } from "react";
import type { WorkFormState, WorkValues } from "./actions";

type Props = {
  action: (prev: WorkFormState, formData: FormData) => Promise<WorkFormState>;
  defaultValues?: WorkValues;
  submitLabel: string;
};

const fields: {
  name: keyof WorkValues;
  label: string;
  placeholder: string;
  required?: boolean;
}[] = [
  {
    name: "title",
    label: "タイトル",
    placeholder: "例: ○○の××",
    required: true,
  },
  {
    name: "magazine",
    label: "掲載誌・掲載アプリ",
    placeholder: "例: 週刊少年○○",
  },
  { name: "author", label: "作者", placeholder: "例: ○○○○" },
];

// 登録（/me/new）と編集（/me/[id]/edit）で共通のフォーム
export function WorkForm({ action, defaultValues, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState(action, {});
  const values = state.values ?? defaultValues;

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
      {fields.map((field) => {
        const error = state.errors?.[field.name];
        return (
          <div key={field.name}>
            <label htmlFor={field.name} className="mb-1 block font-bold">
              {field.label}
              {field.required ? (
                <span className="ml-2 text-xs text-accent">必須</span>
              ) : (
                <span className="ml-2 text-xs font-normal text-ink-soft">
                  任意
                </span>
              )}
            </label>
            <input
              id={field.name}
              name={field.name}
              defaultValue={values?.[field.name] ?? ""}
              placeholder={field.placeholder}
              maxLength={100}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? `${field.name}-error` : undefined}
              className="w-full border-[2.5px] border-ink bg-panel px-3 py-2 placeholder:text-line focus:outline-3 focus:outline-offset-2 focus:outline-accent aria-invalid:border-accent"
            />
            {error && (
              <p
                id={`${field.name}-error`}
                className="mt-1 text-sm font-bold text-accent"
              >
                {error}
              </p>
            )}
          </div>
        );
      })}
      <button
        type="submit"
        disabled={pending}
        className="border-[2.5px] border-ink bg-accent px-6 py-3 font-bold text-white shadow-[4px_4px_0_var(--color-ink)] transition-transform hover:-translate-x-px hover:-translate-y-px active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_var(--color-ink)] disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? "保存しています…" : submitLabel}
      </button>
    </form>
  );
}
