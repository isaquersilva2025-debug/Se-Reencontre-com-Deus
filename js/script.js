/* ==========================================================================
   SE REENCONTRE COM DEUS — script.js
   JavaScript vanilla, sem dependências.
   ========================================================================== */

/* ==========================================================================
   CONFIGURAÇÃO CENTRAL — LINKS DE CHECKOUT
   --------------------------------------------------------------------------
   Substitua os placeholders abaixo pelos links reais do seu checkout
   (ex.: https://pay.kiwify.com.br/xxxx ou https://pay.hotmart.com/xxxx).
   Todos os botões de compra usam estas constantes automaticamente.
   ========================================================================== */
const ESSENCIAL_CHECKOUT_URL = '#'; // TODO: link real do plano ESSENCIAL
const COMPLETO_CHECKOUT_URL = '#';  // TODO: link real da EXPERIÊNCIA COMPLETA

/* ==========================================================================
   HELPERS
   ========================================================================== */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.documentElement.classList.add('js');

/* ==========================================================================
   1. ANIMAÇÃO DE ENTRADA (~1s)
   ========================================================================== */
(function initIntro() {
  const intro = $('#intro');
  if (!intro) return;

  if (prefersReducedMotion) {
    intro.remove();
    document.body.classList.add('intro-done');
    return;
  }

  // Sequência: nome → frase → fade-out → hero
  setTimeout(() => {
    document.body.classList.add('intro-done'); // dispara a entrada do hero
    intro.classList.add('intro-hide');
    setTimeout(() => intro.remove(), 650);
  }, 1050);
})();

/* ==========================================================================
   2. CRONÔMETRO DA SESSÃO (30 minutos) — barra fixa + seções de planos
   --------------------------------------------------------------------------
   Guarda o timestamp do início da sessão em "offerSessionStart".
   Ao chegar a 00:00, mostra um aviso honesto e inicia uma nova sessão.
   ========================================================================== */
(function initCountdown() {
  const SESSION_MS = 30 * 60 * 1000;
  const KEY = 'offerSessionStart';
  const urgency = $('#urgency');
  const urgencyText = $('#urgencyText');
  const timerTop = $('#timerTop');
  const plansWrap = $('#plansTimerWrap');
  const plansLabel = $('#plansTimerLabel');
  const timerPlans = $('#timerPlans');

  if (!timerTop && !timerPlans) return;

  const DEFAULT_URGENCY = '<span class="urgency-main">🔥 OFERTA POR TEMPO LIMITADO</span><span class="urgency-end"> — termina em:</span>';
  const DEFAULT_PLANS = '⏳ Sua condição especial termina em:';

  const pad = (n) => String(n).padStart(2, '0');
  const format = (ms) => {
    const total = Math.max(0, Math.ceil(ms / 1000));
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${pad(m)}:${pad(s)}`;
  };

  // Inicia (ou recupera) a sessão no localStorage
  let sessionStart = (() => {
    try {
      const stored = parseInt(localStorage.getItem(KEY), 10);
      if (Number.isFinite(stored) && Date.now() - stored < SESSION_MS) return stored;
    } catch (e) { /* localStorage indisponível — segue sem persistência */ }
    const fresh = Date.now();
    try { localStorage.setItem(KEY, String(fresh)); } catch (e) { /* ignora */ }
    return fresh;
  })();

  let lastNewSessionAt = 0;

  function flash(el) {
    if (!el) return;
    el.classList.remove('flash');
    void el.offsetWidth; // reinicia a animação
    el.classList.add('flash');
    setTimeout(() => el.classList.remove('flash'), 1200);
  }

  function swapLabel(el, text, revertTo, ms) {
    if (!el) return;
    const original = el.innerHTML;
    el.innerHTML = text;
    setTimeout(() => { el.innerHTML = original; }, ms);
  }

  function announceNewSession() {
    const now = Date.now();
    if (now - lastNewSessionAt < 8000) return; // evita repetição em loop
    lastNewSessionAt = now;

    // Animação + aviso honesto: uma nova sessão promocional começou
    flash(urgency);
    flash(plansWrap);

    swapLabel(urgencyText, '✨ Nova sessão promocional iniciada', DEFAULT_URGENCY, 5000);
    swapLabel(plansLabel, '✨ Nova sessão promocional iniciada', DEFAULT_PLANS, 5000);
  }

  function tick() {
    const now = Date.now();
    let remaining = sessionStart + SESSION_MS - now;

    if (remaining <= 0) {
      // Nova sessão: reinicia o contador, sem afirmar que a oferta acabou para sempre
      sessionStart = now;
      try { localStorage.setItem(KEY, String(sessionStart)); } catch (e) { /* ignora */ }
      remaining = SESSION_MS;
      announceNewSession();
    }

    const text = format(remaining);
    if (timerTop) {
      timerTop.textContent = text;
      // pulso sutil do número a cada segundo que passa
      timerTop.classList.remove('pulse');
      void timerTop.offsetWidth;
      timerTop.classList.add('pulse');
    }
    // fade/flip rápido a cada segundo no cronômetro da seção de planos
    if (timerPlans) {
      timerPlans.textContent = text;
      timerPlans.classList.remove('tick');
      void timerPlans.offsetWidth;
      timerPlans.classList.add('tick');
    }
  }

  tick();
  setInterval(tick, 1000);

  // Ao voltar para a aba, atualiza imediatamente
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) tick();
  });
})();

/* ==========================================================================
   3. SCROLL REVEAL (Intersection Observer)
   ========================================================================== */
(function initReveal() {
  const items = $$('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });

  items.forEach((el) => io.observe(el));
})();

/* ==========================================================================
   4. CAROUSEL — "Veja por dentro"
   ========================================================================== */
(function initCarousel() {
  const track = $('#carouselTrack');
  const prevBtn = $('#carouselPrev');
  const nextBtn = $('#carouselNext');
  const count = $('#carouselCount');
  if (!track || !prevBtn || !nextBtn || !count) return;

  const slides = $$('.carousel-slide', track);
  const total = slides.length;
  const mq = window.matchMedia('(min-width: 901px)');
  const pad = (n) => String(n).padStart(2, '0');

  let perView = mq.matches ? 3 : 1;
  let idx = 0;

  function render() {
    idx = Math.min(idx, total - perView);
    track.style.transform = `translateX(-${(idx * 100) / perView}%)`;
    count.textContent = `${pad(idx + 1)} / ${pad(total)}`;
  }

  prevBtn.addEventListener('click', () => { idx = Math.max(0, idx - 1); render(); });
  nextBtn.addEventListener('click', () => { idx = Math.min(total - perView, idx + 1); render(); });

  mq.addEventListener('change', (e) => {
    perView = e.matches ? 3 : 1;
    render();
  });

  // Suporte a gesto de arrastar (bônus mobile)
  let startX = null;
  track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', (e) => {
    if (startX === null) return;
    const delta = e.changedTouches[0].clientX - startX;
    if (Math.abs(delta) > 40) {
      if (delta < 0) idx = Math.min(total - perView, idx + 1);
      else idx = Math.max(0, idx - 1);
      render();
    }
    startX = null;
  }, { passive: true });

  render();
})();

/* ==========================================================================
   5. FAQ — ACCORDION
   ========================================================================== */
(function initFaq() {
  const items = $$('.faq-item');
  items.forEach((item) => {
    const btn = $('.faq-q', item);
    const panel = $('.faq-a', item);
    if (!btn || !panel) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Fecha os demais
      items.forEach((other) => {
        other.classList.remove('open');
        const otherPanel = $('.faq-a', other);
        if (otherPanel) otherPanel.style.maxHeight = null;
        const otherBtn = $('.faq-q', other);
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();

/* ==========================================================================
   6. BOTÕES DE COMPRA — links centralizados
   ========================================================================== */
(function initCheckout() {
  const links = {
    essencial: ESSENCIAL_CHECKOUT_URL,
    completo: COMPLETO_CHECKOUT_URL,
  };

  $$('[data-checkout]').forEach((el) => {
    el.addEventListener('click', (e) => {
      const url = links[el.dataset.checkout];
      if (url && url !== '#') return; // link real configurado — segue normalmente
      // Placeholder: âncoras internas (ex.: #planos) continuam funcionando;
      // apenas bloqueia o salto para o topo em links com href="#".
      if (el.getAttribute('href') === '#') e.preventDefault();
    });
  });

  // Qualquer link placeholder (#) sem destino real não deve "pular" a página
  $$('a[href="#"]').forEach((a) => {
    a.addEventListener('click', (e) => e.preventDefault());
  });
})();

/* ==========================================================================
   7. CTA FIXO MOBILE
   ========================================================================== */
(function initMobileCta() {
  const bar = $('#mobileCta');
  const offer = $('#planos');
  if (!bar) return;

  const mq = window.matchMedia('(max-width: 720px)');
  let visible = false;

  const update = () => {
    if (!mq.matches) { bar.classList.remove('show'); return; }

    const pastHero = window.scrollY > window.innerHeight * 0.9;
    const offerVisible = offer
      ? offer.getBoundingClientRect().top < window.innerHeight * 0.75
      : false;

    const shouldShow = pastHero && !offerVisible;
    if (shouldShow !== visible) {
      visible = shouldShow;
      bar.classList.toggle('show', shouldShow);
    }
  };

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  mq.addEventListener('change', update);
  update();
})();

/* ==========================================================================
   8. PARALLAX SUTIL NO MOCKUP DO HERO
   ========================================================================== */
(function initParallax() {
  const el = $('.hero-parallax');
  const hero = document.querySelector('.hero');
  if (!el || !hero || prefersReducedMotion) return;

  const limit = hero.offsetHeight;
  let raf = null;

  const update = () => {
    raf = null;
    const y = window.scrollY;
    if (y < limit) {
      // mockup “fica para trás” ao rolar — sensação de profundidade
      el.style.transform = `translateY(${(y * 0.08).toFixed(1)}px)`;
    }
  };

  window.addEventListener('scroll', () => {
    if (!raf) raf = requestAnimationFrame(update);
  }, { passive: true });
})();

/* ==========================================================================
   9. RODAPÉ — links de exemplo (substituir pelos reais quando existirem)
   ========================================================================== */
(function initFooterLinks() {
  const TERMOS_URL = '#';        // TODO: link real dos Termos de Uso
  const PRIVACIDADE_URL = '#';   // TODO: link real da Política de Privacidade
  const CONTATO_URL = '#';       // TODO: link real de contato

  const set = (id, url) => {
    const el = document.getElementById(id);
    if (el && url && url !== '#') el.href = url;
  };
  set('linkTermos', TERMOS_URL);
  set('linkPrivacidade', PRIVACIDADE_URL);
  set('linkContato', CONTATO_URL);
})();
