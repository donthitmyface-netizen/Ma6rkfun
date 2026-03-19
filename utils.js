/* utils.js — 常中天機 · 工具函數、球號渲染、統計計算 */

// ── Ball zone colour maps (used by ball() and heatmap) ──
const ZC = {r:'#e53935',b:'#1e88e5',g:'#43a047',o:'#fb8c00',p:'#8e24aa'};
const ZCL = {r:'#ffcdd2',b:'#bbdefb',g:'#c8e6c9',o:'#ffe0b2',p:'#e1bee7'};
const ZCD = {r:'#5a0000',b:'#082040',g:'#083008',o:'#5a2000',p:'#200030'};
function gz(n){return n<=10?'r':n<=20?'b':n<=30?'g':n<=40?'o':'p';}

function ball(n, sz=40, extra=false, dim=false, ring=false, ringColor=''){
  // 5-zone neon colours: r=1-10, b=11-20, g=21-30, o=31-40, p=41-49
  const c=gz(n);
  const NC={r:'#ff3355',b:'#2288ff',g:'#22cc66',o:'#ff8833',p:'#aa44ff'};
  const GC={r:'rgba(255,51,85,.6)',b:'rgba(34,136,255,.55)',g:'rgba(34,204,102,.5)',o:'rgba(255,136,51,.5)',p:'rgba(170,68,255,.55)'};
  const col=NC[c]||'#ff3355', glow=GC[c]||'rgba(255,51,85,.5)';
  const rc=ringColor||col, fs=Math.round(sz*0.37), op=dim?0.28:1;
  let bg, brd, shd;
  if(extra){
    // Special ball: bright solid + double glow ring
    bg=`background:linear-gradient(145deg,${col}bb,${col});color:#fff`;
    brd=`border:2px solid ${col}`;
    shd=`box-shadow:0 0 0 3px ${col}33,0 0 18px ${glow},0 0 36px ${glow},inset 0 1px 0 rgba(255,255,255,.3)`;
  } else if(ring){
    bg=`background:rgba(0,0,0,.55);color:${col}`;
    brd=`border:2.5px solid ${rc}`;
    shd=`box-shadow:0 0 14px ${glow},0 0 0 1px ${rc}44,inset 0 1px 0 rgba(255,255,255,.08)`;
  } else {
    bg=`background:linear-gradient(145deg,rgba(0,0,0,.65),rgba(0,0,0,.4));color:${col}`;
    brd=`border:1.5px solid ${col}bb`;
    shd=`box-shadow:0 0 10px ${glow},inset 0 1px 0 rgba(255,255,255,.07),inset 0 -1px 0 rgba(0,0,0,.3)`;
  }
  return `<div style="width:${sz}px;height:${sz}px;border-radius:50%;flex-shrink:0;${bg};${brd};${shd};display:inline-flex;align-items:center;justify-content:center;font-weight:900;font-size:${fs}px;opacity:${op};user-select:none;transition:transform .15s">${n}</div>`;
}

function ballsRow(numbers, extra, sz=40){
 return numbers.map(n=>ball(n,sz)).join('') + `<span style="color:var(--dim);font-size:${sz*0.5}px;margin:0 4px;font-weight:300">+</span>` + ball(extra,sz,true);
}

function fmtPrize(n){if(n>=1e8)return`$${(n/1e8).toFixed(1)}億`;if(n>=1e7)return`$${(n/1e7).toFixed(0)}千萬`;if(n>=1e6)return`$${(n/1e6).toFixed(0)}百萬`;return`$${n.toLocaleString()}`;}

function calcStats(){
 const freq={},last={};
 for(let i=1;i<=49;i++)freq[i]=0;
 hist.forEach(({numbers,extra},idx)=>[...numbers,extra].forEach(n=>{freq[n]++;if(last[n]===undefined)last[n]=idx;}));
 const sorted=Object.entries(freq).sort((a,b)=>b[1]-a[1]);
 return {freq,last,sorted,mxF:+sorted[0][1]};
}

function calcNextDraw(){
 const l=hist[0],[yr,num]=l.draw.split('/');
 const dn=`${yr}/${String(parseInt(num)+1).padStart(3,'0')}`;
 const dd=[2,4,6];let d=new Date(`${l.date}T21:30:00+08:00`);
 d.setDate(d.getDate()+1);
 while(!dd.includes(d.getDay()))d.setDate(d.getDate()+1);
 return{drawNum:dn,date:d.toISOString().slice(0,10)};
}

function getCountdown(){
 const nd=calcNextDraw();
 const diff=new Date(`${nd.date}T21:30:00+08:00`)-new Date();
 if(diff<=0)return null;
 return{days:Math.floor(diff/86400000),hours:Math.floor(diff%86400000/3600000),mins:Math.floor(diff%3600000/60000),secs:Math.floor(diff%60000/1000),diff};
}

// ── Math engines ──
const PHI=1.6180339887,FIBS=[1,2,3,5,8,13,21,34];
function hotScores(){const f={};for(let i=1;i<=49;i++)f[i]=0;hist.slice(0,12).forEach(({numbers,extra})=>[...numbers,extra].forEach(n=>f[n]++));const mf=Math.max(...Object.values(f))||1;const s={};for(let n=1;n<=49;n++)s[n]=f[n]/mf;return s;}
function coldScores(){const hs=hotScores();const s={};for(let n=1;n<=49;n++)s[n]=1-hs[n];return s;}
function goldenScores(){const gp=[49/PHI,49/PHI**2,49*(1-1/PHI),49/PHI**3,49*(2-PHI),49*(PHI-1),30,19];const f={};for(let i=1;i<=49;i++)f[i]=0;hist.forEach(({numbers,extra})=>[...numbers,extra].forEach(n=>f[n]++));const mf=Math.max(...Object.values(f));const s={};for(let n=1;n<=49;n++){const d=Math.min(...gp.map(p=>Math.abs(n-p)));s[n]=Math.max(0,1-d/10)*.6+(f[n]/mf)*.4;}return s;}
function fibScores(){const f={};for(let i=1;i<=49;i++)f[i]=0;hist.forEach(({numbers,extra})=>[...numbers,extra].forEach(n=>f[n]++));const mf=Math.max(...Object.values(f));const s={};for(let n=1;n<=49;n++){const fd=Math.min(...FIBS.map(x=>Math.abs(n-x)));const pd=Math.min(...FIBS.map(x=>Math.abs(n-x*PHI)));s[n]=(FIBS.includes(n)?1:Math.max(0,1-fd/8))*.35+Math.max(0,1-pd/5)*.25+(f[n]/mf)*.4;}return s;}
function gapScores(){const f={},ls={};for(let i=1;i<=49;i++)f[i]=0;hist.forEach(({numbers,extra},i)=>[...numbers,extra].forEach(n=>{f[n]++;if(ls[n]===undefined)ls[n]=i;}));const td=hist.length;const s={};for(let n=1;n<=49;n++){const ap=f[n]>0?td/f[n]:td;s[n]=Math.min((ls[n]!==undefined?ls[n]:td)/ap/3,1);}return s;}
function runMath(){
 const golden=goldenScores(),fib=fibScores(),gap=gapScores(),hot=hotScores(),cold=coldScores();
 const parity={},sum={},tail={};
 const p={odd:0,even:0};hist.forEach(({numbers})=>numbers.forEach(n=>n%2===0?p.even++:p.odd++));
 const r=p.odd/(p.odd+p.even);
 const sm=hist.map(({numbers})=>numbers.reduce((a,b)=>a+b,0));
 const apn=sm.reduce((a,b)=>a+b,0)/sm.length/6;
 const tf={};for(let t=0;t<=9;t++)tf[t]=0;
 hist.slice(0,10).forEach(({numbers,extra})=>[...numbers,extra].forEach(n=>tf[n%10]++));
 const mt=Math.max(...Object.values(tf));
 for(let n=1;n<=49;n++){parity[n]=n%2?1-r:r;sum[n]=Math.max(0,1-Math.abs(n-apn)/25);tail[n]=1-tf[n%10]/(mt+1);}
 const W={golden:.20,fib:.15,gap:.25,parity:.15,sum:.15,tail:.10};
 const fs={};
 for(let n=1;n<=49;n++)fs[n]=(golden[n]||0)*W.golden+(fib[n]||0)*W.fib+(gap[n]||0)*W.gap+(parity[n]||0)*W.parity+(sum[n]||0)*W.sum+(tail[n]||0)*W.tail;
 return Object.entries(fs).sort((a,b)=>b[1]-a[1]).map(([n,score])=>({n:+n,score,golden:golden[n],fib:fib[n],gap:gap[n],parity:parity[n],sum:sum[n],tail:tail[n]}));
}

// ── Workshop engine ──
const ZODIAC_LUCKY={鼠:[1,13,25,37],牛:[2,14,26,38],虎:[3,15,27,39],兔:[4,16,28,40],龍:[5,17,29,41],蛇:[6,18,30,42],馬:[7,19,31,43],羊:[8,20,32,44],猴:[9,21,33,45],雞:[10,22,34,46],狗:[11,23,35,47],豬:[12,24,36,48]};
const STAR_LUCKY={牡羊:[5,14,23,32,41],金牛:[6,15,24,33,42],雙子:[7,16,25,34,43],巨蟹:[2,11,20,29,38],獅子:[1,10,19,28,37],處女:[4,13,22,31,40],天秤:[3,12,21,30,39],天蠍:[8,17,26,35,44],射手:[9,18,27,36,45],摩羯:[10,19,28,37,46],水瓶:[11,20,29,38,47],雙魚:[12,21,30,39,48]};
const MBTI_LUCKY={INTJ:[7,14,21,35,42,49],INTP:[3,11,22,33,44,8],ENTJ:[1,10,19,28,37,46],ENTP:[6,13,24,35,46,2],INFJ:[9,18,27,36,45,4],INFP:[5,16,27,38,49,11],ENFJ:[2,12,23,34,45,7],ENFP:[4,14,25,36,47,9],ISTJ:[8,16,24,32,40,48],ISFJ:[3,13,23,33,43,6],ESTJ:[10,20,30,40,15,5],ESFJ:[1,11,21,31,41,12],ISTP:[7,17,27,37,47,4],ISFP:[6,16,26,36,46,3],ESTP:[9,18,28,38,48,5],ESFP:[2,12,22,32,42,8]};
const MBTI_DESC={INTJ:'建築師',INTP:'邏輯學家',ENTJ:'指揮官⚔',ENTP:'辯論家',INFJ:'提倡者',INFP:'調停者暗',ENFJ:'主人公',ENFP:'競選者',ISTJ:'物流師',ISFJ:'守護者',ESTJ:'總經理',ESFJ:'執政官',ISTP:'鑑賞家',ISFP:'探險家',ESTP:'企業家',ESFP:'表演者'};
const MBTI_TRAIT={INTJ:'獨特冷門派',INTP:'質數奇數派',ENTJ:'強勢頭號派',ENTP:'冷門組合派',INFJ:'直覺引導派',INFP:'跟感覺走派',ENFJ:'熱情熱號派',ENFP:'隨心所欲派',ISTJ:'跟統計走派',ISFJ:'保守穩陣派',ESTJ:'嚴格數據派',ESFJ:'人氣大眾派',ISTP:'工程師分析派',ISFP:'美感直覺派',ESTP:'高風險回報派',ESFP:'最活躍玩家派'};
function getZodiac(y,m,d){
 // Use iztro for accurate zodiac (correct CNY boundary handling)
 try{
 if(typeof iztro!=='undefined'&&iztro.astro){
 var pad=function(n){return n<10?'0'+n:''+n;};
 var ab=iztro.astro.bySolar(y+'-'+pad(m)+'-'+pad(d),0,'男',true,'zh-TW');
 if(ab&&ab.zodiac){
 // Normalise simplified→traditional
 var norm={'龙':'龍','鸡':'雞','猪':'豬',
 '鼠':'鼠','牛':'牛','虎':'虎','兔':'兔','龍':'龍','蛇':'蛇',
 '马':'馬','馬':'馬','羊':'羊','猴':'猴','狗':'狗'};
 return norm[ab.zodiac]||ab.zodiac;
 }
 }
 }catch(e){ console.warn('iztro zodiac err:',e); }
 return _getZodiacFallback(y,m,d);
}


function _getZodiacFallback(y,m,d){
 // Fallback: accurate CNY dates from chinesefortunecalendar.com
 var cny={
 1924:[2,5],1925:[1,24],1926:[2,13],1927:[2,2],1928:[1,23],
 1929:[2,10],1930:[1,30],1931:[2,17],1932:[2,6],1933:[1,26],
 1934:[2,14],1935:[2,4],1936:[1,24],1937:[2,11],1938:[1,31],
 1939:[2,19],1940:[2,8],1941:[1,27],1942:[2,15],1943:[2,5],
 1944:[1,25],1945:[2,13],1946:[2,2],1947:[1,22],1948:[2,10],
 1949:[1,29],1950:[2,17],1951:[2,6],1952:[1,27],1953:[2,14],
 1954:[2,3],1955:[1,24],1956:[2,12],1957:[1,31],1958:[2,18],
 1959:[2,8],1960:[1,28],1961:[2,15],1962:[2,5],1963:[1,25],
 1964:[2,13],1965:[2,2],1966:[1,21],1967:[2,9],1968:[1,30],
 1969:[2,17],1970:[2,6],1971:[1,27],1972:[2,15],1973:[2,3],
 1974:[1,23],1975:[2,11],1976:[1,31],1977:[2,18],1978:[2,7],
 1979:[1,28],1980:[2,16],1981:[2,5],1982:[1,25],1983:[2,13],
 1984:[2,2],1985:[2,20],1986:[2,9],1987:[1,29],1988:[2,17],
 1989:[2,6],1990:[1,27],1991:[2,15],1992:[2,4],1993:[1,23],
 1994:[2,10],1995:[1,31],1996:[2,19],1997:[2,7],1998:[1,28],
 1999:[2,16],2000:[2,5],2001:[1,24],2002:[2,12],2003:[2,1],
 2004:[1,22],2005:[2,9],2006:[1,29],2007:[2,18],2008:[2,7],
 2009:[1,26],2010:[2,14],2011:[2,3],2012:[1,23],2013:[2,10],
 2014:[1,31],2015:[2,19],2016:[2,8],2017:[1,28],2018:[2,16],
 2019:[2,5],2020:[1,25],2021:[2,12],2022:[2,1],2023:[1,22],
 2024:[2,10],2025:[1,29],2026:[2,17],2027:[2,6],2028:[1,26]
 };
 var animals=['鼠','牛','虎','兔','龍','蛇','馬','羊','猴','雞','狗','豬'];
 var ly=y;
 var cn=cny[y];
 if(cn && (m<cn[0]||(m===cn[0]&&d<cn[1]))) ly=y-1;
 return animals[((ly-1924)%12+12)%12];
}

function getStar(m,d){const cuts=[[1,20,'水瓶'],[2,19,'雙魚'],[3,21,'牡羊'],[4,20,'金牛'],[5,21,'雙子'],[6,21,'巨蟹'],[7,23,'獅子'],[8,23,'處女'],[9,23,'天秤'],[10,23,'天蠍'],[11,22,'射手'],[12,22,'摩羯']];for(const[mo,day,name]of cuts)if(m===mo&&d>=day)return name;return cuts[(cuts.findIndex(c=>c[0]===m)-1+12)%12][2];}
const todayLuckyIndex=(()=>{const d=new Date();return(d.getDate()*7+d.getMonth()*13+d.getFullYear())%100;})();
const LUCKY_MSGS=['氣場低迷，靜待時機','氣場平穩，觀望為上','天機波動，中規中矩','氣場漸旺，可小試','氣場強盛，天時人和','紫微照命，大吉之象','天命所歸，諸事順遂']

function runWorkshop(bday, mbti, sources){
 const scoreMap={}, labelMap={};
 for(let n=1;n<=49;n++){scoreMap[n]=0;labelMap[n]=[];}
 if(sources.birthday && bday){
 const[yr,mo,dy]=bday.split('-').map(Number);
 const zodiac=getZodiac(yr,mo,dy),star=getStar(mo,dy);
 const zl=ZODIAC_LUCKY[zodiac]||[],sl=STAR_LUCKY[star]||[];
 const bdNums=new Set([...zl,...sl,dy%49||49,mo%49||1,(yr%49)||7]);
 const seed=yr+mo*100+dy;
 for(let n=1;n<=49;n++){
 const sc=(bdNums.has(n)?1.5:0)+Math.abs(Math.sin(n*seed))*.3;
 scoreMap[n]+=sc;
 if(zl.includes(n))labelMap[n].push(zodiac+'生肖');
 if(sl.includes(n))labelMap[n].push(star+'星座');
 }
 }
 if(sources.mbti && mbti){const ml=MBTI_LUCKY[mbti]||[];ml.forEach((n,i)=>{scoreMap[n]+=1.2-i*.05;labelMap[n].push(mbti);});}
 if(sources.golden){const gs=goldenScores();for(let n=1;n<=49;n++){scoreMap[n]+=gs[n]*1.0;if(gs[n]>0.6)labelMap[n].push('黃金分割φ');}}
 if(sources.fib){const fs=fibScores();for(let n=1;n<=49;n++){scoreMap[n]+=fs[n]*0.8;if(fs[n]>0.5)labelMap[n].push('費氏數列∞');}}
 if(sources.gap){const gs=gapScores();for(let n=1;n<=49;n++){scoreMap[n]+=gs[n]*0.9;if(gs[n]>0.5)labelMap[n].push('遺漏回歸↩');}}
 if(sources.hot){const hs=hotScores();for(let n=1;n<=49;n++){scoreMap[n]+=hs[n]*0.8;if(hs[n]>0.6)labelMap[n].push('近期熱號');}}
 if(sources.cold){const cs=coldScores();for(let n=1;n<=49;n++){scoreMap[n]+=cs[n]*0.8;if(cs[n]>0.6)labelMap[n].push('久違冷號');}}
 const ranked=Object.entries(scoreMap).map(([n,s])=>({n:+n,score:s,labels:labelMap[+n]})).sort((a,b)=>b.score-a.score);
 const nums=ranked.slice(0,6).map(x=>x.n).sort((a,b)=>a-b);
 const extraCand=ranked.find(x=>!nums.includes(x.n));
 const extra=extraCand?extraCand.n:ranked[6].n;
 return{nums,extra,ranked,details:[...nums.map(n=>({n,labels:ranked.find(x=>x.n===n)?.labels||[],isExtra:false})),{n:extra,labels:extraCand?.labels||[],isExtra:true}]};
}

// ── Discussion posts ──
const POSTS=[
 {id:'r1',pin:true,emoji:'',title:'免責聲明',date:'2026-01-01',likes:0,content:'本應用程式（六合常中）純屬娛樂性質。\n\n所有號碼分析、預測及推薦均為統計學參考，並不構成任何投注建議。六合彩開獎結果完全隨機，任何分析方法均無法預測結果。\n\n本應用程式與香港賽馬會及任何官方機構無關聯。請量力而為，理性娛樂。未成年人士不得投注。\n\n如有沉迷賭博問題，請致電賭博輔導熱線：1800-6-668668（免費）'},
 {id:'r2',pin:true,emoji:'⚖',title:'法律責任聲明',date:'2026-01-01',likes:0,content:'使用本應用程式即表示您同意以下條款：\n\n1. 本應用程式提供之所有資訊僅供娛樂參考，不構成投注建議。\n\n2. 開發者對任何因使用本應用程式資訊而導致之投注損失概不負責。\n\n3. 用戶須自行承擔一切投注風險及法律責任。\n\n4. 本應用程式不儲存用戶個人資料於伺服器，所有數據僅儲存於用戶裝置本地。\n\n5. 本應用程式保留隨時修改或終止服務之權利，恕不另行通知。'},
];

// ── Toast ──
let toastTimer;
function showToast(msg, type='ok', d=3500){
 const t=document.getElementById('toast');
 t.textContent=msg;t.className=type;t.style.display='block';
 clearTimeout(toastTimer);
 toastTimer=setTimeout(()=>t.style.display='none',d);
}

// ── Confetti ──
function showConfetti(){
 const c=document.getElementById('confetti');
 c.innerHTML='';c.style.display='block';
 const colors=['#ff2e63','#cc1840','#9b8cd6','#5533aa','#2288ff','#0044cc'];
 for(let i=0;i<40;i++){
 const d=document.createElement('div');
 var shapes=['2px','50%','0','50% 0 50% 0'];d.style.cssText='position:absolute;left:'+((i*37+13)%100)+'%;top:-20px;width:'+(i%4===0?12:i%3===0?8:5)+'px;height:'+(i%4===0?3:i%3===0?8:5)+'px;border-radius:'+shapes[i%4]+';background:'+colors[i%6]+';box-shadow:0 0 6px '+colors[i%6]+';animation:confetti '+(1.2+i*.06)+'s ease-in '+((i*.04)%0.8)+'s forwards';
 c.appendChild(d);
 }
 setTimeout(()=>{c.style.display='none';c.innerHTML='';},3500);
}

// ── Theme ──
function setTheme(t){
 theme=t;
 localStorage.setItem('ms_theme',t);
 document.body.className=t==='fun'?'':t;
 document.querySelectorAll('.theme-btn').forEach(b=>b.classList.toggle('active',b.id===`btn-${t}`));
 applyFont();
 render();
}
function setFont(scale){
 fontScale=scale;
 localStorage.setItem('ms_font',scale);
 applyFont();
 document.querySelectorAll('.font-btn').forEach(function(b){
 b.classList.toggle('active', parseFloat(b.dataset.scale)===scale);
 });
}
function applyFont(){
 var el=document.documentElement;
 // Remove all previous scaling
 el.style.transform='';
 el.style.transformOrigin='';
 el.style.width='';
 el.style.height='';
 document.body.style.zoom='';
 document.body.style.width='';

 if(fontScale!==1){
 // Scale from top-left; shrink the root element width/height inversely
 // so the viewport doesn't scroll horizontally
 var pct=Math.round(100/fontScale)+'%';
 el.style.transformOrigin='top left';
 el.style.transform='scale('+fontScale+')';
 el.style.width=pct;
 el.style.height=pct;
 }

 document.querySelectorAll('.font-btn').forEach(function(b){
 b.classList.toggle('active', parseFloat(b.dataset.scale)===fontScale);
 });
}

// ── Lucky bar ──
function initLucky(){
 applyFont();
 document.getElementById('lucky-fill').style.width=todayLuckyIndex+'%';
 document.getElementById('lucky-pct').textContent=todayLuckyIndex+'%';
 document.getElementById('lucky-msg').textContent=LUCKY_MSGS[Math.floor(todayLuckyIndex/15)];
}

// ── Header ──
function updateHeader(){
 const l=hist[0];
 document.getElementById('hdr-draw').textContent=l.draw;
 document.getElementById('hdr-date').textContent=l.date;
}

// ── Countdown ──
let cdTimer;
function startCountdown(){
 clearInterval(cdTimer);
 cdTimer=setInterval(()=>{
 const el=document.getElementById('countdown');
 if(!el)return;
 const cd=getCountdown();
 if(!cd){el.innerHTML=' 係時候開獎！';return;}
 let s=cd.days>0?`<span style="font-size:16px">${cd.days}日 </span>`:'';
 s+=`${String(cd.hours).padStart(2,'0')}:${String(cd.mins).padStart(2,'0')}:${String(cd.secs).padStart(2,'0')}`;
 el.innerHTML=s;
 if(alarmOn && !alarmFired && cd.diff/60000<=alarmMins){
 alarmFired=true;
 triggerAlarm('time');
 }
 if(!cd)alarmFired=false;
 },1000);
}

function getDailyFortune(profile){
 if(!profile||!profile.date)return null;
 var bdate=new Date(profile.date);
 var by=bdate.getFullYear(),bm=bdate.getMonth()+1,bd=bdate.getDate();
 var today=new Date();
 var gender=profile.gender==='female'?'女':'男';
 var pad=function(n){return n<10?'0'+n:''+n;};
 var birthStr=by+'-'+pad(bm)+'-'+pad(bd);
 var todayStr=today.getFullYear()+'-'+pad(today.getMonth()+1)+'-'+pad(today.getDate());

 // ── iztro: birth chart ──
 var ab=null, horoscope=null;
 var birthYearPillar='', birthMonthPillar='', birthDayPillar='', birthHourPillar='';
 var zodiac='', soulStar='', bodyStar='', fiveClass='', soulPalace='';
 var birthChineseDate='';

 // ── iztro: TODAY's pillars (separate call for today) ──
 var todayYearPillar='', todayMonthPillar='', todayDayPillar='';

 try{
 if(typeof iztro!=='undefined'&&iztro.astro){
 var birthHour=profile.time?parseInt(profile.time.split(':')[0]):12;
 // iztro time index: 子=0(23-1), 丑=1(1-3), 寅=2(3-5)...
 var tIdx=Math.floor(((birthHour+1)%24)/2);

 // Birth chart
 ab=iztro.astro.bySolar(birthStr, tIdx, gender, true, 'zh-TW');
 if(ab){
 zodiac=ab.zodiac||'';
 soulStar=ab.soul||'';
 bodyStar=ab.body||'';
 fiveClass=ab.fiveElementsClass||'';
 soulPalace=ab.earthlyBranchOfSoulPalace||'';
 birthChineseDate=ab.chineseDate||''; // e.g. "乙丑 己卯 辛丑 壬午" (year month day hour of birth)
 horoscope=ab.horoscope(today);

 // Parse birth pillars from chineseDate "年柱 月柱 日柱 時柱"
 var bPillars=birthChineseDate.split(' ');
 birthYearPillar=bPillars[0]||'';
 birthMonthPillar=bPillars[1]||'';
 birthDayPillar=bPillars[2]||''; // This is birth DAY pillar
 birthHourPillar=bPillars[3]||'';
 }

 // Today's pillars - get from today's astrolabe
 var todayAb=iztro.astro.bySolar(todayStr, 0, '男', true, 'zh-TW');
 if(todayAb&&todayAb.chineseDate){
 var tPillars=todayAb.chineseDate.split(' ');
 todayYearPillar=tPillars[0]||'';
 todayMonthPillar=tPillars[1]||'';
 todayDayPillar=tPillars[2]||''; // TODAY's actual day pillar e.g. "辛巳"
 }
 }
 }catch(e){console.log('iztro err:',e);}

 // Fallback zodiac
 if(!zodiac) zodiac=_getZodiacFallback(by,bm,bd);
 var zmap={'鸡':'雞','龙':'龍','猪':'豬'};
 zodiac=zmap[zodiac]||zodiac;

 // ── Extract stem/branch from today's day pillar ──
 var stems=['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
 var branches=['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
 var elements=['木','木','火','火','土','土','金','金','水','水'];

 var todayStem='', todayBranch='', todayElement='';
 if(todayDayPillar&&todayDayPillar.length>=2){
 todayStem=todayDayPillar[0];
 todayBranch=todayDayPillar[1];
 var si=stems.indexOf(todayStem);
 todayElement=si>=0?elements[si]:'';
 } else {
 // Fallback calculation for today's stem/branch
 var daysSince=Math.floor((today-new Date('1900-01-31'))/86400000);
 todayStem=stems[((daysSince%10)+10)%10];
 todayBranch=branches[((daysSince%12)+12)%12];
 todayElement=elements[((daysSince%10)+10)%10];
 }

 // ── Birth year element (命元) from year pillar ──
 var birthElement='';
 if(birthYearPillar&&birthYearPillar.length>=1){
 var byStemIdx=stems.indexOf(birthYearPillar[0]);
 birthElement=byStemIdx>=0?elements[byStemIdx]:'';
 }
 if(!birthElement){
 var daysSince2=Math.floor((today-new Date('1900-01-31'))/86400000);
 birthElement=elements[(by-1900+200)%10];
 }

 // ── Luck score: 《三命通會》五行生剋 + 《滴天髓》地支 ──
 var elemScore={木:{木:65,火:85,土:50,金:40,水:90},火:{木:85,火:65,土:80,金:45,水:35},
 土:{木:45,火:80,土:65,金:85,水:45},金:{木:40,火:45,土:80,金:65,水:85},水:{木:90,火:35,土:45,金:80,水:65}};
 var base=(elemScore[birthElement]&&elemScore[birthElement][todayElement])||65;

 // 地支六沖三合 adjustment
 var zodiacBranch={'鼠':'子','牛':'丑','虎':'寅','兔':'卯','龍':'辰','蛇':'巳','馬':'午','羊':'未','猴':'申','雞':'酉','狗':'戌','豬':'亥',
 '龙':'辰','鸡':'酉','猪':'亥'};
 var myBr=zodiacBranch[zodiac]||'';
 var bi=branches.indexOf(myBr), ti=branches.indexOf(todayBranch);
 if(bi>=0&&ti>=0){
 var diff=(bi-ti+12)%12;
 if(diff===0)base+=15; else if(diff===1||diff===11)base+=8;
 else if(diff===4||diff===8)base+=10; else if(diff===6)base-=18;
 else if(diff===3||diff===9)base-=8;
 }
 if(horoscope&&horoscope.daily){
 var dp=horoscope.daily.palaceName||'';
 if(dp==='福德'||dp==='財帛')base+=8; else if(dp==='疾厄')base-=5;
 }
 base=Math.min(98,Math.max(28,base));

 // ── 《窮通寶鑑》命宮主星解讀 ──
 var starReadings={
 '紫微':{td:'貴人運強，宜主動出擊，展現領導力',warn:'避免過度自我'},
 '天機':{td:'思維敏銳，宜策劃新計畫',warn:'付諸行動勿空想'},
 '太陽':{td:'人際運旺，宜廣結善緣',warn:'注意休息'},
 '武曲':{td:'宜處理財務投資事宜',warn:'勿過於剛硬'},
 '天同':{td:'福德充盈，萬事順遂',warn:'勿過於懶散'},
 '廉貞':{td:'創意靈感豐富，宜展現才能',warn:'避免情緒化'},
 '天府':{td:'財庫充盈，宜穩健行事',warn:'勿因保守錯失'},
 '太陰':{td:'感情有佳音，宜文藝創作',warn:'勿過於敏感'},
 '貪狼':{td:'桃花偏財並旺，宜社交',warn:'避免過度享樂'},
 '巨門':{td:'宜謹言慎行，以和為貴',warn:'勿惹口舌'},
 '天相':{td:'貴人相助，事業有進展',warn:'勿依賴他人'},
 '天梁':{td:'長輩貴人相助',warn:'避免孤高自賞'},
 '七殺':{td:'宜積極衝刺，勿畏縮',warn:'避免衝動莽撞'},
 '破軍':{td:'破舊立新，宜出行拓展',warn:'勿破壞既有關係'}
 };
 var sr=soulStar&&starReadings[soulStar];
 var starText=sr?'（命宮'+soulStar+'）'+sr.td+'。注意：'+sr.warn:
 zodiac+'年生，'+birthElement+'命，今日'+todayStem+todayBranch+'，'+
 (birthElement===todayElement?'比和平穩':'五行相'+(['木','火'].includes(todayElement)?'生':'和')+'，運勢平穩');

 var fortunes=[
 {min:85,emoji:'',title:'大吉之日'},
 {min:72,emoji:'',title:'吉日'},
 {min:55,emoji:'☁',title:'平穩之日'},
 {min:0,emoji:'暗',title:'需謹慎'}
 ];
 var msg=fortunes.find(function(f){return base>=f.min;})||fortunes[3];

 // Lucky numbers based on birth pillars + today
 var luckyNums=[];
 var seed=(by+bm*bd+today.getFullYear()*(today.getMonth()+1)+today.getDate());
 var elemNums={木:[3,4,8,9,13,14],火:[1,2,6,7,11,12],土:[5,10,15,20,25,30],金:[16,17,21,22,26,27],水:[18,19,23,24,28,29]};
 var pool=elemNums[birthElement]||[1,2,3];
 for(var i=0;i<6;i++){
 var n=((seed*(i+3)*7+by+today.getDate()+pool[i%pool.length])%49)+1;
 if(!luckyNums.includes(n))luckyNums.push(n);
 }
 luckyNums=luckyNums.slice(0,4);

 var star=getStar(bm,bd);
 return {
 emoji:msg.emoji, title:msg.title, score:base,
 subtitle:zodiac+'｜'+star+'座｜'+birthElement+'命｜今日'+todayStem+todayBranch,
 text:starText,
 // Birth pillars (from iztro chineseDate)
 birthYearPillar:birthYearPillar, birthMonthPillar:birthMonthPillar,
 birthDayPillar:birthDayPillar, birthHourPillar:birthHourPillar,
 birthChineseDate:birthChineseDate,
 // Today's pillars (from iztro today)
 todayYearPillar:todayYearPillar, todayMonthPillar:todayMonthPillar,
 todayDayPillar:todayDayPillar,
 todayStem:todayStem, todayBranch:todayBranch,
 // Legacy fields for compatibility
 stem:todayStem, branch:todayBranch,
 soulStar:soulStar, bodyStar:bodyStar, fiveClass:fiveClass,
 chineseDateStr:birthChineseDate, soulPalace:soulPalace,
 luckyNums:luckyNums, birthElement:birthElement, todayElement:todayElement,
 zodiac:zodiac, star:star, stems:stems, branches:branches, elements:elements,
 daysSince:Math.floor((today-new Date('1900-01-31'))/86400000),
 horoscope:horoscope, ab:ab
 };
}

function setPhoneAlarm(){
 var nd=calcNextDraw();if(!nd){showToast('未能取得攪珠時間','err');return;}
 var dt=new Date(nd.date+'T13:30:00Z');
 var at=new Date(dt.getTime()-alarmMins*60000);
 var h=at.getHours().toString().padStart(2,'0');var m=at.getMinutes().toString().padStart(2,'0');
 var L={30:'30分',60:'1小時',120:'2小時',360:'6小時',720:'12小時',1440:'24小時'};
 showToast('請設鬧鐘：'+h+':'+m+' （攪珠前'+(L[alarmMins]||alarmMins+'分')+'）','ok',7000);
 if(/Android/.test(navigator.userAgent))setTimeout(function(){window.location.href='intent://alarm#Intent;action=android.intent.action.SET_ALARM;i.android.intent.extra.alarm.HOUR='+at.getHours()+';i.android.intent.extra.alarm.MINUTES='+at.getMinutes()+';end';},500);
}
function triggerAlarm(type){
 const msg=type==='prize'?` 頭獎已達 ${fmtPrize(curPrize)}！`:`⏰ 攪珠還有 ${alarmMins} 分鐘！`;
 showToast(msg,'ok',5000);
 if(typeof Notification!=='undefined'&&Notification.permission==='granted')new Notification(' 六合常中',{body:msg});
 try{const ctx=new(window.AudioContext||window.webkitAudioContext)();[0,.3,.6].forEach(t=>{const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(ctx.destination);o.frequency.value=880;g.gain.setValueAtTime(.25,ctx.currentTime+t);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+t+.25);o.start(ctx.currentTime+t);o.stop(ctx.currentTime+t+.25);});}catch{}
}

// ── Refresh ──
let refreshLog = [];
var _refreshXhr=null;
var _obGender='';
function selectGender(g){
 _obGender=g;
 document.getElementById('ob-male').style.borderColor=g==='male'?'var(--accent)':'var(--border)';
 document.getElementById('ob-male').style.background=g==='male'?'var(--accent-bg)':'var(--card)';
 document.getElementById('ob-female').style.borderColor=g==='female'?'var(--accent)':'var(--border)';
 document.getElementById('ob-female').style.background=g==='female'?'var(--accent-bg)':'var(--card)';
}
function saveProfile(){
 var d=document.getElementById('ob-date').value;
 var t=document.getElementById('ob-time').value||'';
 if(!d){showToast('請輸入出生日期','err');return;}
 var dObj=new Date(d);
 if(isNaN(dObj.getTime())){showToast('日期格式有誤，請重新輸入','err');return;}
 if(dObj.getFullYear()<1924||dObj.getFullYear()>2010){showToast('請輸入 1924–2010 年間的出生日期','err');return;}
 var profile={date:d,time:t,gender:_obGender||'unknown',saved:Date.now()};
 localStorage.setItem('ms_profile',JSON.stringify(profile));
 userProfile=profile;
 document.getElementById('onboarding-modal').style.display='none';
 // Update wBday for workshop
 wBday=d;
 render();
 showToast(' 已儲存！運程分析已啟用','ok',3000);
}
function skipProfile(){
 document.getElementById('onboarding-modal').style.display='none';
}
function editProfile(){
 var m=document.getElementById('onboarding-modal');
 m.style.display='flex';
 if(userProfile){
 document.getElementById('ob-date').value=userProfile.date||'';
 document.getElementById('ob-time').value=userProfile.time||'';
 if(userProfile.gender)selectGender(userProfile.gender);
 }
}
function closeModal(){document.querySelectorAll('[data-modal]').forEach(function(e){e.remove();});}
function doRefresh(){
 if(_refreshXhr)return;
 refreshLog=[' 連接中...'];render();
 var ctrl=new AbortController();
 var tid=setTimeout(function(){ctrl.abort();},20000);
 _refreshXhr=ctrl;
 fetch(WORKER_URL,{signal:ctrl.signal,cache:'no-store'})
 .then(function(r){
 clearTimeout(tid);_refreshXhr=null;
 if(!r.ok)throw new Error('HTTP '+r.status);
 return r.json();
 })
 .then(function(data){
 if(!data.ok)throw new Error(data.error||'Worker錯誤');
 var rows=(data.results||[]).filter(function(r){
 return r.draw&&r.date&&r.numbers&&r.numbers.length===6&&r.extra!==undefined;
 });
 if(!rows.length)throw new Error('無有效數據');
 hist=rows;
 refreshLog=[' 更新成功！共 '+rows.length+' 期',
 '最新：'+rows[0].draw+' ('+rows[0].date+')',
 ' '+rows[0].numbers.join(', ')+' 特：'+rows[0].extra];
 render();
 })
 .catch(function(e){
 clearTimeout(tid);_refreshXhr=null;
 refreshLog=[e.name==='AbortError'?' 連接逾時':' 更新失敗: '+e.message];
 render();
 });
}

function parseHK(text){
 var rows=[];
 try{
 // Strip all HTML tags to get plain text
 var plain=text.replace(/<script[^>]*>[\s\S]*?<\/script>/gi,'')
 .replace(/<style[^>]*>[\s\S]*?<\/style>/gi,'')
 .replace(/<[^>]+>/g,' ')
 .replace(/&nbsp;/g,' ')
 .replace(/&amp;/g,'&')
 .replace(/\s+/g,' ');
 
 // Find all draw numbers like 26/021
 var drawRe=/\b(\d{2}\/\d{3})\b/g;
 var m, draws=[];
 while((m=drawRe.exec(plain))!==null) draws.push({draw:m[1],pos:m.index});
 
 // Remove duplicate draws (keep first occurrence)
 var seen={}, uniqueDraws=[];
 for(var i=0;i<draws.length;i++){
 if(!seen[draws[i].draw]){seen[draws[i].draw]=true;uniqueDraws.push(draws[i]);}
 }
 
 var MONTHS={january:'01',february:'02',march:'03',april:'04',may:'05',june:'06',july:'07',august:'08',september:'09',october:'10',november:'11',december:'12'};
 
 for(var i=0;i<uniqueDraws.length&&rows.length<30;i++){
 var pos=uniqueDraws[i].pos;
 var chunk=plain.slice(pos,pos+400);
 
 // Find date: "24 February 2026" or "2026-02-24"
 var date='';
 var dm=chunk.match(/(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/i);
 if(dm){
 date=dm[3]+'-'+MONTHS[dm[2].toLowerCase()]+'-'+dm[1].padStart(2,'0');
 } else {
 var dm2=chunk.match(/(\d{4})-(\d{2})-(\d{2})/);
 if(dm2) date=dm2[1]+'-'+dm2[2]+'-'+dm2[3];
 }
 if(!date) continue;
 
 // Find 7 numbers 1-49, skip year numbers like 2026
 var numRe=/\b([1-9]|[1-4][0-9])\b/g;
 numRe.lastIndex=0;
 var nums=[], seenN={}, nm;
 while((nm=numRe.exec(chunk))!==null){
 var n=parseInt(nm[1]);
 if(n>=1&&n<=49&&!seenN[n]){seenN[n]=true;nums.push(n);}
 if(nums.length>=7) break;
 }
 
 if(nums.length>=7){
 rows.push({
 draw:uniqueDraws[i].draw,
 date:date,
 numbers:nums.slice(0,6).sort(function(a,b){return a-b;}),
 extra:nums[6]
 });
 }
 }
 }catch(e){}
 return rows;
}

function renderRefreshLog(){
 const el=document.getElementById('refresh-log');
 if(!el)return;
 el.innerHTML=refreshLog.map(l=>`<div style="font-size:11px;color:${l.startsWith('')?'#22cc66':l.startsWith('')?'#ff4444':l.startsWith('⚠')?'var(--gold)':'var(--sub)'};margin-bottom:3px;line-height:1.5">${l}</div>`).join('');
}

// ── Grid 49 ──
function grid49(selected, onToggleFn, maxed=false){
 let html='<div class="grid49">';
 for(let n=1;n<=49;n++){
 const sel=selected.includes(n),off=maxed&&!sel,c=gz(n),col=ZC[c];
 const bg=sel?col:(off?'var(--bg)':'var(--input)');
 const color=sel?'#fff':(off?'var(--dim)':col);
 const border=sel?col:(off?'var(--track)':'var(--iborder)');
 html+=`<button onclick="${onToggleFn}(${n})" style="aspect-ratio:1;border-radius:50%;font-weight:800;font-size:11px;cursor:${off?'default':'pointer'};border:2px solid ${border};background:${bg};color:${color};padding:0">${n}</button>`;
 }
 return html+'</div>';
}

// ── Settings ──
function openSettings(){
 document.getElementById('settings-modal').classList.add('open');
 var prov=localStorage.getItem('ms_ai_provider')||'anthropic';
 setAIProvider(prov,true);
 document.getElementById('api-key-input').value=localStorage.getItem('ms_key_'+prov)||'';
 var kofiEl=document.getElementById('kofi-input');
 var fpsEl=document.getElementById('fps-input');
 if(kofiEl) kofiEl.value=localStorage.getItem('ms_kofi')||'';
 if(fpsEl) fpsEl.value=localStorage.getItem('ms_fps')||'';
}
function setAIProvider(p,silent){
 localStorage.setItem('ms_ai_provider',p);
 ['anthropic','deepseek','grok'].forEach(function(id){
 var btn=document.getElementById('prov-'+id);
 if(!btn)return;
 var active=id===p;
 btn.style.background=active?'var(--accent)':'var(--card)';
 btn.style.color=active?'#fff':'var(--text)';
 btn.style.borderColor=active?'var(--accent)':'var(--border)';
 });
 var hints={anthropic:'console.anthropic.com · 每次約HK$0.01',deepseek:'platform.deepseek.com · 超低成本，性價比極高！',grok:'console.x.ai · xAI 出品，有免費額度'};
 var placeholders={anthropic:'sk-ant-api03-...',deepseek:'sk-...',grok:'xai-...'};
 var h=document.getElementById('ai-provider-hint');
 var inp=document.getElementById('api-key-input');
 if(h)h.textContent=hints[p]||'';
 if(inp){inp.placeholder=placeholders[p]||'API Key...';if(!silent)inp.value=localStorage.getItem('ms_key_'+p)||'';}
}
function closeSettings(){document.getElementById('settings-modal').classList.remove('open');}
function saveDonationSettings(){
 localStorage.setItem('ms_kofi', document.getElementById('kofi-input').value.trim());
 localStorage.setItem('ms_fps', document.getElementById('fps-input').value.trim());
 showToast(' 打賞設定已儲存','ok');
 closeSettings();
}
function showPayMe(){
 var fps=localStorage.getItem('ms_fps')||'';
 var kofi=localStorage.getItem('ms_kofi')||'';
 var fpsHtml=fps
 ?'<div style="font-size:16px;font-weight:900;color:#333;margin:8px 0">'+fps+'</div>'
 +'<div style="font-size:10px;color:#999">在轉數快輸入以上號碼</div>'
 :'<div style="font-size:12px;color:#999">請在⚙設定填入 FPS 號碼</div>';
 var modal=document.createElement('div');
 modal.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px';
 modal.setAttribute('data-modal','1');
 modal.innerHTML='<div style="background:var(--card);border-radius:20px;padding:24px;max-width:320px;width:100%;text-align:center">'
 +'<div style="font-size:20px;font-weight:900;color:var(--text);margin-bottom:8px">PayMe / FPS 打賞</div>'
 +'<div style="font-size:11px;color:var(--sub);margin-bottom:16px">感謝支持！每分打賞都是對開發者最大的鼓勵 ☕</div>'
 +'<div style="background:#f5f5f5;border-radius:12px;padding:16px;margin-bottom:12px">'+fpsHtml+'</div>'
 +(kofi?'<a href="'+kofi+'" target="_blank" style="display:block;width:100%;padding:10px;background:#FF5E5B;color:#fff;border-radius:12px;font-size:13px;font-weight:700;text-decoration:none;margin-bottom:8px;box-sizing:border-box">☕ Ko-fi 打賞</a>':'')
 +'<button onclick="closeModal()" style="width:100%;padding:12px;background:var(--border);color:var(--text);border:none;border-radius:12px;font-size:14px;cursor:pointer">關閉</button>'
 +'</div>';
 document.body.appendChild(modal);
}
function showPWAGuide(){
 var isIOS=/iPad|iPhone|iPod/.test(navigator.userAgent);
 var isAndroid=/Android/.test(navigator.userAgent);
 if(isIOS) showToast(' Safari底部「分享」→「加至主畫面」即可安裝！','ok',6000);
 else if(isAndroid) showToast(' Chrome右上角「⋮」→「加至主畫面」即可安裝！','ok',6000);
 else showToast(' 請用手機瀏覽器打開此頁面安裝','ok',5000);
}
function saveApiKey(){
 var prov=localStorage.getItem('ms_ai_provider')||'anthropic';
 var key=document.getElementById('api-key-input').value.trim();
 localStorage.setItem('ms_key_'+prov,key);
 localStorage.setItem('ms_key',key); // backward compat
 showToast(' '+prov+' API Key 已儲存','ok');
 closeSettings();
}

// ── Tab render ──
