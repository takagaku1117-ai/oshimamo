import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { sortByIssue } from "@/lib/ranking";
import { getRankings } from "@/lib/rankings";
import { getWork } from "@/lib/work";
import { saveRanking } from "../rank-actions";
import { RankForm } from "./rank-form";

export const metadata: Metadata = { title: "掲載順を記録｜推しマモ" };

export default function RankPage({ params }: PageProps<"/me/[id]/rank">) {
  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 py-10">
      {/* params はリクエスト時のデータなので Suspense の中で読む（Cache Components） */}
      <Suspense fallback={<p className="text-ink-soft">読み込み中…</p>}>
        <Rank params={params} />
      </Suspense>
    </main>
  );
}

async function Rank({ params }: Pick<PageProps<"/me/[id]/rank">, "params">) {
  const { id } = await params;
  const work = await getWork(id);
  const rankings = await getRankings(work.id);

  // 初期値は「最新の記録の次の号」。記録がなければ今年（日本時間）
  const latest = sortByIssue(rankings).at(-1);
  const thisYear = Number(
    new Intl.DateTimeFormat("ja-JP", {
      timeZone: "Asia/Tokyo",
      year: "numeric",
    })
      .formatToParts(new Date())
      .find((part) => part.type === "year")?.value,
  );
  const next =
    latest && latest.issue_no < 99
      ? { year: latest.issue_year, no: latest.issue_no + 1 }
      : latest
        ? { year: latest.issue_year + 1, no: 1 }
        : { year: thisYear, no: null };

  return (
    <>
      <Link
        href={`/me/${work.id}`}
        className="mb-8 inline-block text-sm font-bold underline"
      >
        ← 作品ページへ
      </Link>
      <section className="border-[2.5px] border-ink bg-panel p-5 shadow-[4px_4px_0_var(--color-ink)] sm:p-6">
        <p className="mb-1 truncate text-sm text-ink-soft">{work.title}</p>
        <h1 className="mb-5 font-display text-2xl">掲載順を記録</h1>
        <RankForm
          action={saveRanking.bind(null, work.id)}
          defaultYear={next.year}
          defaultNo={next.no}
          recordedIssues={rankings.map((r) => `${r.issue_year}-${r.issue_no}`)}
        />
      </section>
    </>
  );
}
