<?php
declare(strict_types=1);

require_once __DIR__ . '/../includes/bootstrap.php';

$pdo = db();

function json_out(array $data, int $code = 200): never
{
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function require_admin(): void
{
    $u = utilisateur_courant();
    if (!$u || $u['role'] !== 'admin') {
        json_out(['ok' => false, 'erreur' => 'Accès refusé : administrateur requis'], 403);
    }

    // Vérification du jeton CSRF envoyé par apiPost()
    $envoye  = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    $attendu = $_SESSION['csrf'] ?? '';
    if (!is_string($envoye) || $attendu === '' || !hash_equals($attendu, $envoye)) {
        json_out(['ok' => false, 'erreur' => 'Jeton de sécurité CSRF invalide'], 403);
    }
}

function lire_json(): array
{
    $d = json_decode(file_get_contents('php://input'), true);
    if (!is_array($d)) {
        json_out(['ok' => false, 'erreur' => 'JSON invalide'], 400);
    }
    return $d;
}