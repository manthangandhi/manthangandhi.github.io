/** Ankit & Kajal wedding tracker Google Apps Script companion.
 * Setup: run setupWeddingSheet(), set script property AK_ACCESS_PIN (16+ chars),
 * deploy Web App execute as Me, accessible to Anyone. Share PIN only with trusted coordinators.
 * This is NOT robust multi-user authentication; avoid sensitive guest financial data until secured.
 */
const TABLES=['departments','tasks','events','guests','vendors','payments','issues','inventory','transport'];
function setupWeddingSheet(){
 const p=PropertiesService.getScriptProperties();
 const existing=p.getProperty('AK_SPREADSHEET_ID');
 const book=existing?SpreadsheetApp.openById(existing):SpreadsheetApp.create('Ankit & Kajal Wedding Operations');
 p.setProperty('AK_SPREADSHEET_ID',book.getId());
 TABLES.forEach(name=>{const tab=book.getSheetByName(name)||book.insertSheet(name);if(!tab.getLastRow())tab.appendRow(['id','record_json','last_updated']);tab.setFrozenRows(1)});
 Logger.log(book.getUrl());return book.getUrl();
}
function verify_(pin){
 const stored=PropertiesService.getScriptProperties().getProperty('AK_ACCESS_PIN');
 if(!stored||stored.length<16)throw Error('Set a strong AK_ACCESS_PIN in Script Properties');
 if(!pin||pin!==stored)throw Error('Unauthorized');
}
function getBook_(){const id=PropertiesService.getScriptProperties().getProperty('AK_SPREADSHEET_ID');if(!id)throw Error('Run setupWeddingSheet first');return SpreadsheetApp.openById(id)}
function loadData(pin){
 verify_(pin);const book=getBook_(),out={};
 TABLES.forEach(name=>{const tab=book.getSheetByName(name);if(!tab){out[name]=[];return}const last=tab.getLastRow();const vals=last>1?tab.getRange(2,1,last-1,2).getValues():[];out[name]=vals.map(row=>{try{return JSON.parse(row[1])}catch(e){return null}}).filter(Boolean)});
 return out;
}
function saveData(pin,payload){
 verify_(pin);if(!payload||typeof payload!=='object')throw Error('Bad payload');
 const str=JSON.stringify(payload);if(str.length>2000000)throw Error('Payload too large');
 for(const table of TABLES){if(!Array.isArray(payload[table]))throw Error('Missing table '+table);if(payload[table].length>10000)throw Error('Table too large '+table)}
 const lock=LockService.getScriptLock();lock.waitLock(25000);
 try{
  const book=getBook_();const updated=new Date();
  TABLES.forEach(name=>{const tab=book.getSheetByName(name);if(!tab)throw Error('Missing sheet '+name);const rows=payload[name];const last=tab.getLastRow();if(last>1)tab.getRange(2,1,last-1,3).clearContent();if(rows.length)tab.getRange(2,1,rows.length,3).setValues(rows.map(x=>[String(x.id||''),JSON.stringify(x),updated]))});
  SpreadsheetApp.flush();return {ok:true,updated:updated.toISOString()};
 }finally{lock.releaseLock()}
}
function doGet(){return HtmlService.createHtmlOutputFromFile('Bridge').setTitle('Wedding Sheets Bridge').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)}
