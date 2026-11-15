<?php
require 'config.php';
header('Content-Type: application/javascript; charset=utf-8');

$catalogue      = [];
$catalogueAdmin = [];
$donnees        = new stdClass();

foreach ($pdo->query('SELECT * FROM cours ORDER BY id') as $r) {
    $visible = (int) ($r['visible'] ?? 1);
    $item = [
        'id'           => $r['id'],
        'cle'          => $r['cle'],
        'sigle'        => $r['sigle'],
        'titreCarte'   => $r['titre_carte'],
        'tag'          => $r['tag'],
        'niveau'       => $r['niveau'],
        'matiere'      => $r['matiere'],
        'matiereLabel' => $r['matiere_label'],
        'difficulte'   => $r['difficulte'],
        'cover'        => $r['cover'],
        'icone'        => $r['icone'],
        'emoji'        => $r['icone'],
        'description'  => $r['description'],
        'visible'      => $visible,
    ];

    $catalogueAdmin[] = $item;
    if ($visible === 1) {
        $catalogue[] = $item;
    }

    $donnees->{$r['cle']} = json_decode($r['contenu']);
}

$opt = JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES;
echo 'window.CATALOGUE = ' . json_encode($catalogue, $opt) . ";\n";
echo 'window.CATALOGUE_ADMIN = ' . json_encode($catalogueAdmin, $opt) . ";\n";
echo 'const donneesCours = ' . json_encode($donnees, $opt) . ";\n";