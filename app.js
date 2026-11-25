import { SITE, WEEKS, DIAG, KANA, LESSONS, CLASSES, DECKS, PAGES } from './content.js';

// 서버 연결 (Supabase). 공개용 키라 쓰기는 비밀번호 확인 함수로만 된다.
const URL_ = 'https://yptxfuafkzdipvvnnxte.supabase.co';
const KEY = 'sb_publishable_FelEHU0imLZ0GTNhMj88BQ_B_6Qy21K';
const H = { apikey: KEY, 'Content-Type': 'application/json' };

async function rpc(fn, args = {}) {
  const r = await fetch(`${URL_}/rest/v1/rpc/${fn}`, { method: 'POST', headers: H, body: JSON.stringify(args) });
  if (!r.ok) throw new Error(`${fn}: ${r.status}`);
  return r.json();
}
async function sel(table, qs) {
  const r = await fetch(`${URL_}/rest/v1/${table}?${qs}`, { headers: H });
  if (!r.ok) throw new Error(`${table}: ${r.status}`);
  return r.json();
}
const enc = encodeURIComponent;

// 도구
const $app = document.getElementById('app');
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const jp = (s) => esc(s).replace(/\{([^|}]+)\|([^}]+)\}/g, '<ruby>$1<rt>$2</rt></ruby>'); // 한자 위 후리가나
function toast(msg) { const t = document.getElementById('toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('on'), 2000); }
const todayKST = () => new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10);
const addDays = (d, n) => { const x = new Date(d + 'T00:00:00Z'); x.setUTCDate(x.getUTCDate() + n); return x.toISOString().slice(0, 10); };
const md = (d) => `${Number(d.slice(5, 7))}/${Number(d.slice(8, 10))}`;
const weekKeys = () => Object.keys(WEEKS).sort();
const currentWeek = () => weekKeys().filter((k) => k <= todayKST()).pop() || weekKeys()[0];
const fmtTime = (iso) => new Date(iso).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', month: 'numeric', day: 'numeric', hour: 'numeric', minute: '2-digit' });
let audioNow;
function play(src, slow = false) { try { audioNow?.pause(); audioNow = new Audio(src); audioNow.playbackRate = slow ? 0.7 : 1; audioNow.play(); } catch {} }
window.__play = play;
const FAIL = '저장 안 됨. 다시 로그인해 줘';

// 로그인
let me = JSON.parse(localStorage.getItem('study_me') || 'null');
let members = [];
const hostName = () => members.find((m) => m.is_host)?.name || '진행자';
const isHost = () => me && members.some((m) => m.is_host && m.name === me.name);
function setMe(v) { me = v; v ? localStorage.setItem('study_me', JSON.stringify(v)) : localStorage.removeItem('study_me'); renderWho(); }
function renderWho() {
  const w = document.getElementById('who');
  w.innerHTML = me ? `${esc(me.name)} <button class="mini" id="logout">로그아웃</button>` : '';
  w.querySelector('#logout')?.addEventListener('click', () => { setMe(null); location.hash = '#/'; route(); });
}

async function viewLogin() {
  members = await rpc('list_members');
  $app.innerHTML = `
    <h1>누구?</h1>
    <div class="names">${members.map((m) => `<button data-n="${esc(m.name)}">${esc(m.name)}</button>`).join('')}</div>
    <div id="pinbox"></div>`;
  $app.querySelectorAll('.names button').forEach((b) => b.addEventListener('click', () => pinStep(members.find((m) => m.name === b.dataset.n))));
}
function pinStep(m) {
  const box = document.getElementById('pinbox');
  const first = !m.has_pin;
  box.innerHTML = `<div class="card">
    <h3>${esc(m.name)}</h3>
    <p class="small">${first ? '처음이면 비밀번호 4자리 정하기' : '비밀번호'}</p>
    <input class="pin" id="p1" inputmode="numeric" maxlength="4" autocomplete="off">
    ${first ? '<p class="small">한 번 더</p><input class="pin" id="p2" inputmode="numeric" maxlength="4" autocomplete="off">' : ''}
    <p><button class="primary" id="go">들어가기</button></p>
    <p class="small muted">까먹으면 ${esc(hostName())}한테 말하기</p></div>`;
  const p1 = box.querySelector('#p1'); p1.focus();
  box.querySelector('#go').addEventListener('click', async () => {
    const pin = p1.value.trim();
    if (!/^\d{4}$/.test(pin)) return toast('숫자 4자리');
    if (first) {
      if (box.querySelector('#p2').value.trim() !== pin) return toast('두 번 입력한 게 달라');
      if (!(await rpc('set_pin', { p_name: m.name, p_pin: pin }))) return toast('이미 비밀번호가 있어. 새로고침해 줘');
    }
    if (!(await rpc('login', { p_name: m.name, p_pin: pin }))) return toast('비밀번호 틀림');
    setMe({ name: m.name, pin }); route();
  });
}

// 댓글
const PAGE_TITLE = {
  rules: '규칙', diagnosis: '수준 진단', cards: '단어카드', homework: '숙제',
  ...Object.fromEntries(Object.entries(KANA).map(([n, K]) => [`kana${n}`, K.title])),
  ...Object.fromEntries(Object.entries(LESSONS).map(([k, L]) => [`lesson-${k}`, L.title])),
  ...Object.fromEntries(Object.entries(CLASSES).map(([n, C]) => [`class${n}`, C.title])),
};
const PAGE_HREF = (p) => p.replace(/^kana(\d+)$/, 'kana/$1').replace(/^lesson-/, 'lesson/').replace(/^class(\d+)$/, 'class/$1');
async function mountComments(page) {
  const wrap = document.createElement('section');
  wrap.innerHTML = `<h2>댓글</h2><div class="card"><div id="clist" class="small"></div>
    <textarea id="cbody" placeholder="질문이나 하고 싶은 말"></textarea>
    <p><button class="primary" id="csend">등록</button></p></div>`;
  $app.appendChild(wrap);
  const load = async () => {
    const rows = await sel('comments', `select=id,name,body,created_at&page=eq.${enc(page)}&order=created_at.asc`);
    const list = wrap.querySelector('#clist');
    list.innerHTML = rows.map((c) => `<div class="comment"><div class="meta">${esc(c.name)} ${fmtTime(c.created_at)}
      ${(c.name === me.name || isHost()) ? `<button class="mini" data-del="${c.id}">삭제</button>` : ''}</div><p>${esc(c.body)}</p></div>`).join('');
    list.querySelectorAll('[data-del]').forEach((b) => b.addEventListener('click', async () => {
      if (b.dataset.sure !== '1') { b.dataset.sure = '1'; b.textContent = '진짜 삭제'; return; }
      await rpc('delete_comment', { p_name: me.name, p_pin: me.pin, p_id: Number(b.dataset.del) }); load();
    }));
  };
  wrap.querySelector('#csend').addEventListener('click', async () => {
    const t = wrap.querySelector('#cbody'); const body = t.value.trim();
    if (!body) return;
    if (!(await rpc('add_comment', { p_name: me.name, p_pin: me.pin, p_page: page, p_body: body }))) return toast(FAIL);
    t.value = ''; load();
  });
  load();
}

// 숙제
async function myDone(week) {
  const rows = await sel('homework', `select=item&name=eq.${enc(me.name)}&week=eq.${week}`);
  return new Set(rows.map((r) => r.item));
}
async function setHW(week, item, done) {
  return rpc('set_homework', { p_name: me.name, p_pin: me.pin, p_week: week, p_item: item, p_done: done });
}
async function autoCheck(key) {
  const w = currentWeek(); const it = WEEKS[w]?.items.find((i) => i.auto === key);
  if (it) { await setHW(w, it.id, true); toast(`숙제 체크: ${it.text}`); }
}

async function viewHomework(wk) {
  const w = WEEKS[wk] ? wk : currentWeek(); const W = WEEKS[w];
  const done = await myDone(w);
  const req = W.items; const n = req.filter((i) => done.has(i.id)).length;
  $app.innerHTML = `
    <h1>숙제</h1>
    <p class="muted">${esc(W.title)}, ${md(w)}부터</p>
    <div class="card"><div class="row between"><b>필수</b><span class="badge ${n === req.length ? 'ok' : ''}">${n}/${req.length}</span></div>
      ${req.map((i) => checkRow(i, done.has(i.id))).join('')}</div>
    <div class="card"><b>추가</b> <span class="small muted">점수 없음</span>
      ${W.extras.map((i) => checkRow(i, done.has(i.id))).join('')}</div>
    <h2>다른 사람</h2><div class="card" id="team"></div>`;
  $app.querySelectorAll('.check input').forEach((cb) => cb.addEventListener('change', async () => {
    const ok = await setHW(w, cb.dataset.id, cb.checked);
    if (!ok) { cb.checked = !cb.checked; return toast(FAIL); }
    cb.closest('.check').classList.toggle('done', cb.checked); viewHomeworkTeam();
  }));
  viewHomeworkTeam();
  mountComments('homework');
}
function checkRow(i, on) {
  return `<label class="check ${on ? 'done' : ''}"><input type="checkbox" data-id="${i.id}" ${on ? 'checked' : ''}>
    <span class="txt">${esc(i.text)} ${i.link ? `<a href="${i.link}">열기</a>` : ''}</span>${i.min ? `<span class="min">${i.min}분</span>` : ''}</label>`;
}
async function teamData() {
  if (!members.length) members = await rpc('list_members');
  const rows = await sel('homework', 'select=name,week,item');
  const by = {}; rows.forEach((r) => ((by[r.name] ||= {})[r.week] ||= new Set()).add(r.item));
  return by;
}
const weekComplete = (by, name, wk) => WEEKS[wk].items.every((i) => by[name]?.[wk]?.has(i.id));
async function viewHomeworkTeam() {
  const by = await teamData(); const wks = weekKeys().filter((k) => k <= todayKST());
  const el = document.getElementById('team'); if (!el) return;
  el.innerHTML = `<table><tr><th></th>${wks.map((k) => `<th>${md(k)}</th>`).join('')}</tr>
    ${members.map((m) => `<tr><td>${esc(m.name)}</td>${wks.map((k) => {
      const c = WEEKS[k].items.filter((i) => by[m.name]?.[k]?.has(i.id)).length, t = WEEKS[k].items.length;
      const x = WEEKS[k].extras.filter((i) => by[m.name]?.[k]?.has(i.id)).length;
      return `<td>${c === t ? '<span class="badge ok">완료</span>' : `${c}/${t}`}${x ? ` <span class="small muted">+${x}</span>` : ''}</td>`;
    }).join('')}</tr>`).join('')}</table>`;
}

// 첫 화면
async function viewHome() {
  const w = currentWeek(); const W = WEEKS[w];
  const done = await myDone(w); const n = W.items.filter((i) => done.has(i.id)).length;
  const last = localStorage.getItem('study_seen') || '1970-01-01';
  const recent = await sel('comments', 'select=id,page,name,body,created_at&order=created_at.desc&limit=20');
  const fresh = recent.filter((c) => c.created_at > last && c.name !== me.name);
  // 이번 주, 다음 주들, 지난 주들 순서
  const ks = weekKeys();
  const order = [w, ...ks.filter((k) => k > w), ...ks.filter((k) => k < w).reverse()];
  const weekBlock = (k, cnt) => {
    const W2 = WEEKS[k]; const tag = k === w ? '이번 주' : k > w ? '다음' : '지난';
    return `<h2>${md(k)} ${esc(W2.title)} <span class="badge ${k === w ? '' : 'dim'}">${tag}</span></h2>
      <div class="list"><a class="item" href="#/homework/${k}"><div class="row between"><b>숙제</b>${cnt != null ? `<span class="badge ${cnt === W2.items.length ? 'ok' : ''}">${cnt}/${W2.items.length}</span>` : ''}</div>
      ${cnt != null ? `<div class="progress"><div style="width:${(cnt / W2.items.length) * 100}%"></div></div>` : ''}</a>
      ${(W2.pages || []).map((p) => `<a class="item" href="${p.href}"><b>${esc(p.title)}</b></a>`).join('')}</div>`;
  };
  $app.innerHTML = `
    ${fresh.length ? `<div class="card"><div class="row between"><b>새 댓글 ${fresh.length}</b><button class="mini" id="seen">읽음</button></div>
      ${fresh.slice(0, 5).map((c) => `<div class="comment"><div class="meta">${esc(c.name)}, <a href="#/${PAGE_HREF(c.page)}">${esc(PAGE_TITLE[c.page] || c.page)}</a>, ${fmtTime(c.created_at)}</div><p>${esc(c.body.slice(0, 120))}</p></div>`).join('')}</div>` : ''}
    ${order.map((k) => weekBlock(k, k === w ? n : null)).join('')}
    <h2>공통</h2>
    <div class="list">${PAGES.map((p) => `<a class="item" href="${p.href}"><b>${esc(p.title)}</b></a>`).join('')}
    ${isHost() ? '<a class="item" href="#/admin"><b>관리</b></a>' : ''}</div>`;
  document.getElementById('seen')?.addEventListener('click', () => { localStorage.setItem('study_seen', new Date().toISOString()); viewHome(); });
}

// 규칙
function viewRules() {
  const host = esc(hostName());
  $app.innerHTML = `
    <h1>규칙</h1>
    <div class="card"><h3>모임</h3><ul class="tight">
      <li>${esc(SITE.meet)}</li>
      <li>일본어 40분, 영어 20분</li>
      <li>피드백은 끝나고, 잘한 거 하나 고칠 거 하나</li>
      <li>다섯째 수요일은 쉼</li>
      <li>빠지면 그냥 다음 주에 오기</li></ul></div>
    <div class="card"><h3>단계</h3><ul class="tight">
      <li>수준 진단으로 언어마다 1~3단</li>
      <li>1단 문장 그대로, 2단 이유랑 질문 붙이기, 3단 돌발 상황</li>
      <li>3단은 역할극에서 점원, 친구 역</li></ul></div>
    <div class="card"><h3>숙제</h3><ul class="tight">
      <li>일주일에 2시간쯤. 수요일마다 새로 올라옴</li>
      <li>추가 숙제는 점수 없음</li>
      <li>밀린 건 안 해도 됨. 이번 주 것만</li></ul></div>
    <div class="card"><h3>퀴즈</h3><ul class="tight">
      <li>매달 넷째 주 디스코드에 올라옴. 15분 안에 혼자 풀고 답은 ${host}한테 DM</li>
      <li>그달 배운 것만, 일본어 영어 반반</li>
      <li>문제 80점 + 그달 숙제 20점</li>
      <li>1등 피자</li>
      <li>동점이면 사다리타기</li></ul></div>
    <div class="card"><h3>녹음</h3><ul class="tight">
      <li>시작, 3개월, 6개월, 1년, 2년에 같은 질문으로 녹음</li>
      <li>각자 폰에만 저장</li></ul></div>`;
  mountComments('rules');
}

// 수준 진단
async function viewDiagnosis() {
  const rows = await sel('diagnosis', `select=lang,answers,level&name=eq.${enc(me.name)}`);
  const saved = Object.fromEntries(rows.map((r) => [r.lang, r]));
  const block = (lang) => {
    const D = DIAG[lang]; const a = saved[lang]?.answers || [];
    return `<div class="card" data-lang="${lang}"><div class="row between"><h3 style="margin:0">${D.label}</h3>
      <span class="badge ${saved[lang] ? 'ok' : ''}">${saved[lang] ? saved[lang].level + '단' : '아직'}</span></div>
      ${D.items.map((t, i) => `<label class="check"><input type="checkbox" data-i="${i}" ${a.includes(i) ? 'checked' : ''}><span class="txt">${esc(t)}</span></label>`).join('')}
      <p><button class="primary" data-save="${lang}">저장</button></p></div>`;
  };
  $app.innerHTML = `<h1>수준 진단</h1>
    <p class="muted">되는 것만 체크</p>
    ${block('ja')}${block('en')}
    <h2 id="rec">시작 녹음</h2>
    <div class="card"><p>일본어로 한 번, 영어로 한 번. 질문마다 1분</p>
      <ol>${DIAG.recording.map((q) => `<li>${esc(q)}</li>`).join('')}</ol>
      <p class="small muted">모르면 아는 단어만 말해도 됨. 한국어 섞어도 됨. 녹음은 폰에만</p></div>`;
  $app.querySelectorAll('[data-save]').forEach((b) => b.addEventListener('click', async () => {
    const lang = b.dataset.save; const box = $app.querySelector(`[data-lang="${lang}"]`);
    const ans = [...box.querySelectorAll('input:checked')].map((x) => Number(x.dataset.i));
    let lv = DIAG.level(ans.length);
    if (lang === 'ja' && !ans.includes(0)) lv = 1; // 히라가나를 못 읽으면 1단
    if (!(await rpc('save_diagnosis', { p_name: me.name, p_pin: me.pin, p_lang: lang, p_answers: ans, p_level: lv }))) return toast(FAIL);
    saved[lang] = { level: lv };
    const bd = box.querySelector('.badge'); bd.className = 'badge ok'; bd.textContent = `${lv}단`;
    toast(`${DIAG[lang].label} ${lv}단`);
    if (saved.ja && saved.en) autoCheck('diag');
  }));
  mountComments('diagnosis');
}

// 히라가나
function viewKana(n) {
  const K = KANA[n]; if (!K) return viewHome();
  $app.innerHTML = `<h1>${esc(K.title)}</h1>
    <p class="muted">누르면 소리 나옴</p>
    <div class="kana-grid">${K.list.map((x, i) => `<div class="kana" data-i="${i}"><div class="k">${x.k}</div><div class="s">${x.s}</div></div>`).join('')}</div>
    <h2>단어</h2>
    <div class="card"><table>${K.list.map((x, i) => `<tr><td class="jw">${jp(x.w)}</td><td>${esc(x.m)}</td>
      <td class="right"><button class="play" onclick="__play('audio/kana${n}/w${i}.mp3')">듣기</button> <button class="play" onclick="__play('audio/kana${n}/w${i}.mp3', true)">느리게</button></td></tr>`).join('')}</table></div>
    <h2>발음</h2><div class="card"><ul class="tight">${K.tips.map((t) => `<li>${jp(t)}</li>`).join('')}</ul></div>
    ${K.dakuten ? `<h2>점 두 개, 동그라미</h2><div class="card"><table>${K.dakuten.map(([a, b, c]) => `<tr><td class="muted">${a}</td><td class="jw">${b}</td><td>${c}</td></tr>`).join('')}</table></div>` : ''}
    <h2>쓰기</h2><div class="card"><p>공책에 한 글자당 3번씩, 소리 내면서</p></div>
    <p><a class="btn" href="#/cards/${K.deck}">카드로 복습</a></p>`;
  $app.querySelectorAll('.kana').forEach((el) => el.addEventListener('click', () => play(`audio/kana${n}/k${el.dataset.i}.mp3`)));
  mountComments(`kana${n}`);
}

// 대화문 수업
function viewLesson(key) {
  const L = LESSONS[key]; if (!L) return viewHome();
  const src = (i) => `audio/lesson-${key}/d${i}.mp3`;
  $app.innerHTML = `<h1>${esc(L.title)}</h1>
    <div class="card"><div class="row between"><b>대화문</b>
      <span><button class="play" id="all">전체 듣기</button> <button class="play" id="allslow">느리게</button></span></div>
      ${L.dialogue.map((d, i) => `<div class="dia ${L.lang === 'ja' ? 'ja' : ''}"><b>${jp(d.who)}</b> ${jp(d.t)} <button class="play mini" onclick="__play('${src(i)}')">듣기</button></div>`).join('')}</div>
    ${L.words ? `<h2>단어</h2><div class="card"><table>${L.words.map(([a, b]) => `<tr><td class="jw small-ja">${jp(a)}</td><td>${esc(b)}</td></tr>`).join('')}</table></div>` : ''}
    ${L.menu ? `<h2>${esc(L.menuTitle || '메뉴')}</h2><div class="card"><table>${L.menu.map(([a, b]) => `<tr><td class="jw small-ja">${jp(a)}</td><td class="right">${esc(b)}</td></tr>`).join('')}</table></div>` : ''}
    <h2>역할극</h2>
    ${L.tiers.map((t) => `<div class="card"><b>${t.lv}단</b><p class="pre">${jp(t.body)}</p></div>`).join('')}
    <h2>막힐 때</h2>
    <div class="card"><ul class="tight">${L.help.map((h) => `<li>${jp(h)}</li>`).join('')}</ul></div>
    <p><a class="btn" href="#/cards/${L.deck}">카드로 복습</a></p>`;
  const seq = async (slow) => { for (let i = 0; i < L.dialogue.length; i++) { await new Promise((res) => { play(src(i), slow); audioNow.onended = res; audioNow.onerror = res; }); } };
  document.getElementById('all').addEventListener('click', () => seq(false));
  document.getElementById('allslow').addEventListener('click', () => seq(true));
  mountComments(`lesson-${key}`);
}

// 수업 진행표
function viewClass(n) {
  const C = CLASSES[n]; if (!C) return viewHome();
  $app.innerHTML = `<h1>${esc(C.title)}</h1>
    <p class="muted">${md(C.date)} (수) 밤 9시</p>
    ${C.parts.map((p) => `<div class="card"><div class="row between"><b>${esc(p.name)}</b><span class="small muted">${esc(p.topic)}</span></div>
      <table>${p.rows.map(([t, d]) => `<tr><td class="small muted" style="white-space:nowrap">${t}분</td><td>${esc(d)}</td></tr>`).join('')}</table>
      <p>${p.links.map(([l, h]) => `<a class="btn" href="${h}">${esc(l)}</a>`).join(' ')}</p></div>`).join('')}`;
  mountComments(`class${n}`);
}

// 단어카드 (간격 복습)
const GAP = [0, 1, 2, 4, 7, 14, 30]; // 칸 1~6 → 다음 복습까지 날짜
async function myCards() {
  const rows = await sel('cards', `select=card,box,due&name=eq.${enc(me.name)}`);
  return Object.fromEntries(rows.map((r) => [r.card, r]));
}
async function viewCards() {
  const prog = await myCards(); const t = todayKST();
  $app.innerHTML = `<h1>단어카드</h1>
    <div class="list">${Object.entries(DECKS).map(([k, d]) => {
      const due = d.cards.filter((c) => !prog[c.id] || prog[c.id].due <= t).length;
      return `<a class="item" href="#/cards/${k}"><div class="row between"><b>${esc(d.title)}</b><span class="small muted">오늘 ${due}장 / ${d.cards.length}장</span></div></a>`;
    }).join('')}</div>`;
  mountComments('cards');
}
async function viewDeck(key) {
  const D = DECKS[key]; if (!D) return viewCards();
  const prog = await myCards(); const t = todayKST();
  const shuffle = (a) => a.sort(() => Math.random() - 0.5);
  let queue = shuffle(D.cards.filter((c) => !prog[c.id] || prog[c.id].due <= t));
  let practice = false;
  const finish = async () => {
    toast('끝');
    try { await autoCheck(`cards:${key}`); } catch (e) { console.error(e); }
    location.hash = '#/';
  };
  const next = () => {
    if (!queue.length) return finish();
    const c = queue[0];
    $app.innerHTML = `<h1>${esc(D.title)}</h1><p class="muted small">${practice ? '연습, ' : ''}남은 카드 ${queue.length}</p>
      <div class="card flash"><div class="f ${c.big ? 'big' : ''}">${jp(c.f)}</div><div id="back" hidden><div class="b">${jp(c.b)}</div>
      ${c.ex ? `<div class="muted">${jp(c.ex)}</div>` : ''}
      <p><button class="play" id="pl">듣기</button> <button class="play" id="ps">느리게</button></p></div>
      <p id="flipw"><button class="primary" id="flip">뒤집기</button></p>
      <div class="grade" id="grade" hidden><button data-g="0">모름</button><button data-g="1">애매</button><button data-g="2">앎</button></div></div>`;
    const flip = () => { $app.querySelector('#back').hidden = false; $app.querySelector('#flipw').hidden = true; $app.querySelector('#grade').hidden = false; play(c.a); };
    $app.querySelector('#flip').addEventListener('click', flip);
    $app.querySelector('#pl').addEventListener('click', () => play(c.a));
    $app.querySelector('#ps').addEventListener('click', () => play(c.a, true));
    $app.querySelectorAll('[data-g]').forEach((b) => b.addEventListener('click', () => grade(c, Number(b.dataset.g))));
  };
  const grade = (c, g) => {
    queue.shift();
    const box0 = prog[c.id]?.box || 1;
    let box, due;
    if (g === 0) { box = 1; due = t; queue.push(c); }
    else if (g === 1) { box = Math.max(1, box0); due = addDays(t, 1); }
    else { box = Math.min(6, (prog[c.id] ? box0 : 1) + 1); due = addDays(t, GAP[box]); }
    if (!practice) { prog[c.id] = { box, due }; rpc('save_card', { p_name: me.name, p_pin: me.pin, p_card: c.id, p_box: box, p_due: due }).catch(() => toast('저장 안 됨. 인터넷 확인')); }
    next();
  };
  if (!queue.length) {
    $app.innerHTML = `<h1>${esc(D.title)}</h1><div class="card flash"><div class="f">오늘 볼 카드 없음</div>
      <p><button class="primary" id="prac">전체 연습</button> <a class="btn" href="#/cards">목록</a></p></div>`;
    document.getElementById('prac').addEventListener('click', () => { practice = true; queue = shuffle([...D.cards]); next(); });
    return;
  }
  next();
}

// 관리 (진행자)
const monthOf = (d) => d.slice(0, 7);
function monthsSoFar() {
  const out = []; let m = SITE.firstQuizMonth; const now = monthOf(todayKST());
  while (m <= now) { out.push(m); const [y, mm] = m.split('-').map(Number); m = mm === 12 ? `${y + 1}-01` : `${y}-${String(mm + 1).padStart(2, '0')}`; }
  return out.length ? out : [SITE.firstQuizMonth];
}
async function standings(month, by) {
  const wks = weekKeys().filter((k) => monthOf(k) === month && k <= todayKST());
  const qs = await sel('quiz', `select=name,score&month=eq.${month}`);
  const score = Object.fromEntries(qs.map((q) => [q.name, q.score]));
  return members.map((m) => {
    const rate = wks.length ? wks.filter((k) => weekComplete(by, m.name, k)).length / wks.length : 0;
    const q = score[m.name];
    return { name: m.name, q, rate, total: q == null ? null : q + Math.round(rate * 20) };
  });
}
function winnersOf(rows, excluded) {
  const ok = rows.filter((r) => r.total != null && !excluded.includes(r.name));
  const top = Math.max(...ok.map((r) => r.total));
  return ok.filter((r) => r.total === top).map((r) => r.name);
}

async function viewAdmin() {
  members = await rpc('list_members');
  if (!isHost()) { location.hash = '#/'; return; }
  const by = await teamData();
  const months = monthsSoFar(); const month = viewAdmin.month || months[months.length - 1];
  const rows = await standings(month, by);
  const excluded = [hostName()];
  const wins = winnersOf(rows, excluded);
  const tie = wins.length > 1;
  const diag = await sel('diagnosis', 'select=name,lang,level');
  const lv = {}; diag.forEach((d) => ((lv[d.name] ||= {})[d.lang] = d.level));
  $app.innerHTML = `<h1>관리</h1>
    <h2>퀴즈</h2>
    <div class="card"><select id="month" style="width:auto">${months.map((m) => `<option ${m === month ? 'selected' : ''}>${m}</option>`).join('')}</select>
      <table style="margin-top:10px"><tr><th></th><th>문제 (80)</th><th>숙제 (20)</th><th>합계</th></tr>
      ${rows.map((r) => `<tr><td>${esc(r.name)}${wins.includes(r.name) ? ` <span class="badge ok">${tie ? '동점, 사다리' : '피자'}</span>` : ''}${excluded.includes(r.name) ? ' <span class="small muted">제외</span>' : ''}</td>
        <td><input type="number" min="0" max="80" value="${r.q ?? ''}" data-q="${esc(r.name)}" style="width:80px;padding:6px"></td>
        <td>${Math.round(r.rate * 20)}</td><td><b>${r.total ?? ''}</b></td></tr>`).join('')}</table>
      <p><button class="primary" id="saveq">저장</button></p></div>
    <h2>수준 진단</h2>
    <div class="card"><table><tr><th></th><th>일본어</th><th>영어</th></tr>
      ${members.map((m) => `<tr><td>${esc(m.name)}</td><td>${lv[m.name]?.ja ? lv[m.name].ja + '단' : ''}</td><td>${lv[m.name]?.en ? lv[m.name].en + '단' : ''}</td></tr>`).join('')}</table></div>
    <h2>비밀번호 초기화</h2>
    <div class="card"><table>${members.map((m) => `<tr><td>${esc(m.name)}</td><td class="small muted">${m.has_pin ? '' : '아직 없음'}</td>
      <td class="right">${m.has_pin && m.name !== me.name ? `<button class="mini" data-reset="${esc(m.name)}">초기화</button>` : ''}</td></tr>`).join('')}</table></div>`;
  document.getElementById('month').addEventListener('change', (e) => { viewAdmin.month = e.target.value; viewAdmin(); });
  document.getElementById('saveq').addEventListener('click', async () => {
    for (const inp of $app.querySelectorAll('[data-q]')) {
      const v = inp.value.trim(); const n = v === '' ? null : Math.max(0, Math.min(80, Number(v)));
      if (!(await rpc('set_quiz', { p_host: me.name, p_hpin: me.pin, p_month: month, p_target: inp.dataset.q, p_score: n }))) return toast(FAIL);
    }
    toast('저장함'); viewAdmin();
  });
  $app.querySelectorAll('[data-reset]').forEach((b) => b.addEventListener('click', async () => {
    if (b.dataset.sure !== '1') { b.dataset.sure = '1'; b.textContent = '진짜 초기화'; return; }
    if (await rpc('reset_pin', { p_host: me.name, p_hpin: me.pin, p_target: b.dataset.reset })) { toast('초기화함'); viewAdmin(); } else toast(FAIL);
  }));
}

// 화면 전환
async function route() {
  renderWho();
  window.scrollTo(0, 0);
  try {
    if (!me) return await viewLogin();
    const [p, a] = location.hash.replace(/^#\/?/, '').split('/');
    if (p === 'rules') return viewRules();
    if (p === 'diagnosis') return await viewDiagnosis();
    if (p === 'kana') return viewKana(a);
    if (p === 'lesson') return viewLesson(a);
    if (p === 'class') return viewClass(a);
    if (p === 'cards') return a ? await viewDeck(a) : await viewCards();
    if (p === 'homework') return await viewHomework(a);
    if (p === 'admin') return await viewAdmin();
    return await viewHome();
  } catch (e) {
    console.error(e);
    $app.innerHTML = `<div class="card"><b>불러오기 실패</b><p class="small muted">${esc(e.message)}</p><p><button onclick="location.reload()">새로고침</button></p></div>`;
  }
}
window.addEventListener('hashchange', route);

(async () => {
  try { members = await rpc('list_members'); } catch {}
  if (me) { try { if (!(await rpc('login', { p_name: me.name, p_pin: me.pin }))) setMe(null); } catch {} }
  route();
})();
