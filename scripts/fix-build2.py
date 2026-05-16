with open('scripts/build.js', 'rb') as f:
    data = f.read()
text = data.decode('utf-8-sig')

start = text.find('const mainJs = ')
end = text.find('`;\nwriteFileSync(join(root, \'js/main.js\'), mainJs);')

if start != -1 and end != -1:
    old_section = text[start:end+2]
    new_section = """const mainJs = `
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

window.addEventListener('load', function() {
  const cover = document.getElementById("loader-cover");
  if (cover) {
    cover.style.opacity = 0;
    cover.style.transition = 'opacity 0.5s';
    setTimeout(function() { cover.style.zIndex = -9999; }, 1500);
  }
  document.querySelectorAll('.year').forEach(el => el.textContent = new Date().getFullYear());
});

document.body.oncopy = function() {
  if (typeof layer !== 'undefined') {
    layer.msg("复制成功,若要转载请务必保留原文链接<br>并遵循 (CC)-BY-NC-SA 协议");
  }
};
`;"""
    text = text[:start] + new_section + text[end+2:]
    with open('scripts/build.js', 'wb') as f:
        f.write(text.encode('utf-8-sig'))
    print('fixed')
else:
    print('not found')
