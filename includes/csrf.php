<?php
declare(strict_types=1);

/** Jeton secret propre à la session (créé au premier appel). */
function csrf_token(): string
{
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(32)); // 64 caractères imprévisibles
    }
    return $_SESSION['csrf'];
}

/** À mettre dans CHAQUE <form method="post"> : champ caché contenant le jeton. */
function csrf_champ(): string
{
    return '<input type="hidden" name="_csrf" value="' . e(csrf_token()) . '">';
}

/** À mettre dans le <head> : sert plus tard aux appels AJAX (fetch). */
function csrf_meta(): string
{
    return '<meta name="csrf-token" content="' . e(csrf_token()) . '">';
}

/** Vérifie le jeton reçu. S'il est absent ou faux : erreur 403 et on s'arrête. */
function csrf_verifier(): void
{
    // Le jeton arrive soit d'un formulaire (_csrf), soit d'un fetch (en-tête X-CSRF-Token)
    $envoye  = $_POST['_csrf'] ?? ($_SERVER['HTTP_X_CSRF_TOKEN'] ?? '');
    $attendu = $_SESSION['csrf'] ?? '';

    // hash_equals compare en temps constant (évite les attaques par mesure du temps)
    if (!is_string($envoye) || $attendu === '' || !hash_equals($attendu, $envoye)) {
        http_response_code(403);
        exit('Requête refusée (jeton de sécurité invalide). Rechargez la page et réessayez.');
    }
}