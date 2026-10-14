document.addEventListener('DOMContentLoaded', () => {
    initDropdowns();
    initMobileMenu();
    initLottieLogo();
});

// Swaps the static SVG logo for the Lottie animation. The SVG stays in the
// markup as the fallback, so the logo still shows if the CDN is blocked or
// JavaScript is off.
function initLottieLogo() {
    const hosts = document.querySelectorAll('[data-lottie-logo]');
    if (!hosts.length || typeof lottie === 'undefined') return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    hosts.forEach(host => {
        const path = host.getAttribute('data-lottie-src');
        if (!path) return;

        let animation;
        try {
            host.innerHTML = '';
            animation = lottie.loadAnimation({
                container: host,
                renderer: 'svg',
                loop: !reduceMotion,
                autoplay: !reduceMotion,
                path: path,
                rendererSettings: { progressiveLoad: true }
            });
        } catch (error) {
            return;
        }

        // Hold the finished frame rather than animating for reduced-motion users.
        if (reduceMotion) {
            animation.addEventListener('DOMLoaded', () => {
                animation.goToAndStop(animation.totalFrames - 1, true);
            });
        }
    });
}

function initDropdowns() {
    const toggles = document.querySelectorAll('[data-dropdown-toggle]');

    toggles.forEach(toggle => {
        const targetId = toggle.getAttribute('data-dropdown-toggle');
        const menu = document.getElementById(targetId);
        if (!menu) return;

        toggle.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            const isOpen = menu.classList.toggle('is-open');
            toggle.classList.toggle('is-active', isOpen);
            toggle.setAttribute('aria-expanded', String(isOpen));
        });

        document.addEventListener('click', (event) => {
            if (!menu.contains(event.target) && !toggle.contains(event.target)) {
                menu.classList.remove('is-open');
                toggle.classList.remove('is-active');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                menu.classList.remove('is-open');
                toggle.classList.remove('is-active');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    });
}

function initMobileMenu() {
    const trigger = document.querySelector('[data-mobile-menu-toggle]');
    const panel = document.querySelector('[data-mobile-menu]');
    if (!trigger || !panel) return;

    const icon = trigger.querySelector('.material-symbols-outlined');

    const setOpen = (open) => {
        panel.classList.toggle('hidden', !open);
        trigger.setAttribute('aria-expanded', String(open));
        if (icon) icon.textContent = open ? 'close' : 'menu';
    };

    trigger.addEventListener('click', () => {
        setOpen(panel.classList.contains('hidden'));
    });

    panel.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => setOpen(false));
    });
}
