// BgLayer.js — static horizontal background

function BgLayer({ scrollY }) {
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden' }}>
      {/* Sky gradient */}
      <div style={{
        position:'absolute', inset:0,
        background:'linear-gradient(180deg, #1A1A22 0%, #12121A 60%, #1B2A1B 100%)',
      }}/>

      {/* Honey road — horizontal stripes */}
      <div style={{
        position:'absolute', left:0, right:0,
        top: GH * 0.62, height: GH * 0.22,
        background:'linear-gradient(180deg, #C28A00 0%, #8B5A2B 40%, #5C3A1A 100%)',
        borderTop:'3px solid #F5C518',
        borderBottom:'2px solid #3A2010',
      }}>
        {/* Road markings */}
        {Array.from({length:12},(_,i) => (
          <div key={i} style={{
            position:'absolute',
            left: `${i * 9 + 1}%`, top:'44%',
            width:'5%', height:3,
            background:'rgba(245,197,24,.35)',
            borderRadius:2,
          }}/>
        ))}
      </div>

      {/* Ground below road */}
      <div style={{
        position:'absolute', left:0, right:0,
        bottom:0, top: GH * 0.82,
        background:'#2A1A08',
      }}/>

      {/* Grass strip above road */}
      <div style={{
        position:'absolute', left:0, right:0,
        top: GH * 0.58, height: GH * 0.06,
        background:'linear-gradient(180deg, #2D5A1B 0%, #1E3D12 100%)',
      }}/>

      {/* Fence posts along road */}
      {Array.from({length:8},(_,i) => (
        <div key={i} style={{
          position:'absolute',
          left:`${i*14+2}%`,
          top: GH * 0.54,
          width:6, height: GH * 0.12,
          background:'#5C3A1A',
          borderRadius:2,
          boxShadow:'1px 0 0 #3A2010',
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
