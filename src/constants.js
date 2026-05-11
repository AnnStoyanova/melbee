// constants.js — logo, platform, storage, texts, leaderboard, audio, game config

const { useState, useEffect, useRef, useCallback } = React;

const LOGO_SVG = `<svg width="145" height="25" viewBox="0 0 145 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M92.9089 17.3203C92.4873 19.4399 91.3586 21.2485 89.5246 22.7475C87.6905 24.2464 85.6871 24.9968 83.5177 24.9968H67.6086L72.583 0.00162054H88.4922C90.6615 0.00162054 92.3661 0.751929 93.6043 2.25092C94.8426 3.74992 95.2492 5.56006 94.8276 7.6781C94.5239 9.2014 93.4965 10.809 91.747 12.4992C92.8242 14.1894 93.2126 15.797 92.9089 17.3203ZM87.0564 17.3203C87.166 16.7725 87.0631 16.3091 86.7477 15.9282C86.4323 15.5474 85.9958 15.3562 85.4348 15.3562H78.5832L79.8064 9.64218H86.5718C87.1328 9.64218 87.6457 9.45258 88.1121 9.07014C88.5768 8.68931 88.8656 8.22584 88.9752 7.6781C89.0847 7.13036 88.9818 6.66688 88.6664 6.28606C88.3511 5.90523 87.9145 5.71401 87.3535 5.71401H77.2952L74.593 19.2827H84.6514C85.2124 19.2827 85.7253 19.0931 86.1917 18.7107C86.6564 18.3299 86.9452 17.8664 87.0548 17.3187L87.0564 17.3203Z" fill="#FFBC00"/><path d="M114.787 24.9984H92.8425L97.8186 0.00162054H119.763L118.626 5.71563H102.534L101.752 9.6438H114.188L113.051 15.3578H100.615L99.8336 19.286H115.925L114.788 25L114.787 24.9984Z" fill="#FFBC00"/><path d="M134.9 5.71563L131.061 24.9984H125.209L129.048 5.71563H120.086L121.227 0.00162054H145L143.863 5.71563H134.9Z" fill="#FFBC00"/><path d="M27.4298 24.9968H21.5774L23.8314 13.6773L15.5424 24.9968H11.8858L8.1048 13.6789L5.85079 24.9968H0L4.97608 0H10.8335L15.6336 15.3562L26.5485 0H32.4059L27.4298 24.9968Z" fill="white"/><path d="M50.838 24.9968H28.8938L33.8698 0H55.814L54.6771 5.71401H38.5853L37.8036 9.64218H50.2388L49.1018 15.3562H36.6666L35.8848 19.2844H51.9766L50.8396 24.9984L50.838 24.9968Z" fill="white"/><path d="M70.9929 24.9968H52.3003L57.2763 0H63.1288L59.2897 19.2827H72.1299L70.9929 24.9968Z" fill="white"/></svg>`;

/* ═══════════════════════════════════════
   PLATFORM
═══════════════════════════════════════ */
const tg      = window.Telegram?.WebApp;
if (tg) { tg.ready(); tg.expand(); }
const tgUser  = tg?.initDataUnsafe?.user;
const TG_NAME = tgUser?.first_name || tgUser?.username || 'Пілот';

/* ═══════════════════════════════════════
   STORAGE
═══════════════════════════════════════ */
const LS = {
  get: (k, d) => { try { const v = localStorage.getItem(k); return v !== null ? JSON.parse(v) : d; } catch { return d; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

/* ═══════════════════════════════════════
   TEXTS  — дефолти + перевизначення з адмінки
═══════════════════════════════════════ */
const DEFAULT_TEXTS = {
  startTitle:    'MELBEE GP',
  startSub:      'Тап — вгору · Подвійний тап — ⚡ Турбо · Збирай квіти!',
  startBtn:      '🍯 Грати!',
  startChip:     'TELEGRAM MINI APP',
  startEyebrow:  'EPISODE 01',
  startRecordLbl:'Рекорд 🌸',
  startGamesLbl: 'Ігор',
  affTitle:      'AFFILIATE ID',
  affSub:        'Введи свій affiliate-код щоб отримати стартовий бонус та приєднатися до команди.',
  affFieldLabel: 'YOUR PARTNER ID',
  affHint:       'Знайди код у листі або у свого менеджера.',
  affError:      'Partner ID не знайдено. Перевір код у свого менеджера.',
  affBtnReady:   'ПОЇХАЛИ →',
  affBtnEmpty:   'ВВЕДИ ID',
  affBonusVal:   '+500 МЕДУ',
  affBonusSub:   'стартовий бонус за ID',
  affPaste:      '📋 Вставити з буфера',
  affSkip:       'ПРОПУСТИТИ',
  hudTurboLabel: '⚡ Турбо',
  hudTurboActive:'🚀 ТУРБО!',
  goEmoji:       '💥',
  goTitle:       'КІНЕЦЬ',
  goStatTpl:     'Рівень {level} · 🌸 {flowers} квіток',
  goRecord:      '🏆 НОВИЙ РЕКОРД!',
  goLbBtn:       '🏆 Лідерборд',
  goRetryBtn:    'Ще раз',
  lbTitle:       '🏆 Лідерборд',
  lbEmpty:       'Рекордів нема! Будь першим 🐝',
  lbMe:          '👤',
  playBtn:       '🏎 Грати знову!',
  crashMsg1:     'Ой, врізався! 🪨',
  crashMsg2:     'Мёд не зібрав! 🍯',
  crashMsg3:     'Бджілка впала! 🐝',
  crashMsg4:     'Паркан переміг! 🪵',
  crashMsg5:     'Спробуй ще раз! 🔁',
  crashMsg6:     'Турбо не врятувало! ⚡',
};

const getTexts = () => ({ ...DEFAULT_TEXTS, ...LS.get('mb_texts', {}) });

/* ═══════════════════════════════════════
   GAME CONFIG — дефолти + перевизначення з адмінки
═══════════════════════════════════════ */
const DEFAULT_CONFIG = {
  gravity:   0.22,
  jumpVy:   -5.0,
  baseSpeed: 1.4,
  speedInc:  0.12,
  maxSpeed:  3.8,
  gapH:      210,
  lvlEvery:  5,
  turboBonus:1.8,
  pipeW:     38,
};

function getConfig() {
  const saved = LS.get('mb_gameconfig', {});
  return { ...DEFAULT_CONFIG, ...Object.fromEntries(
    Object.entries(saved).map(([k, v]) => [k, parseFloat(v)])
  )};
}

/* ═══════════════════════════════════════
   GAME CONSTANTS  (computed from config)
═══════════════════════════════════════ */
const GW           = 360;
const GH           = 640;
const TURBO_MAX    = 10;
const TURBO_FRAMES = 180;
const DOUBLE_MS    = 320;
const BEE_X        = 90;
const BEE_HIT_R    = 16;

// These are read fresh from config each game start via getConfig()
let GRAVITY     = DEFAULT_CONFIG.gravity;
let JUMP_VY     = DEFAULT_CONFIG.jumpVy;
let BASE_SPEED  = DEFAULT_CONFIG.baseSpeed;
let SPEED_INC   = DEFAULT_CONFIG.speedInc;
let MAX_SPEED   = DEFAULT_CONFIG.maxSpeed;
let GAP_H       = DEFAULT_CONFIG.gapH;
let LVL_EVERY   = DEFAULT_CONFIG.lvlEvery;
let TURBO_BONUS = DEFAULT_CONFIG.turboBonus;
let PIPE_W      = DEFAULT_CONFIG.pipeW;

function applyConfig() {
  const cfg = getConfig();
  GRAVITY     = cfg.gravity;
  JUMP_VY     = cfg.jumpVy;
  BASE_SPEED  = cfg.baseSpeed;
  SPEED_INC   = cfg.speedInc;
  MAX_SPEED   = cfg.maxSpeed;
  GAP_H       = cfg.gapH;
  LVL_EVERY   = cfg.lvlEvery;
  TURBO_BONUS = cfg.turboBonus;
  PIPE_W      = cfg.pipeW;
}

/* ═══════════════════════════════════════
   LEADERBOARD
═══════════════════════════════════════ */
function getCrashMsgs() {
  const T = getTexts();
  return [T.crashMsg1, T.crashMsg2, T.crashMsg3, T.crashMsg4, T.crashMsg5, T.crashMsg6];
}

function lbAdd(score, partnerId, tgData = {}) {
  const name = partnerId
    ? '#' + partnerId
    : (tgData.username ? '@' + tgData.username : TG_NAME);

  // Leaderboard
  let lb = LS.get('mb_lb', []);
  lb.push({
    name, score,
    date:       new Date().toLocaleDateString('uk'),
    tgId:       tgData.id        || null,
    tgUsername: tgData.username  || null,
    partnerId:  partnerId        || null,
  });
  lb.sort((a, b) => b.score - a.score);
  lb = lb.slice(0, 10);
  LS.set('mb_lb', lb);

  // Partner stats
  if (partnerId) {
    let ids = LS.get('mb_partner_ids', []);
    const ex = ids.find(e => e.id === partnerId);
    if (ex) {
      ex.games++;
      ex.bestScore = Math.max(ex.bestScore, score);
      ex.lastSeen  = new Date().toISOString();
      if (!ex.tgId       && tgData.id)       ex.tgId       = tgData.id;
      if (!ex.tgUsername && tgData.username) ex.tgUsername = tgData.username;
    } else {
      ids.push({
        id: partnerId, games: 1, bestScore: score,
        firstSeen:  new Date().toISOString(),
        lastSeen:   new Date().toISOString(),
        tgId:       tgData.id        || null,
        tgUsername: tgData.username  || null,
        tgName:     tgData.firstName || null,
      });
    }
    ids.sort((a, b) => b.bestScore - a.bestScore);
    LS.set('mb_partner_ids', ids);
  }

  // Save all unique TG users
  if (tgData.id) {
    let tgUsers = LS.get('mb_tg_users', []);
    const exTg  = tgUsers.find(u => u.id === tgData.id);
    if (exTg) {
      exTg.lastSeen  = new Date().toISOString();
      exTg.games     = (exTg.games || 0) + 1;
      exTg.bestScore = Math.max(exTg.bestScore || 0, score);
      if (partnerId) exTg.partnerId = partnerId;
    } else {
      tgUsers.push({
        id:        tgData.id,
        username:  tgData.username  || null,
        firstName: tgData.firstName || null,
        lastName:  tgData.lastName  || null,
        partnerId: partnerId        || null,
        games:     1,
        bestScore: score,
        firstSeen: new Date().toISOString(),
        lastSeen:  new Date().toISOString(),
      });
    }
    LS.set('mb_tg_users', tgUsers);
  }
}

/* ═══════════════════════════════════════
   AUDIO
═══════════════════════════════════════ */
let _ac = null;
const ac = () => { if (!_ac) _ac = new (window.AudioContext || window.webkitAudioContext)(); return _ac; };
const resumeAudio = () => { if (_ac?.state === 'suspended') _ac.resume(); };

function tone(freq, type, dur, vol = .18, delay = 0) {
  try {
    const ctx = ac(), osc = ctx.createOscillator(), g = ctx.createGain();
    osc.connect(g); g.connect(ctx.destination);
    osc.type = type; osc.frequency.value = freq;
    const t = ctx.currentTime + delay;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + .01);
    g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    osc.start(t); osc.stop(t + dur + .01);
  } catch {}
}

const sfx = {
  jump:   () => { tone(420,'sine',.08,.12); tone(560,'sine',.06,.08,.04); },
  flower: () => { tone(880,'sine',.12,.15); tone(1100,'sine',.1,.12,.05); tone(1320,'sine',.08,.1,.1); },
  turbo:  () => { for (let i=0;i<6;i++) tone(300+i*80,'sawtooth',.15,.1,i*.04); },
  crash:  () => { tone(180,'sawtooth',.4,.3); tone(90,'square',.6,.25,.05); tone(60,'sawtooth',.8,.2,.15); },
};

let _drones = [];
function startBgMusic() {
  stopBgMusic();
  try {
    const ctx = ac();
    _drones = [110, 165, 220].map((f, i) => {
      const osc = ctx.createOscillator(), g = ctx.createGain();
      const lfo = ctx.createOscillator(), lg = ctx.createGain();
      lfo.connect(lg); lg.connect(g.gain);
      lfo.frequency.value = 3 + i * 1.5; lg.gain.value = .018;
      osc.connect(g); g.connect(ctx.destination);
      osc.type = i === 0 ? 'sine' : 'triangle';
      osc.frequency.value = f; g.gain.value = .025 - i * .006;
      lfo.start(); osc.start();
      return { osc, g, lfo };
    });
  } catch {}
}
function stopBgMusic() {
  _drones.forEach(d => { try { d.osc.stop(); d.lfo.stop(); } catch {} });
  _drones = [];
}
