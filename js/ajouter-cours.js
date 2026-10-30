(function () {
    var A = window.CoursAdmin;
    var CATALOGUE = window.CATALOGUE || [];
    var form = document.getElementById('form-cours');
    var compteurRadio = 0;

    // La matière détermine automatiquement le libellé, la couleur et l'icône de la carte
    var MATIERES = {
        Math: { tag: 'Mathématiques', label: 'Math', cover: 'cover-python', icone: 'fa-solid fa-calculator' },
        Info: { tag: 'Informatique',  label: 'Info', cover: 'cover-html',   icone: 'fa-solid fa-database' },
        Elec: { tag: 'Électronique',  label: 'Élec', cover: 'cover-js',     icone: 'fa-solid fa-bolt' }
    };

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

    // Texte simple -> paragraphes ; si c'est déjà du HTML, on le garde
    function versHTML(texte) {
        texte = texte.trim();
        if (/<[a-z][\s\S]*>/i.test(texte)) return texte;
        return texte.split(/\n\s*\n/).map(function (p) {
            return '<p>' + esc(p).replace(/\n/g, '<br>') + '</p>';
        }).join('\n');
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
        var cle = base, n = 2;
        var prises = Object.keys(donneesCours).concat(liste.map(function (c) { return c.meta.cle; }));
        while (prises.indexOf(cle) !== -1) cle = base + '-' + n++;
        return cle;
    }

    /* ---------- Médias ---------- */

    function idYouTube(url) {
        var m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
        return m ? m[1] : null;
    }

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

    // HTML d'un média inséré dans le contenu de la leçon
    function htmlMedia(m) {
        var legende = m.legende ? '<figcaption>' + esc(m.legende) + '</figcaption>' : '';

        if (m.type === 'image') {
            return '<figure class="media-cours">' +
                '<img src="' + esc(m.src) + '" alt="' + esc(m.legende || 'Illustration du cours') + '">' +
                legende + '</figure>';
        }
        if (m.type === 'youtube') {
            return '<figure class="media-cours">' +
                '<iframe class="video-cours" ' +
                'src="https://www.youtube-nocookie.com/embed/' + esc(m.src) + '?enablejsapi=1" ' +
                'title="' + esc(m.legende || 'Vidéo du cours') + '" loading="lazy" allowfullscreen ' +
                'style="width:100%;aspect-ratio:16/9;border:0;border-radius:12px"></iframe>' +
                legende + '</figure>';
        }
        return '<figure class="media-cours">' +
            '<video controls preload="metadata" src="' + esc(m.src) + '"></video>' +
            legende + '</figure>';
    }

       function afficherMedias(bloc) {
        var liste = bloc._medias || [];
        bloc.querySelector('.liste-medias').innerHTML = liste.length
            ? liste.map(function (m, i) {
                var type = m.type === 'image' ? 'Photo' : 'Vidéo YouTube';
                return '<li><span>' + type + (m.legende ? ' : ' + esc(m.legende) : '') + '</span>' +
                    '<button type="button" class="admin-btn danger" data-action="suppr-media" data-index="' + i + '">' +
                    '<i class="fa-solid fa-xmark" aria-hidden="true"></i> Retirer</button></li>';
            }).join('')
            : '<li>Aucun média ajouté.</li>';
    }

    function changerTypeMedia(select) {
        var bloc = select.closest('.bloc-media');
        var photoFichier = select.value === 'photo-fichier';
        bloc.querySelector('.med-fichier-bloc').hidden = !photoFichier;
        bloc.querySelector('.med-url-bloc').hidden = photoFichier;
    }

    function ajouterMedia(partie) {
        var bloc = partie.querySelector('.bloc-media');
        var type = bloc.querySelector('.med-type').value;
        var legende = bloc.querySelector('.med-legende').value.trim();
        var url = bloc.querySelector('.med-url').value.trim();
        partie._medias = partie._medias || [];

        function ajouter(media) {
            partie._medias.push(media);
            bloc.querySelector('.med-legende').value = '';
            bloc.querySelector('.med-url').value = '';
            bloc.querySelector('.med-fichier').value = '';
            afficherMedias(partie);
        }

        if (type === 'photo-fichier') {
            var fichier = bloc.querySelector('.med-fichier').files[0];
            if (!fichier) { alert('Choisis une image.'); return; }
            lireImage(fichier, function (data) {
                if (!data) { alert('Image illisible.'); return; }
                ajouter({ type: 'image', src: data, legende: legende });
            });
        } else if (type === 'photo-url') {
            if (!lienSur(url)) { alert('Lien ou chemin invalide.'); return; }
            ajouter({ type: 'image', src: url, legende: legende });
        } else if (type === 'youtube') {
            var yt = idYouTube(url);
            if (!yt) { alert('Lien YouTube invalide.'); return; }
            ajouter({ type: 'youtube', src: yt, legende: legende });
        } 
    }

    /* ---------- Blocs du formulaire ---------- */

    function htmlQuestion() {
        var nom = 'rq' + (compteurRadio++);
        var opts = '';
        for (var i = 0; i < 4; i++) {
            opts += '<label class="q-opt">' +
                '<input type="radio" class="q-radio" name="' + nom + '"' + (i === 0 ? ' checked' : '') + '>' +
                '<input type="text" class="q-option" placeholder="Option ' + (i + 1) + '">' +
                '</label>';
        }
        return '<div class="bloc-question">' +
            '<label>Question <input type="text" class="q-texte" required></label>' +
            opts +
                       '<p class="aide">Coche la bonne réponse (au moins 2 options remplies).</p>' +
            '<div class="actions-partie">' +
                '<button type="button" class="admin-btn danger" data-action="del-question">Supprimer la question</button>' +
            '</div>' +
        '</div>';
    }

        function htmlPartie() {
        return '<div class="bloc-partie">' +
            '<label>Titre de la leçon <input type="text" class="p-titre" required></label>' +
            '<label>Contenu (texte simple ou HTML) <textarea class="p-contenu" rows="6" required></textarea></label>' +

            '<div class="bloc-media">' +
                '<h5>Photos et vidéos de cette leçon</h5>' +
                '<label>Type de média ' +
                    '<select class="med-type">' +
                        '<option value="photo-fichier">Photo (depuis mon ordinateur)</option>' +
                        '<option value="photo-url">Photo (lien ou chemin, ex : img/schema.png)</option>' +
                        '<option value="youtube">Vidéo YouTube (lien)</option>' +
                    '</select></label>' +
                '<label class="med-fichier-bloc">Image <input type="file" class="med-fichier" accept="image/*"></label>' +
                '<label class="med-url-bloc" hidden>Lien <input type="text" class="med-url" placeholder="https://..."></label>' +
                '<label>Légende (facultatif) <input type="text" class="med-legende"></label>' +
                '<ul class="liste-medias"><li>Aucun média ajouté.</li></ul>' +
            '</div>' +

            '<div class="actions-partie">' +
                '<button type="button" class="admin-btn" data-action="add-media">' +
                    '<i class="fa-solid fa-photo-film" aria-hidden="true"></i> Ajouter à la leçon</button>' +
                '<button type="button" class="admin-btn danger" data-action="del-partie">' +
                    '<i class="fa-solid fa-trash" aria-hidden="true"></i> Supprimer la leçon</button>' +
            '</div>' +
        '</div>';
    }

        function htmlModule() {
        return '<fieldset class="bloc-module">' +
            '<legend>Module</legend>' +
            '<label>Titre du module <input type="text" class="m-titre" placeholder="Module 1 : Introduction" required></label>' +
            '<h4>Leçons</h4>' +
            '<div class="liste-parties">' + htmlPartie() + '</div>' +
            '<div class="actions-partie">' +
                '<button type="button" class="admin-btn" data-action="add-partie">+ Ajouter une leçon</button>' +
            '</div>' +
            '<h4>Quiz du module</h4>' +
            '<div class="liste-questions">' + htmlQuestion() + '</div>' +
            '<div class="actions-partie">' +
                '<button type="button" class="admin-btn" data-action="add-question">+ Ajouter une question</button>' +
                '<button type="button" class="admin-btn danger" data-action="del-module">Supprimer le module</button>' +
            '</div>' +
        '</fieldset>';
    }

    /* ---------- Lecture et enregistrement ---------- */

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

    function enregistrerCours() {
        var titre = valeur('f-titre');
        var modules = [];

        document.querySelectorAll('#liste-modules .bloc-module').forEach(function (bm) {
            var parties = [];

            bm.querySelectorAll('.bloc-partie').forEach(function (bp) {
                var contenu = versHTML(bp.querySelector('.p-contenu').value);
                var medias = bp._medias || [];
                if (medias.length) {
                    contenu += '<div class="medias-cours">' + medias.map(htmlMedia).join('') + '</div>';
                }
                parties.push({
                    id: genId('p'),
                    titre: bp.querySelector('.p-titre').value.trim(),
                    contenu: contenu
                });
            });

            if (!parties.length) throw new Error('Chaque module doit contenir au moins une leçon.');

            var quiz = lireQuestions(bm.querySelector('.liste-questions'));
            if (!quiz.length) throw new Error('Chaque module doit avoir au moins une question de quiz.');

            modules.push({
                id: genId('m'),
                titre: bm.querySelector('.m-titre').value.trim(),
                parties: parties,
                quiz: quiz
            });
        });

        if (!modules.length) throw new Error('Ajoute au moins un module.');

        var quizFinal = lireQuestions(document.getElementById('liste-quiz-final'));
        if (!quizFinal.length) throw new Error('Ajoute au moins une question au quiz final.');

        var liste = A.lireCours();
        var m = MATIERES[valeur('f-matiere')];

        // même format que les entrées de catalogue.js
        var meta = {
            id: prochainId(liste),
            cle: cleUnique(titre, liste),
            sigle: titre,
            titreCarte: titre,
            tag: m.tag,
            niveau: valeur('f-niveau'),
            matiere: valeur('f-matiere'),
            matiereLabel: m.label,
            difficulte: valeur('f-difficulte'),
            cover: m.cover,
            icone: m.icone,
            emoji: m.icone,
            description: valeur('f-description')
        };

        // même format que les entrées de donnees-cours.js
        var cours = {
            titre: titre,
            matiere: m.tag,
            niveau: meta.difficulte,
            modules: modules,
            quizFinal: quizFinal
        };

        liste.push({ meta: meta, cours: cours });

        if (!A.ecrireCours(liste)) {
            throw new Error("Stockage du navigateur plein : utilise des liens plutôt que des fichiers pour les images.");
        }
        location.href = 'administration.html';
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        try {
            enregistrerCours();
        } catch (err) {
            alert(err.message);
        }
    });

    /* ---------- Événements ---------- */

    document.addEventListener('change', function (e) {
        if (e.target.classList.contains('med-type')) changerTypeMedia(e.target);
    });

    document.addEventListener('click', function (e) {
        var bouton = e.target.closest('[data-action]');
        if (!bouton) return;

        switch (bouton.dataset.action) {
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
            case 'add-media':
                ajouterMedia(bouton.closest('.bloc-partie'));
                break;
            case 'suppr-media':
                var partie = bouton.closest('.bloc-partie');
                partie._medias.splice(Number(bouton.dataset.index), 1);
                afficherMedias(partie);
                break;
        }
    });

    /* ---------- Démarrage ---------- */

    document.getElementById('liste-modules').innerHTML = htmlModule();
    document.getElementById('liste-quiz-final').innerHTML = htmlQuestion();
})();