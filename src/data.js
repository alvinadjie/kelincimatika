// Peta aset -> path file. `meta` = ukuran sel sprite (n=jumlah frame, w/h=ukuran sel, ax/ay=titik pijak),
// plus af (awal loop aura), lunge, hn/ds (jumlah frame hurt / awal frame defeat), dfps.
// tools/build_single.py mengubah setiap path 'assets/...' menjadi data-URI saat build satu file.
const DATA={
 "bunny_idle": "assets/sprites/bunny/idle_side_strip.png",
 "bunny_atk": "assets/sprites/bunny/attack_strip.png",
 "bunny_hd": "assets/sprites/bunny/hurt_die_strip.png",
 "bunny_uch": "assets/sprites/bunny/ultimate_charge_strip.png",
 "bunny_uatk": "assets/sprites/bunny/ultimate_attack_strip.png",
 "skel_idle": "assets/sprites/skeleton/idle_side_strip.png",
 "skel_atk": "assets/sprites/skeleton/attack_strip.png",
 "skel_hd": "assets/sprites/skeleton/hurt_die_strip.png",
 "skel_uch": "assets/sprites/skeleton/ultimate_charge_strip.png",
 "skel_uatk": "assets/sprites/skeleton/ultimate_attack_strip.png",
 "golem_idle": "assets/sprites/golem/idle_strip.png",
 "golem_atk": "assets/sprites/golem/attack_strip.png",
 "golem_hd": "assets/sprites/golem/hurt_die_strip.png",
 "golem_uch": "assets/sprites/golem/ultimate_charge_strip.png",
 "golem_uatk": "assets/sprites/golem/ultimate_attack_strip.png",
 "vamp_idle": "assets/sprites/vampir/idle_strip.png",
 "vamp_atk": "assets/sprites/vampir/attack_strip.png",
 "vamp_hd": "assets/sprites/vampir/hurt_die_strip.png",
 "vamp_uch": "assets/sprites/vampir/ultimate_charge_strip.png",
 "vamp_uatk": "assets/sprites/vampir/ultimate_attack_strip.png",
 "menu_p": "assets/ui/menu_portrait.jpg",
 "card0": "assets/ui/cards/card_kelinci.jpg",
 "card1": "assets/ui/cards/card_vampir.jpg",
 "card2": "assets/ui/cards/card_skeleton.jpg",
 "card3": "assets/ui/cards/card_golem.jpg",
 "hbg": "assets/ui/heroes_bg.jpg",
 "set_panel": "assets/ui/settings_panel.jpg",
 "menu": "assets/ui/menu_landscape.jpg",
 "end_win": "assets/ui/end_menang.jpg",
 "end_skel": "assets/ui/end_kalah_skeleton.jpg",
 "end_vamp": "assets/ui/end_kalah_vampir.jpg",
 "end_golem": "assets/ui/end_kalah_golem.jpg",
 "snd": {
  "boom": "assets/audio/boom.mp3",
  "sword": "assets/audio/sword.mp3",
  "sword_ult": "assets/audio/sword_ult.wav",
  "fire": "assets/audio/fire.mp3",
  "win": "assets/audio/win.wav",
  "golem_die": "assets/audio/golem_die.wav",
  "vamp_die": "assets/audio/vamp_die.wav"
 },
 "meta": {
  "bunny_uch": {
   "n": 4,
   "w": 122,
   "h": 153,
   "ax": 62,
   "ay": 145
  },
  "bunny_uatk": {
   "n": 8,
   "w": 144,
   "h": 161,
   "ax": 73,
   "ay": 139
  },
  "skel_uch": {
   "n": 8,
   "w": 134,
   "h": 182,
   "ax": 67,
   "ay": 145
  },
  "skel_uatk": {
   "n": 8,
   "w": 349,
   "h": 184,
   "ax": 76,
   "ay": 153
  },
  "golem_idle": {
   "n": 4,
   "w": 147,
   "h": 149,
   "ax": 62,
   "ay": 145
  },
  "golem_atk": {
   "n": 6,
   "w": 189,
   "h": 149,
   "ax": 83,
   "ay": 143
  },
  "golem_hd": {
   "n": 7,
   "w": 223,
   "h": 172,
   "ax": 99,
   "ay": 159,
   "hn": 2,
   "ds": 2,
   "dfps": 6
  },
  "golem_uch": {
   "n": 5,
   "w": 186,
   "h": 234,
   "ax": 87,
   "ay": 226,
   "af": 3
  },
  "golem_uatk": {
   "n": 5,
   "w": 204,
   "h": 263,
   "ax": 84,
   "ay": 238,
   "lunge": 230
  },
  "vamp_idle": {
   "n": 4,
   "w": 95,
   "h": 152,
   "ax": 45,
   "ay": 145
  },
  "vamp_atk": {
   "n": 5,
   "w": 397,
   "h": 138,
   "ax": 66,
   "ay": 135
  },
  "vamp_hd": {
   "n": 8,
   "w": 205,
   "h": 164,
   "ax": 94,
   "ay": 146,
   "hn": 2,
   "ds": 2,
   "dfps": 6
  },
  "vamp_uch": {
   "n": 5,
   "w": 150,
   "h": 143,
   "ax": 73,
   "ay": 140,
   "af": 3
  },
  "vamp_uatk": {
   "n": 8,
   "w": 368,
   "h": 157,
   "ax": 73,
   "ay": 154
  },
  "end_win": {
   "w": 848,
   "h": 1264
  },
  "end_skel": {
   "w": 457,
   "h": 768
  },
  "end_vamp": {
   "w": 450,
   "h": 768
  },
  "end_golem": {
   "w": 457,
   "h": 768
  }
 }
};
