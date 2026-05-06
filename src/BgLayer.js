// BgLayer.js — scrolling background using WindingPath + side decorations

function BgLayer({ scrollY }) {
  const side = (isRight) => Array.from({ length: 5 }, (_, i) => {
    const period = 140;
    const y = i * period - (scrollY * .9 % period) - period + (isRight ? period/2 : 0);
    const seed = (Math.floor(scrollY / period) + i + (isRight ? 2 : 0)) % 4;
    const variants = ['a','b','c'];
    return (
      <div key={i} style={{ position:'absolute', top:y, [isRight?'right':'left']:2 }}>
        {seed===0 && <Hive size={52}/>}
        {seed===1 && <Honeycomb size={44}/>}
        {seed===2 && <Bush size={56}/>}
        {seed===3 && <Rock size={28} variant={variants[i%3]}/>}
        <FencePost size={20} style={{ position:'absolute', top:50, [isRight?'right':'left']:38 }}/>
      </div>
    );
  });
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden' }}>
      <WindingPath width={GW} height={GH} scrollY={scrollY} style={{ position:'absolute', inset:0 }}/>
      <div style={{ position:'absolute', top:0, left:0, bottom:0, width:70, overflow:'hidden', pointerEvents:'none' }}>
        {side(false)}
      </div>
      <div style={{ position:'absolute', top:0, right:0, bottom:0, width:70, overflow:'hidden', pointerEvents:'none' }}>
        {side(true)}
      </div>
    </div>
  );
}
