// FAQ search, topic filtering and expand/collapse all.
// Progressive enhancement: without JS every question is still readable
// and openable, because each one is a native <details> element.
document.addEventListener('DOMContentLoaded', () => {
    const toolbar = document.querySelector('[data-faq-toolbar]');
    const list = document.querySelector('[data-faq-list]');
    if (!toolbar || !list) return;

    const search = toolbar.querySelector('[data-faq-search]');
    const clearBtn = toolbar.querySelector('[data-faq-clear]');
    const chips = Array.from(toolbar.querySelectorAll('[data-faq-filter]'));
    const countEl = toolbar.querySelector('[data-faq-count]');
    const toggleAll = toolbar.querySelector('[data-faq-toggle-all]');
    const toggleLabel = toolbar.querySelector('[data-faq-toggle-label]');
    const toggleIcon = toolbar.querySelector('[data-faq-toggle-icon]');

    const items = Array.from(list.querySelectorAll('[data-faq-item]'));
    const groups = Array.from(list.querySelectorAll('[data-faq-group]'));
    const empty = list.querySelector('[data-faq-empty]');
    const total = items.length;

    let category = 'all';

    const term = () => (search ? search.value.trim().toLowerCase() : '');

    function apply() {
        const q = term();
        let shown = 0;

        items.forEach(item => {
            const matchesCategory =
                category === 'all' || item.dataset.faqCategory === category;
            const matchesTerm = !q || item.dataset.faqText.includes(q);
            const visible = matchesCategory && matchesTerm;

            item.hidden = !visible;
            if (visible) {
                shown += 1;
                // Open matches while searching so the answer is visible straight away.
                if (q) item.open = true;
            } else {
                item.open = false;
            }
        });

        // Hide a topic heading once every question under it is filtered out.
        groups.forEach(group => {
            const hasVisible = Array.from(
                group.querySelectorAll('[data-faq-item]')
            ).some(item => !item.hidden);
            group.hidden = !hasVisible;
        });

        if (empty) empty.classList.toggle('hidden', shown > 0);
        if (clearBtn) clearBtn.hidden = !q;

        if (countEl) {
            if (shown === total) {
                countEl.textContent = `Showing all ${total} questions`;
            } else if (shown === 0) {
                countEl.textContent = 'No matching questions';
            } else {
                countEl.textContent = `Showing ${shown} of ${total} questions`;
            }
        }

        syncToggleAll();
    }

    function syncToggleAll() {
        if (!toggleAll) return;
        const visible = items.filter(item => !item.hidden);
        const allOpen = visible.length > 0 && visible.every(item => item.open);
        toggleAll.setAttribute('aria-expanded', String(allOpen));
        if (toggleLabel) toggleLabel.textContent = allOpen ? 'COLLAPSE ALL' : 'EXPAND ALL';
        if (toggleIcon) toggleIcon.textContent = allOpen ? 'unfold_less' : 'unfold_more';
    }

    if (search) {
        search.addEventListener('input', apply);
        search.addEventListener('keydown', event => {
            if (event.key === 'Escape' && search.value) {
                search.value = '';
                apply();
            }
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            search.value = '';
            search.focus();
            apply();
        });
    }

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            category = chip.dataset.faqFilter;
            chips.forEach(other => {
                const active = other === chip;
                other.classList.toggle('is-active', active);
                other.setAttribute('aria-pressed', String(active));
            });
            apply();
        });
    });

    if (toggleAll) {
        toggleAll.addEventListener('click', () => {
            const open = toggleAll.getAttribute('aria-expanded') !== 'true';
            items.filter(item => !item.hidden).forEach(item => { item.open = open; });
            syncToggleAll();
        });
    }

    // Keep the label honest when questions are opened one at a time.
    items.forEach(item => item.addEventListener('toggle', syncToggleAll));

    apply();
});
