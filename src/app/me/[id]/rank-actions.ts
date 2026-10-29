"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// ---- 掲載順（F-04）----

export type RankingValues = {
  issue_year: string;
  issue_no: string;
  position: string;
};

export type RankingFormState = {
  values?: RankingValues;
  errors?: Partial<Record<keyof RankingValues, string>>;
  message?: string;
};

const LIMITS = {
  issue_year: { min: 2000, max: 2100, label: "年" },
  issue_no: { min: 1, max: 99, label: "号" },
  position: { min: 1, max: 99, label: "掲載順" },
} as const;

// 画面の入力チェックはすり抜けられるので、サーバーでも必ず確かめる
function parseRanking(formData: FormData) {
  const values = {} as RankingValues;
  const numbers = {} as Record<keyof RankingValues, number>;
  const errors: RankingFormState["errors"] = {};

  for (const key of Object.keys(LIMITS) as (keyof RankingValues)[]) {
    const { min, max, label } = LIMITS[key];
    // 全角数字で入れられても受け付ける
    const raw = String(formData.get(key) ?? "")
      .trim()
      .replace(/[０-９]/g, (d) =>
        String.fromCharCode(d.charCodeAt(0) - 0xfee0),
      );
    values[key] = raw;
    const n = Number(raw);
    if (!raw) errors[key] = `${label}を入力してください`;
    else if (!Number.isInteger(n) || n < min || n > max)
      errors[key] = `${label}は${min}〜${max}の数字で入力してください`;
    numbers[key] = n;
  }
  return { values, numbers, errors, ok: Object.keys(errors).length === 0 };
}

export async function saveRanking(
  workId: string,
  _prev: RankingFormState,
  formData: FormData,
): Promise<RankingFormState> {
  const { values, numbers, errors, ok } = parseRanking(formData);
  if (!ok) return { values, errors };

  const supabase = await createClient();
  // 同じ号はすでにあれば上書き（一意制約 work_id, issue_year, issue_no）
  const { error } = await supabase
    .from("rankings")
    .upsert(
      { work_id: workId, ...numbers, recorded_at: new Date().toISOString() },
      { onConflict: "work_id,issue_year,issue_no" },
    );
  // 他人の作品は RLS で弾かれてここに来る
  if (error)
    return {
      values,
      message: "記録できませんでした。もう一度お試しください。",
    };

  redirect(`/me/${workId}`);
}

export async function deleteRanking(workId: string, rankingId: string) {
  const supabase = await createClient();
  await supabase
    .from("rankings")
    .delete()
    .eq("id", rankingId)
    .eq("work_id", workId);
  redirect(`/me/${workId}`);
}
