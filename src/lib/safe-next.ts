// ログイン後の戻り先。外部サイトに飛ばされないよう、サイト内のパスだけ許す
export function safeNext(next: string | null | undefined, fallback = "/me") {
  if (
    !next ||
    !next.startsWith("/") ||
    next.startsWith("//") ||
    next.startsWith("/\\")
  ) {
    return fallback;
  }
  return next;
}
