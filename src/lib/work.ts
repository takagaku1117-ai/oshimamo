import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// 自分の推し作品を1件取る。他人の作品は RLS で見えないので、存在しないのと同じく 404 にする
export async function getWork(id: string) {
  if (!UUID.test(id)) notFound();

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("works")
    .select("id, title, magazine, author")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) notFound();
  return data;
}
