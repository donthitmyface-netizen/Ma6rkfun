/* data.js — 常中天機 · 靜態資料：歷史開獎、生肖/星座/MBTI 查詢表 */

// ═══════════════════════════════════════════
// 六合常中 v10 - Pure Vanilla JS (No React/Babel)
// Worker URL - change this after Cloudflare setup
// ═══════════════════════════════════════════
const WORKER_URL = "https://ma6rkfun.donthitmyface.workers.dev";
const DISQUS_SHORTNAME = "liu-he-chang-zhong";

const HISTORY=[
 {draw:"26/029",date:"2026-03-17",numbers:[16,18,22,28,45,49],extra:13},
 {draw:"26/028",date:"2026-03-12",numbers:[7,13,14,16,26,30],extra:34},
 {draw:"26/027",date:"2026-03-10",numbers:[2,16,25,34,35,37],extra:49},
 {draw:"26/026",date:"2026-03-07",numbers:[12,15,18,22,28,37],extra:31},
 {draw:"26/025",date:"2026-03-05",numbers:[4,18,24,31,42,46],extra:11},
 {draw:"26/024",date:"2026-03-03",numbers:[6,13,20,31,32,44],extra:45},
 {draw:"26/023",date:"2026-02-28",numbers:[5,15,37,39,46,47],extra:29},
 {draw:"26/022",date:"2026-02-26",numbers:[6,13,15,19,38,42],extra:34},
  {draw:"26/021",date:"2026-02-24",numbers:[2,3,4,10,13,23],extra:12},
 {draw:"26/020",date:"2026-02-21",numbers:[2,18,34,35,37,49],extra:33},
 {draw:"26/019",date:"2026-02-15",numbers:[8,28,33,36,37,46],extra:4},
 {draw:"26/018",date:"2026-02-12",numbers:[2,3,14,25,37,46],extra:10},
 {draw:"26/017",date:"2026-02-10",numbers:[3,4,14,18,26,39],extra:40},
 {draw:"26/016",date:"2026-02-07",numbers:[12,22,28,32,37,44],extra:20},
 {draw:"26/015",date:"2026-02-05",numbers:[1,9,17,24,35,36],extra:42},
 {draw:"26/014",date:"2026-02-03",numbers:[12,23,27,37,39,42],extra:5},
 {draw:"26/013",date:"2026-01-31",numbers:[25,30,32,35,36,47],extra:46},
 {draw:"26/012",date:"2026-01-29",numbers:[6,9,12,14,35,44],extra:11},
 {draw:"26/011",date:"2026-01-27",numbers:[7,12,14,25,38,47],extra:15},
 {draw:"26/010",date:"2026-01-24",numbers:[6,16,17,22,28,48],extra:45},
 {draw:"26/009",date:"2026-01-22",numbers:[4,9,15,24,27,31],extra:45},
 {draw:"26/008",date:"2026-01-20",numbers:[1,4,6,9,44,46],extra:27},
 {draw:"26/007",date:"2026-01-17",numbers:[5,12,15,23,27,42],extra:46},
 {draw:"26/006",date:"2026-01-15",numbers:[3,6,37,38,39,44],extra:48},
 {draw:"26/005",date:"2026-01-13",numbers:[14,24,34,38,48,49],extra:27},
 {draw:"26/004",date:"2026-01-10",numbers:[3,16,20,22,24,37],extra:42},
 {draw:"26/003",date:"2026-01-08",numbers:[15,21,24,40,45,46],extra:13},
 {draw:"26/002",date:"2026-01-06",numbers:[2,8,12,19,28,36],extra:1},
 {draw:"26/001",date:"2026-01-03",numbers:[2,10,13,16,20,21],extra:14},
 {draw:"25/134",date:"2025-12-28",numbers:[7,10,11,19,25,30],extra:45},
 {draw:"25/133",date:"2025-12-25",numbers:[1,2,4,30,41,43],extra:13},
 {draw:"25/132",date:"2025-12-21",numbers:[9,17,27,34,39,47],extra:46},
 {draw:"25/131",date:"2025-12-18",numbers:[6,23,28,31,33,34],extra:11},
 {draw:"25/130",date:"2025-12-16",numbers:[3,12,23,28,35,38],extra:24},
 {draw:"25/129",date:"2025-12-13",numbers:[10,17,19,28,45,49],extra:1},
 {draw:"25/128",date:"2025-12-11",numbers:[1,5,6,25,30,42],extra:43},
 {draw:"25/127",date:"2025-12-06",numbers:[4,6,26,28,34,40],extra:25},
 {draw:"25/126",date:"2025-12-02",numbers:[6,18,29,34,37,38],extra:39},
 {draw:"25/125",date:"2025-11-25",numbers:[1,2,17,35,37,48],extra:8},
 {draw:"25/124",date:"2025-11-20",numbers:[19,26,33,35,36,39],extra:5},
 {draw:"25/123",date:"2025-11-18",numbers:[2,4,10,26,28,36],extra:23},
 {draw:"25/122",date:"2025-11-16",numbers:[2,11,13,28,38,47],extra:7},
 {draw:"25/121",date:"2025-11-13",numbers:[10,11,28,30,37,39],extra:15},
 {draw:"25/120",date:"2025-11-11",numbers:[18,20,28,37,38,40],extra:41},
 {draw:"25/119",date:"2025-11-08",numbers:[7,9,16,17,33,46],extra:49},
 {draw:"25/118",date:"2025-11-06",numbers:[10,17,22,33,40,41],extra:31},
 {draw:"25/117",date:"2025-11-04",numbers:[19,20,26,28,39,44],extra:4},
 {draw:"25/116",date:"2025-10-28",numbers:[4,7,15,21,45,46],extra:24},
 {draw:"25/115",date:"2025-10-25",numbers:[6,7,27,36,39,43],extra:1},
];

// ── State ──
