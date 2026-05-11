// screens.js — AffiliateScreen, StartScreen, GameOverScreen, LeaderboardScreen

// ── AFFILIATE SCREEN ─────────────────────────────────────────
function AffiliateScreen({ onNext, onSkip }) {
  const T = getTexts();
  const [id,       setId]       = useState('');
  const [focused,  setFocused]  = useState(false);
  const [error,    setError]    = useState(null);
  const [checking, setChecking] = useState(false);

  const formatOk = id.length >= 4 && /^[A-Za-z0-9_-]+$/.test(id);

  const getAllowedIds = () =>
    LS.get('mb_allowed_ids', []).map(s => s.toUpperCase().trim()).filter(Boolean);

  const validateId = (value) => {
    const allowed = getAllowedIds();
    if (allowed.length === 0) return true;
    return allowed.includes(value.toUpperCase().trim());
  };

  const onChange = e => {
    const v = e.target.value.toUpperCase().slice(0, 16);
    setId(v);
    if (error) setError(null);
  };

  const submit = () => {
    if (!formatOk) { setError('format'); return; }
    setChecking(true);
    setTimeout(() => {
      if (validateId(id)) { setChecking(false); onNext(id); }
      else { setChecking(false); setError('unknown'); }
    }, 400);
  };

  const paste = async () => {
    try { setId((await navigator.clipboard.readText()).trim().toUpperCase().slice(0, 16)); } catch {}
  };

  const isValid  = formatOk && error === null;
  const hasError = error !== null;
  const errText  = error === 'format' ? T.affError.replace('Partner ID не знайдено', 'Невірний формат. Дозволено: A–Z, 0–9, _ –') : T.affError;

  return (
    <div className="aff screen">
      <svg className="hex-deco" viewBox="0 0 360 640" xmlns="http://www.w3.org/2000/svg">
        {[[300,80,90],[30,200,70],[310,480,60]].map(([cx,cy,r],i) => {
          const pts = [];
          for (let j=0;j<6;j++) { const a=Math.PI/3*j+Math.PI/6; pts.push(`${cx+Math.cos(a)*r},${cy+Math.sin(a)*r}`); }
          return <polygon key={i} points={pts.join(' ')} fill="none" stroke="#F5C518" strokeWidth="1.5" opacity="0.12"/>;
        })}
      </svg>
      <div className="aff__top">
        <button className="aff__back" onClick={onSkip}>‹</button>
        <span className="aff__step">КРОК 1 / 2</span>
        <span className="aff__skip" onClick={onSkip}>{T.affSkip}</span>
      </div>
      <div className="aff__hero">
        <div className="aff__bee-wrap"><Bee size={110} variant="fly"/></div>
      </div>
      <div className="aff__eyebrow">ПРИЄДНАННЯ</div>
      <h1 className="aff__title">
        {T.affTitle.split(' ')[0]}<br/>
        <span>{T.affTitle.split(' ').slice(1).join(' ') || 'ID'}</span>
      </h1>
      <p className="aff__sub">{T.affSub}</p>
      <label className={`aff__field${focused?' is-focused':''}${hasError?' is-error':''}${isValid?' is-valid':''}`}>
        <span className="aff__field-label">{T.affFieldLabel}</span>
        <div className="aff__field-row">
          <span className="aff__field-prefix">#</span>
          <input className="aff__input" type="text" value={id} placeholder="BEE7X42"
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            spellCheck={false} autoComplete="off"/>
          {isValid && (
            <svg width="22" height="22" viewBox="0 0 22 22">
              <path d="M5 11L9 15L17 7" stroke="#7BC043" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
          {checking && <span style={{fontSize:18}}>⏳</span>}
        </div>
      </label>
      <p className={`aff__hint${hasError?' aff__hint--err':''}`}>
        {hasError ? errText : T.affHint}
      </p>
      <div className="aff__bonus">
        <div className="aff__bonus-icon"><Honeycomb size={36}/></div>
        <div className="aff__bonus-copy">
          <b>{T.affBonusVal}</b>
          <span>{T.affBonusSub}</span>
        </div>
      </div>
      <div className="aff__cta">
        <button
          className={`btn btn--primary btn--xl btn--wide aff__submit${(!formatOk||checking)?' is-disabled':''}`}
          onClick={submit}
          disabled={checking}>
          {checking ? 'ПЕРЕВІРКА...' : formatOk ? T.affBtnReady : T.affBtnEmpty}
        </button>
        <button className="aff__paste" onClick={paste}>{T.affPaste}</button>
      </div>
    </div>
  );
}

// ── START SCREEN ─────────────────────────────────────────────
function StartScreen({ onPlay, best, games }) {
  const T = getTexts();
  return (
    <div className="start screen">
      <div className="hex-deco" style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
        <Honeycomb size={130} style={{ position:'absolute', top:50,  right:-30, opacity:.16 }}/>
        <Honeycomb size={90}  style={{ position:'absolute', top:230, left:-20,  opacity:.14 }}/>
        <Honeycomb size={70}  style={{ position:'absolute', bottom:130, right:20, opacity:.10 }}/>
      </div>
      <div className="start__logo" dangerouslySetInnerHTML={{ __html: LOGO_SVG }}/>
      <div className="start__chip">{T.startChip}</div>
      <div className="start__hero">
        <div className="start__bolid"><BeeBolid size={200} number="1"/></div>
      </div>
      <div className="start__eyebrow">{T.startEyebrow}</div>
      <h1 className="start__title">
        {T.startTitle.split(' ')[0]}<br/>
        <span>{T.startTitle.split(' ').slice(1).join(' ')}</span>
      </h1>
      <p className="start__sub">{T.startSub}</p>
      <div className="start__cta">
        <button className="btn btn--primary btn--xl btn--wide" onClick={onPlay}>{T.startBtn}</button>
      </div>
      <div className="start__stats">
        <div className="start__stats-cell">
          <div className="start__stats-val">{best}</div>
          <div className="start__stats-lbl">{T.startRecordLbl}</div>
        </div>
        <div className="start__stats-cell">
          <div className="start__stats-val">{games}</div>
          <div className="start__stats-lbl">{T.startGamesLbl}</div>
        </div>
      </div>
    </div>
  );
}

// ── GAME OVER SCREEN ─────────────────────────────────────────
function GameOverScreen({ score, level, flowers, isNew, msg, onLb, onRetry }) {
  const T = getTexts();
  const statText = T.goStatTpl
    .replace('{level}', level)
    .replace('{flowers}', flowers);
  return (
    <div className="gameover screen">
      <div className="gameover__emoji">{T.goEmoji}</div>
      <div className="gameover__title">{msg}</div>
      <div className="gameover__score">{score}</div>
      <div className="gameover__sub">{statText}</div>
      {isNew && <div className="gameover__badge show">{T.goRecord}</div>}
      <div className="gameover__btns">
        <button className="btn btn--primary btn--wide" onClick={onLb}>{T.goLbBtn}</button>
        <button className="btn btn--ghost   btn--wide" onClick={onRetry}>{T.goRetryBtn}</button>
      </div>
    </div>
  );
}

// ── LEADERBOARD SCREEN ────────────────────────────────────────
function LeaderboardScreen({ onPlay }) {
  const T     = getTexts();
  const lb    = LS.get('mb_lb', []);
  const affId = LS.get('mb_affid', '');
  const me    = affId ? '#' + affId : TG_NAME;
  const medals = ['🥇','🥈','🥉'];
  return (
    <div className="lb screen">
      <div className="lb__logo" dangerouslySetInnerHTML={{ __html: LOGO_SVG }}/>
      <div className="lb__title">{T.lbTitle}</div>
      {lb.length === 0
        ? <div className="lb__empty">{T.lbEmpty}</div>
        : <div className="lb__list">
            {lb.map((e, i) => (
              <div key={i} className={`lb__row${e.name === me ?' lb__row--me':''}`}>
                <div className="lb__rank">{medals[i] || i+1}</div>
                <div className="lb__name">
                  {e.name === me ? T.lbMe + ' ' + e.name : e.name}
                </div>
                <div className="lb__pts">{e.score} 🌸</div>
              </div>
            ))}
          </div>
      }
      <br/>
      <button className="btn btn--primary" onClick={onPlay}>{T.playBtn}</button>
    </div>
  );
}
