#!/usr/bin/env node
import fs from "fs";
import path from "path";
// 1. Leer argumentos de la CLI
const args = process.argv.slice(2);
const username = args.find(arg => !arg.startsWith("--"));
const limitArg = args.find(arg => arg.startsWith("--limit="));
const limit = limitArg.split("=")[1]
const jsonOutput = args.includes("--json");

const CACHE_DIR = path.resolve(".cache");
const CACHE_FILE = path.join(CACHE_DIR, `${username}.json`);
const CACHE_TTL = 1000 * 60 * 5;

const colors = {
  green: text => `\x1b[32m${text}\x1b[0m`,
  red: text => `\x1b[31m${text}\x1b[0m`,
  yellow: text => `\x1b[33m${text}\x1b[0m`,
  blue: text => `\x1b[34m${text}\x1b[0m`
};
function readCache() {
  if (!fs.existsSync(CACHE_FILE)) return null;

  const { timestamp, data } = JSON.parse(fs.readFileSync(CACHE_FILE));
  if (Date.now() - timestamp > CACHE_TTL) return null;

  return data;
}

function writeCache(data) {
  if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR);
  fs.writeFileSync(
    CACHE_FILE,
    JSON.stringify({ timestamp: Date.now(), data }, null, 2)
  );
}

if (!username) {
  console.error("❌ Please provide a GitHub username");
  console.log("Usage: github-activity <username> [--limit=5] [--json]");
  process.exit(1);
}

// 2. URL de la API
const url = `https://api.github.com/users/${username}/events`;

// 3. Función para obtener datos (fetch nativo en Node 18+)
async function fetchActivity() {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "github-activity-cli"
      }
    });

    if (response.status === 404) {
      console.error("❌ User not found");
      return;
    }

    if (!response.ok) {
      console.error("❌ GitHub API error:", response.status);
      return;
    }
    let events = readCache();
    if (!events) {
        const response = await fetch(url, {
            headers: { "User-Agent": "github-activity-cli" }
        });

        if (response.status === 404) {
            console.error(colors.red("❌ User not found"));
            return;
        }

        if (!response.ok) {
            console.error(colors.red(`❌ GitHub API error: ${response.status}`));
            return;
        }

        events = await response.json();
        writeCache(events);
        }
    if (events.length === 0) {
      console.log("No recent activity found.");
      return;
    }
    if (jsonOutput) {
        console.log(JSON.stringify(events.slice(0, limit), null, 2));
        return;
    }

    events.slice(0, limit).forEach(event => {
        const repo = event.repo?.name || "unknown repo";
        const push = events.filter(e => e.type ==="PushEvent")
        switch (event.type) {
            case "PushEvent":
            console.log(
                colors.green(`- Pushed ${push.length} commits to ${repo}`)
            );
            break;

            case "IssuesEvent":
            console.log(
                colors.yellow(`- ${event.payload.action} an issue in ${repo}`)
            );
            break;

            case "WatchEvent":
            console.log(
                colors.blue(`- Starred ${repo}`)
            );
            break;

            default:
            console.log(
                `- ${event.type.replace("Event", "")} in ${repo}`
            );
        }
    });


  } catch (error) {
    console.error("❌ Network error:", error.message);
  }
}

fetchActivity();
