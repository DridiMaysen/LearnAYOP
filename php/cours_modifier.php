<?php
require 'config.php';
require_admin();

$data  = lire_json();
$id    = $data['id']    ?? '';
$meta  = $data['meta']  ?? null;
$cours = $data['cours'] ?? null;

if (!preg_match('/^C\d{3,}$/', $id)) {
    json_out(['ok' => false, 'erreur' => 'Identifiant invalide'], 400);
}
if (!$meta || !$cours || empty($cours['modules']) || empty($cours['quizFinal'])) {
    json_out(['ok' => false, 'erreur' => 'Données du cours incomplètes'], 400);
}
foreach (['titreCarte','tag','niveau','matiere','matiereLabel','difficulte','cover','icone','description'] as $c) {
    if (empty($meta[$c])) {
        json_out(['ok' => false, 'erreur' => "Champ manquant : $c"], 400);
    }
}

$st = $pdo->prepare('UPDATE cours SET
    sigle = ?, titre_carte = ?, tag = ?, niveau = ?, matiere = ?,
    matiere_label = ?, difficulte = ?, cover = ?, icone = ?, description = ?, contenu = ?
    WHERE id = ?');

$st->execute([
    $meta['sigle'] ?? $meta['titreCarte'],
    $meta['titreCarte'],
    $meta['tag'],
    $meta['niveau'],
    $meta['matiere'],
    $meta['matiereLabel'],
    $meta['difficulte'],
    $meta['cover'],
    $meta['icone'],
    $meta['description'],
    json_encode($cours, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
    $id
]);

json_out(['ok' => true, 'id' => $id]);