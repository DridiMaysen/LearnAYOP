// Fusionne les cours et médias ajoutés par l'admin (localStorage)
// avec CATALOGUE et donneesCours. À charger après catalogue.js et donnees-cours.js.
// immediatly invoked function expression elle est annoyme elle s execute immediatement pour que 
//les var cles_cours, cle_medias,cle_supprimes soient prives pas dans l espace globale de javascript

(function () {
    //les noms des cles dans localstorage
    var CLE_COURS = 'learnayop_cours_admin';
    var CLE_MEDIAS = 'learnayop_medias_admin';
    var CLE_SUPPRIMES = 'learnayop_cours_supprimes'; // contient les ids des cours supprimés par l'admin
    //elle recoit deux parametres :nom de la cle a lire dans localstorage, defaut si aucune donnee n est exploitable
    //on va recuperer les valeurs du navigateur
    function lire(cle, defaut) {
        try {
            //on recupere la valeur associe au cle dans localstorage, on la transforme en tableau javascript

            var valeur = JSON.parse(localStorage.getItem(cle));
            //s il existe une valeur il me la retourne sinon il me retourne le par defaut
            return valeur || defaut;
        } catch (e) {
            //en cas d echec il me retourne le defaut
            return defaut;
        }
    }
    //on va ecrire dans localstorage cle, valeur
    function ecrire(cle, valeur) {
        try {
            //stringify pour la rendre chaine json et la mettre dans localstorage
            localStorage.setItem(cle, JSON.stringify(valeur));
            return true;
        } catch (e) {
            return false;
        }
    }
    //securiser le texte avant de l inserer dans html, puisqu on recoit des donnees de l admin

    function esc(texte) {
        //texte le contenu a insere dans html
        //
        return String(texte)
        //recherche toute les occurence de & globale et la remplace par &amp pour qu elle ne soit pas interprete mal
            .replace(/&/g, '&amp;')
            //de meme < peut etre interprete comme debut du html
            .replace(/</g, '&lt;')
            //fermeture
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
            //si l admin entre Cours HTML <script>alert("test")</script> elle ne serait pas interpret comme code html

    }

    // transformer un objet media enregistre en html
    function htmlMedia(m) {
        //si meta contient une legende on l insere
        var legende = m.legende ? '<figcaption>' + esc(m.legende) + '</figcaption>' : '';
        //si le media une image on cree la balise de l'image on insere l image avec legende 
        if (m.type === 'image') {
            return '<figure class="media-cours">' +
                '<img src="' + esc(m.src) + '" alt="' + esc(m.legende || 'Illustration du cours') + '">' +
                legende + '</figure>';
        }
            //s il est video youtube on l insere aussi dans iframe https://www.youtube-nocookie.com/embed/ domaine mt3 youtube enablejsapi=1 pour activer l api de lecteur youtube

        if (m.type === 'youtube') {
            // class="video-cours" + enablejsapi=1 : la progression vidéo de cours.js fonctionne
            return '<figure class="media-cours">' +
                '<iframe class="video-cours" ' +
                'src="https://www.youtube-nocookie.com/embed/' + esc(m.src) + '?enablejsapi=1" ' +
                'title="' + esc(m.legende || 'Vidéo du cours') + '" loading="lazy" allowfullscreen ' +
                'style="width:100%;aspect-ratio:16/9;border:0;border-radius:12px"></iframe>' +
                legende + '</figure>';
        }
        //si le media ni une image ni video youtube videoo normal on l insere normalement 

        return '<figure class="media-cours">' +
            '<video controls preload="metadata" src="' + esc(m.src) + '"></video>' +
            legende + '</figure>';
    }
    //ken catalogue deja initialise dans catalogue.js on le recupere sinon on l'initialise
    window.CATALOGUE = window.CATALOGUE || [];
    //verifier ili aandi donneecours retourne vrai ou faux
    var aDonnees = typeof donneesCours !== 'undefined';
    var publies = []; // ids des cours locaux qui existent deja  dans le fichier donnees_cours

    // recuperer les cours enregistres dans learnayop_cours_admin
    //pour chaque cours ajoute par l'admin (entree) on recupere ses meta pour ensuite verifier s il existe dans catalogue
//fusionner les donnees du catalogue avec les les localstorage
    lire(CLE_COURS, []).forEach(function (entree) {
        var meta = entree.meta;
        //some verifier s il existe deja au moins un cours qui a la meme cle ou id de meta
        var existeDeja =
            window.CATALOGUE.some(function (c) {
                return c.id === meta.id || c.cle === meta.cle;
            }) || (aDonnees && donneesCours[meta.cle]);
            //si le cours existe on l ajoute dans publies ili hia contient les ids des cours ili fl fichier
        if (existeDeja) {
            publies.push(meta.id);
            return;
        }
        //sinon on ajoute les meta donnes du cours dans le catalogue
        window.CATALOGUE.push(meta);
        //verifier que var donnees cours existe deja
        //entreecours contient le contenu du cours
        if (aDonnees) {
            //enregistrer dans donneecours
            donneesCours[meta.cle] = JSON.parse(JSON.stringify(entree.cours));
        }
    });
    // recuperer la liste des ids supprimees recement donc elle lit learnayop_cours_supprimes
// a chaque rechargement catalogue bech t3awed t3abba bl id mt3 les cours meme ili fil fichiers
    var supprimes = lire(CLE_SUPPRIMES, []);
//si on a au moins un id de cours supprimees
if (supprimes.length) {
    //on parcourt le catalogue 
    for (var i = window.CATALOGUE.length - 1; i >= 0; i--) {
        //on cherche l id du cours dans les cours supprimes
        if (supprimes.indexOf(window.CATALOGUE[i].id) !== -1) {
            //si donnes existe on supprime la propriete du cours
            if (aDonnees) delete donneesCours[window.CATALOGUE[i].cle];
            //on le supprime du catalogue slpice naatiha position de depart nb a supprimer
            window.CATALOGUE.splice(i, 1);
        }
    }
}
    // si on a des donnees (contenu du cours)
    if (aDonnees) {
        //on recupere les medias du cours
        var medias = lire(CLE_MEDIAS, {});
        //parcourir les cours contenant des medias
        Object.keys(medias).forEach(function (cle) {
            //on recupere contenu de cours
            var cours = donneesCours[cle];
            if (!cours) return;
            //parcourir les parties contenant des medias
            Object.keys(medias[cle]).forEach(function (idPartie) {
                cours.modules.forEach(function (module) {
                    module.parties.forEach(function (partie) {
                        //on recupere les id des parties qui contiennet du medias
                        if (partie.id !== idPartie) return;

                        // recupere les medias du cours et de la partie actuelle
                        var html = medias[cle][idPartie]
                            .filter(function (m) {
                                //on garde la medias si la source n existe pas deja dans le contenu de la partie
                                return partie.contenu.indexOf(esc(m.src)) === -1;
                            })
                            //on la transforme au contenu html correspondant
                            .map(htmlMedia)
                            .join('');
                            //inserer medias dans la lecon
                        if (html) {
                            partie.contenu += '<div class="medias-cours">' + html + '</div>';
                        }
                    });
                });
            });
        });
    }
    //suppression par l id du cours que l admin souhaite le supprimer
    function supprimerCours(id) {
        //recuperer les donnees du cours :window.catalogue contient la liste des cours on la filtre par l id du cours a supprimer et on recupere ses metas 
    //5ater 7achti bl cle bech n supprimi l cours w medias mte3ou  donnees
        var meta = window.CATALOGUE.filter(function (c) { return c.id === id; })[0];

    //recuperer les cours locaux ajoute par l administrateur et dans localstorage
    var locaux = lire(CLE_COURS, []);
    //filtrer les coours et laisser tous les cours sauf le cours a supprimer 
    var restants = locaux.filter(function (c) { return c.meta.id !== id; });
    //enregistrer la nouvelle liste des cours apres suppression dans localstorage
    if (restants.length !== locaux.length) ecrire(CLE_COURS, restants);

    // puisqu un cours peut contenir des medias donc supprimer un cours doit entrainer la suppression de ses medias enregistres localement
    if (meta) {
        //recupere les medias
        var medias = lire(CLE_MEDIAS, {});
        //supprimer les medias associe aux cle de cours
        delete medias[meta.cle];
        //sauvegarder
        ecrire(CLE_MEDIAS, medias);
    }

    // on memorise la suppression du cours puisqu' ils ne sont pas enregistre dans le meme endroit(fichier et localstorage)
    //supprimer un element de local storage ne suffit pas pour le supprimer s il est deja enregistre dans le fichier
    //cle_supprimes liste qui memorise les id des cours supprimes

    //verifier si le cours a supprimer existe dans fichier
    var estDansFichiers = !locaux.some(function (c) { return c.meta.id === id; }) ||
        publies.indexOf(id) !== -1;
        //recupere la liste des cours supprimes
    var liste = lire(CLE_SUPPRIMES, []);
    //l id du cours doit etre memorise dans la liste des exclusions et l id ne doit etre present dans la liste
    if (estDansFichiers && liste.indexOf(id) === -1) {
        //on ajoute l id a la fin de la liste
        liste.push(id);
        //on enregistre dans localstorage
        ecrire(CLE_SUPPRIMES, liste);
    }

    // supprimer la progression de ce cours
    try {
        //recuperer la progression
        var prog = JSON.parse(localStorage.getItem('learnayop_progress')) || {};
        //on supprime sa cle depuis localstorage
        delete prog[id];
        //on supprime la position du cours, progression et progression video
        localStorage.setItem('learnayop_progress', JSON.stringify(prog));
        ['learnayop_progress_', 'learnayop_position_', 'learnayop_video_'].forEach(function (p) {
            localStorage.removeItem(p + id);
        });
    } catch (e) { }
}
//exposer les fonctions prives puisqu on est dans immediatly invoked function expression
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