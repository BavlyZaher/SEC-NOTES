// ==========================================================================
// Sec-Notes — dynamic dashboard/topic rendering.
// SN_NOTES itself is NOT defined here — it's auto-generated at build time
// by hooks.py (see docs/javascripts/notes-data.js) straight from each
// article's front matter + real word count, so reading time and dates are
// always accurate. This file only defines the topics list (fixed
// structure) and the rendering logic that consumes SN_NOTES.
//
// Add a new note in ONE place only: create the .md file with the right
// front matter (title/topic/tag/date). It then shows up automatically on
// the dashboard, in "Recently added", on its topic page and on Write-ups.
// ==========================================================================

if (typeof SN_NOTES === "undefined") { var SN_NOTES = []; } // defensive fallback

var SN_TOPICS = [
  { slug: "web-appsec", title: "Web AppSec", icon: "🕸️", chip: "peach",
    desc: "OWASP top 10, auth flaws, IDOR patterns.", url: "topics/web-appsec/" },
  { slug: "network-security", title: "Network Security", icon: "📡", chip: "mint",
    desc: "Recon, protocols, pivoting cheatsheets.", url: "topics/network-security/" },
  { slug: "ai-security", title: "AI Security", icon: "🤖", chip: "lavender",
    desc: "Prompt injection, model abuse, LLM red-team.", url: "topics/ai-security/" },
  { slug: "api-sec", title: "API Sec", icon: "🧩", chip: "mint",
    desc: "Auth, rate limits, broken object access.", url: "topics/api-sec/" },
  { slug: "programming", title: "Programming", icon: "💻", chip: "peach",
    desc: "Scripts, automation, small tools.", url: "topics/programming/" },
  { slug: "htb", title: "HTB", icon: "🎯", chip: "lavender",
    desc: "Hack The Box write-ups and cert-path modules.", url: "topics/htb/" },
  { slug: "write-ups", title: "Write-ups", icon: "📝", chip: "lavender",
    desc: "Box walkthroughs and bug reports.", url: "articles/" }
];

// ---- Site-root resolution --------------------------------------------------
// MkDocs writes THIS SAME file's own <script src> with the correct relative
// prefix for whatever depth the page sits at (e.g. "../../javascripts/site.js"
// two levels down). We read that prefix back, ONCE, and turn it into an
// absolute path from the domain root — so every link we build afterwards
// works from any page, at any depth, instead of being naively concatenated
// onto whatever page happens to be open when the click happens.
var SN_SITE_ROOT = (function () {
  try {
    var scripts = document.getElementsByTagName("script");
    var src = null;
    for (var i = 0; i < scripts.length; i++) {
      var s = scripts[i].getAttribute("src") || "";
      if (s.indexOf("javascripts/site.js") !== -1) { src = s; break; }
    }
    if (!src) return "/";
    var prefix = src.slice(0, src.indexOf("javascripts/site.js"));
    return new URL(prefix || "./", window.location.href).pathname;
  } catch (e) {
    return "/";
  }
})();

function snUrl(path) {
  return SN_SITE_ROOT.replace(/\/$/, "") + "/" + String(path).replace(/^\//, "");
}

// ---- Helpers -------------------------------------------------------------

function snTopicCount(slug) {
  if (slug === "write-ups") return SN_NOTES.length;
  return SN_NOTES.filter(function (n) { return n.topic === slug; }).length;
}

function snNoteWord(count) {
  return count === 1 ? "note" : "notes";
}

function snRelativeTime(dateStr) {
  var then = new Date(dateStr + "T00:00:00");
  var now = new Date();
  var diffDays = Math.floor((now - then) / 86400000);
  if (diffDays <= 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return diffDays + " days ago";
  var weeks = Math.floor(diffDays / 7);
  if (weeks === 1) return "1 week ago";
  if (weeks < 5) return weeks + " weeks ago";
  var months = Math.floor(diffDays / 30);
  return months <= 1 ? "1 month ago" : months + " months ago";
}

function snIsNew(dateStr) {
  var then = new Date(dateStr + "T00:00:00");
  return (new Date() - then) / 86400000 <= 3;
}

function snTagClass(tag) {
  var map = { WEB: "web", NET: "net", AI: "ai", API: "api", DEV: "dev", HTB: "htb" };
  return map[tag] || "web";
}

// A single full-width, stacked "note row" card used both in "Recently
// added" and on each topic page — same component, so the site stays
// visually consistent everywhere a note is listed.
function snNoteRowHtml(note) {
  var newBadge = snIsNew(note.date) ? '<span class="sn-new-badge">NEW</span>' : "";
  var url = snUrl(note.url);
  return (
    '<div class="note-row" data-tag="' + note.tag + '">' +
      '<a class="note-row-link" href="' + url + '">' +
        '<span class="recent-tag ' + snTagClass(note.tag) + '">' + note.tag + '</span>' +
        '<span class="note-row-title">' + note.title + newBadge + '</span>' +
        '<span class="note-row-meta">' + note.readMins + ' min read · ' + snRelativeTime(note.date) + '</span>' +
      '</a>' +
      '<button type="button" class="note-row-bookmark" data-url="' + url + '" aria-label="Bookmark" title="Bookmark">☆</button>' +
    '</div>'
  );
}

// ---- Dashboard: topic grid + recently added ------------------------------

function snRenderDashboard() {
  var grid = document.getElementById("sn-topic-grid");
  if (grid && !grid.dataset.rendered) {
    grid.dataset.rendered = "1";
    grid.innerHTML = SN_TOPICS.map(function (t) {
      var count = snTopicCount(t.slug);
      return (
        '<div class="topic-card" data-href="' + snUrl(t.url) + '">' +
          '<div class="topic-icon ' + t.chip + '">' + t.icon + '</div>' +
          '<span class="topic-title">' + t.title + '</span>' +
          '<div class="topic-desc">' + t.desc + '</div>' +
          '<div class="topic-count">' + count + ' ' + snNoteWord(count) + '</div>' +
        '</div>'
      );
    }).join("");
  }

  var recent = document.getElementById("sn-recent-list");
  if (recent && !recent.dataset.rendered) {
    recent.dataset.rendered = "1";
    var sorted = SN_NOTES.slice().sort(function (a, b) { return b.date.localeCompare(a.date); });
    recent.innerHTML = sorted.map(snNoteRowHtml).join("");
    snInitBookmarkButtons(recent);
  }

  var stats = document.getElementById("sn-stats");
  if (stats && !stats.dataset.rendered) {
    stats.dataset.rendered = "1";
    var weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    var newThisWeek = SN_NOTES.filter(function (n) {
      return new Date(n.date + "T00:00:00") >= weekAgo;
    }).length;
    var totalMins = SN_NOTES.reduce(function (sum, n) { return sum + n.readMins; }, 0);
    stats.innerHTML =
      '<span><strong>' + SN_TOPICS.length + '</strong> topics</span>' +
      '<span><strong>' + SN_NOTES.length + '</strong> write-ups so far</span>' +
      '<span><strong>' + newThisWeek + '</strong> new this week</span>' +
      '<span><strong>' + totalMins + '</strong> min of reading total</span>';
  }
}

// ---- Topic + Write-ups pages: full-width stacked note list, with an
// optional tag filter row on pages that list more than one tag. --------

function snRenderTopicNotes() {
  document.querySelectorAll(".sn-notes-list[data-topic]").forEach(function (el) {
    if (el.dataset.rendered) return;
    el.dataset.rendered = "1";
    var slug = el.getAttribute("data-topic");
    var notes;
    if (slug === "all") {
      notes = SN_NOTES.slice();
    } else if (slug === "bookmarked") {
      notes = SN_NOTES.filter(function (n) { return snIsBookmarked(snUrl(n.url)); });
    } else {
      notes = SN_NOTES.filter(function (n) { return n.topic === slug; });
    }
    notes.sort(function (a, b) { return b.date.localeCompare(a.date); });

    var empty = document.querySelector(".sn-empty-state[data-topic='" + slug + "']");
    if (notes.length === 0) {
      if (empty) empty.style.display = "";
      el.innerHTML = "";
      return;
    }
    if (empty) empty.style.display = "none";

    var tags = [];
    notes.forEach(function (n) { if (tags.indexOf(n.tag) === -1) tags.push(n.tag); });

    var filterHtml = "";
    if (tags.length > 1) {
      filterHtml =
        '<div class="sn-tag-filter">' +
          '<button class="sn-tag-pill active" data-filter="all">All</button>' +
          tags.map(function (t) {
            return '<button class="sn-tag-pill" data-filter="' + t + '">' + t + '</button>';
          }).join("") +
        '</div>';
    }

    // Group by collection when any note declares one (e.g. a cert path
    // like "cpts" holding several modules); otherwise render as one flat
    // stacked list, same as before.
    var hasCollections = notes.some(function (n) { return n.collection; });
    var listHtml;
    if (hasCollections) {
      var groups = {};
      var order = [];
      notes.forEach(function (n) {
        var key = n.collection || "General";
        if (!groups[key]) { groups[key] = []; order.push(key); }
        groups[key].push(n);
      });
      listHtml = order.map(function (key) {
        return (
          '<div class="sn-group-title">📂 ' + key + '</div>' +
          '<div class="sn-notes-list-inner">' + groups[key].map(snNoteRowHtml).join("") + '</div>'
        );
      }).join("");
    } else {
      listHtml = '<div class="sn-notes-list-inner">' + notes.map(snNoteRowHtml).join("") + '</div>';
    }

    el.innerHTML = filterHtml + listHtml;

    el.querySelectorAll(".sn-tag-pill").forEach(function (pill) {
      pill.addEventListener("click", function () {
        el.querySelectorAll(".sn-tag-pill").forEach(function (p) { p.classList.remove("active"); });
        pill.classList.add("active");
        var filter = pill.getAttribute("data-filter");
        el.querySelectorAll(".note-row").forEach(function (row) {
          row.style.display = (filter === "all" || row.getAttribute("data-tag") === filter) ? "" : "none";
        });
      });
    });

    snInitBookmarkButtons(el);
  });
}

// ---- Published date + live reading time on a note's own page -------------

function snRenderPublishedDates() {
  document.querySelectorAll(".sn-pub-date[data-date]").forEach(function (el) {
    el.textContent = "Published " + snRelativeTime(el.getAttribute("data-date"));
  });
}

function snRenderReadingTime() {
  var badge = document.querySelector(".sn-read-badge");
  if (!badge) return;
  var article = document.querySelector(".md-content__inner");
  if (!article) return;
  var text = article.textContent || "";
  var words = text.trim().split(/\s+/).filter(Boolean).length;
  if (words === 0) return;
  var mins = Math.max(1, Math.round(words / 180));
  badge.textContent = mins + " min read";
}

// ---- About page: two profile cards rendered from config -------------------
// Edit SN_ABOUT below to personalize (or delete the second entry if this
// is a solo project — the grid adapts to however many entries exist).

var SN_ABOUT = [
  {
    name: "Your Name",
    role: "Security Researcher",
    bio: "شغوف بأمن المعلومات ومكافآت الثغرات. بحط هنا كل حاجة بتعلمها وbug bounty write-ups.",
    avatarInitial: "S",
    avatarImage: "",
    socials: {
      website: "",
      linkedin: "",
      twitter: "",
      facebook: "",
      github: "https://github.com/username"
    },
    certificates: ["OSCP", "eJPT"],
    hallOfFame: ["Example Corp", "Another Co"]
  },
  {
    name: "Co-founder Name",
    role: "Security Trainer",
    bio: "نبذة قصيرة هنا — أو امسح الكارت ده بالكامل من SN_ABOUT لو الموقع لشخص واحد بس.",
    avatarInitial: "?",
    avatarImage: "",
    socials: { website: "", linkedin: "", twitter: "", facebook: "", github: "" },
    certificates: [],
    hallOfFame: []
  }
];

var SN_SOCIAL_ICON_MAP = { website: "🔗", linkedin: "💼", twitter: "🐦", facebook: "📘", github: "🐙" };

function snAboutCardHtml(person) {
  var avatarInner = person.avatarImage
    ? '<img src="' + person.avatarImage + '" alt="' + person.name + '">'
    : person.avatarInitial;

  var socialsHtml = Object.keys(person.socials)
    .filter(function (k) { return person.socials[k]; })
    .map(function (k) {
      return '<a href="' + person.socials[k] + '" target="_blank" rel="noopener" title="' + k + '">' + SN_SOCIAL_ICON_MAP[k] + '</a>';
    }).join("");

  var certsHtml = person.certificates && person.certificates.length
    ? '<div class="about-section-title">Certificates</div><div class="about-pills">' +
        person.certificates.map(function (c) { return '<span class="about-pill">' + c + '</span>'; }).join("") +
      '</div>'
    : "";

  var hofHtml = person.hallOfFame && person.hallOfFame.length
    ? '<div class="about-section-title">Hall of Fame</div><div class="about-pills">' +
        person.hallOfFame.map(function (h) { return '<span class="about-pill about-pill--hof">🏆 ' + h + '</span>'; }).join("") +
      '</div>'
    : "";

  return (
    '<div class="about-card">' +
      '<div class="about-avatar">' + avatarInner + '</div>' +
      '<div class="about-name">' + person.name + '</div>' +
      '<div class="about-role">' + person.role + '</div>' +
      '<div class="about-bio">' + person.bio + '</div>' +
      (socialsHtml ? '<div class="about-socials">' + socialsHtml + '</div>' : '') +
      certsHtml +
      hofHtml +
    '</div>'
  );
}

function snRenderAbout() {
  var grid = document.getElementById("sn-about-grid");
  if (!grid || grid.dataset.rendered) return;
  grid.dataset.rendered = "1";
  grid.innerHTML = SN_ABOUT.map(snAboutCardHtml).join("");
}

// ---- Creative extra #1: real bookmarking, saved in the browser ----------
// A star toggle on every note row. Bookmarks are stored in this browser's
// localStorage (per-device, not shared/synced), and the "Bookmarked" page
// under Progress reads straight from the same storage — so it's a fully
// working reading list, not just a placeholder page.

var SN_BOOKMARK_KEY = "sn-bookmarks";

function snGetBookmarks() {
  try { return JSON.parse(localStorage.getItem(SN_BOOKMARK_KEY) || "[]"); }
  catch (e) { return []; }
}

function snIsBookmarked(url) {
  return snGetBookmarks().indexOf(url) !== -1;
}

function snToggleBookmark(url) {
  var arr = snGetBookmarks();
  var i = arr.indexOf(url);
  if (i === -1) { arr.push(url); } else { arr.splice(i, 1); }
  try { localStorage.setItem(SN_BOOKMARK_KEY, JSON.stringify(arr)); } catch (e) {}
  return i === -1; // true = just bookmarked, false = just removed
}

function snInitBookmarkButtons(scope) {
  (scope || document).querySelectorAll(".note-row-bookmark").forEach(function (btn) {
    var url = btn.getAttribute("data-url");
    btn.textContent = snIsBookmarked(url) ? "★" : "☆";
    if (btn.dataset.bound) return;
    btn.dataset.bound = "1";
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var nowBookmarked = snToggleBookmark(url);
      btn.textContent = nowBookmarked ? "★" : "☆";
      // If we're on the Bookmarked page itself, re-render so removing one
      // makes it disappear immediately instead of waiting for a reload.
      var list = btn.closest(".sn-notes-list[data-topic='bookmarked']");
      if (list) { list.dataset.rendered = ""; snRenderTopicNotes(); }
    });
  });
}

function snInitBookmarkOnPage() {
  var badge = document.querySelector(".sn-read-badge");
  if (!badge || badge.dataset.bookmarkReady) return;
  badge.dataset.bookmarkReady = "1";
  var url = window.location.pathname;
  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "sn-copy-link";
  btn.textContent = snIsBookmarked(url) ? "★ bookmarked" : "☆ bookmark";
  btn.addEventListener("click", function () {
    var nowBookmarked = snToggleBookmark(url);
    btn.textContent = nowBookmarked ? "★ bookmarked" : "☆ bookmark";
  });
  badge.parentNode.appendChild(document.createTextNode(" · "));
  badge.parentNode.appendChild(btn);
}

// ---- Creative extra #2: one-click print / save-as-PDF for an article ----
// Hides all the site chrome via @media print (see extra.css) and lets the
// visitor use the browser's native print dialog to save a clean PDF copy.

function snInitPrintButton() {
  var badge = document.querySelector(".sn-read-badge");
  if (!badge || badge.dataset.printReady) return;
  badge.dataset.printReady = "1";
  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "sn-copy-link";
  btn.textContent = "🖨️ print / save PDF";
  btn.addEventListener("click", function () { window.print(); });
  badge.parentNode.appendChild(document.createTextNode(" · "));
  badge.parentNode.appendChild(btn);
}

// ---- Creative extra: copy-link button next to the pub-date line ----------

function snInitCopyLink() {
  var badge = document.querySelector(".sn-read-badge");
  if (!badge || badge.dataset.copyReady) return;
  badge.dataset.copyReady = "1";
  var btn = document.createElement("button");
  btn.className = "sn-copy-link";
  btn.type = "button";
  btn.textContent = "🔗 copy link";
  btn.addEventListener("click", function () {
    var url = window.location.href;
    var done = function () { btn.textContent = "✓ copied"; setTimeout(function () { btn.textContent = "🔗 copy link"; }, 1500); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(done).catch(function () { btn.textContent = "couldn't copy"; });
    } else {
      done();
    }
  });
  badge.parentNode.appendChild(document.createTextNode(" · "));
  badge.parentNode.appendChild(btn);
}

// ---- Hide the empty table-of-contents sidebar column ----------------------
// Material always renders .md-sidebar--secondary, even on pages with no
// headings — its <nav> just ends up containing whitespace only. Left alone
// that shows up as a bare, empty scrollbar with nothing in it, so we hide
// the whole column whenever its TOC list has no actual entries.

function snHideEmptyToc() {
  document.querySelectorAll(".md-sidebar--secondary").forEach(function (sidebar) {
    var hasItems = !!sidebar.querySelector(".md-nav__item");
    sidebar.style.display = hasItems ? "" : "none";
  });
}

function snInitSearchShortcut() {
  if (window.__snSearchShortcutBound) return;
  window.__snSearchShortcutBound = true;
  document.addEventListener("keydown", function (e) {
    if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
    var tag = (document.activeElement && document.activeElement.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea") return;
    var toggle = document.querySelector('[data-md-toggle="search"]');
    if (!toggle) return;
    e.preventDefault();
    toggle.checked = true;
    setTimeout(function () {
      var input = document.querySelector(".md-search__input");
      if (input) input.focus();
    }, 50);
  });
}

// ---- Wire everything up, including Material's instant-navigation --------

function snRenderAll() {
  // Each feature is isolated: one failing shouldn't block the rest.
  [snRenderDashboard, snRenderTopicNotes, snRenderPublishedDates,
   snRenderReadingTime, snInitCopyLink, snInitBookmarkOnPage, snInitPrintButton,
   snInitSearchShortcut, snHideEmptyToc, snRenderAbout].forEach(function (fn) {
    try { fn(); } catch (e) { console.error("sec-notes:", fn.name, e); }
  });
}

document.addEventListener("DOMContentLoaded", snRenderAll);
if (typeof document$ !== "undefined") {
  document$.subscribe(snRenderAll);
}
