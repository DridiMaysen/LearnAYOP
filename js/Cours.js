//recuperation des elements
const layout = document.getElementById("layout");
const sidebar = document.getElementById("sidebar");
const moduleList = document.getElementById("moduleList");
const courseProgress = document.getElementById("courseProgress");
const courseProgressText = document.getElementById("courseProgressText");
const lessonInfo = document.getElementById("lessonInfo");
const lessonTitle = document.getElementById("lessonTitle");
const lessonContent = document.getElementById("lessonContent");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const themeBtn = document.getElementById("themeBtn");
const outlineBtn = document.getElementById("outlineBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");
// Gestion de la progression des vidéos
let lecteursVideo = [];
let intervalVideo = null;


//correspondance entre les references et les cours (dictionnaire)
const CORRESPONDANCE_COURS = {};
(window.CATALOGUE || []).forEach(function (c) {
    CORRESPONDANCE_COURS[c.id] = c.cle;
});
//avec window.location.search on recupere la partie apres ? dans l url qui contient les params
const parametresURL = new URLSearchParams(window.location.search);
//on a recupere parametre id 
const identifiantURL = parametresURL.get("id");
// Clé de sauvegarde des vidéos du cours
const cleProgressionVideo =
    "learnayop_video_" + identifiantURL;
//si l id contient le code on fait la correspondance sinon on prend le nom de cours tel qu il est
const cleDonnees = CORRESPONDANCE_COURS[identifiantURL] || identifiantURL;
//recuperer le cours ici cledonnee contient ex: "sgbd"
const cours = donneesCours[cleDonnees];
//l,inverse on recupere l id du cours si on a le nom de cours
//object.keys recupere les cle de dictionnaire . find retourne le premier id trouve sinon elle retourne l id de l url
const identifiantCours =
    Object.keys(CORRESPONDANCE_COURS).find(function (id) {
        return CORRESPONDANCE_COURS[id] === cleDonnees;
    }) || identifiantURL;
//je construis un cle de stockage pour la progression sous la forme learnayop_progress_C002 (ena n sauvegardi bl id mt3 l cours ema nrecuperi donne bi ism l cours)
const cleSauvegarde = "learnayop_progress_" + identifiantCours;
//pour le sauvegarde de la position dans le cours
const clePosition = "learnayop_position_" + identifiantCours;
//objectif mte3i n recuperi l progression fi kol retour ll page
//progression initiallement vide le tableau va contenur les identifiants des parties terminee pour chaque cours
let progression = {
    terminees: []
};
//on recupere ce qui est sauvegarder fil localstorage bl cle ili deja recuperineh
try {
    const sauvegarde = localStorage.getItem(cleSauvegarde);
    if (sauvegarde) {
        //local storage bech traja3li chaine donc n convertiha en objet javascript qui contient e tableu terminee
        progression = JSON.parse(sauvegarde);
        //ken valeur retourne ne respecte pas structure mt3 tableau n9olou reinitialsi el progression bech mnblokich el site
        if (!Array.isArray(progression.terminees)) {
            progression = { terminees: [] };
        }
    }
    //bech ken saret mochkla w le haja maytihch l programme en panne ahawka n reinitialisi el progression w akahaw
} catch (erreur) {
    progression = { terminees: [] };
}
//contenucours contient toutes les etapes du cours dans leur ordre de consultation
let contenuCours = [];
// l'index de l etape affichee initiallement 0
let positionActuelle = 0;
//hedhi 3mlneha 5ater cours 3ndou structure hierarchique (modules puis parties..) pourque les boutons precedent et suivant fonctionnenet normalement
//7awlnehom li liste ordonnee Leçon 1.1 → Leçon 1.2 → Quiz module 1 → Leçon 2.1 → Quiz module 2 → … → Évaluation finale
//bien sur kol element aandou type(partie,quiz,evaluation) w id w lenou module w donne mt3 kol partie
//push t inseri fi lekher dima bech baad suiv et prec nestamml les index mt3 tableau b tartib 
function preparerCours() {
    contenuCours = [];
    cours.modules.forEach(function (module) {
        module.parties.forEach(function (partie) {
            contenuCours.push({
                type: "partie",
                id: "partie-" + partie.id,
                module: module,
                partie: partie,
                titre: partie.titre
            });
        });
        //ba3d mnkml les parties mt3 l module lkol ninseri l quiz mt3 l module
        contenuCours.push({
            type: "quiz",
            id: "quiz-" + module.id,
            module: module,
            titre: "Quiz : " + module.titre,
            questions: module.quiz
        });
    });
    //ba3d mnkml les modules n inseri quiz final
    contenuCours.push({
        type: "evaluation",
        id: "quiz-final",
        titre: "Évaluation finale du cours",
        questions: cours.quizFinal
    });
}
//sauvegarder la position du partir du cours
function sauvegarderPosition() {
    localStorage.setItem(
        clePosition,
        positionActuelle
    );
}
// sauvegarder la progression donc pour chaque cle cours on associe progression 
//json.stringfy 7awelneha ll chaine 5ater progression hia objet java w lkol storage matefhem ken bl taxte

function sauvegarderProgression() {
    try {
        localStorage.setItem(
            cleSauvegarde,
            JSON.stringify(progression)
        );
    } catch (erreur) {
        alert("La progression n'a pas pu être sauvegardée.");
    }
}
// Sauvegarder la position de lecture d'une vidéo
function sauvegarderPositionVideo(idVideo, position) {

    let donnees = {};

    try {
        donnees = JSON.parse(
            localStorage.getItem(cleProgressionVideo)
        ) || {};
    } catch (erreur) {
        donnees = {};
    }

    donnees[idVideo] = position;

    localStorage.setItem(
        cleProgressionVideo,
        JSON.stringify(donnees)
    );
}

// Récupérer la position sauvegardée
function recupererPositionVideo(idVideo) {

    try {
        const donnees = JSON.parse(
            localStorage.getItem(cleProgressionVideo)
        ) || {};

        return Number(donnees[idVideo]) || 0;

    } catch (erreur) {
        return 0;
    }
}

// Formater les secondes en minutes et secondes
function formaterTemps(secondes) {

    const minutes = Math.floor(secondes / 60);
    const secondesRestantes = Math.floor(secondes % 60);

    return minutes + ":" +
        String(secondesRestantes).padStart(2, "0");
}

// Initialiser les vidéos de la leçon
function initialiserVideos() {

    const videos = lessonContent.querySelectorAll(
        "iframe.video-cours"
    );

    videos.forEach(function (iframe, index) {

        // Identifiant unique de la vidéo
        const idVideo = iframe.id ||
            "video-" + positionActuelle + "-" + index;

        iframe.id = idVideo;

        // Créer la barre de progression
        const conteneur = document.createElement("div");
        conteneur.className = "video-progression";

        const barre = document.createElement("div");
        barre.className = "video-progression-barre";

        const remplissage = document.createElement("div");
        remplissage.className = "video-progression-remplissage";

        barre.appendChild(remplissage);

        // Ajouter les marqueurs 25 %, 50 % et 75 %
        [25, 50, 75].forEach(function (pourcentage) {

            const marqueur = document.createElement("span");
            marqueur.className = "video-marqueur";
            marqueur.style.left = pourcentage + "%";

            barre.appendChild(marqueur);
        });

        const temps = document.createElement("div");
        temps.className = "video-temps";

        const tempsActuel = document.createElement("span");
        tempsActuel.textContent = "0:00";

        const dureeVideo = document.createElement("span");
        dureeVideo.textContent = "0:00";

        temps.appendChild(tempsActuel);
        temps.appendChild(dureeVideo);

        conteneur.appendChild(barre);
        conteneur.appendChild(temps);

        iframe.insertAdjacentElement("afterend", conteneur);

        // Créer le lecteur YouTube
        const lecteur = new YT.Player(idVideo, {

            events: {

                // Lorsque la vidéo est prête
                onReady: function (evenement) {

                    const duree = evenement.target.getDuration();

                    dureeVideo.textContent =
                        formaterTemps(duree);

                    // Reprendre à la position sauvegardée
                    const position = recupererPositionVideo(idVideo);

                    if (position > 0 && position < duree) {
                        evenement.target.seekTo(position, true);
                    }
                },

                // Lorsque la vidéo est terminée
                onStateChange: function (evenement) {

                    if (
                        evenement.data === YT.PlayerState.ENDED
                    ) {

                        // Sauvegarder la durée totale
                        sauvegarderPositionVideo(
                            idVideo,
                            evenement.target.getDuration()
                        );

                        // Marquer la leçon comme terminée
                        const element =
                            contenuCours[positionActuelle];

                        if (element && element.type === "partie") {
                            terminerElement(element.id);
                            afficherModules();
                            actualiserProgressionCours();
                        }
                    }
                }
            }
        });

        lecteursVideo.push({
            lecteur: lecteur,
            id: idVideo,
            remplissage: remplissage,
            tempsActuel: tempsActuel,
            duree: dureeVideo
        });
    });

    // Actualiser les barres chaque seconde
    demarrerActualisationVideo();
}

// Actualiser la progression des vidéos
function demarrerActualisationVideo() {

    if (intervalVideo) {
        clearInterval(intervalVideo);
    }

    intervalVideo = setInterval(function () {

        lecteursVideo.forEach(function (video) {

            try {

                const position =
                    video.lecteur.getCurrentTime();

                const duree =
                    video.lecteur.getDuration();

                if (duree > 0) {

                    const pourcentage =
                        (position / duree) * 100;

                    // Actualiser la barre
                    video.remplissage.style.width =
                        pourcentage + "%";

                    // Actualiser le temps
                    video.tempsActuel.textContent =
                        formaterTemps(position);

                    video.duree.textContent =
                        formaterTemps(duree);

                    // Sauvegarder la position
                    if (
                        video.lecteur.getPlayerState() ===
                        YT.PlayerState.PLAYING
                    ) {
                        sauvegarderPositionVideo(
                            video.id,
                            position
                        );
                    }
                }

            } catch (erreur) {
                // Le lecteur peut ne pas être encore prêt
            }
        });

    }, 1000);
}

// Arrêter les lecteurs avant de changer de leçon
function arreterVideos() {

    if (intervalVideo) {
        clearInterval(intervalVideo);
        intervalVideo = null;
    }

    lecteursVideo.forEach(function (video) {

        try {
            const position =
                video.lecteur.getCurrentTime();

            sauvegarderPositionVideo(video.id, position);

            video.lecteur.destroy();

        } catch (erreur) {
            console.error("Erreur vidéo :", erreur);
        }
    });

    lecteursVideo = [];
}
// Charger l'API YouTube
function chargerAPIYouTube() {

    if (window.YT && window.YT.Player) {
        initialiserVideos();
        return;
    }

    window.onYouTubeIframeAPIReady = function () {
        initialiserVideos();
    };

    if (!document.getElementById("youtube-api")) {

        const script = document.createElement("script");

        script.id = "youtube-api";
        script.src = "https://www.youtube.com/iframe_api";

        document.head.appendChild(script);
    }
}
//verifier si l element dont l id= est terminee (true false)
function elementEstTermine(id) {
    return progression.terminees.includes(id);
}
// ki nkml element nverifi se3a ili houwa mahouch deja terminee (mahouch mawjoud fil tableau terminee) w ken mahouch mawjoud nzidou
//w bien sur n sauvegarder el progression baad mnaaml push
function terminerElement(id) {
    if (!elementEstTermine(id)) {
        progression.terminees.push(id);
        sauvegarderProgression();
    }
}
//3malneha bech t communiqui les statistiques mt3 progression maa les autres composants ili fiha les cartes de cours
function publierResume() {
    //nverifi ili learnprogress mawjoud (objet global)
    if (!window.LearnProgress) {
        return;
    }
    //nehseb 9adech mn element terminee fil cours filter taameli tableau jdid fih les id lt3 e terminee kahaw
    //nombre terminee des element filter.length
    const nombreTermines = contenuCours.filter(function (element) {
        return elementEstTermine(element.id);
    }).length;
    //nb3th e resume (id cours,nb terminee,element total du cours) ll script mt3 learn progress
    window.LearnProgress.setSummary(
        identifiantCours,
        nombreTermines,
        contenuCours.length
    );
}
//nehseb pourcentage mt3 progression lkol element n3adih (module w ella cours)
function calculerPourcentage(elements) {
    if (elements.length === 0) {
        return 0;
    }
    let nombreTermines = 0;
    //fi kol element ne7seb 9adeh terminee w nzid
    elements.forEach(function (element) {
        if (elementEstTermine(element.id)) {
            nombreTermines++;
        }
    });
    //formule de calcul mt3 progression 
    return Math.round((nombreTermines / elements.length) * 100);
}
//affichage mt3 barre w texte ili bjnabha ll cours lkol
//n3ayet ll calcul cours n rexuperi el pourcentage w baad nhot l value mt3 l progress bar bl valeur hedhika w texte kif kif
function actualiserProgressionCours() {
    const pourcentage = calculerPourcentage(contenuCours);
    courseProgress.value = pourcentage;
    courseProgressText.textContent = pourcentage + " % terminé";
    //bech nab3th ll composant leker
    publierResume();
}
//construire le module a chaque appel
function afficherModules() {
    moduleList.innerHTML = "";
    cours.modules.forEach(function (module) {
        //sna3na <div class="module-item"> w fiha titre
        const blocModule = document.createElement("div");
        blocModule.className = "module-item";
        const titre = document.createElement("h3");
        titre.className = "module-title";
        titre.textContent = module.titre;
        blocModule.appendChild(titre);
        //liste des id des parties des modules et le quiz de chaque module bech nhsbe biha el pourcentage baad mt3 kol module
        const elementsModule = [];
        module.parties.forEach(function (partie) {
            elementsModule.push({
                id: "partie-" + partie.id
            });
        });
        elementsModule.push({
            id: "quiz-" + module.id
        });
        //hsebna pourcentage de progression
        const pourcentageModule = calculerPourcentage(elementsModule);
        //sna3na progress bar lkol module
        const ligneProgression = document.createElement("div");
        ligneProgression.className = "module-progress-row";
        const barreProgression = document.createElement("progress");
        barreProgression.className = "module-progress";
        barreProgression.max = 100;
        barreProgression.value = pourcentageModule;
        barreProgression.setAttribute("aria-label", "Progression du module");
        //pourcentage ba7dhe kol barre
        const textePourcentage = document.createElement("span");
        textePourcentage.className = "module-progress-percent";
        textePourcentage.textContent = pourcentageModule + " %";
        ligneProgression.appendChild(barreProgression);
        ligneProgression.appendChild(textePourcentage);
        blocModule.appendChild(ligneProgression);
        //pour chaque partie du module
        module.parties.forEach(function (partie) {
            //kol partie nzidha button bech nrigllha css mt3ha comme completed
            const idElement = "partie-" + partie.id;
            const bouton = document.createElement("button");
            bouton.type = "button";
            bouton.className = "module-button";

            const terminee = elementEstTermine(idElement);
            //ken partie terminee nraka7 css mt3ha completed
            if (terminee) {
                bouton.classList.add("completed");
            }
            //nlawej al index mt3 element fil contenucours 
            const indexElement = contenuCours.findIndex(function (element) {
                return element.id === idElement;
            });
            //ken egale l position actuelle nzidha l classe active bech b css twali hoovered
            if (indexElement === positionActuelle) {
                bouton.classList.add("active");
            }
            //nzidoou l icone tchecked ken terminee sinon vide
            const icone = document.createElement("i");
            icone.className = terminee
                ? "fa-solid fa-circle-check status-icon"
                : "fa-regular fa-circle status-icon";
            icone.setAttribute("aria-hidden", "true");
            //3malna span ll titre mt3 l partie w icone
            const texte = document.createElement("span");
            texte.textContent = partie.titre;
            bouton.appendChild(icone);
            bouton.appendChild(texte);
            //ki ncliqui al element n3aye tl changer contenu
            bouton.addEventListener("click", function () {
                changerDeContenu(indexElement);
            });
            blocModule.appendChild(bouton);
        });
        //kif kif ll quiz zeda
        const boutonQuiz = document.createElement("button");
        boutonQuiz.type = "button";
        boutonQuiz.className = "module-button quiz-link";
        const idQuiz = "quiz-" + module.id;
        const quizTermine = elementEstTermine(idQuiz);
        if (quizTermine) {
            boutonQuiz.classList.add("completed");
        }
        const indexQuiz = contenuCours.findIndex(function (element) {
            return element.id === idQuiz;
        });
        if (indexQuiz === positionActuelle) {
            boutonQuiz.classList.add("active");
        }
        const iconeQuiz = document.createElement("i");
        iconeQuiz.className = quizTermine
            ? "fa-solid fa-circle-check status-icon"
            : "fa-solid fa-clipboard-question status-icon";
        iconeQuiz.setAttribute("aria-hidden", "true");
        const texteQuiz = document.createElement("span");
        texteQuiz.textContent = "Quiz du module";
        boutonQuiz.appendChild(iconeQuiz);
        boutonQuiz.appendChild(texteQuiz);
        boutonQuiz.addEventListener("click", function () {
            changerDeContenu(indexQuiz);
        });
        blocModule.appendChild(boutonQuiz);
        moduleList.appendChild(blocModule);
    });
    //l evaluation finale
    const blocFinal = document.createElement("div");
    blocFinal.className = "module-item";
    const titreFinal = document.createElement("h3");
    titreFinal.className = "module-title";
    titreFinal.textContent = "Évaluation finale";
    blocFinal.appendChild(titreFinal);
    const boutonFinal = document.createElement("button");
    boutonFinal.type = "button";
    boutonFinal.className = "module-button quiz-link";
    const evaluationTerminee = elementEstTermine("quiz-final");
    if (evaluationTerminee) {
        boutonFinal.classList.add("completed");
    }
    const indexFinal = contenuCours.findIndex(function (element) {
        return element.id === "quiz-final";
    });
    if (indexFinal === positionActuelle) {
        boutonFinal.classList.add("active");
    }
    const iconeFinale = document.createElement("i");
    iconeFinale.className = evaluationTerminee
        ? "fa-solid fa-circle-check status-icon"
        : "fa-solid fa-graduation-cap status-icon";
    iconeFinale.setAttribute("aria-hidden", "true");
    const texteFinal = document.createElement("span");
    texteFinal.textContent = "Quiz d'évaluation du cours";
    boutonFinal.appendChild(iconeFinale);
    boutonFinal.appendChild(texteFinal);
    boutonFinal.addEventListener("click", function () {
        changerDeContenu(indexFinal);
    });
    blocFinal.appendChild(boutonFinal);
    moduleList.appendChild(blocFinal);
}
function changerDeContenu(nouvellePosition) {

    if (nouvellePosition !== positionActuelle) {

        const contenuPrecedent = contenuCours[positionActuelle];

        if (contenuPrecedent && contenuPrecedent.type === "partie") {

            // Vérifier si la leçon contient une vidéo
            const contientVideo = lessonContent.querySelector(
                "iframe.video-cours"
            );

            // Les leçons sans vidéo gardent leur ancien fonctionnement
            if (!contientVideo) {
                terminerElement(contenuPrecedent.id);
            }
        }

        // Sauvegarder et arrêter les vidéos
        arreterVideos();
    }

    positionActuelle = nouvellePosition;

    sauvegarderPosition();

    afficherContenu();

    afficherModules();

    actualiserProgressionCours();
}

function afficherContenu() {
    //nrecuperi l element
    const element = contenuCours[positionActuelle];
    if (!element) {
        return;
    }
    //nvidi blasset lesson content
    lessonContent.innerHTML = "";
    //ndesactivi prec ken on est dans debut w ndesactivi fin ken on est dans la fin
    prevBtn.disabled = positionActuelle === 0;
    nextBtn.disabled = positionActuelle === contenuCours.length - 1;
    if (element.type === "partie") {
        lessonInfo.textContent =
            element.module.titre + " • Leçon";
            //on definit le tittre
        lessonTitle.textContent = element.titre;
        //puisque e donnee mte3i en html deja donc 7atitha fi innerhtml 
        lessonContent.innerHTML = element.partie.contenu;
        // Charger et initialiser les vidéos
        chargerAPIYouTube();    
        //kenou quiz yaffichi mt3 quiz w y3ayet ll afficherquiz
    } else if (element.type === "quiz") {
        lessonInfo.textContent = element.module.titre + " • Quiz";
        lessonTitle.textContent = element.titre;
        afficherQuiz(element);
        //kenou evaluation final y affichi mt3 final w y3ayet ll afficher quiz
    } else {
        lessonInfo.textContent = "Évaluation finale";
        lessonTitle.textContent = element.titre;
        afficherQuiz(element);
    }
}
function afficherQuiz(element) {
    //creer un conteneur ll quiz
    const quizContainer = document.createElement("div");
    quizContainer.className = "quiz-container";
    //paragraphe qui me dit ili houwa lezmou yetjeweb b s7i7 bech ytvaled
    const introduction = document.createElement("p");
    introduction.textContent =
        "Réponds aux questions, puis clique sur « Vérifier mes réponses ». " +
        "Tu dois répondre correctement à toutes les questions pour valider ce quiz.";
    quizContainer.appendChild(introduction);
    //sna3na form
    const formulaire = document.createElement("form");
    //pour chaque question de l element quiz
    element.questions.forEach(function (question, indexQuestion) {
        const blocQuestion = document.createElement("div");
        blocQuestion.className = "quiz-question";
        //h3 ll titrequestion n7ot fih index mt3 question + 1 (yabde mn 0)+ contenu mt3 question
        const titreQuestion = document.createElement("h3");
        titreQuestion.textContent =
            (indexQuestion + 1) + ". " + question.question;
        blocQuestion.appendChild(titreQuestion);
        //nrecuperi les options mt3 kol question
        question.options.forEach(function (option, indexOption) {
            const label = document.createElement("label");
            label.className = "quiz-option";
            //bouton radio pour chaque proposition
            const radio = document.createElement("input");
            radio.type = "radio";
            //nafs name bech nobligih ya5tar wahda barka
            radio.name = "question-" + indexQuestion;
            radio.value = indexOption;
            //exiger une reponse pour chaque question
            radio.required = true;
            const texteOption = document.createElement("span");
            texteOption.textContent = option;
            label.appendChild(radio);
            label.appendChild(texteOption);
            blocQuestion.appendChild(label);
        });
        //nzidou fl form
        formulaire.appendChild(blocQuestion);
    });
    //bouton pour submit
    const boutonVerifier = document.createElement("button");
    boutonVerifier.type = "submit";
    boutonVerifier.className = "quiz-submit";
    boutonVerifier.textContent = "Vérifier mes réponses";
    formulaire.appendChild(boutonVerifier);
    const resultat = document.createElement("div");
    resultat.className = "quiz-result";
    resultat.setAttribute("aria-live", "polite");
    formulaire.addEventListener("submit", function (evenement) {
        //empeche le rechargement de la page
        evenement.preventDefault();
        let bonnesReponses = 0;
        //pour chaque question 
        element.questions.forEach(function (question, indexQuestion) {
            //queryselector cherche le premier element html qui correspond ll selecteur css
            //bouton radio dont le nom correspond ll question courante et selectionne
            const reponseChoisie = formulaire.querySelector(
                'input[name="question-' + indexQuestion + '"]:checked'
            );
            //ken fama reponse et valeur numerique mt3 reponse correspond ll bonne reponse n incrementi l bonne reponse
            //number 5ater value fiha des textes
            if (
                reponseChoisie &&
                Number(reponseChoisie.value) === question.bonneReponse
            ) {
                bonnesReponses++;
            }
        });
        const totalQuestions = element.questions.length;
        //supprimer l ancienne classe ken fama erreur w le haja
        resultat.classList.remove("success", "error");
        //ken nb bonne reponse 9ad nbre d equestion n affichilou success w n termini l element
        if (bonnesReponses === totalQuestions) {
            terminerElement(element.id);
            resultat.classList.add("success");
            resultat.textContent =
                "Bravo ! " + bonnesReponses + "/" + totalQuestions +
                " bonnes réponses. Quiz réussi !";
            afficherModules();//pour actualiser l etat termineee de quiz checked en vert
            actualiserProgressionCours();
            boutonVerifier.textContent = "Quiz validé";
            boutonVerifier.disabled = true;
        } else {
            //sinon erreur w n affichilou 9adeh mn question shih
            resultat.classList.add("error");
            resultat.textContent =
                "Tu as obtenu " + bonnesReponses + "/" + totalQuestions +
                ". Relis tes réponses et réessaie : toutes les réponses " +
                "doivent être correctes pour valider le quiz.";
        }
    });
    quizContainer.appendChild(formulaire);
    quizContainer.appendChild(resultat);
    lessonContent.appendChild(quizContainer);
}
///

//event listeners al btn previous w next w n3ayet ken l changerdecontenu

prevBtn.addEventListener("click", function () {
    if (positionActuelle > 0) {
        changerDeContenu(positionActuelle - 1);
    }
});
nextBtn.addEventListener("click", function () {
    if (positionActuelle < contenuCours.length - 1) {
        changerDeContenu(positionActuelle + 1);
    }
});
//recuperer l icone du theme
const themeIcon = themeBtn.querySelector("i");
//recuperer le theme precedent
const themeSauvegarde = localStorage.getItem("learnayop_theme");
if (themeSauvegarde === "sombre") {
    //classe css theme dark
    document.body.classList.add("theme-dark");
    //remplacer l icone
    themeIcon.classList.replace("fa-moon", "fa-sun");
    themeBtn.setAttribute("aria-label", "Activer le thème clair");
} else {
    document.body.classList.remove("theme-dark");
    themeIcon.classList.replace("fa-sun", "fa-moon");
    themeBtn.setAttribute("aria-label", "Activer le thème sombre");
}
themeBtn.addEventListener("click", function () {
    //toggle ajoute la classe s elle n existe pas sinon la supprimer
    document.body.classList.toggle("theme-dark");
    //verifier si la classe existe
    const themeSombre =
        document.body.classList.contains("theme-dark");
    if (themeSombre) {
        //remplacer l icone moon par sun
        themeIcon.classList.replace("fa-moon", "fa-sun");
        themeBtn.setAttribute("aria-label", "Activer le thème clair");
        //enregistrer dans localstorage
        localStorage.setItem("learnayop_theme", "sombre");
    } else {
        themeIcon.classList.replace("fa-sun", "fa-moon");
        themeBtn.setAttribute("aria-label", "Activer le thème sombre");
        localStorage.setItem("learnayop_theme", "clair");
    }
});
//
const outlineIcon = outlineBtn.querySelector("i");
outlineBtn.addEventListener("click", function () {
    layout.classList.toggle("sidebar-hidden");
    //true ou false masque ou non
    const modulesMasques =
        layout.classList.contains("sidebar-hidden");
    outlineBtn.setAttribute("aria-pressed", modulesMasques);
    outlineBtn.setAttribute(
        "aria-label",
        modulesMasques ? "Afficher les modules" : "Masquer les modules"
    );
    //css ken fatable w le fabook open
    outlineIcon.classList.toggle("fa-table-columns");
    outlineIcon.classList.toggle("fa-book-open");
});
//ken bl bouton au clavier sta3melna l api full screen mt3 navigateur
const fullscreenIcon = fullscreenBtn.querySelector("i");
fullscreenBtn.addEventListener("click", async function () {
    try {
        if (!document.fullscreenElement) {
            await document.documentElement.requestFullscreen();
        } else {
            await document.exitFullscreen();
        }
    } catch (erreur) {
        console.error("Erreur lors du changement de plein écran :", erreur);
    }
});
//gerer les icones
document.addEventListener("fullscreenchange", function () {
    const pleinEcran = Boolean(document.fullscreenElement);
    if (pleinEcran) {
        fullscreenIcon.classList.replace("fa-expand", "fa-compress");
        fullscreenBtn.setAttribute("aria-label", "Quitter le plein écran");
        fullscreenBtn.setAttribute("title", "Quitter le plein écran");
    } else {
        fullscreenIcon.classList.replace("fa-compress", "fa-expand");
        fullscreenBtn.setAttribute("aria-label", "Passer en plein écran");
        fullscreenBtn.setAttribute("title", "Plein écran");
    }
});
//ken l cours mafamech 
if (!cours) {
    lessonInfo.textContent = "";
    lessonTitle.textContent = "Cours introuvable";
    lessonContent.innerHTML =
        '<p>Le cours demandé n’existe pas ou son identifiant est incorrect.</p>' +
        '<p><a href="courses.html">Retour au catalogue</a></p>';
    sidebar.style.display = "none";
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    //ken les modules mahomch valides
} else if (!Array.isArray(cours.modules) || cours.modules.length === 0) {
    lessonTitle.textContent = "Ce cours ne contient pas encore de modules.";
    prevBtn.disabled = true;
    nextBtn.disabled = true;
} else {
    preparerCours();

    // Récupérer la dernière position sauvegardée
    const positionSauvegardee = Number(
        localStorage.getItem(clePosition)
    );

    // Vérifier que la position existe et est valide
    if (
        Number.isInteger(positionSauvegardee) &&
        positionSauvegardee >= 0 &&
        positionSauvegardee < contenuCours.length
    ) {
        positionActuelle = positionSauvegardee;
    }

    afficherContenu();
    afficherModules();
    actualiserProgressionCours();
}