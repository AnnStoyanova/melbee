// screens.js — Figma design: black/orange/yellow, honeycomb motif

// ── AFFILIATE SCREEN ─────────────────────────────────────────
function AffiliateScreen({ onNext, onSkip }) {
const T = getTexts();
const [id,       setId]       = useState(’’);
const [focused,  setFocused]  = useState(false);
const [error,    setError]    = useState(null);
const [checking, setChecking] = useState(false);

const formatOk = id.length >= 2 && /^[A-Za-z0-9_-]+$/.test(id);

const submit = async () => {
if (!formatOk) { setError(‘format’); return; }
setChecking(true);
try {
const apiUrl = window.GAME_API_URL || ‘https://melbee-admin.com/api’;
const tgId   = window.tgUser?.id || null;
const params = new URLSearchParams({ id: id.toUpperCase() });
if (tgId) params.append(‘tgId’, tgId);

```
  const res  = await fetch(`${apiUrl}/validate-partner?${params}`);
  const data = await res.json();

  if (data.reason === 'already_registered') {
    setError(`already:${data.partner_id}`);
  } else if (data.valid) {
    onNext(id.toUpperCase());
  } else {
    setError('unknown');
  }
} catch (e) {
  // Якщо API недоступний — перевіряємо локально
  const allowed = LS.get('mb_allowed_ids', []).map(s => s.toUpperCase());
  if (allowed.length === 0 || allowed.includes(id.toUpperCase())) {
    onNext(id.toUpperCase());
  } else {
    setError('unknown');
  }
} finally {
  setChecking(false);
}
```

};

const onChange = e => { const v = e.target.value.toUpperCase().slice(0,16); setId(v); if (error) setError(null); };

const isValid  = formatOk && error === null;
const hasError = error !== null;
const errText  = error === ‘format’
? ‘Invalid format. Allowed: A-Z, 0-9’
: error?.startsWith(‘already:’)
? `This TG account is already registered as #${error.split(':')[1]}`
: T.affError;

return (
<div style={{position:‘absolute’,inset:0,background:’#0D0D0D’,display:‘flex’,flexDirection:‘column’,alignItems:‘center’,padding:‘0 24px 32px’,overflow:‘hidden’,boxSizing:‘border-box’}}>
{/* Top hex shapes */}
<svg style={{position:‘absolute’,top:0,left:0,width:‘100%’,pointerEvents:‘none’,zIndex:0}} viewBox=“0 0 360 180” preserveAspectRatio=“xMidYMin meet”>
<polygon points="-20,50 20,27 60,50 60,96 20,119 -20,96" fill="#F5C518" opacity="0.95"/>
<polygon points="0,0 40,-23 80,0 80,46 40,69 0,46" fill="#FFC107" opacity="0.8"/>
<polygon points="300,50 340,27 380,50 380,96 340,119 300,96" fill="#F5C518" opacity="0.95"/>
<polygon points="280,0 320,-23 360,0 360,46 320,69 280,46" fill="#FFC107" opacity="0.8"/>
</svg>

```
  <div style={{position:'relative',zIndex:1,width:'100%',display:'flex',flexDirection:'column',alignItems:'center',flex:1}}>
    {/* Bee */}
    <div style={{marginTop:56,marginBottom:12}}>
      <Bee size={100} variant="fly"/>
    </div>
    {/* Title */}
    <h1 style={{fontFamily:'Nunito,sans-serif',fontWeight:900,fontSize:34,color:'#fff',margin:'0 0 8px',textAlign:'center'}}>MelBee</h1>
    {/* Sub */}
    <p style={{fontFamily:'Nunito,sans-serif',fontWeight:600,fontSize:14,color:'rgba(255,255,255,.5)',textAlign:'center',lineHeight:1.5,margin:'0 0 24px'}}>
      Enter your affiliate ID<br/>to start the game
    </p>
    {/* Input */}
    <div style={{width:'100%',background:'#fff',borderRadius:12,padding:'12px 16px',marginBottom:hasError?6:14,border:hasError?'2px solid #FF4444':isValid?'2px solid #4CAF50':'2px solid transparent',boxSizing:'border-box'}}>
      <div style={{fontSize:10,fontWeight:800,letterSpacing:'.14em',color:'rgba(0,0,0,.4)',marginBottom:4,fontFamily:'Nunito,sans-serif'}}>YOUR PARTNER ID</div>
      <div style={{display:'flex',alignItems:'center',gap:8}}>
        <span style={{fontSize:22,fontWeight:900,color:'#FF6B00',fontFamily:'Nunito,sans-serif'}}>#</span>
        <input
          style={{flex:1,background:'none',border:'none',outline:'none',fontFamily:'Nunito,sans-serif',fontSize:22,fontWeight:800,color:'#111',letterSpacing:'.04em'}}
          type="text" value={id} placeholder="BEE3X42"
          onChange={onChange} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
          spellCheck={false} autoComplete="off"
        />
        {isValid && <svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#4CAF50"/><path d="M6 12L10 16L18 8" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        {checking && <span style={{fontSize:18}}>⏳</span>}
      </div>
    </div>
    {hasError && <p style={{color:'#FF4444',fontSize:12,fontWeight:700,margin:'0 0 10px',fontFamily:'Nunito,sans-serif',alignSelf:'flex-start'}}>{errText}</p>}
    {/* Button */}
    <button onClick={submit} disabled={checking} style={{width:'100%',padding:'18px',background:formatOk?'#FF6B00':'#333',border:'none',borderRadius:14,fontFamily:'Nunito,sans-serif',fontWeight:900,fontSize:18,color:'#fff',letterSpacing:'.04em',cursor:formatOk?'pointer':'default',WebkitTapHighlightColor:'transparent',boxSizing:'border-box'}}>
      {checking ? 'CHECKING...' : formatOk ? "LET'S FLY! →" : 'ENTER YOUR ID'}
    </button>
  </div>
</div>
```

);
}

// ── START SCREEN ─────────────────────────────────────────────
function StartScreen({ onPlay, best, games }) {
const T = getTexts();
const hexPts = (cx,cy,r) => Array.from({length:6},(_,i)=>{const a=Math.PI/3*i+Math.PI/6;return `${cx+Math.cos(a)*r},${cy+Math.sin(a)*r}`;}).join(’ ‘);
return (
<div style={{position:‘absolute’,inset:0,background:’#0D0D0D’,display:‘flex’,flexDirection:‘column’,alignItems:‘center’,overflow:‘hidden’}}>
{/* Yellow top */}
<div style={{width:‘100%’,minHeight:‘44%’,background:‘linear-gradient(180deg,#FFC107 0%,#FF8C00 100%)’,position:‘relative’,flexShrink:0,display:‘flex’,flexDirection:‘column’,alignItems:‘center’,justifyContent:‘flex-end’,paddingBottom:16}}>
<svg style={{position:‘absolute’,inset:0,width:‘100%’,height:‘100%’,pointerEvents:‘none’}} viewBox=“0 0 360 320” preserveAspectRatio=“xMidYMid slice”>
{[[-45,20,90],[-45,145,90],[270,20,90],[270,145,90]].map(([x,y,s],i)=>(
<polygon key={i} points={hexPts(x,y,s)} fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="2"/>
))}
</svg>
{/* Logo */}
<div style={{position:‘absolute’,top:18,left:0,right:0,display:‘flex’,justifyContent:‘center’}}>
<div dangerouslySetInnerHTML={{__html:LOGO_SVG.replace(/fill=”#FFBC00”/g,‘fill=”#000”’).replace(/fill=“white”/g,‘fill=”#000”’)}}/>
</div>
{/* Chip */}
<div style={{position:‘absolute’,top:50,border:‘1.5px solid rgba(0,0,0,.3)’,borderRadius:999,padding:‘4px 14px’,fontFamily:‘Nunito,sans-serif’,fontSize:11,fontWeight:800,letterSpacing:’.14em’,color:‘rgba(0,0,0,.65)’}}>
TELEGRAM MINI APP
</div>
{/* Bee */}
<div style={{marginTop:80}}>
<Bee size={160} variant="fly"/>
</div>
</div>

```
  {/* Dark bottom */}
  <div style={{flex:1,width:'100%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'20px 24px 20px',boxSizing:'border-box'}}>
    <h1 style={{fontFamily:'Nunito,sans-serif',fontWeight:900,fontSize:44,color:'#fff',margin:'0 0 10px',textAlign:'center'}}>MelBee</h1>
    <p style={{fontFamily:'Nunito,sans-serif',fontWeight:600,fontSize:13,color:'rgba(255,255,255,.5)',textAlign:'center',lineHeight:1.6,margin:'0 0 22px'}}>{T.startSub}</p>
    {/* Play button */}
    <button onClick={onPlay} style={{width:'100%',padding:'18px',background:'#FF6B00',border:'none',borderRadius:14,fontFamily:'Nunito,sans-serif',fontWeight:900,fontSize:20,color:'#fff',cursor:'pointer',marginBottom:14,WebkitTapHighlightColor:'transparent',boxShadow:'0 4px 20px rgba(255,107,0,.4)',boxSizing:'border-box'}}>
      {T.startBtn}
    </button>
    {/* Stats */}
    <div style={{width:'100%',background:'#fff',borderRadius:14,padding:'14px 24px',display:'flex',alignItems:'center',boxSizing:'border-box'}}>
      <div style={{flex:1,textAlign:'center'}}>
        <div style={{fontFamily:'Nunito,sans-serif',fontWeight:900,fontSize:28,color:'#111'}}>{best}</div>
        <div style={{fontFamily:'Nunito,sans-serif',fontWeight:700,fontSize:11,color:'rgba(0,0,0,.4)',display:'flex',alignItems:'center',justifyContent:'center',gap:4}}><span>🌸</span> record</div>
      </div>
      <div style={{width:1,height:40,background:'rgba(0,0,0,.1)'}}/>
      <div style={{flex:1,textAlign:'center'}}>
        <div style={{fontFamily:'Nunito,sans-serif',fontWeight:900,fontSize:28,color:'#111'}}>{games}</div>
        <div style={{fontFamily:'Nunito,sans-serif',fontWeight:700,fontSize:11,color:'rgba(0,0,0,.4)',display:'flex',alignItems:'center',justifyContent:'center',gap:4}}><span>🎮</span> games</div>
      </div>
    </div>
  </div>
</div>
```

);
}

// ── GAME OVER SCREEN ─────────────────────────────────────────
function GameOverScreen({ score, level, flowers, isNew, msg, onLb, onRetry }) {
const T = getTexts();
const hexPts = (cx,cy,r) => Array.from({length:6},(_,i)=>{const a=Math.PI/3*i+Math.PI/6;return `${cx+Math.cos(a)*r},${cy+Math.sin(a)*r}`;}).join(’ ‘);
return (
<div style={{position:‘absolute’,inset:0,background:’#0D0D0D’,display:‘flex’,flexDirection:‘column’,alignItems:‘center’,overflow:‘hidden’}}>
{/* Yellow top */}
<div style={{width:‘100%’,minHeight:‘38%’,background:‘linear-gradient(180deg,#FFC107 0%,#FF8C00 100%)’,position:‘relative’,flexShrink:0}}>
<svg style={{position:‘absolute’,inset:0,width:‘100%’,height:‘100%’,pointerEvents:‘none’}} viewBox=“0 0 360 280” preserveAspectRatio=“xMidYMid slice”>
{[[-45,20,90],[-45,145,90],[270,20,90],[270,145,90]].map(([x,y,s],i)=>(
<polygon key={i} points={hexPts(x,y,s)} fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="2"/>
))}
</svg>
<div style={{position:‘absolute’,top:18,left:0,right:0,display:‘flex’,justifyContent:‘center’}}>
<div dangerouslySetInnerHTML={{__html:LOGO_SVG.replace(/fill=”#FFBC00”/g,‘fill=”#000”’).replace(/fill=“white”/g,‘fill=”#000”’)}}/>
</div>
<div style={{position:‘absolute’,top:50,left:0,right:0,display:‘flex’,justifyContent:‘center’}}>
<div style={{border:‘1.5px solid rgba(0,0,0,.3)’,borderRadius:999,padding:‘4px 14px’,fontFamily:‘Nunito,sans-serif’,fontSize:11,fontWeight:800,letterSpacing:’.14em’,color:‘rgba(0,0,0,.65)’}}>
TELEGRAM MINI APP
</div>
</div>
</div>

```
  {/* Dark bottom */}
  <div style={{flex:1,width:'100%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'16px 24px 24px',boxSizing:'border-box'}}>
    <div style={{fontFamily:'Nunito,sans-serif',fontWeight:700,fontSize:16,color:'rgba(255,255,255,.55)',marginBottom:6}}>{msg}</div>
    <div style={{fontFamily:'Nunito,sans-serif',fontWeight:900,fontSize:80,color:'#FF6B00',lineHeight:1,marginBottom:6}}>{score}</div>
    <div style={{fontFamily:'Nunito,sans-serif',fontWeight:700,fontSize:13,color:'rgba(255,255,255,.45)',textAlign:'center',marginBottom:isNew?10:20,lineHeight:1.6}}>
      Level {level}<br/>{flowers} Flowers 🌸
    </div>
    {isNew && <div style={{background:'#FF6B00',borderRadius:999,padding:'5px 18px',marginBottom:18,fontFamily:'Nunito,sans-serif',fontWeight:900,fontSize:13,color:'#fff',letterSpacing:'.06em'}}>{T.goRecord}</div>}
    <button onClick={onLb} style={{width:'100%',padding:'17px',background:'#FF6B00',border:'none',borderRadius:14,fontFamily:'Nunito,sans-serif',fontWeight:900,fontSize:18,color:'#fff',cursor:'pointer',marginBottom:10,WebkitTapHighlightColor:'transparent',boxSizing:'border-box',display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
      {T.goLbBtn}
    </button>
    <button onClick={onRetry} style={{width:'100%',padding:'17px',background:'#F5C518',border:'none',borderRadius:14,fontFamily:'Nunito,sans-serif',fontWeight:900,fontSize:18,color:'#000',cursor:'pointer',WebkitTapHighlightColor:'transparent',boxSizing:'border-box'}}>
      {T.goRetryBtn}
    </button>
  </div>
</div>
```

);
}

// ── LEADERBOARD SCREEN ────────────────────────────────────────
function LeaderboardScreen({ onPlay }) {
const T   = getTexts();
const affId = LS.get(‘mb_affid’, ‘’);
const me  = affId ? ‘#’ + affId : TG_NAME;
const rankIcons = [‘🥇’,‘🥈’,‘🥉’];

const [lb,      setLb]      = useState(LS.get(‘mb_lb’, []));
const [loading, setLoading] = useState(true);

useEffect(() => {
fetch(‘https://melbee-admin.com/api/leaderboard’)
.then(r => r.json())
.then(data => {
if (data.leaderboard && data.leaderboard.length > 0) {
// API повертає {partner_id, score} — нормалізуємо
const rows = data.leaderboard.map(e => ({
name:  e.partner_id ? ‘#’ + e.partner_id : (e.tg_username ? ‘@’ + e.tg_username : ‘?’),
score: e.score,
}));
setLb(rows);
LS.set(‘mb_lb’, rows);
}
})
.catch(() => {}) // якщо API недоступний — показуємо локальний
.finally(() => setLoading(false));
}, []);
return (
<div style={{position:‘absolute’,inset:0,background:’#0D0D0D’,display:‘flex’,flexDirection:‘column’,alignItems:‘center’,overflow:‘hidden’}}>
{/* Logo */}
<div style={{paddingTop:22,marginBottom:6}} dangerouslySetInnerHTML={{__html:LOGO_SVG}}/>
{/* Title */}
<div style={{fontFamily:‘Nunito,sans-serif’,fontWeight:900,fontSize:22,color:’#fff’,display:‘flex’,alignItems:‘center’,gap:8,marginBottom:16}}>
🏆 LEADERBOARD
</div>
{/* List */}
<div style={{flex:1,width:‘100%’,padding:‘0 16px’,overflowY:‘auto’,boxSizing:‘border-box’,display:‘flex’,flexDirection:‘column’,gap:8}}>
{loading ? (
<div style={{textAlign:‘center’,color:‘rgba(255,255,255,.4)’,fontFamily:‘Nunito,sans-serif’,fontWeight:700,fontSize:14,marginTop:40}}>Loading… ⏳</div>
) : lb.length === 0 ? (
<div style={{textAlign:‘center’,color:‘rgba(255,255,255,.3)’,fontFamily:‘Nunito,sans-serif’,fontWeight:700,fontSize:14,marginTop:40}}>{T.lbEmpty}</div>
) : lb.map((e,i) => (
<div key={i} style={{display:‘flex’,alignItems:‘center’,background:e.name===me?‘rgba(255,107,0,.1)’:’#1A1A1A’,border:e.name===me?‘1.5px solid #FF6B00’:‘1.5px solid rgba(255,255,255,.05)’,borderRadius:12,padding:‘12px 16px’,gap:12}}>
<div style={{width:28,display:‘flex’,alignItems:‘center’,justifyContent:‘center’,fontFamily:‘Nunito,sans-serif’,fontWeight:900,fontSize:i<3?18:14,color:i<3?‘inherit’:‘rgba(255,255,255,.35)’}}>
{rankIcons[i] || i+1}
</div>
<div style={{flex:1,fontFamily:‘Nunito,sans-serif’,fontWeight:800,fontSize:14,color:’#fff’,overflow:‘hidden’,textOverflow:‘ellipsis’,whiteSpace:‘nowrap’}}>{e.name}</div>
<div style={{fontFamily:‘Nunito,sans-serif’,fontWeight:900,fontSize:15,color:’#fff’,display:‘flex’,alignItems:‘center’,gap:4}}>{e.score} <span style={{fontSize:13}}>🌸</span></div>
</div>
))}
</div>
{/* Play again */}
<div style={{padding:‘14px 16px 28px’,width:‘100%’,boxSizing:‘border-box’}}>
<button onClick={onPlay} style={{width:‘100%’,padding:‘18px’,background:’#FF6B00’,border:‘none’,borderRadius:14,fontFamily:‘Nunito,sans-serif’,fontWeight:900,fontSize:18,color:’#fff’,cursor:‘pointer’,WebkitTapHighlightColor:‘transparent’,display:‘flex’,alignItems:‘center’,justifyContent:‘center’,gap:8}}>
🎮 {T.playBtn}
</button>
</div>
</div>
);
}