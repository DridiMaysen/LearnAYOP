<?php
require __DIR__ . '/includes/bootstrap.php';
exiger_admin();
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <?= csrf_meta() ?>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ajouter un cours - LearnAYOP</title>
    <meta name="description" content="Ajouter les cours dans LearnAYOP.">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/admin.css">
</head>
<body>
    <?php require __DIR__ . '/includes/navbar.php'; ?>

    <main>
        <section class="admin-panel section-container">
            <div class="entete-ajout">
                <div>
                    <p class="eyebrow">ADMINISTRATION</p>
                    <h1>Ajouter un cours</h1>
                </div>
                <a href="administration.php" class="reset-button">← Retour aux cours</a>
            </div>

            <form id="form-cours">
                <div class="form-grid">
                    <label>Titre
                        <input type="text" id="f-titre" required>
                    </label>
                    <label>Matière
                        <select id="f-matiere">
                            <option value="Math">Math</option>
                            <option value="Info">Info</option>
                            <option value="Elec">Élec</option>
                        </select>
                    </label>
                    <label>Niveau
                        <select id="f-niveau">
                            <option value="Licence">Licence</option>
                            <option value="Cycle">Cycle</option>
                            <option value="Master">Master</option>
                        </select>
                    </label>
                    <label>Difficulté
                        <select id="f-difficulte">
                            <option value="Débutant">Débutant</option>
                            <option value="Intermédiaire">Intermédiaire</option>
                            <option value="Avancé">Avancé</option>
                        </select>
                    </label>
                </div>

                <label>Description
                    <input type="text" id="f-description" required>
                </label>

                <h2>Modules</h2>
                <div id="liste-modules"></div>
                <button type="button" class="admin-btn" data-action="add-module">
                    <i class="fa-solid fa-plus" aria-hidden="true"></i> Ajouter un module
                </button>

                <h3>Quiz final du cours</h3>
                <div id="liste-quiz-final"></div>
                <button type="button" class="admin-btn" data-action="add-question-final">
                    <i class="fa-solid fa-plus" aria-hidden="true"></i> Ajouter une question
                </button>

                <div class="form-actions">
                    <button type="submit" class="primary-button">Enregistrer le cours</button>
                    <a href="administration.php" class="reset-button">Annuler</a>
                </div>
            </form>
        </section>
    </main>

    <footer class="footer">
        <a href="index.php" class="logo">Learn<span>AYOP</span></a>
        <p>Apprendre aujourd'hui, réussir demain.</p>
        <p>© 2026 LearnAYOP — Mini plateforme d'apprentissage.</p>
    </footer>

   <script src="js/menu.js" defer></script>
    <script src="js/api.js"></script>
    <script src="api/cours_js.php"></script>
    <script src="js/ajouter-cours.js"></script>
</body>
</html>