(function () {
  function enhance(el) {
    if (el.querySelector("button.yt-lite-play")) return;
    var id = el.getAttribute("data-ytid");
    var title = el.getAttribute("data-title") || "YouTube video";
    if (!id) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "yt-lite-play";
    btn.setAttribute("aria-label", "Play video: " + title);
    var img = document.createElement("img");
    img.src = "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg";
    img.alt = title;
    img.width = 480;
    img.height = 360;
    img.loading = "lazy";
    btn.appendChild(img);
    var hint = document.createElement("span");
    hint.className = "yt-lite-badge";
    hint.textContent = "Play on YouTube";
    btn.appendChild(hint);
    btn.addEventListener("click", function () {
      var iframe = document.createElement("iframe");
      iframe.className = "yt-lite-iframe";
      iframe.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1";
      iframe.title = title;
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.setAttribute("allowfullscreen", "");
      iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
      el.querySelectorAll(".yt-lite-play").forEach(function (b) { b.remove(); });
      var fallback = el.querySelector(".yt-lite-fallback");
      if (fallback) el.insertBefore(iframe, fallback);
      else el.appendChild(iframe);
    });
    var fallback = el.querySelector(".yt-lite-fallback");
    if (fallback) el.insertBefore(btn, fallback);
    else el.appendChild(btn);
  }
  function init() {
    document.querySelectorAll(".yt-lite[data-ytid]").forEach(enhance);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
