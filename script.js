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
  Thank you for being so warm and easy to vibe with on the live. 🍓✨
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
      c: ["#ff5fa2", "#ff9fc8", "#bfa7ff", "#a8e7ff", "#ffe37a"][Math.floor(Math.random()*5)],
    }));
  }
  
  function runConfetti(durationMs = 5000) {
    confettiRunning = true;
    spawnConfetti(180);
  
    const start = performance.now();
    function frame(now) {
      if (!confettiRunning) return;
      const elapsed = now - start;
  
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      confettiPieces.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
  
        // a bit of gravity
        p.vy *= 1.01;
  
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
        ctx.restore();
      });
  
      // remove offscreen pieces
      confettiPieces = confettiPieces.filter(p => p.y < canvas.height + 50);
  
      if (elapsed < durationMs) {
        requestAnimationFrame(frame);
      } else {
        confettiRunning = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    requestAnimationFrame(frame);
  }
  
  // ===== Cake Blow Logic (Mic + Tap) =====
  let blew = false;
  
  function resetCakeState() {
    blew = false;
    flame.classList.remove("off");
    hbReveal.classList.remove("show");
    btnContinue.style.display = "none";
    btnMic.disabled = false;
    btnBlow.disabled = false;
    micStatus.textContent = "Tip: Click “Enable Mic” then blow near your mic. If mic is blocked, use Blow (Tap).";
  }
  
  function stopMic() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  
    try {
      if (micStream) micStream.getTracks().forEach(t => t.stop());
    } catch {}
    micStream = null;
  
    try {
      if (audioCtx && audioCtx.state !== "closed") audioCtx.close();
    } catch {}
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
      listenForBlow();
    } catch (err) {
      micStatus.textContent = "Mic blocked 😭 Use Blow (Tap) instead.";
    }
  }
  
  function listenForBlow() {
    // Simple RMS loudness detection
    let blowHits = 0;
    const THRESHOLD = 0.08; // if too sensitive, increase to 0.10
  
    const loop = () => {
      if (blew) return;
  
      analyser.getByteTimeDomainData(dataArray);
  
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        const v = (dataArray[i] - 128) / 128;
        sum += v * v;
      }
      const rms = Math.sqrt(sum / dataArray.length);
  
      if (rms > THRESHOLD) {
        blowHits += 1;
      } else {
        blowHits = Math.max(0, blowHits - 1);
      }
  
      if (blowHits >= 6) {
        micStatus.textContent = "Blow detected! 🎉";
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