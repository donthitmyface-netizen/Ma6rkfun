/* app.js — 常中天機 · 初始化與事件綁定 */

// ── Global error handler ──
window.onerror = function(msg, src, line, col, err) {
  const c = document.getElementById('content');
  if (c) c.innerHTML =
    '<div style="padding:20px;background:#1a0010;border:1px solid #ff2e63;' +
    'border-radius:12px;color:#ff6090;font-size:12px;line-height:2">' +
    '<strong style="color:#ff2e63">系統異常</strong><br/>' +
    msg + '<br/>行號: ' + line + '<br/>' +
    (err ? '<pre style="font-size:10px;color:var(--dim);white-space:pre-wrap">' +
     err.stack + '</pre>' : '') + '</div>';
  return false;
};

// ── Startup ──
try {
  updateHeader();
  initLucky();
  render();
} catch (e) {
  const c = document.getElementById('content');
  if (c) c.innerHTML =
    '<div style="padding:20px;background:#1a0010;border:1px solid #ff2e63;' +
    'border-radius:12px;color:#ff6090;font-size:12px;line-height:2">' +
    '<strong style="color:#ff2e63">初始化異常</strong><br/>' +
    e.message + '<br/>' +
    '<pre style="font-size:10px;color:var(--dim);white-space:pre-wrap">' +
    e.stack + '</pre></div>';
}
