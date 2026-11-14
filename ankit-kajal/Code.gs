/**
 * Ankit & Kajal Wedding Sheets.
 * One-time: create Apps Script project, paste Code.gs + Bridge.html,
 * select setupWeddingSheet, click Run, approve Google consent.
 * Copy spreadsheet URL and PIN from Execution logs.
 * Deploy Web App (Execute as Me, Anyone), configure URL + PIN in website.
 * WARNING: Shared PIN is NOT per-user authentication.
 */
const TABLES=['departments','tasks','events','guests','vendors','payments','issues','inventory','transport'];
const DEPARTMENTS=['Invitations & RSVP','Guest Reception','Accommodation','Transportation','VIP & Elderly Care','Haldi & Mehendi','Sangeet & Entertainment','Wedding Rituals','Baraat & Procession','Bride & Groom Readiness','Venue Management','Decoration & Florals','Catering & Food','Photography & Video','Sound, Light & Technical','Vendor Coordination','Inventory & Gifts','Finance & Payments','Security & Valuables','Medical & Emergency','Parking & Traffic','Family Coordination','Communication & Announcements','Troubleshooting & Contingency'];
const EVENTS=['Mehendi','Haldi','Sangeet','Baraat','Shaadi','Reception','Vidaai'];
const DISPLAY_COLUMNS={departments:['name','lead','phone','backup','backupPhone','status','notes'],tasks:['title','department','owner','due','priority','status','notes'],events:['name','date','venue','captain','phone','status','notes'],guests:['name','phone','side','rsvp','party','room','arrival','transport','notes'],vendors:['name','service','contact','phone','amount','paid','arrival','status','notes'],payments:['item','category','vendor','amount','paid','due','status','notes'],issues:['title','department','owner','severity','status','notes'],inventory:['item','category','quantity','owner','location','status','notes'],transport:['name','driver','phone','pickup','drop','departure','guests','status']};
function visible_(sheet,tab,items){const keys=DISPLAY_COLUMNS[tab];sheet.getRange(1,4,1,keys.length).setValues([keys]).setBackground('#a97762').setFontColor('#ffffff').setFontWeight('bold');keys.forEach((key,i)=>sheet.setColumnWidth(4+i,key==='notes'?300:155));if(items.length){sheet.getRange(2,4,items.length,keys.length).setNumberFormat('@');sheet.getRange(2,4,items.length,keys.length).setValues(items.map(r=>keys.map(k=>{let x=String(r[k]??'');return /^[=+@-]/.test(x)?"'"+x:x})))}}
function setupWeddingSheet(){
 const p=PropertiesService.getScriptProperties(),id=p.getProperty('AK_SPREADSHEET_ID');
 const book=id?SpreadsheetApp.openById(id):SpreadsheetApp.create('Ankit & Kajal | Wedding Command Centre');
 p.setProperty('AK_SPREADSHEET_ID',book.getId());
 if(!p.getProperty('AK_ACCESS_PIN'))p.setProperty('AK_ACCESS_PIN',Utilities.getUuid().replace(/-/g,'')+Utilities.getUuid().replace(/-/g,''));
 TABLES.forEach(function(tab){
  const s=book.getSheetByName(tab)||book.insertSheet(tab);
  if(s.getLastRow()===0)s.getRange(1,1,1,3).setValues([['id','record_json','last_updated']]);
  s.setFrozenRows(1);s.getRange(1,1,1,3).setBackground('#80364b').setFontColor('#ffffff').setFontWeight('bold');s.setColumnWidth(1,180);s.setColumnWidth(2,630);s.setColumnWidth(3,180);
  if(s.getLastRow()===1&&tab==='departments')s.getRange(2,1,DEPARTMENTS.length,3).setValues(DEPARTMENTS.map(function(name,i){let rid='dept-'+String(i+1).padStart(2,'0');return[rid,JSON.stringify({id:rid,name:name,lead:'',phone:'',backup:'',backupPhone:'',status:'Unassigned',notes:''}),new Date()]}));
  if(s.getLastRow()===1&&tab==='events')s.getRange(2,1,EVENTS.length,3).setValues(EVENTS.map(function(name,i){let rid='evt-'+String(i+1).padStart(2,'0');return[rid,JSON.stringify({id:rid,name:name,date:'',venue:'',captain:'',phone:'',status:'Planning',notes:''}),new Date()]}));
  const rows=s.getLastRow()>1?s.getRange(2,2,s.getLastRow()-1,1).getValues().map(r=>{try{return JSON.parse(r[0])}catch(e){return {}}}):[];
  visible_(s,tab,rows);
 });
 const first=book.getSheetByName('Sheet1');if(first&&book.getSheets().length>1&&first.getLastRow()===0)book.deleteSheet(first);
 SpreadsheetApp.flush();
 const pin=p.getProperty('AK_ACCESS_PIN');
 Logger.log('SUCCESS: Your wedding spreadsheet is ready.');
 Logger.log('GOOGLE SHEET URL: '+book.getUrl());
 Logger.log('ACCESS PIN (KEEP PRIVATE): '+pin);
 Logger.log('Deploy as Web App, then enter its /exec URL and this PIN in the wedding tracker Settings.');
 return {ok:true,spreadsheetUrl:book.getUrl(),accessPin:pin};
}
function auth_(pin){const val=PropertiesService.getScriptProperties().getProperty('AK_ACCESS_PIN');if(!val||val.length<16)throw Error('Run setupWeddingSheet() first');if(typeof pin!=='string'||pin!==val)throw Error('Invalid access PIN')}
function book_(){const id=PropertiesService.getScriptProperties().getProperty('AK_SPREADSHEET_ID');if(!id)throw Error('Run setupWeddingSheet() first');return SpreadsheetApp.openById(id)}
function loadData(pin){auth_(pin);const b=book_(),out={};TABLES.forEach(function(tab){const s=b.getSheetByName(tab);if(!s)throw Error('Missing tab '+tab);const n=s.getLastRow()-1,rows=n>0?s.getRange(2,1,n,2).getValues():[];out[tab]=rows.filter(r=>r[0]&&r[1]).map(function(r){try{return JSON.parse(r[1])}catch(e){throw Error('Invalid record in '+tab+': '+r[0])}})});return out}
function saveData(pin,payload){
 auth_(pin);if(!payload||typeof payload!=='object')throw Error('Invalid payload');
 const prepared={};
 TABLES.forEach(function(tab){const a=payload[tab];if(!Array.isArray(a))throw Error('Missing array '+tab);if(a.length>10000)throw Error('Too many '+tab);prepared[tab]=a.map(function(r){if(!r||typeof r!=='object'||!r.id)throw Error('Invalid '+tab+' record');const j=JSON.stringify(r);if(j.length>40000)throw Error('Record too large');return[String(r.id),j,new Date()]})});
 const lock=LockService.getScriptLock();lock.waitLock(30000);
 try{const b=book_();TABLES.forEach(function(tab){const s=b.getSheetByName(tab),n=Math.max(0,s.getLastRow()-1);if(n)s.getRange(2,1,n,3+DISPLAY_COLUMNS[tab].length).clearContent();if(prepared[tab].length)s.getRange(2,1,prepared[tab].length,3).setValues(prepared[tab]);visible_(s,tab,payload[tab])});SpreadsheetApp.flush();return{ok:true,updated:new Date().toISOString()}}finally{lock.releaseLock()}
}
function doGet(){return HtmlService.createHtmlOutputFromFile('Bridge').setTitle('Ankit & Kajal Sheets Bridge').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)}
