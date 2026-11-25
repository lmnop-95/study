// 주차별 숙제, 수업, 단어카드, 자료 내용. 음성 목록(AUDIO)도 여기서 만든다.

export const SITE = {
  name: '은밀한스터디',
  meet: '매주 수요일 밤 9시, 디스코드',
  firstQuizMonth: '2026-12',
};

// ───────── 히라가나 ─────────
export const KANA = {
  1: {
    title: '히라가나 1 (あ~の)',
    list: [
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
    ],
    tips: [
      'う, す 는 입술 내밀지 말고 짧게',
      'か행, た행은 단어 첫 글자면 카/가, 타/다 사이. 가운데 오면 까, 따에 가깝게 들림',
      'つ 는 츠와 쯔 사이',
      '헷갈리는 짝: い こ / き さ / ち さ',
    ],
  },
  2: {
    title: '히라가나 2 (は~ん)',
    list: [
      { k: 'は', s: '하', w: 'はな', m: '꽃' },
      { k: 'ひ', s: '히', w: 'ひと', m: '사람' },
      { k: 'ふ', s: '후', w: 'ふね', m: '배' },
      { k: 'へ', s: '헤', w: 'へや', m: '방' },
      { k: 'ほ', s: '호', w: 'ほし', m: '별' },
      { k: 'ま', s: '마', w: 'まち', m: '마을' },
      { k: 'み', s: '미', w: 'みみ', m: '귀' },
      { k: 'む', s: '무', w: 'むし', m: '벌레' },
      { k: 'め', s: '메', w: 'め', m: '눈 (얼굴)' },
      { k: 'も', s: '모', w: 'もも', m: '복숭아' },
      { k: 'や', s: '야', w: 'やま', m: '산' },
      { k: 'ゆ', s: '유', w: 'ゆき', m: '눈 (날씨)' },
      { k: 'よ', s: '요', w: 'よる', m: '밤' },
      { k: 'ら', s: '라', w: 'そら', m: '하늘' },
      { k: 'り', s: '리', w: 'とり', m: '새' },
      { k: 'る', s: '루', w: 'さる', m: '원숭이' },
      { k: 'れ', s: '레', w: 'これ', m: '이것' },
      { k: 'ろ', s: '로', w: 'ふろ', m: '목욕' },
      { k: 'わ', s: '와', w: 'わたし', m: '나' },
      { k: 'を', s: '오', w: 'ほんを よむ', m: '책을 읽다' },
      { k: 'ん', s: '응', w: 'ほん', m: '책' },
    ],
    tips: [
      'は 가 조사로 쓰이면 와 (わたしは 와타시와)',
      'を 는 오. 조사로만 씀',
      'ふ 는 입술을 살짝 모으고 바람 빼듯 후',
      'ら행은 혀끝을 한 번 가볍게 튕기는 ㄹ',
      'ん 은 뒤에 오는 소리에 따라 ㅇ, ㄴ, ㅁ 처럼 들림',
      '헷갈리는 짝: ぬ め / ね れ わ / る ろ / は ほ',
    ],
    dakuten: [
      ['か き く け こ', 'が ぎ ぐ げ ご', '가 기 구 게 고'],
      ['さ し す せ そ', 'ざ じ ず ぜ ぞ', '자 지 즈 제 조'],
      ['た ち つ て と', 'だ ぢ づ で ど', '다 지 즈 데 도'],
      ['は ひ ふ へ ほ', 'ば び ぶ べ ぼ', '바 비 부 베 보'],
      ['は ひ ふ へ ほ', 'ぱ ぴ ぷ ぺ ぽ', '파 피 푸 페 포'],
    ],
  },
};

// ───────── 대화문 수업 ─────────
// voices: 말하는 사람별 목소리 (f 여자, m 남자). 일본어는 한 목소리.
export const LESSONS = {
  ja1: {
    title: '일본어: 자기소개',
    lang: 'ja',
    voices: {},
    dialogue: [
      { who: 'たなか', t: 'こんにちは。はじめまして。たなかです。' },
      { who: 'キム', t: 'はじめまして。キムです。かんこくから きました。' },
      { who: 'たなか', t: 'そうですか。がくせいですか。' },
      { who: 'キム', t: 'はい、がくせいです。たなかさんは?' },
      { who: 'たなか', t: 'わたしは かいしゃいんです。' },
      { who: 'キム', t: 'わたしは まんがが すきです。たなかさんは?' },
      { who: 'たなか', t: 'わたしは えいがが すきです。' },
      { who: 'キム', t: 'よろしく おねがいします。' },
      { who: 'たなか', t: 'よろしく おねがいします。' },
    ],
    words: [
      ['はじめまして', '처음 뵙겠습니다'], ['かんこく', '한국'], ['〜から きました', '〜에서 왔어요'],
      ['がくせい', '학생'], ['かいしゃいん', '회사원'], ['まんが', '만화'], ['えいが', '영화'],
      ['〜が すきです', '〜을 좋아해요'], ['〜さんは?', '〜씨는요?'], ['よろしく おねがいします', '잘 부탁해요'],
      ['キム', '김 (외국 이름은 가타카나로 씀)'],
    ],
    tiers: [
      { lv: 1, body: 'キム 대사에서 이름, 하는 일, 좋아하는 것만 내 걸로 바꾸기\nはじめまして。___です。かんこくから きました。___です。___が すきです。' },
      { lv: 2, body: '좋아하는 것 하나 더 말하고, 상대한테 ___さんは? 로 되묻기' },
      { lv: 3, body: '상대가 모르는 말을 하면 すみません、もう いちど おねがいします 로 되묻기. 질문 두 개 더 해서 이어 가기' },
    ],
    help: ['すみません、もう いちど おねがいします (한 번 더 부탁해요)', 'ゆっくり おねがいします (천천히 부탁해요)', '___は にほんごで なんですか (___ 일본어로 뭐예요?)'],
    deck: 'ja1',
  },
  en1: {
    title: '영어: 자기소개',
    lang: 'en',
    voices: { Jun: 'm', Emma: 'f' },
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
    deck: 'en1',
  },
  en2: {
    title: '영어: 취미',
    lang: 'en',
    voices: { Sam: 'm', Mia: 'f' },
    dialogue: [
      { who: 'Mia', t: 'What do you do on weekends?' },
      { who: 'Sam', t: 'I usually play games. Sometimes I watch movies.' },
      { who: 'Mia', t: 'What kind of games?' },
      { who: 'Sam', t: 'Mostly RPGs. How about you?' },
      { who: 'Mia', t: 'I like listening to music. I go to concerts sometimes.' },
      { who: 'Sam', t: "Cool. Who's your favorite singer?" },
      { who: 'Mia', t: 'I really like Taylor Swift.' },
      { who: 'Sam', t: 'Nice. Do you play any instruments?' },
      { who: 'Mia', t: 'No, but I want to learn the guitar.' },
      { who: 'Sam', t: 'That sounds fun!' },
    ],
    tiers: [
      { lv: 1, body: 'Sam이나 Mia 대사에서 좋아하는 것만 내 걸로 바꾸기\nI usually ___. Sometimes I ___.' },
      { lv: 2, body: "좋아하는 이유 붙이고 상대한테 질문 두 개\nI like ___ because ___. What kind of ___? Why do you like it?" },
      { lv: 3, body: '상대 취미에 대해 계속 질문해서 3분 넘게 이어 가기. 처음 듣는 건 What is that? 으로 물어보기' },
    ],
    help: ['What kind of ___?', 'How often do you ___?', 'Why do you like it?', 'What is that?'],
    deck: 'en2',
  },
};

// ───────── 단어카드 ─────────
const kanaDeck = (n) => [
  ...KANA[n].list.map((x, i) => ({ id: `h${n}-k${i}`, f: x.k, b: x.s, ex: `${x.w} (${x.m})`, a: `audio/kana${n}/k${i}.mp3`, big: true })),
  ...KANA[n].list.map((x, i) => ({ id: `h${n}-w${i}`, f: x.w, b: x.m, a: `audio/kana${n}/w${i}.mp3`, big: true })),
];
const phraseDeck = (key, prefix, pairs) => pairs.map(([f, b], i) => ({ id: `${prefix}-${i}`, f, b, a: `audio/deck-${key}/c${i}.mp3` }));

export const DECKS = {
  hira1: { title: '히라가나 1', lang: 'ja', cards: kanaDeck(1) },
  hira2: { title: '히라가나 2', lang: 'ja', cards: kanaDeck(2) },
  ja1: {
    title: '일본어: 자기소개',
    lang: 'ja',
    cards: phraseDeck('ja1', 'j1', [
      ['안녕하세요 (낮)', 'こんにちは'],
      ['처음 뵙겠습니다', 'はじめまして'],
      ['저는 김이에요', 'わたしは キムです'],
      ['한국에서 왔어요', 'かんこくから きました'],
      ['학생이에요', 'がくせいです'],
      ['회사원이에요', 'かいしゃいんです'],
      ['만화를 좋아해요', 'まんがが すきです'],
      ['영화를 좋아해요', 'えいがが すきです'],
      ['다나카 씨는요?', 'たなかさんは?'],
      ['잘 부탁해요', 'よろしく おねがいします'],
      ['고마워', 'ありがとう'],
      ['감사합니다', 'ありがとうございます'],
      ['죄송해요, 저기요', 'すみません'],
      ['한 번 더 부탁해요', 'もう いちど おねがいします'],
      ['또 봐', 'またね'],
    ]),
  },
  en1: {
    title: '영어: 자기소개',
    lang: 'en',
    cards: phraseDeck('en1', 'e1', [
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
    ]),
  },
  en2: {
    title: '영어: 취미',
    lang: 'en',
    cards: phraseDeck('en2', 'e2', [
      ['주말에 뭐 해?', 'What do you do on weekends?'],
      ['보통 게임해.', 'I usually play games.'],
      ['가끔 영화 봐.', 'Sometimes I watch movies.'],
      ['어떤 게임?', 'What kind of games?'],
      ['너는?', 'How about you?'],
      ['음악 듣는 거 좋아해.', 'I like listening to music.'],
      ['제일 좋아하는 가수가 누구야?', "Who's your favorite singer?"],
      ['요즘 이 애니에 빠졌어.', "I'm into this anime these days."],
      ['악기 다룰 줄 알아?', 'Do you play any instruments?'],
      ['기타 배우고 싶어.', 'I want to learn the guitar.'],
      ['재밌겠다!', 'That sounds fun!'],
      ['나도!', 'Me too!'],
      ['나는 별로.', 'Not really.'],
      ['왜 좋아해?', 'Why do you like it?'],
      ['친구랑 하면 재밌어서.', "Because it's fun with friends."],
    ]),
  },
};

// ───────── 수업 진행표 ─────────
export const CLASSES = {
  1: {
    title: '1주차 수업',
    date: '2026-12-02',
    parts: [
      {
        name: '일본어 40분',
        topic: '자기소개',
        links: [['대화문', '#/lesson/ja1']],
        rows: [
          ['0~5', '히라가나 あ~の 돌아가면서 한 글자씩 읽기'],
          ['5~15', '대화문 두 번 듣고 따라 하기. 단어 확인'],
          ['15~30', '둘씩 차례로 역할극. 자기 단계대로'],
          ['30~37', '한 명씩 자기소개 30초'],
          ['37~40', '피드백. 잘한 거 하나, 고칠 거 하나'],
        ],
      },
      {
        name: '영어 20분',
        topic: '취미',
        links: [['대화문', '#/lesson/en2']],
        rows: [
          ['0~5', '대화문 듣고 따라 하기'],
          ['5~15', '둘씩 차례로 역할극. 자기 단계대로'],
          ['15~20', '피드백, 숙제 안내'],
        ],
      },
    ],
  },
};

// ───────── 주간 숙제 ─────────
// 키는 그 주 수요일 날짜. auto 가 있으면 자동 체크.
export const WEEKS = {
  '2026-11-25': {
    title: '0주차',
    items: [
      { id: 'diag', text: '수준 진단', min: 5, link: '#/diagnosis', auto: 'diag' },
      { id: 'rec', text: '시작 녹음 (일본어, 영어)', min: 10, link: '#/diagnosis' },
      { id: 'kana-read', text: 'あ~の 소리 내서 읽기', min: 15, link: '#/kana/1' },
      { id: 'kana-write', text: 'あ~の 공책에 3번씩 쓰기', min: 15, link: '#/kana/1' },
      { id: 'cards-ja', text: '히라가나 1 카드 1회', min: 20, link: '#/cards/hira1', auto: 'cards:hira1' },
      { id: 'anime', text: '애니 한 편 일본어 음성으로 보기', min: 25 },
      { id: 'cards-en', text: '영어 자기소개 카드 1회', min: 10, link: '#/cards/en1', auto: 'cards:en1' },
      { id: 'en-say', text: '영어 자기소개 대화문 내 얘기로 바꿔서 3번 말하기', min: 10, link: '#/lesson/en1' },
    ],
    extras: [
      { id: 'x-song', text: '영어 노래 한 곡 따라 부르기' },
      { id: 'x-cards', text: '카드 한 번 더' },
    ],
  },
  '2026-12-02': {
    title: '1주차',
    items: [
      { id: 'kana2-read', text: 'は~ん 소리 내서 읽기', min: 15, link: '#/kana/2' },
      { id: 'kana2-write', text: 'は~ん 공책에 3번씩 쓰기', min: 15, link: '#/kana/2' },
      { id: 'cards-h2', text: '히라가나 2 카드 1회', min: 20, link: '#/cards/hira2', auto: 'cards:hira2' },
      { id: 'cards-j1', text: '일본어 자기소개 카드 1회', min: 10, link: '#/cards/ja1', auto: 'cards:ja1' },
      { id: 'ja-intro', text: '내 일본어 자기소개 만들어서 5번 소리 내 말하기', min: 10, link: '#/lesson/ja1' },
      { id: 'anime', text: '애니 한 편 일본어 음성으로 보기', min: 25 },
      { id: 'cards-e2', text: '영어 취미 카드 1회', min: 10, link: '#/cards/en2', auto: 'cards:en2' },
      { id: 'en-hobby', text: '내 취미 영어로 1분 말하기 3번', min: 10, link: '#/lesson/en2' },
    ],
    extras: [
      { id: 'x-h1', text: '히라가나 1 카드 다시' },
      { id: 'x-song', text: '일본 노래 한 곡 가사 보면서 듣기' },
    ],
  },
};

// ───────── 수준 진단 ─────────
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

// 첫 화면 목록 (위에서부터)
export const PAGES = [
  { href: '#/class/1', title: '1주차 수업 (12/2)' },
  { href: '#/homework', title: '숙제' },
  { href: '#/kana/2', title: '히라가나 2 (は~ん)' },
  { href: '#/lesson/ja1', title: '일본어: 자기소개' },
  { href: '#/lesson/en2', title: '영어: 취미' },
  { href: '#/cards', title: '단어카드' },
  { href: '#/kana/1', title: '히라가나 1 (あ~の)' },
  { href: '#/lesson/en1', title: '영어: 자기소개' },
  { href: '#/diagnosis', title: '수준 진단, 시작 녹음' },
  { href: '#/rules', title: '규칙' },
];

// ───────── 음성 목록 (tools/gen_audio.py 가 읽음) ─────────
export const AUDIO = [
  ...Object.entries(KANA).flatMap(([n, K]) => K.list.flatMap((x, i) => [
    { path: `kana${n}/k${i}.mp3`, text: x.k, lang: 'ja', rate: 120 },
    { path: `kana${n}/w${i}.mp3`, text: x.w, lang: 'ja', rate: 140 },
  ])),
  ...Object.entries(LESSONS).flatMap(([key, L]) => L.dialogue.map((d, i) => (
    { path: `lesson-${key}/d${i}.mp3`, text: d.t, lang: L.lang, voice: L.voices[d.who] || 'f' }))),
  ...Object.entries(DECKS).filter(([k]) => !k.startsWith('hira')).flatMap(([key, D]) => D.cards.map((c, i) => (
    { path: `deck-${key}/c${i}.mp3`, text: c.b, lang: D.lang, voice: 'f' }))),
];
