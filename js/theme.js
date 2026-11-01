/* تم روشن / تیره — پیش‌فرض بر اساس تنظیم دستگاه، قابل تغییر با دکمه */
(function () {
  var root = document.documentElement;
  var KEY = 'theme';
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: light)') : null;

  function stored() {
    try { var t = localStorage.getItem(KEY); return (t === 'light' || t === 'dark') ? t : null; } catch (e) { return null; }
  }
  function systemTheme() { return mq && mq.matches ? 'light' : 'dark'; }
  function current() { return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark'; }

  function apply(t) {
    root.setAttribute('data-theme', t);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'theme-color'; document.head.appendChild(meta); }
    meta.content = t === 'light' ? '#f5f5fa' : '#07070f';
    document.querySelectorAll('.theme-toggle').forEach(function (b) {
      var label = t === 'light' ? 'تغییر به حالت شب' : 'تغییر به حالت روز';
      b.setAttribute('aria-label', label); b.title = label;
      b.setAttribute('aria-pressed', t === 'light' ? 'true' : 'false');
    });
    document.dispatchEvent(new CustomEvent('themechange', { detail: { theme: t } }));
  }

  function toggle() {
    var next = current() === 'light' ? 'dark' : 'light';
    try { localStorage.setItem(KEY, next); } catch (e) {}
    apply(next);
  }

  function makeButton(extraClass) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'theme-toggle' + (extraClass ? ' ' + extraClass : '');
    b.innerHTML = '<span class="ico-moon" aria-hidden="true">🌙</span><span class="ico-sun" aria-hidden="true">☀️</span>';
    b.addEventListener('click', toggle);
    return b;
  }

  function mount() {
    if (document.querySelector('.theme-toggle')) return;
    var navInner = document.querySelector('.nav-inner');
    var dashActions = document.querySelector('.dash-header-actions');
    var btn;
    if (navInner) {
      btn = makeButton();
      var mt = document.getElementById('mobileToggle');
      if (mt && mt.parentNode === navInner) navInner.insertBefore(btn, mt); else navInner.appendChild(btn);
    } else if (dashActions) {
      btn = makeButton();
      dashActions.insertBefore(btn, dashActions.firstChild);
    } else {
      btn = makeButton('theme-fab');
      document.body.appendChild(btn);
    }
    apply(current());
  }

  // اگر کاربر انتخابی نکرده، با تغییر تنظیم دستگاه هماهنگ شو
  if (mq) {
    var onSys = function () { if (!stored()) apply(systemTheme()); };
    if (mq.addEventListener) mq.addEventListener('change', onSys); else if (mq.addListener) mq.addListener(onSys);
  }
  // هماهنگی بین تب‌ها
  window.addEventListener('storage', function (e) {
    if (e.key === KEY) apply(stored() || systemTheme());
  });

  window.SiteTheme = { toggle: toggle, get: current, set: function (t) { try { localStorage.setItem(KEY, t); } catch (e) {} apply(t); } };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})();
