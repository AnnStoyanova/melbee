// App.js — root component, screen routing

function App() {
  const [screen,  setScreen]  = useState('affiliate');
  const [gameKey, setGameKey] = useState(0);
  const [over,    setOver]    = useState(null);
  const [best,    setBest]    = useState(() => LS.get('mb_best',  0));
  const [games,   setGames]   = useState(() => LS.get('mb_games', 0));
  const [affId,   setAffId]   = useState(() => LS.get('mb_affid', ''));

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
    const msgs = getCrashMsgs();
    setOver({
      score: sc, level: st.level, flowers: st.flowers, isNew,
      msg: msgs[Math.floor(Math.random() * msgs.length)],
    });
    setScreen('over');
  };

  return (
    <div style={{ position:'relative', width:'100%', height:'100%', overflow:'hidden', background:'#1B1B20' }}>
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

// Telegram WebApp init: разворачиваем мини-приложение на полный экран
if (window.Telegram && window.Telegram.WebApp) {
  try {
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
  } catch (e) {}
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
