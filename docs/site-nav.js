/* RBY Invest – shared site menu.
   One file controls the top menu on EVERY page of the site.
   To add a new page to the menu: add one line to PAGES below, and add
   <script src="/site-nav.js" defer></script> in the new page's <head>. */
(function () {
  var PAGES = [
    { label: 'Market Data',    href: '/',                      match: /^\/(index\.html)?$/ },
    { label: 'Company Review', href: '/reviews/bits-of-gold/', match: /^\/reviews\/bits-of-gold\// }
    // { label: 'New page', href: '/reviews/new-page/', match: /^\/reviews\/new-page\// },
  ];

  var css = '\
:root{--sitenav-h:58px}\
#siteNav{position:sticky;top:0;z-index:45;height:var(--sitenav-h);box-sizing:border-box;background:#fff;color:#0b2a55;border-bottom:1px solid #d9e1ee;box-shadow:0 2px 10px rgba(11,42,85,.12);direction:ltr;font-family:Inter,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}\
#siteNav .sn-in{display:flex;align-items:center;gap:10px;height:100%;max-width:1400px;margin:0 auto;padding:0 12px}\
#siteNav .sn-brand{flex:none;display:block;line-height:0}\
#siteNav .sn-brand img{display:block;height:38px;width:auto}\
#siteNav .sn-links{display:flex;gap:4px;overflow-x:auto;scrollbar-width:none;margin-left:auto;-webkit-overflow-scrolling:touch}\
#siteNav .sn-links::-webkit-scrollbar{display:none}\
#siteNav .sn-links a{flex:none;color:#0b2a55;text-decoration:none;font-size:14px;font-weight:600;padding:8px 11px;border-radius:8px;white-space:nowrap}\
#siteNav .sn-links a:hover{background:#eef3fb}\
#siteNav .sn-links a[aria-current="page"]{background:#0b2a55;color:#fff}\
#siteNav a:focus-visible{outline:2px solid #2563eb;outline-offset:2px}\
@media (max-width:420px){#siteNav .sn-in{gap:6px;padding:0 8px}#siteNav .sn-brand img{height:34px}#siteNav .sn-links a{font-size:13px;padding:8px 8px}}\
@media print{#siteNav{display:none}}';

  function build() {
    if (document.getElementById('siteNav')) return;
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var path = location.pathname;
    var nav = document.createElement('nav');
    nav.id = 'siteNav'; nav.setAttribute('aria-label', 'Site');
    var links = PAGES.map(function (p) {
      var cur = p.match.test(path) ? ' aria-current="page"' : '';
      return '<a href="' + p.href + '"' + cur + '>' + p.label + '</a>';
    }).join('');
    nav.innerHTML = '<div class="sn-in"><a class="sn-brand" href="/" aria-label="RBY Invest – home"><img src="/rby-logo.jpg" alt="RBY Invest" width="900" height="285"></a><div class="sn-links">' + links + '</div></div>';
    document.body.insertBefore(nav, document.body.firstChild);
    var active = nav.querySelector('[aria-current]');
    if (active && active.scrollIntoView) { try { active.scrollIntoView({ inline: 'center', block: 'nearest' }); } catch (e) {} }
  }
  if (document.body) build(); else document.addEventListener('DOMContentLoaded', build);
})();
