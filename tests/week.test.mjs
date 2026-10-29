// 応援チェックリストの週の区切り（src/lib/week.ts）のテスト。npm test で実行する
import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { isCheerKind, weekStart } from "../src/lib/week.ts";

// 日本時間で日時を書く
const jst = (iso) => new Date(`${iso}+09:00`);

describe("weekStart（F-08）", () => {
  test("水曜日はその週の月曜日", () => {
    assert.equal(weekStart(jst("2026-10-28T12:00:00")), "2026-10-26");
  });

  test("月曜0時ちょうどはその日から新しい週", () => {
    assert.equal(weekStart(jst("2026-11-02T00:00:00")), "2026-11-02");
  });

  test("日曜23時59分はまだ前の週", () => {
    assert.equal(weekStart(jst("2026-11-01T23:59:00")), "2026-10-26");
  });

  test("UTC ではまだ日曜でも、日本で月曜になっていれば新しい週（Vercel のサーバーは UTC）", () => {
    // 日本時間 11/2(月) 0:30 = UTC 11/1(日) 15:30
    assert.equal(weekStart(new Date("2026-11-01T15:30:00Z")), "2026-11-02");
  });

  test("年をまたぐ週", () => {
    assert.equal(weekStart(jst("2027-01-01T09:00:00")), "2026-12-28");
  });
});

describe("isCheerKind", () => {
  test("決められた3種類だけ通す", () => {
    assert.equal(isCheerKind("survey"), true);
    assert.equal(isCheerKind("like"), true);
    assert.equal(isCheerKind("purchase"), true);
    assert.equal(isCheerKind("hack"), false);
  });
});
