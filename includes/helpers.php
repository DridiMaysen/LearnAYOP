<?php
declare(strict_types=1);

/**
 * Échappe une valeur avant de l'afficher dans du HTML (protection XSS).
 * RÈGLE : tout ce qui vient d'un utilisateur ou de la base passe par e().
 */
function e(?string $valeur): string
{
    return htmlspecialchars((string) $valeur, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/** Un email est comparé en minuscules et sans espaces autour. */
function normaliser_email(string $email): string
{
    return strtolower(trim($email));
}

/** Adresse IP du visiteur. On n'utilise PAS X-Forwarded-For : le client peut le falsifier. */
function adresse_ip(): string
{
    return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
}

/** Redirige vers une page et arrête le script (sinon le code après continuerait à s'exécuter). */
function rediriger(string $page): never
{
    header('Location: ' . $page);
    exit;
}

/**
 * Valide la page où revenir après la connexion (protection "open redirect").
 * On n'accepte qu'une page .php locale, jamais une adresse externe comme https://evil.com
 */
function redirection_sure(?string $cible, string $defaut = 'dashboard.php'): string
{
    if (is_string($cible) && preg_match('/^[a-z0-9\-]+\.php(\?[A-Za-z0-9=&_%\-]*)?$/', $cible)) {
        return $cible;
    }
    return $defaut;
}