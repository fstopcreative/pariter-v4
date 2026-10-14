// Cookie consent banner.
//
// Google Analytics and Microsoft Clarity are NOT loaded until the visitor
// accepts. Under UK GDPR / PECR, analytics cookies are non-essential, so
// nothing may be set before consent is given, and refusing must be as easy
// as accepting.
(function () {
    'use strict';

    var GA_ID = 'G-9PS8SYL8RQ';
    var CLARITY_ID = 'yx3z677flv';
    var STORAGE_KEY = 'pariter-cookie-consent';
    var POLICY_URL = 'policy/02_Cookie_Policy.pdf';

    function readChoice() {
        try {
            return window.localStorage.getItem(STORAGE_KEY);
        } catch (error) {
            // Private browsing or blocked storage: treat as "not asked yet".
            return null;
        }
    }

    function saveChoice(value) {
        try {
            window.localStorage.setItem(STORAGE_KEY, value);
        } catch (error) {
            /* Nothing we can do; the banner will simply show again. */
        }
    }

    function loadAnalytics() {
        if (window.__pariterAnalyticsLoaded) return;
        window.__pariterAnalyticsLoaded = true;

        var script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        function gtag() { window.dataLayer.push(arguments); }
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', GA_ID);

        loadClarity();
    }

    // Microsoft Clarity (heatmaps and session replay).
    function loadClarity() {
        (function (c, l, a, r, i, t, y) {
            c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
            t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
            y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
        }(window, document, 'clarity', 'script', CLARITY_ID));
    }

    // Best effort: drop analytics cookies if consent is withdrawn. Cookies set on
    // clarity.ms itself are third-party and cannot be removed from here.
    function clearAnalyticsCookies() {
        var host = window.location.hostname;
        var domains = ['', host, '.' + host];
        var parts = host.split('.');
        if (parts.length > 2) domains.push('.' + parts.slice(-2).join('.'));

        document.cookie.split(';').forEach(function (cookie) {
            var name = cookie.split('=')[0].trim();
            var tracked = ['_ga', '_gid', '_clck', '_clsk', 'CLID', 'MUID'];
            var isTracked = tracked.some(function (prefix) {
                return name.indexOf(prefix) === 0;
            });
            if (!isTracked) return;
            domains.forEach(function (domain) {
                document.cookie = name + '=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT' +
                    (domain ? '; domain=' + domain : '');
            });
        });
    }

    function removeBanner() {
        var existing = document.querySelector('[data-cookie-banner]');
        if (existing) existing.remove();
    }

    function showBanner() {
        if (document.querySelector('[data-cookie-banner]')) return;

        var banner = document.createElement('div');
        banner.className = 'cc-banner';
        banner.setAttribute('data-cookie-banner', '');
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-live', 'polite');
        banner.setAttribute('aria-label', 'Cookie consent');
        banner.innerHTML =
            '<div class="cc-inner">' +
                '<div class="cc-copy">' +
                    '<p class="cc-title">We use cookies</p>' +
                    '<p class="cc-text">We use essential cookies to make this site work. With your permission we would also like to set analytics cookies, including anonymised session recordings, to understand how the site is used. Read our <a class="cc-link" href="' + POLICY_URL + '" target="_blank" rel="noopener">Cookie Policy</a>.</p>' +
                '</div>' +
                '<div class="cc-actions">' +
                    '<button type="button" class="cc-btn cc-btn-ghost" data-cookie-reject>Reject analytics</button>' +
                    '<button type="button" class="cc-btn cc-btn-solid" data-cookie-accept>Accept all</button>' +
                '</div>' +
            '</div>';

        document.body.appendChild(banner);

        banner.querySelector('[data-cookie-accept]').addEventListener('click', function () {
            saveChoice('accepted');
            removeBanner();
            loadAnalytics();
        });

        banner.querySelector('[data-cookie-reject]').addEventListener('click', function () {
            saveChoice('rejected');
            removeBanner();
            clearAnalyticsCookies();
        });
    }

    var choice = readChoice();
    if (choice === 'accepted') {
        loadAnalytics();
    } else if (choice !== 'rejected') {
        showBanner();
    }

    // Lets the footer "Cookie Preferences" link reopen the choice.
    window.pariterCookies = {
        open: function () {
            try {
                window.localStorage.removeItem(STORAGE_KEY);
            } catch (error) { /* ignore */ }
            showBanner();
        }
    };
}());
