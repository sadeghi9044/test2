(function () {
  /* ============ مقادیر پیش‌فرض ============ */
  const DEFAULTS = {
    // برندینگ
    siteTitle: 'سایت‌ساز | سایت خودت رو در چند دقیقه بساز',
    logoText: '◆ سایت‌ساز',
    logoImage: '',
    footerText: 'ساخته شده با ❤️ برای همه کسانی که می‌خوان آنلاین باشن.',

    // رنگ‌ها
    colorPrimary: '#8b5cf6',
    colorSecondary: '#ec4899',
    colorBg: '#0a0a14',
    colorBg2: '#10101f',
    colorCard: '#161628',
    colorText: '#f0f0ff',
    colorMuted: '#9ca3af',

    // Hero
    heroBadge: 'ورود با کد پیامکی — شروع رایگان',
    heroTitle: 'سایت خودت رو<br><span class="grad-text">در چند دقیقه</span> بساز',
    heroDesc: 'بدون نیاز به کدنویسی. یک قالب انتخاب کن، متن‌ها رو بنویس، و سایتت آماده‌ست. به همین سادگی.',
    heroBtn1: 'شروع رایگان',
    heroBtn2: 'تماشای دمو',
    heroBgImage: '',

    // نمایش بخش‌ها
    showFeatures: true,
    showDemo: true,
    showShowcase: true,
    showSteps: true,
    showStats: true,
    showCTA: true,

    // تماس
    contactEmail: 'hello@yoursite.com',
    contactPhone: '۰۲۱ - ۱۲۳۴ ۵۶۷۸',
    contactAddress: 'تهران، خیابان ولیعصر، پلاک ۱۲۳، طبقه ۴',
    contactHours: 'شنبه تا چهارشنبه، ۹ صبح تا ۶ عصر',

    // آمار
    stat1Value: 6,     stat1Label: 'قالب آماده',
    stat2Value: 5,     stat2Label: 'دقیقه تا اولین سایت',
    stat3Value: 0,     stat3Label: 'تومان هزینه‌ی شروع',
    stat4Value: 100,   stat4Label: 'درصد فارسی و راست‌چین'
  };

  window.SITE_DEFAULTS = DEFAULTS;

  /* ============ بارگذاری ============ */
  function loadSettings() {
    // تنظیمات از سرور می‌آید (server/index.js آن را بالای همین فایل تزریق می‌کند)
    const saved = window.__SERVER_SETTINGS;
    if (saved && typeof saved === 'object') return Object.assign({}, DEFAULTS, saved);
    return Object.assign({}, DEFAULTS);
  }

  const settings = loadSettings();
  window.SITE_SETTINGS = settings;

  /* ============ اعمال متغیرهای CSS (فوری) ============ */
  function applyCSSVars(s) {
    // رنگ‌های برند در هر دو تم اعمال می‌شن؛ رنگ‌های پس‌زمینه/متن فقط برای تم تیره
    // (تم روشن پالت خودش رو از pro.css می‌گیره). با <style> اعمال می‌شه نه inline،
    // تا قانون‌های [data-theme="light"] بتونن override کنن.
    var css =
      ':root{--secondary:' + s.colorSecondary + ';--grad:linear-gradient(135deg,' + s.colorPrimary + ',' + s.colorSecondary + ');}' +
      ':root:not([data-theme="light"]){--primary:' + s.colorPrimary + ';--bg:' + s.colorBg + ';--bg2:' + s.colorBg2 +
      ';--card:' + s.colorCard + ';--text:' + s.colorText + ';--muted:' + s.colorMuted + ';}' +
      ':root[data-theme="light"]{--primary:' + s.colorPrimary + ';}';
    var el = document.getElementById('site-vars');
    if (!el) { el = document.createElement('style'); el.id = 'site-vars'; (document.head || document.documentElement).appendChild(el); }
    el.textContent = css;
  }
  applyCSSVars(settings);

  /* ============ توابع امن‌سازی ============ */
  function escHTML(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  }
  // فقط <br> و <span class="grad-text"> مجازند
  function safeTitle(v) {
    return escHTML(v)
      .replace(/&lt;br\s*\/?&gt;/gi, '<br>')
      .replace(/&lt;span class=&quot;grad-text&quot;&gt;/gi, '<span class="grad-text">')
      .replace(/&lt;\/span&gt;/gi, '</span>');
  }
  function safeUrl(v) {
    return String(v == null ? '' : v).replace(/["'\\()\s<>]/g, '');
  }

  /* ============ اعمال تغییرات DOM ============ */
  function applyDOMChanges() {
    const s = loadSettings();

    // عنوان صفحه
    if (s.siteTitle) document.title = s.siteTitle;

    // لوگو (همه نمونه‌ها)
    document.querySelectorAll('.logo').forEach(function (el) {
      if (s.logoImage) {
        el.innerHTML = '<img src="' + escHTML(s.logoImage) + '" alt="logo" style="height:34px;vertical-align:middle;display:inline-block;">';
      } else if (s.logoText) {
        el.textContent = s.logoText;
      }
    });

    // فوتر
    const fp = document.querySelector('footer p');
    if (fp && s.footerText) fp.textContent = s.footerText;

    // Hero badge
    const badge = document.querySelector('.hero .badge');
    if (badge) badge.innerHTML = '<span class="dot"></span> ' + escHTML(s.heroBadge);

    // Hero title (HTML مجاز است)
    const ht = document.querySelector('.hero .hero-title');
    if (ht) ht.innerHTML = safeTitle(s.heroTitle);

    // Hero desc
    const hd = document.querySelector('.hero .hero-desc');
    if (hd) hd.textContent = s.heroDesc;

    // Hero buttons
    const hb = document.querySelector('.hero .hero-btns');
    if (hb) {
      const b1 = hb.querySelector('.btn-primary');
      const b2 = hb.querySelector('.btn-ghost');
      if (b1) b1.textContent = s.heroBtn1;
      if (b2) b2.textContent = s.heroBtn2;
    }

    // پس‌زمینه hero
    const hero = document.querySelector('.hero');
    if (hero) {
      if (s.heroBgImage) {
        hero.style.backgroundImage = 'linear-gradient(rgba(var(--bg-rgb),0.82), rgba(var(--bg-rgb),0.88)), url("' + safeUrl(s.heroBgImage) + '")';
        hero.style.backgroundSize = 'cover';
        hero.style.backgroundPosition = 'center';
        hero.style.backgroundAttachment = 'fixed';
      } else {
        hero.style.backgroundImage = '';
      }
    }

    // نمایش/مخفی بخش‌ها
    const sectionMap = {
      showFeatures: '.features',
      showDemo: '.demo-section',
      showShowcase: '.showcase',
      showSteps: '.steps',
      showStats: '.stats',
      showCTA: '.cta'
    };
    Object.keys(sectionMap).forEach(function (k) {
      document.querySelectorAll(sectionMap[k]).forEach(function (el) {
        el.style.display = s[k] ? '' : 'none';
      });
    });

    // اطلاعات تماس
    const cards = document.querySelectorAll('.contact-info .info-card');
    if (cards.length >= 4) {
      const setP = function (card, text) {
        const p = card.querySelector('p');
        if (p && text != null) p.textContent = text;
      };
      setP(cards[0], s.contactEmail);
      setP(cards[1], s.contactPhone);
      setP(cards[2], s.contactAddress);
      setP(cards[3], s.contactHours);
    }

    // آمار (باید قبل از اجرای main.js باشه)
    const stats = document.querySelectorAll('[data-count]');
    if (stats.length >= 4) {
      const setStat = function (el, v, l) {
        el.dataset.count = v;
        el.textContent = Number(v).toLocaleString('fa-IR');
        const lbl = el.parentElement.querySelector('.stat-label');
        if (lbl && l) lbl.textContent = l;
      };
      setStat(stats[0], s.stat1Value, s.stat1Label);
      setStat(stats[1], s.stat2Value, s.stat2Label);
      setStat(stats[2], s.stat3Value, s.stat3Label);
      setStat(stats[3], s.stat4Value, s.stat4Label);
    }
  }

  /* ============ اجرا در زمان مناسب ============ */
  if (document.body) {
    applyDOMChanges();
  } else {
    document.addEventListener('DOMContentLoaded', applyDOMChanges);
  }
})();