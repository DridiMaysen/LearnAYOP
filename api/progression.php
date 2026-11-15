<?php
declare(strict_types=1);

require __DIR__ . '/config.php';

$u = utilisateur_courant();

// Sur courses.php, un visiteur non connecté a simplement une progression vide
if (!$u) {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        json_out(['ok' => true, 'connecte' => false, 'cours' => new stdClass()]);
    }
    json_out(['ok' => false, 'erreur' => 'Connexion requise'], 401);
}

$uid = (int) $u['id'];

// Helper : renvoie l'état complet de progression de l'utilisateur connecté
function etat_progression(PDO $pdo, int $uid): array
{
    $coursMap = [];

    // 1. Récupérer tous les éléments terminés
    $st = $pdo->prepare('SELECT cours_id, element_id FROM progression_elements WHERE utilisateur_id = ?');
    $st->execute([$uid]);
    foreach ($st->fetchAll() as $row) {
        $cid = $row['cours_id'];
        if (!isset($coursMap[$cid])) {
            $coursMap[$cid] = ['terminees' => [], 'position' => 0, 'videos' => new stdClass()];
        }
        $coursMap[$cid]['terminees'][] = $row['element_id'];
    }

    // 2. Récupérer les positions et temps vidéos
    $st = $pdo->prepare('SELECT cours_id, position_actuelle, videos_json FROM progression_cours WHERE utilisateur_id = ?');
    $st->execute([$uid]);
    foreach ($st->fetchAll() as $row) {
        $cid = $row['cours_id'];
        if (!isset($coursMap[$cid])) {
            $coursMap[$cid] = ['terminees' => [], 'position' => 0, 'videos' => new stdClass()];
        }
        $coursMap[$cid]['position'] = (int) $row['position_actuelle'];
        $videos = $row['videos_json'] ? json_decode($row['videos_json'], true) : null;
        $coursMap[$cid]['videos'] = is_array($videos) && count($videos) > 0 ? $videos : new stdClass();
    }

    return empty($coursMap) ? [] : $coursMap;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $etat = etat_progression($pdo, $uid);
    json_out([
        'ok'       => true,
        'connecte' => true,
        'cours'    => empty($etat) ? new stdClass() : $etat,
    ]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Vérification CSRF (en-tête X-CSRF-Token envoyé par apiPost)
    $envoye  = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    $attendu = $_SESSION['csrf'] ?? '';
    if (!is_string($envoye) || $attendu === '' || !hash_equals($attendu, $envoye)) {
        json_out(['ok' => false, 'erreur' => 'Jeton de sécurité CSRF invalide'], 403);
    }

    $data    = lire_json();
    $action  = $data['action'] ?? '';
    $coursId = $data['cours']  ?? '';

    if (!preg_match('/^C\d{3,}$/', $coursId)) {
        json_out(['ok' => false, 'erreur' => 'Identifiant de cours invalide'], 400);
    }

    if ($action === 'terminer') {
        $elementId = trim((string) ($data['element'] ?? ''));
        if ($elementId === '' || strlen($elementId) > 100) {
            json_out(['ok' => false, 'erreur' => 'Identifiant élément invalide'], 400);
        }
        $st = $pdo->prepare(
            'INSERT IGNORE INTO progression_elements (utilisateur_id, cours_id, element_id) VALUES (?, ?, ?)'
        );
        $st->execute([$uid, $coursId, $elementId]);
        json_out(['ok' => true]);
    }

    if ($action === 'position') {
        $pos = max(0, (int) ($data['position'] ?? 0));
        $st  = $pdo->prepare(
            'INSERT INTO progression_cours (utilisateur_id, cours_id, position_actuelle)
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE position_actuelle = VALUES(position_actuelle)'
        );
        $st->execute([$uid, $coursId, $pos]);
        json_out(['ok' => true]);
    }

    if ($action === 'video') {
        $videoId = trim((string) ($data['video'] ?? ''));
        $temps   = max(0, (float) ($data['temps'] ?? 0));
        if ($videoId === '' || strlen($videoId) > 80) {
            json_out(['ok' => false, 'erreur' => 'Identifiant vidéo invalide'], 400);
        }

        $st = $pdo->prepare('SELECT videos_json FROM progression_cours WHERE utilisateur_id = ? AND cours_id = ?');
        $st->execute([$uid, $coursId]);
        $existant = $st->fetchColumn();
        $videos   = $existant ? (json_decode($existant, true) ?: []) : [];
        $videos[$videoId] = round($temps, 1);

        $st = $pdo->prepare(
            'INSERT INTO progression_cours (utilisateur_id, cours_id, videos_json)
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE videos_json = VALUES(videos_json)'
        );
        $st->execute([$uid, $coursId, json_encode($videos)]);
        json_out(['ok' => true]);
    }

    json_out(['ok' => false, 'erreur' => 'Action inconnue'], 400);
}

json_out(['ok' => false, 'erreur' => 'Méthode non autorisée'], 405);