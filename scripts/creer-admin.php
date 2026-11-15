<?php
/**
 * Crée (ou promeut) un compte administrateur. À lancer en ligne de commande :
 *     php scripts/creer_admin.php
 * Refuse de s'exécuter depuis le navigateur.
 */
if (PHP_SAPI !== 'cli') {          // PHP_SAPI vaut 'cli' uniquement en ligne de commande
    http_response_code(404);
    exit;
}
require __DIR__ . '/../config/db.php';

/** Pose une question et lit la réponse. $cache = true : masque la saisie (Linux/Mac). */
function lire(string $question, bool $cache = false): string
{
    echo $question;
    if ($cache && DIRECTORY_SEPARATOR === '/') { system('stty -echo'); }
    $v = trim((string) fgets(STDIN));
    if ($cache && DIRECTORY_SEPARATOR === '/') { system('stty echo'); echo PHP_EOL; }
    return $v;
}

$nom   = lire("Nom de l'admin : ");
$email = strtolower(lire('Email : '));
$mdp   = lire('Mot de passe (8-72 car., lettre + chiffre) : ', true);

// Mêmes règles que l'inscription
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($nom) < 2
    || strlen($mdp) < 8 || strlen($mdp) > 72
    || !preg_match('/[A-Za-z]/', $mdp) || !preg_match('/\d/', $mdp)) {
    exit("Données invalides.\n");
}

$hash = password_hash($mdp, PASSWORD_DEFAULT);

$st = db()->prepare('SELECT id FROM utilisateurs WHERE email = ?');
$st->execute([$email]);

if ($id = $st->fetchColumn()) {
    // L'email existe déjà : on le promeut admin et on met à jour le mot de passe
    db()->prepare("UPDATE utilisateurs SET role = 'admin', mot_de_passe = ? WHERE id = ?")
        ->execute([$hash, $id]);
    echo "Compte existant promu administrateur.\n";
} else {
    db()->prepare("INSERT INTO utilisateurs (nom, email, mot_de_passe, role) VALUES (?, ?, ?, 'admin')")
        ->execute([$nom, $email, $hash]);
    echo "Administrateur créé.\n";
}