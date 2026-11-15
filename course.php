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
    <title>Cours - LearnAYOP</title>
    <meta name="description" content="Apprenez avec des cours videos et quiz.">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/progress.css">
    <link rel="stylesheet" href="css/cours.css">
    <script src="js/menu.js" defer></script>
    <script src="php/cours_js.php" defer></script>
    <script src="js/api.js" defer></script>
    <script src="js/progress.js" defer></script>
    <script src="js/cours.js" defer></script>
</head>
<body class="course-page">
    <?php require __DIR__ . '/includes/navbar.php'; ?>
    <div class="layout" id="layout">
        <!-- sidebar qui contient progression du cours et les modules avec leurs barre de progression -->
        <aside class="sidebar" id="sidebar">
            <h2>Contenu du cours</h2>
            <div class="overall-progress">
                <p>Progression du cours</p>
                <progress id="courseProgress" value="0" max="100"></progress>
                <p id="courseProgressText">0 % terminé</p>
            </div>
            <div id="moduleList"></div>
        </aside>
        <!--contenu du cours qui contient toolbar avec les boutons de preference ele contenu du cours -->
        <main class="course-content">
            <div class="course-toolbar">
                <button
                    class="icon-button"
                    id="themeBtn"
                    type="button"
                    aria-label="Activer le thème sombre"
                    title="Changer de thème">
                    <i class="fa-solid fa-moon" aria-hidden="true"></i>
                </button>
                <button
                    class="icon-button"
                    id="fullscreenBtn"
                    type="button"
                    aria-label="Passer en plein écran"
                    title="Plein écran">
                    <i class="fa-solid fa-expand" aria-hidden="true"></i>
                </button>
                <button
                    class="icon-button outline-button"
                    id="outlineBtn"
                    type="button"
                    aria-label="Masquer les modules"
                    aria-pressed="false"
                    title="Afficher ou masquer les modules">
                    <i class="fa-solid fa-table-columns" aria-hidden="true"></i>
                    <span>Outline</span>
                </button>
            </div>
            <!--contenu du cours lesson info, title,content initiallement vides-->
            <section class="lesson">
                <p id="lessonInfo"></p>
                <h1 id="lessonTitle">Chargement du cours...</h1>
                <div id="lessonContent"></div>
            </section>
            <!-- navigation entre les cours-->
            <div class="navigation">
                <button id="prevBtn" type="button" disabled>
                    <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
                    Précédent
                </button>
                <button id="nextBtn" type="button">
                    Suivant
                    <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
                </button>
            </div>
        </main>
    </div>
</body>
</html>