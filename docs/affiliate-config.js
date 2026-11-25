/* PathProbe tap-kit affiliate config — one place to drop tags later.
   Do not set enabled:true until a program is approved and the disclosure
   is reviewed. Amazon Associates is pending as of 2026-11-25. */
window.PP_AFFILIATE = {
  enabled: false,
  amazonTag: "",          // e.g. "getpathprobe-20" after approval
  canakitTag: "",         // reserved; no confirmed CanaKit program yet
  pishopTag: "",          // reserved; no public PiShop program found
  adafruitTag: ""         // Adafruit does not offer an affiliate program
};

(function () {
  var cfg = window.PP_AFFILIATE || {};
  function decorate(url, merchant) {
    if (!cfg.enabled) return url;
    try {
      var u = new URL(url, window.location.href);
      if (merchant === "amazon" && cfg.amazonTag) {
        u.searchParams.set("tag", cfg.amazonTag);
      }
      return u.toString();
    } catch (e) {
      return url;
    }
  }
  document.querySelectorAll("a[data-affiliate-merchant]").forEach(function (a) {
    var merchant = a.getAttribute("data-affiliate-merchant");
    var href = a.getAttribute("href");
    if (href) a.setAttribute("href", decorate(href, merchant));
  });
  var box = document.getElementById("affiliate-disclosure");
  if (box) {
    if (cfg.enabled) box.removeAttribute("hidden");
    else box.setAttribute("hidden", "hidden");
  }
})();
