# Kawaii Birthday Surprise

An animated, pastel **birthday greeting web app** that turns any browser into a mini celebration. It was tailored to feel a bit extra feminine and magical, with soft gradients, sparkles, balloons, confetti and a candle you can actually "blow out".

## Overview

- **Name input**: Type the celebrant's name and start the surprise.
- **Countdown screen**: A short, dramatic 3 → 2 → 1 moment.
- **3D-ish cake + candle**:
  - Candle flame reacts to mic input (or a tap fallback).
  - When the candle goes out, **balloons and confetti** fill the screen.
  - A piano **Happy Birthday** instrumental auto-plays.
- **Greeting screen**:
  - Personalized "Happy Birthday, _Name_!" header.
  - Cute pre-written message typed out with a typewriter effect.
  - Optional music controls (internally wired, currently auto-plays after the blow).
- **Gift screen**:
  - Tap to open a kawaii present.
  - Final message + looping confetti burst.
- **Footer**: Credits line – _Made by: Dash_.

Everything is built with **plain HTML, CSS, and JavaScript**, bundled and served via **Vite** so it can be deployed easily (for example to Vercel).

## Tech Stack

- **Frontend**: HTML5, CSS3, vanilla JavaScript (no framework)
- **Bundler / Dev server**: [Vite](https://vitejs.dev/)
- **Audio**: Local MP3 (`HAPPY BIRTHDAY TO YOU _ PIANO INSTRUMENTAL _ BEST HAPPY BITHDAY MUSIC 2021.mp3`)

## Getting Started (Local Development)

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Run the dev server**

   ```bash
   npm run dev
   ```

   Then open the printed `localhost` URL in your browser.

3. **Build for production**

   ```bash
   npm run build
   ```

   This outputs a static site into the `dist/` folder.

4. **Preview the production build (optional)**

   ```bash
   npm run preview
   ```

## Deploying to Vercel

You can deploy this project to [Vercel](https://vercel.com/) as a static site:

1. Push this repository to GitHub (for example `Dashersd/Birthday`).
2. In Vercel, **Import Project** from GitHub and select this repo.
3. When asked for framework / build settings:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Output directory**: `dist`
4. Deploy. Vercel will run the Vite build and host the contents of `dist/`.

## Customizing

- **Change the message**: Edit `buildDefaultMessage` in `script.js`.
- **Change colors / theme**: Tweak the CSS variables at the top of `style.css` (`--pink`, `--lav`, etc.).
- **Swap the music**: Replace the MP3 file with another track (keep the same filename or update the `<audio>` `src` in `index.html`).

Enjoy surprising your favorite people. 💗

