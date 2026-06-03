(function(){
  const STORAGE = { locale: 'how-llms-locale', theme: 'how-llms-theme' };
  const browserLocale = (navigator.language || 'en').toLowerCase();
  let locale = localStorage.getItem(STORAGE.locale) || (browserLocale.startsWith('es') ? 'es' : 'en');
  let theme = localStorage.getItem(STORAGE.theme) || 'system';

  const COPY = {
    en: {
      nav: ['Intro','Problem','Neuron','Layers','Forward','Loss','Derivatives','Backprop','Gradient Descent'],
      hero: {
        badge: 'Part 3 · No Prior Knowledge Needed',
        title: 'Neural Networks<br><span>from Scratch</span>',
        sub: 'The math, intuition, and code behind how neural networks actually learn — built up from a single neuron to a working training loop. Based on Andrej Karpathy\'s micrograd tutorial.',
        stats: ['Concepts','Lines of Python','Demos','Source'],
        caveat: 'Companion to <a href="../index.html" style="color:var(--accent)">Part 1: How LLMs Work</a>. All concepts and code traced directly to Karpathy\'s micrograd lecture.',
        twLabel: 'Core Insight',
        twPrompt: 'Q: What even is a neural network?'
      },
      problem: {
        badge: 'Chapter 1 · Motivation',
        title: 'The Problem<br>We\'re Solving',
        body: [
          'Before we build anything, let\'s understand what we\'re trying to do. We have some inputs and we want to predict an output. For example: given these 4 measurements about a person, predict whether they\'ll like a movie.',
          'The challenge: we don\'t know the formula. We can\'t write the rules by hand. Instead, we want a system that <span class="highlight">learns the formula from examples</span> — just by seeing a lot of input/output pairs.',
          'A neural network is that system. It starts as a completely random function. Then it looks at thousands of examples and adjusts itself — tiny nudge by tiny nudge — until its predictions get good. This process is called <span class="highlight-a">training</span>.'
        ],
        insight: ['The Connection to Part 1','GPT does exactly this — at massive scale. Its "inputs" are tokens, its "output" is the next token, and it trained on 15 trillion examples. The math is the same as what we\'ll build here. Just more of it.']
      },
      neuron: {
        badge: 'Chapter 2 · The Building Block',
        title: 'What is<br>a Neuron?',
        body: [
          'A neuron is just a tiny mathematical function. Think of it as a <span class="highlight">dimmer switch</span>: it takes a bunch of inputs, decides how much each one matters (the weights), adds a personal default lean (the bias), and squishes the result to a bounded range.',
          'The formula: <span class="highlight-a">output = tanh(w₁·x₁ + w₂·x₂ + b)</span>',
          'Where w₁, w₂ are <span class="highlight">weights</span> ("how much does this input matter?"), b is the <span class="highlight">bias</span> ("what\'s my default lean when inputs are zero?"), and <span class="highlight-g">tanh</span> squishes the result to always land between -1 and 1.'
        ],
        insight: ['Why tanh?','Without an activation function, stacking neurons just produces a linear function — no matter how many layers you add. tanh introduces non-linearity, which is what lets networks learn complex patterns.'],
        sub: 'Neuron Playground',
        helper: 'Drag the sliders to change the weights and bias. Watch the neuron\'s output update live. Fixed inputs: x₁ = 0.5, x₂ = −0.3.',
        labels: ['Weight 1','Weight 2','Bias'],
      },
      layers: {
        badge: 'Chapter 3 · Architecture',
        title: 'Layers &<br>the MLP',
        body: [
          'One neuron isn\'t enough to learn complex patterns. We stack them into <span class="highlight">layers</span>, and stack layers into a <span class="highlight-a">Multi-Layer Perceptron (MLP)</span>. Think of it as an assembly line: the first layer looks at raw inputs, the next layer looks at what the first layer found, and so on.',
          'Every connection between neurons is one weight. A network with 4 inputs → 3 neurons → 1 output has <span class="highlight">(4×3) + (3×1) = 15 weights</span>, plus biases. GPT-4 has the same structure, just with 405 billion weights.'
        ],
        sub: 'MLP Architecture',
        helper: 'A 4→3→1 network: 4 inputs, one hidden layer of 3 neurons, 1 output.',
        insight: ['Create the model in one line','n = <span class="fn">MLP</span>(<span class="nm">4</span>, [<span class="nm">3</span>, <span class="nm">1</span>])  <span class="co"># 4 inputs → 3 hidden → 1 output</span><br>That\'s it. We now have a randomly-initialized network with 4×3 + 3×1 = 15 weights plus 4 biases = 19 learnable parameters.']
      },
      forward: {
        badge: 'Chapter 4 · Computing the Output',
        title: 'The Forward<br>Pass',
        body: [
          'The forward pass is simply: run data through the network from left to right. Each neuron fires in turn, passes its output to the next layer, and eventually we get a prediction out the end.',
          'At the start, since weights are random, predictions are meaningless. But we can still run the forward pass — we need it to compute how wrong we are (§5), which tells us how to improve.'
        ],
        sub: 'Forward Pass Visualizer',
        helper: 'Click "Run Forward Pass" to watch data flow through a 2→3→1 network. Each node lights up with its computed value.'
      },
      loss: {
        badge: 'Chapter 5 · Measuring Error',
        title: 'Loss — How<br>Wrong Are We?',
        body: [
          'After the forward pass, we have predictions. Now we need to measure how wrong they are. The <span class="highlight">loss function</span> is a report card: one single number that summarizes "here is how bad your predictions are right now."',
          'We use <span class="highlight-a">Mean Squared Error (MSE)</span>: for each example, square the difference between our prediction and the target, then average them all. Squaring ensures the loss is always positive and punishes big mistakes harder.',
          'The goal of training: make this loss number as small as possible.'
        ],
        sub: 'Loss Landscape',
        helper: 'The loss is a function of all the weights. Think of it as a hilly terrain — we want to roll the ball to the lowest point. Click "Step" to run one gradient descent update.',
        btn: 'Step ↓',
        insight: ['How to read the plot','The blue dot is the current point. The red curve is the loss landscape. Gradient descent nudges the point downhill.']
      },
      derivatives: {
        badge: 'Chapter 6 · The Math of Change',
        title: 'Derivatives —<br>Which Way is Downhill?',
        body: [
          'We want to push the loss down. To do that, we need to know: for each weight, does increasing it make the loss go up or down? That\'s exactly what a <span class="highlight">derivative</span> tells us.',
          'Imagine standing on a hill. You can\'t see the whole landscape, but you can feel which direction your foot is going downhill. The derivative is that "feel" — the slope of the loss at your current position.',
          'Key rules we\'ll use:'
        ],
        sub: 'Derivative Visualizer',
        helper: 'Drag the point along f(x) = x². The tangent line shows the slope (derivative) at that position. Notice: at x=0 the slope is 0; it gets steeper as x moves away from center.',
        insight: ['The two derivative rules','Power rule: d(x²)/dx = 2x. Chain rule: if a value feeds into another function, gradients multiply along the chain.']
      },
      backprop: {
        badge: 'Chapter 7 · Assigning Blame',
        title: 'Backpropagation',
        body: [
          'We know the loss. We know derivatives. But we have hundreds of weights — how do we know which ones to blame, and by how much?',
          '<span class="highlight">Backpropagation</span> solves this efficiently. It walks the computation graph backwards — from the loss, through every operation, back to every weight — computing each weight\'s gradient using the chain rule.',
          'Karpathy\'s key insight: <em>"The only thing backprop does is apply the chain rule recursively."</em> Nothing more. It\'s mechanical, not magical.'
        ],
        sub: 'Expression Graph',
        helper: 'A simple expression: e = tanh((a·b) + a). Click "Forward Pass" to compute values, then "Backprop" to watch gradients flow backwards.',
        insight: ['Why it works','Every local derivative is multiplied by the gradient coming from the next node. That makes the whole computation tractable, even for huge graphs.']
      },
      gd: {
        badge: 'Chapter 8 · Learning',
        title: 'Gradient Descent —<br>The Training Loop',
        body: [
          'We have gradients. Now we use them. The update rule is simple: for each weight, move it a tiny step in the opposite direction of its gradient. Opposite because the gradient points uphill — we want to go <em>downhill</em>.'
        ],
        sub: 'Training Loss',
        helper: 'Track the loss after every update. The line should trend down over time if the learning rate and gradients are behaving.',
        insight: ['One training step','1. Forward pass. 2. Compute loss. 3. Backprop. 4. Update weights. 5. Zero gradients. Repeat.']
      },
      footer: {
        text: 'Built from Andrej Karpathy\'s "The spelled-out intro to neural networks and backpropagation: building micrograd" lecture. Now you understand the math behind Part 1\'s training section at the code level.',
        links: ['Part 1: How LLMs Work','Part 2: How to Use LLMs','Source lecture']
      }
    },
    es: {
      nav: ['Inicio','Problema','Neurona','Capas','Paso adelante','Pérdida','Derivadas','Retropropagación','Descenso de gradiente'],
      hero: {
        badge: 'Parte 3 · Sin conocimientos previos',
        title: 'Redes neuronales<br><span>desde cero</span>',
        sub: 'La matemática, la intuición y el código detrás de cómo aprenden de verdad las redes neuronales: desde una sola neurona hasta un bucle de entrenamiento funcional. Basado en el tutorial micrograd de Andrej Karpathy.',
        stats: ['Conceptos','Líneas de Python','Demos','Fuente'],
        caveat: 'Complemento de <a href="../index.html" style="color:var(--accent)">Parte 1: Cómo funcionan los LLM</a>. Todos los conceptos y el código están trazados directamente a la charla micrograd de Karpathy.',
        twLabel: 'Idea central',
        twPrompt: 'P: ¿Qué demonios es una red neuronal?'
      },
      problem: {
        badge: 'Capítulo 1 · Motivación',
        title: 'El problema<br>que resolvemos',
        body: [
          'Antes de construir nada, entendamos qué estamos intentando hacer. Tenemos algunas entradas y queremos predecir una salida. Por ejemplo: dadas estas 4 medidas de una persona, predecir si le gustará una película.',
          'El reto: no conocemos la fórmula. No podemos escribir las reglas a mano. En su lugar, queremos un sistema que <span class="highlight">aprenda la fórmula a partir de ejemplos</span>, solo viendo muchos pares entrada/salida.',
          'Una red neuronal es ese sistema. Empieza siendo una función completamente aleatoria. Luego observa miles de ejemplos y se va ajustando, empujón pequeño a empujón pequeño, hasta que sus predicciones mejoran. A este proceso lo llamamos <span class="highlight-a">entrenamiento</span>.'
        ],
        insight: ['La conexión con la Parte 1','GPT hace exactamente esto, pero a una escala masiva. Sus "entradas" son tokens, su "salida" es el siguiente token, y se entrenó con 15 billones de ejemplos. La matemática es la misma que vamos a construir aquí. Solo que más grande.']
      },
      neuron: {
        badge: 'Capítulo 2 · La pieza básica',
        title: '¿Qué es<br>una neurona?',
        body: [
          'Una neurona es solo una pequeña función matemática. Piensa en ella como un <span class="highlight">regulador de intensidad</span>: toma varias entradas, decide cuánto importa cada una (los pesos), añade una inclinación por defecto (el bias) y comprime el resultado a un rango acotado.',
          'La fórmula: <span class="highlight-a">output = tanh(w₁·x₁ + w₂·x₂ + b)</span>',
          'Donde w₁ y w₂ son <span class="highlight">pesos</span> ("¿cuánto importa esta entrada?"), b es el <span class="highlight">bias</span> ("¿cuál es mi inclinación por defecto cuando las entradas son cero?"), y <span class="highlight-g">tanh</span> comprime el resultado para que siempre quede entre -1 y 1.'
        ],
        insight: ['¿Por qué tanh?','Sin una función de activación, apilar neuronas solo produce una función lineal, por muchas capas que añadas. tanh introduce no linealidad, que es lo que permite aprender patrones complejos.'],
        sub: 'Parque de la neurona',
        helper: 'Arrastra los sliders para cambiar los pesos y el bias. Mira cómo se actualiza en vivo la salida de la neurona. Entradas fijas: x₁ = 0.5, x₂ = −0.3.',
        labels: ['Peso 1','Peso 2','Bias']
      },
      layers: {
        badge: 'Capítulo 3 · Arquitectura',
        title: 'Capas y<br>el MLP',
        body: [
          'Una neurona no basta para aprender patrones complejos. Las agrupamos en <span class="highlight">capas</span>, y apilamos capas para formar un <span class="highlight-a">perceptrón multicapa (MLP)</span>. Piensa en ello como una cadena de montaje: la primera capa mira las entradas brutas, la siguiente mira lo que encontró la primera, y así sucesivamente.',
          'Cada conexión entre neuronas es un peso. Una red con 4 entradas → 3 neuronas → 1 salida tiene <span class="highlight">(4×3) + (3×1) = 15 pesos</span>, más bias. GPT-4 tiene la misma estructura, solo que con 405.000 millones de pesos.'
        ],
        sub: 'Arquitectura MLP',
        helper: 'Una red 4→3→1: 4 entradas, una capa oculta de 3 neuronas y 1 salida.',
        insight: ['Crear el modelo en una línea','n = <span class="fn">MLP</span>(<span class="nm">4</span>, [<span class="nm">3</span>, <span class="nm">1</span>])  <span class="co"># 4 entradas → 3 ocultas → 1 salida</span><br>Y ya está. Tenemos una red inicializada aleatoriamente con 4×3 + 3×1 = 15 pesos más 4 bias = 19 parámetros entrenables.']
      },
      forward: {
        badge: 'Capítulo 4 · Cálculo de la salida',
        title: 'El paso<br>adelante',
        body: [
          'El paso adelante es simplemente ejecutar los datos a través de la red de izquierda a derecha. Cada neurona dispara su salida, la pasa a la siguiente capa y al final obtenemos una predicción.',
          'Al principio, como los pesos son aleatorios, las predicciones no significan nada. Pero aun así podemos ejecutar el paso adelante: lo necesitamos para calcular cuánto nos equivocamos (§5), y eso nos dice cómo mejorar.'
        ],
        sub: 'Visualizador del paso adelante',
        helper: 'Haz clic en "Ejecutar paso adelante" para ver cómo fluye la información por una red 2→3→1. Cada nodo se ilumina con su valor calculado.'
      },
      loss: {
        badge: 'Capítulo 5 · Medir el error',
        title: 'Pérdida —<br>¿Cuánto nos equivocamos?',
        body: [
          'Tras el paso adelante tenemos predicciones. Ahora hay que medir cuánto se equivocan. La <span class="highlight">función de pérdida</span> es un informe: un único número que resume "lo mal que van ahora tus predicciones".',
          'Usamos <span class="highlight-a">error cuadrático medio (MSE)</span>: para cada ejemplo, elevamos al cuadrado la diferencia entre la predicción y el objetivo, y luego hacemos la media. Elevar al cuadrado garantiza que la pérdida siempre sea positiva y castiga más los errores grandes.',
          'El objetivo del entrenamiento: hacer que este número de pérdida sea lo más pequeño posible.'
        ],
        sub: 'Paisaje de pérdida',
        helper: 'La pérdida es una función de todos los pesos. Piensa en ello como un terreno montañoso: queremos hacer rodar la bola hasta el punto más bajo. Haz clic en "Step" para ejecutar una actualización de descenso de gradiente.',
        btn: 'Paso ↓',
        insight: ['Cómo leer la gráfica','El punto azul es la posición actual. La curva roja es el paisaje de pérdida. El descenso de gradiente empuja el punto cuesta abajo.']
      },
      derivatives: {
        badge: 'Capítulo 6 · La matemática del cambio',
        title: 'Derivadas —<br>¿Hacia dónde baja?',
        body: [
          'Queremos reducir la pérdida. Para ello necesitamos saber: para cada peso, ¿aumentarlo hace que la pérdida suba o baje? Eso es exactamente lo que nos dice una <span class="highlight">derivada</span>.',
          'Imagina que estás en una colina. No ves todo el paisaje, pero sí puedes notar hacia dónde baja tu pie. La derivada es esa "sensación": la pendiente de la pérdida en tu posición actual.',
          'Reglas clave que usaremos:'
        ],
        sub: 'Visualizador de derivadas',
        helper: 'Arrastra el punto a lo largo de f(x) = x². La línea tangente muestra la pendiente (derivada) en esa posición. Observa: en x=0 la pendiente es 0; se hace más pronunciada cuanto más te alejas del centro.',
        insight: ['Las dos reglas de derivación','Regla de la potencia: d(x²)/dx = 2x. Regla de la cadena: si un valor entra en otra función, los gradientes se multiplican a lo largo de la cadena.']
      },
      backprop: {
        badge: 'Capítulo 7 · Asignar la culpa',
        title: 'Retropropagación',
        body: [
          'Conocemos la pérdida. Conocemos las derivadas. Pero tenemos cientos de pesos: ¿cómo sabemos cuáles son los responsables y en qué medida?',
          '<span class="highlight">La retropropagación</span> lo resuelve de forma eficiente. Recorre el grafo de cálculo hacia atrás, desde la pérdida, pasando por cada operación, hasta llegar a cada peso, calculando el gradiente de cada uno usando la regla de la cadena.',
          'La idea clave de Karpathy: <em>"Lo único que hace la retropropagación es aplicar la regla de la cadena de forma recursiva."</em> Nada más. Es mecánico, no mágico.'
        ],
        sub: 'Grafo de expresiones',
        helper: 'Una expresión sencilla: e = tanh((a·b) + a). Haz clic en "Paso adelante" para calcular valores, luego en "Retropropagación" para ver cómo fluyen los gradientes hacia atrás.',
        insight: ['Por qué funciona','Cada derivada local se multiplica por el gradiente que llega desde el siguiente nodo. Eso hace que el cálculo sea manejable incluso en grafos enormes.']
      },
      gd: {
        badge: 'Capítulo 8 · Aprender',
        title: 'Descenso de gradiente —<br>el bucle de entrenamiento',
        body: [
          'Ya tenemos gradientes. Ahora los usamos. La regla de actualización es simple: para cada peso, muévete un pequeño paso en dirección opuesta a su gradiente. Opuesta porque el gradiente apunta cuesta arriba: nosotros queremos ir <em>cuesta abajo</em>.'
        ],
        sub: 'Pérdida durante el entrenamiento',
        helper: 'Seguimos la pérdida después de cada actualización. La línea debería tender hacia abajo con el tiempo si la tasa de aprendizaje y los gradientes se comportan bien.',
        insight: ['Un paso de entrenamiento','1. Paso adelante. 2. Calcular la pérdida. 3. Retropropagación. 4. Actualizar pesos. 5. Poner gradientes a cero. Repetir.']
      },
      footer: {
        text: 'Construido a partir de la charla de Andrej Karpathy sobre redes neuronales y retropropagación (micrograd). Ahora entiendes, a nivel de código, la matemática detrás de la sección de entrenamiento de la Parte 1.',
        links: ['Parte 1: Cómo funcionan los LLM','Parte 2: Cómo usar LLMs','Charla original']
      }
    }
  };

  const get = () => COPY[locale] || COPY.en;
  const q = s => document.querySelector(s);
  const qa = s => document.querySelectorAll(s);
  const setText = (s,v) => { const el = q(s); if (el) el.textContent = v; };
  const setHtml = (s,v) => { const el = q(s); if (el) el.innerHTML = v; };
  const resolvedTheme = () => theme !== 'system' ? theme : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const applyTheme = () => { document.documentElement.dataset.theme = resolvedTheme(); };

  function apply(){
    const c = get();
    document.documentElement.lang = locale;
    document.title = locale === 'es' ? 'Redes neuronales desde cero — Una inmersión visual' : 'Neural Networks from Scratch — A Visual Deep Dive';
    setText('.skip-link', locale === 'es' ? 'Ir al contenido principal' : 'Skip to main content');
    setAttr('.progress-bar','aria-label', locale === 'es' ? 'Progreso de lectura' : 'Reading progress');
    setAttr('.top-nav','aria-label', locale === 'es' ? 'Navegación por capítulos' : 'Chapter navigation');
    qa('.tnav-btn').forEach((el,i)=> el.textContent = c.nav[i] || el.textContent);
    qa('[data-locale]').forEach(btn => {
      const active = btn.dataset.locale === locale;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    qa('[data-theme]').forEach(btn => {
      const active = btn.dataset.theme === theme;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    setText('#s-intro .chapter-badge', c.hero.badge);
    setHtml('#s-intro .hero-title', c.hero.title);
    setHtml('#s-intro .hero-sub', c.hero.sub);
    qa('#s-intro .stat-lbl').forEach((el,i)=> el.textContent = c.hero.stats[i] || el.textContent);
    setHtml('#s-intro .stats-caveat', c.hero.caveat);
    setHtml('#s-intro .tw-label', c.hero.twLabel);
    setText('#s-intro .tw-prompt', c.hero.twPrompt);

    const sections = [
      ['#s-problem', c.problem],
      ['#s-neuron', c.neuron],
      ['#s-layers', c.layers],
      ['#s-forward', c.forward],
      ['#s-loss', c.loss],
      ['#s-derivatives', c.derivatives],
      ['#s-backprop', c.backprop],
      ['#s-gd', c.gd]
    ];
    sections.forEach(([sel,d])=>{
      setText(`${sel} .chapter-badge`, d.badge);
      setHtml(`${sel} .section-title`, d.title);
      qa(`${sel} .body-text`).forEach((el,i)=> { if (d.body && d.body[i]) el.innerHTML = d.body[i]; });
      qa(`${sel} .insight-box`).forEach((box,i)=>{
        const entry = d.insight || d.insights;
        if (!entry) return;
        if (Array.isArray(entry[0])) {
          const item = entry[i];
          if (item) box.innerHTML = `<strong>${item[0]}</strong>${item[1]}`;
        } else if (i === 0) {
          box.innerHTML = `<strong>${entry[0]}</strong>${entry[1]}`;
        } else if (entry[i]) {
          const item = entry[i];
          if (Array.isArray(item)) box.innerHTML = `<strong>${item[0]}</strong>${item[1]}`;
        }
      });
    });

    setText('#s-forward .sub-title', c.forward.sub);
    setText('#s-forward p.body-text[style*="margin-bottom:12px"]', c.forward.helper);
    setText('#fp-run-btn', locale === 'es' ? '▶ Ejecutar paso adelante' : '▶ Run Forward Pass');
    setText('#fp-reset-btn', locale === 'es' ? 'Reiniciar' : 'Reset');

    setText('#s-loss .sub-title', c.loss.sub);
    setText('#s-loss p.body-text[style*="margin-bottom:8px"]', c.loss.helper);
    setText('#loss-step-btn', c.loss.btn);
    setText('#loss-reset-btn', locale === 'es' ? 'Reiniciar' : 'Reset');

    setText('#s-derivatives .sub-title', c.derivatives.sub);
    setText('#s-derivatives p.body-text[style*="margin-bottom:8px"]', c.derivatives.helper);

    setText('#s-backprop .sub-title', c.backprop.sub);
    setText('#s-backprop p.body-text[style*="margin-bottom:8px"]', c.backprop.helper);
    setText('#graph-forward-btn', locale === 'es' ? '▶ Paso adelante' : '▶ Forward Pass');
    setText('#graph-back-btn', locale === 'es' ? '← Retropropagación' : '← Backprop');
    setText('#graph-reset-btn', locale === 'es' ? 'Reiniciar' : 'Reset');

    setText('#s-gd .sub-title', c.gd.sub);
    setText('#s-gd p.body-text[style*="max-width:680px"]', c.gd.helper);
    setHtml('#s-gd .insight-box', `<strong>${c.gd.insight[0]}</strong>${c.gd.insight[1]}`);

    // Footer
    const footerParas = qa('#s-gd .fade-up:last-of-type .body-text');
    if (footerParas[0]) footerParas[0].textContent = c.footer.text;
    const footerLinks = qa('section:last-of-type p:last-of-type a');
    footerLinks.forEach((el,i)=> { if (c.footer.links[i]) el.textContent = c.footer.links[i]; });

    window.NeuralNetworksI18n = { locale, copy: c };
    window.dispatchEvent(new CustomEvent('i18nchange', { detail: { locale, copy: c, page: 'neural-networks' } }));
    applyTheme();
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: resolvedTheme(), mode: theme, page: 'neural-networks' } }));
  }

  function setLocale(next){ if (COPY[next]) { locale = next; localStorage.setItem(STORAGE.locale,next); apply(); } }
  function setTheme(next){ if (['system','light','dark'].includes(next)) { theme = next; localStorage.setItem(STORAGE.theme,next); apply(); } }

  function setAttr(sel, attr, val){ const el = q(sel); if (el) el.setAttribute(attr,val); }

  window.addEventListener('DOMContentLoaded', () => {
    qa('[data-locale]').forEach(btn => btn.addEventListener('click', () => setLocale(btn.dataset.locale)));
    qa('[data-theme]').forEach(btn => btn.addEventListener('click', () => setTheme(btn.dataset.theme)));
    window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener?.('change', () => {
      if (theme === 'system') {
        applyTheme();
        window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: resolvedTheme(), mode: theme, page: 'neural-networks' } }));
      }
    });
    apply();
  });
})();
