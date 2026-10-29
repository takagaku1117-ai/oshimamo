// F-08: 応援チェックリストは週ごと（日本時間の月曜始まり）

export const CHEER_KINDS = [
  {
    kind: "survey",
    label: "アンケートを出した",
    hint: "雑誌のハガキやアプリのアンケート",
  },
  {
    kind: "like",
    label: "いいね・コメントした",
    hint: "連載アプリのいいねや感想",
  },
  {
    kind: "purchase",
    label: "単行本・雑誌を買った",
    hint: "発売1週目の購入が特に応援になる",
  },
] as const;

export type CheerKind = (typeof CHEER_KINDS)[number]["kind"];

export function isCheerKind(value: string): value is CheerKind {
  return CHEER_KINDS.some((c) => c.kind === value);
}

const JST_OFFSET_MS = 9 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

// その日時が含まれる週の月曜日（日本時間）を "YYYY-MM-DD" で返す。
// サーバー（Vercel は UTC）でもブラウザでも同じ結果になるよう、時差を足してから UTC として扱う
export function weekStart(date: Date) {
  const jst = new Date(date.getTime() + JST_OFFSET_MS);
  const daysSinceMonday = (jst.getUTCDay() + 6) % 7;
  const monday = new Date(jst.getTime() - daysSinceMonday * DAY_MS);
  return monday.toISOString().slice(0, 10);
}
