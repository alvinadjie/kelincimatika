#!/usr/bin/env python3
"""Gabungkan proyek jadi SATU file HTML (dist/game_tambah.html) seperti versi yang diterbitkan.
 - css/style.css  -> <style> inline
 - src/data.js    -> setiap path "assets/..." diganti data-URI base64
 - src/game.js    -> <script> inline
 - vendor/three.min.js -> diganti tag CDN cdnjs (r128, versi dipin) supaya file tetap kecil
Jalankan dari folder proyek:  python3 tools/build_single.py
"""
import re,base64,mimetypes,os,sys
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
rd=lambda p:open(os.path.join(ROOT,p),encoding='utf8').read()
CDN='<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>'
MIME={'.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.mp3':'audio/mpeg','.ogg':'audio/ogg','.webp':'image/webp','.wav':'audio/wav'}
missing=[]
def inline(m):
    rel=m.group(1);p=os.path.join(ROOT,rel)
    if not os.path.exists(p): missing.append(rel);return m.group(0)
    return '"data:%s;base64,%s"'%(MIME.get(os.path.splitext(rel)[1].lower(),'application/octet-stream'),base64.b64encode(open(p,'rb').read()).decode())
html=rd('index.html')
html=html.replace('<link rel="stylesheet" href="css/style.css">','<style>'+rd('css/style.css')+'</style>')
data=re.sub(r'"(assets/[^"]+)"',inline,rd('src/data.js'))
scripts='<script src="vendor/three.min.js"></script>\n<script src="src/data.js"></script>\n<script src="src/game.js"></script>'
assert scripts in html,'tag <script> di index.html berubah; sesuaikan build_single.py'
html=html.replace(scripts,CDN+'\n<script>\n'+data+rd('src/game.js')+'</script>')
if missing: sys.exit('Aset tidak ditemukan: '+', '.join(missing))
os.makedirs(os.path.join(ROOT,'dist'),exist_ok=True)
out=os.path.join(ROOT,'dist','game_tambah.html');open(out,'w',encoding='utf8').write(html)
print('OK ->',out,'(%.1f MB)'%(os.path.getsize(out)/1048576))
