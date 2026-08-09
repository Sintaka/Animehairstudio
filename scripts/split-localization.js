// split-localization.js — split the JA/ZH dictionaries out of localization.js
// into modules/loc-ja.js and modules/loc-zh.js (zero logic change), then bump
// cache-busting query strings for the touched import chain.
// Run: node scripts/split-localization.js
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const LOC = path.join(ROOT, "modules", "localization.js");
const JA_OUT = path.join(ROOT, "modules", "loc-ja.js");
const ZH_OUT = path.join(ROOT, "modules", "loc-zh.js");
const APP = path.join(ROOT, "app.js");
const HTML = path.join(ROOT, "index.html");

const src = fs.readFileSync(LOC, "utf8");
const lines = src.split(/\r?\n/);
// 1-based line numbers from earlier inspection:
// 10: const JA = Object.freeze({   ... 678: });
// 680: const ZH = Object.freeze({  ... 1335: });
function must(cond, msg) { if (!cond) throw new Error("ASSERT FAILED: " + msg); }
must(lines[9].trim() === "const JA = Object.freeze({", "JA start");
must(lines[677].trim() === "});", "JA end");
must(lines[679].trim() === "const ZH = Object.freeze({", "ZH start");
must(lines[1334].trim() === "});", "ZH end");
must(lines[1336].trim().startsWith("export function normalizeLanguage"), "tail start");

const CRLF = "\r\n";
const jaBody = lines.slice(9, 678);   // includes "const JA = Object.freeze({"
const zhBody = lines.slice(679, 1335); // includes "const ZH = Object.freeze({"
jaBody[0] = "export default Object.freeze({";
zhBody[0] = "export default Object.freeze({";

function writeOut(file, body) {
  fs.writeFileSync(file, body.join(CRLF) + CRLF, "utf8");
}

writeOut(JA_OUT, [
  "// JA dictionary data — split from localization.js (refactor).",
  "// Loaded only by modules/localization.js. Keep entries in sync with the EN fallback.",
  "", ...jaBody
]);
writeOut(ZH_OUT, [
  "// ZH dictionary data — split from localization.js (refactor).",
  "// Loaded only by modules/localization.js. Keep entries in sync with the EN fallback.",
  "", ...zhBody
]);

// New localization.js: imports + header + tail, LANGUAGE_DICTIONARIES points to the new files.
const header = lines.slice(0, 9); // SUPPORTED_LANGUAGES / DEFAULT_LANGUAGE / LANGUAGE_STORAGE_KEY + blank
const tail = lines.slice(1336);   // normalizeLanguage onward
const newLoc = [
  'import jaDictionary from "./loc-ja.js?v=20260809-1";',
  'import zhDictionary from "./loc-zh.js?v=20260809-1";',
  "",
  ...header,
  "const LANGUAGE_DICTIONARIES = Object.freeze({ ja: jaDictionary, zh: zhDictionary });",
  ...tail
].join(CRLF) + CRLF;
// strip the old LANGUAGE_DICTIONARIES line from tail (it is in lines 1341-1342)
const oldDictRe = /const LANGUAGE_DICTIONARIES = Object\.freeze\(\{ ja: JA, zh: ZH \}\);\r?\n?/;
if (!oldDictRe.test(newLoc)) {
  // if pattern differs, locate and remove by marker
  const idx = newLoc.indexOf("const LANGUAGE_DICTIONARIES");
  if (idx >= 0) {
    const lineEnd = newLoc.indexOf(CRLF, idx);
    const after = newLoc.slice((lineEnd >= 0 ? lineEnd + CRLF.length : newLoc.length));
    const before = newLoc.slice(0, idx);
    fs.writeFileSync(LOC, (before + after).replace(/\r?\n{3,}/, CRLF + CRLF), "utf8");
    console.log("localization.js rewritten (old LANGUAGE_DICTIONARIES line removed inline).");
  } else {
    throw new Error("could not locate LANGUAGE_DICTIONARIES");
  }
} else {
  fs.writeFileSync(LOC, newLoc.replace(oldDictRe, "const LANGUAGE_DICTIONARIES = Object.freeze({ ja: jaDictionary, zh: zhDictionary });" + CRLF), "utf8");
  console.log("localization.js rewritten via regex replace.");
}

// bump cache-busting query strings
let app = fs.readFileSync(APP, "utf8");
app = app.replace('"./modules/localization.js?v=20260806-46"', '"./modules/localization.js?v=20260809-1"');
fs.writeFileSync(APP, app, "utf8");

let html = fs.readFileSync(HTML, "utf8");
html = html.replace('src="./app.js?v=20260808-34"', 'src="./app.js?v=20260809-1"');
fs.writeFileSync(HTML, html, "utf8");

console.log("OK: loc-ja.js + loc-zh.js created; localization.js shrunk; cache busters bumped.");
