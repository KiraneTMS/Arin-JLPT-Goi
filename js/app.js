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
  // JFT simulation
  jftSection: 0, // 0 vocab, 1 expression, 2 reading
  jftSectionScores: [0, 0, 0],
  jftSectionTotals: [12, 12, 12],
  jftQueue: [],
  jftGlobalTimer: null,
  jftTimeLeft: 45 * 60,
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
    mode_names: { time: 'Time Attack', normal: 'Normal', survival: 'Survival', jft: 'JFT Simulation', jlpt: 'JLPT Simulation' },
    mode_jft: 'JFT Simulation',
    mode_jft_desc: 'Mock JFT-Basic style: Vocab · Expression · Reading (~36Q, 45 min)',
    mode_jlpt: 'JLPT Simulation',
    mode_jlpt_desc: 'Mock JLPT per level: Vocab · Grammar · Reading (no listening audio)',
    jlpt_sec_vocab: 'Language Knowledge — Vocabulary',
    jlpt_sec_grammar: 'Language Knowledge — Grammar',
    jlpt_sec_read: 'Reading',
    jlpt_pass: 'PASS',
    jlpt_fail: 'FAIL',
    jlpt_next_sec: 'Finish Section →',
    jft_sec_vocab: 'Script & Vocabulary',
    jft_sec_expr: 'Conversation & Expression',
    jft_sec_read: 'Reading',
    jft_next_sec: 'Finish Section →',
    jft_prompt_vocab: 'What does this word mean?',
    jft_prompt_expr: 'What does the underlined word mean in this sentence?',
    jft_prompt_read: 'What is the meaning of this sentence?',
    jft_score_label: 'JFT Score',
    jft_level_label: 'Assessment',
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
    mode_names: { time: 'Time Attack', normal: 'Normal', survival: 'Survival', jft: 'Simulasi JFT', jlpt: 'Simulasi JLPT' },
    mode_jft: 'Simulasi JFT',
    mode_jft_desc: 'Latihan gaya JFT-Basic: Kosakata · Ekspresi · Membaca (~36 soal, 45 mnt)',
    mode_jlpt: 'Simulasi JLPT',
    mode_jlpt_desc: 'Simulasi JLPT per level: Kosakata · Tata bahasa · Membaca (tanpa audio listening)',
    jlpt_sec_vocab: 'Pengetahuan Bahasa — Kosakata',
    jlpt_sec_grammar: 'Pengetahuan Bahasa — Tata Bahasa',
    jlpt_sec_read: 'Membaca',
    jlpt_pass: 'LULUS',
    jlpt_fail: 'TIDAK LULUS',
    jlpt_next_sec: 'Selesai Bagian →',
    jft_sec_vocab: 'Huruf & Kosakata',
    jft_sec_expr: 'Percakapan & Ungkapan',
    jft_sec_read: 'Pemahaman Bacaan',
    jft_next_sec: 'Selesai Bagian →',
    jft_prompt_vocab: 'Apa arti kata ini?',
    jft_prompt_expr: 'Apa arti kata yang digarisbawahi dalam kalimat ini?',
    jft_prompt_read: 'Apa arti kalimat ini?',
    jft_score_label: 'Skor JFT',
    jft_level_label: 'Penilaian',
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
  const jftMode = state.mode === 'jft';
  document.querySelectorAll('.level-btn').forEach((btn) => {
    const level = btn.dataset.level;
    // ID: lock N3+. JFT mode: only N5/N4 (JFT-Basic is A1–A2)
    const locked = (idMode && advanced.includes(level)) || (jftMode && advanced.includes(level));
    btn.disabled = locked;
    btn.classList.toggle('locked', locked);
    btn.title = locked
      ? (jftMode
          ? (state.lang === 'id' ? 'JFT-Basic hanya setara N5–N4' : 'JFT-Basic only covers N5–N4 level')
          : (state.lang === 'id'
              ? 'Level ini hanya tersedia dalam bahasa Inggris (arti ID belum lengkap)'
              : 'This level is only available in English'))
      : '';
    if (locked && btn.classList.contains('active')) {
      btn.classList.remove('active');
      if (state.level === level) state.level = null;
    }
  });
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
    if (jftMode) {
      hint.textContent = state.lang === 'id'
        ? 'Simulasi JFT: pilih N5 (latihan A1) atau N4 (latihan A2). N3+ tidak relevan untuk JFT-Basic.'
        : 'JFT sim: choose N5 (A1 practice) or N4 (A2 practice). N3+ is outside JFT-Basic scope.';
      hint.classList.remove('hidden');
    } else if (idMode) {
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
      updateLevelAvailability();
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
  if (state.mode === 'jft' && ['n3', 'n2', 'n1'].includes(state.level)) {
    alert(state.lang === 'id'
      ? 'Simulasi JFT hanya untuk level N5 atau N4.'
      : 'JFT simulation is only for N5 or N4.');
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
  state.jftSection = 0;
  state.jftSectionScores = [0, 0, 0];
  state.jftSectionTotals = [12, 12, 12];
  state.jftTimeLeft = 45 * 60;
  clearInterval(state.jftGlobalTimer);

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
  } else if (state.mode === 'jft' || state.mode === 'jlpt') {
    timerWrap.classList.remove('hidden');
    livesWrap.classList.add('hidden');
    qWrap.classList.remove('hidden');
    streakWrap.classList.add('hidden');
  } else {
    timerWrap.classList.add('hidden');
    livesWrap.classList.add('hidden');
    qWrap.classList.remove('hidden');
    streakWrap.classList.remove('hidden');
  }

  showScreen('quiz');

  if (state.mode === 'jft' || state.mode === 'jlpt') {
    initExamMode();
    buildExamSection(0);
    startExamTimer();
    nextQuestion();
  } else {
    nextQuestion();
    if (state.mode === 'time') startTimer();
  }
  updateStartBtnText();
}

function initExamMode() {
  if (state.mode === 'jlpt') {
    state.jftSectionTotals = [15, 15, 15];
    const mins = { n5: 50, n4: 55, n3: 60, n2: 70, n1: 80 };
    state.jftTimeLeft = (mins[state.level] || 60) * 60;
    state._examMaxTime = state.jftTimeLeft;
  } else {
    state.jftSectionTotals = [12, 12, 12];
    state.jftTimeLeft = 45 * 60;
    state._examMaxTime = 45 * 60;
  }
  state.jftSection = 0;
  state.jftSectionScores = [0, 0, 0];
  state._jftSecAnswered = 0;
}

function startExamTimer() {
  clearInterval(state.jftGlobalTimer);
  updateExamTimerUI();
  state.jftGlobalTimer = setInterval(() => {
    state.jftTimeLeft--;
    updateExamTimerUI();
    if (state.jftTimeLeft <= 0) {
      clearInterval(state.jftGlobalTimer);
      endQuiz();
    }
  }, 1000);
}

function startJftTimer() { startExamTimer(); }

function updateExamTimerUI() {
  const wrap = $('#timer-wrap');
  if (!wrap) return;
  wrap.classList.remove('hidden');
  const m = Math.floor(Math.max(0, state.jftTimeLeft) / 60);
  const s = Math.max(0, state.jftTimeLeft) % 60;
  const el = $('#timer-text');
  if (el) el.textContent = m + ':' + String(s).padStart(2, '0');
  const progress = $('#timer-progress');
  if (progress) {
    const maxT = state._examMaxTime || (45 * 60);
    const pct = (state.jftTimeLeft / maxT) * 100;
    progress.setAttribute('stroke-dasharray', pct + ', 100');
    progress.classList.remove('warning', 'danger');
    if (state.jftTimeLeft <= 300) progress.classList.add('danger');
    else if (state.jftTimeLeft <= 600) progress.classList.add('warning');
  }
}

function updateJftTimerUI() { updateExamTimerUI(); }

function buildJftSection(sec) { buildExamSection(sec); }

function buildExamSection(sec) {
  state.jftSection = sec;
  state.answered = false;
  const pool = shuffle([...state.words]);
  const withEx = pool.filter((w) => w.examples && w.examples.length);
  const items = [];
  const need = state.jftSectionTotals[sec] || 12;

  if (sec === 0) {
    for (const w of pool) {
      if (items.length >= need) break;
      items.push({ type: 'vocab', word: w });
    }
  } else if (sec === 1) {
    for (const w of withEx) {
      if (items.length >= need) break;
      const ex = w.examples[0];
      items.push({ type: 'expr', word: w, sentence: ex.ja, sentenceEn: ex.en });
    }
    for (const w of pool) {
      if (items.length >= need) break;
      if (!items.find((x) => x.word === w)) items.push({ type: 'vocab', word: w });
    }
  } else {
    for (const w of withEx) {
      if (items.length >= need) break;
      const ex = w.examples[0];
      items.push({ type: 'read', word: w, sentence: ex.ja, sentenceEn: ex.en });
    }
    for (const w of pool) {
      if (items.length >= need) break;
      if (!items.find((x) => x.word === w)) items.push({ type: 'vocab', word: w });
    }
  }

  state.jftQueue = shuffle(items);
  state.queue = [];
  state._jftSecAnswered = 0;
  updateExamSectionUI();
}

function updateJftSectionUI() { updateExamSectionUI(); }

function updateExamSectionUI() {
  const isJlpt = state.mode === 'jlpt';
  const names = isJlpt
    ? [t('jlpt_sec_vocab'), t('jlpt_sec_grammar'), t('jlpt_sec_read')]
    : [t('jft_sec_vocab'), t('jft_sec_expr'), t('jft_sec_read')];
  const prefix = isJlpt ? ('JLPT ' + (state.level || '').toUpperCase()) : 'JFT';
  $('#quiz-mode').textContent = prefix + ' · ' + names[state.jftSection];
  const qWrap = $('#stat-q-wrap');
  qWrap.classList.remove('hidden');
  const done = state._jftSecAnswered || 0;
  const total = state.jftSectionTotals[state.jftSection];
  $('#stat-q').textContent = (done + 1) + ' / ' + total;
  const totalQ = state.jftSectionTotals.reduce((a, b) => a + b, 0);
  const overallDone = state.jftSectionTotals.slice(0, state.jftSection).reduce((a, b) => a + b, 0) + done;
  $('#progress-fill').style.width = Math.min(100, (overallDone / totalQ) * 100) + '%';
}


function nextQuestion() {
  state.answered = false;
  $('#feedback').classList.add('hidden');
  $('#choices').innerHTML = '';

  if (state.mode === 'jft' || state.mode === 'jlpt') {
    if (!state.jftQueue || state.jftQueue.length === 0) {
      // section complete
      if (state.jftSection < 2) {
        showJftSectionBreak();
        return;
      }
      endQuiz();
      return;
    }
    state.current = state.jftQueue.pop();
    renderJftQuestion(state.current);
    updateStats();
    updateJftSectionUI();
    return;
  }

  if (state.queue.length === 0) state.queue = shuffle([...state.words]);

  if (state.mode === 'normal' && state.totalAnswered >= state.targetQuestions) {
    endQuiz();
    return;
  }

  state.current = state.queue.pop();
  renderQuestion(state.current);
  updateStats();
}

function showJftSectionBreak() {
  const isJlpt = state.mode === 'jlpt';
  const names = isJlpt
    ? [t('jlpt_sec_vocab'), t('jlpt_sec_grammar'), t('jlpt_sec_read')]
    : [t('jft_sec_vocab'), t('jft_sec_expr'), t('jft_sec_read')];
  const sec = state.jftSection;
  const score = state.jftSectionScores[sec];
  const total = state.jftSectionTotals[sec];
  $('#q-word').textContent = names[sec];
  $('#q-reading').textContent = '';
  $('#q-reading').style.display = 'none';
  const prompt = document.querySelector('.question-prompt');
  if (prompt) prompt.textContent = (state.lang === 'id' ? 'Skor bagian: ' : 'Section score: ') + score + ' / ' + total;
  const container = $('#choices');
  container.innerHTML = '';
  const btn = document.createElement('button');
  btn.className = 'choice-btn';
  const nextLabel = isJlpt ? t('jlpt_next_sec') : t('jft_next_sec');
  btn.textContent = state.jftSection < 2 ? nextLabel : (state.lang === 'id' ? 'Lihat Hasil' : 'See Results');
  btn.addEventListener('click', () => {
    if (state.jftSection < 2) {
      buildExamSection(state.jftSection + 1);
      nextQuestion();
    } else {
      endQuiz();
    }
  });
  container.appendChild(btn);
  $('#feedback').classList.add('hidden');
}

function renderJftQuestion(item) {
  const word = item.word;
  const meanings = getMeanings(word);
  const correct = pickMeaning(meanings);
  const distractors = getDistractors(correct, 3);
  const options = shuffle([correct, ...distractors]);

  const prompt = document.querySelector('.question-prompt');
  const readingEl = $('#q-reading');

  let correctAns = correct;
  let opts = options;

  if (item.type === 'vocab') {
    $('#q-word').textContent = word.word;
    if (word.reading && word.reading !== word.word) {
      readingEl.textContent = word.reading;
      readingEl.style.display = '';
    } else {
      readingEl.textContent = '';
      readingEl.style.display = 'none';
    }
    if (prompt) prompt.textContent = t('jft_prompt_vocab');
  } else if (item.type === 'expr') {
    // Sentence with target word highlighted — answer is the WORD meaning
    let sent = item.sentence || word.word;
    const target = word.word;
    if (sent.includes(target)) {
      sent = sent.split(target).join('「' + target + '」');
    }
    $('#q-word').textContent = sent;
    readingEl.textContent = word.word + (word.reading ? '（' + word.reading + '）' : '');
    readingEl.style.display = '';
    if (prompt) prompt.textContent = t('jft_prompt_expr');
    // keep word-meaning options
  } else {
    // Reading: Japanese sentence → choose the SENTENCE translation (not word meaning)
    $('#q-word').textContent = item.sentence || word.word;
    readingEl.textContent = '';
    readingEl.style.display = 'none';
    if (prompt) prompt.textContent = t('jft_prompt_read');

    const sentenceCorrect = (item.sentenceEn || '').trim();
    if (sentenceCorrect) {
      correctAns = sentenceCorrect;
      // Distractors must be other full sentence translations, never random word glosses
      const otherSens = [];
      const seen = new Set([sentenceCorrect.toLowerCase()]);
      for (const w of shuffle([...state.words])) {
        if (!w.examples || !w.examples[0]) continue;
        const en = (w.examples[0].en || '').trim();
        if (!en || seen.has(en.toLowerCase())) continue;
        // skip too-similar / too-short noise
        if (en.length < 4) continue;
        seen.add(en.toLowerCase());
        otherSens.push(en);
        if (otherSens.length >= 8) break;
      }
      opts = shuffle([correctAns, ...shuffle(otherSens).slice(0, 3)]);
    }
  }

  const container = $('#choices');
  container.innerHTML = '';
  opts.forEach((opt) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = opt;
    btn.addEventListener('click', () => handleAnswer(btn, opt === correctAns, correctAns));
    container.appendChild(btn);
  });
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
    if (state.mode === 'jft' || state.mode === 'jlpt') {
      state.jftSectionScores[state.jftSection]++;
    }
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

  if (state.mode === 'jft' || state.mode === 'jlpt') {
    state._jftSecAnswered = (state._jftSecAnswered || 0) + 1;
  }

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
  clearInterval(state.jftGlobalTimer);
  showScreen('result');
  const pct = state.totalAnswered > 0 ? Math.round((state.score / state.totalAnswered) * 100) : 0;
  $('#r-score').textContent = state.score;
  $('#r-total').textContent = state.totalAnswered;
  $('#r-pct').textContent = pct + '%';
  $('#r-best-streak').textContent = state.bestStreak;

  let title, emoji, sub;
  if (state.mode === 'jlpt') {
    const correct = state.score;
    const totalQ = state.jftSectionTotals.reduce((a, b) => a + b, 0);
    const pctOverall = totalQ > 0 ? Math.round((correct / totalQ) * 100) : 0;
    const secOk = state.jftSectionScores.every((s, i) => {
      const tt = state.jftSectionTotals[i] || 1;
      return (s / tt) >= 0.4;
    });
    const passed = pctOverall >= 60 && secOk;
    $('#r-score').textContent = correct;
    $('#r-total').textContent = totalQ;
    $('#r-pct').textContent = pctOverall + '%';
    $('#r-best-streak').textContent = passed ? t('jlpt_pass') : t('jlpt_fail');
    title = passed
      ? ((state.lang === 'id' ? 'LULUS ' : 'PASS ') + state.level.toUpperCase() + '!')
      : ((state.lang === 'id' ? 'Belum lulus ' : 'Not pass ') + state.level.toUpperCase());
    emoji = passed ? '🎓' : '📚';
    const secDetail = state.jftSectionScores.map((s, i) => s + '/' + state.jftSectionTotals[i]).join(' · ');
    sub = state.lang === 'id'
      ? ('Skor ' + correct + '/' + totalQ + ' (' + pctOverall + '%). Bagian: ' + secDetail + '. ' + (passed ? 'Estimasi lulus (simulasi).' : 'Perlu ≥60% total & ≥40% tiap bagian.'))
      : ('Score ' + correct + '/' + totalQ + ' (' + pctOverall + '%). Sections: ' + secDetail + '. ' + (passed ? 'Estimated pass (simulation).' : 'Need ≥60% overall & ≥40% each section.'));
    applyI18n();
    $('#result-title').textContent = title;
    $('#result-emoji').textContent = emoji;
    $('#result-subtitle').textContent = sub;
    document.querySelectorAll('.r-label').forEach((el, idx) => {
      const keys = state.lang === 'id'
        ? ['Benar', 'Total', 'Akurasi', 'Hasil']
        : ['Correct', 'Total', 'Accuracy', 'Result'];
      if (keys[idx]) el.textContent = keys[idx];
    });
    return;
  }
  if (state.mode === 'jft') {
    const correct = state.score;
    const totalQ = state.jftSectionTotals.reduce((a, b) => a + b, 0) || 36;
    const jftScore = Math.round(10 + (correct / totalQ) * 240);
    let band = '*';
    if (jftScore >= 200) band = 'A2.2 (A2)';
    else if (jftScore >= 175) band = 'A2.1';
    else if (jftScore >= 145) band = 'A1';
    $('#r-score').textContent = jftScore;
    $('#r-total').textContent = '250';
    $('#r-pct').textContent = band;
    $('#r-best-streak').textContent = correct + '/' + totalQ;
    if (jftScore >= 200) { title = state.lang === 'id' ? 'Lulus A2.2!' : 'Pass A2.2!'; emoji = '🎉'; }
    else if (jftScore >= 175) { title = state.lang === 'id' ? 'A2.1 — hampir lulus' : 'A2.1 — almost there'; emoji = '👏'; }
    else if (jftScore >= 145) { title = 'A1'; emoji = '👍'; }
    else { title = state.lang === 'id' ? 'Belum lulus' : 'Below A1'; emoji = '💪'; }
    const secDetail = state.jftSectionScores.map((s, i) => s + '/' + (state.jftSectionTotals[i] || 12)).join(' · ');
    sub = (state.lang === 'id'
      ? 'Skor simulasi JFT: ' + jftScore + '/250 (' + band + '). Bagian: ' + secDetail
      : 'Simulated JFT score: ' + jftScore + '/250 (' + band + '). Sections: ' + secDetail);
    applyI18n();
    $('#result-title').textContent = title;
    $('#result-emoji').textContent = emoji;
    $('#result-subtitle').textContent = sub;
    document.querySelectorAll('.r-label').forEach((el, idx) => {
      const keys = state.lang === 'id'
        ? ['Skor JFT', 'Maks', 'Penilaian', 'Benar']
        : ['JFT Score', 'Max', 'Assessment', 'Correct'];
      if (keys[idx]) el.textContent = keys[idx];
    });
    return;
  }
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
      clearInterval(state.jftGlobalTimer);
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