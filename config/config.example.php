<?php
// Paramètres de l'application. Ce fichier ne doit jamais être publié (GitHub, etc.).
return [
    'db' => [
        'host'    => 'localhost',
        'name'    => 'learnayop',
        'user'    => 'root',      // XAMPP : root
        'pass'    => '',          // XAMPP : mot de passe vide
        'charset' => 'utf8mb4',
    ],
    'session_inactivite' => 1800, // déconnexion après 30 min sans activité
    'debug'              => true, // true en local, false si le site est publié
];