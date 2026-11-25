#!/usr/bin/env python3
"""content.js 의 AUDIO 목록대로 맥 내장 음성(say)으로 mp3 를 만든다.
향상된(Enhanced/Premium) 음성이 깔려 있으면 그것을 먼저 쓴다.
사용: python3 tools/gen_audio.py          (없는 파일만 만듦)
      python3 tools/gen_audio.py --all    (전부 다시 만듦)
"""
import re, subprocess, json, pathlib, tempfile, shutil, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'audio'
ALL = '--all' in sys.argv

def voices():
    out = subprocess.run(['say', '-v', '?'], capture_output=True, text=True).stdout
    names = []
    for l in out.splitlines():
        m = re.match(r'^(.*?)\s+[a-z]{2,3}_[A-Z0-9]{2,3}\s+#', l)
        if m: names.append(m.group(1).strip())
    return names

V = voices()
def pick(base, fallback=None):
    for tag in ('Premium', 'Enhanced', '고품질', '향상'):
        for v in V:
            if v.startswith(base) and tag in v:
                return v
    return next((v for v in V if v == base or v.startswith(base + ' (')), fallback)

VOICE = {
    ('ja', 'f'): pick('Kyoko'), ('ja', 'm'): pick('Otoya') or pick('Kyoko'),
    ('en', 'f'): pick('Samantha'), ('en', 'm'): pick('Evan') or pick('Nathan') or pick('Tom') or pick('Samantha'),
}
print('voices:', VOICE)
assert all(v in V for v in VOICE.values()), '음성 이름을 못 찾음'

items = json.loads(subprocess.run(['node', '--input-type=module', '-e',
    "import { AUDIO } from './content.js'; console.log(JSON.stringify(AUDIO))"],
    cwd=ROOT, capture_output=True, text=True, check=True).stdout)

if ALL and OUT.exists():
    shutil.rmtree(OUT)
made = 0
for it in items:
    path = OUT / it['path']
    if path.exists():
        continue
    path.parent.mkdir(parents=True, exist_ok=True)
    voice = VOICE[(it['lang'], it.get('voice', 'f'))]
    with tempfile.NamedTemporaryFile(suffix='.aiff') as t:
        cmd = ['say', '-v', voice, '-o', t.name]
        if it.get('rate'): cmd += ['-r', str(it['rate'])]
        subprocess.run(cmd + [it['text']], check=True)
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', t.name, '-ac', '1', '-b:a', '64k', str(path)], check=True)
    made += 1

# 목록에 없는 옛 파일 지우기
keep = {OUT / it['path'] for it in items}
for f in OUT.rglob('*.mp3'):
    if f not in keep: f.unlink()
for d in sorted(OUT.glob('*'), reverse=True):
    if d.is_dir() and not any(d.iterdir()): d.rmdir()
print(f'made {made}, total {len(items)}')
