"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

// ---- 推し作品（F-02）----

export type WorkValues = { title: string; magazine: string; author: string };

export type WorkFormState = {
  values?: WorkValues;
  errors?: Partial<Record<keyof WorkValues, string>>;
  message?: string;
};

const MAX_LENGTH = 100;

// 画面の入力チェックはすり抜けられるので、サーバーでも必ず確かめる
function parseWork(formData: FormData) {
  const values: WorkValues = {
    title: String(formData.get("title") ?? "").trim(),
    magazine: String(formData.get("magazine") ?? "").trim(),
    author: String(formData.get("author") ?? "").trim(),
  };

  const errors: WorkFormState["errors"] = {};
  if (!values.title) errors.title = "タイトルを入力してください";
  if (values.title.length > MAX_LENGTH)
    errors.title = `タイトルは${MAX_LENGTH}字以内にしてください`;
  if (values.magazine.length > MAX_LENGTH)
    errors.magazine = `掲載誌は${MAX_LENGTH}字以内にしてください`;
  if (values.author.length > MAX_LENGTH)
    errors.author = `作者は${MAX_LENGTH}字以内にしてください`;

  const row = {
    title: values.title,
    magazine: values.magazine || null,
    author: values.author || null,
  };
  return { values, errors, row, ok: Object.keys(errors).length === 0 };
}

export async function createWork(
  _prev: WorkFormState,
  formData: FormData,
): Promise<WorkFormState> {
  const { values, errors, row, ok } = parseWork(formData);
  if (!ok) return { values, errors };

  // user_id は DB の既定値 auth.uid() に任せる
  const supabase = await createClient();
  const { error } = await supabase.from("works").insert(row);
  if (error)
    return {
      values,
      message: "登録できませんでした。もう一度お試しください。",
    };

  redirect("/me");
}

export async function updateWork(
  id: string,
  _prev: WorkFormState,
  formData: FormData,
): Promise<WorkFormState> {
  const { values, errors, row, ok } = parseWork(formData);
  if (!ok) return { values, errors };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("works")
    .update(row)
    .eq("id", id)
    .select("id");
  if (error)
    return {
      values,
      message: "保存できませんでした。もう一度お試しください。",
    };
  // RLS で他人の作品は 0 件更新になる
  if (data.length === 0)
    return { values, message: "この作品は見つかりませんでした。" };

  redirect(`/me/${id}`);
}

export async function deleteWork(id: string) {
  const supabase = await createClient();
  // 掲載順の記録は外部キーの on delete cascade で一緒に消える
  await supabase.from("works").delete().eq("id", id);
  redirect("/me");
}
