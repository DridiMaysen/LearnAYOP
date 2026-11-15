<?php
declare(strict_types=1);

function config(?string $cle = null)
{
    static $cfg = null;
    if ($cfg === null) {
        $cfg = require __DIR__ . '/config.php';
    }
    return $cle === null ? $cfg : ($cfg[$cle] ?? null);
}

function db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $c   = config('db');
    $dsn = sprintf(
        'mysql:host=%s;port=%d;dbname=%s;charset=%s',
        $c['host'],
        $c['port'] ?? 3306,
        $c['name'],
        $c['charset']
    );

    try {
        $pdo = new PDO($dsn, $c['user'], $c['pass'], [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);
    } catch (PDOException $e) {
        error_log('[LearnAYOP] Connexion BDD impossible : ' . $e->getMessage());
        http_response_code(500);
        exit(config('debug') ? 'Erreur BDD : ' . $e->getMessage() : 'Service momentanément indisponible.');
    }
    return $pdo;
}