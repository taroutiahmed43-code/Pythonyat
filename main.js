// ═══════════════════════════════════════
// MAIN.JS — Interactions & Animations
// ═══════════════════════════════════════

// ── Cursor ──
const cursor = document.getElementById('cursor');
const trail = document.getElementById('cursor-trail');
let trailX = 0, trailY = 0;

document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  trailX += (e.clientX - trailX) * 0.15;
  trailY += (e.clientY - trailY) * 0.15;
});

(function animateTrail() {
  requestAnimationFrame(animateTrail);
  trail.style.left = trailX + 'px';
  trail.style.top = trailY + 'px';
})();

document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
    trail.style.transform = 'translate(-50%,-50%) scale(1.4)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    trail.style.transform = 'translate(-50%,-50%) scale(1)';
  });
});

// ── Scroll progress ──
const scrollBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  scrollBar.style.width = pct + '%';
}, { passive: true });

// ── Navbar ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

function toggleMenu() {
  document.getElementById('navMobile').classList.toggle('open');
}

// ── Reveal on scroll ──
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── Phase progress ──
const phasesDone = new Set();

function togglePhase(num) {
  const btn = document.querySelector(`[data-num="${num}"] .phase-check-btn`);
  if (phasesDone.has(num)) {
    phasesDone.delete(num);
    btn.classList.remove('done');
  } else {
    phasesDone.add(num);
    btn.classList.add('done');
    // Micro-celebration
    btn.style.transform = 'scale(1.3)';
    setTimeout(() => btn.style.transform = '', 300);
  }
  updateProgress();
}

function updateProgress() {
  const n = phasesDone.size;
  const pct = (n / 6) * 100;
  document.getElementById('ptFill').style.width = pct + '%';
  document.getElementById('ptCount').textContent = `${n} / 6 phases`;
  document.getElementById('vcFill').style.width = pct + '%';
  document.getElementById('vcPct').textContent = Math.round(pct) + '%';
}

// ── FAQ ──
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const ans = item.querySelector('.faq-a');
  const isOpen = btn.classList.contains('open');

  // Close all
  document.querySelectorAll('.faq-q.open').forEach(q => {
    q.classList.remove('open');
    q.closest('.faq-item').querySelector('.faq-a').classList.remove('open');
  });

  if (!isOpen) {
    btn.classList.add('open');
    ans.classList.add('open');
  }
}

// ── Smooth anchor scrolls ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Band duplication for infinite scroll ──
const band = document.querySelector('.band-inner');
if (band) band.innerHTML += band.innerHTML;
