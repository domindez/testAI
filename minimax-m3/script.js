/* =====================================================================
   SOLAR SYSTEM — Vanilla JavaScript Controller
   - Twinkling starfield (HTML5 Canvas)
   - Planet click → info panel
   - Pause/Resume toggle (via CSS class)
   - Speed slider (writes a CSS custom property)
   ===================================================================== */

(() => {
  'use strict';

  /* -------------------------------------------------------------------
     1. PLANET DATA
     ------------------------------------------------------------------- */
  const PLANETS = {
    mercury: {
      name: 'Mercury',
      tag: 'The Swift Messenger',
      gradient: 'radial-gradient(circle at 30% 28%, #d6cfc1 0%, #9a9285 45%, #5a564e 100%)',
      facts: {
        distance: { label: 'Distance from Sun', value: '57.9M', unit: 'km' },
        size:     { label: 'Relative Size',     value: '0.38×', unit: 'Earth' },
        year:     { label: 'Orbital Period',    value: '88',    unit: 'Earth days' },
        temp:     { label: 'Avg. Temperature',  value: '167',   unit: '°C' },
      },
      description:
        'Mercury is the smallest and innermost planet in our Solar System. With virtually no atmosphere to trap heat, it endures the most dramatic temperature swings of any planet — searing 430 °C days plunging to a bitter −180 °C night.',
      fun:
        'A single year on Mercury (88 Earth days) is shorter than two of its own days. Time itself feels stretched this close to the Sun.',
    },
    venus: {
      name: 'Venus',
      tag: "Earth's Hostile Twin",
      gradient: 'radial-gradient(circle at 30% 28%, #ffe3a3 0%, #e6b65a 45%, #8a5a20 100%)',
      facts: {
        distance: { label: 'Distance from Sun', value: '108.2M', unit: 'km' },
        size:     { label: 'Relative Size',     value: '0.95×',  unit: 'Earth' },
        year:     { label: 'Orbital Period',    value: '225',    unit: 'Earth days' },
        temp:     { label: 'Avg. Temperature',  value: '464',    unit: '°C' },
      },
      description:
        'Venus is similar to Earth in size and composition but cloaked in a runaway greenhouse atmosphere of carbon dioxide and sulfuric acid clouds. It is the hottest planet in our Solar System — even hotter than Mercury.',
      fun:
        'Venus spins backwards compared to most planets, and one day on Venus is longer than its entire year.',
    },
    earth: {
      name: 'Earth',
      tag: 'The Blue Marble',
      gradient:
        'radial-gradient(circle at 70% 70%, rgba(60,180,90,0.55) 0%, transparent 35%), radial-gradient(circle at 28% 30%, #8fd8ff 0%, #2c7fd2 50%, #0e2a6a 100%)',
      facts: {
        distance: { label: 'Distance from Sun', value: '149.6M', unit: 'km' },
        size:     { label: 'Relative Size',     value: '1.00×',  unit: 'Earth' },
        year:     { label: 'Orbital Period',    value: '365.25', unit: 'days' },
        temp:     { label: 'Avg. Temperature',  value: '15',     unit: '°C' },
      },
      description:
        'Earth is the only known world to harbor life. Liquid water blankets 71% of its surface, and a magnetic shield deflects the worst of the solar wind — the perfect cosmic sanctuary.',
      fun:
        'Earth is the only planet not named after a Greek or Roman deity. Its name simply means "the ground" in old English and Germanic.',
    },
    mars: {
      name: 'Mars',
      tag: 'The Red Planet',
      gradient: 'radial-gradient(circle at 30% 28%, #ff9870 0%, #d35a30 45%, #6e2a14 100%)',
      facts: {
        distance: { label: 'Distance from Sun', value: '227.9M', unit: 'km' },
        size:     { label: 'Relative Size',     value: '0.53×',  unit: 'Earth' },
        year:     { label: 'Orbital Period',    value: '687',    unit: 'Earth days' },
        temp:     { label: 'Avg. Temperature',  value: '−65',    unit: '°C' },
      },
      description:
        'Mars owes its rusty glow to iron oxide dust covering its surface. Beneath, it hides the largest volcano (Olympus Mons) and the deepest canyon (Valles Marineris) in the Solar System.',
      fun:
        'Mars hosts the tallest mountain in the Solar System — Olympus Mons rises 22 km, nearly three times the height of Everest.',
    },
    jupiter: {
      name: 'Jupiter',
      tag: 'The Gas Giant King',
      gradient:
        'repeating-linear-gradient(180deg, transparent 0px, transparent 6px, rgba(120,70,30,0.18) 6px, rgba(120,70,30,0.18) 10px), radial-gradient(circle at 30% 30%, #ffe5b5 0%, #d39a5a 45%, #6c4014 100%)',
      facts: {
        distance: { label: 'Distance from Sun', value: '778.5M', unit: 'km' },
        size:     { label: 'Relative Size',     value: '11.0×',  unit: 'Earth' },
        year:     { label: 'Orbital Period',    value: '11.86',  unit: 'Earth years' },
        temp:     { label: 'Avg. Temperature',  value: '−110',   unit: '°C' },
      },
      description:
        'Jupiter is the largest planet — more than twice the mass of all the others combined. Its swirling cloud bands and ferocious storms have raged for centuries, the most famous being the Great Red Spot.',
      fun:
        "Jupiter's Great Red Spot is a storm so vast it could swallow the Earth whole, and it has been spinning for at least 350 years.",
    },
    saturn: {
      name: 'Saturn',
      tag: 'The Ringed Wonder',
      gradient:
        'repeating-linear-gradient(180deg, transparent 0px, transparent 6px, rgba(160,110,60,0.16) 6px, rgba(160,110,60,0.16) 10px), radial-gradient(circle at 30% 30%, #f6dba0 0%, #d4a85e 45%, #6a4818 100%)',
      facts: {
        distance: { label: 'Distance from Sun', value: '1.43B',  unit: 'km' },
        size:     { label: 'Relative Size',     value: '9.14×',  unit: 'Earth' },
        year:     { label: 'Orbital Period',    value: '29.46',  unit: 'Earth years' },
        temp:     { label: 'Avg. Temperature',  value: '−140',   unit: '°C' },
      },
      description:
        'Saturn is the crown jewel of the Solar System, encircled by a dazzling system of icy rings spanning 280,000 km. Despite its size, it is so low in density that it would float in water — if you could find an ocean big enough.',
      fun:
        "Saturn's rings are mostly chunks of ice ranging from grains of sugar to mountain-sized boulders, dancing in perfect formation.",
    },
    uranus: {
      name: 'Uranus',
      tag: 'The Tilted Ice Giant',
      gradient: 'radial-gradient(circle at 30% 28%, #d5f6f4 0%, #88d4d0 50%, #2a6e74 100%)',
      facts: {
        distance: { label: 'Distance from Sun', value: '2.87B', unit: 'km' },
        size:     { label: 'Relative Size',     value: '3.98×', unit: 'Earth' },
        year:     { label: 'Orbital Period',    value: '84.01', unit: 'Earth years' },
        temp:     { label: 'Avg. Temperature',  value: '−195',  unit: '°C' },
      },
      description:
        'Uranus is an ice giant tipped on its side, possibly knocked over by a colossal ancient collision. Its pale cyan hue comes from methane in its upper atmosphere absorbing the red light from the Sun.',
      fun:
        'Uranus rolls around the Sun like a ball, with each pole spending 42 Earth years in continuous sunlight followed by 42 in darkness.',
    },
    neptune: {
      name: 'Neptune',
      tag: 'The Wind God',
      gradient: 'radial-gradient(circle at 30% 28%, #88b3ff 0%, #325ad8 50%, #0b1a5c 100%)',
      facts: {
        distance: { label: 'Distance from Sun', value: '4.50B', unit: 'km' },
        size:     { label: 'Relative Size',     value: '3.86×', unit: 'Earth' },
        year:     { label: 'Orbital Period',    value: '164.8', unit: 'Earth years' },
        temp:     { label: 'Avg. Temperature',  value: '−200',  unit: '°C' },
      },
      description:
        'Neptune is the windiest planet in the Solar System, with supersonic gales tearing through its deep-blue atmosphere at over 2,000 km/h. It was the first planet discovered through mathematical prediction rather than observation.',
      fun:
        'A year on Neptune lasts almost 165 Earth years — it has only completed one full orbit since its discovery in 1846.',
    },
  };

  /* Display ordering for the "Planet · 0X of 08" eyebrow */
  const PLANET_ORDER = ['mercury','venus','earth','mars','jupiter','saturn','uranus','neptune'];

  /* -------------------------------------------------------------------
     2. STARFIELD (Canvas) — twinkling stars + occasional shooting star
     ------------------------------------------------------------------- */
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d', { alpha: true });

  let stars = [];
  let shootingStar = null;
  let nextShootingAt = performance.now() + randBetween(6000, 14000);
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  function randBetween(a, b) { return a + Math.random() * (b - a); }

  function resizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width  = Math.floor(window.innerWidth  * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width  = window.innerWidth  + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seedStars();
  }

  function seedStars() {
    // Density tuned for a beautifully populated but not noisy sky
    const area = window.innerWidth * window.innerHeight;
    const count = Math.min(420, Math.max(180, Math.floor(area / 4200)));
    stars = new Array(count).fill(null).map(() => {
      const r = Math.pow(Math.random(), 2.4) * 1.4 + 0.25; // mostly small, occasional larger
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r,
        baseAlpha: randBetween(0.35, 1.0),
        phase: Math.random() * Math.PI * 2,
        speed: randBetween(0.4, 1.6),
        // Subtle color shift for variety: cool whites, faint blues, faint amber
        tint: pickStarTint(),
      };
    });
  }

  function pickStarTint() {
    const roll = Math.random();
    if (roll < 0.78) return [255, 255, 255];        // white
    if (roll < 0.92) return [190, 215, 255];        // cool blue-white
    return [255, 220, 180];                          // warm amber
  }

  function spawnShootingStar() {
    const fromLeft = Math.random() > 0.5;
    const y = Math.random() * window.innerHeight * 0.6;
    shootingStar = {
      x: fromLeft ? -50 : window.innerWidth + 50,
      y,
      vx: fromLeft ? randBetween(8, 14) : -randBetween(8, 14),
      vy: randBetween(2, 5),
      life: 1.0,            // 0..1
      decay: 0.012,
      length: randBetween(80, 160),
    };
  }

  function drawFrame(t) {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // Stars
    const time = t * 0.001;
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const twinkle = 0.5 + 0.5 * Math.sin(time * s.speed + s.phase);
      const a = s.baseAlpha * (0.35 + 0.65 * twinkle);
      const [r, g, b] = s.tint;
      ctx.fillStyle = `rgba(${r},${g},${b},${a.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();

      // Bigger stars get a soft halo
      if (s.r > 1.0) {
        ctx.fillStyle = `rgba(${r},${g},${b},${(a * 0.18).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 3.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Shooting star
    if (!shootingStar && t >= nextShootingAt) {
      spawnShootingStar();
      nextShootingAt = t + randBetween(8000, 18000);
    }
    if (shootingStar) {
      const s = shootingStar;
      s.x += s.vx;
      s.y += s.vy;
      s.life -= s.decay;

      const angle = Math.atan2(s.vy, s.vx);
      const tailX = s.x - Math.cos(angle) * s.length;
      const tailY = s.y - Math.sin(angle) * s.length;

      const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
      grad.addColorStop(0, 'rgba(255,255,255,0)');
      grad.addColorStop(1, `rgba(220,235,255,${Math.max(0, s.life).toFixed(2)})`);

      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(s.x, s.y);
      ctx.stroke();

      // Bright head
      ctx.fillStyle = `rgba(255,255,255,${Math.max(0, s.life).toFixed(2)})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, 1.6, 0, Math.PI * 2);
      ctx.fill();

      if (s.life <= 0 || s.x < -200 || s.x > window.innerWidth + 200) {
        shootingStar = null;
      }
    }

    requestAnimationFrame(drawFrame);
  }

  /* -------------------------------------------------------------------
     3. INFO PANEL CONTROLLER
     ------------------------------------------------------------------- */
  const infoPanel    = document.getElementById('infoPanel');
  const backdrop     = document.getElementById('infoBackdrop');
  const closeBtn     = document.getElementById('closeInfoBtn');
  const planetName   = document.getElementById('planetName');
  const planetTag    = document.getElementById('planetTag');
  const planetEyebrow= document.getElementById('planetEyebrow');
  const planetVisual = document.getElementById('planetVisual');
  const planetDesc   = document.getElementById('planetDesc');
  const planetFun    = document.getElementById('planetFun');
  const factsContainer = document.getElementById('planetFacts');

  // Remember which element opened the panel so we can restore focus on close
  let lastFocusedTrigger = null;

  function openInfoPanel(planetKey, triggerEl) {
    const data = PLANETS[planetKey];
    if (!data) return;

    lastFocusedTrigger = triggerEl || document.activeElement;

    const index = PLANET_ORDER.indexOf(planetKey) + 1;
    planetEyebrow.textContent = `Planet · ${String(index).padStart(2,'0')} of 08`;
    planetName.textContent = data.name;
    planetTag.textContent  = data.tag;
    planetDesc.textContent = data.description;
    planetFun.textContent  = data.fun;
    planetVisual.style.background = data.gradient;

    // Build "Quick Facts" grid
    factsContainer.innerHTML = '';
    Object.values(data.facts).forEach(fact => {
      const card = document.createElement('div');
      card.className = 'fact-card';
      card.innerHTML = `
        <div class="fact-card__label">${fact.label}</div>
        <div class="fact-card__value">${fact.value}<span class="fact-card__unit">${fact.unit}</span></div>
      `;
      factsContainer.appendChild(card);
    });

    infoPanel.classList.add('is-open');
    backdrop.classList.add('is-open');
    infoPanel.setAttribute('aria-hidden', 'false');
    backdrop.setAttribute('aria-hidden', 'false');
    closeBtn.focus({ preventScroll: true });
  }

  function closeInfoPanel() {
    // Move focus out of the panel BEFORE we mark it aria-hidden (avoids the
    // "aria-hidden ancestor of focused element" accessibility warning).
    if (infoPanel.contains(document.activeElement)) {
      if (lastFocusedTrigger && document.body.contains(lastFocusedTrigger)) {
        lastFocusedTrigger.focus({ preventScroll: true });
      } else {
        document.activeElement.blur();
      }
    }
    infoPanel.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    infoPanel.setAttribute('aria-hidden', 'true');
    backdrop.setAttribute('aria-hidden', 'true');
  }

  // Delegate planet clicks (event delegation = cleaner & survives DOM changes)
  document.querySelectorAll('.planet').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const key = el.dataset.planet;
      openInfoPanel(key, el);
    });
  });

  closeBtn.addEventListener('click', closeInfoPanel);
  backdrop.addEventListener('click', closeInfoPanel);

  // ESC to close panel
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && infoPanel.classList.contains('is-open')) {
      closeInfoPanel();
    }
  });

  /* -------------------------------------------------------------------
     4. PAUSE / RESUME
     ------------------------------------------------------------------- */
  const pauseBtn = document.getElementById('pauseBtn');
  const statusText = document.querySelector('.status-text');
  const pauseLabel = pauseBtn.querySelector('.btn-toggle__label');

  function setPaused(paused) {
    document.body.classList.toggle('is-paused', paused);
    pauseBtn.setAttribute('aria-pressed', String(paused));
    pauseLabel.textContent = paused ? 'Resume' : 'Pause';
    statusText.textContent = paused ? 'Paused' : 'Running';
  }

  pauseBtn.addEventListener('click', () => {
    const isPaused = document.body.classList.contains('is-paused');
    setPaused(!isPaused);
  });

  // Spacebar shortcut to pause/resume (skip when typing in an input)
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !(e.target instanceof HTMLInputElement)) {
      e.preventDefault();
      pauseBtn.click();
    }
  });

  /* -------------------------------------------------------------------
     5. SPEED SLIDER — writes to CSS custom property `--speed`
     ------------------------------------------------------------------- */
  const speedSlider = document.getElementById('speedSlider');
  const speedValue  = document.getElementById('speedValue');

  function updateSpeed(value) {
    const v = parseFloat(value);
    // When dragged all the way to 0, treat it as a soft pause for animations.
    // We don't toggle the official Paused state — slider can quickly bring it back.
    const effective = v <= 0 ? 0.0001 : v;
    document.documentElement.style.setProperty('--speed', String(effective));

    // Update visual fill percentage of the slider track
    const pct = ((v - parseFloat(speedSlider.min)) /
                 (parseFloat(speedSlider.max) - parseFloat(speedSlider.min))) * 100;
    speedSlider.style.setProperty('--slider-pct', pct + '%');

    speedValue.textContent = v.toFixed(1) + '×';
  }

  speedSlider.addEventListener('input', (e) => updateSpeed(e.target.value));
  updateSpeed(speedSlider.value); // Initialize

  /* -------------------------------------------------------------------
     6. BOOT
     ------------------------------------------------------------------- */
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  requestAnimationFrame(drawFrame);

  // Friendly console signature
  console.log(
    '%c🪐 Solar System loaded',
    'color:#7cd2ff; font-weight:700; font-size:13px; letter-spacing:0.1em;',
    '\n• Click a planet for details' +
    '\n• [Space] toggles pause' +
    '\n• Drag the slider for warp speed'
  );
})();
