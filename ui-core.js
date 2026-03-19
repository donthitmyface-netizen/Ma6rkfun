/* ui-core.js — 常中天機 · 狀態變數、主渲染、核心 UI 函數 */

// ══ Runtime state (depends on data.js constants) ══
let hist = [...HISTORY];
let currentTab = 'latest';
let theme = localStorage.getItem('ms_theme')||'fun';
var fontScale=parseFloat(localStorage.getItem('ms_font')||'1');
let alarmOn = false, alarmMins = 30, alarmFired = false;
let userProfile = JSON.parse(localStorage.getItem('ms_profile')||'null');
let prizeOn = false, prizeThr = 1e8, prizeShown = false;
let curPrize = 8000000;
let picked = [], checkResult = null;
let sMode = 'hot';
let wTab = 'birthday', wBday = '', wMbti = '', wSources = {golden:false,fib:false,gap:false,hot:false,cold:false};
let wResult = null;
let myBets = [], boardEntries = [];
let betInput = [], betNote = '', betDraw = '', betMode = 'standard', pCount = 6, sureCt = 1;
let pTab = 'math', mMethod = 'combined', mResult = null, aiResult = null;
let heatMode = 'all';
let showAddBet = false, showAddBoard = false;
let boardName = '', boardPicks = [];
let selPost = null;
let pLoading = false, mLoading = false, wAiLoading = false;
let showMathDetail = false;

// Load saved data
try { myBets = JSON.parse(localStorage.getItem('ms_bets')||'[]'); } catch {}
try { boardEntries = JSON.parse(localStorage.getItem('ms_board')||'[]'); } catch {}

// ── Utils ──

// ══ Core UI: switchTab, render, renderLatest ══
function switchTab(t){
 currentTab=t;
 document.querySelectorAll('.tab-btn').forEach(b=>b.classList.toggle('active',b.dataset.tab===t));
 render();
 window.scrollTo(0,0);
}

document.getElementById('tabs').addEventListener('click',function(e){
 const btn=e.target.closest('.tab-btn');
 if(btn)switchTab(btn.dataset.tab);
});

// Auto-refresh on startup
setTimeout(function(){ doRefresh(); }, 1500);
// Show onboarding if no profile
if(!localStorage.getItem('ms_profile')){
 setTimeout(function(){
 var m=document.getElementById('onboarding-modal');
 if(m)m.style.display='flex';
 },500);
}else{
 userProfile=JSON.parse(localStorage.getItem('ms_profile'));
 if(userProfile&&userProfile.date)wBday=userProfile.date;
}

// ── MAIN RENDER ──
function render(){
 const c=document.getElementById('content');
 c.className='';
 switch(currentTab){
 case 'latest': c.innerHTML=renderLatest();break;
 case 'workshop': c.innerHTML=renderWorkshop();break;
 case 'heatmap': c.innerHTML=renderHeatmap();break;
 case 'fortune': c.innerHTML=renderFortune();break;
 case 'alarm': c.innerHTML=renderAlarm();break;
 case 'history': c.innerHTML=renderHistory();break;
 case 'stats': c.innerHTML=renderStats();break;
 case 'checker': c.innerHTML=renderChecker();break;
 case 'mybets': c.innerHTML=renderMyBets();break;
 case 'board': c.innerHTML=renderBoard();break;
 case 'predict': c.innerHTML=renderPredict();break;
 case 'discuss': c.innerHTML=renderDiscuss();initDisqus();break;
 }
 startCountdown();
 renderRefreshLog();
}


// ═══ LATEST ═══
function renderLatest(){
 var l=hist[0],nd=calcNextDraw();
 var out='';
 out+='<div class="card accent-top" style="text-align:center;background:linear-gradient(160deg,#080818,#0e0828,#080818);border-color:rgba(255,46,99,.4);">';
  out+='<div style="font-size:9px;color:var(--dim);letter-spacing:3px;margin-bottom:6px">第 '+l.draw+' 期　'+l.date+'</div>';
  out+='<div style="font-size:11px;font-weight:900;color:var(--accent);letter-spacing:4px;margin-bottom:14px;text-shadow:0 0 14px rgba(255,46,99,.8)">本期開獎六正一特</div>';
  out+='<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:center;padding:14px 10px;background:rgba(0,0,0,.45);border-radius:12px;border:1px solid rgba(255,46,99,.15);margin-bottom:8px">';
  out+=ballsRow(l.numbers,l.extra,52);
  out+='</div>';
  out+='<div style="font-size:9px;color:var(--dim);letter-spacing:2px">六　正　碼　　＋　　特　別　號</div>';
  out+='</div>';
 out+='</div>';

 out+='<div class="card" style="background:linear-gradient(135deg,#0a0818,#0d0a22)">';
 out+='<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px">';
 out+='<div><div style="font-size:12px;color:var(--gold);font-weight:800">⏳ 下期 '+nd.drawNum+'</div>';
 out+='<div style="font-size:11px;color:var(--sub)">'+nd.date+' · 晚上 9:30</div></div>';
 out+='<div style="text-align:right"><div style="font-size:20px;font-weight:900;color:var(--gold);text-shadow:0 0 10px rgba(201,168,76,.5)">$8百萬起</div>';
 out+='<div style="font-size:9px;color:var(--dim)">預估頭獎</div></div></div>';
 out+='<div style="background:rgba(255,46,99,.05);border:1px solid rgba(255,46,99,.2);border-radius:10px;padding:10px 14px;display:flex;align-items:center;justify-content:space-between">';
 out+='<span style="font-size:11px;color:var(--accent);font-weight:700">⏰ 攪珠倒數</span>';
 out+='<div id="countdown" style="font-variant-numeric:tabular-nums;font-size:26px;font-weight:900;color:var(--accent);letter-spacing:2px">--:--:--</div></div></div>';

 // Auto-refresh status indicator
 if(refreshLog.length>0){
 var logColor=refreshLog[0].startsWith('')?'#22cc66':refreshLog[0].startsWith('')?'#ff4444':'var(--sub)';
 out+='<div style="font-size:10px;color:'+logColor+';text-align:center;margin-bottom:6px">'+refreshLog[0]+'</div>';
 }
 out+='<div style="font-size:10px;color:var(--dim);text-align:center;margin-bottom:10px;line-height:1.8">數據來源：lottery.hk · 本 App 與香港賽馬會無關聯<br/><span style="color:var(--accent);font-weight:700">純屬娛樂，請勿 all in </span></div>';

 // 打賞區
 out+='<div style="background:linear-gradient(135deg,#0c0820,#100c28);border:1px solid var(--border2);border-radius:14px;padding:14px;margin-bottom:10px;text-align:center">';
 out+='<div style="font-size:13px;font-weight:900;color:var(--gold2);margin-bottom:4px">☕ 支持開發者</div>';
 out+='<div style="font-size:10px;color:var(--sub);margin-bottom:10px">本應用程式完全免費，如認為有用，歡迎支持開發者持續維護。</div>';
 out+='<div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">';
 out+='<a href="https://payme.hsbc/kennylai18" target="_blank" style="display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,#8a0020,#ff2e63);color:#fff;border-radius:8px;box-shadow:0 0 12px rgba(255,46,99,.4);padding:10px 18px;font-size:13px;font-weight:700;text-decoration:none">一按即 PayMe！</a>';
 var _kofi=localStorage.getItem('ms_kofi')||'';
 if(_kofi) out+='<a href="'+_kofi+'" target="_blank" style="display:inline-flex;align-items:center;gap:6px;background:#FF5E5B;color:#fff;border-radius:20px;padding:10px 18px;font-size:13px;font-weight:700;text-decoration:none">☕ Ko-fi</a>';
 var _fps=localStorage.getItem('ms_fps')||'';
 if(_fps) out+='<button onclick="showPayMe()" style="display:inline-flex;align-items:center;gap:6px;background:#fff;color:var(--accent);border:1px solid var(--accent);border-radius:8px;padding:10px 16px;font-size:13px;font-weight:700;cursor:pointer">FPS</button>';
 out+='</div></div>';

 // 廣告位（預留，可日後填入廣告代碼）
 out+='<div id="ad-slot" style="min-height:60px;background:var(--row);border:1px dashed var(--border);border-radius:10px;margin-bottom:10px;display:flex;align-items:center;justify-content:center">';
 out+='<span style="font-size:10px;color:var(--dim)">廣告位</span>';
 out+='</div>';

 out+='<div style="font-size:13px;color:var(--sub);font-weight:700;margin-bottom:8px">近期開獎</div>';
 for(var i=0;i<Math.min(hist.length,6);i++){
 var h=hist[i];
 out+='<div class="row-item" style="'+(i===0?'background:rgba(255,46,99,.05)':'')+'">';
 out+='<div style="min-width:62px"><div style="font-size:12px;color:var(--accent);font-weight:800">'+h.draw+'</div><div style="font-size:9px;color:var(--dim)">'+h.date+'</div></div>';
 out+='<div style="display:flex;align-items:center;gap:4px;margin-left:auto;flex-wrap:nowrap">';
 for(var j=0;j<h.numbers.length;j++) out+=ball(h.numbers[j],26);
 out+=ball(h.extra,26,true);
 out+='</div></div>';
 }
 return out;
}

// ═══ WORKSHOP ═══
var W_METHODS=[
 {key:'golden',label:'黃金分割 φ',emoji:'',desc:'數學美感選號',color:'var(--gold)'},
 {key:'fib',label:'費氏數列 ∞',emoji:'',desc:'自然界神奇序列',color:'var(--sub)'},
 {key:'gap',label:'遺漏回歸 ↩',emoji:'',desc:'久未出現的號碼',color:'#22cc66'},
 {key:'hot',label:'近期熱號 ',emoji:'',desc:'最近12期高頻',color:'#e53935'},
 {key:'cold',label:'久違冷號 ',emoji:'',desc:'很久沒出現的',color:'#1e88e5'},
];
