# Petualangan Kelinci (Tambah Seru)

Game penjumlahan HTML/JS: kelinci melawan 3 musuh (Kerangka, Golem, Vampir). Jawaban benar = kelinci menyerang,
salah / waktu 20 detik habis = musuh menyerang. HP musuh tinggal 1 (atau nyawa kelinci tinggal 1) = mode ULTIMATE.
Adegan dirender dengan Three.js r128 (latar berlapis per level, partikel, kamera, hit-stop). Kalau WebGL/Three.js
tidak tersedia, game otomatis memakai renderer 2D canvas.

## Struktur
```
index.html            markup layar (menu, pahlawan, pengaturan, kalah/menang)
css/style.css         gaya
src/data.js           peta aset -> path file + `meta` ukuran sel tiap sprite
src/game.js           seluruh logika game (render, animasi, soal, suara, efek)
vendor/three.min.js   Three.js r128 (UMD), salinan lokal
assets/sprites/<karakter>/   strip animasi (dipakai game) + frame satuan & atlas (referensi)
assets/ui/            gambar menu (landscape + portrait), kartu pahlawan, panel pengaturan, layar menang/kalah
assets/audio/         boom.mp3 (golem), sword.mp3 (pedang), sword_ult.wav (ultimate pedang), fire.mp3 (vampir), win.wav (menang), golem_die.wav (golem kalah), vamp_die.wav (vampir kalah)
tools/build_single.py gabung semua jadi satu file: dist/game_tambah.html
dist/game_tambah.html hasil build satu file (sama dengan versi yang diterbitkan di Claude)
```

## Menjalankan di lokal
Wajib lewat server lokal (bukan klik dua kali `index.html`), karena tekstur WebGL dan audio butuh `http://`:
```
cd petualangan-kelinci
python3 -m http.server 8000
# buka http://localhost:8000
```
Build satu file (mis. untuk diunggah ke hosting statis): `python3 tools/build_single.py`
(Three.js diganti tag CDN cdnjs r128 supaya file tidak membengkak; kalau mau offline penuh, biarkan `vendor/three.min.js`.)

## Bagian yang paling sering diubah (`src/game.js`)
| Yang diubah | Cari |
|---|---|
| HP musuh / waktu per soal | `EHP`, `TIME` |
| Batas hasil penjumlahan per level & mode | `RANGES` (mudah / menantang) |
| Urutan musuh, waktu hit (ms) serangan biasa & ultimate | `const EN=` → `[key, nama, hitMs, hitMsUlt]` |
| Latar per level (hutan / gurun / kastil) | `THM` (fungsi gambar kanvas per lapisan) + `setTheme` |
| Kekuatan efek hantaman (freeze, slow-mo, hentakan) | `function hitFx` |
| Getar layar, kilat, partikel, zoom kamera | `R3.hit` di modul Three.js |
| Suara & volume, pemetaan musuh → suara | `VOL`, `sfx(`, dan `sfx({skel:..., golem:..., vamp:...}` di `answer` |
| Musik gameplay latar (BGM procedural) | `BGM_PAT`, `bgmPlay`, `bgmStop` (sintesis Web Audio API, 0 KB aset) |
| Ukuran/titik pijak sprite | `src/data.js` → `meta` (`n,w,h,ax,ay`) dan `SC` (skala) di `game.js` |

Data tersimpan di browser (localStorage): `tambah_best` (skor terbaik), `tambah_mode` (mudah/menantang), `tambah_mute`.

## Menambah / mengganti aset
- Strip sprite = frame berjajar horizontal, satu sel berukuran sama. Ganti file di `assets/sprites/...` lalu sesuaikan
  `meta` (jumlah frame `n`, ukuran sel `w`×`h`, titik pijak `ax`,`ay` = posisi kaki di dalam sel).
- Hurt/defeat: satu strip berisi frame hurt lalu frame defeat; `hn` = jumlah frame hurt, `ds` = indeks awal defeat.
- Gambar menu/layar: hotspot tombol berupa persentase posisi di `index.html` (class `hs`). Kalau mengganti gambar menu,
  posisi tombol harus disesuaikan.

## Catatan
- Aset gambar/suara berasal dari kiriman Anda (hasil generate & file audio). Periksa lisensi file mp3 sebelum rilis publik.
- Skrip pemotong sprite (dari sheet mentah ke strip) tidak ikut di paket ini; sheet mentahnya ada pada Anda.
- Suara baru aktif setelah pemain mengetuk layar sekali (aturan autoplay browser).
