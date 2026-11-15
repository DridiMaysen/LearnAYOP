<?php
declare(strict_types=1);

/**
 * À inclure TOUT EN HAUT de chaque page PHP, avant le moindre affichage :
 *   <?php require __DIR__ . '/includes/bootstrap.php'; ?>
 */
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/session.php';
require_once __DIR__ . '/csrf.php';
require_once __DIR__ . '/auth.php';

date_default_timezone_set('UTC');

if (config('debug')) {
    ini_set('display_errors', '1');   // en local : on voit les erreurs
    error_reporting(E_ALL);
} else {
    ini_set('display_errors', '0');   // en ligne : jamais d'erreurs visibles par les visiteurs
    ini_set('log_errors', '1');
}

// En-têtes de sécurité envoyés avec chaque page
header('X-Content-Type-Options: nosniff');                 // le navigateur ne "devine" pas les types de fichiers
header('X-Frame-Options: DENY');                           // notre site ne peut pas être mis dans une iframe (clickjacking)
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Permissions-Policy: camera=(), microphone=(), geolocation=()');

demarrer_session();