(function () {
  "use strict";

  var root = document.documentElement;
  var prose = document.querySelector(".blog-prose");

  function slugify(text) {
    return String(text || "")
      .trim()
      .normalize("NFKC")
      .toLowerCase()
      .replace(/[^\w가-힣]+/g, "-")
      .replace(/^-+|-+$/g, "") || "section";
  }

  function ensureHeadingIds(headings) {
    var used = {};
    headings.forEach(function (heading) {
      if (!heading.id) {
        var base = slugify(heading.textContent);
        var next = base;
        var count = 2;
        while (used[next] || document.getElementById(next)) {
          next = base + "-" + count;
          count += 1;
        }
        heading.id = next;
      }
      used[heading.id] = true;
    });
  }

  function buildToc() {
    if (!prose) return;
    var headings = Array.prototype.slice.call(prose.querySelectorAll("h2, h3, h4"));
    var tocTargets = Array.prototype.slice.call(document.querySelectorAll("[data-blog-toc], [data-blog-toc-mobile]"));
    if (!tocTargets.length) return;
    ensureHeadingIds(headings);

    var html = headings.map(function (heading, index) {
      var level = heading.tagName.toLowerCase();
      return [
        '<li class="is-' + level + '">',
        '<a href="#' + heading.id + '" data-blog-toc-link="' + heading.id + '">',
        '<span>' + String(index + 1).padStart(2, "0") + '</span>',
        heading.textContent.trim(),
        '</a>',
        '</li>'
      ].join("");
    }).join("");

    tocTargets.forEach(function (target) {
      target.innerHTML = html || '<li class="is-empty">목차로 표시할 제목이 없습니다.</li>';
    });

    if (!headings.length) return;

    var ticking = false;
    var updateActiveToc = function () {
      var marker = window.scrollY + 120;
      var active = headings[0];
      headings.forEach(function (heading) {
        if (heading.offsetTop <= marker) {
          active = heading;
        }
      });
      document.querySelectorAll("[data-blog-toc-link]").forEach(function (link) {
        link.classList.toggle("is-active", link.getAttribute("data-blog-toc-link") === active.id);
      });
      ticking = false;
    };
    var requestActiveToc = function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateActiveToc);
    };

    updateActiveToc();
    window.addEventListener("scroll", requestActiveToc, { passive: true });
    window.addEventListener("resize", requestActiveToc);
  }

  function enhanceCodeBlocks() {
    if (!prose) return;
    Array.prototype.slice.call(prose.querySelectorAll("pre")).forEach(function (pre) {
      var host = pre.closest(".highlight") || pre.parentNode;
      if (!host || host.querySelector(".blog-copy-code")) return;
      host.classList.add("blog-code-host");
      var button = document.createElement("button");
      button.className = "blog-copy-code";
      button.type = "button";
      button.textContent = "COPY";
      button.addEventListener("click", function () {
        var text = pre.innerText || pre.textContent || "";
        navigator.clipboard.writeText(text).then(function () {
          button.textContent = "COPIED";
          window.setTimeout(function () { button.textContent = "COPY"; }, 1400);
        }).catch(function () {
          button.textContent = "FAILED";
          window.setTimeout(function () { button.textContent = "COPY"; }, 1400);
        });
      });
      host.insertBefore(button, host.firstChild);
    });
  }

  function placeInArticleAd() {
    if (!prose) return;
    var ad = document.querySelector("[data-blog-inarticle-ad]");
    if (!ad) return;
    var paragraphs = Array.prototype.slice.call(prose.querySelectorAll("p")).filter(function (p) {
      return p.textContent.trim().length > 80;
    });
    var anchor = paragraphs[3] || prose.querySelector("h2:nth-of-type(2)") || paragraphs[1];
    if (anchor && anchor.parentNode) {
      anchor.parentNode.insertBefore(ad, anchor.nextSibling);
    }
    var pending = ad.querySelector("[data-blog-ad-pending]");
    if (pending) {
      pending.removeAttribute("data-blog-ad-pending");
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        // Ad blockers or delayed AdSense loading should not break reading.
      }
    }
  }

  function initUtterances() {
    var host = document.querySelector("[data-blog-utterances]");
    if (!host || host.querySelector("iframe, script")) return;
    var script = document.createElement("script");
    var theme = root.dataset.theme === "light" ? host.dataset.themeLight : host.dataset.themeDark;
    script.src = "https://utteranc.es/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("repo", host.dataset.repo);
    script.setAttribute("issue-term", host.dataset.issueTerm);
    script.setAttribute("theme", theme);
    host.appendChild(script);
  }

  function syncUtterancesTheme() {
    var iframe = document.querySelector(".utterances-frame");
    var host = document.querySelector("[data-blog-utterances]");
    if (!iframe || !host) return;
    var theme = root.dataset.theme === "light" ? host.dataset.themeLight : host.dataset.themeDark;
    iframe.contentWindow.postMessage({ type: "set-theme", theme: theme }, "https://utteranc.es");
  }

  function initAnchorJs() {
    if (!window.anchors) return;
    window.anchors.options = {
      visible: "hover",
      placement: "left",
      icon: "#"
    };
    window.anchors.add(".blog-prose h2, .blog-prose h3, .blog-prose h4");
  }

  document.addEventListener("DOMContentLoaded", function () {
    buildToc();
    enhanceCodeBlocks();
    placeInArticleAd();
    initUtterances();
    window.setTimeout(initAnchorJs, 150);
  });

  new MutationObserver(syncUtterancesTheme).observe(root, {
    attributes: true,
    attributeFilter: ["data-theme"]
  });
}());
