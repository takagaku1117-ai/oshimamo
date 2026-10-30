# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# 推しマモ 開発ルール

好きな連載漫画の掲載順を見守り、応援のタイミングを逃さないためのファンの応援ナビ。

@AGENTS.md

## 要件

@requirements.md

要件にない機能は勝手に足さない。必要そうなら先に提案して、要件定義書を更新してから実装する。

## 進め方

- 1回の作業は下の「実装ステップ」1つ分だけにする。
- 複数ファイルにまたがる作業は、Plan Mode で計画を出して承認をもらってから実装する。
- 1ステップごとに「動作確認 → コミット → 次へ」。動作確認の手順（どのURLを開いて何をすれば確認できるか）を必ず伝える。
- コミットメッセージは日本語で、関連する機能要件のIDを入れる（例: `F-02 推し作品の登録フォームを追加`）。
- 返答は日本語。

## 技術

- Next.js（App Router・TypeScript）+ Tailwind CSS + Supabase（Auth・Postgres）+ Vercel
- グラフは Recharts
- 秘密情報は `.env.local` と Vercel の環境変数に置き、コミットしない
- 漫画の画像・本文は保存も表示もしない（requirements.md「著作権への配慮」）

## コマンド

```bash
npm run dev     # 開発サーバー http://localhost:3000
npm run build   # 本番ビルド（型チェックも走る）
npm run lint    # ESLint
npm test        # tests/*.test.mjs（node:test）。掲載順・ピンチ判定のテスト
```

コミット前に `npm test`・`npm run lint`・`npm run build` が通ることを確認する。判定ロジック（`src/lib/ranking.ts`）を変えたらテストも足す。

## コードの構成

- Next.js 16.4（App Router）。`src/app/` 以下がルーティング。URL は requirements.md「ページ一覧（MVP）」に合わせる
- `next.config.ts` で **Cache Components（`cacheComponents: true`）が有効**。リクエストごとに変わる処理（Supabase のセッションを読む `cookies()` など）は `<Suspense>` で囲むか、`"use cache"` を付けるかを決めてから書く（`node_modules/next/dist/docs/01-app/01-getting-started/08-caching.md`）
- Tailwind CSS v4。配色トークンは `src/app/globals.css` の `@theme` にある（`paper` `panel` `ink` `ink-soft` `line` `tone` `accent` `accent-wash`）。`bg-accent` `text-ink-soft` のように使い、色コードを直接書かない
- フォントは `src/app/layout.tsx` の `next/font/google`。本文は `font-sans`（Zen Kaku Gothic New）、見出しは `font-display`（Dela Gothic One）
- 見た目の決まり: 黒い太枠 `border-[2.5px] border-ink` ＋ ずらした影 `shadow-[4px_4px_0_var(--color-ink)]`（漫画のコマ風）。元は `design/story_map.html`

## 実装ステップ（MVP）

| #   | 内容                                           | 機能要件         | 動作確認                                                 |
| --- | ---------------------------------------------- | ---------------- | -------------------------------------------------------- |
| 1   | Next.js の土台とトップページ                   | —                | `npm run dev` で `/` が表示される                        |
| 2   | Supabase の `works`・`rankings` テーブルと RLS | データ設計       | Supabase の画面で2テーブルと RLS を確認                  |
| 3   | Googleログインと `/me` の保護                  | F-01             | 未ログインで `/me` → `/login` に移動、ログイン後に戻れる |
| 4   | 推しの登録・編集・削除と一覧                   | F-02, F-03       | 登録した作品が `/me` にカードで出る                      |
| 5   | 掲載順の記録とグラフ・ピンチ表示               | F-04, F-05, F-06 | 3号分入力して下がり続けると「ピンチ」が出る              |
| 6   | GitHub 公開・Vercel デプロイ・README           | —                | 公開URLで 3〜5 をもう一度確認                            |
