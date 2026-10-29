import type { Metadata } from "next";
import Link from "next/link";
import { createWork } from "../actions";
import { WorkForm } from "../work-form";

export const metadata: Metadata = { title: "推しを登録｜推しマモ" };

export default function NewWorkPage() {
  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 py-10">
      <Link
        href="/me"
        className="mb-8 inline-block text-sm font-bold underline"
      >
        ← マイページへ
      </Link>
      <section className="border-[2.5px] border-ink bg-panel p-5 shadow-[4px_4px_0_var(--color-ink)] sm:p-6">
        <h1 className="mb-5 font-display text-2xl">推しを登録</h1>
        <WorkForm action={createWork} submitLabel="登録する" />
      </section>
    </main>
  );
}
