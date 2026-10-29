import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "ページが見つかりません｜推しマモ" };

export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-md flex-1 px-4 py-16">
      <Link href="/" className="mb-8 inline-block font-display text-2xl">
        推しマモ
      </Link>
      <section className="border-[2.5px] border-ink bg-panel p-6 shadow-[4px_4px_0_var(--color-ink)]">
        <p className="mb-1 font-display text-5xl text-accent">404</p>
        <h1 className="mb-2 font-display text-2xl">ページが見つかりません</h1>
        <p className="mb-6 text-sm text-ink-soft">
          URL がまちがっているか、作品が削除された可能性があります。
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/me"
            className="border-[2.5px] border-ink bg-accent px-5 py-2 font-bold text-white shadow-[3px_3px_0_var(--color-ink)] hover:-translate-x-px hover:-translate-y-px"
          >
            マイページへ
          </Link>
          <Link
            href="/"
            className="border-[2.5px] border-ink bg-panel px-5 py-2 font-bold shadow-[3px_3px_0_var(--color-ink)] hover:-translate-x-px hover:-translate-y-px"
          >
            トップへ
          </Link>
        </div>
      </section>
    </main>
  );
}
