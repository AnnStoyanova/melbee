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
// Sticker-style bee — thick white outline, two black stripes,
// white wings with thin dark edge, loop-tip antennae, simple smile,
// small stinger. Matches the reference screenshot. Collision radius
// R stays at 26 so existing game physics keep working.

function drawBee(ctx, x, y, flapT, tiltRad, frameT, dead) {
  ctx.save();
  ctx.translate(x, y);
  if (dead) ctx.rotate(frameT * .1);
  else ctx.rotate(Math.max(-.3, Math.min(.4, tiltRad)));
  if (dead) ctx.globalAlpha = Math.max(.15, 1 - frameT * .022);

  const R = 26;
  const HALO = R + 3.5;
  const BLACK = '#1A1208';
  const HONEY = '#F5C518';
  const WHITE = '#FFFFFF';
  const WING_EDGE = 'rgba(0,0,0,0.18)';
  const wf = Math.sin(flapT * 2.2) * .45;
  const aw = Math.sin(frameT * .08) * 3;

  // ── Stinger (drawn first so body covers the base) ──
  ctx.fillStyle = WHITE;
  ctx.beginPath();
  ctx.moveTo(-5, 24); ctx.lineTo(0, 40); ctx.lineTo(5, 24);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = HONEY;
  ctx.beginPath();
  ctx.moveTo(-3.5, 24); ctx.lineTo(0, 37); ctx.lineTo(3.5, 24);
  ctx.closePath(); ctx.fill();

  // ── Wings (white sticker, drawn behind body) ──
  [[-1, -.3 - wf], [1, .3 + wf]].forEach(([side, rot]) => {
    ctx.save();
    ctx.translate(side * R * .7, -R * .25);
    ctx.rotate(rot);
    ctx.beginPath();
    ctx.ellipse(0, 0, R * .92, R * .52, side * .15, 0, Math.PI * 2);
    ctx.fillStyle = WHITE; ctx.fill();
    ctx.strokeStyle = WING_EDGE; ctx.lineWidth = 1.2; ctx.stroke();
    ctx.restore();
  });

  // ── Antennae (drawn before body so base is hidden) ──
  const antennae = [[-7, -15 + aw], [7, 15 - aw]];
  // White halo lines
  ctx.strokeStyle = WHITE; ctx.lineWidth = 5; ctx.lineCap = 'round';
  antennae.forEach(([bx, tx]) => {
    ctx.beginPath();
    ctx.moveTo(bx, -R + 3);
    ctx.quadraticCurveTo(tx * .87, -R - 9, tx, -R - 19);
    ctx.stroke();
  });
  // Black thin lines
  ctx.strokeStyle = BLACK; ctx.lineWidth = 2; ctx.lineCap = 'round';
  antennae.forEach(([bx, tx]) => {
    ctx.beginPath();
    ctx.moveTo(bx, -R + 3);
    ctx.quadraticCurveTo(tx * .87, -R - 9, tx, -R - 19);
    ctx.stroke();
  });
  // Loop tips (open circles)
  antennae.forEach(([, tx]) => {
    // White halo
    ctx.beginPath();
    ctx.arc(tx, -R - 19, 5, 0, Math.PI * 2);
    ctx.fillStyle = WHITE; ctx.fill();
    // Ring (white fill + black outline)
    ctx.beginPath();
    ctx.arc(tx, -R - 19, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = WHITE; ctx.fill();
    ctx.strokeStyle = BLACK; ctx.lineWidth = 1.4; ctx.stroke();
  });

  // ── Body: white sticker halo + yellow fill ──
  ctx.beginPath(); ctx.arc(0, 0, HALO, 0, Math.PI * 2);
  ctx.fillStyle = WHITE; ctx.fill();
  ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2);
  ctx.fillStyle = HONEY; ctx.fill();

  // ── Two thick black stripes (clipped to body) ──
  ctx.save();
  ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.clip();
  ctx.fillStyle = BLACK;
  ctx.beginPath(); ctx.ellipse(0, 1, R + 4, 5.5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(0, 15, R + 2, 5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  // ── Face: simple oval eyes (with blink) + small smile ──
  const blink = (frameT % 180) < 5;
  if (!blink) {
    ctx.fillStyle = BLACK;
    [-7, 7].forEach(ex => {
      ctx.beginPath();
      ctx.ellipse(ex, -14, 2.5, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();
    });
  } else {
    ctx.strokeStyle = BLACK; ctx.lineWidth = 1.8; ctx.lineCap = 'round';
    [-7, 7].forEach(ex => {
      ctx.beginPath();
      ctx.moveTo(ex - 2.5, -14); ctx.lineTo(ex + 2.5, -14);
      ctx.stroke();
    });
  }
  // Smile
  ctx.strokeStyle = BLACK; ctx.lineWidth = 1.7; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-4, -8);
  ctx.quadraticCurveTo(0, -5, 4, -8);
  ctx.stroke();

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
