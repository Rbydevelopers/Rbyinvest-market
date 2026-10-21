/* RBY Invest – shared site menu.
   One file controls the top bar on EVERY page: [☰ menu] [logo].
   To add a new page to the menu: add one line to PAGES below, and add
   <script src="/site-nav.js" defer></script> in the new page's <head>. */
(function () {
  var PAGES = [
    { label: 'Home',           sub: 'RBY Invest',                         href: '/',                      match: /^\/(index\.html)?$/ },
    { label: 'Market Data',    sub: 'Rates, yields, indices & calendar', href: '/market/',               match: /^\/market\// },
    { label: 'Company Review', sub: 'Bits of Gold · investment report',  href: '/reviews/bits-of-gold/', match: /^\/reviews\/bits-of-gold\// }
    // { label: 'New page', sub: 'Short description', href: '/reviews/new-page/', match: /^\/reviews\/new-page\// },
  ];

  var css = '\
:root{--sitenav-h:58px}\
#siteNav{position:sticky;top:0;z-index:45;height:var(--sitenav-h);box-sizing:border-box;background:#fff;color:#0b2a55;border-bottom:1px solid #d9e1ee;box-shadow:0 2px 10px rgba(11,42,85,.12);direction:ltr;font-family:Inter,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}\
#siteNav .sn-in{display:flex;align-items:center;gap:12px;height:100%;max-width:1400px;margin:0 auto;padding:0 12px}\
#siteNav .sn-btn{flex:none;width:42px;height:42px;display:grid;place-items:center;border:1px solid #d9e1ee;background:#fff;color:#0b2a55;border-radius:10px;cursor:pointer;padding:0}\
#siteNav .sn-btn:hover,#siteNav .sn-btn[aria-expanded="true"]{background:#eef3fb}\
#siteNav .sn-btn svg{width:22px;height:22px}\
#siteNav .sn-brand{flex:none;display:block;line-height:0}\
#siteNav .sn-brand img{display:block;height:38px;width:auto}\
#siteNav .sn-panel{position:absolute;top:calc(100% + 6px);left:12px;width:min(320px,calc(100vw - 24px));background:#fff;border:1px solid #d9e1ee;border-radius:12px;box-shadow:0 16px 36px rgba(11,42,85,.28);overflow:hidden}\
#siteNav .sn-panel[hidden]{display:none}\
#siteNav .sn-panel a{display:block;text-decoration:none;color:#0b2a55;padding:12px 16px;border-top:1px solid #eef1f6}\
#siteNav .sn-panel a:first-child{border-top:0}\
#siteNav .sn-panel a b{display:block;font-size:16px;font-weight:700}\
#siteNav .sn-panel a span{display:block;margin-top:2px;font-size:13px;color:#64748b}\
#siteNav .sn-panel a:hover{background:#f4f7fc}\
#siteNav .sn-panel a[aria-current="page"]{background:#eaf1fc;box-shadow:inset 4px 0 0 #0b2a55}\
#siteNav .sn-back{position:fixed;inset:var(--sitenav-h) 0 0 0;z-index:-1;background:rgba(5,15,38,.35)}\
#siteNav .sn-back[hidden]{display:none}\
#siteNav a:focus-visible,#siteNav button:focus-visible{outline:2px solid #2563eb;outline-offset:2px}\
@media (max-width:420px){#siteNav .sn-in{gap:8px;padding:0 8px}#siteNav .sn-panel{left:8px}#siteNav .sn-brand img{height:34px}}\
@media print{#siteNav{display:none}}';

  function build() {
    if (document.getElementById('siteNav')) return;
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var path = location.pathname;
    var nav = document.createElement('nav');
    nav.id = 'siteNav'; nav.setAttribute('aria-label', 'Site');
    var items = PAGES.map(function (p) {
      var cur = p.match.test(path) ? ' aria-current="page"' : '';
      return '<a href="' + p.href + '" role="menuitem"' + cur + '><b>' + p.label + '</b><span>' + p.sub + '</span></a>';
    }).join('');
    nav.innerHTML =
      '<div class="sn-in">' +
        '<button type="button" class="sn-btn" id="snBtn" aria-label="Site menu" aria-haspopup="true" aria-expanded="false" aria-controls="snPanel">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M4 6.5h16M4 12h16M4 17.5h16"/></svg>' +
        '</button>' +
        '<a class="sn-brand" href="/" aria-label="RBY Invest – home"><img src="/rby-logo.jpg" alt="RBY Invest" width="900" height="285"></a>' +
      '</div>' +
      '<div class="sn-panel" id="snPanel" role="menu" hidden>' + items + '</div>' +
      '<div class="sn-back" id="snBack" hidden></div>';
    document.body.insertBefore(nav, document.body.firstChild);

    var btn = nav.querySelector('#snBtn'), panel = nav.querySelector('#snPanel'), back = nav.querySelector('#snBack');
    function set(open) {
      panel.hidden = back.hidden = !open;
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    btn.addEventListener('click', function () { set(panel.hidden); });
    back.addEventListener('click', function () { set(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) { set(false); btn.focus(); } });
  }
  if (document.body) build(); else document.addEventListener('DOMContentLoaded', build);
})();
