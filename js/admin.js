(function () {
    var A = window.CoursAdmin;
    var CATALOGUE = window.CATALOGUE || [];

    var grille = document.getElementById('course-grid');
    var aucun = document.getElementById('no-results');
    var recherche = document.getElementById('search-input');
    var filtreNiveau = document.getElementById('filter-level');
    var filtreMatiere = document.getElementById('filter-subject');
    var form = document.getElementById('form-cours');
    var panneauEditeur = document.getElementById('editeur');
    var panneauMedias = document.getElementById('panneau-medias');
    var panneauExport = document.getElementById('panneau-export');

    var compteurRadio = 0;
    var coursEnEdition = null; // { meta, cours } d'un cours local, ou null
    var coursMedias = null;    // meta du cours dont on gère les médias

    /* ---------- Utilitaires ---------- */

    function esc(texte) {
        return String(texte)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function normaliser(texte) {
        return texte.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    function valeur(id) {
        return document.getElementById(id).value.trim();
    }

    function genId(prefixe) {
        return prefixe + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    }

    function compterLecons(cours) {
        return cours.modules.reduce(function (total, m) {
            return total + (m.parties ? m.parties.length : 0);
        }, 0);
    }

    function estLocal(id) {
        var locaux = A.lireCours().map(function (c) { return c.meta.id; });
        return locaux.indexOf(id) !== -1 && A.publies.indexOf(id) === -1;
    }

    function trouverMeta(id) {
        return CATALOGUE.filter(function (c) { return c.id === id; })[0];
    }

    // Texte simple -> paragraphes HTML ; si l'admin écrit déjà du HTML, on le garde tel quel
    function versHTML(texte) {
        texte = texte.trim();
        if (/<[a-z][\s\S]*>/i.test(texte)) return texte;
        return texte.split(/\n\s*\n/).map(function (p) {
            return '<p>' + esc(p).replace(/\n/g, '<br>') + '</p>';
        }).join('\n');
    }

    function montrer(panneau) {
        [panneauEditeur, panneauMedias, panneauExport].forEach(function (p) {
            p.hidden = p !== panneau;
        });
        panneau.scrollIntoView({ behavior: 'smooth' });
    }

    /* ---------- Grille des cours (même interface que « Tous les cours ») ---------- */

    function carte(meta) {
        var cours = donneesCours[meta.cle];
        if (!cours) return '';
        var local = estLocal(meta.id);
        var id = esc(meta.id);

        return '' +
        '<article class="course-card" data-id="' + id + '"' +
            ' data-niveau="' + esc(meta.niveau) + '"' +
            ' data-matiere="' + esc(meta.matiere) + '">' +
            '<div class="course-cover ' + esc(meta.cover) + '">' +
                '<span>' + esc(meta.sigle) + '</span>' +
                '<i class="fa-solid ' + esc(meta.icone) + ' course-emoji" aria-hidden="true"></i>' +
            '</div>' +
            '<div class="course-info">' +
                '<span class="course-tag">' + esc(meta.tag) + '</span>' +
                '<h2>' + esc(meta.titreCarte || cours.titre) + '</h2>' +
                '<p>' + esc(meta.description) + '</p>' +
                '<div class="course-badges">' +
                    '<span class="badge badge-id">' + id + '</span>' +
                    '<span class="badge">' + esc(meta.niveau) + '</span>' +
                    '<span class="badge">' + esc(meta.matiereLabel) + '</span>' +
                    (local ? '<span class="badge badge-local">Local · non exporté</span>' : '') +
                '</div>' +
                '<div class="course-meta">' +
                    '<span><i class="fa-solid fa-book-open" aria-hidden="true"></i> ' +
                        compterLecons(cours) + ' leçons</span>' +
                    '<span>' + esc(meta.difficulte) + '</span>' +
                '</div>' +
                '<div class="admin-actions">' +
                    '<a class="admin-btn" href="course.html?id=' + id + '">' +
                        '<i class="fa-solid fa-eye" aria-hidden="true"></i> Voir</a>' +
                    '<button type="button" class="admin-btn" data-action="medias" data-id="' + id + '">' +
                        '<i class="fa-solid fa-photo-film" aria-hidden="true"></i> Médias</button>' +
                    (local ?
                        '<button type="button" class="admin-btn" data-action="modifier" data-id="' + id + '">' +
                        '<i class="fa-solid fa-pen" aria-hidden="true"></i> Modifier</button>' : '') +
                    '<button type="button" class="admin-btn" data-action="exporter" data-id="' + id + '">' +
                        '<i class="fa-solid fa-file-export" aria-hidden="true"></i> Exporter</button>' +
                    (local ?
                        '<button type="button" class="admin-btn danger" data-action="supprimer" data-id="' + id + '">' +
                        '<i class="fa-solid fa-trash" aria-hidden="true"></i> Supprimer</button>' : '') +
                '</div>' +
            '</div>' +
        '</article>';
    }

    function afficherNotice() {
        var zone = document.getElementById('notice-publies');
        var publiees = A.lireCours().filter(function (c) {
            return A.publies.indexOf(c.meta.id) !== -1;
        });

        if (!publiees.length) {
            zone.innerHTML = '';
            return;
        }

        zone.innerHTML = '<div class="admin-notice"><strong>Copies locales déjà présentes dans les fichiers :</strong> ' +
            publiees.map(function (c) {
                return '<span>' + esc(c.meta.id) + ' (' + esc(c.meta.titreCarte) + ') ' +
                    '<button type="button" class="admin-btn" data-action="purger" data-id="' + esc(c.meta.id) + '">' +
                    'Supprimer la copie locale</button></span>';
            }).join(' ') + '</div>';
    }

    function filtrer() {
        var q = normaliser(recherche.value.trim());
        var niveau = filtreNiveau.value;
        var matiere = filtreMatiere.value;
        var visibles = 0;

        grille.querySelectorAll('.course-card').forEach(function (c) {
            var okTexte = normaliser(c.textContent + ' ' + c.dataset.id).indexOf(q) !== -1;
            var okNiveau = !niveau || c.dataset.niveau === niveau;
            var okMatiere = !matiere || c.dataset.matiere === matiere;
            var afficher = okTexte && okNiveau && okMatiere;
            c.style.display = afficher ? '' : 'none';
            if (afficher) visibles++;
        });

        aucun.style.display = visibles === 0 ? 'block' : 'none';
    }

    function afficherGrille() {
        grille.querySelectorAll('.course-card').forEach(function (c) { c.remove(); });
        grille.insertAdjacentHTML('afterbegin', CATALOGUE.map(carte).join(''));
        afficherNotice();
        filtrer();
    }

    recherche.addEventListener('input', filtrer);
    filtreNiveau.addEventListener('change', filtrer);
    filtreMatiere.addEventListener('change', filtrer);
    document.getElementById('reset-filters').addEventListener('click', function () {
        recherche.value = '';
        filtreNiveau.value = '';
        filtreMatiere.value = '';
        filtrer();
    });

    /* ---------- Éditeur de cours : blocs HTML ---------- */

    function htmlQuestion(q) {
        q = q || { question: '', options: ['', '', '', ''], bonneReponse: 0 };
        var nom = 'rq' + (compteurRadio++);
        var options = q.options.slice();
        while (options.length < 4) options.push('');

        return '<div class="bloc-question">' +
            '<label>Question <input type="text" class="q-texte" value="' + esc(q.question) + '" required></label>' +
            options.map(function (o, i) {
                return '<label class="q-opt">' +
                    '<input type="radio" class="q-radio" name="' + nom + '"' + (i === q.bonneReponse ? ' checked' : '') + '>' +
                    '<input type="text" class="q-option" placeholder="Option ' + (i + 1) + '" value="' + esc(o) + '">' +
                    '</label>';
            }).join('') +
            '<p class="aide">Coche la bonne réponse (au moins 2 options remplies).</p>' +
            '<button type="button" class="admin-btn danger" data-action="del-question">Supprimer la question</button>' +
        '</div>';
    }

    function htmlPartie(p) {
        p = p || { id: '', titre: '', contenu: '' };
        return '<div class="bloc-partie" data-id="' + esc(p.id) + '">' +
            '<label>Titre de la leçon <input type="text" class="p-titre" value="' + esc(p.titre) + '" required></label>' +
            '<label>Contenu (texte simple ou HTML) ' +
                '<textarea class="p-contenu" rows="6" required>' + esc(p.contenu) + '</textarea></label>' +
            '<button type="button" class="admin-btn danger" data-action="del-partie">Supprimer la leçon</button>' +
        '</div>';
    }

    function htmlModule(m) {
        m = m || { id: '', titre: '', parties: [null], quiz: [null] };
        return '<fieldset class="bloc-module" data-id="' + esc(m.id) + '">' +
            '<legend>Module</legend>' +
            '<label>Titre du module <input type="text" class="m-titre" placeholder="Module 1 : Introduction" value="' +
                esc(m.titre) + '" required></label>' +
            '<h4>Leçons</h4>' +
            '<div class="liste-parties">' + m.parties.map(function (p) { return htmlPartie(p); }).join('') + '</div>' +
            '<button type="button" class="admin-btn" data-action="add-partie">+ Ajouter une leçon</button>' +
            '<h4>Quiz du module</h4>' +
            '<div class="liste-questions">' + m.quiz.map(function (q) { return htmlQuestion(q); }).join('') + '</div>' +
            '<button type="button" class="admin-btn" data-action="add-question">+ Ajouter une question</button> ' +
            '<button type="button" class="admin-btn danger" data-action="del-module">Supprimer le module</button>' +
        '</fieldset>';
    }

    function ouvrirEditeur(stocke) {
        coursEnEdition = stocke || null;
        var m = stocke ? stocke.meta : null;
        var c = stocke ? stocke.cours : {
            modules: [{ id: '', titre: '', parties: [null], quiz: [null] }],
            quizFinal: [null]
        };

        form.reset();
        document.getElementById('titre-editeur').textContent =
            stocke ? 'Modifier le cours ' + m.id : 'Ajouter un cours';

        if (stocke) {
            document.getElementById('f-titre').value = c.titre;
            document.getElementById('f-sigle').value = m.sigle;
            document.getElementById('f-tag').value = m.tag;
            document.getElementById('f-niveau').value = m.niveau;
            document.getElementById('f-matiere').value = m.matiere;
            document.getElementById('f-difficulte').value = m.difficulte;
            document.getElementById('f-cover').value = m.cover;
            document.getElementById('f-icone').value = m.icone;
            document.getElementById('f-description').value = m.description;
        }

        document.getElementById('liste-modules').innerHTML =
            c.modules.map(function (mod) { return htmlModule(mod); }).join('');
        document.getElementById('liste-quiz-final').innerHTML =
            c.quizFinal.map(function (q) { return htmlQuestion(q); }).join('');

        montrer(panneauEditeur);
    }

    /* ---------- Enregistrement du cours ---------- */

    function lireQuestions(zone) {
        var resultat = [];

        zone.querySelectorAll('.bloc-question').forEach(function (bq) {
            var texte = bq.querySelector('.q-texte').value.trim();
            var options = [];
            var bonne = -1;

            bq.querySelectorAll('.q-opt').forEach(function (o) {
                var t = o.querySelector('.q-option').value.trim();
                if (!t) return;
                if (o.querySelector('.q-radio').checked) bonne = options.length;
                options.push(t);
            });

            if (!texte) throw new Error("Une question n'a pas d'énoncé.");
            if (options.length < 2) throw new Error('Chaque question doit avoir au moins 2 options.');
            if (bonne === -1) throw new Error('Coche la bonne réponse de chaque question (sur une option remplie).');

            resultat.push({ question: texte, options: options, bonneReponse: bonne });
        });

        return resultat;
    }

    function prochainId(liste) {
        var max = 0;
        CATALOGUE.map(function (c) { return c.id; })
            .concat(liste.map(function (c) { return c.meta.id; }))
            .forEach(function (id) {
                var n = parseInt(String(id).replace(/\D/g, ''), 10);
                if (n > max) max = n;
            });
        return 'C' + String(max + 1).padStart(3, '0');
    }

    function cleUnique(titre, liste) {
        var base = normaliser(titre).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'cours';
        var cle = base;
        var n = 2;
        var prises = Object.keys(donneesCours).concat(liste.map(function (c) { return c.meta.cle; }));
        while (prises.indexOf(cle) !== -1) {
            cle = base + '-' + n++;
        }
        return cle;
    }

    function enregistrerCours() {
        var titre = valeur('f-titre');
        var modules = [];

        document.querySelectorAll('#liste-modules .bloc-module').forEach(function (bm) {
            var parties = [];

            bm.querySelectorAll('.bloc-partie').forEach(function (bp) {
                parties.push({
                    id: bp.dataset.id || genId('p'),
                    titre: bp.querySelector('.p-titre').value.trim(),
                    contenu: versHTML(bp.querySelector('.p-contenu').value)
                });
            });

            if (!parties.length) throw new Error('Chaque module doit contenir au moins une leçon.');

            var quiz = lireQuestions(bm.querySelector('.liste-questions'));
            if (!quiz.length) throw new Error('Chaque module doit avoir au moins une question de quiz.');

            modules.push({
                id: bm.dataset.id || genId('m'),
                titre: bm.querySelector('.m-titre').value.trim(),
                parties: parties,
                quiz: quiz
            });
        });

        if (!modules.length) throw new Error('Ajoute au moins un module.');

        var quizFinal = lireQuestions(document.getElementById('liste-quiz-final'));
        if (!quizFinal.length) throw new Error('Ajoute au moins une question au quiz final.');

        var liste = A.lireCours();
        var id = coursEnEdition ? coursEnEdition.meta.id : prochainId(liste);
        var cle = coursEnEdition ? coursEnEdition.meta.cle : cleUnique(titre, liste);
        var matiere = valeur('f-matiere');
        var icone = valeur('f-icone');

        // même format que les entrées de catalogue.js
        var meta = {
            id: id,
            cle: cle,
            sigle: valeur('f-sigle') || titre,
            titreCarte: titre,
            tag: valeur('f-tag'),
            niveau: valeur('f-niveau'),
            matiere: matiere,
            matiereLabel: matiere === 'Elec' ? 'Élec' : matiere,
            difficulte: valeur('f-difficulte'),
            cover: valeur('f-cover'),
            icone: icone,
            emoji: icone,
            description: valeur('f-description')
        };

        // même format que les entrées de donnees-cours.js
        var cours = {
            titre: titre,
            matiere: meta.tag,
            niveau: meta.difficulte,
            modules: modules,
            quizFinal: quizFinal
        };

        var entree = { meta: meta, cours: cours };
        var index = -1;
        liste.forEach(function (c, i) { if (c.meta.id === id) index = i; });
        if (index >= 0) liste[index] = entree; else liste.push(entree);

        if (!A.ecrireCours(liste)) {
            throw new Error("Stockage du navigateur plein : impossible d'enregistrer le cours.");
        }
        location.reload();
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        try {
            enregistrerCours();
        } catch (err) {
            alert(err.message);
        }
    });

    /* ---------- Suppression ---------- */

    function nettoyerProgression(id) {
        try {
            var data = JSON.parse(localStorage.getItem('learnayop_progress')) || {};
            delete data[id];
            localStorage.setItem('learnayop_progress', JSON.stringify(data));
            ['learnayop_progress_', 'learnayop_position_', 'learnayop_video_'].forEach(function (p) {
                localStorage.removeItem(p + id);
            });
        } catch (e) { }
    }

    function supprimerLocal(id, avecProgression) {
        var liste = A.lireCours();
        var cible = liste.filter(function (c) { return c.meta.id === id; })[0];
        if (!cible) return;

        A.ecrireCours(liste.filter(function (c) { return c.meta.id !== id; }));

        var medias = A.lireMedias();
        delete medias[cible.meta.cle];
        A.ecrireMedias(medias);

        if (avecProgression) nettoyerProgression(id);
    }

    /* ---------- Photos / vidéos ---------- */

    function idYouTube(url) {
        var m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
        return m ? m[1] : null;
    }

    // lien http(s) ou chemin relatif simple (ex : img/schema.png)
    function lienSur(url) {
        return /^https?:\/\/\S+$/i.test(url) || /^[\w\-./]+$/.test(url);
    }

    // Redimensionne et compresse l'image pour économiser le localStorage
    function lireImage(fichier, rappel) {
        var lecteur = new FileReader();
        lecteur.onload = function () {
            var img = new Image();
            img.onload = function () {
                var ratio = Math.min(1, 1000 / img.width);
                var canvas = document.createElement('canvas');
                canvas.width = Math.round(img.width * ratio);
                canvas.height = Math.round(img.height * ratio);
                var ctx = canvas.getContext('2d');
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                rappel(canvas.toDataURL('image/jpeg', 0.75));
            };
            img.onerror = function () { rappel(null); };
            img.src = lecteur.result;
        };
        lecteur.readAsDataURL(fichier);
    }

    function titrePartie(idPartie) {
        var titre = idPartie;
        donneesCours[coursMedias.cle].modules.forEach(function (mod) {
            mod.parties.forEach(function (p) {
                if (p.id === idPartie) titre = p.titre;
            });
        });
        return titre;
    }

    function afficherListeMedias() {
        var medias = A.lireMedias()[coursMedias.cle] || {};
        var html = '';

        Object.keys(medias).forEach(function (idPartie) {
            medias[idPartie].forEach(function (m, i) {
                var type = m.type === 'image' ? 'Photo' : (m.type === 'youtube' ? 'Vidéo YouTube' : 'Vidéo');
                html += '<li><span>' + esc(titrePartie(idPartie)) + ' : ' + type +
                    (m.legende ? ' (' + esc(m.legende) + ')' : '') + '</span>' +
                    '<button type="button" class="admin-btn danger" data-action="suppr-media" ' +
                    'data-partie="' + esc(idPartie) + '" data-index="' + i + '">Retirer</button></li>';
            });
        });

        document.getElementById('liste-medias').innerHTML =
            html || '<li>Aucun média ajouté pour l\'instant.</li>';
    }

    function changerTypeMedia() {
        var type = document.getElementById('med-type').value;
        document.getElementById('bloc-fichier').hidden = type !== 'photo-fichier';
        document.getElementById('bloc-url').hidden = type === 'photo-fichier';
    }

    function ouvrirMedias(id) {
        var meta = trouverMeta(id);
        if (!meta) return;
        coursMedias = meta;

        document.getElementById('titre-medias').textContent = 'Photos et vidéos : ' + meta.titreCarte;

        var options = '';
        donneesCours[meta.cle].modules.forEach(function (mod) {
            mod.parties.forEach(function (p) {
                options += '<option value="' + esc(p.id) + '">' + esc(mod.titre + ' › ' + p.titre) + '</option>';
            });
        });
        document.getElementById('med-partie').innerHTML = options;
        document.getElementById('med-legende').value = '';
        document.getElementById('med-url').value = '';
        document.getElementById('med-fichier').value = '';

        changerTypeMedia();
        afficherListeMedias();
        montrer(panneauMedias);
    }

    function rechargerAvecMedias() {
        sessionStorage.setItem('admin_reouvrir_medias', coursMedias.id);
        location.reload();
    }

    function ajouterMedia() {
        var cle = coursMedias.cle;
        var idPartie = document.getElementById('med-partie').value;
        var type = document.getElementById('med-type').value;
        var legende = valeur('med-legende');
        var url = valeur('med-url');

        function enregistrer(media) {
            var medias = A.lireMedias();
            medias[cle] = medias[cle] || {};
            medias[cle][idPartie] = medias[cle][idPartie] || [];
            medias[cle][idPartie].push(media);

            if (!A.ecrireMedias(medias)) {
                alert("Stockage plein : utilise un lien plutôt qu'un fichier, ou une image plus petite.");
                return;
            }
            rechargerAvecMedias();
        }

        if (type === 'photo-fichier') {
            var fichier = document.getElementById('med-fichier').files[0];
            if (!fichier) { alert('Choisis une image.'); return; }
            lireImage(fichier, function (data) {
                if (!data) { alert('Image illisible.'); return; }
                enregistrer({ type: 'image', src: data, legende: legende });
            });
        } else if (type === 'photo-url') {
            if (!lienSur(url)) { alert('Lien ou chemin invalide.'); return; }
            enregistrer({ type: 'image', src: url, legende: legende });
        } else if (type === 'youtube') {
            var yt = idYouTube(url);
            if (!yt) { alert('Lien YouTube invalide.'); return; }
            enregistrer({ type: 'youtube', src: yt, legende: legende });
        } else {
            if (!lienSur(url)) { alert('Lien ou chemin invalide.'); return; }
            enregistrer({ type: 'video', src: url, legende: legende });
        }
    }

    function retirerMedia(idPartie, index) {
        var medias = A.lireMedias();
        var cle = coursMedias.cle;
        if (!medias[cle] || !medias[cle][idPartie]) return;

        medias[cle][idPartie].splice(index, 1);
        if (!medias[cle][idPartie].length) delete medias[cle][idPartie];
        if (!Object.keys(medias[cle]).length) delete medias[cle];

        A.ecrireMedias(medias);
        rechargerAvecMedias();
    }

    document.getElementById('med-type').addEventListener('change', changerTypeMedia);

    /* ---------- Export ---------- */

    function ouvrirExport(id) {
        var meta = trouverMeta(id);
        if (!meta) return;

        var code =
            '// ===== ÉTAPE 1 : js/catalogue.js =====\n' +
            '// Ajoute cet objet dans window.CATALOGUE (seulement si le cours n\'y est pas déjà).\n' +
            JSON.stringify(meta, null, 4) + ',\n\n' +
            '// ===== ÉTAPE 2 : js/donnees-cours.js =====\n' +
            '// Ajoute cette entrée dans donneesCours (ou remplace l\'entrée existante).\n' +
            JSON.stringify(meta.cle) + ': ' + JSON.stringify(donneesCours[meta.cle], null, 4) + ',\n';

        document.getElementById('export-code').value = code;
        montrer(panneauExport);
    }

    /* ---------- Clics (délégation) ---------- */

    document.addEventListener('click', function (e) {
        var bouton = e.target.closest('[data-action]');
        if (!bouton) return;

        var action = bouton.dataset.action;
        var id = bouton.dataset.id;

        switch (action) {
            case 'medias':
                ouvrirMedias(id);
                break;
            case 'modifier':
                ouvrirEditeur(A.lireCours().filter(function (c) { return c.meta.id === id; })[0]);
                break;
            case 'exporter':
                ouvrirExport(id);
                break;
            case 'supprimer':
                if (confirm('Supprimer ce cours local, ses médias et sa progression ?')) {
                    supprimerLocal(id, true);
                    location.reload();
                }
                break;
            case 'purger':
                if (confirm('Supprimer la copie locale (le cours reste dans les fichiers) ?')) {
                    supprimerLocal(id, false);
                    location.reload();
                }
                break;
            case 'add-module':
                document.getElementById('liste-modules').insertAdjacentHTML('beforeend', htmlModule());
                break;
            case 'add-partie':
                bouton.closest('.bloc-module').querySelector('.liste-parties')
                    .insertAdjacentHTML('beforeend', htmlPartie());
                break;
            case 'add-question':
                bouton.closest('.bloc-module').querySelector('.liste-questions')
                    .insertAdjacentHTML('beforeend', htmlQuestion());
                break;
            case 'add-question-final':
                document.getElementById('liste-quiz-final').insertAdjacentHTML('beforeend', htmlQuestion());
                break;
            case 'del-module':
                bouton.closest('.bloc-module').remove();
                break;
            case 'del-partie':
                bouton.closest('.bloc-partie').remove();
                break;
            case 'del-question':
                bouton.closest('.bloc-question').remove();
                break;
            case 'fermer':
                bouton.closest('section').hidden = true;
                break;
            case 'ajouter-media':
                ajouterMedia();
                break;
            case 'suppr-media':
                retirerMedia(bouton.dataset.partie, Number(bouton.dataset.index));
                break;
            case 'copier-export':
                var zone = document.getElementById('export-code');
                zone.select();
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(zone.value);
                } else {
                    document.execCommand('copy');
                }
                break;
        }
    });

    document.getElementById('btn-ajouter').addEventListener('click', function () {
        ouvrirEditeur(null);
    });

    /* ---------- Démarrage ---------- */

    afficherGrille();

    var aReouvrir = sessionStorage.getItem('admin_reouvrir_medias');
    if (aReouvrir) {
        sessionStorage.removeItem('admin_reouvrir_medias');
        ouvrirMedias(aReouvrir);
    }
})();