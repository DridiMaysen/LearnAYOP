(function () {
    const burger = document.getElementById('burger');
    const nav = document.getElementById('main-nav');

    if (!burger || !nav) return;

    const icon = burger.querySelector('i');

    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);

    function setOpen(open) {
        nav.classList.toggle('open', open);
        overlay.classList.toggle('show', open);
        burger.setAttribute('aria-expanded', String(open));
        burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');

        if (icon) {
            icon.classList.toggle('fa-bars', !open);
            icon.classList.toggle('fa-xmark', open);
        }
    }

    burger.addEventListener('click', function (event) {
        event.stopPropagation();
        setOpen(!nav.classList.contains('open'));
    });

    nav.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            setOpen(false);
        });
    });

    overlay.addEventListener('click', function () {
        setOpen(false);
    });

    document.addEventListener('click', function (event) {
        if (!nav.contains(event.target) && !burger.contains(event.target)) {
            setOpen(false);
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && nav.classList.contains('open')) {
            setOpen(false);
            burger.focus();
        }
    });
})();