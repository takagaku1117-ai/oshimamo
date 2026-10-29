export type RankingPoint = {
  issue_year: number;
  issue_no: number;
  position: number;
};

export function formatIssue(
  point: Pick<RankingPoint, "issue_year" | "issue_no">,
) {
  return `${point.issue_year}年${point.issue_no}号`;
}

// 号の古い順に並べる（DB の文字列順に頼らない）
export function sortByIssue<T extends RankingPoint>(points: T[]) {
  return [...points].sort(
    (a, b) => a.issue_year - b.issue_year || a.issue_no - b.issue_no,
  );
}

// F-03: 最新の掲載順と、前回からいくつ上がったか（+ は前に上がった、- は後ろに下がった）
export function latestRanking(points: RankingPoint[]) {
  const sorted = sortByIssue(points);
  const latest = sorted.at(-1);
  const previous = sorted.at(-2);
  if (!latest) return null;
  return {
    latest,
    change: previous ? previous.position - latest.position : null,
  };
}
