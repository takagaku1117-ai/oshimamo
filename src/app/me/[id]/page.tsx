import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { formatIssue, isPinch, sortByIssue } from "@/lib/ranking";
import { getThisWeekCheers } from "@/lib/cheers";
import { getRankings } from "@/lib/rankings";
import { getWork } from "@/lib/work";
import { CheerChecklist } from "./cheer-checklist";
import { deleteRanking } from "./rank-actions";
import { RankingChart } from "./ranking-chart";

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
  const rankings = sortByIssue(await getRankings(work.id));
  const pinch = isPinch(rankings);
  const cheers = (await getThisWeekCheers(work.id)).get(work.id) ?? [];
  const sub = [work.magazine, work.author].filter(Boolean).join(" ／ ");

  return (
    <>
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
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

      {/* F-06 */}
      {pinch && (
        <p
          role="status"
          className="mb-6 border-[2.5px] border-accent bg-accent-wash p-4 font-bold text-accent"
        >
          <span className="mr-2 inline-block bg-accent px-2 py-0.5 font-display text-white">
            ピンチ
          </span>
          2号続けて掲載順が下がっています。今週のアンケートで応援しよう！
        </p>
      )}

      {/* F-08（発展アイデア①） */}
      <CheerChecklist workId={work.id} checked={cheers} pinch={pinch} />

      <section className="mb-6 border-[2.5px] border-ink bg-panel p-4 shadow-[4px_4px_0_var(--color-ink)] sm:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl">掲載順の推移</h2>
          <Link
            href={`/me/${work.id}/rank`}
            className="border-[2.5px] border-ink bg-accent px-4 py-1.5 text-sm font-bold text-white shadow-[3px_3px_0_var(--color-ink)] hover:-translate-x-px hover:-translate-y-px"
          >
            ＋ 掲載順を記録
          </Link>
        </div>
        {rankings.length >= 2 ? (
          <RankingChart points={rankings} pinch={pinch} />
        ) : (
          <p className="py-8 text-center text-sm text-ink-soft">
            {rankings.length === 0
              ? "まだ記録がありません。毎週の掲載順を記録しましょう。"
              : "2号分記録すると、グラフで推移が見られます。"}
          </p>
        )}
      </section>

      {rankings.length > 0 && (
        <section aria-labelledby="records">
          <h2 id="records" className="mb-2 font-bold">
            記録（新しい順）
          </h2>
          <ul className="divide-y divide-line border-[2.5px] border-ink bg-panel">
            {[...rankings].reverse().map((r) => (
              <li key={r.id} className="flex items-center gap-3 px-4 py-2">
                <span className="flex-1">{formatIssue(r)}</span>
                <span className="font-bold">{r.position}番目</span>
                <form action={deleteRanking.bind(null, work.id, r.id)}>
                  <button
                    type="submit"
                    aria-label={`${formatIssue(r)}の記録を削除`}
                    className="text-sm text-ink-soft underline hover:text-accent"
                  >
                    削除
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
