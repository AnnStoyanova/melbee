// sprites.js — React SVG components (design source)
// BeeBolid, Bee, MiniBee, Flower, Rock, Hive, Honeycomb, Bush,
// LawnFlowers, FencePost, Fence, WindingPath, getPathX

// Bee sprites — v3. Sticker-style cartoon bee: thick white outline,
// round yellow body with two thick black stripes, white leaf wings,
// loop-tip antennae, simple smile, small stinger. Matches the
// reference screenshot. The bee no longer has wheels/exhaust — it
// flies (was a "bee-bolid" racer before).

const C = {
  honey: '#F5C518',
  honeyDeep: '#E0A800',
  honeyDark: '#C28A00',
  amber: '#FF9A1A',
  black: '#1A1208',
  ink: '#231708',
  cream: '#FFF4D6',
  pathLight: '#F2C04A',
  pathDark: '#C88A1A',
  curbCream: '#FFE9B0',
  curbBrown: '#7A4A1A',
  woodLight: '#B07A38',
  wood: '#8B5A2B',
  woodDark: '#5C3A1A',
  grass: '#9BC940',
  grassDeep: '#6FA22D',
  grassDark: '#4F8023',
  petal: '#A06BD9',
  petalDeep: '#7A4ABF',
  stone: '#B0B0B0',
  stoneDark: '#6F6F6F',
  wingFill: '#FFFFFF',
  wingEdge: '#D0D0D0',
  stickerOutline: '#FFFFFF',
};

// =================== BEE-BOLID (sticker-style flying bee, game character) ===================
// Same function signature as before so the rest of the game keeps working.
// The `number` prop is accepted (no error) but the race-number plate has been
// removed along with the wheels and exhaust — the bee just flies now.
function BeeBolid({ size = 160, style, number = '1' }) {
  const w = size * 0.7, h = size;
  return (
    <svg width={w} height={h} viewBox="0 0 100 140" style={style} className="beebolid">
      <defs>
        <clipPath id="bbBodyClip">
          <ellipse cx="50" cy="66" rx="27" ry="34"/>
        </clipPath>
      </defs>

      {/* Stinger — drawn behind body so only the tip shows */}
      <path d="M 45 100 L 50 121 L 55 100 Z" fill={C.stickerOutline}/>
      <path d="M 47 100 L 50 117 L 53 100 Z" fill={C.honey}/>

      {/* Left wing */}
      <g className="bb__wing bb__wing--l" style={{ transformOrigin: '32px 56px' }}>
        <ellipse cx="22" cy="56" rx="21" ry="15" fill={C.wingFill} transform="rotate(12 22 56)"/>
        <ellipse cx="22" cy="56" rx="18" ry="12" fill={C.wingFill} stroke={C.wingEdge} strokeWidth="0.4" transform="rotate(12 22 56)"/>
      </g>

      {/* Right wing */}
      <g className="bb__wing bb__wing--r" style={{ transformOrigin: '68px 56px' }}>
        <ellipse cx="78" cy="56" rx="21" ry="15" fill={C.wingFill} transform="rotate(-12 78 56)"/>
        <ellipse cx="78" cy="56" rx="18" ry="12" fill={C.wingFill} stroke={C.wingEdge} strokeWidth="0.4" transform="rotate(-12 78 56)"/>
      </g>

      {/* Left antenna — sticker outline + thin black line + loop tip */}
      <g className="bb__antenna bb__antenna--l" style={{ transformOrigin: '43px 36px' }}>
        <path d="M 44 40 Q 32 22 28 8" stroke={C.stickerOutline} strokeWidth="4.2" fill="none" strokeLinecap="round"/>
        <path d="M 44 40 Q 32 22 28 8" stroke={C.black} strokeWidth="1.6" fill="none" strokeLinecap="round"/>
        <circle cx="28" cy="8" r="4" fill={C.stickerOutline}/>
        <circle cx="28" cy="8" r="2.7" fill={C.stickerOutline} stroke={C.black} strokeWidth="1.1"/>
      </g>

      {/* Right antenna */}
      <g className="bb__antenna bb__antenna--r" style={{ transformOrigin: '57px 36px' }}>
        <path d="M 56 40 Q 68 22 72 8" stroke={C.stickerOutline} strokeWidth="4.2" fill="none" strokeLinecap="round"/>
        <path d="M 56 40 Q 68 22 72 8" stroke={C.black} strokeWidth="1.6" fill="none" strokeLinecap="round"/>
        <circle cx="72" cy="8" r="4" fill={C.stickerOutline}/>
        <circle cx="72" cy="8" r="2.7" fill={C.stickerOutline} stroke={C.black} strokeWidth="1.1"/>
      </g>

      {/* Body — white sticker halo + yellow fill (single round shape, no separate head) */}
      <ellipse cx="50" cy="66" rx="30.5" ry="37.5" fill={C.stickerOutline}/>
      <ellipse cx="50" cy="66" rx="27" ry="34" fill={C.honey}/>

      {/* Two thick black stripes, clipped to body so they follow its curve */}
      <g clipPath="url(#bbBodyClip)">
        <ellipse cx="50" cy="58" rx="30" ry="7" fill={C.black}/>
        <ellipse cx="50" cy="79" rx="28" ry="6.5" fill={C.black}/>
      </g>

      {/* Face — oval eyes + simple smile */}
      <ellipse cx="44" cy="46" rx="2.2" ry="3.1" fill={C.black}/>
      <ellipse cx="56" cy="46" rx="2.2" ry="3.1" fill={C.black}/>
      <path d="M 45.5 51.5 Q 50 55 54.5 51.5" stroke={C.black} strokeWidth="1.4" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

// =================== STANDALONE BEE (menu / library) ===================
// Same sticker style. `variant='angry'` swaps the eyes for angry slashes.
function Bee({ size = 100, variant = 'fly', flap = true, style }) {
  const s = size;
  const clipId = `beeBodyClip-${variant}`;
  return (
    <svg width={s} height={s} viewBox="0 0 100 100" style={style} className={`bee bee--${variant} ${flap ? 'bee--flap' : ''}`}>
      <defs>
        <clipPath id={clipId}>
          <ellipse cx="50" cy="55" rx="26" ry="30"/>
        </clipPath>
      </defs>

      {/* Stinger */}
      <path d="M 46 87 L 50 99 L 54 87 Z" fill={C.stickerOutline}/>
      <path d="M 47.5 87 L 50 96 L 52.5 87 Z" fill={C.honey}/>

      {/* Left wing */}
      <g className="bee__wing bee__wing--l" style={{ transformOrigin: '34px 46px' }}>
        <ellipse cx="22" cy="44" rx="20" ry="14" fill={C.wingFill} transform="rotate(12 22 44)"/>
        <ellipse cx="22" cy="44" rx="17" ry="11" fill={C.wingFill} stroke={C.wingEdge} strokeWidth="0.4" transform="rotate(12 22 44)"/>
      </g>

      {/* Right wing */}
      <g className="bee__wing bee__wing--r" style={{ transformOrigin: '66px 46px' }}>
        <ellipse cx="78" cy="44" rx="20" ry="14" fill={C.wingFill} transform="rotate(-12 78 44)"/>
        <ellipse cx="78" cy="44" rx="17" ry="11" fill={C.wingFill} stroke={C.wingEdge} strokeWidth="0.4" transform="rotate(-12 78 44)"/>
      </g>

      {/* Left antenna */}
      <g className="bee__antenna bee__antenna--l" style={{ transformOrigin: '43px 28px' }}>
        <path d="M 44 30 Q 34 14 30 4" stroke={C.stickerOutline} strokeWidth="4" fill="none" strokeLinecap="round"/>
        <path d="M 44 30 Q 34 14 30 4" stroke={C.black} strokeWidth="1.6" fill="none" strokeLinecap="round"/>
        <circle cx="30" cy="4" r="3.7" fill={C.stickerOutline}/>
        <circle cx="30" cy="4" r="2.5" fill={C.stickerOutline} stroke={C.black} strokeWidth="1.1"/>
      </g>

      {/* Right antenna */}
      <g className="bee__antenna bee__antenna--r" style={{ transformOrigin: '57px 28px' }}>
        <path d="M 56 30 Q 66 14 70 4" stroke={C.stickerOutline} strokeWidth="4" fill="none" strokeLinecap="round"/>
        <path d="M 56 30 Q 66 14 70 4" stroke={C.black} strokeWidth="1.6" fill="none" strokeLinecap="round"/>
        <circle cx="70" cy="4" r="3.7" fill={C.stickerOutline}/>
        <circle cx="70" cy="4" r="2.5" fill={C.stickerOutline} stroke={C.black} strokeWidth="1.1"/>
      </g>

      {/* Body */}
      <ellipse cx="50" cy="55" rx="29.5" ry="33.5" fill={C.stickerOutline}/>
      <ellipse cx="50" cy="55" rx="26" ry="30" fill={C.honey}/>

      {/* Stripes */}
      <g clipPath={`url(#${clipId})`}>
        <ellipse cx="50" cy="48" rx="29" ry="6.2" fill={C.black}/>
        <ellipse cx="50" cy="67" rx="27" ry="5.7" fill={C.black}/>
      </g>

      {/* Face */}
      {variant === 'angry' ? (
        <>
          <path d="M 39 35 L 47 39" stroke={C.black} strokeWidth="2.2" strokeLinecap="round"/>
          <path d="M 61 35 L 53 39" stroke={C.black} strokeWidth="2.2" strokeLinecap="round"/>
        </>
      ) : (
        <>
          <ellipse cx="43" cy="37" rx="2.1" ry="2.9" fill={C.black}/>
          <ellipse cx="57" cy="37" rx="2.1" ry="2.9" fill={C.black}/>
        </>
      )}
      <path d="M 45 42 Q 50 45.5 55 42" stroke={C.black} strokeWidth="1.3" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

// =================== MINI BEE (small icon for HUD / lists) ===================
// Simplified for tiny sizes — same sticker style but no per-element halo
// on the thin antenna line (would be heavier than the line itself).
function MiniBee({ size = 22, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" style={style} className="minibee">
      <defs>
        <clipPath id="miniBeeBodyClip">
          <ellipse cx="15" cy="17" rx="7" ry="8"/>
        </clipPath>
      </defs>
      {/* Wings */}
      <ellipse className="minibee__wing" cx="7" cy="13" rx="5.5" ry="3.5" fill={C.wingFill} stroke={C.wingEdge} strokeWidth="0.3" style={{ transformOrigin: '11px 14px' }}/>
      <ellipse className="minibee__wing minibee__wing--r" cx="23" cy="13" rx="5.5" ry="3.5" fill={C.wingFill} stroke={C.wingEdge} strokeWidth="0.3" style={{ transformOrigin: '19px 14px' }}/>
      {/* Antennae */}
      <path d="M 13 10 Q 11 5 9.5 2.5" stroke={C.black} strokeWidth="0.9" fill="none" strokeLinecap="round"/>
      <path d="M 17 10 Q 19 5 20.5 2.5" stroke={C.black} strokeWidth="0.9" fill="none" strokeLinecap="round"/>
      <circle cx="9.5" cy="2.5" r="1.4" fill={C.wingFill} stroke={C.black} strokeWidth="0.7"/>
      <circle cx="20.5" cy="2.5" r="1.4" fill={C.wingFill} stroke={C.black} strokeWidth="0.7"/>
      {/* Body */}
      <ellipse cx="15" cy="17" rx="8.2" ry="9.2" fill={C.stickerOutline}/>
      <ellipse cx="15" cy="17" rx="7" ry="8" fill={C.honey}/>
      {/* Stripes */}
      <g clipPath="url(#miniBeeBodyClip)">
        <ellipse cx="15" cy="15.5" rx="8" ry="1.8" fill={C.black}/>
        <ellipse cx="15" cy="20.5" rx="7.5" ry="1.6" fill={C.black}/>
      </g>
      {/* Eyes */}
      <circle cx="12.8" cy="13.8" r="0.7" fill={C.black}/>
      <circle cx="17.2" cy="13.8" r="0.7" fill={C.black}/>
    </svg>
  );
}

// =================== FLOWER (purple, daisy-like) ===================
function Flower({ size = 64, color = C.petal, squished = false, style }) {
  const s = size;
  if (squished) {
    return (
      <svg width={s} height={s} viewBox="0 0 60 60" style={style} className="flower flower--squished">
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2;
          const r = 14 + Math.random() * 10;
          const x = 30 + Math.cos(a) * r;
          const y = 30 + Math.sin(a) * r;
          return <circle key={i} cx={x} cy={y} r={3 + Math.random() * 2} fill={color} opacity="0.85" />;
        })}
        <circle cx="30" cy="30" r="4" fill={C.honey}/>
      </svg>
    );
  }
  return (
    <svg width={s} height={s} viewBox="0 0 60 60" style={style} className="flower">
      <ellipse cx="32" cy="32" rx="22" ry="20" fill="rgba(0,0,0,0.18)" />
      {[0, 60, 120, 180, 240, 300].map((a) => {
        const x = 30 + Math.cos((a * Math.PI) / 180) * 12;
        const y = 30 + Math.sin((a * Math.PI) / 180) * 12;
        return (
          <ellipse key={a} cx={x} cy={y} rx="9" ry="11" fill={color} stroke={C.black} strokeWidth="1.4" transform={`rotate(${a} ${x} ${y})`}/>
        );
      })}
      <circle cx="30" cy="30" r="6" fill={C.honey} stroke={C.black} strokeWidth="1.4"/>
      <circle cx="28" cy="28" r="1.8" fill={C.honeyDark}/>
    </svg>
  );
}

// Tiny white daisy used in lawn fields
function MiniDaisy({ size = 14, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" style={style}>
      {[0,72,144,216,288].map(a => {
        const x = 10 + Math.cos(a*Math.PI/180)*4;
        const y = 10 + Math.sin(a*Math.PI/180)*4;
        return <circle key={a} cx={x} cy={y} r="2.6" fill="#fff" stroke="rgba(0,0,0,0.3)" strokeWidth="0.6"/>;
      })}
      <circle cx="10" cy="10" r="2" fill={C.honey}/>
    </svg>
  );
}

// =================== ROCK ===================
function Rock({ size = 44, style, variant = 'a' }) {
  const paths = {
    a: 'M10 32 L6 22 L14 8 L28 6 L36 16 L34 30 L22 36 Z',
    b: 'M8 28 L4 18 L12 6 L26 4 L36 12 L38 26 L26 34 L14 32 Z',
    c: 'M12 30 L8 16 L18 6 L30 10 L34 22 L28 32 Z',
  };
  return (
    <svg width={size} height={size} viewBox="0 0 42 42" style={style} className="rock">
      <ellipse cx="21" cy="38" rx="12" ry="3" fill="rgba(0,0,0,0.25)"/>
      <path d={paths[variant]} fill={C.stone} stroke={C.stoneDark} strokeWidth="1.6"/>
      <path d={paths[variant]} fill="white" opacity="0.18"/>
      <ellipse cx="18" cy="14" rx="4" ry="2" fill="rgba(255,255,255,0.45)"/>
    </svg>
  );
}

// =================== HIVE (golden hanging skep) ===================
function Hive({ size = 88, style, buzzing = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" style={style} className={`hive ${buzzing ? 'hive--buzz' : ''}`}>
      <defs>
        <linearGradient id="hiveG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFD84D"/>
          <stop offset="1" stopColor={C.honeyDark}/>
        </linearGradient>
      </defs>
      <ellipse cx="40" cy="74" rx="22" ry="3" fill="rgba(0,0,0,0.25)"/>
      {/* Stacked humps */}
      <ellipse cx="40" cy="22" rx="14" ry="7" fill="url(#hiveG)" stroke={C.black} strokeWidth="2"/>
      <ellipse cx="40" cy="34" rx="20" ry="9" fill="url(#hiveG)" stroke={C.black} strokeWidth="2"/>
      <ellipse cx="40" cy="48" rx="24" ry="10" fill="url(#hiveG)" stroke={C.black} strokeWidth="2"/>
      <ellipse cx="40" cy="62" rx="22" ry="9" fill="url(#hiveG)" stroke={C.black} strokeWidth="2"/>
      {/* Dripping honey on edges */}
      <path d="M18 48 Q16 56 18 60 Q20 56 20 50" fill={C.honey} stroke={C.black} strokeWidth="1.2"/>
      <path d="M62 48 Q64 56 62 60 Q60 56 60 50" fill={C.honey} stroke={C.black} strokeWidth="1.2"/>
      {/* Entrance */}
      <ellipse cx="40" cy="58" rx="5" ry="4" fill={C.black}/>
      <ellipse cx="40" cy="57" rx="4" ry="2.5" fill="#3a2410"/>
    </svg>
  );
}

// =================== HONEYCOMB CLUSTER ===================
function Honeycomb({ size = 80, style, filled = true }) {
  const r = 12;
  const dx = r * Math.sqrt(3);
  const hex = (cx, cy, fill) => {
    const pts = [];
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i + Math.PI / 6;
      pts.push(`${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`);
    }
    return <polygon points={pts.join(' ')} fill={fill} stroke={C.black} strokeWidth="2"/>;
  };
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" style={style} className="honeycomb">
      <defs>
        <radialGradient id="hcG" cx="0.5" cy="0.4">
          <stop offset="0" stopColor="#FFE066"/>
          <stop offset="1" stopColor={C.honeyDeep}/>
        </radialGradient>
      </defs>
      {hex(40 - dx/2, 40 - r*0.9, filled ? 'url(#hcG)' : 'transparent')}
      {hex(40 + dx/2, 40 - r*0.9, filled ? 'url(#hcG)' : 'transparent')}
      {hex(40, 40 + r*0.4, filled ? 'url(#hcG)' : 'transparent')}
      {hex(40 - dx, 40 + r*0.4, filled ? 'url(#hcG)' : 'transparent')}
      {hex(40 + dx, 40 + r*0.4, filled ? 'url(#hcG)' : 'transparent')}
    </svg>
  );
}

// =================== WOODEN FENCE (top-down posts + rails) ===================
function FencePost({ size = 28, style }) {
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 28 40" style={style}>
      <ellipse cx="14" cy="36" rx="9" ry="3" fill="rgba(0,0,0,0.3)"/>
      <rect x="6" y="6" width="16" height="28" rx="4" fill={C.woodLight} stroke={C.woodDark} strokeWidth="2"/>
      <line x1="14" y1="10" x2="14" y2="32" stroke={C.woodDark} strokeWidth="1" opacity="0.6"/>
      <ellipse cx="14" cy="8" rx="8" ry="3" fill={C.wood} stroke={C.woodDark} strokeWidth="1.5"/>
    </svg>
  );
}

function Fence({ width = 200, height = 60, style }) {
  // top-down rail with posts
  const posts = [];
  const count = Math.floor(width / 38);
  for (let i = 0; i < count; i++) {
    posts.push(<g key={i} transform={`translate(${i * 38 + 4}, 4)`}><FencePost size={28}/></g>);
  }
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={style} className="fence">
      <rect x="6" y={height/2 - 3} width={width - 12} height="5" rx="2" fill={C.wood} stroke={C.woodDark} strokeWidth="1.5"/>
      {posts}
    </svg>
  );
}

// =================== BUSH ===================
function Bush({ size = 96, style }) {
  return (
    <svg width={size} height={size * 0.85} viewBox="0 0 100 85" style={style} className="bush">
      <ellipse cx="50" cy="78" rx="34" ry="5" fill="rgba(0,0,0,0.3)"/>
      <ellipse cx="22" cy="52" rx="20" ry="18" fill={C.grassDark}/>
      <ellipse cx="78" cy="52" rx="20" ry="18" fill={C.grassDark}/>
      <ellipse cx="50" cy="42" rx="28" ry="26" fill={C.grassDeep}/>
      <ellipse cx="36" cy="46" rx="14" ry="12" fill={C.grass} opacity="0.9"/>
      <ellipse cx="64" cy="44" rx="14" ry="12" fill={C.grass} opacity="0.9"/>
      <ellipse cx="50" cy="34" rx="10" ry="6" fill="rgba(255,255,255,0.25)"/>
      {/* Tiny white daisies on top */}
      <g><MiniDaisy size={10} style={{ transform: 'translate(28px, 36px)' }}/></g>
      <circle cx="32" cy="44" r="2.5" fill="#fff" stroke="rgba(0,0,0,0.3)" strokeWidth="0.6"/>
      <circle cx="32" cy="44" r="1" fill={C.honey}/>
      <circle cx="58" cy="32" r="2.5" fill="#fff" stroke="rgba(0,0,0,0.3)" strokeWidth="0.6"/>
      <circle cx="58" cy="32" r="1" fill={C.honey}/>
      <circle cx="68" cy="50" r="2.5" fill="#fff" stroke="rgba(0,0,0,0.3)" strokeWidth="0.6"/>
      <circle cx="68" cy="50" r="1" fill={C.honey}/>
    </svg>
  );
}

// =================== LAWN STRIP (grass + daisies + amber pebbles) ===================
function LawnFlowers({ width = 140, height = 50, style }) {
  const items = [];
  const count = Math.floor(width / 18);
  for (let i = 0; i < count; i++) {
    const x = 8 + i * 16 + (i % 2) * 4;
    const y = 12 + (i % 3) * 10;
    items.push(
      <g key={i} transform={`translate(${x},${y})`}>
        <circle cx="0" cy="-3" r="2.4" fill="#fff" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5"/>
        <circle cx="3" cy="0" r="2.4" fill="#fff" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5"/>
        <circle cx="-3" cy="0" r="2.4" fill="#fff" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5"/>
        <circle cx="0" cy="3" r="2.4" fill="#fff" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5"/>
        <circle cx="0" cy="0" r="1.6" fill={C.honey}/>
      </g>
    );
  }
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={style} className="lawn">
      <rect width={width} height={height} fill={C.grassDeep} rx="6"/>
      {/* grass texture spots */}
      {Array.from({ length: 14 }).map((_, i) => (
        <ellipse key={i} cx={(i * 23) % width} cy={6 + (i * 7) % (height - 8)} rx="6" ry="2.5" fill={C.grass} opacity="0.6"/>
      ))}
      {/* amber pebbles */}
      <circle cx={width * 0.2} cy={height * 0.7} r="3" fill={C.amber} opacity="0.7"/>
      <circle cx={width * 0.7} cy={height * 0.3} r="2.5" fill={C.amber} opacity="0.6"/>
      {items}
    </svg>
  );
}

// =================== WINDING HONEY-PATH BACKGROUND ===================
// A vertical winding path with cream curb stripes on both edges.
function WindingPath({ width = 360, height = 640, scrollY = 0, style }) {
  // Sine-wave path
  const cx = width / 2;
  const amp = 32;
  const freq = 0.014;
  const phase = scrollY * 0.012;
  const halfW = 78;

  const leftPts = [];
  const rightPts = [];
  for (let y = 0; y <= height; y += 8) {
    const ox = Math.sin(y * freq + phase) * amp;
    leftPts.push(`${cx + ox - halfW},${y}`);
    rightPts.push(`${cx + ox + halfW},${y}`);
  }
  const pathFill = `M${leftPts.join(' L')} L${rightPts.reverse().join(' L')} Z`;

  // Curb stripes — alternating along the y axis
  const stripes = [];
  const stripeStep = 26;
  for (let y = -stripeStep + (scrollY % (stripeStep * 2)); y < height + stripeStep; y += stripeStep) {
    const ox = Math.sin(y * freq + phase) * amp;
    const fill = Math.floor(y / stripeStep) % 2 === 0 ? C.curbCream : C.curbBrown;
    stripes.push(
      <g key={y}>
        <ellipse cx={cx + ox - halfW} cy={y} rx="9" ry="6" fill={fill} stroke={C.woodDark} strokeWidth="1.5"/>
        <ellipse cx={cx + ox + halfW} cy={y} rx="9" ry="6" fill={fill} stroke={C.woodDark} strokeWidth="1.5"/>
      </g>
    );
  }

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={style} preserveAspectRatio="none">
      <defs>
        <linearGradient id="grassG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.grassDeep}/>
          <stop offset="1" stopColor={C.grassDark}/>
        </linearGradient>
        <linearGradient id="pathG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.pathLight}/>
          <stop offset="1" stopColor={C.pathDark}/>
        </linearGradient>
        <pattern id="grassDots" x="0" y={scrollY % 40} width="40" height="40" patternUnits="userSpaceOnUse">
          <ellipse cx="8" cy="10" rx="4" ry="2" fill={C.grass} opacity="0.5"/>
          <ellipse cx="28" cy="28" rx="3" ry="1.5" fill={C.grass} opacity="0.4"/>
          <circle cx="20" cy="6" r="1" fill="#fff" opacity="0.5"/>
        </pattern>
        <pattern id="pathTexture" x="0" y={scrollY % 60} width="60" height="60" patternUnits="userSpaceOnUse">
          <ellipse cx="20" cy="20" rx="14" ry="3" fill="#E5B040" opacity="0.4"/>
          <ellipse cx="40" cy="44" rx="10" ry="2.5" fill="#E5B040" opacity="0.3"/>
          <circle cx="48" cy="14" r="1.5" fill="#A06800" opacity="0.4"/>
        </pattern>
      </defs>

      {/* Grass background */}
      <rect width={width} height={height} fill="url(#grassG)"/>
      <rect width={width} height={height} fill="url(#grassDots)" opacity="0.7"/>

      {/* Path */}
      <path d={pathFill} fill="url(#pathG)" stroke={C.honeyDark} strokeWidth="0.5"/>
      <path d={pathFill} fill="url(#pathTexture)" opacity="0.7"/>

      {/* Curb stripes */}
      {stripes}
    </svg>
  );
}

// Helper: get path lane X for a given y (so obstacles spawn on the path)
function getPathX(y, scrollY, width = 360) {
  const cx = width / 2;
  const amp = 32;
  const freq = 0.014;
  const phase = scrollY * 0.012;
  return cx + Math.sin(y * freq + phase) * amp;
}
