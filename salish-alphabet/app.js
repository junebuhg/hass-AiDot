/* Séliš-Ql̓ispé Sounds
 *
 * Everything the app shows comes from data/alphabet.json. To add or correct a
 * letter, edit that file — no changes are needed here.
 *
 * Video files are found by convention:
 *   videos/<letter id>-female.mp4   videos/<letter id>-male.mp4
 * Each listed extension is tried in order; if none loads, the clip shows a
 * "not recorded yet" placeholder with the filename the app was looking for.
 */

const SPEAKERS = ['female', 'male'];
const SPEEDS = [
  { rate: 1,    label: 'Normal' },
  { rate: 0.5,  label: 'Slow' },
  { rate: 0.25, label: 'Slowest' }
];

const state = {
  data: null,
  byId: new Map(),
  category: 'all',
  query: '',
  visible: [],   // ids currently shown in the grid, in display order
  rate: 1,
  loop: true
};

const el = (id) => document.getElementById(id);

/* ------------------------------------------------------------------ load */

async function init() {
  try {
    const res = await fetch('data/alphabet.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    state.data = await res.json();
  } catch (err) {
    showLoadError(err);
    return;
  }

  state.data.letters.forEach((l) => state.byId.set(l.id, l));

  renderReviewBanner();
  renderFilters();
  renderGrid();
  wireControls();

  window.addEventListener('hashchange', route);
  route();
}

function showLoadError(err) {
  el('main').innerHTML = `
    <div class="howto">
      <h2>Could not load the alphabet</h2>
      <p>${escapeHtml(String(err))}</p>
      <p>If you opened <code>index.html</code> straight from the file system, the
      browser blocks reading <code>data/alphabet.json</code>. Start a small local
      server from this folder instead:</p>
      <p><code>python3 -m http.server 8000</code> &mdash; then open
      <code>http://localhost:8000/</code></p>
    </div>`;
}

function renderReviewBanner() {
  if (state.data.reviewStatus) el('review-banner').textContent = state.data.reviewStatus;
}

/* ------------------------------------------------------------------ grid */

function renderFilters() {
  const cats = [{ id: 'all', name: 'All letters' }, ...state.data.categories];
  el('filters').innerHTML = cats
    .map((c) => `<button type="button" class="chip" data-cat="${c.id}"
                   aria-pressed="${c.id === state.category}">${escapeHtml(c.name)}</button>`)
    .join('');

  el('filters').addEventListener('click', (e) => {
    const btn = e.target.closest('.chip');
    if (!btn) return;
    state.category = btn.dataset.cat;
    [...el('filters').children].forEach((c) =>
      c.setAttribute('aria-pressed', String(c.dataset.cat === state.category)));
    renderGrid();
  });
}

function matches(letter) {
  if (state.category !== 'all' && letter.category !== state.category) return false;
  const q = state.query.trim().toLowerCase();
  if (!q) return true;
  return [letter.letter, letter.ipa, letter.id, letter.howTo, letter.example?.english]
    .filter(Boolean)
    .some((field) => field.toLowerCase().includes(q));
}

function renderGrid() {
  const container = el('grid-groups');
  container.innerHTML = '';
  state.visible = [];

  for (const cat of state.data.categories) {
    const letters = state.data.letters.filter((l) => l.category === cat.id && matches(l));
    if (!letters.length) continue;

    state.visible.push(...letters.map((l) => l.id));

    const group = document.createElement('section');
    group.className = 'group';
    group.innerHTML = `
      <h2>${escapeHtml(cat.name)}</h2>
      <p class="group-desc">${escapeHtml(cat.description || '')}</p>
      <div class="grid">
        ${letters.map(tileHtml).join('')}
      </div>`;
    container.appendChild(group);
  }

  el('empty').hidden = state.visible.length > 0;

  container.onclick = (e) => {
    const tile = e.target.closest('.tile');
    if (tile) location.hash = `#/letter/${encodeURIComponent(tile.dataset.id)}`;
  };
}

function tileHtml(letter) {
  const glottalized = letter.glottalized ? ' is-glottalized' : '';
  const aria = letter.glottalized ? `${letter.id}, glottalized` : letter.id;
  return `
    <button type="button" class="tile${glottalized}" data-id="${escapeHtml(letter.id)}"
            aria-label="${escapeHtml(aria)}">
      <span class="glyph">${escapeHtml(letter.letter)}</span>
      <span class="glyph-ipa">[${escapeHtml(letter.ipa)}]</span>
    </button>`;
}

/* ---------------------------------------------------------------- detail */

function route() {
  const m = location.hash.match(/^#\/letter\/(.+)$/);
  const id = m ? decodeURIComponent(m[1]) : null;
  const letter = id ? state.byId.get(id) : null;

  if (letter) {
    showDetail(letter);
  } else {
    el('view-detail').hidden = true;
    el('view-grid').hidden = false;
    stopAllVideos();
  }
}

function showDetail(letter) {
  el('view-grid').hidden = true;
  el('view-detail').hidden = false;

  el('detail-letter').textContent = letter.letter;
  el('detail-ipa').textContent = `IPA [${letter.ipa}]`;

  const cat = state.data.categories.find((c) => c.id === letter.category);
  el('detail-category').textContent =
    (cat ? cat.name : letter.category) + (letter.glottalized ? ' · glottalized' : '');

  const ex = el('detail-example');
  if (letter.example && letter.example.salish) {
    ex.hidden = false;
    ex.textContent = letter.example.english
      ? `${letter.example.salish} — ${letter.example.english}`
      : letter.example.salish;
  } else {
    ex.hidden = true;
  }

  el('detail-howto').textContent = letter.howTo || '';
  el('detail-watchfor').textContent = letter.watchFor || '';

  renderVideos(letter);
  updateArrowState(letter.id);
  window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
}

function renderVideos(letter) {
  const dir = state.data.videoDir || 'videos';
  const exts = state.data.videoExtensions || ['mp4'];
  const box = el('videos');
  box.innerHTML = '';

  for (const speaker of SPEAKERS) {
    const info = state.data.speakers[speaker] || {};
    const paths = exts.map((ext) => `${dir}/${letter.id}-${speaker}.${ext}`);

    const card = document.createElement('div');
    card.className = 'clip';

    const heading = document.createElement('h3');
    heading.innerHTML = escapeHtml(info.label || speaker) +
      (info.name ? ` <span class="speaker-name">· ${escapeHtml(info.name)}</span>` : '');
    card.appendChild(heading);

    const video = document.createElement('video');
    video.controls = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.loop = state.loop;
    video.setAttribute('aria-label',
      `${info.label || speaker} pronouncing ${letter.letter}`);
    video.addEventListener('loadedmetadata', () => { video.playbackRate = state.rate; });

    let failures = 0;
    for (const path of paths) {
      const source = document.createElement('source');
      source.src = path;
      source.addEventListener('error', () => {
        if (++failures === paths.length) showMissing(card, video, paths);
      });
      video.appendChild(source);
    }

    card.appendChild(video);
    box.appendChild(card);
  }
}

function showMissing(card, video, paths) {
  video.remove();
  const note = document.createElement('div');
  note.className = 'missing';
  note.innerHTML = `
    <strong>Not recorded yet</strong>
    <span>Add the clip as:</span>
    <code>${escapeHtml(paths[0])}</code>`;
  card.appendChild(note);
}

function updateArrowState(id) {
  // Arrows walk the same order the grid is showing, so a filtered view steps
  // through that group only.
  const list = state.visible.length ? state.visible : state.data.letters.map((l) => l.id);
  const i = list.indexOf(id);
  el('prev-letter').disabled = i <= 0;
  el('next-letter').disabled = i === -1 || i >= list.length - 1;
  el('prev-letter').dataset.target = i > 0 ? list[i - 1] : '';
  el('next-letter').dataset.target = i > -1 && i < list.length - 1 ? list[i + 1] : '';
}

/* -------------------------------------------------------------- controls */

function wireControls() {
  el('search').addEventListener('input', (e) => {
    state.query = e.target.value;
    renderGrid();
  });

  el('back').addEventListener('click', () => { location.hash = ''; });

  for (const btn of [el('prev-letter'), el('next-letter')]) {
    btn.addEventListener('click', () => {
      if (btn.dataset.target) location.hash = `#/letter/${encodeURIComponent(btn.dataset.target)}`;
    });
  }

  el('speeds').innerHTML = SPEEDS
    .map((s) => `<button type="button" class="speed" data-rate="${s.rate}"
                   aria-pressed="${s.rate === state.rate}">${s.label}</button>`)
    .join('');

  el('speeds').addEventListener('click', (e) => {
    const btn = e.target.closest('.speed');
    if (!btn) return;
    state.rate = Number(btn.dataset.rate);
    [...el('speeds').children].forEach((c) =>
      c.setAttribute('aria-pressed', String(Number(c.dataset.rate) === state.rate)));
    eachVideo((v) => { v.playbackRate = state.rate; });
  });

  el('loop-toggle').addEventListener('change', (e) => {
    state.loop = e.target.checked;
    eachVideo((v) => { v.loop = state.loop; });
  });

  el('replay').addEventListener('click', () => {
    eachVideo((v) => {
      v.currentTime = 0;
      v.playbackRate = state.rate;
      v.play().catch(() => { /* autoplay refused; the user can press play */ });
    });
  });

  document.addEventListener('keydown', (e) => {
    if (el('view-detail').hidden) return;
    if (e.target.matches('input, textarea')) return;
    if (e.key === 'Escape') { location.hash = ''; }
    if (e.key === 'ArrowLeft') el('prev-letter').click();
    if (e.key === 'ArrowRight') el('next-letter').click();
  });
}

function eachVideo(fn) { document.querySelectorAll('#videos video').forEach(fn); }
function stopAllVideos() { eachVideo((v) => v.pause()); }

/* ----------------------------------------------------------------- utils */

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

init();
