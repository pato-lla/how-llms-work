(function(){
  const STORAGE = { locale: 'how-llms-locale', theme: 'how-llms-theme' };
  const DATA = window.TRANSCRIPT_DATA || {};

  const q = s => document.querySelector(s);
  const qa = s => document.querySelectorAll(s);

  const browserLocale = (navigator.language || 'en').toLowerCase();
  let locale = localStorage.getItem(STORAGE.locale) || (browserLocale.startsWith('es') ? 'es' : 'en');
  let theme = localStorage.getItem(STORAGE.theme) || 'system';

  const resolvedTheme = () => {
    if (theme !== 'system') return theme;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const copyFor = () => DATA[locale] || DATA.en || { paragraphs: [], title: 'Full Transcript' };

  const applyTheme = () => {
    const resolved = resolvedTheme();
    document.documentElement.dataset.theme = resolved;
    document.documentElement.style.backgroundColor = resolved === 'dark' ? '#0B1220' : '#FFFFFF';
  };

  function render() {
    const copy = copyFor();
    document.documentElement.lang = locale;
    const siteTitle = copy.siteTitle || 'How LLMs Work';
    document.title = locale === 'es'
      ? `Transcripción completa — ${siteTitle}`
      : `Full Transcript — ${siteTitle}`;

    const title = q('#transcript-title');
    const badge = q('#transcript-badge');
    const subtitle = q('#transcript-subtitle');
    const sourceLabel = q('#transcript-source-label');
    const backLink = q('#back-link');
    const downloadCta = q('#download-cta');
    const source = q('#transcript-source');
    const article = q('#transcript-article');

    if (title) title.textContent = copy.title;
    if (badge) badge.textContent = copy.title;
    if (subtitle) subtitle.textContent = copy.subtitle;
    if (sourceLabel) sourceLabel.textContent = copy.sourceLabel;
    if (backLink) {
      backLink.textContent = copy.backLabel;
      if (copy.backHref) backLink.setAttribute('href', copy.backHref);
    }
    if (downloadCta) downloadCta.textContent = copy.downloadLabel;
    if (source) {
      source.textContent = copy.sourceText || 'Intro to Large Language Models';
      if (copy.sourceHref) source.setAttribute('href', copy.sourceHref);
    }

    if (article) {
      article.innerHTML = '';
      copy.paragraphs.forEach(paragraph => {
        const p = document.createElement('p');
        p.className = 'transcript-p';
        p.textContent = paragraph;
        article.appendChild(p);
      });
    }

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
  }

  function setLocale(next) {
    if (!DATA[next]) return;
    locale = next;
    localStorage.setItem(STORAGE.locale, locale);
    render();
  }

  function setTheme(next) {
    if (!['system', 'light', 'dark'].includes(next)) return;
    theme = next;
    localStorage.setItem(STORAGE.theme, theme);
    applyTheme();
    render();
  }

  function downloadTranscript() {
    const copy = copyFor();
    const blob = new Blob([copy.paragraphs.join('\n\n') + '\n'], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = copy.downloadFilename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 250);
  }

  document.addEventListener('DOMContentLoaded', () => {
    qa('[data-locale]').forEach(btn => btn.addEventListener('click', () => setLocale(btn.dataset.locale)));
    qa('[data-theme]').forEach(btn => btn.addEventListener('click', () => setTheme(btn.dataset.theme)));
    q('#download-cta')?.addEventListener('click', downloadTranscript);
    window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener?.('change', () => {
      if (theme === 'system') applyTheme();
    });
    applyTheme();
    render();
  });
})();
