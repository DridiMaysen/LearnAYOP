# LearnAYOP – Plateforme d'apprentissage en ligne

## 1. Présentation du projet

**LearnAYOP** est une plateforme web d'apprentissage en ligne conçue pour faciliter l'accès aux cours et permettre aux utilisateurs d'apprendre de manière interactive et organisée.

La plateforme propose un espace d'apprentissage permettant aux étudiants de consulter des cours, parcourir leurs différents modules et parties, répondre à des quiz et suivre leur progression.

Elle intègre également une interface d'administration permettant de gérer le contenu pédagogique, notamment l'ajout et la suppression des cours.

## 2. Objectifs du projet

Les principaux objectifs de LearnAYOP sont :

- Faciliter l'accès aux ressources pédagogiques.
- Organiser les cours sous forme de modules et de parties.
- Proposer des quiz pour évaluer les connaissances des apprenants.
- Permettre le suivi de la progression des utilisateurs.
- Offrir une interface d'administration pour gérer les cours.
- Améliorer l'expérience d'apprentissage grâce à une interface simple et intuitive.

## 3. Fonctionnalités principales

### 3.1. Espace utilisateur

**Page d'accueil (index.html)**
- Présentation de la plateforme.
- Accès aux principales fonctionnalités.
- Navigation vers les différentes sections.

**Catalogue des cours (courses.html)**
- Affichage des cours disponibles.
- Recherche de cours.
- Filtrage et consultation des cours.

**Lecteur de cours (course.html)**
- Consultation du contenu pédagogique.
- Navigation entre les modules et les différentes parties.
- Accès aux quiz associés aux cours.
- Affichage du contenu dans une interface adaptée à l'apprentissage.

**Tableau de bord (dashboard.html)**
- Consultation des cours commencés.
- Suivi de la progression.
- Visualisation de l'avancement dans les cours.

### 3.2. Espace administrateur

**Administration (administration.html)**

L'interface d'administration permet de gérer le contenu pédagogique de la plateforme.

Ses principales fonctionnalités sont :
- Consulter les cours existants.
- Ajouter de nouveaux cours.
- Supprimer des cours.

**Ajout d'un cours (ajouter-cours.html)**

Cette interface permet à l'administrateur de créer un cours en définissant :
- Le titre du cours.
- Les différents modules.
- Les parties associées à chaque module.
- Les quiz correspondant aux différentes parties.

### 3.3. Gestion de la progression

La plateforme intègre un mécanisme de suivi permettant de visualiser l'avancement des apprenants dans leurs cours.

### 3.4. Recherche et navigation

Des fonctionnalités de recherche et de navigation facilitent l'accès aux cours et aux différentes sections de la plateforme.

## 4. Technologies utilisées

| Technologie | Utilisation |
|---|---|
| HTML5 | Structure des pages web |
| CSS3 | Mise en forme et design des interfaces |
| JavaScript | Gestion des interactions et des fonctionnalités dynamiques |

## 5. Structure du projet

```text
LearnAYOP/
│
├── css/
│   ├── admin.css
│   ├── cours.css
│   ├── progress.css
│   └── style.css
│
├── js/
│   ├── admin.js
│   ├── ajouter-cours.js
│   ├── catalogue.js
│   ├── cours-admin-store.js
│   ├── cours.js
│   ├── courses-render.js
│   ├── donnees-cours.js
│   ├── menu.js
│   ├── progress.js
│   └── search.js
│
├── administration.html
├── ajouter-cours.html
├── course.html
├── courses.html
├── dashboard.html
└── index.html
```

### Description des dossiers

**css/**

Contient les feuilles de style utilisées pour personnaliser l'apparence des différentes interfaces.

- `admin.css` : styles de l'interface d'administration.
- `cours.css` : styles du lecteur de cours.
- `progress.css` : styles des éléments de progression.
- `style.css` : styles généraux de la plateforme.

**js/**

Contient les scripts JavaScript responsables de la logique et des interactions.

- `admin.js` : gestion des fonctionnalités administratives.
- `ajouter-cours.js` : logique d'ajout des cours.
- `catalogue.js` : gestion du catalogue.
- `cours-admin-store.js` : gestion du stockage des cours côté administration.
- `cours.js` : fonctionnement du lecteur de cours.
- `courses-render.js` : affichage dynamique des cours.
- `donnees-cours.js` : données pédagogiques et quiz.
- `menu.js` : gestion de la navigation.
- `progress.js` : suivi de la progression.
- `search.js` : recherche des cours.

## 6. Installation et exécution

### Prérequis

- Un navigateur web récent (Google Chrome, Firefox, Edge...).
- Visual Studio Code (recommandé).
- L'extension Live Server de Visual Studio Code (facultative, mais recommandée).

### Étapes d'installation

**1. Récupérer le projet depuis GitHub**

```bash
git clone URL_DU_DEPOT
```

**2. Accéder au dossier du projet**

```bash
cd LearnAYOP
```

**3. Ouvrir le projet dans Visual Studio Code**

```bash
code .
```

**4. Lancer l'application**

Deux possibilités :

- Ouvrir directement le fichier `index.html` dans un navigateur.
- Utiliser l'extension Live Server et cliquer sur **Open with Live Server**.

La page d'accueil de la plateforme sera alors accessible dans le navigateur.

## 7. Utilisation de la plateforme

### Pour les apprenants

1. Accéder à la page d'accueil.
2. Consulter le catalogue des cours.
3. Choisir un cours.
4. Parcourir les modules et les différentes parties.
5. Répondre aux quiz proposés.
6. Consulter le tableau de bord pour suivre sa progression.

### Pour l'administrateur

1. Accéder à l'interface d'administration.
2. Consulter les cours existants.
3. Ajouter un cours en renseignant son titre, ses modules, ses parties et ses quiz.
4. Supprimer un cours si nécessaire.

## 8. Organisation pédagogique

Le contenu pédagogique de LearnAYOP suit une organisation hiérarchique :

```text
Cours
  |
  ├── Module 1
  |     ├── Partie 1
  |     ├── Partie 2
  |     └── Quiz
  |
  ├── Module 2
  |     ├── Partie 1
  |     ├── Partie 2
  |     └── Quiz
  |
  └── Module 3
        ├── Partie 1
        └── Quiz
```

Cette organisation permet de structurer les ressources pédagogiques et de faciliter leur consultation.

## 9. Perspectives d'amélioration

Plusieurs évolutions peuvent être envisagées pour enrichir la plateforme :

- Intégration d'un système d'authentification.
- Mise en place d'une base de données pour la gestion des utilisateurs et des cours.
- Ajout d'un système de gestion des rôles.
- Enrichissement des statistiques de progression.
- Ajout de nouveaux types de quiz et d'évaluations.
- Adaptation complète aux appareils mobiles.

## 10. Auteur

**Projet :** LearnAYOP  
**Type :** Plateforme web d'apprentissage en ligne  
**Technologies :** HTML5, CSS3 et JavaScript  
**Dépôt :** GitHub

---

*LearnAYOP – Learn, Practice and Progress.*
