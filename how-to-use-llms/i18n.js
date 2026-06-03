(function(){
  const STORAGE_KEYS = {
    locale: 'how-llms-locale',
    theme: 'how-llms-theme',
  };

  const COPY = {
    en: {
      typewriter: {
        messages: [
          "It has no memory of you, its knowledge is 6–12 months stale, and every answer is a probabilistic sample. Treat it like a brilliant intern — not an oracle.",
          "For timeless knowledge, skip web search — the weights are enough. For anything recent, time-sensitive, or esoteric — enable search or use Perplexity.",
          "Voice removes half the friction. Super Whisper can route ~50% of your queries hands-free. Switch to typing for product names and library names Whisper gets wrong.",
          "Thinking models (o1, o3) are for hard problems. They're slower and pricier — don't waste them on simple tasks. Claude Sonnet often beats o1 Pro on nuanced code."
        ]
      },
      thinking: {
        prompt: '"Prove that the sum of two odd numbers is always even."',
        question: 'Click Run to see extended thinking unfold',
        buttonIdle: '▶ Run demo',
        buttonAgain: '↺ Run again',
        statusReady: 'ready',
        statusThinking: 'thinking...',
        statusElapsed: 'thinking for {n}s...',
        statusDone: 'thought for {n}s',
        answerLabel: 'Answer',
        steps: [
          { icon: '🔍', text: 'Let me think about what it means for a number to be odd...' },
          { icon: '📐', text: 'An odd number can be written as 2k+1 for some integer k. Let me use that definition.' },
          { icon: '🔄', text: 'If I have two odd numbers: a = 2j+1 and b = 2k+1...' },
          { icon: '➕', text: 'Their sum: a + b = (2j+1) + (2k+1) = 2j + 2k + 2 = 2(j+k+1)' },
          { icon: '✓', text: 'Since j+k+1 is an integer, 2(j+k+1) is divisible by 2 — which is the definition of even.' },
        ],
        answer: 'Let two odd integers be a = 2j+1 and b = 2k+1. Then a+b = 2j+1 + 2k+1 = 2(j+k+1). Since j+k+1 ∈ ℤ, the sum is even. □',
      },
      research: {
        buttonIdle: '▶ Simulate',
        buttonRunning: 'Simulating...',
        buttonAgain: '↺ Simulate again',
        header: 'Deep Research Pipeline',
        stepTitles: ['Query Planning', 'Parallel Web Search', 'Extended Thinking', 'Report Generation'],
        stepDescs: [
          'Break the question into subtopics and parallel search queries',
          'Fetches 20–30 sources simultaneously across subtopics',
          'Reasons across sources, resolves conflicts, identifies gaps',
          'Structured report with citations, mechanisms, caveats',
        ],
        resultLabel: 'Example — Rapamycin & Longevity Research',
        resultContent: '27 sources · 5 min 12 sec · Covered: mTOR inhibition mechanism, worm/mouse/human trial data, safety profile, dosing considerations, ongoing clinical trials, researcher consensus...',
      },
      code: {
        buttonIdle: '▶ Run',
        buttonRunning: 'Running...',
        buttonAgain: '↺ Run again',
        prompt: '"Plot GDP growth for G7 countries from 1990–2023"',
        stepLabels: ['Writing code...', 'Executing Python...', 'Output'],
        caution: '⚠ Always verify: check the numbers match your actual source data before sharing',
      },
      agent: {
        buttonIdle: '▶ Animate loop',
        buttonAgain: '↺ Animate again',
      },
      labels: {
        language: 'Language',
        theme: 'Theme',
        languageOptions: { en: 'English', es: 'Spanish' },
        themeOptions: { system: 'System', light: 'Light', dark: 'Dark' },
      }
    },
    es: {
      typewriter: {
        messages: [
          'No tiene memoria de ti, su conocimiento suele estar 6–12 meses desfasado y cada respuesta es una muestra probabilística. Trátalo como a un becario brillante, no como a un oráculo.',
          'Para conocimiento atemporal, omite la búsqueda web: los pesos bastan. Para algo reciente, sensible al tiempo o muy raro, activa la búsqueda o usa Perplexity.',
          'La voz elimina buena parte de la fricción. Super Whisper puede gestionar ~50% de tus consultas sin manos. Cambia a texto para nombres de productos o librerías que Whisper traduzca mal.',
          'Los modelos de pensamiento (o1, o3) son para problemas difíciles. Son más lentos y caros: no los malgastes en tareas simples. Claude Sonnet suele superar a o1 Pro en código matizado.'
        ]
      },
      thinking: {
        prompt: '"Demuestra que la suma de dos números impares siempre es par."',
        question: 'Pulsa Ejecutar para ver cómo piensa paso a paso',
        buttonIdle: '▶ Ejecutar demo',
        buttonAgain: '↺ Ejecutar de nuevo',
        statusReady: 'listo',
        statusThinking: 'pensando...',
        statusElapsed: 'pensando durante {n}s...',
        statusDone: 'pensó durante {n}s',
        answerLabel: 'Respuesta',
        steps: [
          { icon: '🔍', text: 'Voy a pensar qué significa que un número sea impar...' },
          { icon: '📐', text: 'Un número impar puede escribirse como 2k+1 para algún entero k. Usaré esa definición.' },
          { icon: '🔄', text: 'Si tengo dos números impares: a = 2j+1 y b = 2k+1...' },
          { icon: '➕', text: 'Su suma: a + b = (2j+1) + (2k+1) = 2j + 2k + 2 = 2(j+k+1)' },
          { icon: '✓', text: 'Como j+k+1 es un entero, 2(j+k+1) es divisible por 2, que es justo la definición de par.' },
        ],
        answer: 'Sean dos enteros impares a = 2j+1 y b = 2k+1. Entonces a+b = 2j+1 + 2k+1 = 2(j+k+1). Como j+k+1 ∈ ℤ, la suma es par. □',
      },
      research: {
        buttonIdle: '▶ Simular',
        buttonRunning: 'Simulando...',
        buttonAgain: '↺ Simular de nuevo',
        header: 'Pipeline de Deep Research',
        stepTitles: ['Planificación de la consulta', 'Búsqueda web paralela', 'Pensamiento extendido', 'Generación del informe'],
        stepDescs: [
          'Divide la pregunta en subtemas y consultas de búsqueda en paralelo',
          'Recopila 20–30 fuentes simultáneamente entre varios subtemas',
          'Razona entre fuentes, resuelve conflictos e identifica huecos',
          'Informe estructurado con citas, mecanismos y advertencias',
        ],
        resultLabel: 'Ejemplo — Investigación sobre rapamicina y longevidad',
        resultContent: '27 fuentes · 5 min 12 s · Cubrió: mecanismo de inhibición de mTOR, datos en gusanos/ratones/humanos, perfil de seguridad, dosis, ensayos clínicos en curso y consenso investigador...',
      },
      code: {
        buttonIdle: '▶ Ejecutar',
        buttonRunning: 'Ejecutando...',
        buttonAgain: '↺ Ejecutar de nuevo',
        prompt: '"Dibuja el crecimiento del PIB del G7 entre 1990 y 2023"',
        stepLabels: ['Escribiendo código...', 'Ejecutando Python...', 'Resultado'],
        caution: '⚠ Verifica siempre: comprueba que los números coinciden con tu fuente antes de compartirlo',
      },
      agent: {
        buttonIdle: '▶ Animar ciclo',
        buttonAgain: '↺ Animar de nuevo',
      },
      labels: {
        language: 'Idioma',
        theme: 'Tema',
        languageOptions: { en: 'Inglés', es: 'Español' },
        themeOptions: { system: 'Sistema', light: 'Claro', dark: 'Oscuro' },
      }
    },
  };

  const DOM_TEXT = [
    { selector: 'title', html: { en: 'How to Use LLMs — A Practical Guide', es: 'Cómo usar LLMs — Guía práctica' } },
    { selector: '.skip-link', text: { en: 'Skip to main content', es: 'Ir al contenido principal' } },
    { selector: '.progress-bar', attr: 'aria-label', text: { en: 'Reading progress', es: 'Progreso de lectura' } },
    { selector: '.top-nav', attr: 'aria-label', text: { en: 'Chapter navigation', es: 'Navegación por capítulos' } },
    { selector: '.top-nav-brand', text: { en: '← Part 1', es: '← Parte 1' } },
    { selector: '.top-nav a[href="../neural-networks/index.html"]', text: { en: 'Part 3 →', es: 'Parte 3 →' } },
    { selector: '.tnav-btn[data-section="s-intro"]', text: { en: 'Intro', es: 'Inicio' } },
    { selector: '.tnav-btn[data-section="s-mental-model"]', text: { en: 'ZIP File', es: 'Archivo ZIP' } },
    { selector: '.tnav-btn[data-section="s-models"]', text: { en: 'Models', es: 'Modelos' } },
    { selector: '.tnav-btn[data-section="s-thinking"]', text: { en: 'Thinking', es: 'Pensamiento' } },
    { selector: '.tnav-btn[data-section="s-search"]', text: { en: 'Search', es: 'Búsqueda' } },
    { selector: '.tnav-btn[data-section="s-research"]', text: { en: 'Research', es: 'Investigación' } },
    { selector: '.tnav-btn[data-section="s-docs"]', text: { en: 'Docs', es: 'Docs' } },
    { selector: '.tnav-btn[data-section="s-code"]', text: { en: 'Code', es: 'Código' } },
    { selector: '.tnav-btn[data-section="s-agentic"]', text: { en: 'Agents', es: 'Agentes' } },
    { selector: '.tnav-btn[data-section="s-voice"]', text: { en: 'Voice', es: 'Voz' } },
    { selector: '.tnav-btn[data-section="s-vision"]', text: { en: 'Vision', es: 'Visión' } },
    { selector: '.tnav-btn[data-section="s-memory"]', text: { en: 'Memory', es: 'Memoria' } },
    { selector: '.tnav-btn[data-section="s-resources"]', text: { en: 'Resources', es: 'Recursos' } },
    { selector: '.tnav-btn[data-section="s-summary"]', text: { en: 'Summary', es: 'Resumen' } },
    { selector: '.top-nav-tools', attr: 'aria-label', text: { en: 'Language and theme controls', es: 'Controles de idioma y tema' } },
    { selector: '#language-select', attr: 'aria-label', text: { en: 'Language selector', es: 'Selector de idioma' } },
    { selector: '#theme-select', attr: 'aria-label', text: { en: 'Theme selector', es: 'Selector de tema' } },
    { selector: '#language-select option[value="en"]', text: { en: 'EN', es: 'EN' } },
    { selector: '#language-select option[value="es"]', text: { en: 'ES', es: 'ES' } },
    { selector: '#theme-select option[value="system"]', text: { en: 'Auto', es: 'Auto' } },
    { selector: '#theme-select option[value="light"]', text: { en: 'Light', es: 'Claro' } },
    { selector: '#theme-select option[value="dark"]', text: { en: 'Dark', es: 'Oscuro' } },

    { selector: '#s-intro .chapter-badge', text: { en: 'Part 2 · A Practical Guide', es: 'Parte 2 · Guía práctica' } },
    { selector: '#s-intro .hero-title', html: { en: 'How to Use<br><span>LLMs</span>', es: 'Cómo usar<br><span>LLMs</span>' } },
    { selector: '#s-intro .hero-sub', text: { en: 'Beyond the internals — a practical walkthrough of how to actually use large language models in your daily work. Based on Andrej Karpathy\'s follow-up to his LLM deep dive.', es: 'Más allá de la teoría: una guía práctica sobre cómo usar de verdad los modelos de lenguaje en tu trabajo diario. Basada en la segunda charla de Andrej Karpathy sobre LLMs.' } },
    { selector: '#s-intro .stat-item:nth-child(1) .stat-lbl', text: { en: 'Tools Covered', es: 'Herramientas' } },
    { selector: '#s-intro .stat-item:nth-child(2) .stat-lbl', text: { en: 'Use Cases', es: 'Casos de uso' } },
    { selector: '#s-intro .stat-item:nth-child(3) .stat-lbl', text: { en: 'Models', es: 'Modelos' } },
    { selector: '#s-intro .stat-item:nth-child(4) .stat-lbl', text: { en: 'Source', es: 'Fuente' } },
    { selector: '#s-intro .stats-caveat', html: { en: 'Companion to <a href="../index.html" style="color:var(--accent)">Part 1: How LLMs Work</a>. All content and examples traced directly to Karpathy\'s 2025 video.', es: 'Complemento de <a href="../index.html" style="color:var(--accent)">Parte 1: Cómo funcionan los LLMs</a>. Todo el contenido y los ejemplos están trazados directamente al vídeo de Karpathy de 2025.' } },
    { selector: '#s-intro .scroll-hint', text: { en: 'Scroll to explore', es: 'Desplázate para explorar' } },
    { selector: '#s-intro .tw-label', text: { en: 'Practical Tip', es: 'Consejo práctico' } },
    { selector: '#s-intro .tw-prompt', text: { en: 'Q: What should I know before using this?', es: 'P: ¿Qué debería saber antes de usar esto?' } },

    { selector: '#s-mental-model .chapter-badge', text: { en: 'Chapter 1 · Foundation', es: 'Capítulo 1 · Fundamento' } },
    { selector: '#s-mental-model .section-title', html: { en: 'You\'re Talking to<br><span>a ZIP File</span>', es: 'Estás hablando con<br><span>un archivo ZIP</span>' } },
    { selector: '#s-mental-model .body-text:nth-of-type(1)', html: { en: 'Karpathy\'s mental model: ChatGPT is a <span class="highlight">"one-tab ZIP file"</span> — a highly compressed snapshot of the internet. It read virtually every web page, book, and document up to its training cutoff, roughly 6–12 months ago. What comes back is a probabilistic recollection of that data.', es: 'El modelo mental de Karpathy: ChatGPT es un <span class="highlight">"archivo ZIP de una pestaña"</span> — una instantánea altamente comprimida de internet. Ha leído prácticamente cada página web, libro y documento hasta su fecha de corte de entrenamiento, hace aproximadamente 6–12 meses. Lo que devuelve es un recuerdo probabilístico de esos datos.' } },
    { selector: '#s-mental-model .body-text:nth-of-type(2)', html: { en: 'The <span class="highlight">context window</span> is its working memory — a finite tape of tokens it can see right now. Anything in it is directly accessible. Anything outside it doesn\'t exist for this conversation. There\'s no persistent memory between sessions unless you enable it.', es: 'La <span class="highlight">ventana de contexto</span> es su memoria de trabajo — una cinta finita de tokens que puede ver ahora mismo. Todo lo que está dentro es accesible directamente. Todo lo que queda fuera no existe para esta conversación. No hay memoria persistente entre sesiones salvo que la actives.' } },
    { selector: '#s-mental-model .body-text:nth-of-type(3)', text: { en: 'There\'s no live connection to the web by default. The model produces the most statistically likely continuation of your prompt — not a lookup, not a search, not a guarantee.', es: 'Por defecto no hay conexión en vivo a la web. El modelo produce la continuación estadísticamente más probable de tu prompt, no una consulta, no una búsqueda y tampoco una garantía.' } },
    { selector: '#s-mental-model .insight-box strong', text: { en: 'The Introduction', es: 'La introducción' } },
    { selector: '#s-mental-model .insight-box', html: { en: '<strong>The Introduction</strong> "Hi, I\'m ChatGPT. I\'m a one-tab ZIP file. My knowledge comes from reading the internet about 6 months ago. I only know what\'s in this conversation. Every word I generate is a probabilistic sample — treat it accordingly."', es: '<strong>La introducción</strong> "Hola, soy ChatGPT. Soy un archivo ZIP de una sola pestaña. Mi conocimiento proviene de leer internet hace unos 6 meses. Solo sé lo que está en esta conversación. Cada palabra que genero es una muestra probabilística: trátala en consecuencia."' } },
    { selector: '#s-mental-model .context-label', text: { en: 'Context Window · live working memory', es: 'Ventana de contexto · memoria de trabajo en vivo' } },
    { selector: '#s-mental-model .ctx-system', text: { en: 'system', es: 'sistema' } },
    { selector: '#s-mental-model .ctx-content:nth-of-type(1)', text: { en: 'You are a helpful assistant.', es: 'Eres un asistente útil.' } },
    { selector: '#s-mental-model .ctx-user:nth-of-type(1)', text: { en: 'user', es: 'usuario' } },
    { selector: '#s-mental-model .ctx-content:nth-of-type(2)', text: { en: 'How much caffeine is in an Americano?', es: '¿Cuánta cafeína tiene un americano?' } },
    { selector: '#s-mental-model .ctx-assistant', text: { en: 'assistant', es: 'asistente' } },
    { selector: '#s-mental-model .ctx-content:nth-of-type(3)', text: { en: 'About 63mg per shot...', es: 'Unos 63 mg por shot...' } },
    { selector: '#s-mental-model .ctx-user:nth-of-type(2)', text: { en: 'user', es: 'usuario' } },
    { selector: '#s-mental-model .ctx-content:nth-of-type(4)', text: { en: 'What about a double shot?', es: '¿Y un doble shot?' } },
    { selector: '#s-mental-model .context-note', text: { en: 'Everything above is visible to the model. The moment the window fills, old context falls off the edge and is gone.', es: 'Todo lo anterior es visible para el modelo. En el momento en que la ventana se llena, el contexto viejo cae por el borde y desaparece.' } },
    { selector: '#s-mental-model .insight-box:nth-of-type(2) strong', text: { en: 'Stale knowledge caveat', es: 'Advertencia sobre conocimiento desfasado' } },
    { selector: '#s-mental-model .insight-box:nth-of-type(2)', html: { en: '<strong>Stale knowledge caveat</strong> For timeless facts like caffeine content, the model\'s weights are reliable. For last month\'s news — they\'re not. Know the difference before trusting the answer.', es: '<strong>Advertencia sobre conocimiento desfasado</strong> Para hechos atemporales como la cafeína, los pesos del modelo son fiables. Para noticias del mes pasado, no lo son. Conviene distinguirlo antes de confiar en la respuesta.' } },

    { selector: '#s-models .chapter-badge', text: { en: 'Chapter 2 · Ecosystem', es: 'Capítulo 2 · Ecosistema' } },
    { selector: '#s-models .section-title', html: { en: 'Models &<br><span>Tiers</span>', es: 'Modelos y<br><span>niveles</span>' } },
    { selector: '#s-models .body-text', html: { en: 'ChatGPT is the "Original Gangster" — most features, most popular, most polished. But the ecosystem has exploded since 2022. Pick the right tool for the task.', es: 'ChatGPT es el "Original Gangster" — tiene más funciones, es el más popular y el más pulido. Pero el ecosistema ha explotado desde 2022. Elige la herramienta adecuada para cada tarea.' } },
    { selector: '#s-models .app-card:nth-child(1) .ac-desc', text: { en: 'The original. Most features: web search, deep research, code execution, advanced voice, image generation, memory. Karpathy\'s primary demo throughout.', es: 'El original. Más funciones: búsqueda web, Deep Research, ejecución de código, voz avanzada, generación de imágenes y memoria. La demo principal de Karpathy durante toda la charla.' } },
    { selector: '#s-models .app-card:nth-child(2) .ac-desc', text: { en: 'Exceptional at coding and document analysis. Powers Cursor (3.7 Sonnet) under the hood. Often outperforms on nuanced reasoning tasks.', es: 'Excepcional en programación y análisis de documentos. Impulsa Cursor (3.7 Sonnet) por debajo. A menudo supera en tareas de razonamiento matizadas.' } },
    { selector: '#s-models .app-card:nth-child(3) .ac-desc', text: { en: 'Google\'s entrant. Gemini 2.0 Pro experimental available. Deep integration with Google Workspace. Strong multimodal capabilities.', es: 'La apuesta de Google. Disponible Gemini 2.0 Pro experimental. Integración profunda con Google Workspace. Fuerte en capacidades multimodales.' } },
    { selector: '#s-models .app-card:nth-child(4) .ac-desc', text: { en: 'Search-first LLM. Always retrieves and cites sources. Karpathy demoed its Deep Research feature for the rapamycin research example.', es: 'LLM centrado en búsqueda. Siempre recupera y cita fuentes. Karpathy mostró su función Deep Research en el ejemplo de la rapamicina.' } },
    { selector: '#s-models .app-card:nth-child(5) .ac-desc', text: { en: 'French startup alternative. Mistral\'s consumer chat interface. Strong at European languages and code.', es: 'Alternativa de la startup francesa Mistral. Su interfaz de chat para consumidores. Fuerte en idiomas europeos y en código.' } },
    { selector: '#s-models .app-card:nth-child(6) .ac-desc', text: { en: 'Chinese AI lab. Surprisingly strong at code and reasoning. Different training approach from US labs — worth benchmarking.', es: 'Laboratorio chino de IA. Sorprendentemente fuerte en código y razonamiento. Un enfoque de entrenamiento distinto al de los laboratorios de EE. UU.: merece la pena compararlo.' } },
    { selector: '#s-models .insight-box strong', text: { en: 'Where to compare', es: 'Dónde comparar' } },
    { selector: '#s-models .insight-box', html: { en: '<strong>Where to compare</strong> <a href="https://lmarena.ai" target="_blank" rel="noopener" style="color:var(--accent)">LM Arena (lmarena.ai)</a> — formerly Chatbot Arena — maintains a live leaderboard ranked by human preference votes. It\'s the most reliable signal for "which model is actually better right now."', es: '<strong>Dónde comparar</strong> <a href="https://lmarena.ai" target="_blank" rel="noopener" style="color:var(--accent)">LM Arena (lmarena.ai)</a> — antes Chatbot Arena — mantiene una clasificación en vivo basada en votos de preferencia humana. Es la señal más fiable para saber "qué modelo es realmente mejor ahora mismo".' } },

    { selector: '#s-thinking .chapter-badge', text: { en: 'Chapter 3 · Reasoning', es: 'Capítulo 3 · Razonamiento' } },
    { selector: '#s-thinking .section-title', html: { en: 'Thinking<br><span>Models</span>', es: 'Modelos de<br><span>pensamiento</span>' } },
    { selector: '#s-thinking .body-text:nth-of-type(1)', html: { en: 'OpenAI\'s <span class="highlight">o1, o1 Pro, o3, and o3-mini</span> are a different breed — all model names starting with "o" are thinking models. Before returning an answer, they run an extended internal monologue: exploring approaches, backtracking, trying alternatives.', es: 'Los <span class="highlight">o1, o1 Pro, o3 y o3-mini</span> de OpenAI son otra especie: todos los modelos que empiezan por "o" son modelos de pensamiento. Antes de responder, ejecutan un monólogo interno extendido: exploran enfoques, retroceden y prueban alternativas.' } },
    { selector: '#s-thinking .body-text:nth-of-type(2)', html: { en: 'This emerged from reinforcement learning: the model discovered that deliberation strategies lead to better outcomes on hard problems. It tries different ideas, backtracks, checks its reasoning — much like the inner monologue you have when problem-solving.', es: 'Esto surgió del aprendizaje por refuerzo: el modelo descubrió que las estrategias de deliberación dan mejores resultados en problemas difíciles. Prueba ideas, retrocede y revisa su razonamiento, muy parecido al monólogo interno que tienes al resolver problemas.' } },
    { selector: '#s-thinking .body-text:nth-of-type(3)', html: { en: 'Karpathy noted that Claude 3.7 Sonnet (non-thinking) solved a hard coding problem that o1 Pro could not. Model selection isn\'t always obvious — the right tool depends on the specific task.', es: 'Karpathy señaló que Claude 3.7 Sonnet (no thinking) resolvió un problema de programación difícil que o1 Pro no pudo. Elegir modelo no siempre es obvio: la herramienta adecuada depende de la tarea concreta.' } },
    { selector: '#s-thinking .insight-box', html: { en: '<strong>When to use thinking models</strong> Hard math, complex multi-step code, formal reasoning, logic puzzles. Skip them for simple tasks — they\'re slower, more expensive, and deliberation helps less when there\'s nothing difficult to reason through.', es: '<strong>Cuándo usar modelos de pensamiento</strong> Matemáticas difíciles, código complejo de varios pasos, razonamiento formal y acertijos lógicos. Evítalos para tareas simples: son más lentos, más caros y deliberar ayuda menos cuando no hay nada realmente difícil que razonar.' } },
    { selector: '#s-thinking .thinking-badge', text: { en: 'o1 Pro · Extended Thinking', es: 'o1 Pro · Pensamiento extendido' } },
    { selector: '#s-thinking .thinking-demo > div:nth-of-type(2)', text: { en: '"Prove that the sum of two odd numbers is always even."', es: '"Demuestra que la suma de dos números impares siempre es par."' } },
    { selector: '#s-thinking .thinking-time', text: { en: 'ready', es: 'listo' } },
    { selector: '#s-thinking .thinking-steps > div', text: { en: 'Click Run to see extended thinking unfold', es: 'Pulsa Ejecutar para ver cómo piensa paso a paso' } },
    { selector: '#s-thinking .ta-label', text: { en: 'Answer', es: 'Respuesta' } },
    { selector: '#thinking-run-btn', text: { en: '▶ Run demo', es: '▶ Ejecutar demo' } },

    { selector: '#s-search .chapter-badge', text: { en: 'Chapter 4 · Information', es: 'Capítulo 4 · Información' } },
    { selector: '#s-search .section-title', html: { en: 'When to<br><span>Search</span>', es: 'Cuándo<br><span>buscar</span>' } },
    { selector: '#s-search .body-text:nth-of-type(1)', text: { en: 'By default the model runs on its weights alone — no internet, no live data. Enabling web search means it retrieves pages first, then synthesizes an answer. This costs latency but unlocks real-time information.', es: 'Por defecto el modelo funciona solo con sus pesos: sin internet y sin datos en vivo. Activar la búsqueda web significa que primero recupera páginas y luego sintetiza una respuesta. Eso añade latencia, pero desbloquea información en tiempo real.' } },
    { selector: '#s-search .body-text:nth-of-type(2)', html: { en: 'The key question: <em>is the model\'s stale recollection good enough?</em> For well-documented, timeless knowledge — yes. For anything time-sensitive, recent, or niche — enable search or use Perplexity.', es: 'La pregunta clave: <em>¿basta con el recuerdo desfasado del modelo?</em> Para conocimiento bien documentado y atemporal, sí. Para cualquier cosa sensible al tiempo, reciente o nicho, activa la búsqueda o usa Perplexity.' } },
    { selector: '#s-search .use-case-list li:nth-child(1) div', html: { en: '<strong>Skip search:</strong> "How much caffeine in an Americano?" — well-documented, timeless, model knows it', es: '<strong>Omitir búsqueda:</strong> "¿Cuánta cafeína tiene un americano?" — está bien documentado, es atemporal y el modelo lo conoce' } },
    { selector: '#s-search .use-case-list li:nth-child(2) div', html: { en: '<strong>Skip search:</strong> "Explain Rayleigh scattering" — textbook physics, no search needed', es: '<strong>Omitir búsqueda:</strong> "Explica la dispersión Rayleigh" — física de libro, no hace falta buscar' } },
    { selector: '#s-search .use-case-list li:nth-child(3) div', html: { en: '<strong>Use search:</strong> "When does White Lotus Season 3 air?" — time-sensitive, release dates change', es: '<strong>Usar búsqueda:</strong> "¿Cuándo se estrena la temporada 3 de White Lotus?" — depende del tiempo, las fechas cambian' } },
    { selector: '#s-search .use-case-list li:nth-child(4) div', html: { en: '<strong>Use search:</strong> "Is it safe to travel to Vietnam right now?" — current situation may differ from training', es: '<strong>Usar búsqueda:</strong> "¿Es seguro viajar a Vietnam ahora mismo?" — la situación actual puede diferir de lo aprendido' } },
    { selector: '#s-search .use-case-list li:nth-child(5) div', html: { en: '<strong>Use search:</strong> "What\'s the deal with recent USAID cuts?" — recent news, not in training data', es: '<strong>Usar búsqueda:</strong> "¿Qué pasa con los recortes recientes de USAID?" — noticias recientes, no están en el entrenamiento' } },
    { selector: '#s-search .use-case-list li:nth-child(6) div', html: { en: '<strong>Use search:</strong> "What toothpaste does [person] use?" — niche, possibly recent, esoteric', es: '<strong>Usar búsqueda:</strong> "¿Qué pasta de dientes usa [persona]?" — nicho, quizá reciente y muy específico' } },
    { selector: '#s-search .dt-title', text: { en: 'Should you enable web search?', es: '¿Deberías activar la búsqueda web?' } },
    { selector: '#s-search .dt-question', text: { en: 'Is this information time-sensitive or potentially outdated?', es: '¿Esta información depende del tiempo o puede estar desactualizada?' } },
    { selector: '#s-search .dt-no .dt-label', text: { en: 'No — timeless', es: 'No — atemporal' } },
    { selector: '#s-search .dt-yes .dt-label', text: { en: 'Yes — recent / changing', es: 'Sí — reciente / cambiante' } },
    { selector: '#s-search .insight-box', html: { en: '<strong>Perplexity vs ChatGPT search</strong> Perplexity always searches — it\'s search-first by design. ChatGPT\'s search is opt-in per message. For research-heavy workflows, Perplexity\'s default-on approach often saves the decision overhead.', es: '<strong>Perplexity frente a la búsqueda de ChatGPT</strong> Perplexity siempre busca: está diseñado como search-first. La búsqueda de ChatGPT se activa por mensaje. En flujos de trabajo intensivos en investigación, el enfoque por defecto de Perplexity suele ahorrarte decisiones.' } },
    { selector: '#s-search .dt-branches .dt-label', text: { en: 'No — timeless', es: 'No — atemporal' } },
    { selector: '#s-search .dt-branch.dt-yes .dt-label', text: { en: 'Yes — recent / changing', es: 'Sí — reciente / cambiante' } },

    { selector: '#s-research .chapter-badge', text: { en: 'Chapter 5 · Synthesis', es: 'Capítulo 5 · Síntesis' } },
    { selector: '#s-research .section-title', html: { en: 'Deep<br><span>Research</span>', es: 'Deep<br><span>Research</span>' } },
    { selector: '#s-research .body-text:nth-of-type(1)', html: { en: '<span class="highlight">Deep Research</span> = extended thinking + web search, run for 5–15 minutes. The model searches dozens of sources in parallel, reasons across them, and produces a structured report — work that would take a human researcher hours.', es: '<span class="highlight">Deep Research</span> = pensamiento extendido + búsqueda web, ejecutado durante 5–15 minutos. El modelo busca decenas de fuentes en paralelo, razona entre ellas y produce un informe estructurado, trabajo que a un investigador humano le llevaría horas.' } },
    { selector: '#s-research .body-text:nth-of-type(2)', text: { en: 'Karpathy\'s demo: researching rapamycin and longevity. The model looked at 27+ sources, thought for 5 minutes, and produced a report covering mechanism of action (mTOR inhibition), worm/mouse/human trial data, safety concerns, and ongoing studies.', es: 'La demo de Karpathy: investigar rapamicina y longevidad. El modelo consultó más de 27 fuentes, pensó durante 5 minutos y produjo un informe sobre el mecanismo de acción (inhibición de mTOR), datos en gusanos/ratones/humanos, preocupaciones de seguridad y estudios en curso.' } },
    { selector: '#s-research .body-text:nth-of-type(3)', html: { en: 'Both <strong>ChatGPT Deep Research</strong> (requires $200/mo Pro) and <strong>Perplexity</strong>\'s research mode offer this. For literature reviews, competitive analysis, and due diligence — it dramatically lowers the research bar.', es: 'Tanto <strong>ChatGPT Deep Research</strong> (requiere Pro de 200 $/mes) como el modo de investigación de <strong>Perplexity</strong> ofrecen esto. Para revisiones bibliográficas, análisis competitivo y due diligence, baja muchísimo la barrera de investigación.' } },
    { selector: '#s-research .insight-box', html: { en: '<strong>Best for</strong> Scientific literature surveys, competitive landscape analysis, due diligence on decisions, medical/legal research (with verification). Not worth it for simple factual questions.', es: '<strong>Ideal para</strong> Revisiones de literatura científica, análisis del panorama competitivo, due diligence para decisiones e investigación médica/legal (con verificación). No merece la pena para preguntas factuales simples.' } },
    { selector: '#s-research .rp-header > span', text: { en: 'Deep Research Pipeline', es: 'Pipeline de Deep Research' } },
    { selector: '#rp-run-btn', text: { en: '▶ Simulate', es: '▶ Simular' } },
    { selector: '#s-research .rp-result-label', text: { en: 'Example — Rapamycin & Longevity Research', es: 'Ejemplo — Investigación sobre rapamicina y longevidad' } },
    { selector: '#s-research .rp-result-content', text: { en: '27 sources · 5 min 12 sec · Covered: mTOR inhibition mechanism, worm/mouse/human trial data, safety profile, dosing considerations, ongoing clinical trials, researcher consensus...', es: '27 fuentes · 5 min 12 s · Cubrió: mecanismo de inhibición de mTOR, datos en gusanos/ratones/humanos, perfil de seguridad, dosis, ensayos clínicos en curso y consenso investigador...' } },

    { selector: '#s-docs .chapter-badge', text: { en: 'Chapter 6 · Reading', es: 'Capítulo 6 · Lectura' } },
    { selector: '#s-docs .section-title', html: { en: 'Docs &<br><span>Books</span>', es: 'Docs y<br><span>libros</span>' } },
    { selector: '#s-docs .body-text:nth-of-type(1)', text: { en: 'Attaching documents transforms the model into a reading assistant. Upload a PDF, paste a chapter, share a spreadsheet — then ask questions, request summaries, or generate conceptual diagrams from the content.', es: 'Adjuntar documentos transforma el modelo en un asistente de lectura. Sube un PDF, pega un capítulo, comparte una hoja de cálculo: luego pregunta, pide resúmenes o genera diagramas conceptuales a partir del contenido.' } },
    { selector: '#s-docs .body-text:nth-of-type(2)', html: { en: 'Karpathy\'s example: reading <em>The Wealth of Nations</em> with Claude. "I\'m attaching Chapter 3, Book 1 — please create a conceptual diagram of this chapter." Claude responds with <span class="highlight">Mermaid code</span>, a diagram markup language that renders as a graph connecting key concepts.', es: 'El ejemplo de Karpathy: leer <em>La riqueza de las naciones</em> con Claude. "Adjunto el capítulo 3, libro 1: por favor, crea un diagrama conceptual de este capítulo." Claude responde con <span class="highlight">código Mermaid</span>, un lenguaje de marcado de diagramas que se renderiza como un grafo que conecta conceptos clave.' } },
    { selector: '#s-docs .body-text:nth-of-type(3)', text: { en: 'For data, the model can write and run Python to generate charts. But treat it as a very junior data analyst — brilliant at writing the code, but it hallucinated a "1.7 trillion" figure in a chart Karpathy caught. Always scrutinize the numbers, not just the chart shape.', es: 'Para datos, el modelo puede escribir y ejecutar Python para generar gráficos. Pero trátalo como a un analista de datos muy junior: brillante escribiendo código, aunque Karpathy detectó que alucinó una cifra de "1.7 billones" en un gráfico. Revisa siempre los números, no solo la forma del gráfico.' } },
    { selector: '#s-docs .insight-box', html: { en: '<strong>Key workflow</strong> Attach document → request summary → drill into sections with Q&amp;A → ask for concept map (Mermaid) → verify any specific figures against the source.', es: '<strong>Flujo clave</strong> Adjunta el documento → pide un resumen → profundiza por secciones con preguntas y respuestas → solicita un mapa conceptual (Mermaid) → verifica cualquier cifra concreta contra la fuente.' } },
    { selector: '#s-docs .doc-msg-user:nth-of-type(1)', text: { en: 'Please create a conceptual diagram of this chapter', es: 'Por favor, crea un diagrama conceptual de este capítulo' } },
    { selector: '#s-docs .doc-msg-ai:nth-of-type(1)', text: { en: 'Rendered diagram showing how Smith argues market size constrains specialization — larger markets enable deeper division of labor.', es: 'Diagrama renderizado que muestra cómo Smith sostiene que el tamaño del mercado limita la especialización: mercados más grandes permiten una división del trabajo más profunda.' } },
    { selector: '#s-docs .doc-msg-user:nth-of-type(2)', text: { en: 'What implicit assumption is in node D?', es: '¿Qué supuesto implícito hay en el nodo D?' } },
    { selector: '#s-docs .doc-msg-ai:nth-of-type(2)', text: { en: 'Node D assumes that trade networks are legally and politically accessible — Smith\'s implicit premise that functioning exchange infrastructure already exists. He notes this precondition without arguing for it.', es: 'El nodo D asume que las redes comerciales son accesibles legal y políticamente: la premisa implícita de Smith de que ya existe una infraestructura de intercambio funcional. Señala esta condición previa sin argumentarla.' } },
    { selector: '#s-docs .dcb-label', text: { en: 'mermaid', es: 'mermaid' } },

    { selector: '#s-code .chapter-badge', text: { en: 'Chapter 7 · Data Analysis', es: 'Capítulo 7 · Análisis de datos' } },
    { selector: '#s-code .section-title', html: { en: 'Code<br><span>Execution</span>', es: 'Ejecución de<br><span>código</span>' } },
    { selector: '#s-code .body-text:nth-of-type(1)', html: { en: 'ChatGPT\'s <span class="highlight">Advanced Data Analysis</span> wires the model to a live Python runtime. You describe a task in plain language — it writes code, runs it, and shows you the result. No copy-paste, no local setup.', es: 'El <span class="highlight">Advanced Data Analysis</span> de ChatGPT conecta el modelo a un runtime de Python en vivo. Describes una tarea en lenguaje natural: escribe código, lo ejecuta y te muestra el resultado. Sin copiar y pegar, sin configuración local.' } },
    { selector: '#s-code .body-text:nth-of-type(2)', text: { en: 'This is the integration of language with computation. Arithmetic, statistics, data cleaning, chart generation — anything Python can do. Upload a CSV and ask for a trend analysis; get a matplotlib chart in seconds.', es: 'Esta es la integración del lenguaje con la computación. Aritmética, estadística, limpieza de datos, generación de gráficos: todo lo que Python puede hacer. Sube un CSV y pide un análisis de tendencias; obtendrás un gráfico de matplotlib en segundos.' } },
    { selector: '#s-code .body-text:nth-of-type(3)', text: { en: 'Karpathy\'s caution: he caught the model generating a chart with a hallucinated "1.7 trillion" instead of the correct value. The code ran fine; the number was wrong. Treat it like a very capable but unreliable junior — verify the figures, not just the output shape.', es: 'La advertencia de Karpathy: detectó al modelo generando un gráfico con un "1.7 billones" alucinado en lugar del valor correcto. El código funcionaba; el número estaba mal. Trátalo como a un junior muy capaz pero poco fiable: verifica las cifras, no solo la forma de la salida.' } },
    { selector: '#s-code .insight-box', html: { en: '<strong>The rule</strong> Use code execution when you need computation, transformation, or visualization. Always check: does the generated code match what you asked? Does the output look plausible against your source data?', es: '<strong>La regla</strong> Usa ejecución de código cuando necesites cálculo, transformación o visualización. Comprueba siempre: ¿el código generado coincide con lo que pediste? ¿La salida parece plausible comparada con tu fuente?' } },
    { selector: '#s-code .cd-prompt', text: { en: '"Plot GDP growth for G7 countries from 1990–2023"', es: '"Dibuja el crecimiento del PIB del G7 entre 1990 y 2023"' } },
    { selector: '#code-run-btn', text: { en: '▶ Run', es: '▶ Ejecutar' } },
    { selector: '#s-code .cd-step-label', text: { en: 'Writing code...', es: 'Escribiendo código...' } },
    { selector: '#s-code .cd-caution', text: { en: '⚠ Always verify: check the numbers match your actual source data before sharing', es: '⚠ Verifica siempre: comprueba que los números coinciden con tu fuente antes de compartirlo' } },

    { selector: '#s-agentic .chapter-badge', text: { en: 'Chapter 8 · Development', es: 'Capítulo 8 · Desarrollo' } },
    { selector: '#s-agentic .section-title', html: { en: 'Agentic<br><span>Coding</span>', es: 'Programación<br><span>agéntica</span>' } },
    { selector: '#s-agentic .body-text:nth-of-type(1)', html: { en: 'Beyond chat, a new class of tools integrates LLMs directly into your code editor. <span class="highlight">Cursor</span> and <span class="highlight">Windsurf</span> run Claude or GPT under the hood, operating autonomously across your entire codebase — reading files, writing code, running commands, and iterating.', es: 'Más allá del chat, una nueva clase de herramientas integra los LLM directamente en tu editor de código. <span class="highlight">Cursor</span> y <span class="highlight">Windsurf</span> ejecutan Claude o GPT por debajo, operando de forma autónoma sobre todo tu código: leen archivos, escriben código, ejecutan comandos e iteran.' } },
    { selector: '#s-agentic .body-text:nth-of-type(2)', text: { en: 'Cursor\'s Composer (⌘I) is an autonomous agent loop: describe a task, and it plans, writes files, runs shell commands, reads errors, and loops — asking your confirmation before any destructive action. Karpathy built a React app from scratch in a few minutes.', es: 'Composer de Cursor (⌘I) es un bucle de agente autónomo: describes una tarea y él planifica, escribe archivos, ejecuta comandos de shell, lee errores y vuelve a iterar, pidiéndote confirmación antes de cualquier acción destructiva. Karpathy construyó una app de React desde cero en pocos minutos.' } },
    { selector: '#s-agentic .body-text:nth-of-type(3)', text: { en: 'The model under the hood in Karpathy\'s setup: Claude 3.7 Sonnet. The key insight is that these tools are most powerful when you understand the model well enough to guide and correct it, not just prompt and hope.', es: 'El modelo debajo del capó en la configuración de Karpathy: Claude 3.7 Sonnet. La idea clave es que estas herramientas son más potentes cuando entiendes el modelo lo suficiente como para guiarlo y corregirlo, no solo para pedir y cruzar los dedos.' } },
    { selector: '#s-agentic .insight-box', html: { en: '<strong>Cursor keyboard shortcuts</strong> <code style="font-family:var(--dm);font-size:12px;background:var(--surface);padding:1px 5px;border-radius:3px;border:1px solid var(--border)">⌘K</code> inline edit &nbsp;·&nbsp; <code style="font-family:var(--dm);font-size:12px;background:var(--surface);padding:1px 5px;border-radius:3px;border:1px solid var(--border)">⌘L</code> chat sidebar &nbsp;·&nbsp; <code style="font-family:var(--dm);font-size:12px;background:var(--surface);padding:1px 5px;border-radius:3px;border:1px solid var(--border)">⌘I</code> Composer (agentic)', es: '<strong>Atajos de Cursor</strong> <code style="font-family:var(--dm);font-size:12px;background:var(--surface);padding:1px 5px;border-radius:3px;border:1px solid var(--border)">⌘K</code> edición en línea &nbsp;·&nbsp; <code style="font-family:var(--dm);font-size:12px;background:var(--surface);padding:1px 5px;border-radius:3px;border:1px solid var(--border)">⌘L</code> barra lateral de chat &nbsp;·&nbsp; <code style="font-family:var(--dm);font-size:12px;background:var(--surface);padding:1px 5px;border-radius:3px;border:1px solid var(--border)">⌘I</code> Composer (agéntico)' } },
    { selector: '#s-agentic .al-header', text: { en: 'Composer Agent Loop', es: 'Bucle del agente Composer' } },
    { selector: '#s-agentic .al-title:nth-of-type(1)', text: { en: 'Plan', es: 'Planificar' } },
    { selector: '#s-agentic .al-desc:nth-of-type(1)', text: { en: 'Break the task into file changes and shell commands', es: 'Divide la tarea en cambios de archivos y comandos de shell' } },
    { selector: '#s-agentic .al-title:nth-of-type(2)', text: { en: 'Generate', es: 'Generar' } },
    { selector: '#s-agentic .al-desc:nth-of-type(2)', text: { en: 'Write or edit source files across the codebase', es: 'Escribe o edita archivos fuente en todo el código' } },
    { selector: '#s-agentic .al-title:nth-of-type(3)', text: { en: 'Execute', es: 'Ejecutar' } },
    { selector: '#s-agentic .al-desc:nth-of-type(3)', text: { en: 'Run shell commands — asks your approval first', es: 'Ejecuta comandos de shell: primero pide tu aprobación' } },
    { selector: '#s-agentic .al-title:nth-of-type(4)', text: { en: 'Observe', es: 'Observar' } },
    { selector: '#s-agentic .al-desc:nth-of-type(4)', text: { en: 'Read output, catch errors, update its plan', es: 'Lee la salida, detecta errores y actualiza su plan' } },
    { selector: '#s-agentic .al-loop-arrow', text: { en: '↺ loops until done or stuck', es: '↺ itera hasta terminar o atascarse' } },
    { selector: '#al-run-btn', text: { en: '▶ Animate loop', es: '▶ Animar ciclo' } },

    { selector: '#s-voice .chapter-badge', text: { en: 'Chapter 9 · Multimodal', es: 'Capítulo 9 · Multimodal' } },
    { selector: '#s-voice .section-title', html: { en: 'Voice &<br><span>Audio</span>', es: 'Voz y<br><span>audio</span>' } },
    { selector: '#s-voice .body-text:nth-of-type(1)', html: { en: 'Karpathy routes roughly <span class="highlight">half his queries through voice</span> using Super Whisper — his pick among Super Whisper, WhisperFlow, and MacWhisper. Press a hotkey, speak, press again — query transcribed and sent. No typing, no friction.', es: 'Karpathy canaliza aproximadamente <span class="highlight">la mitad de sus consultas por voz</span> usando Super Whisper, su favorita entre Super Whisper, WhisperFlow y MacWhisper. Pulsas una tecla, hablas, vuelves a pulsar: la consulta se transcribe y se envía. Sin teclear, sin fricción.' } },
    { selector: '#s-voice .body-text:nth-of-type(2)', html: { en: 'ChatGPT\'s <span class="highlight">Advanced Voice Mode</span> goes further: audio tokens flow directly to and from the model, with no text transcription layer. The result feels genuinely conversational, not a text-to-speech wrapper.', es: 'El <span class="highlight">Advanced Voice Mode</span> de ChatGPT va más allá: los tokens de audio fluyen directamente hacia y desde el modelo, sin capa de transcripción. El resultado se siente realmente conversacional, no un simple envoltorio de texto a voz.' } },
    { selector: '#s-voice .body-text:nth-of-type(3)', html: { en: '<span class="highlight">NotebookLM</span> (Google) generates audio podcasts from your documents. Upload papers, books, or notes — it produces a two-host discussion. Karpathy uses it on walks and long drives for passive learning on topics outside his expertise.', es: '<span class="highlight">NotebookLM</span> (Google) genera podcasts de audio a partir de tus documentos. Sube artículos, libros o notas y produce una conversación de dos voces. Karpathy lo usa al caminar y en viajes largos para aprender pasivamente sobre temas fuera de su especialidad.' } },
    { selector: '#s-voice .insight-box', html: { en: '<strong>Voice tip from Karpathy</strong> For queries with product names, library names, or technical terms — switch to typing. Whisper often mistranscribes niche technical vocabulary. Voice is best for natural-language questions.', es: '<strong>Consejo de voz de Karpathy</strong> Para consultas con nombres de productos, librerías o términos técnicos, cambia a escritura. Whisper suele transcribir mal el vocabulario técnico de nicho. La voz es mejor para preguntas en lenguaje natural.' } },

    { selector: '#s-vision .chapter-badge', text: { en: 'Chapter 10 · Visual Input', es: 'Capítulo 10 · Entrada visual' } },
    { selector: '#s-vision .section-title', html: { en: 'Vision &<br><span>Camera</span>', es: 'Visión y<br><span>cámara</span>' } },
    { selector: '#s-vision .body-text:nth-of-type(1)', text: { en: 'Modern LLMs accept images as input — photos, screenshots, scans, diagrams. The model reasons about visual content as fluently as it reasons about text, drawing on training data that included billions of image-text pairs.', es: 'Los LLM modernos aceptan imágenes como entrada: fotos, capturas, escaneos y diagramas. El modelo razona sobre contenido visual con la misma fluidez con la que razona sobre texto, apoyándose en entrenamiento que incluyó miles de millones de pares imagen-texto.' } },
    { selector: '#s-vision .body-text:nth-of-type(2)', html: { en: 'Karpathy\'s examples: uploading a <span class="highlight">blood test scan</span> for interpretation, pointing a camera at an <span class="highlight">Aeronet 4 CO2 monitor</span> to identify the device and interpret the 713 PPM reading, and showing a <span class="highlight">Lord of the Rings map</span> which it correctly identified as Middle-Earth.', es: 'Los ejemplos de Karpathy: subir un <span class="highlight">análisis de sangre</span> para interpretarlo, apuntar una cámara a un monitor <span class="highlight">Aeronet 4 de CO2</span> para identificar el dispositivo e interpretar la lectura de 713 PPM, y mostrar un <span class="highlight">mapa de El Señor de los Anillos</span>, que identificó correctamente como la Tierra Media.' } },
    { selector: '#s-vision .body-text:nth-of-type(3)', text: { en: 'Vision is most reliable for well-documented subjects — blood test reference ranges, common consumer devices, famous maps — where training data covers the domain thoroughly. For proprietary or rare objects, expect more hallucination.', es: 'La visión es más fiable en temas bien documentados — rangos de análisis de sangre, dispositivos de consumo comunes, mapas famosos — donde los datos de entrenamiento cubren bien el dominio. Para objetos propietarios o raros, espera más alucinaciones.' } },
    { selector: '#s-vision .insight-box', html: { en: '<strong>Strong vision use cases</strong> Identifying unknown objects, interpreting standard lab results, explaining charts and diagrams, OCR on printed text, reading handwriting, and analyzing screenshots.', es: '<strong>Casos fuertes de visión</strong> Identificar objetos desconocidos, interpretar resultados de laboratorio estándar, explicar gráficos y diagramas, hacer OCR sobre texto impreso, leer escritura a mano y analizar capturas de pantalla.' } },

    { selector: '#s-memory .chapter-badge', text: { en: 'Chapter 11 · Personalization', es: 'Capítulo 11 · Personalización' } },
    { selector: '#s-memory .section-title', html: { en: 'Memory &<br><span>Personalization</span>', es: 'Memoria y<br><span>personalización</span>' } },
    { selector: '#s-memory .body-text:nth-of-type(1)', html: { en: 'By default, every conversation is stateless — the model forgets everything when the tab closes. Two features change this: <span class="highlight">Memory</span> (ChatGPT auto-saves facts about you across sessions) and <span class="highlight">Custom Instructions</span> (a persistent system prompt shaping every response).', es: 'Por defecto, cada conversación es sin estado: el modelo lo olvida todo cuando cierras la pestaña. Dos funciones cambian esto: <span class="highlight">Memory</span> (ChatGPT guarda automáticamente hechos sobre ti entre sesiones) y <span class="highlight">Instrucciones personalizadas</span> (un prompt del sistema persistente que moldea cada respuesta).' } },
    { selector: '#s-memory .body-text:nth-of-type(2)', text: { en: 'Karpathy\'s custom instructions: request educational framing ("be educational whenever you can"), set Korean language formality register for language learning, and share context about his work and interests.', es: 'Las instrucciones personalizadas de Karpathy: pedir un enfoque educativo ("be educational whenever you can"), fijar el registro formal del coreano para aprender idiomas y compartir contexto sobre su trabajo e intereses.' } },
    { selector: '#s-memory .body-text:nth-of-type(3)', text: { en: 'Think of custom instructions as your personal system prompt — it loads before every conversation. Good instructions compress preferences you\'d otherwise repeat on every query, making each session feel like it already knows you.', es: 'Piensa en las instrucciones personalizadas como tu prompt del sistema personal: se cargan antes de cada conversación. Las buenas instrucciones comprimen preferencias que de otro modo repetirías en cada consulta, haciendo que cada sesión sienta que ya te conoce.' } },
    { selector: '#s-memory .insight-box', html: { en: '<strong>Starter custom instructions</strong> "Be concise. Prefer code over prose when both work. When I give you a document, start with a one-paragraph summary. Flag your assumptions explicitly. I work in [your field]."', es: '<strong>Instrucciones personalizadas de inicio</strong> "Sé conciso. Prefiere código frente a prosa cuando ambas opciones funcionen. Cuando te dé un documento, empieza con un resumen de un párrafo. Señala explícitamente tus supuestos. Trabajo en [tu sector]."' } },
    { selector: '#s-memory .mp-header', text: { en: 'Custom Instructions · ChatGPT', es: 'Instrucciones personalizadas · ChatGPT' } },
    { selector: '#s-memory .mp-section:nth-of-type(1) .mp-section-label', text: { en: 'What should ChatGPT know about you?', es: '¿Qué debería saber ChatGPT sobre ti?' } },
    { selector: '#s-memory .mp-content:nth-of-type(1)', text: { en: "I'm a software engineer interested in ML. I prefer concise, technical answers. I'm learning Korean — when providing Korean text, use polite-formal register (합쇼체) by default.", es: 'Soy ingeniero de software y me interesa el ML. Prefiero respuestas concisas y técnicas. Estoy aprendiendo coreano: cuando des texto en coreano, usa por defecto el registro formal-polite (합쇼체).' } },
    { selector: '#s-memory .mp-section:nth-of-type(2) .mp-section-label', text: { en: 'How should ChatGPT respond?', es: '¿Cómo debería responder ChatGPT?' } },
    { selector: '#s-memory .mp-content:nth-of-type(2)', text: { en: 'Be educational when explaining concepts. Lead with the most important information first. Use code snippets liberally. Flag any assumptions you make explicitly.', es: 'Sé educativo al explicar conceptos. Empieza por lo más importante. Usa fragmentos de código con generosidad. Señala explícitamente cualquier supuesto que hagas.' } },
    { selector: '#s-memory .mp-memory-header', text: { en: 'Memory · auto-saved across sessions', es: 'Memoria · se guarda automáticamente entre sesiones' } },
    { selector: '#s-memory .mp-memory-item:nth-of-type(1)', text: { en: 'User prefers bullet lists for multi-step summaries', es: 'El usuario prefiere listas con viñetas para resúmenes de varios pasos' } },
    { selector: '#s-memory .mp-memory-item:nth-of-type(2)', text: { en: 'User monitors indoor CO2 levels at home', es: 'El usuario controla los niveles de CO2 interior en casa' } },
    { selector: '#s-memory .mp-memory-item:nth-of-type(3)', text: { en: 'User is learning Korean, wants 합쇼체 register', es: 'El usuario está aprendiendo coreano y quiere el registro 합쇼체' } },
    { selector: '#s-memory .mp-memory-add', text: { en: '+ saved memories accumulate over time', es: '+ las memorias guardadas se acumulan con el tiempo' } },

    { selector: '#s-resources .chapter-badge', text: { en: 'Chapter 12 · Reference', es: 'Capítulo 12 · Referencia' } },
    { selector: '#s-resources .section-title', html: { en: 'Tools &<br><span>Resources</span>', es: 'Herramientas y<br><span>recursos</span>' } },
    { selector: '#s-resources > .section-inner > .fade-up .body-text', text: { en: 'Every tool, model, and resource mentioned in Karpathy\'s lecture — linked and categorized.', es: 'Todas las herramientas, modelos y recursos mencionados en la charla de Karpathy, enlazados y categorizados.' } },
    { selector: '#s-resources .resource-category:nth-of-type(1) .rc-label', text: { en: 'LLM Apps', es: 'Apps de LLM' } },
    { selector: '#s-resources .resource-category:nth-of-type(2) .rc-label', text: { en: 'Developer & Power-User Tools', es: 'Herramientas para desarrolladores y power users' } },
    { selector: '#s-resources .resource-category:nth-of-type(3) .rc-label', text: { en: 'Reference & Further Reading', es: 'Referencia y lectura adicional' } },
    { selector: '#s-resources .resource-card:nth-child(1) .rcard-desc', text: { en: 'The original. Most features: web search, deep research, code execution, voice, vision, memory. Karpathy\'s primary demo throughout.', es: 'El original. Más funciones: búsqueda web, Deep Research, ejecución de código, voz, visión y memoria. La demo principal de Karpathy durante toda la charla.' } },
    { selector: '#s-resources .resource-card:nth-child(2) .rcard-desc', text: { en: 'Exceptional at coding and document analysis. Powers Cursor (Claude 3.7 Sonnet). Strong nuanced reasoning.', es: 'Excepcional en programación y análisis de documentos. Impulsa Cursor (Claude 3.7 Sonnet). Fuerte en razonamiento matizado.' } },
    { selector: '#s-resources .resource-card:nth-child(3) .rcard-desc', text: { en: 'Google\'s LLM app. Gemini 2.0 Pro experimental. Deep Google Workspace integration and strong multimodal.', es: 'La app de LLM de Google. Gemini 2.0 Pro experimental. Integración profunda con Google Workspace y gran fortaleza multimodal.' } },
    { selector: '#s-resources .resource-card:nth-child(4) .rcard-desc', text: { en: 'Search-first LLM — always retrieves and cites sources. Karpathy demoed its Deep Research feature. Great default for research.', es: 'LLM search-first: siempre recupera y cita fuentes. Karpathy mostró su función Deep Research. Muy buena opción por defecto para investigación.' } },
    { selector: '#s-resources .resource-card:nth-child(5) .rcard-desc', text: { en: 'French startup alternative. Mistral\'s consumer chat interface. Strong at European languages and code.', es: 'Alternativa de la startup francesa Mistral. Su interfaz de chat para consumidores. Fuerte en idiomas europeos y código.' } },
    { selector: '#s-resources .resource-card:nth-child(6) .rcard-desc', text: { en: 'Chinese AI lab with surprisingly strong code and reasoning. Different training methodology — worth benchmarking against US labs.', es: 'Laboratorio chino de IA con un código y razonamiento sorprendentemente fuertes. Metodología de entrenamiento distinta: merece compararse con los laboratorios de EE. UU.' } },
    { selector: '#s-resources .resource-card:nth-child(7) .rcard-desc', text: { en: 'Karpathy\'s coding IDE of choice. Agentic Composer mode (⌘I) runs Claude 3.7 Sonnet across your entire codebase autonomously.', es: 'El IDE de programación favorito de Karpathy. El modo agente Composer (⌘I) ejecuta Claude 3.7 Sonnet sobre todo tu código de forma autónoma.' } },
    { selector: '#s-resources .resource-card:nth-child(8) .rcard-desc', text: { en: 'VS Code-based agentic coding IDE. Cursor alternative — mentioned alongside Cursor and VS Code as the main options.', es: 'IDE de programación agéntica basado en VS Code. Alternativa a Cursor: mencionado junto a Cursor y VS Code como las opciones principales.' } },
    { selector: '#s-resources .resource-card:nth-child(9) .rcard-desc', text: { en: 'Karpathy\'s voice input tool of choice. Global hotkey → record → auto-transcribe → paste. Handles ~half his queries.', es: 'La herramienta de entrada por voz preferida de Karpathy. Tecla global → grabar → transcribir automáticamente → pegar. Maneja aproximadamente la mitad de sus consultas.' } },
    { selector: '#s-resources .resource-card:nth-child(10) .rcard-desc', text: { en: 'Generate two-host audio podcast discussions from any documents. Karpathy uses for passive learning on walks and drives.', es: 'Genera podcasts de audio con dos voces a partir de cualquier documento. Karpathy lo usa para aprender pasivamente mientras camina o conduce.' } },
    { selector: '#s-resources .resource-card:nth-child(11) .rcard-desc', text: { en: 'Image generation tool. Used for several images in the lecture as an alternative to DALL-E.', es: 'Herramienta de generación de imágenes. Se usó para varias imágenes de la charla como alternativa a DALL-E.' } },
    { selector: '#s-resources .resource-card:nth-child(12) .rcard-desc', text: { en: 'Diagram-from-code library. When you ask Claude for a "conceptual diagram," it often produces Mermaid markup that renders as a graph.', es: 'Librería para generar diagramas a partir de código. Cuando pides a Claude un "diagrama conceptual", a menudo produce marcado Mermaid que se renderiza como un grafo.' } },
    { selector: '#s-resources .resource-card:nth-child(13) .rcard-desc', text: { en: 'Live model leaderboard ranked by human preference votes (Chatbot Arena). Best signal for "which model is actually better right now."', es: 'Clasificación en vivo de modelos basada en votos de preferencia humana (Chatbot Arena). La mejor señal para saber "qué modelo es realmente mejor ahora mismo".' } },
    { selector: '#s-resources .resource-card:nth-child(14) .rcard-desc', text: { en: 'Free public-domain books in plain text. Karpathy used it to get The Wealth of Nations for LLM document analysis demos.', es: 'Libros de dominio público gratis en texto plano. Karpathy lo usó para obtener La riqueza de las naciones para las demos de análisis de documentos.' } },
    { selector: '#s-resources .resource-card:nth-child(15) .rcard-desc', text: { en: 'The companion video covering LLM internals — training, tokenization, transformer architecture, post-training, and RLHF.', es: 'El vídeo complementario que cubre el interior de los LLM: entrenamiento, tokenización, arquitectura Transformer, postentrenamiento y RLHF.' } },
    { selector: '#s-resources .resource-card:nth-child(16) .rcard-desc', text: { en: 'The source video for this guide. Practical walkthrough of Karpathy\'s full LLM workflow with live demos of every tool.', es: 'El vídeo fuente de esta guía. Recorrido práctico por todo el flujo de trabajo de Karpathy con LLM y demos en vivo de cada herramienta.' } },

    { selector: '#s-summary .chapter-badge', text: { en: 'Chapter 13 · Summary', es: 'Capítulo 13 · Resumen' } },
    { selector: '#s-summary .section-title', html: { en: 'Key<br><span>Takeaways</span>', es: 'Ideas<br><span>clave</span>' } },
    { selector: '#s-summary .ps-title:nth-of-type(1)', text: { en: 'You\'re talking to a ZIP file', es: 'Estás hablando con un archivo ZIP' } },
    { selector: '#s-summary .ps-desc:nth-of-type(1)', text: { en: 'The model compressed the internet into weights. Knowledge is ~6–12 months stale, output is probabilistic, and it has no working memory outside the context window. It cannot verify its own answers.', es: 'El modelo comprimió internet en pesos. Su conocimiento tiene ~6–12 meses de desfase, la salida es probabilística y no tiene memoria de trabajo fuera de la ventana de contexto. No puede verificar sus propias respuestas.' } },
    { selector: '#s-summary .ps-title:nth-of-type(2)', text: { en: 'Know your tier and model', es: 'Conoce tu nivel y tu modelo' } },
    { selector: '#s-summary .ps-desc:nth-of-type(2)', text: { en: 'Free → limited. $20/mo → GPT-4o / Claude Sonnet. $200/mo → o1 Pro, Deep Research. Match the model to the task — thinking models for hard reasoning, fast models for simple queries.', es: 'Gratis → limitado. 20 $/mes → GPT-4o / Claude Sonnet. 200 $/mes → o1 Pro, Deep Research. Ajusta el modelo a la tarea: modelos de pensamiento para razonamiento duro y modelos rápidos para consultas simples.' } },
    { selector: '#s-summary .ps-title:nth-of-type(3)', text: { en: 'Search for time-sensitive info only', es: 'Busca solo información sensible al tiempo' } },
    { selector: '#s-summary .ps-desc:nth-of-type(3)', text: { en: 'For timeless, well-documented knowledge — the weights are enough, skip search. For recent events, changing situations, or niche topics — enable search or use Perplexity.', es: 'Para conocimiento atemporal y bien documentado, los pesos bastan: omite la búsqueda. Para eventos recientes, situaciones cambiantes o temas de nicho, activa la búsqueda o usa Perplexity.' } },
    { selector: '#s-summary .ps-title:nth-of-type(4)', text: { en: 'Deep Research for multi-source synthesis', es: 'Deep Research para síntesis multi-fuente' } },
    { selector: '#s-summary .ps-desc:nth-of-type(4)', text: { en: '5–15 minutes, 20–30 sources, structured report. Genuinely useful for literature reviews and due diligence. Currently behind the $200/mo paywall on ChatGPT; Perplexity is cheaper.', es: '5–15 minutos, 20–30 fuentes, informe estructurado. Realmente útil para revisiones bibliográficas y due diligence. Ahora mismo está tras el muro de pago de 200 $/mes de ChatGPT; Perplexity es más barato.' } },
    { selector: '#s-summary .ps-title:nth-of-type(5)', text: { en: 'Verify code and data output', es: 'Verifica el código y la salida de datos' } },
    { selector: '#s-summary .ps-desc:nth-of-type(5)', text: { en: 'Advanced Data Analysis runs real Python — but the model can hallucinate values in the code it writes. Check the numbers against your source data, not just the chart\'s visual shape.', es: 'Advanced Data Analysis ejecuta Python real, pero el modelo puede alucinar valores en el código que escribe. Comprueba los números contra tu fuente, no solo la forma visual del gráfico.' } },
    { selector: '#s-summary .ps-title:nth-of-type(6)', text: { en: 'Voice removes half the friction', es: 'La voz elimina la mitad de la fricción' } },
    { selector: '#s-summary .ps-desc:nth-of-type(6)', text: { en: 'A Whisper-based dictation tool eliminates the typing barrier. Karpathy routes ~50% of queries through voice. Use text for technical product names and library names that Whisper mistranscribes.', es: 'Una herramienta de dictado basada en Whisper elimina la barrera de teclear. Karpathy canaliza alrededor del 50% de sus consultas por voz. Usa texto para nombres técnicos de productos y librerías que Whisper suele transcribir mal.' } },
    { selector: '#s-summary .ps-title:nth-of-type(7)', text: { en: 'ChatGPT is the default — for now', es: 'ChatGPT es el valor por defecto, por ahora' } },
    { selector: '#s-summary .ps-desc:nth-of-type(7)', text: { en: 'Most features, largest ecosystem, most polished UX. Claude for coding. Perplexity for search-first. The landscape shifts quickly — check LM Arena for current rankings before committing.', es: 'Más funciones, ecosistema más grande y UX más pulida. Claude para código. Perplexity para búsqueda primero. El panorama cambia rápido: mira LM Arena para ver las clasificaciones actuales antes de comprometerte.' } },
    { selector: '#s-summary .fade-up:last-of-type .body-text', text: { en: 'Built from Andrej Karpathy\'s "How I use LLMs" lecture. All content, examples, and framings traced directly to that source. Interactive visualizations built with AI assistance.', es: 'Construido a partir de la charla "How I use LLMs" de Andrej Karpathy. Todo el contenido, ejemplos y enfoques están trazados directamente a esa fuente. Las visualizaciones interactivas se hicieron con ayuda de IA.' } },
    { selector: '#s-summary .fade-up:last-of-type a[href="../index.html"]', text: { en: '← Part 1: How LLMs Work', es: '← Parte 1: Cómo funcionan los LLMs' } },
    { selector: '#s-summary .fade-up:last-of-type a[href="transcript.html"]', text: { en: 'Full transcript', es: 'Transcripción completa' } },
    { selector: '#s-summary .fade-up:last-of-type a[href="https://github.com/ynarwal/how-llms-work"]', text: { en: 'GitHub', es: 'GitHub' } },
  ];

  const browserLocale = (navigator.language || 'en').toLowerCase();
  let locale = localStorage.getItem(STORAGE_KEYS.locale) || (browserLocale.startsWith('es') ? 'es' : 'en');
  let theme = localStorage.getItem(STORAGE_KEYS.theme) || 'system';
  const listeners = new Set();

  function getResolvedTheme() {
    if (theme !== 'system') return theme;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function getCopy() {
    return COPY[locale] || COPY.en;
  }

  function setText(selector, value) {
    const el = document.querySelector(selector);
    if (el) el.textContent = value;
  }

  function setHtml(selector, value) {
    const el = document.querySelector(selector);
    if (el) el.innerHTML = value;
  }

  function setAttr(selector, attr, value) {
    const el = document.querySelector(selector);
    if (el) el.setAttribute(attr, value);
  }

  function applyStaticText() {
    const copy = getCopy();
    document.documentElement.lang = locale;
    document.title = DOM_TEXT[0].html[locale];
    DOM_TEXT.slice(1).forEach(item => {
      const value = item.html ? item.html[locale] : item.text[locale];
      if (!value) return;
      if (item.attr) {
        setAttr(item.selector, item.attr, value);
      } else if (item.html) {
        setHtml(item.selector, value);
      } else {
        setText(item.selector, value);
      }
    });

    setText('#s-intro .stat-item:nth-child(1) .stat-lbl', copy.labels?.toolsCovered || (locale === 'es' ? 'Herramientas' : 'Tools Covered'));
    setText('#s-intro .stat-item:nth-child(2) .stat-lbl', locale === 'es' ? 'Casos de uso' : 'Use Cases');
    setText('#s-intro .stat-item:nth-child(3) .stat-lbl', locale === 'es' ? 'Modelos' : 'Models');
    setText('#s-intro .stat-item:nth-child(4) .stat-lbl', locale === 'es' ? 'Fuente' : 'Source');
    setHtml('#s-intro .scroll-hint', locale === 'es'
      ? '<div class="scroll-arrow"></div>Desplázate para explorar'
      : '<div class="scroll-arrow"></div>Scroll to explore');

    document.querySelectorAll('[data-locale]').forEach(btn => {
      const active = btn.dataset.locale === locale;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    document.querySelectorAll('[data-theme]').forEach(btn => {
      const active = btn.dataset.theme === theme;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    document.querySelectorAll('.top-nav-tools').forEach(el => {
      el.setAttribute('aria-label', locale === 'es' ? 'Controles de idioma y tema' : 'Language and theme controls');
    });

    const summaryLinks = document.querySelectorAll('#s-summary .fade-up:last-of-type a');
    if (summaryLinks[0]) summaryLinks[0].textContent = locale === 'es' ? '← Parte 1: Cómo funcionan los LLMs' : '← Part 1: How LLMs Work';
    if (summaryLinks[1]) summaryLinks[1].textContent = locale === 'es' ? 'Transcripción completa' : 'Full transcript';
    if (summaryLinks[2]) summaryLinks[2].textContent = 'GitHub';

    const footerBody = document.querySelector('#s-summary .fade-up:last-of-type .body-text');
    if (footerBody) {
      footerBody.innerHTML = locale === 'es'
        ? 'Construido a partir de la charla "How I use LLMs" de Andrej Karpathy. Todo el contenido, ejemplos y enfoques están trazados directamente a esa fuente. Las visualizaciones interactivas se hicieron con ayuda de IA.'
        : 'Built from Andrej Karpathy\'s "How I use LLMs" lecture. All content, examples, and framings traced directly to that source. Interactive visualizations built with AI assistance.';
    }

    const resourceDescriptions = document.querySelectorAll('#s-resources .rcard-desc');
    const resourceCopy = locale === 'es'
      ? [
          'El original. Más funciones: búsqueda web, Deep Research, ejecución de código, voz, visión y memoria. La demo principal de Karpathy durante toda la charla.',
          'Excepcional en programación y análisis de documentos. Impulsa Cursor (Claude 3.7 Sonnet). Fuerte en razonamiento matizado.',
          'La app de LLM de Google. Gemini 2.0 Pro experimental. Integración profunda con Google Workspace y gran fortaleza multimodal.',
          'LLM search-first: siempre recupera y cita fuentes. Karpathy mostró su función Deep Research. Muy buena opción por defecto para investigación.',
          'Alternativa de la startup francesa Mistral. Su interfaz de chat para consumidores. Fuerte en idiomas europeos y código.',
          'Laboratorio chino de IA con un código y razonamiento sorprendentemente fuertes. Metodología de entrenamiento distinta: merece compararse con los laboratorios de EE. UU.',
          'El IDE de programación favorito de Karpathy. El modo agente Composer (⌘I) ejecuta Claude 3.7 Sonnet sobre todo tu código de forma autónoma.',
          'IDE de programación agéntica basado en VS Code. Alternativa a Cursor: mencionado junto a Cursor y VS Code como las opciones principales.',
          'La herramienta de entrada por voz preferida de Karpathy. Tecla global → grabar → transcribir automáticamente → pegar. Maneja aproximadamente la mitad de sus consultas.',
          'Genera podcasts de audio con dos voces a partir de cualquier documento. Karpathy lo usa para aprender pasivamente mientras camina o conduce.',
          'Herramienta de generación de imágenes. Se usó para varias imágenes de la charla como alternativa a DALL-E.',
          'Librería para generar diagramas a partir de código. Cuando pides a Claude un "diagrama conceptual", a menudo produce marcado Mermaid que se renderiza como un grafo.',
          'Clasificación en vivo de modelos basada en votos de preferencia humana (Chatbot Arena). La mejor señal para saber "qué modelo es realmente mejor ahora mismo".',
          'Libros de dominio público gratis en texto plano. Karpathy lo usó para obtener La riqueza de las naciones para las demos de análisis de documentos.',
          'El vídeo complementario que cubre el interior de los LLM: entrenamiento, tokenización, arquitectura Transformer, postentrenamiento y RLHF.',
          'El vídeo fuente de esta guía. Recorrido práctico por todo el flujo de trabajo de Karpathy con LLM y demos en vivo de cada herramienta.',
        ]
      : [
          'The original. Most features: web search, deep research, code execution, voice, vision, memory. Karpathy\'s primary demo throughout.',
          'Exceptional at coding and document analysis. Powers Cursor (Claude 3.7 Sonnet). Strong nuanced reasoning.',
          'Google\'s LLM app. Gemini 2.0 Pro experimental. Deep Google Workspace integration and strong multimodal.',
          'Search-first LLM — always retrieves and cites sources. Karpathy demoed its Deep Research feature. Great default for research.',
          'French startup alternative. Mistral\'s consumer chat interface. Strong at European languages and code.',
          'Chinese AI lab with surprisingly strong code and reasoning. Different training methodology — worth benchmarking against US labs.',
          'Karpathy\'s coding IDE of choice. Agentic Composer mode (⌘I) runs Claude 3.7 Sonnet across your entire codebase autonomously.',
          'VS Code-based agentic coding IDE. Cursor alternative — mentioned alongside Cursor and VS Code as the main options.',
          'Karpathy\'s voice input tool of choice. Global hotkey → record → auto-transcribe → paste. Handles ~half his queries.',
          'Generate two-host audio podcast discussions from any documents. Karpathy uses for passive learning on walks and drives.',
          'Image generation tool. Used for several images in the lecture as an alternative to DALL-E.',
          'Diagram-from-code library. When you ask Claude for a "conceptual diagram," it often produces Mermaid markup that renders as a graph.',
          'Live model leaderboard ranked by human preference votes (Chatbot Arena). Best signal for "which model is actually better right now."',
          'Free public-domain books in plain text. Karpathy used it to get The Wealth of Nations for LLM document analysis demos.',
          'The companion video covering LLM internals — training, tokenization, transformer architecture, post-training, and RLHF.',
          'The source video for this guide. Practical walkthrough of Karpathy\'s full LLM workflow with live demos of every tool.',
        ];
    resourceDescriptions.forEach((el, idx) => {
      if (el && resourceCopy[idx]) el.textContent = resourceCopy[idx];
    });

    const researchTitles = document.querySelectorAll('#s-research .rp-step-title');
    const researchDescs = document.querySelectorAll('#s-research .rp-step-desc');
    const researchTitlesCopy = locale === 'es'
      ? ['Planificación de la consulta', 'Búsqueda web paralela', 'Pensamiento extendido', 'Generación del informe']
      : ['Query Planning', 'Parallel Web Search', 'Extended Thinking', 'Report Generation'];
    const researchDescsCopy = locale === 'es'
      ? [
          'Divide la pregunta en subtemas y consultas de búsqueda en paralelo',
          'Recopila 20–30 fuentes simultáneamente entre varios subtemas',
          'Razona entre fuentes, resuelve conflictos e identifica huecos',
          'Informe estructurado con citas, mecanismos y advertencias',
        ]
      : [
          'Break the question into subtopics and parallel search queries',
          'Fetches 20–30 sources simultaneously across subtopics',
          'Reasons across sources, resolves conflicts, identifies gaps',
          'Structured report with citations, mechanisms, caveats',
        ];
    researchTitles.forEach((el, idx) => { if (researchTitlesCopy[idx]) el.textContent = researchTitlesCopy[idx]; });
    researchDescs.forEach((el, idx) => { if (researchDescsCopy[idx]) el.textContent = researchDescsCopy[idx]; });

    const codeLabels = document.querySelectorAll('#s-code .cd-step-label');
    const codeLabelsCopy = locale === 'es'
      ? ['Escribiendo código...', 'Ejecutando Python...', 'Resultado']
      : ['Writing code...', 'Executing Python...', 'Output'];
    codeLabels.forEach((el, idx) => { if (codeLabelsCopy[idx]) el.textContent = codeLabelsCopy[idx]; });

    const voiceLabels = document.querySelectorAll('#s-voice .vp-label');
    const voiceLabelsCopy = locale === 'es'
      ? ['Habla', 'Whisper\ndescribe', 'LLM\nresponde', 'Respuesta\nde texto']
      : ['Speak', 'Whisper\ntranscribes', 'LLM\nresponds', 'Text\nresponse'];
    voiceLabels.forEach((el, idx) => {
      if (!voiceLabelsCopy[idx]) return;
      el.innerHTML = voiceLabelsCopy[idx].replace(/\n/g, '<br>');
    });
    const voiceNames = document.querySelectorAll('#s-voice .va-name');
    const voiceTags = document.querySelectorAll('#s-voice .va-tag');
    const voiceDescs = document.querySelectorAll('#s-voice .va-desc');
    const voiceNamesCopy = ['Super Whisper', 'NotebookLM', 'Advanced Voice'];
    const voiceTagsCopy = locale === 'es'
      ? ['La favorita de Karpathy · Mac', 'Google · Gratis', 'ChatGPT']
      : ["Karpathy's pick · Mac", 'Google · Free', 'ChatGPT'];
    const voiceDescsCopy = locale === 'es'
      ? [
          'Hotkey global para grabar → transcribir automáticamente → pegar en cualquier sitio. Funciona en todo el sistema.',
          'Sube documentos → genera una conversación tipo podcast con dos voces. Útil para aprender de forma pasiva.',
          'Audio nativo con tokens de audio: baja latencia, sin capa de transcripción y realmente conversacional.',
        ]
      : [
          'Global hotkey to record → auto-transcribe → paste anywhere. Works system-wide.',
          'Upload docs → generate a two-host podcast discussion. Good for passive learning.',
          'Native audio tokens — low latency, no transcription layer, genuinely conversational.',
        ];
    voiceNames.forEach((el, idx) => { if (voiceNamesCopy[idx]) el.textContent = voiceNamesCopy[idx]; });
    voiceTags.forEach((el, idx) => { if (voiceTagsCopy[idx]) el.textContent = voiceTagsCopy[idx]; });
    voiceDescs.forEach((el, idx) => { if (voiceDescsCopy[idx]) el.textContent = voiceDescsCopy[idx]; });

    const visionTitles = document.querySelectorAll('#s-vision .ve-title');
    const visionPrompts = document.querySelectorAll('#s-vision .ve-prompt');
    const visionNotes = document.querySelectorAll('#s-vision .ve-note');
    const visionTitlesCopy = locale === 'es'
      ? ['Panel de análisis de sangre', 'Monitor de CO2 (Aeronet 4)', 'Identificación de mapa fantástico']
      : ['Blood Test Panel', 'CO2 Monitor (Aeronet 4)', 'Fantasy Map Identification'];
    const visionPromptsCopy = locale === 'es'
      ? [
          '"Aquí están mis análisis: explica los valores marcados"',
          '"¿Qué es este dispositivo y si 713 PPM es una buena lectura?"',
          '"¿Sabes qué mapa es este?"',
        ]
      : [
          '"Here are my lab results — explain the flagged values"',
          '"What is this device, and is 713 PPM a good reading?"',
          '"Do you know what this map is?"',
        ];
    const visionNotesCopy = locale === 'es'
      ? [
          'Funciona bien: los rangos están ampliamente documentados en los datos de entrenamiento. Karpathy verificó las listas de ingredientes contra la caja real. Para decisiones médicas, consulta siempre con un médico.',
          'Identificó correctamente el dispositivo y explicó que 713 PPM es aceptable en interiores (objetivo: por debajo de 800 PPM; ventila por encima de 1000 PPM).',
          'Lo identificó al instante como el mapa de la Tierra Media de El Señor de los Anillos: una imagen famosa y muy reproducida en los datos de entrenamiento.',
        ]
      : [
          'Works well — ranges are extensively documented in training data. Karpathy verified the ingredient lists against the actual box. Always confirm with a doctor for medical decisions.',
          'Correctly identified the device, explained that 713 PPM is acceptable indoors (target: below 800 PPM, ventilate above 1000 PPM).',
          'Immediately identified as the map of Middle-Earth from The Lord of the Rings — a famous, widely-reproduced image in training data.',
        ];
    visionTitles.forEach((el, idx) => { if (visionTitlesCopy[idx]) el.textContent = visionTitlesCopy[idx]; });
    visionPrompts.forEach((el, idx) => { if (visionPromptsCopy[idx]) el.textContent = visionPromptsCopy[idx]; });
    visionNotes.forEach((el, idx) => { if (visionNotesCopy[idx]) el.textContent = visionNotesCopy[idx]; });

    const searchQuestions = document.querySelectorAll('#s-search .dt-question');
    const searchLabels = document.querySelectorAll('#s-search .dt-label');
    const searchResults = document.querySelectorAll('#s-search .dt-result');
    const searchQuestionCopy = locale === 'es'
      ? [
          '¿Esta información depende del tiempo o puede estar desactualizada?',
          '¿Es algo de nicho o poco documentado en la web?',
        ]
      : [
          'Is this information time-sensitive or potentially outdated?',
          'Is it niche or not well-documented on the web?',
        ];
    const searchLabelCopy = locale === 'es'
      ? ['No — atemporal', 'Sí — reciente / cambiante', 'No', 'Sí']
      : ['No — timeless', 'Yes — recent / changing', 'No', 'Yes'];
    const searchResultCopy = locale === 'es'
      ? ['Omitir búsqueda — los pesos bastan', 'Activar búsqueda', 'Omitir búsqueda — los pesos bastan', 'Activar búsqueda']
      : ['Skip search — weights are enough', 'Enable search', 'Skip search — weights are enough', 'Enable search'];
    searchQuestions.forEach((el, idx) => { if (searchQuestionCopy[idx]) el.textContent = searchQuestionCopy[idx]; });
    searchLabels.forEach((el, idx) => { if (searchLabelCopy[idx]) el.textContent = searchLabelCopy[idx]; });
    searchResults.forEach((el, idx) => { if (searchResultCopy[idx]) el.textContent = searchResultCopy[idx]; });

    const contextTokens = document.querySelectorAll('#s-mental-model .context-tape .context-token');
    const contextCopy = locale === 'es'
      ? ['sistema', 'Eres un asistente útil.', 'usuario', '¿Cuánta cafeína tiene un americano?', 'asistente', 'Unos 63 mg por shot...', 'usuario', '¿Y un doble shot?']
      : ['system', 'You are a helpful assistant.', 'user', 'How much caffeine is in an Americano?', 'assistant', 'About 63mg per shot...', 'user', 'What about a double shot?'];
    contextTokens.forEach((el, idx) => {
      if (idx < contextCopy.length) el.textContent = contextCopy[idx];
    });
    const mentalInsights = document.querySelectorAll('#s-mental-model .insight-box');
    if (mentalInsights[0]) {
      mentalInsights[0].innerHTML = locale === 'es'
        ? '<strong>La introducción</strong> "Hola, soy ChatGPT. Soy un archivo ZIP de una sola pestaña. Mi conocimiento proviene de leer internet hace unos 6 meses. Solo sé lo que está en esta conversación. Cada palabra que genero es una muestra probabilística: trátala en consecuencia."'
        : '<strong>The Introduction</strong> "Hi, I\'m ChatGPT. I\'m a one-tab ZIP file. My knowledge comes from reading the internet about 6 months ago. I only know what\'s in this conversation. Every word I generate is a probabilistic sample — treat it accordingly."';
    }
    if (mentalInsights[1]) {
      mentalInsights[1].innerHTML = locale === 'es'
        ? '<strong>Advertencia sobre conocimiento desfasado</strong> Para hechos atemporales como la cafeína, los pesos del modelo son fiables. Para noticias del mes pasado, no lo son. Conviene distinguirlo antes de confiar en la respuesta.'
        : '<strong>Stale knowledge caveat</strong> For timeless facts like caffeine content, the model\'s weights are reliable. For last month\'s news — they\'re not. Know the difference before trusting the answer.';
    }

    const docUserMsgs = document.querySelectorAll('#s-docs .doc-chat .doc-msg-user');
    const docAiMsgs = document.querySelectorAll('#s-docs .doc-chat .doc-msg-ai');
    const docUserCopy = locale === 'es'
      ? ['Por favor, crea un diagrama conceptual de este capítulo', '¿Qué supuesto implícito hay en el nodo D?']
      : ['Please create a conceptual diagram of this chapter', 'What implicit assumption is in node D?'];
    const docAiCopy = locale === 'es'
      ? [
          'Diagrama renderizado que muestra cómo Smith sostiene que el tamaño del mercado limita la especialización: mercados más grandes permiten una división del trabajo más profunda.',
          'El nodo D asume que las redes comerciales son accesibles legal y políticamente: la premisa implícita de Smith de que ya existe una infraestructura de intercambio funcional. Señala esta condición previa sin argumentarla.',
        ]
      : [
          'Rendered diagram showing how Smith argues market size constrains specialization — larger markets enable deeper division of labor.',
          'Node D assumes that trade networks are legally and politically accessible — Smith\'s implicit premise that functioning exchange infrastructure already exists. He notes this precondition without arguing for it.',
        ];
    docUserMsgs.forEach((el, idx) => { if (docUserCopy[idx]) el.textContent = docUserCopy[idx]; });
    docAiMsgs.forEach((el, idx) => { if (docAiCopy[idx]) el.textContent = docAiCopy[idx]; });

    const modelChipSpans = document.querySelectorAll('#s-models .model-chip span');
    const modelChipCopy = locale === 'es'
      ? ['rápido · inteligente · por defecto', 'modelos de pensamiento', '$200/mes · razonamiento profundo', 'programación + razonamiento', 'rápido + capaz', 'ligero', 'multimodal', 'rápido · a menudo gratis', 'chino · fuerte en código', 'francés · Le Chat']
      : ['fast · smart · default', 'thinking models', '$200/mo · deep reasoning', 'coding + reasoning', 'fast + capable', 'lightweight', 'multimodal', 'fast · often free', 'Chinese · strong at code', 'French · Le Chat'];
    modelChipSpans.forEach((el, idx) => { if (modelChipCopy[idx]) el.textContent = modelChipCopy[idx]; });

    const modelTags = document.querySelectorAll('#s-models .ac-tags .tag');
    const modelTagCopy = locale === 'es'
      ? ['Elección principal', 'Más funciones', 'Programación', 'Docs', 'Multimodal', 'Búsqueda primero', 'Citas', 'Alternativa', 'Alternativa', 'Código']
      : ['Primary pick', 'Most features', 'Coding', 'Docs', 'Multimodal', 'Search-first', 'Citations', 'Alternative', 'Alternative', 'Code'];
    modelTags.forEach((el, idx) => { if (modelTagCopy[idx]) el.textContent = modelTagCopy[idx]; });

    const agentTitles = document.querySelectorAll('#s-agentic .al-title');
    const agentDescs = document.querySelectorAll('#s-agentic .al-desc');
    const agentTitleCopy = locale === 'es'
      ? ['Planificar', 'Generar', 'Ejecutar', 'Observar']
      : ['Plan', 'Generate', 'Execute', 'Observe'];
    const agentDescCopy = locale === 'es'
      ? [
          'Divide la tarea en cambios de archivos y comandos de shell',
          'Escribe o edita archivos fuente en todo el código',
          'Ejecuta comandos de shell: primero pide tu aprobación',
          'Lee la salida, detecta errores y actualiza su plan',
        ]
      : [
          'Break the task into file changes and shell commands',
          'Write or edit source files across the codebase',
          'Run shell commands — asks your approval first',
          'Read output, catch errors, update its plan',
        ];
    agentTitles.forEach((el, idx) => { if (agentTitleCopy[idx]) el.textContent = agentTitleCopy[idx]; });
    agentDescs.forEach((el, idx) => { if (agentDescCopy[idx]) el.textContent = agentDescCopy[idx]; });

    const summaryTitles = document.querySelectorAll('#s-summary .ps-title');
    const summaryDescs = document.querySelectorAll('#s-summary .ps-desc');
    const summaryTitleCopy = locale === 'es'
      ? [
          'Estás hablando con un archivo ZIP',
          'Conoce tu nivel y tu modelo',
          'Busca solo información sensible al tiempo',
          'Deep Research para síntesis multi-fuente',
          'Verifica el código y la salida de datos',
          'La voz elimina la mitad de la fricción',
          'ChatGPT es el valor por defecto, por ahora',
        ]
      : [
          'You\'re talking to a ZIP file',
          'Know your tier and model',
          'Search for time-sensitive info only',
          'Deep Research for multi-source synthesis',
          'Verify code and data output',
          'Voice removes half the friction',
          'ChatGPT is the default — for now',
        ];
    const summaryDescCopy = locale === 'es'
      ? [
          'El modelo comprimió internet en pesos. Su conocimiento tiene ~6–12 meses de desfase, la salida es probabilística y no tiene memoria de trabajo fuera de la ventana de contexto. No puede verificar sus propias respuestas.',
          'Gratis → limitado. 20 $/mes → GPT-4o / Claude Sonnet. 200 $/mes → o1 Pro, Deep Research. Ajusta el modelo a la tarea: modelos de pensamiento para razonamiento duro y modelos rápidos para consultas simples.',
          'Para conocimiento atemporal y bien documentado, los pesos bastan: omite la búsqueda. Para eventos recientes, situaciones cambiantes o temas de nicho, activa la búsqueda o usa Perplexity.',
          '5–15 minutos, 20–30 fuentes, informe estructurado. Realmente útil para revisiones bibliográficas y due diligence. Ahora mismo está tras el muro de pago de 200 $/mes de ChatGPT; Perplexity es más barato.',
          'Advanced Data Analysis ejecuta Python real, pero el modelo puede alucinar valores en el código que escribe. Comprueba los números contra tu fuente, no solo la forma visual del gráfico.',
          'Una herramienta de dictado basada en Whisper elimina la barrera de teclear. Karpathy canaliza alrededor del 50% de sus consultas por voz. Usa texto para nombres técnicos de productos y librerías que Whisper suele transcribir mal.',
          'Más funciones, ecosistema más grande y UX más pulida. Claude para código. Perplexity para búsqueda primero. El panorama cambia rápido: mira LM Arena para ver las clasificaciones actuales antes de comprometerte.',
        ]
      : [
          'The model compressed the internet into weights. Knowledge is ~6–12 months stale, output is probabilistic, and it has no working memory outside the context window. It cannot verify its own answers.',
          'Free → limited. $20/mo → GPT-4o / Claude Sonnet. $200/mo → o1 Pro, Deep Research. Match the model to the task — thinking models for hard reasoning, fast models for simple queries.',
          'For timeless, well-documented knowledge — the weights are enough, skip search. For recent events, changing situations, or niche topics — enable search or use Perplexity.',
          '5–15 minutes, 20–30 sources, structured report. Genuinely useful for literature reviews and due diligence. Currently behind the $200/mo paywall on ChatGPT; Perplexity is cheaper.',
          'Advanced Data Analysis runs real Python — but the model can hallucinate values in the code it writes. Check the numbers against your source data, not just the chart\'s visual shape.',
          'A Whisper-based dictation tool eliminates the typing barrier. Karpathy routes ~50% of queries through voice. Use text for technical product names and library names that Whisper mistranscribes.',
          'Most features, largest ecosystem, most polished UX. Claude for coding. Perplexity for search-first. The landscape shifts quickly — check LM Arena for current rankings before committing.',
        ];
    summaryTitles.forEach((el, idx) => {
      if (el && summaryTitleCopy[idx]) el.textContent = summaryTitleCopy[idx];
    });
    summaryDescs.forEach((el, idx) => {
      if (el && summaryDescCopy[idx]) el.textContent = summaryDescCopy[idx];
    });

    window.dispatchEvent(new CustomEvent('llms:localechange', { detail: { locale } }));
  }

  function applyTheme() {
    const resolved = getResolvedTheme();
    document.documentElement.dataset.theme = resolved;
    window.dispatchEvent(new CustomEvent('llms:themechange', { detail: { theme: resolved, mode: theme } }));
    renderMermaid().catch(() => {});
  }

  function setLocale(nextLocale) {
    if (!COPY[nextLocale]) return;
    locale = nextLocale;
    localStorage.setItem(STORAGE_KEYS.locale, locale);
    applyStaticText();
  }

  function setTheme(nextTheme) {
    if (!['system', 'light', 'dark'].includes(nextTheme)) return;
    theme = nextTheme;
    localStorage.setItem(STORAGE_KEYS.theme, theme);
    applyTheme();
  }

  async function renderMermaid() {
    const source = document.getElementById('doc-mermaid-source');
    const target = document.getElementById('doc-mermaid-diagram');
    const shell = target && target.closest('.doc-code-block');
    if (!source || !target || !shell || !window.mermaid) return;

    const code = source.textContent.trim();
    if (!code) return;

    const resolved = getResolvedTheme();
    const themeVariables = resolved === 'dark'
      ? {
          background: 'transparent',
          primaryColor: '#111B2E',
          primaryTextColor: '#F8FAFF',
          primaryBorderColor: '#6EE7E7',
          lineColor: '#8AA4C2',
          secondaryColor: '#18243C',
          tertiaryColor: '#0B1220',
          fontFamily: 'Inter, sans-serif'
        }
      : {
          background: 'transparent',
          primaryColor: '#F4FAFA',
          primaryTextColor: '#1A1F36',
          primaryBorderColor: '#0D9488',
          lineColor: '#758AA3',
          secondaryColor: '#FFFFFF',
          tertiaryColor: '#F4FAFA',
          fontFamily: 'Inter, sans-serif'
        };

    window.mermaid.initialize({
      startOnLoad: false,
      theme: resolved === 'dark' ? 'dark' : 'base',
      securityLevel: 'loose',
      themeVariables
    });

    try {
      const id = `mermaid-${Date.now()}`;
      const result = await window.mermaid.render(id, code);
      target.innerHTML = result.svg;
      shell.classList.add('is-rendered');
    } catch (error) {
      shell.classList.remove('is-rendered');
      console.warn('Mermaid render failed', error);
    }
  }

  function init() {
    applyStaticText();
    applyTheme();

    document.querySelectorAll('[data-locale]').forEach(btn => btn.addEventListener('click', () => setLocale(btn.dataset.locale)));
    document.querySelectorAll('[data-theme]').forEach(btn => btn.addEventListener('click', () => setTheme(btn.dataset.theme)));

    if (window.matchMedia) {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      media.addEventListener?.('change', () => {
        if (theme === 'system') applyTheme();
      });
    }
  }

  window.HowToUseLLMsI18n = {
    getCopy,
    getLocale: () => locale,
    getTheme: () => theme,
    setLocale,
    setTheme,
    renderMermaid,
    on: (eventName, fn) => {
      const handler = evt => fn(evt.detail);
      window.addEventListener(eventName, handler);
      listeners.add({ eventName, handler });
      return () => window.removeEventListener(eventName, handler);
    },
  };

  init();
})();
