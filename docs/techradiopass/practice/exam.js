/* Free practice exam UI. Questions come from questions.js (official NCVEC pool only). */
(function () {
  "use strict";
  var root = document.getElementById("app");
  var pool = window.TRP_POOL;
  if (!root) return;
  if (!pool || !pool.questions || pool.questions.length !== 409) {
    root.innerHTML = "<p>The question pool failed to load. Please refresh the page.</p>";
    return;
  }

  var BYG = {};
  pool.questions.forEach(function (q) {
    (BYG[q.g] = BYG[q.g] || []).push(q);
  });
  var LET = ["A", "B", "C", "D"];
  var exam = null;
  var idx = 0;

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  /* Official exam construction: one question from each of the 35 groups. */
  function newExam() {
    var items = pool.groups.map(function (g) {
      var src = BYG[g];
      var q = src[Math.floor(Math.random() * src.length)];
      var order = shuffle([0, 1, 2, 3]);
      return {
        id: q.id,
        group: q.g,
        q: q.q,
        fig: q.fig || null,
        choices: order.map(function (i) { return q.c[i]; }),
        answer: order.indexOf(q.a),
        picked: null
      };
    });
    return { items: items, submitted: false };
  }

  function answeredCount() {
    return exam.items.filter(function (it) { return it.picked !== null; }).length;
  }

  function score() {
    return exam.items.filter(function (it) { return it.picked === it.answer; }).length;
  }

  function renderStart() {
    root.innerHTML =
      "<h2>Take a practice exam</h2>" +
      "<p>35 questions, just like the real Technician test. Answers are hidden until you submit. You can go back and change a choice before you finish.</p>" +
      "<p class=\"qid\">Pool in effect July 1, 2026 – June 30, 2030 · 26 of 35 to pass</p>" +
      "<div class=\"nav\"><button type=\"button\" class=\"pri\" id=\"start\">Start practice exam</button></div>";
    document.getElementById("start").addEventListener("click", function () {
      exam = newExam();
      idx = 0;
      renderQuestion();
    });
  }

  function figHtml(it) {
    if (!it.fig) return "";
    return '<img class="fig" alt="Official NCVEC Figure ' + esc(it.fig) + '" src="figures/' + esc(it.fig) + '.jpg" width="1800" height="1200">';
  }

  function renderQuestion() {
    var it = exam.items[idx];
    var n = idx + 1;
    var total = exam.items.length;
    var pct = Math.round((n / total) * 100);
    var choices = it.choices.map(function (text, i) {
      return (
        "<li><button type=\"button\" class=\"choice\" data-i=\"" + i + "\" aria-pressed=\"" +
        (it.picked === i ? "true" : "false") + "\"><span class=\"letter\">" + LET[i] +
        ".</span> " + esc(text) + "</button></li>"
      );
    }).join("");
    root.innerHTML =
      "<div class=\"exam-meta\">" +
        "<span>Question " + n + " of " + total + "</span>" +
        "<div class=\"progress\" aria-hidden=\"true\"><span style=\"width:" + pct + "%\"></span></div>" +
        "<span>" + answeredCount() + " answered</span>" +
      "</div>" +
      "<div class=\"qid\">" + esc(it.id) + " · group " + esc(it.group) + "</div>" +
      "<p class=\"qtext\" id=\"qtext\">" + esc(it.q) + "</p>" +
      figHtml(it) +
      "<ul class=\"choices\" role=\"listbox\" aria-labelledby=\"qtext\">" + choices + "</ul>" +
      "<div class=\"nav\">" +
        "<button type=\"button\" class=\"sec\" id=\"prev\" " + (idx === 0 ? "disabled" : "") + ">Previous</button>" +
        "<button type=\"button\" class=\"sec\" id=\"next\" " + (idx === total - 1 ? "disabled" : "") + ">Next</button>" +
        "<button type=\"button\" class=\"pri\" id=\"submit\">Submit exam</button>" +
      "</div>" +
      "<p class=\"qid\">Tip: press A–D or 1–4 to choose, then N or P to move.</p>";

    root.querySelectorAll(".choice").forEach(function (btn) {
      btn.addEventListener("click", function () {
        it.picked = Number(btn.getAttribute("data-i"));
        renderQuestion();
      });
    });
    document.getElementById("prev").addEventListener("click", function () {
      if (idx > 0) { idx -= 1; renderQuestion(); }
    });
    document.getElementById("next").addEventListener("click", function () {
      if (idx < total - 1) { idx += 1; renderQuestion(); }
    });
    document.getElementById("submit").addEventListener("click", trySubmit);
  }

  function trySubmit() {
    var left = exam.items.length - answeredCount();
    if (left > 0) {
      var first = exam.items.findIndex(function (it) { return it.picked === null; });
      var ok = window.confirm(
        "You still have " + left + " unanswered question" + (left === 1 ? "" : "s") +
        ". Submit anyway? Unanswered questions count as incorrect."
      );
      if (!ok) {
        if (first >= 0) { idx = first; renderQuestion(); }
        return;
      }
    }
    exam.submitted = true;
    renderScore();
  }

  function renderScore() {
    var s = score();
    var total = exam.items.length;
    var pct = Math.round((s / total) * 100);
    var passed = s >= pool.passScore;
    var missed = exam.items.filter(function (it) { return it.picked !== it.answer; });
    var review = exam.items.map(function (it, i) {
      var ok = it.picked === it.answer;
      var your = it.picked === null ? "No answer" : LET[it.picked] + ". " + it.choices[it.picked];
      var right = LET[it.answer] + ". " + it.choices[it.answer];
      var choiceBtns = it.choices.map(function (text, ci) {
        var cls = "choice";
        if (ci === it.answer) cls += " ok";
        else if (it.picked === ci) cls += " bad";
        return "<li><button type=\"button\" class=\"" + cls + "\" disabled><span class=\"letter\">" +
          LET[ci] + ".</span> " + esc(text) + "</button></li>";
      }).join("");
      return (
        "<div class=\"rev-item\">" +
          "<div class=\"qid\">" + (i + 1) + ". " + esc(it.id) + "</div>" +
          "<p class=\"qtext\">" + esc(it.q) + "</p>" +
          figHtml(it) +
          "<p class=\"mark " + (ok ? "pass" : "fail") + "\">" + (ok ? "Correct" : "Incorrect") + "</p>" +
          "<ul class=\"choices\">" + choiceBtns + "</ul>" +
          (ok ? "" : "<p>Your answer: " + esc(your) + "<br>Correct answer: " + esc(right) + "</p>") +
        "</div>"
      );
    }).join("");

    var cta = passed
      ? "Nice work — that is a passing score. The $9 Tech Radio Pass kit adds a plain-English explanation for every question, 12 more full exams, cheat sheets, an offline quiz app, and an Anki deck."
      : "You need 26 correct to pass. Take another exam, then use the review below to study the ones you missed. The $9 Tech Radio Pass kit adds explanations for all 409 questions, missed-question review, cheat sheets, and an offline quiz app.";

    root.innerHTML =
      "<h2>Your result</h2>" +
      "<p class=\"score-big " + (passed ? "pass" : "fail") + "\">" + s + " / " + total + "</p>" +
      "<p class=\"" + (passed ? "pass" : "fail") + "\"><strong>" + (passed ? "PASS" : "FAIL") +
      "</strong> · " + pct + "% · pass mark is 26 / 35 (74%)</p>" +
      "<p>" + missed.length + " missed · " + (total - missed.length) + " correct</p>" +
      "<div class=\"cta-box\">" +
        "<h2>Want explanations and more practice?</h2>" +
        "<p>" + cta + "</p>" +
        "<a class=\"btn buy-trp\" href=\"/techradiopass/\">Get Tech Radio Pass, $9</a>" +
      "</div>" +
      "<div class=\"nav\">" +
        "<button type=\"button\" class=\"pri\" id=\"again\">Take another practice exam</button>" +
        "<a class=\"btn pri\" href=\"/techradiopass/\" style=\"background:#fff;color:#0e7c86\">Back to Tech Radio Pass</a>" +
      "</div>" +
      "<div class=\"review\"><h2>Review</h2>" + review + "</div>";

    document.getElementById("again").addEventListener("click", function () {
      exam = newExam();
      idx = 0;
      renderQuestion();
      window.scrollTo(0, 0);
    });
  }

  document.addEventListener("keydown", function (ev) {
    if (!exam || exam.submitted) return;
    var tag = (ev.target && ev.target.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    var k = ev.key.toLowerCase();
    var it = exam.items[idx];
    var map = { a: 0, b: 1, c: 2, d: 3, "1": 0, "2": 1, "3": 2, "4": 3 };
    if (k in map) {
      it.picked = map[k];
      ev.preventDefault();
      renderQuestion();
      return;
    }
    if (k === "n" || k === "arrowright") {
      if (idx < exam.items.length - 1) { idx += 1; ev.preventDefault(); renderQuestion(); }
    } else if (k === "p" || k === "arrowleft") {
      if (idx > 0) { idx -= 1; ev.preventDefault(); renderQuestion(); }
    }
  });

  renderStart();
})();
