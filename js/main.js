document.addEventListener('DOMContentLoaded', () => {
    initDropdowns();
    initMobileMenu();
});

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
