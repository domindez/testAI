/* ============================================================
   INTERACTIVE 2D SOLAR SYSTEM — LOGIC
   Vanilla JS. Generates planets from data, handles the starfield
   canvas, click-to-open info panel, pause/resume + speed slider.
   ============================================================ */

(() => {
  'use strict';

  /* ----------------------------------------------------------
     1. PLANET DATA
     - visual: orbit diameter, planet diameter, base orbit time
     - facts: shown in the info panel
     ---------------------------------------------------------- */
  const PLANETS = [
    {
      key: 'mercury', name: 'Mercury',
      orbitSize: 150, planetSize: 10, base: '4s',
      facts: {
        'Distance from Sun': '57.9M km',
        'Relative Size': '0.38 × Earth',
        'Orbital Period': '88 days',
        'Average Temp': '167 °C'
      },
      fact: 'Mercury is the smallest planet and the fastest racer — it whips around the Sun in just 88 Earth days.'
    },
    {
      key: 'venus', name: 'Venus',
      orbitSize: 210, planetSize: 16, base: '10s',
      facts: {
        'Distance from Sun': '108.2M km',
        'Relative Size': '0.95 × Earth',
        'Orbital Period': '225 days',
        'Average Temp': '464 °C'
      },
      fact: 'Venus is the hottest planet thanks to a runaway greenhouse atmosphere — hot enough to melt lead.'
    },
    {
      key: 'earth', name: 'Earth',
      orbitSize: 280, planetSize: 18, base: '16s',
      facts: {
        'Distance from Sun': '149.6M km',
        'Relative Size': '1.00 × Earth',
        'Orbital Period': '365 days',
        'Average Temp': '15 °C'
      },
      fact: 'Earth is the only known world with liquid surface water and life — our pale blue dot.'
    },
    {
      key: 'mars', name: 'Mars',
      orbitSize: 360, planetSize: 14, base: '24s',
      facts: {
        'Distance from Sun': '227.9M km',
        'Relative Size': '0.53 × Earth',
        'Orbital Period': '687 days',
        'Average Temp': '-65 °C'
      },
      fact: 'Mars hosts Olympus Mons, the tallest volcano in the solar system — nearly three times the height of Everest.'
    },
    {
      key: 'jupiter', name: 'Jupiter',
      orbitSize: 470, planetSize: 42, base: '40s',
      facts: {
        'Distance from Sun': '778.5M km',
        'Relative Size': '11.21 × Earth',
        'Orbital Period': '12 years',
        'Average Temp': '-110 °C'
      },
      fact: 'Jupiter is a gas giant so massive that every other planet in the solar system could fit inside it at once.'
    },
    {
      key: 'saturn', name: 'Saturn',
      orbitSize: 580, planetSize: 36, base: '60s',
      facts: {
        'Distance from Sun': '1.43B km',
        'Relative Size': '9.45 × Earth',
        'Orbital Period': '29 years',
        'Average Temp': '-140 °C'
      },
      fact: "Saturn's rings are mostly chunks of ice and rock — and they're stunningly thin, often only ~10 m thick."
    },
    {
      key: 'uranus', name: 'Uranus',
      orbitSize: 680, planetSize: 28, base: '80s',
      facts: {
        'Distance from Sun': '2.87B km',
        'Relative Size': '4.01 × Earth',
        'Orbital Period': '84 years',
        'Average Temp': '-195 °C'
      },
      fact: 'Uranus rotates on its side — likely knocked over by an ancient collision, giving it extreme seasons.'
    },
    {
      key: 'neptune', name: 'Neptune',
      orbitSize: 780, planetSize: 26, base: '100s',
      facts: {
        'Distance from Sun': '4.50B km',
        'Relative Size': '3.88 × Earth',
        'Orbital Period': '165 years',
        'Average Temp': '-200 °C'
      },
      fact: 'Neptune boasts the fastest winds in the solar system, screaming along at over 2,000 km/h.'
    }
  ];

  /* ----------------------------------------------------------
     2. BUILD THE PLANETS IN THE DOM
     ---------------------------------------------------------- */
  const orbitsRoot = document.getElementById('orbits');

  PLANETS.forEach(p => {
    const orbit = document.createElement('div');
    orbit.className = 'orbit';
    // Per-orbit custom properties consumed by the CSS animations.
    orbit.style.setProperty('--base', p.base);
    orbit.style.setProperty('--orbit-size', `${p.orbitSize}px`);

    const planet = document.createElement('div');
    planet.className = `planet planet--${p.key}`;
    planet.dataset.planet = p.key;
    planet.style.setProperty('--planet-size', `${p.planetSize}px`);
    planet.setAttribute('role', 'button');
    planet.setAttribute('tabindex', '0');
    planet.setAttribute('aria-label', `${p.name} — click for info`);

    const body = document.createElement('span');
    body.className = 'planet__body';

    const tooltip = document.createElement('span');
    tooltip.className = 'planet__tooltip';
    tooltip.textContent = p.name;

    planet.append(body, tooltip);
    orbit.appendChild(planet);
    orbitsRoot.appendChild(orbit);
  });

  /* ----------------------------------------------------------
     3. TWINKLING STARFIELD (HTML5 Canvas)
     ---------------------------------------------------------- */
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let stars = [];
  let rafId = null;

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seedStars();
  }

  function seedStars() {
    const count = Math.floor((window.innerWidth * window.innerHeight) / 6000);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.3 + 0.2,
      baseAlpha: Math.random() * 0.6 + 0.2,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      phase: Math.random() * Math.PI * 2
    }));
  }

  function drawStars(t) {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (const s of stars) {
      const alpha = s.baseAlpha + Math.sin(t * s.twinkleSpeed + s.phase) * 0.35;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, Math.min(1, alpha))})`;
      ctx.fill();
    }
    rafId = requestAnimationFrame(drawStars);
  }

  resizeCanvas();
  rafId = requestAnimationFrame(drawStars);
  window.addEventListener('resize', resizeCanvas);

  /* ----------------------------------------------------------
     4. INFO PANEL — open / close
     ---------------------------------------------------------- */
  const infoPanel  = document.getElementById('infoPanel');
  const infoSwatch = document.getElementById('infoSwatch');
  const infoName   = document.getElementById('infoName');
  const infoGrid   = document.getElementById('infoGrid');
  const infoFact   = document.getElementById('infoFact');
  const closeBtn   = document.getElementById('closePanel');
  const scrim      = document.getElementById('scrim');

  function openPanel(planetKey) {
    const data = PLANETS.find(p => p.key === planetKey);
    if (!data) return;

    // Mirror the planet's appearance by borrowing its .planet--<key> class,
    // which sets the --planet-bg gradient that .info-panel__swatch consumes.
    infoSwatch.className = `info-panel__swatch planet--${planetKey}`;
    infoName.textContent = data.name;

    // Quick facts grid
    infoGrid.innerHTML = '';
    Object.entries(data.facts).forEach(([label, value]) => {
      const cell = document.createElement('div');
      cell.className = 'fact';
      cell.innerHTML = `<span class="fact__label">${label}</span><span class="fact__value">${value}</span>`;
      infoGrid.appendChild(cell);
    });

    // Fun fact
    infoFact.textContent = data.fact;

    infoPanel.classList.add('is-open');
    infoPanel.setAttribute('aria-hidden', 'false');
    scrim.classList.add('is-open');
  }

  function closePanel() {
    infoPanel.classList.remove('is-open');
    infoPanel.setAttribute('aria-hidden', 'true');
    scrim.classList.remove('is-open');
  }

  // Delegate clicks on any planet
  document.addEventListener('click', e => {
    const planet = e.target.closest('.planet');
    if (planet) openPanel(planet.dataset.planet);
  });

  // Keyboard accessibility: Enter / Space on a focused planet
  document.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ' ') && document.activeElement?.classList?.contains('planet')) {
      e.preventDefault();
      openPanel(document.activeElement.dataset.planet);
    }
    if (e.key === 'Escape') closePanel();
  });

  closeBtn.addEventListener('click', closePanel);
  scrim.addEventListener('click', closePanel);

  /* ----------------------------------------------------------
     5. CONTROLS — Pause/Resume + Speed slider
     ---------------------------------------------------------- */
  const pauseBtn   = document.getElementById('pauseBtn');
  const speedRange = document.getElementById('speedRange');
  const speedValue = document.getElementById('speedValue');

  // Pause / Resume: toggles a body class that sets animation-play-state.
  let paused = false;
  pauseBtn.addEventListener('click', () => {
    paused = !paused;
    document.body.classList.toggle('is-paused', paused);
    pauseBtn.setAttribute('aria-pressed', String(paused));
    pauseBtn.querySelector('.controls__icon').textContent = paused ? '▶' : '⏸';
    pauseBtn.querySelector('.controls__label').textContent = paused ? 'Resume' : 'Pause';
  });

  // Speed: updates the --speed custom property; CSS uses it inside calc()
  // for every animation-duration, so all orbits speed up / slow down live.
  speedRange.addEventListener('input', () => {
    const v = parseFloat(speedRange.value);
    document.documentElement.style.setProperty('--speed', v);
    speedValue.textContent = `${v.toFixed(1)}×`;
  });

})();
