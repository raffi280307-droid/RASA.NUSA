function suggestReflection(text) {
  const t = (text || '').toLowerCase();
  const picks = [];
  if (/(cemas|gelisah|khawatir|takut)/.test(t)) picks.push('Tarik napas perlahan 4 detik, hembuskan 6–8 detik. Sadari ketegangan di tubuh lalu kendurkan.');
  if (/(sedih|kecewa|hampa|lelah)/.test(t)) picks.push('Tuliskan 3 hal kecil yang berjalan baik hari ini. Biarkan rasa hadir, lalu beri ruang untuk pulih.');
  if (/(marah|kesal)/.test(t)) picks.push('Jeda 2 menit. Identifikasi pemicu, tulis pikiran otomatis, lalu tantang dengan fakta alternatif.');
  if (/(bersyukur|syukur|lega|tenang|harap|berharap)/.test(t)) picks.push('Pertahankan ritme tenang: pilih langkah sederhana yang bermakna dan realistis.');
  if (picks.length === 0) picks.push('Eling lan waspada (Sadar dan waspada): sebutkan nama emosi saat ini, beri skala 1–10, lalu pilih satu tindakan kecil yang menenangkan.');
  picks.push('Nrimo ing pandum (Menerima ketentuan): apa yang bisa diterima hari ini? Apa yang dapat diupayakan besok?');
  picks.push('Sabar & tawakkal (Tabah dan berserah): tetapkan batas waktu istirahat singkat dan serahkan hasil di luar kendali kepada Tuhan.');
  return picks;
}

function renderSuggestions(list) {
  const box = document.getElementById('refleksi-saran');
  if (!box) return;
  box.innerHTML = '<h3>Saran Refleksi</h3>' + '<ul>' + list.map(x => '<li>' + x + '</li>').join('') + '</ul>';
}

function onSuggestClick() {
  const ta = document.querySelector('#jurnal textarea');
  const text = ta ? ta.value : '';
  const suggestions = suggestReflection(text);
  const insight = generateInsight(text);
  try { localStorage.setItem('rasa.lastReflection', JSON.stringify({ text, suggestions, ts: Date.now() })); } catch {}
  renderSuggestions(suggestions);
  renderInsight(insight);
}

function bindJournal() {
  const btn = document.getElementById('btn-saran');
  if (btn) btn.addEventListener('click', onSuggestClick);
  const save = document.getElementById('btn-save');
  if (save) save.addEventListener('click', () => {
    const ta = document.querySelector('#jurnal textarea');
    const text = ta ? ta.value : '';
    const entry = { text, ts: Date.now() };
    let arr = [];
    try { arr = JSON.parse(localStorage.getItem('rasa.journalEntries')||'[]'); } catch {}
    arr.push(entry);
    try { localStorage.setItem('rasa.journalEntries', JSON.stringify(arr)); } catch {}
    alert('Catatan disimpan secara lokal.');
  });
  const dl = document.getElementById('btn-download');
  if (dl) dl.addEventListener('click', () => {
    const ta = document.querySelector('#jurnal textarea');
    const text = ta ? ta.value : '';
    const blob = new Blob([text||''], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'jurnal-batin.txt';
    document.body.appendChild(a);
    a.click();
    a.remove();
  });
}

function bindStories() {
  document.querySelectorAll('button[data-story]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = 'story-' + btn.dataset.story;
      const el = document.getElementById(id);
      if (el) el.hidden = !el.hidden;
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  bindJournal();
  bindStories();
  bindMood();
});
function setMoodActive(btn) {
  document.querySelectorAll('.emotion').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function updateMoodWheel(mood) {
  const start = document.getElementById('mw-start');
  const end = document.getElementById('mw-end');
  const map = {
    tenang: { s: '#f7f1e5', e: '#8fa68a' },
    cemas:  { s: '#f7f1e5', e: '#a8745b' },
    sedih:  { s: '#f7f1e5', e: '#3b2c24' },
    harap:  { s: '#f7f1e5', e: '#d7c39c' },
    syukur: { s: '#d7c39c', e: '#8fa68a' }
  };
  const g = map[mood] || map.tenang;
  if (start) start.setAttribute('stop-color', g.s);
  if (end) end.setAttribute('stop-color', g.e);
}

function moodInsight(mood) {
  const tips = {
    tenang: 'Pertahankan ritme napas pelan. Pilih satu tindakan sederhana yang bermakna.',
    cemas: 'Labeli rasa cemas. Fokus pada napas panjang dan fakta-fakta alternatif.',
    sedih: 'Berikan ruang pada sedih. Tuliskan tiga hal kecil yang tetap baik.',
    harap: 'Rawat harapan dengan langkah kecil konsisten dan realistis.',
    syukur: 'Catat hal yang disyukuri. Jadikan pijakan untuk langkah berikut.'
  };
  return tips[mood] || tips.tenang;
}

function renderMoodInsight(mood) {
  const box = document.getElementById('mood-insight');
  if (!box) return;
  box.innerHTML = '<h3>Panduan Singkat</h3><p>' + moodInsight(mood) + '</p>';
}

function bindMood() {
  document.querySelectorAll('.emotion').forEach(btn => {
    btn.addEventListener('click', () => {
      const mood = btn.dataset.mood;
      setMoodActive(btn);
      updateMoodWheel(mood);
      renderMoodInsight(mood);
    });
  });
}

function generateInsight(text) {
  const t = (text||'').toLowerCase();
  const tags = ['cemas','sedih','marah','tenang','syukur','harap'];
  const found = tags.filter(k => t.includes(k));
  const main = found[0] || 'rasa';
  if (main === 'cemas') return 'Insight: ada kecemasan. Uji pikiran otomatis dengan bukti nyata dan napas panjang.';
  if (main === 'sedih') return 'Insight: ada kesedihan. Validasi diri dan cari hal kecil yang menguatkan.';
  if (main === 'marah') return 'Insight: ada kemarahan. Jeda sebentar dan pilih tanggapan yang aman dan tepat.';
  if (main === 'tenang') return 'Insight: ada ketenangan. Tetapkan kebiasaan kecil untuk mempertahankannya.';
  if (main === 'syukur') return 'Insight: ada syukur. Catat tiga hal yang kamu hargai hari ini.';
  if (main === 'harap') return 'Insight: ada harapan. Rencanakan satu langkah konkret besok.';
  return 'Insight: identifikasi emosi, beri skala intensitas, dan pilih satu aksi kecil yang menenangkan.';
}

function renderInsight(text) {
  const box = document.getElementById('refleksi-insight');
  if (!box) return;
  box.innerHTML = '<h3>Insight Kecil</h3><p>' + text + '</p>';
}
