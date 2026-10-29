"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

// ブラウザの confirm ダイアログは使わず、1回目で確認表示に切り替える
export function DeleteButton({ action }: { action: () => Promise<void> }) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="text-sm font-bold text-accent underline"
      >
        この推しを削除する
      </button>
    );
  }

  return (
    <form
      action={action}
      className="border-[2.5px] border-accent bg-accent-wash p-4"
    >
      <p className="mb-3 text-sm font-bold text-accent">
        本当に削除しますか？ 掲載順の記録も消え、元に戻せません。
      </p>
      <div className="flex flex-wrap gap-3">
        <ConfirmButton />
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="border-[2.5px] border-ink bg-panel px-4 py-1.5 text-sm font-bold"
        >
          やめる
        </button>
      </div>
    </form>
  );
}

function ConfirmButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="border-[2.5px] border-ink bg-accent px-4 py-1.5 text-sm font-bold text-white disabled:cursor-wait disabled:opacity-70"
    >
      {pending ? "削除しています…" : "削除する"}
    </button>
  );
}
