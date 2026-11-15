<?php
declare(strict_types=1);

/* ============================================================
 *  auth.php : toute la logique d'authentification
 *  (utilise e(), rediriger()... définis dans helpers.php)
 * ============================================================ */

const MAX_ECHECS_EMAIL = 5;      // échecs autorisés par email...
const MAX_ECHECS_IP    = 20;     // ...et par adresse IP
const FENETRE_ECHECS   = 900;    // ...pendant 15 minutes (en secondes)

// Hash d'un mot de passe bidon. Sert quand l'email n'existe pas, pour que
// password_verify() travaille quand même (même temps de réponse dans tous les cas).
const HASH_FACTICE = '$2y$10$heOFnCfkX2rnYGFIgRL30e3sDTi6UKbzwJKu55BtEeqOLAmyMncNS';

/* ---------- BLOC A : l'utilisateur connecté ---------- */

/** Renvoie l'utilisateur connecté (tableau) ou null. Relit la base : le rôle est toujours à jour. */
function utilisateur_courant(bool $recharger = false): ?array
{
    static $cache = false;               // évite de refaire la requête à chaque appel
    if ($cache !== false && !$recharger) {
        return $cache;
    }
    $id = $_SESSION['user_id'] ?? null;
    if (!$id) {
        return $cache = null;
    }
    $st = db()->prepare('SELECT id, nom, email, role FROM utilisateurs WHERE id = ?');
    $st->execute([(int) $id]);
    $u = $st->fetch() ?: null;
    if (!$u) {                           // le compte a été supprimé entre-temps
        unset($_SESSION['user_id']);
    }
    return $cache = $u;
}

/** Ouvre la session de l'utilisateur après un mot de passe correct. */
function connecter_utilisateur(int $id): void
{
    session_regenerate_id(true);          // NOUVEL identifiant : anti "session fixation"
    $_SESSION['user_id'] = $id;
    $_SESSION['derniere_activite'] = time();
    unset($_SESSION['csrf']);             // nouveau jeton CSRF après changement de privilèges
    utilisateur_courant(true);            // actualise immédiatement le cache
}

function deconnecter_utilisateur(): void
{
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $p = session_get_cookie_params();
        setcookie(session_name(), '', [
            'expires'  => time() - 3600,
            'path'     => $p['path'],
            'domain'   => $p['domain'],
            'secure'   => $p['secure'],
            'httponly' => true,
            'samesite' => 'Lax',
        ]);
    }
    session_destroy();
}

/* ---------- BLOC B : contrôle d'accès (gardes) ---------- */

/** À mettre en haut d'une page réservée aux connectés. */
function exiger_connexion(): array
{
    $u = utilisateur_courant();
    if (!$u) {
        $qs   = $_SERVER['QUERY_STRING'] ?? '';
        $page = basename($_SERVER['SCRIPT_NAME']) . ($qs !== '' ? '?' . $qs : '');
        rediriger('login.php?redirect=' . urlencode($page));   // on reviendra ici après la connexion
    }
    return $u;
}

/** À mettre en haut d'une page réservée aux administrateurs. */
function exiger_admin(): array
{
    $u = exiger_connexion();
    if ($u['role'] !== 'admin') {
        http_response_code(403);
        exit('Accès refusé : espace réservé aux administrateurs.');
    }
    return $u;
}

/* ---------- BLOC C : protection contre la force brute ---------- */

function trop_d_echecs(string $email, string $ip): bool
{
    $depuis = gmdate('Y-m-d H:i:s', time() - FENETRE_ECHECS);

    // Ménage : on oublie les échecs plus vieux que la fenêtre
    db()->prepare('DELETE FROM tentatives_connexion WHERE tente_le < ?')->execute([$depuis]);

    $st = db()->prepare('SELECT COUNT(*) FROM tentatives_connexion WHERE email = ? AND tente_le >= ?');
    $st->execute([$email, $depuis]);
    if ((int) $st->fetchColumn() >= MAX_ECHECS_EMAIL) {
        return true;
    }

    $st = db()->prepare('SELECT COUNT(*) FROM tentatives_connexion WHERE ip = ? AND tente_le >= ?');
    $st->execute([$ip, $depuis]);
    return (int) $st->fetchColumn() >= MAX_ECHECS_IP;
}

function enregistrer_echec(string $email, string $ip): void
{
    db()->prepare('INSERT INTO tentatives_connexion (email, ip, tente_le) VALUES (?, ?, ?)')
        ->execute([$email, $ip, gmdate('Y-m-d H:i:s')]);
}

function effacer_echecs(string $email): void
{
    db()->prepare('DELETE FROM tentatives_connexion WHERE email = ?')->execute([$email]);
}

/* ---------- BLOC D : la connexion ---------- */

/** @return array{ok:bool, erreur:?string} */
function tenter_connexion(string $email, string $mdp): array
{
    $email = normaliser_email($email);
    $ip    = adresse_ip();

    if (trop_d_echecs($email, $ip)) {
        return ['ok' => false, 'erreur' => 'Trop de tentatives. Réessayez dans quelques minutes.'];
    }

    $st = db()->prepare('SELECT id, mot_de_passe FROM utilisateurs WHERE email = ?');
    $st->execute([$email]);
    $u = $st->fetch();

    // password_verify est appelé dans TOUS les cas, même si l'email n'existe pas
    $ok = password_verify($mdp, $u['mot_de_passe'] ?? HASH_FACTICE) && $u;

    if (!$ok) {
        enregistrer_echec($email, $ip);
        // Même message que l'email existe ou non : on ne révèle pas qui est inscrit
        return ['ok' => false, 'erreur' => 'Email ou mot de passe incorrect.'];
    }

    // Si PHP a changé son algorithme par défaut, on re-hashe le mot de passe au passage
    if (password_needs_rehash($u['mot_de_passe'], PASSWORD_DEFAULT)) {
        db()->prepare('UPDATE utilisateurs SET mot_de_passe = ? WHERE id = ?')
            ->execute([password_hash($mdp, PASSWORD_DEFAULT), $u['id']]);
    }

    effacer_echecs($email);
    connecter_utilisateur((int) $u['id']);
    return ['ok' => true, 'erreur' => null];
}

/* ---------- BLOC E : l'inscription ---------- */

/** @return array{ok:bool, erreurs:array<string,string>} */
function inscrire_utilisateur(string $nom, string $email, string $mdp, string $confirmation): array
{
    $erreurs = [];
    $nom   = trim(preg_replace('/\s+/u', ' ', $nom));
    $email = normaliser_email($email);

    $longueurNom = preg_match_all('/./u', $nom);      // compte les caractères (accents inclus)
    if ($longueurNom < 2 || $longueurNom > 100) {
        $erreurs['nom'] = 'Le nom doit contenir entre 2 et 100 caractères.';
    }
    if (strlen($email) > 150 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $erreurs['email'] = 'Adresse email invalide.';
    }
    // bcrypt ignore ce qui dépasse 72 octets : on refuse plutôt que de tronquer en silence
    if (strlen($mdp) < 8 || strlen($mdp) > 72) {
        $erreurs['mot_de_passe'] = 'Le mot de passe doit faire entre 8 et 72 caractères.';
    } elseif (!preg_match('/[A-Za-z]/', $mdp) || !preg_match('/\d/', $mdp)) {
        $erreurs['mot_de_passe'] = 'Le mot de passe doit contenir au moins une lettre et un chiffre.';
    }
    if ($mdp !== $confirmation) {
        $erreurs['confirmation'] = 'Les deux mots de passe ne correspondent pas.';
    }
    if ($erreurs) {
        return ['ok' => false, 'erreurs' => $erreurs];
    }

    try {
        // Le rôle est écrit EN DUR ici : on ne le lit jamais depuis le formulaire
        db()->prepare("INSERT INTO utilisateurs (nom, email, mot_de_passe, role) VALUES (?, ?, ?, 'etudiant')")
            ->execute([$nom, $email, password_hash($mdp, PASSWORD_DEFAULT)]);
    } catch (PDOException $e) {
        if ($e->getCode() === '23000') {           // contrainte UNIQUE violée : email déjà pris
            return ['ok' => false, 'erreurs' => ['email' => 'Cette adresse email est déjà utilisée.']];
        }
        throw $e;                                  // autre erreur : on ne la masque pas
    }

    connecter_utilisateur((int) db()->lastInsertId());
    return ['ok' => true, 'erreurs' => []];
}