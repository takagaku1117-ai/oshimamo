-- 応援チェックリスト（F-08、発展アイデア①）
-- 作品ごと・週ごと（日本時間の月曜始まり）に、その週にした応援を記録する。
-- 翌週は week_start が変わるので自然に未チェックに戻る。古い週の行は応援ログ（F-09）に使うので残す

create table public.cheers (
  id uuid primary key default gen_random_uuid(),
  work_id uuid not null references public.works (id) on delete cascade,
  kind text not null check (kind in ('survey', 'like', 'purchase')),
  week_start date not null check (extract(isodow from week_start) = 1),
  checked_at timestamptz not null default now(),
  -- 同じ週に同じ応援は1回だけ
  unique (work_id, kind, week_start)
);

comment on table public.cheers is '今週の応援チェック。作品の持ち主だけが読み書きできる';
comment on column public.cheers.id is 'チェックID';
comment on column public.cheers.work_id is '対象の推し作品';
comment on column public.cheers.kind is '応援の種類: survey=アンケートを出した / like=いいねした / purchase=購入した';
comment on column public.cheers.week_start is 'その週の月曜日（日本時間）。月曜以外は入らない';
comment on column public.cheers.checked_at is 'チェックした日時';

-- 「この作品の今週の応援」を引く検索は unique 制約のインデックス (work_id, kind, week_start) では
-- week_start を先頭で絞れないので、マイページで全作品の今週分を取るための索引を足す
create index cheers_week_start_work_id_idx on public.cheers (week_start, work_id);

alter table public.cheers enable row level security;

-- 自分の作品にぶら下がる行だけ。チェックは付ける（insert）か外す（delete）だけなので update は作らない
create policy "cheers_select_own" on public.cheers
  for select to authenticated
  using (exists (
    select 1 from public.works w
    where w.id = work_id and w.user_id = (select auth.uid())
  ));

create policy "cheers_insert_own" on public.cheers
  for insert to authenticated
  with check (exists (
    select 1 from public.works w
    where w.id = work_id and w.user_id = (select auth.uid())
  ));

create policy "cheers_delete_own" on public.cheers
  for delete to authenticated
  using (exists (
    select 1 from public.works w
    where w.id = work_id and w.user_id = (select auth.uid())
  ));
