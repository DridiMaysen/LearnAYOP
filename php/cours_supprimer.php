<?php
require 'config.php';
require_admin();

$d  = lire_json();
$id = $d['id'] ?? '';
if (!preg_match('/^C\d{3,}$/', $id)) {
    json_out(['ok' => false, 'erreur' => 'Identifiant invalide'], 400);
}

$visible = isset($d['visible']) ? (int) (bool) $d['visible'] : 0;

$st = $pdo->prepare('UPDATE cours SET visible = ? WHERE id = ?');
$st->execute([$visible, $id]);

json_out([
    'ok'      => $st->rowCount() > 0,
    'visible' => $visible,
    'erreur'  => $st->rowCount() ? null : 'Cours introuvable ou état inchangé'
]);