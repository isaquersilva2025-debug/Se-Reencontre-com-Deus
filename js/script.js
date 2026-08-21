(function () {
  'use strict';

  /* PROGRESS */
  var progress = document.getElementById('progress');
  if (progress) {
    window.addEventListener('scroll', function () {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
    }, { passive: true });
  }

  /* MOBILE MENU */
  var navToggle = document.getElementById('navToggle');
  var mobileMenu = document.getElementById('mobileMenu');
  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.contains('open');
      mobileMenu.classList.toggle('open');
      navToggle.classList.toggle('active');
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  /* SCROLL REVEAL */
  var animEls = document.querySelectorAll('.anim');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var delay = parseInt(entry.target.getAttribute('data-delay') || '0', 10);
          setTimeout(function () { entry.target.classList.add('in-view'); }, delay * 100);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    animEls.forEach(function (el) { io.observe(el); });
  } else {
    animEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* FAQ */
  document.querySelectorAll('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var answer = item.querySelector('.faq-a');
      var expanded = btn.getAttribute('aria-expanded') === 'true';
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

  /* SMOOTH SCROLL */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = a.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* NAV SCROLL */
  var nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.style.boxShadow = window.scrollY > 10 ? '0 2px 12px rgba(0,0,0,0.06)' : 'none';
    }, { passive: true });
  }

  /* EMAIL MODAL + META PIXEL */
  var emailModal = document.getElementById('emailModal');
  var emailForm = document.getElementById('emailForm');
  var emailInput = document.getElementById('emailInput');
  var emailModalClose = document.getElementById('emailModalClose');
  var emailModalOverlay = document.getElementById('emailModalOverlay');
  var checkoutUrl = 'https://pay.kiwify.com.br/UF2aOmG';

  function openEmailModal(e) {
    if (e) e.preventDefault();
    emailModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(function () { emailInput.focus(); }, 300);
  }

  function closeEmailModal() {
    emailModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (emailModal) {
    emailModalClose.addEventListener('click', closeEmailModal);
    emailModalOverlay.addEventListener('click', closeEmailModal);
  }

  /* Todos os botões de checkout abrem o modal */
  document.querySelectorAll('a[href*="kiwify"]').forEach(function (btn) {
    btn.addEventListener('click', openEmailModal);
  });

  /* Ao enviar o email, redireciona pro checkout */
  if (emailForm) {
    emailForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = emailInput.value.trim();
      if (!email) return;

      /* Envia InitiateCheckout com email (melhora Event Match Quality) */
      if (typeof fbq === 'function') {
        fbq('track', 'InitiateCheckout', {
          value: 19.90,
          currency: 'BRL'
        }, { em: email });
      }

      /* Redireciona pro checkout */
      window.open(checkoutUrl, '_blank');
      closeEmailModal();
    });
  }

  /* BLOCK PLACEHOLDERS */
  document.querySelectorAll('a[href="#"]').forEach(function (a) {
    if (!a.closest('.faq-q')) {
      a.addEventListener('click', function (e) { e.preventDefault(); });
    }
  });

})();
