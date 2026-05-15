// GamePlay.js — main game loop, physics, canvas render

function GamePlay({ onGameOver }) {
  const canvasRef  = useRef(null);
  const overlayRef = useRef(null);
  const stRef      = useRef(null);
  const [score,   setScore]   = useState(0);
  const [level,   setLevel]   = useState(1);
  const [turbo,   setTurbo]   = useState(0);
  const [turboOn, setTurboOn] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const mkState = () => ({
    beeY: GH * .42, beeVY: 0, alive: true, paused: false,
    flapT: 0, frameT: 0, scrollY: 0,
    speed: BASE_SPEED, level: 1, score: 0, flowers: 0,
    turboCharge: 0, turboActive: false, turboTimer: 0,
    pipes: [], buds: [], particles: [],
    nextPipe: 160, nextBud: 40,
    lastTap: 0, shake: 0,
    died: false, deathSent: false,
  });

  useEffect(() => {
    stRef.current = mkState();
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    let raf;

    const addFloat = (x, y, text) => {
      if (!overlayRef.current) return;
      const el = document.createElement('div');
      el.className = 'floatup'; el.textContent = text;
      el.style.left = x + 'px'; el.style.top = y + 'px';
      overlayRef.current.appendChild(el);
      setTimeout(() => el.remove(), 720);
    };

    const doCrash = (st) => {
      st.alive = false; st.shake = 18;
      sfx.crash(); stopBgMusic();
      for (let i = 0; i < 18; i++) {
        const a = i/18 * Math.PI*2;
        st.particles.push({ x:BEE_X, y:st.beeY, vx:Math.cos(a)*6, vy:Math.sin(a)*6-3,
          rot:0, vr:.4, life:1.3, color:i%2?'#F5C518':'#FF7A1A', kind:'spark' });
      }
      raf = requestAnimationFrame(tick);
    };

    const tick = () => {
      const st = stRef.current;
      st.frameT++;

      // Пауза поки відкритий діалог турбо
      if (st.paused) {
        render(ctx, st);
        raf = requestAnimationFrame(tick); return;
      }

      if (!st.alive) {
        st.shake = Math.max(0, st.shake - 1);
        st.particles.forEach(p => { p.x+=p.vx; p.y+=p.vy; p.vy+=.22; p.rot+=p.vr; p.life-=.03; });
        st.particles = st.particles.filter(p => p.life > 0);
        render(ctx, st);
        if (!st.deathSent) { st.deathSent = true; setTimeout(() => onGameOver(st), 1100); }
        raf = requestAnimationFrame(tick); return;
      }

      st.flapT   += .18;
      st.scrollY += st.speed * .55;

      // Physics — grace period first 90 frames
      const gm = st.frameT < 90 ? .3 : 1;
      st.beeVY = Math.min(st.beeVY + GRAVITY * gm, 11);
      st.beeY += st.beeVY;

      // Level progression
      const nl = 1 + Math.floor(st.score / LVL_EVERY);
      if (nl > st.level) {
        st.level = nl;
        st.speed = Math.min(MAX_SPEED, BASE_SPEED + (nl-1) * SPEED_INC);
      }

      // Turbo timer
      if (st.turboActive) { st.turboTimer--; if (st.turboTimer <= 0) st.turboActive = false; }
      const spd = st.turboActive ? Math.min(MAX_SPEED + TURBO_BONUS, st.speed + TURBO_BONUS) : st.speed;

      // Spawn pipes
      st.nextPipe--;
      if (st.nextPipe <= 0) {
        const gapY = 80 + Math.random() * (GH - 80 - GAP_H - 80);
        st.pipes.push({ x: GW + PIPE_W, gapY, scored: false });
        st.nextPipe = Math.round(200 / (spd / BASE_SPEED));
      }
      st.pipes.forEach(p => p.x -= spd);
      st.pipes = st.pipes.filter(p => p.x > -PIPE_W - 10);

      // Spawn flowers
      st.nextBud--;
      if (st.nextBud <= 0) {
        st.buds.push({ x: GW + 10, y: 100 + Math.random() * (GH - 230), rot: 0, popT: 0, hit: false });
        st.nextBud = Math.round(38 + Math.random() * 28);
      }
      st.buds.forEach(b => { b.x -= spd; b.rot += .03; if (b.hit) b.popT++; });
      st.buds = st.buds.filter(b => b.x > -30 && b.popT < 18);

      // Collect flowers
      st.buds.forEach(b => {
        if (b.hit) return;
        if (Math.abs(b.x - BEE_X) < 36 && Math.abs(b.y - st.beeY) < 36) {
          b.hit = true; st.score++; st.flowers++;
          st.turboCharge = Math.min(TURBO_MAX, st.turboCharge + 1);
          sfx.flower();
          for (let i=0;i<7;i++) {
            const a = i/7*Math.PI*2;
            st.particles.push({ x:b.x, y:b.y, vx:Math.cos(a)*3, vy:Math.sin(a)*3-1, rot:0, vr:.2, life:1, color:'#A06BD9', kind:'petal' });
          }
          addFloat(BEE_X + 12, st.beeY - 22, '+1 🌸');
        }
      });

      // Turbo sparks
      if (st.turboActive && st.frameT % 3 === 0)
        st.particles.push({ x:BEE_X-30, y:st.beeY+20, vx:-3-Math.random()*2, vy:(Math.random()-.5)*2, rot:0, vr:.1, life:.9, color:'#FFD700', kind:'spark' });

      st.particles.forEach(p => { p.x+=p.vx; p.y+=p.vy; p.vy+=.18; p.rot+=p.vr; p.life-=.04; });
      st.particles = st.particles.filter(p => p.life > 0);

      // Collisions
      if (st.beeY < 16 || st.beeY > GH - 20) { doCrash(st); return; }
      for (const p of st.pipes) {
        if (BEE_X + BEE_HIT_R > p.x - PIPE_W/2 && BEE_X - BEE_HIT_R < p.x + PIPE_W/2) {
          if (st.beeY - BEE_HIT_R < p.gapY || st.beeY + BEE_HIT_R > p.gapY + GAP_H) {
            doCrash(st); return;
          }
        }
      }

      render(ctx, st);
      setScore(st.score); setLevel(st.level);
      setTurbo(st.turboCharge); setTurboOn(st.turboActive);
      setScrollY(st.scrollY);
      raf = requestAnimationFrame(tick);
    };

    const render = (ctx, st) => {
      ctx.clearRect(0, 0, GW, GH);
      ctx.save();
      if (st.shake > 0) {
        const s = st.shake * .55;
        ctx.translate((Math.random()-.5)*s, (Math.random()-.5)*s);
      }

      // Flowers
      st.buds.forEach(b => {
        if (!b.hit) { drawFlower(ctx, b.x, b.y, 38, b.rot); return; }
        if (b.popT < 15) {
          const sc = 1 + b.popT * .08;
          ctx.save(); ctx.translate(b.x, b.y); ctx.scale(sc, sc); ctx.translate(-b.x, -b.y);
          ctx.globalAlpha = 1 - b.popT/15;
          drawFlower(ctx, b.x, b.y, 38, b.rot);
          ctx.restore();
        }
      });

      // Pipes
      st.pipes.forEach(p => drawPipe(ctx, p.x - PIPE_W/2, p.gapY, p.gapY, GAP_H));

      // Particles
      st.particles.forEach(p => {
        ctx.save(); ctx.globalAlpha = Math.max(0, p.life);
        ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        if (p.kind === 'petal') { ctx.beginPath(); ctx.ellipse(0,0,5,3,0,0,Math.PI*2); ctx.fill(); }
        else { ctx.beginPath(); ctx.arc(0,0,p.r||4,0,Math.PI*2); ctx.fill(); }
        ctx.restore();
      });

      // Turbo trail
      if (st.turboActive) {
        for (let i=0;i<6;i++) {
          ctx.globalAlpha = .55 - i*.09;
          ctx.fillStyle = i%2 ? '#F5C518' : '#FF9A1A';
          ctx.beginPath(); ctx.arc(BEE_X-18-i*9, st.beeY+12+(Math.random()-.5)*8, 5.5-i*.6, 0, Math.PI*2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      // Bee
      drawBee(ctx, BEE_X, st.beeY, st.flapT, st.alive ? st.beeVY*.065 : st.frameT*.12, st.frameT, !st.alive);
      ctx.restore();
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const [turboConfirm, setTurboConfirm] = useState(false);
  const lastTapRef = useRef(0);

  const activateTurbo = useCallback(() => {
    const st = stRef.current;
    if (!st) return;
    st.turboActive = true; st.turboTimer = TURBO_FRAMES; st.turboCharge = 0;
    st.paused = false;
    sfx.turbo();
    setTurboConfirm(false);
  }, []);

  const handleTap = useCallback(() => {
    resumeAudio();
    const st = stRef.current;
    if (!st?.alive) return;
    const now = Date.now();
    // Подвійний тап з повним зарядом → показати підтвердження
    if (now - lastTapRef.current < DOUBLE_MS && st.turboCharge >= TURBO_MAX && !st.turboActive) {
      st.paused = true;
      setTurboConfirm(true);
      lastTapRef.current = now;
      return; // не стрибаємо при активації турбо
    }
    lastTapRef.current = now;
    sfx.jump();
    st.beeVY = JUMP_VY;
  }, []);

  useEffect(() => {
    const h = e => { if (e.code==='Space'||e.code==='ArrowUp') { e.preventDefault(); handleTap(); } };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [handleTap]);

  return (
    <div style={{ position:'absolute', inset:0, touchAction:'none' }}>
      <BgLayer scrollY={scrollY}/>
      <canvas ref={canvasRef} width={GW} height={GH}
        style={{ position:'absolute', inset:0, background:'transparent' }}
        onTouchStart={e => { e.preventDefault(); handleTap(); }}
        onMouseDown={e => { if (!e.isTrusted || e.pointerType === 'mouse') handleTap(); }}/>
      <div className="hud">
        <div className="hud__score">{score}</div>
        <div className="hud__level">Level {level}</div>
      </div>
      {turboConfirm && (
        <div style={{
          position:'absolute', inset:0, zIndex:100,
          background:'rgba(0,0,0,.65)',
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <div style={{
            background:'#1A1A22', borderRadius:20,
            padding:'28px 24px', width:280,
            boxShadow:'0 8px 40px rgba(0,0,0,.6)',
            textAlign:'center',
          }}>
            <div style={{fontSize:40, marginBottom:12}}>⚡</div>
            <div style={{fontFamily:'Nunito,sans-serif',fontWeight:900,fontSize:20,color:'#fff',marginBottom:8}}>
              Activate Turbo?
            </div>
            <div style={{fontFamily:'Nunito,sans-serif',fontWeight:600,fontSize:13,color:'rgba(255,255,255,.5)',marginBottom:24,lineHeight:1.5}}>
              Turbo mode makes pipes passable for a short time!
            </div>
            <button onClick={activateTurbo} style={{
              width:'100%', padding:'14px',
              background:'#FF6B00', border:'none', borderRadius:12,
              fontFamily:'Nunito,sans-serif', fontWeight:900,
              fontSize:16, color:'#fff', cursor:'pointer',
              marginBottom:10, WebkitTapHighlightColor:'transparent',
            }}>🚀 Activate!</button>
            <button onClick={() => { stRef.current.paused = false; setTurboConfirm(false); }} style={{
              width:'100%', padding:'14px',
              background:'rgba(255,255,255,.08)', border:'none', borderRadius:12,
              fontFamily:'Nunito,sans-serif', fontWeight:700,
              fontSize:16, color:'rgba(255,255,255,.6)', cursor:'pointer',
              WebkitTapHighlightColor:'transparent',
            }}>Cancel</button>
          </div>
        </div>
      )}
      <div className="turbo">
        <div className="turbo__label">⚡ Turbo </div>
        <div className="turbo__track"><div className="turbo__fill" style={{ width: (turbo/TURBO_MAX*100)+'%' }}/></div>
      </div>
      {turboOn && <div className="turbo__active">🚀 Turbo!</div>}
      <div ref={overlayRef} style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:25 }}/>
    </div>
  );
}
