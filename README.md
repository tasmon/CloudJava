<p align="center">
  <img src="icon.png" alt="CloudJava icon" width="112" height="112">
</p>

## CloudJava for CloudPhone

<p>
  <a href="https://tasmon.github.io/CloudJava/"><img alt="Live on GitHub Pages" src="https://img.shields.io/badge/live-GitHub%20Pages-1971e6?logo=github&logoColor=white"></a>
  <img alt="Version 1.2.0" src="https://img.shields.io/badge/version-1.2.0-1f9d55">
  <img alt="Platform CloudPhone" src="https://img.shields.io/badge/platform-CloudPhone-0a84ff">
  <img alt="Screens QVGA and QQVGA" src="https://img.shields.io/badge/screen-240x320%20%7C%20128x160-555">
  <img alt="Java ME MIDP" src="https://img.shields.io/badge/Java%20ME-MIDP%20games-e76f00?logo=openjdk&logoColor=white">
  <img alt="Input keypad and touch" src="https://img.shields.io/badge/input-keypad%20%2B%20touch-8e44ad">
  <img alt="License GPLv3" src="https://img.shields.io/badge/license-GPLv3-blue">
</p>

**CloudJava** plays Java ME (J2ME) `.jar` games on CloudPhone. A fast, keypad- and touch-friendly launcher built for small screens, with your game library, settings and saves kept in the browser. Powered by [freej2me-web](https://github.com/zb3/freej2me-web).

Version 1.2.0 - Developer: Tasmon Islam

## Add to CloudPhone
1. Go to [CloudPhone Developer Page](https://www.cloudfone.com/my).  
2. Select **Add Widget**.  
3. Paste this Start URL:  
   `https://tasmon.github.io/CloudJava/`  
4. Upload icons if required (`icon.png` is included).  
5. Save and refresh - **CloudJava** will appear on your CloudPhone. 

## What's new in 1.2.0
- Scrolling fixed: every page can scroll to its very end on a keypad (Up/Down) or by touch.
- Real dialogs for uninstall / wipe data, and clear error messages when a game fails to install (the old page silently did nothing on CloudPhone).
- Branded as CloudJava.

## Features
- Instant launcher: opens without starting the Java engine
- Native-style keys in games, plus an on-screen keypad on touch phones
- Same dark UI everywhere, animated loading screen with progress
- Settings, Help and About pages

## Files
All files live in one folder (the repo root, next to `index.html`). Do not delete any of them; `init.zip` is needed on first run.

| File | Role |
|---|---|
| `index.html`, `home.css`, `home.js` | Instant launcher (Menu, Settings, Help, About) |
| `manage.html`, `launcher.js` | Add / manage games page |
| `run.html`, `main.js`, `key.js`, `eventqueue.js`, `screenKbd.js` | Game page, keys and on-screen keypad |
| `lib*.js`, `transcode.js`, `worker.js`, `worklet.js`, `*.wasm` | Graphics, audio and media support |
| `freej2me-web.jar`, `init.zip` | J2ME engine and first-run sample data |
| `cloudphone.css`, `cloudphone.js`, `icon.png` | CloudPhone/touch layer, loading screen and icon |

## Keys
Launcher: Up/Down + OK, left key = Menu/Select, right key = Back (home: native close).
In a game: left key tap = left soft key, hold = emulator menu (exit is there); right key = right soft key; arrows, OK, digits, `*` pass through. Set **Phone type = Standard** in the emulator menu if keys feel wrong (2/4/6/8 d-pad, 5 fire). Touch phones get an on-screen keypad.

## Known limits
- Games cannot use the network (the emulator's `Connector` is a stub), so apps like Opera Mini cannot connect.
- Loading progress % is an estimate; CheerpJ does not report download size.
- The Java engine needs internet on first load.

## Credits
Engine: [zb3/freej2me-web](https://github.com/zb3/freej2me-web) (GPLv3), based on FreeJ2ME. Java runtime: [CheerpJ](https://cheerpj.com).
