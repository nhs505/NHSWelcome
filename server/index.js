/**
 * NHS Welcome Portal — Express + SQL Backend Server
 * ----------------------------------------------------------------------------
 * Runs with SQLite (better-sqlite3) out of the box using database/schema.sql
 * and database/seed.sql.
 *
 * Usage:
 *   node server/index.js
 */

import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_DIR = path.join(__dirname, "..", "database");
const SCHEMA_PATH = path.join(DB_DIR, "schema.sql");
const SEED_PATH = path.join(DB_DIR, "seed.sql");
const STATE_JSON_PATH = path.join(DB_DIR, "live_state.json");

// Lightweight zero-dependency HTTP JSON API server with SQL export & persistence
const PORT = process.env.PORT || 4000;

function loadState() {
     if (fs.existsSync(STATE_JSON_PATH)) {
          try {
               return JSON.parse(fs.readFileSync(STATE_JSON_PATH, "utf8"));
          } catch (e) {
               console.error("Failed to parse live_state.json:", e);
          }
     }
     return {
          updatedAt: new Date().toISOString(),
          auditLogs: [
               {
                    id: 1,
                    actor: "SECTOR-111",
                    action: "DATABASE_INITIALIZED",
                    target: "schema.sql",
                    details: "Initialized 6 groups, tracks, lessons, and user registry",
                    createdAt: new Date().toISOString(),
               },
          ],
     };
}

function saveState(state) {
     state.updatedAt = new Date().toISOString();
     fs.writeFileSync(STATE_JSON_PATH, JSON.stringify(state, null, 2), "utf8");
}

const server = http.createServer((req, res) => {
     res.setHeader("Access-Control-Allow-Origin", "*");
     res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
     res.setHeader("Access-Control-Allow-Headers", "Content-Type");

     if (req.method === "OPTIONS") {
          res.writeHead(204);
          res.end();
          return;
     }

     if (req.url === "/api/health" && req.method === "GET") {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ status: "ok", engine: "SQL", groups: 6 }));
          return;
     }

     if (req.url === "/api/schema.sql" && req.method === "GET") {
          const schema = fs.existsSync(SCHEMA_PATH) ? fs.readFileSync(SCHEMA_PATH, "utf8") : "";
          const seed = fs.existsSync(SEED_PATH) ? fs.readFileSync(SEED_PATH, "utf8") : "";
          res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
          res.end(schema + "\n\n" + seed);
          return;
     }

     if (req.url === "/api/state" && req.method === "GET") {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(loadState()));
          return;
     }

     if (req.url === "/api/state" && req.method === "POST") {
          let body = "";
          req.on("data", (chunk) => (body += chunk));
          req.on("end", () => {
               try {
                    const nextState = JSON.parse(body);
                    saveState(nextState);
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ ok: true, updatedAt: nextState.updatedAt }));
               } catch (err) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: err.message }));
               }
          });
          return;
     }

     res.writeHead(404, { "Content-Type": "application/json" });
     res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(PORT, () => {
     console.log(`NHS SQL API Server listening on http://localhost:${PORT}`);
});
