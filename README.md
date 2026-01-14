# GitHub Activity CLI

A lightweight and dependency-free command line tool to fetch and display the most recent public activity of any GitHub user directly in your terminal.

This project was built to practice working with public APIs, JSON data handling, CLI design, and Node.js core features without relying on external libraries.

---

## ✨ Features

* Fetches recent GitHub user activity using the GitHub Events API
* Clean, human-readable output in the terminal
* Optional JSON output for scripting or automation
* Activity limit control
* Colored terminal output (no external libs)
* Local cache to reduce API calls and avoid rate limits
* Graceful error handling
* Zero external dependencies

---

## 📦 Installation

You can install the CLI globally using npm:

```bash
npm install -g github-activity
```

Or run it locally using Node.js:

```bash
node index.js <username>
```

---

## 🚀 Usage

```bash
github-activity <username> [options]
```

### Options

* `--limit=<number>`
  Limits the number of activities displayed (default: 10)

* `--json`
  Outputs the raw activity data in JSON format

### Examples

```bash
github-activity torvalds
```

```bash
github-activity torvalds --limit=5
```

```bash
github-activity torvalds --json
```

---

## 🧠 How It Works

1. Reads the GitHub username from CLI arguments
2. Fetches recent events from the GitHub public API
3. Stores responses in a local cache for 5 minutes
4. Transforms raw event data into readable activity messages
5. Displays the result in the terminal

---

## 🧪 Testing

Basic environment tests can be run with:

```bash
node test.js
```

---

## 🛠 Tech Stack

* Node.js (ES Modules)
* GitHub REST API
* Native `fetch`
* File system caching

---

## 📌 Notes

* No authentication is required (public GitHub data)
* Rate limits apply when cache expires
* Designed to be simple, readable, and extendable

---

## 📄 License

MIT License

---

## 👤 Author

Vitto — Fullstack Developer  
Passionate about backend tooling, automation, and clean JavaScript architectures.  
