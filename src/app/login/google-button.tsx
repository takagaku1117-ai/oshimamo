"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { safeNext } from "@/lib/safe-next";
import { createClient } from "@/lib/supabase/client";

export function GoogleButton() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(searchParams.has("error"));

  async function signIn() {
    setLoading(true);
    setFailed(false);
    const callback = new URL("/auth/callback", window.location.origin);
    callback.searchParams.set("next", safeNext(searchParams.get("next")));

    const { error } = await createClient().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: callback.toString() },
    });
    // 成功すると Google の画面に移動するので、ここに来るのは失敗したときだけ
    if (error) {
      setLoading(false);
      setFailed(true);
    }
  }

  return (
    <>
      {failed && (
        <p
          role="alert"
          className="mb-4 border-[2.5px] border-accent bg-accent-wash p-3 text-sm font-bold text-accent"
        >
          ログインできませんでした。もう一度お試しください。
        </p>
      )}
      <button
        type="button"
        onClick={signIn}
        disabled={loading}
        className="w-full border-[2.5px] border-ink bg-accent px-6 py-3 font-bold text-white shadow-[4px_4px_0_var(--color-ink)] transition-transform hover:-translate-x-px hover:-translate-y-px active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_var(--color-ink)] disabled:cursor-wait disabled:opacity-70"
      >
        {loading ? "Google に移動しています…" : "Googleでログイン"}
      </button>
    </>
  );
}
