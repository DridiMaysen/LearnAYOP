// Fusionne les cours et médias ajoutés par l'admin (localStorage)
// avec CATALOGUE et donneesCours. À charger après catalogue.js et donnees-cours.js.
(function () {
    var CLE_COURS = 'learnayop_cours_admin';
    var CLE_MEDIAS = 'learnayop_medias_admin';

    function lire(cle, defaut) {
        try {
            var valeur = JSON.parse(localStorage.getItem(cle));
            return valeur || defaut;
        } catch (e) {
            return defaut;
        }
    }

    function ecrire(cle, valeur) {
        try {
            localStorage.setItem(cle, JSON.stringify(valeur));
            return true;
        } catch (e) {
            return false;
        }
    }

    function esc(texte) {
        return String(texte)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    // HTML d'un média ajouté dans une leçon
    function htmlMedia(m) {
        var legende = m.legende ? '<figcaption>' + esc(m.legende) + '</figcaption>' : '';

        if (m.type === 'image') {
            return '<figure class="media-cours">' +
                '<img src="' + esc(m.src) + '" alt="' + esc(m.legende || 'Illustration du cours') + '">' +
                legende + '</figure>';
        }

        if (m.type === 'youtube') {
            // class="video-cours" + enablejsapi=1 : la progression vidéo de cours.js fonctionne
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

    window.CATALOGUE = window.CATALOGUE || [];
    var aDonnees = typeof donneesCours !== 'undefined';
    var publies = []; // ids des cours locaux déjà collés dans les fichiers

    // 1) Cours créés par l'admin
    lire(CLE_COURS, []).forEach(function (entree) {
        var meta = entree.meta;
        var existeDeja =
            window.CATALOGUE.some(function (c) {
                return c.id === meta.id || c.cle === meta.cle;
            }) || (aDonnees && donneesCours[meta.cle]);

        if (existeDeja) {
            publies.push(meta.id);
            return;
        }

        window.CATALOGUE.push(meta);
        if (aDonnees) {
            donneesCours[meta.cle] = JSON.parse(JSON.stringify(entree.cours));
        }
    });

    // 2) Photos / vidéos ajoutées dans les leçons (cours existants ou créés)
    if (aDonnees) {
        var medias = lire(CLE_MEDIAS, {});

        Object.keys(medias).forEach(function (cle) {
            var cours = donneesCours[cle];
            if (!cours) return;

            Object.keys(medias[cle]).forEach(function (idPartie) {
                cours.modules.forEach(function (module) {
                    module.parties.forEach(function (partie) {
                        if (partie.id !== idPartie) return;

                        // évite les doublons si le média a déjà été collé dans le fichier
                        var html = medias[cle][idPartie]
                            .filter(function (m) {
                                return partie.contenu.indexOf(esc(m.src)) === -1;
                            })
                            .map(htmlMedia)
                            .join('');

                        if (html) {
                            partie.contenu += '<div class="medias-cours">' + html + '</div>';
                        }
                    });
                });
            });
        });
    }

    window.CoursAdmin = {
        publies: publies,
        lireCours: function () { return lire(CLE_COURS, []); },
        ecrireCours: function (liste) { return ecrire(CLE_COURS, liste); },
        lireMedias: function () { return lire(CLE_MEDIAS, {}); },
        ecrireMedias: function (m) { return ecrire(CLE_MEDIAS, m); }
    };
})();