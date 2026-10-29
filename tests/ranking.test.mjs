// 掲載順の判定（src/lib/ranking.ts）のテスト。npm test で実行する
import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { isPinch, latestRanking } from "../src/lib/ranking.ts";

// 2026年45号から順に掲載順を並べた記録を作る
const issues = (...positions) =>
  positions.map((position, i) => ({
    issue_year: 2026,
    issue_no: 45 + i,
    position,
  }));

describe("isPinch（F-06）", () => {
  test("2号続けて下がったらピンチ", () => {
    assert.equal(isPinch(issues(5, 8, 11)), true);
  });

  test("横ばいを挟んだらピンチではない", () => {
    assert.equal(isPinch(issues(5, 5, 9)), false);
    assert.equal(isPinch(issues(8, 8, 8)), false);
  });

  test("途中で上がったらピンチではない", () => {
    assert.equal(isPinch(issues(5, 9, 7)), false);
  });

  test("記録が2号以下ならピンチではない", () => {
    assert.equal(isPinch([]), false);
    assert.equal(isPinch(issues(5, 9)), false);
  });

  test("見るのは直近3号だけ", () => {
    assert.equal(isPinch(issues(1, 2, 3, 2)), false);
    assert.equal(isPinch(issues(10, 3, 6, 9)), true);
  });

  test("入力した順番がバラバラでも号の順に並べて判定する", () => {
    const shuffled = [
      { issue_year: 2027, issue_no: 1, position: 11 },
      { issue_year: 2026, issue_no: 52, position: 5 },
      { issue_year: 2026, issue_no: 53, position: 8 },
    ];
    assert.equal(isPinch(shuffled), true);
  });
});

describe("latestRanking（F-03）", () => {
  test("記録がなければ null", () => {
    assert.equal(latestRanking([]), null);
  });

  test("最新の掲載順と前回からの上下を返す（+ は上がった）", () => {
    const result = latestRanking(issues(9, 4));
    assert.equal(result.latest.position, 4);
    assert.equal(result.change, 5);
  });

  test("1号だけなら上下は null", () => {
    assert.equal(latestRanking(issues(7)).change, null);
  });
});
