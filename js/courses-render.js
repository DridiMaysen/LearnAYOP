(function () {
    function esc(texte) {
        return String(texte)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function compterLecons(cours) {
        if (!cours || !Array.isArray(cours.modules)) return 0;
        return cours.modules.reduce(function (total, module) {
            return total + (module.parties ? module.parties.length : 0);
        }, 0);
    }

    function creerCarte(meta) {
        const cours = donneesCours[meta.cle];
        if (!cours) return '';

        const nbLecons = compterLecons(cours);
        const titre = meta.titreCarte || cours.titre;

        return '' +
        '<article class="course-card"' +
            ' data-id="' + esc(meta.id) + '"' +
            ' data-niveau="' + esc(meta.niveau) + '"' +
            ' data-matiere="' + esc(meta.matiere) + '">' +
            '<div class="course-cover ' + esc(meta.cover) + '">' +
                '<span>' + esc(meta.sigle) + '</span>' +
                '<i class="fa-solid ' + esc(meta.icone) + ' course-emoji" aria-hidden="true"></i>' +
            '</div>' +
            '<div class="course-info">' +
                '<span class="course-tag">' + esc(meta.tag) + '</span>' +
                '<h2>' + esc(titre) + '</h2>' +
                '<p>' + esc(meta.description) + '</p>' +
                '<div class="course-badges">' +
                    '<span class="badge badge-id">' + esc(meta.id) + '</span>' +
                    '<span class="badge">' + esc(meta.niveau) + '</span>' +
                    '<span class="badge">' + esc(meta.matiereLabel) + '</span>' +
                '</div>' +
                '<div class="course-meta">' +
                    '<span>' +
                        '<i class="fa-solid fa-book-open" aria-hidden="true"></i> ' +
                        nbLecons + ' leçons' +
                    '</span>' +
                    '<span>' + esc(meta.difficulte) + '</span>' +
                '</div>' +
                '<a href="course.html?id=' + esc(meta.id) + '" class="course-button">' +
                    'Voir le cours ' +
                    '<i class="fa-solid fa-arrow-right" aria-hidden="true"></i>' +
                '</a>' +
            '</div>' +
        '</article>';
    }

    const grille = document.getElementById('course-grid');
    if (!grille || !window.CATALOGUE || typeof donneesCours === 'undefined') return;

    grille.insertAdjacentHTML('afterbegin', window.CATALOGUE.map(creerCarte).join(''));
})();