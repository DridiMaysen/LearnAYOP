(function () {
    const COURSES = {};
    let ETAT_BDD = {};

    function compterTotalEtapes(cle) {
        if (typeof donneesCours === 'undefined' || !donneesCours[cle]) return 0;
        const c = donneesCours[cle];
        let total = 0;
        (c.modules || []).forEach(function (mod) {
            total += (mod.parties ? mod.parties.length : 0) + 1; // leçons + quiz module
        });
        total += 1; // évaluation finale
        return total;
    }

    (window.CATALOGUE || []).forEach(function (c) {
        COURSES[c.id] = {
            cle: c.cle,
            title: c.titreCarte,
            sigle: c.sigle || c.titreCarte,
            emoji: c.icone || c.emoji,
            cover: c.cover,
            tag: c.tag,
            total: compterTotalEtapes(c.cle)
        };
    });

    function getEntry(id) {
        const meta = COURSES[id];
        const total = meta ? meta.total : 0;
        const donnees = ETAT_BDD[id];
        const done = donnees && Array.isArray(donnees.terminees) ? donnees.terminees.length : 0;
        return { done: Math.min(done, total), total: total };
    }

    function getPercent(id) {
        const entry = getEntry(id);
        if (!entry.total) return 0;
        return Math.round((entry.done / entry.total) * 100);
    }

    function isStarted(id) {
        return getEntry(id).done > 0;
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
            if (!button || card.querySelector('.progress')) return;
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
            if (empty) empty.style.display = 'block';
            list.innerHTML = '';
            return;
        }
        if (empty) empty.style.display = 'none';
        list.innerHTML = started.map(function (id) {
            const c = COURSES[id];
            return '<article class="course-card">' +
                '<div class="course-cover ' + c.cover + '">' +
                    '<span>' + c.sigle + '</span>' +
                    '<i class="' + c.emoji + ' course-emoji" aria-hidden="true"></i>' +
                '</div>' +
                '<div class="course-info">' +
                    '<span class="course-tag">' + c.tag + '</span>' +
                    '<h3>' + c.title + '</h3>' +
                    barHTML(id) +
                    '<a href="course.php?id=' + id + '" class="course-button">' +
                        (getPercent(id) === 100 ? 'Revoir le cours →' : 'Continuer le cours →') +
                    '</a>' +
                '</div>' +
            '</article>';
        }).join('');
    }

    function chargerDepuisBackend() {
        if (typeof apiGet !== 'function') return Promise.resolve(ETAT_BDD);
        return apiGet('api/progression.php')
            .then(function (rep) {
                if (rep && rep.ok && rep.cours) {
                    ETAT_BDD = rep.cours;
                }
                renderCourseCards();
                renderDashboard();
                return ETAT_BDD;
            })
            .catch(function () {
                renderDashboard();
                return ETAT_BDD;
            });
    }

    window.LearnProgress = {
        courses: COURSES,
        getPercent: getPercent,
        isStarted: isStarted,
        charger: chargerDepuisBackend,
        getCoursData: function (id) {
            return ETAT_BDD[id] || { terminees: [], position: 0, videos: {} };
        }
    };

    document.addEventListener('DOMContentLoaded', chargerDepuisBackend);
})();