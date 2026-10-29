import Link from "next/link";
import { formatIssue, latestRanking, type RankingPoint } from "@/lib/ranking";

type Props = {
  work: {
    id: string;
    title: string;
    magazine: string | null;
    author: string | null;
    rankings: RankingPoint[];
  };
};

// F-03: 推しカード（最新の掲載順と前回からの上下）
export function WorkCard({ work }: Props) {
  const ranking = latestRanking(work.rankings);
  const sub = [work.magazine, work.author].filter(Boolean).join(" ／ ");

  return (
    <li>
      <Link
        href={`/me/${work.id}`}
        className="flex items-center gap-4 border-[2.5px] border-ink bg-panel p-4 shadow-[4px_4px_0_var(--color-ink)] transition-transform hover:-translate-x-px hover:-translate-y-px"
      >
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg font-bold">{work.title}</h2>
          {sub && <p className="truncate text-sm text-ink-soft">{sub}</p>}
        </div>
        <div className="shrink-0 text-right">
          {ranking ? (
            <>
              <p className="text-xs text-ink-soft">
                {formatIssue(ranking.latest)}
              </p>
              <p className="font-display text-2xl leading-tight">
                {ranking.latest.position}
                <span className="text-sm">番目</span>
              </p>
              <Change value={ranking.change} />
            </>
          ) : (
            <p className="text-sm text-ink-soft">まだ記録なし</p>
          )}
        </div>
      </Link>
    </li>
  );
}

function Change({ value }: { value: number | null }) {
  if (value === null) return null;
  if (value === 0) return <p className="text-xs text-ink-soft">前回と同じ</p>;
  return value > 0 ? (
    <p className="text-xs font-bold text-ink">▲ {value} 上がった</p>
  ) : (
    <p className="text-xs font-bold text-accent">▼ {-value} 下がった</p>
  );
}
