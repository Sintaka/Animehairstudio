import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import os from "node:os";
const ROOT = path.resolve(import.meta.dirname, "..");
const port = 8094, cdpPort = 9230;
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const profile = path.join(os.tmpdir(), "ahs-diag-" + cdpPort);
const MIME = { ".html":"text/html",".js":"text/javascript",".mjs":"text/javascript",".json":"application/json",".svg":"image/svg+xml",".png":"image/png",".css":"text/css" };
const server = http.createServer((req,res)=>{ const url=new URL(req.url,"http://localhost"); let f=path.normalize(path.join(ROOT,decodeURIComponent(url.pathname))); if(!f.startsWith(ROOT)){res.writeHead(403);res.end();return;} if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,"index.html"); if(!fs.existsSync(f)){res.writeHead(404);res.end();return;} res.writeHead(200,{"Content-Type":MIME[path.extname(f).toLowerCase()]||"application/octet-stream"}); fs.createReadStream(f).pipe(res); });
await new Promise(r=>server.listen(port,"127.0.0.1",r));
fs.rmSync(profile,{recursive:true,force:true});
const chrome = spawn(CHROME,["--headless=new",`--remote-debugging-port=${cdpPort}`,`--user-data-dir=${profile}`,"--no-first-run","--disable-gpu","about:blank"],{stdio:"ignore"});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
try {
  for(let i=0;i<40;i++){try{const r=await fetch(`http://127.0.0.1:${cdpPort}/json/version`);if(r.ok)break;}catch{}await sleep(300);}
  const list=await fetch(`http://127.0.0.1:${cdpPort}/json/list`).then(r=>r.json());
  const page=list.find(t=>t.type==="page");
  const ws=new WebSocket(page.webSocketDebuggerUrl); let seq=0; const pending=new Map(); const events=[];
  ws.onmessage=e=>{const m=JSON.parse(e.data); if(m.id&&pending.has(m.id)){pending.get(m.id)(m.result);pending.delete(m.id);} else if(m.method) events.push(m);};
  await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j;});
  const send=(method,params={})=>new Promise(res=>{const id=++seq;pending.set(id,res);ws.send(JSON.stringify({id,method,params}));});
  const evl=async exp=>{const r=await send("Runtime.evaluate",{expression:exp,awaitPromise:true,returnByValue:true});return r.result?.value;};
  await send("Page.enable"); await send("Runtime.enable"); await send("Log.enable"); await send("Network.enable");
  await send("Page.navigate",{url:`http://127.0.0.1:${port}/`}); await sleep(10000);
  const data=fs.readFileSync("D:/Downloads/Sussurro_v1_0043.ahs","base64");
  await evl(`(async()=>{const bin=atob('${data}');const b=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)b[i]=bin.charCodeAt(i);const f=new File([b],'x.ahs');const dt=new DataTransfer();dt.items.add(f);document.body.dispatchEvent(new DragEvent('drop',{bubbles:true,dataTransfer:dt}));await new Promise(r=>setTimeout(r,600));const d=document.querySelector('#dropImportDialog');if(d&&d.open){document.querySelector('#confirmDropImport').click();}return 1;})()`);
  await sleep(8000);
  // collect console API calls (error) and log entries
  const errs = events.filter(e=>e.method==="Runtime.consoleAPICalled" && ["error","warning"].includes(e.params?.type));
  const failed = events.filter(e=>e.method==="Network.loadingFailed" || (e.method==="Network.responseReceived" && [403,404,500].includes(e.params?.response?.status)));
  console.log("failed requests:");
  for (const e of failed.slice(-8)) {
    const req = events.find(x=>x.method==="Network.requestWillBeSent" && x.params?.requestId===e.params?.requestId);
    console.log("  ", e.method, req?.params?.request?.url || e.params?.response?.status, req?.params?.request?.url?.slice(0,120));
  }
  const logs = events.filter(e=>e.method==="Log.entryAdded");
  console.log("consoleAPICalled errors:", errs.length);
  for (const e of errs.slice(-10)) {
    const args = (e.params.args||[]).map(a=>a.value!==undefined?a.value:a.description).join(" | ");
    console.log("  ", args.slice(0,400));
  }
  console.log("Log entries:", logs.length);
  for (const e of logs.slice(-6)) console.log("  ", e.params.entry.level, (e.params.entry.text||"").slice(0,250));
  console.log("status:", await evl(`(document.querySelector('#presetLibraryStatus')||{}).textContent || ''`));
  console.log("dialogOpen:", await evl(`!!document.querySelector('#dropImportDialog')?.open`));
  ws.close();
} catch(e){console.error("ERR",e.message);}
finally{chrome.kill();setTimeout(()=>{try{fs.rmSync(profile,{recursive:true,force:true});}catch{}},500);server.close();}
