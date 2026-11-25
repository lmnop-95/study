#!/usr/bin/env python3
"""content.js 의 음성 파일을 맥 내장 음성(say)으로 만든다.
향상된(Enhanced/Premium) 음성이 깔려 있으면 그것을 먼저 쓴다. 다시 돌리면 모두 새로 만든다.
사용: python3 tools/gen_audio.py
"""
import re, subprocess, json, pathlib, tempfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'audio'

def voices():
    out = subprocess.run(['say', '-v', '?'], capture_output=True, text=True).stdout
    return [re.split(r'\s{2,}', l.strip())[0] for l in out.splitlines() if l.strip()]

V = voices()
def pick(base, fallback=None):
    for tag in ('Premium', 'Enhanced', '고품질', '향상'):
        for v in V:
            if v.startswith(base) and tag in v:
                return v
    return base if base in V else fallback

JA = pick('Kyoko')
EN_F = pick('Samantha')
EN_M = pick('Evan') or pick('Nathan') or pick('Tom') or next((v for v in V if v.startswith('Eddy') and '미국' in v), EN_F)
print('voices:', JA, '|', EN_F, '|', EN_M)

def make(text, voice, path, rate=None):
    path = OUT / path
    path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(suffix='.aiff') as t:
        cmd = ['say', '-v', voice, '-o', t.name]
        if rate: cmd += ['-r', str(rate)]
        subprocess.run(cmd + [text], check=True)
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', t.name, '-ac', '1', '-b:a', '64k', str(path)], check=True)

# content.js 에서 필요한 값 읽기 (node 로 평가)
data = json.loads(subprocess.run(['node', '--input-type=module', '-e',
    "import * as c from './content.js'; console.log(JSON.stringify({kana:c.KANA1, dia:c.EN1.dialogue, en:c.DECKS.en1.cards}))"],
    cwd=ROOT, capture_output=True, text=True, check=True).stdout)

for i, x in enumerate(data['kana']):
    make(x['k'], JA, f'ja/k{i}.mp3', rate=120)
    make(x['w'], JA, f'ja/w{i}.mp3', rate=140)
for i, c in enumerate(data['en']):
    make(c['b'], EN_F, f'en/c{i}.mp3')
for i, d in enumerate(data['dia']):
    make(d['t'], EN_M if d['who'] == 'Jun' else EN_F, f'en/d{i}.mp3')
print('done', len(list(OUT.rglob('*.mp3'))), 'files')
