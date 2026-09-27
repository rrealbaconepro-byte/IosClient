# Rovival React Client

A React + Vite + Capacitor client for Rovival.

## Features

- Animated Rovival home screen
- Empty friends list for brand-new accounts
- Empty Continue/recently-played section for new accounts
- 0 Robux for new accounts
- Login and account creation
- Game discovery cards
- Avatar preview
- Mobile/iPad touch joystick
- Jump button
- In-game chat panel
- React Three Fiber 3D world
- Smooth UI animations with Framer Motion
- API connection to the Rovival Render backend
- Capacitor setup for iOS and Android

## 1. Install

```bash
npm install
```

## 2. Run the web client

```bash
npm run dev
```

## 3. Set the API URL

The default API is:

```text
https://rovival.onrender.com/api
```

You can override it with:

```text
VITE_API_URL=https://your-server.example.com/api
```

## 4. Build

```bash
npm run build
```

## 5. Create native projects

```bash
npx cap add ios
npx cap add android
npm run cap:sync
```

Then:

```bash
npm run cap:ios
```

or:

```bash
npm run cap:android
```

iOS signing and App Store installation require Apple's normal developer/Xcode process.

## Project structure

```text
src/
  App.jsx
  main.jsx
  styles.css
  lib/api.js
  components/
    Home.jsx
    GameWorld.jsx
    ChatPanel.jsx
    Joystick.jsx
    AuthScreen.jsx
    Avatar.jsx

public/
  games/
```
