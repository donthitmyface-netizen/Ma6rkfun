/* ui-tabs.js — 常中天機 · 分頁渲染函數 */

function renderWorkshop(){
 // Auto-populate from saved profile if workshop birthday is empty
 if(!wBday&&userProfile&&userProfile.date) wBday=userProfile.date;
 var bdayParsed=null;
 if(wBday){var p=wBday.split('-').map(Number);bdayParsed={yr:p[0],mo:p[1],dy:p[2],z:getZodiac(p[0],p[1],p[2]),s:getStar(p[1],p[2])};}
 var out='';
 out+='<div style="text-align:center;margin-bottom:14px"><div style="font-size:24px;margin-bottom:4px"></div>';
 out+='<div style="font-size:18px;font-weight:900;color:var(--accent)">號碼生成工坊</div>';
 out+='<div style="font-size:11px;color:var(--sub);margin-top:4px">選擇配方，混合生成你的專屬幸運號碼！</div></div>';

 out+='<div class="card"><div class="step-label">STEP 1 · 選擇你的來源</div>';
 out+='<div class="w-tabs">';
 var wTabs=[['birthday',' 生日派'],['mbti',' MBTI派'],['combo',' 混合派']];
 for(var i=0;i<wTabs.length;i++){
 out+='<button class="w-tab '+(wTab===wTabs[i][0]?'active':'')+'" onclick="setWTab(\''+wTabs[i][0]+'\')">'+wTabs[i][1]+'</button>';
 }
 out+='</div>';

 if(wTab==='birthday'||wTab==='combo'){
 out+='<div style="font-size:12px;color:var(--text);font-weight:600;margin-bottom:6px">出生日期</div>';
 out+='<input type="date" value="'+wBday+'" onchange="wBday=this.value;render()" style="margin-bottom:'+(bdayParsed?'8px':'0')+'"/>';
 if(bdayParsed){
 out+='<div style="display:flex;gap:8px;margin-bottom:10px">';
 out+='<div style="flex:1;background:rgba(251,140,0,.12);border-radius:10px;padding:6px 10px;text-align:center;border:1px solid rgba(251,140,0,.2)"><div style="font-size:9px;color:var(--sub)">生肖</div><div style="font-size:18px;font-weight:800;color:var(--gold2)">'+bdayParsed.z+'</div></div>';
 out+='<div style="flex:1;background:rgba(142,36,170,.12);border-radius:10px;padding:6px 10px;text-align:center;border:1px solid rgba(142,36,170,.2)"><div style="font-size:9px;color:#4a148c">星座</div><div style="font-size:14px;font-weight:800;color:#6a1b9a">'+bdayParsed.s+'座</div></div>';
 out+='</div>';
 }
 }
 if(wTab==='mbti'||wTab==='combo'){
 out+='<div style="font-size:12px;color:var(--text);font-weight:600;margin-bottom:8px">MBTI 類型</div>';
 out+='<div class="mbti-grid">';
 var mbtiKeys=Object.keys(MBTI_DESC);
 for(var i=0;i<mbtiKeys.length;i++){
 var m=mbtiKeys[i];
 out+='<button class="mbti-btn '+(wMbti===m?'active':'')+'" onclick="toggleMBTI(\''+m+'\')">';
 out+='<div class="mb-name">'+m+'</div><div class="mb-desc">'+MBTI_DESC[m]+'</div></button>';
 }
 out+='</div>';
 if(wMbti) out+='<div style="background:rgba(255,46,99,.06);border-radius:10px;padding:8px 12px;margin-bottom:10px;font-size:11px;color:var(--accent);font-weight:600">你是 '+MBTI_DESC[wMbti]+' · '+MBTI_TRAIT[wMbti]+'</div>';
 }
 out+='</div>';

 out+='<div class="card"><div class="step-label">STEP 2 · 方法加持（可疊加）</div>';
 out+='<div style="font-size:10px;color:var(--dim);margin-bottom:12px">可以選多個，號碼分數會疊加！</div>';
 out+='<div class="method-grid">';
 for(var i=0;i<W_METHODS.length;i++){
 var wm=W_METHODS[i],active=wSources[wm.key];
 out+='<button class="method-card '+(active?'active':'')+'" onclick="toggleMethod(\''+wm.key+'\')" style="'+(active?'border-color:'+wm.color+';background:rgba(0,0,0,.05);box-shadow:0 2px 8px rgba(0,0,0,.2)':'')+'">';
 out+='<div class="mc-icon">'+wm.emoji+'</div>';
 out+='<div class="mc-label" style="color:'+(active?wm.color:'var(--text)')+'">'+wm.label+(active?' ':'')+'</div>';
 out+='<div class="mc-desc">'+wm.desc+'</div></button>';
 }
 out+='</div></div>';

 out+='<div class="card"><div class="step-label">STEP 3 · 生成號碼</div>';
 out+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">';
 out+='<button class="btn btn-fun" style="height:52px;font-size:14px" onclick="doWorkshop()">數學配方</button>';
 out+='<button class="btn btn-purple" style="height:52px;font-size:14px" onclick="doWorkshopAI()" '+(wAiLoading?'disabled':'')+'>'+(wAiLoading?' AI思考中...':' AI推薦')+'</button>';
 out+='</div><div style="font-size:10px;color:var(--dim);text-align:center;margin-top:8px">AI 推薦需要 API Key（右下角⚙設定）</div></div>';

 if(wResult){
 out+='<div class="result-card"><div style="text-align:center;margin-bottom:14px">';
 out+='<div style="font-size:13px;font-weight:900;color:var(--accent);margin-bottom:10px">'+(wResult.isAI?' AI 為你推薦的幸運號碼':'推演結果')+'</div>';
 out+='<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;justify-content:center;margin-bottom:6px">';
 out+=ballsRow(wResult.nums,wResult.extra,50);
 out+='</div><div style="font-size:10px;color:var(--dim)">正碼 · 特別號</div></div>';
 if(wResult.aiReason) out+='<div style="background:var(--row);border-radius:10px;padding:12px;font-size:12px;color:var(--text);line-height:1.8;margin-bottom:10px">'+wResult.aiReason+'</div>';
 if(!wResult.isAI){
 out+='<div style="font-size:11px;font-weight:700;color:var(--sub);margin-bottom:8px">號碼來源解析</div>';
 for(var i=0;i<wResult.details.length;i++){
 var d=wResult.details[i];
 out+='<div style="display:flex;align-items:center;gap:8px;background:var(--row);border-radius:10px;padding:8px 10px;border:1px solid var(--border);margin-bottom:6px">';
 out+=ball(d.n,30,d.isExtra);
 out+='<div><span style="font-size:10px;color:var(--dim);margin-right:4px">'+(d.isExtra?'特別號：':'正碼：')+'</span>';
 if(d.labels&&d.labels.length>0){for(var j=0;j<d.labels.length;j++) out+='<span class="src-tag">'+d.labels[j]+'</span>';}
 else out+='<span style="font-size:9px;color:var(--dim)">統計加權</span>';
 out+='</div></div>';
 }
 }
 out+='</div>';
 out+='<div style="background:var(--row);border-radius:12px;padding:12px;margin-bottom:12px;font-size:10px;color:var(--dim);line-height:1.8;text-align:center">ℹ 號碼由所選算法推演生成，純屬娛樂參考。<br/><span style="color:var(--accent);font-weight:700">天機難測，以娛樂心態參考。</span></div>';
 }
 
 // 廣告位
 out+='<div class="ad-slot" style="margin:10px 0;min-height:60px;background:var(--row);border:1px dashed var(--border);border-radius:10px;display:flex;align-items:center;justify-content:center">';
 out+='<span style="font-size:10px;color:var(--dim)">廣告位</span>';
 out+='</div>';
 return out;
}
function setWTab(t){wTab=t;wResult=null;render();}
function toggleMBTI(m){wMbti=wMbti===m?'':m;render();}
function toggleMethod(k){wSources[k]=!wSources[k];render();}
function doWorkshop(){
 var src=Object.assign({},wSources);
 if(wTab==='birthday'){src.birthday=true;src.mbti=false;}
 else if(wTab==='mbti'){src.birthday=false;src.mbti=true;}
 else{src.birthday=!!wBday;src.mbti=!!wMbti;}
 if(wTab==='birthday'&&!wBday){showToast(' 請先選擇你的生日','err');return;}
 if(wTab==='mbti'&&!wMbti){showToast(' 請先選擇你的 MBTI','err');return;}
 if(wTab==='combo'&&!wBday&&!wMbti){showToast(' 生日或MBTI至少填一個','err');return;}
 var noMethod=!src.birthday&&!src.mbti&&!src.golden&&!src.fib&&!src.gap&&!src.hot&&!src.cold;
 if(noMethod){showToast(' 請至少選一個配方方法','err');return;}
 wResult=Object.assign(runWorkshop(wBday,wMbti,src),{isAI:false});
 showConfetti();showToast(' 你的幸運號碼出爐！','ok');render();
}

async function doWorkshopAI(){
 var prov=localStorage.getItem('ms_ai_provider')||'anthropic';
 var key=localStorage.getItem('ms_key_'+prov)||localStorage.getItem('ms_key')||'';
 if(!key){showToast('請先在⚙設定 '+prov+' API Key','err');return;}
 wAiLoading=true;render();
 var recent=hist.slice(0,10).map(function(h){return h.draw+': '+h.numbers.join(',')+' 特'+h.extra;}).join('\n');
 var prompt='你是六合彩分析師。近10期開獎:\n'+recent+'\n\n請推薦6個正碼(1-49)和1個特別號，用JSON格式回覆，只返回JSON不要其他文字：{"numbers":[n1,n2,n3,n4,n5,n6],"extra":n7,"reason":"分析理由50字內"}';
 try{
 var result=null;
 if(prov==='anthropic'){
 var r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json','x-api-key':key,'anthropic-version':'2023-06-01'},body:JSON.stringify({model:'claude-haiku-4-5-20251001',max_tokens:300,messages:[{role:'user',content:prompt}]})});
 var d=await r.json();
 result=d.content&&d.content[0]?d.content[0].text:'';
 } else if(prov==='deepseek'){
 var r=await fetch('https://api.deepseek.com/chat/completions',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+key},body:JSON.stringify({model:'deepseek-chat',max_tokens:300,messages:[{role:'user',content:prompt}]})});
 var d=await r.json();
 result=d.choices&&d.choices[0]?d.choices[0].message.content:'';
 } else if(prov==='grok'){
 var r=await fetch('https://api.x.ai/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+key},body:JSON.stringify({model:'grok-3-mini',max_tokens:300,messages:[{role:'user',content:prompt}]})});
 var d=await r.json();
 result=d.choices&&d.choices[0]?d.choices[0].message.content:'';
 }
 if(!result) throw new Error('無回應');
 var clean=result.replace(/```json|```/g,'').trim();
 var parsed=JSON.parse(clean);
 var nums=parsed.numbers.filter(function(n){return n>=1&&n<=49;}).slice(0,6);
 var extra=parsed.extra;
 if(nums.length===6&&extra>=1&&extra<=49){
 wResult={nums:nums.sort(function(a,b){return a-b;}),extra:extra,aiReason:parsed.reason||'',isAI:true,details:[]};
 showConfetti();showToast(' AI推薦出爐！','ok');
 } else throw new Error('號碼格式錯誤');
 }catch(e){showToast(' AI失敗: '+e.message,'err');}
 wAiLoading=false;render();
}

function renderHeatmap(){
 var cnt={};for(var i=1;i<=49;i++)cnt[i]=0;
 for(var i=0;i<hist.length;i++){
 var h=hist[i];
 if(heatMode!=='extra') for(var j=0;j<h.numbers.length;j++) cnt[h.numbers[j]]++;
 if(heatMode!=='main') cnt[h.extra]++;
 }
 var mx=0;for(var n=1;n<=49;n++) if(cnt[n]>mx) mx=cnt[n];
 var out='<div class="card accent-top" style="border-top-color:#e53935">';
 out+='<div style="font-size:15px;font-weight:900;color:#e53935;margin-bottom:4px">號碼熱力圖</div>';
 out+='<div style="font-size:11px;color:var(--sub);margin-bottom:12px">顏色越深 = 出現越頻繁（'+hist.length+' 期數據）</div>';
 out+='<div class="chips">';
 var hmodes=[['all','全部'],['main','正碼'],['extra','特別號']];
 for(var i=0;i<hmodes.length;i++) out+='<button class="pill '+(heatMode===hmodes[i][0]?'active':'')+'" onclick="heatMode=\''+hmodes[i][0]+'\';render()">'+hmodes[i][1]+'</button>';
 out+='</div><div class="heat-grid">';
 for(var n=1;n<=49;n++){
 var c=cnt[n],intensity=mx>0?c/mx:0,zc=ZC[gz(n)];
 var alpha=Math.round(intensity*180+20).toString(16).padStart(2,'0');
 out+='<div class="heat-cell" style="background:'+zc+alpha+';border-color:'+zc+'88;box-shadow:'+(intensity>.8?'0 0 16px '+zc+',0 0 8px '+zc+'aa':intensity>.5?'0 0 8px '+zc+'66':'none')+';transform:'+(intensity>.8?'scale(1.08)':intensity>.6?'scale(1.03)':'scale(1)')+'" onclick="togglePick('+n+')">';
 out+='<div class="hn" style="color:'+(intensity>.5?'#fff':'var(--text)')+'">'+n+'</div>';
 out+='<div class="hc" style="color:'+(intensity>.5?'rgba(255,255,255,.7)':'var(--dim)')+'">'+c+'次</div></div>';
 }
 out+='</div></div>';
 var ZLn={r:' 紅1–10',b:' 藍11–20',g:' 綠21–30',o:' 橙31–40',p:' 紫41–49'};
 out+='<div class="card"><div style="font-size:12px;font-weight:700;margin-bottom:8px">色彩區域</div><div style="display:flex;gap:8px;flex-wrap:wrap">';
 var zones=['r','b','g','o','p'];
 for(var i=0;i<zones.length;i++){var z=zones[i];out+='<div style="display:flex;align-items:center;gap:5px;padding:5px 10px;border-radius:20px;background:'+ZC[z]+'22;border:1px solid '+ZC[z]+'44"><span style="font-size:11px">'+ZLn[z]+'</span></div>';}
 out+='</div></div>';
 
 // 廣告位
 out+='<div class="ad-slot" style="margin:10px 0;min-height:60px;background:var(--row);border:1px dashed var(--border);border-radius:10px;display:flex;align-items:center;justify-content:center">';
 out+='<span style="font-size:10px;color:var(--dim)">廣告位</span>';
 out+='</div>';
 return out;
}

// ═══ ALARM ═══

function renderFortune(){
 var out='';
 if(!userProfile||!userProfile.date){
 out+='<div class="card" style="text-align:center;padding:30px">';
 out+='<div style="font-size:48px;margin-bottom:12px"></div>';
 out+='<div style="font-size:16px;font-weight:900;color:var(--accent);margin-bottom:8px">輸入生日開啟運程</div>';
 out+='<div style="font-size:12px;color:var(--sub);margin-bottom:16px">完整紫微斗數命盤 · 十二宮位 · 四化星 · 大限流年 · 韓國四柱</div>';
 out+='<button class="btn btn-primary" onclick="editProfile()">輸入出生資料</button></div>';
 return out;
 }
 function isGen(a,b){var g={木:'火',火:'土',土:'金',金:'水',水:'木'};return g[a]===b;}
 function isCon(a,b){var c={木:'土',土:'水',水:'火',火:'金',金:'木'};return c[a]===b;}
 var f=getDailyFortune(userProfile);
 if(!f)return '<div class="card" style="text-align:center;padding:20px">⏳ 命盤計算中...</div>';
 var bdate=new Date(userProfile.date);
 var by=bdate.getFullYear(),bm=bdate.getMonth()+1,bd=bdate.getDate();
 var today=new Date();
 var scoreColor=f.score>=80?'var(--accent)':f.score>=60?'var(--gold)':'#cc0000';

 // ══ 1. 今日運勢總覽 ══
 out+='<div class="card accent-top" style="text-align:center;margin-bottom:10px">';
 out+='<div style="font-size:11px;color:var(--sub);margin-bottom:4px">'+today.getFullYear()+'年'+(today.getMonth()+1)+'月'+today.getDate()+'日 · '+(f.todayDayPillar||f.stem+f.branch)+'日</div>';
 out+='<div style="font-size:36px;margin-bottom:4px">'+f.emoji+'</div>';
 out+='<div style="font-size:22px;font-weight:900;color:var(--accent);margin-bottom:4px">'+f.title+'</div>';
 out+='<div style="font-size:11px;color:var(--sub);margin-bottom:14px">'+f.subtitle+'</div>';
 out+='<div style="background:var(--row);border-radius:20px;height:12px;margin-bottom:6px;overflow:hidden"><div style="height:100%;width:'+f.score+'%;background:linear-gradient(90deg,'+scoreColor+','+scoreColor+'99);border-radius:20px"></div></div>';
 out+='<div style="font-size:13px;font-weight:800;color:'+scoreColor+'">今日綜合運勢 '+f.score+'/100</div>';
 out+='<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:14px">';
 var subScores=[
 {k:'財運',e:'',s:Math.min(99,Math.max(30,f.score+Math.round(Math.sin((by*bm+today.getDate())*0.7)*12)))},
 {k:'感情',e:'',s:Math.min(99,Math.max(30,f.score+Math.round(Math.cos((bm*bd+today.getMonth())*0.9)*10)))},
 {k:'事業',e:'',s:Math.min(99,Math.max(30,f.score+Math.round(Math.sin((by+bd)*0.5)*8)))},
 {k:'健康',e:'',s:Math.min(99,Math.max(30,f.score+Math.round(Math.cos(bd*0.6)*6)))}
 ];
 subScores.forEach(function(ss){
 var c2=ss.s>=75?'var(--accent)':ss.s>=55?'var(--gold)':'#cc0000';
 out+='<div style="background:var(--row);border-radius:10px;padding:8px"><div style="font-size:14px">'+ss.e+'</div><div style="font-size:10px;color:var(--sub);margin:2px 0">'+ss.k+'</div><div style="font-size:13px;font-weight:900;color:'+c2+'">'+ss.s+'</div></div>';
 });
 out+='</div></div>';

 // ══ 2. 紫微斗數命盤 ══
 out+='<div class="card" style="margin-bottom:10px">';
 out+='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">';
 out+='<div><div style="font-size:14px;font-weight:900;color:var(--accent)">紫微斗數命盤</div>';
 out+='<div style="font-size:10px;color:var(--dim)">依《紫微斗數全書》十四主星排盤</div></div>';
 out+='<div style="text-align:right"><div style="font-size:11px;font-weight:700;color:var(--accent)">'+(f.fiveClass||'')+'</div><div style="font-size:10px;color:var(--sub)">五行局</div></div></div>';
 out+='<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:14px">';
 [{label:'命宮主星',val:f.soulStar||'無正曜',h:true},{label:'身宮主星',val:f.bodyStar||'--'},{label:'生肖',val:f.zodiac}].forEach(function(ki){
 out+='<div style="background:'+(ki.h?'var(--accent-bg)':'var(--row)')+';border-radius:10px;padding:10px;text-align:center;'+(ki.h?'border:1.5px solid var(--accent)':'')+'">';
 out+='<div style="font-size:9px;color:var(--sub);margin-bottom:3px">'+ki.label+'</div>';
 out+='<div style="font-size:15px;font-weight:900;color:'+(ki.h?'var(--accent)':'var(--text)')+'">'+ki.val+'</div></div>';
 });
 out+='</div>';

 // 12-palace grid
 out+='<div style="font-size:11px;font-weight:700;color:var(--sub);margin-bottom:8px">十二宮位</div>';
 var palaceOrder=['命宮','父母宮','福德宮','田宅宮','官祿宮','交友宮','遷移宮','疾厄宮','財帛宮','子女宮','夫妻宮','兄弟宮'];
 var palaceEmoji={'命宮':'','父母宮':'‍‍','福德宮':'古','田宅宮':'','官祿宮':'','交友宮':'','遷移宮':'','疾厄宮':'','財帛宮':'','子女宮':'','夫妻宮':'','兄弟宮':''};
 var palaceDesc={'命宮':'個性格局','父母宮':'家庭背景','福德宮':'內心世界','田宅宮':'不動產','官祿宮':'事業','交友宮':'人際','遷移宮':'出外','疾厄宮':'健康','財帛宮':'財運','子女宮':'子嗣','夫妻宮':'感情','兄弟宮':'手足'};
 var palaces=f.ab?f.ab.palaces||[]:[];
 // iztro returns simplified Chinese names without 宮 suffix
 // Map all variants to Traditional Chinese with 宮 suffix
 var simp2trad={
 '命宫':'命宮','兄弟':'兄弟宮','夫妻':'夫妻宮','子女':'子女宮',
 '财帛':'財帛宮','疾厄':'疾厄宮','迁移':'遷移宮','仆役':'交友宮',
 '官禄':'官祿宮','田宅':'田宅宮','福德':'福德宮','父母':'父母宮',
 // Already have 宮 suffix variants
 '命宮':'命宮','兄弟宮':'兄弟宮','夫妻宮':'夫妻宮','子女宮':'子女宮',
 '財帛宮':'財帛宮','疾厄宮':'疾厄宮','遷移宮':'遷移宮','交友宮':'交友宮',
 '官祿宮':'官祿宮','田宅宮':'田宅宮','福德宮':'福德宮','父母宮':'父母宮'
 };
 var palaceMap={};
 palaces.forEach(function(p){
 var trad=simp2trad[p.name]||p.name;
 palaceMap[trad]=p;
 });
 out+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:12px">';
 palaceOrder.forEach(function(pname){
 var p=palaceMap[pname]||null;
 var isLife=pname==='命宮';
 var _mStars=p?(p.majorStars||p.stars||[]):[];
 var _nStars=p?(p.minorStars||p.auxStars||[]):[];
 var _muMap={'化禄':'化祿','化权':'化權','化科':'化科','化忌':'化忌'};
 var majorStars=_mStars.map(function(s){
 var mg=s.mutagen||s.mutationSign||'';
 mg=_muMap[mg]||mg;
 return s.name+(mg?'·'+mg:'');
 }).join(' ');
 var minorStars=_nStars.slice(0,2).map(function(s){return s.name;}).join(' ');
 out+='<div style="background:'+(isLife?'var(--accent-bg)':'var(--row)')+';border-radius:10px;padding:8px;border:'+(isLife?'2px solid var(--accent)':'none')+'">';
 out+='<div style="display:flex;justify-content:space-between;margin-bottom:2px">';
 out+='<span style="font-size:10px;font-weight:700;color:'+(isLife?'var(--accent)':'var(--sub)')+'">'+palaceEmoji[pname]+' '+pname+'</span>';
 out+='<span style="font-size:9px;color:var(--dim)">'+palaceDesc[pname]+'</span></div>';
 out+='<div style="font-size:12px;font-weight:700;color:'+(isLife?'var(--accent)':'var(--text)')+'">'+( majorStars||'空宮')+'</div>';
 if(minorStars)out+='<div style="font-size:9px;color:var(--dim)">'+minorStars+'</div>';
 out+='</div>';
 });
 out+='</div>';

 // 四化星
 try{
 var muts=f.ab&&(f.ab.transformations||f.ab.mutagens)||[];
 if(muts&&muts.length){
 out+='<div style="font-size:11px;font-weight:700;color:var(--sub);margin-bottom:6px">四化星</div>';
 out+='<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">';
 var tn={化祿:'祿',化權:'權',化科:'科',化忌:'忌'};
 muts.forEach(function(t){out+='<div style="background:var(--row);border-radius:8px;padding:5px 10px;font-size:11px">'+(tn[t.type]||t.type)+' '+t.star+'→'+(t.palace||'')+'</div>';});
 out+='</div>';
 }
 }catch(e){}

 // 大限
 try{
 var decs=f.ab&&(f.ab.decadal||f.ab.decades)||[];
 var age=today.getFullYear()-by;
 var curDec=decs.find?decs.find(function(d){return d.range&&age>=d.range[0]&&age<=d.range[1];}):null;
 if(curDec){
 out+='<div style="background:var(--accent-bg);border-radius:10px;padding:10px;margin-bottom:10px">';
 out+='<div style="font-size:10px;font-weight:700;color:var(--accent);margin-bottom:4px">大限（'+curDec.range[0]+'~'+curDec.range[1]+'歲）</div>';
 out+='<div style="font-size:13px;font-weight:700;color:var(--text)">'+(curDec.palaceName||'')+'</div>';
 if(curDec.majorStars)out+='<div style="font-size:11px;color:var(--sub)">'+curDec.majorStars.map(function(s){return s.name;}).join(' ')+'</div>';
 out+='</div>';
 }
 }catch(e){}

 // 流運
 if(f.horoscope){
 out+='<div style="background:rgba(252,228,236,0.5);border-radius:10px;padding:10px;margin-bottom:8px">';
 out+='<div style="font-size:10px;font-weight:700;color:var(--accent);margin-bottom:6px">今日流運宮位</div>';
 out+='<div style="display:flex;gap:8px;flex-wrap:wrap">';
 [{l:'流年',d:f.horoscope.yearly},{l:'流月',d:f.horoscope.monthly},{l:'流日',d:f.horoscope.daily}].forEach(function(fi){
 if(fi.d&&fi.d.palaceName)out+='<div style="background:white;border-radius:8px;padding:5px 10px;font-size:11px"><span style="color:var(--dim)">'+fi.l+'</span><span style="font-weight:700;color:var(--accent)">'+fi.d.palaceName+'</span></div>';
 });
 out+='</div></div>';
 }

 // 命宮主星解讀
 var SR={'紫微':{c:'帝王星',t:'天生領袖，氣宇軒昂',w:'財運厚重，宜從政商',td:'今日貴人運強，宜主動出擊',warn:'避免過度自我'},
 '天機':{c:'智謀星',t:'聰慧機敏，善謀策',w:'宜智識型工作',td:'思維敏銳，宜策劃新計畫',warn:'付諸行動勿空想'},
 '太陽':{c:'光明星',t:'光明磊落，慷慨大方',w:'正財旺盛',td:'人際運旺，宜公開場合',warn:'注意休息'},
 '武曲':{c:'財星',t:'剛毅果斷，理財強',w:'正財偏財兼旺',td:'宜處理財務投資',warn:'勿過於剛硬'},
 '天同':{c:'福星',t:'溫和善良，福緣深厚',w:'食祿豐厚',td:'福德充盈，萬事順遂',warn:'勿過於懶散'},
 '廉貞':{c:'才藝星',t:'才華橫溢，個性鮮明',w:'宜技藝專業',td:'創意靈感豐富',warn:'避免情緒化'},
 '天府':{c:'庫府星',t:'穩重厚實，富貴雙全',w:'田宅財運俱佳',td:'宜穩健行事，財庫充盈',warn:'勿因保守錯失'},
 '太陰':{c:'田宅星',t:'心思細膩，文藝氣質',w:'田宅運旺',td:'桃花運動，感情佳音',warn:'勿過於敏感'},
 '貪狼':{c:'桃花星',t:'多才多藝，魅力四射',w:'偏財運強',td:'桃花偏財並旺，宜社交',warn:'避免過度享樂'},
 '巨門':{c:'是非星',t:'口才卓絕，思維深邃',w:'宜口才職業',td:'宜謹言慎行，以和為貴',warn:'勿惹口舌是非'},
 '天相':{c:'印綬星',t:'正直厚道，貴人相助',w:'宜輔佐工作',td:'貴人相助，事業有進展',warn:'勿依賴他人'},
 '天梁':{c:'蔭星',t:'清高孤傲，悲天憫人',w:'宜公益醫療法律',td:'長輩貴人相助',warn:'避免孤高自賞'},
 '七殺':{c:'將星',t:'魄力超群，開拓性強',w:'宜武職軍警創業',td:'宜積極衝刺，勿畏縮',warn:'避免衝動莽撞'},
 '破軍':{c:'開拓星',t:'衝勁十足，善於突破',w:'宜開創新事業',td:'破舊立新，宜出行拓展',warn:'勿破壞既有關係'}};
 var sr=f.soulStar&&SR[f.soulStar];
 if(sr){
 out+='<div style="border-top:1px solid var(--border);padding-top:10px;margin-top:4px">';
 out+='<div style="background:var(--accent);color:white;border-radius:8px;padding:5px 12px;font-size:12px;font-weight:700;display:inline-block;margin-bottom:8px">'+f.soulStar+' · '+sr.c+'</div>';
 out+='<div style="font-size:11px;color:var(--sub);line-height:2">';
 out+=' <b>性格：</b>'+sr.t+'<br/><b>財富：</b>'+sr.w+'<br/>';
 out+='<span style="color:var(--accent)"><b>今日：</b></span>'+sr.td+'<br/>';
 out+='<span style="color:#c62828">⚠ <b>注意：</b></span>'+sr.warn;
 out+='</div></div>';
 }
 out+='</div>';

 // ══ 3. 四柱八字（直接來自 iztro）══
 out+='<div class="card" style="margin-bottom:10px">';
 out+='<div style="font-size:13px;font-weight:900;color:var(--accent);margin-bottom:2px">出生四柱八字</div>';
 out+='<div style="font-size:10px;color:var(--dim);margin-bottom:12px">《三命通會》· iztro 精準排盤 · 節氣正確</div>';

 var dmDesc={甲:'甲木·棟樑之才，剛直不阿',乙:'乙木·柔韌之材，適應力強',丙:'丙火·太陽之火，光明熱情',丁:'丁火·燭光之火，溫柔細膩',
 戊:'戊土·大地厚土，穩重可靠',己:'己土·田園之土，溫和務實',庚:'庚金·斧刃之金，果斷剛毅',辛:'辛金·珠玉之金，精緻聰慧',壬:'壬水·大海之水，智慧廣博',癸:'癸水·雨露之水，滋潤細心'};
 var elemDesc={木:'木命',火:'火命',土:'土命',金:'金命',水:'水命'};

 // Parse each pillar: e.g. "乙丑" ->stem=乙, branch=丑, element=木
 function parsePillar(p){
 if(!p||p.length<2)return{s:'?',b:'?',e:'?'};
 var s=p[0],b=p[1];
 var stems2=['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
 var elem2=['木','木','火','火','土','土','金','金','水','水'];
 var si=stems2.indexOf(s);
 return{s:s,b:b,e:si>=0?elem2[si]:'?'};
 }

 var yp=parsePillar(f.birthYearPillar);
 var mp=parsePillar(f.birthMonthPillar);
 var dp=parsePillar(f.birthDayPillar);
 var hp=parsePillar(f.birthHourPillar);
 var isHourKnown=userProfile.time&&userProfile.time.length>0;
 var bCols=[
 {lb:'年柱',s:yp.s,b:yp.b,e:yp.e,sub:f.zodiac},
 {lb:'月柱',s:mp.s,b:mp.b,e:mp.e,sub:bm+'月'},
 {lb:'日柱',s:dp.s,b:dp.b,e:dp.e,sub:'出生日'},
 {lb:'時柱',s:isHourKnown?hp.s:'?',b:isHourKnown?hp.b:'?',e:isHourKnown?hp.e:'?',sub:isHourKnown?(userProfile.time+'時'):'未知時辰'}
 ];
 out+='<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:10px">';
 bCols.forEach(function(c){
 out+='<div style="background:var(--row);border-radius:10px;padding:10px;text-align:center">';
 out+='<div style="font-size:9px;color:var(--sub);margin-bottom:2px">'+c.lb+'</div>';
 out+='<div style="font-size:20px;font-weight:900;color:var(--accent)">'+c.s+'</div>';
 out+='<div style="font-size:16px;font-weight:700;color:var(--text)">'+c.b+'</div>';
 out+='<div style="font-size:9px;color:var(--dim)">'+c.e+'</div>';
 out+='<div style="font-size:8px;color:var(--dim)">'+c.sub+'</div></div>';
 });
 out+='</div>';
 out+='<div style="font-size:10px;color:var(--dim);text-align:center;margin-bottom:10px">'+( f.birthChineseDate?'八字：'+f.birthChineseDate:'')+'</div>';

 // Day master = birth day pillar stem
 out+='<div style="background:var(--accent-bg);border-radius:10px;padding:10px;margin-bottom:10px">';
 out+='<div style="font-size:10px;font-weight:700;color:var(--accent);margin-bottom:3px">⚡ 日主（命主天干）：'+dp.s+'（'+dp.e+'）</div>';
 out+='<div style="font-size:11px;color:var(--sub)">'+(dmDesc[dp.s]||dp.s+'日主')+'</div></div>';

 // Today's pillars separately
 out+='<div style="border-top:1px solid var(--border);padding-top:10px;margin-top:4px">';
 out+='<div style="font-size:11px;font-weight:700;color:var(--sub);margin-bottom:8px">今日干支（'+today.getFullYear()+'年'+(today.getMonth()+1)+'月'+today.getDate()+'日）</div>';
 var tp2=parsePillar(f.todayDayPillar);
 out+='<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px">';
 [{lb:'今年',p:parsePillar(f.todayYearPillar)},{lb:'今月',p:parsePillar(f.todayMonthPillar)},{lb:'今日',p:tp2,hi:true}].forEach(function(c){
 out+='<div style="background:'+(c.hi?'var(--accent-bg)':'var(--row)')+';border-radius:10px;padding:8px;text-align:center;'+(c.hi?'border:1.5px solid var(--accent)':'')+'">';
 out+='<div style="font-size:9px;color:var(--sub)">'+c.lb+'</div>';
 out+='<div style="font-size:18px;font-weight:900;color:'+(c.hi?'var(--accent)':'var(--text)')+'">'+c.p.s+'</div>';
 out+='<div style="font-size:14px;font-weight:700;color:var(--text)">'+c.p.b+'</div>';
 out+='<div style="font-size:9px;color:var(--dim)">'+c.p.e+'</div></div>';
 });
 out+='</div>';
 if(!isHourKnown)out+='<div style="font-size:10px;color:var(--dim);margin-top:8px;text-align:center">輸入出生時間可顯示時柱，令排盤更精準</div>';
 out+='</div></div>';

 // ══ 4. 五行分析 ══
 out+='<div class="card" style="margin-bottom:10px">';
 out+='<div style="font-size:13px;font-weight:900;color:var(--accent);margin-bottom:2px">五行分析</div>';
 out+='<div style="font-size:10px;color:var(--dim);margin-bottom:12px">《滴天髓》五行生剋制化</div>';
 var elemEmoji={木:'',火:'',土:'',金:'⚙',水:''};
 var rel=isGen(f.birthElement,f.todayElement)?'相生 ':isCon(f.birthElement,f.todayElement)?'相剋 ⚠':isGen(f.todayElement,f.birthElement)?'被生 ':isCon(f.todayElement,f.birthElement)?'被剋 ':'比和 ☯';
 var relText=isGen(f.birthElement,f.todayElement)?'命元生今日：才能施展，財祿自來，宜積極行動':
 isCon(f.birthElement,f.todayElement)?'命元剋今日：耗費精神，宜守成待機':
 isGen(f.todayElement,f.birthElement)?'今日生命元：天降貴人，事業順遂':
 isCon(f.todayElement,f.birthElement)?'今日剋命元：阻力較多，宜低調應對':'比和之日：五行平衡，穩步前行';
 out+='<div style="display:flex;align-items:center;justify-content:center;gap:20px;margin-bottom:12px">';
 out+='<div style="text-align:center"><div style="font-size:32px">'+elemEmoji[f.birthElement]+'</div><div style="font-size:12px;font-weight:700;color:var(--accent)">'+f.birthElement+'命</div></div>';
 out+='<div style="text-align:center"><div style="font-size:20px;font-weight:900;color:var(--sub)">'+rel+'</div><div style="font-size:9px;color:var(--dim)">命元對今日</div></div>';
 out+='<div style="text-align:center"><div style="font-size:32px">'+elemEmoji[f.todayElement]+'</div><div style="font-size:12px;font-weight:700;color:var(--sub)">'+f.todayElement+'（今日）</div></div></div>';
 out+='<div style="background:var(--row);border-radius:10px;padding:10px;font-size:11px;color:var(--sub);line-height:1.9">'+relText+'</div></div>';

 // ══ 5. 韓國四柱 ══
 out+='<div class="card" style="margin-bottom:10px">';
 out+='<div style="font-size:13px;font-weight:900;color:var(--accent);margin-bottom:2px">韓國四柱 사주팔자</div>';
 out+='<div style="font-size:10px;color:var(--dim);margin-bottom:12px">韓國命理傳統 · 六運程分析</div>';
 var sB=Math.min(95,Math.max(35,Math.round((f.score+65)/2)));
 var sajuA=[
 {l:'財運 재물운',e:'',s:Math.min(98,Math.max(30,sB+Math.round(Math.sin((by+today.getMonth()+1)*0.9)*15))),d:'偏財正財兼論'},
 {l:'感情 애정운',e:'',s:Math.min(98,Math.max(30,sB+Math.round(Math.cos((bm+today.getDate())*1.1)*12))),d:'桃花緣份婚姻'},
 {l:'健康 건강운',e:'',s:Math.min(98,Math.max(30,sB+Math.round(Math.sin(bd*0.7)*8))),d:'氣血狀況疾厄'},
 {l:'事業 직업운',e:'',s:Math.min(98,Math.max(30,sB+Math.round(Math.cos((by+bm)*0.5)*10))),d:'官祿事業宮'},
 {l:'家庭 가정운',e:'',s:Math.min(98,Math.max(30,sB+Math.round(Math.sin((by*bd)*0.003)*9))),d:'田宅家庭和諧'},
 {l:'貴人 귀인운',e:'',s:Math.min(98,Math.max(30,sB+Math.round(Math.cos((bm*by)*0.001)*11))),d:'交友貴人助力'}
 ];
 out+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">';
 sajuA.forEach(function(a){
 var c=a.s>=75?'var(--accent)':a.s>=55?'var(--gold)':'#cc0000';
 out+='<div style="background:var(--row);border-radius:10px;padding:10px">';
 out+='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">';
 out+='<span style="font-size:11px">'+a.e+' <b>'+a.l+'</b></span><span style="font-size:14px;font-weight:900;color:'+c+'">'+a.s+'</span></div>';
 out+='<div style="background:var(--border);border-radius:10px;height:6px;overflow:hidden;margin-bottom:4px"><div style="width:'+a.s+'%;height:100%;background:'+c+';border-radius:10px"></div></div>';
 out+='<div style="font-size:9px;color:var(--dim)">'+a.d+'</div></div>';
 });
 out+='</div></div>';

 // ══ 5b. 天時地利人和 ══
 var lucky7=calcLucky7Days();
 if(lucky7&&lucky7.length>0){
 var curMood=parseInt(localStorage.getItem('ms_mood')||'70');
 var moodColor=curMood>=75?'var(--accent)':curMood>=55?'var(--gold)':'#cc0000';
 out+='<div class="card" style="margin-bottom:10px">';
 out+='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">';
 out+='<div><div style="font-size:14px;font-weight:900;color:var(--accent)">未來七日吉日推算</div>';
 out+='<div style="font-size:10px;color:var(--dim)">天時（干支）+ 人和（心情）推算 Top 3</div></div>';
 out+='<div style="text-align:right"><div style="font-size:20px;font-weight:900;color:'+moodColor+'">'+curMood+'</div>';
 out+='<div style="font-size:9px;color:var(--dim)">人和分</div></div></div>';
 var medals7=['[一]','[二]','[三]'];
 lucky7.slice(0,3).forEach(function(day,i){
 var sc=day.total,scC=sc>=80?'var(--accent)':sc>=60?'var(--gold)':'#cc0000';
 out+='<div style="background:'+(i===0?'var(--accent-bg)':'var(--row)')+';border-radius:12px;padding:12px;margin-bottom:8px;border:'+(i===0?'1.5px solid var(--accent)':'none')+'">';
 out+='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">';
 out+='<div style="font-size:14px;font-weight:900">'+medals7[i]+' '+day.dateStr+' <span style="font-size:11px;color:var(--sub)">'+day.ganzhi+'</span></div>';
 out+='<div style="font-size:20px;font-weight:900;color:'+scC+'">'+sc+'分</div></div>';
 out+='<div style="display:flex;gap:6px;margin-bottom:6px;flex-wrap:wrap">';
 out+='<span style="background:rgba(255,105,144,0.15);color:var(--accent);border-radius:6px;padding:2px 8px;font-size:10px">天時 '+day.tianshi+'</span>';
 out+='<span style="background:rgba(0,150,136,0.1);color:#00796b;border-radius:6px;padding:2px 8px;font-size:10px">人和 '+day.renhe+'</span>';
 out+='<span style="background:rgba(255,152,0,0.1);color:var(--gold2);border-radius:6px;padding:2px 8px;font-size:10px">'+(day.isDrawDay?'開獎日':'非攪珠日')+'</span>';
 out+='</div>';
 out+='<div style="font-size:11px;color:var(--sub)">'+day.advice+'</div>';
 out+='</div>';
 });
 out+='<button class="btn btn-primary btn-full" style="margin-top:6px" onclick="showMoodCheck()">更新人和指數</button>';
 out+='<div style="font-size:10px;color:var(--dim);text-align:center;margin-top:4px">人和指數影響吉日排名</div>';
 out+='</div>';
 }

 // ══ 6. 幸運號碼 ══
 out+='<div class="card" style="margin-bottom:10px">';
 out+='<div style="font-size:13px;font-weight:900;color:var(--accent);margin-bottom:4px">今日幸運號碼</div>';
 out+='<div style="font-size:10px;color:var(--dim);margin-bottom:10px">命元五行（'+f.birthElement+'）× 今日天干（'+f.stem+'）× 命宮主星推算</div>';
 out+='<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px">';
 f.luckyNums.forEach(function(n){out+=ball(n,40);});
 out+='</div></div>';

 out+='<div style="text-align:center;margin-bottom:16px"><button onclick="editProfile()" style="font-size:11px;color:var(--dim);background:none;border:1px solid var(--border);border-radius:20px;padding:7px 16px;cursor:pointer">修改出生資料</button></div>';
 out+='<div class="ad-slot" style="margin:10px 0;min-height:60px;background:var(--row);border:1px dashed var(--border);border-radius:10px;display:flex;align-items:center;justify-content:center"><span style="font-size:10px;color:var(--dim)">廣告位</span></div>';
 return out;
}

function renderAlarm(){
 var PRESETS=[{l:'$800萬（每次必提醒）',v:8e6},{l:'$3千萬',v:3e7},{l:'$5千萬',v:5e7},{l:'$1億',v:1e8},{l:'$1.5億',v:1.5e8},{l:'$2億',v:2e8}];
 var nd=calcNextDraw();
 var out='';

 // ── 頭獎提醒說明 ──
 out+='<div class="card accent-top">';
 out+='<div style="font-size:15px;font-weight:900;color:var(--accent);margin-bottom:4px">頭獎門檻提醒</div>';
 out+='<div style="font-size:11px;color:var(--sub);line-height:1.8;margin-bottom:14px">';
 out+='設定門檻後按「一鍵設定提醒」，app 會為未來 <b>10 期攪珠</b>自動下載日曆提醒（.ics），加入日曆後手機會在攪珠前 <b>1 小時</b>彈出通知。';
 out+='<br/>iOS：下載後打開 .ics → 加入日曆<br/>Android：直接加入 Google 日曆</div>';

 // 門檻選擇
 out+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-bottom:12px">';
 for(var i=0;i<PRESETS.length;i++){
 var p=PRESETS[i],active=prizeThr===p.v;
 out+='<button onclick="prizeThr='+p.v+';prizeShown=false;render()" style="padding:10px 8px;border-radius:10px;border:1.5px solid '+(active?'var(--accent)':'var(--border)')+';background:'+(active?'var(--accent-bg)':'var(--card)')+';color:'+(active?'var(--accent)':'var(--sub)')+';font-size:11px;font-weight:600;cursor:pointer;text-align:left">'+(active?' ':'')+p.l+'</button>';
 }
 out+='</div>';
 out+='<div style="display:flex;gap:8px;margin-bottom:14px">';
 out+='<input type="text" id="prize-input" placeholder="自訂金額（如：60000000）" style="flex:1;margin-bottom:0"/>';
 out+='<button class="btn btn-ghost" onclick="setCustomPrizeThr()">設定</button>';
 out+='</div>';

 // 下期狀態
 out+='<div style="background:var(--accent-bg);border-radius:10px;padding:12px;margin-bottom:12px;text-align:center">';
 out+='<div style="font-size:10px;color:var(--sub);margin-bottom:4px">下期開獎 · '+nd.drawNum+' · '+nd.date+' 晚上 9:30</div>';
 out+='<div style="font-size:11px;color:var(--sub);letter-spacing:1px;margin-bottom:4px">預估頭獎</div>';
  out+='<div class="prize-display">$8,000,000+</div>';
 out+='<div style="font-size:10px;color:var(--dim);margin-top:4px">門檻設定：≥ '+fmtPrize(prizeThr)+'　'+(prizeOn?'<span style="color:#2e7d32;font-weight:700">提醒已啟用</span>':'<span style="color:var(--dim)">提醒未啟用</span>')+'</div>';
 out+='</div>';

 // 一鍵提醒按鈕
 out+='<button class="btn btn-primary btn-full" style="margin-bottom:6px;font-size:14px;padding:14px" onclick="addPrizeReminder()">';
 out+=prizeOn?'提醒已設定，重新下載':'下載日曆提醒檔案';
 out+='</button>';
 out+='<div style="font-size:10px;color:var(--dim);text-align:center;margin-bottom:4px">加入日曆後，每次攪珠前 1 小時手機自動彈出提示</div>';
 out+='</div>';

 // ── 吉日推算已移至運程 tab ──
 out+='<div class="card" style="text-align:center;margin-bottom:10px;padding:20px">';
 out+='<div style="font-size:28px;margin-bottom:8px"></div>';
 out+='<div style="font-size:13px;font-weight:900;color:var(--accent);margin-bottom:6px">未來7天購彩吉日推算</div>';
 out+='<div style="font-size:11px;color:var(--sub);margin-bottom:12px">天時（干支相合/沖）× 人和（心情測驗）<br>已移至運程 tab，連同完整命盤一起查看</div>';
 out+="<button class=\"btn btn-primary\" onclick=\"switchTab('fortune')\">前往運程 tab 查看吉日</button>";
 out+='</div>';

 // ── 如何運作 ──
 out+='<div class="card">';
 out+='<div style="font-size:13px;font-weight:800;margin-bottom:10px">如何運作</div>';
 out+='<div style="font-size:11px;color:var(--sub);line-height:2">';
 out+='一、 選擇頭獎門檻（預設 $800萬）<br/>';
 out+='二、 按「一鍵設定鬧鐘提醒」下載 .ics 檔案<br/>';
 out+='三、 打開下載檔案 → 點「加入日曆」<br/>';
 out+='四、 攪珠前 1 小時，手機自動彈出提示<br/>';
 out+='開獎時間：逢星期二、四、六 21:30';
 out+='</div></div>';

 out+='<div class="ad-slot" style="margin:10px 0;min-height:60px;background:var(--row);border:1px dashed var(--border);border-radius:10px;display:flex;align-items:center;justify-content:center"><span style="font-size:10px;color:var(--dim)">廣告位</span></div>';
 return out;
}

function addPrizeReminder(){
 prizeOn=true;render();
 var draws=[];
 var nd=calcNextDraw();
 var d=new Date(nd.date+'T21:30:00+08:00');
 var drawDays=[2,4,6];
 for(var i=0;i<10;i++){
 draws.push(new Date(d));
 d=new Date(d);d.setDate(d.getDate()+1);
 while(!drawDays.includes(d.getDay()))d.setDate(d.getDate()+1);
 }
 var lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Ma6rkFun//HK Lottery//TC','CALSCALE:GREGORIAN'];
 draws.forEach(function(dt,i){
 var pad=function(n){return('0'+n).slice(-2);};
 var dtStr=dt.getFullYear()+''+pad(dt.getMonth()+1)+''+pad(dt.getDate())+'T133000Z';
 var alarmStr=dt.getFullYear()+''+pad(dt.getMonth()+1)+''+pad(dt.getDate())+'T123000Z';
 lines.push('BEGIN:VEVENT');
 lines.push('DTSTART:'+dtStr);
 lines.push('DTEND:'+dtStr);
 lines.push('SUMMARY:六合彩今日開獎！記得買票');
 lines.push('DESCRIPTION:頭獎門檻 '+fmtPrize(prizeThr)+' · 今晚9:30攪珠');
 lines.push('BEGIN:VALARM');
 lines.push('TRIGGER:-PT60M');
 lines.push('ACTION:DISPLAY');
 lines.push('DESCRIPTION: 六合彩攪珠提醒！一小時後開獎，記得購票');
 lines.push('END:VALARM');
 lines.push('END:VEVENT');
 });
 lines.push('END:VCALENDAR');
 var blob=new Blob([lines.join('\r\n')],{type:'text/calendar'});
 var url=URL.createObjectURL(blob);
 var a=document.createElement('a');a.href=url;a.download='lottery-reminders.ics';
 document.body.appendChild(a);a.click();document.body.removeChild(a);
 URL.revokeObjectURL(url);
 showToast('日曆提醒已下載，打開 .ics 加入日曆','ok',4000);
}

function calcLucky7Days(){
 if(!userProfile||!userProfile.date)return[];
 var bdate=new Date(userProfile.date);
 var by=bdate.getFullYear(),bm=bdate.getMonth()+1,bd=bdate.getDate();
 var zodiac=getZodiac(by,bm,bd);
 var stems=['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
 var branches=['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
 var elements=['木','木','火','火','土','土','金','金','水','水'];
 var sixCombine={子:'丑',丑:'子',寅:'亥',亥:'寅',卯:'戌',戌:'卯',辰:'酉',酉:'辰',巳:'申',申:'巳',午:'未',未:'午'};
 var threeHarmony={子:['辰','申'],丑:['巳','酉'],寅:['午','戌'],卯:['亥','未'],辰:['子','申'],巳:['丑','酉'],午:['寅','戌'],未:['卯','亥'],申:['子','辰'],酉:['丑','巳'],戌:['午','寅'],亥:['卯','未']};
 var sixClash={子:'午',午:'子',丑:'未',未:'丑',寅:'申',申:'寅',卯:'酉',酉:'卯',辰:'戌',戌:'辰',巳:'亥',亥:'巳'};
 var zodiacBranch={'鼠':'子','牛':'丑','虎':'寅','兔':'卯','龍':'辰','蛇':'巳','馬':'午','羊':'未','猴':'申','雞':'酉','狗':'戌','豬':'亥'};
 var myBranch=zodiacBranch[zodiac]||'子';
 var birthElement=elements[(by-1900+200)%10];
 var elemScore={木:{木:65,火:85,土:50,金:40,水:90},火:{木:85,火:65,土:80,金:45,水:35},土:{木:45,火:80,土:65,金:85,水:45},金:{木:40,火:45,土:80,金:65,水:85},水:{木:90,火:35,土:45,金:80,水:65}};
 var moodScore=parseInt(localStorage.getItem('ms_mood')||'70');
 var results=[];
 var today=new Date();
 for(var i=1;i<=7;i++){
 var d=new Date(today);d.setDate(today.getDate()+i);
 var ds=Math.floor((d-new Date('1900-01-31'))/86400000);
 var dStem=stems[((ds%10)+10)%10];
 var dBranch=branches[((ds%12)+12)%12];
 var dElement=elements[((ds%10)+10)%10];
 var tianshi=50;
 if(sixCombine[myBranch]===dBranch)tianshi+=25;
 if(threeHarmony[myBranch]&&threeHarmony[myBranch].includes(dBranch))tianshi+=20;
 if(sixClash[myBranch]===dBranch)tianshi-=25;
 var eScore=(elemScore[birthElement]&&elemScore[birthElement][dElement])||65;
 tianshi+=Math.round((eScore-65)/3);
 tianshi=Math.min(99,Math.max(20,tianshi));
 var renhe=Math.min(99,Math.max(30,moodScore+Math.round(Math.sin(i*1.3)*8)));
 var dow=d.getDay();
 var isDrawDay=(dow===2||dow===4||dow===6);
 var seed=by+bm+bd+i;
 var total=Math.round(tianshi*0.5+renhe*0.35+(isDrawDay?12:0)+((seed%10)-5));
 total=Math.min(99,Math.max(25,total));
 var advices={h1:'天時人和俱佳，攪珠之日！今天購彩，天地支持！',h0:'干支大吉之日，心情最佳，可提前購彩準備！',m1:'攪珠日，運勢平穩，量力而為，可小試。',m0:'干支平穩，調整狀態，為下次攪珠做準備。',l1:'六沖之日，攪珠日不利，建議跳過此期。',l0:'運勢稍弱，靜待更佳時機。'};
 var ak=(total>=75?(isDrawDay?'h1':'h0'):total>=55?(isDrawDay?'m1':'m0'):(isDrawDay?'l1':'l0'));
 var mo=d.getMonth()+1,dy=d.getDate();
 var dowNames=['日','一','二','三','四','五','六'];
 results.push({date:d,dateStr:mo+'月'+dy+'日（星期'+dowNames[dow]+'）',ganzhi:dStem+dBranch,tianshi:tianshi,renhe:renhe,total:total,isDrawDay:isDrawDay,advice:advices[ak]});
 }
 results.sort(function(a,b){return b.total-a.total;});
 return results;
}

function showMoodCheck(){
 var questions=[
 {q:'今天睡眠如何？',opts:['極差','一般','良好','極佳'],scores:[20,50,75,95]},
 {q:'今天心情如何？',opts:['極差','一般','良好','極佳'],scores:[15,45,75,95]},
 {q:'今天有否遇到好事？',opts:['無','一般','有','頻繁'],scores:[20,50,75,95]},
 {q:'直覺感覺今天運氣如何？',opts:['極差','一般','良好','極佳'],scores:[10,40,75,99]}
 ];
 var qIdx=0,scores=[];
 function renderQ(){
 var q=questions[qIdx];
 var body='<div style="text-align:center;padding:4px">';
 body+='<div style="font-size:11px;color:var(--dim);margin-bottom:8px">問題 '+(qIdx+1)+' / '+questions.length+'</div>';
 body+='<div style="font-size:16px;font-weight:800;color:var(--text);margin-bottom:16px">'+q.q+'</div>';
 q.opts.forEach(function(opt,i){
 body+='<button onclick="window._moodAns('+i+')" style="display:block;width:100%;margin-bottom:8px;padding:12px;border-radius:12px;border:1.5px solid var(--border);background:var(--card);font-size:13px;cursor:pointer;text-align:left">'+opt+'</button>';
 });
 body+='</div>';
 document.getElementById('mood-body').innerHTML=body;
 }
 window._moodAns=function(i){
 scores.push(questions[qIdx].scores[i]);
 qIdx++;
 if(qIdx<questions.length){renderQ();}
 else{
 var avg=Math.round(scores.reduce(function(a,b){return a+b;},0)/scores.length);
 localStorage.setItem('ms_mood',avg);
 document.getElementById('mood-modal').style.display='none';
 showToast(' 心情分數：'+avg+'/100 · 吉日推算已更新！','ok',4000);
 render();
 }
 };
 var modal=document.getElementById('mood-modal');
 if(!modal){
 modal=document.createElement('div');
 modal.id='mood-modal';
 modal.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.75);z-index:99998;display:flex;align-items:center;justify-content:center;padding:16px';
 modal.innerHTML='<div style="background:var(--card);border-radius:20px;padding:20px;max-width:360px;width:100%"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><div style="font-size:15px;font-weight:900;color:var(--accent)">心情小測驗</div><button onclick="document.getElementById(\'mood-modal\').style.display=\'none\'" style="background:none;border:none;font-size:18px;cursor:pointer;color:var(--sub)"></button></div><div id="mood-body"></div></div>';
 document.body.appendChild(modal);
 }
 modal.style.display='flex';
 qIdx=0;scores=[];
 renderQ();
}

function setCustomPrizeThr(){var v=parseInt((document.getElementById('prize-input').value||'').replace(/,/g,''));if(!isNaN(v)&&v>0){prizeThr=v;prizeShown=false;render();}}
async function requestNotif(){if(typeof Notification==='undefined'){showToast('此瀏覽器不支援通知','err');return;}var p=await Notification.requestPermission();showToast(p==='granted'?' 通知已開啟':'請允許通知',p==='granted'?'ok':'err');render();}

// ═══ HISTORY ═══
function renderHistory(){
 var out='<div style="font-size:12px;color:var(--sub);margin-bottom:10px;font-weight:600">'+hist.length+' 期官方數據</div>';
 for(var i=0;i<hist.length;i++){
 var h=hist[i];
 out+='<div class="row-item" style="'+(i===0?'background:rgba(255,46,99,.05)':'')+'">';
 out+='<div style="min-width:62px"><div style="font-size:12px;color:var(--accent);font-weight:800">'+h.draw+'</div><div style="font-size:9px;color:var(--dim)">'+h.date+'</div></div>';
 out+='<div style="display:flex;align-items:center;gap:4px;margin-left:auto;flex-wrap:nowrap">';
 for(var j=0;j<h.numbers.length;j++) out+=ball(h.numbers[j],25);
 out+=ball(h.extra,25,true)+'</div></div>';
 }
 
 // 廣告位
 out+='<div class="ad-slot" style="margin:10px 0;min-height:60px;background:var(--row);border:1px dashed var(--border);border-radius:10px;display:flex;align-items:center;justify-content:center">';
 out+='<span style="font-size:10px;color:var(--dim)">廣告位</span>';
 out+='</div>';
 return out;
}

// ═══ STATS ═══
function renderStats(){
 var st=calcStats(),out='';
 out+='<div class="chips">';
 var smodes=[['hot',' 熱號'],['cold',' 冷號'],['zone',' 區域'],['gap','⏳ 遺漏']];
 for(var i=0;i<smodes.length;i++) out+='<button class="pill '+(sMode===smodes[i][0]?'active':'')+'" onclick="sMode=\''+smodes[i][0]+'\';render()">'+smodes[i][1]+'</button>';
 out+='</div>';
 if(sMode==='hot'){
 var top=st.sorted.slice(0,15);
 for(var i=0;i<top.length;i++){var n=+top[i][0],cnt=+top[i][1],c=ZC[gz(n)];out+='<div style="display:flex;align-items:center;gap:9px;margin-bottom:9px"><span style="color:var(--dim);font-size:11px;width:18px;text-align:right;font-weight:600">'+(i+1)+'</span>'+ball(n,34)+'<div class="bar-track"><div class="bar-fill" style="width:'+(cnt/st.mxF*100)+'%;background:'+c+'"></div></div><span style="color:'+c+';font-size:12px;font-weight:800;min-width:32px;text-align:right">'+cnt+'次</span></div>';}
 }
 if(sMode==='cold'){
 var cold=[].concat(st.sorted).reverse().slice(0,15);
 for(var i=0;i<cold.length;i++){var n=+cold[i][0],cnt=+cold[i][1],c=ZC[gz(n)];out+='<div style="display:flex;align-items:center;gap:9px;margin-bottom:9px"><span style="color:var(--dim);font-size:11px;width:18px;text-align:right;font-weight:600">'+(i+1)+'</span>'+ball(n,34,false,true)+'<div class="bar-track"><div class="bar-fill" style="width:'+(Math.max(5,cnt/st.mxF*100))+'%;background:var(--accent)"></div></div><span style="color:var(--accent);font-size:12px;font-weight:800;min-width:32px;text-align:right">'+cnt+'次</span></div>';}
 }
 if(sMode==='zone'){
 var zc2={r:0,b:0,g:0,o:0,p:0},ZLn={r:' 紅1–10',b:' 藍11–20',g:' 綠21–30',o:' 橙31–40',p:' 紫41–49'};
 for(var i=0;i<hist.length;i++){for(var j=0;j<hist[i].numbers.length;j++) zc2[gz(hist[i].numbers[j])]++;zc2[gz(hist[i].extra)]++;}
 var tot=0;for(var z in zc2) tot+=zc2[z];
 var zones=['r','b','g','o','p'];
 for(var i=0;i<zones.length;i++){var z=zones[i],c=ZC[z],pct=(zc2[z]/tot*100).toFixed(1);
 out+='<div class="card" style="padding:13px;margin-bottom:9px;border-left:4px solid '+c+'"><div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="color:'+c+';font-weight:800;font-size:13px">'+ZLn[z]+'</span><span style="color:'+c+';font-weight:800">'+zc2[z]+'次 ('+pct+'%)</span></div><div style="height:7px;background:var(--track);border-radius:4px;overflow:hidden;margin-bottom:10px"><div style="height:100%;width:'+pct+'%;background:'+c+';border-radius:4px"></div></div><div style="display:flex;align-items:center;gap:4px;flex-wrap:wrap">';
 for(var n=1;n<=49;n++) if(gz(n)===z) out+=ball(n,24);
 out+='</div></div>';
 }
 }
 if(sMode==='gap'){
 var gaps=[];for(var n in st.last) gaps.push({n:+n,idx:st.last[n]});
 gaps.sort(function(a,b){return b.idx-a.idx;});
 for(var i=0;i<Math.min(gaps.length,15);i++){var g=gaps[i],h2=hist[g.idx];out+='<div style="display:flex;align-items:center;gap:9px;margin-bottom:9px"><span style="color:var(--dim);font-size:11px;width:18px;text-align:right;font-weight:600">'+(i+1)+'</span>'+ball(g.n,34,false,true)+'<div style="flex:1"><div style="font-size:11px;color:var(--text);font-weight:600">'+(h2?h2.draw:'')+'</div><div style="font-size:9px;color:var(--dim)">'+(h2?h2.date:'')+'</div></div><span style="background:#100a28;color:var(--gold2);font-size:11px;font-weight:800;padding:3px 9px;border-radius:20px">缺'+g.idx+'期</span></div>';}
 }
 
 // 廣告位
 out+='<div class="ad-slot" style="margin:10px 0;min-height:60px;background:var(--row);border:1px dashed var(--border);border-radius:10px;display:flex;align-items:center;justify-content:center">';
 out+='<span style="font-size:10px;color:var(--dim)">廣告位</span>';
 out+='</div>';
 return out;
}

// ═══ CHECKER ═══
function renderChecker(){
 var l=hist[0];
 var out='<div class="card accent-top"><div style="font-size:13px;font-weight:800;color:var(--accent);margin-bottom:10px">對照 '+l.draw+' · '+l.date+'</div>';
 out+='<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:14px">'+ballsRow(l.numbers,l.extra,36)+'</div>';
 out+='<div style="font-size:11px;color:var(--sub);margin-bottom:10px">選擇號碼 <span style="color:var(--accent);font-weight:800">'+picked.length+'</span>/6</div>';
 out+=grid49(picked,'togglePick',picked.length>=6);
 out+='<div style="display:flex;gap:9px"><button class="btn btn-primary" style="flex:1" onclick="doCheck()">對獎！</button><button class="btn btn-ghost" onclick="picked=[];checkResult=null;render()">清除</button></div></div>';
 if(checkResult){
 out+='<div class="card" style="text-align:center;background:'+(checkResult.win?'#e8f5e9':'var(--card)')+'"><div style="font-size:26px;font-weight:900;color:'+(checkResult.win?'var(--accent)':'var(--sub)')+';margin-bottom:6px">'+checkResult.prize+'</div>';
 out+='<div style="font-size:12px;color:var(--sub);margin-bottom:10px">命中 '+checkResult.matched.length+' 個正碼'+(checkResult.xHit?' + 特別號 ':'')+'</div>';
 if(checkResult.matched.length>0||checkResult.xHit){out+='<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;justify-content:center">';for(var i=0;i<checkResult.matched.length;i++) out+=ball(checkResult.matched[i],38);if(checkResult.xHit) out+=ball(l.extra,38,true);out+='</div>';}
 out+='</div>';
 }
 
 // 廣告位
 out+='<div class="ad-slot" style="margin:10px 0;min-height:60px;background:var(--row);border:1px dashed var(--border);border-radius:10px;display:flex;align-items:center;justify-content:center">';
 out+='<span style="font-size:10px;color:var(--dim)">廣告位</span>';
 out+='</div>';
 return out;
}
function togglePick(n){if(picked.includes(n))picked=picked.filter(function(x){return x!==n;});else if(picked.length<6)picked.push(n);checkResult=null;render();}
function doCheck(){
 var l=hist[0];if(picked.length<6){showToast('請先選擇 6 個號碼','err');return;}
 var matched=picked.filter(function(n){return l.numbers.includes(n);}),xHit=picked.includes(l.extra);
 var prize=' 未中獎',win=false;
 if(matched.length===6){prize=' 一獎！！';win=true;}
 else if(matched.length===5&&xHit){prize='[二] 二獎！精準！';win=true;}
 else if(matched.length===5){prize='[三] 三獎！';win=true;}
 else if(matched.length===4&&xHit){prize=' 四獎！';win=true;}
 else if(matched.length===4){prize=' 五獎！';win=true;}
 else if(matched.length===3&&xHit){prize=' 六獎！';win=true;}
 else if(matched.length===3){prize=' 七獎！';win=true;}
 checkResult={prize:prize,matched:matched,xHit:xHit,win:win};
 if(win)showConfetti();render();
}

// ═══ MY BETS ═══
function renderMyBets(){
 var out='<div class="card" style="border-top:4px solid #43a047"><div style="font-size:15px;font-weight:900;color:#43a047;margin-bottom:4px">我的投注記錄</div>';
 out+='<div style="font-size:11px;color:var(--sub);margin-bottom:12px">記錄號碼，更新數據後自動對獎。只存本機。</div>';
 out+='<button class="btn btn-success btn-full" onclick="showAddBet=!showAddBet;render()">'+(showAddBet?'▲ 收起':'＋ 新增投注')+'</button></div>';
 if(showAddBet){
 out+='<div class="card"><div style="font-size:12px;font-weight:700;margin-bottom:8px">選擇 6 個號碼（'+betInput.length+'/6）</div>';
 out+=grid49(betInput,'toggleBetPick',betInput.length>=6);
 if(betInput.length>0){out+='<div style="display:flex;align-items:center;gap:4px;flex-wrap:wrap;margin-bottom:10px">';for(var i=0;i<betInput.length;i++) out+=ball(betInput[i],30);out+='</div>';}
 out+='<input type="text" id="bet-draw-input" placeholder="期號（可選）" value="'+betDraw+'" onchange="betDraw=this.value" style="margin-bottom:10px"/>';
 out+='<input type="text" id="bet-note-input" placeholder="備注（可選）" value="'+betNote+'" onchange="betNote=this.value" style="margin-bottom:10px"/>';
 out+='<button class="btn btn-success btn-full" onclick="addBet()" '+(betInput.length!==6?'disabled':'')+'>確認記錄</button></div>';
 }
 if(myBets.length===0){out+='<div class="card" style="text-align:center;color:var(--dim);font-size:14px">還沒有記錄 <br/><span style="font-size:11px">快新增你的投注吧！</span></div>';}
 else{
 for(var i=0;i<myBets.length;i++){
 var b=myBets[i],hDraw=null;
 for(var j=0;j<hist.length;j++) if(hist[j].draw===b.draw){hDraw=hist[j];break;}
 var hit=hDraw?b.numbers.filter(function(n){return hDraw.numbers.includes(n);}).length:null;
 var xHit=hDraw?b.numbers.includes(hDraw.extra):null;
 var pn=hit!==null?prizeName(hit,xHit):'',won=pn&&!pn.includes('未中');
 out+='<div class="card" style="padding:12px"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">';
 out+='<div><span style="font-size:12px;color:var(--accent);font-weight:800">'+b.draw+'</span><span style="font-size:10px;color:var(--dim);margin-left:8px">'+b.date+'</span></div>';
 out+='<div style="display:flex;gap:6px;align-items:center">';
 if(hDraw) out+='<span style="font-size:11px;font-weight:800;color:'+(won?'var(--accent)':'#cc0000')+';background:'+(won?'#e8f5e9':'#ffebee')+';padding:2px 8px;border-radius:20px">'+pn+'</span>';
 else out+='<span style="font-size:10px;color:var(--dim)">⏳ 待開獎</span>';
 out+='<button onclick="deleteBet('+b.id+')" style="border:none;background:none;color:var(--dim);cursor:pointer;font-size:16px;padding:0"></button></div></div>';
 out+='<div style="display:flex;align-items:center;gap:4px;flex-wrap:wrap">';
 for(var j=0;j<b.numbers.length;j++) out+=ball(b.numbers[j],28,false,false,!!(hDraw&&hDraw.numbers.includes(b.numbers[j])),'#43a047');
 out+='</div>';
 if(b.note) out+='<div style="font-size:10px;color:var(--dim);margin-top:6px">'+b.note+'</div>';
 out+='</div>';
 }
 }
 
 // 廣告位
 out+='<div class="ad-slot" style="margin:10px 0;min-height:60px;background:var(--row);border:1px dashed var(--border);border-radius:10px;display:flex;align-items:center;justify-content:center">';
 out+='<span style="font-size:10px;color:var(--dim)">廣告位</span>';
 out+='</div>';
 return out;
}
function toggleBetPick(n){if(betInput.includes(n))betInput=betInput.filter(function(x){return x!==n;});else if(betInput.length<6)betInput.push(n);render();}
function addBet(){
 var nd=calcNextDraw();
 var draw=(document.getElementById('bet-draw-input').value||betDraw||nd.drawNum);
 var note=(document.getElementById('bet-note-input').value||betNote||'');
 if(betInput.length!==6){showToast('請選擇6個號碼','err');return;}
 var nb={id:Date.now(),draw:draw,numbers:betInput.slice().sort(function(a,b){return a-b;}),note:note,date:new Date().toLocaleDateString('zh-HK'),scored:false};
 myBets=[nb].concat(myBets);localStorage.setItem('ms_bets',JSON.stringify(myBets));
 betInput=[];betDraw='';betNote='';showAddBet=false;
 showToast(' 已記錄！等開獎啦～','ok');render();
}
function deleteBet(id){myBets=myBets.filter(function(b){return b.id!==id;});localStorage.setItem('ms_bets',JSON.stringify(myBets));render();}
function prizeName(hit,xHit){if(hit===6)return' 一獎';if(hit===5&&xHit)return'[二] 二獎';if(hit===5)return'[三] 三獎';if(hit===4&&xHit)return' 四獎';if(hit===4)return' 五獎';if(hit===3&&xHit)return' 六獎';if(hit===3)return' 七獎';return' 未中';}

// ═══ BOARD ═══
function renderBoard(){
 var scored=boardEntries.filter(function(e){return e.scored;}).sort(function(a,b){return b.score-a.score;});
 var pending=boardEntries.filter(function(e){return !e.scored;});
 var medalBg=['#ffd700','#c0c0c0','#cd7f32'];
 var out='<div class="card" style="border-top:4px solid var(--gold)"><div style="font-size:15px;font-weight:900;color:var(--gold);margin-bottom:4px">預測準確率排行榜</div>';
 out+='<div style="font-size:11px;color:var(--sub);margin-bottom:12px;line-height:1.7">提交你對下期的預測！命中1正碼=10分，特別號=5分。純屬娛樂！</div>';
 out+='<button class="btn btn-gold btn-full" onclick="showAddBoard=!showAddBoard;render()">'+(showAddBoard?'▲ 收起':' 提交本期預測')+'</button></div>';
 if(showAddBoard){
 out+='<div class="card"><input type="text" id="board-name" placeholder="你的暱稱" value="'+boardName+'" onchange="boardName=this.value"/>';
 out+='<div style="font-size:12px;font-weight:700;margin-bottom:8px">選擇 6 個號碼（'+boardPicks.length+'/6）</div>';
 out+=grid49(boardPicks,'toggleBoardPick',boardPicks.length>=6);
 if(boardPicks.length>0){out+='<div style="display:flex;align-items:center;gap:4px;flex-wrap:wrap;margin-bottom:10px">';for(var i=0;i<boardPicks.length;i++) out+=ball(boardPicks[i],30);out+='</div>';}
 out+='<button class="btn btn-gold btn-full" onclick="addBoardEntry()" '+(!boardName.trim()||boardPicks.length!==6?'disabled':'')+'>提交預測</button></div>';
 }
 if(scored.length>0){
 out+='<div style="font-size:12px;color:var(--sub);font-weight:700;margin-bottom:8px">已計分排名</div>';
 for(var i=0;i<scored.length;i++){var e=scored[i];out+='<div class="row-item"><div style="width:28px;height:28px;border-radius:50%;background:'+(i<3?medalBg[i]:'var(--track)')+';display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:'+(i<3?'#fff':'var(--sub)')+';flex-shrink:0">'+(i+1)+'</div><div style="flex:1;min-width:0"><div style="font-size:12px;font-weight:700">'+e.name+'</div><div style="font-size:9px;color:var(--dim)">'+e.draw+' · 命中'+e.hit+'個'+(e.xHit?' +特':'')+'</div><div style="display:flex;align-items:center;gap:4px;flex-wrap:wrap;margin-top:4px">';for(var j=0;j<e.numbers.length;j++) out+=ball(e.numbers[j],20);out+='</div></div><div style="text-align:right;flex-shrink:0"><div style="font-size:18px;font-weight:900;color:var(--gold)">'+e.score+'</div><div style="font-size:9px;color:var(--dim)">分</div></div></div>';}
 }
 if(pending.length>0){
 out+='<div style="font-size:12px;color:var(--sub);font-weight:700;margin:12px 0 8px">⏳ 待開獎預測</div>';
 for(var i=0;i<pending.length;i++){var e=pending[i];out+='<div class="row-item"><div style="flex:1"><div style="font-size:12px;font-weight:700">'+e.name+'</div><div style="font-size:9px;color:var(--dim)">'+e.draw+'</div><div style="display:flex;align-items:center;gap:4px;flex-wrap:wrap;margin-top:4px">';for(var j=0;j<e.numbers.length;j++) out+=ball(e.numbers[j],20);out+='</div></div><span style="font-size:10px;color:var(--gold);font-weight:700;background:#100a28;padding:3px 8px;border-radius:20px">待計分</span></div>';}
 }
 if(boardEntries.length===0) out+='<div class="card" style="text-align:center;color:var(--dim);font-size:14px">還沒有預測 <br/><span style="font-size:11px">成為第一個預測者！</span></div>';
 
 // 廣告位
 out+='<div class="ad-slot" style="margin:10px 0;min-height:60px;background:var(--row);border:1px dashed var(--border);border-radius:10px;display:flex;align-items:center;justify-content:center">';
 out+='<span style="font-size:10px;color:var(--dim)">廣告位</span>';
 out+='</div>';
 return out;
}
function toggleBoardPick(n){if(boardPicks.includes(n))boardPicks=boardPicks.filter(function(x){return x!==n;});else if(boardPicks.length<6)boardPicks.push(n);render();}
function addBoardEntry(){
 var name=(document.getElementById('board-name').value||boardName||'').trim();
 if(!name){showToast('請輸入暱稱','err');return;}
 if(boardPicks.length!==6){showToast('請選擇6個號碼','err');return;}
 var nd=calcNextDraw();
 var e={id:Date.now(),name:name,draw:nd.drawNum,numbers:boardPicks.slice().sort(function(a,b){return a-b;}),ts:new Date().toISOString(),scored:false,score:0,hit:0};
 boardEntries=[e].concat(boardEntries).slice(0,200);
 localStorage.setItem('ms_board',JSON.stringify(boardEntries));
 boardPicks=[];boardName='';showAddBoard=false;
 showToast(' 預測已提交！繼續！','ok');render();
}

// ═══ PREDICT ═══
var MATH_METHODS=[{key:'combined',label:'綜合評分',icon:'⚡'},{key:'golden',label:'黃金分割',icon:'φ'},{key:'fib',label:'費氏數列',icon:'∞'},{key:'gap',label:'遺漏回歸',icon:'↩'},{key:'parity',label:'奇偶平衡',icon:'⚖'},{key:'sumzone',label:'和值區間',icon:'Σ'},{key:'tail',label:'尾數分析',icon:'09'}];

function renderPredict(){
 var out='<div class="sub-tabs">';
 var ptabs=[['math',' 數學引擎','var(--gold2)'],['ai',' AI 預測','#6a1b9a']];
 for(var i=0;i<ptabs.length;i++) out+='<button class="sub-tab '+(pTab===ptabs[i][0]?'active':'')+'" onclick="pTab=\''+ptabs[i][0]+'\';render()" style="'+(pTab===ptabs[i][0]?'color:'+ptabs[i][2]:'')+'">'+ptabs[i][1]+'</button>';
 out+='</div>';
 out+=pTab==='math'?renderMathPredict():renderAIPredict();
 
 // 廣告位
 out+='<div class="ad-slot" style="margin:10px 0;min-height:60px;background:var(--row);border:1px dashed var(--border);border-radius:10px;display:flex;align-items:center;justify-content:center">';
 out+='<span style="font-size:10px;color:var(--dim)">廣告位</span>';
 out+='</div>';
 return out;
}

function renderMathPredict(){
 var out='<div class="card" style="border-top:4px solid var(--gold2)"><div style="font-size:14px;font-weight:900;color:var(--gold2);margin-bottom:14px">數學預測引擎</div>';
 out+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">';
 for(var i=0;i<MATH_METHODS.length;i++){var m=MATH_METHODS[i];out+='<button onclick="mMethod=\''+m.key+'\';render()" style="padding:11px 12px;border-radius:11px;border:2px solid '+(mMethod===m.key?'var(--gold2)':'var(--border)')+';background:'+(mMethod===m.key?'var(--accent-bg)':'var(--row)')+';cursor:pointer;text-align:left"><div style="font-size:15px;margin-bottom:3px">'+m.icon+'</div><div style="font-size:12px;font-weight:800;color:'+(mMethod===m.key?'var(--gold2)':'var(--text)')+'">'+m.label+'</div></button>';}
 out+='</div><button class="btn btn-gold btn-full" onclick="doMath()" '+(mLoading?'disabled':'')+'>'+(mLoading?' 計算中...':' 開始分析')+'</button></div>';
 if(mResult&&!mResult.error){
 out+='<div class="result-card"><div style="font-size:11px;color:var(--dim);margin-bottom:10px;text-align:center">⚠ 純屬娛樂，中獎係靠緣份！</div>';
 out+='<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;justify-content:center">'+ballsRow(mResult.numbers,mResult.extra,50)+'</div></div>';
 out+='<div class="card"><div style="font-size:13px;font-weight:800;margin-bottom:12px">TOP 15 評分</div>';
 for(var i=0;i<mResult.top15.length;i++){var item=mResult.top15[i],sel=mResult.numbers.includes(item.n),c=ZC[gz(item.n)];out+='<div style="display:flex;align-items:center;gap:9px;margin-bottom:8px"><span style="color:'+(sel?'var(--accent)':'var(--dim)')+';font-size:11px;width:18px;text-align:right;font-weight:700">'+(i+1)+'</span>'+ball(item.n,32,false,false,sel,sel?'var(--accent)':'')+'<div style="flex:1"><div style="height:6px;background:var(--track);border-radius:3px;overflow:hidden"><div style="height:100%;width:'+(item.score*100)+'%;background:'+(sel?'var(--accent)':c)+';border-radius:3px"></div></div></div><div style="background:'+(sel?'var(--accent-bg)':'var(--row)')+';padding:3px 8px;border-radius:8px"><span style="font-size:12px;font-weight:800;color:'+(sel?'var(--accent)':'var(--sub)')+'">'+Math.round(item.score*100)+'</span></div></div>';}
 out+='</div>';
 }
 return out;
}

function renderAIPredict(){
 function comb(n,k){if(k>n)return 0;var r=1;for(var i=0;i<k;i++) r=r*(n-i)/(i+1);return Math.round(r);}
 var dc=pCount-sureCt,tickets=betMode==='combination'?comb(pCount,6):betMode==='bravery'?(function(){var need=6-sureCt;if(dc<need||need<1)return 0;return comb(dc,need);})():1;
 var out='<div class="card" style="border-top:4px solid #6a1b9a"><div style="font-size:14px;font-weight:900;color:#6a1b9a;margin-bottom:14px">AI 號碼建議</div>';
 out+='<div class="chips" style="margin-bottom:14px">';
 var bmodes=[['standard',' 普通一注'],['combination',' 多寶'],['bravery',' 膽拖']];
 for(var i=0;i<bmodes.length;i++) out+='<button class="pill '+(betMode===bmodes[i][0]?'active':'')+'" onclick="betMode=\''+bmodes[i][0]+'\';if(betMode!==\'standard\'&&pCount<7)pCount=7;render()" style="'+(betMode===bmodes[i][0]?'border-color:#6a1b9a;background:#f3e5f5;color:#6a1b9a':'')+'">'+bmodes[i][1]+'</button>';
 out+='</div>';
 if(betMode!=='standard'){out+='<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px">';for(var n=7;n<=12;n++) out+='<button onclick="pCount='+n+';render()" style="width:42px;height:42px;border-radius:11px;border:2px solid '+(pCount===n?'#6a1b9a':'var(--border)')+';background:'+(pCount===n?'#f3e5f5':'var(--card)')+';color:'+(pCount===n?'#6a1b9a':'var(--sub)')+';font-weight:800;font-size:15px;cursor:pointer">'+n+'</button>';out+='</div>';}
 if(betMode==='bravery'){out+='<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px">';for(var n=1;n<=Math.min(5,pCount-1);n++) out+='<button onclick="sureCt='+n+';render()" style="width:42px;height:42px;border-radius:11px;border:2px solid '+(sureCt===n?'var(--accent)':'var(--border)')+';background:'+(sureCt===n?'#e8f5e9':'var(--card)')+';color:'+(sureCt===n?'var(--accent)':'var(--sub)')+';font-weight:800;font-size:15px;cursor:pointer">'+n+'</button>';out+='</div>';}
 out+='<div style="background:var(--row);border-radius:10px;padding:10px 14px;margin-bottom:14px;display:flex;justify-content:space-between;align-items:center"><div style="font-size:11px;color:var(--sub)">'+(betMode==='standard'?'普通一注':betMode==='combination'?'C('+pCount+',6)='+comb(pCount,6)+'注':'膽'+sureCt+'拖'+dc)+'</div><div style="text-align:right"><div style="font-size:18px;font-weight:900;color:var(--gold2)">HK$'+(tickets*10).toLocaleString()+'</div><div style="font-size:9px;color:var(--dim)">'+tickets+'注×$10</div></div></div>';
 out+='<button class="btn btn-purple btn-full" onclick="doAI()" '+(pLoading?'disabled':'')+'>'+(pLoading?' AI 分析中...':' 生成號碼建議')+'</button></div>';
 if(aiResult){
 if(aiResult.error) out+='<div class="card" style="text-align:center"><span style="color:#c62828;font-weight:700">生成失敗，請重試</span></div>';
 else if(aiResult.type==='bravery'){out+='<div class="result-card"><div style="margin-bottom:12px"><div style="font-size:11px;color:#2e7d32;font-weight:800;margin-bottom:6px">膽碼</div><div style="display:flex;gap:6px;flex-wrap:wrap">';for(var i=0;i<aiResult.sure.length;i++) out+=ball(aiResult.sure[i],46,false,false,true,'var(--accent)');out+='</div></div><div style="margin-bottom:12px"><div style="font-size:11px;color:var(--gold2);font-weight:800;margin-bottom:6px">拖碼</div><div style="display:flex;gap:6px;flex-wrap:wrap">';for(var i=0;i<aiResult.drag.length;i++) out+=ball(aiResult.drag[i],46,false,false,true,'var(--gold2)');out+='</div></div><div style="background:var(--row);border-radius:10px;padding:12px;font-size:12px;line-height:1.8">'+aiResult.analysis+'</div></div>';}
 else{out+='<div class="result-card"><div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;justify-content:center;margin-bottom:10px">'+ballsRow(aiResult.numbers,aiResult.extra,48)+'</div><div style="background:var(--row);border-radius:10px;padding:12px;font-size:12px;line-height:1.8">'+aiResult.analysis+'</div></div>';}
 }
 return out;
}

function doMath(){
 mLoading=true;mResult=null;render();
 setTimeout(function(){
 try{
 var ranked=runMath();
 var sortMap={golden:function(a,b){return b.golden-a.golden;},fib:function(a,b){return b.fib-a.fib;},gap:function(a,b){return b.gap-a.gap;},parity:function(a,b){return b.parity-a.parity;},sumzone:function(a,b){return b.sum-a.sum;},tail:function(a,b){return b.tail-a.tail;}};
 var mr=sortMap[mMethod]?ranked.slice().sort(sortMap[mMethod]):ranked;
 var top=mr.slice(0,6).map(function(x){return x.n;}).sort(function(a,b){return a-b;});
 var extra=ranked.slice().sort(function(a,b){return b.gap-a.gap;}).find(function(x){return !top.includes(x.n);}).n;
 mResult={numbers:top,extra:extra,top15:mr.slice(0,15)};
 }catch(e){mResult={error:true};}
 mLoading=false;render();
 },80);
}

async function doAI(){
 var apiKey=localStorage.getItem('ms_key')||'';
 if(!apiKey){showToast('⚙ 請先設定 API Key','err');return;}
 pLoading=true;aiResult=null;render();
 var ranked=runMath();
 var mathTop=ranked.slice(0,10).map(function(r){return r.n+'('+Math.round(r.score*100)+')';}).join(',');
 var recent=hist.slice(0,5).map(function(h){return h.draw+':'+h.numbers.join(',')+'+特'+h.extra;}).join('|');
 var dc=pCount-sureCt,sp,um;
 if(betMode==='bravery'){sp='六合彩分析師。只回JSON：{"sure":['+sureCt+'個膽碼],"drag":['+dc+'個拖碼],"extra":特別號,"analysis":"繁體60字"}';um='近期:'+recent+'\nTop10:'+mathTop+'\n膽'+sureCt+'拖'+dc;}
 else{sp='六合彩分析師。只回JSON：{"numbers":['+pCount+'個1-49不重複],"extra":特別號,"analysis":"繁體60字"}';um='近期:'+recent+'\nTop10:'+mathTop+'\n建議'+pCount+'個';}
 try{
 var res=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json','x-api-key':apiKey,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},body:JSON.stringify({model:'claude-haiku-4-5-20251001',max_tokens:400,system:sp,messages:[{role:'user',content:um}]})});
 var d=await res.json();
 if(d.error) throw new Error(d.error.message);
 var r=JSON.parse((d.content&&d.content[0]&&d.content[0].text||'').replace(/```json|```/g,'').trim());
 if(betMode==='bravery'){if(r.sure&&r.sure.length===sureCt&&r.drag) aiResult=Object.assign({type:'bravery'},r);else throw 0;}
 else{if(r.numbers&&r.numbers.length===pCount) aiResult=Object.assign({type:'standard'},r);else throw 0;}
 }catch(e){aiResult={error:true};}
 pLoading=false;render();
}

// ═══ DISCUSS ═══
var disqusLoaded=false;
function renderDiscuss(){
 var out='';
 if(selPost){
 out+='<button class="btn btn-ghost" onclick="selPost=null;render()" style="margin-bottom:12px">← 返回</button>';
 out+='<div class="result-card"><div style="display:flex;gap:10px;align-items:flex-start;margin-bottom:12px">';
 out+='<span style="font-size:28px">'+selPost.emoji+'</span>';
 out+='<div><div style="font-size:15px;font-weight:900;margin-bottom:4px">'+selPost.title+'</div>';
 out+='<div style="font-size:10px;color:var(--sub)">管理員 · '+selPost.date+(selPost.likes>0?' · '+selPost.likes:'')+'</div></div></div>';
 out+='<div style="font-size:13px;line-height:1.9;background:var(--row);border-radius:10px;padding:14px">'+selPost.content.replace(/\n/g,'<br/>')+'</div></div>';
 
 // 廣告位
 out+='<div class="ad-slot" style="margin:10px 0;min-height:60px;background:var(--row);border:1px dashed var(--border);border-radius:10px;display:flex;align-items:center;justify-content:center">';
 out+='<span style="font-size:10px;color:var(--dim)">廣告位</span>';
 out+='</div>';
 return out;
 }
 out+='<div style="font-size:12px;color:var(--sub);font-weight:700;margin-bottom:8px">置頂公告</div>';
 for(var i=0;i<POSTS.length;i++){
 var p=POSTS[i];
 if(!p.pin) continue;
 out+='<div class="post-card pinned" onclick="selPost=POSTS['+i+'];render()">';
 out+='<div style="display:flex;align-items:center;gap:8px"><span style="font-size:20px">'+p.emoji+'</span>';
 out+='<div style="flex:1"><div class="post-title">'+p.title+'</div><div class="post-meta">管理員 · '+p.date+(p.likes>0?' · '+p.likes:'')+'</div></div></div>';
 out+='<div class="post-preview">'+p.content.slice(0,70)+'...</div></div>';
 }
 out+='<div style="font-size:12px;color:var(--sub);font-weight:700;margin:14px 0 8px">管理員討論</div>';
 for(var i=0;i<POSTS.length;i++){
 var p=POSTS[i];
 if(p.pin) continue;
 out+='<div class="post-card" onclick="selPost=POSTS['+i+'];render()">';
 out+='<div style="display:flex;align-items:center;gap:8px"><span style="font-size:18px">'+p.emoji+'</span>';
 out+='<div style="flex:1"><div class="post-title">'+p.title+'</div><div class="post-meta">管理員 · '+p.date+' · '+p.likes+'</div></div></div>';
 out+='<div class="post-preview">'+p.content.slice(0,80)+'...</div></div>';
 }
 out+='<div class="card" style="margin-top:4px"><div style="font-size:13px;font-weight:700;margin-bottom:4px">加入討論</div>';
 out+='<div style="font-size:11px;color:var(--sub);margin-bottom:12px;line-height:1.7">點任何帖子可查看全文，或在下方直接留言！</div>';
 out+='<div id="disqus_thread" style="min-height:200px"></div></div>';
 return out;
}
function initDisqus(){
 try{
 if(disqusLoaded){if(window.DISQUS)window.DISQUS.reset({reload:true,config:function(){this.page.url=window.location.href;this.page.identifier='liuhechuzhong-discuss';}});return;}
 disqusLoaded=true;
 window.disqus_config=function(){this.page.url=window.location.href;this.page.identifier='liuhechuzhong-discuss';};
 var s=document.createElement('script');s.src='https://'+DISQUS_SHORTNAME+'.disqus.com/embed.js';s.async=true;
 s.onerror=function(){var el=document.getElementById('disqus_thread');if(el)el.innerHTML='<div style="padding:14px;color:var(--sub);font-size:12px;text-align:center">留言功能載入中，請稍後重試</div>';};
 document.head.appendChild(s);
 }catch(e){}
}
