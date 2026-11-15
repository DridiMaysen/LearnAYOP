# LearnAYOP – Plateforme d'apprentissage en ligne

## 1. Présentation du projet

**LearnAYOP** est une plateforme web d'apprentissage en ligne conçue pour faciliter l'accès aux cours et permettre aux étudiants (notamment à l'ISSAT Sousse) d'apprendre de manière interactive et organisée.

La plateforme propose un espace d'apprentissage complet permettant aux utilisateurs inscrits de consulter un catalogue de cours, parcourir les différents modules et leçons, valider leurs connaissances grâce à des quiz et sauvegarder leur progression en base de données.

Elle intègre également un espace d'administration sécurisé permettant de gérer l'ensemble du contenu pédagogique : ajout, modification et suppression des cours.

## 2. Objectifs du projet

Les principaux objectifs de LearnAYOP sont :

- Faciliter l'accès aux ressources pédagogiques via une architecture client-serveur dynamique.
- Gérer l'authentification des utilisateurs et le contrôle d'accès par rôles (Étudiant / Administrateur).
- Organiser les cours sous forme de modules, de leçons (texte ou HTML riche) et de quiz.
- Permettre le suivi persistant de la progression des utilisateurs dans MySQL.
- Offrir une interface d'administration complète (création, édition et suppression des cours).
- Garantir la sécurité de l'application (hachage des mots de passe, requêtes préparées PDO, protection CSRF/XSS).
- Améliorer l'expérience utilisateur grâce à une interface responsive et des options de confort (mode sombre, plein écran, masquage du plan).

## 3. Fonctionnalités principales

### 3.1. Authentification et gestion des comptes

**Inscription (`register.php`) et Connexion (`login.php`)**
- Création de compte utilisateur et authentification sécurisée.
- Redirection automatique selon le rôle (espace étudiant ou administration).
- Protection contre les attaques par force brute (limitation des tentatives de connexion) et déconnexion sécurisée (`logout.php`).

### 3.2. Espace étudiant

**Page d'accueil (`index.php`)**
- Présentation générale de la plateforme et accès rapide aux fonctionnalités.
- Barre de navigation dynamique adaptée à l'état de connexion et au rôle de l'utilisateur.

**Catalogue des cours (`courses.php`)**
- Affichage dynamique des cours depuis la base de données.
- Recherche en temps réel tolérante aux accents et à la casse.
- Filtrage par niveau et par matière.

**Lecteur de cours (`course.php`)**
- Consultation du contenu pédagogique structuré par modules et leçons.
- Quiz interactifs en fin de module et évaluation finale.
- Options de confort de lecture : thème sombre, mode plein écran et masquage du menu latéral.

**Tableau de bord (`dashboard.php`)**
- Consultation des cours commencés.
- Visualisation détaillée de l'avancement et reprise rapide de l'apprentissage.

### 3.3. Espace administrateur

**Administration (`administration.php`)**
- Vue d'ensemble des cours enregistrés sur la plateforme.
- Accès rapide à la création, la modification et la suppression d'un cours.

**Ajout et modification d'un cours (`ajouter-cours.php`)**
- Création d'un nouveau cours ou édition d'un cours existant.
- Définition des métadonnées (titre, matière, niveau, difficulté, description).
- Gestion dynamique des modules, des leçons (texte simple ou HTML) et des quiz associés.

### 3.4. Sécurité mise en œuvre

- **Hachage des mots de passe :** utilisation de `password_hash()` (bcrypt) et `password_verify()`.
- **Requêtes préparées :** utilisation systématique de PDO pour prévenir les injections SQL.
- **Protection CSRF et XSS :** jetons de sécurité sur les formulaires POST et échappement des sorties HTML.
- **Sessions sécurisées :** cookies `HttpOnly` et `SameSite`, expiration après inactivité.

## 4. Technologies utilisées

| Technologie | Utilisation |
|---|---|
| HTML5 | Structure sémantique des pages |
| CSS3 | Mise en forme, design responsive (Flexbox/Grid) et thème sombre |
| JavaScript (ES6+) | Interactions dynamiques, appels API (`fetch`), lecteur de cours et filtrage |
| PHP 8.3 | Logique serveur, authentification, sécurité et API REST interne |
| MySQL | Base de données relationnelle (utilisateurs, cours, progression) |

## 5. Structure du projet

```text
LearnAYOP/
├── api/
│   ├── config.php             # Configuration de l'API
│   ├── cours_ajouter.php      # Endpoint de création d'un cours
│   ├── cours_js.php           # Fourniture des données des cours au client
│   ├── cours_modifier.php     # Endpoint de modification d'un cours
│   ├── cours_supprimer.php    # Endpoint de suppression d'un cours
│   └── progression.php        # Enregistrement et récupération de la progression
├── config/
│   ├── config.example.php     # Modèle de configuration
│   ├── config.php             # Configuration locale (non versionnée)
│   └── db.php                 # Connexion PDO à la base de données
├── css/
│   ├── admin.css              # Styles de l'interface d'administration
│   ├── auth.css               # Styles des pages de connexion et d'inscription
│   ├── cours.css              # Styles du lecteur de cours et du mode sombre
│   ├── progress.css           # Styles des barres et indicateurs de progression
│   └── style.css              # Styles globaux et barre de navigation
├── database/
│   └── schema.sql             # Script SQL de création des tables
├── includes/
│   ├── auth.php               # Contrôle d'accès et vérification des rôles
│   ├── bootstrap.php          # Initialisation commune de l'application
│   ├── csrf.php               # Génération et vérification des jetons CSRF
│   ├── helpers.php            # Fonctions utilitaires (échappement, etc.)
│   ├── navbar.php             # Barre de navigation commune dynamique
│   └── session.php            # Gestion sécurisée des sessions
├── js/
│   ├── ajouter-cours.js       # Logique front-end d'ajout et de modification des cours
│   ├── api.js                 # Gestion centralisée des requêtes AJAX/Fetch avec CSRF
│   ├── Cours.js               # Logique du lecteur de cours et validation des quiz
│   ├── courses-render.js      # Affichage dynamique des cartes de cours
│   ├── menu.js                # Gestion du menu responsive
│   ├── Progress.js            # Synchronisation et affichage de la progression
│   └── search.js              # Recherche et filtrage en temps réel
├── scripts/
│   └── creer-admin.php        # Script d'initialisation d'un compte administrateur
├── administration.php         # Tableau de bord administrateur
├── ajouter-cours.php          # Interface de création et d'édition d'un cours
├── course.php                 # Lecteur de cours
├── courses.php                # Catalogue des cours
├── dashboard.php              # Tableau de bord étudiant
├── index.php                  # Page d'accueil
├── login.php                  # Page de connexion
├── logout.php                 # Traitement de la déconnexion
└── register.php               # Page d'inscription