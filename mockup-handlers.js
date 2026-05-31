/*
 * mockup-handlers.js — wiring mock visual pra CTAs/forms em telas de mockup.
 * Nenhuma persistência: valida campos required, marca erros visualmente, toast.
 * Convenções:
 *  - Forms: intercepta submit; se houver input[required] vazio, marca campo + scroll + toast erro.
 *  - Botões "Salvar/Publicar/Aprovar/Entrar/Criar conta": ouvinte click com mesma validação no <form> ancestral.
 *  - Toast: usa #toast existente; cria um se não houver.
 */
(function () {
  function ensureToast() {
    var t = document.getElementById('toast');
    if (t) return t;
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'toast';
    t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#1A1A1A;color:#fff;padding:12px 18px;border-radius:8px;font-size:13px;box-shadow:0 8px 24px -4px rgba(0,0,0,.3);z-index:9999;opacity:0;transition:opacity .2s ease;pointer-events:none;';
    document.body.appendChild(t);
    return t;
  }
  function toast(msg, isError) {
    var t = ensureToast();
    t.textContent = msg;
    t.style.background = isError ? '#B91C1C' : '#1A1A1A';
    t.style.opacity = '1';
    clearTimeout(t._h);
    t._h = setTimeout(function () { t.style.opacity = '0'; }, 2400);
  }

  function clearErrors(form) {
    form.querySelectorAll('[data-mockup-err]').forEach(function (el) {
      el.style.borderColor = '';
      el.style.boxShadow = '';
      el.removeAttribute('data-mockup-err');
    });
  }
  function isFillable(el) {
    if (!el || el.disabled) return false;
    var tag = el.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
  }
  // Detecta required de forma heurística: attr [required], aria-required, ou label.req irmão
  function isRequired(el) {
    if (el.hasAttribute('required')) return true;
    if (el.getAttribute('aria-required') === 'true') return true;
    // Procura label.req imediatamente antes (ou no container)
    var p = el.closest('div');
    if (p) {
      var lbl = p.querySelector('label.req, .label.req');
      if (lbl) return true;
    }
    return false;
  }
  function isEmpty(el) {
    if (el.type === 'checkbox' || el.type === 'radio') return !el.checked;
    return !(el.value || '').trim();
  }
  function markError(el) {
    el.style.borderColor = '#DC2626';
    el.style.boxShadow = '0 0 0 3px rgba(220,38,38,.15)';
    el.setAttribute('data-mockup-err', '1');
  }
  function validateForm(form) {
    clearErrors(form);
    var first = null;
    var fields = form.querySelectorAll('input, textarea, select');
    fields.forEach(function (el) {
      if (!isFillable(el)) return;
      if (!isRequired(el)) return;
      if (isEmpty(el)) {
        markError(el);
        if (!first) first = el;
      }
    });
    if (first) {
      first.scrollIntoView({ behavior: 'smooth', block: 'center' });
      try { first.focus({ preventScroll: true }); } catch (_) { first.focus(); }
      return false;
    }
    return true;
  }

  // Mensagens contextuais por texto do botão / título da página
  function pickMessage(btnText, form) {
    var t = (btnText || '').toLowerCase();
    if (/entrar|login|sign in/.test(t)) return 'Login simulado (mockup)';
    if (/criar conta/.test(t)) return 'Conta criada (mockup)';
    if (/enviar.*link|enviar link|recuperar/.test(t)) return 'Link de recuperação enviado (mockup)';
    if (/redefinir|nova senha|salvar senha/.test(t)) return 'Senha redefinida (mockup)';
    if (/verificar|confirmar|validar c[óo]digo/.test(t)) return 'Código verificado (mockup)';
    if (/publicar/.test(t)) return 'Publicado (mockup)';
    if (/aprovar/.test(t)) return 'Aprovado (mockup)';
    if (/salvar rascunho|salvar/.test(t)) return 'Salvo (mockup)';
    return 'Ação simulada (mockup)';
  }

  function buttonHandler(e) {
    var btn = e.currentTarget;
    var form = btn.closest('form');
    var text = (btn.textContent || '').trim().replace(/\s+/g, ' ');
    if (form && !validateForm(form)) {
      toast('Preencha os campos obrigatórios', true);
      e.preventDefault();
      return;
    }
    toast(pickMessage(text, form));
    e.preventDefault();
  }
  function formSubmitHandler(e) {
    var form = e.currentTarget;
    var btn = form.querySelector('button[type="submit"]');
    var text = btn ? (btn.textContent || '').trim() : '';
    e.preventDefault();
    if (!validateForm(form)) {
      toast('Preencha os campos obrigatórios', true);
      return;
    }
    toast(pickMessage(text, form));
  }

  // Bind nos elementos
  var BTN_TEXT_RE = /^(entrar|criar conta.*|salvar( rascunho)?|publicar.*|aprovar.*|enviar.*link|redefinir senha|verificar|confirmar( c[óo]digo)?|validar c[óo]digo)$/i;

  function init() {
    // Forms: intercepta submit
    document.querySelectorAll('form').forEach(function (f) {
      if (f._mockupBound) return;
      f._mockupBound = true;
      f.addEventListener('submit', formSubmitHandler);
    });
    // Botões fora de form (type=button) com textos conhecidos
    document.querySelectorAll('button').forEach(function (b) {
      if (b._mockupBound) return;
      // Pula botões que já têm onclick definido (não sobrescreve handlers reais como togglePwd, openModal etc)
      if (b.getAttribute('onclick')) return;
      // Pula type=submit dentro de form (já tratado via form submit)
      if (b.type === 'submit' && b.closest('form')) return;
      var txt = (b.textContent || '').trim().replace(/\s+/g, ' ');
      if (!txt) return;
      if (!BTN_TEXT_RE.test(txt)) return;
      b._mockupBound = true;
      b.addEventListener('click', buttonHandler);
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
