<?php
require __DIR__ . '/includes/bootstrap.php';
exiger_connexion();
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <?= csrf_meta() ?>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mes cours commencés - LearnAYOP</title>
    <meta name="description" content="Tous les cours commencés se trouvent ici">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/progress.css">
    <script src="js/api.js" defer></script>
</head>
<body>
   <?php require __DIR__ . '/includes/navbar.php'; ?>
    <main>
        <section class="section-container" id="en-cours">
            <div class="section-heading">
                <div>
                    <p class="eyebrow">MA PROGRESSION</p>
                    <h1>Mes cours commencés</h1>
                </div>
                <a href="courses.html" class="text-link">
                    Tous les cours
                    <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
                </a>
            </div>

            <h2 class="sr-only">Liste de vos cours commencés</h2>

            <div class="course-grid" id="started-list"></div>
            <p class="empty-state" id="started-empty">
                Vous n'avez pas encore commencé de cours.
                <a href="courses.html">
                    Découvrir les cours
                    <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
                </a>
            </p>
        </section>
    </main>
    <footer class="footer">
        <a href="index.html" class="logo">Learn<span>AYOP</span></a>
        <p>Apprendre aujourd'hui, réussir demain.</p>
        <p>© 2026 LearnAYOP — Mini plateforme d'apprentissage.</p>
    </footer>
    <script src="js/menu.js" defer></script>
<script src="js/catalogue.js"></script>
<script src="js/cours-admin-store.js"></script>
<script src="js/progress.js"></script>
</body>
</html>