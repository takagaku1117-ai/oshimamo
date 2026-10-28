import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";

export const metadata: Metadata = { title: "マイページ｜推しマモ" };

export default function MyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
      <Link href="/" className="mb-8 inline-block font-display text-2xl">
        推しマモ
      </Link>
      <h1 className="mb-6 font-display text-3xl">マイページ</h1>
      {/* cookie を読むのでリクエストごとに描画する（Cache Components） */}
      <Suspense fallback={<p className="text-ink-soft">読み込み中…</p>}>
        <Account />
      </Suspense>
    </main>
  );
}

async function Account() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  // proxy のチェックは cookie を見るだけなので、ここでも確かめる
  if (!data?.claims) redirect("/login?next=/me");

  return (
    <section className="border-[2.5px] border-ink bg-panel p-5 shadow-[4px_4px_0_var(--color-ink)]">
      <p className="mb-1 text-sm text-ink-soft">ログイン中</p>
      <p className="mb-4 font-bold break-all">{data.claims.email}</p>
      <p className="mb-5 text-sm text-ink-soft">
        推し作品の登録はこれから作ります（ステップ4）。
      </p>
      <form action={signOut}>
        <button
          type="submit"
          className="border-[2.5px] border-ink bg-panel px-5 py-2 text-sm font-bold shadow-[3px_3px_0_var(--color-ink)] hover:-translate-x-px hover:-translate-y-px"
        >
          ログアウト
        </button>
      </form>
    </section>
  );
}
