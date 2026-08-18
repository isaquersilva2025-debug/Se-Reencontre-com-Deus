(function () {
  'use strict';

  /* ============================================================
     LINKS DE CHECKOUT — COLE AQUI OS LINKS REAIS DA KIWIFY
     ============================================================ */
  const ESSENCIAL_CHECKOUT_URL = 'https://pay.kiwify.com.br/rfyiVTj'; // plano ESSENCIAL (R$ 19,90)
  const COMPLETO_CHECKOUT_URL = 'https://pay.kiwify.com.br/UF2aOmG';  // EXPERIÊNCIA COMPLETA (R$ 29,90)

  document.querySelectorAll('[data-checkout]').forEach(function (el) {
    const kind = el.getAttribute('data-checkout');
    const url = kind === 'completo' ? COMPLETO_CHECKOUT_URL : ESSENCIAL_CHECKOUT_URL;
    if (url && url !== '#') {
      el.setAttribute('href', url);
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');
    }
  });

  /* ============================================================
     CRONÔMETRO — 30 minutos, persistente via localStorage,
     mostrado em 3 lugares (topo, planos, oferta completa)
     ============================================================ */
  const SESSION_KEY = 'offerSessionStart';
  const DURATION_MS = 30 * 60 * 1000;

  function getSessionStart() {
    let start = localStorage.getItem(SESSION_KEY);
    if (!start) {
      start = Date.now().toString();
      localStorage.setItem(SESSION_KEY, start);
    }
    return parseInt(start, 10);
  }

  function resetSession() {
    const newStart = Date.now().toString();
    localStorage.setItem(SESSION_KEY, newStart);
    return parseInt(newStart, 10);
  }

  function formatTime(ms) {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return m + ':' + s;
  }

  const timerEls = [
    document.getElementById('timerTop'),
    document.getElementById('timerPlans'),
    document.getElementById('timerOffer')
  ].filter(Boolean);

  const labelEls = [
    document.getElementById('plansTimerLabel'),
    document.getElementById('offerTimerLabel')
  ].filter(Boolean);

  let sessionStart = getSessionStart();
  let justRestarted = false;

  function tick() {
    const elapsed = Date.now() - sessionStart;
    const remaining = DURATION_MS - elapsed;

    if (remaining <= 0) {
      sessionStart = resetSession();
      justRestarted = true;
      labelEls.forEach(function (el) {
        const original = el.dataset.original || el.textContent;
        el.dataset.original = original;
        el.textContent = '✨ Nova sessão promocional iniciada';
      });
      setTimeout(function () {
        labelEls.forEach(function (el) {
          if (el.dataset.original) el.textContent = el.dataset.original;
        });
        justRestarted = false;
      }, 3200);
      return;
    }

    const text = formatTime(remaining);
    timerEls.forEach(function (el) {
      if (el.textContent !== text) {
        el.textContent = text;
        el.classList.remove('tick-flip');
        void el.offsetWidth; // reinicia a animação
        el.classList.add('tick-flip');
      }
    });
  }

  tick();
  setInterval(tick, 1000);

  /* ============================================================
     ANIMAÇÃO DE ENTRADA
     ============================================================ */
  window.addEventListener('load', function () {
    const intro = document.getElementById('intro');
    if (intro) {
      setTimeout(function () {
        intro.style.display = 'none';
      }, 1500);
    }
  });

  /* ============================================================
     SCROLL REVEAL (IntersectionObserver)
     ============================================================ */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('in-view');
    });
  }

  /* ============================================================
     PARALLAX SUTIL NO MOCKUP DA HERO
     ============================================================ */
  const parallaxEl = document.querySelector('.hero-parallax');
  if (parallaxEl && window.matchMedia('(min-width: 641px)').matches) {
    window.addEventListener('scroll', function () {
      const y = window.scrollY;
      parallaxEl.style.transform = 'translateY(' + (y * 0.06) + 'px)';
    }, { passive: true });
  }

  /* ============================================================
     FAQ ACCORDION
     ============================================================ */
  document.querySelectorAll('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const item = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-a');
      const expanded = btn.getAttribute('aria-expanded') === 'true';

      document.querySelectorAll('.faq-q').forEach(function (other) {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          other.closest('.faq-item').querySelector('.faq-a').style.maxHeight = null;
        }
      });

      btn.setAttribute('aria-expanded', String(!expanded));
      answer.style.maxHeight = expanded ? null : answer.scrollHeight + 'px';
    });
  });

  /* ============================================================
     EFEITO DE ONDA (RIPPLE) AO CLICAR EM BOTÕES
     ============================================================ */
  document.querySelectorAll('.btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      const rect = btn.getBoundingClientRect();
      const d = Math.max(rect.width, rect.height);
      const span = document.createElement('span');
      span.className = 'btn-ripple';
      span.style.width = span.style.height = d + 'px';
      span.style.left = (e.clientX - rect.left - d / 2) + 'px';
      span.style.top = (e.clientY - rect.top - d / 2) + 'px';
      btn.appendChild(span);
      setTimeout(function () { span.remove(); }, 600);
    });
  });

  /* ============================================================
     LINKS DO RODAPÉ (placeholders)
     ============================================================ */
  const footerLinks = {
    linkTermos: '#',
    linkPrivacidade: '#',
    linkContato: '#'
  };
  Object.keys(footerLinks).forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.setAttribute('href', footerLinks[id]);
  });

  /* ============================================================
     BLOQUEIA LINKS PLACEHOLDER — enquanto o link da Kiwify
     não for configurado, clicar em "#" não pode saltar a página
     ============================================================ */
  document.querySelectorAll('a[href="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
    });
  });

})();
