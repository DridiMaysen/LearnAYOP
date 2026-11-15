<?php
declare(strict_types=1);

/** Démarre la session avec des réglages sécurisés. */
function demarrer_session(): void
{
    if (session_status() !== PHP_SESSION_NONE) {
        return; // déjà démarrée
    }

    // Le cookie est "Secure" (HTTPS uniquement) dès que le site tourne en HTTPS
    $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');

    ini_set('session.use_strict_mode', '1');   // refuse les identifiants inventés
    ini_set('session.use_only_cookies', '1');  // jamais d'identifiant dans l'URL
    ini_set('session.cookie_httponly', '1');   // illisible par JavaScript

    session_name('LEARNAYOPSESS');
    session_set_cookie_params([
        'lifetime' => 0,        // le cookie disparaît à la fermeture du navigateur
        'path'     => '/',
        'secure'   => $https,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_start();

    // Expiration après inactivité
    $limite = (int) config('session_inactivite');
    if (isset($_SESSION['derniere_activite']) && (time() - $_SESSION['derniere_activite']) > $limite) {
        $_SESSION = [];                  // on vide la session
        session_regenerate_id(true);     // et on change d'identifiant
    }
    $_SESSION['derniere_activite'] = time();
}