import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { connection } from "next/server";

// Server Component・Server Action・Route Handler 用
export async function createClient() {
  // ユーザーごとの処理なので事前描画しない。
  // これがないと supabase-js 内の Date.now() が事前描画中に呼ばれてエラーになる（Cache Components）
  await connection();
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Component からは cookie を書けない。
            // トークンの更新は src/proxy.ts が行うので無視してよい
          }
        },
      },
    },
  );
}
