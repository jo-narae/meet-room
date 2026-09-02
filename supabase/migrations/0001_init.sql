-- meet-room 초기 스키마
-- 표 3개: profiles(회원) / rooms(회의실) / reservations(예약)

-- 시간 범위 겹침 검사를 위한 확장
create extension if not exists btree_gist;

-- 1) 회원 프로필 --------------------------------------------------
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  team         text,
  created_at   timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- 로그인한 사람은 모든 프로필의 이름을 볼 수 있다 (예약자 이름 표시용)
create policy "profiles_select" on public.profiles
  for select to authenticated using (true);

-- 본인 프로필만 수정 가능
create policy "profiles_update_own" on public.profiles
  for update to authenticated using (auth.uid() = id);

-- 가입 시 프로필 자동 생성
create function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name, team)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'team'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2) 회의실 ------------------------------------------------------
create table public.rooms (
  id        uuid primary key default gen_random_uuid(),
  name      text not null unique,
  sort_order int  not null
);

alter table public.rooms enable row level security;

create policy "rooms_select" on public.rooms
  for select to authenticated using (true);

insert into public.rooms (name, sort_order) values
  ('A회의실', 1), ('B회의실', 2), ('C회의실', 3), ('D회의실', 4),
  ('E회의실', 5), ('F회의실', 6), ('G회의실', 7), ('H회의실', 8);

-- 3) 예약 --------------------------------------------------------
create table public.reservations (
  id         uuid primary key default gen_random_uuid(),
  room_id    uuid not null references public.rooms(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  starts_at  timestamptz not null,
  ends_at    timestamptz not null,
  purpose    text not null default '',
  created_at timestamptz not null default now(),

  -- 종료가 시작보다 뒤여야 한다
  constraint reservations_time_order check (ends_at > starts_at),

  -- 핵심 규칙 1: 같은 방에서 시간이 겹치는 예약은 저장 자체가 안 된다
  constraint reservations_no_overlap exclude using gist (
    room_id with =,
    tstzrange(starts_at, ends_at, '[)') with &&
  )
);

create index reservations_room_time_idx on public.reservations (room_id, starts_at);
create index reservations_starts_at_idx  on public.reservations (starts_at);

alter table public.reservations enable row level security;

-- 로그인한 사람은 모든 예약을 볼 수 있다 (표를 그려야 하므로)
create policy "reservations_select" on public.reservations
  for select to authenticated using (true);

-- 예약 생성은 본인 이름으로만
create policy "reservations_insert_own" on public.reservations
  for insert to authenticated with check (auth.uid() = user_id);

-- 핵심 규칙 2: 수정·삭제는 만든 사람만
create policy "reservations_update_own" on public.reservations
  for update to authenticated using (auth.uid() = user_id);

create policy "reservations_delete_own" on public.reservations
  for delete to authenticated using (auth.uid() = user_id);
