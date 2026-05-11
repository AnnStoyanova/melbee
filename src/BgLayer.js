// BgLayer.js — static horizontal background

function BgLayer({ scrollY }) {
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden' }}>
      {/* Sky gradient */}
      <div style={{
        position:'absolute', inset:0,
        background:'linear-gradient(180deg, #9FD3F0 0%, #C8E4F3 45%, #FFE6A8 85%, #FFD080 100%)',
      }}/>

      {/* Honey road — horizontal stripes */}
      <div style={{
        position:'absolute', left:0, right:0,
        top: GH * 0.62, height: GH * 0.22,
        background:'linear-gradient(180deg, #F5C84A 0%, #D9A340 40%, #A87528 100%)',
        borderTop:'3px solid #FFE066',
        borderBottom:'2px solid #6B4520',
      }}>
        {/* Road markings */}
        {Array.from({length:12},(_,i) => (
          <div key={i} style={{
            position:'absolute',
            left: `${i * 9 + 1}%`, top:'44%',
            width:'5%', height:3,
            background:'rgba(255,255,255,.55)',
            borderRadius:2,
          }}/>
        ))}
      </div>

      {/* Ground below road */}
      <div style={{
        position:'absolute', left:0, right:0,
        bottom:0, top: GH * 0.82,
        background:'#8C5A28',
      }}/>

      {/* Grass strip above road */}
      <div style={{
        position:'absolute', left:0, right:0,
        top: GH * 0.58, height: GH * 0.06,
        background:'linear-gradient(180deg, #6FB83A 0%, #4A8A28 100%)',
      }}/>

      {/* Fence posts along road */}
      {Array.from({length:8},(_,i) => (
        <div key={i} style={{
          position:'absolute',
          left:`${i*14+2}%`,
          top: GH * 0.54,
          width:6, height: GH * 0.12,
          background:'#A87528',
          borderRadius:2,
          boxShadow:'1px 0 0 #6B4520',
        }}/>
      ))}

      {/* Honeycomb decorations on sides — static */}
      <div style={{position:'absolute', top: GH*0.08, left:4, opacity:.25, pointerEvents:'none'}}>
        <Honeycomb size={48}/>
      </div>
      <div style={{position:'absolute', top: GH*0.28, right:4, opacity:.2, pointerEvents:'none'}}>
        <Honeycomb size={36}/>
      </div>
      <div style={{position:'absolute', top: GH*0.48, left:8, opacity:.18, pointerEvents:'none'}}>
        <Bush size={44}/>
      </div>
      <div style={{position:'absolute', top: GH*0.42, right:6, opacity:.18, pointerEvents:'none'}}>
        <Bush size={38}/>
      </div>
    </div>
  );
}
