<?php
require __DIR__ . '/includes/bootstrap.php';
exiger_admin();
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <?= csrf_meta() ?>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Administration - LearnAYOP</title>
    <meta name="description" content="Gérer les cours de LearnAYOP.">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/progress.css">
    <link rel="stylesheet" href="css/admin.css">
</head>

<body>
    <?php require __DIR__ . '/includes/navbar.php'; ?>

    <main>
        <div class="topbar">
            <label class="search-box">
                <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
                <input type="search" id="search-input"
                       placeholder="Rechercher un cours (nom, id, matière...)">
            </label>
            <select id="filter-level" class="filter-select" aria-label="Filtrer par niveau">
                <option value="">Tous les niveaux</option>
                <option value="Licence">Licence</option>
                <option value="Cycle">Cycle</option>
                <option value="Master">Master</option>
            </select>
            <select id="filter-subject" class="filter-select" aria-label="Filtrer par matière">
                <option value="">Toutes les matières</option>
                <option value="Math">Math</option>
                <option value="Info">Info</option>
                <option value="Elec">Élec</option>
            </select>
            <button type="button" id="reset-filters" class="reset-button">Réinitialiser</button>
        </div>

        <section class="popular-courses section-container">
            <div class="section-heading">
                <div>
                    <p class="eyebrow">ADMINISTRATION</p>
                    <h1>Tous les cours</h1>
                </div>
                <a href="ajouter-cours.php" class="primary-button">
                    <i class="fa-solid fa-plus" aria-hidden="true"></i> Ajouter un cours
                </a>
            </div>

            <!-- Les cartes sont générées par courses-render.js -->
            <div class="course-grid" id="course-grid">
                <p class="no-results" id="no-results">
                    Aucun cours ne correspond à votre recherche.
                </p>
            </div>
        </section>
    </main>

    <footer class="footer">
        <a href="index.php" class="logo">Learn<span>AYOP</span></a>
        <p>Apprendre aujourd'hui, réussir demain.</p>
        <p>© 2026 LearnAYOP — Mini plateforme d'apprentissage.</p>
    </footer>

    <script src="js/menu.js" defer></script>
    <script src="js/api.js"></script>
    <script src="php/cours_js.php"></script>
    <script src="js/courses-render.js"></script>
    <script>
    if (window.CATALOGUE_ADMIN && typeof afficherCours === 'function') {
        var grille = document.getElementById('course-grid');
        grille.querySelectorAll('.course-card').forEach(function (c) { c.remove(); });
        window.CATALOGUE = window.CATALOGUE_ADMIN;
        afficherCours(window.CATALOGUE_ADMIN);
    }

    document.querySelectorAll('.course-card').forEach(function (carte) {
        var bouton = carte.querySelector('.course-button');
        if (bouton) bouton.remove();

        var id = carte.dataset.id;
        var titre = carte.querySelector('h2').textContent;
        var item = (window.CATALOGUE_ADMIN || []).find(function (c) { return c.id === id; });
        var estVisible = !item || Number(item.visible) === 1;

        if (!estVisible) {
            carte.classList.add('cours-masque');
            var badge = document.createElement('span');
            badge.className = 'badge-masque';
            badge.textContent = 'Masqué sur le site';
            carte.querySelector('.course-info').prepend(badge);
        }

        var actions = document.createElement('div');
        actions.className = 'admin-actions';
        actions.innerHTML =
            '<a href="ajouter-cours.php?id=' + encodeURIComponent(id) + '" class="admin-btn">' +
            '<i class="fa-solid fa-pen" aria-hidden="true"></i> Modifier</a>' +
            '<button type="button" class="admin-btn ' + (estVisible ? 'danger' : '') + '" data-action="visibilite">' +
            (estVisible
                ? '<i class="fa-solid fa-trash" aria-hidden="true"></i> Supprimer'
                : '<i class="fa-solid fa-eye" aria-hidden="true"></i> Réafficher') +
            '</button>';
        carte.querySelector('.course-info').appendChild(actions);

        actions.querySelector('button').addEventListener('click', function () {
            var nouvelleVisibilite = estVisible ? 0 : 1;
            var msg = estVisible
                ? 'Supprimer le cours « ' + titre + ' » (' + id + ') du catalogue public ?'
                : 'Réafficher le cours « ' + titre + ' » (' + id + ') sur le site ?';
            if (!confirm(msg)) return;

            apiPost('php/cours_supprimer.php', { id: id, visible: nouvelleVisibilite })
                .then(function (rep) {
                    if (!rep.ok) throw new Error(rep.erreur || 'Échec de la mise à jour');
                    location.reload();
                })
                .catch(function (e) { alert(e.message); });
        });
    });
    </script>
    <script src="js/progress.js"></script>
    <script src="js/search.js"></script>
</body>
</html>