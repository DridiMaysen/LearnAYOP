<?php
require __DIR__ . '/includes/bootstrap.php';
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LearnAYOP - Apprendre en ligne</title>
    <meta name="description" content="LearnAYOP, la mini plateforme d'apprentissage en ligne : découvrez des cours, apprenez à votre rythme et suivez votre progression.">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/auth.css">
</head>
<body>
   <?php require __DIR__ . '/includes/navbar.php'; ?>
    <main>
        <section class="hero">
            <div class="hero-content">
                <p class="eyebrow">APPRENEZ À VOTRE RYTHME</p>
                <h1>
                    Développez vos compétences avec
                    <span>LearnAYOP</span>
                </h1>
                <p class="hero-description">
                    Découvrez des cours passionnants, apprenez de nouvelles
                    compétences et construisez votre avenir dès aujourd'hui.
                </p>
                <a href="courses.php" class="primary-button">
                    Explorer les cours
                    <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
                </a>
            </div>
            <div class="hero-visual">
                <div class="visual-icon">
                    <i class="fa-solid fa-graduation-cap" aria-hidden="true"></i>
                </div>
                <p class="visual-label">
                    Votre prochaine réussite commence ici
                </p>
                <div class="floating-card card-one">
                    <span class="floating-icon">
                        <i class="fa-solid fa-database" aria-hidden="true"></i>
                    </span>
                    <div>
                        <strong>Bases de données</strong>
                        <small>Concevez et interrogez vos SGBD</small>
                    </div>
                </div>
                <div class="floating-card card-two">
                    <span class="floating-icon">
                        <i class="fa-solid fa-chart-line" aria-hidden="true"></i>
                    </span>
                    <div>
                        <strong>Votre progression</strong>
                        <small>Chaque jour, un nouveau pas !</small>
                    </div>
                </div>
            </div>
        </section>
    </main>
    <footer class="footer">
        <a href="index.php" class="logo">Learn<span>AYOP</span></a>
        <p>Apprendre aujourd'hui, réussir demain.</p>
        <p>© 2026 LearnAYOP — Mini plateforme d'apprentissage.</p>
    </footer>
    <script src="js/menu.js" defer></script>
</body>
</html>