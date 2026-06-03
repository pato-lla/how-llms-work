// ═══════════════════════════════════════════════
// HERO CANVAS — Floating Token Fragments
// ═══════════════════════════════════════════════
(function(){
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, tokens = [], animId;
  const WORDS = ['the','of','and','a ','to','in ','is ','it ','ing','tion','pre','er ','un','re ','ed ','ly ','ness','ment','ize','BPE','seq','dim','MLP','key','vec','loss','grad','mask','head','norm','next','data','text','byte','GPT','LLM','soft','max','Adam','logit','embed','token','layer','atten'];

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    W = canvas.offsetWidth;
    H = canvas.offsetHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function makeToken() {
    const word = WORDS[Math.floor(Math.random() * WORDS.length)];
    const size = 10 + Math.floor(Math.random() * 5);
    const alpha = 0.055 + Math.random() * 0.09;
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - .5) * 0.18,
      vy: -0.12 - Math.random() * 0.14,
      word, size, alpha
    };
  }

  function init() {
    resize();
    tokens = Array.from({length: 45}, makeToken);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const t of tokens) {
      t.x += t.vx;
      t.y += t.vy;
      if (t.y < -30) { Object.assign(t, makeToken(), { x: Math.random() * W, y: H + 20 }); }
      if (t.x < -60) t.x = W + 20;
      if (t.x > W + 60) t.x = -20;
      ctx.font = `${t.size}px 'JetBrains Mono', monospace`;
      const mw = ctx.measureText(t.word).width;
      const pad = 5, ph = t.size + 6;
      ctx.strokeStyle = `rgba(26,31,54,${t.alpha * 0.55})`;
      ctx.lineWidth = 0.5;
      ctx.strokeRect(t.x - pad/2, t.y - ph + 3, mw + pad, ph);
      ctx.fillStyle = `rgba(26,31,54,${t.alpha})`;
      ctx.fillText(t.word, t.x, t.y);
    }
    animId = requestAnimationFrame(draw);
  }

  init();
  requestAnimationFrame(draw);
  window.addEventListener('resize', () => { resize(); init(); });
})();

// ═══════════════════════════════════════════════
// TYPEWRITER EFFECT
// ═══════════════════════════════════════════════
(function(){
  const el = document.getElementById('tw-response');
  let mi = 0, ci = 0, deleting = false, pauseTimer = null;

  function type() {
    const messages = LLMS_UI[getLocale()].hero;
    const msg = messages[mi];
    if (!deleting) {
      if (ci < msg.length) {
        el.innerHTML = msg.slice(0, ++ci) + '<span class="tw-cursor"></span>';
        setTimeout(type, 28 + Math.random() * 20);
      } else {
        pauseTimer = setTimeout(() => { deleting = true; type(); }, 2800);
      }
    } else {
      if (ci > 0) {
        el.innerHTML = msg.slice(0, --ci) + '<span class="tw-cursor"></span>';
        setTimeout(type, 12);
      } else {
        deleting = false;
        mi = (mi + 1) % messages.length;
        setTimeout(type, 400);
      }
    }
  }
  function restart() {
    mi = 0; ci = 0; deleting = false;
    clearTimeout(pauseTimer);
    el.textContent = '';
    setTimeout(type, 200);
  }
  window.addEventListener('i18nchange', restart);
  setTimeout(type, 1200);
})();

// ═══════════════════════════════════════════════
// BPE VISUALIZATION — live tokenizer (rebuilt)
// ═══════════════════════════════════════════════
(function(){
  const input   = document.getElementById('bpe-input');
  const strip   = document.getElementById('bpe-strip');
  const log     = document.getElementById('bpe-log');
  const stepBtn = document.getElementById('bpe-step-btn');
  const autoBtn = document.getElementById('bpe-auto-btn');
  const resetBtn= document.getElementById('bpe-reset-btn');
  const countEl = document.getElementById('bpe-count');
  if (!input || !strip) return;

  // Ordered BPE merge rules — representative of GPT-style English BPE
  const MERGES = [
    ['t','h'],['e','r'],['i','n'],['a','n'],['o','n'],['a','l'],
    ['th','e'],['e','d'],['i','t'],['o','r'],['o','u'],['e','n'],
    ['a','t'],['in','g'],['a','r'],['o','f'],['t','o'],['i','s'],
    ['er','s'],['o','w'],['c','h'],['w','h'],['an','d'],['th','at'],
    ['i','on'],['at','ion'],['a','s'],['r','e'],['r','s'],['s','t']
  ];

  const PILL_COLORS = ['#635BFF','#0570DE','#946800','#00875A','#DF1B41','#4F46E5','#7C3AED','#0891B2'];

  let tokens = [];
  let mergeStep = 0;
  let autoTimer = null;

  function initTokens(text) {
    tokens = (text || 'hello').split('');
    mergeStep = 0;
    log.innerHTML = '';
    render();
  }

  function render() {
    strip.innerHTML = '';
    tokens.forEach((tok, i) => {
      const pill = document.createElement('span');
      pill.className = 'bpe-pill';
      pill.textContent = tok;
      const color = PILL_COLORS[i % PILL_COLORS.length];
      pill.style.cssText = `color:${color};border-color:${color}55;background:${color}12`;
      strip.appendChild(pill);
    });
    countEl.textContent = tokens.length + ' token' + (tokens.length !== 1 ? 's' : '');
    stepBtn.disabled = mergeStep >= MERGES.length;
  }

  function applyNextMerge() {
    while (mergeStep < MERGES.length) {
      const [a, b] = MERGES[mergeStep++];
      let merged = false;
      const next = [];
      let i = 0;
      while (i < tokens.length) {
        if (i < tokens.length - 1 && tokens[i] === a && tokens[i+1] === b) {
          next.push(a + b);
          i += 2;
          merged = true;
        } else {
          next.push(tokens[i++]);
        }
      }
      if (merged) {
        tokens = next;
        const entry = document.createElement('div');
        entry.innerHTML = `→ merged <span class="bpe-log-token">'${a}'</span>+<span class="bpe-log-token">'${b}'</span> → <span class="bpe-log-token">'${a+b}'</span>`;
        log.insertBefore(entry, log.firstChild);
        render();
        requestAnimationFrame(() => {
          strip.querySelectorAll('.bpe-pill').forEach(p => {
            if (p.textContent === a+b) { p.classList.remove('merging'); void p.offsetWidth; p.classList.add('merging'); }
          });
        });
        return true;
      }
    }
    return false;
  }

  function startAuto() {
    autoBtn.textContent = '⏸ Pause';
    autoTimer = setInterval(() => { if (!applyNextMerge()) stopAuto(); }, 380);
  }

  function stopAuto() {
    clearInterval(autoTimer);
    autoTimer = null;
    autoBtn.textContent = '▶ Auto';
  }

  input.addEventListener('input', () => { stopAuto(); initTokens(input.value); });
  stepBtn.addEventListener('click', () => { stopAuto(); applyNextMerge(); });
  autoBtn.addEventListener('click', () => autoTimer ? stopAuto() : startAuto());
  resetBtn.addEventListener('click', () => { stopAuto(); initTokens(input.value); });

  initTokens(input.value);
})();


// ═══════════════════════════════════════════════
// TRANSFORMER DIAGRAM SVG — interactive rebuild
// ═══════════════════════════════════════════════
(function(){
  const svg  = document.getElementById('transformer-svg');
  const card = document.getElementById('transformer-card');
  if (!svg || !card) return;

  let activeId = null;
  let dotY = 306;
  let dotTarget = 48;

  const localeText = (en, es) => getLocale() === 'es' ? es : en;
  const getCopy = () => LLMS_UI[getLocale()].transformer;

  function heatmapHTML() {
    const W = [[.9,.05,.03,.02],[.1,.7,.15,.05],[.05,.2,.65,.1],[.08,.07,.05,.8]];
    let h = '<div class="transformer-heatmap">';
    for (const row of W) for (const w of row) {
      h += `<div class="tc-cell" style="background:rgba(99,91,255,${(0.08+w*.92).toFixed(2)})"></div>`;
    }
    return h + `</div><div style="font-size:10px;color:var(--txt2);margin-top:4px">${getCopy().note}</div>`;
  }

  function render(dy) {
    const copy = getCopy();
    const isDark = document.documentElement.dataset.theme === 'dark';
    const panelBase = isDark ? '#121B2E' : '#FFFFFF';
    const LAYERS = [
      {id:'input',  y:306, h:24, color:'#946800', label:copy.labels[0],
       text:localeText('Raw token IDs — integers from 0 to 100,276 representing sub-word chunks of your text.',
         'IDs de tokens brutos: enteros de 0 a 100.276 que representan fragmentos subpalabra del texto.')},
      {id:'embed',  y:268, h:24, color:'#946800', label:copy.labels[1],
       text:localeText('Each ID maps to a learned vector of ~4,096 numbers. Think of it as a coordinate in meaning-space — initialized randomly, shaped by training.',
         'Cada ID se mapea a un vector aprendido de ~4.096 números. Piensa en él como una coordenada en el espacio de significado: se inicializa al azar y se moldea con el entrenamiento.')},
      {id:'attn',   y:218, h:32, color:'#635BFF', label:copy.labels[2],
       text:localeText('Each token "looks at" every other token and learns how much to weight their context. A 70B model runs 64 heads in parallel — each picking up different relationship patterns.',
         'Cada token "mira" a todos los demás tokens y aprende cuánto pesar su contexto. Un modelo de 70B ejecuta 64 cabezas en paralelo, cada una captando distintos patrones de relación.'), heatmap:true},
      {id:'mlp',    y:166, h:32, color:'#0570DE', label:copy.labels[3],
       text:localeText('Two linear layers with a nonlinearity between them, applied to each token independently. 4× the model width. Most parameters live here.',
         'Dos capas lineales con una no linealidad entre ellas, aplicadas a cada token de forma independiente. 4× el ancho del modelo. Aquí vive la mayoría de los parámetros.')},
      {id:'norm',   y:126, h:24, color:'#697386', label:copy.labels[4],
       text:localeText('Each sub-layer\'s output is added back to its input (residual) and normalized. This keeps gradients flowing cleanly through 80+ stacked blocks.',
         'La salida de cada subcapa se suma de nuevo a su entrada (residual) y se normaliza. Así los gradientes fluyen limpiamente a través de 80+ bloques apilados.')},
      {id:'repeat', y:90,  h:22, color:'#9B8E86', label:copy.labels[5],
       text:localeText('The attention + MLP + norm stack repeats N times. GPT-3: 96 blocks. Llama 3 70B: 80 blocks. Each block refines the representations from the last.',
         'La pila de atención + MLP + norm se repite N veces. GPT-3: 96 bloques. Llama 3 70B: 80 bloques. Cada bloque refina las representaciones del anterior.')},
      {id:'logits', y:48,  h:24, color:'#00875A', label:copy.labels[6],
       text:localeText('The final hidden state is projected to 100,277 logits — one per vocabulary token. Softmax converts these to next-token probabilities.',
         'El estado oculto final se proyecta a 100.277 logits: uno por token del vocabulario. Softmax convierte eso en probabilidades del siguiente token.')}
    ];

    const gridStroke = isDark ? 'rgba(143,155,179,0.045)' : 'rgba(216,208,194,0.28)';
    const panelTint = isDark ? '0.10' : '0.08';
    const panelStroke = isDark ? '0.24' : '0.24';
    const lineStroke = isDark ? 'rgba(143,155,179,0.08)' : 'rgba(123,92,255,0.16)';
    const lineWidth = isDark ? 0.8 : 1;

    let html = '';
    for (let i = 0; i < 8; i++) {
      html += `<line x1="${45*i}" y1="0" x2="${45*i}" y2="340" stroke="${gridStroke}" stroke-width=".5" pointer-events="none"/>`;
      html += `<line x1="0" y1="${45*i}" x2="360" y2="${45*i}" stroke="${gridStroke}" stroke-width=".5" pointer-events="none"/>`;
    }

    LAYERS.forEach((layer, idx) => {
      const isActive = layer.id === activeId;
      html += `<rect x="24" y="${layer.y-layer.h/2}" width="312" height="${layer.h}" rx="5"
        fill="${panelBase}" stroke="none" pointer-events="none"/>`;
      html += `<rect data-layer="${layer.id}" x="24" y="${layer.y-layer.h/2}" width="312" height="${layer.h}" rx="5"
        fill="${layer.color}" fill-opacity="${panelTint}" stroke="${layer.color}" stroke-opacity="${isActive ? 0.85 : panelStroke}"
        stroke-width="${isActive?2:1.5}" style="cursor:pointer"/>`;
      html += `<text x="180" y="${layer.y+5}" text-anchor="middle" font-family="JetBrains Mono"
        font-size="${layer.h>=32?11:10}" fill="${layer.color}" style="pointer-events:none">${layer.label}</text>`;
      const next = LAYERS[idx+1];
      if (next) {
        const fy = layer.y-layer.h/2, ty = next.y+next.h/2, my = (fy+ty)/2;
        html += `<line x1="180" y1="${fy}" x2="180" y2="${my+4}" stroke="${lineStroke}" stroke-width="${lineWidth}"${layer.id==='norm'?' stroke-dasharray="3,3"':''} pointer-events="none"/>`;
        html += `<polygon points="175,${my+8} 185,${my+8} 180,${my+14}" fill="${next.color}" fill-opacity="${isDark ? 0.28 : 0.65}" pointer-events="none"/>`;
      }
    });

    html += `<circle cx="40" cy="${dy}" r="5" fill="${isDark ? 'rgba(167,139,250,.9)' : 'rgba(99,91,255,.85)'}">
      <animate attributeName="opacity" values=".6;1;.6" dur="1.4s" repeatCount="indefinite"/>
    </circle>
    <circle cx="40" cy="${dy}" r="9" fill="none" stroke="${isDark ? 'rgba(167,139,250,.20)' : 'rgba(99,91,255,.30)'}" stroke-width="1.5">
      <animate attributeName="r" values="7;13;7" dur="1.4s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values=".5;0;.5" dur="1.4s" repeatCount="indefinite"/>
    </circle>`;

    svg.innerHTML = html;

    svg.querySelectorAll('[data-layer]').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.dataset.layer;
        if (activeId === id) { activeId = null; card.classList.remove('tc-visible'); card.innerHTML = ''; }
        else {
          activeId = id;
          const layer = LAYERS.find(l => l.id === id);
          card.innerHTML = `<div class="transformer-card-title" style="color:${layer.color}">${layer.label}</div>
            <div>${layer.text}</div>${layer.heatmap ? heatmapHTML() : ''}`;
          card.classList.add('tc-visible');
        }
        render(Math.round(dotY));
      });
    });
  }

  function animFrame() {
    dotY += (dotTarget - dotY) * 0.025;
    if (Math.abs(dotY - dotTarget) < 3) dotTarget = dotTarget === 48 ? 306 : 48;
    render(Math.round(dotY));
    requestAnimationFrame(animFrame);
  }
  window.addEventListener('i18nchange', () => render(Math.round(dotY)));
  window.addEventListener('themechange', () => render(Math.round(dotY)));
  setTimeout(animFrame, 0);
})();

// ═══════════════════════════════════════════════
// TRAINING LOOP — Loss Curve
// ═══════════════════════════════════════════════
(function(){
  const canvas = document.getElementById('loss-canvas');
  const ctx = canvas.getContext('2d');
  const lossEl = document.getElementById('current-loss');
  const stepEl = document.getElementById('current-step');
  const textEl = document.getElementById('training-text-output');
  let targetStep = 500, animStep = 0, animId = null;
  const trainingCopy = () => LLMS_UI[getLocale()].training;

  const lossData = [];
  function genLoss(step) {
    const base = 2.4 + 8.8 * Math.exp(-step / 4000);
    return base + (Math.random() - .5) * 0.25 * Math.exp(-step / 3000);
  }
  for (let i = 0; i <= 32000; i += 100) lossData.push({ step: i, loss: genLoss(i) });

  function drawCurve(upToStep) {
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth || 400;
    const H = 200;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const pad = { l: 40, r: 20, t: 15, b: 30 };
    const cW = W - pad.l - pad.r;
    const cH = H - pad.t - pad.b;
    const maxLoss = 12, minLoss = 2.0;

    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i <= 4; i++) {
      const y = pad.t + (i/4) * cH;
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(216,208,194,0.8)';
      ctx.lineWidth = .5;
      ctx.moveTo(pad.l, y); ctx.lineTo(W - pad.r, y); ctx.stroke();
      const lv = maxLoss - (i/4) * (maxLoss - minLoss);
      ctx.fillStyle = 'rgba(123,110,102,0.75)';
      ctx.font = '9px JetBrains Mono';
      ctx.fillText(lv.toFixed(1), 2, y + 3);
    }
    ctx.strokeStyle = 'rgba(216,208,194,1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad.l, pad.t); ctx.lineTo(pad.l, H - pad.b); ctx.lineTo(W - pad.r, H - pad.b);
    ctx.stroke();
    ctx.fillStyle = 'rgba(123,110,102,0.75)';
    ctx.font = '8px JetBrains Mono';
    ['0','10K','20K','32K'].forEach((l, i) => ctx.fillText(l, pad.l + (i/3)*cW - 8, H - 5));

    const grd = ctx.createLinearGradient(0, pad.t, 0, H - pad.b);
    grd.addColorStop(0, 'rgba(99,91,255,0.14)');
    grd.addColorStop(1, 'rgba(99,91,255,0)');

    const visData = lossData.filter(d => d.step <= upToStep);
    if (visData.length < 2) return;

    ctx.beginPath();
    visData.forEach((d, i) => {
      const x = pad.l + (d.step / 32000) * cW;
      const y = pad.t + ((maxLoss - d.loss) / (maxLoss - minLoss)) * cH;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    const lastX = pad.l + (visData[visData.length-1].step / 32000) * cW;
    ctx.lineTo(lastX, H - pad.b);
    ctx.lineTo(pad.l, H - pad.b);
    ctx.closePath();
    ctx.fillStyle = grd;
    ctx.fill();

    ctx.beginPath();
    visData.forEach((d, i) => {
      const x = pad.l + (d.step / 32000) * cW;
      const y = pad.t + ((maxLoss - d.loss) / (maxLoss - minLoss)) * cH;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#635BFF';
    ctx.lineWidth = 2;
    ctx.stroke();

    const last = visData[visData.length-1];
    const lx = pad.l + (last.step / 32000) * cW;
    const ly = pad.t + ((maxLoss - last.loss) / (maxLoss - minLoss)) * cH;
    ctx.beginPath();
    ctx.arc(lx, ly, 4, 0, Math.PI*2);
    ctx.fillStyle = '#635BFF';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(lx, ly, 7, 0, Math.PI*2);
    ctx.strokeStyle = 'rgba(99,91,255,0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function animateTo(step) {
    if (animId) cancelAnimationFrame(animId);
    const startStep = animStep;
    const delta = step - startStep;
    const duration = Math.min(1200, Math.abs(delta) / 20);
    const start = performance.now();

    function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = t < .5 ? 2*t*t : -1+(4-2*t)*t;
      const cur = Math.round(startStep + delta * eased);
      animStep = cur;
      drawCurve(cur);

      const lossPoint = lossData.find(d => d.step >= cur) || lossData[lossData.length-1];
      lossEl.textContent = lossPoint.loss.toFixed(1);
      stepEl.textContent = cur.toLocaleString();

      if (t < 1) animId = requestAnimationFrame(frame);
    }
    animId = requestAnimationFrame(frame);
  }

  document.querySelectorAll('.stage-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.stage-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const step = parseInt(this.dataset.step);
      targetStep = step;
      animateTo(step);
      textEl.innerHTML = trainingCopy().texts[step];
    });
  });

  setTimeout(() => {
    animateTo(500);
    textEl.innerHTML = trainingCopy().texts[500];
  }, 500);
  window.addEventListener('resize', () => drawCurve(animStep));
  window.addEventListener('i18nchange', () => {
    textEl.innerHTML = trainingCopy().texts[targetStep] || trainingCopy().texts[500];
    drawCurve(animStep);
  });
})();

// ═══════════════════════════════════════════════
// INFERENCE — Probability Sampling Demo (canvas rebuild)
// ═══════════════════════════════════════════════
(function(){
  const canvas    = document.getElementById('prob-canvas');
  const seqEl     = document.getElementById('gen-seq');
  const tempSl    = document.getElementById('temp-slider');
  const tempValEl = document.getElementById('temp-val');
  const sampleBtn = document.getElementById('sample-btn');
  const resetBtn  = document.getElementById('reset-gen-btn');
  if (!canvas || !seqEl) return;
  const ctx = canvas.getContext('2d');

  const COLORS = ['#635BFF','#0570DE','#946800','#00875A','#DF1B41','#4F46E5','#7C3AED','#0891B2'];
  const copy = () => LLMS_UI[getLocale()].inference;

  function softmax(tokens, temp) {
    const logits = tokens.map(t => Math.log(Math.max(t.raw, 1e-9)) / temp);
    const maxL = Math.max(...logits);
    const exps = logits.map(l => Math.exp(l - maxL));
    const sum  = exps.reduce((a,b) => a+b, 0);
    return tokens.map((t,i) => ({...t, prob: exps[i]/sum}));
  }

  function getTokens() {
    const d = copy();
    return d.sequence[seqEl.textContent.trim()] || d.fallback;
  }

  let heights = [];
  let targets = [];
  let selectedIdx = -1;

  function computeTargets() {
    const temp = parseFloat(tempSl.value);
    const toks = softmax(getTokens(), temp);
    targets = toks.map(t => t.prob);
    return toks;
  }

  function draw(toks) {
    const dpr  = window.devicePixelRatio || 1;
    const cssW = canvas.offsetWidth || 400;
    const cssH = 180;
    canvas.width  = cssW * dpr;
    canvas.height = cssH * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);

    const n = toks.length, gap = 6;
    const barW    = (cssW - gap * (n + 1)) / n;
    const maxBarH = cssH - 40;

    toks.forEach((t, i) => {
      const x     = gap + i * (barW + gap);
      const h     = Math.max((heights[i] || 0) * maxBarH, 1);
      const y     = cssH - 24 - h;
      const color = COLORS[i % COLORS.length];
      const sel   = i === selectedIdx;

      ctx.globalAlpha = sel ? 1 : 0.6;
      ctx.fillStyle = color;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x, y, barW, h, [3,3,0,0]);
      else ctx.rect(x, y, barW, h);
      ctx.fill();

      if (sel) { ctx.shadowColor = color; ctx.shadowBlur = 18; ctx.fill(); ctx.shadowBlur = 0; }
      ctx.globalAlpha = 1;

      ctx.fillStyle = sel ? color : color + 'bb';
      ctx.font = `${sel ? 'bold ' : ''}10px 'JetBrains Mono',monospace`;
      ctx.textAlign = 'center';
      ctx.fillText(((heights[i]||0)*100).toFixed(0)+'%', x+barW/2, Math.max(y-4, 12));

      ctx.fillStyle = sel ? color : '#697386';
      ctx.font = `${sel ? 'bold ' : ''}9px 'JetBrains Mono',monospace`;
      const lbl = (t.t||'').trim() || '·';
      ctx.fillText(lbl.length > 8 ? lbl.slice(0,7)+'…' : lbl, x+barW/2, cssH - 6);
    });
  }

  function frame() {
    const toks = computeTargets();
    if (heights.length !== targets.length) {
      heights = [...targets];
    } else {
      for (let i = 0; i < heights.length; i++) heights[i] += (targets[i] - heights[i]) * 0.14;
    }
    draw(toks);
    requestAnimationFrame(frame);
  }

  tempSl.addEventListener('input', () => { tempValEl.textContent = parseFloat(tempSl.value).toFixed(1); });

  sampleBtn.addEventListener('click', () => {
    sampleBtn.disabled = true;
    sampleBtn.textContent = getLocale() === 'es' ? 'Simulando...' : 'Sampling...';
    const toks = softmax(getTokens(), parseFloat(tempSl.value));
    let r = Math.random(), cumul = 0, picked = toks.length - 1;
    for (let i = 0; i < toks.length; i++) { cumul += toks[i].prob; if (r < cumul) { picked = i; break; } }

    selectedIdx = picked;
    const base  = seqEl.textContent;
    const added = toks[picked].t;
    seqEl.innerHTML = '';
    const baseSpan = document.createElement('span');
    baseSpan.textContent = base;
    const newSpan = document.createElement('span');
    newSpan.className = 'gen-token-new';
    newSpan.textContent = added;
    seqEl.appendChild(baseSpan);
    seqEl.appendChild(newSpan);
    requestAnimationFrame(() => requestAnimationFrame(() => newSpan.classList.add('gen-token-new--in')));

    setTimeout(() => {
      selectedIdx = -1;
      sampleBtn.disabled = false;
      sampleBtn.textContent = getLocale() === 'es' ? 'Muestrear siguiente token' : 'Sample Next Token';
    }, 700);
  });

  resetBtn.addEventListener('click', () => {
    seqEl.textContent = copy().initial;
    selectedIdx = -1;
    heights = [];
    sampleBtn.textContent = getLocale() === 'es' ? 'Muestrear siguiente token' : 'Sample Next Token';
  });

  setTimeout(frame, 0);
  window.addEventListener('i18nchange', () => {
    seqEl.textContent = copy().initial;
    selectedIdx = -1;
    heights = [];
    sampleBtn.textContent = getLocale() === 'es' ? 'Muestrear siguiente token' : 'Sample Next Token';
  });
})();

// ═══════════════════════════════════════════════
// PIPELINE ANIMATION
// ═══════════════════════════════════════════════
(function(){
  const nodes = document.querySelectorAll('.pipeline-node');
  const arrows = document.querySelectorAll('.pipeline-arrow');

  function activateNode(node) {
    const wasActive = node.classList.contains('active');
    nodes.forEach(n => {
      n.classList.remove('active');
      n.setAttribute('aria-expanded', 'false');
    });
    if (!wasActive) {
      node.classList.add('active');
      node.setAttribute('aria-expanded', 'true');
    }
  }

  nodes.forEach(node => {
    node.addEventListener('click', function() { activateNode(this); });
    node.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activateNode(this); }
    });
  });

  document.getElementById('run-pipeline-btn').addEventListener('click', function() {
    nodes.forEach(n => { n.classList.remove('active'); n.setAttribute('aria-expanded','false'); });
    arrows.forEach(a => a.classList.remove('lit'));
    let i = 0;
    function next() {
      if (i < nodes.length) {
        nodes[i].classList.add('active');
        nodes[i].setAttribute('aria-expanded','true');
        if (i > 0) arrows[i-1].classList.add('lit');
        i++;
        setTimeout(next, 500);
      }
    }
    next();
  });
})();

// ═══════════════════════════════════════════════
// SCROLL OBSERVER — Animations + Nav
// ═══════════════════════════════════════════════
(function(){
  const sections = document.querySelectorAll('.section');
  const navDots = document.querySelectorAll('.tnav-btn');
  const progressBar = document.getElementById('progress-bar');
  const pipelineStages = document.querySelectorAll('.pipeline-stage');

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total = document.body.scrollHeight - window.innerHeight;
    const pct = Math.round(scrolled / total * 100);
    progressBar.style.width = pct + '%';
    progressBar.setAttribute('aria-valuenow', pct);
  }, {passive: true});

  const fadeItems = Array.from(document.querySelectorAll('.fade-up, .fade-in'));
  fadeItems.forEach((el, i) => {
    el.classList.add('animate-ready');
    el.style.transitionDelay = `${Math.min(i, 6) * 32}ms`;
  });

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      entry.target.classList.toggle('visible', entry.isIntersecting);
    });
  }, { threshold: 0.03, rootMargin: '0px 0px -4% 0px' });

  fadeItems.forEach(el => fadeObserver.observe(el));

  pipelineStages.forEach((s, i) => {
    s.classList.add('animate-ready');
    s.style.transitionDelay = `${i * 72}ms`;
  });
  const pipelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        pipelineStages.forEach(s => s.classList.add('visible'));
      } else {
        pipelineStages.forEach(s => s.classList.remove('visible'));
      }
    });
  }, { threshold: 0.05 });

  const summarySection = document.getElementById('s-summary');
  if (summarySection) pipelineObserver.observe(summarySection);

  function setActiveNav(sectionId) {
    navDots.forEach(btn => {
      const isActive = btn.dataset.section === sectionId;
      btn.classList.toggle('active', isActive);
      if (isActive) btn.setAttribute('aria-current', 'true');
      else btn.removeAttribute('aria-current');
    });
  }

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActiveNav(entry.target.id);
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));

  navDots.forEach(btn => {
    btn.addEventListener('click', () => {
      const section = document.getElementById(btn.dataset.section);
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  document.querySelectorAll('.stage-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.stage-btn').forEach(b => b.setAttribute('aria-pressed', 'false'));
      this.setAttribute('aria-pressed', 'true');
    });
  });
})();

// ═══════════════════════════════════════════════
// RAG SECTION — Scatter canvas + demo animation
// ═══════════════════════════════════════════════
(function() {
  const canvas = document.getElementById('rag-canvas');
  if (!canvas) return;
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.offsetWidth || 500;
  const H = canvas.offsetHeight || 200;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const dots = [
    {x: .28, y: .38, c: 'rgba(5,112,222,0.65)', r: 5, lbl: '', retrieved: false},
    {x: .34, y: .30, c: 'rgba(5,112,222,0.65)', r: 5, lbl: '', retrieved: false},
    {x: .22, y: .44, c: 'rgba(5,112,222,0.5)', r: 4, lbl: '', retrieved: false},
    {x: .30, y: .52, c: 'rgba(5,112,222,0.35)', r: 4, lbl: '', retrieved: false},
    {x: .68, y: .32, c: 'rgba(123,110,102,0.55)', r: 5, lbl: '', retrieved: false},
    {x: .74, y: .40, c: 'rgba(123,110,102,0.55)', r: 4, lbl: '', retrieved: false},
    {x: .62, y: .25, c: 'rgba(123,110,102,0.45)', r: 4, lbl: '', retrieved: false},
    {x: .60, y: .70, c: 'rgba(123,110,102,0.5)', r: 5, lbl: '', retrieved: false},
    {x: .68, y: .62, c: 'rgba(123,110,102,0.45)', r: 4, lbl: '', retrieved: false},
    {x: .54, y: .76, c: 'rgba(123,110,102,0.35)', r: 4, lbl: '', retrieved: false},
    {x: .31, y: .33, c: '#635BFF', r: 7, lbl: '', isQuery: true}
  ];
  const labels = () => LLMS_UI[getLocale()].rag;

  let showQuery = false, showLines = false;

  function themePalette() {
    const isDark = document.documentElement.dataset.theme === 'dark';
    return {
      isDark,
      grid: isDark ? 'rgba(220,231,242,0.10)' : 'rgba(216,208,194,0.44)',
      cluster1Fill: isDark ? 'rgba(103,232,249,0.62)' : 'rgba(5,112,222,0.42)',
      cluster2Fill: isDark ? 'rgba(226,232,240,0.56)' : 'rgba(123,110,102,0.40)',
      otherLabel: isDark ? 'rgba(226,232,240,0.82)' : 'rgba(123,110,102,0.78)',
      otherLabelHalo: isDark ? 'rgba(15,23,42,0.88)' : 'rgba(255,255,255,0.92)',
      queryLabel: isDark ? '#A78BFA' : '#635BFF',
      nearestLabel: isDark ? '#60A5FA' : '#0570DE',
      queryLineStart: isDark ? 'rgba(167,139,250,0.60)' : 'rgba(99,91,255,0.70)',
      queryLineEnd: isDark ? 'rgba(96,165,250,0.48)' : 'rgba(5,112,222,0.55)',
      labelHaloWidth: isDark ? 4 : 3
    };
  }

  function paintLabel(text, x, y, fill, halo, fontSize = 9) {
    ctx.save();
    ctx.font = `${fontSize}px JetBrains Mono,monospace`;
    ctx.lineJoin = 'round';
    ctx.miterLimit = 2;
    ctx.lineWidth = themePalette().labelHaloWidth;
    ctx.strokeStyle = halo;
    ctx.strokeText(text, x, y);
    ctx.fillStyle = fill;
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  function draw() {
    const theme = themePalette();
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = theme.grid;
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 44) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
    paintLabel(labels().cluster1, .06*W, .75*H, theme.cluster1Fill, theme.otherLabelHalo, 10);
    paintLabel(labels().cluster2, .55*W, .52*H, theme.cluster2Fill, theme.otherLabelHalo, 10);
    if (showLines) {
      const q = dots[dots.length-1];
      [dots[0], dots[1]].forEach(d => {
        const g = ctx.createLinearGradient(q.x*W,q.y*H,d.x*W,d.y*H);
        g.addColorStop(0, theme.queryLineStart); g.addColorStop(1, theme.queryLineEnd);
        ctx.strokeStyle = g; ctx.lineWidth = 1.5;
        ctx.setLineDash([4,4]);
        ctx.beginPath(); ctx.moveTo(q.x*W,q.y*H); ctx.lineTo(d.x*W,d.y*H); ctx.stroke();
        ctx.setLineDash([]);
      });
    }
    dots.forEach((d, i) => {
      if (d.isQuery && !showQuery) return;
      const x = d.x*W, y = d.y*H;
      const isNearest = showLines && (i === 0 || i === 1);
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(x, y, isNearest ? d.r+1 : d.r, 0, Math.PI*2);
      ctx.fillStyle = isNearest ? '#0570DE' : d.c;
      ctx.fill();
      if (d.lbl) {
        const fill = d.isQuery ? theme.queryLabel : (isNearest ? theme.nearestLabel : theme.otherLabel);
        const halo = theme.isDark ? 'rgba(15,23,42,0.92)' : 'rgba(255,255,255,0.95)';
        paintLabel(d.lbl, x + d.r + 3, y + 3, fill, halo, 9);
      }
    });
  }

  function refreshLabels() {
    const isEs = getLocale() === 'es';
    dots[0].lbl = isEs ? 'colonia' : 'colony';
    dots[1].lbl = isEs ? 'capital' : 'capital';
    dots[2].lbl = isEs ? 'colonos' : 'colonists';
    dots[4].lbl = isEs ? 'temperatura' : 'temperature';
    dots[5].lbl = isEs ? 'clima' : 'climate';
    dots[6].lbl = isEs ? 'geografía' : 'geography';
    dots[7].lbl = isEs ? 'misión' : 'mission';
    dots[8].lbl = isEs ? 'lanzamiento' : 'launch';
    dots[10].lbl = isEs ? 'consulta ▲' : 'query ▲';
    draw();
  }

  setTimeout(refreshLabels, 0);

  const ragSec = document.getElementById('s-rag');
  let seenOnce = false;
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !seenOnce) {
      seenOnce = true;
      setTimeout(() => { showQuery = true; draw(); }, 500);
    }
  }, {threshold: 0.2});
  if (ragSec) obs.observe(ragSec);
  window.addEventListener('themechange', draw);

  const runBtn    = document.getElementById('rag-run-btn');
  const resetBtn  = document.getElementById('rag-reset-btn');
  const flowSteps = [1,2,3,4,5,6].map(i => document.getElementById('rag-s'+i));
  const doc0      = document.getElementById('rdoc-0');
  const doc1      = document.getElementById('rdoc-1');
  const ctxBox    = document.getElementById('rag-ctx-box');
  const ansGood   = document.getElementById('rag-ans-good');
  const goodBadge = document.getElementById('rag-good-badge');

  function resetDemo() {
    flowSteps.forEach(s => s && s.classList.remove('rag-active'));
    doc0 && doc0.classList.remove('rag-retrieved');
    doc1 && doc1.classList.remove('rag-retrieved');
    if (ctxBox) ctxBox.classList.remove('rag-visible');
    if (ansGood) ansGood.style.opacity = '0.3';
    if (goodBadge) goodBadge.style.opacity = '0.3';
    showLines = false; draw();
    if (runBtn) { runBtn.disabled = false; runBtn.textContent = '▶ Run RAG Query'; }
  }

  function runDemo() {
    if (!runBtn) return;
    runBtn.disabled = true; runBtn.textContent = 'Running…';
    const timings = [0, 700, 1400, 2100, 2900, 3700];
    timings.forEach((t, i) => {
      setTimeout(() => {
        flowSteps.forEach(s => s && s.classList.remove('rag-active'));
        flowSteps[i] && flowSteps[i].classList.add('rag-active');
        if (i === 2) { showLines = true; draw(); }
        if (i === 3) { doc0 && doc0.classList.add('rag-retrieved'); doc1 && doc1.classList.add('rag-retrieved'); }
        if (i === 4) { ctxBox && ctxBox.classList.add('rag-visible'); }
        if (i === 5) {
          if (ansGood) ansGood.style.opacity = '1';
          if (goodBadge) goodBadge.style.opacity = '1';
          runBtn.disabled = false; runBtn.textContent = '▶ Run Again';
        }
      }, t);
    });
  }

  runBtn  && runBtn.addEventListener('click',  () => { resetDemo(); setTimeout(runDemo, 80); });
  resetBtn && resetBtn.addEventListener('click', resetDemo);
  window.addEventListener('i18nchange', refreshLabels);
})();
function getLocale() {
  return document.documentElement.lang === 'es' ? 'es' : 'en';
}

const LLMS_UI = {
  en: {
    hero: [
      "It's a large language model — a neural network with 405 billion parameters trained to predict the next token in a sequence...",
      "Every word GPT generates is computed by the same forward pass you'll build here — just with 405 billion weights instead of 19.",
      "Backpropagation isn't magic: it's the chain rule applied recursively. Every weight gets told exactly how much it contributed to the error.",
      "Gradient descent is just: move each weight a tiny step in the direction that reduces the loss. Repeat a billion times. That's training."
    ],
    transformer: {
      labels: ['Input Tokens', 'Token Embedding', 'Multi-Head Attention', 'Feed Forward (MLP)', 'Layer Norm + Residual', '× N Transformer Blocks', 'Output Logits'],
      title: 'Transformer Architecture',
      note: 'Mock 4×4 attention matrix (dark=high)'
    },
    training: {
      texts: {
        1: `<span class="incoherent">wqp mxr tkz bnf opc lsw mzq vdf nrt</span>`,
        500: `<span class="incoherent">the model has learn</span><span class="coherent">ing</span> <span class="incoherent">but confus</span><span class="coherent">tion</span> <span class="incoherent">still wqp</span> <span class="coherent">the model</span> <span class="incoherent">bns</span> <span class="coherent">to predict</span>...`,
        5000: `<span class="coherent">The language model learns to predict the next token in a sequence.</span> <span class="incoherent">Training requires many thousands of</span> <span class="coherent">gradient descent steps</span> <span class="incoherent">to converge</span>.`,
        32000: `<span class="coherent">The neural network has learned the statistical patterns of human language. It can generate coherent text on virtually any topic, answer questions, write code, and engage in multi-turn conversations.</span>`
      },
      stageBtns: [
        'Step 1<br><span style="color:var(--red)">Loss: 11.2</span>',
        'Step 500<br><span style="color:var(--amber)">Loss: 4.8</span>',
        'Step 5K<br><span style="color:var(--purple)">Loss: 3.1</span>',
        'Step 32K<br><span style="color:var(--green)">Loss: 2.4</span>'
      ],
      labels: { loss: 'Training Loss ↓', stageHint: 'Select a training stage to see model output quality', stageOutput: 'Model Output at This Stage' }
    },
    inference: {
      initial: 'The sky appears blue',
      sequence: {
        'The sky appears blue': [
          {t:' because',raw:.31},{t:' due',raw:.18},{t:',',raw:.12},
          {t:' to',raw:.10},{t:' when',raw:.08},{t:' as',raw:.06},{t:' from',raw:.04},{t:' and',raw:.03}
        ],
        'The sky appears blue because': [
          {t:' of',raw:.42},{t:' light',raw:.20},{t:' Rayleigh',raw:.12},
          {t:' the',raw:.09},{t:' shorter',raw:.06},{t:' sunlight',raw:.04},{t:' scattered',raw:.03},{t:' wavelength',raw:.02}
        ],
        'The sky appears blue because of': [
          {t:' Rayleigh',raw:.38},{t:' the',raw:.25},{t:' light',raw:.12},
          {t:' scattering',raw:.09},{t:' atmospheric',raw:.07},{t:' how',raw:.04},{t:' sunlight',raw:.03},{t:' blue',raw:.02}
        ],
        'The sky appears blue because of Rayleigh': [
          {t:' scattering',raw:.72},{t:',',raw:.10},{t:' diffusion',raw:.07},
          {t:' effects',raw:.04},{t:' dispersion',raw:.03},{t:' waves',raw:.02},{t:' radiation',raw:.01},{t:' emission',raw:.01}
        ],
        'The sky appears blue because of Rayleigh scattering': [
          {t:', ',raw:.35},{t:' of',raw:.28},{t:' —',raw:.15},{t:'.',raw:.12},{t:' which',raw:.06},{t:' where',raw:.04}
        ],
        'The sky appears blue because of Rayleigh scattering,': [
          {t:' which',raw:.45},{t:' where',raw:.20},{t:' a',raw:.15},{t:' shorter',raw:.10},{t:' blue',raw:.06},{t:' sunlight',raw:.04}
        ],
        'The sky appears blue because of Rayleigh scattering, which': [
          {t:' causes',raw:.38},{t:' scatters',raw:.28},{t:' makes',raw:.18},{t:' bends',raw:.08},{t:' affects',raw:.05},{t:' creates',raw:.03}
        ]
      },
      fallback: [
        {t:' light',raw:.28},{t:' the',raw:.22},{t:' shorter',raw:.14},
        {t:' blue',raw:.12},{t:' wave',raw:.10},{t:' scatter',raw:.08},{t:' sun',raw:.04},{t:' air',raw:.02}
      ],
      labels: { prob: 'Next token candidates', sample: 'Sample Next Token', reset: 'Reset', temp: 'Temperature: controls randomness. Low=predictable, High=random' }
    },
    rag: {
      cluster1: 'colony / capital cluster',
      cluster2: 'science cluster'
    }
  },
  es: {
    hero: [
      "Es un modelo de lenguaje grande: una red neuronal con 405.000 millones de parámetros entrenada para predecir el siguiente token de una secuencia...",
      "Cada palabra que genera GPT se calcula con el mismo paso hacia adelante que vas a construir aquí, solo que con 405.000 millones de pesos en lugar de 19.",
      "La retropropagación no es magia: es la regla de la cadena aplicada de forma recursiva. Cada peso recibe exactamente cuánto contribuyó al error.",
      "El descenso de gradiente consiste solo en mover cada peso un pequeño paso en la dirección que reduce la pérdida. Repetir mil millones de veces. Eso es entrenar."
    ],
    transformer: {
      labels: ['Tokens de entrada', 'Embedding de tokens', 'Atención multicabeza', 'Red de avance (MLP)', 'Normalización de capa + residual', '× N bloques transformadores', 'Logits de salida'],
      title: 'Arquitectura Transformer',
      note: 'Matriz de atención simulada 4×4 (oscuro = alto)'
    },
    training: {
      texts: {
        1: `<span class="incoherent">wqp mxr tkz bnf opc lsw mzq vdf nrt</span>`,
        500: `<span class="incoherent">el modelo ha apren</span><span class="coherent">dido</span> <span class="incoherent">pero la confu</span><span class="coherent">sión</span> <span class="incoherent">sigue wqp</span> <span class="coherent">el modelo</span> <span class="incoherent">bns</span> <span class="coherent">a predecir</span>...`,
        5000: `<span class="coherent">El modelo de lenguaje aprende a predecir el siguiente token en una secuencia.</span> <span class="incoherent">Entrenar requiere muchos miles de</span> <span class="coherent">pasos de descenso de gradiente</span> <span class="incoherent">para converger</span>.`,
        32000: `<span class="coherent">La red neuronal ha aprendido los patrones estadísticos del lenguaje humano. Puede generar texto coherente sobre casi cualquier tema, responder preguntas, escribir código y mantener conversaciones de varios turnos.</span>`
      },
      stageBtns: [
        'Paso 1<br><span style="color:var(--red)">Pérdida: 11.2</span>',
        'Paso 500<br><span style="color:var(--amber)">Pérdida: 4.8</span>',
        'Paso 5K<br><span style="color:var(--purple)">Pérdida: 3.1</span>',
        'Paso 32K<br><span style="color:var(--green)">Pérdida: 2.4</span>'
      ],
      labels: { loss: 'Pérdida de entrenamiento ↓', stageHint: 'Selecciona una fase de entrenamiento para ver la calidad de salida', stageOutput: 'Salida del modelo en esta fase' }
    },
    inference: {
      initial: 'El cielo parece azul',
      sequence: {
        'El cielo parece azul': [
          {t:' porque',raw:.31},{t:' debido',raw:.18},{t:',',raw:.12},
          {t:' a',raw:.10},{t:' cuando',raw:.08},{t:' como',raw:.06},{t:' desde',raw:.04},{t:' y',raw:.03}
        ],
        'El cielo parece azul porque': [
          {t:' de',raw:.42},{t:' la luz',raw:.20},{t:' Rayleigh',raw:.12},
          {t:' el',raw:.09},{t:' más corta',raw:.06},{t:' la luz solar',raw:.04},{t:' dispersada',raw:.03},{t:' longitud de onda',raw:.02}
        ],
        'El cielo parece azul porque de': [
          {t:' Rayleigh',raw:.38},{t:' la',raw:.25},{t:' luz',raw:.12},
          {t:' dispersión',raw:.09},{t:' atmosférica',raw:.07},{t:' cómo',raw:.04},{t:' sol',raw:.03},{t:' azul',raw:.02}
        ],
        'El cielo parece azul porque de Rayleigh': [
          {t:' dispersión',raw:.72},{t:',',raw:.10},{t:' difusión',raw:.07},
          {t:' efectos',raw:.04},{t:' dispersión',raw:.03},{t:' ondas',raw:.02},{t:' radiación',raw:.01},{t:' emisión',raw:.01}
        ],
        'El cielo parece azul porque de Rayleigh dispersión': [
          {t:', ',raw:.35},{t:' de',raw:.28},{t:' —',raw:.15},{t:'.',raw:.12},{t:' que',raw:.06},{t:' donde',raw:.04}
        ],
        'El cielo parece azul porque de Rayleigh dispersión,': [
          {t:' que',raw:.45},{t:' donde',raw:.20},{t:' una',raw:.15},{t:' más corta',raw:.10},{t:' azul',raw:.06},{t:' luz solar',raw:.04}
        ],
        'El cielo parece azul porque de Rayleigh dispersión, que': [
          {t:' causa',raw:.38},{t:' dispersa',raw:.28},{t:' hace',raw:.18},{t:' dobla',raw:.08},{t:' afecta',raw:.05},{t:' crea',raw:.03}
        ]
      },
      fallback: [
        {t:' luz',raw:.28},{t:' la',raw:.22},{t:' más corta',raw:.14},
        {t:' azul',raw:.12},{t:' onda',raw:.10},{t:' dispersa',raw:.08},{t:' sol',raw:.04},{t:' aire',raw:.02}
      ],
      labels: { prob: 'Candidatos de siguiente token', sample: 'Muestrear siguiente token', reset: 'Reiniciar', temp: 'Temperatura: controla la aleatoriedad. Baja=predecible, Alta=aleatoria' }
    },
    rag: {
      cluster1: 'colonia / capital',
      cluster2: 'ciencia'
    }
  }
};
