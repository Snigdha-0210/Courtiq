// ─── GAMES ────────────────────────────────────────────────────
export const GAMES = [
  { id:1, home:"BOS", away:"MIA", hs:84, as:77, status:"Q3 4:22", live:true,  arena:"TD Garden",         broadcast:"ESPN", hRec:"52-30", aRec:"44-38", hLeader:"Tatum 28", aLeader:"Adebayo 22",
    qtrs:{ h:[28,29,27,0], a:[22,26,29,0] } },
  { id:2, home:"GSW", away:"LAL", hs:0,  as:0,  status:"8:30 PM ET", live:false, arena:"Chase Center",   broadcast:"TNT", hRec:"48-34", aRec:"50-32", hLeader:"—", aLeader:"—",
    qtrs:{ h:[0,0,0,0], a:[0,0,0,0] } },
  { id:3, home:"DEN", away:"PHX", hs:114,as:108, status:"FINAL", live:false,   arena:"Ball Arena",        broadcast:"ESPN", hRec:"53-29", aRec:"49-33", hLeader:"Jokić 34", aLeader:"Durant 28",
    qtrs:{ h:[31,28,29,26], a:[28,27,25,28] } },
  { id:4, home:"NYK", away:"CHI", hs:0,  as:0,  status:"7:00 PM ET", live:false, arena:"Madison Square Garden", broadcast:"NBA TV", hRec:"51-31", aRec:"40-42", hLeader:"—", aLeader:"—",
    qtrs:{ h:[0,0,0,0], a:[0,0,0,0] } },
  { id:5, home:"MIL", away:"IND", hs:98, as:96, status:"Q4 1:15", live:true,   arena:"Fiserv Forum",     broadcast:"BALLY", hRec:"46-36", aRec:"47-35", hLeader:"Giannis 30", aLeader:"Haliburton 22",
    qtrs:{ h:[24,26,27,21], a:[22,28,24,22] } },
  { id:6, home:"DAL", away:"SAC", hs:0,  as:0,  status:"9:00 PM ET", live:false, arena:"American Airlines Center", broadcast:"ESPN", hRec:"55-27", aRec:"43-39", hLeader:"—", aLeader:"—",
    qtrs:{ h:[0,0,0,0], a:[0,0,0,0] } },
];

// ─── STANDINGS ────────────────────────────────────────────────
export const EAST = [
  { t:"BOS", city:"Boston",       w:52, l:30, home:"30-11", road:"22-19", l10:"7-3", str:"W3" },
  { t:"CLE", city:"Cleveland",    w:48, l:34, home:"27-14", road:"21-20", l10:"8-2", str:"W5" },
  { t:"NYK", city:"New York",     w:51, l:31, home:"28-13", road:"23-18", l10:"6-4", str:"L1" },
  { t:"MIL", city:"Milwaukee",    w:46, l:36, home:"26-15", road:"20-21", l10:"5-5", str:"W1" },
  { t:"PHI", city:"Philadelphia", w:43, l:39, home:"24-17", road:"19-22", l10:"4-6", str:"W2" },
  { t:"MIA", city:"Miami",        w:44, l:38, home:"25-16", road:"19-22", l10:"4-6", str:"L2" },
  { t:"ATL", city:"Atlanta",      w:38, l:44, home:"22-19", road:"16-25", l10:"5-5", str:"L1" },
  { t:"CHI", city:"Chicago",      w:40, l:42, home:"22-19", road:"18-23", l10:"4-6", str:"W1" },
  { t:"TOR", city:"Toronto",      w:25, l:57, home:"14-27", road:"11-30", l10:"2-8", str:"L4" },
  { t:"DET", city:"Detroit",      w:22, l:60, home:"13-28", road:"9-32",  l10:"3-7", str:"L2" },
];

export const WEST = [
  { t:"DAL", city:"Dallas",       w:55, l:27, home:"30-11", road:"25-16", l10:"8-2", str:"W4" },
  { t:"DEN", city:"Denver",       w:53, l:29, home:"31-10", road:"22-19", l10:"7-3", str:"W2" },
  { t:"LAL", city:"Los Angeles",  w:50, l:32, home:"28-13", road:"22-19", l10:"6-4", str:"W1" },
  { t:"PHX", city:"Phoenix",      w:49, l:33, home:"26-15", road:"23-18", l10:"6-4", str:"W3" },
  { t:"GSW", city:"Golden State", w:48, l:34, home:"27-14", road:"21-20", l10:"5-5", str:"L1" },
  { t:"MIN", city:"Minnesota",    w:44, l:38, home:"24-17", road:"20-21", l10:"5-5", str:"W1" },
  { t:"IND", city:"Indiana",      w:47, l:35, home:"26-15", road:"21-20", l10:"6-4", str:"W2" },
  { t:"MEM", city:"Memphis",      w:38, l:44, home:"21-20", road:"17-24", l10:"4-6", str:"L3" },
  { t:"SAS", city:"San Antonio",  w:30, l:52, home:"17-24", road:"13-28", l10:"4-6", str:"W1" },
  { t:"POR", city:"Portland",     w:22, l:60, home:"12-29", road:"10-31", l10:"2-8", str:"L8" },
];

// ─── LEADERS ──────────────────────────────────────────────────
export const LEADERS = {
  pts: [
    { name:"Luka Dončić",             team:"DAL", pos:"PG", init:"LD", val:33.9 },
    { name:"Jayson Tatum",            team:"BOS", pos:"SF", init:"JT", val:30.2 },
    { name:"Shai Gilgeous-Alexander", team:"OKC", pos:"PG", init:"SG", val:29.6 },
    { name:"LeBron James",            team:"LAL", pos:"SF", init:"LJ", val:28.4 },
    { name:"Joel Embiid",             team:"PHI", pos:"C",  init:"JE", val:27.8 },
    { name:"Giannis Antetokounmpo",   team:"MIL", pos:"PF", init:"GA", val:27.1 },
    { name:"Stephen Curry",           team:"GSW", pos:"PG", init:"SC", val:26.4 },
    { name:"Kevin Durant",            team:"PHX", pos:"SF", init:"KD", val:25.9 },
  ],
  reb: [
    { name:"Nikola Jokić",            team:"DEN", pos:"C",  init:"NJ", val:13.2 },
    { name:"Joel Embiid",             team:"PHI", pos:"C",  init:"JE", val:11.8 },
    { name:"Rudy Gobert",             team:"MIN", pos:"C",  init:"RG", val:11.4 },
    { name:"Domantas Sabonis",        team:"SAC", pos:"C",  init:"DS", val:11.1 },
    { name:"Giannis Antetokounmpo",   team:"MIL", pos:"PF", init:"GA", val:10.6 },
    { name:"Bam Adebayo",             team:"MIA", pos:"C",  init:"BA", val:10.1 },
    { name:"Evan Mobley",             team:"CLE", pos:"C",  init:"EM", val:9.8  },
    { name:"Karl-Anthony Towns",      team:"NYK", pos:"C",  init:"KT", val:9.4  },
  ],
  ast: [
    { name:"Tyrese Haliburton",       team:"IND", pos:"PG", init:"TH", val:11.9 },
    { name:"Nikola Jokić",            team:"DEN", pos:"C",  init:"NJ", val:9.8  },
    { name:"Luka Dončić",             team:"DAL", pos:"PG", init:"LD", val:9.6  },
    { name:"LeBron James",            team:"LAL", pos:"SF", init:"LJ", val:8.4  },
    { name:"James Harden",            team:"LAC", pos:"PG", init:"JH", val:8.2  },
    { name:"Trae Young",              team:"ATL", pos:"PG", init:"TY", val:10.4 },
    { name:"Stephen Curry",           team:"GSW", pos:"PG", init:"SC", val:5.1  },
    { name:"Draymond Green",          team:"GSW", pos:"PF", init:"DG", val:7.0  },
  ],
  stl: [
    { name:"De'Aaron Fox",            team:"SAC", pos:"PG", init:"DF", val:2.1 },
    { name:"OG Anunoby",              team:"NYK", pos:"SF", init:"OA", val:1.9 },
    { name:"Kawhi Leonard",           team:"LAC", pos:"SF", init:"KL", val:1.7 },
    { name:"Jrue Holiday",            team:"BOS", pos:"PG", init:"JH", val:1.6 },
    { name:"Fred VanVleet",           team:"HOU", pos:"PG", init:"FV", val:1.5 },
    { name:"Derrick White",           team:"BOS", pos:"SG", init:"DW", val:1.4 },
    { name:"Anfernee Simons",         team:"POR", pos:"SG", init:"AS", val:1.3 },
    { name:"Gary Trent Jr.",          team:"TOR", pos:"SG", init:"GT", val:1.3 },
  ],
  blk: [
    { name:"Victor Wembanyama",       team:"SAS", pos:"C",  init:"VW", val:3.8 },
    { name:"Jaren Jackson Jr.",       team:"MEM", pos:"PF", init:"JJ", val:3.0 },
    { name:"Rudy Gobert",             team:"MIN", pos:"C",  init:"RG", val:2.4 },
    { name:"Brook Lopez",             team:"MIL", pos:"C",  init:"BL", val:2.2 },
    { name:"Nic Claxton",             team:"BKN", pos:"C",  init:"NC", val:2.1 },
    { name:"Evan Mobley",             team:"CLE", pos:"C",  init:"EM", val:1.9 },
    { name:"Bam Adebayo",             team:"MIA", pos:"C",  init:"BA", val:1.6 },
    { name:"Myles Turner",            team:"IND", pos:"C",  init:"MT", val:1.5 },
  ],
  ts: [
    { name:"DeAndre Jordan",          team:"BKN", pos:"C",  init:"DJ", val:72.1 },
    { name:"Nikola Jokić",            team:"DEN", pos:"C",  init:"NJ", val:68.4 },
    { name:"Stephen Curry",           team:"GSW", pos:"PG", init:"SC", val:63.8 },
    { name:"Kevin Durant",            team:"PHX", pos:"SF", init:"KD", val:62.9 },
    { name:"Giannis Antetokounmpo",   team:"MIL", pos:"PF", init:"GA", val:62.4 },
    { name:"Jayson Tatum",            team:"BOS", pos:"SF", init:"JT", val:61.8 },
    { name:"LeBron James",            team:"LAL", pos:"SF", init:"LJ", val:61.2 },
    { name:"Joel Embiid",             team:"PHI", pos:"C",  init:"JE", val:60.8 },
  ],
  "3pm": [
    { name:"Stephen Curry",           team:"GSW", pos:"PG", init:"SC", val:5.8 },
    { name:"Damian Lillard",          team:"MIL", pos:"PG", init:"DL", val:4.9 },
    { name:"Luka Dončić",             team:"DAL", pos:"PG", init:"LD", val:4.6 },
    { name:"Klay Thompson",           team:"GSW", pos:"SG", init:"KT", val:3.9 },
    { name:"Jaylen Brown",            team:"BOS", pos:"SG", init:"JB", val:3.6 },
    { name:"Jayson Tatum",            team:"BOS", pos:"SF", init:"JT", val:3.4 },
    { name:"Kyrie Irving",            team:"DAL", pos:"PG", init:"KI", val:3.3 },
    { name:"Desmond Bane",            team:"MEM", pos:"SG", init:"DB", val:3.1 },
  ],
  per: [
    { name:"Nikola Jokić",            team:"DEN", pos:"C",  init:"NJ", val:31.5 },
    { name:"Giannis Antetokounmpo",   team:"MIL", pos:"PF", init:"GA", val:30.1 },
    { name:"Luka Dončić",             team:"DAL", pos:"PG", init:"LD", val:28.4 },
    { name:"Joel Embiid",             team:"PHI", pos:"C",  init:"JE", val:27.6 },
    { name:"LeBron James",            team:"LAL", pos:"SF", init:"LJ", val:26.2 },
    { name:"Jayson Tatum",            team:"BOS", pos:"SF", init:"JT", val:25.8 },
    { name:"Stephen Curry",           team:"GSW", pos:"PG", init:"SC", val:24.8 },
    { name:"Kevin Durant",            team:"PHX", pos:"SF", init:"KD", val:24.1 },
  ],
};

// ─── INJURIES ─────────────────────────────────────────────────
export const INJURIES = [
  { name:"Kawhi Leonard",     team:"LAC", status:"out",  injury:"Knee",    return:"Unknown" },
  { name:"Damian Lillard",    team:"MIL", status:"ques", injury:"Achilles",return:"Day-to-Day" },
  { name:"Paul George",       team:"PHI", status:"prob", injury:"Knee",    return:"Tonight" },
  { name:"Zion Williamson",   team:"NOP", status:"out",  injury:"Hamstring",return:"2 weeks" },
  { name:"Ben Simmons",       team:"BKN", status:"out",  injury:"Back",    return:"Unknown" },
  { name:"Anthony Davis",     team:"LAL", status:"ques", injury:"Foot",    return:"Day-to-Day" },
  { name:"Ja Morant",         team:"MEM", status:"out",  injury:"Shoulder",return:"Season" },
];

// ─── PLAYERS ──────────────────────────────────────────────────
export const PLAYERS = {
  curry: {
    name:"Stephen Curry", firstName:"Stephen", lastName:"Curry",
    number:30, pos:"Point Guard", team:"Golden State Warriors", teamAbbr:"GSW",
    age:37, height:"6'2\"", weight:"185 lbs", draft:"2009 · Rd 1 · #7", college:"Davidson",
    salary:"$51.9M",
    season:{ pts:26.4, reb:4.7, ast:5.1, stl:1.4, blk:0.4, fgp:48.7, fg3p:42.3, ftp:92.1, tsp:63.8, per:24.8, usage:28.4, ws:7.2, vorp:3.4, bpm:5.8, ortg:118.4, drtg:112.6, pm:7.2, gp:82, mpg:34.2, tov:2.8 },
    career:[
      { season:"2009-10", gp:80, pts:17.5, reb:4.5, ast:5.9, fgp:46.2, fg3p:43.7, ftp:88.5, tsp:58.2, per:17.7 },
      { season:"2012-13", gp:78, pts:22.9, reb:4.0, ast:6.9, fgp:45.1, fg3p:45.3, ftp:90.0, tsp:61.6, per:21.7 },
      { season:"2015-16", gp:79, pts:30.1, reb:5.4, ast:6.7, fgp:50.4, fg3p:45.4, ftp:90.8, tsp:66.9, per:31.5 },
      { season:"2020-21", gp:63, pts:32.0, reb:5.5, ast:5.8, fgp:48.2, fg3p:42.1, ftp:91.6, tsp:65.5, per:26.0 },
      { season:"2023-24", gp:74, pts:26.4, reb:4.5, ast:5.1, fgp:45.0, fg3p:40.8, ftp:92.3, tsp:62.5, per:22.1 },
      { season:"2024-25", gp:82, pts:26.4, reb:4.7, ast:5.1, fgp:48.7, fg3p:42.3, ftp:92.1, tsp:63.8, per:24.8 },
    ],
    gamelog:[
      { date:"Jun 18", opp:"MIA", res:"W", min:34, pts:30, reb:5, ast:7, fgm:11, fga:21, fg3m:4, fg3a:9, ftm:5, fta:6, stl:2, blk:0, tov:3, pm:12 },
      { date:"Jun 15", opp:"BOS", res:"L", min:36, pts:22, reb:4, ast:6, fgm:8,  fga:19, fg3m:3, fg3a:8, ftm:4, fta:4, stl:1, blk:0, tov:2, pm:-6 },
      { date:"Jun 12", opp:"DEN", res:"W", min:32, pts:34, reb:6, ast:8, fgm:12, fga:22, fg3m:5, fg3a:11,ftm:5, fta:6, stl:3, blk:1, tov:1, pm:9 },
      { date:"Jun 10", opp:"PHX", res:"W", min:30, pts:28, reb:3, ast:5, fgm:10, fga:18, fg3m:4, fg3a:8, ftm:4, fta:5, stl:2, blk:0, tov:2, pm:7 },
      { date:"Jun 08", opp:"NYK", res:"L", min:33, pts:18, reb:5, ast:4, fgm:7,  fga:17, fg3m:2, fg3a:8, ftm:2, fta:3, stl:1, blk:0, tov:3, pm:-8 },
      { date:"Jun 05", opp:"DAL", res:"W", min:35, pts:38, reb:4, ast:9, fgm:14, fga:24, fg3m:6, fg3a:12,ftm:4, fta:4, stl:2, blk:0, tov:2, pm:14 },
      { date:"Jun 02", opp:"SAC", res:"W", min:31, pts:24, reb:6, ast:6, fgm:9,  fga:17, fg3m:3, fg3a:7, ftm:3, fta:4, stl:1, blk:0, tov:1, pm:5 },
    ],
    splits:[
      { label:"Home",                gp:41, pts:27.8, reb:4.9, ast:5.4, fgp:49.8, fg3p:43.1, tsp:65.2 },
      { label:"Away",                gp:41, pts:25.0, reb:4.5, ast:4.8, fgp:47.6, fg3p:41.5, tsp:62.4 },
      { label:"Wins",                gp:48, pts:28.3, reb:4.8, ast:5.8, fgp:50.2, fg3p:44.0, tsp:66.1 },
      { label:"Losses",              gp:34, pts:23.6, reb:4.5, ast:4.2, fgp:46.1, fg3p:39.8, tsp:60.3 },
      { label:"Clutch ≤5pt last 5m", gp:38, pts:29.1, reb:4.2, ast:5.0, fgp:48.8, fg3p:44.7, tsp:67.2 },
      { label:"vs Top-10 Def",       gp:28, pts:24.2, reb:4.6, ast:5.3, fgp:45.9, fg3p:40.1, tsp:61.8 },
      { label:"B2B Night 1",         gp:18, pts:26.7, reb:4.8, ast:5.0, fgp:48.4, fg3p:42.0, tsp:63.5 },
      { label:"B2B Night 2",         gp:18, pts:22.4, reb:4.2, ast:4.7, fgp:44.8, fg3p:38.8, tsp:59.1 },
    ],
    hustle:{ contested:4.2, deflections:1.8, looseBalls:0.9, charges:0.4, screenAssists:0.3, boxOuts:2.1, miles:2.68, speed:4.41 },
    zones:[
      { zone:"Restricted Area", fga:312, fgp:68.2, xfgp:64.1, pps:1.36, xpps:1.28, rating:"ELITE" },
      { zone:"Paint (Non-RA)",  fga:98,  fgp:41.8, xfgp:40.2, pps:0.84, xpps:0.80, rating:"AVG"   },
      { zone:"Mid-Range",       fga:142, fgp:44.4, xfgp:38.8, pps:0.89, xpps:0.78, rating:"POOR"  },
      { zone:"Left Corner 3",   fga:88,  fgp:43.2, xfgp:39.5, pps:1.30, xpps:1.19, rating:"ELITE" },
      { zone:"Right Corner 3",  fga:91,  fgp:45.1, xfgp:39.5, pps:1.35, xpps:1.19, rating:"ELITE" },
      { zone:"Above Break 3",   fga:386, fgp:40.9, xfgp:36.2, pps:1.23, xpps:1.09, rating:"GOOD"  },
      { zone:"Left Baseline",   fga:42,  fgp:38.1, xfgp:37.5, pps:0.76, xpps:0.75, rating:"POOR"  },
      { zone:"Right Baseline",  fga:38,  fgp:36.8, xfgp:37.5, pps:0.74, xpps:0.75, rating:"POOR"  },
    ],
    radar:{ scoring:90, shooting:98, playmaking:72, defense:55, efficiency:95 },
  },
};

// Comparison data
export const COMPARE_PLAYERS = {
  curry: { ...PLAYERS.curry, radar:{ scoring:90, shooting:98, playmaking:72, defense:55, efficiency:95 } },
  luka:  {
    name:"Luka Dončić", number:77, pos:"Point Guard", team:"Dallas Mavericks", teamAbbr:"DAL",
    age:25, height:"6'7\"", weight:"230 lbs",
    season:{ pts:33.9, reb:8.6, ast:9.6, stl:1.4, blk:0.5, fgp:46.2, fg3p:38.1, ftp:78.6, tsp:59.2, per:28.4, usage:37.8, ws:9.1, vorp:6.2, bpm:8.9, ortg:120.2, drtg:114.8, pm:5.4, gp:70, mpg:36.2, tov:4.2 },
    radar:{ scoring:98, shooting:75, playmaking:95, defense:48, efficiency:80 },
  },
};
