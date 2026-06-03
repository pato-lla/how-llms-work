import fs from 'node:fs/promises';

const args = Object.fromEntries(process.argv.slice(2).map(pair => {
  const [key, value] = pair.split('=');
  return [key.replace(/^--/, ''), value];
}));

const INPUT = new URL(args.input || '../transcript.txt', import.meta.url);
const OUTPUT = new URL(args.output || '../transcript-data.js', import.meta.url);
const EN_MAX_CHARS = Number(args.maxChars || 1000);
const CONCURRENCY = Number(args.concurrency || 3);
const SITE_TITLE = args.siteTitle || 'How LLMs Work';
const SOURCE_TEXT = args.sourceText || 'Intro to Large Language Models';
const SOURCE_HREF = args.sourceHref || 'https://www.youtube.com/watch?v=zjkBMFhNj_g';
const BACK_LABEL_EN = args.backLabelEn || '← Back to Part 1';
const BACK_LABEL_ES = args.backLabelEs || '← Volver a la Parte 1';
const BACK_HREF = args.backHref || 'index.html';
const TITLE = args.title || 'Full Transcript';
const SUBTITLE = args.subtitle || 'A cleaned reading version of Andrej Karpathy\'s lecture transcript, split into readable paragraphs.';
const SPANISH_TITLE = args.spanishTitle || 'Transcripción completa';
const SPANISH_SUBTITLE = args.spanishSubtitle || 'Una versión de lectura limpia de la transcripción de la charla de Andrej Karpathy, separada en párrafos legibles.';
const DOWNLOAD_EN = args.downloadFilenameEn || 'karpathy-transcript-en.txt';
const DOWNLOAD_ES = args.downloadFilenameEs || 'karpathy-transcript-es.txt';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function chunkByLines(text, maxChars) {
  const lines = text
    .replace(/\r\n/g, '\n')
    .split(/\n+/)
    .map(line => line.trim())
    .filter(Boolean);

  const chunks = [];
  let current = [];
  let length = 0;

  for (const line of lines) {
    const nextLength = length + line.length + (current.length ? 1 : 0);
    if (current.length && nextLength > maxChars) {
      chunks.push(current.join(' '));
      current = [line];
      length = line.length;
      continue;
    }
    current.push(line);
    length = nextLength;
  }

  if (current.length) chunks.push(current.join(' '));
  return chunks;
}

async function translateGoogle(text) {
  const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&q=' + encodeURIComponent(text);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Translation request failed: ${response.status} ${response.statusText}`);
  }
  const payload = await response.json();
  return (payload?.[0] || []).map(part => part?.[0] || '').join('').trim();
}

async function translateWithRetry(text, index, total) {
  let lastError;
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    try {
      const translated = await translateGoogle(text);
      if (!translated) {
        throw new Error('Empty translation result');
      }
      process.stdout.write(`\rTranslated ${index + 1}/${total}`);
      return translated;
    } catch (error) {
      lastError = error;
      await sleep(350 * attempt);
    }
  }
  throw lastError;
}

async function mapLimit(items, limit, mapper) {
  const results = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await mapper(items[index], index, items.length);
    }
  }
  await Promise.all(Array.from({ length: limit }, worker));
  return results;
}

const source = await fs.readFile(INPUT, 'utf8');
const paragraphs = chunkByLines(source, EN_MAX_CHARS);
const translated = await mapLimit(paragraphs, CONCURRENCY, translateWithRetry);

const data = {
  en: {
    title: TITLE,
    subtitle: SUBTITLE,
    siteTitle: SITE_TITLE,
    sourceText: SOURCE_TEXT,
    sourceHref: SOURCE_HREF,
    sourceLabel: 'Source lecture',
    backLabel: BACK_LABEL_EN,
    backHref: BACK_HREF,
    downloadLabel: 'Download .txt',
    langLabel: 'Transcript language',
    paragraphs,
    downloadFilename: DOWNLOAD_EN,
  },
  es: {
    title: SPANISH_TITLE,
    subtitle: SPANISH_SUBTITLE,
    siteTitle: SITE_TITLE,
    sourceText: SOURCE_TEXT,
    sourceHref: SOURCE_HREF,
    sourceLabel: 'Charla fuente',
    backLabel: BACK_LABEL_ES,
    backHref: BACK_HREF,
    downloadLabel: 'Descargar .txt',
    langLabel: 'Idioma de la transcripción',
    paragraphs: translated,
    downloadFilename: DOWNLOAD_ES,
  }
};

await fs.writeFile(
  OUTPUT,
  `window.TRANSCRIPT_DATA = ${JSON.stringify(data).replace(/</g, '\\u003c')};\n`,
  'utf8'
);

process.stdout.write(`\nWrote ${OUTPUT.pathname}\n`);
