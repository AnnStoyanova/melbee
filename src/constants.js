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
   EDITABLE TEXTS  (admin-panel controlled)
═══════════════════════════════════════ */
const DEFAULT_TEXTS = {
  startTitle: 'MELBEE GP',
  startSub:   'Тап — вгору · Подвійний тап — ⚡ Турбо · Збирай квіти!',
  startBtn:   '🍯 Грати!',
  affTitle:   'AFFILIATE ID',
  affSub:     'Введи свій affiliate-код щоб отримати стартовий бонус та приєднатися до команди.',
  lbTitle:    '🏆 Лідерборд',
  goTitle:    'КІНЕЦЬ',
  playBtn:    '🏎 Грати знову!',
  lbBtn:      '🏆 Лідерборд',
};
const getTexts = () => LS.get('mb_texts', DEFAULT_TEXTS);

/* ═══════════════════════════════════════
   LEADERBOARD
═══════════════════════════════════════ */
const CRASH_MSGS = [
  'Ой, врізався! 🪨', 'Мёд не зібрав! 🍯', 'Бджілка впала! 🐝',
  'Паркан переміг! 🪵', 'Спробуй ще раз! 🔁', 'Турбо не врятувало! ⚡',
];

function lbAdd(score, partnerId) {
  const name = partnerId ? '#' + partnerId : TG_NAME;
  let lb = LS.get('mb_lb', []);
  lb.push({ name, score, date: new Date().toLocaleDateString('uk') });
  lb.sort((a, b) => b.score - a.score);
  lb = lb.slice(0, 10);
  LS.set('mb_lb', lb);
  if (partnerId) {
    let ids = LS.get('mb_partner_ids', []);
    const ex = ids.find(e => e.id === partnerId);
    if (ex) { ex.games++; ex.bestScore = Math.max(ex.bestScore, score); ex.lastSeen = new Date().toISOString(); }
    else ids.push({ id: partnerId, games: 1, bestScore: score, firstSeen: new Date().toISOString(), lastSeen: new Date().toISOString() });
    ids.sort((a, b) => b.bestScore - a.bestScore);
    LS.set('mb_partner_ids', ids);
  }
}

/* ═══════════════════════════════════════
   AUDIO  (Web Audio API — no files needed)
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

const GW          = 360;
const GH          = 640;
const GRAVITY     = 0.22;
const JUMP_VY     = -6.5;
const BEE_X       = 90;
const BEE_HIT_R   = 16;
const BASE_SPEED  = 1.4;
const SPEED_INC   = 0.12;
const MAX_SPEED   = 3.8;
const TURBO_BONUS = 1.8;
const TURBO_MAX   = 10;
const TURBO_FRAMES= 180;
const LVL_EVERY   = 5;
const PIPE_W      = 38;
const GAP_H       = 250;
const DOUBLE_MS   = 320;
