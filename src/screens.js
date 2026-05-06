// screens.js — AffiliateScreen, StartScreen, GameOverScreen, LeaderboardScreen



// ──────────────────────────────

function AffiliateScreen({ onNext, onSkip }) {
  const T = getTexts();
  const [id,      setId]      = useState('');
  const [focused, setFocused] = useState(false);
  const [error,   setError]   = useState(false);
  const valid = id.length >= 4 && /^[A-Za-z0-9_-]+$/.test(id);

  const onChange = e => { const v = e.target.value.toUpperCase().slice(0,16); setId(v); if (error) setError(false); };
  const submit   = () => valid ? onNext(id) : setError(true);
  const paste    = async () => { try { setId((await navigator.clipboard.readText()).trim().toUpperCase().slice(0,16)); } catch {} };

  return (
    <div className="aff screen">
      {/* Hex background decorations */}
      <svg className="hex-deco" viewBox="0 0 360 640" xmlns="http://www.w3.org/2000/svg">
        {[[300,80,90],[30,200,70],[310,480,60]].map(([cx,cy,r],i)=>{
          const pts=[];for(let j=0;j<6;j++){const a=Math.PI/3*j+Math.PI/6;pts.push(`${cx+Math.cos(a)*r},${cy+Math.sin(a)*r}`);}
          return <polygon key={i} points={pts.join(' ')} fill="none" stroke="#F5C518" strokeWidth="1.5" opacity="0.12"/>;
        })}
      </svg>
      <div className="aff__top">
        <button className="aff__back" onClick={onSkip}>‹</button>
        <span className="aff__step">КРОК 1 / 2</span>
        <span className="aff__skip" onClick={onSkip}>ПРОПУСТИТИ</span>
      </div>
      <div className="aff__hero">
        <div className="aff__bee-wrap"><Bee size={110} variant="fly"/></div>
      </div>
      <div className="aff__eyebrow">ПРИЄДНАННЯ</div>
      <h1 className="aff__title">{T.affTitle.split(' ')[0]}<br/><span>{T.affTitle.split(' ').slice(1).join(' ')||'ID'}</span></h1>
      <p className="aff__sub">{T.affSub}</p>
      <label className={`aff__field${focused?' is-focused':''}${error?' is-error':''}${valid?' is-valid':''}`}>
        <span className="aff__field-label">YOUR PARTNER ID</span>
        <div className="aff__field-row">
          <span className="aff__field-prefix">#</span>
          <input className="aff__input" type="text" value={id} placeholder="BEE7X42"
            onChange={onChange} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
            spellCheck={false} autoComplete="off"/>
          {valid && <svg width="22" height="22" viewBox="0 0 22 22"><path d="M5 11L9 15L17 7" stroke="#7BC043" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        </div>
      </label>
      <p className={`aff__hint${error?' aff__hint--err':''}`}>
        {error ? 'Невірний формат. Дозволено: A–Z, 0–9, _ –' : 'Знайди код у листі або у свого менеджера.'}
      </p>
      <div className="aff__bonus">
        <div className="aff__bonus-icon"><Honeycomb size={36}/></div>
        <div className="aff__bonus-copy"><b>+500 МЕДУ</b><span>стартовий бонус за ID</span></div>
      </div>
      <div className="aff__cta">
        <button className={`btn btn--primary btn--xl btn--wide aff__submit${!valid?' is-disabled':''}`} onClick={submit}>
          {valid ? 'ПОЇХАЛИ →' : 'ВВЕДИ ID'}
        </button>
        <button className="aff__paste" onClick={paste}>📋 Вставити з буфера</button>
      </div>
    </div>
  );
}



// ──────────────────────────────

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
      <div className="start__chip">TELEGRAM MINI APP</div>
      <div className="start__hero">
        <div className="start__bolid"><BeeBolid size={200} number="1"/></div>
      </div>
      <div className="start__eyebrow">EPISODE 01</div>
      <h1 className="start__title">{T.startTitle.split(' ')[0]}<br/><span>{T.startTitle.split(' ').slice(1).join(' ')}</span></h1>
      <p className="start__sub">{T.startSub}</p>
      <div className="start__cta">
        <button className="btn btn--primary btn--xl btn--wide" onClick={onPlay}>{T.startBtn}</button>
      </div>
      <div className="start__stats">
        <div className="start__stats-cell">
          <div className="start__stats-val">{best}</div>
          <div className="start__stats-lbl">Рекорд 🌸</div>
        </div>
        <div className="start__stats-cell">
          <div className="start__stats-val">{games}</div>
          <div className="start__stats-lbl">Ігор</div>
        </div>
      </div>
    </div>
  );
}



// ──────────────────────────────

function GameOverScreen({ score, level, flowers, isNew, msg, onLb, onRetry }) {
  const T = getTexts();
  return (
    <div className="gameover screen">
      <div className="gameover__emoji">💥</div>
      <div className="gameover__title">{msg}</div>
      <div className="gameover__score">{score}</div>
      <div className="gameover__sub">Рівень {level} · 🌸 {flowers} квіток</div>
      {isNew && <div className="gameover__badge show">🏆 НОВИЙ РЕКОРД!</div>}
      <div className="gameover__btns">
        <button className="btn btn--primary btn--wide" onClick={onLb}>{T.lbBtn}</button>
        <button className="btn btn--ghost   btn--wide" onClick={onRetry}>Ще раз</button>
      </div>
    </div>
  );
}



// ──────────────────────────────

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
        ? <div className="lb__empty">Рекордів нема! Будь першим 🐝</div>
        : <div className="lb__list">
            {lb.map((e, i) => (
              <div key={i} className={`lb__row${e.name===me?' lb__row--me':''}`}>
                <div className="lb__rank">{medals[i] || i+1}</div>
                <div className="lb__name">{e.name===me ? '👤 '+e.name : e.name}</div>
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
