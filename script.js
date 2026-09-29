(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(t) { return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  /* ------------------------------------------------------------------ data */
  var LINES = [
    { s: 'Reporter', en: 'Your basketball team, The Falcons, is now leading the Junior League. So, how did the team start?',
      ar: 'فريق كرة السلة الخاص بك، The Falcons، يتصدر الآن الدوري الناشئ. إذًا، كيف بدأ الفريق؟' },
    { s: 'Khalid', en: 'Our coach posted a note on the bulletin board at our high school asking for players. The team was formed from the group of hopeful athletes that turned up at the gym.',
      ar: 'علّق مدرّبنا ورقة على لوحة الإعلانات في مدرستنا الثانوية يطلب فيها لاعبين. تكوّن الفريق من مجموعة الرياضيين الطامحين الذين حضروا إلى الصالة.' },
    { s: 'Reporter', en: 'Do you still have the original team members?',
      ar: 'هل ما زال لديكم أعضاء الفريق الأصليون؟' },
    { s: 'Khalid', en: 'Yeah. Charlie and Dave are forwards, Carlos plays shooting guard, and I’m the point guard. But Trevor...',
      ar: 'نعم. تشارلي وديف مهاجمان، وكارلوس يلعب حارس رمي، وأنا صانع الألعاب. لكن تريفور...' },
    { s: 'Reporter', en: 'What about your center forward? When did he join the team?',
      ar: 'وماذا عن مهاجمكم المركزي؟ متى انضم إلى الفريق؟' },
    { s: 'Khalid', en: 'Trevor came along a few months later. He used to play on another team, but he wasn’t into the attitude of the players. He said they weren’t serious enough, so he joined our team.',
      ar: 'جاء تريفور بعد بضعة أشهر. كان يلعب في فريق آخر، لكنه لم يكن معجبًا بسلوك اللاعبين. قال إنهم ليسوا جادّين بما يكفي، فانضم إلى فريقنا.' },
    { s: 'Reporter', en: 'Where did you practice, and where do you play?',
      ar: 'أين كنتم تتدرّبون، وأين تلعبون؟' },
    { s: 'Khalid', en: 'We used to practice in the school gym, but now we use the sports center. It has better facilities. We started in B Division, but now we’re in A Division.',
      ar: 'كنا نتدرّب في صالة المدرسة، لكننا الآن نستخدم المركز الرياضي. مرافقه أفضل. بدأنا في الدرجة B، أما الآن فنحن في الدرجة A.' },
    { s: 'Reporter', en: 'When did your first big break come?',
      ar: 'متى جاءت فرصتكم المهمة الأولى؟' }
  ];

  var VOCAB = [
    { key: 'turned up', re: /turned up/g, tip: 'turn up = يظهر / يحضر' },
    { key: 'What about', re: /What about/g, tip: 'What about…? = ماذا عن…؟ (للانتقال إلى موضوع جديد)' },
    { key: 'wasn’t into', re: /wasn’t into/g, tip: 'be into something = يهتم بشيء أو يعجبه' },
    { key: 'big break', re: /big break/g, tip: 'big break = فرصة مهمة' }
  ];

  var REAL_TALK = [
    { p: 'to turn up', ar: 'يظهر / يحضر', en: 'to appear unexpectedly', ex: '…hopeful athletes that turned up at the gym.' },
    { p: 'What about…?', ar: 'ماذا عن…؟ (للانتقال إلى موضوع جديد)', en: 'used to introduce a new topic', ex: 'What about your center forward?' },
    { p: 'to be into something', ar: 'يهتم بشيء أو يعجبه', en: 'to be interested in, to like', ex: '…he wasn’t into the attitude of the players.' },
    { p: 'big break', ar: 'فرصة مهمة', en: 'important opportunity', ex: 'When did your first big break come?' }
  ];

  var ENDINGS = [
    'When Trevor joined our team.',
    'When we won an important tournament.',
    'When we beat the best team in Division B by 20 points.',
    'Your idea.'
  ];

  var ABOUT = [
    { q: 'How and where did the team members meet?',
      a: 'They met at the gym at their high school. The coach posted a note asking for players, and hopeful athletes turned up.',
      ar: 'التقوا في صالة المدرسة الثانوية بعد أن علّق المدرب إعلانًا يطلب لاعبين.' },
    { q: 'Were all the players originally on the team?',
      a: 'No, they weren’t. Trevor came along a few months later.',
      ar: 'لا. انضم تريفور بعد عدة أشهر.' },
    { q: 'Where did they use to practice?',
      a: 'They used to practice in the school gym.',
      ar: 'كانوا يتدرّبون في صالة المدرسة.' },
    { q: 'Why did Trevor leave the other team?',
      a: 'He wasn’t into the attitude of the players. He said they weren’t serious enough.',
      ar: 'لم يعجبه سلوك اللاعبين؛ قال إنهم ليسوا جادّين بما يكفي.' },
    { q: 'Why did the team change gyms?',
      a: 'The sports center has better facilities.',
      ar: 'لأن المركز الرياضي مرافقه أفضل.' }
  ];

  var STARTERS = [
    'How did your career start?',
    'Who was your first coach?',
    'Where did you use to practice?',
    'What about your first team?',
    'When did your first big break come?',
    'Why did you choose this sport?'
  ];

  var MCQ = [
    { q: 'Where did the coach post the note?',
      o: ['On the bulletin board at the high school', 'At the sports center', 'On the internet', 'In the Junior League office'], c: 0,
      e: 'The coach posted a note on the bulletin board at the high school.', ar: 'علّق المدرب الإعلان على لوحة الإعلانات في المدرسة الثانوية.' },
    { q: 'What position does Khalid play?',
      o: ['Center forward', 'Shooting guard', 'Point guard', 'Forward'], c: 2,
      e: 'Khalid says, “I’m the point guard.”', ar: 'خالد يلعب صانع ألعاب (point guard).' },
    { q: 'Who plays center forward?',
      o: ['Charlie', 'Dave', 'Carlos', 'Trevor'], c: 3,
      e: 'The reporter asks about the center forward, and Khalid talks about Trevor.', ar: 'تريفور هو المهاجم المركزي.' },
    { q: 'Why did Trevor leave his old team?',
      o: ['He wasn’t into the players’ attitude', 'He moved to another city', 'The coach asked him to leave', 'He didn’t like basketball'], c: 0,
      e: 'He said the players weren’t serious enough.', ar: 'لم يعجبه سلوك اللاعبين ورآهم غير جادّين.' },
    { q: 'Where does the team practice now?',
      o: ['In the school gym', 'At the sports center', 'In a park', 'At Trevor’s house'], c: 1,
      e: 'Now they use the sports center because it has better facilities.', ar: 'يتدرّبون الآن في المركز الرياضي.' },
    { q: 'What does “big break” mean?',
      o: ['A long rest', 'A broken ball', 'An important opportunity', 'A new coach'], c: 2,
      e: 'Big break = important opportunity.', ar: 'big break تعني فرصة مهمة.' }
  ];

  var TF = [
    { q: 'The coach posted a note on the bulletin board at a high school.', c: true,
      e: 'True. The note asked for players.', ar: 'صحيح: الإعلان كان يطلب لاعبين.' },
    { q: 'Trevor was one of the original team members.', c: false,
      e: 'False. Trevor came along a few months later.', ar: 'خطأ: انضم تريفور بعد عدة أشهر.' },
    { q: 'Carlos plays shooting guard.', c: true,
      e: 'True. “Carlos plays shooting guard.”', ar: 'صحيح: كارلوس يلعب حارس رمي.' },
    { q: 'The team used to practice at the sports center.', c: false,
      e: 'False. They used to practice in the school gym; now they use the sports center.', ar: 'خطأ: كانوا يتدرّبون في صالة المدرسة، والآن في المركز الرياضي.' },
    { q: 'The team started in A Division.', c: false,
      e: 'False. They started in B Division, and now they’re in A Division.', ar: 'خطأ: بدأوا في الدرجة B وهم الآن في الدرجة A.' },
    { q: 'Trevor thought the players on his old team were serious enough.', c: false,
      e: 'False. He said they weren’t serious enough.', ar: 'خطأ: قال إنهم ليسوا جادّين بما يكفي.' }
  ];

  /* ---------------------------------------------------------- dialogue UI */
  var list = $('#dialogueList');
  function decorate(text) {
    var html = esc(text);
    VOCAB.forEach(function (v) {
      html = html.replace(v.re, function (m) { return '<span class="hl" title="' + v.tip + '">' + m + '</span>'; });
    });
    return html;
  }
  LINES.forEach(function (l, i) {
    var li = document.createElement('li');
    li.className = 'line';
    li.tabIndex = 0;
    li.setAttribute('data-i', i);
    var rep = l.s === 'Reporter';
    li.innerHTML = '<span class="spk ' + (rep ? 'spk--rep' : 'spk--kha') + '">' + l.s + ':</span>' +
      '<div class="line__body"><div class="line__en">' + decorate(l.en) + '</div>' +
      '<div class="line__ar" lang="ar">' + esc(l.ar) + '</div></div>';
    list.appendChild(li);
  });
  var lineEls = $$('.line', list);

  var ball = $('#ball');
  var sbScore = $('#sbScore'), sbDiv = $('#sbDiv'), sbLine = $('#sbLine');
  var BALL_POS = [[110, 70], [290, 170], [110, 170], [290, 70], [110, 120], [300, 120], [110, 60], [290, 180], [364, 120]];
  function moveBall(i) {
    var p = BALL_POS[Math.max(0, i)] || [200, 120];
    ball.style.setProperty('--bx', p[0] + 'px');
    ball.style.setProperty('--by', p[1] + 'px');
  }
  function setScore(done) {
    var v = String(done * 2);
    if (sbScore.textContent !== v) {
      sbScore.textContent = v;
      sbScore.classList.remove('pop');
      void sbScore.offsetWidth;
      sbScore.classList.add('pop');
    }
  }

  var idx = -1, playing = false, timer = null;
  var playBtn = $('#playBtn'), pauseBtn = $('#pauseBtn'), replayBtn = $('#replayBtn');
  var speedSel = $('#speedSel');

  function duration(i) {
    var words = LINES[i].en.split(/\s+/).length;
    return Math.round((1200 + words * 330) * parseFloat(speedSel.value || '1'));
  }
  function render() {
    lineEls.forEach(function (el, i) {
      el.classList.toggle('is-active', i === idx);
      el.classList.toggle('is-done', i < idx);
      if (i === idx) el.setAttribute('aria-current', 'true'); else el.removeAttribute('aria-current');
    });
    var done = Math.max(0, idx + (playing ? 0 : 1));
    if (idx < 0) done = 0;
    setScore(idx < 0 ? 0 : idx + 1);
    sbLine.textContent = (idx + 1) + '/' + LINES.length;
    sbDiv.textContent = idx >= 7 ? 'A' : 'B';
    moveBall(idx);
    ball.classList.toggle('ball--bounce', playing);
  }
  function setButtons() {
    playBtn.disabled = playing;
    pauseBtn.disabled = !playing;
  }
  function clearT() { if (timer) { clearTimeout(timer); timer = null; } }
  function goTo(i, scroll) {
    idx = i;
    render();
    if (scroll && lineEls[i]) {
      var reduce = document.documentElement.classList.contains('reduce-motion') ||
        (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
      lineEls[i].scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
    }
  }
  function schedule() {
    clearT();
    timer = setTimeout(function () {
      if (idx >= LINES.length - 1) { finish(); return; }
      goTo(idx + 1, true);
      schedule();
    }, duration(idx));
  }
  function finish() {
    playing = false; clearT(); setButtons(); render();
  }
  function play() {
    if (idx >= LINES.length - 1) idx = -1;
    playing = true; setButtons();
    if (idx < 0) goTo(0, true); else render();
    schedule();
  }
  function pause() { playing = false; clearT(); setButtons(); render(); }
  function replay() { clearT(); idx = -1; playing = false; play(); }

  playBtn.addEventListener('click', play);
  pauseBtn.addEventListener('click', pause);
  replayBtn.addEventListener('click', replay);
  speedSel.addEventListener('change', function () { if (playing) schedule(); });
  lineEls.forEach(function (el) {
    function pick() { var i = +el.getAttribute('data-i'); goTo(i, false); if (playing) schedule(); }
    el.addEventListener('click', pick);
    el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
  });
  $('#arToggle').addEventListener('change', function (e) {
    list.classList.toggle('hide-ar', !e.target.checked);
    store('falcons.ar', e.target.checked ? '1' : '0');
  });
  if (store('falcons.ar') === '0') { $('#arToggle').checked = false; list.classList.add('hide-ar'); }
  render(); setButtons();

  /* ------------------------------------------------------------ Real Talk */
  var rt = $('#rtGrid');
  REAL_TALK.forEach(function (r) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'flip'; b.setAttribute('aria-pressed', 'false');
    b.innerHTML = '<span class="flip__in"><span class="face face--front"><b>' + esc(r.p) + '</b><small>اضغط للقلب</small></span>' +
      '<span class="face face--back"><span class="ar-t" dir="rtl" lang="ar">' + esc(r.ar) + '</span>' +
      '<span class="en-t">' + esc(r.en) + '</span><span class="en-t"><i>“' + esc(r.ex) + '”</i></span></span></span>';
    b.addEventListener('click', function () {
      var f = b.classList.toggle('is-flipped');
      b.setAttribute('aria-pressed', f ? 'true' : 'false');
    });
    rt.appendChild(b);
  });

  /* ---------------------------------------------------------- Your Ending */
  var eo = $('#endingOptions'), ideaBox = $('#ideaBox'), efb = $('#endingFeedback'), ideaInput = $('#ideaInput');
  ENDINGS.forEach(function (t, i) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'opt'; b.setAttribute('role', 'radio'); b.setAttribute('aria-checked', 'false');
    b.innerHTML = '<span class="opt__n">' + (i + 1) + '</span><span>' + esc(t) + '</span>';
    b.addEventListener('click', function () {
      $$('.opt', eo).forEach(function (o) { o.classList.remove('is-picked'); o.setAttribute('aria-checked', 'false'); });
      b.classList.add('is-picked'); b.setAttribute('aria-checked', 'true');
      if (i === 3) {
        ideaBox.hidden = false; ideaInput.focus();
        efb.textContent = 'اكتب نهايتك بالإنجليزية ثم شاركها مع زميلك.';
      } else {
        ideaBox.hidden = true;
        efb.textContent = 'Good guess! There is no single correct answer, because the conversation ends here. Compare your choice with a classmate. — لا توجد إجابة واحدة صحيحة؛ قارن اختيارك مع زميلك.';
      }
    });
    eo.appendChild(b);
  });
  ideaInput.addEventListener('input', function () {
    efb.textContent = ideaInput.value.trim() ? 'Nice idea! Read it aloud to your partner. — فكرة جميلة! اقرأها بصوت عالٍ لزميلك.' : 'اكتب نهايتك بالإنجليزية ثم شاركها مع زميلك.';
  });

  /* -------------------------------------------------- About the Conversation */
  var qa = $('#qaList');
  ABOUT.forEach(function (it, i) {
    var li = document.createElement('li');
    li.innerHTML = '<div class="qt">' + (i + 1) + '. ' + esc(it.q) + '</div>' +
      '<textarea aria-label="Your answer to question ' + (i + 1) + '" placeholder="Write your answer…"></textarea>' +
      '<button class="btn" type="button">Show model answer · إظهار الإجابة</button>' +
      '<div class="ans" hidden>' + esc(it.a) + '<span class="ar" lang="ar">' + esc(it.ar) + '</span></div>';
    var btn = $('button', li), ans = $('.ans', li);
    btn.addEventListener('click', function () { ans.hidden = !ans.hidden; });
    qa.appendChild(li);
  });

  /* ------------------------------------------------------------ Your Turn */
  var st = $('#starters');
  STARTERS.forEach(function (s) { var sp = document.createElement('span'); sp.textContent = s; st.appendChild(sp); });
  var tEl = $('#timerTime'), tInt = null, tLeft = 120;
  function fmt(n) { var m = Math.floor(n / 60), s = n % 60; return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s; }
  function tReset() { clearInterval(tInt); tInt = null; tLeft = 120; tEl.textContent = fmt(tLeft); tEl.classList.remove('done'); $('#timerStart').textContent = 'Start timer'; }
  $('#timerStart').addEventListener('click', function () {
    if (tInt) { clearInterval(tInt); tInt = null; this.textContent = 'Resume'; return; }
    if (tLeft <= 0) tReset();
    this.textContent = 'Pause';
    var btn = this;
    tInt = setInterval(function () {
      tLeft--; tEl.textContent = fmt(Math.max(0, tLeft));
      if (tLeft <= 0) { clearInterval(tInt); tInt = null; tEl.classList.add('done'); btn.textContent = 'Start timer'; }
    }, 1000);
  });
  $('#timerReset').addEventListener('click', tReset);

  /* ----------------------------------------------------------------- Quiz */
  var correct = 0, answered = 0, TOTAL = MCQ.length + TF.length;
  var scoreBox = $('#scoreBox');
  function updateScore() {
    scoreBox.textContent = 'Score: ' + correct + ' / ' + TOTAL + ' · Answered: ' + answered +
      (answered === TOTAL ? (correct === TOTAL ? ' 🏆 Perfect!' : ' ✅ Done!') : '');
  }
  function buildQuiz() {
    correct = 0; answered = 0;
    var mcq = $('#mcq'), tf = $('#tf');
    mcq.innerHTML = ''; tf.innerHTML = '';
    function make(item, i, opts, isTf, host) {
      var box = document.createElement('div'); box.className = 'qz';
      box.innerHTML = '<div class="qz__q">' + (i + 1) + '. ' + esc(item.q) + '</div><div class="qz__opts"></div>' +
        '<div class="qz__exp"></div>';
      var wrap = $('.qz__opts', box);
      opts.forEach(function (label, oi) {
        var b = document.createElement('button'); b.type = 'button'; b.textContent = label;
        b.addEventListener('click', function () {
          if (box.classList.contains('answered')) return;
          var ok = isTf ? ((oi === 0) === item.c) : (oi === item.c);
          box.classList.add('answered');
          answered++; if (ok) correct++;
          $$('button', wrap).forEach(function (x, xi) {
            x.disabled = true;
            var right = isTf ? ((xi === 0) === item.c) : (xi === item.c);
            if (right) x.classList.add('right');
          });
          if (!ok) b.classList.add('wrong');
          $('.qz__exp', box).innerHTML = (ok ? '✅ Correct! ' : '❌ Not quite. ') + esc(item.e) +
            '<span class="ar" lang="ar">' + esc(item.ar) + '</span>';
          updateScore();
        });
        wrap.appendChild(b);
      });
      host.appendChild(box);
    }
    MCQ.forEach(function (m, i) { make(m, i, m.o, false, mcq); });
    TF.forEach(function (t, i) { make(t, i, ['True', 'False'], true, tf); });
    updateScore();
  }
  buildQuiz();
  $('#quizReset').addEventListener('click', buildQuiz);
  $$('.tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      $$('.tab').forEach(function (t) { t.classList.remove('is-active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('is-active'); tab.setAttribute('aria-selected', 'true');
      $('#mcq').hidden = tab.getAttribute('data-target') !== 'mcq';
      $('#tf').hidden = tab.getAttribute('data-target') !== 'tf';
    });
  });

  /* ------------------------------------------- progress, chips, to-top, motion */
  var bar = $('#progressBar'), toTop = $('#toTop');
  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
    toTop.hidden = h.scrollTop < 400;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop.addEventListener('click', function () {
    var reduce = document.documentElement.classList.contains('reduce-motion') ||
      (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });

  var chips = $$('#chips a');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          chips.forEach(function (c) { c.classList.toggle('is-active', c.getAttribute('data-sec') === en.target.id); });
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    chips.forEach(function (c) { var s = document.getElementById(c.getAttribute('data-sec')); if (s) io.observe(s); });
  }

  var motionBtn = $('#motionBtn');
  function setMotion(on) {
    document.documentElement.classList.toggle('reduce-motion', on);
    motionBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
    motionBtn.textContent = on ? 'الحركة: مُقلّلة' : 'تقليل الحركة';
  }
  var saved = store('falcons.motion');
  var sysReduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  setMotion(saved === null ? sysReduce : saved === '1');
  motionBtn.addEventListener('click', function () {
    var on = !document.documentElement.classList.contains('reduce-motion');
    setMotion(on); store('falcons.motion', on ? '1' : '0');
  });

  /* ---------------------------------------------------------- offline (SW) */
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () { /* offline cache is optional */ });
    });
  }
})();
