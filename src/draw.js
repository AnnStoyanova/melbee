// draw.js — Canvas 2D drawing functions
// drawPipe, drawBee, drawFlower



// ──────────────────────────────

function drawPipe(ctx, x, topH, gapY, gapH) {
  const draw = (y, h, capSide) => {
    if (h <= 0) return;
    const g = ctx.createLinearGradient(x, 0, x + PIPE_W, 0);
    g.addColorStop(0, '#B07A38'); g.addColorStop(.5, '#8B5A2B'); g.addColorStop(1, '#6B4020');
    ctx.fillStyle = g; ctx.fillRect(x, y, PIPE_W, h);
    ctx.strokeStyle = '#5C3A1A'; ctx.lineWidth = 2; ctx.strokeRect(x, y, PIPE_W, h);
    // hex overlay
    ctx.save(); ctx.beginPath(); ctx.rect(x, y, PIPE_W, h); ctx.clip();
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    const hr = 9;
    for (let row = -1; row < h / (hr * 1.5) + 2; row++) {
      for (let col = -1; col < PIPE_W / (hr * 1.73) + 2; col++) {
        const hx = x + col*hr*1.73 + (row%2)*hr*.87, hy = y + row*hr*1.5;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = Math.PI/3*i + Math.PI/6;
          i ? ctx.lineTo(hx+Math.cos(a)*hr*.8, hy+Math.sin(a)*hr*.8)
            : ctx.moveTo(hx+Math.cos(a)*hr*.8, hy+Math.sin(a)*hr*.8);
        }
        ctx.closePath(); ctx.fill();
      }
    }
    ctx.restore();
    const cy = capSide === 'bot' ? y : y + h - 16;
    ctx.fillStyle = '#5C3A1A'; ctx.strokeStyle = '#3A2010'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(x-5, cy, PIPE_W+10, 16, capSide === 'bot' ? [4,4,0,0] : [0,0,4,4]);
    ctx.fill(); ctx.stroke();
    if (capSide === 'top') {
      ctx.fillStyle = '#F5C518'; ctx.strokeStyle = '#1A1208'; ctx.lineWidth = 1;
      [x+10, x+PIPE_W-12].forEach(dx => {
        ctx.beginPath(); ctx.moveTo(dx, cy+16); ctx.lineTo(dx-4, cy+26);
        ctx.quadraticCurveTo(dx, cy+30, dx+4, cy+26); ctx.closePath(); ctx.fill(); ctx.stroke();
      });
    }
  };
  draw(0, topH, 'top');
  draw(gapY + gapH, GH - gapY - gapH, 'bot');
}



// ──────────────────────────────

function drawBee(ctx, x, y, flapT, tiltRad, frameT, dead) {
  ctx.save();
  ctx.translate(x, y);
  if (dead) ctx.rotate(frameT * .1);
  else ctx.rotate(Math.max(-.3, Math.min(.4, tiltRad)));
  if (dead) ctx.globalAlpha = Math.max(.15, 1 - frameT * .022);

  const R = 26;
  const wf = Math.sin(flapT * 2.2) * .45;

  // Wings
  [[-1, -.3 - wf], [1, .3 + wf]].forEach(([side, rot]) => {
    ctx.save();
    ctx.translate(side * R * .7, -R * .25);
    ctx.rotate(rot);
    ctx.beginPath();
    ctx.ellipse(0, 0, R * .9, R * .5, side * .15, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(225,238,255,.9)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(30,20,10,.32)'; ctx.lineWidth = 1.3; ctx.stroke();
    ctx.restore();
  });

  // Body
  const bg = ctx.createRadialGradient(-R*.28, -R*.32, 1, 0, 0, R*1.05);
  bg.addColorStop(0, '#FFE96A'); bg.addColorStop(.55, '#F5C518'); bg.addColorStop(1, '#D09A10');
  ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI*2);
  ctx.fillStyle = bg; ctx.fill();
  ctx.strokeStyle = '#1A1208'; ctx.lineWidth = 2.4; ctx.stroke();

  // Stripes
  ctx.fillStyle = '#1A1208';
  [{ y: 2, h: 12 }, { y: 16, h: 12 }].forEach(({ y: sy, h: sh }) => {
    ctx.save();
    ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.clip();
    ctx.fillRect(-R - 2, sy, (R + 2) * 2, sh);
    ctx.restore();
  });

  // Antennae
  const aw = Math.sin(frameT * .08) * 3;
  ctx.strokeStyle = '#1A1208'; ctx.lineWidth = 2.1; ctx.lineCap = 'round';
  [[-7, -15 + aw], [7, 15 - aw]].forEach(([bx, tx], i) => {
    ctx.beginPath(); ctx.moveTo(bx, -R+3);
    ctx.quadraticCurveTo(tx * .87, -R-9, tx, -R-19); ctx.stroke();
    ctx.beginPath(); ctx.arc(tx, -R-19, 3.5, 0, Math.PI*2);
    ctx.fillStyle = '#1A1208'; ctx.fill();
  });

  // Eyes
  const blink = (frameT % 180) < 5;
  if (!blink) {
    [-9, 9].forEach(ex => {
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(ex, -8, 6.5, 7.5, 0, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#1A1208'; ctx.beginPath(); ctx.ellipse(ex, -7, 4, 5, 0, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(ex+1.8, -9.5, 1.6, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = '#1A1208'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.ellipse(ex, -8, 6.5, 7.5, 0, 0, Math.PI*2); ctx.stroke();
    });
  } else {
    ctx.strokeStyle = '#1A1208'; ctx.lineWidth = 2.4; ctx.lineCap = 'round';
    [-9, 9].forEach(ex => { ctx.beginPath(); ctx.arc(ex, -8, 5.5, Math.PI*.1, Math.PI*.9); ctx.stroke(); });
  }

  // Smile
  ctx.strokeStyle = '#1A1208'; ctx.lineWidth = 2.2; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-8, 2); ctx.quadraticCurveTo(0, 10, 8, 2); ctx.stroke();

  // Cheeks
  ctx.fillStyle = 'rgba(255,130,155,.52)';
  [-15, 15].forEach(cx => { ctx.beginPath(); ctx.ellipse(cx, -1, 5.5, 4, 0, 0, Math.PI*2); ctx.fill(); });

  ctx.restore();
}



// ──────────────────────────────

function drawFlower(ctx, x, y, size, angle) {
  const r = size * .45;
  ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
  ['#A06BD9','#B07AE8','#9060C9'].forEach((c, ci) => {
    for (let i = ci; i < 6; i += 3) {
      const a = i/6 * Math.PI*2;
      ctx.fillStyle = c; ctx.strokeStyle = '#1A1208'; ctx.lineWidth = 1.3;
      ctx.beginPath(); ctx.ellipse(Math.cos(a)*r*.58, Math.sin(a)*r*.58, r*.42, r*.52, a, 0, Math.PI*2);
      ctx.fill(); ctx.stroke();
    }
  });
  const cg = ctx.createRadialGradient(0,0,1,0,0,r*.3);
  cg.addColorStop(0,'#FFE066'); cg.addColorStop(1,'#E0A800');
  ctx.beginPath(); ctx.arc(0,0,r*.3,0,Math.PI*2);
  ctx.fillStyle = cg; ctx.fill(); ctx.strokeStyle='#1A1208'; ctx.lineWidth=1.3; ctx.stroke();
  ctx.restore();
}
