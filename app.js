import { SITE, WEEKS, DIAG, KANA1, KANA_TIPS, EN1, DECKS, PAGES } from './content.js';

// ───────── 서버 연결 (Supabase) ─────────
const URL_ = 'https://yptxfuafkzdipvvnnxte.supabase.co';
const KEY = 'sb_publishable_FelEHU0imLZ0GTNhMj88BQ_B_6Qy21K'; // 공개용 키. 쓰기는 비밀번호 확인 함수로만 된다.
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

// ───────── 작은 도구 ─────────
const $app = document.getElementById('app');
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
function toast(msg) { const t = document.getElementById('toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('on'), 2200); }
const todayKST = () => new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10);
const addDays = (d, n) => { const x = new Date(d + 'T00:00:00Z'); x.setUTCDate(x.getUTCDate() + n); return x.toISOString().slice(0, 10); };
const weekKeys = () => Object.keys(WEEKS).sort();
const currentWeek = () => weekKeys().filter((k) => k <= todayKST()).pop() || weekKeys()[0];
const fmtTime = (iso) => new Date(iso).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', month: 'numeric', day: 'numeric', hour: 'numeric', minute: '2-digit' });
let audioNow;
function play(src, slow = false) { try { audioNow?.pause(); audioNow = new Audio(src); audioNow.playbackRate = slow ? 0.7 : 1; audioNow.play(); } catch {} }
window.__play = play;

// ───────── 로그인 ─────────
let me = JSON.parse(localStorage.getItem('study_me') || 'null');
let members = [];
const hostName = () => members.find((m) => m.is_host)?.name || '진행자';
const isHost = () => me && members.some((m) => m.is_host && m.name === me.name);
function setMe(v) { me = v; v ? localStorage.setItem('study_me', JSON.stringify(v)) : localStorage.removeItem('study_me'); renderWho(); }
function renderWho() {
  const w = document.getElementById('who');
  w.innerHTML = me ? `${esc(me.name)} <button class="mini" id="logout">나가기</button>` : '';
  w.querySelector('#logout')?.addEventListener('click', () => { setMe(null); location.hash = '#/'; route(); });
}

async function viewLogin() {
  members = await rpc('list_members');
  $app.innerHTML = `
    <h1>누구세요?</h1>
    <p class="muted">이름을 고르세요. 처음이면 숫자 4자리 비밀번호를 정해요.</p>
    <div class="names">${members.map((m) => `<button data-n="${esc(m.name)}">${esc(m.name)}</button>`).join('')}</div>
    <div id="pinbox"></div>`;
  $app.querySelectorAll('.names button').forEach((b) => b.addEventListener('click', () => pinStep(members.find((m) => m.name === b.dataset.n))));
}
function pinStep(m) {
  const box = document.getElementById('pinbox');
  const first = !m.has_pin;
  box.innerHTML = `<div class="card">
    <h3>${esc(m.name)} — ${first ? '비밀번호 정하기 (숫자 4자리)' : '비밀번호'}</h3>
    <input class="pin" id="p1" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="••••">
    ${first ? '<p class="small muted">한 번 더</p><input class="pin" id="p2" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="••••">' : ''}
    <p><button class="primary" id="go">${first ? '정하고 들어가기' : '들어가기'}</button></p>
    <p class="small muted">${first ? `잊어버리면 ${esc(hostName())}에게 초기화를 부탁하세요.` : `비밀번호를 잊었으면 ${esc(hostName())}에게 초기화를 부탁하세요.`}</p></div>`;
  const p1 = box.querySelector('#p1'); p1.focus();
  box.querySelector('#go').addEventListener('click', async () => {
    const pin = p1.value.trim();
    if (!/^\d{4}$/.test(pin)) return toast('숫자 4자리를 넣어 주세요');
    if (first) {
      if (box.querySelector('#p2').value.trim() !== pin) return toast('두 번 넣은 숫자가 달라요');
      if (!(await rpc('set_pin', { p_name: m.name, p_pin: pin }))) return toast('이미 비밀번호가 있어요. 새로고침해 주세요');
    }
    if (!(await rpc('login', { p_name: m.name, p_pin: pin }))) return toast('비밀번호가 맞지 않아요 (10분에 10번 넘게 틀리면 잠시 막혀요)');
    setMe({ name: m.name, pin }); toast(`${m.name} 어서 와요!`); route();
  });
}

// ───────── 댓글 ─────────
const PAGE_TITLE = { home: '첫 화면', rules: '운영 규칙', diagnosis: '수준 진단', kana1: '히라가나 1주차', english1: '영어 1주차', cards: '단어카드', homework: '숙제 체크표' };
async function mountComments(page) {
  const wrap = document.createElement('section');
  wrap.innerHTML = `<h2>질문·댓글</h2><div class="card"><div id="clist" class="small muted">불러오는 중…</div>
    <textarea id="cbody" placeholder="모르는 것, 틀린 것 같은 것, 아무거나 남겨 주세요"></textarea>
    <p><button class="primary" id="csend">남기기</button></p></div>`;
  $app.appendChild(wrap);
  const load = async () => {
    const rows = await sel('comments', `select=id,name,body,created_at&page=eq.${enc(page)}&order=created_at.asc`);
    const list = wrap.querySelector('#clist');
    list.classList.remove('muted');
    list.innerHTML = rows.length ? rows.map((c) => `<div class="comment"><div class="meta">${esc(c.name)} · ${fmtTime(c.created_at)}
      ${(c.name === me.name || isHost()) ? `<button class="mini" data-del="${c.id}">지우기</button>` : ''}</div><p>${esc(c.body)}</p></div>`).join('')
      : '<p class="muted">아직 댓글이 없어요.</p>';
    list.querySelectorAll('[data-del]').forEach((b) => b.addEventListener('click', async () => {
      if (b.dataset.sure !== '1') { b.dataset.sure = '1'; b.textContent = '정말 지우기'; return; }
      await rpc('delete_comment', { p_name: me.name, p_pin: me.pin, p_id: Number(b.dataset.del) }); load();
    }));
  };
  wrap.querySelector('#csend').addEventListener('click', async () => {
    const t = wrap.querySelector('#cbody'); const body = t.value.trim();
    if (!body) return;
    if (!(await rpc('add_comment', { p_name: me.name, p_pin: me.pin, p_page: page, p_body: body }))) return toast('저장하지 못했어요. 다시 들어와 주세요');
    t.value = ''; toast('남겼어요'); load();
  });
  load();
}

// ───────── 숙제 ─────────
async function myDone(week) {
  const rows = await sel('homework', `select=item&name=eq.${enc(me.name)}&week=eq.${week}`);
  return new Set(rows.map((r) => r.item));
}
async function setHW(week, item, done) {
  return rpc('set_homework', { p_name: me.name, p_pin: me.pin, p_week: week, p_item: item, p_done: done });
}
async function autoCheck(key) {
  const w = currentWeek(); const it = WEEKS[w]?.items.find((i) => i.auto === key);
  if (it) { await setHW(w, it.id, true); toast(`숙제 체크됨: ${it.text.split(' (')[0]}`); }
}

async function viewHomework() {
  const w = currentWeek(); const W = WEEKS[w];
  const done = await myDone(w);
  const req = W.items; const n = req.filter((i) => done.has(i.id)).length;
  $app.innerHTML = `
    <h1>숙제 체크표</h1>
    <p class="muted">${esc(W.title)} · ${w.slice(5).replace('-', '/')}(수) 시작</p>
    <p class="small">${esc(W.note)}</p>
    <div class="card"><div class="row" style="justify-content:space-between"><b>이번 주 숙제</b><span class="badge ${n === req.length ? 'ok' : ''}">${n}/${req.length}</span></div>
      ${req.map((i) => checkRow(i, done.has(i.id))).join('')}</div>
    <h3>더 하고 싶은 사람 (점수 없음)</h3>
    <div class="card">${W.extras.map((i) => checkRow(i, done.has(i.id))).join('')}</div>
    <h2>모두의 진행 상황</h2><div class="card" id="team">불러오는 중…</div>`;
  $app.querySelectorAll('.check input').forEach((cb) => cb.addEventListener('change', async () => {
    const ok = await setHW(w, cb.dataset.id, cb.checked);
    if (!ok) { cb.checked = !cb.checked; return toast('저장하지 못했어요. 다시 들어와 주세요'); }
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
  el.innerHTML = `<table><tr><th>이름</th>${wks.map((k) => `<th>${k.slice(5).replace('-', '/')}</th>`).join('')}</tr>
    ${members.map((m) => `<tr><td>${esc(m.name)}</td>${wks.map((k) => {
      const c = WEEKS[k].items.filter((i) => by[m.name]?.[k]?.has(i.id)).length, t = WEEKS[k].items.length;
      const x = WEEKS[k].extras.filter((i) => by[m.name]?.[k]?.has(i.id)).length;
      return `<td>${c === t ? '✅' : `${c}/${t}`}${x ? ` <span class="small muted">+${x}</span>` : ''}</td>`;
    }).join('')}</tr>`).join('')}</table>
    <p class="small muted">+숫자는 "더 하고 싶은 사람" 항목을 한 개수예요.</p>`;
}

// ───────── 첫 화면 ─────────
async function viewHome() {
  const w = currentWeek(); const W = WEEKS[w];
  const done = await myDone(w); const n = W.items.filter((i) => done.has(i.id)).length;
  const last = localStorage.getItem('study_seen') || '1970-01-01';
  const recent = await sel('comments', 'select=id,page,name,body,created_at&order=created_at.desc&limit=20');
  const fresh = recent.filter((c) => c.created_at > last && c.name !== me.name);
  $app.innerHTML = `
    <h1>${esc(me.name)}, 안녕하세요 👋</h1>
    <p class="muted">${esc(SITE.meet)}</p>
    <a class="item" href="#/homework" style="display:block;text-decoration:none;color:inherit">
      <div class="row" style="justify-content:space-between"><b>이번 주 숙제 · ${esc(W.title)}</b><span class="badge ${n === W.items.length ? 'ok' : ''}">${n}/${W.items.length}</span></div>
      <div class="progress" style="margin-top:8px"><div style="width:${(n / W.items.length) * 100}%"></div></div></a>
    ${fresh.length ? `<div class="card"><div class="row" style="justify-content:space-between"><b>새 질문·댓글 <span class="badge">${fresh.length}</span></b><button class="mini" id="seen">다 읽음</button></div>
      ${fresh.slice(0, 5).map((c) => `<div class="comment"><div class="meta">${esc(c.name)} · <a href="#/${c.page === 'home' ? '' : c.page}">${esc(PAGE_TITLE[c.page] || c.page)}</a> · ${fmtTime(c.created_at)}</div><p>${esc(c.body.slice(0, 120))}</p></div>`).join('')}</div>` : ''}
    <h2>자료</h2>
    <div class="list">${PAGES.map((p) => `<a class="item" href="${p.href}"><b>${esc(p.title)}</b><span>${esc(p.sub)}</span></a>`).join('')}
    ${isHost() ? '<a class="item" href="#/admin"><b>🔧 관리 (진행자 전용)</b><span>퀴즈 점수·피자·비밀번호 초기화·진단 결과</span></a>' : ''}</div>`;
  document.getElementById('seen')?.addEventListener('click', () => { localStorage.setItem('study_seen', new Date().toISOString()); viewHome(); });
}

// ───────── 운영 규칙 ─────────
function viewRules() {
  $app.innerHTML = `
    <h1>운영 규칙</h1>
    <p class="muted">2년 동안 지킬 약속 한 장. 바꾸고 싶은 건 아래 댓글로!</p>
    <div class="card"><h3>🎯 목표</h3>
      <p>"2년 뒤 현지인처럼"은 주 1시간으로는 닿기 어려운 <b>방향</b>으로 두고, 실제로는 <b>해낸 일</b>로 성장을 재요.</p>
      <ul class="tight">
        <li><b>일본어</b>: 3개월 가나 다 읽기 · 6개월 주문·길 묻기 · 1년 천천히 말해 주는 사람과 여행 대화 · 2년 JLPT N5 합격 + N4 일부</li>
        <li><b>영어</b>: 1년에 말하기·듣기 한 단계, 2년에 한두 단계 위로 (대략 B1)</li>
        <li>더 빨리 가고 싶으면 평소 보는 애니·드라마·게임을 그 언어로 바꾸는 게 제일 쉬운 길이에요.</li>
      </ul></div>
    <div class="card"><h3>📅 모임 (${esc(SITE.meet)})</h3>
      <ul class="tight">
        <li>한 번에 <b>두 언어를 27분씩</b>. 시작 언어는 주마다 바꿔요.</li>
        <li>27분 = 지난 표현 떠올리기 3 → 듣고 읽기 5 → <b>2~3명 역할극 12</b> → 채팅으로 쓰기 4 → 피드백 3</li>
        <li>몇 명 빠져도 그대로 해요. 빠진 주 자료는 여기 있으니 다음 주에 그냥 오면 돼요.</li>
        <li>따라 말하기는 각자 음소거하고 해요(온라인은 소리가 밀려요).</li>
        <li>피드백은 끝에 <b>잘한 점 1개 + 고칠 점 1개</b>만. 말하는 중에 끊지 않아요.</li>
        <li>5주가 있는 달의 다섯째 수요일은 쉬거나 자유 회차예요.</li>
      </ul></div>
    <div class="card"><h3>🪜 실력이 달라도 같이</h3>
      <ul class="tight">
        <li>같은 상황을 <b>1단(그대로) · 2단(이유·질문 붙이기) · 3단(돌발 상황)</b>으로 나눠요.</li>
        <li>내 단계는 <a href="#/diagnosis">수준 진단</a>으로 정해요. 언어마다 따로예요.</li>
        <li>3단은 선생님이 아니라 역할극에서 <b>현지인 역(점원·친구)</b>을 맡아요.</li>
        <li>같은 단계에서 두 달 연속 퀴즈 90% 이상이면 한 단계 올라가요.</li>
      </ul></div>
    <div class="card"><h3>📝 숙제</h3>
      <ul class="tight">
        <li><b>주 단위</b>, 1시간쯤. 수요일에 새 주 숙제가 열려요. <a href="#/homework">숙제 체크표</a>에서 체크해요.</li>
        <li>더 하고 싶은 사람은 "더 하고 싶은 사람" 항목도 있어요(점수와 상관없음).</li>
        <li>밀린 주는 몰아서 하지 않고 <b>이번 주 것부터</b> 해요.</li>
      </ul></div>
    <div class="card"><h3>🍕 월간 퀴즈와 피자</h3>
      <ul class="tight">
        <li>매달 넷째 주에 디스코드에 퀴즈가 올라와요. <b>15분 안에 혼자 풀고 답을 ${esc(hostName())}에게 개인 메시지</b>로 보내요.</li>
        <li>범위는 <b>그달에 배운 것만</b>, 일본어·영어 반반.</li>
        <li>점수 = <b>문제 80 + 그달 주간 숙제 완료율 20</b>. 동점이면 숙제 완료율이 높은 사람.</li>
        <li>1등은 피자! 대신 <b>다음 달 한 번은 피자 대상에서 빠져요</b>. ${esc(hostName())}(진행자)은 같이 풀지만 피자 대상이 아니에요.</li>
        <li>발표는 다음 달 첫 모임 첫 5분.</li>
      </ul></div>
    <div class="card"><h3>🎧 성장 확인</h3>
      <p>시작·3개월·6개월·1년·2년에 같은 질문 5개에 1분씩 답한 녹음을 <b>각자 폰에</b> 남겨요. 아무에게도 보내지 않아요. 3개월 뒤 처음 것과 같이 들어 보면 늘었는지 바로 알아요.</p></div>`;
  mountComments('rules');
}

// ───────── 수준 진단 ─────────
async function viewDiagnosis() {
  const rows = await sel('diagnosis', `select=lang,answers,level&name=eq.${enc(me.name)}`);
  const saved = Object.fromEntries(rows.map((r) => [r.lang, r]));
  const block = (lang) => {
    const D = DIAG[lang]; const a = saved[lang]?.answers || [];
    return `<div class="card" data-lang="${lang}"><div class="row" style="justify-content:space-between"><h3 style="margin:0">${D.label}</h3>
      ${saved[lang] ? `<span class="badge ok">${saved[lang].level}단</span>` : '<span class="badge">아직</span>'}</div>
      <p class="small muted">할 수 있는 것만 체크하세요. 애매하면 체크하지 않아요.</p>
      ${D.items.map((t, i) => `<label class="check"><input type="checkbox" data-i="${i}" ${a.includes(i) ? 'checked' : ''}><span class="txt">${esc(t)}</span></label>`).join('')}
      <p><button class="primary" data-save="${lang}">${D.label} 결과 저장</button> <span class="small" data-res="${lang}">${saved[lang] ? esc(DIAG.levelText[saved[lang].level]) : ''}</span></p></div>`;
  };
  $app.innerHTML = `<h1>수준 진단 + 시작 녹음</h1>
    <p class="muted">점수가 아니라 출발점을 정하는 거예요. 결과에 따라 역할극 카드 단계(1~3단)가 정해져요.</p>
    ${block('ja')}${block('en')}
    <h2 id="rec">🎙️ 시작 녹음</h2>
    <div class="card"><p>폰 녹음 앱을 켜고, <b>일본어로 한 번, 영어로 한 번</b> 아래 질문에 각각 1분씩 답하세요. 모르면 아는 단어만, 한국어 섞어도 괜찮아요. 아예 못 하겠으면 "わかりません" / "I don't know"도 기록이에요.</p>
      <ol>${DIAG.recording.map((q) => `<li>${esc(q)}</li>`).join('')}</ol>
      <p class="small muted">파일 이름 예: <code>시작녹음_일본어_${todayKST()}</code>. 아무에게도 보내지 않고 내 폰에만 둬요. 3개월 뒤에 같은 질문으로 다시 녹음해서 비교해요.</p></div>`;
  $app.querySelectorAll('[data-save]').forEach((b) => b.addEventListener('click', async () => {
    const lang = b.dataset.save; const box = $app.querySelector(`[data-lang="${lang}"]`);
    const ans = [...box.querySelectorAll('input:checked')].map((x) => Number(x.dataset.i));
    let lv = DIAG.level(ans.length);
    if (lang === 'ja' && !ans.includes(0)) lv = 1; // 히라가나를 못 읽으면 1단
    if (!(await rpc('save_diagnosis', { p_name: me.name, p_pin: me.pin, p_lang: lang, p_answers: ans, p_level: lv }))) return toast('저장하지 못했어요');
    saved[lang] = { level: lv };
    box.querySelector(`[data-res="${lang}"]`).textContent = DIAG.levelText[lv];
    box.querySelector('.badge').className = 'badge ok'; box.querySelector('.badge').textContent = `${lv}단`;
    toast(`${DIAG[lang].label} ${lv}단으로 저장했어요`);
    if (saved.ja && saved.en) autoCheck('diag');
  }));
  mountComments('diagnosis');
}

// ───────── 히라가나 1주차 ─────────
function viewKana1() {
  $app.innerHTML = `<h1>히라가나 1주차 · あ~そ</h1>
    <p class="muted">글자를 누르면 소리가 나요. 아래 단어는 이번 주 15자만으로 만든 단어예요.</p>
    <div class="kana-grid">${KANA1.map((x, i) => `<div class="kana" data-i="${i}"><div class="k">${x.k}</div><div class="s">${x.s}</div></div>`).join('')}</div>
    <h2>예시 단어</h2>
    <div class="card"><table>${KANA1.map((x, i) => `<tr><td style="font-size:22px">${x.w}</td><td>${esc(x.m)}</td>
      <td style="text-align:right"><button class="play" onclick="__play('audio/ja/w${i}.mp3')">▶︎</button> <button class="play" onclick="__play('audio/ja/w${i}.mp3', true)">느리게</button></td></tr>`).join('')}</table></div>
    <h2>발음 메모</h2><div class="card"><ul class="tight">${KANA_TIPS.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div>
    <h2>쓰기 연습</h2><div class="card"><p>공책에 15자를 <b>3번씩</b> 쓰면서 소리 내 읽어요. 획순은 위에서 아래, 왼쪽에서 오른쪽이 기본이에요. 헷갈리는 글자 짝: <b>い/こ</b>, <b>き/さ</b>, <b>け/は(다음 주)</b>.</p>
      <p class="small muted">로마자(a, ka…)는 쓰지 않아요. 한글 소리는 이번 주와 다음 주에만 보조로 보여 줘요.</p></div>
    <p><a class="btn" href="#/cards/hira1">히라가나 카드로 복습하기 →</a></p>`;
  $app.querySelectorAll('.kana').forEach((el) => el.addEventListener('click', () => play(`audio/ja/k${el.dataset.i}.mp3`)));
  mountComments('kana1');
}

// ───────── 영어 1주차 ─────────
function viewEnglish1() {
  $app.innerHTML = `<h1>영어 1주차 · 인사·자기소개</h1>
    <p class="muted">대화문을 듣고 → 따라 말하고 → 내 얘기로 바꿔요.</p>
    <div class="card"><div class="row" style="justify-content:space-between"><b>1분 대화문</b>
      <span><button class="play" id="all">▶︎ 전체 듣기</button> <button class="play" id="allslow">느리게</button></span></div>
      ${EN1.dialogue.map((d, i) => `<div class="dia"><b>${d.who}</b> ${esc(d.t)} <button class="play mini" onclick="__play('audio/en/d${i}.mp3')">▶︎</button></div>`).join('')}</div>
    <h2>역할극 단계</h2>
    ${EN1.tiers.map((t) => `<div class="card"><b>${esc(t.title)}</b><p class="pre">${esc(t.body)}</p></div>`).join('')}
    <h2>막힐 때 쓰는 말</h2>
    <div class="card"><ul class="tight">${EN1.help.map((h) => `<li>${esc(h)}</li>`).join('')}</ul></div>
    <p><a class="btn" href="#/cards/en1">영어 카드로 복습하기 →</a></p>`;
  const seq = async (slow) => { for (let i = 0; i < EN1.dialogue.length; i++) { await new Promise((res) => { play(`audio/en/d${i}.mp3`, slow); audioNow.onended = res; audioNow.onerror = res; }); } };
  document.getElementById('all').addEventListener('click', () => seq(false));
  document.getElementById('allslow').addEventListener('click', () => seq(true));
  mountComments('english1');
}

// ───────── 단어카드 (간격 복습) ─────────
const GAP = [0, 1, 2, 4, 7, 14, 30]; // 칸(box) 1~6 → 다음 복습까지 날짜
async function myCards() {
  const rows = await sel('cards', `select=card,box,due&name=eq.${enc(me.name)}`);
  return Object.fromEntries(rows.map((r) => [r.card, r]));
}
async function viewCards() {
  const prog = await myCards(); const t = todayKST();
  $app.innerHTML = `<h1>단어카드</h1>
    <p class="muted">아는 카드는 점점 늦게, 모르는 카드는 자주 다시 나와요. 하루에 조금씩 여러 번이 제일 좋아요.</p>
    <div class="list">${Object.entries(DECKS).map(([k, d]) => {
      const due = d.cards.filter((c) => !prog[c.id] || prog[c.id].due <= t).length;
      return `<a class="item" href="#/cards/${k}"><b>${esc(d.title)}</b><span>${d.cards.length}장 · 오늘 볼 카드 ${due}장</span></a>`;
    }).join('')}</div>`;
  mountComments('cards');
}
async function viewDeck(key) {
  const D = DECKS[key]; if (!D) return viewCards();
  const prog = await myCards(); const t = todayKST();
  let queue = D.cards.filter((c) => !prog[c.id] || prog[c.id].due <= t).sort(() => Math.random() - 0.5);
  let practice = false, shown = 0;
  const total = () => queue.length;
  const start = () => { shown = 0; next(); };
  const finish = async () => {
    $app.innerHTML = `<h1>${esc(D.title)}</h1><div class="card flash"><div class="f">🎉 다 했어요!</div>
      <p class="muted">${practice ? '연습 모드라 복습 날짜는 그대로예요.' : '다음에 볼 날짜를 정해 두었어요.'}</p>
      <p><button id="again">처음부터 한 번 더</button> <a class="btn" href="#/cards">덱 목록</a></p></div>`;
    document.getElementById('again').addEventListener('click', () => { practice = true; queue = [...D.cards].sort(() => Math.random() - 0.5); start(); });
    await autoCheck(`cards:${key}`);
  };
  const next = () => {
    if (!queue.length) return finish();
    const c = queue[0]; shown++;
    $app.innerHTML = `<h1>${esc(D.title)}</h1><p class="muted small">${practice ? '연습 모드 · ' : ''}남은 카드 ${total()}장</p>
      <div class="card flash"><div class="f ${c.big ? 'big' : ''}">${esc(c.f)}</div><div id="back" hidden><div class="b">${esc(c.b)}</div>
      <p><button class="play" id="pl">▶︎ 소리</button> <button class="play" id="ps">느리게</button></p></div>
      <p id="flipw"><button class="primary" id="flip">뒤집기</button></p>
      <div class="grade" id="grade" hidden><button data-g="0">😵 몰라요</button><button data-g="1">🤔 헷갈려요</button><button data-g="2">😎 알아요</button></div></div>
      <p class="small muted">${D.lang === 'ja' ? '앞면을 보고 소리 내 읽은 다음 뒤집어요.' : '한국어를 보고 영어로 소리 내 말한 다음 뒤집어요.'}</p>`;
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
    if (!practice) { prog[c.id] = { box, due }; rpc('save_card', { p_name: me.name, p_pin: me.pin, p_card: c.id, p_box: box, p_due: due }).catch(() => toast('저장 실패 — 인터넷을 확인해 주세요')); }
    next();
  };
  if (!queue.length) {
    $app.innerHTML = `<h1>${esc(D.title)}</h1><div class="card flash"><div class="f">오늘 볼 카드는 다 봤어요 👍</div>
      <p><button class="primary" id="prac">그래도 전체 연습하기</button> <a class="btn" href="#/cards">덱 목록</a></p></div>`;
    document.getElementById('prac').addEventListener('click', () => { practice = true; queue = [...D.cards].sort(() => Math.random() - 0.5); start(); });
    return;
  }
  start();
}

// ───────── 관리 (진행자) ─────────
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
const prevMonth = (m) => { const [y, mm] = m.split('-').map(Number); return mm === 1 ? `${y - 1}-12` : `${y}-${String(mm - 1).padStart(2, '0')}`; };
const winnerOf = (rows, excluded) => rows.filter((r) => r.total != null && !excluded.includes(r.name))
  .sort((a, b) => b.total - a.total || b.rate - a.rate)[0]?.name;

async function viewAdmin() {
  if (!isHost()) { location.hash = '#/'; return; }
  members = await rpc('list_members');
  const by = await teamData();
  const months = monthsSoFar(); const month = viewAdmin.month || months[months.length - 1];
  const rows = await standings(month, by);
  const prevRows = month > SITE.firstQuizMonth ? await standings(prevMonth(month), by) : [];
  const prevWinner = winnerOf(prevRows, [hostName()]);
  const excluded = [hostName(), prevWinner].filter(Boolean);
  const win = winnerOf(rows, excluded);
  const diag = await sel('diagnosis', 'select=name,lang,level');
  const lv = {}; diag.forEach((d) => ((lv[d.name] ||= {})[d.lang] = d.level));
  $app.innerHTML = `<h1>🔧 관리</h1>
    <h2>퀴즈 점수</h2>
    <div class="card"><div class="row"><select id="month" style="width:auto">${months.map((m) => `<option ${m === month ? 'selected' : ''}>${m}</option>`).join('')}</select>
      <span class="small muted">문제 점수(0~80)를 넣으면 숙제 완료율 20점이 자동으로 더해져요.</span></div>
      <table style="margin-top:10px"><tr><th>이름</th><th>문제</th><th>숙제율</th><th>총점</th><th></th></tr>
      ${rows.map((r) => `<tr><td>${esc(r.name)}${r.name === win ? ' 🍕' : ''}${excluded.includes(r.name) ? ' <span class="small muted">(피자 제외)</span>' : ''}</td>
        <td><input type="number" min="0" max="80" value="${r.q ?? ''}" data-q="${esc(r.name)}" style="width:80px;padding:6px"></td>
        <td>${Math.round(r.rate * 100)}%</td><td><b>${r.total ?? '-'}</b></td></tr>`).join('')}</table>
      <p><button class="primary" id="saveq">점수 저장</button></p>
      <p class="small muted">${win ? `이번 달 피자: <b>${esc(win)}</b>` : '점수를 넣으면 피자 주인이 표시돼요.'} ${prevWinner ? `· 지난달 1등 ${esc(prevWinner)}은(는) 이번 달 피자 제외` : ''} · 동점이면 숙제율이 높은 사람</p></div>
    <h2>수준 진단 결과</h2>
    <div class="card"><table><tr><th>이름</th><th>일본어</th><th>영어</th></tr>
      ${members.map((m) => `<tr><td>${esc(m.name)}</td><td>${lv[m.name]?.ja ? lv[m.name].ja + '단' : '-'}</td><td>${lv[m.name]?.en ? lv[m.name].en + '단' : '-'}</td></tr>`).join('')}</table></div>
    <h2>비밀번호 초기화</h2>
    <div class="card"><table>${members.map((m) => `<tr><td>${esc(m.name)}</td><td>${m.has_pin ? '설정됨' : '<span class="muted">아직</span>'}</td>
      <td style="text-align:right">${m.has_pin && m.name !== me.name ? `<button class="mini" data-reset="${esc(m.name)}">초기화</button>` : ''}</td></tr>`).join('')}</table>
      <p class="small muted">초기화하면 그 사람이 다음에 들어올 때 새 비밀번호를 정해요.</p></div>`;
  document.getElementById('month').addEventListener('change', (e) => { viewAdmin.month = e.target.value; viewAdmin(); });
  document.getElementById('saveq').addEventListener('click', async () => {
    for (const inp of $app.querySelectorAll('[data-q]')) {
      const v = inp.value.trim(); const n = v === '' ? null : Math.max(0, Math.min(80, Number(v)));
      if (!(await rpc('set_quiz', { p_host: me.name, p_hpin: me.pin, p_month: month, p_target: inp.dataset.q, p_score: n }))) return toast('저장하지 못했어요');
    }
    toast('저장했어요'); viewAdmin();
  });
  $app.querySelectorAll('[data-reset]').forEach((b) => b.addEventListener('click', async () => {
    if (b.dataset.sure !== '1') { b.dataset.sure = '1'; b.textContent = '정말 초기화'; return; }
    if (await rpc('reset_pin', { p_host: me.name, p_hpin: me.pin, p_target: b.dataset.reset })) { toast('초기화했어요'); viewAdmin(); } else toast('실패했어요');
  }));
}

// ───────── 길 안내 ─────────
async function route() {
  renderWho();
  window.scrollTo(0, 0);
  try {
    if (!me) return await viewLogin();
    const h = location.hash.replace(/^#\/?/, '');
    const [p, a] = h.split('/');
    if (!p) return await viewHome();
    if (p === 'rules') return viewRules();
    if (p === 'diagnosis') return await viewDiagnosis();
    if (p === 'kana1') return viewKana1();
    if (p === 'english1') return viewEnglish1();
    if (p === 'cards') return a ? await viewDeck(a) : await viewCards();
    if (p === 'homework') return await viewHomework();
    if (p === 'admin') return await viewAdmin();
    return await viewHome();
  } catch (e) {
    console.error(e);
    $app.innerHTML = `<div class="card"><b>앗, 불러오지 못했어요.</b><p class="small muted">${esc(e.message)}</p><p><button onclick="location.reload()">새로고침</button></p></div>`;
  }
}
window.addEventListener('hashchange', route);

// 저장된 로그인 확인
(async () => {
  try { members = await rpc('list_members'); } catch {}
  if (me) { try { if (!(await rpc('login', { p_name: me.name, p_pin: me.pin }))) setMe(null); } catch {} }
  route();
})();
