document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.querySelector('.dashboard-sidebar');
  const toggle = document.getElementById('sidebar-toggle');
  const scrim = document.getElementById('sidebar-scrim');

  // Below this width the sidebar becomes an off-canvas drawer (see style.css)
  const DRAWER_BREAKPOINT = 1024;
  const isDrawer = () => window.innerWidth < DRAWER_BREAKPOINT;

  const setDrawer = (open) => {
    if (!sidebar) return;
    sidebar.classList.toggle('open', open);
    if (scrim) {
      scrim.classList.toggle('open', open);
      scrim.hidden = !open;
    }
    if (toggle) toggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };

  if (toggle) {
    toggle.addEventListener('click', () => setDrawer(!sidebar.classList.contains('open')));
  }
  if (scrim) {
    scrim.addEventListener('click', () => setDrawer(false));
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setDrawer(false);
  });

  // Snap the drawer shut when the viewport grows back to the two-pane layout
  window.addEventListener('resize', () => {
    if (!isDrawer()) setDrawer(false);
  });

  // Tab switching
  const navLinks = document.querySelectorAll('.dashboard-nav .dashboard-link');
  const sections = document.querySelectorAll('.dashboard-section');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href') || '';
      if (href.charAt(0) !== '#') return; // e.g. logout

      e.preventDefault();

      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      sections.forEach(sec => { sec.style.display = 'none'; });
      const target = document.getElementById(href.substring(1));
      if (target) {
        target.style.display = 'block';
        // Re-run the reveal animation for the panel that just came in
        target.classList.remove('in-view');
        void target.offsetWidth;
        target.classList.add('in-view');
      }

      if (isDrawer()) setDrawer(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // Initial tab
  if (sections.length) {
    sections.forEach(sec => { sec.style.display = 'none'; });
    sections[0].style.display = 'block';
    sections[0].classList.add('in-view');
  }
});
