"use server";

import { refresh } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isCheerKind, weekStart } from "@/lib/week";

// ---- 応援チェックリスト（F-08）----

// 今週の応援を付ける／外す。週はサーバーで決める（ブラウザの時計に頼らない）
export async function toggleCheer(
  workId: string,
  kind: string,
  checked: boolean,
) {
  if (!isCheerKind(kind)) return { ok: false };

  const supabase = await createClient();
  const week_start = weekStart(new Date());
  const { error } = checked
    ? await supabase
        .from("cheers")
        .upsert(
          { work_id: workId, kind, week_start },
          { onConflict: "work_id,kind,week_start", ignoreDuplicates: true },
        )
    : await supabase
        .from("cheers")
        .delete()
        .eq("work_id", workId)
        .eq("kind", kind)
        .eq("week_start", week_start);

  // マイページのカードの「今週の応援 x/3」も新しくする
  refresh();
  // 他人の作品は RLS で弾かれて error になる
  return { ok: !error };
}
