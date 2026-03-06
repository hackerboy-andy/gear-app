# Gear Tracker – Deployment Guide

## Option 1: Vercel (empfohlen, 2 Minuten)

1. Geh zu **https://vercel.com** und melde dich mit GitHub an
2. Erstelle ein neues Repository auf GitHub und pushe diesen Ordner:
   ```bash
   cd gear-app
   git init
   git add .
   git commit -m "initial commit"
   git remote add origin https://github.com/DEIN-USER/gear-app.git
   git push -u origin main
   ```
3. Auf Vercel: "Add New Project" → wähle dein Repo
4. Framework: **Vite** (wird automatisch erkannt)
5. Klick "Deploy" → fertig!
6. Du bekommst eine URL wie `gear-app-xyz.vercel.app`
7. Öffne die URL auf deinem Handy im Browser

## Option 2: Netlify (auch 2 Minuten)

1. Build lokal:
   ```bash
   cd gear-app
   npm install
   npm run build
   ```
2. Geh zu **https://app.netlify.com/drop**
3. Drag & Drop den `dist/` Ordner rein → fertig!

## Option 3: Lokaler Test mit Handy im selben WLAN

1. ```bash
   cd gear-app
   npm install
   npm run dev -- --host
   ```
2. Du siehst eine URL wie `http://192.168.1.xxx:5173`
3. Öffne diese URL auf deinem Handy (muss im selben WLAN sein)

## Zum Homescreen hinzufügen (iOS/Android)

- **iOS**: Safari → Teilen-Button → "Zum Home-Bildschirm"
- **Android**: Chrome → 3 Punkte → "Zum Startbildschirm hinzufügen"

## Tech Stack
- React 19 + Vite
- Kein Backend nötig (Daten aktuell im State, später Supabase/Firebase)
- Mobile-optimiert (430px max-width, touch-friendly)
