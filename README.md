## J2ME Emulator for CloudPhone

An instant, touch- and keypad-friendly launcher for [freej2me-web](https://github.com/zb3/freej2me-web). The game library, per-game settings, saves and launcher preferences are kept in the browser's storage after the files load from GitHub Pages. The home screen opens without starting the Java engine; the engine only starts when you play a game.

Version 1.1.0 - Developer: Tasmon Islam

## Add to CloudPhone
1. Go to [CloudPhone Developer Page](https://www.cloudfone.com/my).  
2. Select **Add Widget**.  
3. Paste this Start URL:  
   `https://tasmon.github.io/CloudJava/`  
4. Upload icons if required (`icon.png` is included).  
5. Save and refresh - **J2ME Emulator** will appear on your CloudPhone. 

## Files
All files live in one folder (the repo root, next to `index.html`). Do not delete any of them; `init.zip` is needed on first run.

| File | Role |
|---|---|
| `index.html`, `home.css`, `home.js` | Instant launcher (Menu, Settings, Help, About) |
| `manage.html`, `launcher.js` | Add / manage games page |
| `run.html`, `main.js`, `key.js`, `eventqueue.js`, `screenKbd.js` | Game page, keys and on-screen keypad |
| `lib*.js`, `transcode.js`, `worker.js`, `worklet.js`, `*.wasm` | Graphics, audio and media support |
| `freej2me-web.jar`, `init.zip` | J2ME engine and first-run sample data |
| `cloudphone.css`, `cloudphone.js`, `icon.png` | CloudPhone/touch layer and icon |

## Changes in 1.1.0
- Native-style keys in games: left key tap = left soft key, hold = emulator menu; right key = right soft key; `*` and `#` mapped; arrows, OK and digits pass through. On exit the launcher uses its normal button layout again.
- Same dark UI across the launcher, manager and game page.
- Animated loading screen with an estimated progress percentage.
- Help page scrolls; About page lists credits.

## Known limits
- Games cannot use the network (the emulator's `Connector` is a stub), so apps like Opera Mini cannot connect.
- Progress % is an estimate; CheerpJ does not report download size.

## Keys
Launcher: Up/Down + OK, left key = Menu/Select, right key = Back (home: native close). In a game: left key tap = left soft key, hold = emulator options (exit is there); right key = right soft key; set **Phone type = Standard** if keys feel wrong (2/4/6/8 d-pad, 5 fire). Touch phones get an on-screen keypad.

Engine: [zb3/freej2me-web](https://github.com/zb3/freej2me-web) (GPLv3), running on CheerpJ.
