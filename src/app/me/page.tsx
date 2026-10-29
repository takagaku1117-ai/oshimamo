import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getThisWeekCheers } from "@/lib/cheers";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";
import { WorkCard } from "./work-card";

export const metadata: Metadata = { title: "マイページ｜推しマモ" };

export default function MyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
      <Link href="/" className="mb-8 inline-block font-display text-2xl">
        推しマモ
      </Link>
      {/* cookie を読むのでリクエストごとに描画する（Cache Components） */}
      <Suspense fallback={<p className="text-ink-soft">読み込み中…</p>}>
        <MyWorks />
      </Suspense>
    </main>
  );
}

async function MyWorks() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  // proxy のチェックは cookie を見るだけなので、ここでも確かめる
  if (!auth?.claims) redirect("/login?next=/me");

  const { data: works, error } = await supabase
    .from("works")
    .select(
      "id, title, magazine, author, rankings(issue_year, issue_no, position)",
    )
    .order("created_at", { ascending: false });
  if (error) throw error;
  const cheers = await getThisWeekCheers();

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-3xl">マイページ</h1>
        <Link
          href="/me/new"
          className="border-[2.5px] border-ink bg-accent px-5 py-2 font-bold text-white shadow-[3px_3px_0_var(--color-ink)] hover:-translate-x-px hover:-translate-y-px"
        >
          ＋ 推しを登録
        </Link>
      </div>

      {works.length === 0 ? (
        <section className="border-[2.5px] border-dashed border-ink bg-panel p-6 text-center">
          <p className="mb-1 font-bold">まだ推しがいません</p>
          <p className="text-sm text-ink-soft">
            「推しを登録」から、応援したい連載を追加しましょう。
          </p>
        </section>
      ) : (
        <ul className="grid gap-4">
          {works.map((work) => (
            <WorkCard
              key={work.id}
              work={work}
              cheerCount={cheers.get(work.id)?.length ?? 0}
            />
          ))}
        </ul>
      )}

      <footer className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4 text-sm text-ink-soft">
        <p className="break-all">{auth.claims.email} でログイン中</p>
        <form action={signOut}>
          <button type="submit" className="font-bold underline hover:text-ink">
            ログアウト
          </button>
        </form>
      </footer>
    </>
  );
}
