// App.js — root component, screen routing

// ── API URL (замінити на свій) ────────────────────────────────
const GAME_API_URL = 'https://melbee-admin.com/api';

// ── Відправка результату на сервер ───────────────────────────
async function sendSession(score, level, flowers, partnerId, tgData = {}) {
  try {
    await fetch(GAME_API_URL + '/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        score, level, flowers,
        partnerId:  partnerId || null,
        tgId:       tgData.id || null,
        tgUsername: tgData.username || null,
        tgName:     tgData.firstName || null,
      }),
    });
  } catch (e) {
    console.warn('API session error:', e);
  }
}

// ── Дата закінчення гри ───────────────────────────────────────
const GAME_END_DATE = new Date('2026-05-28T00:00:00');
const isGameEnded   = () => new Date() >= GAME_END_DATE;

// ── Екран завершення гри ──────────────────────────────────────
function GameEndedScreen() {
  const lb       = LS.get('mb_lb', []);
  const affId    = LS.get('mb_affid', '');
  const me       = affId ? '#' + affId : TG_NAME;
  const rankIcons = ['🥇','🥈','🥉'];

  return (
    <div style={{position:'absolute',inset:0,background:'#0D0D0D',display:'flex',flexDirection:'column',alignItems:'center',overflow:'hidden'}}>
      {/* Logo top */}
      <div style={{paddingTop:24,marginBottom:4}} dangerouslySetInnerHTML={{__html:LOGO_SVG}}/>

      {/* Повідомлення */}
      <div style={{
        width:'100%', padding:'20px 20px 0',
        boxSizing:'border-box', textAlign:'center',
      }}>
        <div style={{fontSize:48, marginBottom:8}}>🏁</div>
        <h1 style={{fontFamily:'Nunito,sans-serif',fontWeight:900,fontSize:26,color:'#fff',margin:'0 0 8px'}}>
          The hive is closing until the next flight 🐝
        </h1>
        <p style={{fontFamily:'Nunito,sans-serif',fontWeight:600,fontSize:14,color:'rgba(255,255,255,.5)',margin:'0 0 20px',lineHeight:1.5}}>
          Thanks to all participants!<br/>Here is the final leaderboard 🏆
        </p>
      </div>

      {/* Лідерборд */}
      <div style={{flex:1,width:'100%',padding:'0 16px',overflowY:'auto',boxSizing:'border-box',display:'flex',flexDirection:'column',gap:8}}>
        {lb.length === 0 ? (
          <div style={{textAlign:'center',color:'rgba(255,255,255,.3)',fontFamily:'Nunito,sans-serif',fontWeight:700,fontSize:14,marginTop:40}}>
            Записів немає
          </div>
        ) : lb.map((e, i) => (
          <div key={i} style={{
            display:'flex', alignItems:'center',
            background: e.name===me ? 'rgba(255,107,0,.1)' : '#1A1A1A',
            border: e.name===me ? '1.5px solid #FF6B00' : '1.5px solid rgba(255,255,255,.05)',
            borderRadius:12, padding:'12px 16px', gap:12,
          }}>
            <div style={{width:28,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Nunito,sans-serif',fontWeight:900,fontSize:i<3?18:14,color:i<3?'inherit':'rgba(255,255,255,.35)'}}>
              {rankIcons[i] || i+1}
            </div>
            <div style={{flex:1,fontFamily:'Nunito,sans-serif',fontWeight:800,fontSize:14,color:'#fff',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
              {e.name}
            </div>
            <div style={{fontFamily:'Nunito,sans-serif',fontWeight:900,fontSize:15,color:'#fff',display:'flex',alignItems:'center',gap:4}}>
              {e.score} <span style={{fontSize:13}}>🌸</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{padding:'16px 16px 28px',fontFamily:'Nunito,sans-serif',fontWeight:600,fontSize:12,color:'rgba(255,255,255,.25)',textAlign:'center'}}>
        MelBee · Final Results
      </div>
    </div>
  );
}

function App() {
  // Якщо гра завершена — одразу показуємо екран завершення
  if (isGameEnded()) {
    return (
      <div style={{position:'relative',width:GW,height:GH,overflow:'hidden',background:'#0D0D0D'}}>
        <GameEndedScreen/>
      </div>
    );
  }

  const [screen,  setScreen]  = useState('affiliate');
  const [gameKey, setGameKey] = useState(0);
  const [over,    setOver]    = useState(null);
  const [best,    setBest]    = useState(() => LS.get('mb_best',  0));
  const [games,   setGames]   = useState(() => LS.get('mb_games', 0));
  const [affId,   setAffId]   = useState(() => LS.get('mb_affid', ''));

  // При відкритті — перевіряємо чи TG юзер вже зареєстрований на сервері
  useEffect(() => {
    const tgId = tgUser?.id;
    if (!tgId) return;
    fetch(`${GAME_API_URL}/tg-user?tgId=${tgId}`)
      .then(r => r.json())
      .then(data => {
        if (data.partnerId) {
          LS.set('mb_affid', data.partnerId);
          setAffId(data.partnerId);
          setScreen('start'); // пропускаємо affiliate екран
        }
      })
      .catch(() => {
        // якщо API недоступний — перевіряємо localStorage
        const saved = LS.get('mb_affid', '');
        if (saved) setScreen('start');
      });
  }, []);

  const play = () => {
    applyConfig();           // підтягує параметри з адмінки перед кожною грою
    setGameKey(k => k + 1);
    setScreen('game');
    startBgMusic();
  };

  const onAffNext = id => { LS.set('mb_affid', id); setAffId(id); setScreen('start'); };
  const onAffSkip = ()  => setScreen('start');

  const onGameOver = st => {
    const sc = st.score, prev = LS.get('mb_best', 0), isNew = sc > prev;
    if (isNew) { LS.set('mb_best', sc); setBest(sc); }
    const g = LS.get('mb_games', 0) + 1;
    LS.set('mb_games', g); setGames(g);
    lbAdd(sc, LS.get('mb_affid', ''), {
      id:        tgUser?.id,
      username:  tgUser?.username,
      firstName: tgUser?.first_name,
      lastName:  tgUser?.last_name,
    });
    // Відправляємо на сервер
    sendSession(sc, st.level, st.flowers, LS.get('mb_affid', ''), {
      id:        tgUser?.id,
      username:  tgUser?.username,
      firstName: tgUser?.first_name,
    });
    const msgs = getCrashMsgs();
    setOver({
      score: sc, level: st.level, flowers: st.flowers, isNew,
      msg: msgs[Math.floor(Math.random() * msgs.length)],
    });
    setScreen('over');
  };

  return (
    <div style={{ position:'relative', width:GW, height:GH, overflow:'hidden', background:'#1B1B20' }}>
      {screen==='affiliate' && <AffiliateScreen onNext={onAffNext} onSkip={onAffSkip}/>}
      {screen==='start'     && <StartScreen onPlay={play} best={best} games={games}/>}
      {screen==='game'      && <GamePlay key={gameKey} onGameOver={onGameOver}/>}
      {screen==='over'      && over && (
        <GameOverScreen {...over} onLb={()=>setScreen('lb')} onRetry={play}/>
      )}
      {screen==='lb'        && <LeaderboardScreen onPlay={play}/>}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
