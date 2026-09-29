import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

let lenis: Lenis | null = null;

function initSmoothScroll() {
  if (reduced()) return;
  if (lenis) return;
  lenis = new Lenis({ duration: 1.05, smoothWheel: true, syncTouch: false });
  const raf = (time: number) => {
    lenis?.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis?.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
}

function initHeaderHeight() {
  const header = document.querySelector('header');
  if (!header) return;
  document.documentElement.style.setProperty('--header-h', `${header.offsetHeight}px`);
}

function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  const update = () => {
    const h = document.documentElement;
    const scrollable = h.scrollHeight - h.clientHeight;
    const pct = scrollable > 0 ? window.scrollY / scrollable : 0;
    bar.style.transform = `scaleX(${Math.min(1, Math.max(0, pct))})`;
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}

function initTabIndicator() {
  document.querySelectorAll<HTMLElement>('[data-tab-indicator-root]').forEach((root) => {
    const indicator = root.querySelector<HTMLElement>('[data-tab-indicator]');
    const active = root.querySelector<HTMLElement>('[data-tab-link].is-active');
    if (!indicator || !active) {
      if (indicator) indicator.style.opacity = '0';
      return;
    }
    const rootRect = root.getBoundingClientRect();
    const rect = active.getBoundingClientRect();
    indicator.style.opacity = '1';
    indicator.style.width = `${rect.width}px`;
    indicator.style.transform = `translateX(${rect.left - rootRect.left + root.scrollLeft}px)`;
  });
}

function initTabKeyboardNav() {
  document.querySelectorAll<HTMLElement>('[data-tab-indicator-root]').forEach((root) => {
    if ((root as any)._keyNavBound) return;
    (root as any)._keyNavBound = true;
    const links = () => Array.from(root.querySelectorAll<HTMLAnchorElement>('[data-tab-link]'));
    root.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const list = links();
      const active = document.activeElement as HTMLElement;
      const idx = list.indexOf(active as HTMLAnchorElement);
      if (idx === -1) return;
      e.preventDefault();
      const next = e.key === 'ArrowRight' ? (idx + 1) % list.length : (idx - 1 + list.length) % list.length;
      list[next].focus();
    });
  });
}

function initRevealAnimations() {
  const items = gsap.utils.toArray<HTMLElement>('[data-reveal]');
  items.forEach((el, i) => {
    if (reduced()) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }
    gsap.fromTo(
      el,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        delay: (i % 6) * 0.05,
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true,
        },
      },
    );
  });

  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
    if (reduced()) return;
    const speed = Number(el.dataset.parallax) || 0.15;
    gsap.to(el, {
      yPercent: speed * 100,
      ease: 'none',
      scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

function initTilt() {
  if (!fine()) return;
  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((card) => {
    if ((card as any)._tiltBound) return;
    (card as any)._tiltBound = true;
    const strength = 10;
    const onMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rx = (py - 0.5) * -strength;
      const ry = (px - 0.5) * strength;
      gsap.to(card, { rotateX: rx, rotateY: ry, duration: 0.4, ease: 'power2.out', transformPerspective: 700 });
      card.style.setProperty('--spot-x', `${px * 100}%`);
      card.style.setProperty('--spot-y', `${py * 100}%`);
    };
    const onLeave = () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power3.out' });
    };
    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
  });
}

function initMagnetic() {
  if (!fine()) return;
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((btn) => {
    if ((btn as any)._magBound) return;
    (btn as any)._magBound = true;
    const onMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, { x: x * 0.25, y: y * 0.35, duration: 0.35, ease: 'power2.out' });
    };
    const onLeave = () => gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    btn.addEventListener('mousemove', onMove);
    btn.addEventListener('mouseleave', onLeave);
  });
}

function initCopyButtons() {
  document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((btn) => {
    if ((btn as any)._copyBound) return;
    (btn as any)._copyBound = true;
    btn.addEventListener('click', async () => {
      const targetSel = btn.getAttribute('data-copy');
      let text = '';
      if (targetSel === 'self') {
        text = btn.getAttribute('data-copy-text') ?? '';
      } else if (targetSel === 'closest-pre') {
        text = btn.closest('[data-codeblock]')?.querySelector('pre')?.textContent ?? '';
      } else {
        text = document.querySelector(targetSel ?? '')?.textContent ?? '';
      }
      try {
        await navigator.clipboard.writeText(text.trim());
      } catch {
        /* clipboard unavailable — silently ignore */
      }
      btn.classList.add('is-copied');
      btn.setAttribute('data-copied', 'true');
      const label = btn.querySelector('[data-copy-label]');
      const prev = label?.textContent;
      if (label) label.textContent = 'Copied';
      window.setTimeout(() => {
        btn.classList.remove('is-copied');
        btn.setAttribute('data-copied', 'false');
        if (label && prev) label.textContent = prev;
      }, 1500);
    });
  });
}

function initCursorGlow() {
  if (!fine() || reduced()) return;
  if (document.getElementById('cursor-glow')) return;
  const glow = document.createElement('div');
  glow.id = 'cursor-glow';
  glow.style.cssText =
    'position:fixed;top:0;left:0;width:26px;height:26px;border-radius:999px;pointer-events:none;z-index:9999;' +
    'background:radial-gradient(circle, rgba(240,80,50,0.55), rgba(139,108,245,0.25) 55%, transparent 70%);' +
    'transform:translate(-50%,-50%);mix-blend-mode:screen;transition:opacity .2s ease,transform .12s ease;opacity:0;';
  document.body.appendChild(glow);
  let visible = false;
  window.addEventListener('mousemove', (e) => {
    glow.style.transform = `translate(${e.clientX - 13}px, ${e.clientY - 13}px)`;
    if (!visible) {
      glow.style.opacity = '1';
      visible = true;
    }
  });
  window.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
    visible = false;
  });
  document.querySelectorAll('a, button, [data-tilt]').forEach((el) => {
    el.addEventListener('mouseenter', () => glow.style.setProperty('transform', glow.style.transform + ' scale(1.8)'));
  });
}

function initMobileSheet() {
  const toggle = document.querySelector<HTMLButtonElement>('[data-sheet-toggle]');
  const sheet = document.querySelector<HTMLElement>('[data-sheet]');
  const backdrop = document.querySelector<HTMLElement>('[data-sheet-backdrop]');
  if (!toggle || !sheet || !backdrop) return;
  const close = () => {
    sheet.setAttribute('data-open', 'false');
    backdrop.setAttribute('data-open', 'false');
    toggle.setAttribute('aria-expanded', 'false');
  };
  const open = () => {
    sheet.setAttribute('data-open', 'true');
    backdrop.setAttribute('data-open', 'true');
    toggle.setAttribute('aria-expanded', 'true');
  };
  toggle.addEventListener('click', () => {
    const isOpen = sheet.getAttribute('data-open') === 'true';
    isOpen ? close() : open();
  });
  backdrop.addEventListener('click', close);
  sheet.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
}

export function initApp() {
  initSmoothScroll();
  initHeaderHeight();
  initScrollProgress();
  initTabIndicator();
  initTabKeyboardNav();
  initRevealAnimations();
  initTilt();
  initMagnetic();
  initCopyButtons();
  initCursorGlow();
  initMobileSheet();
  ScrollTrigger.refresh();
}

document.addEventListener('astro:page-load', initApp);
document.addEventListener('astro:after-swap', () => {
  ScrollTrigger.getAll().forEach((t) => t.kill());
});
window.addEventListener('resize', () => {
  initTabIndicator();
  initHeaderHeight();
});
