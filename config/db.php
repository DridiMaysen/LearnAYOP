<?php
declare(strict_types=1);

/** Lit la configuration : config() renvoie tout, config('db') une section. */
function config(?string $cle = null)
{
    static $cfg = null;               // static : le fichier n'est lu qu'une fois
    if ($cfg === null) {
        $cfg = require __DIR__ . '/config.php';
    }
    return $cle === null ? $cfg : ($cfg[$cle] ?? null);
}

/** Renvoie LA connexion à la base (créée au premier appel, réutilisée ensuite). */
function db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $c   = config('db');
    $dsn = sprintf('mysql:host=%s;dbname=%s;charset=%s', $c['host'], $c['name'], $c['charset']);

    try {
        $pdo = new PDO($dsn, $c['user'], $c['pass'], [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,  // les erreurs SQL deviennent des exceptions
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,        // les lignes reviennent en tableaux associatifs
            PDO::ATTR_EMULATE_PREPARES   => false,                   // vraies requêtes préparées côté MySQL
        ]);
    } catch (PDOException $e) {
        // Le détail va dans le journal du serveur, pas à l'écran :
        // le message d'erreur brut contient le nom d'utilisateur et le serveur.
        error_log('[LearnAYOP] Connexion BDD impossible : ' . $e->getMessage());
        http_response_code(500);
        exit(config('debug') ? 'Erreur BDD : ' . $e->getMessage() : 'Service momentanément indisponible.');
    }
    return $pdo;
}