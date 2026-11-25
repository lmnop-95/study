// 주차별 숙제, 단어카드, 자료 내용

export const SITE = {
  name: '은밀한스터디',
  meet: '매주 수요일 밤 9시, 디스코드',
  firstQuizMonth: '2026-12',
};

// 키는 그 주 수요일 날짜. auto 가 있으면 자동 체크.
export const WEEKS = {
  '2026-11-25': {
    title: '0주차',
    items: [
      { id: 'diag', text: '수준 진단', min: 5, link: '#/diagnosis', auto: 'diag' },
      { id: 'rec', text: '시작 녹음 (일본어, 영어)', min: 10, link: '#/diagnosis' },
      { id: 'kana-read', text: 'あ~の 소리 내서 읽기', min: 15, link: '#/kana1' },
      { id: 'kana-write', text: 'あ~の 공책에 3번씩 쓰기', min: 15, link: '#/kana1' },
      { id: 'cards-ja', text: '히라가나 카드 1회', min: 20, link: '#/cards/hira1', auto: 'cards:hira1' },
      { id: 'anime', text: '애니 한 편 일본어 음성으로 보기', min: 25 },
      { id: 'cards-en', text: '영어 카드 1회', min: 10, link: '#/cards/en1', auto: 'cards:en1' },
      { id: 'en-say', text: '영어 대화문 내 얘기로 바꿔서 3번 말하기', min: 10, link: '#/english1' },
    ],
    extras: [
      { id: 'x-song', text: '영어 노래 한 곡 따라 부르기' },
      { id: 'x-cards', text: '카드 한 번 더' },
    ],
  },
};

export const DIAG = {
  ja: {
    label: '일본어',
    items: [
      '히라가나를 거의 다 읽는다',
      '가타카나를 거의 다 읽는다',
      '인사하고 이름, 사는 곳을 말할 수 있다',
      '숫자, 가격, 시간을 듣고 말할 수 있다',
      'です, ます 문장을 만들 수 있다',
      '식당이나 편의점에서 하는 말을 알아듣는다',
      '애니 볼 때 자막 없이도 아는 말이 자주 들린다',
      '쉬운 한자를 30자 넘게 읽는다',
      '취미나 주말 얘기를 3문장 넘게 할 수 있다',
      '천천히 말해 주면 일본 사람과 5분쯤 얘기할 수 있다',
    ],
  },
  en: {
    label: '영어',
    items: [
      '자기소개를 1분 동안 멈추지 않고 할 수 있다',
      '하루 일과를 3문장 넘게 말할 수 있다',
      '식당 주문, 길 묻기를 할 수 있다',
      '천천히 말해 주면 일상 질문을 알아듣는다',
      '못 알아들었을 때 다시 말해 달라고 할 수 있다',
      '자막 켜면 미드나 유튜브 내용을 따라간다',
      '자막 없이도 쉬운 대화는 꽤 들린다',
      '짧은 메시지나 이메일을 쓸 수 있다',
      '좋아하는 걸 이유까지 2분 동안 말할 수 있다',
      '외국인이랑 10분 넘게 얘기해 봤고 할 만했다',
    ],
  },
  level: (n) => (n <= 3 ? 1 : n <= 7 ? 2 : 3),
  recording: [
    '자기소개',
    '오늘 뭐 했는지',
    '좋아하는 것 (애니, 게임, 음식, 노래)',
    '이번 주말에 하고 싶은 것',
    '이 언어를 왜 배우는지',
  ],
};

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
  { k: 'さ', s: '사', w: 'さけ', m: '술, 연어' },
  { k: 'し', s: '시', w: 'しお', m: '소금' },
  { k: 'す', s: '스', w: 'すし', m: '초밥' },
  { k: 'せ', s: '세', w: 'せかい', m: '세계' },
  { k: 'そ', s: '소', w: 'うそ', m: '거짓말' },
  { k: 'た', s: '타', w: 'たこ', m: '문어' },
  { k: 'ち', s: '치', w: 'ちかてつ', m: '지하철' },
  { k: 'つ', s: '츠', w: 'つくえ', m: '책상' },
  { k: 'て', s: '테', w: 'て', m: '손' },
  { k: 'と', s: '토', w: 'とけい', m: '시계' },
  { k: 'な', s: '나', w: 'なつ', m: '여름' },
  { k: 'に', s: '니', w: 'にく', m: '고기' },
  { k: 'ぬ', s: '누', w: 'いぬ', m: '개' },
  { k: 'ね', s: '네', w: 'ねこ', m: '고양이' },
  { k: 'の', s: '노', w: 'きのこ', m: '버섯' },
];

export const KANA_TIPS = [
  'う, す 는 입술 내밀지 말고 짧게',
  'か행, た행은 단어 첫 글자면 카/가, 타/다 사이. 가운데 오면 까, 따에 가깝게 들림',
  'つ 는 츠와 쯔 사이',
  '헷갈리는 짝: い こ / き さ / ち さ / ぬ め(다음 주) / ね れ(나중에)',
];

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
    { lv: 1, body: "Jun 대사에서 이름, 사는 곳, 하는 일, 좋아하는 것만 내 걸로 바꾸기\nHi, I'm ___. I live in ___. I'm a ___. I like ___." },
    { lv: 2, body: "좋아하는 것에 이유 하나 붙이고 질문 하나 더 하기\nI like playing games because it's fun with friends. What do you like to do?" },
    { lv: 3, body: '상대가 빠르게 말하거나 모르는 단어를 씀. 되물어 가면서 3분 넘게 이어 가기' },
  ],
  help: ['Could you say that again?', 'Could you speak a little more slowly?', 'What does ___ mean?', 'How do you say ___ in English?'],
};

export const DECKS = {
  hira1: {
    title: '히라가나 1주차',
    lang: 'ja',
    cards: [
      ...KANA1.map((x, i) => ({ id: `h1-k${i}`, f: x.k, b: x.s, ex: `${x.w} (${x.m})`, a: `audio/ja/k${i}.mp3`, big: true })),
      ...KANA1.map((x, i) => ({ id: `h1-w${i}`, f: x.w, b: x.m, a: `audio/ja/w${i}.mp3`, big: true })),
    ],
  },
  en1: {
    title: '영어 1주차',
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

export const PAGES = [
  { href: '#/rules', title: '규칙' },
  { href: '#/diagnosis', title: '수준 진단, 시작 녹음' },
  { href: '#/kana1', title: '히라가나 1주차' },
  { href: '#/english1', title: '영어 1주차' },
  { href: '#/cards', title: '단어카드' },
  { href: '#/homework', title: '숙제' },
];
