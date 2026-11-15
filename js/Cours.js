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

let lecteursVideo = [];
let intervalVideo = null;

const CORRESPONDANCE_COURS = {};
(window.CATALOGUE || []).forEach(function (c) {
    CORRESPONDANCE_COURS[c.id] = c.cle;
});

const parametresURL = new URLSearchParams(window.location.search);
const identifiantURL = parametresURL.get("id");
const cleDonnees = CORRESPONDANCE_COURS[identifiantURL] || identifiantURL;
const cours = donneesCours[cleDonnees];
const identifiantCours =
    Object.keys(CORRESPONDANCE_COURS).find(function (id) {
        return CORRESPONDANCE_COURS[id] === cleDonnees;
    }) || identifiantURL;

let progression = { terminees: [] };
let positionsVideos = {};
let contenuCours = [];
let positionActuelle = 0;

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
        contenuCours.push({
            type: "quiz",
            id: "quiz-" + module.id,
            module: module,
            titre: "Quiz : " + module.titre,
            questions: module.quiz
        });
    });
    contenuCours.push({
        type: "evaluation",
        id: "quiz-final",
        titre: "Évaluation finale du cours",
        questions: cours.quizFinal
    });
}

function sauvegarderPosition() {
    apiPost("api/progression.php", {
        action: "position",
        cours: identifiantCours,
        position: positionActuelle
    }).catch(function () {});
}

function sauvegarderPositionVideo(idVideo, position) {
    positionsVideos[idVideo] = position;
    apiPost("api/progression.php", {
        action: "video",
        cours: identifiantCours,
        video: idVideo,
        temps: position
    }).catch(function () {});
}

function recupererPositionVideo(idVideo) {
    return Number(positionsVideos[idVideo]) || 0;
}

function formaterTemps(secondes) {
    const minutes = Math.floor(secondes / 60);
    const secondesRestantes = Math.floor(secondes % 60);
    return minutes + ":" + String(secondesRestantes).padStart(2, "0");
}

function initialiserVideos() {
    const videos = lessonContent.querySelectorAll("iframe.video-cours");

    videos.forEach(function (iframe, index) {
        const idVideo = iframe.id || "video-" + positionActuelle + "-" + index;
        iframe.id = idVideo;

        const conteneur = document.createElement("div");
        conteneur.className = "video-progression";

        const barre = document.createElement("div");
        barre.className = "video-progression-barre";

        const remplissage = document.createElement("div");
        remplissage.className = "video-progression-remplissage";
        barre.appendChild(remplissage);

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

        const lecteur = new YT.Player(idVideo, {
            events: {
                onReady: function (evenement) {
                    const duree = evenement.target.getDuration();
                    dureeVideo.textContent = formaterTemps(duree);

                    const position = recupererPositionVideo(idVideo);
                    if (position > 0 && position < duree) {
                        evenement.target.seekTo(position, true);
                    }
                },
                onStateChange: function (evenement) {
                    if (evenement.data === YT.PlayerState.ENDED) {
                        sauvegarderPositionVideo(idVideo, evenement.target.getDuration());
                        const element = contenuCours[positionActuelle];
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
            duree: dureeVideo,
            dernierEnvoi: 0
        });
    });

    demarrerActualisationVideo();
}

function demarrerActualisationVideo() {
    if (intervalVideo) clearInterval(intervalVideo);

    intervalVideo = setInterval(function () {
        const maintenant = Date.now();
        lecteursVideo.forEach(function (video) {
            try {
                const position = video.lecteur.getCurrentTime();
                const duree = video.lecteur.getDuration();

                if (duree > 0) {
                    const pourcentage = (position / duree) * 100;
                    video.remplissage.style.width = pourcentage + "%";
                    video.tempsActuel.textContent = formaterTemps(position);
                    video.duree.textContent = formaterTemps(duree);

                    // Enregistre en BDD toutes les 5 secondes pendant la lecture
                    if (
                        video.lecteur.getPlayerState() === YT.PlayerState.PLAYING &&
                        maintenant - video.dernierEnvoi >= 5000
                    ) {
                        video.dernierEnvoi = maintenant;
                        sauvegarderPositionVideo(video.id, position);
                    }
                }
            } catch (erreur) {}
        });
    }, 1000);
}

function arreterVideos() {
    if (intervalVideo) {
        clearInterval(intervalVideo);
        intervalVideo = null;
    }

    lecteursVideo.forEach(function (video) {
        try {
            const position = video.lecteur.getCurrentTime();
            sauvegarderPositionVideo(video.id, position);
            video.lecteur.destroy();
        } catch (erreur) {}
    });

    lecteursVideo = [];
}

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

function elementEstTermine(id) {
    return progression.terminees.includes(id);
}

function terminerElement(id) {
    if (!elementEstTermine(id)) {
        progression.terminees.push(id);
        apiPost("api/progression.php", {
            action: "terminer",
            cours: identifiantCours,
            element: id
        }).catch(function () {});
    }
}

function calculerPourcentage(elements) {
    if (elements.length === 0) return 0;
    let nombreTermines = 0;
    elements.forEach(function (element) {
        if (elementEstTermine(element.id)) nombreTermines++;
    });
    return Math.round((nombreTermines / elements.length) * 100);
}

function actualiserProgressionCours() {
    const pourcentage = calculerPourcentage(contenuCours);
    courseProgress.value = pourcentage;
    courseProgressText.textContent = pourcentage + " % terminé";
}

function afficherModules() {
    moduleList.innerHTML = "";
    cours.modules.forEach(function (module) {
        const blocModule = document.createElement("div");
        blocModule.className = "module-item";
        const titre = document.createElement("h3");
        titre.className = "module-title";
        titre.textContent = module.titre;
        blocModule.appendChild(titre);

        const elementsModule = [];
        module.parties.forEach(function (partie) {
            elementsModule.push({ id: "partie-" + partie.id });
        });
        elementsModule.push({ id: "quiz-" + module.id });

        const pourcentageModule = calculerPourcentage(elementsModule);
        const ligneProgression = document.createElement("div");
        ligneProgression.className = "module-progress-row";

        const barreProgression = document.createElement("progress");
        barreProgression.className = "module-progress";
        barreProgression.max = 100;
        barreProgression.value = pourcentageModule;
        barreProgression.setAttribute("aria-label", "Progression du module");

        const textePourcentage = document.createElement("span");
        textePourcentage.className = "module-progress-percent";
        textePourcentage.textContent = pourcentageModule + " %";

        ligneProgression.appendChild(barreProgression);
        ligneProgression.appendChild(textePourcentage);
        blocModule.appendChild(ligneProgression);

        module.parties.forEach(function (partie) {
            const idElement = "partie-" + partie.id;
            const bouton = document.createElement("button");
            bouton.type = "button";
            bouton.className = "module-button";

            const terminee = elementEstTermine(idElement);
            if (terminee) bouton.classList.add("completed");

            const indexElement = contenuCours.findIndex(function (element) {
                return element.id === idElement;
            });
            if (indexElement === positionActuelle) bouton.classList.add("active");

            const icone = document.createElement("i");
            icone.className = terminee
                ? "fa-solid fa-circle-check status-icon"
                : "fa-regular fa-circle status-icon";
            icone.setAttribute("aria-hidden", "true");

            const texte = document.createElement("span");
            texte.textContent = partie.titre;

            bouton.appendChild(icone);
            bouton.appendChild(texte);
            bouton.addEventListener("click", function () {
                changerDeContenu(indexElement);
            });
            blocModule.appendChild(bouton);
        });

        const boutonQuiz = document.createElement("button");
        boutonQuiz.type = "button";
        boutonQuiz.className = "module-button quiz-link";
        const idQuiz = "quiz-" + module.id;
        const quizTermine = elementEstTermine(idQuiz);
        if (quizTermine) boutonQuiz.classList.add("completed");

        const indexQuiz = contenuCours.findIndex(function (element) {
            return element.id === idQuiz;
        });
        if (indexQuiz === positionActuelle) boutonQuiz.classList.add("active");

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
    if (evaluationTerminee) boutonFinal.classList.add("completed");

    const indexFinal = contenuCours.findIndex(function (element) {
        return element.id === "quiz-final";
    });
    if (indexFinal === positionActuelle) boutonFinal.classList.add("active");

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
            const contientVideo = lessonContent.querySelector("iframe.video-cours");
            if (!contientVideo) {
                terminerElement(contenuPrecedent.id);
            }
        }
        arreterVideos();
    }

    positionActuelle = nouvellePosition;
    sauvegarderPosition();
    afficherContenu();
    afficherModules();
    actualiserProgressionCours();
}

function afficherContenu() {
    const element = contenuCours[positionActuelle];
    if (!element) return;

    lessonContent.innerHTML = "";
    prevBtn.disabled = positionActuelle === 0;
    nextBtn.disabled = positionActuelle === contenuCours.length - 1;

    if (element.type === "partie") {
        lessonInfo.textContent = element.module.titre + " • Leçon";
        lessonTitle.textContent = element.titre;
        lessonContent.innerHTML = element.partie.contenu;
        chargerAPIYouTube();
    } else if (element.type === "quiz") {
        lessonInfo.textContent = element.module.titre + " • Quiz";
        lessonTitle.textContent = element.titre;
        afficherQuiz(element);
    } else {
        lessonInfo.textContent = "Évaluation finale";
        lessonTitle.textContent = element.titre;
        afficherQuiz(element);
    }
}

function afficherQuiz(element) {
    const quizContainer = document.createElement("div");
    quizContainer.className = "quiz-container";

    const introduction = document.createElement("p");
    introduction.textContent =
        "Réponds aux questions, puis clique sur « Vérifier mes réponses ». " +
        "Tu dois répondre correctement à toutes les questions pour valider ce quiz.";
    quizContainer.appendChild(introduction);

    const formulaire = document.createElement("form");
    element.questions.forEach(function (question, indexQuestion) {
        const blocQuestion = document.createElement("div");
        blocQuestion.className = "quiz-question";

        const titreQuestion = document.createElement("h3");
        titreQuestion.textContent = (indexQuestion + 1) + ". " + question.question;
        blocQuestion.appendChild(titreQuestion);

        question.options.forEach(function (option, indexOption) {
            const label = document.createElement("label");
            label.className = "quiz-option";

            const radio = document.createElement("input");
            radio.type = "radio";
            radio.name = "question-" + indexQuestion;
            radio.value = indexOption;
            radio.required = true;

            const texteOption = document.createElement("span");
            texteOption.textContent = option;

            label.appendChild(radio);
            label.appendChild(texteOption);
            blocQuestion.appendChild(label);
        });

        formulaire.appendChild(blocQuestion);
    });

    const boutonVerifier = document.createElement("button");
    boutonVerifier.type = "submit";
    boutonVerifier.className = "quiz-submit";
    boutonVerifier.textContent = "Vérifier mes réponses";
    formulaire.appendChild(boutonVerifier);

    const resultat = document.createElement("div");
    resultat.className = "quiz-result";
    resultat.setAttribute("aria-live", "polite");

    formulaire.addEventListener("submit", function (evenement) {
        evenement.preventDefault();
        let bonnesReponses = 0;

        element.questions.forEach(function (question, indexQuestion) {
            const reponseChoisie = formulaire.querySelector(
                'input[name="question-' + indexQuestion + '"]:checked'
            );
            if (reponseChoisie && Number(reponseChoisie.value) === question.bonneReponse) {
                bonnesReponses++;
            }
        });

        const totalQuestions = element.questions.length;
        resultat.classList.remove("success", "error");

        if (bonnesReponses === totalQuestions) {
            terminerElement(element.id);
            resultat.classList.add("success");
            resultat.textContent =
                "Bravo ! " + bonnesReponses + "/" + totalQuestions +
                " bonnes réponses. Quiz réussi !";
            afficherModules();
            actualiserProgressionCours();
            boutonVerifier.textContent = "Quiz validé";
            boutonVerifier.disabled = true;
        } else {
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

prevBtn.addEventListener("click", function () {
    if (positionActuelle > 0) changerDeContenu(positionActuelle - 1);
});

nextBtn.addEventListener("click", function () {
    if (positionActuelle < contenuCours.length - 1) changerDeContenu(positionActuelle + 1);
});

const themeIcon = themeBtn.querySelector("i");
const themeSauvegarde = localStorage.getItem("learnayop_theme");
if (themeSauvegarde === "sombre") {
    document.body.classList.add("theme-dark");
    themeIcon.classList.replace("fa-moon", "fa-sun");
    themeBtn.setAttribute("aria-label", "Activer le thème clair");
} else {
    document.body.classList.remove("theme-dark");
    themeIcon.classList.replace("fa-sun", "fa-moon");
    themeBtn.setAttribute("aria-label", "Activer le thème sombre");
}

themeBtn.addEventListener("click", function () {
    document.body.classList.toggle("theme-dark");
    const themeSombre = document.body.classList.contains("theme-dark");
    if (themeSombre) {
        themeIcon.classList.replace("fa-moon", "fa-sun");
        themeBtn.setAttribute("aria-label", "Activer le thème clair");
        localStorage.setItem("learnayop_theme", "sombre");
    } else {
        themeIcon.classList.replace("fa-sun", "fa-moon");
        themeBtn.setAttribute("aria-label", "Activer le thème sombre");
        localStorage.setItem("learnayop_theme", "clair");
    }
});

const outlineIcon = outlineBtn.querySelector("i");
outlineBtn.addEventListener("click", function () {
    layout.classList.toggle("sidebar-hidden");
    const modulesMasques = layout.classList.contains("sidebar-hidden");
    outlineBtn.setAttribute("aria-pressed", modulesMasques);
    outlineBtn.setAttribute(
        "aria-label",
        modulesMasques ? "Afficher les modules" : "Masquer les modules"
    );
    outlineIcon.classList.toggle("fa-table-columns");
    outlineIcon.classList.toggle("fa-book-open");
});

const fullscreenIcon = fullscreenBtn.querySelector("i");
fullscreenBtn.addEventListener("click", async function () {
    try {
        if (!document.fullscreenElement) {
            await document.documentElement.requestFullscreen();
        } else {
            await document.exitFullscreen();
        }
    } catch (erreur) {}
});

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

// Démarrage : charger la progression depuis MySQL avant d'afficher le cours
if (!cours) {
    lessonInfo.textContent = "";
    lessonTitle.textContent = "Cours introuvable";
    lessonContent.innerHTML =
        '<p>Le cours demandé n’existe pas ou son identifiant est incorrect.</p>' +
        '<p><a href="courses.php">Retour au catalogue</a></p>';
    sidebar.style.display = "none";
    prevBtn.disabled = true;
    nextBtn.disabled = true;
} else if (!Array.isArray(cours.modules) || cours.modules.length === 0) {
    lessonTitle.textContent = "Ce cours ne contient pas encore de modules.";
    prevBtn.disabled = true;
    nextBtn.disabled = true;
} else {
    preparerCours();

    apiGet("api/progression.php")
        .then(function (rep) {
            const etatCours = rep && rep.cours && rep.cours[identifiantCours];
            if (etatCours) {
                if (Array.isArray(etatCours.terminees)) {
                    progression = { terminees: etatCours.terminees };
                }
                if (etatCours.videos && typeof etatCours.videos === "object") {
                    positionsVideos = etatCours.videos;
                }
                const pos = Number(etatCours.position);
                if (Number.isInteger(pos) && pos >= 0 && pos < contenuCours.length) {
                    positionActuelle = pos;
                }
            }
        })
        .catch(function () {})
        .finally(function () {
            afficherContenu();
            afficherModules();
            actualiserProgressionCours();
        });
}