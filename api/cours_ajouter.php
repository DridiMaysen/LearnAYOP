<?php
require 'config.php';
require_admin();

$data  = lire_json();
$meta  = $data['meta']  ?? null;
$cours = $data['cours'] ?? null;

if (!$meta || !$cours || empty($cours['modules']) || empty($cours['quizFinal'])) {
    json_out(['ok' => false, 'erreur' => 'Données du cours incomplètes'], 400);
}
foreach (['titreCarte','tag','niveau','matiere','matiereLabel','difficulte','cover','icone','description'] as $c) {
    if (empty($meta[$c])) json_out(['ok' => false, 'erreur' => "Champ manquant : $c"], 400);
}

function slug($t) {
    $t = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $t);
    $t = strtolower(trim(preg_replace('/[^a-zA-Z0-9]+/', '-', $t), '-'));
    return $t ?: 'cours';
}

try {
    $pdo->beginTransaction();

    // prochain id : C004, C005...
    $max = (int) $pdo->query("SELECT COALESCE(MAX(CAST(SUBSTRING(id,2) AS UNSIGNED)),0) FROM cours")->fetchColumn();
    $id  = 'C' . str_pad($max + 1, 3, '0', STR_PAD_LEFT);

    // clé unique
    $base = slug($meta['titreCarte']);
    $cle  = $base; $n = 2;
    $st = $pdo->prepare('SELECT COUNT(*) FROM cours WHERE cle = ?');
    while (true) {
        $st->execute([$cle]);
        if (!$st->fetchColumn()) break;
        $cle = $base . '-' . $n++;
    }

    $pdo->prepare('INSERT INTO cours
        (id,cle,sigle,titre_carte,tag,niveau,matiere,matiere_label,difficulte,cover,icone,description,contenu)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)')
        ->execute([
            $id, $cle, $meta['sigle'] ?? $meta['titreCarte'], $meta['titreCarte'],
            $meta['tag'], $meta['niveau'], $meta['matiere'], $meta['matiereLabel'],
            $meta['difficulte'], $meta['cover'], $meta['icone'], $meta['description'],
            json_encode($cours, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        ]);

    $pdo->commit();
    json_out(['ok' => true, 'id' => $id, 'cle' => $cle]);
} catch (Exception $e) {
    $pdo->rollBack();
    json_out(['ok' => false, 'erreur' => 'Erreur base de données'], 500);
}