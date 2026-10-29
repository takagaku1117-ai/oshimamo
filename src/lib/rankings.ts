import { createClient } from "@/lib/supabase/server";

// 1作品の掲載順の記録（RLS で自分の作品のものしか取れない）
export async function getRankings(workId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rankings")
    .select("id, issue_year, issue_no, position")
    .eq("work_id", workId);
  if (error) throw error;
  return data;
}
