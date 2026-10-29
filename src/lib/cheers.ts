import { createClient } from "@/lib/supabase/server";
import { isCheerKind, weekStart, type CheerKind } from "@/lib/week";

// 今週チェック済みの応援（RLS で自分の作品のものしか取れない）。workId を省くと全作品分
export async function getThisWeekCheers(workId?: string) {
  const supabase = await createClient();
  let query = supabase
    .from("cheers")
    .select("work_id, kind")
    .eq("week_start", weekStart(new Date()));
  if (workId) query = query.eq("work_id", workId);
  const { data, error } = await query;
  if (error) throw error;

  const byWork = new Map<string, CheerKind[]>();
  for (const row of data) {
    if (!isCheerKind(row.kind)) continue;
    byWork.set(row.work_id, [...(byWork.get(row.work_id) ?? []), row.kind]);
  }
  return byWork;
}
