import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getWork } from "@/lib/work";
import { deleteWork, updateWork } from "../../actions";
import { WorkForm } from "../../work-form";
import { DeleteButton } from "../delete-button";

export const metadata: Metadata = { title: "推しを編集｜推しマモ" };

export default function EditWorkPage({ params }: PageProps<"/me/[id]/edit">) {
  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 py-10">
      {/* params はリクエスト時のデータなので Suspense の中で読む（Cache Components） */}
      <Suspense fallback={<p className="text-ink-soft">読み込み中…</p>}>
        <EditWork params={params} />
      </Suspense>
    </main>
  );
}

async function EditWork({
  params,
}: Pick<PageProps<"/me/[id]/edit">, "params">) {
  const { id } = await params;
  const work = await getWork(id);

  return (
    <>
      <Link
        href={`/me/${work.id}`}
        className="mb-8 inline-block text-sm font-bold underline"
      >
        ← 作品ページへ
      </Link>
      <section className="mb-8 border-[2.5px] border-ink bg-panel p-5 shadow-[4px_4px_0_var(--color-ink)] sm:p-6">
        <h1 className="mb-5 font-display text-2xl">推しを編集</h1>
        <WorkForm
          action={updateWork.bind(null, work.id)}
          defaultValues={{
            title: work.title,
            magazine: work.magazine ?? "",
            author: work.author ?? "",
          }}
          submitLabel="保存する"
        />
      </section>
      <DeleteButton action={deleteWork.bind(null, work.id)} />
    </>
  );
}
