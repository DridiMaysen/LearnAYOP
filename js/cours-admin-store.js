// Fusionne les cours et médias ajoutés par l'admin (localStorage)
// avec CATALOGUE et donneesCours. À charger après catalogue.js et donnees-cours.js.
(function () {
    var CLE_COURS = 'learnayop_cours_admin';
    var CLE_MEDIAS = 'learnayop_medias_admin';
    var CLE_SUPPRIMES = 'learnayop_cours_supprimes'; // ids des cours supprimés par l'admin

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
    // 1 bis) Cours supprimés par l'admin : retirés du catalogue et des données
var supprimes = lire(CLE_SUPPRIMES, []);
if (supprimes.length) {
    for (var i = window.CATALOGUE.length - 1; i >= 0; i--) {
        if (supprimes.indexOf(window.CATALOGUE[i].id) !== -1) {
            if (aDonnees) delete donneesCours[window.CATALOGUE[i].cle];
            window.CATALOGUE.splice(i, 1);
        }
    }
}
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
    function supprimerCours(id) {
    var meta = window.CATALOGUE.filter(function (c) { return c.id === id; })[0];

    // copie locale créée via « Ajouter un cours »
    var locaux = lire(CLE_COURS, []);
    var restants = locaux.filter(function (c) { return c.meta.id !== id; });
    if (restants.length !== locaux.length) ecrire(CLE_COURS, restants);

    // médias ajoutés dans les leçons
    if (meta) {
        var medias = lire(CLE_MEDIAS, {});
        delete medias[meta.cle];
        ecrire(CLE_MEDIAS, medias);
    }

    // cours présent dans catalogue.js / donnees-cours.js : on mémorise la suppression
    var estDansFichiers = !locaux.some(function (c) { return c.meta.id === id; }) ||
        publies.indexOf(id) !== -1;
    var liste = lire(CLE_SUPPRIMES, []);
    if (estDansFichiers && liste.indexOf(id) === -1) {
        liste.push(id);
        ecrire(CLE_SUPPRIMES, liste);
    }

    // progression des étudiants sur ce navigateur
    try {
        var prog = JSON.parse(localStorage.getItem('learnayop_progress')) || {};
        delete prog[id];
        localStorage.setItem('learnayop_progress', JSON.stringify(prog));
        ['learnayop_progress_', 'learnayop_position_', 'learnayop_video_'].forEach(function (p) {
            localStorage.removeItem(p + id);
        });
    } catch (e) { }
}

    window.CoursAdmin = {
        publies: publies,
        lireCours: function () { return lire(CLE_COURS, []); },
        ecrireCours: function (liste) { return ecrire(CLE_COURS, liste); },
        lireMedias: function () { return lire(CLE_MEDIAS, {}); },
        ecrireMedias: function (m) { return ecrire(CLE_MEDIAS, m); },
        supprimerCours: supprimerCours,
        lireSupprimes: function () { return lire(CLE_SUPPRIMES, []); },
    };
})();