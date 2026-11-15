<?php
require __DIR__ . '/includes/bootstrap.php';

// Déjà connecté : on redirige selon son rôle
if ($u = utilisateur_courant()) {
    rediriger($u['role'] === 'admin' ? 'administration.php' : 'courses.php');
}

$erreurs = [];
$nom = $email = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_verifier();
    $nom   = (string) ($_POST['nom'] ?? '');
    $email = (string) ($_POST['email'] ?? '');

    $resultat = inscrire_utilisateur(
        $nom,
        $email,
        (string) ($_POST['mot_de_passe'] ?? ''),
        (string) ($_POST['confirmation'] ?? '')
    );
    if ($resultat['ok']) {
        rediriger('courses.php');
    }
    $erreurs = $resultat['erreurs'];
}

/** Affiche le message d'erreur d'un champ, s'il y en a un */
function erreur_champ(array $erreurs, string $champ): string
{
    return isset($erreurs[$champ])
        ? '<small class="auth-error" role="alert">' . e($erreurs[$champ]) . '</small>'
        : '';
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inscription - LearnAYOP</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/auth.css">
</head>
<body>
<?php require __DIR__ . '/includes/navbar.php'; ?>
<main>
    <section class="auth-card">
        <p class="eyebrow">REJOIGNEZ-NOUS</p>
        <h1>Créer un compte</h1>

        <form method="post" action="register.php" novalidate>
            <?= csrf_champ() ?>

            <label for="nom">Nom complet</label>
            <input type="text" id="nom" name="nom" value="<?= e($nom) ?>"
                   autocomplete="name" maxlength="100" required autofocus>
            <?= erreur_champ($erreurs, 'nom') ?>

            <label for="email">Adresse email</label>
            <input type="email" id="email" name="email" value="<?= e($email) ?>"
                   autocomplete="email" maxlength="150" required>
            <?= erreur_champ($erreurs, 'email') ?>

            <label for="mot_de_passe">Mot de passe</label>
            <input type="password" id="mot_de_passe" name="mot_de_passe"
                   autocomplete="new-password" minlength="8" maxlength="72" required>
            <small class="auth-hint">8 caractères minimum, avec au moins une lettre et un chiffre.</small>
            <?= erreur_champ($erreurs, 'mot_de_passe') ?>

            <label for="confirmation">Confirmer le mot de passe</label>
            <input type="password" id="confirmation" name="confirmation"
                   autocomplete="new-password" maxlength="72" required>
            <?= erreur_champ($erreurs, 'confirmation') ?>

            <button type="submit" class="primary-button">Créer mon compte</button>
        </form>

        <p class="auth-alt">Déjà inscrit ? <a href="login.php">Se connecter</a></p>
    </section>
</main>
<script src="js/menu.js" defer></script>
</body>
</html>