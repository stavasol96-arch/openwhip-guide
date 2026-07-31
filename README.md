# How to Install OpenWhip

My guide to setting up **OpenWhip** — a joke desktop app that puts a whip overlay on your screen and "whips" Claude Code to go faster.

Everything you need is below: install steps, the macOS permission that trips everyone up, and what the app actually does before you point it at your terminal.

---

## What it actually does

Click the whip and it fires a keyboard macro into **whatever window is focused**:

1. Sends **Ctrl+C** — in Claude Code, this interrupts the running task
2. Types a random phrase — `FASTER`, `Faster CLANKER`, `Speed it up clanker`
3. Presses **Enter**

That's the whole trick. It's a gag, and a good one.

**It does not make Claude faster, and it does not help with session limits.** Interrupting a task mid-run and re-prompting usually costs *more* tokens, because finished work gets thrown away and redone.

---

## Requirements

- macOS, Windows, or Linux
- [Node.js](https://nodejs.org) 18 or newer

Check what you have:

```bash
node --version
```

If that errors, install Node first. On macOS with [Homebrew](https://brew.sh):

```bash
brew install node
```

---

## Install

```bash
npm install -g openwhip
openwhip
```

The first command pulls in Electron (~100MB), so give it a minute. The second launches the app and returns immediately to an empty prompt — that's normal, it detaches to the background.

Look for the whip icon in your **menu bar** (macOS, top right) or **system tray** (Windows/Linux).

---

## Grant Accessibility permission (macOS)

The macro types keystrokes, which macOS blocks by default.

The first time you click the whip, macOS prompts for permission. Approve it, or set it manually:

**System Settings → Privacy & Security → Accessibility** → enable the toggle for the app.

Without this the animation still plays but nothing gets typed — the most common "it's not working" case.

On Linux you need `xdotool`:

```bash
sudo apt install xdotool
```

---

## Usage

1. Click the tray icon → the whip overlay appears
2. Click the whip → the macro fires
3. Click the tray icon again to dismiss

---

## Two things to know before you use it

**It types into whatever window has focus.** The app tries to restore your previous window with a Cmd+Tab before firing, on a fixed timer. If focus lands somewhere else — Slack, an email draft, a terminal sitting at a `sudo` prompt — that's where `Faster CLANKER` gets typed, followed by Enter. Keep your Claude Code terminal focused when you click.

**It interrupts.** The macro leads with Ctrl+C. Clicking it during a task you care about kills that task.

---

## Uninstall

```bash
npm uninstall -g openwhip
```

Then revoke the Accessibility permission in System Settings → Privacy & Security → Accessibility.

---

## Is it safe?

I read the source of `openwhip@1.1.0` before installing. No network calls, no telemetry, no file access beyond its own icons, no obfuscation. It does what it advertises.

Two caveats worth stating plainly:

- It needs **Accessibility permission**, which lets it synthesize keystrokes system-wide — not just in your terminal.
- It's published by a pseudonymous maintainer. My read covers version 1.1.0 only; I can't vouch for future versions.

Read it yourself before trusting a stranger's summary — including mine:

```bash
npm pack openwhip && tar xzf openwhip-*.tgz && cat package/main.js
```

---

## Credits

OpenWhip is by **[GitFrog1111](https://github.com/GitFrog1111/OpenWhip)** — MIT licensed.

This repo is the guide, not the app — install it from npm with the steps above.
