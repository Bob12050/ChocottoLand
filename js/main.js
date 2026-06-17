// ミニアランド v0.6.9.2 レア素材・序盤武器拡張版
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
    puru_dagger: { gold:60, materials:{ puru_jelly:5, puru_core:1 } },
    mage_hat: { gold:45, materials:{ mushroom_grass:2 } },
    thief_hood: { gold:45, materials:{ puru_jelly:2, moco_fur:1 } },
    soldier_armor: { gold:90, materials:{ moco_fur:3 } },
    apprentice_robe: { gold:70, materials:{ mushroom_grass:3 } },
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
    thief_dagger:     { type:"dagger", blade:"#dfe7ef", edge:"#f8fbff", grip:"#6b4324", guard:"#6b4324", len:22, w:5 },
    puru_dagger:      { type:"dagger", blade:"#8fe8ff", edge:"#f8fbff", grip:"#356b7d", guard:"#6b4324", len:24, w:5 }
  };
  function weaponLook(id){ return WEAPON_LOOKS[id] || WEAPON_LOOKS.wood_sword; }


  const USER_PLAYER_FRONT_PNG = "assets/characters/player_front.png";
  const USER_PLAYER_BACK_PNG = "assets/characters/player_back.png";
  const USER_PLAYER_SIDE_PNG = "assets/characters/player_side.png";
  const USER_PLAYER_FRONTA_PNG = "assets/characters/player_front_walk_a.png";
  const USER_PLAYER_FRONTB_PNG = "assets/characters/player_front_walk_b.png";
  const USER_PLAYER_BACKA_PNG = "assets/characters/player_back_walk_a.png";
  const USER_PLAYER_BACKB_PNG = "assets/characters/player_back_walk_b.png";
  const USER_PLAYER_SIDEA_PNG = "assets/characters/player_side_walk_a.png";
  const USER_PLAYER_SIDEB_PNG = "assets/characters/player_side_walk_b.png";
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
    loadPngSprite("playerBackA", USER_PLAYER_BACKA_PNG);
    loadPngSprite("playerBackB", USER_PLAYER_BACKB_PNG);
    loadPngSprite("playerSideA", USER_PLAYER_SIDEA_PNG);
    loadPngSprite("playerSideB", USER_PLAYER_SIDEB_PNG);
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

  const JOBS = {
    fighter: {
      id:"fighter", name:"ファイター", icon:"⚔", type:"近接安定型",
      hpRate:1.25, spRate:.85, atkRate:1.18, defRate:1.12, speedRate:1.0,
      cooldown:.43, range:54, cost:0,
      skillName:"スラッシュ", skillCost:6, skillCooldown:2.2,
      skillDesc:"前方を大きく斬り払うファイター専用スキル。通常攻撃より高威力で、近くの敵をまとめて攻撃できる。",
      summary:"剣で戦う序盤安定職。HP・攻撃・防御が高く、近距離戦に強い。",
      attackName:"剣撃",
      tip:"近づいて正面を向いて攻撃。専用スキル「スラッシュ」はショートカット2で発動。"
    },
    mage: {
      id:"mage", name:"メイジ", icon:"✦", type:"魔法型",
      hpRate:.85, spRate:1.45, atkRate:1.08, defRate:.86, speedRate:.96,
      cooldown:.62, range:150, cost:8,
      skillName:"未実装", skillCost:0, skillCooldown:0,
      skillDesc:"今後、火球・範囲魔法などを追加予定。",
      summary:"SPを使って遠距離魔法を撃つ火力型。最大SPが高い。",
      attackName:"魔法弾",
      tip:"正面方向へ遠距離攻撃。SPを消費するが安全に戦える。"
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
    }
  };

  const FUTURE_JOB_NAMES = {
    sword_kaiser:"ソードカイザー"
  };

  const QUEST_DEFS = [
    {
      id:"puru_hunt", title:"ぷるスライム退治", badge:"はじまりの依頼",
      desc:"ひだまり草原でぷるスライムを3体倒す。まずは戦闘と拾う流れに慣れよう。",
      type:"kill", targetId:"puru_slime", target:3,
      reward:{ gold:50, items:{ herb:2 } },
      next:"jelly_collect"
    },
    {
      id:"jelly_collect", title:"ぷるゼリー集め", badge:"素材集め",
      desc:"ぷるスライムが落とすぷるゼリーを3個集める。拾うボタンで素材を回収しよう。",
      type:"item", targetId:"puru_jelly", target:3,
      reward:{ gold:40 },
      next:"first_craft"
    },
    {
      id:"first_craft", title:"はじめての装備作成", badge:"鍛冶屋",
      desc:"鍛冶屋で装備を1つ作成する。素材とGを使って、狩りやすさを上げよう。",
      type:"craft", targetId:"any", target:1,
      reward:{ gold:80, items:{ herb:1 } },
      next:"kinokko_hunt"
    },
    {
      id:"kinokko_hunt", title:"キノっこ討伐", badge:"次の狩場",
      desc:"少し手ごわいキノっこを3体倒す。装備更新後の力試しにちょうどいい相手。",
      type:"kill", targetId:"kinokko", target:3,
      reward:{ gold:90, items:{ mushroom_grass:2 } },
      next:"moco_challenge"
    },
    {
      id:"moco_challenge", title:"モコホーンへの挑戦", badge:"Lv10推奨",
      desc:"強敵モコホーンを1体倒す。Lv10前後、装備強化後の目標として挑もう。",
      type:"kill", targetId:"moco_horn", target:1,
      reward:{ gold:180, items:{ moco_fur:2 } }
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
    inventory:{ herb:3 },
    ownedEquip:{ wood_sword:true, traveler_cloth:true, cloth_cap:true },
    equipment:{ weapon:"wood_sword", head:"cloth_cap", body:"traveler_cloth", shield:null, back:null, accessory:null },
    currentJob:"ファイター",
    jobLevels:{ fighter:1, mage:1, thief:1 },
    weaponLevel:1,
    quests:{
      puru_hunt:{ status:"none", progress:0, target:3 },
      jelly_collect:{ status:"locked", progress:0, target:3 },
      first_craft:{ status:"locked", progress:0, target:1 },
      kinokko_hunt:{ status:"locked", progress:0, target:3 },
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
    shake:0,
    shakeX:0,
    shakeY:0,
    sit:false,
    keys:new Set()
  };

  const input = { x:0, y:0, id:null, active:false };
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
    merged.jobLevels = { ...base.jobLevels, ...(data?.jobLevels || {}) };
    merged.quests = { ...base.quests, ...(data?.quests || {}) };
    for(const def of QUEST_DEFS){
      merged.quests[def.id] = { ...base.quests[def.id], ...(data?.quests?.[def.id] || {}) };
      merged.quests[def.id].target = def.target;
    }
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
    for(const id of ["bagOverlay","menuOverlay","facilityOverlay"]){
      const el = $(id);
      if(el) el.classList.remove("show");
    }
    closeDialogue();
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
  function canEquipForCurrentJob(e){
    if(game.devEquipmentPreview && e?.id === "flame_greatsword") return true;
    if(!e?.allowedJobs?.length) return true;
    return e.allowedJobs.includes(currentJob().id);
  }
  function fallbackEquipmentForCurrentJob(){
    return {
      weapon: currentJob().id === "fighter" ? "wood_sword" : null,
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
  function maxHp(){
    const es = equipStats();
    return Math.max(1, Math.round((100 + (save.level - 1) * 18) * currentJob().hpRate + es.hp));
  }
  function maxSp(){
    const es = equipStats();
    return Math.max(1, Math.round((50 + (save.level - 1) * 7) * currentJob().spRate + es.sp));
  }
  function atk(){
    const es = equipStats();
    // v0.6.6.4: 基礎値を下げ、レベル/武器強化の伸び幅を上げて「強化が効く」式に調整。
    return Math.max(1, Math.round((8 + (save.level - 1) * 3 + (save.weaponLevel - 1) * 5 + es.atk) * currentJob().atkRate));
  }
  function playerSpeed(){
    const es = equipStats();
    return Math.max(70, Math.round(118 * currentJob().speedRate + es.speed));
  }

  function skillReady(){
    const job = currentJob();
    if(!game.p) return false;
    if(job.id !== "fighter") return false;
    if((game.skillCooldown || 0) > 0) return false;
    if(game.p.sp < (job.skillCost || 0)) return false;
    return true;
  }

  function skillStatusText(){
    const job = currentJob();
    if(job.id !== "fighter") return "準備中";
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
      q.progress = Math.min(def.target, q.progress + count);
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
    drawTitleCharacters(box.width, box.height);
  }

  function startGame(newGame=false){
    if(newGame){
      resetSave();
      save = loadSave();
    }
    titleScreen.classList.remove("active");
    gameScreen.classList.add("active");
    resize();
    initWorld(save.map || "village");
    game.running = true;
    last = performance.now();
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(loop);
    toast("v0.6.9 序盤クエスト導線を追加しました");
  }

  function initWorld(mapName){
    game.map = mapName;
    game.worldW = mapName === "village" ? 940 : 1080;
    game.worldH = mapName === "village" ? 740 : 840;
    const pStart = mapName === "village"
      ? {x:470,y:450}
      : {x:540,y:610};
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
    game.shake = 0;
    game.shakeX = 0;
    game.shakeY = 0;
    game.sit = false;
    if(mapName === "field"){
      for(let i=0;i<6;i++) spawnMonster();
    }
    updateCamera();
    syncUI();
  }

  function switchMap(mapName){
    persist();
    save.map = mapName;
    initWorld(mapName);
    toast(mapName === "village" ? "はじまりの村に戻りました" : "ひだまり草原へ出発！");
  }

  function rand(a,b){ return Math.random() * (b-a) + a; }
  function clamp(v,a,b){ return Math.max(a, Math.min(b, v)); }
  function distance(a,b){ return Math.hypot(a.x-b.x, a.y-b.y); }
  function screenX(x){ return Math.round(x - game.camX + (game.shakeX || 0)); }
  function screenY(y){ return Math.round(y - game.camY + (game.shakeY || 0)); }

  function spawnMonster(){
    // 序盤はぷるスライム多め。ファイターの通常攻撃とスラッシュの差を試しやすくする。
    const ids = ["puru_slime","puru_slime","puru_slime","puru_slime","puru_slime","kinokko","kinokko","kinokko","moco_horn"];
    const id = ids[Math.floor(Math.random()*ids.length)];
    const data = MONSTERS[id];
    let x=120,y=140;
    for(let i=0;i<50;i++){
      x = rand(80, game.worldW-80);
      y = rand(110, game.worldH-100);
      if(!game.p || Math.hypot(x-game.p.x, y-game.p.y) > 230) break;
    }
    const scale = rand(.94,1.08);
    const levelBonus = Math.max(0, save.level - 1);
    const hpBonus = id === "moco_horn" ? 3 : id === "puru_slime" ? 4 : 5;
    const hp = Math.round(data.hp + levelBonus * hpBonus);
    game.enemies.push({
      ...data,
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
      wander: rand(0, Math.PI*2),
      wanderTimer: rand(.5,2.2)
    });
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

  function playerAttack(){
    if(game.attackCooldown > 0 || !game.p || game.sit) return;
    const p = game.p;
    const job = currentJob();
    if(job.cost && p.sp < job.cost){
      toast("SPが足りません");
      return;
    }
    if(job.cost) p.sp = Math.max(0, p.sp - job.cost);
    game.attackCooldown = job.cooldown;
    p.attackTimer = .18;
    const range = job.range;
    game.attackFx.push({kind:job.id,x:p.x,y:p.y,a:p.face,life:.18,max:.18,range});
    let hit = false;
    const arc = job.id === "mage" ? Math.PI*.25 : Math.PI*.55;
    for(const e of [...game.enemies]){
      const dx = e.x - p.x;
      const dy = e.y - p.y;
      const d = Math.hypot(dx,dy);
      const a = Math.atan2(dy,dx);
      const diff = Math.atan2(Math.sin(a-p.face), Math.cos(a-p.face));
      if(d < range + e.r && Math.abs(diff) < arc){
        const rate = job.id === "mage" ? 1.2 : job.id === "thief" ? .88 : 1.0;
        const dmg = Math.round(atk() * rate * rand(.85,1.15));
        damageEnemy(e, dmg, p.x, p.y, job.id === "mage" ? 38 : 26, "normal");
        hit = true;
        if(job.id === "mage") break;
      }
    }
    if(!hit) burst(p.x + Math.cos(p.face)*Math.min(45,range), p.y + Math.sin(p.face)*Math.min(45,range), 4, "miss");
    else game.shake = Math.max(game.shake || 0, .05);
  }

  function useJobSkill(){
    if(!game.p || game.sit) return;
    const job = currentJob();
    if(job.id !== "fighter"){
      toast(`${job.name}の専用スキルは準備中です`);
      return;
    }
    fighterSlash();
  }

  function fighterSlash(){
    const p = game.p;
    const job = currentJob();
    const cost = job.skillCost || 0;
    const cd = job.skillCooldown || 2.2;

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
        const dmg = Math.round(atk() * slashRate * rand(.92,1.10));
        damageEnemy(e, dmg, p.x, p.y, 58, "slash");
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

  function damageEnemy(e, dmg, sx=null, sy=null, knock=0, kind="normal"){
    e.hp -= dmg;
    e.hurt = kind === "slash" ? .26 : .18;
    e.squash = kind === "slash" ? .22 : .13;
    if(sx !== null && sy !== null && knock > 0){
      const a = Math.atan2(e.y - sy, e.x - sx);
      const kr = 1 - (e.knockResist || 0);
      e.knockX = (e.knockX || 0) + Math.cos(a) * knock * kr;
      e.knockY = (e.knockY || 0) + Math.sin(a) * knock * kr;
    }
    const label = kind === "slash" ? `${dmg}!` : String(dmg);
    hitText(e.x, e.y - e.r - 14, label, kind === "slash");
    burst(e.x, e.y, kind === "slash" ? 15 : 9, kind === "slash" ? "slash" : "hit");
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
    if(e.rareItem && Math.random() < (e.rareRate || 0)){
      dropItem(e.rareItem, e.x, e.y, true);
      hitText(e.x, e.y - 88, `RARE ${ITEMS[e.rareItem]?.name || e.rareItem}!`, true);
    }
    burst(e.x, e.y, kind === "slash" ? 24 : 18, kind === "slash" ? "slash" : "drop");
    game.shake = Math.max(game.shake || 0, kind === "slash" ? .16 : .08);

    if(game.map === "field"){
      setTimeout(()=>{ if(game.map==="field" && game.enemies.length < 7) spawnMonster(); }, 850);
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
    const final = Math.max(1, Math.round(amount / defRate));
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

  function pickup(){
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
      toast(`${picked}個拾いました`);
      persist();
    }else{
      if(game.map === "village"){
        const near = nearestVillageObject();
        if(near) handleVillageInteraction(near);
        else toast("近くに話せる人・施設はありません");
      }else{
        toast("近くに拾えるものはありません");
      }
    }
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

  function openDialogue(name, text){
    $("dialogueName").textContent = name;
    $("dialogueText").textContent = text;
    $("dialogueBox").classList.add("show");
  }

  function closeDialogue(){
    $("dialogueBox").classList.remove("show");
  }

  function openFacility(kind, title, message){
    closeDialogue();
    $("facilityTitle").textContent = title;
    const box = $("facilityContent");
    box.innerHTML = "";
    if(kind === "shop"){
      box.innerHTML = `
        <div class="facility-row">
          <div class="row-head"><b>🌿 やくそう</b><span>10G</span></div>
          <p>HPを35回復する基本アイテム。ショートカット1またはバッグから使えます。</p>
          <button id="buyHerbBtn" class="green">購入する</button>
        </div>
        <div class="facility-row">
          <div class="row-head"><b>店主</b><span>道具屋</span></div>
          <p>${message}</p>
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
      parts.push(`${item.name}×${count}${itemCount(id) < count ? "不足" : ""}`);
    }
    return parts.length ? parts.join("、") : "なし";
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
    $("facilityTitle").textContent = "鍛冶屋";
    const cost = smithCost();
    const craftIds = Object.keys(EQUIP_RECIPES);
    const box = $("facilityContent");
    box.innerHTML = `
      <div class="facility-row">
        <div class="row-head"><b>⚔ 武器強化 Lv${save.weaponLevel}</b><span>ATK +${(save.weaponLevel-1)*2}</span></div>
        <p>現在装備中の武器に、共通の強化値を加えます。現在の強化費用：${cost}G</p>
        <button id="upgradeWeaponBtn" class="green">強化する</button>
      </div>
      <div class="facility-row">
        <div class="row-head"><b>装備作成</b><span>v0.6</span></div>
        <p>${message}</p>
      </div>
      <div class="equip-list">
        ${craftIds.map(id => {
          const e = EQUIPMENT[id];
          const r = EQUIP_RECIPES[id];
          const owned = save.ownedEquip?.[id];
          const disabled = owned || !canCraftEquipment(id);
          return `
            <div class="equip-item">
              <div class="equip-item-icon">${e.icon}</div>
              <div class="equip-item-desc">
                <b>${e.name}</b> <span class="quest-badge">${EQUIP_SLOTS[e.slot]}</span> <span class="quest-badge">${equipJobText(e)}</span>
                <small>${e.desc}<br>効果：ATK+${e.atk||0} / HP+${e.hp||0} / SP+${e.sp||0} / 速度${(e.speed||0)>=0?"+":""}${e.speed||0}</small>
                <span class="craft-cost">費用：${r.gold}G / 素材：${materialText(r.materials)}</span>
              </div>
              ${owned ? `<span class="job-now">所持</span>` : `<button id="craft_${id}" class="green" ${disabled ? "disabled" : ""}>作成</button>`}
            </div>`;
        }).join("")}
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
    $("facilityTitle").textContent = "装備";
    const box = $("facilityContent");
    const stats = equipStats();
    const slotEntries = Object.entries(EQUIP_SLOTS);
    const ownedIds = Object.keys(save.ownedEquip || {}).filter(id => EQUIPMENT[id]);
    const shownIds = filterSlot ? ownedIds.filter(id => EQUIPMENT[id].slot === filterSlot) : ownedIds;
    const currentWeapon = EQUIPMENT[save.equipment?.weapon]?.name || "なし";
    box.innerHTML = `
      <div class="equip-summary">
        <b>現在ステータス</b><br>
        職業：${currentJob().icon} ${currentJob().name} / 武器：${currentWeapon} Lv${save.weaponLevel}<br>
        HP：${maxHp()} / SP：${maxSp()} / ATK：${atk()} / 速度：${playerSpeed()}<br>
        装備補正：ATK+${stats.atk} / HP+${stats.hp} / SP+${stats.sp} / 速度${stats.speed>=0?"+":""}${stats.speed}<br>見た目：素体＋頭/胴/武器/盾/背中/アクセをレイヤー表示。v0.6で輪郭と装備差分を強化
      </div>
      <div class="equip-slot-grid">
        ${slotEntries.map(([slot,label])=>{
          const id = save.equipment?.[slot];
          const e = EQUIPMENT[id];
          return `
            <div class="equip-slot">
              <b>${label}<span>${e ? e.icon : "—"}</span></b>
              <small>${e ? `${e.name}<br>${equipJobText(e)} / ATK+${e.atk||0} / HP+${e.hp||0} / SP+${e.sp||0} / 速度${(e.speed||0)>=0?"+":""}${e.speed||0}` : "未装備"}</small>
              ${e && slot !== "weapon" && slot !== "body" ? `<button id="unequip_${slot}" class="blue" style="margin-top:6px;padding:5px 7px;font-size:11px;">外す</button>` : ""}
            </div>`;
        }).join("")}
      </div>
      <div class="equip-tabs">
        <button id="equipFilter_all" class="blue">全部</button>
        ${slotEntries.map(([slot,label])=>`<button id="equipFilter_${slot}">${label}</button>`).join("")}
      </div>
      <div class="equip-list">
        ${shownIds.length ? shownIds.map(id => {
          const e = EQUIPMENT[id];
          const equipped = save.equipment?.[e.slot] === id;
          const canEquip = canEquipForCurrentJob(e);
          return `
            <div class="equip-item">
              <div class="equip-item-icon">${e.icon}</div>
              <div class="equip-item-desc">
                <b>${e.name}</b> <span class="quest-badge">${EQUIP_SLOTS[e.slot]}</span> <span class="quest-badge">${equipJobText(e)}</span>
                <small>${e.desc}<br>ATK+${e.atk||0} / HP+${e.hp||0} / SP+${e.sp||0} / 速度${(e.speed||0)>=0?"+":""}${e.speed||0}</small>
              </div>
              ${!canEquip ? `<button disabled>専用外</button>` : equipped ? `<span class="job-now">装備中</span>` : `<button id="equip_${id}" class="green">装備</button>`}
            </div>`;
        }).join("") : `<div class="facility-row"><b>この部位の装備は未所持です</b><p>鍛冶屋で装備を作成できます。</p></div>`}
      </div>`;
    $("facilityOverlay").classList.add("show");
    setTimeout(()=>{
      $("equipFilter_all").onclick = () => renderEquipmentScreen(null);
      for(const [slot] of slotEntries){
        const filter = $("equipFilter_" + slot);
        if(filter) filter.onclick = () => renderEquipmentScreen(slot);
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
    $("facilityTitle").textContent = "転職の館";
    const now = currentJob();
    const box = $("facilityContent");
    box.innerHTML = `
      <div class="facility-row">
        <div class="row-head"><b>現在の職業</b><span class="quest-badge">${now.icon} ${now.name}</span></div>
        <p>職業を変えると、最大HP/SP・攻撃・防御・速度・射程・専用スキルが変わります。見た目は現在、素体を仮表示しています。</p>
        <div class="job-stat-box">
          <div class="job-stat-grid">
            <div>HP：${maxHp()} / 補正×${now.hpRate}</div>
            <div>SP：${maxSp()} / 補正×${now.spRate}</div>
            <div>攻撃：${atk()} / 補正×${now.atkRate}</div>
            <div>防御：被ダメ÷${now.defRate || 1}</div>
            <div>速度：${playerSpeed()}</div>
            <div>射程：${now.range}</div>
          </div>
          <div class="skill-tip">${now.icon} 通常：${now.attackName || "通常攻撃"} / ${now.tip || now.summary}</div>
          <div class="skill-tip fighter-skill-tip">専用スキル：${now.skillName || "未実装"} / SP ${now.skillCost || 0} / CT ${now.skillCooldown || 0}s<br>${now.skillDesc || "今後追加予定です。"}</div>
          <div class="skill-tip-row">
            <b>操作</b>
            <span>スマホ：攻撃ボタン左上の「技」または下ショートカット2 / PC：2キー</span>
            <span class="skill-cd-badge">${skillStatusText()}</span>
          </div>
        </div>
      </div>
      <div class="job-card-grid">
        ${Object.values(JOBS).map(job => `
          <div class="facility-row job-card">
            <div class="job-icon">${job.icon}</div>
            <div class="job-desc">
              <b>${job.name}</b> <span class="quest-badge">${job.type}</span>
              <small>
                ${job.summary}<br>
                通常：${job.attackName || "通常攻撃"} / 射程：${job.range} / CT：${job.cooldown}s / 消費SP：${job.cost || 0}<br>
                専用：${job.skillName || "未実装"} / SP：${job.skillCost || 0} / CT：${job.skillCooldown || 0}s
              </small>
            </div>
            ${job.name === save.currentJob ? `<span class="job-now">現在</span>` : `<button id="jobBtn_${job.id}" class="green">転職</button>`}
          </div>
        `).join("")}
      </div>`;
    setTimeout(()=>{
      for(const job of Object.values(JOBS)){
        const btn = $("jobBtn_" + job.id);
        if(btn) btn.onclick = () => changeJob(job.id);
      }
    },0);
  }

  function changeJob(jobId){
    const job = JOBS[jobId] || JOBS.fighter;
    const hpRate = game.p ? Math.max(.05, game.p.hp / game.p.maxHp) : 1;
    const spRate = game.p ? Math.max(0, game.p.sp / game.p.maxSp) : 1;
    save.currentJob = job.name;
    save.jobLevels = save.jobLevels || { fighter:1, mage:1, thief:1 };
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
    persist();
    syncUI();
    toast(`木の剣がLv${save.weaponLevel}になりました`);
    renderSmith("いい感じに鍛えられたな。");
  }

  function renderQuestBoard(){
    const box = $("facilityContent");
    const guide = currentGuideQuest();
    box.innerHTML = `
      <div class="facility-row">
        <div class="row-head"><b>次の目標</b><span class="quest-badge">${guide.def.badge}</span></div>
        <p>${guide.def.title}：${questLabel(guide.q)}<br>${guide.def.desc}</p>
      </div>
      ${QUEST_DEFS.map(def => {
        const q = quest(def.id);
        const disabled = q.status === "locked" ? "disabled" : "";
        let action = `<button disabled>${questLabel(q)}</button>`;
        if(q.status === "none") action = `<button id="acceptQuest_${def.id}" class="green" ${disabled}>受注する</button>`;
        if(q.status === "accepted") action = `<button disabled>進行中</button>`;
        if(q.status === "complete") action = `<button id="reportQuest_${def.id}" class="green">報告して報酬を受け取る</button>`;
        if(q.status === "cleared") action = `<button id="resetQuest_${def.id}" class="blue">再受注する</button>`;
        return `
          <div class="facility-row">
            <div class="row-head"><b>${def.title}</b><span class="quest-badge">${questLabel(q)}</span></div>
            <p>${def.desc}<br>進行：${q.progress}/${def.target}<br>報酬：${rewardText(def.reward)}</p>
            ${action}
          </div>`;
      }).join("")}
      <div class="facility-row">
        <div class="row-head"><b>掲示板</b><span>序盤ループ</span></div>
        <p>依頼を受けて草原へ行き、素材を拾い、鍛冶屋で装備を作る。モコホーンはLv10前後の目標です。</p>
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
    q.progress = def.type === "item" ? Math.min(def.target, itemCount(def.targetId)) : 0;
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
    persist();
    renderQuestBoard();
    syncUI();
    toast("報酬を受け取りました");
  }

  function resetQuest(id){
    const def = QUEST_MAP[id];
    if(!def) return;
    const q = quest(id);
    q.status = "accepted";
    q.progress = def.type === "item" ? Math.min(def.target, itemCount(def.targetId)) : 0;
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

  function nearestVillageObject(){
    const p = game.p;
    const objects = [
      {x:165,y:285,name:"道具屋",kind:"shop",message:"いらっしゃい！冒険の前にやくそうを買っていくかい？"},
      {x:460,y:260,name:"鍛冶屋",kind:"smith",message:"武器を少しだけ鍛えられるぞ。序盤の火力が上がる。"},
      {x:762,y:285,name:"転職の館",kind:"job",message:"職業の研究中だよ。v0.4でファイター・メイジ・シーフを切り替えられるようにする予定。"},
      {x:230,y:626,name:"クエスト掲示板",kind:"quest",message:"草原の依頼が貼られている。"},
      {x:712,y:626,name:"倉庫",kind:"storage",message:"手に入れた素材はバッグで確認できるよ。"},
      {x:265,y:410,name:"村人",kind:"npc",message:"ここはミニアランドのはじまりの村だよ。まずは掲示板で依頼を受けて、ひだまり草原へ行ってみよう！"},
      {x:610,y:430,name:"案内人",kind:"npc",message:"近くの施設で「拾う」ボタンを押すと、会話や施設メニューを開けるよ。PCならEキーでもOK！"},
      {x:505,y:324,name:"守衛",kind:"npc",message:"草原にはぷるスライムやキノっこがいる。HPが減ったら座って少し休むか、やくそうを使うんだ。"}
    ];
    let best = null, bestD = Infinity;
    for(const o of objects){
      const d = Math.hypot(p.x-o.x, p.y-o.y);
      if(d < bestD){ bestD=d; best=o; }
    }
    return bestD < 88 ? best : null;
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

  function drawField(){
    ctx.fillStyle = "#70c55c";
    ctx.fillRect(0,0,game.w,game.h);
    drawTileGrass("#70c55c", "#62b350", "#88d674");

    // paths and small cliffs
    drawPath(0,590,game.worldW,95);
    drawPath(500,570,118,270);
    drawRiver(0,96,game.worldW,54);

    // trees / rocks / flowers
    drawFlowerBed(258,548);
    drawFlowerBed(735,545);
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
        }else if(n === 1){
          ctx.fillStyle = dark;
          ctx.fillRect(sx+21, sy+19, 4, 3);
          ctx.fillRect(sx+25, sy+16, 3, 3);
        }
      }
    }
  }

  function drawPath(x,y,w,h){
    ctx.save();
    ctx.translate(screenX(x), screenY(y));
    ctx.fillStyle="#d9b875";
    ctx.fillRect(0,0,w,h);
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
    ctx.fillRect(-18,26,36,9);
    ctx.fillStyle="#805229";
    ctx.fillRect(-6,3,12,31);
    ctx.strokeStyle="#4b2c14";
    ctx.lineWidth=2;
    ctx.strokeRect(-6,3,12,31);
    ctx.fillStyle="#3d9b42";
    ctx.fillRect(-25,-20,50,28);
    ctx.fillRect(-19,-36,38,28);
    ctx.fillRect(-12,-51,24,25);
    ctx.strokeStyle="#2b6d30";
    ctx.lineWidth=2;
    ctx.strokeRect(-25,-20,50,28);
    ctx.strokeRect(-19,-36,38,28);
    ctx.strokeRect(-12,-51,24,25);
    ctx.fillStyle="#63c15e";
    ctx.fillRect(-17,-29,12,5);
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
    const bw = 46, bh = 6;
    const rate = clamp(e.hp/e.maxHp,0,1);
    ctx.fillStyle="#1f3145";
    ctx.fillRect(x - bw/2, y - e.r - 30, bw, bh);
    ctx.fillStyle= rate < .35 ? "#ff8b52" : "#e55c55";
    ctx.fillRect(x - bw/2, y - e.r - 30, bw * rate, bh);
    ctx.strokeStyle="#091724";
    ctx.lineWidth=2;
    ctx.strokeRect(x - bw/2, y - e.r - 30, bw, bh);
    ctx.fillStyle="#fff8df";
    ctx.font="900 10px system-ui";
    ctx.textAlign="center";
    ctx.strokeStyle="#000";
    ctx.lineWidth=3;
    const label = e.id === "moco_horn" ? `${e.name} Lv10推奨` : e.name;
    ctx.strokeText(label,x,y-e.r-35);
    ctx.fillText(label,x,y-e.r-35);
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

    let baseImg = null;
    if(dir === "up"){
      const walkPhase = isMoving ? Math.floor(t * 7) % 2 : 0;
      baseImg = walkPhase === 0 ? spriteAssets.playerBackA : spriteAssets.playerBackB;
    }else if(isSide){
      baseImg = spriteAssets.playerSide || spriteAssets.playerSideA || spriteAssets.playerSideB;
    }else{
      const walkPhase = isMoving ? Math.floor(t * 7) % 2 : 0;
      baseImg = walkPhase === 0 ? spriteAssets.playerFrontA : spriteAssets.playerFrontB;
    }

    const flipX = dir === "left";
    const sign = flipX ? -1 : 1;

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

    if(useWimg && wcfg && wBehind){
      drawWeaponImageLayer(wimg, wlook, wcfg, p, isSide, sign, baseBob, sideStepLift);
    }

    let drawn = false;
    if(spriteReady(baseImg)){
      try{
        ctx.save();
        ctx.translate(Math.round(drawX), Math.round(drawY));
        if(isSide){
          ctx.scale(sign, 1);
          ctx.drawImage(baseImg, -27, -27, 54, 54);
        }else{
          ctx.drawImage(baseImg, -27, -27, 54, 54);
        }
        ctx.restore();
        drawn = true;
      }catch(_){
        try{ ctx.restore(); }catch(__){}
      }
    }

    if(drawn){
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
    $("mapText").textContent = game.map === "village" ? "はじまりの村" : "ひだまり草原";
    $("expText").textContent = `${save.exp}/${needExp()} あと${expToNext()}`;
    $("expFill").style.width = `${clamp(save.exp/needExp()*100,0,100)}%`;

    const p = game.p;
    if(p){
      $("hpText").textContent = `${Math.ceil(p.hp)}/${p.maxHp}`;
      $("spText").textContent = `${Math.ceil(p.sp)}/${p.maxSp}`;
      $("hpFill").style.width = `${clamp(p.hp/p.maxHp*100,0,100)}%`;
      $("spFill").style.width = `${clamp(p.sp/p.maxSp*100,0,100)}%`;
    }
    $("goVillageBtn").disabled = game.map === "village";
    $("goFieldBtn").disabled = game.map === "field";
    const job = currentJob();
    $("charInfo").textContent = `Lv${save.level} / ${job.name} / 次Lvまであと${expToNext()}EXP / G ${save.gold}`;
    const weapon = EQUIPMENT[save.equipment?.weapon]?.name || "武器なし";
    const body = EQUIPMENT[save.equipment?.body]?.name || "胴なし";
    $("equipInfo").textContent = `${body} / ${weapon} Lv${save.weaponLevel} / ATK ${atk()}`;
    const ji = $("jobInfo"); if(ji) ji.textContent = `${job.type}：${job.summary} / 専用：${job.skillName || "未実装"}`;
    const jh = $("jobHud");
    if(jh){
      const cd = game.skillCooldown > 0 ? ` / 技CT ${game.skillCooldown.toFixed(1)}s` : "";
      jh.innerHTML = `職業：<span>${job.icon} ${job.name}</span> / ${job.attackName || "通常攻撃"} / 技：${job.skillName || "未実装"}${cd}`;
    }
    const skillText = $("skillSlotText");
    const skillLabel = job.id === "fighter" ? (game.skillCooldown > 0 ? `斬${Math.ceil(game.skillCooldown)}` : "斬") : "準備";
    if(skillText) skillText.textContent = skillLabel;

    const skillBtn = $("skillBtn");
    if(skillBtn){
      skillBtn.classList.toggle("cooling", game.skillCooldown > 0);
      skillBtn.classList.toggle("disabled-skill", !skillReady());
      skillBtn.title = `${job.skillName || "技"}：${skillStatusText()}`;
    }

    const skillRoundBtn = $("skillRoundBtn");
    if(skillRoundBtn){
      const small = skillRoundBtn.querySelector("small");
      const span = skillRoundBtn.querySelector("span");
      if(small) small.textContent = game.skillCooldown > 0 ? `CT${Math.ceil(game.skillCooldown)}` : "技";
      if(span) span.textContent = job.id === "fighter" ? "斬" : "-";
      skillRoundBtn.classList.toggle("cooling", game.skillCooldown > 0);
      skillRoundBtn.classList.toggle("disabled-skill", !skillReady());
      skillRoundBtn.title = `${job.skillName || "技"}：${skillStatusText()}`;
    }

    const guide = currentGuideQuest();
    $("questInfo").textContent = `${guide.def.title}：${questLabel(guide.q)}`;
  }

  function openBag(){
    const content = $("bagContent");
    content.innerHTML = "";
    const entries = Object.entries(save.inventory).filter(([,n])=>n>0);
    if(entries.length === 0){
      content.innerHTML = `<div class="item-row"><b>バッグは空です</b><span>素材を拾うとここに入ります</span></div>`;
    }else{
      for(const [id,count] of entries){
        const item = ITEMS[id] || {name:id,type:"不明",icon:"?"};
        const row = document.createElement("div");
        row.className = "item-row";
        row.innerHTML = `<div><b>${item.icon} ${item.name}</b><br><span>${item.type}</span></div><b>×${count}</b>`;
        content.appendChild(row);
      }
    }
    const btn = document.createElement("button");
    btn.className = "green";
    btn.textContent = "装備画面を開く";
    btn.onclick = openEquipmentScreen;
    content.appendChild(btn);
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

  function endStick(ev){
    if(ev.pointerId !== input.id) return;
    input.active=false;
    input.id=null;
    input.x=0;
    input.y=0;
    knob.style.transform="translate(0,0)";
  }

  stick.addEventListener("pointerdown", ev=>{
    input.active=true;
    input.id=ev.pointerId;
    stick.setPointerCapture(ev.pointerId);
    moveStick(ev);
  });
  stick.addEventListener("pointermove", ev=>{
    if(input.active && ev.pointerId === input.id) moveStick(ev);
  });
  stick.addEventListener("pointerup", endStick);
  stick.addEventListener("pointercancel", endStick);

  $("attackBtn").addEventListener("pointerdown", ev=>{ ev.preventDefault(); playerAttack(); });
  $("pickupBtn").addEventListener("pointerdown", ev=>{ ev.preventDefault(); pickup(); });
  const skillBtn = $("skillBtn");
  if(skillBtn) skillBtn.addEventListener("pointerdown", ev=>{ ev.preventDefault(); useJobSkill(); });
  const skillRoundBtn = $("skillRoundBtn");
  if(skillRoundBtn) skillRoundBtn.addEventListener("pointerdown", ev=>{ ev.preventDefault(); useJobSkill(); });

  $("goVillageBtn").addEventListener("click", ()=>switchMap("village"));
  $("goFieldBtn").addEventListener("click", ()=>switchMap("field"));
  $("bagBtn").addEventListener("click", openBag);
  $("menuBtn").addEventListener("click", openMenu);
  const openEquipBtn = $("openEquipBtn");
  if(openEquipBtn) openEquipBtn.addEventListener("click", openEquipmentScreen);
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
  $("titleResetBtn").addEventListener("click", confirmReset);
  $("newGameBtn").addEventListener("click", ()=>startGame(true));
  $("continueBtn").addEventListener("click", ()=>startGame(false));

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
