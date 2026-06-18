// ミニアランド v0.6.15.7 平成ブラウザMMO装備UI版
// v0.5.7 の安定版をベースに、CSS / JS / 画像素材を外部ファイル化。
// 既存の移動・戦闘・装備・クエスト処理は維持。

(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const app = $("app");
  const titleScreen = $("titleScreen");
  const gameScreen = $("gameScreen");
  const canvas = $("gameCanvas");
  const ctx = canvas.getContext("2d", { alpha:false });

  const titleCanvas = $("titleCanvas");
  const tctx = titleCanvas.getContext("2d");

  const SAVE_KEY = "minialand_v03_save";

  const ITEMS = {
    puru_jelly: { name:"ぷるゼリー", type:"素材", icon:"💧" },
    puru_core: { name:"ぷるコア", type:"レア素材", icon:"🔷" },
    mushroom_grass: { name:"きのこ草", type:"素材", icon:"🍄" },
    red_cap: { name:"赤いカサ", type:"レア素材", icon:"🍄" },
    moco_fur: { name:"モコ毛皮", type:"素材", icon:"🧶" },
    moco_horn_piece: { name:"モコ角", type:"レア素材", icon:"🦴" },
    tiny_wing: { name:"小さな羽", type:"素材", icon:"🪶" },
    herb: { name:"やくそう", type:"消費", icon:"🌿" }
  };


  const EQUIP_SLOTS = {
    weapon:"武器",
    head:"頭",
    body:"胴",
    shield:"盾",
    back:"背中",
    accessory:"アクセ"
  };

  const EQUIPMENT = {
    wood_sword: {
      id:"wood_sword", name:"木の剣", icon:"⚔", slot:"weapon",
      allowedJobs:["fighter"], atk:3, hp:0, sp:0, speed:0,
      desc:"最初から持っている木製の剣。扱いやすい。"
    },
    iron_sword: {
      id:"iron_sword", name:"鉄の剣", icon:"🗡", slot:"weapon",
      allowedJobs:["fighter"], atk:9, hp:8, sp:0, speed:-2,
      desc:"少し重いが攻撃力が高い剣。ファイター専用。"
    },
    moco_blade: {
      id:"moco_blade", name:"モコブレード", icon:"🗡", slot:"weapon",
      allowedJobs:["fighter"], atk:13, hp:12, sp:0, speed:-3,
      desc:"モコホーン素材で作る片手剣。硬い敵へ挑むファイター専用武器。"
    },
    apprentice_staff: {
      id:"apprentice_staff", name:"見習いの杖", icon:"🔮", slot:"weapon",
      allowedJobs:["mage"], atk:6, hp:0, sp:18, speed:0,
      desc:"魔力を高める小さな杖。メイジ専用。"
    },
    mushroom_staff: {
      id:"mushroom_staff", name:"キノコ杖", icon:"🍄", slot:"weapon",
      allowedJobs:["mage"], atk:10, hp:0, sp:28, speed:0,
      desc:"赤いカサを飾った魔法杖。SPが大きく伸びるメイジ専用武器。"
    },
    thief_dagger: {
      id:"thief_dagger", name:"盗賊の短剣", icon:"🗡", slot:"weapon",
      allowedJobs:["thief"], atk:5, hp:0, sp:4, speed:10,
      desc:"軽くて素早く振れる短剣。シーフ専用。"
    },
    puru_dagger: {
      id:"puru_dagger", name:"ぷる短剣", icon:"🔪", slot:"weapon",
      allowedJobs:["thief"], atk:8, hp:0, sp:8, speed:14,
      desc:"ぷるコアを埋め込んだ軽い短剣。手数で戦うシーフ専用武器。"
    },
    flame_greatsword: {
      id:"flame_greatsword", name:"炎の大剣", icon:"🔥", slot:"weapon",
      allowedJobs:["sword_kaiser"], atk:16, hp:6, sp:0, speed:-4,
      desc:"将来の上位職ソードカイザー向けに温存している巨大な大剣。今は開発者モードで見た目確認できます。"
    },
    healing_staff: {
      id:"healing_staff", name:"いやしの杖", icon:"✨", slot:"weapon",
      allowedJobs:["priest"], atk:4, hp:4, sp:24, speed:0,
      desc:"回復力を高める小さな杖。プリースト専用。"
    },
    cloth_cap: {
      id:"cloth_cap", name:"布の帽子", icon:"🧢", slot:"head",
      atk:0, hp:5, sp:3, speed:0,
      desc:"初心者向けの布帽子。"
    },
    mage_hat: {
      id:"mage_hat", name:"魔法使い帽", icon:"🎩", slot:"head",
      allowedJobs:["mage"], atk:2, hp:0, sp:14, speed:0,
      desc:"大きめの魔法帽。メイジ専用。"
    },
    thief_hood: {
      id:"thief_hood", name:"盗賊フード", icon:"🟩", slot:"head",
      allowedJobs:["thief"], atk:1, hp:2, sp:2, speed:7,
      desc:"軽く動きやすいフード。シーフ専用。"
    },
    traveler_cloth: {
      id:"traveler_cloth", name:"旅人の服", icon:"👕", slot:"body",
      atk:0, hp:10, sp:0, speed:0,
      desc:"旅人用のシンプルな服。"
    },
    soldier_armor: {
      id:"soldier_armor", name:"兵士の鎧", icon:"🛡", slot:"body",
      allowedJobs:["fighter"], atk:1, hp:28, sp:0, speed:-5,
      desc:"防御寄りの鎧。ファイター専用。"
    },
    apprentice_robe: {
      id:"apprentice_robe", name:"見習いローブ", icon:"🟪", slot:"body",
      allowedJobs:["mage"], atk:1, hp:4, sp:22, speed:0,
      desc:"魔法職向けの軽いローブ。メイジ専用。"
    },
    priest_robe: {
      id:"priest_robe", name:"白のローブ", icon:"🤍", slot:"body",
      allowedJobs:["priest"], atk:0, hp:16, sp:18, speed:0,
      desc:"回復職向けの白いローブ。プリースト専用。"
    },
    thief_clothes: {
      id:"thief_clothes", name:"盗賊の軽装", icon:"🟢", slot:"body",
      allowedJobs:["thief"], atk:1, hp:8, sp:4, speed:9,
      desc:"素早さ重視の軽装。シーフ専用。"
    },
    small_shield: {
      id:"small_shield", name:"小さな盾", icon:"🛡", slot:"shield",
      allowedJobs:["fighter"], atk:0, hp:15, sp:0, speed:-2,
      desc:"小型の盾。ファイター専用。"
    },
    novice_cape: {
      id:"novice_cape", name:"見習いマント", icon:"🧣", slot:"back",
      atk:0, hp:6, sp:6, speed:3,
      desc:"背中装備の入門品。少しだけ万能。"
    },
    bronze_ring: {
      id:"bronze_ring", name:"ブロンズリング", icon:"💍", slot:"accessory",
      atk:2, hp:4, sp:4, speed:0,
      desc:"小さな能力補正を得られる指輪。"
    }
  };

  const EQUIP_RECIPES = {
    iron_sword: { gold:80, materials:{ moco_fur:2 } },
    apprentice_staff: { gold:60, materials:{ mushroom_grass:2, puru_jelly:1 } },
    thief_dagger: { gold:60, materials:{ puru_jelly:3 } },
    moco_blade: { gold:160, materials:{ moco_fur:5, moco_horn_piece:1 } },
    mushroom_staff: { gold:80, materials:{ mushroom_grass:5, red_cap:1 } },
    healing_staff: { gold:75, materials:{ puru_jelly:3, mushroom_grass:3 } },
    puru_dagger: { gold:60, materials:{ puru_jelly:5, puru_core:1 } },
    mage_hat: { gold:45, materials:{ mushroom_grass:2 } },
    thief_hood: { gold:45, materials:{ puru_jelly:2, moco_fur:1 } },
    soldier_armor: { gold:90, materials:{ moco_fur:3 } },
    apprentice_robe: { gold:70, materials:{ mushroom_grass:3 } },
    priest_robe: { gold:70, materials:{ puru_jelly:2, mushroom_grass:2 } },
    thief_clothes: { gold:70, materials:{ puru_jelly:2, moco_fur:2 } },
    small_shield: { gold:50, materials:{ moco_fur:1 } },
    novice_cape: { gold:50, materials:{ puru_jelly:1, mushroom_grass:1 } },
    bronze_ring: { gold:40, materials:{ puru_jelly:2 } }
  };

  // 武器の見た目をデータで定義（type＋色・長さ・太さ）。
  // 新しい武器はここに1行足すだけで、描画コードを書かずに見た目が変わる。
  const WEAPON_LOOKS = {
    wood_sword:       { type:"sword",  blade:"#dfe7ef", edge:"#f8fbff", grip:"#7a4f2b", guard:"#7a4f2b", len:33, w:5 },
    iron_sword:       { type:"sword",  blade:"#cbd6e0", edge:"#f0f5ff", grip:"#7a4f2b", guard:"#ffd24a", len:41, w:6 },
    moco_blade:       { type:"sword",  blade:"#d8c184", edge:"#fff1b8", grip:"#6a4325", guard:"#986742", len:43, w:7 },
    flame_greatsword: { type:"sword",  blade:"#ff7a3c", edge:"#ffe08a", grip:"#5a2d18", guard:"#ffce4a", len:52, w:11, glow:"#ff5a1e",
      img:"weaponFlameGreatsword", gripAnchor:[0.30,0.74],
      view:{ down:{ox:16,oy:0,h:78,rot:-12,behind:false},
             up:  {ox:15,oy:-4,h:78,rot:-12,behind:true},
             side:{ox:24,oy:1,h:67,rot:0,behind:false} } },
    apprentice_staff: { type:"staff",  shaft:"#6b4324", orb:"#8fe8ff", core:"#fff8df", len:40 },
    mushroom_staff:   { type:"staff",  shaft:"#6b4324", orb:"#e87062", core:"#fff4c7", len:43 },
    healing_staff:    { type:"staff",  shaft:"#725033", orb:"#fff6c8", core:"#8fe8ff", len:41 },
    thief_dagger:     { type:"dagger", blade:"#dfe7ef", edge:"#f8fbff", grip:"#6b4324", guard:"#6b4324", len:22, w:5 },
    puru_dagger:      { type:"dagger", blade:"#8fe8ff", edge:"#f8fbff", grip:"#356b7d", guard:"#6b4324", len:24, w:5 }
  };
  function weaponLook(id){ return WEAPON_LOOKS[id] || WEAPON_LOOKS.wood_sword; }


  const USER_PLAYER_FRONT_PNG = "assets/characters/player_front.png";
  const USER_PLAYER_BACK_PNG = "assets/characters/player_back.png";
  const USER_PLAYER_SIDE_PNG = "assets/characters/player_side.png";
  const USER_PLAYER_FRONTA_PNG = "assets/characters/player_front_walk_a.png";
  const USER_PLAYER_FRONTB_PNG = "assets/characters/player_front_walk_b.png";
  const USER_PLAYER_FRONTC_PNG = "assets/characters/player_front_walk_c.png";
  const USER_PLAYER_FRONTD_PNG = "assets/characters/player_front_walk_d.png";
  const USER_PLAYER_BACKA_PNG = "assets/characters/player_back_walk_a.png";
  const USER_PLAYER_BACKB_PNG = "assets/characters/player_back_walk_b.png";
  const USER_PLAYER_BACKC_PNG = "assets/characters/player_back_walk_c.png";
  const USER_PLAYER_BACKD_PNG = "assets/characters/player_back_walk_d.png";
  const USER_PLAYER_SIDEA_PNG = "assets/characters/player_side_walk_a.png";
  const USER_PLAYER_SIDEB_PNG = "assets/characters/player_side_walk_b.png";
  const USER_PLAYER_SIDEC_PNG = "assets/characters/player_side_walk_c.png";
  const USER_PLAYER_SIDED_PNG = "assets/characters/player_side_walk_d.png";
  const USER_PLAYER_ATTACK_FRONTA_PNG = "assets/characters/player_attack_front_a.png";
  const USER_PLAYER_ATTACK_FRONTB_PNG = "assets/characters/player_attack_front_b.png";
  const USER_PLAYER_ATTACK_FRONTC_PNG = "assets/characters/player_attack_front_c.png";
  const USER_PLAYER_ATTACK_FRONTD_PNG = "assets/characters/player_attack_front_d.png";
  const USER_PLAYER_ATTACK_BACKA_PNG = "assets/characters/player_attack_back_a.png";
  const USER_PLAYER_ATTACK_BACKB_PNG = "assets/characters/player_attack_back_b.png";
  const USER_PLAYER_ATTACK_BACKC_PNG = "assets/characters/player_attack_back_c.png";
  const USER_PLAYER_ATTACK_BACKD_PNG = "assets/characters/player_attack_back_d.png";
  const USER_PLAYER_ATTACK_SIDEA_PNG = "assets/characters/player_attack_side_a.png";
  const USER_PLAYER_ATTACK_SIDEB_PNG = "assets/characters/player_attack_side_b.png";
  const USER_PLAYER_ATTACK_SIDEC_PNG = "assets/characters/player_attack_side_c.png";
  const USER_PLAYER_ATTACK_SIDED_PNG = "assets/characters/player_attack_side_d.png";
  const USER_PURU_SLIME_PNG = "assets/monsters/puru_slime.png";
  const USER_FLAME_GREATSWORD_PNG = "assets/equipment/flame_greatsword.png";

  const SPRITE_ASSET_TEXT = {
    playerBase: `
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <ellipse cx="32" cy="57" rx="14" ry="4" fill="rgba(0,0,0,.25)"/>
  <rect x="24" y="40" width="6" height="12" rx="2" fill="#6e4727"/>
  <rect x="34" y="40" width="6" height="12" rx="2" fill="#6e4727"/>
  <rect x="23" y="50" width="8" height="4" rx="1" fill="#35281f"/>
  <rect x="33" y="50" width="8" height="4" rx="1" fill="#35281f"/>
  <rect x="18" y="26" width="28" height="20" rx="8" fill="#f5dfbc" stroke="#6e4c38" stroke-width="2"/>
  <rect x="17" y="23" width="30" height="15" rx="6" fill="#67a9db" stroke="#234c70" stroke-width="2"/>
  <rect x="18" y="37" width="28" height="6" rx="3" fill="#f0c05e" stroke="#8a5b1e" stroke-width="2"/>
  <rect x="26" y="21" width="12" height="7" rx="3" fill="#fff4cf" stroke="#6e4c38" stroke-width="2"/>
  <rect x="12" y="28" width="7" height="14" rx="3" fill="#f2c59b" stroke="#6e4c38" stroke-width="2"/>
  <rect x="45" y="28" width="7" height="14" rx="3" fill="#f2c59b" stroke="#6e4c38" stroke-width="2"/>
  <rect x="19" y="8" width="26" height="22" rx="9" fill="#f3caa3" stroke="#6e4c38" stroke-width="2"/>
  <path d="M18 16 Q20 4 32 4 Q45 4 46 18 L46 16 L18 16 Z" fill="#7b4d27"/>
  <ellipse cx="26.5" cy="18.5" rx="2.5" ry="3" fill="#1f3145"/>
  <ellipse cx="37.5" cy="18.5" rx="2.5" ry="3" fill="#1f3145"/>
  <ellipse cx="27" cy="18" rx="1" ry="1.2" fill="#fff2df"/>
  <ellipse cx="38" cy="18" rx="1" ry="1.2" fill="#fff2df"/>
  <rect x="29" y="24" width="6" height="2.5" rx="1.2" fill="#a6533d"/>
</svg>`,
    fighter: `
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <ellipse cx="32" cy="57" rx="14" ry="4" fill="rgba(0,0,0,.25)"/>
  <rect x="24" y="40" width="6" height="12" rx="2" fill="#6e4727"/>
  <rect x="34" y="40" width="6" height="12" rx="2" fill="#6e4727"/>
  <rect x="23" y="50" width="8" height="4" rx="1" fill="#35281f"/>
  <rect x="33" y="50" width="8" height="4" rx="1" fill="#35281f"/>
  <rect x="16" y="22" width="32" height="24" rx="8" fill="#a9bdcf" stroke="#31485e" stroke-width="2"/>
  <rect x="19" y="29" width="26" height="8" rx="4" fill="#6f879f" stroke="#31485e" stroke-width="2"/>
  <rect x="24" y="24" width="16" height="7" rx="3" fill="#dff4ff" stroke="#6d8399" stroke-width="2"/>
  <rect x="18" y="37" width="28" height="6" rx="3" fill="#ffd24a" stroke="#8a5b1e" stroke-width="2"/>
  <rect x="11" y="28" width="7" height="14" rx="3" fill="#f2c59b" stroke="#6e4c38" stroke-width="2"/>
  <rect x="46" y="28" width="7" height="14" rx="3" fill="#f2c59b" stroke="#6e4c38" stroke-width="2"/>
  <rect x="19" y="8" width="26" height="22" rx="9" fill="#f3caa3" stroke="#6e4c38" stroke-width="2"/>
  <path d="M18 16 Q20 4 32 4 Q45 4 46 18 L46 16 L18 16 Z" fill="#7b4d27"/>
  <ellipse cx="26.5" cy="18.5" rx="2.5" ry="3" fill="#1f3145"/>
  <ellipse cx="37.5" cy="18.5" rx="2.5" ry="3" fill="#1f3145"/>
  <ellipse cx="27" cy="18" rx="1" ry="1.2" fill="#fff2df"/>
  <ellipse cx="38" cy="18" rx="1" ry="1.2" fill="#fff2df"/>
  <rect x="29" y="24" width="6" height="2.5" rx="1.2" fill="#a6533d"/>
  <path d="M48 16 L55 14 L55 44 L49 44 Z" fill="#cbd6e0" stroke="#536273" stroke-width="2"/>
  <rect x="44" y="42" width="14" height="6" rx="2" fill="#7a4f2b" stroke="#3d2516" stroke-width="2"/>
  <rect x="47" y="45" width="8" height="4" rx="2" fill="#ffd24a" stroke="#8a5b1e" stroke-width="2"/>
  <rect x="8" y="29" width="10" height="15" rx="3" fill="#d9efff" stroke="#315b93" stroke-width="2"/>
  <rect x="11" y="33" width="4" height="7" rx="1.5" fill="#ffe36d" stroke="#8a5b1e" stroke-width="1.5"/>
</svg>`,
    slimeBlue: `
<svg xmlns="http://www.w3.org/2000/svg" width="56" height="48" viewBox="0 0 56 48">
  <ellipse cx="28" cy="41" rx="14" ry="4" fill="rgba(0,0,0,.22)"/>
  <path d="M12 34 Q11 22 18 16 Q21 8 28 5 Q36 8 39 16 Q45 22 44 34 Q42 40 28 40 Q14 40 12 34 Z" fill="#58c7ff" stroke="#204d73" stroke-width="2.5"/>
  <ellipse cx="22" cy="20" rx="5" ry="3" fill="rgba(255,255,255,.45)"/>
  <ellipse cx="24" cy="28" rx="3" ry="3.5" fill="#143d5a"/>
  <ellipse cx="32" cy="28" rx="3" ry="3.5" fill="#143d5a"/>
  <ellipse cx="24" cy="27.5" rx="1" ry="1.2" fill="#fff"/>
  <ellipse cx="32" cy="27.5" rx="1" ry="1.2" fill="#fff"/>
  <path d="M24 33 Q28 36 32 33" stroke="#1b5a7d" stroke-width="2" fill="none" stroke-linecap="round"/>
</svg>`,
    slimeRed: `
<svg xmlns="http://www.w3.org/2000/svg" width="56" height="48" viewBox="0 0 56 48">
  <ellipse cx="28" cy="41" rx="14" ry="4" fill="rgba(0,0,0,.22)"/>
  <path d="M12 34 Q11 22 18 16 Q21 8 28 5 Q36 8 39 16 Q45 22 44 34 Q42 40 28 40 Q14 40 12 34 Z" fill="#e87062" stroke="#6f2f28" stroke-width="2.5"/>
  <ellipse cx="22" cy="20" rx="5" ry="3" fill="rgba(255,255,255,.45)"/>
  <ellipse cx="24" cy="28" rx="3" ry="3.5" fill="#5b1f19"/>
  <ellipse cx="32" cy="28" rx="3" ry="3.5" fill="#5b1f19"/>
  <ellipse cx="24" cy="27.5" rx="1" ry="1.2" fill="#fff"/>
  <ellipse cx="32" cy="27.5" rx="1" ry="1.2" fill="#fff"/>
  <path d="M24 33 Q28 36 32 33" stroke="#7b2a22" stroke-width="2" fill="none" stroke-linecap="round"/>
</svg>`
  };

  function svgToDataUri(svgText){
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgText.trim());
  }

  const spriteAssets = {};
  function loadSvgSprite(key, svgText){
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {};
    img.onerror = () => { console.warn("sprite load failed:", key); };
    img.src = svgToDataUri(svgText);
    spriteAssets[key] = img;
    return img;
  }

  function loadPngSprite(key, src){
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {};
    img.onerror = () => { console.warn("png sprite load failed:", key); };
    img.src = src;
    spriteAssets[key] = img;
    return img;
  }

  function initSpriteAssets(){
    loadPngSprite("playerFront", USER_PLAYER_FRONT_PNG);
    loadPngSprite("playerBack", USER_PLAYER_BACK_PNG);
    loadPngSprite("playerSide", USER_PLAYER_SIDE_PNG);
    loadPngSprite("playerFrontA", USER_PLAYER_FRONTA_PNG);
    loadPngSprite("playerFrontB", USER_PLAYER_FRONTB_PNG);
    loadPngSprite("playerFrontC", USER_PLAYER_FRONTC_PNG);
    loadPngSprite("playerFrontD", USER_PLAYER_FRONTD_PNG);
    loadPngSprite("playerBackA", USER_PLAYER_BACKA_PNG);
    loadPngSprite("playerBackB", USER_PLAYER_BACKB_PNG);
    loadPngSprite("playerBackC", USER_PLAYER_BACKC_PNG);
    loadPngSprite("playerBackD", USER_PLAYER_BACKD_PNG);
    loadPngSprite("playerSideA", USER_PLAYER_SIDEA_PNG);
    loadPngSprite("playerSideB", USER_PLAYER_SIDEB_PNG);
    loadPngSprite("playerSideC", USER_PLAYER_SIDEC_PNG);
    loadPngSprite("playerSideD", USER_PLAYER_SIDED_PNG);
    loadPngSprite("playerAttackFrontA", USER_PLAYER_ATTACK_FRONTA_PNG);
    loadPngSprite("playerAttackFrontB", USER_PLAYER_ATTACK_FRONTB_PNG);
    loadPngSprite("playerAttackFrontC", USER_PLAYER_ATTACK_FRONTC_PNG);
    loadPngSprite("playerAttackFrontD", USER_PLAYER_ATTACK_FRONTD_PNG);
    loadPngSprite("playerAttackBackA", USER_PLAYER_ATTACK_BACKA_PNG);
    loadPngSprite("playerAttackBackB", USER_PLAYER_ATTACK_BACKB_PNG);
    loadPngSprite("playerAttackBackC", USER_PLAYER_ATTACK_BACKC_PNG);
    loadPngSprite("playerAttackBackD", USER_PLAYER_ATTACK_BACKD_PNG);
    loadPngSprite("playerAttackSideA", USER_PLAYER_ATTACK_SIDEA_PNG);
    loadPngSprite("playerAttackSideB", USER_PLAYER_ATTACK_SIDEB_PNG);
    loadPngSprite("playerAttackSideC", USER_PLAYER_ATTACK_SIDEC_PNG);
    loadPngSprite("playerAttackSideD", USER_PLAYER_ATTACK_SIDED_PNG);
    loadSvgSprite("fighter", SPRITE_ASSET_TEXT.fighter);
    loadPngSprite("slimeBlue", USER_PURU_SLIME_PNG);
    loadPngSprite("weaponFlameGreatsword", USER_FLAME_GREATSWORD_PNG);
    loadSvgSprite("slimeRed", SPRITE_ASSET_TEXT.slimeRed);
  }


  const MONSTERS = {
    puru_slime: {
      // 低レベル用。数を倒して少しずつ稼ぐ敵。
      id:"puru_slime", name:"ぷるスライム", hp:44, atk:5, exp:5, gold:4, r:16, speed:34,
      item:"puru_jelly", rareItem:"puru_core", rareRate:.12, color:"#59c7ff", sub:"#b9efff"
    },
    kinokko: {
      // Lv4〜8あたりの主な経験値源。
      id:"kinokko", name:"キノっこ", hp:72, atk:8, exp:11, gold:7, r:18, speed:30,
      item:"mushroom_grass", rareItem:"red_cap", rareRate:.10, color:"#e87062", sub:"#ffe3b0"
    },
    moco_horn: {
      // Lv10推奨の序盤強敵。危険だが経験値とゴールドは高い。
      id:"moco_horn", name:"モコホーン", hp:600, atk:22, exp:80, gold:44, r:22, speed:30, knockResist:.82, stunResist:.8,
      item:"moco_fur", rareItem:"moco_horn_piece", rareRate:.20, color:"#e8d8a5", sub:"#986742"
    }
  };

  // v0.6.15: 草原の半固定スポーンエリア。
  // 完全ランダムではなく、敵ごとに出やすい地域を分ける。
  const FIELD_TARGET_ENEMY_COUNT = 9;

  const FIELD_SPAWN_ZONES = [
    {
      id:"south_puru", name:"入口草地", weight:50,
      x:[105,1175], y:[690,930],
      ids:["puru_slime","puru_slime","puru_slime","puru_slime","puru_slime","kinokko"]
    },
    {
      id:"mid_kinokko", name:"中央きのこ道", weight:38,
      x:[120,1160], y:[365,725],
      ids:["puru_slime","kinokko","kinokko","kinokko","kinokko"]
    },
    {
      id:"north_moco", name:"北の奥地", weight:12,
      x:[130,1150], y:[110,385],
      ids:["kinokko","kinokko","moco_horn"]
    }
  ];

  function countEnemies(id){
    return game.enemies.filter(e => e.id === id).length;
  }

  function weightedSpawnZone(){
    const total = FIELD_SPAWN_ZONES.reduce((sum,z)=>sum + z.weight, 0);
    let roll = rand(0,total);
    for(const zone of FIELD_SPAWN_ZONES){
      roll -= zone.weight;
      if(roll <= 0) return zone;
    }
    return FIELD_SPAWN_ZONES[0];
  }

  function chooseSpawnId(zone){
    let ids = [...zone.ids];

    // モコホーンは序盤強敵枠なので同時に最大1体まで。
    // 1体いる間は候補から外し、倒されたらまた候補に戻る。
    if(countEnemies("moco_horn") >= 1){
      ids = ids.filter(id => id !== "moco_horn");
    }

    if(ids.length === 0) ids = ["puru_slime"];
    return ids[Math.floor(Math.random()*ids.length)];
  }

  const JOBS = {
    fighter: {
      id:"fighter", name:"ファイター", icon:"⚔", type:"近接安定型",
      hpRate:1.25, spRate:.85, atkRate:1.18, defRate:1.12, speedRate:1.0,
      cooldown:.43, range:54, cost:0,
      skillName:"スラッシュ", skillCost:6, skillCooldown:2.2,
      skillDesc:"前方を大きく斬り払うファイター専用スキル。通常攻撃より高威力で、近くの敵をまとめて攻撃できる。",
      summary:"剣で戦う序盤安定職。HP・攻撃・防御が高く、近距離戦に強い。",
      attackName:"剣撃",
      tip:"近づいて正面を向いて攻撃。専用スキル「スラッシュ」は技ボタンで発動。"
    },
    mage: {
      id:"mage", name:"メイジ", icon:"✦", type:"魔法型",
      hpRate:.85, spRate:1.45, atkRate:1.08, defRate:.86, speedRate:.96,
      cooldown:.62, range:150, cost:8,
      skillName:"ファイアボルト", skillCost:14, skillCooldown:2.8,
      skillDesc:"正面方向へ火の弾を放つメイジ専用スキル。遠くの単体へ高威力で攻撃できる。",
      summary:"SPを使って遠距離魔法を撃つ火力型。最大SPが高い。",
      attackName:"魔法弾",
      tip:"正面方向へ遠距離攻撃。専用スキル「ファイアボルト」は技ボタンで発動。"
    },
    thief: {
      id:"thief", name:"シーフ", icon:"🗡", type:"速度型",
      hpRate:.95, spRate:1.05, atkRate:.92, defRate:.94, speedRate:1.28,
      cooldown:.28, range:44, cost:0,
      skillName:"未実装", skillCost:0, skillCooldown:0,
      skillDesc:"今後、連撃・回避系スキルなどを追加予定。",
      summary:"短剣で素早く戦う高速型。移動速度と攻撃間隔が速い。",
      attackName:"連続短剣",
      tip:"射程は短いが攻撃間隔が短く、移動速度も速い。"
    },
    priest: {
      id:"priest", name:"プリースト", icon:"✚", type:"回復支援型",
      hpRate:1.05, spRate:1.28, atkRate:.82, defRate:1.06, speedRate:.98,
      cooldown:.66, range:132, cost:5,
      skillName:"ヒール", skillCost:12, skillCooldown:3.0,
      skillDesc:"自分のHPを回復するプリースト専用スキル。INTで回復量、VITで安定感が伸びる。",
      summary:"回復と耐久に優れた支援職。ソロでも粘り強く戦える。",
      attackName:"ライトショット",
      tip:"遠距離の光弾で戦い、危なくなったらヒールで立て直す。"
    }
  };

  const FUTURE_JOB_NAMES = {
    pet_raiser:"ペットライザー",
    samurai:"サムライ",
    sorcerer:"ソーサラー",
    holy_knight:"ホーリーナイト",
    ninja:"ニンジャ",
    ranger:"レンジャー",
    sword_kaiser:"ソードカイザー",
    grand_magia:"グランマギアー",
    shield_saber:"シルドセイバー",
    avengista:"アベンジスタ",
    dual_star:"デュアルスター",
    aramikagura:"アラミカグラ",
    alvride:"アルヴライド",
    nirvadio:"ニルバディオ",
    noxtia:"ノクスティア",
    alterie:"オルタリエ"
  };

  const JOB_TREE_TIERS = [
    {
      tier:1, label:"1次職", className:"tier1",
      jobs:[
        {id:"fighter", icon:"⚔", role:"近接", req:"初期", implemented:true},
        {id:"mage", icon:"✦", role:"魔法", req:"初期", implemented:true},
        {id:"priest", icon:"✚", role:"回復", req:"初期", implemented:true},
        {id:"thief", icon:"🗡", role:"速度", req:"初期", implemented:true},
        {id:"pet_raiser", icon:"🐾", role:"ペット", req:"未実装", implemented:false}
      ]
    },
    {
      tier:2, label:"2次職", className:"tier2",
      jobs:[
        {id:"samurai", icon:"刀", role:"斬撃", req:"ファイターLv50 + シーフLv30", implemented:false},
        {id:"sorcerer", icon:"魔", role:"高火力", req:"メイジLv50 + プリーストLv30", implemented:false},
        {id:"holy_knight", icon:"聖", role:"防御支援", req:"ファイターLv40 + プリーストLv40", implemented:false},
        {id:"ninja", icon:"忍", role:"高速", req:"シーフLv50 + ファイターLv30", implemented:false},
        {id:"ranger", icon:"弓", role:"探索", req:"シーフLv30 + ペットライザーLv40", implemented:false}
      ]
    },
    {
      tier:3, label:"3次職", className:"tier3",
      jobs:[
        {id:"sword_kaiser", icon:"剣", role:"剣王", req:"サムライ系", implemented:false},
        {id:"grand_magia", icon:"大魔", role:"大魔法", req:"ソーサラー系", implemented:false},
        {id:"shield_saber", icon:"盾", role:"守護剣", req:"ホーリーナイト系", implemented:false},
        {id:"avengista", icon:"復", role:"反撃", req:"ニンジャ系", implemented:false},
        {id:"dual_star", icon:"双", role:"二刀/星", req:"レンジャー系", implemented:false}
      ]
    },
    {
      tier:4, label:"4次職", className:"tier4",
      jobs:[
        {id:"aramikagura", icon:"神", role:"極剣", req:"4次職予定", implemented:false},
        {id:"alvride", icon:"光", role:"聖騎", req:"4次職予定", implemented:false},
        {id:"nirvadio", icon:"冥", role:"深淵", req:"4次職予定", implemented:false},
        {id:"noxtia", icon:"夜", role:"影技", req:"4次職予定", implemented:false},
        {id:"alterie", icon:"星", role:"万能", req:"4次職予定", implemented:false}
      ]
    }
  ];

  // v0.6.15: チョコットランド系に近い基礎ステータス。
  // POW/INT/SPD/VIT/LUK は振るステ、ATK/MAT/DEF/MDF/MOV/CRI/RARE は最終ステ。
  const STAT_KEYS = ["pow","int","spd","vit","luk"];
  const STAT_META = {
    pow:{ label:"POW", name:"ちから", desc:"物理攻撃。ATKとスラッシュ火力に影響。", rec:"ファイター/シーフ" },
    int:{ label:"INT", name:"まほう", desc:"魔法攻撃、最大SP、MDFに影響。", rec:"メイジ/プリースト" },
    spd:{ label:"SPD", name:"すばやさ", desc:"移動速度と通常攻撃CTに影響。", rec:"シーフ/快適狩り" },
    vit:{ label:"VIT", name:"たいりょく", desc:"最大HPとDEFに影響。", rec:"ファイター/耐久" },
    luk:{ label:"LUK", name:"うん", desc:"会心率とレアドロップ率に影響。", rec:"素材集め" }
  };

  function emptyStats(){
    return { pow:0, int:0, spd:0, vit:0, luk:0 };
  }

  const QUEST_DEFS = [
    {
      id:"puru_hunt", title:"ぷるスライム退治", badge:"STEP 1 / 戦闘練習",
      desc:"ひだまり草原でぷるスライムを3体倒す。まずは攻撃・技・拾うボタンに慣れよう。",
      type:"kill", targetId:"puru_slime", target:3,
      reward:{ gold:45, items:{ herb:2 } },
      next:"jelly_collect"
    },
    {
      id:"jelly_collect", title:"ぷるゼリー集め", badge:"STEP 2 / 素材集め",
      desc:"ぷるスライムが落とすぷるゼリーを4個集める。ぷる素材は短剣やアクセ作成に使う。",
      type:"item", targetId:"puru_jelly", target:4,
      reward:{ gold:45, items:{ puru_jelly:1 } },
      next:"first_craft"
    },
    {
      id:"first_craft", title:"はじめての装備作成", badge:"STEP 3 / 鍛冶屋",
      desc:"鍛冶屋で装備を1つ作成する。素材とGを使って、狩りやすさを上げよう。",
      type:"craft", targetId:"any", target:1,
      reward:{ gold:80, items:{ herb:1 } },
      next:"weapon_upgrade"
    },
    {
      id:"weapon_upgrade", title:"武器を鍛える", badge:"STEP 4 / 強化",
      desc:"鍛冶屋で武器強化を2回行う。Lvだけでなく装備強化も火力に直結する。",
      type:"upgrade", targetId:"weapon", target:2,
      reward:{ gold:70, items:{ mushroom_grass:1 } },
      next:"kinokko_hunt"
    },
    {
      id:"kinokko_hunt", title:"キノっこ討伐", badge:"STEP 5 / 中間狩場",
      desc:"少し手ごわいキノっこを5体倒す。Lv4〜8あたりの主な経験値源にする。",
      type:"kill", targetId:"kinokko", target:5,
      reward:{ gold:110, items:{ mushroom_grass:3 } },
      next:"mushroom_material"
    },
    {
      id:"mushroom_material", title:"きのこ草を集めよう", badge:"STEP 6 / 装備素材",
      desc:"きのこ草を6個集める。メイジ装備や中盤手前の装備作成に使える。",
      type:"item", targetId:"mushroom_grass", target:6,
      reward:{ gold:95, items:{ herb:2 } },
      next:"level_10_goal"
    },
    {
      id:"level_10_goal", title:"Lv10を目指す", badge:"STEP 7 / 育成目標",
      desc:"Lv10まで育てる。キノっこ狩り、装備作成、武器強化を回してモコホーンに備えよう。",
      type:"level", targetId:"level", target:10,
      reward:{ gold:150, items:{ moco_fur:1 } },
      next:"moco_challenge"
    },
    {
      id:"moco_challenge", title:"モコホーンへの挑戦", badge:"STEP 8 / Lv10推奨",
      desc:"強敵モコホーンを1体倒す。Lv10前後、装備強化後の最初の壁として挑もう。",
      type:"kill", targetId:"moco_horn", target:1,
      reward:{ gold:260, items:{ moco_fur:3, moco_horn_piece:1 } }
    }
  ];

  const QUEST_MAP = Object.fromEntries(QUEST_DEFS.map(q => [q.id, q]));

  const baseSave = {
    level:1,
    exp:0,
    gold:0,
    hp:100,
    sp:50,
    map:"village",
    unlockedAreas:{ village:true, field:true, cave:false },
    inventory:{ herb:3 },
    ownedEquip:{ wood_sword:true, traveler_cloth:true, cloth_cap:true },
    equipment:{ weapon:"wood_sword", head:"cloth_cap", body:"traveler_cloth", shield:null, back:null, accessory:null },
    currentJob:"ファイター",
    jobLevels:{ fighter:1, mage:1, thief:1, priest:1 },
    weaponLevel:1,
    stats: emptyStats(),
    statPoints:0,
    quests:{
      puru_hunt:{ status:"none", progress:0, target:3 },
      jelly_collect:{ status:"locked", progress:0, target:4 },
      first_craft:{ status:"locked", progress:0, target:1 },
      weapon_upgrade:{ status:"locked", progress:0, target:2 },
      kinokko_hunt:{ status:"locked", progress:0, target:5 },
      mushroom_material:{ status:"locked", progress:0, target:6 },
      level_10_goal:{ status:"locked", progress:1, target:10 },
      moco_challenge:{ status:"locked", progress:0, target:1 }
    }
  };

  let save = loadSave();

  const game = {
    w:390, h:720, dpr:1,
    map:"village",
    worldW:980,
    worldH:760,
    camX:0, camY:0,
    time:0,
    running:false,
    p:null,
    enemies:[],
    drops:[],
    texts:[],
    particles:[],
    attackFx:[],
    attackCooldown:0,
    skillCooldown:0,
    spawnTimer:0,
    shake:0,
    shakeX:0,
    shakeY:0,
    sit:false,
    keys:new Set()
  };

  const input = { x:0, y:0, id:null, active:false };
  const GESTURE_LONG_PRESS_MS = 460;
  const GESTURE_TAP_SLOP = 12;
  const GESTURE_FLICK_MIN = 46;
  const gesture = {
    active:false,
    aiming:false,
    pointerId:null,
    timer:null,
    startX:0,
    startY:0,
    currentX:0,
    currentY:0,
    startWorld:null,
    startEnemy:null,
    startVillageObject:null,
    tapCanceled:false,
    source:"",
    blockedReason:"",
    lastResult:"idle"
  };
  const inputDebug = {
    visible:false,
    state:"idle",
    tap:"-",
    longPress:"-",
    flickDist:0,
    flickAngle:0,
    result:"idle"
  };
  let raf = 0;
  let last = 0;
  let toastTimer = 0;

  function normalizeSave(data){
    const base = structuredClone(baseSave);
    const merged = { ...base, ...(data || {}) };
    merged.inventory = { ...base.inventory, ...(data?.inventory || {}) };
    merged.ownedEquip = { ...base.ownedEquip, ...(data?.ownedEquip || {}) };
    merged.equipment = { ...base.equipment, ...(data?.equipment || {}) };
    for(const id of Object.values(merged.equipment)){ if(id) merged.ownedEquip[id] = true; }
    merged.unlockedAreas = { ...base.unlockedAreas, ...(data?.unlockedAreas || {}) };
    merged.unlockedAreas.village = true;
    merged.unlockedAreas.field = true;
    merged.jobLevels = { ...base.jobLevels, ...(data?.jobLevels || {}) };
    merged.stats = { ...emptyStats(), ...(data?.stats || {}) };
    for(const key of STAT_KEYS){
      merged.stats[key] = Math.max(0, Math.floor(Number(merged.stats[key]) || 0));
    }
    const spent = STAT_KEYS.reduce((sum,key)=>sum + (merged.stats[key] || 0), 0);
    const earned = Math.max(0, ((Number(merged.level) || 1) - 1) * 3);
    merged.statPoints = Number.isFinite(data?.statPoints) ? Math.max(0, Math.floor(data.statPoints)) : Math.max(0, earned - spent);
    merged.quests = { ...base.quests, ...(data?.quests || {}) };
    for(const def of QUEST_DEFS){
      merged.quests[def.id] = { ...base.quests[def.id], ...(data?.quests?.[def.id] || {}) };
      merged.quests[def.id].target = def.target;
    }
    if(merged.quests?.moco_challenge?.status === "cleared") merged.unlockedAreas.cave = true;
    if(!Number.isFinite(merged.weaponLevel)) merged.weaponLevel = 1;
    return merged;
  }

  function loadSave(){
    try{
      const raw = localStorage.getItem(SAVE_KEY);
      if(!raw) return structuredClone(baseSave);
      return normalizeSave(JSON.parse(raw));
    }catch{
      return structuredClone(baseSave);
    }
  }

  function persist(){
    if(game.p){
      save.hp = Math.ceil(game.p.hp);
      save.sp = Math.ceil(game.p.sp);
      save.map = game.map;
    }
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  }

  function resetSave(){
    try{
      const keys = [];
      for(let i = 0; i < localStorage.length; i++){
        const key = localStorage.key(i);
        if(key && key.toLowerCase().includes("minialand")) keys.push(key);
      }
      keys.push(SAVE_KEY, "minialand_v03_save", "minialand_save");
      for(const key of [...new Set(keys)]){
        localStorage.removeItem(key);
      }
    }catch(_){}

    save = structuredClone(baseSave);
    try{
      localStorage.setItem(SAVE_KEY, JSON.stringify(save));
    }catch(_){}
    return save;
  }

  function closeTransientUi(){
    for(const id of ["bagOverlay","menuOverlay","facilityOverlay","worldMapOverlay"]){
      const el = $(id);
      if(el) el.classList.remove("show");
    }
    clearFacilityThemes();
    closeDialogue();
  }

  function clearFacilityThemes(){
    const overlay = $("facilityOverlay");
    if(!overlay) return;
    overlay.classList.remove("job-facility-overlay", "status-facility-overlay", "equip-facility-overlay", "quest-facility-overlay", "shop-facility-overlay", "smith-facility-overlay");
  }

  function setFacilityJobTheme(enabled){
    const overlay = $("facilityOverlay");
    if(!overlay) return;
    overlay.classList.remove("status-facility-overlay", "equip-facility-overlay", "quest-facility-overlay", "shop-facility-overlay", "smith-facility-overlay");
    overlay.classList.toggle("job-facility-overlay", !!enabled);
  }

  function setFacilityStatusTheme(enabled){
    const overlay = $("facilityOverlay");
    if(!overlay) return;
    overlay.classList.remove("job-facility-overlay", "equip-facility-overlay", "quest-facility-overlay", "shop-facility-overlay", "smith-facility-overlay");
    overlay.classList.toggle("status-facility-overlay", !!enabled);
  }

  function setFacilityEquipTheme(enabled){
    const overlay = $("facilityOverlay");
    if(!overlay) return;
    overlay.classList.remove("job-facility-overlay", "status-facility-overlay", "quest-facility-overlay", "shop-facility-overlay", "smith-facility-overlay");
    overlay.classList.toggle("equip-facility-overlay", !!enabled);
  }

  function setFacilityQuestTheme(enabled){
    const overlay = $("facilityOverlay");
    if(!overlay) return;
    overlay.classList.remove("job-facility-overlay", "status-facility-overlay", "equip-facility-overlay", "shop-facility-overlay", "smith-facility-overlay");
    overlay.classList.toggle("quest-facility-overlay", !!enabled);
  }

  function setFacilityShopTheme(enabled){
    const overlay = $("facilityOverlay");
    if(!overlay) return;
    overlay.classList.remove("job-facility-overlay", "status-facility-overlay", "equip-facility-overlay", "quest-facility-overlay", "smith-facility-overlay");
    overlay.classList.toggle("shop-facility-overlay", !!enabled);
  }

  function setFacilitySmithTheme(enabled){
    const overlay = $("facilityOverlay");
    if(!overlay) return;
    overlay.classList.remove("job-facility-overlay", "status-facility-overlay", "equip-facility-overlay", "quest-facility-overlay", "shop-facility-overlay");
    overlay.classList.toggle("smith-facility-overlay", !!enabled);
  }

  function resetRuntimeState(){
    game.enemies = [];
    game.drops = [];
    game.texts = [];
    game.particles = [];
    game.attackFx = [];
    game.attackCooldown = 0;
    game.skillCooldown = 0;
    game.shake = 0;
    game.shakeX = 0;
    game.shakeY = 0;
    game.sit = false;
    game.god = false;
    game.devEquipmentPreview = false;
    game.keys.clear();
    input.x = 0;
    input.y = 0;
    input.id = null;
    input.active = false;
    if(knob) knob.style.transform = "translate(0,0)";
  }

  function currentJob(){
    return Object.values(JOBS).find(j => j.name === save.currentJob) || JOBS.fighter;
  }
  function jobNameById(id){
    return JOBS[id]?.name || FUTURE_JOB_NAMES[id] || id;
  }
  function equipJobText(e){
    if(!e?.allowedJobs?.length) return "共通";
    return e.allowedJobs.map(jobNameById).join(" / ");
  }

  function jobDataById(id){
    return JOBS[id] || {
      id,
      name:jobNameById(id),
      icon:(JOB_TREE_TIERS.flatMap(t=>t.jobs).find(j=>j.id===id)?.icon || "？"),
      type:"未実装",
      summary:"今後実装予定の職業です。",
      attackName:"未実装",
      skillName:"未実装",
      skillCost:0,
      skillCooldown:0,
      range:0,
      cooldown:0,
      cost:0
    };
  }

  function jobLevelText(id){
    if(JOBS[id]) return `Lv${save.jobLevels?.[id] || 1}`;
    return "Lv--";
  }

  function jobUnlockState(entry){
    if(JOBS[entry.id]) return "selectable";
    return "future";
  }

  function jobStateLabel(entry){
    const state = jobUnlockState(entry);
    if(state === "selectable") return save.currentJob === jobDataById(entry.id).name ? "現在" : "転職可";
    if(entry.id === "pet_raiser") return "未実装";
    return "未解放";
  }

  function jobRequirementText(entry){
    if(JOBS[entry.id]) return entry.req || "選択可能";
    return entry.req || "未実装";
  }
  function canEquipForCurrentJob(e){
    if(game.devEquipmentPreview && e?.id === "flame_greatsword") return true;
    if(!e?.allowedJobs?.length) return true;
    return e.allowedJobs.includes(currentJob().id);
  }
  function fallbackEquipmentForCurrentJob(){
    const jobId = currentJob().id;
    return {
      weapon: jobId === "fighter" ? "wood_sword" : null,
      body:"traveler_cloth",
      head:"cloth_cap"
    };
  }
  function ensureCurrentJobEquipment(){
    const fallback = fallbackEquipmentForCurrentJob();
    save.equipment = save.equipment || {};
    save.ownedEquip = save.ownedEquip || {};
    for(const [slot,id] of Object.entries(save.equipment)){
      if(!id) continue;
      const e = EQUIPMENT[id];
      if(e && canEquipForCurrentJob(e)) continue;
      save.equipment[slot] = fallback[slot] || null;
      if(fallback[slot]) save.ownedEquip[fallback[slot]] = true;
    }
  }
  function equipStats(){
    ensureCurrentJobEquipment();
    const result = { atk:0, hp:0, sp:0, speed:0 };
    const equips = save.equipment || {};
    for(const id of Object.values(equips)){
      const e = EQUIPMENT[id];
      if(!e) continue;
      result.atk += e.atk || 0;
      result.hp += e.hp || 0;
      result.sp += e.sp || 0;
      result.speed += e.speed || 0;
    }
    return result;
  }
  function statSpent(){
    save.stats = { ...emptyStats(), ...(save.stats || {}) };
    return STAT_KEYS.reduce((sum,key)=>sum + Math.max(0, Math.floor(save.stats[key] || 0)), 0);
  }
  function statEarned(){
    return Math.max(0, (save.level - 1) * 3);
  }
  function availableStatPoints(){
    save.statPoints = Math.max(0, Math.floor(Number(save.statPoints) || 0));
    return save.statPoints;
  }
  function statValue(key){
    save.stats = { ...emptyStats(), ...(save.stats || {}) };
    // 表示上は基礎1 + 振った値。振りなしでもキャラに最低能力があるようにする。
    return 1 + Math.max(0, Math.floor(save.stats[key] || 0));
  }
  function statSummaryText(){
    return STAT_KEYS.map(k => `${STAT_META[k].label}${statValue(k)}`).join(" / ");
  }
  function equipDerivedStats(){
    const es = equipStats();
    return {
      atk: es.atk || 0,
      hp: es.hp || 0,
      sp: es.sp || 0,
      speed: es.speed || 0
    };
  }
  function maxHp(){
    const es = equipDerivedStats();
    const vit = statValue("vit");
    return Math.max(1, Math.round((100 + (save.level - 1) * 18 + vit * 8 + es.hp) * currentJob().hpRate));
  }
  function maxSp(){
    const es = equipDerivedStats();
    const intv = statValue("int");
    return Math.max(1, Math.round((50 + (save.level - 1) * 7 + intv * 5 + es.sp) * currentJob().spRate));
  }
  function atk(){
    const es = equipDerivedStats();
    const pow = statValue("pow");
    // POWは基礎ATK。武器強化と装備補正を足して、最後に職業補正をかける。
    return Math.max(1, Math.round((8 + (save.level - 1) * 3 + (save.weaponLevel - 1) * 5 + pow * 3 + es.atk) * currentJob().atkRate));
  }
  function mat(){
    const es = equipDerivedStats();
    const intv = statValue("int");
    // MATはINT中心。杖系装備のATK/SP補正も少し魔法火力に寄与させる。
    return Math.max(1, Math.round(6 + (save.level - 1) * 3 + intv * 3 + es.atk * .7 + es.sp * .45));
  }
  function def(){
    const es = equipDerivedStats();
    const vit = statValue("vit");
    return Math.max(0, Math.round(3 + (save.level - 1) * 1.6 + vit * 2 + es.hp * .18));
  }
  function mdf(){
    const es = equipDerivedStats();
    const intv = statValue("int");
    return Math.max(0, Math.round(3 + (save.level - 1) * 1.4 + intv * 3 + es.sp * .25));
  }
  function playerSpeed(){
    const es = equipDerivedStats();
    const spd = statValue("spd");
    return Math.max(70, Math.round(118 * currentJob().speedRate + es.speed + spd));
  }
  function attackCooldown(job=currentJob()){
    const spd = statValue("spd");
    const reduction = Math.min(.16, spd * .0035);
    return Math.max(.18, (job.cooldown || .45) - reduction);
  }
  function critRate(){
    const luk = statValue("luk");
    return clamp(.03 + luk * .004, .03, .35);
  }
  function rareBonusRate(){
    const luk = statValue("luk");
    return clamp(luk * .002, 0, .25);
  }
  function derivedStatBlock(){
    return {
      HP:maxHp(), SP:maxSp(), ATK:atk(), MAT:mat(), DEF:def(), MDF:mdf(), MOV:playerSpeed(),
      CRI:Math.round(critRate()*1000)/10,
      RARE:Math.round(rareBonusRate()*1000)/10
    };
  }
  function rollDamage(base){
    if(Math.random() < critRate()){
      return { dmg:Math.max(1, Math.round(base * 1.55)), crit:true };
    }
    return { dmg:Math.max(1, Math.round(base)), crit:false };
  }

  function skillReady(){
    const job = currentJob();
    if(!game.p) return false;
    if(!hasJobSkill(job)) return false;
    if((game.skillCooldown || 0) > 0) return false;
    if(game.p.sp < (job.skillCost || 0)) return false;
    return true;
  }

  function hasJobSkill(job=currentJob()){
    return job.id === "fighter" || job.id === "mage" || job.id === "priest";
  }

  function skillShortLabel(job=currentJob()){
    if(job.id === "fighter") return "斬";
    if(job.id === "mage") return "火";
    if(job.id === "priest") return "癒";
    return "-";
  }

  function skillStatusText(){
    const job = currentJob();
    if(!hasJobSkill(job)) return "準備中";
    if(!game.p) return job.skillName || "技";
    if(game.p.sp < (job.skillCost || 0)) return "SP不足";
    if((game.skillCooldown || 0) > 0) return `CT ${game.skillCooldown.toFixed(1)}s`;
    return "使用可能";
  }
  function needExp(level=save.level){
    const lv = Math.max(1, Number(level) || 1);

    // v0.6.6.3: チョコットランド寄りに少し重め。
    // Lv1〜5: まだ上がる実感を残す
    // Lv6〜10: モコホーン挑戦まで周回が必要
    // Lv10以降: 装備強化や強敵狩りも絡める前提
    if(lv <= 5){
      return Math.round(38 + (lv - 1) * 34 + Math.pow(lv - 1, 1.35) * 10);
    }
    if(lv <= 10){
      return Math.round(245 + (lv - 5) * 92 + Math.pow(lv - 5, 1.65) * 32);
    }
    return Math.round(1200 + (lv - 10) * 190 + Math.pow(lv - 10, 1.75) * 60);
  }

  function expToNext(){
    return Math.max(0, needExp() - save.exp);
  }
  function quest(id="puru_hunt"){
    save.quests = save.quests || structuredClone(baseSave.quests);
    const def = QUEST_MAP[id] || QUEST_DEFS[0];
    save.quests[def.id] = { ...baseSave.quests[def.id], ...(save.quests[def.id] || {}), target:def.target };
    return save.quests[def.id];
  }
  function questLabel(q=quest()){
    if(q.status === "none") return "未受注";
    if(q.status === "accepted") return `進行中 ${q.progress}/${q.target}`;
    if(q.status === "complete") return "報告可能";
    if(q.status === "cleared") return "達成済み";
    if(q.status === "locked") return "未解放";
    return "未受注";
  }

  function currentGuideQuest(){
    for(const def of QUEST_DEFS){
      const q = quest(def.id);
      if(q.status !== "cleared") return { def, q };
    }
    return { def:QUEST_DEFS[QUEST_DEFS.length - 1], q:quest(QUEST_DEFS[QUEST_DEFS.length - 1].id) };
  }

  function loopStageInfo(){
    const guide = currentGuideQuest();
    const q = guide.q;
    const pct = guide.def.target ? Math.round(clamp((q.progress || 0) / guide.def.target * 100, 0, 100)) : 0;
    let action = "掲示板で依頼を受けて、草原で狩りと素材集めを進めよう。";

    if(q.status === "locked") action = "前の依頼を報告すると解放されます。";
    else if(q.status === "none") action = "まず掲示板でこの依頼を受注しましょう。";
    else if(q.status === "complete") action = "達成済みです。掲示板で報告して次の目標へ進みましょう。";
    else if(guide.def.id === "puru_hunt") action = "草原でぷるスライムを倒して、基本操作と戦闘に慣れましょう。";
    else if(guide.def.id === "jelly_collect") action = "ぷるスライムを倒したら、落ちたぷるゼリーを拾いましょう。";
    else if(guide.def.id === "first_craft") action = "鍛冶屋で作れそうな装備を1つ作りましょう。素材が足りなければ草原へ。";
    else if(guide.def.id === "weapon_upgrade") action = "鍛冶屋で武器を強化しましょう。攻撃力が上がると狩り効率が良くなります。";
    else if(guide.def.id === "kinokko_hunt") action = "キノっこ中心に狩りましょう。ぷるスライムより経験値効率が良い敵です。";
    else if(guide.def.id === "mushroom_material") action = "キノっこを狩って、きのこ草を集めましょう。メイジ装備や杖作りにも使えます。";
    else if(guide.def.id === "level_10_goal") action = "Lv10まではキノっこ狩り、装備作成、武器強化を回すのがおすすめです。";
    else if(guide.def.id === "moco_challenge") action = "モコホーンは北奥に最大1体だけ湧くLv10推奨強敵。中央でキノっこ狩りをしてから挑みましょう。";

    return { guide, pct, action };
  }

  function growthLoopSummary(){
    const hasCrafted = Object.keys(save.ownedEquip || {}).filter(id => !["wood_sword","traveler_cloth","cloth_cap"].includes(id)).length;
    const weaponLv = save.weaponLevel || 1;
    const moco = quest("moco_challenge");
    if(moco.status === "cleared") return "序盤の壁突破済み。ワールドマップからこけの洞窟へ行けます。";
    if(save.level < 4) return "ぷるスライムで操作練習 → ぷるゼリー集め → 初装備作成。";
    if(hasCrafted < 1 || weaponLv < 3) return "素材で装備を作り、武器をLv3以上に強化するのが次の軸です。";
    if(save.level < 10) return "キノっこ狩りでLv10を目指し、モコホーン挑戦の準備を進めましょう。";
    return "Lv10到達。モコホーンを倒して序盤の壁を越える段階です。";
  }

  function rewardText(reward={}){
    const parts = [];
    if(reward.gold) parts.push(`${reward.gold}G`);
    for(const [id,count] of Object.entries(reward.items || {})){
      parts.push(`${ITEMS[id]?.name || id}×${count}`);
    }
    return parts.join("、") || "なし";
  }

  function grantQuestReward(reward={}){
    if(reward.gold) save.gold += reward.gold;
    for(const [id,count] of Object.entries(reward.items || {})){
      addItem(id, count);
    }
  }

  function updateQuestProgress(type, targetId, count=1){
    let changed = false;
    for(const def of QUEST_DEFS){
      const q = quest(def.id);
      if(q.status !== "accepted" || def.type !== type) continue;
      if(def.targetId !== "any" && def.targetId !== targetId) continue;

      const before = q.progress || 0;
      if(type === "level"){
        q.progress = Math.min(def.target, Math.max(q.progress || 0, count));
      }else{
        q.progress = Math.min(def.target, (q.progress || 0) + count);
      }
      if(q.progress === before && q.status !== "complete") continue;

      changed = true;
      if(q.progress >= def.target){
        q.status = "complete";
        toast(`${def.title}達成！村の掲示板へ戻ろう`);
      }else{
        toast(`${def.title} ${q.progress}/${def.target}`);
      }
    }
    if(changed){
      persist();
      syncUI();
    }
  }

  function addExp(v){
    save.exp += v;
    let up = 0;
    while(save.exp >= needExp()){
      save.exp -= needExp();
      save.level++;
      up++;
    }
    if(up > 0){
      save.statPoints = (save.statPoints || 0) + up * 3;
      updateQuestProgress("level", "level", save.level);
      const hpGain = 18 * up;
      const spGain = 7 * up;
      if(game.p){
        game.p.maxHp = maxHp();
        game.p.maxSp = maxSp();
        game.p.hp = Math.min(game.p.maxHp, game.p.hp + hpGain);
        game.p.sp = Math.min(game.p.maxSp, game.p.sp + spGain);
      }
      toast(`レベルアップ！ Lv.${save.level}`);
      burst(game.p.x, game.p.y, 22, "level");
    }
  }

  function addItem(id, count=1){
    save.inventory[id] = (save.inventory[id] || 0) + count;
  }

  function allocateStat(key){
    if(!STAT_KEYS.includes(key)) return;
    if(availableStatPoints() <= 0){
      toast("ステータスポイントがありません");
      return;
    }
    save.stats = { ...emptyStats(), ...(save.stats || {}) };
    save.stats[key]++;
    save.statPoints--;
    refreshPlayerStatsKeepingRatio();
    persist();
    renderStatusScreen();
    syncUI();
    toast(`${STAT_META[key].label} +1`);
  }

  function resetStats(){
    save.stats = emptyStats();
    save.statPoints = statEarned();
    refreshPlayerStatsKeepingRatio(true);
    persist();
    renderStatusScreen();
    syncUI();
    toast("ステータスを振り直しました");
  }

  function refreshPlayerStatsKeepingRatio(refill=false){
    if(!game.p) return;
    const hpRate = game.p.maxHp ? clamp(game.p.hp / game.p.maxHp, .05, 1) : 1;
    const spRate = game.p.maxSp ? clamp(game.p.sp / game.p.maxSp, 0, 1) : 1;
    game.p.maxHp = maxHp();
    game.p.maxSp = maxSp();
    game.p.hp = refill ? game.p.maxHp : Math.max(1, Math.round(game.p.maxHp * hpRate));
    game.p.sp = refill ? game.p.maxSp : Math.round(game.p.maxSp * spRate);
    game.p.speed = playerSpeed();
  }

  function statRecommendText(){
    const job = currentJob().id;
    if(job === "fighter") return "おすすめ：POWで火力、VITで耐久。モコホーン挑戦前はVITも有効。";
    if(job === "mage") return "おすすめ：INTでファイアボルト火力とSP、VITで事故防止。";
    if(job === "priest") return "おすすめ：INTでヒール回復量とSP、VITで耐久。ソロならVITも重要。";
    if(job === "thief") return "おすすめ：SPDで手数、LUKで素材集め、POWで最低火力。";
    return "おすすめ：職業に合わせて主力ステータスを伸ばしましょう。";
  }


  function renderStatusScreen(){
    setFacilityStatusTheme(true);
    $("facilityTitle").innerHTML = "Character <small>ステータス</small>";
    const box = $("facilityContent");
    const d = derivedStatBlock();
    const hpNow = game.p ? Math.max(0, Math.round(game.p.hp)) : d.HP;
    const spNow = game.p ? Math.max(0, Math.round(game.p.sp)) : d.SP;
    const expNeed = Math.max(1, needExp());
    const expPct = clamp((save.exp || 0) / expNeed * 100, 0, 100);
    const hpPct = clamp(hpNow / Math.max(1, d.HP) * 100, 0, 100);
    const spPct = clamp(spNow / Math.max(1, d.SP) * 100, 0, 100);
    const job = currentJob();
    const slotCols = [
      [
        { slot:"head", label:"頭" },
        { slot:"back", label:"背" },
        { slot:"body", label:"服" }
      ],
      [
        { slot:"weapon", label:"武" },
        { slot:"shield", label:"盾" },
        { slot:"accessory", label:"飾" }
      ]
    ];
    function slotCard(def){
      const id = save.equipment?.[def.slot];
      const equip = id ? EQUIPMENT[id] : null;
      return `<button class="status-slot-card" data-slot="${def.slot}"><b>${def.label}</b><small>${equip ? equip.name : '未装備'}</small></button>`;
    }
    const summaryTop = [
      {label:"HP", value:`${hpNow}/${d.HP}`},
      {label:"SP", value:`${spNow}/${d.SP}`},
      {label:"EXP", value:`${Math.round(expPct)}%`},
      {label:"CRI", value:`${d.CRI}%`},
      {label:"RARE", value:`+${d.RARE}%`}
    ];
    const summaryBottom = [
      {label:"ATK", value:d.ATK},
      {label:"MAT", value:d.MAT},
      {label:"DEF", value:d.DEF},
      {label:"MDF", value:d.MDF},
      {label:"MOV", value:d.MOV}
    ];
    box.innerHTML = `
      <div class="status-mmo-window">
        <div class="status-mini-tabs">
          <span class="status-mini-tab active">ステータス</span>
          <span class="status-mini-tab">コーデ</span>
          <span class="status-mini-tab">サブ</span>
          <span class="status-mini-logo">マネキン</span>
        </div>

        <div class="status-mainbox">
          <div class="status-page-title"><b>Character</b><span>冒険者情報を確認してください。</span></div>

          <div class="status-main-grid">
            <div class="status-leftbox">
              <div class="status-equip-layout">
                <div class="status-slot-column">
                  ${slotCols[0].map(slotCard).join("")}
                </div>
                <div class="status-character-panel">
                  <div class="status-character-frame"><img src="assets/characters/player_default_pose.png" alt="player" /></div>
                  <div class="status-character-name">${job.name}<small>Lv ${save.level} / ${job.type}</small></div>
                  <div class="status-mini-actions-row">
                    <button id="openEquipFromStatusBtn" class="green">装備</button>
                    <button id="statusDetailToggleBtn" class="blue">ふりわけ</button>
                  </div>
                </div>
                <div class="status-slot-column">
                  ${slotCols[1].map(slotCard).join("")}
                </div>
              </div>
            </div>

            <div class="status-rightbox">
              <div class="status-points-box">残りステータスポイント ${availableStatPoints()}pt</div>
              <div class="status-stat-head"><span></span><span>キャラ</span><span>装備</span></div>
              <div class="status-compact-rows">
                ${STAT_KEYS.map(key => {
                  const meta = STAT_META[key];
                  return `<div class="status-compact-row"><b>${meta.label}</b><span>${statValue(key)}</span><span>0</span></div>`;
                }).join("")}
              </div>
            </div>
          </div>

          <div class="status-summary-grid">
            ${summaryTop.map(item => `<div class="status-summary-cell"><b>${item.label}</b><span>${item.value}</span></div>`).join("")}
          </div>
          <div class="status-summary-grid">
            ${summaryBottom.map(item => `<div class="status-summary-cell"><b>${item.label}</b><span>${item.value}</span></div>`).join("")}
          </div>

          <div id="statusDetailPanel" class="status-detail-panel">
            <div class="status-guide-line">参考画像寄せの見た目を優先しつつ、詳細なステ振りと最終能力は下で調整できます。</div>

            <div class="status-current-summary">
              <div class="status-profile-main">
                <span class="status-face">${job.icon || "ST"}</span>
                <div>
                  <b>Lv.${save.level} / ${job.name}</b>
                  <small>${job.type} / ${job.summary}</small>
                </div>
                <em>残り ${availableStatPoints()}pt</em>
              </div>
              <div class="status-meter-list">
                <div class="status-meter-row"><span>EXP</span><i><b style="width:${expPct}%"></b></i><em>${save.exp || 0}/${expNeed}</em></div>
                <div class="status-meter-row"><span>HP</span><i><b style="width:${hpPct}%"></b></i><em>${hpNow}/${d.HP}</em></div>
                <div class="status-meter-row"><span>SP</span><i><b style="width:${spPct}%"></b></i><em>${spNow}/${d.SP}</em></div>
              </div>
              <div class="status-advice">${statRecommendText()}</div>
            </div>

            <div class="status-board">
              <div class="status-section-title"><b>ステータス振り分け</b><span>LvUPごとに +3pt</span></div>
              <div class="status-build-grid">
                ${STAT_KEYS.map(key => {
                  const meta = STAT_META[key];
                  return `
                    <div class="stat-build-row status-stat-${key}">
                      <div class="status-stat-name">
                        <b>${meta.label}</b>
                        <span>${statValue(key)}</span>
                      </div>
                      <div class="status-stat-detail">
                        <strong>${meta.name}</strong>
                        <small>${meta.desc}<br>向き：${meta.rec}</small>
                      </div>
                      <button id="statPlus_${key}" class="green" ${availableStatPoints() <= 0 ? "disabled" : ""}>+1</button>
                    </div>`;
                }).join("")}
              </div>
            </div>

            <div class="status-board">
              <div class="status-section-title"><b>最終ステータス</b><span>装備・職業込み</span></div>
              <div class="final-stat-grid">
                <div><b>HP</b><span>${d.HP}</span></div><div><b>SP</b><span>${d.SP}</span></div>
                <div><b>ATK</b><span>${d.ATK}</span></div><div><b>MAT</b><span>${d.MAT}</span></div>
                <div><b>DEF</b><span>${d.DEF}</span></div><div><b>MDF</b><span>${d.MDF}</span></div>
                <div><b>MOV</b><span>${d.MOV}</span></div><div><b>CRI</b><span>${d.CRI}%</span></div>
                <div><b>RARE</b><span>+${d.RARE}%</span></div><div><b>未使用</b><span>${availableStatPoints()}pt</span></div>
              </div>
            </div>

            <div class="status-note-box">
              <b>振り直し</b>
              <span>調整中は無料で振り直せます。将来的には振り直しアイテム制にできます。</span>
              <button id="statResetBtn" class="red">リセット</button>
            </div>
          </div>
        </div>
      </div>`;

    setTimeout(()=>{
      document.querySelectorAll('.status-slot-card[data-slot]').forEach(el => {
        el.onclick = () => renderEquipmentScreen(el.dataset.slot || null);
      });
      const equipBtn = $("openEquipFromStatusBtn");
      if(equipBtn) equipBtn.onclick = openEquipmentScreen;
      const detailBtn = $("statusDetailToggleBtn");
      const detailPanel = $("statusDetailPanel");
      if(detailBtn && detailPanel){
        detailBtn.onclick = () => {
          detailPanel.classList.toggle('show');
          detailBtn.textContent = detailPanel.classList.contains('show') ? 'とじる' : 'ふりわけ';
        };
      }
      for(const key of STAT_KEYS){
        const btn = $("statPlus_" + key);
        if(btn) btn.onclick = () => allocateStat(key);
      }
      const reset = $("statResetBtn");
      if(reset) reset.onclick = resetStats;
    },0);
    $("facilityOverlay").classList.add("show");
  }


  function openStatusScreen(){
    const menu = $("menuOverlay");
    const bag = $("bagOverlay");
    if(menu) menu.classList.remove("show");
    if(bag) bag.classList.remove("show");
    renderStatusScreen();
  }

  function setTestLevel(level){
    level = Math.max(1, Math.floor(Number(level) || 1));
    save.level = level;
    save.exp = 0;
    save.statPoints = Math.max(0, statEarned() - statSpent());
    updateQuestProgress("level", "level", save.level);
    refreshPlayerStatsKeepingRatio(true);
    persist();
    syncUI();
    renderTestPanel();
    toast(`Lv${level}に設定しました`);
  }

  function addTestStatPoints(n=30){
    save.statPoints = (save.statPoints || 0) + n;
    persist();
    syncUI();
    renderTestPanel();
    toast(`ステータスポイント +${n}`);
  }

  function addTestKit(){
    save.gold += 500;
    addItem("herb", 20);
    addItem("puru_jelly", 20);
    addItem("mushroom_grass", 20);
    addItem("moco_fur", 10);
    addItem("puru_core", 3);
    addItem("red_cap", 3);
    addItem("moco_horn_piece", 2);
    persist();
    syncUI();
    renderTestPanel();
    toast("テスト素材セットを追加しました");
  }

  function refillPlayer(){
    if(game.p){
      game.p.maxHp = maxHp();
      game.p.maxSp = maxSp();
      game.p.hp = game.p.maxHp;
      game.p.sp = game.p.maxSp;
      game.p.speed = playerSpeed();
    }
    syncUI();
    renderTestPanel();
    toast("HP/SPを全回復しました");
  }

  function clearFieldForTest(){
    game.enemies = [];
    game.drops = [];
    game.texts = [];
    game.particles = [];
    game.attackFx = [];
    game.attackCooldown = 0;
    game.skillCooldown = 0;
    syncUI();
    renderTestPanel();
    toast("敵とドロップを消しました");
  }

  function spawnTestEnemy(id){
    if(game.map !== "field") switchMap("field");
    const data = MONSTERS[id];
    if(!data || !game.p) return;

    if(id === "moco_horn"){
      game.enemies = game.enemies.filter(e => e.id !== "moco_horn");
    }

    const angle = game.p.face || -Math.PI/2;
    const dist = id === "moco_horn" ? 115 : 82;
    const x = clamp(game.p.x + Math.cos(angle) * dist, 70, game.worldW - 70);
    const y = clamp(game.p.y + Math.sin(angle) * dist, 90, game.worldH - 80);
    const levelBonus = Math.max(0, save.level - 1);
    const hpBonus = id === "moco_horn" ? 3 : id === "puru_slime" ? 4 : 5;
    const hp = Math.round(data.hp + levelBonus * hpBonus);

    game.enemies.push({
      ...data,
      zone:"test",
      x,y,
      hp,
      maxHp: hp,
      atk: Math.round((data.atk + levelBonus * (id === "moco_horn" ? .75 : 1.1)) * 10) / 10,
      r:data.r,
      hitCd:1.2,
      hurt:0,
      squash:0,
      knockX:0,
      knockY:0,
      warned:false,
      wander:0,
      wanderTimer:999
    });
    syncUI();
    renderTestPanel();
    toast(`${data.name}を出しました`);
  }

  function applyStatPreset(type){
    save.stats = emptyStats();
    const points = Math.max(0, statEarned() + (save.statPoints || 0));
    const set = (key, val) => { save.stats[key] = Math.max(0, Math.floor(val)); };

    if(type === "fighterPow"){
      set("pow", Math.floor(points * .70));
      set("vit", Math.floor(points * .25));
      set("spd", points - statSpent());
    }else if(type === "fighterVit"){
      set("vit", Math.floor(points * .62));
      set("pow", Math.floor(points * .30));
      set("luk", points - statSpent());
    }else if(type === "mageInt"){
      set("int", Math.floor(points * .78));
      set("vit", Math.floor(points * .18));
      set("luk", points - statSpent());
    }else if(type === "priestHeal"){
      set("int", Math.floor(points * .56));
      set("vit", Math.floor(points * .34));
      set("luk", points - statSpent());
    }else if(type === "luckFarm"){
      set("luk", Math.floor(points * .62));
      set("spd", Math.floor(points * .22));
      set("pow", points - statSpent());
    }
    save.statPoints = Math.max(0, points - statSpent());
    refreshPlayerStatsKeepingRatio(true);
    persist();
    syncUI();
    renderTestPanel();
    toast("ステ振りプリセットを適用しました");
  }

  function expectedHitsAgainst(id){
    const e = MONSTERS[id];
    if(!e) return "-";
    const lvBonus = Math.max(0, save.level - 1);
    const hpBonus = id === "moco_horn" ? 3 : id === "puru_slime" ? 4 : 5;
    const hp = Math.round(e.hp + lvBonus * hpBonus);
    const normal = Math.max(1, Math.ceil(hp / Math.max(1, atk())));
    const slashRate = id === "moco_horn" ? 1.38 : id === "kinokko" ? 1.75 : 2.18;
    const slash = Math.max(1, Math.ceil(hp / Math.max(1, atk() * slashRate)));
    const fireRate = id === "moco_horn" ? 1.45 : id === "kinokko" ? 1.75 : 2.05;
    const fire = Math.max(1, Math.ceil(hp / Math.max(1, mat() * fireRate)));
    return `HP${hp} / 通常${normal}発 / 斬${slash}発 / 火${fire}発`;
  }

  function renderTestPanel(){
    setFacilityJobTheme(false);
    $("facilityTitle").textContent = "テストツール";
    const d = derivedStatBlock();
    const box = $("facilityContent");
    box.innerHTML = `
      <div class="facility-row">
        <div class="row-head"><b>テスト状態</b><span class="quest-badge">調整用</span></div>
        <p>Lv${save.level} / ${currentJob().name} / G${save.gold} / 未使用pt ${availableStatPoints()}<br>
        ${statSummaryText()}<br>
        HP${d.HP} SP${d.SP} ATK${d.ATK} MAT${d.MAT} DEF${d.DEF} MDF${d.MDF} MOV${d.MOV} CRI${d.CRI}% RARE+${d.RARE}%</p>
      </div>

      <div class="facility-row">
        <div class="row-head"><b>レベル/回復</b><span class="quest-badge">即時変更</span></div>
        <div class="test-grid">
          <button id="testLv1" class="blue">Lv1</button>
          <button id="testLv5" class="blue">Lv5</button>
          <button id="testLv10" class="blue">Lv10</button>
          <button id="testLv15" class="blue">Lv15</button>
          <button id="testAddPts" class="green">+30pt</button>
          <button id="testRefill" class="green">全回復</button>
        </div>
      </div>

      <div class="facility-row">
        <div class="row-head"><b>ステ振りプリセット</b><span class="quest-badge">比較用</span></div>
        <div class="test-grid">
          <button id="presetFighterPow" class="green">ファイター火力</button>
          <button id="presetFighterVit" class="green">ファイター耐久</button>
          <button id="presetMageInt" class="green">メイジINT</button>
          <button id="presetPriestHeal" class="green">プリースト回復</button>
          <button id="presetLuckFarm" class="green">LUK素材</button>
        </div>
      </div>

      <div class="facility-row">
        <div class="row-head"><b>敵出現</b><span class="quest-badge">目の前に出す</span></div>
        <div class="test-grid">
          <button id="spawnPuru" class="blue">ぷる</button>
          <button id="spawnKinokko" class="blue">キノっこ</button>
          <button id="spawnMoco" class="red">モコ</button>
          <button id="clearField" class="red">敵/ドロップ消去</button>
        </div>
        <p>目安：ぷる ${expectedHitsAgainst("puru_slime")}<br>
        キノっこ ${expectedHitsAgainst("kinokko")}<br>
        モコホーン ${expectedHitsAgainst("moco_horn")}</p>
      </div>

      <div class="facility-row">
        <div class="row-head"><b>素材/初期化</b><span class="quest-badge">検証用</span></div>
        <div class="test-grid">
          <button id="testKit" class="green">素材セット</button>
          <button id="runAutoTestsBtn" class="blue">自動テスト実行</button>
          <button id="testOpenStatus" class="blue">ステ画面</button>
          <button id="testResetSave" class="red">セーブ初期化</button>
        </div>
        <p>テストツールはセーブに反映されます。検証後は必要ならセーブ初期化してください。</p>
      </div>`;
    $("facilityOverlay").classList.add("show");
    setTimeout(()=>{
      $("testLv1").onclick = () => setTestLevel(1);
      $("testLv5").onclick = () => setTestLevel(5);
      $("testLv10").onclick = () => setTestLevel(10);
      $("testLv15").onclick = () => setTestLevel(15);
      $("testAddPts").onclick = () => addTestStatPoints(30);
      $("testRefill").onclick = refillPlayer;
      $("presetFighterPow").onclick = () => applyStatPreset("fighterPow");
      $("presetFighterVit").onclick = () => applyStatPreset("fighterVit");
      $("presetMageInt").onclick = () => applyStatPreset("mageInt");
      $("presetPriestHeal").onclick = () => applyStatPreset("priestHeal");
      $("presetLuckFarm").onclick = () => applyStatPreset("luckFarm");
      $("spawnPuru").onclick = () => spawnTestEnemy("puru_slime");
      $("spawnKinokko").onclick = () => spawnTestEnemy("kinokko");
      $("spawnMoco").onclick = () => spawnTestEnemy("moco_horn");
      $("clearField").onclick = clearFieldForTest;
      $("testKit").onclick = addTestKit;
      $("runAutoTestsBtn").onclick = runAutoTests;
      $("testOpenStatus").onclick = renderStatusScreen;
      $("testResetSave").onclick = confirmReset;
    },0);
  }

  function openTestPanel(){
    renderTestPanel();
  }

  function snapshotForAutoTest(){
    return {
      save: structuredClone(save),
      game: {
        map: game.map,
        worldW: game.worldW,
        worldH: game.worldH,
        p: game.p ? structuredClone(game.p) : null,
        enemies: structuredClone(game.enemies || []),
        drops: structuredClone(game.drops || []),
        texts: structuredClone(game.texts || []),
        particles: structuredClone(game.particles || []),
        attackFx: structuredClone(game.attackFx || []),
        attackCooldown: game.attackCooldown || 0,
        skillCooldown: game.skillCooldown || 0,
        spawnTimer: game.spawnTimer || 0,
        shake: game.shake || 0,
        shakeX: game.shakeX || 0,
        shakeY: game.shakeY || 0,
        sit: !!game.sit,
        god: !!game.god
      }
    };
  }

  function restoreFromAutoTestSnapshot(snap){
    save = structuredClone(snap.save);
    game.map = snap.game.map;
    game.worldW = snap.game.worldW;
    game.worldH = snap.game.worldH;
    game.p = snap.game.p ? structuredClone(snap.game.p) : null;
    game.enemies = structuredClone(snap.game.enemies || []);
    game.drops = structuredClone(snap.game.drops || []);
    game.texts = structuredClone(snap.game.texts || []);
    game.particles = structuredClone(snap.game.particles || []);
    game.attackFx = structuredClone(snap.game.attackFx || []);
    game.attackCooldown = snap.game.attackCooldown || 0;
    game.skillCooldown = snap.game.skillCooldown || 0;
    game.spawnTimer = snap.game.spawnTimer || 0;
    game.shake = snap.game.shake || 0;
    game.shakeX = snap.game.shakeX || 0;
    game.shakeY = snap.game.shakeY || 0;
    game.sit = !!snap.game.sit;
    game.god = !!snap.game.god;
    persist();
    syncUI();
  }

  function autoAssert(name, condition, detail=""){
    return { name, ok:!!condition, detail };
  }

  function runAutoTests(){
    const snap = snapshotForAutoTest();
    const results = [];

    try{
      // テスト用の安全な初期化。実セーブは最後に復元する。
      save = normalizeSave(structuredClone(baseSave));
      game.map = "field";
      game.worldW = 1280;
      game.worldH = 980;
      game.p = {
        x:640,y:815,r:14,
        hp:100, sp:50,
        maxHp:maxHp(), maxSp:maxSp(),
        face:-Math.PI/2,
        spriteDir:"down",
        walkTime:0,
        moving:false,
        speed:playerSpeed(),
        inv:0,
        attackTimer:0,
        bob:0
      };
      game.enemies = [];
      game.drops = [];
      game.texts = [];
      game.particles = [];
      game.attackFx = [];
      game.attackCooldown = 0;
      game.skillCooldown = 0;
      game.spawnTimer = 0;
      game.shake = 0;
      game.shakeX = 0;
      game.shakeY = 0;

      // 1. セーブ初期状態
      results.push(autoAssert("初期Lvが1", save.level === 1, `Lv=${save.level}`));
      results.push(autoAssert("初期ステータスが0", STAT_KEYS.every(k => (save.stats?.[k] || 0) === 0), JSON.stringify(save.stats)));
      results.push(autoAssert("初期ステptが0", availableStatPoints() === 0, `pt=${availableStatPoints()}`));

      // 2. Lvアップとステpt
      addExp(9999);
      results.push(autoAssert("Lvアップでステpt付与", availableStatPoints() > 0, `Lv=${save.level} pt=${availableStatPoints()}`));
      const earned = statEarned();
      results.push(autoAssert("獲得pt計算がLv連動", earned === (save.level - 1) * 3, `earned=${earned}`));

      // 3. ステ振り効果
      const atkBefore = atk();
      const matBefore = mat();
      const hpBefore = maxHp();
      const rareBefore = rareBonusRate();
      save.statPoints += 20;
      allocateStat("pow");
      allocateStat("int");
      allocateStat("vit");
      allocateStat("luk");
      results.push(autoAssert("POWでATK上昇", atk() > atkBefore, `${atkBefore}→${atk()}`));
      results.push(autoAssert("INTでMAT上昇", mat() > matBefore, `${matBefore}→${mat()}`));
      results.push(autoAssert("VITでHP上昇", maxHp() > hpBefore, `${hpBefore}→${maxHp()}`));
      results.push(autoAssert("LUKでRARE上昇", rareBonusRate() > rareBefore, `${rareBefore}→${rareBonusRate()}`));

      // 4. スキル存在
      save.currentJob = "ファイター";
      results.push(autoAssert("ファイターにスキルあり", hasJobSkill(currentJob()), currentJob().name));
      save.currentJob = "メイジ";
      results.push(autoAssert("メイジにスキルあり", hasJobSkill(currentJob()), currentJob().name));
      save.currentJob = "プリースト";
      results.push(autoAssert("プリーストにスキルあり", hasJobSkill(currentJob()), currentJob().name));
      const healEstimate = priestHealAmount();
      results.push(autoAssert("ヒール回復量が正値", healEstimate > 0, `heal=${healEstimate}`));

      // 5. MAT参照がファイアボルト計算に使える
      const fireEstimate = Math.round(mat() * 1.75);
      results.push(autoAssert("ファイアボルト火力計算がMAT基準", fireEstimate > 0, `MAT=${mat()} estimate=${fireEstimate}`));

      // 6. モコホーン同時1体制限
      game.enemies = [{ id:"moco_horn" }];
      const northZone = FIELD_SPAWN_ZONES.find(z => z.id === "north_moco") || FIELD_SPAWN_ZONES[0];
      let mocoChosen = false;
      for(let i=0;i<25;i++){
        if(chooseSpawnId(northZone) === "moco_horn") mocoChosen = true;
      }
      results.push(autoAssert("モコホーンがいる時は追加候補から除外", !mocoChosen, `chosenMoco=${mocoChosen}`));

      // 7. スポーン補充
      game.enemies = [];
      maintainFieldSpawns(99);
      results.push(autoAssert("敵補充が動作", game.enemies.length > 0, `enemies=${game.enemies.length}`));
      results.push(autoAssert("敵数が目標を超えない", game.enemies.length <= FIELD_TARGET_ENEMY_COUNT, `enemies=${game.enemies.length} target=${FIELD_TARGET_ENEMY_COUNT}`));

      // 8. レアドロップ率の上限
      save.stats = { pow:0, int:0, spd:0, vit:0, luk:999 };
      results.push(autoAssert("RARE補正が上限内", rareBonusRate() <= .25, `rare=${rareBonusRate()}`));
      results.push(autoAssert("CRIが上限内", critRate() <= .35, `crit=${critRate()}`));

      // 9. 装備専用判定の存在
      results.push(autoAssert("炎の大剣データあり", !!EQUIPMENT.flame_greatsword, "flame_greatsword"));
      results.push(autoAssert("炎の大剣画像lookあり", !!weaponLook("flame_greatsword")?.img, weaponLook("flame_greatsword")?.img || ""));

      // 10. ワールドマップ / 洞窟解放
      save = normalizeSave(structuredClone(baseSave));
      results.push(autoAssert("初期状態では洞窟未開放", !isWorldAreaUnlocked(worldAreaById("cave")), `cave=${!!save.unlockedAreas?.cave}`));
      results.push(autoAssert("未開放洞窟には出発不可", !canSwitchMap("cave"), `canCave=${canSwitchMap("cave")}`));
      save.quests.moco_challenge.status = "cleared";
      const unlockedNow = syncWorldUnlocks(false);
      results.push(autoAssert("モコホーン報告済みで洞窟解放", isWorldAreaUnlocked(worldAreaById("cave")), `new=${unlockedNow} cave=${!!save.unlockedAreas?.cave}`));
      const switched = switchMap("cave");
      results.push(autoAssert("開放済み洞窟へ遷移可能", switched && save.map === "cave" && game.map === "cave", `save=${save.map} game=${game.map}`));
      save.map = "field";
      persist();
      const raw = JSON.parse(localStorage.getItem(SAVE_KEY) || "{}");
      results.push(autoAssert("マップ移動後の保存値が保持される", raw.map === "field", `raw.map=${raw.map}`));

    }catch(err){
      results.push({ name:"自動テスト実行中エラー", ok:false, detail:String(err && err.message ? err.message : err) });
    }finally{
      restoreFromAutoTestSnapshot(snap);
    }

    game.lastAutoTestResults = results;
    renderAutoTestResults(results);
    return results;
  }

  function renderAutoTestResults(results=game.lastAutoTestResults || []){
    setFacilityJobTheme(false);
    $("facilityTitle").textContent = "自動テスト";
    const total = results.length;
    const pass = results.filter(r => r.ok).length;
    const fail = total - pass;
    const box = $("facilityContent");
    box.innerHTML = `
      <div class="facility-row">
        <div class="row-head"><b>自動テスト結果</b><span class="quest-badge">${pass}/${total} OK</span></div>
        <p>セーブ/ステ振り/職業スキル/ヒール/敵湧き/モコホーン制限/レア率/装備/ワールドマップ解放を内部チェックします。</p>
        <p class="loop-action">${fail === 0 ? "全テストOKです。" : `${fail}件NGがあります。詳細を確認してください。`}</p>
        <button id="rerunAutoTestsBtn" class="green">もう一度実行</button>
      </div>
      <div class="auto-test-list">
        ${results.map(r => `
          <div class="auto-test-row ${r.ok ? "ok" : "ng"}">
            <b>${r.ok ? "OK" : "NG"}：${r.name}</b>
            <small>${r.detail || ""}</small>
          </div>
        `).join("")}
      </div>`;
    $("facilityOverlay").classList.add("show");
    setTimeout(()=>{
      const rerun = $("rerunAutoTestsBtn");
      if(rerun) rerun.onclick = runAutoTests;
    },0);
  }




  function setAppHeight(){
    const h = Math.round(window.visualViewport ? window.visualViewport.height : window.innerHeight);
    app.style.setProperty("--app-h", h + "px");
    app.style.height = h + "px";
  }

  function resize(){
    setAppHeight();
    const rect = app.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = Math.max(320, Math.round(rect.width));
    const h = Math.max(540, Math.round(rect.height));
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.imageSmoothingEnabled = false;
    game.w = w;
    game.h = h;
    game.dpr = dpr;
    resizeTitle();
  }

  function resizeTitle(){
    const box = titleCanvas.parentElement.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    titleCanvas.width = Math.round(box.width * dpr);
    titleCanvas.height = Math.round(box.height * dpr);
    titleCanvas.style.width = box.width + "px";
    titleCanvas.style.height = box.height + "px";
    tctx.setTransform(dpr,0,0,dpr,0,0);
    tctx.imageSmoothingEnabled = false;
    drawTitleCharacters(box.width, box.height);
  }

  function startGame(newGame=false){
    if(newGame){
      resetSave();
      save = loadSave();
    }
    syncWorldUnlocks(false);
    const startMap = canSwitchMap(save.map || "village") ? (save.map || "village") : "village";
    if(save.map !== startMap){
      save.map = startMap;
      persist();
    }
    titleScreen.classList.remove("active");
    gameScreen.classList.add("active");
    resize();
    initWorld(startMap);
    game.running = true;
    last = performance.now();
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(loop);
    toast("ミニアランドへようこそ！");
  }

  function initWorld(mapName){
    game.map = mapName;
    game.worldW = mapName === "village" ? 940 : mapName === "cave" ? 980 : 1280;
    game.worldH = mapName === "village" ? 740 : mapName === "cave" ? 780 : 980;
    const pStart = mapName === "village"
      ? {x:470,y:450}
      : mapName === "cave"
        ? {x:490,y:650}
        : {x:640,y:815};
    game.p = {
      x:pStart.x, y:pStart.y, r:14,
      hp: Math.min(save.hp || maxHp(), maxHp()),
      sp: Math.min(save.sp || maxSp(), maxSp()),
      maxHp:maxHp(), maxSp:maxSp(),
      face: -Math.PI/2,
      spriteDir: "down",
      walkTime:0,
      moving:false,
      speed: playerSpeed(),
      inv:0,
      attackTimer:0,
      bob:0
    };
    game.enemies = [];
    game.drops = [];
    game.texts = [];
    game.particles = [];
    game.attackFx = [];
    game.attackCooldown = 0;
    game.skillCooldown = 0;
    game.spawnTimer = 0;
    game.shake = 0;
    game.shakeX = 0;
    game.shakeY = 0;
    game.sit = false;
    if(mapName === "field"){
      for(let i=0;i<FIELD_TARGET_ENEMY_COUNT;i++) spawnMonster();
    }
    updateCamera();
    syncUI();
  }

  function mapDisplayName(mapName){
    if(mapName === "village") return "はじまりの村";
    if(mapName === "field") return "ひだまり草原";
    if(mapName === "cave") return "こけの洞窟";
    return "ミニアランド";
  }

  function switchMap(mapName){
    if(!canSwitchMap(mapName)){
      const area = worldAreaByMapTarget(mapName);
      toast(area && !isWorldAreaUnlocked(area) ? `${area.name}はまだ開放されていません` : "このエリアにはまだ移動できません");
      return false;
    }
    save.map = mapName;
    persist();
    initWorld(mapName);
    persist();
    toast(mapName === "village" ? "はじまりの村に戻りました" : `${mapDisplayName(mapName)}へ出発！`);
    const worldMapOverlay = $("worldMapOverlay");
    if(worldMapOverlay) worldMapOverlay.classList.remove("show");
    return true;
  }

  const WORLD_MAP_AREAS = [
    {
      id:"village",
      mapTarget:"village",
      name:"はじまりの村",
      sub:"ウエステ村",
      code:"HOME",
      level:"Lv 1",
      stars:"★☆☆☆☆",
      unlocked:true,
      icon:"assets/worldmap/node_village.png",
      desc:"冒険の拠点。道具屋、鍛冶屋、転職の館、クエスト掲示板を利用できます。",
      monsters:["なし"],
      drops:["なし"],
      condition:"最初から開放",
      note:"HPが危ない時や準備を整えたい時はここに戻りましょう。"
    },
    {
      id:"field",
      mapTarget:"field",
      name:"ひだまり草原",
      sub:"ナゴム草原",
      code:"FIELD",
      level:"Lv 1〜8",
      stars:"★★☆☆☆",
      unlocked:true,
      icon:"assets/worldmap/node_field.png",
      desc:"序盤の狩場。ぷるスライムやキノっこを倒して、素材・G・EXPを集めます。",
      monsters:["ぷるスライム","キノっこ","モコホーン"],
      drops:["ぷるゼリー","ぷるコア","きのこ草","赤いカサ","モコ毛皮"],
      condition:"最初から開放",
      note:"敵をタップして通常攻撃。ドロップは近づくと自動で拾います。"
    },
    {
      id:"cave",
      mapTarget:"cave",
      name:"こけの洞窟",
      sub:"ガッハルナ",
      code:"CAVE",
      level:"Lv 8〜15",
      stars:"★★★☆☆",
      unlocked:false,
      icon:"assets/worldmap/node_cave.png",
      desc:"湿った岩場とコケに覆われた洞窟。中盤序盤の素材集め用エリア予定です。",
      monsters:["ケイブスライム","コケバット","ロックぷる"],
      drops:["こけ石","洞窟キノコ","小さな鉱石"],
      condition:"草原クエスト『モコホーンへの挑戦』を報告すると開放",
      note:"開放後は洞窟入口マップへ移動できます。本格的な洞窟モンスターは次版で追加予定です。"
    },
    {
      id:"forest",
      mapTarget:null,
      name:"精霊の森",
      sub:"ポドーネ",
      code:"FOREST",
      level:"Lv 12〜20",
      stars:"★★★☆☆",
      unlocked:false,
      icon:"assets/worldmap/node_forest.png",
      desc:"木々と精霊が暮らす森。メイジ・プリースト系素材が集まるエリア予定です。",
      monsters:["リーフリン","つぼみラビ","森の精霊"],
      drops:["若葉のしずく","精霊の枝","森の布"],
      condition:"こけの洞窟到達後に開放予定",
      note:"今後のエリア拡張用の予約枠です。"
    },
    {
      id:"tower",
      mapTarget:null,
      name:"死の塔",
      sub:"レイコール",
      code:"TOWER",
      level:"Lv 20〜35",
      stars:"★★★★☆",
      unlocked:false,
      icon:"assets/worldmap/node_tower.png",
      desc:"高難度の塔エリア。強敵・レア素材・上位職条件に絡める予定です。",
      monsters:["ゴーストぷる","塔の番兵","影の魔導士"],
      drops:["古びた紋章","黒鉄片","塔の鍵片"],
      condition:"精霊の森クリア後に開放予定",
      note:"まだ未実装です。"
    },
    {
      id:"castle",
      mapTarget:null,
      name:"光の城",
      sub:"エルシオン",
      code:"HOLY",
      level:"Lv 25〜40",
      stars:"★★★★☆",
      unlocked:false,
      icon:"assets/worldmap/node_castle.png",
      desc:"光属性の敵と聖なる素材が登場する城エリア予定です。",
      monsters:["ホーリーぷる","城の守護者","光の騎士"],
      drops:["聖なる布","光石","騎士の欠片"],
      condition:"死の塔の一部クエスト達成後に開放予定",
      note:"まだ未実装です。"
    },
    {
      id:"ruins",
      mapTarget:null,
      name:"原始の谷",
      sub:"ブランガ",
      code:"RUINS",
      level:"Lv 18〜30",
      stars:"★★★☆☆",
      unlocked:false,
      icon:"assets/worldmap/node_ruins.png",
      desc:"古代遺跡風の素材エリア。獣・岩・古代系モンスターを予定しています。",
      monsters:["古代ぷる","石ガメ","谷の獣"],
      drops:["古代石","硬い甲羅","谷の牙"],
      condition:"草原〜洞窟進行後に開放予定",
      note:"まだ未実装です。"
    }
  ];

  let selectedWorldAreaId = "village";

  function isCaveUnlockConditionMet(){
    return quest("moco_challenge").status === "cleared";
  }

  function syncWorldUnlocks(showToast=false){
    save.unlockedAreas = save.unlockedAreas || { village:true, field:true, cave:false };
    save.unlockedAreas.village = true;
    save.unlockedAreas.field = true;
    let newlyUnlocked = false;
    if(isCaveUnlockConditionMet() && !save.unlockedAreas.cave){
      save.unlockedAreas.cave = true;
      newlyUnlocked = true;
      if(showToast) toast("こけの洞窟へ行けるようになりました！");
    }
    return newlyUnlocked;
  }

  function isWorldAreaUnlocked(area){
    syncWorldUnlocks(false);
    if(!area) return false;
    if(area.id === "village" || area.id === "field") return true;
    if(area.id === "cave") return !!save.unlockedAreas?.cave;
    return !!area.unlocked;
  }

  function worldAreaById(id){
    return WORLD_MAP_AREAS.find(a => a.id === id) || WORLD_MAP_AREAS[0];
  }

  function worldAreaByMapTarget(mapName){
    return WORLD_MAP_AREAS.find(a => a.mapTarget === mapName) || null;
  }

  function canSwitchMap(mapName){
    const area = worldAreaByMapTarget(mapName);
    return !!(area && area.mapTarget && isWorldAreaUnlocked(area));
  }

  function currentWorldArea(){
    return WORLD_MAP_AREAS.find(a => a.mapTarget === save.map) || WORLD_MAP_AREAS[0];
  }

  function refreshWorldMapUi(){
    const current = currentWorldArea();
    const currentText = $("worldMapCurrentText");
    if(currentText) currentText.textContent = `${current.name} / ${current.sub}`;
    syncWorldUnlocks(false);
    const unlockedCount = WORLD_MAP_AREAS.filter(a => isWorldAreaUnlocked(a)).length;
    const unlockedText = $("worldMapUnlockedText");
    if(unlockedText) unlockedText.textContent = `${unlockedCount} / ${WORLD_MAP_AREAS.length} エリア`;
    document.querySelectorAll(".world-node").forEach(node => {
      const id = node.dataset.areaId || node.dataset.mapTarget || "";
      const area = worldAreaById(id);
      node.classList.remove("current", "locked", "selected");
      if(!isWorldAreaUnlocked(area)) node.classList.add("locked");
      if(area.mapTarget && area.mapTarget === save.map) node.classList.add("current");
      if(id && id === selectedWorldAreaId) node.classList.add("selected");
    });
  }

  function renderWorldMapDetail(areaId=selectedWorldAreaId){
    const area = worldAreaById(areaId);
    const isUnlocked = isWorldAreaUnlocked(area);
    selectedWorldAreaId = area.id;
    const detail = $("worldMapDetail");
    if(!detail) return;

    const monsters = area.monsters.map(v => `<span>${v}</span>`).join("");
    const drops = area.drops.map(v => `<span>${v}</span>`).join("");
    detail.innerHTML = `
      <div class="world-detail-card ${isUnlocked ? "" : "locked"}">
        <div class="world-detail-head">
          <img src="${area.icon}" alt="${area.name}" />
          <div>
            <em>${area.code}</em>
            <b>${area.name}</b>
            <small>${area.sub} / 推奨 ${area.level}</small>
          </div>
          <i>${area.stars}</i>
        </div>
        <div class="world-detail-desc">${area.desc}</div>
        <div class="world-detail-grid">
          <div><b>出現</b><p>${monsters}</p></div>
          <div><b>素材</b><p>${drops}</p></div>
        </div>
        <div class="world-detail-condition">
          <b>${isUnlocked ? "開放中" : "未開放"}</b>
          <span>${area.condition}${isUnlocked && area.mapTarget ? " / 下の出発ボタンで移動できます" : ""}</span>
        </div>
        <div class="world-detail-actions">
          <small>${area.note}</small>
          <button id="worldMapDepartBtn" class="${isUnlocked && area.mapTarget ? "green" : ""}" ${isUnlocked && area.mapTarget ? "" : "disabled"}>${isUnlocked && area.mapTarget ? "このエリアへ出発" : "まだ行けません"}</button>
        </div>
      </div>`;
    const depart = $("worldMapDepartBtn");
    if(depart){
      depart.onclick = () => {
        if(!isWorldAreaUnlocked(area) || !area.mapTarget){
          toast("このエリアはまだ開放されていません");
          return;
        }
        switchMap(area.mapTarget);
      };
    }
    refreshWorldMapUi();
  }

  function selectWorldMapArea(areaId){
    selectedWorldAreaId = areaId;
    renderWorldMapDetail(areaId);
  }

  function openWorldMap(){
    const current = currentWorldArea();
    selectedWorldAreaId = current.id;
    refreshWorldMapUi();
    renderWorldMapDetail(selectedWorldAreaId);
    $("worldMapOverlay").classList.add("show");
  }

  function rand(a,b){ return Math.random() * (b-a) + a; }
  function clamp(v,a,b){ return Math.max(a, Math.min(b, v)); }
  function distance(a,b){ return Math.hypot(a.x-b.x, a.y-b.y); }
  function screenX(x){ return Math.round(x - game.camX + (game.shakeX || 0)); }
  function screenY(y){ return Math.round(y - game.camY + (game.shakeY || 0)); }

  function spawnMonster(){
    const zone = weightedSpawnZone();
    const id = chooseSpawnId(zone);
    const data = MONSTERS[id];
    let x=120,y=140;

    for(let i=0;i<72;i++){
      x = rand(zone.x[0], zone.x[1]);
      y = rand(zone.y[0], zone.y[1]);

      // プレイヤーの近くには湧きにくくする。
      // モコホーンは通常敵より遠く、北の奥地側に寄せる。
      const safeDist = id === "moco_horn" ? 330 : 220;
      if(!game.p || Math.hypot(x-game.p.x, y-game.p.y) > safeDist) break;
    }

    const scale = id === "moco_horn" ? rand(1.02,1.13) : rand(.94,1.08);
    const levelBonus = Math.max(0, save.level - 1);
    const hpBonus = id === "moco_horn" ? 3 : id === "puru_slime" ? 4 : 5;
    const hp = Math.round(data.hp + levelBonus * hpBonus);
    game.enemies.push({
      ...data,
      zone:zone.id,
      x,y,
      hp,
      maxHp: hp,
      atk: Math.round((data.atk + levelBonus * (id === "moco_horn" ? .75 : 1.1)) * 10) / 10,
      r: data.r * scale,
      hitCd: rand(.7,1.4),
      hurt:0,
      squash:0,
      knockX:0,
      knockY:0,
      warned:false,
      wander: rand(0, Math.PI*2),
      wanderTimer: rand(.5,2.2)
    });
  }

  function maintainFieldSpawns(dt){
    if(game.map !== "field") return;
    game.spawnTimer = Math.max(0, (game.spawnTimer || 0) - dt);

    // 敵が少なくなった時は定期補充。
    // 狩っている最中に敵が枯れるのを防ぐ。
    if(game.enemies.length < FIELD_TARGET_ENEMY_COUNT && game.spawnTimer <= 0){
      const missing = FIELD_TARGET_ENEMY_COUNT - game.enemies.length;
      const batch = Math.min(2, missing);
      for(let i=0;i<batch;i++) spawnMonster();
      game.spawnTimer = rand(1.2,2.1);
    }
  }

  function toast(text){
    const el = $("toast");
    el.textContent = text;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(()=>el.classList.remove("show"), 1500);
  }

  function hitText(x,y,text,good=false){
    game.texts.push({x,y,text,life:.85,good});
  }

  function burst(x,y,n,type="hit"){
    for(let i=0;i<n;i++){
      game.particles.push({
        x,y,
        vx:rand(-60,60),
        vy:rand(-90,25),
        life:rand(.35,.75),
        max:.75,
        size:rand(2,5),
        type
      });
    }
  }

  function playerAttack(targetEnemy=null){
    if(game.attackCooldown > 0 || !game.p || game.sit) return;
    const p = game.p;
    if(targetEnemy){
      p.face = Math.atan2(targetEnemy.y - p.y, targetEnemy.x - p.x);
    }
    const job = currentJob();
    if(job.cost && p.sp < job.cost){
      toast("SPが足りません");
      return;
    }
    if(job.cost) p.sp = Math.max(0, p.sp - job.cost);
    game.attackCooldown = attackCooldown(job);
    p.attackTimer = .18;
    p.attackAnimMax = p.attackTimer;
    const range = job.range;
    game.attackFx.push({kind:job.id,x:p.x,y:p.y,a:p.face,life:.18,max:.18,range});
    let hit = false;
    const isMagicBasic = job.id === "mage" || job.id === "priest";
    const arc = isMagicBasic ? Math.PI*.25 : Math.PI*.55;
    for(const e of [...game.enemies]){
      if(targetEnemy && e !== targetEnemy) continue;
      const dx = e.x - p.x;
      const dy = e.y - p.y;
      const d = Math.hypot(dx,dy);
      const a = Math.atan2(dy,dx);
      const diff = Math.atan2(Math.sin(a-p.face), Math.cos(a-p.face));
      if(d < range + e.r && Math.abs(diff) < arc){
        const basePower = isMagicBasic ? mat() : atk();
        const rate = job.id === "mage" ? 1.2 : job.id === "priest" ? .78 : job.id === "thief" ? .88 : 1.0;
        const rolled = rollDamage(basePower * rate * rand(.85,1.15));
        damageEnemy(e, rolled.dmg, p.x, p.y, isMagicBasic ? 34 : 26, rolled.crit ? "crit" : job.id === "priest" ? "holy" : "normal");
        if(rolled.crit) hitText(e.x, e.y - e.r - 30, "CRITICAL!", true);
        hit = true;
        if(isMagicBasic) break;
      }
    }
    if(!hit) burst(p.x + Math.cos(p.face)*Math.min(45,range), p.y + Math.sin(p.face)*Math.min(45,range), 4, "miss");
    else game.shake = Math.max(game.shake || 0, .05);
  }

  function useJobSkill(directionAngle=null){
    if(!game.p || game.sit) return;
    const job = currentJob();
    if(Number.isFinite(directionAngle)) game.p.face = directionAngle;
    if(job.id === "fighter") return fighterSlash(directionAngle);
    if(job.id === "mage") return mageFirebolt(directionAngle);
    if(job.id === "priest") return priestHeal(directionAngle);
    toast(`${job.name}の専用スキルは準備中です`);
  }

  function fighterSlash(directionAngle=null){
    const p = game.p;
    const job = currentJob();
    const cost = job.skillCost || 0;
    const cd = job.skillCooldown || 2.2;
    if(Number.isFinite(directionAngle)) p.face = directionAngle;

    if(game.skillCooldown > 0){
      toast(`スラッシュ再使用まで ${game.skillCooldown.toFixed(1)}秒`);
      syncUI();
      return;
    }
    if(p.sp < cost){
      toast(`SPが足りません / 必要SP ${cost}`);
      syncUI();
      return;
    }

    p.sp = Math.max(0, p.sp - cost);
    game.skillCooldown = cd;
    game.attackCooldown = Math.max(game.attackCooldown, .18);
    p.attackTimer = .24;
    p.attackAnimMax = p.attackTimer;

    const range = 82;
    const arc = Math.PI * .76;
    game.attackFx.push({kind:"fighterSlash", x:p.x, y:p.y, a:p.face, life:.28, max:.28, range});

    let hits = 0;
    for(const e of [...game.enemies]){
      const dx = e.x - p.x;
      const dy = e.y - p.y;
      const d = Math.hypot(dx,dy);
      const a = Math.atan2(dy,dx);
      const diff = Math.atan2(Math.sin(a-p.face), Math.cos(a-p.face));
      if(d < range + e.r && Math.abs(diff) < arc){
        const slashRate = e.id === "moco_horn" ? 1.38 : e.id === "kinokko" ? 1.75 : 2.18;
        const rolled = rollDamage(atk() * slashRate * rand(.92,1.10));
        damageEnemy(e, rolled.dmg, p.x, p.y, 58, rolled.crit ? "crit" : "slash");
        if(rolled.crit) hitText(e.x, e.y - e.r - 30, "CRITICAL!", true);
        hits++;
      }
    }

    if(hits > 0){
      hitText(p.x + Math.cos(p.face)*36, p.y + Math.sin(p.face)*36 - 24, "SLASH!", true);
      game.shake = Math.max(game.shake || 0, .13);
      burst(p.x + Math.cos(p.face)*50, p.y + Math.sin(p.face)*50, 12, "slash");
      toast(`スラッシュ！ ${hits}体ヒット`);
    }else{
      burst(p.x + Math.cos(p.face)*Math.min(52,range), p.y + Math.sin(p.face)*Math.min(52,range), 6, "miss");
      toast("スラッシュ！");
    }
    syncUI();
  }

  function mageFirebolt(directionAngle=null){
    const p = game.p;
    const job = currentJob();
    const cost = job.skillCost || 14;
    const cd = job.skillCooldown || 2.8;
    if(Number.isFinite(directionAngle)) p.face = directionAngle;

    if(game.skillCooldown > 0){
      toast(`ファイアボルト再使用まで ${game.skillCooldown.toFixed(1)}秒`);
      syncUI();
      return;
    }
    if(p.sp < cost){
      toast(`SPが足りません / 必要SP ${cost}`);
      syncUI();
      return;
    }

    p.sp = Math.max(0, p.sp - cost);
    game.skillCooldown = cd;
    game.attackCooldown = Math.max(game.attackCooldown, .20);
    p.attackTimer = .22;
    p.attackAnimMax = p.attackTimer;

    const range = 210;
    const arc = Math.PI * .20;
    let target = null;
    let targetDist = Infinity;
    for(const e of [...game.enemies]){
      const dx = e.x - p.x;
      const dy = e.y - p.y;
      const d = Math.hypot(dx,dy);
      const a = Math.atan2(dy,dx);
      const diff = Math.atan2(Math.sin(a-p.face), Math.cos(a-p.face));
      if(d < range + e.r && Math.abs(diff) < arc && d < targetDist){
        target = e;
        targetDist = d;
      }
    }

    const fxRange = target ? Math.max(34, Math.min(range, targetDist)) : range;
    game.attackFx.push({kind:"mageFirebolt", x:p.x, y:p.y, a:p.face, life:.34, max:.34, range:fxRange});

    if(target){
      const fireRate = target.id === "moco_horn" ? 1.45 : target.id === "kinokko" ? 1.75 : 2.05;
      const rolled = rollDamage(mat() * fireRate * rand(.90,1.12));
      damageEnemy(target, rolled.dmg, p.x, p.y, 42, rolled.crit ? "crit" : "fire");
      if(rolled.crit) hitText(target.x, target.y - target.r - 42, "CRITICAL!", true);
      hitText(target.x, target.y - target.r - 28, "FIRE!", true);
      burst(target.x, target.y, 16, "fire");
      game.shake = Math.max(game.shake || 0, .10);
      toast("ファイアボルト！");
    }else{
      burst(p.x + Math.cos(p.face)*range, p.y + Math.sin(p.face)*range, 8, "fire");
      toast("ファイアボルト！");
    }
    syncUI();
  }

  function priestHealAmount(){
    return Math.max(20, Math.round(28 + mat() * .95 + statValue("int") * 4 + statValue("vit") * 2));
  }

  function priestHeal(directionAngle=null){
    const p = game.p;
    const job = currentJob();
    const cost = job.skillCost || 12;
    const cd = job.skillCooldown || 3.0;
    if(Number.isFinite(directionAngle)) p.face = directionAngle;

    if(game.skillCooldown > 0){
      toast(`ヒール再使用まで ${game.skillCooldown.toFixed(1)}秒`);
      syncUI();
      return;
    }
    if(p.sp < cost){
      toast(`SPが足りません / 必要SP ${cost}`);
      syncUI();
      return;
    }
    if(p.hp >= p.maxHp){
      toast("HPは満タンです");
      syncUI();
      return;
    }

    p.sp = Math.max(0, p.sp - cost);
    game.skillCooldown = cd;
    game.attackCooldown = Math.max(game.attackCooldown, .18);
    p.attackTimer = .18;
    p.attackAnimMax = p.attackTimer;

    const before = p.hp;
    const heal = priestHealAmount();
    p.hp = Math.min(p.maxHp, p.hp + heal);
    const actual = Math.max(0, Math.round(p.hp - before));

    game.attackFx.push({kind:"priestHeal", x:p.x, y:p.y, a:0, life:.42, max:.42, range:42});
    hitText(p.x, p.y - 38, `+${actual}`, true);
    burst(p.x, p.y, 18, "heal");
    toast(`ヒール +${actual}`);
    syncUI();
  }

  function damageEnemy(e, dmg, sx=null, sy=null, knock=0, kind="normal"){
    e.hp -= dmg;
    e.hurt = kind === "slash" ? .26 : kind === "fire" ? .22 : kind === "holy" ? .20 : .18;
    e.squash = kind === "slash" ? .22 : kind === "fire" ? .18 : kind === "holy" ? .15 : .13;
    if(sx !== null && sy !== null && knock > 0){
      const a = Math.atan2(e.y - sy, e.x - sx);
      const kr = 1 - (e.knockResist || 0);
      e.knockX = (e.knockX || 0) + Math.cos(a) * knock * kr;
      e.knockY = (e.knockY || 0) + Math.sin(a) * knock * kr;
    }
    const label = kind === "slash" || kind === "fire" || kind === "holy" ? `${dmg}!` : String(dmg);
    hitText(e.x, e.y - e.r - 14, label, kind === "slash" || kind === "fire" || kind === "holy");
    if(kind === "slash" || kind === "fire" || dmg >= Math.max(18, e.maxHp * .28)){
      hitText(e.x, e.y - e.r - 30, "POWERFUL!", true);
    }
    burst(e.x, e.y, kind === "slash" ? 15 : kind === "fire" ? 13 : kind === "holy" ? 11 : 9, kind === "slash" ? "slash" : kind === "fire" ? "fire" : kind === "holy" ? "heal" : "hit");
    if(e.hp <= 0) killEnemy(e, kind);
  }

  function killEnemy(e, kind="normal"){
    const idx = game.enemies.indexOf(e);
    if(idx >= 0) game.enemies.splice(idx,1);

    const exp = Math.round(e.exp + save.level * 1.5);
    const gold = Math.round(e.gold + save.level);
    addExp(exp);
    save.gold += gold;
    hitText(e.x, e.y - 38, `EXP+${exp}`, true);
    hitText(e.x, e.y - 55, `G+${gold}`, true);
    if(kind === "slash") hitText(e.x, e.y - 72, "一閃!", true);

    updateQuestProgress("kill", e.id, 1);

    dropItem(e.item, e.x, e.y);
    if(e.rareItem && Math.random() < clamp((e.rareRate || 0) + rareBonusRate(), 0, .75)){
      dropItem(e.rareItem, e.x, e.y, true);
      hitText(e.x, e.y - 88, `RARE ${ITEMS[e.rareItem]?.name || e.rareItem}!`, true);
    }
    burst(e.x, e.y, kind === "slash" ? 24 : 18, kind === "slash" ? "slash" : "drop");
    game.shake = Math.max(game.shake || 0, kind === "slash" ? .16 : .08);

    if(game.map === "field"){
      setTimeout(()=>{ if(game.map==="field" && game.enemies.length < FIELD_TARGET_ENEMY_COUNT) spawnMonster(); }, 900);
    }
  }

  function dropItem(id, x, y, rare=false){
    if(!id) return;
    game.drops.push({
      x:x + rand(-12,12),
      y:y + rand(-8,10),
      id,
      count:1,
      life:999,
      rare
    });
  }

  function playerDamage(amount){
    const p = game.p;
    if(game.god) return;
    if(p.inv > 0) return;
    const job = currentJob();
    const defRate = job.defRate || 1;
    const final = Math.max(1, Math.round(amount / defRate - def() * .08));
    p.hp = Math.max(0, p.hp - final);
    p.inv = .5;
    hitText(p.x, p.y - 32, "-" + final);
    burst(p.x, p.y, 8, "hurt");
    if(p.hp <= 0){
      p.hp = 1;
      toast("HPが危険です。村に戻ります");
      switchMap("village");
    }
  }

  function pickup(showToast=true, allowVillageFallback=true){
    if(!game.p) return;
    let picked = 0;
    for(const d of [...game.drops]){
      if(Math.hypot(d.x-game.p.x, d.y-game.p.y) < 46){
        addItem(d.id, d.count);
        updateQuestProgress("item", d.id, d.count);
        const idx = game.drops.indexOf(d);
        if(idx >= 0) game.drops.splice(idx,1);
        picked++;
        hitText(game.p.x, game.p.y - 38, `${ITEMS[d.id]?.name || d.id}+${d.count}`, true);
        burst(d.x,d.y,8,"pickup");
      }
    }
    if(picked > 0){
      if(showToast) toast(`${picked}個拾いました`);
      persist();
    }else if(allowVillageFallback){
      if(game.map === "village"){
        const near = nearestVillageObject();
        if(near) handleVillageInteraction(near);
        else if(showToast) toast("近くに話せる人・施設はありません");
      }else if(showToast){
        toast("近くに拾えるものはありません");
      }
    }
  }

  function toggleSit(){
    if(!game.p) return;
    game.sit = !game.sit;
    if(game.sit){
      input.x = 0; input.y = 0;
      toast("座って休憩します");
    }else{
      toast("休憩をやめました");
    }
    syncUI();
  }


  function handleVillageInteraction(obj){
    if(!obj) return;
    if(obj.kind === "npc"){
      openDialogue(obj.name, obj.message);
      return;
    }
    if(obj.kind === "shop" || obj.kind === "smith" || obj.kind === "job" || obj.kind === "quest" || obj.kind === "storage"){
      openFacility(obj.kind, obj.name, obj.message);
      return;
    }
    toast(obj.message || "調べました");
  }

  function dialogueFaceFor(name){
    if(String(name).includes("案内")) return "案";
    if(String(name).includes("守衛")) return "守";
    if(String(name).includes("道具")) return "店";
    if(String(name).includes("鍛冶")) return "鍛";
    if(String(name).includes("転職")) return "職";
    if(String(name).includes("掲示")) return "板";
    if(String(name).includes("倉庫")) return "倉";
    return "村";
  }

  function openDialogue(name, text){
    $("dialogueName").textContent = name;
    $("dialogueText").textContent = text;
    const face = $("dialogueFace");
    if(face) face.textContent = dialogueFaceFor(name);
    $("dialogueBox").classList.add("show");
  }

  function closeDialogue(){
    $("dialogueBox").classList.remove("show");
  }

  function openFacility(kind, title, message){
    closeDialogue();
    clearFacilityThemes();
    $("facilityTitle").textContent = title;
    const box = $("facilityContent");
    box.innerHTML = "";
    if(kind === "shop"){
      setFacilityShopTheme(true);
      $("facilityTitle").innerHTML = "Item Shop <small>道具屋</small>";
      const herbCount = itemCount("herb");
      const canBuyHerb = save.gold >= 10;
      box.innerHTML = `
        <div class="shop-mmo-window">
          <div class="shop-tabs">
            <span class="active">道具</span><span>回復</span><span>おすすめ</span>
          </div>
          <div class="shop-guide-line">冒険前に必要な道具を準備できます。所持Gと所持数を確認して購入してください。</div>
          <div class="shop-summary-grid">
            <div><b>GOLD</b><span>${save.gold}G</span></div>
            <div><b>やくそう</b><span>${herbCount}個</span></div>
            <div><b>価格</b><span>10G</span></div>
          </div>
          <div class="shop-board">
            <div class="shop-section-title"><b>販売リスト</b><span>ITEM LIST</span></div>
            <div class="shop-item-row available">
              <div class="shop-item-icon">🌿</div>
              <div class="shop-item-main">
                <b>やくそう</b>
                <small>HPを35回復する基本アイテム。右下の薬ボタン、またはバッグから使えます。</small>
                <div class="shop-item-meta"><span>種類：消費</span><span>所持：${herbCount}</span><span>価格：10G</span></div>
              </div>
              <button id="buyHerbBtn" class="green" ${canBuyHerb ? "" : "disabled"}>購入</button>
            </div>
            <div class="shop-item-row disabled">
              <div class="shop-item-icon">🧪</div>
              <div class="shop-item-main">
                <b>小さなSP薬</b>
                <small>今後追加予定。メイジやプリースト向けのSP回復アイテム候補です。</small>
                <div class="shop-item-meta"><span>種類：消費</span><span>所持：-</span><span>未入荷</span></div>
              </div>
              <button disabled>未入荷</button>
            </div>
          </div>
          <div class="shop-message-box"><b>店主</b><span>${message}</span></div>
        </div>`;
      $("facilityOverlay").classList.add("show");
      setTimeout(()=>{
        const btn = $("buyHerbBtn");
        if(btn) btn.onclick = buyHerb;
      },0);
      return;
    }
    if(kind === "smith"){
      renderSmith(message);
      $("facilityOverlay").classList.add("show");
      return;
    }
    if(kind === "quest"){
      renderQuestBoard();
      $("facilityOverlay").classList.add("show");
      return;
    }
    if(kind === "job"){
      renderJobHall();
      $("facilityOverlay").classList.add("show");
      return;
    }
    if(kind === "storage"){
      box.innerHTML = `
        <div class="facility-row">
          <div class="row-head"><b>倉庫</b><span>v0.6予定</span></div>
          <p>${message}</p>
          <div style="display:grid;gap:7px;">
            <button id="openBagFromStorageBtn" class="blue">バッグを開く</button>
            <button id="openEquipFromStorageBtn" class="green">装備を開く</button>
          </div>
        </div>`;
      $("facilityOverlay").classList.add("show");
      setTimeout(()=>{
        const btn = $("openBagFromStorageBtn");
        const eqBtn = $("openEquipFromStorageBtn");
        if(btn) btn.onclick = () => { $("facilityOverlay").classList.remove("show"); openBag(); };
        if(eqBtn) eqBtn.onclick = () => { openEquipmentScreen(); };
      },0);
    }
  }

  function itemCount(id){
    return save.inventory?.[id] || 0;
  }

  function materialText(materials){
    const parts = [];
    for(const [id, count] of Object.entries(materials || {})){
      const item = ITEMS[id] || { name:id };
      const have = itemCount(id);
      parts.push(`${item.name} ${have}/${count}${have < count ? " 不足" : ""}`);
    }
    return parts.length ? parts.join("、") : "なし";
  }

  function materialInventoryText(){
    const materialIds = Object.keys(ITEMS).filter(id => ITEMS[id].type.includes("素材"));
    return materialIds.map(id => {
      const item = ITEMS[id];
      return `<span class="material-chip ${item.type === "レア素材" ? "rare" : ""}">${item.icon} ${item.name}×${itemCount(id)}</span>`;
    }).join("");
  }

  function canCraftEquipment(id){
    const recipe = EQUIP_RECIPES[id];
    if(!recipe) return false;
    if(save.ownedEquip?.[id]) return false;
    if(save.gold < recipe.gold) return false;
    for(const [mat, count] of Object.entries(recipe.materials || {})){
      if(itemCount(mat) < count) return false;
    }
    return true;
  }

  function spendMaterials(materials){
    for(const [mat, count] of Object.entries(materials || {})){
      save.inventory[mat] = Math.max(0, (save.inventory[mat] || 0) - count);
    }
  }

  function gainEquipment(id){
    const e = EQUIPMENT[id];
    if(!e) return;
    save.ownedEquip = save.ownedEquip || {};
    save.ownedEquip[id] = true;
  }

  function craftEquipment(id){
    const e = EQUIPMENT[id];
    const recipe = EQUIP_RECIPES[id];
    if(!e || !recipe) return;
    if(save.ownedEquip?.[id]){
      toast("すでに所持しています");
      return;
    }
    if(save.gold < recipe.gold){
      toast("Gが足りません");
      return;
    }
    for(const [mat, count] of Object.entries(recipe.materials || {})){
      if(itemCount(mat) < count){
        toast("素材が足りません");
        return;
      }
    }
    save.gold -= recipe.gold;
    spendMaterials(recipe.materials);
    gainEquipment(id);
    updateQuestProgress("craft", id, 1);
    persist();
    syncUI();
    toast(`${e.name}を作成しました`);
    renderSmith("素材を集めれば、装備を増やせるぞ。");
  }


  function renderSmith(message){
    setFacilitySmithTheme(true);
    $("facilityTitle").innerHTML = "Smithy <small>鍛冶屋</small>";
    const cost = smithCost();
    const craftIds = Object.keys(EQUIP_RECIPES);
    const box = $("facilityContent");
    const currentWeaponId = save.equipment?.weapon;
    const currentWeapon = EQUIPMENT[currentWeaponId]?.name || "未装備";
    const canUpgrade = save.gold >= cost;

    function recipeState(id){
      const r = EQUIP_RECIPES[id];
      if(save.ownedEquip?.[id]) return { label:"所持済", cls:"owned" };
      if(save.gold < r.gold) return { label:"G不足", cls:"lack" };
      for(const [mat, count] of Object.entries(r.materials || {})){
        if(itemCount(mat) < count) return { label:"素材不足", cls:"lack" };
      }
      return { label:"作成可", cls:"ready" };
    }
    function recipeMaterialChips(materials){
      const entries = Object.entries(materials || {});
      if(!entries.length) return `<span class="smith-material-chip ready">素材なし</span>`;
      return entries.map(([id,count]) => {
        const item = ITEMS[id] || { name:id, icon:"◇" };
        const have = itemCount(id);
        return `<span class="smith-material-chip ${have >= count ? "ready" : "lack"}">${item.icon || "◇"} ${item.name} ${have}/${count}</span>`;
      }).join("");
    }

    box.innerHTML = `
      <div class="smith-mmo-window">
        <div class="smith-tabs">
          <span class="active">強化</span><span>作成</span><span>素材</span>
        </div>
        <div class="smith-guide-line">素材とGを使って、狩りやすさを上げます。作成可否は右端の状態で確認できます。</div>

        <div class="smith-summary-grid">
          <div><b>GOLD</b><span>${save.gold}G</span></div>
          <div><b>武器Lv</b><span>Lv${save.weaponLevel}</span></div>
          <div><b>強化費</b><span>${cost}G</span></div>
        </div>

        <div class="smith-board smith-upgrade-board">
          <div class="smith-section-title"><b>武器強化</b><span>WEAPON UPGRADE</span></div>
          <div class="smith-upgrade-row">
            <div class="smith-upgrade-icon">⚔</div>
            <div class="smith-upgrade-main">
              <b>${currentWeapon} Lv${save.weaponLevel}</b>
              <small>現在装備中の武器に共通強化値を加えます。現在の補正：ATK +${(save.weaponLevel-1)*2}</small>
              <div class="smith-item-meta"><span>費用：${cost}G</span><span>所持：${save.gold}G</span><span>${canUpgrade ? "強化可能" : "G不足"}</span></div>
            </div>
            <button id="upgradeWeaponBtn" class="green" ${canUpgrade ? "" : "disabled"}>強化</button>
          </div>
        </div>

        <div class="smith-material-box">
          <b>所持素材</b>
          <div class="material-chip-row">${materialInventoryText()}</div>
        </div>

        <div class="smith-board">
          <div class="smith-section-title"><b>装備作成</b><span>CRAFT LIST</span></div>
          <div class="smith-message-box"><b>鍛冶屋</b><span>${message}</span></div>
          <div class="smith-recipe-list">
            ${craftIds.map(id => {
              const e = EQUIPMENT[id];
              const r = EQUIP_RECIPES[id];
              const owned = save.ownedEquip?.[id];
              const disabled = owned || !canCraftEquipment(id);
              const state = recipeState(id);
              return `
                <div class="smith-recipe-row ${state.cls}">
                  <div class="smith-recipe-icon">${e.icon}</div>
                  <div class="smith-recipe-main">
                    <div class="smith-recipe-name"><b>${e.name}</b><span>${EQUIP_SLOTS[e.slot]}</span><span>${equipJobText(e)}</span></div>
                    <small>${e.desc}</small>
                    <div class="smith-effect-grid">
                      <span>ATK+${e.atk||0}</span><span>HP+${e.hp||0}</span><span>SP+${e.sp||0}</span><span>SPD${(e.speed||0)>=0?"+":""}${e.speed||0}</span>
                    </div>
                    <div class="smith-material-row"><span class="smith-material-chip gold">${r.gold}G</span>${recipeMaterialChips(r.materials)}</div>
                  </div>
                  <div class="smith-recipe-action">
                    <em>${state.label}</em>
                    ${owned ? `<span class="job-now">所持</span>` : `<button id="craft_${id}" class="green" ${disabled ? "disabled" : ""}>作成</button>`}
                  </div>
                </div>`;
            }).join("")}
          </div>
        </div>
      </div>`;
    setTimeout(()=>{
      const up = $("upgradeWeaponBtn");
      if(up) up.onclick = upgradeWeapon;
      for(const id of craftIds){
        const btn = $("craft_" + id);
        if(btn) btn.onclick = () => craftEquipment(id);
      }
    },0);
  }


  function applyStatRefresh(oldHpRate=1, oldSpRate=1){
    if(!game.p) return;
    game.p.maxHp = maxHp();
    game.p.maxSp = maxSp();
    game.p.hp = Math.max(1, Math.round(game.p.maxHp * oldHpRate));
    game.p.sp = Math.round(game.p.maxSp * oldSpRate);
    game.p.speed = playerSpeed();
  }

  function equipItem(id){
    const e = EQUIPMENT[id];
    if(!e) return;
    if(!canEquipForCurrentJob(e)){
      toast(`${equipJobText(e)}専用装備です`);
      return;
    }
    save.ownedEquip = save.ownedEquip || {};
    if(!save.ownedEquip[id]){
      toast("未所持の装備です");
      return;
    }
    const hpRate = game.p ? Math.max(.05, game.p.hp / game.p.maxHp) : 1;
    const spRate = game.p ? Math.max(0, game.p.sp / game.p.maxSp) : 1;
    save.equipment = save.equipment || {};
    save.equipment[e.slot] = id;
    applyStatRefresh(hpRate, spRate);
    persist();
    syncUI();
    renderEquipmentScreen(e.slot);
    toast(`${e.name}を装備しました`);
  }

  function unequipSlot(slot){
    if(slot === "weapon" || slot === "body"){
      toast("武器と胴装備は外せません");
      return;
    }
    const hpRate = game.p ? Math.max(.05, game.p.hp / game.p.maxHp) : 1;
    const spRate = game.p ? Math.max(0, game.p.sp / game.p.maxSp) : 1;
    save.equipment = save.equipment || {};
    save.equipment[slot] = null;
    applyStatRefresh(hpRate, spRate);
    persist();
    syncUI();
    renderEquipmentScreen(slot);
    toast(`${EQUIP_SLOTS[slot]}装備を外しました`);
  }


  function renderEquipmentScreen(filterSlot=null){
    setFacilityEquipTheme(true);
    $("facilityTitle").innerHTML = "Equipment <small>装備</small>";
    const box = $("facilityContent");
    const stats = equipStats();
    const slotEntries = Object.entries(EQUIP_SLOTS);
    const ownedIds = Object.keys(save.ownedEquip || {}).filter(id => EQUIPMENT[id]);
    const shownIds = filterSlot ? ownedIds.filter(id => EQUIPMENT[id].slot === filterSlot) : ownedIds;
    const currentWeapon = EQUIPMENT[save.equipment?.weapon]?.name || "なし";
    const activeLabel = filterSlot ? EQUIP_SLOTS[filterSlot] : "全部";

    function slotPanel(slot,label){
      const id = save.equipment?.[slot];
      const e = EQUIPMENT[id];
      const removable = e && slot !== "weapon" && slot !== "body";
      return `
        <div class="equip-current-slot ${filterSlot === slot ? 'active' : ''}" data-slot="${slot}">
          <button class="equip-current-head" id="equipSlotFilter_${slot}"><b>${label}</b><span>${e ? e.icon : "—"}</span></button>
          <div class="equip-current-body">
            <strong>${e ? e.name : "未装備"}</strong>
            <small>${e ? `${equipJobText(e)} / ATK+${e.atk||0} / HP+${e.hp||0} / SP+${e.sp||0} / 速度${(e.speed||0)>=0?"+":""}${e.speed||0}` : "この部位はまだ空です"}</small>
          </div>
          ${removable ? `<button id="unequip_${slot}" class="equip-mini-btn blue">外す</button>` : `<em>${slot === "weapon" || slot === "body" ? "固定" : "空き"}</em>`}
        </div>`;
    }

    function equipRow(id){
      const e = EQUIPMENT[id];
      const equipped = save.equipment?.[e.slot] === id;
      const canEquip = canEquipForCurrentJob(e);
      return `
        <div class="equip-list-row ${equipped ? 'equipped' : ''} ${!canEquip ? 'locked' : ''}">
          <div class="equip-row-icon">${e.icon}</div>
          <div class="equip-row-main">
            <div class="equip-row-title"><b>${e.name}</b><span>${EQUIP_SLOTS[e.slot]}</span><span>${equipJobText(e)}</span></div>
            <small>${e.desc}</small>
            <div class="equip-effect-grid">
              <i>ATK ${e.atk||0}</i><i>HP ${e.hp||0}</i><i>SP ${e.sp||0}</i><i>SPD ${(e.speed||0)>=0?"+":""}${e.speed||0}</i>
            </div>
          </div>
          <div class="equip-row-action">
            ${!canEquip ? `<button disabled>専用外</button>` : equipped ? `<span>装備中</span>` : `<button id="equip_${id}" class="green">装備</button>`}
          </div>
        </div>`;
    }

    box.innerHTML = `
      <div class="equip-mmo-window">
        <div class="equip-mini-tabs">
          <span class="equip-mini-tab active">装備</span>
          <span class="equip-mini-tab">所持品</span>
          <span class="equip-mini-tab">強化</span>
          <span class="equip-mini-logo">${activeLabel}</span>
        </div>

        <div class="equip-mainbox">
          <div class="equip-page-title"><b>Equipment</b><span>現在の装備と所持装備を確認できます。</span></div>

          <div class="equip-summary-line">
            <span>職業：${currentJob().icon} ${currentJob().name}</span>
            <span>武器：${currentWeapon} Lv${save.weaponLevel}</span>
            <span>未使用pt：${availableStatPoints()}</span>
          </div>

          <div class="equip-status-strip">
            <div><b>HP</b><span>${maxHp()}</span></div>
            <div><b>SP</b><span>${maxSp()}</span></div>
            <div><b>ATK</b><span>${atk()}</span></div>
            <div><b>MAT</b><span>${mat()}</span></div>
            <div><b>DEF</b><span>${def()}</span></div>
            <div><b>MOV</b><span>${playerSpeed()}</span></div>
          </div>

          <div class="equip-layout-grid">
            <div class="equip-current-panel">
              <div class="equip-section-caption"><b>装備中</b><span>クリックで絞込</span></div>
              <div class="equip-current-grid">
                ${slotEntries.map(([slot,label]) => slotPanel(slot,label)).join("")}
              </div>
              <div class="equip-bonus-box">
                <b>装備補正</b>
                <span>ATK+${stats.atk} / HP+${stats.hp} / SP+${stats.sp} / 速度${stats.speed>=0?"+":""}${stats.speed}</span>
              </div>
            </div>

            <div class="equip-owned-panel">
              <div class="equip-filter-tabs">
                <button id="equipFilter_all" class="${!filterSlot ? 'active' : ''}">全部</button>
                ${slotEntries.map(([slot,label])=>`<button id="equipFilter_${slot}" class="${filterSlot === slot ? 'active' : ''}">${label}</button>`).join("")}
              </div>
              <div class="equip-owned-head"><b>所持装備</b><span>${shownIds.length}件</span></div>
              <div class="equip-owned-list">
                ${shownIds.length ? shownIds.map(equipRow).join("") : `<div class="equip-empty-box"><b>この部位の装備は未所持です</b><p>鍛冶屋で装備を作成できます。</p></div>`}
              </div>
            </div>
          </div>
        </div>
      </div>`;
    $("facilityOverlay").classList.add("show");
    setTimeout(()=>{
      const all = $("equipFilter_all");
      if(all) all.onclick = () => renderEquipmentScreen(null);
      for(const [slot] of slotEntries){
        const filter = $("equipFilter_" + slot);
        if(filter) filter.onclick = () => renderEquipmentScreen(slot);
        const slotFilter = $("equipSlotFilter_" + slot);
        if(slotFilter) slotFilter.onclick = () => renderEquipmentScreen(slot);
        const unequip = $("unequip_" + slot);
        if(unequip) unequip.onclick = () => unequipSlot(slot);
      }
      for(const id of shownIds){
        const btn = $("equip_" + id);
        if(btn) btn.onclick = () => equipItem(id);
      }
    },0);
  }


  function openEquipmentScreen(){
    $("menuOverlay").classList.remove("show");
    $("bagOverlay").classList.remove("show");
    renderEquipmentScreen(null);
  }

  function renderJobHall(){
    setFacilityJobTheme(true);
    $("facilityTitle").innerHTML = "Job <small>転職の館</small>";
    const now = currentJob();
    const box = $("facilityContent");
    box.innerHTML = `
      <div class="job-window">
        <div class="job-tabs" aria-label="職業メニュー">
          <span class="active">①職業選択</span>
          <span>②スキルリンク</span>
          <span>③ステータスポイント</span>
        </div>

        <div class="job-guide-line">転職したい職業を選んでください。</div>

        <div class="job-current-summary">
          <div class="job-current-main">
            <span class="job-current-icon">${now.icon}</span>
            <div>
              <b>現在：${now.name}</b>
              <small>${now.type} / ${now.summary}</small>
            </div>
          </div>
          <div class="job-current-data">
            <span>HP ${maxHp()}</span><span>SP ${maxSp()}</span><span>ATK ${atk()}</span><span>MAT ${mat()}</span><span>DEF ${def()}</span><span>MOV ${playerSpeed()}</span>
          </div>
          <div class="job-current-skill">
            <span>通常：${now.attackName || "通常攻撃"}</span>
            <span>専用：${now.skillName || "未実装"} / ${skillStatusText()}</span>
          </div>
        </div>

        <div class="job-tree-scroll" aria-label="段階別職業一覧">
          <div class="job-tree-board">
            ${JOB_TREE_TIERS.map(tier => `
              <div class="job-tier ${tier.className}">
                <div class="job-tier-title">${tier.label}</div>
                ${tier.jobs.map(entry => {
                  const job = jobDataById(entry.id);
                  const state = jobUnlockState(entry);
                  const current = JOBS[entry.id] && job.name === save.currentJob;
                  const selectable = state === "selectable" && !current;
                  const req = jobRequirementText(entry);
                  return `
                    <div class="job-mini-card ${state} ${current ? "current" : ""}">
                      <div class="job-mini-level">
                        <span>EXP</span>
                        <i></i>
                        <b>${jobLevelText(entry.id)}</b>
                      </div>
                      <div class="job-mini-main">
                        <span class="job-mini-icon">${entry.icon || job.icon || "？"}</span>
                        <b>${job.name}</b>
                      </div>
                      <small title="${req}">${entry.role} / ${req}</small>
                      <div class="job-mini-actions">
                        <em>${jobStateLabel(entry)}</em>
                        ${selectable ? `<button id="jobBtn_${entry.id}" class="green">転職</button>` : current ? `<button disabled>現在</button>` : `<button disabled>未解放</button>`}
                      </div>
                    </div>`;
                }).join("")}
              </div>
            `).join("")}
          </div>
        </div>

        <div class="job-note-box">
          <b>職業成長メモ</b>
          <span>まずは1次職を育て、将来的に2次職・3次職・4次職へ進む構成です。上位職は条件表示を先に出し、実装時に解放します。</span>
        </div>
      </div>`;
    setTimeout(()=>{
      for(const tier of JOB_TREE_TIERS){
        for(const entry of tier.jobs){
          const btn = $("jobBtn_" + entry.id);
          if(btn) btn.onclick = () => changeJob(entry.id);
        }
      }
    },0);
  }

  function changeJob(jobId){
    if(!JOBS[jobId]){
      toast("この職業はまだ未実装です");
      return;
    }
    const job = JOBS[jobId] || JOBS.fighter;
    const hpRate = game.p ? Math.max(.05, game.p.hp / game.p.maxHp) : 1;
    const spRate = game.p ? Math.max(0, game.p.sp / game.p.maxSp) : 1;
    save.currentJob = job.name;
    save.jobLevels = save.jobLevels || { fighter:1, mage:1, thief:1, priest:1 };
    save.jobLevels[jobId] = save.jobLevels[jobId] || 1;
    ensureCurrentJobEquipment();
    if(game.p){
      game.p.maxHp = maxHp();
      game.p.maxSp = maxSp();
      game.p.hp = Math.max(1, Math.round(game.p.maxHp * hpRate));
      game.p.sp = Math.round(game.p.maxSp * spRate);
      game.p.speed = playerSpeed();
    }
    persist();
    renderJobHall();
    syncUI();
    toast(`${job.name}に転職しました`);
  }

  function buyHerb(){
    if(save.gold < 10){
      toast("Gが足りません");
      return;
    }
    save.gold -= 10;
    addItem("herb", 1);
    persist();
    syncUI();
    toast("やくそうを購入しました");
    openFacility("shop", "道具屋", "ほかにも商品を増やしていく予定です。");
  }

  function smithCost(){
    return 30 + (save.weaponLevel - 1) * 25;
  }

  function upgradeWeapon(){
    const cost = smithCost();
    if(save.gold < cost){
      toast("Gが足りません");
      return;
    }
    save.gold -= cost;
    save.weaponLevel++;
    updateQuestProgress("upgrade", "weapon", 1);
    persist();
    syncUI();
    toast(`武器強化 Lv${save.weaponLevel}！`);
    renderSmith("いい感じに鍛えられたな。次は素材装備や強敵への準備だ。");
  }

  function renderQuestBoard(){
    setFacilityQuestTheme(true);
    $("facilityTitle").innerHTML = "Quest Board <small>クエスト掲示板</small>";
    const box = $("facilityContent");
    const stage = loopStageInfo();
    const guide = stage.guide;
    const total = QUEST_DEFS.length;
    const accepted = QUEST_DEFS.filter(def => quest(def.id).status === "accepted").length;
    const complete = QUEST_DEFS.filter(def => quest(def.id).status === "complete").length;
    const cleared = QUEST_DEFS.filter(def => quest(def.id).status === "cleared").length;

    function statusClass(status){
      if(status === "complete") return "complete";
      if(status === "accepted") return "accepted";
      if(status === "cleared") return "cleared";
      if(status === "locked") return "locked";
      return "none";
    }

    function questAction(def, q){
      const disabled = q.status === "locked" ? "disabled" : "";
      if(q.status === "none") return `<button id="acceptQuest_${def.id}" class="green" ${disabled}>受注</button>`;
      if(q.status === "accepted") return `<button disabled>進行中</button>`;
      if(q.status === "complete") return `<button id="reportQuest_${def.id}" class="green">報告</button>`;
      if(q.status === "cleared") return `<button id="resetQuest_${def.id}" class="blue">再受注</button>`;
      return `<button disabled>${questLabel(q)}</button>`;
    }

    function questRow(def, index){
      const q = quest(def.id);
      const pct = clamp((q.progress || 0) / Math.max(1, def.target) * 100, 0, 100);
      return `
        <div class="quest-list-row ${statusClass(q.status)}">
          <div class="quest-index">${String(index + 1).padStart(2,"0")}</div>
          <div class="quest-row-main">
            <div class="quest-row-title">
              <b>${def.title}</b>
              <span>${def.badge}</span>
              <em>${questLabel(q)}</em>
            </div>
            <p>${def.desc}</p>
            <div class="quest-mini-data">
              <i>進行 ${q.progress}/${def.target}</i>
              <i>報酬 ${rewardText(def.reward)}</i>
            </div>
            <div class="quest-row-progress"><b style="width:${pct}%"></b></div>
          </div>
          <div class="quest-row-action">${questAction(def, q)}</div>
        </div>`;
    }

    box.innerHTML = `
      <div class="quest-mmo-window">
        <div class="quest-mini-tabs">
          <span class="quest-mini-tab active">依頼一覧</span>
          <span class="quest-mini-tab">進行中</span>
          <span class="quest-mini-tab">報酬</span>
          <span class="quest-mini-logo">Village Board</span>
        </div>

        <div class="quest-mainbox">
          <div class="quest-page-title"><b>Quest</b><span>依頼を受けて、草原探索と育成を進めましょう。</span></div>

          <div class="quest-summary-grid">
            <div><b>ALL</b><span>${total}</span></div>
            <div><b>NOW</b><span>${accepted}</span></div>
            <div><b>OK</b><span>${complete}</span></div>
            <div><b>DONE</b><span>${cleared}</span></div>
          </div>

          <div class="quest-guide-card">
            <div class="quest-guide-head">
              <span>次の目標</span>
              <em>${guide.def.badge}</em>
            </div>
            <div class="quest-guide-title">${guide.def.title}<small>${questLabel(guide.q)}</small></div>
            <p>${guide.def.desc}</p>
            <div class="quest-big-progress"><i style="width:${stage.pct}%"></i></div>
            <div class="quest-guide-action">${stage.action}</div>
          </div>

          <div class="quest-loop-card">
            <b>育成ループ</b>
            <span>${growthLoopSummary()}</span>
            <small>依頼を受ける → 草原で狩る → 素材を拾う → 鍛冶屋で装備/強化 → 次の敵へ。</small>
          </div>

          <div class="quest-list-head">
            <span>No.</span><span>依頼内容</span><span>操作</span>
          </div>

          <div class="quest-list">
            ${QUEST_DEFS.map((def, index) => questRow(def, index)).join("")}
          </div>

          <div class="quest-board-note">
            <b>掲示板メモ</b>
            <span>南はぷる、中央はキノっこ、北奥はモコホーン。同時出現は最大1体なので、ザコ狩りと強敵挑戦を分けて進められます。</span>
          </div>
        </div>
      </div>`;

    setTimeout(()=>{
      for(const def of QUEST_DEFS){
        const accept = $("acceptQuest_" + def.id);
        const report = $("reportQuest_" + def.id);
        const reset = $("resetQuest_" + def.id);
        if(accept) accept.onclick = () => acceptQuest(def.id);
        if(report) report.onclick = () => reportQuest(def.id);
        if(reset) reset.onclick = () => resetQuest(def.id);
      }
    },0);
  }


  function acceptQuest(id){
    const def = QUEST_MAP[id];
    if(!def) return;
    const q = quest(id);
    if(q.status === "locked"){
      toast("まだ解放されていません");
      return;
    }
    q.status = "accepted";
    q.progress = def.type === "item" ? Math.min(def.target, itemCount(def.targetId)) : def.type === "level" ? Math.min(def.target, save.level) : 0;
    if(q.progress >= def.target) q.status = "complete";
    persist();
    renderQuestBoard();
    syncUI();
    toast("クエストを受注しました");
  }

  function reportQuest(id){
    const def = QUEST_MAP[id];
    if(!def) return;
    const q = quest(id);
    if(q.status !== "complete"){
      toast("まだ達成していません");
      return;
    }
    q.status = "cleared";
    grantQuestReward(def.reward);
    if(def.next){
      const next = quest(def.next);
      if(next.status === "locked") next.status = "none";
    }
    const caveNewlyUnlocked = syncWorldUnlocks(false);
    persist();
    renderQuestBoard();
    syncUI();
    if(caveNewlyUnlocked && def.id === "moco_challenge"){
      toast("報酬を受け取りました！ こけの洞窟へ行けるようになりました！");
    }else{
      toast("報酬を受け取りました");
    }
  }

  function resetQuest(id){
    const def = QUEST_MAP[id];
    if(!def) return;
    const q = quest(id);
    q.status = "accepted";
    q.progress = def.type === "item" ? Math.min(def.target, itemCount(def.targetId)) : def.type === "level" ? Math.min(def.target, save.level) : 0;
    if(q.progress >= def.target) q.status = "complete";
    persist();
    renderQuestBoard();
    syncUI();
    toast("クエストを再受注しました");
  }


  function useHerb(){
    if((save.inventory.herb || 0) <= 0){
      toast("やくそうがありません");
      return;
    }
    if(!game.p) return;
    save.inventory.herb--;
    const heal = 35;
    game.p.hp = Math.min(game.p.maxHp, game.p.hp + heal);
    hitText(game.p.x, game.p.y - 36, "+" + heal, true);
    burst(game.p.x, game.p.y, 14, "heal");
    toast("やくそうを使いました");
    persist();
    syncUI();
  }

  function update(dt){
    game.time += dt;
    if(!game.p) return;
    const p = game.p;

    game.attackCooldown = Math.max(0, game.attackCooldown - dt);
    game.skillCooldown = Math.max(0, (game.skillCooldown || 0) - dt);
    game.shake = Math.max(0, (game.shake || 0) - dt);
    if(game.shake > 0){
      const s = game.shake * 34;
      game.shakeX = rand(-s,s);
      game.shakeY = rand(-s,s);
    }else{
      game.shakeX = 0;
      game.shakeY = 0;
    }
    p.inv = Math.max(0, p.inv - dt);
    p.attackTimer = Math.max(0, p.attackTimer - dt);

    let mx = input.x, my = input.y;
    if(game.keys.has("arrowleft") || game.keys.has("a")) mx -= 1;
    if(game.keys.has("arrowright") || game.keys.has("d")) mx += 1;
    if(game.keys.has("arrowup") || game.keys.has("w")) my -= 1;
    if(game.keys.has("arrowdown") || game.keys.has("s")) my += 1;

    if(game.sit){
      mx = 0; my = 0;
      p.hp = Math.min(p.maxHp, p.hp + dt * 3);
      p.sp = Math.min(p.maxSp, p.sp + dt * 4);
    }else{
      p.sp = Math.min(p.maxSp, p.sp + dt * 1.2);
    }

    const mag = Math.hypot(mx,my);
    p.moving = false;
    if(mag > 0){
      mx /= Math.max(1,mag);
      my /= Math.max(1,mag);
      p.face = Math.atan2(my,mx);

      if(Math.abs(mx) >= Math.abs(my)){
        p.spriteDir = mx < 0 ? "left" : "right";
      }else{
        p.spriteDir = my < 0 ? "up" : "down";
      }

      p.moving = true;
      p.walkTime = (p.walkTime || 0) + dt;
      p.x += mx * p.speed * dt;
      p.y += my * p.speed * dt;
      p.bob += dt * 9;
      keepPlayerInMap();
    }else{
      p.walkTime = 0;
      p.bob += dt * 2.2;
    }

    updateEnemies(dt);
    if(game.map === "field" && game.drops.length) pickup(false, false);
    maintainFieldSpawns(dt);
    updateFx(dt);
    updateCamera();
    syncUI();
  }

  function keepPlayerInMap(){
    const p = game.p;
    p.x = clamp(p.x, 42, game.worldW - 42);
    p.y = clamp(p.y, 70, game.worldH - 58);

    if(game.map === "village"){
      // simple collision near houses
      const blocks = villageBlocks();
      for(const b of blocks){
        if(p.x > b.x && p.x < b.x+b.w && p.y > b.y && p.y < b.y+b.h){
          // push out nearest side
          const dl = Math.abs(p.x - b.x);
          const dr = Math.abs(p.x - (b.x+b.w));
          const dt = Math.abs(p.y - b.y);
          const db = Math.abs(p.y - (b.y+b.h));
          const m = Math.min(dl,dr,dt,db);
          if(m === dl) p.x = b.x - 1;
          else if(m === dr) p.x = b.x + b.w + 1;
          else if(m === dt) p.y = b.y - 1;
          else p.y = b.y + b.h + 1;
        }
      }
    }
  }

  function villageBlocks(){
    return [
      {x:90,y:150,w:150,h:120},
      {x:380,y:118,w:165,h:128},
      {x:690,y:154,w:150,h:116},
      {x:155,y:500,w:150,h:105},
      {x:650,y:500,w:140,h:105}
    ];
  }

  function villageObjects(){
    return [
      {x:165,y:285,name:"道具屋",kind:"shop",message:"いらっしゃい！冒険の前にやくそうを買っていくかい？"},
      {x:460,y:260,name:"鍛冶屋",kind:"smith",message:"武器を少しだけ鍛えられるぞ。序盤の火力が上がる。"},
      {x:762,y:285,name:"転職の館",kind:"job",message:"職業の研究中だよ。v0.4でファイター・メイジ・シーフを切り替えられるようにする予定。"},
      {x:230,y:626,name:"クエスト掲示板",kind:"quest",message:"草原の依頼が貼られている。"},
      {x:712,y:626,name:"倉庫",kind:"storage",message:"手に入れた素材はバッグで確認できるよ。"},
      {x:265,y:410,name:"村人",kind:"npc",message:"ここはミニアランドのはじまりの村だよ。まずは掲示板で依頼を受けて、ひだまり草原へ行ってみよう！"},
      {x:610,y:430,name:"案内人",kind:"npc",message:"村では施設やNPCを直接タップするか、下の「話す」ボタンで会話や施設メニューを開けるよ。PCならEキーでもOK！"},
      {x:505,y:324,name:"守衛",kind:"npc",message:"草原にはぷるスライムやキノっこがいる。HPが減ったら座って少し休むか、やくそうを使うんだ。"}
    ];
  }

  function nearestVillageObjectTo(x, y, maxDistance=88){
    let best = null, bestD = Infinity;
    for(const o of villageObjects()){
      const d = Math.hypot(x-o.x, y-o.y);
      if(d < bestD){ bestD = d; best = o; }
    }
    return bestD < maxDistance ? best : null;
  }

  function nearestVillageObject(){
    const p = game.p;
    return nearestVillageObjectTo(p.x, p.y, 88);
  }

  function updateEnemies(dt){
    const p = game.p;
    if(game.map !== "field") return;

    for(const e of game.enemies){
      if(e.hurt > 0) e.hurt -= dt;
      if(e.squash > 0) e.squash -= dt;

      if(Math.abs(e.knockX || 0) > .1 || Math.abs(e.knockY || 0) > .1){
        e.x += (e.knockX || 0) * dt;
        e.y += (e.knockY || 0) * dt;
        e.knockX *= Math.pow(.04, dt);
        e.knockY *= Math.pow(.04, dt);
      }

      const d = Math.hypot(p.x-e.x, p.y-e.y);
      if(e.id === "moco_horn" && save.level < 10 && d < 170 && !e.warned){
        e.warned = true;
        toast("強敵！モコホーンはLv10推奨");
      }
      const pauseByHurt = e.hurt > 0 ? (.25 + .75 * (e.stunResist || 0)) : 1;
      if(d < 205){
        const a = Math.atan2(p.y-e.y, p.x-e.x);
        if(d > e.r + p.r + 10){
          e.x += Math.cos(a) * e.speed * pauseByHurt * dt;
          e.y += Math.sin(a) * e.speed * pauseByHurt * dt;
        }else{
          e.hitCd -= dt;
          if(e.hitCd <= 0){
            e.hitCd = e.id === "moco_horn" ? rand(1.05,1.45) : rand(1.05,1.55);
            playerDamage(e.atk);
          }
        }
      }else{
        e.wanderTimer -= dt;
        if(e.wanderTimer <= 0){
          e.wanderTimer = rand(1.1,2.6);
          e.wander = rand(0, Math.PI*2);
        }
        e.x += Math.cos(e.wander) * e.speed * .22 * dt;
        e.y += Math.sin(e.wander) * e.speed * .22 * dt;
      }
      e.x = clamp(e.x, 55, game.worldW - 55);
      e.y = clamp(e.y, 80, game.worldH - 65);
    }
  }

  function updateFx(dt){
    for(const t of game.texts){ t.life -= dt; t.y -= 36*dt; }
    game.texts = game.texts.filter(t => t.life > 0);

    for(const p of game.particles){
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= Math.pow(.12, dt);
      p.vy += 130 * dt;
    }
    game.particles = game.particles.filter(p => p.life > 0);

    for(const f of game.attackFx){ f.life -= dt; }
    game.attackFx = game.attackFx.filter(f => f.life > 0);
  }

  function updateCamera(){
    const p = game.p;
    game.camX = clamp(p.x - game.w / 2, 0, Math.max(0, game.worldW - game.w));
    game.camY = clamp(p.y - game.h / 2 + 20, 0, Math.max(0, game.worldH - game.h));
  }

  function draw(){
    if(game.map === "village") drawVillage();
    else if(game.map === "cave") drawCave();
    else drawField();

    const drawables = [];
    for(const d of game.drops) drawables.push({y:d.y, type:"drop", o:d});
    for(const e of game.enemies) drawables.push({y:e.y, type:"enemy", o:e});
    drawables.push({y:game.p.y, type:"player", o:game.p});
    drawables.sort((a,b)=>a.y-b.y);

    for(const it of drawables){
      if(it.type === "drop") drawDrop(it.o);
      if(it.type === "enemy") drawEnemy(it.o);
      if(it.type === "player") drawPlayer(it.o);
    }

    drawAttackFx();
    drawParticles();
    drawTexts();
  }

  function drawVillage(){
    // sky-ish outer background not visible much, main grass
    ctx.fillStyle = "#75cc63";
    ctx.fillRect(0,0,game.w,game.h);
    drawTileGrass("#75cc63", "#68b956", "#8cda74");
    drawSoftGrassPatches([
      [72,120,150,58,"#91dc73"],[272,174,116,50,"#8bd36e"],[626,112,168,58,"#8fd874"],
      [92,612,166,64,"#88d168"],[506,585,148,52,"#92dc77"],[746,606,138,58,"#86cd67"]
    ]);

    // paths
    drawPath(440,0,104,game.worldH);
    drawPath(0,386,game.worldW,112);
    drawPath(446,388,110,120);

    // village objects
    drawHouse(90,150,150,120,"道具屋", "#d58a43");
    drawHouse(380,118,165,128,"鍛冶屋", "#b56a3b");
    drawHouse(690,154,150,116,"転職", "#7f9bd6");
    drawBoard(155,500,150,105,"掲示板");
    drawStorage(650,500,140,105,"倉庫");

    // decorations
    const trees = [
      [40,90],[285,96],[610,95],[865,105],
      [35,560],[860,555],[60,675],[850,680],
      [310,605],[590,620]
    ];
    trees.forEach(([x,y])=>drawTree(x,y));
    drawFenceLine(42,326,190);
    drawFenceLine(705,332,190);
    drawFlowerBed(285,292);
    drawFlowerBed(610,296);
    [[92,325],[246,536],[382,304],[742,334],[790,538],[518,548]].forEach(([x,y])=>drawTinyFlowers(x,y));
    [[238,335],[732,368],[716,598]].forEach(([x,y])=>drawBarrelStack(x,y));
    drawNPC(265,410,"村人");
    drawNPC(610,430,"案内人");
    drawNPC(505,324,"守衛");
    drawWell(318,355);
    drawSign(570,372,"草原→");

    // field gate
    ctx.save();
    ctx.translate(screenX(478), screenY(78));
    ctx.fillStyle="#72421f";
    ctx.fillRect(-45,-10,10,65);
    ctx.fillRect(35,-10,10,65);
    ctx.fillStyle="#b8843d";
    ctx.fillRect(-53,-18,106,20);
    ctx.strokeStyle="#4b2c14";
    ctx.lineWidth=3;
    ctx.strokeRect(-53,-18,106,20);
    ctx.fillStyle="#fff2bd";
    ctx.font="900 13px system-ui";
    ctx.textAlign="center";
    ctx.strokeStyle="#4b2c14";
    ctx.lineWidth=3;
    ctx.strokeText("ひだまり草原",0,-3);
    ctx.fillText("ひだまり草原",0,-3);
    ctx.restore();
  }

  
  
  function drawFieldRouteMarks(){
    const marks = [
      {x:640,y:900,text:"村へ戻るなら南へ"},
      {x:640,y:650,text:"中央狩場"},
      {x:640,y:330,text:"ここから北は危険"}
    ];
    for(const m of marks){
      const x = screenX(m.x), y = screenY(m.y);
      if(x < -100 || x > game.w+100 || y < -80 || y > game.h+80) continue;
      ctx.save();
      ctx.globalAlpha=.72;
      ctx.fillStyle="#5f3a1d";
      ctx.fillRect(x-4,y-24,8,32);
      ctx.fillStyle="#fff3cf";
      ctx.strokeStyle="#6c421f";
      ctx.lineWidth=3;
      ctx.fillRect(x-64,y-38,128,22);
      ctx.strokeRect(x-64,y-38,128,22);
      ctx.fillStyle="#4b301b";
      ctx.font="900 10px system-ui";
      ctx.textAlign="center";
      ctx.fillText(m.text,x,y-23);
      ctx.restore();
    }
  }

function drawSpawnZoneHints(){
    // 草原の狩場ガイド。目立ちすぎないよう薄い看板表示にする。
    const hints = [
      {x:270,y:830,text:"入口：ぷる多め"},
      {x:930,y:545,text:"中央：キノっこ"},
      {x:910,y:205,text:"北奥：モコホーン"}
    ];
    for(const h of hints){
      const x = screenX(h.x), y = screenY(h.y);
      if(x < -80 || x > game.w+80 || y < -60 || y > game.h+60) continue;
      ctx.save();
      ctx.globalAlpha=.78;
      ctx.fillStyle="#fff3cf";
      ctx.strokeStyle="#6c421f";
      ctx.lineWidth=3;
      ctx.fillRect(x-54,y-13,108,26);
      ctx.strokeRect(x-54,y-13,108,26);
      ctx.globalAlpha=1;
      ctx.fillStyle="#4b301b";
      ctx.font="900 11px system-ui";
      ctx.textAlign="center";
      ctx.fillText(h.text,x,y+4);
      ctx.restore();
    }
  }

function drawCave(){
    ctx.fillStyle = "#4b564b";
    ctx.fillRect(0,0,game.w,game.h);

    const startX = Math.floor(game.camX / 48) * 48;
    const startY = Math.floor(game.camY / 48) * 48;
    for(let y=startY; y<game.camY+game.h+48; y+=48){
      for(let x=startX; x<game.camX+game.w+48; x+=48){
        const sx = screenX(x), sy = screenY(y);
        const alt = ((x/48 + y/48) & 1) ? "#5c684f" : "#515e49";
        ctx.fillStyle = alt;
        ctx.fillRect(sx,sy,48,48);
        ctx.strokeStyle = "rgba(40,48,38,.18)";
        ctx.strokeRect(sx,sy,48,48);
        if(((x*13 + y*7) % 5) === 0){
          ctx.fillStyle = "rgba(167,196,122,.28)";
          ctx.beginPath();
          ctx.ellipse(sx+18,sy+32,10,4,0,0,Math.PI*2);
          ctx.fill();
        }
      }
    }

    // main cave path
    ctx.fillStyle = "#726858";
    ctx.strokeStyle = "#3b3d36";
    ctx.lineWidth = 4;
    const path = [
      [450, game.worldH], [450, 610], [360, 560], [390, 470], [520, 430], [620, 360], [600, 240]
    ];
    ctx.beginPath();
    ctx.moveTo(screenX(path[0][0]), screenY(path[0][1]));
    for(const [x,y] of path.slice(1)) ctx.lineTo(screenX(x), screenY(y));
    ctx.stroke();
    ctx.lineWidth = 34;
    ctx.strokeStyle = "rgba(119,104,82,.88)";
    ctx.stroke();

    // cave walls and stones
    const rocks = [[90,120],[170,210],[260,130],[760,145],[840,260],[700,590],[190,620],[870,690],[580,180],[460,300],[300,420],[650,470]];
    for(const [x,y] of rocks) drawRock(x,y);

    // glowing moss
    const moss = [[330,520],[410,448],[552,410],[612,332],[236,574],[716,530],[148,332],[792,382]];
    for(const [x,y] of moss){
      const sx=screenX(x), sy=screenY(y);
      ctx.save();
      ctx.fillStyle = "rgba(139,218,112,.35)";
      ctx.beginPath(); ctx.ellipse(sx,sy,22,7,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle = "#a6ee87";
      for(let i=0;i<5;i++){
        ctx.beginPath(); ctx.arc(sx-16+i*8, sy-rand(0,5), 2, 0, Math.PI*2); ctx.fill();
      }
      ctx.restore();
    }

    // entrance sign / temporary cave guide
    const sx = screenX(490), sy = screenY(675);
    ctx.save();
    ctx.fillStyle = "rgba(255,245,210,.94)";
    ctx.strokeStyle = "#3b3d36";
    ctx.lineWidth = 3;
    if(ctx.roundRect){ ctx.beginPath(); ctx.roundRect(sx-112, sy-54, 224, 48, 8); ctx.fill(); ctx.stroke(); }
    else { ctx.fillRect(sx-112, sy-54, 224, 48); ctx.strokeRect(sx-112, sy-54, 224, 48); }
    ctx.fillStyle = "#3d352e";
    ctx.font = "900 13px 'MS PGothic', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("こけの洞窟・入口", sx, sy-34);
    ctx.font = "900 10px 'MS PGothic', sans-serif";
    ctx.fillText("下の『洞』ボタンか入口タップでマップへ", sx, sy-18);
    ctx.restore();

    const ex = screenX(490), ey = screenY(730);
    ctx.save();
    ctx.globalAlpha = .82;
    ctx.fillStyle = "#fff2a8";
    ctx.strokeStyle = "#5c4b38";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(ex, ey, 46, 14, 0, 0, Math.PI*2);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#4d3a2b";
    ctx.font = "900 11px 'MS PGothic', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("出口", ex, ey+4);
    ctx.restore();
  }

  function drawField(){
    ctx.fillStyle = "#70c55c";
    ctx.fillRect(0,0,game.w,game.h);
    drawTileGrass("#70c55c", "#62b350", "#88d674");
    drawSoftGrassPatches([
      [120,220,170,78,"#83d36a"],[380,275,210,72,"#8bd76f"],[760,230,180,78,"#7cca63"],
      [82,760,215,82,"#86d66c"],[690,725,230,88,"#80ce66"],[898,432,170,70,"#8ad56d"]
    ]);

    drawSpawnZoneHints();
    drawFieldRouteMarks();

    // paths and small cliffs
    drawPath(0,590,game.worldW,95);
    drawPath(500,570,118,270);
    drawRiver(0,96,game.worldW,54);

    // trees / rocks / flowers
    drawFlowerBed(258,548);
    drawFlowerBed(735,545);
    [[165,515],[342,704],[482,518],[832,515],[925,702],[986,302]].forEach(([x,y])=>drawTinyFlowers(x,y));
    [[216,285],[905,262],[1020,486],[356,814]].forEach(([x,y])=>drawMushroomClump(x,y));
    drawFenceLine(120,720,230);
    drawFenceLine(730,720,230);
    const props = [];
    for(let i=0;i<40;i++){
      const x = (i*193+70) % game.worldW;
      const y = (i*97+135) % game.worldH;
      if(y>560 && y<690) continue;
      props.push([x,y,i%4]);
    }
    props.forEach(([x,y,k])=>{
      if(k===0) drawRock(x,y);
      else drawTree(x,y);
    });
    drawSign(520,648,"村←");
  }

  function drawTileGrass(base, dark, light){
    const size = 32;
    const startX = Math.floor(game.camX / size) * size;
    const startY = Math.floor(game.camY / size) * size;
    ctx.fillStyle = base;
    ctx.fillRect(0,0,game.w,game.h);
    for(let y=startY; y<game.camY+game.h+size; y+=size){
      for(let x=startX; x<game.camX+game.w+size; x+=size){
        const sx = screenX(x), sy = screenY(y);
        const n = (x*13 + y*7) % 5;
        if(n === 0){
          ctx.fillStyle = light;
          ctx.fillRect(sx+9, sy+14, 5, 3);
          ctx.fillRect(sx+15, sy+11, 4, 3);
          ctx.fillStyle = "rgba(255,255,210,.14)";
          ctx.fillRect(sx+2, sy+2, 30, 1);
        }else if(n === 1){
          ctx.fillStyle = dark;
          ctx.fillRect(sx+21, sy+19, 4, 3);
          ctx.fillRect(sx+25, sy+16, 3, 3);
        }else if(n === 2){
          ctx.fillStyle = "rgba(255,246,190,.16)";
          ctx.fillRect(sx+12, sy+25, 2, 2);
          ctx.fillRect(sx+18, sy+24, 2, 2);
        }
      }
    }
  }

  function drawSoftGrassPatches(patches){
    for(const [x,y,w,h,color] of patches){
      const sx = screenX(x), sy = screenY(y);
      if(sx + w < -60 || sx > game.w+60 || sy + h < -60 || sy > game.h+60) continue;
      ctx.save();
      ctx.globalAlpha = .52;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(sx+w*.5, sy+h*.5, w*.5, h*.5, 0, 0, Math.PI*2);
      ctx.fill();
      ctx.globalAlpha = .26;
      ctx.fillStyle = "#fff7ad";
      ctx.beginPath();
      ctx.ellipse(sx+w*.34, sy+h*.34, w*.18, h*.14, -0.4, 0, Math.PI*2);
      ctx.fill();
      ctx.restore();
    }
  }

  function drawTinyFlowers(x,y){
    const sx=screenX(x), sy=screenY(y);
    if(sx < -40 || sx > game.w+40 || sy < -40 || sy > game.h+40) return;
    const colors = ["#fff088","#ff9fbd","#9fe9ff","#f6b165"];
    ctx.save();
    ctx.translate(sx,sy);
    for(let i=0;i<7;i++){
      const px = -18 + i*6;
      const py = (i%3)*5;
      ctx.fillStyle = "#3e9440";
      ctx.fillRect(px+1, py+4, 2, 6);
      ctx.fillStyle = colors[i%colors.length];
      ctx.fillRect(px, py, 4, 4);
      ctx.fillStyle = "rgba(255,255,255,.45)";
      ctx.fillRect(px+1, py, 1, 1);
    }
    ctx.restore();
  }

  function drawMushroomClump(x,y){
    const sx=screenX(x), sy=screenY(y);
    if(sx < -45 || sx > game.w+45 || sy < -45 || sy > game.h+45) return;
    ctx.save();
    ctx.translate(sx,sy);
    ctx.fillStyle = "rgba(0,0,0,.12)";
    ctx.beginPath(); ctx.ellipse(0, 13, 25, 6, 0, 0, Math.PI*2); ctx.fill();
    const caps = [[-12,0,10,"#e87761"],[4,-4,12,"#f2935c"],[17,4,8,"#df6b64"]];
    for(const [mx,my,r,c] of caps){
      ctx.fillStyle = "#fff0ca";
      ctx.fillRect(mx-3,my+4,6,12);
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(mx,my+4,r,Math.PI,0);
      ctx.lineTo(mx+r,my+7);
      ctx.lineTo(mx-r,my+7);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#7d4738";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = "#fff7d6";
      ctx.fillRect(mx-3,my+2,3,2);
    }
    ctx.restore();
  }

  function drawBarrelStack(x,y){
    const sx=screenX(x), sy=screenY(y);
    if(sx < -50 || sx > game.w+50 || sy < -50 || sy > game.h+50) return;
    ctx.save();
    ctx.translate(sx,sy);
    const barrels = [[-14,5],[12,5],[0,-12]];
    ctx.fillStyle = "rgba(0,0,0,.15)";
    ctx.beginPath(); ctx.ellipse(0, 22, 34, 8, 0, 0, Math.PI*2); ctx.fill();
    for(const [bx,by] of barrels){
      ctx.fillStyle = "#a86733";
      ctx.fillRect(bx-10,by-9,20,22);
      ctx.fillStyle = "#d49a55";
      ctx.fillRect(bx-8,by-7,16,18);
      ctx.strokeStyle = "#5a371e";
      ctx.lineWidth = 2;
      ctx.strokeRect(bx-10,by-9,20,22);
      ctx.fillStyle = "#6b4123";
      ctx.fillRect(bx-11,by-3,22,3);
      ctx.fillRect(bx-11,by+7,22,3);
    }
    ctx.restore();
  }

  function drawPath(x,y,w,h){
    ctx.save();
    ctx.translate(screenX(x), screenY(y));
    ctx.fillStyle="rgba(67,43,22,.13)";
    ctx.fillRect(0,0,w,h);
    ctx.fillStyle="#d9b875";
    ctx.fillRect(3,3,Math.max(0,w-6),Math.max(0,h-6));
    ctx.fillStyle="rgba(255,241,185,.42)";
    ctx.fillRect(7,7,Math.max(0,w-14),3);
    ctx.fillStyle="rgba(112,75,37,.22)";
    ctx.fillRect(6,Math.max(0,h-10),Math.max(0,w-12),4);
    ctx.fillStyle="#cba765";
    for(let yy=0; yy<h; yy+=32){
      for(let xx=0; xx<w; xx+=38){
        if(((xx+yy)/32)%2<1){
          ctx.fillRect(xx+5,yy+10,10,4);
        }
      }
    }
    ctx.restore();
  }

  function drawRiver(x,y,w,h){
    ctx.save();
    ctx.translate(screenX(x), screenY(y));
    ctx.fillStyle="#48a9e6";
    ctx.fillRect(0,0,w,h);
    ctx.fillStyle="#7bd8ff";
    for(let i=0;i<w;i+=70){
      ctx.fillRect(i+10,14,38,5);
      ctx.fillRect(i+35,35,44,4);
    }
    ctx.strokeStyle="#2c7cae";
    ctx.lineWidth=4;
    ctx.strokeRect(0,0,w,h);
    ctx.restore();
  }

  function drawHouse(x,y,w,h,label,color){
    const sx = screenX(x), sy = screenY(y);
    if(sx+w < -50 || sx > game.w+50 || sy+h < -60 || sy > game.h+60) return;
    ctx.save();
    ctx.translate(sx,sy);
    ctx.fillStyle="rgba(0,0,0,.18)";
    ctx.fillRect(12,h-7,w-24,16);

    ctx.fillStyle=color;
    ctx.beginPath();
    ctx.moveTo(-10,38);
    ctx.lineTo(w/2,0);
    ctx.lineTo(w+10,38);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle="#4b2c14";
    ctx.lineWidth=4;
    ctx.stroke();

    ctx.fillStyle="#f3d69b";
    ctx.fillRect(8,36,w-16,h-38);
    ctx.strokeStyle="#4b2c14";
    ctx.lineWidth=4;
    ctx.strokeRect(8,36,w-16,h-38);

    ctx.fillStyle="#7b4a24";
    ctx.fillRect(w/2-17,h-48,34,48);
    ctx.fillStyle="#cfefff";
    ctx.fillRect(24,54,28,24);
    ctx.fillRect(w-52,54,28,24);
    ctx.strokeStyle="#4b2c14";
    ctx.lineWidth=3;
    ctx.strokeRect(24,54,28,24);
    ctx.strokeRect(w-52,54,28,24);

    ctx.fillStyle="#fff3bd";
    ctx.fillRect(w/2-42,24,84,24);
    ctx.strokeStyle="#4b2c14";
    ctx.lineWidth=3;
    ctx.strokeRect(w/2-42,24,84,24);
    ctx.fillStyle="#4b301b";
    ctx.font="900 13px system-ui";
    ctx.textAlign="center";
    ctx.fillText(label,w/2,41);
    ctx.restore();
  }

  function drawBoard(x,y,w,h,label){
    const sx=screenX(x), sy=screenY(y);
    ctx.save();
    ctx.translate(sx,sy);
    ctx.fillStyle="rgba(0,0,0,.16)";
    ctx.fillRect(12,h-2,w-24,14);
    ctx.fillStyle="#7a4f2b";
    ctx.fillRect(18,28,12,h-25);
    ctx.fillRect(w-30,28,12,h-25);
    ctx.fillStyle="#e7bd71";
    ctx.fillRect(0,0,w,64);
    ctx.strokeStyle="#4b2c14";
    ctx.lineWidth=4;
    ctx.strokeRect(0,0,w,64);
    ctx.fillStyle="#fff3bd";
    ctx.fillRect(18,15,w-36,34);
    ctx.strokeStyle="#a26b2a";
    ctx.lineWidth=2;
    ctx.strokeRect(18,15,w-36,34);
    ctx.fillStyle="#4b301b";
    ctx.font="900 14px system-ui";
    ctx.textAlign="center";
    ctx.fillText(label,w/2,38);
    ctx.restore();
  }

  function drawStorage(x,y,w,h,label){
    const sx=screenX(x), sy=screenY(y);
    ctx.save();
    ctx.translate(sx,sy);
    ctx.fillStyle="rgba(0,0,0,.17)";
    ctx.fillRect(12,h-2,w-24,14);
    ctx.fillStyle="#9f6b36";
    ctx.fillRect(0,30,w,60);
    ctx.fillStyle="#c9904b";
    ctx.fillRect(10,10,w-20,75);
    ctx.strokeStyle="#4b2c14";
    ctx.lineWidth=4;
    ctx.strokeRect(10,10,w-20,75);
    ctx.fillStyle="#ffe49d";
    ctx.fillRect(28,28,w-56,28);
    ctx.strokeStyle="#4b2c14";
    ctx.lineWidth=2;
    ctx.strokeRect(28,28,w-56,28);
    ctx.fillStyle="#4b301b";
    ctx.font="900 14px system-ui";
    ctx.textAlign="center";
    ctx.fillText(label,w/2,47);
    ctx.restore();
  }

  function drawTree(x,y){
    const sx=screenX(x), sy=screenY(y);
    if(sx < -60 || sx > game.w+60 || sy < -80 || sy > game.h+80) return;
    ctx.save();
    ctx.translate(sx,sy);
    ctx.fillStyle="rgba(0,0,0,.18)";
    ctx.beginPath();
    ctx.ellipse(0,30,23,7,0,0,Math.PI*2);
    ctx.fill();
    ctx.fillStyle="#805229";
    ctx.fillRect(-6,3,12,31);
    ctx.strokeStyle="#4b2c14";
    ctx.lineWidth=2;
    ctx.strokeRect(-6,3,12,31);
    ctx.fillStyle="#3d9b42";
    ctx.beginPath(); ctx.ellipse(0,-12,30,22,0,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(-9,-30,22,18,-.2,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(10,-32,21,18,.2,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(0,-47,17,15,0,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle="#2b6d30";
    ctx.lineWidth=2;
    ctx.beginPath(); ctx.ellipse(0,-12,30,22,0,0,Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(-9,-30,22,18,-.2,0,Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(10,-32,21,18,.2,0,Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(0,-47,17,15,0,0,Math.PI*2); ctx.stroke();
    ctx.fillStyle="#63c15e";
    ctx.beginPath(); ctx.ellipse(-12,-31,9,4,-.35,0,Math.PI*2); ctx.fill();
    ctx.fillStyle="rgba(255,255,210,.36)";
    ctx.beginPath(); ctx.ellipse(-8,-46,5,3,-.3,0,Math.PI*2); ctx.fill();
    ctx.restore();
  }

  function drawRock(x,y){
    const sx=screenX(x), sy=screenY(y);
    if(sx < -50 || sx > game.w+50 || sy < -50 || sy > game.h+50) return;
    ctx.save();
    ctx.translate(sx,sy);
    ctx.fillStyle="rgba(0,0,0,.16)";
    ctx.fillRect(-18,13,36,7);
    ctx.fillStyle="#8c98a6";
    ctx.fillRect(-20,-8,40,24);
    ctx.fillStyle="#6d7785";
    ctx.fillRect(-20,5,40,11);
    ctx.strokeStyle="#4f5966";
    ctx.lineWidth=2;
    ctx.strokeRect(-20,-8,40,24);
    ctx.fillStyle="#c6d0d8";
    ctx.fillRect(-12,-3,13,5);
    ctx.restore();
  }

  function drawWell(x,y){
    const sx=screenX(x), sy=screenY(y);
    ctx.save();
    ctx.translate(sx,sy);
    ctx.fillStyle="rgba(0,0,0,.18)";
    ctx.fillRect(-28,20,56,10);
    ctx.fillStyle="#8b6f53";
    ctx.fillRect(-24,-4,48,30);
    ctx.fillStyle="#4b6278";
    ctx.fillRect(-18,2,36,16);
    ctx.strokeStyle="#4b2c14";
    ctx.lineWidth=3;
    ctx.strokeRect(-24,-4,48,30);
    ctx.fillStyle="#7d512d";
    ctx.fillRect(-30,-35,8,37);
    ctx.fillRect(22,-35,8,37);
    ctx.fillStyle="#bd7e3e";
    ctx.beginPath();
    ctx.moveTo(-36,-33);
    ctx.lineTo(0,-62);
    ctx.lineTo(36,-33);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle="#4b2c14";
    ctx.stroke();
    ctx.restore();
  }

  function drawSign(x,y,text){
    const sx=screenX(x), sy=screenY(y);
    ctx.save();
    ctx.translate(sx,sy);
    ctx.fillStyle="#70431e";
    ctx.fillRect(-4,5,8,36);
    ctx.fillStyle="#e7bd71";
    ctx.fillRect(-39,-16,78,28);
    ctx.strokeStyle="#4b2c14";
    ctx.lineWidth=3;
    ctx.strokeRect(-39,-16,78,28);
    ctx.fillStyle="#4b301b";
    ctx.font="900 12px system-ui";
    ctx.textAlign="center";
    ctx.fillText(text,0,3);
    ctx.restore();
  }


  function drawFenceLine(x,y,w){
    const sx=screenX(x), sy=screenY(y);
    ctx.save();
    ctx.translate(sx,sy);
    ctx.fillStyle="#8a5528";
    for(let i=0;i<w;i+=28){
      ctx.fillRect(i,0,8,24);
      ctx.fillRect(i+3,-5,2,5);
    }
    ctx.fillRect(0,8,w,7);
    ctx.fillRect(0,19,w,6);
    ctx.strokeStyle="#4b2c14";
    ctx.lineWidth=1;
    ctx.strokeRect(0,8,w,7);
    ctx.strokeRect(0,19,w,6);
    ctx.restore();
  }

  function drawFlowerBed(x,y){
    const sx=screenX(x), sy=screenY(y);
    ctx.save();
    ctx.translate(sx,sy);
    ctx.fillStyle="rgba(0,0,0,.10)";
    ctx.fillRect(-36,18,72,7);
    ctx.fillStyle="#5ba846";
    ctx.fillRect(-36,-2,72,24);
    ctx.strokeStyle="#38762f";
    ctx.lineWidth=2;
    ctx.strokeRect(-36,-2,72,24);
    const colors=["#ff7aa2","#fff178","#8ee8ff","#ffa34f"];
    for(let i=0;i<10;i++){
      const px=-28+i*6+(i%2)*3;
      const py=5+(i%3)*5;
      ctx.fillStyle=colors[i%colors.length];
      ctx.fillRect(px,py,4,4);
      ctx.fillStyle="#2f7d36";
      ctx.fillRect(px+1,py+4,2,5);
    }
    ctx.restore();
  }

  function drawNPC(x,y,name){
    const sx=screenX(x), sy=screenY(y);
    ctx.save();
    ctx.translate(sx,sy);
    ctx.fillStyle="rgba(0,0,0,.21)";
    ctx.fillRect(-11,16,22,5);
    ctx.fillStyle="#f3caa3";
    ctx.fillRect(-10,-29,20,18);
    ctx.fillStyle="#5a3b23";
    ctx.fillRect(-11,-35,22,8);
    ctx.fillStyle="#e9a857";
    ctx.fillRect(-10,-12,20,26);
    ctx.fillStyle="#fff3bd";
    ctx.fillRect(-8,-5,16,6);
    ctx.fillStyle="#1f3145";
    ctx.fillRect(-5,-22,3,3);
    ctx.fillRect(4,-22,3,3);
    ctx.fillStyle="#fff2bd";
    ctx.beginPath();
    ctx.arc(0,-48,12,0,Math.PI*2);
    ctx.fill();
    ctx.strokeStyle="#4b2c14";
    ctx.lineWidth=2;
    ctx.stroke();
    ctx.fillStyle="#4b301b";
    ctx.font="900 13px system-ui";
    ctx.textAlign="center";
    ctx.fillText("!",0,-43);
    ctx.fillStyle="#fff8df";
    ctx.font="900 10px system-ui";
    ctx.strokeStyle="#1f3145";
    ctx.lineWidth=3;
    ctx.strokeText(name,0,-57);
    ctx.fillText(name,0,-57);
    ctx.restore();
  }

  function drawDrop(d){
    const item = ITEMS[d.id] || {icon:"?",name:d.id};
    const x = screenX(d.x), y = screenY(d.y);
    ctx.save();
    ctx.translate(x,y);
    ctx.fillStyle="rgba(0,0,0,.18)";
    ctx.fillRect(-8,8,16,5);
    ctx.fillStyle=d.rare ? "#dff7ff" : "#fff2a8";
    ctx.strokeStyle=d.rare ? "#3a87b7" : "#8b5a25";
    ctx.lineWidth=2;
    ctx.beginPath();
    ctx.arc(0,0,10 + Math.sin(game.time*5)*1.2,0,Math.PI*2);
    ctx.fill();
    ctx.stroke();
    if(d.rare){
      ctx.globalAlpha=.5;
      ctx.strokeStyle="#8fe8ff";
      ctx.lineWidth=2;
      ctx.beginPath();
      ctx.arc(0,0,14 + Math.sin(game.time*7)*1.6,0,Math.PI*2);
      ctx.stroke();
      ctx.globalAlpha=1;
    }
    ctx.font="14px system-ui";
    ctx.textAlign="center";
    ctx.textBaseline="middle";
    ctx.fillText(item.icon,0,1);
    ctx.restore();
  }

  function drawEnemy(e){
    const x = screenX(e.x), y = screenY(e.y);
    if(x < -70 || x > game.w+70 || y < -80 || y > game.h+80) return;

    const hurtShake = e.hurt > 0 ? Math.sin(game.time * 70) * 2.2 : 0;
    const bounce = Math.sin(game.time*4 + e.x*.01) * 2;
    const squ = Math.max(0, e.squash || 0);
    const scaleX = 1 + squ * 1.4;
    const scaleY = 1 - squ * .65;

    ctx.save();
    ctx.translate(x + hurtShake, y + bounce);
    ctx.scale(scaleX, scaleY);

    if(e.id === "puru_slime"){
      const img = e.color === "#e87062" ? spriteAssets.slimeRed : spriteAssets.slimeBlue;
      if(spriteReady(img)){
        try{
          ctx.fillStyle="rgba(0,0,0,.20)";
          ctx.fillRect(-e.r, e.r*.65, e.r*2, 6);
          ctx.drawImage(img, -29, -34, 58, 58);
          if(e.hurt > 0){
            ctx.globalAlpha=.42;
            ctx.fillStyle="#fff";
            ctx.fillRect(-29,-34,58,58);
            ctx.globalAlpha=1;
          }
          ctx.restore();
          drawEnemyHpBar(e, x, y);
          return;
        }catch(_){
          // fallback below
        }
      }
    }

    ctx.fillStyle="rgba(0,0,0,.23)";
    ctx.fillRect(-e.r, e.r*.65, e.r*2, 6);

    if(e.id === "puru_slime"){
      ctx.fillStyle="#1f3145";
      ctx.fillRect(-18,-18,36,34);
      ctx.fillRect(-12,-25,24,10);
      ctx.fillStyle=e.color;
      ctx.fillRect(-16,-16,32,30);
      ctx.fillRect(-11,-23,22,10);
      ctx.fillStyle=e.sub;
      ctx.fillRect(-9,-11,8,5);
      ctx.fillStyle="#113344";
      ctx.fillRect(-7,0,4,4);
      ctx.fillRect(5,0,4,4);
    }else if(e.id === "kinokko"){
      ctx.fillStyle="#4b301b";
      ctx.fillRect(-24,-28,48,22);
      ctx.fillStyle=e.color;
      ctx.fillRect(-22,-26,44,18);
      ctx.fillRect(-16,-34,32,14);
      ctx.fillStyle="#fff4c7";
      ctx.fillRect(-15,-28,7,5);
      ctx.fillRect(4,-32,8,5);
      ctx.fillStyle=e.sub;
      ctx.fillRect(-11,-10,22,28);
      ctx.fillStyle="#4b301b";
      ctx.fillRect(-6,1,4,4);
      ctx.fillRect(4,1,4,4);
    }else{
      ctx.fillStyle="#4b301b";
      ctx.fillRect(-22,-21,44,39);
      ctx.fillStyle=e.color;
      ctx.fillRect(-20,-19,40,35);
      ctx.fillStyle=e.sub;
      ctx.fillRect(-15,-27,8,13);
      ctx.fillRect(7,-27,8,13);
      ctx.fillStyle="#fff1c7";
      ctx.fillRect(-22,-12,8,7);
      ctx.fillRect(14,-12,8,7);
      ctx.fillStyle="#4b301b";
      ctx.fillRect(-7,-4,4,4);
      ctx.fillRect(4,-4,4,4);
    }

    if(e.hurt > 0){
      ctx.globalAlpha=.45;
      ctx.fillStyle="#fff";
      ctx.fillRect(-e.r-4,-e.r-10,(e.r+4)*2,(e.r+8)*2);
      ctx.globalAlpha=1;
    }
    ctx.restore();
    drawEnemyHpBar(e, x, y);
  }

  function drawEnemyHpBar(e, x, y){
    const bw = 48, bh = 6;
    const rate = clamp(e.hp/e.maxHp,0,1);
    const yy = y - e.r - 30;
    ctx.save();
    ctx.fillStyle="rgba(19,26,52,.92)";
    ctx.fillRect(Math.round(x - bw/2 - 2), Math.round(yy - 2), bw + 4, bh + 4);
    ctx.fillStyle="#d8c9a5";
    ctx.fillRect(Math.round(x - bw/2), Math.round(yy), bw, bh);
    ctx.fillStyle= rate < .35 ? "#f06f51" : "#62d16b";
    ctx.fillRect(Math.round(x - bw/2), Math.round(yy), Math.round(bw * rate), bh);
    ctx.strokeStyle="#0b1633";
    ctx.lineWidth=1;
    ctx.strokeRect(Math.round(x - bw/2 - 2), Math.round(yy - 2), bw + 4, bh + 4);
    ctx.fillStyle="#fff8df";
    ctx.font="900 10px 'MS PGothic', system-ui";
    ctx.textAlign="center";
    ctx.strokeStyle="#1b2348";
    ctx.lineWidth=3;
    const label = e.id === "moco_horn" ? `${e.name} Lv10推奨` : e.name;
    ctx.strokeText(label,x,yy-5);
    ctx.fillText(label,x,yy-5);
    ctx.restore();
  }

  function spriteReady(img){
    return !!(img && img.complete && img.naturalWidth > 0 && img.naturalHeight > 0);
  }

  function drawCenteredSprite(img, x, y, w, h){
    if(!spriteReady(img)) return false;
    try{
      ctx.drawImage(img, Math.round(x - w/2), Math.round(y - h/2), w, h);
      return true;
    }catch(_){
      return false;
    }
  }

  function drawCenteredSpriteFlipX(img, x, y, w, h){
    if(!spriteReady(img)) return false;
    try{
      ctx.save();
      ctx.translate(Math.round(x), Math.round(y));
      ctx.scale(-1, 1);
      ctx.drawImage(img, Math.round(-w/2), Math.round(-h/2), w, h);
      ctx.restore();
      return true;
    }catch(_){
      try{ ctx.restore(); }catch(__){}
      return false;
    }
  }

  
  // 武器の見た目をデータから描く（横向き用）。手元は前方+x方向。
  function drawWeaponSideShape(L, thrust, bob){
    const tx = thrust || 0, by = bob || 0;
    if(L.type === "staff"){
      ctx.fillStyle = L.shaft; ctx.fillRect(9+tx, -18+by, 3, 28);
      ctx.fillStyle = L.orb;   ctx.fillRect(6+tx, -24+by, 9, 9);
      ctx.fillStyle = L.core;  ctx.fillRect(8+tx, -22+by, 5, 5);
      return;
    }
    const w = L.w, sideLen = Math.round(L.len * 0.4);
    const top = -Math.floor(w/2);
    if(L.glow){
      ctx.save(); ctx.globalAlpha = .35; ctx.fillStyle = L.glow;
      ctx.fillRect(11+tx, top-2+by, sideLen+6, w+4); ctx.restore();
    }
    ctx.fillStyle = L.guard || L.grip;
    ctx.fillRect(8+tx, top-1+by, 5, w+2);
    ctx.fillStyle = L.blade;
    ctx.fillRect(13+tx, top+by, sideLen, w);
    ctx.fillStyle = L.edge || L.blade;
    ctx.fillRect(15+tx, top+1+by, Math.max(4, sideLen-5), Math.max(1, w-2));
  }

  // 武器の見た目をデータから描く（前/後ろ向き用）。手元から上方向へ刃。
  function drawWeaponFrontShape(L){
    if(L.type === "staff"){
      ctx.fillStyle = L.shaft; ctx.fillRect(18,-36,4,38);
      ctx.fillStyle = L.orb;   ctx.fillRect(13,-43,14,12);
      ctx.fillStyle = L.core;  ctx.fillRect(17,-39,6,5);
      return;
    }
    const w = L.w, len = L.len, hx = 18;
    if(L.glow){
      ctx.save(); ctx.globalAlpha = .35; ctx.fillStyle = L.glow;
      ctx.fillRect(hx-2, -len-3, w+4, len+5); ctx.restore();
    }
    ctx.fillStyle = L.blade; ctx.fillRect(hx, -len, w, len);
    ctx.fillStyle = L.edge || L.blade; ctx.fillRect(hx+1, -len+3, Math.max(1, w-3), len-3);
    ctx.fillStyle = L.guard || L.grip; ctx.fillRect(hx-4, 0, w+9, 6);
    ctx.fillStyle = L.grip; ctx.fillRect(hx, 5, w, 6);
  }

  // 武器を透過PNG画像として手元に重ねる（向きごとに配置・回転・サイズをデータ指定）。
  function drawWeaponImageLayer(wimg, wlook, cfg, p, isSide, sign, baseBob, sideStepLift){
    const x = screenX(p.x), y = screenY(p.y);
    const ga = wlook.gripAnchor || [0.3,0.74];
    const dh = cfg.h, dw = dh * (wimg.naturalWidth / wimg.naturalHeight);
    const thrust = p.attackTimer > 0 ? Math.sin((.18 - p.attackTimer)/.18 * Math.PI) : 0;
    ctx.save();
    ctx.translate(x, y + baseBob - sideStepLift);
    if(isSide && sign < 0) ctx.scale(-1, 1); // 左向きは全体ミラー（右向き数値を流用）
    ctx.translate(cfg.ox, cfg.oy);
    ctx.translate(thrust * 5, 0);
    ctx.rotate(-cfg.rot * Math.PI/180 + thrust * 0.4);
    ctx.drawImage(wimg, -ga[0]*dw, -ga[1]*dh, dw, dh);
    ctx.restore();
  }

  function canUseSwordAttackSprite(weaponId){
    if(!weaponId) return false;
    const look = weaponLook(weaponId);
    return !!look && look.type !== "staff";
  }

  function playerAttackSpriteInfo(p, weaponId){
    if(!p || p.attackTimer <= 0 || !canUseSwordAttackSprite(weaponId)) return null;
    const max = Math.max(.08, p.attackAnimMax || .18);
    const progress = clamp(1 - p.attackTimer / max, 0, .999);
    const frame = Math.min(3, Math.floor(progress * 4));
    const suffix = ["A","B","C","D"][frame];
    const a = Number.isFinite(p.face) ? p.face : 0;
    const dx = Math.cos(a);
    const dy = Math.sin(a);
    let frames;
    let flip = false;
    if(Math.abs(dx) >= Math.abs(dy) * .92){
      frames = [
        spriteAssets.playerAttackSideA,
        spriteAssets.playerAttackSideB,
        spriteAssets.playerAttackSideC,
        spriteAssets.playerAttackSideD
      ];
      flip = dx < 0;
    }else if(dy < 0){
      frames = [
        spriteAssets.playerAttackBackA,
        spriteAssets.playerAttackBackB,
        spriteAssets.playerAttackBackC,
        spriteAssets.playerAttackBackD
      ];
    }else{
      frames = [
        spriteAssets.playerAttackFrontA,
        spriteAssets.playerAttackFrontB,
        spriteAssets.playerAttackFrontC,
        spriteAssets.playerAttackFrontD
      ];
    }
    const img = frames[frame];
    if(!spriteReady(img)) return null;
    return { img, flip, frame:suffix };
  }

function drawPlayer(p){
    const x = screenX(p.x), y = screenY(p.y);
    const job = currentJob();
    const equips = save.equipment || {};
    const weaponId = equips.weapon || null;
    const headId = equips.head || null;
    const shieldId = equips.shield || null;
    const backId = equips.back || null;
    const accessoryId = equips.accessory || null;

    const dir = p.spriteDir || "down";
    const isSide = dir === "left" || dir === "right";
    const isMoving = !!(p.moving && !game.sit);
    const t = p.walkTime || 0;
    const step = isMoving ? Math.sin(t * 15) : 0;
    const footPhase = isMoving ? Math.floor(t * 8) % 2 : 0;

    // 横向きは足のA/B差分を使わず、安定した横向き1枚を使う。
    // 代わりに足元の小さい砂埃・影・軽い上下だけで歩行感を出す。
    // これで「同じ足が前に出続けて見える」破綻を避ける。
    const baseBob = game.sit ? 3 : Math.sin(p.bob) * (isSide ? 0.55 : 1.15);
    const sideStepLift = isSide && isMoving ? Math.abs(step) * 0.9 : 0;
    const drawX = x;
    const drawY = y - 2 + baseBob - sideStepLift;

    const walkFrame = isMoving ? Math.floor(t * 8) % 4 : 0;
    let baseImg = null;
    if(dir === "up"){
      const frames = [spriteAssets.playerBackA, spriteAssets.playerBackB, spriteAssets.playerBackC, spriteAssets.playerBackD];
      baseImg = isMoving ? frames[walkFrame] : spriteAssets.playerBack;
      if(!baseImg) baseImg = spriteAssets.playerBackA || spriteAssets.playerBackB || spriteAssets.playerBack;
    }else if(isSide){
      const frames = [spriteAssets.playerSideA, spriteAssets.playerSideB, spriteAssets.playerSideC, spriteAssets.playerSideD];
      baseImg = isMoving ? frames[walkFrame] : spriteAssets.playerSide;
      if(!baseImg) baseImg = spriteAssets.playerSideA || spriteAssets.playerSideB || spriteAssets.playerSide;
    }else{
      const frames = [spriteAssets.playerFrontA, spriteAssets.playerFrontB, spriteAssets.playerFrontC, spriteAssets.playerFrontD];
      baseImg = isMoving ? frames[walkFrame] : spriteAssets.playerFront;
      if(!baseImg) baseImg = spriteAssets.playerFrontA || spriteAssets.playerFrontB || spriteAssets.playerFront;
    }

    const flipX = dir === "left";
    const sign = flipX ? -1 : 1;
    const attackSprite = playerAttackSpriteInfo(p, weaponId);
    const usingAttackSprite = !!attackSprite;
    if(usingAttackSprite) baseImg = attackSprite.img;

    // 足元影
    ctx.save();
    ctx.globalAlpha = isMoving ? .23 : .20;
    ctx.fillStyle = "#1e2b24";
    ctx.beginPath();
    const shadowW = isSide && isMoving ? 19 + Math.abs(step) * 2 : 18;
    const shadowH = isSide && isMoving ? 4.4 - Math.abs(step) * 0.6 : 4.8;
    ctx.ellipse(x, y + 20, shadowW, Math.max(3.4, shadowH), 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 横歩き用の足元ステップ演出
    if(isSide && isMoving){
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(sign, 1);
      ctx.globalAlpha = .28;
      ctx.fillStyle = "#f6e0a6";
      ctx.strokeStyle = "rgba(94,63,32,.28)";
      ctx.lineWidth = 1;

      // 進行方向の後ろ側に、小さい砂埃を交互に出す
      const puffX = footPhase === 0 ? -17 : -10;
      const puffY = footPhase === 0 ? 18 : 19;
      ctx.beginPath();
      ctx.ellipse(puffX, puffY, 4.5, 2.2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.globalAlpha = .18;
      ctx.beginPath();
      ctx.ellipse(puffX - 6, puffY + 1, 2.5, 1.4, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // 画像武器（透過PNG）の判定。あれば四角描画の代わりに画像を重ねる。
    const wlook = weaponId ? weaponLook(weaponId) : null;
    const wimg = wlook?.img ? spriteAssets[wlook.img] : null;
    const useWimg = !!(wlook && wlook.img && spriteReady(wimg) && wlook.view);
    const wview = isSide ? "side" : (dir === "up" ? "up" : "down");
    const wcfg = useWimg ? wlook.view[wview] : null;
    const wBehind = !!(wcfg && wcfg.behind);

    if(useWimg && wcfg && wBehind && !usingAttackSprite){
      drawWeaponImageLayer(wimg, wlook, wcfg, p, isSide, sign, baseBob, sideStepLift);
    }

    let drawn = false;
    if(spriteReady(baseImg)){
      try{
        ctx.save();
        ctx.translate(Math.round(drawX), Math.round(drawY + (usingAttackSprite ? -4 : 0)));
        const spriteScale = usingAttackSprite ? (attackSprite.flip ? -1 : 1) : (isSide ? sign : 1);
        const spriteSize = usingAttackSprite ? 76 : 54;
        if(spriteScale !== 1) ctx.scale(spriteScale, 1);
        ctx.drawImage(baseImg, -spriteSize/2, -spriteSize/2, spriteSize, spriteSize);
        ctx.restore();
        drawn = true;
      }catch(_){
        try{ ctx.restore(); }catch(__){}
      }
    }

    if(drawn){
      if(usingAttackSprite){
        ctx.fillStyle="#fff8df";
        ctx.font="900 10px system-ui";
        ctx.textAlign="center";
        ctx.strokeStyle="#1f3145";
        ctx.lineWidth=3;
        ctx.strokeText(job.name, x, y-58);
        ctx.fillText(job.name, x, y-58);
        return;
      }

      ctx.save();
      ctx.translate(x, y + baseBob - sideStepLift);

      if(backId === "novice_cape"){
        ctx.fillStyle = "#7478c9";
        ctx.fillRect(-15,-12,30,27);
        ctx.fillStyle = "#5358a8";
        ctx.fillRect(-13,3,26,10);
      }

      if(headId === "mage_hat"){
        ctx.fillStyle="#2d2148";
        ctx.beginPath();
        ctx.moveTo(-21,-39);
        ctx.lineTo(0,-68);
        ctx.lineTo(21,-39);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle="#7b4bd1";
        ctx.fillRect(-23,-42,46,7);
        ctx.fillStyle="#ffe36d";
        ctx.fillRect(-5,-55,10,5);
      }else if(headId === "thief_hood"){
        ctx.fillStyle="#244a38";
        ctx.fillRect(-15,-42,30,12);
        ctx.fillRect(-11,-48,22,8);
        ctx.fillStyle="#71d18a";
        ctx.fillRect(-16,-36,32,4);
      }

      if(isSide){
        const thrust = p.attackTimer > 0 ? Math.sin((.18-p.attackTimer)/.18*Math.PI) * 8 : 0;
        const weaponBob = isMoving ? step * 0.45 : 0;

        ctx.save();
        ctx.scale(sign, 1);

        if(shieldId === "small_shield"){
          ctx.fillStyle="#d9efff";
          ctx.fillRect(-18,-6 + weaponBob,10,14);
          ctx.strokeStyle="#315b93";
          ctx.lineWidth=2;
          ctx.strokeRect(-18,-6 + weaponBob,10,14);
          ctx.fillStyle="#b7dfff";
          ctx.fillRect(-16,-4 + weaponBob,6,10);
        }

        if(weaponId && !useWimg) drawWeaponSideShape(weaponLook(weaponId), thrust, weaponBob);

        if(accessoryId === "bronze_ring"){
          ctx.fillStyle="#d8923a";
          ctx.fillRect(4,0,4,4);
          ctx.fillStyle="#fff2a8";
          ctx.fillRect(5,1,1,1);
        }

        ctx.restore();
      }else{
        ctx.save();
        ctx.rotate(p.face + Math.PI/2);
        const swing = p.attackTimer > 0 ? Math.sin((.18-p.attackTimer)/.18*Math.PI)*.55 : 0;
        ctx.rotate(-.35 + swing);

        if(weaponId && !useWimg) drawWeaponFrontShape(weaponLook(weaponId));
        ctx.restore();

        if(shieldId === "small_shield"){
          ctx.fillStyle="#d9efff";
          ctx.fillRect(-24,-8,11,16);
          ctx.strokeStyle="#315b93";
          ctx.lineWidth=2;
          ctx.strokeRect(-24,-8,11,16);
        }

        if(accessoryId === "bronze_ring"){
          ctx.fillStyle="#d8923a";
          ctx.fillRect(15,-3,5,5);
          ctx.fillStyle="#fff2a8";
          ctx.fillRect(16,-2,2,2);
        }
      }

      ctx.restore();

      if(useWimg && wcfg && !wBehind){
        drawWeaponImageLayer(wimg, wlook, wcfg, p, isSide, sign, baseBob, sideStepLift);
      }

      ctx.fillStyle="#fff8df";
      ctx.font="900 10px system-ui";
      ctx.textAlign="center";
      ctx.strokeStyle="#1f3145";
      ctx.lineWidth=3;
      ctx.strokeText(job.name, x, y-58);
      ctx.fillText(job.name, x, y-58);
      return;
    }

    const fallback = spriteAssets.playerFrontA || spriteAssets.playerFront || spriteAssets.playerSideA || spriteAssets.playerBackA;
    if(spriteReady(fallback)){
      drawCenteredSprite(fallback, x, y - 2 + baseBob, 54, 54);
    }
  }

  function drawAttackFx(){
    for(const f of game.attackFx){
      const x = screenX(f.x), y = screenY(f.y);
      const rate = f.life / f.max;
      ctx.save();
      ctx.translate(x,y);
      ctx.rotate(f.a);
      ctx.globalAlpha=clamp(rate,0,1);
      if(f.kind === "fighterSlash"){
        ctx.strokeStyle="#fff8df";
        ctx.lineWidth=13;
        ctx.lineCap="round";
        ctx.beginPath();
        ctx.arc(10,0,f.range,-.76,.76);
        ctx.stroke();
        ctx.strokeStyle="#ffcc4d";
        ctx.lineWidth=6;
        ctx.beginPath();
        ctx.arc(10,0,f.range-5,-.66,.66);
        ctx.stroke();
        ctx.strokeStyle="#ff8b32";
        ctx.lineWidth=2;
        ctx.beginPath();
        ctx.arc(10,0,f.range+5,-.50,.50);
        ctx.stroke();
        ctx.fillStyle="#fff2a8";
        for(let i=20;i<f.range;i+=16){ ctx.fillRect(i,-3,8,6); }
      }else if(f.kind === "priest"){
        ctx.strokeStyle="#fff6c8";
        ctx.lineWidth=6;
        ctx.beginPath();
        ctx.moveTo(18,0);
        ctx.lineTo(f.range,0);
        ctx.stroke();
        ctx.fillStyle="#8fe8ff";
        for(let i=34;i<f.range;i+=28){ ctx.fillRect(i,-3,8,6); }
        ctx.fillStyle="#fff8df";
        ctx.fillRect(f.range-7,-7,14,14);
      }else if(f.kind === "priestHeal"){
        ctx.rotate(-f.a);
        ctx.strokeStyle="#fff6c8";
        ctx.lineWidth=5;
        ctx.beginPath();
        ctx.arc(0,0,26 + (1-rate)*12,0,Math.PI*2);
        ctx.stroke();
        ctx.fillStyle="#66e080";
        ctx.fillRect(-3,-24,6,48);
        ctx.fillRect(-24,-3,48,6);
      }else if(f.kind === "mage"){
        ctx.strokeStyle="#e7c8ff";
        ctx.lineWidth=6;
        ctx.beginPath();
        ctx.moveTo(18,0);
        ctx.lineTo(f.range,0);
        ctx.stroke();
        ctx.fillStyle="#9b5cff";
        for(let i=34;i<f.range;i+=26){ ctx.fillRect(i,-4,8,8); }
        ctx.fillStyle="#fff8df";
        ctx.fillRect(f.range-8,-8,16,16);
      }else if(f.kind === "mageFirebolt"){
        const glow = 1 + (1-rate) * 6;
        ctx.strokeStyle="#ffd27a";
        ctx.lineWidth=8;
        ctx.lineCap="round";
        ctx.beginPath();
        ctx.moveTo(18,0);
        ctx.lineTo(f.range,0);
        ctx.stroke();
        ctx.strokeStyle="#ff6a2a";
        ctx.lineWidth=4;
        ctx.beginPath();
        ctx.moveTo(26,0);
        ctx.lineTo(f.range,0);
        ctx.stroke();
        ctx.fillStyle="#fff2a8";
        for(let i=40;i<f.range;i+=32){ ctx.fillRect(i,-3,10,6); }
        ctx.fillStyle="#ff4b1f";
        ctx.beginPath();
        ctx.arc(f.range,0,10+glow,0,Math.PI*2);
        ctx.fill();
        ctx.fillStyle="#fff8df";
        ctx.beginPath();
        ctx.arc(f.range-2,-2,5+glow*.35,0,Math.PI*2);
        ctx.fill();
      }else if(f.kind === "thief"){
        ctx.strokeStyle="#d8ffe0";
        ctx.lineWidth=5;
        ctx.lineCap="square";
        ctx.beginPath();
        ctx.arc(0,0,f.range,-.45,.45);
        ctx.stroke();
        ctx.strokeStyle="#71d18a";
        ctx.lineWidth=2;
        ctx.beginPath();
        ctx.arc(0,0,f.range+8,-.25,.25);
        ctx.stroke();
      }else{
        ctx.strokeStyle="#fff8df";
        ctx.lineWidth=7;
        ctx.lineCap="square";
        ctx.beginPath();
        ctx.arc(0,0,f.range,-.55,.55);
        ctx.stroke();
        ctx.strokeStyle="#ffd04c";
        ctx.lineWidth=3;
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  function drawParticles(){
    for(const p of game.particles){
      const x = screenX(p.x), y = screenY(p.y);
      ctx.save();
      ctx.globalAlpha=clamp(p.life/p.max,0,1);
      if(p.type==="drop") ctx.fillStyle="#ffd24a";
      else if(p.type==="pickup") ctx.fillStyle="#fff2a8";
      else if(p.type==="heal") ctx.fillStyle="#66e080";
      else if(p.type==="level") ctx.fillStyle="#84e9ff";
      else if(p.type==="hurt") ctx.fillStyle="#ff665e";
      else if(p.type==="slash") ctx.fillStyle="#ffcc4d";
      else if(p.type==="fire") ctx.fillStyle=p.life > p.max*.5 ? "#ff8b32" : "#fff2a8";
      else if(p.type==="miss") ctx.fillStyle="#b6c8d8";
      else ctx.fillStyle="#fff8df";
      ctx.fillRect(x-p.size/2,y-p.size/2,p.size,p.size);
      ctx.restore();
    }
  }

  function drawTexts(){
    for(const t of game.texts){
      const x = screenX(t.x), y = screenY(t.y);
      ctx.save();
      ctx.globalAlpha=clamp(t.life/.85,0,1);
      ctx.font="900 14px system-ui";
      ctx.textAlign="center";
      ctx.strokeStyle="#1f3145";
      ctx.lineWidth=4;
      ctx.fillStyle=t.good ? "#fff37a" : "#ffffff";
      ctx.strokeText(t.text,x,y);
      ctx.fillText(t.text,x,y);
      ctx.restore();
    }
  }

  function syncUI(){
    $("lvText").textContent = save.level;
    $("goldText").textContent = save.gold;
    const menuGoldLabel = $("menuGoldLabel"); if(menuGoldLabel) menuGoldLabel.textContent = save.gold;
    $("mapText").textContent = mapDisplayName(game.map);
    $("expText").textContent = `${save.exp}/${needExp()} あと${expToNext()}`;
    $("expFill").style.width = `${clamp(save.exp/needExp()*100,0,100)}%`;

    const p = game.p;
    if(p){
      $("hpText").textContent = `${Math.ceil(p.hp)}/${p.maxHp}`;
      $("spText").textContent = `${Math.ceil(p.sp)}/${p.maxSp}`;
      $("hpFill").style.width = `${clamp(p.hp/p.maxHp*100,0,100)}%`;
      $("spFill").style.width = `${clamp(p.sp/p.maxSp*100,0,100)}%`;
    }
    const interactBtn = $("interactBtn");
    if(interactBtn){
      const talkSmall = game.map === "village" ? "TALK" : game.map === "cave" ? "CAVE" : "AUTO";
      const talkMain = game.map === "village" ? "話" : game.map === "cave" ? "洞" : "調";
      interactBtn.innerHTML = `<small>${talkSmall}</small><span>${talkMain}</span>`;
      interactBtn.title = game.map === "village" ? "近くのNPC・施設に話しかける" : game.map === "cave" ? "洞窟入口です。マップから移動できます" : "ドロップは自動取得です";
    }
    const sitBtn = $("sitBtn");
    if(sitBtn){
      sitBtn.innerHTML = `<small>${game.sit ? "STOP" : "REST"}</small><span>${game.sit ? "解" : "座"}</span>`;
      sitBtn.classList.toggle("blue", !!game.sit);
      sitBtn.title = game.sit ? "休憩をやめる" : "座ってHP/SPを回復する";
    }
    const job = currentJob();
    $("charInfo").textContent = `Lv${save.level} / ${job.name} / 次Lvまであと${expToNext()}EXP / G ${save.gold}`;
    const weapon = EQUIPMENT[save.equipment?.weapon]?.name || "武器なし";
    const body = EQUIPMENT[save.equipment?.body]?.name || "胴なし";
    $("equipInfo").textContent = `${body} / ${weapon} Lv${save.weaponLevel} / ATK ${atk()} / MAT ${mat()}`;
    const si = $("statusInfo"); if(si) si.textContent = `${statSummaryText()} / 未使用${availableStatPoints()}pt`;
    const ti = $("testInfo"); if(ti) ti.textContent = `Lv/素材/敵出現/プリセット`;
    const ji = $("jobInfo"); if(ji) ji.textContent = `${job.type}：${job.summary} / 専用：${job.skillName || "未実装"}`;
    const jh = $("jobHud");
    if(jh){
      const cd = game.skillCooldown > 0 ? ` / 技CT ${game.skillCooldown.toFixed(1)}s` : "";
      jh.innerHTML = `職業：<span>${job.icon} ${job.name}</span> / ${job.attackName || "通常攻撃"} / 技：${job.skillName || "未実装"}${cd}`;
    }
    const shortSkill = skillShortLabel(job);

    const herbRoundBtn = $("herbRoundBtn");
    const herbRoundCount = $("herbRoundCount");
    const herbCount = save.inventory?.herb || 0;
    if(herbRoundBtn){
      herbRoundBtn.classList.toggle("empty", herbCount <= 0);
      herbRoundBtn.title = herbCount > 0 ? `やくそう：${herbCount}個` : "やくそうがありません";
    }
    if(herbRoundCount) herbRoundCount.textContent = String(herbCount);

    const skillRoundBtn = $("skillRoundBtn");
    if(skillRoundBtn){
      const small = skillRoundBtn.querySelector("small");
      const span = skillRoundBtn.querySelector("span");
      if(small) small.textContent = game.skillCooldown > 0 ? `CT${Math.ceil(game.skillCooldown)}` : "技";
      if(span) span.textContent = shortSkill;
      skillRoundBtn.classList.toggle("cooling", game.skillCooldown > 0);
      skillRoundBtn.classList.toggle("disabled-skill", !skillReady());
      skillRoundBtn.title = `${job.skillName || "技"}：${skillStatusText()}`;
    }

    const guide = currentGuideQuest();
    $("questInfo").textContent = `${guide.def.title}：${questLabel(guide.q)} / ${growthLoopSummary()}`;
  }

  function openBag(filter="all"){
    const content = $("bagContent");
    const entries = Object.entries(save.inventory || {}).filter(([,n])=>n>0);
    const filters = [
      {id:"all", label:"すべて"},
      {id:"material", label:"素材"},
      {id:"rare", label:"レア素材"},
      {id:"consume", label:"消費"}
    ];
    const typeOf = (id) => (ITEMS[id]?.type || "不明");
    const filtered = entries.filter(([id])=>{
      const type = typeOf(id);
      if(filter === "material") return type === "素材";
      if(filter === "rare") return type === "レア素材";
      if(filter === "consume") return type === "消費";
      return true;
    });
    const totalCount = entries.reduce((sum,[,n])=>sum+n,0);
    const materialCount = entries.filter(([id])=>typeOf(id)==="素材").reduce((sum,[,n])=>sum+n,0);
    const rareCount = entries.filter(([id])=>typeOf(id)==="レア素材").reduce((sum,[,n])=>sum+n,0);
    const consumeCount = entries.filter(([id])=>typeOf(id)==="消費").reduce((sum,[,n])=>sum+n,0);

    content.innerHTML = `
      <div class="bag-window">
        <div class="bag-tabs">
          <span class="active">バッグ</span>
          <span>素材</span>
          <span>消費</span>
        </div>

        <div class="bag-summary">
          <div><b>ALL</b><span>${totalCount}</span></div>
          <div><b>素材</b><span>${materialCount}</span></div>
          <div><b>レア</b><span>${rareCount}</span></div>
          <div><b>消費</b><span>${consumeCount}</span></div>
        </div>

        <div class="bag-filter-tabs">
          ${filters.map(f=>`<button id="bagFilter_${f.id}" class="${filter===f.id?"active":""}">${f.label}</button>`).join("")}
        </div>

        <div class="bag-list">
          ${filtered.length ? filtered.map(([id,count])=>{
            const item = ITEMS[id] || {name:id,type:"不明",icon:"?"};
            const usable = id === "herb";
            return `
              <div class="bag-item-row ${item.type==="レア素材" ? "rare" : ""}">
                <div class="bag-item-icon">${item.icon}</div>
                <div class="bag-item-main">
                  <b>${item.name}</b>
                  <small>${item.type}</small>
                </div>
                <div class="bag-item-count">×${count}</div>
                <div class="bag-item-action">
                  ${usable ? `<button id="bagUse_${id}" class="green">使う</button>` : `<span>保管</span>`}
                </div>
              </div>`;
          }).join("") : `<div class="bag-empty"><b>該当アイテムはありません</b><span>草原で素材を拾うとここに入ります。</span></div>`}
        </div>

        <div class="bag-note">
          <b>所持素材</b>
          <span>${materialInventoryText()}</span>
        </div>

        <div class="bag-actions">
          <button id="bagOpenEquipBtn" class="green">装備画面を開く</button>
          <button id="bagCloseBottomBtn">閉じる</button>
        </div>
      </div>`;

    setTimeout(()=>{
      for(const f of filters){
        const btn = $("bagFilter_" + f.id);
        if(btn) btn.onclick = () => openBag(f.id);
      }
      const herbBtn = $("bagUse_herb");
      if(herbBtn) herbBtn.onclick = () => { useHerb(); openBag(filter); };
      const equipBtn = $("bagOpenEquipBtn");
      if(equipBtn) equipBtn.onclick = openEquipmentScreen;
      const closeBtn = $("bagCloseBottomBtn");
      if(closeBtn) closeBtn.onclick = () => $("bagOverlay").classList.remove("show");
    },0);
    $("bagOverlay").classList.add("show");
  }

  function openMenu(){
    syncUI();
    $("menuOverlay").classList.add("show");
  }

  function drawTitleCharacters(w,h){
    tctx.clearRect(0,0,w,h);
    tctx.fillStyle="#8bd56c";
    tctx.fillRect(0,0,w,h);
    for(let x=0;x<w;x+=30){
      tctx.fillStyle=x%60===0?"#78c75c":"#9ce27c";
      tctx.fillRect(x, h-30, 18, 5);
    }
    // small monsters and player
    drawMiniTitlePlayer(tctx, w*.25, h*.65);
    drawMiniTitleSlime(tctx, w*.52, h*.68, "#59c7ff");
    drawMiniTitleSlime(tctx, w*.66, h*.66, "#e87062");
    drawMiniTitleTree(tctx, w*.83, h*.72);
  }

  function drawMiniTitlePlayer(c,x,y){
    c.save(); c.translate(x,y); c.scale(1.8,1.8);
    c.fillStyle="rgba(0,0,0,.2)"; c.fillRect(-8,12,16,4);
    c.fillStyle="#4f82c8"; c.fillRect(-8,-7,16,18);
    c.fillStyle="#f4e3bd"; c.fillRect(-7,-11,14,17);
    c.fillStyle="#f3caa3"; c.fillRect(-7,-25,14,13);
    c.fillStyle="#7b4d27"; c.fillRect(-8,-29,16,6);
    c.fillStyle="#1f3145"; c.fillRect(-4,-20,2,2); c.fillRect(3,-20,2,2);
    c.fillStyle="#dfe7ef"; c.fillRect(12,-16,3,22);
    c.restore();
  }

  function drawMiniTitleSlime(c,x,y,color){
    c.save(); c.translate(x,y); c.scale(1.7,1.7);
    c.fillStyle="rgba(0,0,0,.18)"; c.fillRect(-11,12,22,4);
    c.fillStyle=color; c.fillRect(-12,-10,24,22); c.fillRect(-8,-17,16,7);
    c.fillStyle="#fff"; c.globalAlpha=.6; c.fillRect(-7,-5,5,3); c.globalAlpha=1;
    c.fillStyle="#1f3145"; c.fillRect(-5,2,2,2); c.fillRect(4,2,2,2);
    c.restore();
  }

  function drawMiniTitleTree(c,x,y){
    c.save(); c.translate(x,y); c.scale(1.5,1.5);
    c.fillStyle="#805229"; c.fillRect(-5,-8,10,28);
    c.fillStyle="#3d9b42"; c.fillRect(-22,-30,44,26); c.fillRect(-15,-46,30,22);
    c.restore();
  }

  function loop(now){
    const dt = Math.min(.033, (now - last)/1000 || .016);
    last = now;
    if(game.running) update(dt);
    draw();
    raf = requestAnimationFrame(loop);
  }

  // controls
  const stick = $("stick");
  const knob = $("stickKnob");

  function pointerPos(ev, el){
    const r = el.getBoundingClientRect();
    return {x:ev.clientX-r.left, y:ev.clientY-r.top};
  }

  function moveStick(ev){
    const p = pointerPos(ev, stick);
    const cx = stick.clientWidth/2;
    const cy = stick.clientHeight/2;
    let dx = p.x - cx;
    let dy = p.y - cy;
    const max = 38;
    const m = Math.hypot(dx,dy);
    if(m > max){
      dx = dx/m*max;
      dy = dy/m*max;
    }
    input.x = dx/max;
    input.y = dy/max;
    knob.style.transform = `translate(${dx}px,${dy}px)`;
    if(Math.hypot(input.x,input.y) > .15) game.sit = false;
  }

  function updateStickAimFromPointer(ev){
    const screen = pointerScreenPosFromClient(ev.clientX, ev.clientY);
    gesture.currentX = screen.x;
    gesture.currentY = screen.y;
    const dx = gesture.currentX - gesture.startX;
    const dy = gesture.currentY - gesture.startY;
    const dist = Math.hypot(dx, dy);
    const max = 38;
    const m = Math.max(1, dist);
    const kx = dx / m * Math.min(max, dist);
    const ky = dy / m * Math.min(max, dist);
    input.x = 0;
    input.y = 0;
    knob.style.transform = `translate(${kx}px,${ky}px)`;
    showSkillAimOverlay();
    updateSkillAimOverlay();
  }

  function beginStickGesture(ev){
    const screen = pointerScreenPosFromClient(ev.clientX, ev.clientY);
    gesture.active = true;
    gesture.aiming = false;
    gesture.pointerId = ev.pointerId;
    gesture.source = "stick";
    gesture.startX = screen.x;
    gesture.startY = screen.y;
    gesture.currentX = screen.x;
    gesture.currentY = screen.y;
    gesture.startWorld = null;
    gesture.startEnemy = null;
    gesture.startVillageObject = null;
    gesture.tapCanceled = false;
    gesture.blockedReason = !(game.map === "field" || game.map === "cave") ? "non-combat-map"
      : !hasJobSkill(currentJob()) ? "no-skill"
      : "";
    setInputDebug({
      state:"punicon",
      tap:"stick",
      longPress:gesture.blockedReason ? "blocked" : "pending",
      flickDist:0,
      flickAngle:0,
      result:gesture.blockedReason || "hold"
    });
    if(!gesture.blockedReason){
      if(stick) stick.classList.add("holding");
      gesture.timer = setTimeout(()=>{
        beginGestureAim();
      }, GESTURE_LONG_PRESS_MS);
    }
  }

  function endStick(ev){
    if(ev.pointerId !== input.id) return;
    ev.preventDefault();
    const wasAiming = gesture.active && gesture.pointerId === ev.pointerId && gesture.source === "stick" && gesture.aiming;
    if(wasAiming){
      updateStickAimFromPointer(ev);
      finishGestureAim();
      resetGesture();
    }else if(gesture.active && gesture.pointerId === ev.pointerId && gesture.source === "stick"){
      resetGesture();
    }
    input.active=false;
    input.id=null;
    input.x=0;
    input.y=0;
    knob.style.transform="translate(0,0)";
    if(!wasAiming) setInputDebug({ state:"idle", tap:"-", longPress:"-", flickDist:0, flickAngle:0, result:"stick-end" });
  }

  function cancelStick(ev){
    if(ev.pointerId !== input.id) return;
    ev.preventDefault();
    if(gesture.active && gesture.pointerId === ev.pointerId && gesture.source === "stick"){
      setInputDebug({ state:"cancelled", tap:"stick", longPress:"cancelled", result:"punicon-cancel" });
      resetGesture();
    }
    input.active=false;
    input.id=null;
    input.x=0;
    input.y=0;
    knob.style.transform="translate(0,0)";
  }

  stick.addEventListener("pointerdown", ev=>{
    if(isGameplayPointerBlocked()) return;
    ev.preventDefault();
    ev.stopPropagation();
    if(gesture.active) resetGesture();
    input.active=true;
    input.id=ev.pointerId;
    stick.setPointerCapture(ev.pointerId);
    beginStickGesture(ev);
    moveStick(ev);
  });
  stick.addEventListener("pointermove", ev=>{
    if(input.active && ev.pointerId === input.id){
      ev.preventDefault();
      if(gesture.active && gesture.pointerId === ev.pointerId && gesture.source === "stick" && gesture.aiming){
        updateStickAimFromPointer(ev);
      }else{
        moveStick(ev);
        if(gesture.active && gesture.pointerId === ev.pointerId && gesture.source === "stick"){
          const screen = pointerScreenPosFromClient(ev.clientX, ev.clientY);
          const moved = Math.hypot(screen.x - gesture.startX, screen.y - gesture.startY);
          if(moved > 26){
            clearGestureTimer();
            if(stick) stick.classList.remove("holding");
            gesture.blockedReason = "move";
            setInputDebug({ state:"stick-move", tap:"stick", longPress:"cancelled", flickDist:moved, result:"move" });
          }
        }
      }
    }
  });
  stick.addEventListener("pointerup", endStick);
  stick.addEventListener("pointercancel", cancelStick);

  const attackBtn = $("attackBtn");
  if(attackBtn) attackBtn.addEventListener("pointerdown", ev=>{ ev.preventDefault(); playerAttack(); });
  const pickupBtn = $("pickupBtn");
  if(pickupBtn) pickupBtn.addEventListener("pointerdown", ev=>{ ev.preventDefault(); pickup(); });
  const interactBtn = $("interactBtn");
  if(interactBtn) interactBtn.addEventListener("pointerdown", ev=>{
    ev.preventDefault();
    if(game.map === "cave"){
      openWorldMap();
      toast("ワールドマップを開きました");
    }else{
      pickup();
    }
  });
  const sitBtn = $("sitBtn");
  if(sitBtn) sitBtn.addEventListener("pointerdown", ev=>{ ev.preventDefault(); toggleSit(); });
  const herbRoundBtn = $("herbRoundBtn");
  if(herbRoundBtn) herbRoundBtn.addEventListener("pointerdown", ev=>{ ev.preventDefault(); useHerb(); });
  const skillRoundBtn = $("skillRoundBtn");
  if(skillRoundBtn) skillRoundBtn.addEventListener("pointerdown", ev=>{ ev.preventDefault(); ev.stopPropagation(); useJobSkill(); });

  function isGameplayPointerBlocked(){
    return !gameScreen.classList.contains("active")
      || $("menuOverlay").classList.contains("show")
      || $("bagOverlay").classList.contains("show")
      || $("facilityOverlay").classList.contains("show")
      || $("worldMapOverlay").classList.contains("show")
      || $("dialogueBox").classList.contains("show");
  }

  function pointerScreenPos(ev){
    const rect = canvas.getBoundingClientRect();
    return {
      x:(ev.clientX - rect.left) * (canvas.style.width ? game.w / rect.width : 1),
      y:(ev.clientY - rect.top) * (canvas.style.height ? game.h / rect.height : 1)
    };
  }

  function pointerScreenPosFromClient(clientX, clientY){
    const rect = canvas.getBoundingClientRect();
    return {
      x:(clientX - rect.left) * (canvas.style.width ? game.w / rect.width : 1),
      y:(clientY - rect.top) * (canvas.style.height ? game.h / rect.height : 1)
    };
  }

  function pointerWorldPosFromClient(clientX, clientY){
    const rect = canvas.getBoundingClientRect();
    const sx = (clientX - rect.left) * (canvas.style.width ? game.w / rect.width : 1);
    const sy = (clientY - rect.top) * (canvas.style.height ? game.h / rect.height : 1);
    return {
      x: sx + game.camX - (game.shakeX || 0),
      y: sy + game.camY - (game.shakeY || 0)
    };
  }

  function pointerWorldPos(ev){
    return pointerWorldPosFromClient(ev.clientX, ev.clientY);
  }

  function setInputDebug(patch){
    Object.assign(inputDebug, patch || {});
    const note = $("debugNote");
    if(!note) return;
    note.textContent = [
      `input:${inputDebug.state}`,
      `tap:${inputDebug.tap}`,
      `long:${inputDebug.longPress}`,
      `dist:${Math.round(inputDebug.flickDist || 0)}`,
      `angle:${Math.round(inputDebug.flickAngle || 0)}deg`,
      `result:${inputDebug.result}`
    ].join(" / ");
  }

  function toggleInputDebug(){
    inputDebug.visible = !inputDebug.visible;
    gameScreen.classList.toggle("input-debug-show", inputDebug.visible);
    setInputDebug({ state:inputDebug.visible ? "debug-on" : "debug-off" });
    toast(inputDebug.visible ? "INPUT HUD ON" : "INPUT HUD OFF");
  }

  function enemyAtWorldPoint(x, y){
    let best = null;
    let bestD = Infinity;
    for(const e of game.enemies){
      const d = Math.hypot(x - e.x, y - e.y);
      if(d < e.r + 18 && d < bestD){
        best = e;
        bestD = d;
      }
    }
    return best;
  }

  function canBeginSkillAim(){
    if(!gesture.active) return false;
    if(gesture.source !== "stick") return false;
    if(!(game.map === "field" || game.map === "cave")) return false;
    if(!hasJobSkill(currentJob())) return false;
    return true;
  }

  function showSkillAimOverlay(){
    const overlay = $("skillAimOverlay");
    if(!overlay || !game.p) return;
    overlay.classList.add("show");
    overlay.classList.toggle("not-ready", !skillReady());
    const sx = screenX(game.p.x);
    const sy = screenY(game.p.y - 8);
    overlay.style.transform = `translate3d(${sx}px,${sy}px,0)`;
    updateSkillAimOverlay();
  }

  function updateSkillAimOverlay(){
    const overlay = $("skillAimOverlay");
    if(!overlay || !gesture.aiming) return;
    const dx = gesture.currentX - gesture.startX;
    const dy = gesture.currentY - gesture.startY;
    const dist = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx);
    const readyDistance = dist >= GESTURE_FLICK_MIN;
    const arrow = overlay.querySelector(".skill-aim-arrow");
    const label = overlay.querySelector(".skill-aim-label");
    const scale = clamp(dist / 64, .55, 1.42);
    overlay.classList.toggle("ready", readyDistance && skillReady());
    overlay.classList.toggle("cancel", !readyDistance);
    if(arrow){
      arrow.style.transform = `rotate(${angle}rad) scaleX(${scale})`;
    }
    if(label){
      const job = currentJob();
      if(!hasJobSkill(job)) label.textContent = "スキル準備中";
      else if(!skillReady()) label.textContent = skillStatusText();
      else label.textContent = dist >= GESTURE_FLICK_MIN ? `${job.skillName || "スキル"} 発動` : "方向へフリック";
    }
    if(label && skillReady()) label.textContent = readyDistance ? "READY" : "CANCEL";
    setInputDebug({
      state:"aiming",
      longPress:"aim",
      flickDist:dist,
      flickAngle:angle * 180 / Math.PI,
      result:readyDistance ? "ready" : "cancel-zone"
    });
  }

  function hideSkillAimOverlay(){
    const overlay = $("skillAimOverlay");
    if(!overlay) return;
    overlay.classList.remove("show", "not-ready", "ready", "cancel");
    overlay.style.transform = "translate3d(-999px,-999px,0)";
  }

  function clearGestureTimer(){
    if(gesture.timer){
      clearTimeout(gesture.timer);
      gesture.timer = null;
    }
  }

  function resetGesture(){
    clearGestureTimer();
    gesture.active = false;
    gesture.aiming = false;
    gesture.pointerId = null;
    gesture.startWorld = null;
    gesture.startEnemy = null;
    gesture.startVillageObject = null;
    gesture.tapCanceled = false;
    gesture.source = "";
    gesture.blockedReason = "";
    if(stick) stick.classList.remove("holding", "aiming");
    hideSkillAimOverlay();
  }

  function beginGestureAim(){
    if(!gesture.active || gesture.aiming) return;
    if(!canBeginSkillAim()){
      clearGestureTimer();
      setInputDebug({
        state:"blocked",
        longPress:"blocked",
        result:gesture.blockedReason || "blocked"
      });
      return;
    }
    gesture.aiming = true;
    game.sit = false;
    if(gesture.source === "stick"){
      input.x = 0;
      input.y = 0;
      if(stick) stick.classList.add("aiming");
      knob.style.transform = "translate(0,0)";
    }
    setInputDebug({ state:"aiming", longPress:"start", result:"aim-start" });
    showSkillAimOverlay();
  }

  function finishGestureAim(){
    const dx = gesture.currentX - gesture.startX;
    const dy = gesture.currentY - gesture.startY;
    const dist = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx);
    if(dist < GESTURE_FLICK_MIN){
      gesture.lastResult = "cancel";
      setInputDebug({
        state:"ended",
        longPress:"released",
        flickDist:dist,
        flickAngle:angle * 180 / Math.PI,
        result:"skill-cancel"
      });
      toast("スキルをキャンセルしました");
      return;
    }
    if(!game.p) return;
    gesture.lastResult = skillReady() ? "skill" : "not-ready";
    setInputDebug({
      state:"ended",
      longPress:"released",
      flickDist:dist,
      flickAngle:angle * 180 / Math.PI,
      result:gesture.lastResult
    });
    useJobSkill(angle);
  }

  function handleCanvasTap(worldPos){
    if(game.map === "field"){
      const enemy = enemyAtWorldPoint(worldPos.x, worldPos.y);
      if(enemy){
        playerAttack(enemy);
      }
      return;
    }
    if(game.map === "village"){
      const obj = nearestVillageObjectTo(worldPos.x, worldPos.y, 64);
      if(obj){
        handleVillageInteraction(obj);
      }
      return;
    }
    if(game.map === "cave"){
      if(Math.hypot(worldPos.x - 490, worldPos.y - 700) < 96){
        openWorldMap();
        toast("ワールドマップを開きました");
      }
    }
  }

  canvas.addEventListener("pointerdown", ev=>{
    if(isGameplayPointerBlocked()) return;
    if(ev.pointerType === "mouse" && ev.button !== 0) return;
    ev.preventDefault();
    resetGesture();

    const screen = pointerScreenPos(ev);
    const world = pointerWorldPos(ev);
    gesture.active = true;
    gesture.aiming = false;
    gesture.pointerId = ev.pointerId;
    gesture.source = "canvas";
    gesture.startX = screen.x;
    gesture.startY = screen.y;
    gesture.currentX = screen.x;
    gesture.currentY = screen.y;
    gesture.startWorld = world;
    gesture.startEnemy = game.map === "field" ? enemyAtWorldPoint(world.x, world.y) : null;
    gesture.startVillageObject = game.map === "village" ? nearestVillageObjectTo(world.x, world.y, 64) : null;
    gesture.tapCanceled = false;
    gesture.blockedReason = gesture.startEnemy ? "enemy-tap"
      : input.active ? "stick-active"
      : gesture.startVillageObject ? "village-object"
      : !(game.map === "field" || game.map === "cave") ? "non-combat-map"
      : "";
    setInputDebug({
      state:"down",
      tap:gesture.startEnemy ? "enemy" : "canvas",
      longPress:gesture.blockedReason ? "blocked" : "pending",
      flickDist:0,
      flickAngle:0,
      result:gesture.blockedReason || "waiting"
    });

    try{ canvas.setPointerCapture(ev.pointerId); }catch(_){}

    clearGestureTimer();
  });

  canvas.addEventListener("pointermove", ev=>{
    if(!gesture.active || gesture.pointerId !== ev.pointerId) return;
    ev.preventDefault();
    const screen = pointerScreenPos(ev);
    gesture.currentX = screen.x;
    gesture.currentY = screen.y;
    const dx = gesture.currentX - gesture.startX;
    const dy = gesture.currentY - gesture.startY;
    const dist = Math.hypot(dx, dy);
    if(!gesture.aiming && dist > GESTURE_TAP_SLOP){
      gesture.tapCanceled = true;
      clearGestureTimer();
      setInputDebug({
        state:"moving",
        tap:"drag",
        longPress:"cancelled",
        flickDist:dist,
        flickAngle:Math.atan2(dy, dx) * 180 / Math.PI,
        result:"tap-cancel"
      });
    }
    if(gesture.aiming){
      showSkillAimOverlay();
      updateSkillAimOverlay();
    }
  });

  function endCanvasGesture(ev){
    if(!gesture.active || gesture.pointerId !== ev.pointerId) return;
    ev.preventDefault();
    clearGestureTimer();
    try{ canvas.releasePointerCapture(ev.pointerId); }catch(_){}

    const wasAiming = gesture.aiming;
    const world = pointerWorldPos(ev);

    if(wasAiming){
      finishGestureAim();
      resetGesture();
      return;
    }

    if(gesture.tapCanceled){
      setInputDebug({ state:"ended", tap:"cancelled", longPress:"no", result:"tap-cancel" });
      resetGesture();
      return;
    }

    setInputDebug({ state:"ended", tap:gesture.startEnemy ? "enemy-attack" : "tap", longPress:"no", result:"tap" });
    resetGesture();
    handleCanvasTap(world);
  }

  canvas.addEventListener("pointerup", endCanvasGesture);
  canvas.addEventListener("pointercancel", ev=>{
    if(gesture.active && gesture.pointerId === ev.pointerId){
      setInputDebug({ state:"cancelled", tap:"-", longPress:"cancelled", result:"pointercancel" });
      resetGesture();
    }
  });
  canvas.addEventListener("contextmenu", ev=>ev.preventDefault());

  $("bagBtn").addEventListener("click", openBag);
  $("menuBtn").addEventListener("click", openMenu);
  const mapBtn = $("mapBtn");
  if(mapBtn) mapBtn.addEventListener("click", openWorldMap);
  document.querySelectorAll(".world-node").forEach(node => {
    node.addEventListener("click", ()=>{
      const areaId = node.dataset.areaId || node.dataset.mapTarget;
      if(areaId){ selectWorldMapArea(areaId); return; }
      toast("このエリアはまだ開放されていません");
    });
  });
  const openStatusBtn = $("openStatusBtn");
  if(openStatusBtn) openStatusBtn.addEventListener("click", openStatusScreen);
  const openTestBtn = $("openTestBtn");
  if(openTestBtn) openTestBtn.addEventListener("click", openTestPanel);
  const openEquipBtn = $("openEquipBtn");
  if(openEquipBtn) openEquipBtn.addEventListener("click", openEquipmentScreen);
  const menuOpenBagBtn = $("menuOpenBagBtn");
  if(menuOpenBagBtn) menuOpenBagBtn.addEventListener("click", ()=>{ $("menuOverlay").classList.remove("show"); openBag(); });
  const menuOpenJobBtn = $("menuOpenJobBtn");
  if(menuOpenJobBtn) menuOpenJobBtn.addEventListener("click", ()=>{ $("menuOverlay").classList.remove("show"); renderJobHall(); $("facilityOverlay").classList.add("show"); });
  const menuOpenQuestBtn = $("menuOpenQuestBtn");
  if(menuOpenQuestBtn) menuOpenQuestBtn.addEventListener("click", ()=>{ $("menuOverlay").classList.remove("show"); $("facilityTitle").textContent = "クエスト掲示板"; renderQuestBoard(); $("facilityOverlay").classList.add("show"); });
  $("chatBtn").addEventListener("click", ()=>toast("チャットは飾りUIです。今後実装予定。"));

  document.querySelectorAll("[data-close]").forEach(btn=>{
    btn.addEventListener("click", ()=>$(btn.dataset.close).classList.remove("show"));
  });

  $("dialogueCloseBtn").addEventListener("click", closeDialogue);

  $("saveBtn").addEventListener("click", ()=>{
    persist();
    toast("セーブしました");
  });

  function confirmReset(ev){
    if(ev){
      ev.preventDefault();
      ev.stopPropagation();
    }

    resetSave();
    save = loadSave();
    closeTransientUi();
    resetRuntimeState();

    if(gameScreen.classList.contains("active")){
      initWorld("village");
      game.running = true;
      syncUI();
      toast("セーブを初期化しました");
    }
  }
  $("menuResetBtn").addEventListener("click", confirmReset);
  function bindTitleCommand(id, fn){
    const btn = $(id);
    if(!btn) return;
    let handledAt = -Infinity;
    const run = (ev)=>{
      if(ev){
        ev.preventDefault();
        ev.stopPropagation();
      }
      const now = performance.now();
      if(now - handledAt < 350) return;
      handledAt = now;
      fn(ev);
    };
    btn.addEventListener("pointerup", run);
    btn.addEventListener("click", run);
  }
  bindTitleCommand("titleResetBtn", confirmReset);
  bindTitleCommand("newGameBtn", ()=>startGame(true));
  bindTitleCommand("continueBtn", ()=>startGame(false));

  window.addEventListener("keydown", ev=>{
    const k = ev.key.toLowerCase();
    game.keys.add(k);
    if(k==="j") playerAttack();
    if(k==="e") pickup();
    if(k==="b") openBag();
    if(k==="m") openMenu();
    if(k==="o") openEquipmentScreen();
    if(k==="1") useHerb();
    if(k==="2") useJobSkill();
    if(k==="i") toggleInputDebug();
    if(k===" "){
      ev.preventDefault();
    }
    if(["arrowup","arrowdown","arrowleft","arrowright"," "].includes(k)) ev.preventDefault();
    if(["a","w","s","d","arrowup","arrowdown","arrowleft","arrowright"].includes(k)) game.sit = false;
  });
  window.addEventListener("keyup", ev=>game.keys.delete(ev.key.toLowerCase()));

  // ===== 開発者モード（スマホでタップ操作できるテスト用パネル）=====
  function devRefreshPlayer(refill){
    if(!game.p) return;
    game.p.maxHp = maxHp();
    game.p.maxSp = maxSp();
    if(refill){ game.p.hp = game.p.maxHp; game.p.sp = game.p.maxSp; }
    game.p.hp = Math.min(game.p.hp, game.p.maxHp);
    game.p.sp = Math.min(game.p.sp, game.p.maxSp);
    game.p.speed = playerSpeed();
  }
  function devSpawnMoco(){
    if(game.map !== "field"){ switchMap("field"); }
    const data = MONSTERS.moco_horn;
    const p = game.p || {x:300,y:300};
    let x = p.x + rand(-160,160), y = p.y + rand(-160,160);
    x = clamp(x, 80, game.worldW-80); y = clamp(y, 110, game.worldH-100);
    const hp = Math.round(data.hp);
    game.enemies.push({ ...data, x, y, hp, maxHp:hp, atk:data.atk,
      r:data.r, hitCd:rand(.7,1.4), hurt:0, squash:0, knockX:0, knockY:0,
      wander:rand(0,Math.PI*2), wanderTimer:rand(.5,2.2) });
    toast("モコホーンを召喚");
  }
  function setupDevMode(){
    const screen = document.getElementById("gameScreen") || document.body;
    const btn = document.createElement("button");
    btn.textContent = "🛠";
    btn.style.cssText = "position:absolute;z-index:30;left:8px;top:calc(120px + env(safe-area-inset-top));width:38px;height:38px;border-radius:10px;border:2px solid #2a3a30;background:rgba(20,28,24,.82);color:#fff;font-size:18px;line-height:1;cursor:pointer;";
    const panel = document.createElement("div");
    panel.style.cssText = "position:absolute;z-index:31;left:8px;top:calc(164px + env(safe-area-inset-top));width:188px;max-height:70vh;overflow:auto;display:none;flex-direction:column;gap:6px;padding:10px;border-radius:12px;border:2px solid #2a3a30;background:rgba(16,22,19,.94);box-shadow:0 6px 18px rgba(0,0,0,.4);";
    const title = document.createElement("div");
    title.textContent = "DEV MODE";
    title.style.cssText = "color:#9fe3b0;font-size:11px;font-weight:900;letter-spacing:1px;margin-bottom:2px;";
    panel.appendChild(title);
    const mk = (label, fn, color="#39563f")=>{
      const b = document.createElement("button");
      b.textContent = label;
      b.style.cssText = `padding:8px 6px;border-radius:8px;border:1px solid #2a3a30;background:${color};color:#fff;font-size:12px;font-weight:700;cursor:pointer;text-align:left;`;
      b.addEventListener("click", (e)=>{ e.stopPropagation(); fn(b); });
      panel.appendChild(b);
      return b;
    };
    mk("⚔ 炎の大剣を表示確認", ()=>{
      game.devEquipmentPreview = true;
      gainEquipment("flame_greatsword");
      equipItem("flame_greatsword");
      devRefreshPlayer(false);
      persist();
      syncUI();
      toast("炎の大剣を表示確認中");
    }, "#7a3a1e");
    mk("🎽 全装備を解放", ()=>{ for(const id of Object.keys(EQUIPMENT)) gainEquipment(id); persist(); toast("全装備を解放（装備画面から選べます）"); });
    mk("🧶 全素材 +10", ()=>{ for(const id of ["puru_jelly","puru_core","mushroom_grass","red_cap","moco_fur","moco_horn_piece","tiny_wing"]) addItem(id,10); persist(); syncUI(); toast("全素材+10"); });
    mk("💰 ゴールド +1000", ()=>{ save.gold += 1000; persist(); syncUI(); toast("G+1000"); }, "#6b5a1e");
    mk("⬆ レベル +1", ()=>{ save.level += 1; devRefreshPlayer(true); persist(); syncUI(); toast("Lv"+save.level); });
    mk("⏫ レベル +5", ()=>{ save.level += 5; devRefreshPlayer(true); persist(); syncUI(); toast("Lv"+save.level); });
    mk("🎯 レベル 10にする", ()=>{ save.level = Math.max(save.level,10); devRefreshPlayer(true); persist(); syncUI(); toast("Lv"+save.level); });
    mk("❤ 全回復(HP/SP)", ()=>{ devRefreshPlayer(true); syncUI(); toast("全回復"); }, "#1e5a4a");
    const godBtn = mk("🛡 無敵：OFF", (b)=>{ game.god = !game.god; b.textContent = "🛡 無敵："+(game.god?"ON":"OFF"); b.style.background = game.god? "#1e6b4a":"#39563f"; toast("無敵"+(game.god?"ON":"OFF")); });
    mk("👹 モコホーン召喚", ()=>devSpawnMoco(), "#6b2a2a");
    mk("🗑 セーブ初期化", ()=>confirmReset(), "#6b2222");
    mk("INPUT HUD ON/OFF", ()=>toggleInputDebug(), "#2f4f6f");
    btn.addEventListener("click", ()=>{ panel.style.display = panel.style.display==="none" ? "flex" : "none"; });
    screen.appendChild(btn);
    screen.appendChild(panel);
  }

  setupDevMode();

  window.addEventListener("resize", resize);
  if(window.visualViewport) window.visualViewport.addEventListener("resize", resize);

  // auto-save
  setInterval(()=>{ if(game.running) persist(); }, 5000);

  initSpriteAssets();
  resize();
  drawTitleCharacters(titleCanvas.getBoundingClientRect().width, titleCanvas.getBoundingClientRect().height);
})();
