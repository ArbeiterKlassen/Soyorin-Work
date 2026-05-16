with open('scripts/build.js', 'rb') as f:
    data = f.read()
text = data.decode('utf-8-sig')

old_loader = """window.addEventListener('load', function() {
  sleep(3500).then(() => {
    const cover = document.getElementById("loader-cover");
    if (cover) cover.style.opacity = 0;
  });
  sleep(5000).then(() => {
    const cover = document.getElementById("loader-cover");
    if (cover) cover.style.zIndex = -9999;
  });
  document.querySelectorAll('.year').forEach(el => el.textContent = new Date().getFullYear());
});"""

new_loader = """window.addEventListener('load', function() {
  const cover = document.getElementById("loader-cover");
  if (cover) {
    cover.style.opacity = 0;
    cover.style.transition = 'opacity 0.5s';
    setTimeout(function() { cover.style.zIndex = -9999; }, 1500);
  }
  document.querySelectorAll('.year').forEach(el => el.textContent = new Date().getFullYear());
});"""

text = text.replace(old_loader, new_loader)

with open('scripts/build.js', 'wb') as f:
    f.write(text.encode('utf-8-sig'))
print('done')
