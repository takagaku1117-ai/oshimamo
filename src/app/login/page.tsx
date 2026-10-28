import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { GoogleButton } from "./google-button";

export const metadata: Metadata = { title: "ログイン｜推しマモ" };

export default function LoginPage() {
  return (
    <main className="mx-auto w-full max-w-md flex-1 px-4 py-16">
      <Link href="/" className="mb-8 inline-block font-display text-2xl">
        推しマモ
      </Link>
      <section className="border-[2.5px] border-ink bg-panel p-6 shadow-[4px_4px_0_var(--color-ink)]">
        <h1 className="mb-2 font-display text-2xl">ログイン</h1>
        <p className="mb-6 text-sm text-ink-soft">
          推しの記録をあなたのアカウントに保存します。
        </p>
        {/* ?next= と ?error= を読むので Suspense で囲む */}
        <Suspense fallback={<div className="h-[52px]" />}>
          <GoogleButton />
        </Suspense>
      </section>
    </main>
  );
}
