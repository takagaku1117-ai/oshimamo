-- 推しマモ MVP のテーブル（requirements.md「データ設計（MVP）」）
-- 推し作品と掲載順は、本人だけが読み書きできる（非機能要件・セキュリティ）

-- ============================================================
-- works: 推し作品
-- ============================================================
create table public.works (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 100),
  magazine text check (char_length(magazine) <= 100),
  author text check (char_length(author) <= 100),
  created_at timestamptz not null default now()
);

comment on table public.works is '推し作品。登録したユーザー本人だけが読み書きできる';
comment on column public.works.id is '作品ID';
comment on column public.works.user_id is '登録したユーザー（auth.users）。insert 時は省略するとログイン中のユーザーになる';
comment on column public.works.title is '作品タイトル（必須・100字まで）';
comment on column public.works.magazine is '掲載誌・掲載アプリ（任意）';
comment on column public.works.author is '作者（任意）';
comment on column public.works.created_at is '登録日時';

-- マイページで「自分の作品一覧」を引くため
create index works_user_id_idx on public.works (user_id);

-- ============================================================
-- rankings: 掲載順の記録
-- ============================================================
create table public.rankings (
  id uuid primary key default gen_random_uuid(),
  work_id uuid not null references public.works (id) on delete cascade,
  issue_year int not null check (issue_year between 2000 and 2100),
  issue_no int not null check (issue_no >= 1),
  position int not null check (position >= 1),
  recorded_at timestamptz not null default now(),
  -- 同じ号は1件だけ（入力し直したら上書き = F-04）
  unique (work_id, issue_year, issue_no)
);

comment on table public.rankings is '掲載順の記録。作品の持ち主だけが読み書きできる';
comment on column public.rankings.id is '記録ID';
comment on column public.rankings.work_id is '対象の推し作品';
comment on column public.rankings.issue_year is '号数の年（例: 2026年47号の 2026）';
comment on column public.rankings.issue_no is '号数（例: 2026年47号の 47）。文字列だと並び順が崩れるので数値で持つ';
comment on column public.rankings.position is '掲載順（1が先頭）';
comment on column public.rankings.recorded_at is '記録した日時';

-- 作品ごとに号の順で並べる検索は unique 制約のインデックス (work_id, issue_year, issue_no) が使えるので追加しない

-- ============================================================
-- RLS
-- ============================================================
alter table public.works enable row level security;
alter table public.rankings enable row level security;

-- works: 本人の行だけ
create policy "works_select_own" on public.works
  for select to authenticated
  using (user_id = (select auth.uid()));

create policy "works_insert_own" on public.works
  for insert to authenticated
  with check (user_id = (select auth.uid()));

create policy "works_update_own" on public.works
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "works_delete_own" on public.works
  for delete to authenticated
  using (user_id = (select auth.uid()));

-- rankings: 自分の作品にぶら下がる行だけ
create policy "rankings_select_own" on public.rankings
  for select to authenticated
  using (exists (
    select 1 from public.works w
    where w.id = work_id and w.user_id = (select auth.uid())
  ));

create policy "rankings_insert_own" on public.rankings
  for insert to authenticated
  with check (exists (
    select 1 from public.works w
    where w.id = work_id and w.user_id = (select auth.uid())
  ));

create policy "rankings_update_own" on public.rankings
  for update to authenticated
  using (exists (
    select 1 from public.works w
    where w.id = work_id and w.user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.works w
    where w.id = work_id and w.user_id = (select auth.uid())
  ));

create policy "rankings_delete_own" on public.rankings
  for delete to authenticated
  using (exists (
    select 1 from public.works w
    where w.id = work_id and w.user_id = (select auth.uid())
  ));
