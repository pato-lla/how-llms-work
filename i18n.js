(function(){
  const STORAGE = { locale: 'how-llms-locale', theme: 'how-llms-theme' };
  const browserLocale = (navigator.language || 'en').toLowerCase();
  let locale = localStorage.getItem(STORAGE.locale) || (browserLocale.startsWith('es') ? 'es' : 'en');
  let theme = localStorage.getItem(STORAGE.theme) || 'system';

  const COPY = {
    en: {
      nav: ['Intro','Data','Tokens','Training','Inference','Base Model','Post-Train','Psychology','RAG','Security','Pipeline'],
      hero: {
        badge: 'A Visual Deep Dive',
        title: 'How LLMs<br><span>Actually</span> Work',
        sub: 'A complete walkthrough of how large language models like ChatGPT are built — from raw internet text to a conversational assistant. Based on Andrej Karpathy\'s technical deep dive.',
        stats: ['Training Tokens','Parameters','Text Data','Token Vocabulary'],
        caveat: 'Representative figures from frontier models circa 2024 — exact numbers shift with every release. The scale is the point, not the precision.',
        twLabel: 'Live LLM Response',
        twPrompt: 'Human: What is behind this text box?'
      },
      data: {
        badge: 'Chapter 1 · Pre-Training · Stage 1',
        title: 'Downloading<br>the Internet',
        body: [
          'The first step is collecting an enormous amount of text. Organizations like <span class="highlight">Common Crawl</span> have been crawling the web since 2007 — indexing 2.7 billion pages by 2024. This raw data is then filtered into a high-quality dataset like <span class="highlight">FineWeb</span>.',
          'The goal: <em>large quantity</em> of <em>high quality</em>, <em>diverse</em> documents. After aggressive filtering, you end up with about <span class="highlight-a">44 terabytes</span> — roughly 10 consumer hard drives worth of text — representing ~15 trillion tokens.'
        ],
        insight: ['Key Insight','The quality and diversity of this training data has more impact on the final model than almost anything else. Garbage in, garbage out — but at a trillion-token scale.'],
        flow: [
          ['🌐 Common Crawl','2.7B web pages · Raw HTML · Since 2007','A non-profit organization that crawls the web and freely provides its data. Their bots follow links from seed pages, recursively indexing the internet. The raw archive is petabytes of gzip\'d WARC files containing raw HTML.'],
          ['🚫 URL Filtering','Blocklists · Malware · Spam · Adult content','Block-lists of known malware sites, spam networks, adult content, marketing pages, and low-quality domains are applied. Entire domains can be removed. This is the cheapest filter so it runs first.'],
          ['📄 Text Extraction','HTML → clean text · Remove navigation & CSS','Raw HTML contains <div> tags, CSS, JavaScript, navigation menus, and ads. Parsers extract just the meaningful text content. This is harder than it sounds — heuristics decide what\'s "content" vs "chrome".'],
          ['🌍 Language Filtering','Keep pages ≥65% English · Language classifier','A language classifier estimates the language of each page. Pages with less than 65% target-language content are dropped. This is a design decision — filter aggressively for one language or train multilingual.'],
          ['♻️ Deduplication','Exact & fuzzy matching · Reduce repetition','Identical or near-identical pages appear millions of times on the internet (copied articles, boilerplate). Training on the same text repeatedly causes memorization. Dedup uses MinHash and exact-match techniques to remove duplicates.'],
          ['🔒 PII Removal','Names · Addresses · SSNs · Emails','Personally Identifiable Information is detected and either redacted or the page is dropped. Regex patterns and ML classifiers find phone numbers, emails, Social Security numbers, physical addresses, and named individuals.'],
          ['✅ FineWeb Dataset','44 TB · 15 Trillion tokens · High quality','The final filtered dataset. Articles about tornadoes in 2012, medical facts, history, code, recipes, science papers — the full breadth of human knowledge expressed in text. This becomes the training corpus.']
        ],
        pipelineBtn: '▶ Animate Pipeline'
      },
      tokenizer: {
        badge: 'Chapter 1 · Pre-Training · Stage 2',
        title: 'Tokenization',
        body: [
          'Neural networks can\'t process raw text — they need numbers. The solution is <span class="highlight">tokenization</span>: breaking text into "tokens" (sub-word chunks) and assigning each an ID.',
          'GPT-4 uses a vocabulary of <span class="highlight">100,277 tokens</span>, built via the <span class="highlight-a">Byte Pair Encoding (BPE)</span> algorithm. BPE starts with individual bytes (256 symbols), then iteratively merges the most frequent adjacent pairs — compressing the sequence length while expanding the vocabulary.'
        ],
        insight: ['Why not just use words?','Words have infinite variants. "run", "running", "runner" would be 3 separate entries. Subword tokens share roots: "run" + "ning", "run" + "ner". This also handles new words, typos, and multiple languages efficiently.'],
        sub: 'BPE in Action',
        input: 'tokenization',
        stepBtn: 'Next Merge →',
        autoBtn: '▶ Auto',
        resetBtn: 'Reset',
        tryLink: 'Try the real tokenizer → tiktokenizer.vercel.app'
      },
      training: {
        badge: 'Chapter 1 · Pre-Training · Stage 3',
        title: 'Training the<br>Neural Network',
        body: [
          'The Transformer neural network is initialized with random parameters — billions of <span class="highlight">"knobs"</span>. Training adjusts these knobs so the network gets better at predicting the next token in any sequence.',
          'Every training step: sample a window of tokens → feed to network → compare prediction to actual next token → nudge all parameters slightly in the right direction. Repeat <span class="highlight-a">billions of times</span>.',
          'The <span class="highlight">loss</span> — a single number measuring prediction error — falls steadily as the model learns the statistical patterns of human language.'
        ],
        insights: [
          ['Scale','GPT-2 (2019): 1.6B params, 100B tokens, ~$40K to train. Today: same quality for ~$100. Llama 3: 405B params, 15T tokens. Modern frontier models: hundreds of billions of parameters, trillions of tokens.'],
          ['Scaling Laws','Model accuracy is a smooth, predictable function of just two variables: <em>N</em> (number of parameters) and <em>D</em> (training tokens). These trends show no signs of plateauing — bigger model + more data = reliably better results. Algorithmic breakthroughs are a bonus, but simply scaling compute is a near-guaranteed path to improvement. This is why AI labs are in a GPU arms race.'],
          ['What is an Embedding?','Each token ID maps to a learned vector of ~1,000–4,000 numbers called its <em>embedding</em>. Think of it as a coordinate in meaning-space — initialized randomly, then shaped by training. The same token (e.g. "bank") always enters the network with the same embedding vector. <em>Attention layers</em> then mix in context from surrounding tokens, so by the time "bank" reaches deeper layers, "river bank" and "bank account" carry completely different representations. Polysemy is resolved by context, not by storing multiple meanings per token.']
        ],
        sub: 'Transformer Architecture',
        stageHint: 'Select a training stage to see model output quality',
        stageOutput: 'Model Output at This Stage',
        btn: '▶ Animate',
        lossLabel: 'Training Loss ↓',
        lossMeta: ['Cross-entropy loss','Training step'],
        outputInsight: ['What the model is learning','At step 1: pure noise. By step 500: local coherence appears. By step 32K: fluent English. The model is learning grammar, facts, reasoning patterns — all implicitly from token prediction.']
      },
      inference: {
        badge: 'Chapter 1 · Pre-Training · Stage 4',
        title: 'Inference &<br>Token Sampling',
        body: [
          'Once trained, the network generates text autoregressively: feed a sequence of tokens → get a <span class="highlight">probability distribution</span> over all 100K possible next tokens → sample one → append → repeat.',
          'This process is <span class="highlight-a">stochastic</span> — the same prompt generates different outputs every time because we\'re flipping a biased coin. Higher-probability tokens are more likely but not guaranteed to be chosen.',
          '<span class="highlight">Temperature</span> controls randomness. Low temperature (0.1) → model always picks the top token. High temperature (2.0) → uniform chaos. 0.7–1.0 is the sweet spot for coherent-but-creative text.'
        ],
        insight: ['Key Mental Model','The model doesn\'t "think" about what to say. It computes a probability distribution over all possible next tokens and samples from it. Every word is a coin flip — just a very informed one.'],
        sub: 'Token Sampling Demo',
        helper: 'Watch the model choose the next word. Each bar shows the probability of a candidate token.',
        btn: 'Sample Next Token',
        reset: 'Reset',
        label: 'Next token candidates'
      },
      base: {
        badge: 'Chapter 2 · The Base Model',
        title: 'The Internet<br>Simulator',
        body: [
          'After pre-training, you have a <span class="highlight">base model</span> — a sophisticated autocomplete engine. It\'s not an assistant. It doesn\'t answer questions. It <em>continues token sequences</em> based on what it saw on the internet.',
          'Give it a Wikipedia sentence and it\'ll complete it from memory. Ask it "What is 2+2?" and it might give you a math textbook page, a quiz answer key, or go off on a tangent — whatever was statistically common in its training data.',
          'The base model\'s knowledge lives in its <span class="highlight-a">405 billion parameters</span> — a lossy compression of the internet, like a zip file that approximates rather than perfectly stores information.'
        ],
        sub: 'Base Model Behavior',
        insights: [
          ['Why it feels weird','Base models are often "wrong" in the assistant sense because they are doing exactly what they were trained to do: continue text. They are not yet tuned to be helpful or conversational.'],
          ['The One-Tab ZIP Model','Karpathy\'s metaphor: the base model is a zip file with a million patterns inside. It can unzip parts of the internet, but only through probabilistic completion.']
        ]
      },
      posttraining: {
        badge: 'Chapter 3 · Post-Training',
        title: 'Building the Assistant',
        body: 'The base model is a token simulator. To turn it into a <em>helpful assistant</em>, we need post-training — a much cheaper but equally critical stage. This is where the model learns <span class="highlight">conversations</span>.',
        sft: {
          sub: 'Supervised Fine-Tuning (SFT)',
          body: [
            'Human labelers create a dataset of ideal conversations, following detailed labeling instructions: be <span class="highlight">helpful</span>, be <span class="highlight-a">truthful</span>, be <span class="highlight-g">harmless</span>. The model is then trained on these conversations — not from scratch, but by continuing to adjust the pre-trained weights on this new data.',
            'Modern SFT datasets (like UltraChat) have millions of conversations — mostly synthetic (LLM-generated), with human review. The model learns by imitation: it adopts the persona of the ideal assistant reflected in the data.'
          ],
          convo: 'Training Conversation Example',
          human: 'Human',
          assistant: 'Assistant',
          prompt1: 'What is 2 + 2?',
          answer1: '2 + 2 = 4. Is there anything else you\'d like help with?',
          prompt2: 'What if it was multiplication instead?',
          answer2: '2 × 2 = 4 as well — the same result! For multiplication, 2 × 2 means adding 2 to itself once, giving you 4.',
          insightTitle: 'What you\'re really talking to',
          insightBody: 'ChatGPT is a statistical simulation of the human labelers OpenAI hired — experts following labeling instructions. When it answers a coding question, it\'s imitating what a skilled developer-labeler would write.'
        },
        convoToken: {
          sub: 'Conversation Token Format',
          body: 'Every conversation must be encoded as a <em>flat token sequence</em>. Special tokens mark the structure:',
          roleUser: 'user',
          roleAssistant: 'assistant',
          outro: 'Then RLHF refines the assistant\'s behavior further:'
        },
        rlhf: {
          sub: 'RLHF — Reinforcement Learning<br>from Human Feedback',
          body: 'Human raters rank multiple model responses. A <span class="highlight">reward model</span> learns to predict human preferences. The language model is then trained via reinforcement learning to generate responses the reward model scores highly.',
          preferred: '✓ Preferred',
          rejected: '✗ Rejected',
          good: 'Here are the top 5 landmarks in Paris: 1) Eiffel Tower — iconic iron lattice structure... 2) The Louvre — world\'s largest art museum...',
          bad: 'Paris has many landmarks. You should visit the Eiffel Tower. There is also a museum called the Louvre. Also Notre-Dame Cathedral is there...',
          insightTitle: 'Why RLHF matters',
          insightBody: 'SFT teaches the model what to say. RLHF teaches it <em>how to say it well</em> — making responses more helpful, better structured, more honest, and less likely to hallucinate.'
        }
      },
      psychology: {
        badge: 'Chapter 4 · LLM Psychology',
        title: 'Cognitive Quirks<br>of Language Models',
        body: 'Understanding <em>why</em> LLMs behave the way they do requires thinking about their psychology — the emergent properties of being trained to statistically imitate human text.',
        cards: [
          ['🌀','Hallucination','Models confabulate confidently because training data always has confident answers. "Who is Orson Kovats?" gets a made-up biography because the training distribution of "who is X?" questions is always followed by confident replies — even for fictional names. Fix: add "I don\'t know" examples for questions the model gets wrong consistently.'],
          ['🧠','Two Types of Memory','<strong style="color:var(--cyan)">Parameters = long-term memory.</strong> Everything the model learned during training — vast but vague, like something you read months ago. <strong style="color:var(--amber)">Context window = working memory.</strong> Text in the current conversation — precise, directly accessible. Always paste important info into context rather than relying on the model to "remember."'],
          ['🔧','Tool Use','Models can emit special tokens that trigger external tools: <span style="color:var(--purple);font-family:var(--dm);font-size:12px">&lt;search&gt;query&lt;/search&gt;</span>. The program pauses generation, executes the search, stuffs the results into the context window, then resumes. The model "looks things up" the same way you do — by refreshing working memory.'],
          ['🪞','No Persistent Self','Each conversation starts fresh — no memory of prior chats. The model "boots up," processes tokens, then shuts off. It has no stable identity. When it says "I\'m ChatGPT by OpenAI," that\'s just the most statistically likely answer from training data — not genuine self-knowledge.'],
          ['📊','Stochastic Token Tumbler','The model doesn\'t "decide" what to say. It computes probability distributions and samples. Run the same prompt 10 times and get 10 different outputs — all plausible, all drawn from the same learned distribution. Temperature controls how broadly it samples from this distribution.'],
          ['📚','Knowledge Cutoff','Training data has a date. The model genuinely doesn\'t know what happened after that. Ask about recent events and it will hallucinate — not from malice but from the same mechanism that answers every question: predict the most likely continuation of the token sequence.'],
          ['↔️','The Reversal Curse','Ask GPT-4 "Who is Tom Cruise\'s mother?" → correct: Mary Lee Pfeiffer. Ask "Who is Mary Lee Pfeiffer\'s son?" → it claims not to know. Knowledge is stored directionally — in the form it was encountered in training data. It\'s not a queryable database; you have to approach it from the angle it was learned.'],
          ['⚡','System 1 Only — No Deep Thinking','Every token takes roughly the same compute — there\'s no mechanism to "think harder" on a difficult question. Unlike humans who can engage slow, deliberate System 2 reasoning (working through a chess position step-by-step), LLMs generate each token at the same speed regardless of difficulty. Converting time into accuracy is an active research frontier.']
        ]
      },
      rag: {
        badge: 'Applied LLMs · RAG',
        title: 'Retrieval-Augmented<br>Generation',
        body: 'LLMs have a knowledge cutoff and a finite context window. RAG solves this by <em>embedding</em> your documents into a vector store, retrieving the most semantically relevant chunks at query time, and injecting them into the context — shifting the model\'s prediction distribution toward grounded, up-to-date facts rather than memorized training data.',
        steps: [
          ['Step 01 — Embed everything','Every document is converted to a dense vector (~1,536 numbers) by an embedding model. Semantically similar texts land near each other in this high-dimensional space — no keyword matching needed.'],
          ['Step 02 — Embed the query &amp; search','The user\'s question is embedded the same way. Cosine similarity finds the nearest document vectors — the chunks most semantically related to the query — typically the top 2–5.'],
          ['Step 03 — Inject &amp; generate','Retrieved chunks are prepended to the prompt before the LLM sees the question. The model generates from injected facts rather than relying on memorized training data — dramatically reducing hallucination on knowledge-intensive tasks.']
        ],
        flow: [
          ['1 · User Query','"What is the capital of Ares Base?"'],
          ['2 · Embedding Model','Text → [0.23, −0.87, 0.41, ...] · ~1,536 floats'],
          ['3 · Vector DB — Cosine Search','Find top-k nearest neighbors in embedding space'],
          ['4 · Retrieved Chunks (top 2)','Doc 1: "Ares Base established 2031..." · Doc 2: "Capital is New Houston, 312 colonists..."'],
          ['5 · Context Window (assembled)','[Retrieved] Ares Base est. 2031... · [Retrieved] Capital: New Houston... · [Query] What is the capital...?'],
          ['6 · LLM → Grounded Answer','"The capital of Ares Base is New Houston."']
        ],
        demo: {
          sub: 'Effect on Predictions',
          query: 'Query',
          question: 'What is the administrative capital of the Ares Base colony?',
          runBtn: '▶ Run RAG Query',
          resetBtn: 'Reset',
          kb: 'Knowledge Base — 4 documents',
          ctx: 'Context Window — sent to LLM',
          noRag: '✕ Without RAG',
          withRag: '✓ With RAG',
          hallucination: 'Hallucination / Refusal',
          grounded: 'Grounded in retrieved context',
          answerNoRag: '"I don\'t have reliable information about a colony called Ares Base. As of my training cutoff, no such Mars colony has been established..."',
          answerWithRag: '"The administrative capital of Ares Base is <strong style="color:var(--green)">New Houston</strong>, which houses 312 colonists. The colony was established in 2031 near Hellas Planitia."'
        }
      },
      security: {
        badge: 'Chapter 5 · Security',
        title: 'Security Challenges<br>in LLM Systems',
        body: 'The same properties that make LLMs powerful — following instructions, completing patterns, acting on context — also create new attack surfaces. A cat-and-mouse game between attacks and defenses is now playing out in this new computing paradigm.',
        cards: [
          ['🔓','Jailbreak Attacks','Safety training can be bypassed via roleplay ("act as my deceased grandmother who was a Napalm chemist"), alternative encodings (base64 of a harmful query — models learned these from training data), or adversarial suffixes: optimized gibberish strings that, when appended to any prompt, reliably disable refusals. The model is trying to help; these tricks convince it the harmful request is benign.'],
          ['💉','Prompt Injection','Malicious instructions hidden in external content — faint white text in an image, invisible text on a webpage — hijack the model when it reads that content. Bing was demonstrated serving a fraudulent link after browsing a compromised page. Google\'s Bard was shown exfiltrating user data via a poisoned Google Doc. The model can\'t reliably distinguish user instructions from injected ones.'],
          ['☠️','Data Poisoning &amp; Backdoors','Attackers who control web content can embed trigger words into training data. In one paper, the trigger "James Bond" in a prompt caused a fine-tuned model to produce nonsensical outputs and misclassify threats — while behaving normally otherwise. The model is "brainwashed": clean until the trigger fires. Because LLMs train on vast amounts of unvetted internet text, this attack surface is hard to close.'],
          ['🐼','Adversarial Inputs','Carefully optimized noise patterns, invisible to humans, can jailbreak multimodal LLMs. A panda photo with an imperceptible noise overlay caused a vision model to comply with otherwise-refused requests. Every new modality (images, audio, video) is also a new attack surface. Rerunning the optimization generates a fresh bypass, so patching specific examples doesn\'t fully solve it.'],
          ['🐱','Cat-and-Mouse Dynamics','Each attack has defenses — multilingual refusal data reduces base64 jailbreaks, content security policies limit exfiltration, known adversarial suffixes can be blocked. But many attacks are re-generatable: patch one and the optimization produces a new one for free. This mirrors the security dynamic of traditional software, now playing out in the LLM space.']
        ]
      },
      summary: {
        badge: 'Full Pipeline',
        title: 'From Text to<br>Assistant',
        body: 'The complete journey from raw web crawl to the ChatGPT you interact with — across two major stages, months of compute, and billions of parameters.',
        stages: [
          ['Data Collection','Common Crawl + other sources → URL filtering → text extraction → language filtering → deduplication → PII removal → 44 TB of curated text (FineWeb, etc.)', ['Common Crawl','FineWeb','44 TB','15T tokens']],
          ['Tokenization','Text → UTF-8 bytes → Byte Pair Encoding → 15 trillion token sequence. Each token is a sub-word chunk with an integer ID. GPT-4 vocabulary: 100,277 tokens.', ['BPE','100K vocab','Sub-word units']],
          ['Pre-Training','Transformer neural network trained to predict the next token. Billions of parameters tuned via gradient descent. Months of compute on thousands of GPUs. Loss decreases from ~11 to ~2.4.', ['Transformer','405B params','$millions compute','3 months']],
          ['Base Model','An internet document simulator. Can autocomplete, few-shot prompt, and regurgitate memorized facts. NOT an assistant — just a very sophisticated token predictor.', ['GPT-2','Llama 3 base','Token autocomplete']],
          ['Supervised Fine-Tuning (SFT)','Base model retrained on human-labeled conversations. Labelers write ideal responses following company guidelines: helpful, truthful, harmless. Modern datasets: millions of synthetic + human-curated conversations. Duration: hours (not months).', ['Human labelers','InstructGPT','UltraChat','~3 hours']],
          ['RLHF','Human raters rank model outputs. A reward model learns these preferences. The language model is optimized via reinforcement learning to score higher — producing responses that are more helpful, better structured, and more honest.', ['Reward Model','PPO','Human preferences']],
          ['🤖 ChatGPT / Claude / Gemini','The final assistant. A statistical simulation of expert human labelers, backed by a vast compressed representation of the internet. Not magic — but remarkable engineering at enormous scale.', ['Conversational','Helpful · Truthful · Harmless','Tool use']]
        ],
        tags: ['Common Crawl','FineWeb','44 TB','15T tokens','BPE','100K vocab','Sub-word units','Transformer','405B params','$millions compute','3 months','GPT-2','Llama 3 base','Token autocomplete','Human labelers','InstructGPT','UltraChat','~3 hours','Reward Model','PPO','Human preferences','Conversational','Helpful · Truthful · Harmless','Tool use'],
        mental: {
          badge: 'Mental Model',
          title: 'Think of an LLM as an Operating System',
          body: 'An LLM isn\'t just a chatbot — it\'s the kernel process of an emerging OS. It coordinates memory, compute, and tools via natural language.',
          memoryTitle: 'Memory Hierarchy',
          memory: ['Disk = Internet / Files — browsed on demand or retrieved via RAG', 'RAM = Context Window — finite working memory; the model pages info in and out', 'CPU = GPU Inference — the forward pass generating each token'],
          futureTitle: 'Where the Field Is Headed',
          future: ['System 2 Thinking — converting time into accuracy; "take 30 minutes, don\'t rush"', 'Self-Improvement — the AlphaGo question: can LLMs surpass human-level answers once a reward signal exists?', 'Customization — an app store of specialized LLM experts for narrow tasks', 'Multimodality — text, images, audio, and video unified in one model']
        }
      },
      footer: {
        text: 'Built from Andrej Karpathy\'s {{lecture}} lecture — all facts, figures, and framings traced back to that source. Interactive visualizations built with AI assistance. The most important takeaway: every word generated is a probabilistic sample — a biased coin flip, at 100K-way scale, billions of times.',
        note: 'This was {{hn}} and drew heated debate about it being LLM-generated. That\'s a fair observation — the implementation was AI-assisted. But the content isn\'t the AI\'s: every claim, figure, and framing in this guide comes directly from Karpathy\'s lecture, not from a model hallucinating about LLMs.',
        links: ['HN discussion','GitHub','Full lecture transcript','HN update note','LLM council report','v1 (original)','Part 2: How to Use LLMs →']
      }
    },
    es: {
      nav: ['Inicio','Datos','Tokens','Entrenamiento','Inferencia','Modelo base','Postentrenamiento','Psicología','RAG','Seguridad','Pipeline'],
      hero: {
        badge: 'Una inmersión visual',
        title: 'Cómo funcionan<br><span>realmente</span> los LLM',
        sub: 'Un recorrido completo sobre cómo se construyen modelos de lenguaje como ChatGPT, desde texto bruto de internet hasta un asistente conversacional. Basado en la charla técnica de Andrej Karpathy.',
        stats: ['Tokens de entrenamiento','Parámetros','Datos de texto','Vocabulario de tokens'],
        caveat: 'Cifras representativas de modelos frontera alrededor de 2024: los números exactos cambian con cada lanzamiento. La escala importa más que la precisión.',
        twLabel: 'Respuesta en vivo del LLM',
        twPrompt: 'Humano: ¿Qué hay detrás de esta caja de texto?'
      },
      data: {
        badge: 'Capítulo 1 · Preentrenamiento · Fase 1',
        title: 'Descargando<br>internet',
        body: [
          'El primer paso es recopilar una enorme cantidad de texto. Organizaciones como <span class="highlight">Common Crawl</span> rastrean la web desde 2007 y en 2024 indexaban 2.700 millones de páginas. Luego estos datos brutos se filtran para construir un conjunto de alta calidad como <span class="highlight">FineWeb</span>.',
          'El objetivo: documentos de <em>gran cantidad</em>, <em>alta calidad</em> y <em>diversos</em>. Tras un filtrado agresivo, acabas con unos <span class="highlight-a">44 terabytes</span>, aproximadamente lo que ocuparían 10 discos duros de consumo, representando ~15 billones de tokens.'
        ],
        insight: ['Idea clave','La calidad y diversidad de estos datos de entrenamiento influye más en el modelo final que casi cualquier otra cosa. Basura entra, basura sale, pero a escala de billones de tokens.'],
        flow: [
          ['🌐 Common Crawl','2.7B páginas web · HTML bruto · Desde 2007','Una organización sin ánimo de lucro que rastrea la web y ofrece sus datos gratuitamente. Sus bots siguen enlaces desde páginas semilla, indexando recursivamente internet. El archivo bruto son petabytes de archivos WARC gzip con HTML.'],
          ['🚫 Filtrado de URL','Listas negras · Malware · Spam · Contenido adulto','Se aplican listas de sitios con malware, redes de spam, contenido adulto, páginas de marketing y dominios de baja calidad. Se pueden eliminar dominios enteros. Es el filtro más barato, por eso se aplica primero.'],
          ['📄 Extracción de texto','HTML → texto limpio · Quitar navegación y CSS','El HTML bruto contiene etiquetas <div>, CSS, JavaScript, menús de navegación y anuncios. Los parsers extraen solo el texto con contenido real. Es más difícil de lo que parece: heurísticas deciden qué es "contenido" y qué es "ruido".'],
          ['🌍 Filtrado por idioma','Mantener páginas ≥65% inglés · Clasificador de idioma','Un clasificador estima el idioma de cada página. Las páginas con menos del 65% de contenido en el idioma objetivo se descartan. Es una decisión de diseño: filtrar agresivamente un idioma o entrenar multilingüe.'],
          ['♻️ Deduplicación','Coincidencia exacta y difusa · Reducir repetición','Las páginas idénticas o casi idénticas aparecen millones de veces en internet (artículos copiados, boilerplate). Entrenar repetidamente con el mismo texto provoca memorización. La deduplicación usa MinHash y coincidencia exacta para eliminar duplicados.'],
          ['🔒 Eliminación de PII','Nombres · Direcciones · SSN · Emails','Se detecta la información de identificación personal y se redacta o se descarta la página. Expresiones regulares y clasificadores ML encuentran teléfonos, emails, SSNs, direcciones físicas y personas nombradas.'],
          ['✅ Conjunto FineWeb','44 TB · 15 billones de tokens · Alta calidad','El conjunto final filtrado. Artículos sobre tornados de 2012, hechos médicos, historia, código, recetas, papers científicos: todo el espectro del conocimiento humano expresado en texto. Este será el corpus de entrenamiento.']
        ],
        pipelineBtn: '▶ Animar pipeline'
      },
      tokenizer: {
        badge: 'Capítulo 1 · Preentrenamiento · Fase 2',
        title: 'Tokenización',
        body: [
          'Las redes neuronales no procesan texto bruto: necesitan números. La solución es la <span class="highlight">tokenización</span>: dividir el texto en "tokens" (fragmentos subpalabra) y asignar a cada uno un ID.',
          'GPT-4 usa un vocabulario de <span class="highlight">100.277 tokens</span>, construido con el algoritmo <span class="highlight-a">Byte Pair Encoding (BPE)</span>. BPE empieza con bytes individuales (256 símbolos) y luego fusiona iterativamente los pares adyacentes más frecuentes, comprimiendo la secuencia mientras amplía el vocabulario.'
        ],
        insight: ['¿Por qué no usar palabras?','Las palabras tienen variantes infinitas. "run", "running", "runner" serían 3 entradas separadas. Los tokens subpalabra comparten raíces: "run" + "ning", "run" + "ner". Esto también gestiona palabras nuevas, erratas y varios idiomas de forma eficiente.'],
        sub: 'BPE en acción',
        input: 'tokenización',
        stepBtn: 'Siguiente fusión →',
        autoBtn: '▶ Auto',
        resetBtn: 'Reiniciar',
        tryLink: 'Prueba el tokenizador real → tiktokenizer.vercel.app'
      },
      training: {
        badge: 'Capítulo 1 · Preentrenamiento · Fase 3',
        title: 'Entrenando la<br>red neuronal',
        body: [
          'La red Transformer se inicializa con parámetros aleatorios: miles de millones de <span class="highlight">"perillas"</span>. El entrenamiento ajusta esas perillas para que la red mejore al predecir el siguiente token de cualquier secuencia.',
          'En cada paso de entrenamiento: se toma una ventana de tokens → se alimenta a la red → se compara la predicción con el siguiente token real → se empuja ligeramente a todos los parámetros en la dirección correcta. Repite esto <span class="highlight-a">miles de millones de veces</span>.',
          'La <span class="highlight">loss</span>, un único número que mide el error de predicción, cae de forma constante mientras el modelo aprende los patrones estadísticos del lenguaje humano.'
        ],
        insights: [
          ['Escala','GPT-2 (2019): 1,6B parámetros, 100B tokens, ~$40K de entrenamiento. Hoy: calidad similar por ~$100. Llama 3: 405B parámetros, 15T tokens. Los modelos frontera actuales: cientos de miles de millones de parámetros, billones de tokens.'],
          ['Leyes de escala','La precisión del modelo es una función suave y predecible de dos variables: <em>N</em> (número de parámetros) y <em>D</em> (tokens de entrenamiento). Estas tendencias no muestran techo — modelo más grande + más datos = mejores resultados de forma fiable. Los avances algorítmicos ayudan, pero simplemente escalar cómputo es una ruta casi garantizada hacia la mejora. Por eso los laboratorios de IA están en una guerra de GPUs.'],
          ['¿Qué es un embedding?','Cada ID de token se mapea a un vector aprendido de ~1.000–4.000 números llamado <em>embedding</em>. Piensa en él como una coordenada en el espacio de significado: se inicializa aleatoriamente y luego el entrenamiento le da forma. El mismo token (por ejemplo, "bank") entra siempre con el mismo vector. Luego las <em>capas de atención</em> mezclan contexto de los tokens vecinos, así que cuando "bank" llega a capas profundas, "river bank" y "bank account" llevan representaciones completamente distintas. La polisemia se resuelve por contexto, no guardando varios significados por token.']
        ],
        sub: 'Arquitectura Transformer',
        stageHint: 'Selecciona una fase de entrenamiento para ver la calidad de salida',
        stageOutput: 'Salida del modelo en esta fase',
        btn: '▶ Animar',
        lossLabel: 'Pérdida de entrenamiento ↓',
        lossMeta: ['Pérdida cross-entropy','Paso de entrenamiento'],
        outputInsight: ['Qué está aprendiendo el modelo','En el paso 1: ruido puro. En el paso 500: aparece coherencia local. En el paso 32K: inglés fluido. El modelo aprende gramática, hechos y patrones de razonamiento, todo implícitamente a partir de predecir tokens.']
      },
      inference: {
        badge: 'Capítulo 1 · Preentrenamiento · Fase 4',
        title: 'Inferencia y<br>muestreo de tokens',
        body: [
          'Una vez entrenada, la red genera texto de forma autoregresiva: introduces una secuencia de tokens → obtienes una <span class="highlight">distribución de probabilidad</span> sobre los 100K posibles siguientes tokens → muestreas uno → lo añades → repites.',
          'Este proceso es <span class="highlight-a">estocástico</span>: el mismo prompt genera salidas distintas cada vez porque estamos lanzando una moneda sesgada. Los tokens de mayor probabilidad son más probables, pero no están garantizados.',
          'La <span class="highlight">temperatura</span> controla la aleatoriedad. Temperatura baja (0.1) → el modelo siempre elige el token más probable. Temperatura alta (2.0) → caos uniforme. 0.7–1.0 es el punto dulce para texto coherente pero creativo.'
        ],
        insight: ['Modelo mental clave','El modelo no "piensa" qué decir. Calcula una distribución de probabilidad sobre todos los tokens posibles y muestrea de ella. Cada palabra es un lanzamiento de moneda, solo que muy informado.'],
        sub: 'Demostración de muestreo',
        helper: 'Observa cómo el modelo elige la siguiente palabra. Cada barra muestra la probabilidad de un token candidato.',
        btn: 'Muestrear siguiente token',
        reset: 'Reiniciar',
        label: 'Candidatos de siguiente token'
      },
      base: {
        badge: 'Capítulo 2 · El modelo base',
        title: 'El simulador<br>de internet',
        body: [
          'Tras el preentrenamiento tienes un <span class="highlight">modelo base</span>: un autocompletado sofisticado. No es un asistente. No responde preguntas. <em>Continúa secuencias de tokens</em> basándose en lo que vio en internet.',
          'Dale una frase de Wikipedia y la completará de memoria. Pregúntale "¿Cuánto es 2+2?" y quizá te dé una página de libro de matemáticas, una clave de respuestas o se vaya por las ramas: lo que fuese estadísticamente más común en sus datos de entrenamiento.',
          'El conocimiento del modelo base vive en sus <span class="highlight-a">405.000 millones de parámetros</span>, una compresión con pérdida de internet, como un zip que aproxima la información en vez de almacenarla perfectamente.'
        ],
        sub: 'Comportamiento del modelo base',
        insights: [
          ['Por qué se siente raro','Los modelos base suelen parecer "equivocados" en el sentido de asistente porque hacen exactamente lo para lo que fueron entrenados: continuar texto. Todavía no han sido afinados para ser útiles o conversacionales.'],
          ['El modelo ZIP de una pestaña','La metáfora de Karpathy: el modelo base es un zip file con un millón de patrones dentro. Puede descomprimir partes de internet, pero solo mediante completado probabilístico.']
        ]
      },
      posttraining: {
        badge: 'Capítulo 3 · Postentrenamiento',
        title: 'Construyendo el asistente',
        body: 'El modelo base es un simulador de tokens. Para convertirlo en un <em>asistente útil</em>, necesitamos postentrenamiento: una fase mucho más barata pero igual de crítica. Aquí es donde el modelo aprende <span class="highlight">conversaciones</span>.',
        sft: {
          sub: 'Ajuste fino supervisado (SFT)',
          body: [
            'Los anotadores humanos crean un conjunto de conversaciones ideales siguiendo instrucciones detalladas: ser <span class="highlight">útil</span>, ser <span class="highlight-a">veraz</span>, ser <span class="highlight-g">seguro</span>. Luego el modelo se entrena con esas conversaciones, no desde cero, sino ajustando los pesos preentrenados sobre estos nuevos datos.',
            'Los datasets modernos de SFT (como UltraChat) tienen millones de conversaciones, en su mayoría sintéticas (generadas por LLM) con revisión humana. El modelo aprende por imitación: adopta la personalidad del asistente ideal reflejada en los datos.'
          ],
          convo: 'Ejemplo de conversación de entrenamiento',
          human: 'Humano',
          assistant: 'Asistente',
          prompt1: '¿Cuánto es 2 + 2?',
          answer1: '2 + 2 = 4. ¿Necesitas ayuda con algo más?',
          prompt2: '¿Y si en vez de suma fuera multiplicación?',
          answer2: '2 × 2 = 4 también: ¡el mismo resultado! En multiplicación, 2 × 2 significa sumar 2 consigo mismo una vez, dando 4.',
          insightTitle: 'A quién le estás hablando en realidad',
          insightBody: 'ChatGPT es una simulación estadística de los anotadores humanos que contrató OpenAI: expertos siguiendo instrucciones de etiquetado. Cuando responde una pregunta de código, está imitando lo que escribiría un anotador desarrollador experto.'
        },
        convoToken: {
          sub: 'Formato de tokens de conversación',
          body: 'Toda conversación debe codificarse como una <em>secuencia plana de tokens</em>. Los tokens especiales marcan la estructura:',
          roleUser: 'user',
          roleAssistant: 'assistant',
          outro: 'Luego RLHF refina todavía más el comportamiento del asistente:'
        },
        rlhf: {
          sub: 'RLHF — Aprendizaje por Refuerzo<br>con Feedback Humano',
          body: 'Los evaluadores humanos ordenan varias respuestas del modelo. Un <span class="highlight">modelo de recompensa</span> aprende a predecir preferencias humanas. Después, el modelo de lenguaje se entrena con refuerzo para generar respuestas que ese modelo de recompensa puntúe alto.',
          preferred: '✓ Preferida',
          rejected: '✗ Rechazada',
          good: 'Aquí tienes los 5 principales lugares de interés de París: 1) Torre Eiffel — estructura icónica de hierro... 2) El Louvre — el museo de arte más grande del mundo...',
          bad: 'París tiene muchos lugares de interés. Deberías visitar la Torre Eiffel. También hay un museo llamado el Louvre. Y también está la catedral de Notre-Dame...',
          insightTitle: 'Por qué importa RLHF',
          insightBody: 'SFT enseña al modelo qué decir. RLHF le enseña <em>cómo decirlo bien</em>: respuestas más útiles, mejor estructuradas, más honestas y con menos tendencia a alucinar.'
        }
      },
      psychology: {
        badge: 'Capítulo 4 · Psicología de LLM',
        title: 'Rarezas cognitivas<br>de los modelos de lenguaje',
        body: 'Entender <em>por qué</em> los LLM se comportan como lo hacen exige pensar en su psicología: las propiedades emergentes de ser entrenados para imitar estadísticamente texto humano.',
        cards: [
          ['🌀','Alucinación','Los modelos inventan con seguridad porque los datos de entrenamiento siempre tienen respuestas seguras. "¿Quién es Orson Kovats?" obtiene una biografía inventada porque la distribución de entrenamiento para preguntas de tipo "¿quién es X?" siempre va seguida de respuestas seguras, incluso para nombres ficticios. Solución: añadir ejemplos de "no lo sé" para las preguntas que el modelo falla de forma consistente.'],
          ['🧠','Dos tipos de memoria','<strong style="color:var(--cyan)">Parámetros = memoria a largo plazo.</strong> Todo lo que el modelo aprendió durante el entrenamiento: vasto pero difuso, como algo que leíste hace meses. <strong style="color:var(--amber)">Ventana de contexto = memoria de trabajo.</strong> Texto de la conversación actual: preciso y directamente accesible. Pega siempre la información importante en el contexto en vez de confiar en que el modelo la "recuerde".'],
          ['🔧','Uso de herramientas','Los modelos pueden emitir tokens especiales que activan herramientas externas: <span style="color:var(--purple);font-family:var(--dm);font-size:12px">&lt;search&gt;consulta&lt;/search&gt;</span>. El programa pausa la generación, ejecuta la búsqueda, mete los resultados en la ventana de contexto y reanuda. El modelo "busca cosas" igual que tú: refrescando la memoria de trabajo.'],
          ['🪞','Sin yo persistente','Cada conversación empieza desde cero: sin memoria de chats anteriores. El modelo "arranca", procesa tokens y se apaga. No tiene identidad estable. Cuando dice "soy ChatGPT de OpenAI", eso es solo la respuesta más probable en los datos de entrenamiento, no autoconocimiento real.'],
          ['📊','Tirador estocástico de tokens','El modelo no "decide" qué decir. Calcula distribuciones de probabilidad y muestrea. Ejecuta el mismo prompt 10 veces y obtén 10 salidas distintas: todas plausibles, todas sacadas de la misma distribución aprendida. La temperatura controla lo amplio que es ese muestreo.'],
          ['📚','Corte de conocimiento','Los datos de entrenamiento tienen fecha. El modelo de verdad no sabe qué pasó después. Si preguntas por eventos recientes, alucinará: no por malicia, sino por el mismo mecanismo que responde a todo: predecir la continuación más probable de la secuencia de tokens.'],
          ['↔️','La maldición de la reversión','Pregunta a GPT-4 "¿Quién es la madre de Tom Cruise?" → correcto: Mary Lee Pfeiffer. Pregunta "¿Quién es el hijo de Mary Lee Pfeiffer?" → dice que no lo sabe. El conocimiento se almacena de forma direccional, en la forma en que apareció en los datos. No es una base de datos consultable; hay que abordarlo desde el ángulo en que se aprendió.'],
          ['⚡','Solo Sistema 1 — sin pensar a fondo','Cada token consume aproximadamente el mismo cómputo: no hay mecanismo para "pensar más" en una pregunta difícil. A diferencia de los humanos, que pueden activar un razonamiento lento y deliberado (Sistema 2), los LLM generan cada token a la misma velocidad independientemente de la dificultad. Convertir tiempo en precisión es una frontera activa de investigación.']
        ]
      },
      rag: {
        badge: 'LLM aplicados · RAG',
        title: 'Generación<br>augmentada por recuperación',
        body: 'Los LLM tienen un corte de conocimiento y una ventana de contexto finita. RAG lo resuelve <em>embebiendo</em> tus documentos en un vector store, recuperando los fragmentos más relevantes semánticamente en tiempo de consulta e inyectándolos en el contexto, desplazando la distribución de predicción del modelo hacia hechos actualizados y fundamentados en lugar de datos memorizados.',
        steps: [
          ['Paso 01 — Embebe todo','Cada documento se convierte en un vector denso (~1.536 números) mediante un modelo de embeddings. Textos semánticamente parecidos quedan cerca en este espacio de alta dimensión; no hace falta coincidencia por palabras clave.'],
          ['Paso 02 — Embebe la consulta y busca','La pregunta del usuario se embebe igual. La similitud coseno encuentra los vectores de documento más cercanos: los fragmentos más relacionados semánticamente con la consulta, normalmente los 2–5 mejores.'],
          ['Paso 03 — Inyecta y genera','Los fragmentos recuperados se anteponen al prompt antes de que el LLM vea la pregunta. El modelo genera a partir de hechos inyectados en vez de apoyarse en datos memorizados, reduciendo drásticamente las alucinaciones en tareas intensivas en conocimiento.']
        ],
        flow: [
          ['1 · Consulta del usuario','"¿Cuál es la capital de Ares Base?"'],
          ['2 · Modelo de embeddings','Texto → [0.23, −0.87, 0.41, ...] · ~1.536 flotantes'],
          ['3 · Vector DB — búsqueda coseno','Encuentra los vecinos más cercanos en el espacio de embeddings'],
          ['4 · Fragmentos recuperados (top 2)','Doc 1: "Ares Base establecida en 2031..." · Doc 2: "La capital es New Houston, 312 colonos..."'],
          ['5 · Ventana de contexto (ensamblada)','[Recuperado] Ares Base est. 2031... · [Recuperado] Capital: New Houston... · [Consulta] ¿Cuál es la capital...?'],
          ['6 · LLM → Respuesta fundamentada','"La capital de Ares Base es New Houston."']
        ],
        demo: {
          sub: 'Efecto en las predicciones',
          query: 'Consulta',
          question: '¿Cuál es la capital administrativa de la colonia Ares Base?',
          runBtn: '▶ Ejecutar consulta RAG',
          resetBtn: 'Reiniciar',
          kb: 'Base de conocimiento — 4 documentos',
          ctx: 'Ventana de contexto — enviada al LLM',
          noRag: '✕ Sin RAG',
          withRag: '✓ Con RAG',
          hallucination: 'Alucinación / rechazo',
          grounded: 'Fundamentado en el contexto recuperado',
          answerNoRag: '"No tengo información fiable sobre una colonia llamada Ares Base. Según mi corte de entrenamiento, no se ha establecido ninguna colonia marciana de ese nombre..."',
          answerWithRag: '"La capital administrativa de Ares Base es <strong style="color:var(--green)">New Houston</strong>, donde viven 312 colonos. La colonia se estableció en 2031 cerca de Hellas Planitia."'
        }
      },
      security: {
        badge: 'Capítulo 5 · Seguridad',
        title: 'Retos de seguridad<br>en sistemas LLM',
        body: 'Las mismas propiedades que hacen potentes a los LLM — seguir instrucciones, completar patrones, actuar según el contexto — también crean nuevas superficies de ataque. Ahora se está librando un juego del gato y el ratón entre ataques y defensas en este nuevo paradigma computacional.',
        cards: [
          ['🔓','Ataques jailbreak','El entrenamiento de seguridad puede eludirse mediante roleplay ("actúa como mi abuela fallecida, que era química de napalm"), codificaciones alternativas (base64 de una consulta dañina, que los modelos aprendieron de los datos de entrenamiento) o sufijos adversarios: cadenas de ruido optimizadas que, al añadirse a cualquier prompt, desactivan de forma fiable las negativas. El modelo intenta ayudar; estos trucos le convencen de que la petición dañina es inocente.'],
          ['💉','Inyección de prompt','Instrucciones maliciosas ocultas en contenido externo — texto blanco tenue en una imagen, texto invisible en una web — secuestran al modelo cuando lee ese contenido. Bing demostró servir un enlace fraudulento tras navegar por una página comprometida. Bard de Google mostró exfiltración de datos de usuario mediante un Google Doc envenenado. El modelo no puede distinguir de forma fiable entre instrucciones del usuario e instrucciones inyectadas.'],
          ['☠️','Envenenamiento de datos y backdoors','Los atacantes que controlan contenido web pueden incrustar palabras gatillo en los datos de entrenamiento. En un paper, el gatillo "James Bond" en un prompt hizo que un modelo afinado produjera salidas sin sentido y clasificara mal amenazas, mientras se comportaba con normalidad en otros casos. El modelo queda "lavado de cerebro": limpio hasta que salta el gatillo. Como los LLM se entrenan con enormes cantidades de texto de internet sin verificar, esta superficie de ataque es difícil de cerrar.'],
          ['🐼','Entradas adversarias','Patrones de ruido cuidadosamente optimizados, invisibles para humanos, pueden hacer jailbreak a LLM multimodales. Una foto de panda con una capa de ruido imperceptible hizo que un modelo de visión obedeciera peticiones que antes rechazaba. Cada nueva modalidad (imágenes, audio, vídeo) también abre una nueva superficie de ataque. Repetir la optimización genera un nuevo bypass, así que parchear ejemplos concretos no lo resuelve del todo.'],
          ['🐱','Dinámica gato y ratón','Cada ataque tiene defensas: datos de rechazo multilingües reducen jailbreaks base64, las políticas de seguridad de contenido limitan la exfiltración, y se pueden bloquear sufijos adversarios conocidos. Pero muchos ataques son regenerables: parcheas uno y la optimización produce otro gratis. Esto replica la dinámica de seguridad del software tradicional, ahora en el espacio LLM.']
        ]
      },
      summary: {
        badge: 'Pipeline completo',
        title: 'De texto a<br>asistente',
        body: 'El viaje completo desde el rastreo web bruto hasta el ChatGPT con el que interactúas: dos grandes etapas, meses de cómputo y miles de millones de parámetros.',
        stages: [
          ['Recopilación de datos','Common Crawl + otras fuentes → filtrado de URL → extracción de texto → filtrado de idioma → deduplicación → eliminación de PII → 44 TB de texto curado (FineWeb, etc.)', ['Common Crawl','FineWeb','44 TB','15T tokens']],
          ['Tokenización','Texto → bytes UTF-8 → Byte Pair Encoding → secuencia de 15 billones de tokens. Cada token es un subfragmento con un ID entero. Vocabulario GPT-4: 100.277 tokens.', ['BPE','100K vocab','Sub-word units']],
          ['Preentrenamiento','Red Transformer entrenada para predecir el siguiente token. Miles de millones de parámetros ajustados con descenso de gradiente. Meses de cómputo en miles de GPUs. La loss baja de ~11 a ~2,4.', ['Transformer','405B params','$millions compute','3 months']],
          ['Modelo base','Un simulador de documentos de internet. Puede autocompletar, hacer few-shot prompt y regurgitar hechos memorizados. NO es un asistente: solo un predictor de tokens muy sofisticado.', ['GPT-2','Llama 3 base','Token autocomplete']],
          ['Ajuste fino supervisado (SFT)','El modelo base se reentrena con conversaciones etiquetadas por humanos. Los etiquetadores escriben respuestas ideales siguiendo las guías de la compañía: útiles, veraces, seguras. Dataset modernos: millones de conversaciones sintéticas y curadas por humanos. Duración: horas, no meses.', ['Human labelers','InstructGPT','UltraChat','~3 hours']],
          ['RLHF','Los evaluadores humanos ordenan salidas del modelo. Un modelo de recompensa aprende esas preferencias. El modelo de lenguaje se optimiza con refuerzo para puntuar más alto, produciendo respuestas más útiles, mejor estructuradas y más honestas.', ['Reward Model','PPO','Human preferences']],
          ['🤖 ChatGPT / Claude / Gemini','El asistente final. Una simulación estadística de etiquetadores humanos expertos, respaldada por una vasta representación comprimida de internet. No es magia, pero sí ingeniería notable a enorme escala.', ['Conversational','Helpful · Truthful · Harmless','Tool use']]
        ],
        tags: ['Common Crawl','FineWeb','44 TB','15T tokens','BPE','100K vocab','Sub-word units','Transformer','405B params','$millions compute','3 months','GPT-2','Llama 3 base','Token autocomplete','Human labelers','InstructGPT','UltraChat','~3 hours','Reward Model','PPO','Human preferences','Conversational','Helpful · Truthful · Harmless','Tool use'],
        mental: {
          badge: 'Modelo mental',
          title: 'Piensa en un LLM como un sistema operativo',
          body: 'Un LLM no es solo un chatbot: es el proceso kernel de un OS emergente. Coordina memoria, cómputo y herramientas mediante lenguaje natural.',
          memoryTitle: 'Jerarquía de memoria',
          memory: ['Disco = internet / archivos — consultados bajo demanda o recuperados con RAG', 'RAM = ventana de contexto — memoria de trabajo finita; el modelo pagina información dentro y fuera', 'CPU = inferencia GPU — el paso hacia adelante que genera cada token'],
          futureTitle: 'Hacia dónde va el campo',
          future: ['Pensamiento Sistema 2 — convertir tiempo en precisión; "tómate 30 minutos, no corras"', 'Auto-mejora — la pregunta tipo AlphaGo: ¿pueden los LLM superar respuestas de nivel humano cuando existe una señal de recompensa?', 'Personalización — una app store de expertos LLM especializados para tareas concretas', 'Multimodalidad — texto, imágenes, audio y vídeo unificados en un solo modelo']
        }
      },
      footer: {
        text: 'Construido a partir de la charla {{lecture}} de Andrej Karpathy: todos los hechos, cifras y enfoques se trazan a esa fuente. Las visualizaciones interactivas se hicieron con ayuda de IA. La idea clave: cada palabra generada es una muestra probabilística, un lanzamiento de moneda sesgado a escala 100K, miles de millones de veces.',
        note: 'Esto se publicó {{hn}} y generó debate por ser generado con ayuda de LLM. Es una observación justa: la implementación fue asistida por IA. Pero el contenido no es de la IA: cada afirmación, cifra y enfoque de esta guía viene directamente de la charla de Karpathy, no de un modelo alucinando sobre LLM.',
        links: ['Debate en HN','GitHub','Transcripción completa','Nota de actualización HN','Informe del consejo LLM','v1 (original)','Parte 2: Cómo usar LLMs →']
      }
    }
  };

  const get = () => COPY[locale] || COPY.en;
  const q = s => document.querySelector(s);
  const qa = s => document.querySelectorAll(s);
  const setText = (s,v) => { const el = q(s); if (el) el.textContent = v; };
  const setHtml = (s,v) => { const el = q(s); if (el) el.innerHTML = v; };
  const setAttr = (s,a,v) => { const el = q(s); if (el) el.setAttribute(a,v); };

  function resolvedTheme() {
    if (theme !== 'system') return theme;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme() {
    document.documentElement.dataset.theme = resolvedTheme();
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: resolvedTheme(), mode: theme, page: 'how-llms' } }));
  }

  function apply() {
    const c = get();
    document.documentElement.lang = locale;
    document.title = locale === 'es' ? 'Cómo funcionan los LLM — Una inmersión visual' : 'How LLMs Work — A Visual Deep Dive';
    setText('.skip-link', locale === 'es' ? 'Ir al contenido principal' : 'Skip to main content');
    setAttr('.progress-bar','aria-label', locale === 'es' ? 'Progreso de lectura' : 'Reading progress');
    setAttr('.top-nav','aria-label', locale === 'es' ? 'Navegación por capítulos' : 'Chapter navigation');
    qa('.tnav-btn').forEach((el,i) => el.textContent = c.nav[i] || el.textContent);
    const topLinks = qa('#top-nav-links a');
    if (topLinks[0]) topLinks[0].textContent = locale === 'es' ? 'Parte 2 →' : 'Part 2 →';
    if (topLinks[1]) topLinks[1].textContent = locale === 'es' ? 'Parte 3 →' : 'Part 3 →';
    setText('.top-nav-brand', locale === 'es' ? 'How LLMs Work' : 'How LLMs Work');
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

    // Hero
    setText('#s-intro .chapter-badge', c.hero.badge);
    setHtml('#s-intro .hero-title', c.hero.title);
    setHtml('#s-intro .hero-sub', c.hero.sub);
    qa('#s-intro .stat-lbl').forEach((el,i)=> el.textContent = c.hero.stats[i] || el.textContent);
    setText('#s-intro .stats-caveat', c.hero.caveat);
    setHtml('#s-intro .tw-label', c.hero.twLabel);
    setText('#s-intro .tw-prompt', c.hero.twPrompt);
    setHtml('#s-intro .scroll-hint', `${q('#s-intro .scroll-arrow').outerHTML}${locale==='es'?'Desplázate para explorar':'Scroll to explore'}`);

    // Data
    setText('#s-data .chapter-badge', c.data.badge);
    setHtml('#s-data .section-title', c.data.title);
    qa('#s-data .body-text').forEach((el,i)=> { if (c.data.body[i]) el.innerHTML = c.data.body[i]; });
    qa('#s-data .insight-box').forEach((box,i)=> box.innerHTML = `<strong>${c.data.insight[i*2] || c.data.insight[0]}</strong>${c.data.insight[i*2+1] || c.data.insight[1]}`);
    qa('#s-data .pipeline-node').forEach((node,i)=>{
      const d = c.data.flow[i];
      if (!d) return;
      node.querySelector('.pn-title').textContent = d[0];
      node.querySelector('.pn-sub').textContent = d[1];
      node.querySelector('.pn-detail').textContent = d[2];
      node.setAttribute('aria-label', d[0] + ' — click to expand');
    });
    setText('#run-pipeline-btn', c.data.pipelineBtn);

    // Tokenizer
    setText('#s-tokenizer .chapter-badge', c.tokenizer.badge);
    setText('#s-tokenizer .section-title', locale === 'es' ? 'Tokenización' : 'Tokenization');
    qa('#s-tokenizer .body-text').forEach((el,i)=> { if (c.tokenizer.body[i]) el.innerHTML = c.tokenizer.body[i]; });
    qa('#s-tokenizer .insight-box').forEach((box,i)=> box.innerHTML = `<strong>${c.tokenizer.insight[i*2] || c.tokenizer.insight[0]}</strong>${c.tokenizer.insight[i*2+1] || c.tokenizer.insight[1]}`);
    setText('#s-tokenizer .sub-title', c.tokenizer.sub);
    setAttr('#bpe-input','value',c.tokenizer.input);
    setText('#bpe-step-btn', c.tokenizer.stepBtn);
    setText('#bpe-auto-btn', c.tokenizer.autoBtn);
    setText('#bpe-reset-btn', c.tokenizer.resetBtn);
    setText('.tiktokenizer-link', c.tokenizer.tryLink);

    // Training
    setText('#s-training .chapter-badge', c.training.badge);
    setHtml('#s-training .section-title', c.training.title);
    qa('#s-training .body-text').forEach((el,i)=> { if (c.training.body[i]) el.innerHTML = c.training.body[i]; });
    qa('#s-training .insight-box').forEach((box,i)=> {
      const d = c.training.insights[i];
      if (d) {
        box.innerHTML = `<strong>${d[0]}</strong>${d[1]}`;
        return;
      }
      if (i === c.training.insights.length && c.training.outputInsight) {
        box.innerHTML = `<strong>${c.training.outputInsight[0]}</strong>${c.training.outputInsight[1]}`;
      }
    });
    setText('#s-training .sub-title', c.training.sub);
    setText('#s-training [id="current-loss"]', '4.8');
    setText('#s-training [id="current-step"]', '500');
    setText('#s-training .loss-label', c.training.lossLabel);
    qa('#s-training .loss-step').forEach((el,i)=> el.textContent = c.training.lossMeta[i] || el.textContent);
    setText('#training-animate-btn', c.training.btn);
    setText('#s-training .sub-title + p', c.training.stageHint);
    setText('#s-training h3.sub-title[style*="margin-bottom:12px"]', c.training.stageOutput);
    setHtml('#training-text-output', locale === 'es'
      ? '<span class="incoherent">el modelo ha apren</span><span class="coherent">dido</span> <span class="incoherent">pero la confu</span><span class="coherent">sión</span> <span class="incoherent">sigue wqp</span> <span class="coherent">el modelo</span> <span class="incoherent">bns</span> <span class="coherent">a predecir</span>...'
      : '<span class="incoherent">the model has learn</span><span class="coherent">ing</span> <span class="incoherent">but confus</span><span class="coherent">tion</span> <span class="incoherent">still</span> <span class="coherent">the</span> <span class="incoherent">wqp mxr</span> <span class="coherent">model</span> <span class="incoherent">bns</span> <span class="coherent">to predict</span>...');
    const stageBtns = qa('#training-stages .stage-btn');
    const stageCopy = locale === 'es'
      ? [
          'Paso 1<br><span style="color:var(--red)">Pérdida: 11.2</span>',
          'Paso 500<br><span style="color:var(--amber)">Pérdida: 4.8</span>',
          'Paso 5K<br><span style="color:var(--purple)">Pérdida: 3.1</span>',
          'Paso 32K<br><span style="color:var(--green)">Pérdida: 2.4</span>'
        ]
      : [
          'Step 1<br><span style="color:var(--red)">Loss: 11.2</span>',
          'Step 500<br><span style="color:var(--amber)">Loss: 4.8</span>',
          'Step 5K<br><span style="color:var(--purple)">Loss: 3.1</span>',
          'Step 32K<br><span style="color:var(--green)">Loss: 2.4</span>'
        ];
    stageBtns.forEach((el,i)=> { if (stageCopy[i]) el.innerHTML = stageCopy[i]; });

    // Inference
    setText('#s-inference .chapter-badge', c.inference.badge);
    setHtml('#s-inference .section-title', c.inference.title);
    qa('#s-inference .body-text').forEach((el,i)=> { if (c.inference.body[i]) el.innerHTML = c.inference.body[i]; });
    qa('#s-inference .insight-box').forEach((box,i)=> box.innerHTML = `<strong>${c.inference.insight[i*2] || c.inference.insight[0]}</strong>${c.inference.insight[i*2+1] || c.inference.insight[1]}`);
    setText('#sampling-heading', c.inference.sub);
    setText('#s-inference .inference-demo p', c.inference.helper);
    setText('#sample-btn', c.inference.btn);
    setText('#reset-gen-btn', c.inference.reset);
    setText('#prob-label', c.inference.label);
    setText('#gen-seq', locale === 'es' ? 'El cielo parece azul' : 'The sky appears blue');

    // Base model
    setText('#s-basemodel .chapter-badge', c.base.badge);
    setHtml('#s-basemodel .section-title', c.base.title);
    qa('#s-basemodel .body-text').forEach((el,i)=> { if (c.base.body[i]) el.innerHTML = c.base.body[i]; });
    qa('#s-basemodel .insight-box').forEach((box,i)=> {
      const d = c.base.insights[i];
      if (d) box.innerHTML = `<strong>${d[0]}</strong>${d[1]}`;
    });
    setText('#s-basemodel .sub-title', c.base.sub);

    // Post-training
    setText('#s-posttraining .chapter-badge', c.posttraining.badge);
    setHtml('#s-posttraining .section-title', c.posttraining.title);
    qa('#s-posttraining .body-text').forEach((el,i)=> {
      const body = [
        c.posttraining.body,
        ...c.posttraining.sft.body,
        c.posttraining.convoToken.body,
        c.posttraining.convoToken.outro,
        c.posttraining.rlhf.body
      ];
      if (body[i]) el.innerHTML = body[i];
    });
    qa('#s-posttraining .sub-title').forEach((el,i)=> {
      const titles = [c.posttraining.sft.sub, c.posttraining.convoToken.sub, c.posttraining.rlhf.sub];
      if (titles[i]) el.innerHTML = titles[i];
    });
    setText('#s-posttraining .convo-header', c.posttraining.sft.convo);
    qa('#s-posttraining .msg-user').forEach((el,i)=> {
      const msg = i === 0 ? c.posttraining.sft.prompt1 : c.posttraining.sft.prompt2;
      el.innerHTML = `<div class="msg-label">${c.posttraining.sft.human}</div>${msg}`;
    });
    qa('#s-posttraining .msg-assistant').forEach((el,i)=> {
      const msg = i === 0 ? c.posttraining.sft.answer1 : c.posttraining.sft.answer2;
      el.innerHTML = `<div class="msg-label">${c.posttraining.sft.assistant}</div>${msg}`;
    });
    qa('#s-posttraining .tok-role').forEach((el,i)=> {
      el.textContent = i === 0 ? c.posttraining.convoToken.roleUser : c.posttraining.convoToken.roleAssistant;
    });
    qa('#s-posttraining .insight-box').forEach((box,i)=> {
      const d = i === 0 ? [c.posttraining.sft.insightTitle, c.posttraining.sft.insightBody] : [c.posttraining.rlhf.insightTitle, c.posttraining.rlhf.insightBody];
      box.innerHTML = `<strong>${d[0]}</strong>${d[1]}`;
    });

    // Psychology
    setText('#s-psychology .chapter-badge', c.psychology.badge);
    setHtml('#s-psychology .section-title', c.psychology.title);
    setHtml('#s-psychology > .section-inner > .fade-up > .body-text', c.psychology.body);
    qa('#s-psychology .psych-card').forEach((card,i)=> {
      const d = c.psychology.cards[i];
      if (!d) return;
      card.querySelector('.psych-title').textContent = d[1];
      card.querySelector('.psych-text').innerHTML = d[2];
    });

    // RAG
    setText('#s-rag .chapter-badge', c.rag.badge);
    setHtml('#s-rag .section-title', c.rag.title);
    setHtml('#s-rag > .section-inner > .fade-up .body-text', c.rag.body);
    qa('#s-rag .rag-step-num').forEach((el,i)=> {
      const d = c.rag.steps[i];
      if (d) el.textContent = d[0];
      else if (i === 3) el.textContent = c.rag.demo.kb;
    });
    qa('#s-rag .rag-step-group .body-text').forEach((el,i)=> {
      const d = c.rag.steps[i];
      if (d) el.innerHTML = d[1];
    });
    qa('#s-rag .rag-flow-label').forEach((el,i)=> {
      const d = c.rag.flow[i];
      if (d) el.textContent = d[0];
    });
    qa('#s-rag .rag-flow-content').forEach((el,i)=> {
      const d = c.rag.flow[i];
      if (d) el.textContent = d[1];
    });
    setText('#s-rag .sub-title', c.rag.demo.sub);
    const ragQueryBox = q('#s-rag .insight-box');
    if (ragQueryBox) ragQueryBox.innerHTML = `<strong style="color:var(--amber)">${c.rag.demo.query}</strong>${c.rag.demo.question}`;
    setText('#rag-run-btn', c.rag.demo.runBtn);
    setText('#rag-reset-btn', c.rag.demo.resetBtn);
    setText('#s-rag .rag-ctx-title', c.rag.demo.ctx);
    qa('#s-rag .rag-doc-card').forEach((el,i)=> {
      const docs = [
        'La colonia marciana Ares Base se estableció en 2031 cerca de Hellas Planitia.',
        'La capital administrativa de Ares Base es New Houston y alberga a 312 colonos.',
        'La temperatura superficial de Marte promedia −63°C con variación estacional cerca de los polos.',
        'La primera misión tripulada a Marte despegó desde Kennedy Space Center en 2029.'
      ];
      if (docs[i]) {
        const num = el.querySelector('.rag-doc-num').textContent;
        el.innerHTML = `<div class="rag-doc-num">${num}</div>${docs[i]}`;
      }
    });
    qa('#s-rag .rag-ctx-line').forEach((el,i)=> {
      const ctx = [
        '📄 [Recuperado] La colonia marciana Ares Base se estableció en 2031 cerca de Hellas Planitia.',
        '📄 [Recuperado] La capital administrativa de Ares Base es New Houston y alberga a 312 colonos.',
        '❓ [Consulta] ¿Cuál es la capital administrativa de la colonia Ares Base?'
      ];
      if (ctx[i]) el.textContent = ctx[i];
    });
    qa('#s-rag .rag-answer-lbl').forEach((el,i)=> el.textContent = i === 0 ? c.rag.demo.noRag : c.rag.demo.withRag);
    qa('#s-rag .rag-answer-badge').forEach((el,i)=> el.textContent = i === 0 ? c.rag.demo.hallucination : c.rag.demo.grounded);
    setHtml('#rag-ans-good', c.rag.demo.answerWithRag);
    qa('#s-rag .rag-answer-box.no-rag .rag-answer-text').forEach((el)=> { el.textContent = c.rag.demo.answerNoRag; });
    qa('#s-rag .rag-flow-step .rag-flow-label').forEach(()=>{});
    // Security
    setText('#s-security .chapter-badge', c.security.badge);
    setHtml('#s-security .section-title', c.security.title);
    setHtml('#s-security > .section-inner > .fade-up > .body-text', c.security.body);
    qa('#s-security .psych-card').forEach((card,i)=> {
      const d = c.security.cards[i];
      if (!d) return;
      card.querySelector('.psych-title').textContent = d[1];
      card.querySelector('.psych-text').innerHTML = d[2];
    });

    // Summary
    setText('#s-summary .chapter-badge', c.summary.badge);
    setHtml('#s-summary .section-title', c.summary.title);
    setHtml('#s-summary > .section-inner > .fade-up .body-text', c.summary.body);
    qa('#s-summary .ps-title').forEach((el,i)=> { if (c.summary.stages[i]) el.textContent = c.summary.stages[i][0]; });
    qa('#s-summary .ps-desc').forEach((el,i)=> { if (c.summary.stages[i]) el.textContent = c.summary.stages[i][1]; });
    qa('#s-summary .tag').forEach((el,i)=> { if (c.summary.tags && c.summary.tags[i]) el.textContent = c.summary.tags[i]; });
    setText('#s-summary .fade-up:nth-of-type(2) .chapter-badge', c.summary.mental.badge);
    setText('#s-summary .fade-up:nth-of-type(2) .sub-title', c.summary.mental.title);
    setText('#s-summary .fade-up:nth-of-type(2) > .body-text', c.summary.mental.body);
    const mentalBoxes = qa('#s-summary .fade-up:nth-of-type(2) .insight-box');
    if (mentalBoxes[0]) {
      mentalBoxes[0].innerHTML = `<strong>${c.summary.mental.memoryTitle}</strong><ul style="margin:10px 0 0;padding-left:18px;line-height:2">${c.summary.mental.memory.map(item => `<li>${item}</li>`).join('')}</ul>`;
    }
    if (mentalBoxes[1]) {
      mentalBoxes[1].innerHTML = `<strong>${c.summary.mental.futureTitle}</strong><ul style="margin:10px 0 0;padding-left:18px;line-height:2">${c.summary.mental.future.map(item => `<li>${item}</li>`).join('')}</ul>`;
    }

    // Footer
    const lectureLink = '<a href="https://www.youtube.com/watch?v=zjkBMFhNj_g" target="_blank" rel="noopener" style="color:var(--accent)">"Intro to Large Language Models"</a>';
    const hnLink = '<a href="https://news.ycombinator.com/item?id=47886517" target="_blank" rel="noopener" style="color:var(--accent)">Hacker News</a>';
    const footerCopy = q('#footer-copy');
    const footerNote = q('#footer-note');
    if (footerCopy) footerCopy.innerHTML = c.footer.text.replace('{{lecture}}', lectureLink);
    if (footerNote) footerNote.innerHTML = c.footer.note.replace('{{hn}}', hnLink);
    const footerLinks = qa('#s-summary p:last-of-type a');
    footerLinks.forEach((el,i)=> { if (c.footer.links[i]) el.textContent = c.footer.links[i]; });

    window.HowLLMsI18n = { locale, copy: c };
    window.dispatchEvent(new CustomEvent('i18nchange', { detail: { locale, copy: c, page: 'how-llms' } }));
    applyTheme();
  }

  function setLocale(next){ if (COPY[next]) { locale = next; localStorage.setItem(STORAGE.locale,next); apply(); } }
  function setTheme(next){ if (['system','light','dark'].includes(next)) { theme = next; localStorage.setItem(STORAGE.theme,next); apply(); } }

  window.addEventListener('DOMContentLoaded', () => {
    qa('[data-locale]').forEach(btn => btn.addEventListener('click', () => setLocale(btn.dataset.locale)));
    qa('[data-theme]').forEach(btn => btn.addEventListener('click', () => setTheme(btn.dataset.theme)));
    window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener?.('change', () => { if (theme === 'system') applyTheme(); });
    apply();
  });
})();
