(function () {
    var A = window.CoursAdmin;
    var CATALOGUE = window.CATALOGUE || [];
    var form = document.getElementById('form-cours');
    var compteurRadio = 0;

    //quand l'admin choisit matiere on deduit automatiquement label w icone .....
    var MATIERES = {
        Math: { tag: 'Mathématiques', label: 'Math', cover: 'cover-python', icone: 'fa-solid fa-calculator' },
        Info: { tag: 'Informatique',  label: 'Info', cover: 'cover-html',   icone: 'fa-solid fa-database' },
        Elec: { tag: 'Électronique',  label: 'Élec', cover: 'cover-js',     icone: 'fa-solid fa-bolt' }
    };

    //remplacer les caracteres speciaux

    function esc(texte) {
        return String(texte)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }
//met en miniscule w nna7i les accents 
    function normaliser(texte) {
        return texte.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }
//ne5ou l valeur mta3 champs id w nna7i les espaces
    function valeur(id) {
        return document.getElementById(id).value.trim();
    }
//genere id aleatoire a partir mel prefixe
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
//Calcule l’identifiant du nouveau cours C001 .... te5ou les chiffres mel catalogue w tzid 1
    function prochainId(liste) {
        var max = 0;
        CATALOGUE.map(function (c) { return c.id; })
            .concat(liste.map(function (c) { return c.meta.id; }))
.concat(A.lireSupprimes()) //
.forEach(function (id) {
                var n = parseInt(String(id).replace(/\D/g, ''), 10);
                if (n > max) max = n;
            });
        return 'C' + String(max + 1).padStart(3, '0');
    }
//Crée une « clé » lisible pour l’URL 
    function cleUnique(titre, liste) {
        var base = normaliser(titre).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'cours';
        var cle = base, n = 2;
        var prises = Object.keys(donneesCours).concat(liste.map(function (c) { return c.meta.cle; }));
        //Si la clé existe déjà, elle ajoute -2, -3, etc. avec la boucle while.
        while (prises.indexOf(cle) !== -1) cle = base + '-' + n++;
        return cle;
    }

    /* ---------- Médias ---------- */
//extraire id youtube mel url
    function idYouTube(url) {
        var m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
        return m ? m[1] : null;
    }
//tthabbet lien shih walle
    function lienSur(url) {
        return /^https?:\/\/\S+$/i.test(url) || /^[\w\-./]+$/.test(url);
    }

    // Redimensionne et compresse l'image pour économiser le localStorage
    function lireImage(fichier, rappel) {
        //charger fi file reader
        var lecteur = new FileReader();
        lecteur.onload = function () {
            var img = new Image();
            img.onload = function () {
                var ratio = Math.min(1, 1000 / img.width);
                //nbadlou les dim
                var canvas = document.createElement('canvas');
                canvas.width = Math.round(img.width * ratio);
                canvas.height = Math.round(img.height * ratio);
                var ctx = canvas.getContext('2d');
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                //export en jpeg
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
//transforme img en html
        if (m.type === 'image') {
            return '<figure class="media-cours">' +
                '<img src="' + esc(m.src) + '" alt="' + esc(m.legende || 'Illustration du cours') + '">' +
                legende + '</figure>';
        }
        //youtube en html
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
        //media stockés temporairement dans la propriété JavaScript bloc._medias de l’élément HTML
        var liste = bloc._medias || [];
        bloc.querySelector('.liste-medias').innerHTML = liste.length
        //affichage mte3ha
            ? liste.map(function (m, i) {
                var type = m.type === 'image' ? 'Photo' : 'Vidéo YouTube';
                return '<li><span>' + type + (m.legende ? ' : ' + esc(m.legende) : '') + '</span>' +
                    '<button type="button" class="admin-btn danger" data-action="suppr-media" data-index="' + i + '">' +
                    '<i class="fa-solid fa-xmark" aria-hidden="true"></i> Retirer</button></li>';
            }).join('')
            : '<li>Aucun média ajouté.</li>';
    }
//Selon le type choisi, affiche soit le champ « fichier », soit le champ « lien ».
    function changerTypeMedia(select) {
        var bloc = select.closest('.bloc-media');
        var photoFichier = select.value === 'photo-fichier';
        bloc.querySelector('.med-fichier-bloc').hidden = !photoFichier;
        bloc.querySelector('.med-url-bloc').hidden = photoFichier;
    }
//ya9ra type elli enti bech ta5tarou yvalidi w ajouti
    function ajouterMedia(partie) {
        var bloc = partie.querySelector('.bloc-media');
        var type = bloc.querySelector('.med-type').value;
        var legende = bloc.querySelector('.med-legende').value.trim();
        var url = bloc.querySelector('.med-url').value.trim();
        partie._medias = partie._medias || [];
//ousse le média dans la liste, vide les champs et rafraîchit l’affichage.
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
        //les boutons radio
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
//eçon (titre, contenu, section médias, boutons)
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
//elli men fou9 titre matiere module....
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
//parcours mta3 block question
        zone.querySelectorAll('.bloc-question').forEach(function (bq) {
            var texte = bq.querySelector('.q-texte').value.trim();
            var options = [];
            var bonne = -1;
//ytchekki les options w ignore el vide
            bq.querySelectorAll('.q-opt').forEach(function (o) {
                var t = o.querySelector('.q-option').value.trim();
                if (!t) return;
                if (o.querySelector('.q-radio').checked) bonne = options.length;
                options.push(t);
            });
//ylanci erreur throw itha les option a9el mel 2 wala mafamech enoncé ... 
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
//ya9ra contenu w ajouti l media
            bm.querySelectorAll('.bloc-partie').forEach(function (bp) {
                var contenu = versHTML(bp.querySelector('.p-contenu').value);
                var medias = bp._medias || [];
                if (medias.length) {
                    //yajouti fi media fi fin mta3 html 
                    contenu += '<div class="medias-cours">' + medias.map(htmlMedia).join('') + '</div>';
                }
                //construction mta3 cours info 
                parties.push({
                    id: genId('p'),
                    titre: bp.querySelector('.p-titre').value.trim(),
                    contenu: contenu
                });
            });

            if (!parties.length) throw new Error('Chaque module doit contenir au moins une leçon.');
//ya9ra fi les question du quizz
            var quiz = lireQuestions(bm.querySelector('.liste-questions'));
            if (!quiz.length) throw new Error('Chaque module doit avoir au moins une question de quiz.');
//construction w stock mta3 module
            modules.push({
                id: genId('m'),
                titre: bm.querySelector('.m-titre').value.trim(),
                parties: parties,
                quiz: quiz
            });
        });
//erreur fi modules
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
//
        liste.push({ meta: meta, cours: cours });
//na3mel appelle lel A
        if (!A.ecrireCours(liste)) {
            throw new Error("Stockage du navigateur plein : utilise des liens plutôt que des fichiers pour les images.");
        }
        //redirection lel admin.html
        location.href = 'administration.html';
    }
//evenement mta3 submit
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        try {
            enregistrerCours();
        } catch (err) {
            alert(err.message);
        }
    });

    /* ---------- Événements ---------- */
//ecoute 3la tout le document moch chaque ligne
//idha l'element modifié men classe div-type bech nbadlou el media type (photo video ...)
    document.addEventListener('change', function (e) {
        if (e.target.classList.contains('med-type')) changerTypeMedia(e.target);
    });
//bech nchouf chneya bouton elli cliquit 3leha
    document.addEventListener('click', function (e) {
        var bouton = e.target.closest('[data-action]');
        if (!bouton) return;

        switch (bouton.dataset.action) {
            //ajout module
            case 'add-module':
                document.getElementById('liste-modules').insertAdjacentHTML('beforeend', htmlModule());
                break;
                //ajout lecon
            case 'add-partie':
                bouton.closest('.bloc-module').querySelector('.liste-parties')
                    .insertAdjacentHTML('beforeend', htmlPartie());
                break;
                //ajout question
            case 'add-question':
                bouton.closest('.bloc-module').querySelector('.liste-questions')
                    .insertAdjacentHTML('beforeend', htmlQuestion());
                break;
                //add quizz final
            case 'add-question-final':
                document.getElementById('liste-quiz-final').insertAdjacentHTML('beforeend', htmlQuestion());
                break;
                //sup module
            case 'del-module':
                bouton.closest('.bloc-module').remove();
                break;
                //sup partie
            case 'del-partie':
                bouton.closest('.bloc-partie').remove();
                break;
                //sup question
            case 'del-question':
                bouton.closest('.bloc-question').remove();
                break;
                //ajout media
            case 'add-media':
                ajouterMedia(bouton.closest('.bloc-partie'));
                break;
                //supp media
            case 'suppr-media':
                var partie = bouton.closest('.bloc-partie');
                partie._medias.splice(Number(bouton.dataset.index), 1);
                afficherMedias(partie);
                break;
        }
    });

    /* ---------- Démarrage ---------- */
//Au chargement, le formulaire affiche déjà un module et une question de quiz final prêts à remplir.par defaut bech ena n3ammer fehom
    document.getElementById('liste-modules').innerHTML = htmlModule();
    document.getElementById('liste-quiz-final').innerHTML = htmlQuestion();
})();