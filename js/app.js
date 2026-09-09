/* ========== Nihon Word Play — Main App ========== */

const state = {
  level: null,
  mode: null,
  words: [],
  queue: [],
  current: null,
  score: 0,
  totalAnswered: 0,
  streak: 0,
  bestStreak: 0,
  lives: 3,
  timeLeft: 20,
  maxTime: 20,
  timerId: null,
  answered: false,
  targetQuestions: 50,
  lang: localStorage.getItem('nihon-lang') || 'id',
};

const i18n = {
  en: {
    tagline: 'Master JLPT vocabulary the fun way',
    choose_level: 'Choose Level',
    choose_mode: 'Choose Mode',
    lvl_n5: 'Beginner',
    lvl_n4: 'Elementary',
    lvl_n3: 'Intermediate',
    lvl_n2: 'Advanced',
    lvl_n1: 'Expert',
    mode_time: 'Time Attack',
    mode_time_desc: 'Race the clock. Start with 20s — earn more time with streaks!',
    mode_normal: 'Normal',
    mode_normal_desc: 'Answer 50 questions. Perfect for focused practice.',
    mode_survival: 'Survival',
    mode_survival_desc: 'Keep going until 3 mistakes. How far can you go?',
    btn_select: 'Select Level & Mode to Start',
    btn_start: 'Start Quiz ▶',
    footer: 'Data based on OpenJLPT · CC BY-SA 4.0',
    stat_score: 'Score',
    stat_streak: 'Streak',
    stat_lives: 'Lives',
    stat_question: 'Question',
    q_prompt: 'What does this word mean?',
    r_correct: 'Correct',
    r_total: 'Total',
    r_accuracy: 'Accuracy',
    r_best_streak: 'Best Streak',
    btn_retry: 'Play Again',
    btn_home: 'Back to Home',
    correct: 'Correct!',
    great: 'Great!',
    amazing: '✨ Amazing!',
    onfire: '🔥 On fire!',
    wrong: 'Wrong —',
    plus3s: '  +3s!',
    res_time_master: 'Time Master!',
    res_time_great: 'Great speed!',
    res_time_nice: 'Nice try!',
    res_time_keep: 'Keep practicing!',
    res_time_sub: (s) => `You answered ${s} correctly before time ran out.`,
    res_surv_unstop: 'Unstoppable!',
    res_surv_survivor: 'Survivor!',
    res_surv_solid: 'Solid run!',
    res_surv_try: 'Try again!',
    res_surv_sub: (s) => `You survived ${s} questions before 3 mistakes.`,
    res_norm_excellent: 'Excellent!',
    res_norm_well: 'Well done!',
    res_norm_good: 'Good effort!',
    res_norm_keep: 'Keep going!',
    res_norm_sub: (s, t) => `You got ${s} out of ${t} correct.`,
    quit_confirm: 'Quit this quiz?',
    mode_names: { time: 'Time Attack', normal: 'Normal', survival: 'Survival' },
    loading: 'Loading...',
  },
  id: {
    tagline: 'Kuasai kosakata JLPT dengan cara yang menyenangkan',
    choose_level: 'Pilih Level',
    choose_mode: 'Pilih Mode',
    lvl_n5: 'Pemula',
    lvl_n4: 'Dasar',
    lvl_n3: 'Menengah',
    lvl_n2: 'Mahir',
    lvl_n1: 'Ahli',
    mode_time: 'Time Attack',
    mode_time_desc: 'Kejar waktu! Mulai 20 detik — dapat waktu ekstra dengan streak!',
    mode_normal: 'Normal',
    mode_normal_desc: 'Jawab 50 soal. Cocok untuk latihan fokus.',
    mode_survival: 'Survival',
    mode_survival_desc: 'Terus jawab sampai 3 kali salah. Sejauh mana kamu bisa?',
    btn_select: 'Pilih Level & Mode untuk Mulai',
    btn_start: 'Mulai Kuis ▶',
    footer: 'Data berdasarkan OpenJLPT · CC BY-SA 4.0',
    stat_score: 'Skor',
    stat_streak: 'Streak',
    stat_lives: 'Nyawa',
    stat_question: 'Soal',
    q_prompt: 'Apa arti kata ini?',
    r_correct: 'Benar',
    r_total: 'Total',
    r_accuracy: 'Akurasi',
    r_best_streak: 'Streak Terbaik',
    btn_retry: 'Main Lagi',
    btn_home: 'Kembali ke Beranda',
    correct: 'Benar!',
    great: 'Bagus!',
    amazing: '✨ Keren!',
    onfire: '🔥 Mantap!',
    wrong: 'Salah —',
    plus3s: '  +3d!',
    res_time_master: 'Master Waktu!',
    res_time_great: 'Kecepatan bagus!',
    res_time_nice: 'Bagus dicoba!',
    res_time_keep: 'Terus berlatih!',
    res_time_sub: (s) => `Kamu menjawab ${s} dengan benar sebelum waktu habis.`,
    res_surv_unstop: 'Tak Terhentikan!',
    res_surv_survivor: 'Survivor!',
    res_surv_solid: 'Bagus sekali!',
    res_surv_try: 'Coba lagi!',
    res_surv_sub: (s) => `Kamu bertahan ${s} soal sebelum 3 kesalahan.`,
    res_norm_excellent: 'Luar biasa!',
    res_norm_well: 'Kerja bagus!',
    res_norm_good: 'Usaha bagus!',
    res_norm_keep: 'Terus semangat!',
    res_norm_sub: (s, t) => `Kamu benar ${s} dari ${t} soal.`,
    quit_confirm: 'Keluar dari kuis ini?',
    mode_names: { time: 'Time Attack', normal: 'Normal', survival: 'Survival' },
    loading: 'Memuat...',
  },
};

function t(key, ...args) {
  const dict = i18n[state.lang] || i18n.en;
  const val = dict[key];
  if (typeof val === 'function') return val(...args);
  return val ?? key;
}

function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const text = t(key);
    if (text) el.textContent = text;
  });
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.lang === state.lang);
  });
  document.documentElement.lang = state.lang === 'id' ? 'id' : 'en';
  updateLevelAvailability();
  updateStartBtnText();
}

/** N3+ only fully supported in English (ID translations incomplete) */
function updateLevelAvailability() {
  const advanced = ['n3', 'n2', 'n1'];
  const idMode = state.lang === 'id';
  document.querySelectorAll('.level-btn').forEach((btn) => {
    const level = btn.dataset.level;
    const locked = idMode && advanced.includes(level);
    btn.disabled = locked;
    btn.classList.toggle('locked', locked);
    btn.title = locked
      ? (state.lang === 'id'
          ? 'Level ini hanya tersedia dalam bahasa Inggris (arti ID belum lengkap)'
          : 'This level is only available in English')
      : '';
    if (locked && btn.classList.contains('active')) {
      btn.classList.remove('active');
      if (state.level === level) state.level = null;
    }
  });
  // hint under level panel
  let hint = document.getElementById('level-lang-hint');
  if (!hint) {
    const grid = document.getElementById('level-select');
    if (grid && grid.parentElement) {
      hint = document.createElement('p');
      hint.id = 'level-lang-hint';
      hint.className = 'level-lang-hint';
      grid.parentElement.appendChild(hint);
    }
  }
  if (hint) {
    if (idMode) {
      hint.textContent = 'N3–N1 hanya tersedia saat bahasa EN (arti Indonesia belum lengkap).';
      hint.classList.remove('hidden');
    } else {
      hint.textContent = '';
      hint.classList.add('hidden');
    }
  }
}

function updateStartBtnText() {
  const startBtn = document.querySelector('#btn-start');
  if (!startBtn) return;
  const levelOk = state.level && !(state.lang === 'id' && ['n3', 'n2', 'n1'].includes(state.level));
  if (levelOk && state.mode) {
    startBtn.disabled = false;
    startBtn.textContent = t('btn_start');
  } else {
    startBtn.disabled = true;
    startBtn.textContent = t('btn_select');
  }
}

const $ = (sel) => document.querySelector(sel);
const screens = {
  home: null,
  quiz: null,
  result: null,
};

document.addEventListener('DOMContentLoaded', () => {
  screens.home = $('#screen-home');
  screens.quiz = $('#screen-quiz');
  screens.result = $('#screen-result');
  createPetals();
  bindLangSwitcher();
  applyI18n();
  bindHome();
  bindQuiz();
  bindResult();
});

function bindLangSwitcher() {
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.lang = btn.dataset.lang;
      localStorage.setItem('nihon-lang', state.lang);
      applyI18n();
      if (screens.quiz && screens.quiz.classList.contains('active')) {
        $('#quiz-mode').textContent = t('mode_names')[state.mode] || state.mode;
      }
    });
  });
}

function createPetals() {
  const container = $('#petals');
  if (!container) return;
  for (let i = 0; i < 12; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = 8 + Math.random() * 12 + 's';
    p.style.animationDelay = Math.random() * 10 + 's';
    p.style.width = 8 + Math.random() * 10 + 'px';
    p.style.height = p.style.width;
    container.appendChild(p);
  }
}

function bindHome() {
  const levelBtns = document.querySelectorAll('.level-btn');
  const modeBtns = document.querySelectorAll('.mode-btn');
  const startBtn = $('#btn-start');

  levelBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.disabled) return;
      levelBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      state.level = btn.dataset.level;
      updateStartBtnText();
    });
  });

  modeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      modeBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      state.mode = btn.dataset.mode;
      updateStartBtnText();
    });
  });

  startBtn.addEventListener('click', startQuiz);
}

async function loadWords(level) {
  const res = await fetch(`data/${level}.json`);
  if (!res.ok) throw new Error('Failed');
  const data = await res.json();
  return data.filter((w) => w.meanings && w.meanings.length > 0 && w.word);
}

function getMeanings(word) {
  if (state.lang === 'id' && Array.isArray(word.meanings_id) && word.meanings_id.length) {
    return word.meanings_id;
  }
  return word.meanings;
}

async function startQuiz() {
  if (state.lang === 'id' && ['n3', 'n2', 'n1'].includes(state.level)) {
    alert(state.lang === 'id'
      ? 'Level N3–N1 hanya tersedia dalam bahasa Inggris. Silakan pilih EN atau level N5/N4.'
      : 'N3–N1 are only available in English.');
    return;
  }
  const startBtn = $('#btn-start');
  startBtn.disabled = true;
  startBtn.textContent = t('loading');

  try {
    state.words = await loadWords(state.level);
  } catch (e) {
    alert(state.lang === 'id' ? 'Gagal memuat data kosakata.' : 'Could not load vocabulary.');
    updateStartBtnText();
    return;
  }

  state.score = 0;
  state.totalAnswered = 0;
  state.streak = 0;
  state.bestStreak = 0;
  state.lives = 3;
  state.timeLeft = 20;
  state.maxTime = 20;
  state.answered = false;
  state.queue = shuffle([...state.words]);

  $('#quiz-level').textContent = state.level.toUpperCase();
  $('#quiz-mode').textContent = t('mode_names')[state.mode] || state.mode;

  const timerWrap = $('#timer-wrap');
  const livesWrap = $('#stat-lives-wrap');
  const qWrap = $('#stat-q-wrap');
  const streakWrap = $('#stat-streak-wrap');

  if (state.mode === 'time') {
    timerWrap.classList.remove('hidden');
    livesWrap.classList.add('hidden');
    qWrap.classList.add('hidden');
    streakWrap.classList.remove('hidden');
  } else if (state.mode === 'survival') {
    timerWrap.classList.add('hidden');
    livesWrap.classList.remove('hidden');
    qWrap.classList.add('hidden');
    streakWrap.classList.remove('hidden');
    updateLives();
  } else {
    timerWrap.classList.add('hidden');
    livesWrap.classList.add('hidden');
    qWrap.classList.remove('hidden');
    streakWrap.classList.remove('hidden');
  }

  showScreen('quiz');
  nextQuestion();
  if (state.mode === 'time') startTimer();
  updateStartBtnText();
}

function nextQuestion() {
  state.answered = false;
  $('#feedback').classList.add('hidden');
  $('#choices').innerHTML = '';

  if (state.queue.length === 0) state.queue = shuffle([...state.words]);

  if (state.mode === 'normal' && state.totalAnswered >= state.targetQuestions) {
    endQuiz();
    return;
  }

  state.current = state.queue.pop();
  renderQuestion(state.current);
  updateStats();
}

function renderQuestion(word) {
  $('#q-word').textContent = word.word;
  const readingEl = $('#q-reading');
  if (word.reading && word.reading !== word.word) {
    readingEl.textContent = word.reading;
    readingEl.style.display = '';
  } else {
    readingEl.textContent = '';
    readingEl.style.display = 'none';
  }

  const meanings = getMeanings(word);
  const correct = pickMeaning(meanings);
  const distractors = getDistractors(correct, 3);
  const options = shuffle([correct, ...distractors]);

  const container = $('#choices');
  container.innerHTML = '';
  options.forEach((opt) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = opt;
    btn.addEventListener('click', () => handleAnswer(btn, opt === correct, correct));
    container.appendChild(btn);
  });
}

function pickMeaning(meanings) {
  const short = meanings.filter((m) => m && m.length < 70);
  return short[0] || meanings[0] || '?';
}

function getDistractors(correct, n) {
  const pool = state.words
    .flatMap((w) => getMeanings(w))
    .filter((m) => m && m !== correct && m.length < 65);
  return shuffle([...new Set(pool)]).slice(0, n);
}

function handleAnswer(btn, isCorrect, correctText) {
  if (state.answered) return;
  state.answered = true;
  state.totalAnswered++;

  document.querySelectorAll('.choice-btn').forEach((b) => {
    b.disabled = true;
    if (b.textContent === correctText) b.classList.add('reveal');
  });

  const feedback = $('#feedback');

  if (isCorrect) {
    btn.classList.add('correct');
    state.score++;
    state.streak++;
    if (state.streak > state.bestStreak) state.bestStreak = state.streak;
    feedback.textContent = getPraise(state.streak);
    feedback.className = 'feedback ok';
    feedback.classList.remove('hidden');
    if (state.mode === 'time' && state.streak > 0 && state.streak % 3 === 0) {
      state.timeLeft = Math.min(state.timeLeft + 3, 45);
      state.maxTime = Math.max(state.maxTime, state.timeLeft);
      feedback.textContent += t('plus3s');
    }
  } else {
    btn.classList.add('wrong');
    state.streak = 0;
    feedback.textContent = t('wrong') + ' ' + correctText;
    feedback.className = 'feedback bad';
    feedback.classList.remove('hidden');

    if (state.mode === 'time') {
      state.timeLeft = Math.max(0, state.timeLeft - 5);
      if (state.timeLeft <= 0) {
        updateTimerUI();
        setTimeout(endQuiz, 900);
        return;
      }
    } else if (state.mode === 'survival') {
      state.lives--;
      updateLives();
      if (state.lives <= 0) {
        setTimeout(endQuiz, 900);
        return;
      }
    }
  }

  updateStats();
  updateProgress();

  setTimeout(() => {
    if (state.mode === 'normal' && state.totalAnswered >= state.targetQuestions) endQuiz();
    else if (state.mode === 'survival' && state.lives <= 0) endQuiz();
    else if (state.mode === 'time' && state.timeLeft <= 0) endQuiz();
    else nextQuestion();
  }, 1100);
}

function getPraise(streak) {
  if (streak >= 10) return t('onfire');
  if (streak >= 5) return t('amazing');
  if (streak >= 3) return t('great');
  return t('correct');
}

function startTimer() {
  clearInterval(state.timerId);
  updateTimerUI();
  state.timerId = setInterval(() => {
    state.timeLeft--;
    updateTimerUI();
    if (state.timeLeft <= 0) {
      clearInterval(state.timerId);
      if (!state.answered) endQuiz();
    }
  }, 1000);
}

function updateTimerUI() {
  const text = $('#timer-text');
  const progress = $('#timer-progress');
  text.textContent = Math.max(0, state.timeLeft);
  const pct = (state.timeLeft / state.maxTime) * 100;
  progress.setAttribute('stroke-dasharray', pct + ', 100');
  progress.classList.remove('warning', 'danger');
  if (state.timeLeft <= 5) progress.classList.add('danger');
  else if (state.timeLeft <= 10) progress.classList.add('warning');
}

function updateStats() {
  $('#stat-score').textContent = state.score;
  $('#stat-streak').textContent = state.streak;
  if (state.mode === 'normal') {
    $('#stat-q').textContent = Math.min(state.totalAnswered + 1, state.targetQuestions) + ' / ' + state.targetQuestions;
  }
}

function updateLives() {
  $('#stat-lives').textContent = '❤️'.repeat(state.lives) + '🖤'.repeat(3 - state.lives);
}

function updateProgress() {
  let pct = 0;
  if (state.mode === 'normal') pct = (state.totalAnswered / state.targetQuestions) * 100;
  else if (state.mode === 'survival') pct = ((3 - state.lives) / 3) * 100;
  else pct = Math.min(100, (state.score / 30) * 100);
  $('#progress-fill').style.width = pct + '%';
}

function endQuiz() {
  clearInterval(state.timerId);
  showScreen('result');
  const pct = state.totalAnswered > 0 ? Math.round((state.score / state.totalAnswered) * 100) : 0;
  $('#r-score').textContent = state.score;
  $('#r-total').textContent = state.totalAnswered;
  $('#r-pct').textContent = pct + '%';
  $('#r-best-streak').textContent = state.bestStreak;

  let title, emoji, sub;
  if (state.mode === 'time') {
    if (state.score >= 25) { title = t('res_time_master'); emoji = '⚡'; }
    else if (state.score >= 15) { title = t('res_time_great'); emoji = '🚀'; }
    else if (state.score >= 8) { title = t('res_time_nice'); emoji = '👍'; }
    else { title = t('res_time_keep'); emoji = '💪'; }
    sub = t('res_time_sub', state.score);
  } else if (state.mode === 'survival') {
    if (state.score >= 40) { title = t('res_surv_unstop'); emoji = '👑'; }
    else if (state.score >= 20) { title = t('res_surv_survivor'); emoji = '🔥'; }
    else if (state.score >= 10) { title = t('res_surv_solid'); emoji = '✨'; }
    else { title = t('res_surv_try'); emoji = '💪'; }
    sub = t('res_surv_sub', state.score);
  } else {
    if (pct >= 90) { title = t('res_norm_excellent'); emoji = '🎉'; }
    else if (pct >= 70) { title = t('res_norm_well'); emoji = '👏'; }
    else if (pct >= 50) { title = t('res_norm_good'); emoji = '👍'; }
    else { title = t('res_norm_keep'); emoji = '📚'; }
    sub = t('res_norm_sub', state.score, state.totalAnswered);
  }

  applyI18n();
  $('#result-title').textContent = title;
  $('#result-emoji').textContent = emoji;
  $('#result-subtitle').textContent = sub;
}

function showScreen(name) {
  Object.values(screens).forEach((s) => { if (s) s.classList.remove('active'); });
  if (screens[name]) screens[name].classList.add('active');
  window.scrollTo(0, 0);
}

function bindQuiz() {
  $('#btn-quit').addEventListener('click', () => {
    if (confirm(t('quit_confirm'))) {
      clearInterval(state.timerId);
      showScreen('home');
    }
  });
}

function bindResult() {
  $('#btn-retry').addEventListener('click', () => startQuiz());
  $('#btn-home').addEventListener('click', () => showScreen('home'));
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}