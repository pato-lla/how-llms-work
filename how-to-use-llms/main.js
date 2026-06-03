// ═══════════════════════════════════════════════
// HERO CANVAS — Floating Usage Words
// ═══════════════════════════════════════════════
(function(){
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, tokens = [];
  const WORDS = ['search','voice','code','docs','think','chat','agent','plan','debug','read','write','API','tool','PDF','ask','plot','research','query','zip','model','o1','o3','GPT','Claude','Gemini','Cursor','prompt','memory','image','vision','memo','Whisper','draft','edit','run','cite','parse','RAG','deep','tune','eval'];

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
    const alpha = 0.05 + Math.random() * 0.085;
    return { x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * 0.17, vy: -0.11 - Math.random() * 0.13, word, size, alpha };
  }

  function init() { resize(); tokens = Array.from({length: 45}, makeToken); }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const t of tokens) {
      t.x += t.vx; t.y += t.vy;
      if (t.y < -30) Object.assign(t, makeToken(), { x: Math.random() * W, y: H + 20 });
      if (t.x < -60) t.x = W + 20;
      if (t.x > W + 60) t.x = -20;
      ctx.font = `${t.size}px 'JetBrains Mono', monospace`;
      const mw = ctx.measureText(t.word).width;
      const pad = 5, ph = t.size + 6;
      ctx.strokeStyle = `rgba(13,148,136,${t.alpha * 0.6})`;
      ctx.lineWidth = 0.5;
      ctx.strokeRect(t.x - pad/2, t.y - ph + 3, mw + pad, ph);
      ctx.fillStyle = `rgba(10,22,40,${t.alpha})`;
      ctx.fillText(t.word, t.x, t.y);
    }
    requestAnimationFrame(draw);
  }

  init();
  requestAnimationFrame(draw);
  window.addEventListener('resize', () => { resize(); init(); });
})();

// ═══════════════════════════════════════════════
// TYPEWRITER
// ═══════════════════════════════════════════════
(function(){
  const el = document.getElementById('tw-response');
  const getCopy = () => window.HowToUseLLMsI18n?.getCopy?.() || {
    typewriter: { messages: [
      "It has no memory of you, its knowledge is 6–12 months stale, and every answer is a probabilistic sample. Treat it like a brilliant intern — not an oracle.",
      "For timeless knowledge, skip web search — the weights are enough. For anything recent, time-sensitive, or esoteric — enable search or use Perplexity.",
      "Voice removes half the friction. Super Whisper can route ~50% of your queries hands-free. Switch to typing for product names and library names Whisper gets wrong.",
      "Thinking models (o1, o3) are for hard problems. They're slower and pricier — don't waste them on simple tasks. Claude Sonnet often beats o1 Pro on nuanced code."
    ] }
  };
  let mi = 0, ci = 0, deleting = false, runId = 0, messages = getCopy().typewriter.messages;

  function type(token) {
    if (token !== runId) return;
    const msg = messages[mi];
    if (!deleting) {
      if (ci < msg.length) {
        el.innerHTML = msg.slice(0, ++ci) + '<span class="tw-cursor"></span>';
        setTimeout(() => type(token), 24 + Math.random() * 18);
      } else {
        setTimeout(() => { deleting = true; type(token); }, 3200);
      }
    } else {
      if (ci > 0) {
        el.innerHTML = msg.slice(0, --ci) + '<span class="tw-cursor"></span>';
        setTimeout(() => type(token), 10);
      } else {
        deleting = false;
        mi = (mi + 1) % messages.length;
        setTimeout(() => type(token), 400);
      }
    }
  }

  function reset() {
    messages = getCopy().typewriter.messages;
    mi = 0;
    ci = 0;
    deleting = false;
    runId += 1;
    el.innerHTML = '<span class="tw-cursor" aria-hidden="true"></span>';
    setTimeout(() => type(runId), 300);
  }

  window.addEventListener('llms:localechange', reset);
  reset();
})();

// ═══════════════════════════════════════════════
// THINKING DEMO
// ═══════════════════════════════════════════════
(function(){
  const stepsEl = document.getElementById('thinking-steps');
  const answerEl = document.getElementById('thinking-answer');
  const contentEl = document.getElementById('ta-content');
  const timeEl = document.getElementById('thinking-time');
  const runBtn = document.getElementById('thinking-run-btn');

  let running = false;
  const getCopy = () => window.HowToUseLLMsI18n?.getCopy?.() || null;

  runBtn.addEventListener('click', function() {
    if (running) return;
    const copy = getCopy();
    const thinking = copy?.thinking || {};
    const steps = thinking.steps || [];
    const answer = thinking.answer || '';
    running = true;
    runBtn.disabled = true;
    runBtn.textContent = thinking.statusThinking || 'Thinking...';
    stepsEl.innerHTML = '';
    answerEl.style.display = 'none';

    let elapsed = 0;
    const timer = setInterval(() => {
      elapsed++;
      timeEl.textContent = (thinking.statusElapsed || 'thinking for {n}s...').replace('{n}', elapsed);
    }, 1000);

    steps.forEach((step, i) => {
      setTimeout(() => {
        const div = document.createElement('div');
        div.className = 'thinking-step';
        div.innerHTML = `<span class="ts-icon">${step.icon}</span><span class="ts-text">${step.text}</span>`;
        stepsEl.appendChild(div);
      }, i * 700);
    });

    setTimeout(() => {
      clearInterval(timer);
      timeEl.textContent = (thinking.statusDone || 'thought for {n}s').replace('{n}', Math.max(steps.length - 1, 0));
      answerEl.style.display = 'block';
      const label = answerEl.querySelector('.ta-label');
      if (label) label.textContent = thinking.answerLabel || 'Answer';
      contentEl.textContent = answer;
      runBtn.disabled = false;
      runBtn.textContent = thinking.buttonAgain || '↺ Run again';
      running = false;
    }, steps.length * 700 + 300);
  });
})();

// ═══════════════════════════════════════════════
// RESEARCH PIPELINE
// ═══════════════════════════════════════════════
(function(){
  const runBtn = document.getElementById('rp-run-btn');
  const resultEl = document.getElementById('rp-result');
  const steps = [0,1,2,3].map(i => document.getElementById(`rp-s${i}`));
  let running = false;
  const getCopy = () => window.HowToUseLLMsI18n?.getCopy?.() || null;

  function resetSteps() {
    steps.forEach(s => s && s.classList.remove('rp-active'));
    resultEl.style.display = 'none';
  }

  function runDemo() {
    if (running) return;
    const copy = getCopy();
    const research = copy?.research || {};
    running = true;
    runBtn.disabled = true;
    runBtn.textContent = research.buttonRunning || 'Simulating...';
    resetSteps();

    const timings = [0, 800, 1700, 2700];
    timings.forEach((t, i) => {
      setTimeout(() => {
        steps.forEach(s => s && s.classList.remove('rp-active'));
        steps[i] && steps[i].classList.add('rp-active');
      }, t);
    });

    setTimeout(() => {
      resultEl.style.display = 'block';
      runBtn.disabled = false;
      runBtn.textContent = research.buttonAgain || '↺ Simulate again';
      running = false;
    }, 3700);
  }

  runBtn.addEventListener('click', () => { resetSteps(); setTimeout(runDemo, 80); });
})();

// ═══════════════════════════════════════════════
// CODE DEMO + CHART
// ═══════════════════════════════════════════════
(function(){
  const runBtn = document.getElementById('code-run-btn');
  const steps = [0,1,2].map(i => document.getElementById(`cd-step-${i}`));
  let running = false;
  const getCopy = () => window.HowToUseLLMsI18n?.getCopy?.() || null;

  function drawChart() {
    const canvas = document.getElementById('chart-canvas');
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth || 340;
    const H = 160;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const pad = { l: 36, r: 12, t: 12, b: 24 };
    const cW = W - pad.l - pad.r, cH = H - pad.t - pad.b;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0A1628';
    ctx.fillRect(0, 0, W, H);

    const countries = ['USA','Japan','Germany','UK','France','Italy','Canada'];
    const colors = ['#0D9488','#6EE7E7','#FCD34D','#C4B5FD','#F9A8D4','#86EFAC','#FCA5A5'];
    const years = Array.from({length: 34}, (_, i) => 1990 + i);

    function gdpSeed(baseGDP, volatility, trend, countryIdx) {
      return years.map((_, i) => {
        const noise = Math.sin(i * 2.3 + countryIdx * 1.7) * volatility;
        return baseGDP + trend * i + noise;
      });
    }

    const series = [
      gdpSeed(5.9, 0.3, 0.38, 0),
      gdpSeed(3.2, 0.2, 0.08, 1),
      gdpSeed(1.8, 0.15, 0.11, 2),
      gdpSeed(1.2, 0.1, 0.08, 3),
      gdpSeed(1.1, 0.1, 0.07, 4),
      gdpSeed(1.0, 0.1, 0.04, 5),
      gdpSeed(0.7, 0.08, 0.05, 6),
    ];

    const allVals = series.flat();
    const minV = Math.min(...allVals) * 0.9;
    const maxV = Math.max(...allVals) * 1.05;

    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const y = pad.t + (i / 4) * cH;
      ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(W - pad.r, y); ctx.stroke();
      const val = (maxV - (i / 4) * (maxV - minV)).toFixed(0);
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.font = '8px JetBrains Mono';
      ctx.fillText(`$${val}T`, 0, y + 3);
    }

    ['1990','2000','2010','2023'].forEach((yr, i) => {
      const x = pad.l + (i / 3) * cW;
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.font = '8px JetBrains Mono';
      ctx.fillText(yr, x - 10, H - 4);
    });

    series.forEach((data, si) => {
      ctx.beginPath();
      data.forEach((val, i) => {
        const x = pad.l + (i / (years.length - 1)) * cW;
        const y = pad.t + ((maxV - val) / (maxV - minV)) * cH;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.strokeStyle = colors[si];
      ctx.lineWidth = si === 0 ? 1.8 : 1.2;
      ctx.globalAlpha = si === 0 ? 1 : 0.7;
      ctx.stroke();
      ctx.globalAlpha = 1;

      const lastVal = data[data.length - 1];
      const lastX = pad.l + cW;
      const lastY = pad.t + ((maxV - lastVal) / (maxV - minV)) * cH;
      ctx.font = '8px JetBrains Mono';
      ctx.fillStyle = colors[si];
      ctx.fillText(countries[si], lastX - 38, lastY - 3);
    });
  }

  runBtn.addEventListener('click', function() {
    if (running) return;
    const copy = getCopy();
    const code = copy?.code || {};
    running = true;
    runBtn.disabled = true;
    steps.forEach(s => { if (s) s.style.display = 'none'; });

    setTimeout(() => {
      steps[0].style.display = 'block';
    }, 100);

    setTimeout(() => {
      steps[0].style.display = 'none';
      steps[1].style.display = 'block';
    }, 1400);

    setTimeout(() => {
      steps[1].style.display = 'none';
      steps[2].style.display = 'block';
      drawChart();
      runBtn.disabled = false;
      runBtn.textContent = code.buttonAgain || '↺ Run again';
      running = false;
    }, 2400);
  });
})();

// ═══════════════════════════════════════════════
// AGENT LOOP ANIMATION
// ═══════════════════════════════════════════════
(function(){
  const runBtn = document.getElementById('al-run-btn');
  const steps = [0,1,2,3].map(i => document.getElementById(`al-s${i}`));
  let running = false;
  const getCopy = () => window.HowToUseLLMsI18n?.getCopy?.() || null;

  runBtn.addEventListener('click', function() {
    if (running) return;
    const copy = getCopy();
    const agent = copy?.agent || {};
    running = true;
    runBtn.disabled = true;
    steps.forEach(s => s && s.classList.remove('al-active'));

    let i = 0;
    const interval = setInterval(() => {
      steps.forEach(s => s && s.classList.remove('al-active'));
      if (i < steps.length) {
        steps[i] && steps[i].classList.add('al-active');
        i++;
      } else {
        clearInterval(interval);
        runBtn.disabled = false;
        runBtn.textContent = agent.buttonAgain || '↺ Animate again';
        running = false;
      }
    }, 600);
  });
})();

// ═══════════════════════════════════════════════
// SCROLL OBSERVER — Animations + Nav + Progress
// ═══════════════════════════════════════════════
(function(){
  const sections = document.querySelectorAll('.section');
  const navBtns = document.querySelectorAll('.tnav-btn');
  const progressBar = document.getElementById('progress-bar');
  const pipelineStages = document.querySelectorAll('.pipeline-stage');

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total = document.body.scrollHeight - window.innerHeight;
    const pct = Math.round(scrolled / total * 100);
    progressBar.style.width = pct + '%';
    progressBar.setAttribute('aria-valuenow', pct);
  }, {passive: true});

  const fadeItems = Array.from(document.querySelectorAll('.fade-up'));
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
    navBtns.forEach(btn => {
      const isActive = btn.dataset.section === sectionId;
      btn.classList.toggle('active', isActive);
      if (isActive) {
        btn.setAttribute('aria-current', 'true');
      } else {
        btn.removeAttribute('aria-current');
      }
    });
  }

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActiveNav(entry.target.id);
    });
  }, { threshold: 0.35 });

  sections.forEach(s => sectionObserver.observe(s));

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const section = document.getElementById(btn.dataset.section);
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

})();
