import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getWork } from "@/lib/work";

export const metadata: Metadata = { title: "推し作品｜推しマモ" };

export default function WorkPage({ params }: PageProps<"/me/[id]">) {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
      <Link
        href="/me"
        className="mb-8 inline-block text-sm font-bold underline"
      >
        ← マイページへ
      </Link>
      {/* params はリクエスト時のデータなので Suspense の中で読む（Cache Components） */}
      <Suspense fallback={<p className="text-ink-soft">読み込み中…</p>}>
        <WorkDetail params={params} />
      </Suspense>
    </main>
  );
}

async function WorkDetail({ params }: Pick<PageProps<"/me/[id]">, "params">) {
  const { id } = await params;
  const work = await getWork(id);
  const sub = [work.magazine, work.author].filter(Boolean).join(" ／ ");

  return (
    <>
      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-display text-3xl break-words">{work.title}</h1>
          {sub && <p className="text-ink-soft">{sub}</p>}
        </div>
        <Link
          href={`/me/${work.id}/edit`}
          className="shrink-0 border-[2.5px] border-ink bg-panel px-4 py-1.5 text-sm font-bold shadow-[3px_3px_0_var(--color-ink)] hover:-translate-x-px hover:-translate-y-px"
        >
          編集・削除
        </Link>
      </header>

      <section className="border-[2.5px] border-dashed border-ink bg-panel p-6 text-center">
        <p className="mb-1 font-bold">掲載順の記録</p>
        <p className="text-sm text-ink-soft">
          毎週の掲載順の記録とグラフは、次のステップで作ります。
        </p>
      </section>
    </>
  );
}
