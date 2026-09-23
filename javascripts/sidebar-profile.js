// Injects a compact identity block (avatar + name + subtitle) and a
// search box above the primary nav, matching the reference dashboard design.
// Edit SN_PROFILE below to personalize it.

var SN_PROFILE = {
  name: "Sec-Notes",
  subtitle: "Personal study vault",
  avatarInitial: "S",
  avatarImage: ""   // paste an image URL here to use a real photo instead of the initial
};

function snInjectProfile() {
  document.querySelectorAll('.md-sidebar--primary .md-sidebar__scrollwrap').forEach(function (wrap) {
    if (wrap.querySelector('.sn-identity')) return;

    var avatarInner = SN_PROFILE.avatarImage
      ? '<img src="' + SN_PROFILE.avatarImage + '" alt="' + SN_PROFILE.name + '">'
      : SN_PROFILE.avatarInitial;

    var identity = document.createElement('div');
    identity.className = 'sn-identity';
    identity.innerHTML =
      '<div class="sn-avatar">' + avatarInner + '</div>' +
      '<div>' +
        '<div class="sn-name">' + SN_PROFILE.name + '</div>' +
        '<div class="sn-subtitle">' + SN_PROFILE.subtitle + '</div>' +
      '</div>';

    var aboutBtn = document.createElement('div');
    aboutBtn.className = 'sn-about-btn';
    aboutBtn.setAttribute('role', 'button');
    aboutBtn.setAttribute('tabindex', '0');
    aboutBtn.innerHTML = '<span>👤</span><span>About Us</span>';
    function goAbout() {
      var url = typeof window.snUrl === 'function' ? window.snUrl('about/') : 'about/';
      window.location.href = url;
    }
    aboutBtn.addEventListener('click', goAbout);
    aboutBtn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') goAbout();
    });

    var random = document.createElement('div');
    random.className = 'sn-random';
    random.setAttribute('role', 'button');
    random.setAttribute('tabindex', '0');
    random.innerHTML = '<span>🎲</span><span>Surprise me</span>';
    function goRandom() {
      if (!window.SN_NOTES || !window.SN_NOTES.length) return;
      var pick = window.SN_NOTES[Math.floor(Math.random() * window.SN_NOTES.length)];
      var url = typeof window.snUrl === "function" ? window.snUrl(pick.url) : pick.url;
      window.location.href = url;
    }
    random.addEventListener('click', goRandom);
    random.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') goRandom();
    });

    var search = document.createElement('div');
    search.className = 'sn-search';
    search.setAttribute('role', 'button');
    search.setAttribute('tabindex', '0');
    search.innerHTML = '<span class="sn-search-icon">🔍</span><span class="sn-search-text">Search notes…</span>';
    function openSearch() {
      var toggle = document.querySelector('[data-md-toggle="search"]');
      if (toggle) toggle.checked = true;
      setTimeout(function () {
        var input = document.querySelector('.md-search__input');
        if (input) input.focus();
      }, 50);
    }
    search.addEventListener('click', openSearch);
    search.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') openSearch();
    });

    var nav = wrap.querySelector('.md-nav--primary');
    if (nav && nav.parentNode) {
      nav.parentNode.insertBefore(identity, nav);
      nav.parentNode.insertBefore(aboutBtn, nav);
      nav.parentNode.insertBefore(search, nav);
      nav.parentNode.insertBefore(random, nav);
    }
  });
}

document.addEventListener('DOMContentLoaded', snInjectProfile);
if (typeof document$ !== 'undefined') {
  document$.subscribe(snInjectProfile);
}

// Makes any element with data-href act as a full clickable card.
document.addEventListener('click', function (e) {
  var card = e.target.closest('[data-href]');
  if (card) window.location.href = card.getAttribute('data-href');
});
