<?php
require __DIR__ . '/includes/bootstrap.php';

if (utilisateur_courant()) {
    rediriger('index.php');
}

$erreur = null;
$email  = '';
// Page où revenir après connexion (validée : uniquement une page .php locale)
$redirect = redirection_sure($_GET['redirect'] ?? $_POST['redirect'] ?? null, 'dashboard.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_verifier();
    $email    = normaliser_email((string) ($_POST['email'] ?? ''));
    $resultat = tenter_connexion($email, (string) ($_POST['mot_de_passe'] ?? ''));

    if ($resultat['ok']) {
        rediriger($redirect);
    }
    $erreur = $resultat['erreur'];
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connexion - LearnAYOP</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/auth.css">
</head>
<body>
<?php require __DIR__ . '/includes/navbar.php'; ?>
<main>
    <section class="auth-card">
        <p class="eyebrow">ESPACE MEMBRE</p>
        <h1>Connexion</h1>

        <?php if ($erreur): ?>
            <div class="auth-alert" role="alert"><?= e($erreur) ?></div>
        <?php endif; ?>

        <form method="post" action="login.php" novalidate>
            <?= csrf_champ() ?>
            <input type="hidden" name="redirect" value="<?= e($redirect) ?>">

            <label for="email">Adresse email</label>
            <input type="email" id="email" name="email" value="<?= e($email) ?>"
                   autocomplete="username" maxlength="150" required autofocus>

            <label for="mot_de_passe">Mot de passe</label>
            <input type="password" id="mot_de_passe" name="mot_de_passe"
                   autocomplete="current-password" maxlength="72" required>

            <button type="submit" class="primary-button">Se connecter</button>
        </form>

        <p class="auth-alt">Pas encore de compte ? <a href="register.php">Créer un compte</a></p>
    </section>
</main>
<script src="js/menu.js" defer></script>
</body>
</html>