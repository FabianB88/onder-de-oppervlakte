import os,json,sqlite3
from pathlib import Path
task_temp=Path(os.environ['TEMP']).resolve()
owned=[]
for directory in task_temp.glob('playwright_chromiumdev_profile-*'):
 history=directory/'Default'/'History'
 if not history.exists(): continue
 try:
  db=sqlite3.connect(history.as_uri()+'?mode=ro',uri=True)
  urls=[row[0] for row in db.execute('select url from urls')];db.close()
  # These disposable profiles are attributed only when all recorded navigations belong to this project's QA host.
  if urls and all(url.startswith('http://127.0.0.1:8187/') or url=='about:blank' for url in urls):
   owned.append({'path':str(directory.resolve()),'bytes':sum(p.stat().st_size for p in directory.rglob('*') if p.is_file())})
 except (sqlite3.Error,OSError): pass
Path('qa/owned-test-caches.json').write_text(json.dumps(owned),encoding='utf-8')
print(json.dumps({'ownedProfiles':len(owned),'recoverableMB':round(sum(p['bytes'] for p in owned)/1048576)}))
