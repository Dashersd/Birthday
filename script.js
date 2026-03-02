// ===== Screen Helper =====
const screens = {
  start: document.getElementById("screen-start"),
  countdown: document.getElementById("screen-countdown"),
  cake: document.getElementById("screen-cake"),
  greeting: document.getElementById("screen-greeting"),
  gift: document.getElementById("screen-gift"),
};

function showScreen(key) {
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[key].classList.add("active");
}

// ===== Elements =====
const inputName = document.getElementById("input-name");
const btnStart = document.getElementById("btn-start");

const countNumber = document.getElementById("count-number");

const btnMic = document.getElementById("btn-mic");
const btnBlow = document.getElementById("btn-blow");
const micIndicator = document.getElementById("mic-indicator");
const micBar = document.getElementById("mic-bar");
const micStatus = document.getElementById("mic-status");
const flame = document.getElementById("flame");
const hbReveal = document.getElementById("hb-reveal");
const btnContinue = document.getElementById("btn-continue");

const greetTitle = document.getElementById("greet-title");
const typedMessageEl = document.getElementById("typed-message");
const cursorEl = document.getElementById("cursor");
const btnNext = document.getElementById("btn-next");
const btnMusic = document.getElementById("btn-music");
const music = document.getElementById("music");

const giftBtn = document.getElementById("gift");
const reveal = document.getElementById("reveal");
const finalText = document.getElementById("final-text");
const btnRestart = document.getElementById("btn-restart");

// ===== Default Message =====
function buildDefaultMessage(name) {
  const n = name ? `, ${name}` : "";
  return `Happiest birthday${n}! 🎂💗
  Thank you for being so warm and easy to vibe with. 🍓✨
  I hope today brings you good energy, small happy moments, and lots of reasons to smile. 💌`;
}

// ===== Countdown =====
function startCountdown(onDone) {
  let n = 3;
  countNumber.textContent = String(n);

  const timer = setInterval(() => {
    n -= 1;
    if (n <= 0) {
      clearInterval(timer);
      countNumber.textContent = "🎉";
      onDone?.();
      return;
    }
    countNumber.textContent = String(n);
  }, 900);
}

// ===== Typewriter =====
function typeWriter(text, speed = 18) {
  typedMessageEl.textContent = "";
  cursorEl.style.display = "inline-block";

  let i = 0;
  const t = setInterval(() => {
    typedMessageEl.textContent += text[i] ?? "";
    i += 1;
    if (i >= text.length) {
      clearInterval(t);
      setTimeout(() => (cursorEl.style.display = "none"), 700);
    }
  }, speed);
}

// ===== Confetti (Canvas) =====
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

let confettiPieces = [];
let confettiRunning = false;

function spawnConfetti(count = 260) {
  const w = canvas.width, h = canvas.height;
  confettiPieces = Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: -20 - Math.random() * h * 0.3,
    w: 4 + Math.random() * 6,
    h: 6 + Math.random() * 9,
    vx: -2 + Math.random() * 4,
    vy: 2 + Math.random() * 4,
    rot: Math.random() * Math.PI,
    vr: -0.12 + Math.random() * 0.24,
    c: ["#ff5fa2", "#ff9fc8", "#bfa7ff", "#a8e7ff", "#ffe37a"][Math.floor(Math.random() * 5)],
  }));
}

// ===== Unified Canvas Loop =====
let particles = [];
function spawnBackgroundParticles(count = 15) {
  const w = canvas.width, h = canvas.height;
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    size: 10 + Math.random() * 20,
    vx: -0.2 + Math.random() * 0.4,
    vy: -0.2 - Math.random() * 0.5,
    opacity: 0.1 + Math.random() * 0.2,
    type: ["💖", "✨", "🌸", "⭐"][Math.floor(Math.random() * 4)],
  }));
}

function drawFrame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 1. Draw Background Particles
  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < -50) p.x = canvas.width + 50;
    if (p.x > canvas.width + 50) p.x = -50;
    if (p.y < -50) p.y = canvas.height + 50;
    if (p.y > canvas.height + 50) p.y = -50;

    ctx.save();
    ctx.globalAlpha = p.opacity;
    ctx.font = `${p.size}px serif`;
    ctx.fillText(p.type, p.x, p.y);
    ctx.restore();
  });

  // 2. Draw Confetti (if running)
  if (confettiRunning) {
    confettiPieces.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.vy *= 1.01;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });

    confettiPieces = confettiPieces.filter(p => p.y < canvas.height + 50);
    if (confettiPieces.length === 0) confettiRunning = false;
  }

  requestAnimationFrame(drawFrame);
}

function runConfetti(durationMs = 5000) {
  confettiRunning = true;
  spawnConfetti(180);
  // Pieces will disappear naturally via filtering
}

spawnBackgroundParticles();
drawFrame();


// ===== Cake Blow Logic (Mic + Tap) =====
let blew = false;

function resetCakeState() {
  blew = false;
  flame.classList.remove("off");
  hbReveal.classList.remove("show");
  btnContinue.style.display = "none";
  btnMic.disabled = false;
  btnBlow.disabled = false;
  micIndicator.style.display = "none";
  micBar.style.width = "0%";
  micStatus.textContent = "Tip: Click “Enable Mic” then blow near your mic. If mic is blocked, use Blow (Tap).";
}

function stopMic() {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = null;

  try {
    if (micStream) micStream.getTracks().forEach(t => t.stop());
  } catch { }
  micStream = null;

  try {
    if (audioCtx && audioCtx.state !== "closed") audioCtx.close();
  } catch { }
  audioCtx = null;
}

async function triggerBlowSuccess() {
  if (blew) return;
  blew = true;

  // stop listening to mic
  stopMic();

  // candle off
  flame.classList.add("off");

  // show big text + balloons
  hbReveal.classList.add("show");

  // start birthday music (best effort)
  try {
    music.currentTime = 0;
    await music.play();
    btnMusic.textContent = "Pause Music ⏸";
  } catch {
    // ignore autoplay errors, user can press Play
  }

  // confetti
  runConfetti(7000);

  // disable buttons
  btnMic.disabled = true;
  btnBlow.disabled = true;

  // haptic
  if (navigator.vibrate) navigator.vibrate(200);

  // show continue
  btnContinue.style.display = "inline-block";
}

// Tap fallback
btnBlow.addEventListener("click", () => {
  micStatus.textContent = "Blown! 💨✨";
  triggerBlowSuccess();
});

// Mic detection
let audioCtx = null;
let analyser = null;
let dataArray = null;
let micStream = null;
let rafId = null;

async function enableMic() {
  if (blew) return;

  try {
    micStatus.textContent = "Requesting mic permission…";
    micStream = await navigator.mediaDevices.getUserMedia({ audio: true });

    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioCtx.createMediaStreamSource(micStream);

    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 512;

    source.connect(analyser);
    dataArray = new Uint8Array(analyser.fftSize);

    micStatus.textContent = "Mic enabled ✅ Blow near the mic now!";
    micIndicator.style.display = "block";
    listenForBlow();
  } catch (err) {
    micStatus.textContent = "Mic blocked 😭 Use Blow (Tap) instead.";
    micIndicator.style.display = "none";
  }
}

function listenForBlow() {
  // Simple RMS loudness detection
  let blowHits = 0;
  const THRESHOLD = 0.08; // if too sensitive, increase to 0.10

  const loop = () => {
    if (blew) {
      micBar.style.width = "0%";
      return;
    }

    analyser.getByteTimeDomainData(dataArray);

    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      const v = (dataArray[i] - 128) / 128;
      sum += v * v;
    }
    const rms = Math.sqrt(sum / dataArray.length);

    // Visual feedback
    const level = Math.min(100, (rms / 0.15) * 100);
    micBar.style.width = `${level}%`;

    if (rms > THRESHOLD) {
      blowHits += 1;
    } else {
      blowHits = Math.max(0, blowHits - 1);
    }

    if (blowHits >= 6) {
      micStatus.textContent = "Blow detected! 🎉";
      micIndicator.style.display = "none";
      triggerBlowSuccess();
      return;
    }

    rafId = requestAnimationFrame(loop);
  };

  rafId = requestAnimationFrame(loop);
}

btnMic.addEventListener("click", enableMic);

btnContinue.addEventListener("click", () => {
  showScreen("greeting");
  const finalMsg = btnStart.dataset.msg || "Happy Birthday! 💗";
  typeWriter(finalMsg, 18);
});

// ===== Main Flow =====
btnStart.addEventListener("click", () => {
  const name = inputName.value.trim();

  const finalMsg = buildDefaultMessage(name);

  // prepare greeting
  greetTitle.textContent = name ? `Happy Birthday, ${name}! 🎉` : "Happy Birthday! 🎉";
  finalText.textContent = name ? `You’re the cutest, ${name}! 💖` : "You’re the cutest! 💖";

  btnStart.dataset.name = name;
  btnStart.dataset.msg = finalMsg;

  showScreen("countdown");
  startCountdown(() => {
    runConfetti(1800);

    setTimeout(() => {
      showScreen("cake");
      resetCakeState();
    }, 450);
  });
});

// Music button (user click only)
btnMusic.addEventListener("click", async () => {
  try {
    if (music.paused) {
      await music.play();
      btnMusic.textContent = "Pause Music ⏸";
    } else {
      music.pause();
      btnMusic.textContent = "Play Music 🎶";
    }
  } catch {
    alert("Music can’t play. Add your music.mp3 beside the files, or try another browser.");
  }
});

btnNext.addEventListener("click", () => {
  showScreen("gift");
});

giftBtn.addEventListener("click", () => {
  giftBtn.classList.add("open");
  if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
  runConfetti(2000);
  setTimeout(() => reveal.classList.add("show"), 420);
});

btnRestart.addEventListener("click", () => {
  // reset states
  stopMic();
  reveal.classList.remove("show");
  giftBtn.classList.remove("open");

  music.pause();
  btnMusic.textContent = "Play Music 🎶";

  inputName.value = "";

  showScreen("start");
});

// ===== PWA Install prompt (optional install; app runs either way) =====
const installBanner = document.getElementById("install-banner");
const installBtn = document.getElementById("install-btn");
const installDismiss = document.getElementById("install-dismiss");
const installIosHint = document.getElementById("install-ios-hint");
const installIosDismiss = document.getElementById("install-ios-dismiss");

const INSTALL_DISMISS_KEY = "birthday-install-dismissed";

function isStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;
}

function isIos() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (navigator.maxTouchPoints > 0 && window.innerWidth < 1024);
}

function shouldShowInstall() {
  if (isStandalone()) return false;
  try {
    if (sessionStorage.getItem(INSTALL_DISMISS_KEY) === "1") return false;
  } catch (_) { }
  return true;
}

function showInstallBanner() {
  if (!shouldShowInstall() || !installBanner) return;
  installBanner.classList.add("show");
}

function showIosHint() {
  if (!shouldShowInstall() || !installIosHint) return;
  installIosHint.style.display = "block";
  installIosHint.classList.add("show");
}

// Register service worker (needed for install prompt to fire on Chrome)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => { });
  });
}

let deferredInstallPrompt = null;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  showInstallBanner();
});

// Mobile: show install message automatically (pop-up style) after short delay
// Desktop: show banner after longer delay
const installDelayMs = isMobile() ? 800 : 2000;
if (installBanner || installIosHint) {
  setTimeout(() => {
    if (isIos()) {
      showIosHint();
    } else if (installBanner) {
      showInstallBanner();
    }
  }, installDelayMs);
}

// If browser fires beforeinstallprompt (e.g. Chrome Android), also show banner then
if (installBtn) {
  installBtn.addEventListener("click", async () => {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      const { outcome } = await deferredInstallPrompt.userChoice;
      if (installBanner) installBanner.classList.remove("show");
      deferredInstallPrompt = null;
    } else {
      if (installBanner) installBanner.classList.remove("show");
      alert("To install: use your browser menu (⋮ or ⋯) and look for \"Install\" or \"Add to Home Screen\".");
    }
  });
}

if (installDismiss) {
  installDismiss.addEventListener("click", () => {
    if (installBanner) installBanner.classList.remove("show");
    try { sessionStorage.setItem(INSTALL_DISMISS_KEY, "1"); } catch (_) { }
  });
}

// iOS: dismiss handler
if (installIosDismiss) {
  installIosDismiss.addEventListener("click", () => {
    if (installIosHint) {
      installIosHint.classList.remove("show");
      installIosHint.style.display = "none";
    }
    try { sessionStorage.setItem(INSTALL_DISMISS_KEY, "1"); } catch (_) { }
  });
}