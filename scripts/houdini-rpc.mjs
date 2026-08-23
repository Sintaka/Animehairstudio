// TEMP: minimal hwebserver RPC client for the live Houdini instance (fxhoudinimcp plugin).
// Protocol (from site-packages/fxhoudinimcp/bridge.py):
//   POST /api  Content-Type: application/x-www-form-urlencoded
//   json=["mcp.execute", [], {command, params, request_id}]
// Usage: node scripts/tmp-hou-rpc.mjs <command> '<paramsJson>' [port]
// DELETE after the Houdini bend investigation is done.
import http from "node:http";
import { randomUUID } from "node:crypto";

const PORT = Number(process.argv[4] || process.env.HOU_PORT || 8101);
if (PORT === 8100) throw new Error("refusing port 8100 — user reserved it");

export function rpc(func, kwargs, port = PORT, timeoutMs = 120000) {
  const body = new URLSearchParams({ json: JSON.stringify([func, [], kwargs]) }).toString();
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        host: "127.0.0.1",
        port,
        path: "/api",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(body)
        },
        timeout: timeoutMs
      },
      (res) => {
        let data = "";
        res.setEncoding("utf8");
        res.on("data", (c) => { data += c; });
        res.on("end", () => {
          try { resolve(JSON.parse(data)); } catch { resolve({ raw: data, status_code: res.statusCode }); }
        });
      }
    );
    req.on("timeout", () => req.destroy(new Error(`timeout after ${timeoutMs}ms`)));
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

export const execute = (command, params = {}, port = PORT) =>
  rpc("mcp.execute", { command, params, request_id: randomUUID() }, port);

export const health = (port = PORT) => rpc("mcp.health", {}, port);

// Run python inside Houdini. Returns the handler payload.
export const py = (code, port = PORT) => execute("code.execute_python", { code }, port);

import { pathToFileURL } from "node:url";
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [, , command, paramsJson] = process.argv;
  const out = command === "health"
    ? await health()
    : command === "commands"
      ? await rpc("mcp.list_commands", {})
      : await execute(command, paramsJson ? JSON.parse(paramsJson) : {});
  console.log(JSON.stringify(out, null, 2));
}
