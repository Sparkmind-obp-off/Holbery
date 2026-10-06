"""Validate required documents, then record factual phase evidence and tracker status."""
from pathlib import Path
import subprocess, json, sys, re
phase=int(sys.argv[1]); status=sys.argv[2]; note=sys.argv[3]
if status not in {'COMPLETE','BLOCKED'} or not 1 <= phase <= 10:
    raise SystemExit('Invalid phase/status')
roadmap=Path('ROADMAP.md'); text=roadmap.read_text()
if '**Version:** 2.' in text or '| PHASE ' not in text:
    raise SystemExit('Legacy recorder disabled for roadmap v2: document readiness is not operational/commercial completion. Preserve current roadmap and record scoped evidence separately.')
if phase > 1:
    prior=next(l for l in text.splitlines() if l.startswith(f'| PHASE {phase-1} —'))
    assert '| PENDING |' not in prior, 'Previous phase has not been recorded'
result=subprocess.run(['node','scripts/check-phase.mjs',str(phase)],capture_output=True,text=True)
print(result.stdout, end='')
if result.returncode:
    print(result.stderr); raise SystemExit(result.returncode)
evidence={'phase':phase,'date':'2026-10-05','status':status,'checks_exit_code':result.returncode,'checks_output':result.stdout,'evidence':note,'scope':'Deliverables and frameworks; external validation is separate.'}
Path(f'evidence/phase-{phase:02}.json').write_text(json.dumps(evidence,ensure_ascii=False,indent=2)+'\n')
text=re.sub(rf'(?m)^(\| PHASE {phase} —[^\n]*\| )PENDING( \|)$',lambda m:m[1]+status+m[2],text)
if not re.search(rf'(?m)^\| PHASE {phase} —.*\| {status} \|$',text):
    raise SystemExit('Tracker row did not match; preserve existing status and inspect')
text+=f'\n## Phase {phase} — {status} (2026-10-05)\n\n{note}\n\nEvidence: [phase-{phase:02}.json](evidence/phase-{phase:02}.json). Test: `node scripts/check-phase.mjs {phase}`. Dokumen diverifikasi, bukan klaim sukses legal/pelanggan. Lanjut otomatis sesuai H-008.\n'
roadmap.write_text(text)
