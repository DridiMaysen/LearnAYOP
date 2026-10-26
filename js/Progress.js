(function () {
    const KEY = 'learnayop_progress';
    const COURSES = {
        C001: { title: 'TFA',                         emoji: '➗',  cover: 'cover-python', tag: 'Mathématiques' },
        C002: { title: 'SGBD',                        emoji: '🗄️', cover: 'cover-html',   tag: 'Informatique' },
        C003: { title: 'Électricité et électronique', emoji: '⚡',  cover: 'cover-js',     tag: 'Électronique' }
    };
    function load() {
        try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
        catch (e) { return {}; }
    }
    function save(data) {
        try { localStorage.setItem(KEY, JSON.stringify(data)); }
        catch (e) {  }
    }
    function getEntry(id) {
        return load()[id] || { done: 0, total: 0 };
    }
    function getPercent(id) {
        const entry = getEntry(id);
        if (!entry.total) return 0;
        return Math.round((entry.done / entry.total) * 100);
    }
    function isStarted(id) {
        return getEntry(id).done > 0;
    }
    function setSummary(id, done, total) {
        const data = load();
        data[id] = { done: done, total: total };
        save(data);
    }
    function reset(id) {
        const data = load();
        delete data[id];
        save(data);
        try { localStorage.removeItem('learnayop_progress_' + id); }
        catch (e) {  }
    }
    function barHTML(id) {
        const entry = getEntry(id);
        const percent = getPercent(id);
        return '<div class="progress">' +
            '<div class="progress-head"><span>' + entry.done + '/' + entry.total + ' étapes</span><strong>' + percent + '%</strong></div>' +
            '<div class="progress-track"><div class="progress-fill" style="width:' + percent + '%"></div></div>' +
            '</div>';
    }
    function renderCourseCards() {
        document.querySelectorAll('.course-card').forEach(function (card) {
            const id = card.dataset.id;
            if (!COURSES[id] || !isStarted(id)) return;
            const button = card.querySelector('.course-button');
            if (!button) return;
            button.insertAdjacentHTML('beforebegin', barHTML(id));
            button.textContent = getPercent(id) === 100 ? 'Revoir le cours →' : 'Continuer le cours →';
        });
    }
    function renderDashboard() {
        const list = document.getElementById('started-list');
        if (!list) return;
        const started = Object.keys(COURSES).filter(isStarted);
        const empty = document.getElementById('started-empty');
        if (started.length === 0) {
            empty.style.display = 'block';
            list.innerHTML = '';
            return;
        }
        empty.style.display = 'none';
        list.innerHTML = started.map(function (id) {
            const c = COURSES[id];
            return '<article class="course-card">' +
                '<div class="course-cover ' + c.cover + '"><span>' + c.title + '</span><span class="course-emoji">' + c.emoji + '</span></div>' +
                '<div class="course-info">' +
                '<span class="course-tag">' + c.tag + '</span>' +
                '<h3>' + c.title + '</h3>' +
                barHTML(id) +
                '<a href="course.html?id=' + id + '" class="course-button">' +
                (getPercent(id) === 100 ? 'Revoir le cours →' : 'Continuer le cours →') + '</a>' +
                '</div></article>';
        }).join('');
    }
    window.LearnProgress = {
        courses: COURSES,
        getPercent: getPercent,
        isStarted: isStarted,
        setSummary: setSummary,
        reset: reset
    };
    document.addEventListener('DOMContentLoaded', function () {
        renderCourseCards();
        renderDashboard();
    });
})();