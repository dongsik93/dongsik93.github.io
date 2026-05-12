(function () {
  "use strict";

  var root = document.documentElement;
  var progressBar = document.getElementById("blog-progress-bar");
  var palette = document.querySelector("[data-blog-palette]");
  var input = document.querySelector("[data-blog-search-input]");
  var resultsEl = document.querySelector("[data-blog-search-results]");
  var indexEl = document.getElementById("blog-search-index");
  var posts = [];
  var activeIndex = 0;
  var lastResults = [];

  function normalize(value) {
    return String(value || "").normalize("NFKC").toLocaleLowerCase("ko-KR");
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[char];
    });
  }

  function loadPosts() {
    if (!indexEl) return;
    try {
      posts = JSON.parse(indexEl.textContent).map(function (post) {
        post.searchText = normalize([
          post.title,
          post.subtitle,
          post.category,
          post.tags,
          post.excerpt
        ].join(" "));
        return post;
      });
    } catch (error) {
      posts = [];
    }
  }

  function setTheme(theme) {
    root.dataset.theme = theme;
    localStorage.setItem("blog-theme", theme);
  }

  function toggleTheme() {
    setTheme(root.dataset.theme === "light" ? "dark" : "light");
  }

  function updateProgress() {
    if (!progressBar) return;
    var doc = document.documentElement;
    var max = doc.scrollHeight - doc.clientHeight;
    var pct = max > 0 ? (doc.scrollTop / max) * 100 : 0;
    progressBar.style.width = pct + "%";
  }

  function renderResults(query) {
    if (!resultsEl) return;
    var q = normalize(query).trim();
    var terms = q.split(/\s+/).filter(Boolean);
    lastResults = posts.filter(function (post) {
      return terms.every(function (term) {
        return post.searchText.indexOf(term) >= 0;
      });
    }).slice(0, 12);

    if (!q) {
      lastResults = posts.slice(0, 8);
    }

    activeIndex = Math.min(activeIndex, Math.max(lastResults.length - 1, 0));

    if (!lastResults.length) {
      resultsEl.innerHTML = '<div class="blog-palette__empty">검색 결과가 없습니다.</div>';
      return;
    }

    resultsEl.innerHTML = lastResults.map(function (post, index) {
      var activeClass = index === activeIndex ? " is-active" : "";
      return [
        '<a class="blog-palette__item' + activeClass + '" href="' + escapeHtml(post.url) + '" data-blog-result-index="' + index + '">',
        "<strong>" + escapeHtml(post.title) + "</strong>",
        "<span>" + escapeHtml(post.category) + " · " + escapeHtml(post.date) + "</span>",
        "</a>"
      ].join("");
    }).join("");
  }

  function openPalette() {
    if (!palette) return;
    palette.hidden = false;
    activeIndex = 0;
    renderResults(input ? input.value : "");
    window.setTimeout(function () {
      if (input) input.focus();
    }, 30);
  }

  function closePalette() {
    if (!palette) return;
    palette.hidden = true;
  }

  function moveActive(delta) {
    if (!lastResults.length) return;
    activeIndex = (activeIndex + delta + lastResults.length) % lastResults.length;
    renderResults(input ? input.value : "");
  }

  function goActive() {
    if (!lastResults.length) return;
    window.location.href = lastResults[activeIndex].url;
  }

  function setupArchiveFilter() {
    var archive = document.querySelector("[data-blog-archive]");
    if (!archive) return;

    var buttons = Array.prototype.slice.call(archive.querySelectorAll("[data-blog-archive-tag]"));
    var items = Array.prototype.slice.call(archive.querySelectorAll("[data-blog-archive-item]"));
    var sections = Array.prototype.slice.call(archive.querySelectorAll("[data-blog-archive-section]"));

    function selectTag(tag, updateUrl) {
      buttons.forEach(function (button) {
        button.classList.toggle("is-active", button.getAttribute("data-blog-archive-tag") === tag);
      });

      items.forEach(function (item) {
        var tags = (item.getAttribute("data-tags") || "").split(",");
        item.hidden = Boolean(tag) && tags.indexOf(tag) < 0;
      });

      sections.forEach(function (section) {
        section.hidden = !section.querySelector("[data-blog-archive-item]:not([hidden])");
      });

      if (updateUrl && window.history && window.history.replaceState) {
        var url = tag ? window.location.pathname + "?tag=" + tag : window.location.pathname;
        window.history.replaceState(null, "", url);
      }
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        selectTag(button.getAttribute("data-blog-archive-tag") || "", true);
      });
    });

    selectTag(new URLSearchParams(window.location.search).get("tag") || "", false);
  }

  loadPosts();
  updateProgress();
  setupArchiveFilter();

  document.querySelectorAll("[data-blog-theme-toggle]").forEach(function (button) {
    button.addEventListener("click", toggleTheme);
  });

  document.querySelectorAll("[data-blog-open-palette]").forEach(function (button) {
    button.addEventListener("click", openPalette);
  });

  if (palette) {
    palette.addEventListener("click", function (event) {
      if (event.target === palette) closePalette();
    });
  }

  if (input) {
    input.addEventListener("input", function () {
      activeIndex = 0;
      renderResults(input.value);
    });

    input.addEventListener("keydown", function (event) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        moveActive(1);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        moveActive(-1);
      } else if (event.key === "Enter") {
        event.preventDefault();
        goActive();
      }
    });
  }

  window.addEventListener("keydown", function (event) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      if (palette && palette.hidden) openPalette();
      else closePalette();
    } else if (event.key === "Escape") {
      closePalette();
    }
  });

  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
}());
