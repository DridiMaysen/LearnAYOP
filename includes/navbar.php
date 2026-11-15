<?php
// Navbar commune à toutes les pages.
$pageCourante = basename($_SERVER['SCRIPT_NAME']);   // ex : "index.php"
$utilisateur  = utilisateur_courant();               // null si personne n'est connecté

// Petite fonction : renvoie ' class="active"' si on est sur cette page
$actif = static fn(string $p): string => $pageCourante === $p ? ' class="active"' : '';
?>
<header class="navbar">
    <a href="index.php" class="logo">Learn<span>AYOP</span></a>
    <button class="burger" id="burger" type="button"
            aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="main-nav">
        <i class="fa-solid fa-bars" aria-hidden="true"></i>
    </button>
    <nav class="nav-links" id="main-nav" aria-label="Navigation principale">
        <a href="index.php"<?= $actif('index.php') ?>>
            <i class="fa-solid fa-house" aria-hidden="true"></i> Accueil
        </a>
        <a href="courses.php"<?= $actif('courses.php') ?>>
            <i class="fa-solid fa-book-open" aria-hidden="true"></i> Tous les cours
        </a>

        <?php if ($utilisateur): ?>
        <a href="dashboard.php#en-cours"<?= $actif('dashboard.php') ?>>
            <i class="fa-solid fa-circle-play" aria-hidden="true"></i> Mes cours commencés
        </a>
        <?php endif; ?>

        <?php if ($utilisateur && $utilisateur['role'] === 'admin'): ?>
        <a href="administration.php"<?= $actif('administration.php') ?>>
            <i class="fa-solid fa-user-shield" aria-hidden="true"></i> Administration
        </a>
        <?php endif; ?>

        <?php if ($utilisateur): ?>
            <div class="nav-account">
                <span class="nav-user">
                    <i class="fa-solid fa-user" aria-hidden="true"></i> <?= e($utilisateur['nom']) ?>
                </span>
                <!-- Déconnexion = formulaire POST avec jeton CSRF, pas un simple lien -->
                <form method="post" action="logout.php" class="nav-logout">
                    <?= csrf_champ() ?>
                    <button type="submit">
                        <i class="fa-solid fa-right-from-bracket" aria-hidden="true"></i> Déconnexion
                    </button>
                </form>
            </div>
        <?php else: ?>
            <a href="login.php"<?= $actif('login.php') ?>>
                <i class="fa-solid fa-right-to-bracket" aria-hidden="true"></i> Connexion
            </a>
            <a href="register.php"<?= $actif('register.php') ?>>
                <i class="fa-solid fa-user-plus" aria-hidden="true"></i> Inscription
            </a>
        <?php endif; ?>
    </nav>
</header>