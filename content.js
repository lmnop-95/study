// 은밀한스터디 — 내용 데이터. 주차별 숙제·단어카드·자료는 여기만 고치면 된다.

export const SITE = {
  name: '은밀한스터디',
  meet: '매주 수요일 밤 9시 · 디스코드',
  firstQuizMonth: '2026-12',
};

// ───────── 주간 숙제 ─────────
// 키 = 그 주 수요일 날짜. 수요일 0시에 새 주가 열린다.
// item.auto: 'cards:<덱>' 이면 그 덱을 끝까지 돌릴 때 자동 체크, 'diag' 이면 진단 두 언어 저장 때 자동 체크.
export const WEEKS = {
  '2026-11-25': {
    title: '0주차 · 오리엔테이션 주',
    note: '첫 수업(12월 2일) 전까지 아래를 해 오세요. 모두 합쳐 1시간쯤 걸려요. 나눠서 해도 됩니다.',
    items: [
      { id: 'diag', text: '수준 진단 하기 (일본어·영어 둘 다)', min: 5, link: '#/diagnosis', auto: 'diag' },
      { id: 'rec', text: '시작 녹음 — 언어별 질문 5개에 1분씩, 내 폰에 저장', min: 10, link: '#/diagnosis' },
      { id: 'kana-read', text: '히라가나 1주차: あ~そ 15자 소리 듣고 따라 읽기', min: 10, link: '#/kana1' },
      { id: 'kana-write', text: '공책에 あ~そ 15자를 3번씩 써 보기', min: 10, link: '#/kana1' },
      { id: 'cards-ja', text: '히라가나 카드 끝까지 한 번 (끝내면 자동 체크)', min: 10, link: '#/cards/hira1', auto: 'cards:hira1' },
      { id: 'cards-en', text: '영어 자기소개 카드 끝까지 한 번 (끝내면 자동 체크)', min: 10, link: '#/cards/en1', auto: 'cards:en1' },
      { id: 'en-say', text: '영어 대화문을 내 얘기로 바꿔서 소리 내 3번 말하기', min: 5, link: '#/english1' },
    ],
    extras: [
      { id: 'x-anime', text: '좋아하는 애니 한 편을 일본어 음성으로 보면서 아는 소리(あ~そ) 찾기' },
      { id: 'x-song', text: '좋아하는 영어 노래 한 곡, 가사 보며 따라 부르기' },
      { id: 'x-cards', text: '카드 두 덱을 하루 더 돌리기' },
    ],
  },
};

// ───────── 수준 진단 ─────────
export const DIAG = {
  ja: {
    label: '일본어',
    items: [
      '히라가나를 보고 거의 다 읽을 수 있다',
      '가타카나를 보고 거의 다 읽을 수 있다',
      '일본어로 인사하고 이름·사는 곳을 말할 수 있다',
      '숫자·가격·시간을 일본어로 듣고 말할 수 있다',
      'です·ます 문장을 만들 수 있다 (예: 학생입니다, 커피를 마십니다)',
      '식당·편의점에서 쓰는 짧은 말을 알아듣는다',
      '애니를 볼 때 자막 없이도 아는 단어·짧은 문장이 자주 들린다',
      '쉬운 한자(日·月·人·大 등)를 30자 넘게 읽을 수 있다',
      '취미나 주말에 한 일을 일본어로 3문장 넘게 말할 수 있다',
      '천천히 말해 주면 일본 사람과 5분쯤 대화할 수 있다',
    ],
  },
  en: {
    label: '영어',
    items: [
      '영어로 자기소개를 1분 동안 멈추지 않고 할 수 있다',
      '하루 일과를 영어로 3문장 넘게 말할 수 있다',
      '식당 주문·길 묻기를 영어로 할 수 있다',
      '상대가 천천히 말하면 일상 질문을 알아듣는다',
      '못 알아들었을 때 다시 말해 달라고 영어로 되물을 수 있다',
      '자막을 켜면 미드·유튜브의 큰 줄거리를 따라간다',
      '자막 없이도 미드·유튜브의 쉬운 대화가 꽤 들린다',
      '영어로 짧은 메시지나 이메일을 쓸 수 있다',
      '좋아하는 것을 이유와 함께 2분 동안 말할 수 있다',
      '외국인과 10분 넘게 일상 대화를 해 봤고 크게 어렵지 않았다',
    ],
  },
  // 0~3개 → 1단, 4~7개 → 2단, 8~10개 → 3단
  level: (n) => (n <= 3 ? 1 : n <= 7 ? 2 : 3),
  levelText: {
    1: '1단 — 정해진 문장을 그대로 말해요',
    2: '2단 — 이유를 붙이고 되물어요',
    3: '3단 — 돌발 상황까지 해결해요 (역할극에서 현지인 역)',
  },
  recording: [
    '자기소개를 해 주세요.',
    '오늘 뭐 했어요?',
    '좋아하는 것(애니·게임·음식·노래)은 뭐예요?',
    '이번 주말에 뭐 하고 싶어요?',
    '왜 이 언어를 배우고 싶어요?',
  ],
};

// ───────── 히라가나 1주차 ─────────
export const KANA1 = [
  { k: 'あ', s: '아', w: 'あい', m: '사랑' },
  { k: 'い', s: '이', w: 'いえ', m: '집' },
  { k: 'う', s: '우', w: 'うえ', m: '위' },
  { k: 'え', s: '에', w: 'えき', m: '역' },
  { k: 'お', s: '오', w: 'おかし', m: '과자' },
  { k: 'か', s: '카', w: 'かお', m: '얼굴' },
  { k: 'き', s: '키', w: 'あき', m: '가을' },
  { k: 'く', s: '쿠', w: 'くさ', m: '풀' },
  { k: 'け', s: '케', w: 'いけ', m: '연못' },
  { k: 'こ', s: '코', w: 'こえ', m: '목소리' },
  { k: 'さ', s: '사', w: 'さけ', m: '술 · 연어' },
  { k: 'し', s: '시', w: 'しお', m: '소금' },
  { k: 'す', s: '스', w: 'すし', m: '초밥' },
  { k: 'せ', s: '세', w: 'せかい', m: '세계' },
  { k: 'そ', s: '소', w: 'うそ', m: '거짓말' },
];

export const KANA_TIPS = [
  'う 는 입술을 앞으로 내밀지 않고 편하게 내는 "우"예요. す 도 "수"보다 "스"에 가깝게 들려요.',
  'か행(か·き·く·け·こ)은 단어 첫 글자일 때 "카"와 "가" 사이로, 단어 가운데에서는 "까"에 가깝게 들려요. 한글 표기는 2주 동안만 보조로 쓰고, 그 뒤로는 소리로만 익혀요.',
  'し 는 "시", さ·す·せ·そ 는 "사·스·세·소"예요.',
  '글자를 외울 때는 꼭 소리를 같이 내세요. 눈으로만 보면 금방 잊어요.',
];

// ───────── 영어 1주차: 인사·자기소개 ─────────
export const EN1 = {
  dialogue: [
    { who: 'Jun', t: "Hi, I'm Jun. Nice to meet you." },
    { who: 'Emma', t: "Nice to meet you too. I'm Emma. Where are you from?" },
    { who: 'Jun', t: "I'm from Korea. I live in Seoul. How about you?" },
    { who: 'Emma', t: "I'm from Canada. What do you do?" },
    { who: 'Jun', t: "I'm a student. In my free time, I like watching anime." },
    { who: 'Emma', t: "Oh, me too! What's your favorite anime?" },
    { who: 'Jun', t: 'Sorry, could you say that again?' },
    { who: 'Emma', t: "What's your favorite anime?" },
    { who: 'Jun', t: 'Oh! I like Ghibli movies.' },
    { who: 'Emma', t: 'Nice! See you next time!' },
  ],
  tiers: [
    { lv: 1, title: '1단 — 그대로 말하기', body: "대화문의 Jun 대사를 이름·사는 곳·하는 일·좋아하는 것만 내 것으로 바꿔서 말해요.\n예) Hi, I'm ___. I live in ___. I'm a ___. I like ___ing ___." },
    { lv: 2, title: '2단 — 이유와 질문 붙이기', body: "좋아하는 것에 이유를 하나 붙이고, 상대에게 질문을 하나 더 해요.\n예) I like playing games because it's fun with friends. What do you like to do?" },
    { lv: 3, title: '3단 — 돌발 상황', body: "상대가 빠르게 말하거나 모르는 단어를 써요. 되묻고(Sorry, what does ___ mean?), 상대 취미에 질문을 두 개 더 해서 대화를 3분 넘게 이어 가요." },
  ],
  help: ['Could you say that again?', 'Could you speak a little more slowly?', "What does ___ mean?", "How do you say ___ in English?"],
};

// ───────── 단어카드 덱 ─────────
// 앞면(f) → 뒷면(b), 음성(a)은 audio/ 폴더의 파일
export const DECKS = {
  hira1: {
    title: '히라가나 1주차 (あ~そ)',
    lang: 'ja',
    cards: [
      ...KANA1.map((x, i) => ({ id: `h1-k${i}`, f: x.k, b: `${x.s}  ·  예) ${x.w} (${x.m})`, a: `audio/ja/k${i}.mp3`, big: true })),
      ...KANA1.map((x, i) => ({ id: `h1-w${i}`, f: x.w, b: x.m, a: `audio/ja/w${i}.mp3`, big: true })),
    ],
  },
  en1: {
    title: '영어 1주차 · 인사·자기소개',
    lang: 'en',
    cards: [
      ['안녕, 나는 준이야.', "Hi, I'm Jun."],
      ['만나서 반가워.', 'Nice to meet you.'],
      ['어디서 왔어?', 'Where are you from?'],
      ['나는 한국에서 왔어.', "I'm from Korea."],
      ['나는 서울에 살아.', 'I live in Seoul.'],
      ['무슨 일 해?', 'What do you do?'],
      ['나는 학생이야.', "I'm a student."],
      ['나는 회사에 다녀.', 'I work at a company.'],
      ['쉬는 시간엔 뭐 해?', 'What do you do in your free time?'],
      ['나는 애니 보는 걸 좋아해.', 'I like watching anime.'],
      ['나는 게임하는 걸 좋아해.', 'I like playing video games.'],
      ['나는 영어랑 일본어를 배우고 있어.', "I'm learning English and Japanese."],
      ['다시 한 번 말해 줄래?', 'Could you say that again?'],
      ['조금 더 천천히 말해 줄래?', 'Could you speak a little more slowly?'],
      ['다음에 또 봐!', 'See you next time!'],
    ].map(([f, b], i) => ({ id: `e1-${i}`, f, b, a: `audio/en/c${i}.mp3` })),
  },
};

// 자료 목록 (첫 화면에 나오는 순서)
export const PAGES = [
  { href: '#/rules', title: '운영 규칙', sub: '모임·숙제·퀴즈·피자 규칙 한 장' },
  { href: '#/diagnosis', title: '수준 진단 + 시작 녹음', sub: '체크하면 내 단계가 정해져요' },
  { href: '#/kana1', title: '히라가나 1주차 (あ~そ)', sub: '소리·예시 단어·쓰기 연습' },
  { href: '#/english1', title: '영어 1주차 · 인사·자기소개', sub: '대화문·3단계 과제·도움 표현' },
  { href: '#/cards', title: '단어카드', sub: '간격을 두고 다시 보여 주는 복습' },
  { href: '#/homework', title: '숙제 체크표', sub: '이번 주 숙제와 모두의 진행 상황' },
];
