<p align="center">
  <img src="icon.png" alt="CloudJava icon" width="112" height="112">
</p>

## CloudJava for CloudPhone

<p>
  <img alt="Version 2.0.1" src="https://img.shields.io/badge/version-2.0.1-1f9d55">
  <img alt="Platform CloudPhone" src="https://img.shields.io/badge/platform-CloudPhone-0a84ff">
  <img alt="Android, iOS, desktop" src="https://img.shields.io/badge/works%20on-Android%20%7C%20iPhone%20%7C%20iPad%20%7C%20desktop-555">
  <img alt="Installable PWA" src="https://img.shields.io/badge/PWA-installable-5a0fc8?logo=pwa&logoColor=white">
  <img alt="Java ME MIDP" src="https://img.shields.io/badge/Java%20ME-MIDP%20apps-e76f00?logo=openjdk&logoColor=white">
  <img alt="Input keypad and touch" src="https://img.shields.io/badge/input-keypad%20%2B%20touch-8e44ad">
  <img alt="License GPLv3" src="https://img.shields.io/badge/license-GPLv3-blue">
</p>

**CloudJava** runs classic Java ME (J2ME) `.jar` apps and games in your browser. It is built for CloudPhone feature phones (240x320 and 128x160 screens) and also works on modern phones, tablets and computers. Your apps, settings and saves stay in your browser.

Version 2.0.1 - Developer: Tasmon Islam

## Add to CloudPhone
1. Go to [CloudPhone Developer Page](https://www.cloudfone.com/my).  
2. Select **Add Widget**.  
3. Paste this Start URL:  
   `https://tasmon.github.io/CloudJava/`  
4. Upload icons if required (`icon.png` is included).  
5. Save and refresh - **CloudJava** will appear on your CloudPhone. 

## Use it on any device
CloudJava is a web app, so it opens in any modern browser:

| Device | How |
|---|---|
| Android | Open the link in Chrome, then menu > **Install app** |
| iPhone / iPad | Open the link in Safari, then Share > **Add to Home Screen** |
| Windows, macOS, Linux, ChromeOS | Open it in Chrome or Edge and click the install icon in the address bar |

Once installed it opens like a normal app, with its own icon.

## What you can do
- **Add apps:** pick one or more `.jar` files, or install the ones that come with it, in one step.
- **Run apps:** tap an app, or press OK. Each app shows its publisher and version.
- **Manage apps:** tap an app's name for its settings, to delete its saved data, or to uninstall it. Back up or restore everything with Import and Export.
- **Keypad and touch:** full keypad control on CloudPhone, an on-screen keypad on touch screens.
- **Online apps:** apps can use the internet (web requests) on the version that has the online relay.

## Controls
| Where | Key | Action |
|---|---|---|
| Launcher | Up / Down, OK | Move, open |
| Launcher | Left key | Menu / Select |
| Launcher | Right key | Back |
| In an app | Arrows, OK, 0-9, `*`, `#` | As on the phone (2 up, 8 down, 4 left, 6 right, 5 fire) |
| In an app | Left key tap / hold | Left soft key / emulator menu (settings, exit) |
| In an app | Right key | Right soft key |

If keys feel wrong, open the emulator menu and set **Phone type** to **Standard**.

## Good to know
- The first start of the Java engine needs internet and can take a minute.
- App sound is off by default; CloudPhone cannot play it and it made apps hang. You can turn it on in Settings.
- Only web (HTTP/HTTPS) connections are supported, not raw sockets.

## Credits
Engine: [zb3/freej2me-web](https://github.com/zb3/freej2me-web) (GPLv3), based on FreeJ2ME. Java runtime: [CheerpJ](https://cheerpj.com).

Contact: tasmon@outlook.com
