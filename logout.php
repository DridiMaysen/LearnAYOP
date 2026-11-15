<?php
require __DIR__ . '/includes/bootstrap.php';

// On ne se déconnecte qu'avec un POST + jeton CSRF (le bouton de la navbar).
// Si quelqu'un ouvre simplement logout.php dans son navigateur : rien ne se passe.
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    rediriger('index.php');
}
csrf_verifier();
deconnecter_utilisateur();
rediriger('login.php');