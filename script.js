(function () {
  const canvas = document.getElementById('bg');
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const particles = [];
  for (let i = 0; i < 80; i += 1) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#00fff2';
      ctx.fill();

      particles.forEach((p2) => {
        const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = 'rgba(0,255,242,0.15)';
          ctx.stroke();
        }
      });
    });

    requestAnimationFrame(animate);
  }

  animate();

  const eventDate = new Date('March 10, 2027 09:00:00').getTime();
  const timer = document.getElementById('timer');

  function updateTimer() {
    const now = Date.now();
    const distance = eventDate - now;

    if (distance < 0) {
      timer.textContent = 'Event Started!';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    timer.textContent = `${days}d : ${hours}h : ${minutes}m : ${seconds}s`;
  }

  setInterval(updateTimer, 1000);
  updateTimer();

  document.querySelectorAll('.event-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.getAttribute('aria-controls'));
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!isOpen));
      target.classList.toggle('open');
    });
  });

  const form = document.getElementById('registration-form');
  const status = document.getElementById('form-status');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      status.className = 'form-note error';
      status.textContent = 'Please complete all required fields before submitting.';
      form.reportValidity();
      return;
    }

    const formData = Object.fromEntries(new FormData(form).entries());
    const existing = JSON.parse(localStorage.getItem('charge_registrations') || '[]');
    existing.push({ ...formData, submittedAt: new Date().toISOString() });
    localStorage.setItem('charge_registrations', JSON.stringify(existing));

    form.reset();
    status.className = 'form-note success';
    status.textContent = 'Registration submitted successfully! We saved your response in this browser.';
  });
})();
