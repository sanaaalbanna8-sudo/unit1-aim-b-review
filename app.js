const SPEAKER = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 9v6h4l5 4V5L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4.03v8.06A4.5 4.5 0 0 0 16.5 12zM14 3.23v2.06a7 7 0 0 1 0 13.42v2.06a9 9 0 0 0 0-17.54z"/></svg>';

const NAV = [
  { title: "البداية", links: [
    ["#home", "من الرقم إلى القرار"],
    ["#route", "الرقم لا يقرر وحده"]
  ]},
  { title: "ب1 · البيانات والمعلومات", links: [
    ["#data-info", "من البيانات إلى القرار"],
    ["#levels", "ثلاثة مستويات"],
    ["#solutions", "حل تقنية المعلومات"],
    ["#factors", "ما الذي يغيّر الاحتياج"],
    ["#customers", "العميل والاستمرار"],
    ["#govern", "سياسة وتواصل وتشغيل"],
    ["#five", "خمس خصائص للمصدر"],
    ["#b1-take", "خلاصة ب1"]
  ]},
  { title: "ب2 · المجتمعات عبر الإنترنت", links: [
    ["#communities", "لماذا المجتمع الرقمي"],
    ["#channels", "طرق التواصل"],
    ["#person", "أثرها على الفرد"],
    ["#organisation", "أثرها على المؤسسة"],
    ["#sony", "عندما يُكسر الأمان"]
  ]},
  { title: "استخدام البيانات ومعالجتها", links: [
    ["#sources", "أولي وثانوي"],
    ["#collect", "طرق الجمع"],
    ["#accuracy", "الدقة والتحقق"],
    ["#model", "الفرز والنمذجة"],
    ["#interface", "الواجهة والعرض"],
    ["#decisions", "قرار الأمان يُكتب"]
  ]},
  { title: "المصطلحات والأسئلة", links: [
    ["#glossary", "المصطلحات"],
    ["#recall", "أسئلة"],
    ["#aim-b-task", "الواجب: الهدف ب"]
  ]}
];

function toast(message) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = message;
  el.style.display = "block";
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { el.style.display = "none"; }, 3200);
}

function buildNav() {
  const side = document.getElementById("side");
  if (!side) return;
  side.innerHTML = `
    <div class="brand-block">
      <a href="#home" data-goto="home">
        <div class="brand-k">UNIT 1 · AIM B</div>
        <strong>البيانات والمعلومات في المؤسسة</strong>
        <span>الوحدة 1 · المستوى الثالث</span>
      </a>
    </div>
    ${NAV.map((group) => `
      <h2>${group.title}</h2>
      ${group.links.map(([href, label]) => `<a class="item" href="${href}">${label}</a>`).join("")}
    `).join("")}
  `;
}

function upgradeTerms() {
  document.querySelectorAll(".t").forEach((el) => {
    if (el.dataset.ready) return;
    el.dataset.ready = "1";
    const en = el.dataset.en || "";
    const say = el.dataset.say || en;
    const ar = (el.dataset.ar || el.textContent || "").trim();
    el.textContent = "";
    el.classList.add("term");
    if (ar) {
      const label = document.createElement("span");
      label.className = "ar";
      label.textContent = ar;
      el.append(label);
    }
    if (en) {
      const bdi = document.createElement("bdi");
      bdi.className = "en";
      bdi.textContent = en;
      el.append(bdi);
    }
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "say";
    btn.dataset.en = say;
    btn.setAttribute("aria-label", "نطق " + (en || say));
    btn.innerHTML = SPEAKER;
    el.append(btn);
  });
}

function pickVoice() {
  const voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
  return voices.find((v) => v.lang.toLowerCase().startsWith("en-gb"))
    || voices.find((v) => v.lang.toLowerCase().startsWith("en"));
}

function speak(text, button) {
  if (!window.speechSynthesis) {
    toast("هذا المتصفح لا يشغّل النطق. العبارة الإنجليزية ظاهرة بجانب الزر.");
    return;
  }
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-GB";
  utter.rate = 0.88;
  const voice = pickVoice();
  if (voice) utter.voice = voice;
  document.querySelectorAll(".say.on").forEach((b) => b.classList.remove("on"));
  if (button) button.classList.add("on");
  utter.onend = () => button && button.classList.remove("on");
  window.speechSynthesis.speak(utter);
}

function wireGlossary() {
  const input = document.getElementById("glossarySearch");
  if (!input) return;
  input.addEventListener("input", () => {
    const value = input.value.trim().toLowerCase();
    document.querySelectorAll(".gloss article").forEach((article) => {
      article.hidden = Boolean(value) && !article.innerText.toLowerCase().includes(value);
    });
  });
}

document.addEventListener("click", (event) => {
  const say = event.target.closest(".say");
  if (say) {
    event.preventDefault();
    speak(say.dataset.en, say);
    return;
  }
  const reveal = event.target.closest(".reveal");
  if (reveal) {
    const answer = reveal.parentElement.querySelector(".answer");
    const open = answer.hasAttribute("hidden");
    if (open) answer.removeAttribute("hidden");
    else answer.setAttribute("hidden", "");
    reveal.textContent = open ? "أخفِ الجواب" : "أظهر الجواب";
  }
});

document.getElementById("btnMenu")?.addEventListener("click", () => {
  document.body.classList.toggle("nav-open");
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") document.body.classList.remove("nav-open");
});

if (window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => pickVoice();
}

buildNav();
upgradeTerms();
wireGlossary();
bootDeck();

function bootDeck() {
  const slides = [...document.querySelectorAll(".slide")];
  if (!slides.length) return;
  let index = 0;
  if (location.hash) {
    const found = slides.findIndex((slide) => "#" + slide.id === location.hash);
    if (found >= 0) index = found;
  }

  const bar = document.createElement("div");
  bar.className = "deck-bar";
  bar.innerHTML = '<p class="rights">© Sanaa Albanna · All rights reserved</p><button type="button" id="deckPrev">السابق</button><div class="track" aria-hidden="true"><span id="deckFill"></span></div><span class="count" id="deckCount"></span><button type="button" class="go" id="deckNext">التالي</button>';
  document.body.append(bar);

  function show(nextIndex) {
    index = nextIndex;
    slides.forEach((slide, i) => slide.classList.toggle("on", i === index));
    slides[index].scrollTop = 0;
    const id = slides[index].id;
    history.replaceState(null, "", "#" + id);
    document.getElementById("deckCount").textContent = (index + 1) + " / " + slides.length;
    document.getElementById("deckFill").style.width = ((index + 1) / slides.length * 100) + "%";
    const section = slides[index].dataset.section;
    document.querySelectorAll(".quick a").forEach((link) => {
      const on = link.dataset.section === section;
      if (on) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
    document.querySelectorAll(".side a.item").forEach((link) => {
      link.classList.toggle("active", (link.getAttribute("href") || "").endsWith("#" + id));
    });
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }

  function goToId(id) {
    const found = slides.findIndex((slide) => slide.id === id);
    if (found >= 0) show(found);
  }

  document.getElementById("deckNext").addEventListener("click", () => {
    if (index < slides.length - 1) show(index + 1);
  });
  document.getElementById("deckPrev").addEventListener("click", () => {
    if (index > 0) show(index - 1);
  });
  window.addEventListener("hashchange", () => {
    goToId(location.hash.slice(1));
  });
  document.addEventListener("click", (event) => {
    const link = event.target.closest("[data-goto], .side a.item, .quick a");
    if (!link) return;
    const href = link.getAttribute("href") || "";
    const id = link.dataset.goto || (href.startsWith("#") ? href.slice(1) : "");
    if (!id) return;
    if (slides.some((slide) => slide.id === id)) {
      event.preventDefault();
      goToId(id);
      document.body.classList.remove("nav-open");
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.target.matches("input, textarea, button, a")) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowDown" || event.key === "PageDown" || event.key === " ") {
      event.preventDefault();
      if (index < slides.length - 1) show(index + 1);
    } else if (event.key === "ArrowRight" || event.key === "ArrowUp" || event.key === "PageUp") {
      event.preventDefault();
      if (index > 0) show(index - 1);
    }
  });
  show(index);
}
