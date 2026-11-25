-- 은밀한스터디 데이터 구조 (Supabase SQL Editor 에서 한 번 실행)
-- 표는 직접 쓰지 못하게 막고(RLS), 쓰기는 비밀번호를 확인하는 함수로만 한다.

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.members (
  name text primary key,
  pin_hash text,
  is_host boolean not null default false,
  sort int not null default 0
);

-- 멤버 명단은 공개 저장소에 두지 않는다. SQL Editor 에서 직접 넣는다. 예:
-- insert into public.members (name, is_host, sort) values ('이름1', true, 1), ('이름2', false, 2);

create table if not exists public.diagnosis (
  name text references public.members(name),
  lang text not null check (lang in ('ja', 'en')),
  answers jsonb not null,
  level int not null check (level between 1 and 3),
  updated_at timestamptz not null default now(),
  primary key (name, lang)
);

create table if not exists public.homework (
  name text references public.members(name),
  week date not null,
  item text not null,
  updated_at timestamptz not null default now(),
  primary key (name, week, item)
);

create table if not exists public.comments (
  id bigint generated always as identity primary key,
  page text not null,
  name text references public.members(name),
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);

create table if not exists public.cards (
  name text references public.members(name),
  card text not null,
  box int not null check (box between 1 and 6),
  due date not null,
  updated_at timestamptz not null default now(),
  primary key (name, card)
);

create table if not exists public.quiz (
  month text not null,
  name text references public.members(name),
  score int not null check (score between 0 and 80),
  primary key (month, name)
);

create table if not exists public.failed_logins (
  name text not null,
  at timestamptz not null default now()
);

alter table public.members enable row level security;
alter table public.diagnosis enable row level security;
alter table public.homework enable row level security;
alter table public.comments enable row level security;
alter table public.cards enable row level security;
alter table public.quiz enable row level security;
alter table public.failed_logins enable row level security;

-- 읽기만 모두에게 연다 (members·failed_logins 는 닫아 둔다)
drop policy if exists read_all on public.diagnosis;
drop policy if exists read_all on public.homework;
drop policy if exists read_all on public.comments;
drop policy if exists read_all on public.cards;
drop policy if exists read_all on public.quiz;
create policy read_all on public.diagnosis for select using (true);
create policy read_all on public.homework for select using (true);
create policy read_all on public.comments for select using (true);
create policy read_all on public.cards for select using (true);
create policy read_all on public.quiz for select using (true);

-- 비밀번호 확인 (내부용). 10분에 10번 넘게 틀리면 막는다.
create or replace function public._check(p_name text, p_pin text) returns boolean
language plpgsql security definer set search_path = public, extensions as $$
declare h text; fails int;
begin
  select count(*) into fails from failed_logins where name = p_name and at > now() - interval '10 minutes';
  if fails >= 10 then return false; end if;
  select pin_hash into h from members where name = p_name;
  if h is not null and h = crypt(p_pin, h) then return true; end if;
  insert into failed_logins(name) values (p_name);
  return false;
end $$;
revoke execute on function public._check(text, text) from public, anon, authenticated;

create or replace function public._is_host(p_name text, p_pin text) returns boolean
language plpgsql security definer set search_path = public, extensions as $$
begin
  return public._check(p_name, p_pin) and exists (select 1 from members where name = p_name and is_host);
end $$;
revoke execute on function public._is_host(text, text) from public, anon, authenticated;

create or replace function public.list_members()
returns table (name text, is_host boolean, has_pin boolean, sort int)
language sql security definer set search_path = public as $$
  select name, is_host, pin_hash is not null, sort from members order by sort;
$$;

create or replace function public.set_pin(p_name text, p_pin text) returns boolean
language plpgsql security definer set search_path = public, extensions as $$
begin
  if p_pin !~ '^[0-9]{4}$' then return false; end if;
  update members set pin_hash = crypt(p_pin, gen_salt('bf')) where name = p_name and pin_hash is null;
  return found;
end $$;

create or replace function public.login(p_name text, p_pin text) returns boolean
language sql security definer set search_path = public as $$ select public._check(p_name, p_pin); $$;

create or replace function public.reset_pin(p_host text, p_hpin text, p_target text) returns boolean
language plpgsql security definer set search_path = public as $$
begin
  if not public._is_host(p_host, p_hpin) then return false; end if;
  update members set pin_hash = null where name = p_target;
  delete from failed_logins where name = p_target;
  return true;
end $$;

create or replace function public.save_diagnosis(p_name text, p_pin text, p_lang text, p_answers jsonb, p_level int) returns boolean
language plpgsql security definer set search_path = public as $$
begin
  if not public._check(p_name, p_pin) then return false; end if;
  insert into diagnosis(name, lang, answers, level) values (p_name, p_lang, p_answers, p_level)
  on conflict (name, lang) do update set answers = excluded.answers, level = excluded.level, updated_at = now();
  return true;
end $$;

create or replace function public.set_homework(p_name text, p_pin text, p_week date, p_item text, p_done boolean) returns boolean
language plpgsql security definer set search_path = public as $$
begin
  if not public._check(p_name, p_pin) then return false; end if;
  if p_done then
    insert into homework(name, week, item) values (p_name, p_week, p_item) on conflict do nothing;
  else
    delete from homework where name = p_name and week = p_week and item = p_item;
  end if;
  return true;
end $$;

create or replace function public.add_comment(p_name text, p_pin text, p_page text, p_body text) returns boolean
language plpgsql security definer set search_path = public as $$
begin
  if not public._check(p_name, p_pin) then return false; end if;
  insert into comments(page, name, body) values (p_page, p_name, p_body);
  return true;
end $$;

create or replace function public.delete_comment(p_name text, p_pin text, p_id bigint) returns boolean
language plpgsql security definer set search_path = public as $$
begin
  if not public._check(p_name, p_pin) then return false; end if;
  delete from comments where id = p_id
    and (name = p_name or exists (select 1 from members where name = p_name and is_host));
  return found;
end $$;

create or replace function public.save_card(p_name text, p_pin text, p_card text, p_box int, p_due date) returns boolean
language plpgsql security definer set search_path = public as $$
begin
  if not public._check(p_name, p_pin) then return false; end if;
  insert into cards(name, card, box, due) values (p_name, p_card, p_box, p_due)
  on conflict (name, card) do update set box = excluded.box, due = excluded.due, updated_at = now();
  return true;
end $$;

create or replace function public.set_quiz(p_host text, p_hpin text, p_month text, p_target text, p_score int) returns boolean
language plpgsql security definer set search_path = public as $$
begin
  if not public._is_host(p_host, p_hpin) then return false; end if;
  if p_score is null then
    delete from quiz where month = p_month and name = p_target;
  else
    insert into quiz(month, name, score) values (p_month, p_target, p_score)
    on conflict (month, name) do update set score = excluded.score;
  end if;
  return true;
end $$;
