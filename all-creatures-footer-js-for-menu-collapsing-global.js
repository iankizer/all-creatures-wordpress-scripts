(function(){
  var BP = 980; // keep in sync with your CSS

  function isMobile(){ return window.matchMedia('(max-width:'+BP+'px)').matches; }
  function menus(){ return Array.from(document.querySelectorAll('ul.et_mobile_menu')); }

  function ensureToggle(li){
    var a = li.querySelector(':scope > a');
    var sub = li.querySelector(':scope > ul.sub-menu');
    if (!a || !sub) return;
    if (!a.querySelector('.mm-toggle')){
      var t = document.createElement('span');
      t.className = 'mm-toggle';
      t.setAttribute('aria-hidden','true');
      a.appendChild(t);
    }
  }

  function closeSiblings(li){
    Array.from(li.parentElement.children).forEach(function(sib){
      if (sib !== li){
        sib.classList.remove('open');
        var s = sib.querySelector(':scope > ul.sub-menu'); if (s) s.style.display = 'none';
        var t = sib.querySelector(':scope > a .mm-toggle'); if (t) t.setAttribute('aria-expanded','false');
      }
    });
  }

  function toggle(li){
    ensureToggle(li);
    var sub = li.querySelector(':scope > ul.sub-menu');
    var open = !li.classList.contains('open');
    if (open) closeSiblings(li);
    li.classList.toggle('open', open);
    if (sub) sub.style.display = open ? 'block' : 'none';
    var t = li.querySelector(':scope > a .mm-toggle'); if (t) t.setAttribute('aria-expanded', open ? 'true' : 'false');

    // add toggles to any nested parents when opening
    if (open && sub){ sub.querySelectorAll('.menu-item-has-children').forEach(ensureToggle); }
  }

  function init(){
    if (!isMobile()) return;
    document.body.classList.add('js-mm-ready'); // tells your CSS to collapse by default
    menus().forEach(function(ul){
      ul.querySelectorAll('.menu-item-has-children').forEach(function(li){
        ensureToggle(li);
        // collapse all on init
        var sub = li.querySelector(':scope > ul.sub-menu');
        if (sub){ li.classList.remove('open'); sub.style.display = 'none'; }
      });
    });
  }

  // Run on load
  document.addEventListener('DOMContentLoaded', init);

  // Divi injects the mobile UL after tapping the burger sometimes; watch for it
  document.addEventListener('click', function(e){
    var burger = e.target.closest('.mobile_menu_bar, .mobile_menu_bar_toggle');
    if (burger && isMobile()){
      setTimeout(init, 60);
    }
  }, true);

  // Global click handling (arrow toggles; nolink/# toggles)
  document.addEventListener('click', function(e){
    if (!isMobile()) return;

    // Arrow → toggle
    var tgl = e.target.closest('ul.et_mobile_menu .menu-item-has-children > a .mm-toggle');
    if (tgl){ e.preventDefault(); e.stopPropagation(); toggle(tgl.closest('.menu-item-has-children')); return; }

    // Parent link '#' or class 'nolink' → toggle instead of navigate
    var a = e.target.closest('ul.et_mobile_menu .menu-item-has-children > a');
    if (a){
      var href = (a.getAttribute('href') || '').trim();
      if (href === '' || href === '#' || a.classList.contains('nolink')){
        e.preventDefault(); e.stopPropagation(); toggle(a.parentElement);
      }
    }
  }, true);

  // Re-run when crossing breakpoint
  window.addEventListener('resize', init);
})();