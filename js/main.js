
// Soyorin.Work - Refactored Main JS
(function() {
  const saved = localStorage.getItem('soyorin-mode');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = saved ? saved === '2' : prefersDark;
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
})();

function pagereload(colormode) {
  localStorage.setItem('soyorin-mode', colormode);
  document.documentElement.setAttribute('data-theme', colormode === 2 ? 'dark' : 'light');
}

function getParams(key) {
  const reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
  const r = window.location.search.substr(1).match(reg);
  if (r != null) return decodeURIComponent(r[2]);
  return null;
}

function hasadmission() {
  return localStorage.getItem('soyorin-admission') !== null;
}

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

document.querySelectorAll('.year').forEach(el => el.textContent = new Date().getFullYear());

document.body.oncopy = function() {
  if (typeof layer !== 'undefined') {
    layer.msg("复制成功,若要转载请务必保留原文链接<br>并遵循 (CC)-BY-NC-SA 协议");
  }
};
