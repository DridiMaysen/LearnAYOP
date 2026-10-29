
const donneesCours = {
    "files-attente": {
        titre: "Théorie des files d'attente",
        matiere: "Probabilités et recherche opérationnelle",
        niveau: "Intermédiaire",

        modules: [
            {
                id: "introduction",
                titre: "Module 1 : Introduction aux files d'attente",

                parties: [
                    {
                        id: "definition-file",
                        titre: "1.1 - Définition et exemples",
                        contenu: `
                            <h2>1. Qu'est-ce qu'une file d'attente ?</h2>

                            <p>
                                Une file d'attente apparaît lorsque des clients
                                demandent un service, mais ne peuvent pas tous
                                être servis immédiatement.
                            </p>

                            <p>
                                Les clients peuvent être des personnes, des
                                ordinateurs, des paquets de données ou des
                                tâches envoyées à un processeur.
                            </p>

                            <h3>Exemples concrets</h3>
                            <ul>
                                <li>Les clients qui attendent à une banque.</li>
                                <li>Les voitures devant un péage.</li>
                                <li>Les requêtes qui attendent un serveur web.</li>
                                <li>Les tâches qui attendent le processeur.</li>
                            </ul>

                            <h3>Illustration d'une file d'attente</h3>

                            <svg viewBox="0 0 620 190"
                                 role="img"
                                 aria-label="Des clients attendent devant un serveur"
                                 style="width:100%;max-width:620px;height:auto">

                                <rect x="15" y="25" width="420" height="125"
                                      rx="12" fill="#e0ebe4"/>

                                <circle cx="65" cy="75" r="18" fill="#347a54"/>
                                <path d="M65 94 L65 124 M49 108 L81 108"
                                      stroke="#347a54" stroke-width="7"
                                      stroke-linecap="round"/>

                                <circle cx="145" cy="75" r="18" fill="#6b9784"/>
                                <path d="M145 94 L145 124 M129 108 L161 108"
                                      stroke="#6b9784" stroke-width="7"
                                      stroke-linecap="round"/>

                                <circle cx="225" cy="75" r="18" fill="#94687b"/>
                                <path d="M225 94 L225 124 M209 108 L241 108"
                                      stroke="#94687b" stroke-width="7"
                                      stroke-linecap="round"/>

                                <path d="M280 95 L330 95"
                                      stroke="#263f35" stroke-width="3"/>
                                <path d="M320 85 L332 95 L320 105"
                                      fill="none" stroke="#263f35"
                                      stroke-width="3"/>

                                <rect x="355" y="45" width="60" height="70"
                                      rx="5" fill="#263f35"/>
                                <rect x="365" y="55" width="40" height="20"
                                      rx="3" fill="#a3c4b6"/>
                                <circle cx="385" cy="92" r="8" fill="#ffffff"/>

                                <text x="220" y="170" text-anchor="middle"
                                      font-size="14" fill="currentColor">
                                    Clients en attente
                                </text>

                                <text x="485" y="75" text-anchor="middle"
                                      font-size="14" fill="currentColor">
                                    Serveur
                                </text>
                                <text x="485" y="96" text-anchor="middle"
                                      font-size="12" fill="currentColor">
                                    Service
                                </text>
                            </svg>

                            <h3>Objectif de la théorie</h3>
                            <p>
                                La théorie des files d'attente permet de prévoir
                                le nombre moyen de clients, le temps moyen
                                d'attente et la capacité nécessaire pour
                                assurer un service satisfaisant.
                            </p>
                        `
                    },

                    {
                        id: "composants-file",
                        titre: "1.2 - Les composants d'un système",
                        contenu: `
                            <h2>2. Les éléments d'un système d'attente</h2>

                            <ol>
                                <li>
                                    <strong>La source :</strong>
                                    l'ensemble des clients susceptibles de
                                    demander un service.
                                </li>
                                <li>
                                    <strong>Le processus d'arrivée :</strong>
                                    la manière dont les clients arrivent.
                                </li>
                                <li>
                                    <strong>La file :</strong>
                                    l'endroit où les clients attendent.
                                </li>
                                <li>
                                    <strong>Le serveur :</strong>
                                    la personne ou la machine qui réalise
                                    le service.
                                </li>
                                <li>
                                    <strong>La discipline :</strong>
                                    la règle qui détermine quel client sera
                                    servi en premier.
                                </li>
                            </ol>

                            <h3>Les principales disciplines</h3>

                            <ul>
                                <li>
                                    FIFO : le premier arrivé est le premier servi.
                                </li>
                                <li>
                                    LIFO : le dernier arrivé est le premier servi.
                                </li>
                                <li>
                                    Priorité : certains clients sont servis
                                    avant les autres.
                                </li>
                            </ul>

                            <h3>Exemple</h3>

                            <p>
                                Dans une agence bancaire, les clients arrivent,
                                attendent leur tour, puis sont servis par un
                                guichetier. Si les clients sont servis dans
                                l'ordre de leur arrivée, la discipline est FIFO.
                            </p>

                            <h3>Capacité du système</h3>

                            <p>
                                Un système peut avoir une capacité infinie
                                théorique ou une capacité limitée. Par exemple,
                                un parking peut refuser de nouvelles voitures
                                lorsqu'il est complet.
                            </p>
                        `
                    }
                ],

                quiz: [
                    {
                        question: "Quel est l'objectif principal de la théorie des files d'attente ?",
                        options: [
                            "Créer des pages web",
                            "Étudier les attentes et les performances d'un système",
                            "Remplacer les probabilités"
                        ],
                        bonneReponse: 1
                    },
                    {
                        question: "Que signifie FIFO ?",
                        options: [
                            "Le premier arrivé est le premier servi",
                            "Le dernier arrivé est le premier servi",
                            "Le client le plus rapide est toujours servi"
                        ],
                        bonneReponse: 0
                    }
                ]
            },

            {
                id: "arrivees-services",
                titre: "Module 2 : Arrivées et services",

                parties: [
                    {
                        id: "taux-arrivee-service",
                        titre: "2.1 - Taux d'arrivée et taux de service",
                        contenu: `
                            <h2>1. Le taux d'arrivée : λ</h2>

                            <p>
                                Le taux d'arrivée, noté λ (lambda), représente
                                le nombre moyen de clients qui arrivent pendant
                                une unité de temps.
                            </p>

                            <p>
                                Par exemple, si 12 clients arrivent en moyenne
                                chaque heure :
                            </p>

                            <p><strong>λ = 12 clients par heure</strong></p>

                            <h2>2. Le taux de service : μ</h2>

                            <p>
                                Le taux de service, noté μ (mu), représente
                                le nombre moyen de clients qu'un serveur peut
                                traiter par unité de temps.
                            </p>

                            <p>
                                Si un guichet traite en moyenne 15 clients
                                par heure, alors μ = 15 clients par heure.
                            </p>

                            <h3>Calcul de la durée moyenne de service</h3>

                            <p>
                                Si la durée moyenne d'un service est de
                                4 minutes, alors :
                            </p>

                            <p>
                                μ = 60 / 4 = 15 clients par heure.
                            </p>

                            <h3>Exemple corrigé</h3>

                            <p>
                                Un guichet reçoit 10 clients par heure et
                                peut en servir 12 par heure.
                            </p>

                            <ul>
                                <li>λ = 10 clients/heure.</li>
                                <li>μ = 12 clients/heure.</li>
                                <li>Le serveur peut traiter davantage de
                                    clients que le nombre moyen qui arrive.</li>
                            </ul>

                            <p>
                                Attention : cette comparaison seule ne suffit
                                pas à déterminer tous les temps d'attente.
                                Il faut aussi préciser le modèle utilisé.
                            </p>
                        `
                    },

                    {
                        id: "poisson-exponentielle",
                        titre: "2.2 - Lois de Poisson et exponentielle",
                        contenu: `
                            <h2>1. La loi de Poisson</h2>

                            <p>
                                La loi de Poisson peut modéliser le nombre
                                d'arrivées pendant une durée donnée, lorsque
                                les hypothèses du processus de Poisson sont
                                raisonnables.
                            </p>

                            <p>
                                Si λ est le taux moyen d'arrivée et t la durée,
                                le nombre moyen d'arrivées pendant cette durée
                                est λt.
                            </p>

                            <p>
                                La probabilité d'observer exactement k arrivées
                                est :
                            </p>

                            <p>
                                <strong>
                                    P(N(t) = k) = e<sup>-λt</sup>(λt)<sup>k</sup>/k!
                                </strong>
                            </p>

                            <p>
                                Ici, k est un entier positif ou nul et
                                k! désigne la factorielle de k.
                            </p>

                            <h3>Exemple</h3>

                            <p>
                                Un service reçoit en moyenne 2 appels par minute.
                                Sur une minute, le nombre moyen d'appels est 2.
                                La probabilité de recevoir exactement zéro appel
                                est e<sup>-2</sup>, soit environ 0,135.
                            </p>

                            <h2>2. La loi exponentielle</h2>

                            <p>
                                Dans un processus de Poisson de taux λ,
                                le temps entre deux arrivées successives
                                suit une loi exponentielle de paramètre λ.
                            </p>

                            <p>
                                Sa durée moyenne est 1/λ, lorsque λ est exprimé
                                dans l'unité de temps correspondante.
                            </p>

                            <p>
                                Par exemple, pour λ = 2 appels par minute,
                                le temps moyen entre deux appels est
                                1/2 minute, soit 30 secondes.
                            </p>

                            <h3>Vidéo complémentaire</h3>

                            <p>
                                Cette vidéo présente les bases des processus
                                de Poisson et des files d'attente.
                            </p>

                            <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden">
                                <iframe
                                class="video-cours"
                                    src="https://www.youtube.com/embed/FwmQ-AC29_E?enablejsapi=1"
                                    title="Introduction à la théorie des files d'attente"
                                    loading="lazy"
                                    allowfullscreen
                                    style="position:absolute;top:0;left:0;width:100%;height:100%;border:0">
                                </iframe>
                            </div>
                        `
                    }
                ],

                quiz: [
                    {
                        question: "Que représente λ ?",
                        options: [
                            "Le taux moyen d'arrivée",
                            "Le nombre de serveurs obligatoirement",
                            "La durée totale du cours"
                        ],
                        bonneReponse: 0
                    },
                    {
                        question: "Si un serveur traite 10 clients par heure, quelle est sa durée moyenne de service ?",
                        options: [
                            "10 heures",
                            "6 minutes",
                            "60 minutes"
                        ],
                        bonneReponse: 1
                    }
                ]
            },

            {
                id: "chaines-markov",
                titre: "Module 3 : Les chaînes de Markov",

                parties: [
                    {
                        id: "notion-markov",
                        titre: "3.1 - États et propriété de Markov",
                        contenu: `
                            <h2>1. Qu'est-ce qu'une chaîne de Markov ?</h2>

                            <p>
                                Une chaîne de Markov est un modèle probabiliste
                                qui décrit un système pouvant passer d'un état
                                à un autre.
                            </p>

                            <p>
                                Sa propriété essentielle est que, pour prédire
                                l'état suivant, on utilise l'état actuel plutôt
                                que toute l'histoire passée du système.
                            </p>

                            <p>
                                Formellement, dans une chaîne de Markov à temps
                                discret :
                            </p>

                            <p>
                                P(X<sub>n+1</sub> = j | X<sub>n</sub> = i,
                                X<sub>n-1</sub>, ..., X<sub>0</sub>)
                                = P(X<sub>n+1</sub> = j | X<sub>n</sub> = i).
                            </p>

                            <h3>Exemple : un système informatique</h3>

                            <p>
                                On observe un serveur à chaque minute. Il peut
                                être dans deux états :
                            </p>

                            <ul>
                                <li>État 0 : serveur libre.</li>
                                <li>État 1 : serveur occupé.</li>
                            </ul>

                            <p>
                                Les probabilités de passer d'un état à un autre
                                permettent de modéliser l'évolution du serveur.
                            </p>

                            <svg viewBox="0 0 500 170"
                                 role="img"
                                 aria-label="Diagramme à deux états d'une chaîne de Markov"
                                 style="width:100%;max-width:500px;height:auto">

                                <circle cx="120" cy="75" r="45"
                                        fill="#dce9e0" stroke="#347a54"
                                        stroke-width="3"/>
                                <circle cx="380" cy="75" r="45"
                                        fill="#e8dce5" stroke="#94687b"
                                        stroke-width="3"/>

                                <text x="120" y="70" text-anchor="middle"
                                      font-size="15" fill="#263b32">État 0</text>
                                <text x="120" y="90" text-anchor="middle"
                                      font-size="12" fill="#263b32">Libre</text>

                                <text x="380" y="70" text-anchor="middle"
                                      font-size="15" fill="#263b32">État 1</text>
                                <text x="380" y="90" text-anchor="middle"
                                      font-size="12" fill="#263b32">Occupé</text>

                                <path d="M165 60 Q250 5 335 60"
                                      fill="none" stroke="#263f35"
                                      stroke-width="2"/>
                                <path d="M325 48 L337 60 L322 64"
                                      fill="none" stroke="#263f35"
                                      stroke-width="2"/>

                                <path d="M335 95 Q250 145 165 95"
                                      fill="none" stroke="#263f35"
                                      stroke-width="2"/>
                                <path d="M178 91 L163 95 L174 106"
                                      fill="none" stroke="#263f35"
                                      stroke-width="2"/>

                                <text x="250" y="30" text-anchor="middle"
                                      font-size="13" fill="currentColor">p</text>
                                <text x="250" y="140" text-anchor="middle"
                                      font-size="13" fill="currentColor">q</text>
                            </svg>

                            <p>
                                Les lettres p et q représentent des probabilités
                                de transition. Dans un modèle complet, il faut
                                aussi préciser les probabilités de rester dans
                                chaque état.
                            </p>
                        `
                    },

                    {
                        id: "matrice-transition",
                        titre: "3.2 - Matrice de transition",
                        contenu: `
                            <h2>2. La matrice de transition</h2>

                            <p>
                                Une matrice de transition rassemble les
                                probabilités de passage d'un état vers un autre.
                            </p>

                            <p>Considérons deux états : libre et occupé.</p>

                            <p>
                                Supposons que :
                            </p>

                            <ul>
                                <li>Si le serveur est libre, il reste libre
                                    avec une probabilité de 0,7.</li>
                                <li>S'il est libre, il devient occupé avec
                                    une probabilité de 0,3.</li>
                                <li>S'il est occupé, il reste occupé avec
                                    une probabilité de 0,6.</li>
                                <li>S'il est occupé, il redevient libre avec
                                    une probabilité de 0,4.</li>
                            </ul>

                            <p>La matrice est donc :</p>

                            <p>
                                <strong>
                                    P = [ 0,7 &nbsp; 0,3 ]<br>
                                    &nbsp;&nbsp;&nbsp;&nbsp;[ 0,4 &nbsp; 0,6 ]
                                </strong>
                            </p>

                            <p>
                                Chaque ligne représente l'état actuel et chaque
                                colonne l'état suivant. La somme des probabilités
                                d'une ligne vaut 1.
                            </p>

                            <h3>Calcul après une étape</h3>

                            <p>
                                Si le système est initialement libre avec
                                une probabilité de 1, sa distribution initiale
                                est π<sub>0</sub> = [1, 0].
                            </p>

                            <p>
                                Après une étape :
                                π<sub>1</sub> = π<sub>0</sub>P = [0,7 ; 0,3].
                            </p>

                            <p>
                                Le serveur a donc une probabilité de 0,7
                                d'être libre et de 0,3 d'être occupé après
                                une étape.
                            </p>

                            <h3>Vidéo complémentaire</h3>

                            <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden">
                                <iframe
                                    class="video-cours"
                                    src="https://www.youtube.com/embed/1GKtfgwf3ig?enablejsapi=1"
                                    title="Chaînes de Markov et matrices de transition"
                                    loading="lazy"
                                    allowfullscreen
                                    style="position:absolute;top:0;left:0;width:100%;height:100%;border:0">
                                </iframe>
                            </div>
                        `
                    },

                    {
                        id: "markov-stationnaire",
                        titre: "3.3 - Distribution stationnaire",
                        contenu: `
                            <h2>3. La distribution stationnaire</h2>

                            <p>
                                Une distribution stationnaire est une
                                distribution de probabilités qui reste
                                inchangée après une transition.
                            </p>

                            <p>
                                Elle vérifie l'équation :
                                <strong>πP = π</strong>,
                                avec une somme des probabilités égale à 1.
                            </p>

                            <h3>Exemple avec deux états</h3>

                            <p>
                                Pour la matrice :
                                P = [0,7  0,3 ; 0,4  0,6],
                                notons π = [a, b].
                            </p>

                            <p>
                                Les équations stationnaires donnent :
                                a = 0,7a + 0,4b et a + b = 1.
                            </p>

                            <p>
                                On obtient a = 4/7 et b = 3/7.
                                La distribution stationnaire est donc
                                π = [4/7, 3/7].
                            </p>

                            <p>
                                Dans ce modèle, à long terme, la probabilité
                                d'être libre est 4/7 et celle d'être occupé
                                est 3/7.
                            </p>

                            <p>
                                Attention : l'existence et l'unicité d'une
                                distribution stationnaire dépendent des
                                propriétés de la chaîne.
                            </p>
                        `
                    }
                ],

                quiz: [
                    {
                        question: "Quelle est la propriété essentielle d'une chaîne de Markov ?",
                        options: [
                            "Le prochain état dépend nécessairement de tout le passé",
                            "Le prochain état dépend de l'état actuel selon le modèle",
                            "Toutes les transitions ont la même probabilité"
                        ],
                        bonneReponse: 1
                    },
                    {
                        question: "Que représente une matrice de transition ?",
                        options: [
                            "Les probabilités de passage entre les états",
                            "Les durées de toutes les leçons",
                            "Le nombre de clients servis par heure uniquement"
                        ],
                        bonneReponse: 0
                    },
                    {
                        question: "Quelle équation définit une distribution stationnaire π ?",
                        options: [
                            "π + P = 0",
                            "πP = π",
                            "πP = 0"
                        ],
                        bonneReponse: 1
                    }
                ]
            },

            {
                id: "modele-mm1",
                titre: "Module 4 : Le modèle M/M/1",

                parties: [
                    {
                        id: "notation-mm1",
                        titre: "4.1 - Comprendre le modèle M/M/1",
                        contenu: `
                            <h2>1. Que signifie M/M/1 ?</h2>

                            <p>
                                Le modèle M/M/1 est un modèle classique de
                                théorie des files d'attente.
                            </p>

                            <ul>
                                <li>Premier M : arrivées selon un processus
                                    de Poisson.</li>
                                <li>Deuxième M : durées de service
                                    exponentielles.</li>
                                <li>1 : un seul serveur.</li>
                            </ul>

                            <p>
                                Dans le modèle standard, la file a une capacité
                                infinie et les clients sont servis selon la
                                discipline FIFO.
                            </p>

                            <h3>Condition de stabilité</h3>

                            <p>
                                Le système est stable si le taux d'arrivée
                                est inférieur au taux de service :
                            </p>

                            <p><strong>λ &lt; μ</strong></p>

                            <p>
                                On définit le taux d'occupation :
                                <strong>ρ = λ/μ</strong>.
                            </p>

                            <p>
                                La condition de stabilité est équivalente à
                                ρ &lt; 1.
                            </p>

                            <h3>Exemple</h3>

                            <p>
                                Si λ = 6 clients par heure et μ = 10 clients
                                par heure :
                            </p>

                            <p>ρ = 6/10 = 0,6, soit 60 %.</p>

                            <p>
                                Le serveur est occupé en moyenne 60 % du temps
                                dans le régime stationnaire du modèle.
                            </p>
                        `
                    },

                    {
                        id: "formules-mm1",
                        titre: "4.2 - Les formules et un exemple corrigé",
                        contenu: `
                            <h2>2. Les formules du modèle M/M/1</h2>

                            <p>On suppose toujours que λ &lt; μ.</p>

                            <ul>
                                <li>
                                    Nombre moyen de clients dans le système :
                                    <strong>L = λ / (μ - λ)</strong>.
                                </li>
                                <li>
                                    Nombre moyen de clients dans la file :
                                    <strong>Lq = λ² / [μ(μ - λ)]</strong>.
                                </li>
                                <li>
                                    Temps moyen dans le système :
                                    <strong>W = 1 / (μ - λ)</strong>.
                                </li>
                                <li>
                                    Temps moyen d'attente dans la file :
                                    <strong>Wq = λ / [μ(μ - λ)]</strong>.
                                </li>
                            </ul>

                            <p>
                                Les unités de temps de W et Wq dépendent des
                                unités utilisées pour λ et μ.
                            </p>

                            <h3>Exemple corrigé</h3>

                            <p>
                                Un guichet reçoit λ = 6 clients par heure
                                et sert μ = 10 clients par heure.
                            </p>

                            <p><strong>Étape 1 : vérifier la stabilité.</strong></p>
                            <p>6 &lt; 10 : le système est stable.</p>

                            <p><strong>Étape 2 : calculer L.</strong></p>
                            <p>L = 6 / (10 - 6) = 1,5 client.</p>

                            <p><strong>Étape 3 : calculer Lq.</strong></p>
                            <p>Lq = 36 / (10 × 4) = 0,9 client.</p>

                            <p><strong>Étape 4 : calculer W.</strong></p>
                            <p>W = 1 / 4 heure = 15 minutes.</p>

                            <p><strong>Étape 5 : calculer Wq.</strong></p>
                            <p>
                                Wq = 6 / 40 heure = 0,15 heure,
                                soit 9 minutes.
                            </p>

                            <h3>Interprétation</h3>

                            <p>
                                En moyenne, 1,5 client se trouve dans le système,
                                dont 0,9 en attente. Le temps moyen total passé
                                dans le système est de 15 minutes, dont
                                9 minutes d'attente.
                            </p>

                            <p>
                                Ces résultats sont des moyennes théoriques,
                                pas des garanties pour chaque client.
                            </p>
                        `
                    }
                ],

                quiz: [
                    {
                        question: "Que signifie le chiffre 1 dans M/M/1 ?",
                        options: [
                            "Un seul serveur",
                            "Une seule arrivée par heure",
                            "Une seule minute d'attente"
                        ],
                        bonneReponse: 0
                    },
                    {
                        question: "Quelle est la condition de stabilité du modèle M/M/1 ?",
                        options: [
                            "λ = μ",
                            "λ > μ",
                            "λ < μ"
                        ],
                        bonneReponse: 2
                    },
                    {
                        question: "Si λ = 6 et μ = 10 clients par heure, quel est L ?",
                        options: [
                            "0,6 client",
                            "1,5 client",
                            "4 clients"
                        ],
                        bonneReponse: 1
                    }
                ]
            },

            {
                id: "applications",
                titre: "Module 5 : Autres modèles et applications",

                parties: [
                    {
                        id: "mmc",
                        titre: "5.1 - Le modèle M/M/c",
                        contenu: `
                            <h2>1. Plusieurs serveurs : M/M/c</h2>

                            <p>
                                Le modèle M/M/c reprend les hypothèses du
                                modèle M/M/1, mais utilise c serveurs identiques
                                travaillant en parallèle.
                            </p>

                            <p>
                                On peut par exemple modéliser une agence avec
                                trois guichets ou un centre d'appels avec
                                plusieurs agents.
                            </p>

                            <h3>Pourquoi utiliser plusieurs serveurs ?</h3>

                            <ul>
                                <li>Réduire les temps d'attente.</li>
                                <li>Traiter davantage de clients.</li>
                                <li>Comparer le coût et la qualité du service.</li>
                            </ul>

                            <p>
                                Dans le modèle M/M/c standard, une condition
                                nécessaire de stabilité est :
                                <strong>λ &lt; cμ</strong>.
                            </p>

                            <p>
                                Ici, μ est le taux de service d'un serveur
                                et cμ est le taux total théorique lorsque
                                tous les serveurs sont occupés.
                            </p>

                            <h3>Exemple</h3>

                            <p>
                                Trois serveurs peuvent traiter chacun
                                8 clients par heure. La capacité totale
                                théorique est de 3 × 8 = 24 clients par heure.
                                Le modèle standard est stable si le taux
                                d'arrivée est inférieur à 24.
                            </p>
                        `
                    },

                    {
                        id: "loi-little",
                        titre: "5.2 - Loi de Little et étude de cas",
                        contenu: `
                            <h2>2. La loi de Little</h2>

                            <p>
                                La loi de Little établit un lien entre le
                                nombre moyen de clients, leur temps moyen
                                dans le système et le taux moyen d'arrivée,
                                sous les conditions appropriées de stabilité
                                et de mesure.
                            </p>

                            <p><strong>L = λW</strong></p>

                            <p>
                                Pour la file seule, on utilise :
                                <strong>Lq = λWq</strong>.
                            </p>

                            <h3>Exemple pratique</h3>

                            <p>
                                Un service reçoit 12 clients par heure.
                                Le temps moyen passé dans le système est
                                de 10 minutes, soit 1/6 heure.
                            </p>

                            <p>
                                L = 12 × 1/6 = 2 clients.
                            </p>

                            <p>
                                Le nombre moyen de clients présents dans
                                le système est donc 2.
                            </p>

                            <h3>Comment utiliser cette loi ?</h3>

                            <ol>
                                <li>Identifier le taux d'arrivée λ.</li>
                                <li>Exprimer le temps moyen W dans la même
                                    unité de temps.</li>
                                <li>Calculer L = λW.</li>
                                <li>Interpréter le résultat comme une moyenne.</li>
                            </ol>

                            <h3>Conclusion du cours</h3>

                            <p>
                                Les processus d'arrivée décrivent le flux
                                de clients, les chaînes de Markov décrivent
                                l'évolution probabiliste des états et les
                                modèles de files d'attente permettent d'étudier
                                les performances d'un système.
                            </p>

                            <p>
                                Le choix du modèle dépend des hypothèses :
                                nombre de serveurs, capacité, loi des arrivées
                                et loi des durées de service.
                            </p>
                        `
                    }
                ],

                quiz: [
                    {
                        question: "Que représente c dans le modèle M/M/c ?",
                        options: [
                            "Le nombre de serveurs",
                            "Le temps moyen d'attente",
                            "Le nombre moyen de clients dans la file"
                        ],
                        bonneReponse: 0
                    },
                    {
                        question: "Quelle est la formule de la loi de Little pour le système ?",
                        options: [
                            "L = μ/λ",
                            "L = λW",
                            "L = λ + W"
                        ],
                        bonneReponse: 1
                    }
                ]
            }
        ],

        quizFinal: [
            {
                question: "Que représente λ dans une file d'attente ?",
                options: [
                    "Le taux moyen d'arrivée",
                    "Le nombre de serveurs",
                    "La capacité mémoire du serveur"
                ],
                bonneReponse: 0
            },
            {
                question: "Dans une chaîne de Markov, une matrice de transition contient :",
                options: [
                    "Des probabilités de transition",
                    "Uniquement des durées de service",
                    "Uniquement des nombres entiers"
                ],
                bonneReponse: 0
            },
            {
                question: "Quelle équation caractérise une distribution stationnaire π ?",
                options: [
                    "πP = π",
                    "π + P = 1",
                    "πP = 0 dans tous les cas"
                ],
                bonneReponse: 0
            },
            {
                question: "Quelle est la condition de stabilité du modèle M/M/1 standard ?",
                options: [
                    "λ > μ",
                    "λ = μ",
                    "λ < μ"
                ],
                bonneReponse: 2
            },
            {
                question: "Quelle est la loi de Little ?",
                options: [
                    "L = λW",
                    "L = λ + W",
                    "L = μW"
                ],
                bonneReponse: 0
            },
            {
                question: "Que signifie M/M/c ?",
                options: [
                    "Un système avec c serveurs, des arrivées de Poisson et des services exponentiels",
                    "Un système sans arrivée",
                    "Un système avec obligatoirement un seul serveur"
                ],
                bonneReponse: 0
            }
        ]
    },
"sgbd": {
    titre: "Systèmes de Gestion de Bases de Données",
    matiere: "Bases de données et SQL",
    niveau: "Débutant à intermédiaire",

    modules: [

        {
            id: "introduction-sgbd",
            titre: "Module 1 : Introduction aux SGBD",

            parties: [
                {
                    id: "definition-sgbd",
                    titre: "1.1 - Définition et rôle d'un SGBD",

                    contenu: `
                        <h2>Qu'est-ce qu'une base de données ?</h2>

                        <p>
                            Une <strong>base de données (BDD)</strong> est un ensemble
                            organisé d'informations que l'on peut stocker, consulter,
                            modifier et supprimer facilement.
                        </p>

                        <p>
                            Par exemple, une université possède des informations sur
                            ses étudiants, ses enseignants, ses matières et ses notes.
                            Toutes ces informations peuvent être enregistrées dans une
                            base de données.
                        </p>

                        <h3>Qu'est-ce qu'un SGBD ?</h3>

                        <p>
                            Un <strong>Système de Gestion de Bases de Données (SGBD)</strong>
                            est un logiciel qui permet de créer, gérer et manipuler
                            des bases de données.
                        </p>

                        <ul>
                            <li>Créer et organiser les données.</li>
                            <li>Ajouter, modifier et supprimer des informations.</li>
                            <li>Rechercher rapidement des données.</li>
                            <li>Contrôler les accès et les permissions.</li>
                            <li>Assurer la cohérence des données.</li>
                            <li>Effectuer des sauvegardes et des restaurations.</li>
                        </ul>

                        <h3>Exemple de fonctionnement</h3>

                        <svg viewBox="0 0 700 300"
                             role="img"
                             aria-label="Schéma du fonctionnement d'un SGBD"
                             style="width:100%;height:auto;display:block;margin:25px auto">

                            <rect x="20" y="35" width="180" height="75"
                                  rx="12" fill="#dce9e0" stroke="#347a54"
                                  stroke-width="2"/>

                            <text x="110" y="66" text-anchor="middle"
                                  font-size="17" fill="#263b32">Utilisateur</text>
                            <text x="110" y="89" text-anchor="middle"
                                  font-size="13" fill="#263b32">Application</text>

                            <path d="M200 72 H255"
                                  stroke="#347a54" stroke-width="3"
                                  fill="none"/>
                            <path d="M245 64 L255 72 L245 80"
                                  stroke="#347a54" stroke-width="3"
                                  fill="none"/>

                            <rect x="255" y="35" width="190" height="75"
                                  rx="12" fill="#dce9e0" stroke="#347a54"
                                  stroke-width="2"/>

                            <text x="350" y="66" text-anchor="middle"
                                  font-size="17" fill="#263b32">SGBD</text>
                            <text x="350" y="89" text-anchor="middle"
                                  font-size="13" fill="#263b32">Gestion des données</text>

                            <path d="M445 72 H500"
                                  stroke="#347a54" stroke-width="3"
                                  fill="none"/>
                            <path d="M490 64 L500 72 L490 80"
                                  stroke="#347a54" stroke-width="3"
                                  fill="none"/>

                            <rect x="500" y="35" width="180" height="75"
                                  rx="12" fill="#dce9e0" stroke="#347a54"
                                  stroke-width="2"/>

                            <text x="590" y="66" text-anchor="middle"
                                  font-size="17" fill="#263b32">Base de données</text>
                            <text x="590" y="89" text-anchor="middle"
                                  font-size="13" fill="#263b32">Données stockées</text>

                            <rect x="90" y="170" width="520" height="90"
                                  rx="12" fill="#f4f6f5" stroke="#b8c8bf"/>

                            <text x="350" y="198" text-anchor="middle"
                                  font-size="16" fill="#263b32">Le SGBD contrôle les opérations</text>
                            <text x="350" y="224" text-anchor="middle"
                                  font-size="14" fill="#263b32">Lecture • Écriture • Sécurité</text>
                            <text x="350" y="246" text-anchor="middle"
                                  font-size="14" fill="#263b32">Cohérence • Sauvegarde</text>
                        </svg>

                        <h3>Exemples de SGBD</h3>

                        <ul>
                            <li><strong>MySQL :</strong> très utilisé dans les applications web.</li>
                            <li><strong>PostgreSQL :</strong> SGBD relationnel puissant.</li>
                            <li><strong>Oracle Database :</strong> utilisé notamment dans les grandes organisations.</li>
                            <li><strong>Microsoft SQL Server :</strong> solution de gestion de données de Microsoft.</li>
                            <li><strong>SQLite :</strong> SGBD léger, souvent intégré aux applications.</li>
                            <li><strong>MongoDB :</strong> SGBD orienté documents, de type NoSQL.</li>
                        </ul>

                        <h3>Vidéo : introduction aux SGBD et à SQL</h3>

                        <div style="position:relative;width:100%;aspect-ratio:16/9">
                            <iframe
                            class="video-cours"
                                src="https://www.youtube-nocookie.com/embed/NSgckSsFxSE?enablejsapi=1"
                                title="Introduction aux SGBD et à SQL"
                                loading="lazy"
                                allowfullscreen
                                style="position:absolute;inset:0;width:100%;height:100%;border:0">
                            </iframe>
                        </div>

                        <p>
                            <strong>À retenir :</strong> une base de données contient
                            les informations, tandis que le SGBD est le logiciel qui
                            permet de les gérer.
                        </p>
                    `
                },

                {
                    id: "types-sgbd",
                    titre: "1.2 - Types de SGBD et architecture",

                    contenu: `
                        <h2>Les principaux types de bases de données</h2>

                        <h3>1. Les bases de données relationnelles</h3>

                        <p>
                            Les données sont organisées dans des tables composées de
                            lignes et de colonnes. Les tables peuvent être reliées entre elles.
                        </p>

                        <p>Exemples : MySQL, PostgreSQL, Oracle et SQL Server.</p>

                        <h3>2. Les bases de données NoSQL</h3>

                        <p>
                            Elles regroupent plusieurs modèles de stockage adaptés à
                            différents besoins : documents, clés-valeurs, graphes ou
                            colonnes.
                        </p>

                        <p>Exemple : MongoDB utilise principalement des documents BSON.</p>

                        <h3>3. Architecture client-serveur</h3>

                        <p>
                            Dans une architecture client-serveur, le client envoie une
                            requête au serveur de base de données. Le serveur traite la
                            demande et renvoie le résultat.
                        </p>

                        <svg viewBox="0 0 600 240"
                             role="img"
                             aria-label="Architecture client serveur"
                             style="width:100%;height:auto;display:block;margin:25px auto">

                            <rect x="25" y="65" width="160" height="85"
                                  rx="10" fill="#dce9e0" stroke="#347a54" stroke-width="2"/>
                            <text x="105" y="100" text-anchor="middle"
                                  font-size="18" fill="#263b32">Client</text>
                            <text x="105" y="125" text-anchor="middle"
                                  font-size="13" fill="#263b32">Application</text>

                            <path d="M185 90 H415" stroke="#347a54"
                                  stroke-width="2.5" fill="none"/>
                            <path d="M405 82 L415 90 L405 98"
                                  stroke="#347a54" stroke-width="2.5" fill="none"/>

                            <path d="M415 125 H185" stroke="#c87d65"
                                  stroke-width="2.5" fill="none"/>
                            <path d="M195 117 L185 125 L195 133"
                                  stroke="#c87d65" stroke-width="2.5" fill="none"/>

                            <text x="300" y="78" text-anchor="middle"
                                  font-size="13" fill="#347a54">Requête</text>
                            <text x="300" y="150" text-anchor="middle"
                                  font-size="13" fill="#94687b">Résultat</text>

                            <rect x="415" y="65" width="160" height="85"
                                  rx="10" fill="#dce9e0" stroke="#347a54" stroke-width="2"/>
                            <text x="495" y="100" text-anchor="middle"
                                  font-size="18" fill="#263b32">Serveur</text>
                            <text x="495" y="125" text-anchor="middle"
                                  font-size="13" fill="#263b32">SGBD</text>
                        </svg>

                        <h3>Comment choisir un SGBD ?</h3>

                        <p>Le choix dépend notamment :</p>
                        <ul>
                            <li>Du type et du volume de données.</li>
                            <li>Du nombre d'utilisateurs simultanés.</li>
                            <li>Des besoins de sécurité et de disponibilité.</li>
                            <li>Du budget et de l'environnement technique.</li>
                        </ul>

                        <p>
                            Une base relationnelle est souvent adaptée aux applications
                            qui nécessitent des relations structurées et des transactions
                            fiables. NoSQL peut être pertinent pour certains modèles de
                            données plus flexibles ou distribués.
                        </p>
                    `
                }
            ],

            quiz: [
                {
                    question: "Quel est le rôle principal d'un SGBD ?",
                    options: [
                        "Créer uniquement des pages web",
                        "Gérer et manipuler des bases de données",
                        "Remplacer le système d'exploitation",
                        "Compiler du code Java"
                    ],
                    bonneReponse: 1
                },
                {
                    question: "Lequel est un SGBD relationnel ?",
                    options: [
                        "HTML",
                        "CSS",
                        "PostgreSQL",
                        "Photoshop"
                    ],
                    bonneReponse: 2
                },
                {
                    question: "Dans une architecture client-serveur, qui traite la requête SQL ?",
                    options: [
                        "Le serveur de base de données",
                        "Le navigateur uniquement",
                        "Le clavier",
                        "Le fichier CSS"
                    ],
                    bonneReponse: 0
                }
            ]
        },

        /* =====================================
           MODULE 2 : MODELE RELATIONNEL
        ===================================== */
        {
            id: "modele-relationnel",
            titre: "Module 2 : Modèle relationnel et conception",

            parties: [
                {
                    id: "tables-cles",
                    titre: "2.1 - Tables, attributs et clés",

                    contenu: `
                        <h2>Organisation d'une base relationnelle</h2>

                        <p>
                            Dans le modèle relationnel, les données sont organisées
                            sous forme de tables. Une table représente généralement
                            une catégorie d'informations.
                        </p>

                        <ul>
                            <li><strong>Table :</strong> ensemble de lignes et de colonnes.</li>
                            <li><strong>Attribut :</strong> colonne de la table.</li>
                            <li><strong>Tuple :</strong> ligne de la table.</li>
                            <li><strong>Schéma :</strong> structure définie de la table.</li>
                        </ul>

                        <h3>Exemple : table ETUDIANT</h3>

                        <div style="overflow-x:auto">
                            <table style="width:100%;border-collapse:collapse;text-align:left">
                                <thead>
                                    <tr style="background:#dce9e0">
                                        <th style="padding:10px;border:1px solid #ccd6d0">id_etudiant</th>
                                        <th style="padding:10px;border:1px solid #ccd6d0">nom</th>
                                        <th style="padding:10px;border:1px solid #ccd6d0">email</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style="padding:10px;border:1px solid #ccd6d0">1</td>
                                        <td style="padding:10px;border:1px solid #ccd6d0">Amine</td>
                                        <td style="padding:10px;border:1px solid #ccd6d0">amine@example.com</td>
                                    </tr>
                                    <tr>
                                        <td style="padding:10px;border:1px solid #ccd6d0">2</td>
                                        <td style="padding:10px;border:1px solid #ccd6d0">Sara</td>
                                        <td style="padding:10px;border:1px solid #ccd6d0">sara@example.com</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <h3>La clé primaire</h3>

                        <p>
                            Une <strong>clé primaire (PRIMARY KEY)</strong> identifie
                            chaque ligne de manière unique. Elle ne peut pas être
                            dupliquée ni être NULL.
                        </p>

                        <h3>La clé étrangère</h3>

                        <p>
                            Une <strong>clé étrangère (FOREIGN KEY)</strong> établit
                            un lien entre une table et une autre, en référençant une
                            clé candidate unique, généralement la clé primaire.
                        </p>

                        <svg viewBox="0 0 650 290"
                             role="img"
                             aria-label="Relation entre les tables étudiant et inscription"
                             style="width:100%;height:auto;display:block;margin:25px auto">

                            <rect x="20" y="35" width="260" height="190"
                                  rx="8" fill="#f4f6f5" stroke="#347a54" stroke-width="2"/>
                            <rect x="20" y="35" width="260" height="42"
                                  rx="8" fill="#dce9e0"/>
                            <text x="150" y="62" text-anchor="middle"
                                  font-size="17" font-weight="bold" fill="#263b32">ETUDIANT</text>
                            <text x="40" y="108" font-size="15" fill="#263b32">PK id_etudiant</text>
                            <text x="40" y="140" font-size="15" fill="#263b32">nom</text>
                            <text x="40" y="172" font-size="15" fill="#263b32">email</text>

                            <rect x="370" y="35" width="260" height="190"
                                  rx="8" fill="#f4f6f5" stroke="#c87d65" stroke-width="2"/>
                            <rect x="370" y="35" width="260" height="42"
                                  rx="8" fill="#f4e5df"/>
                            <text x="500" y="62" text-anchor="middle"
                                  font-size="17" font-weight="bold" fill="#263b32">INSCRIPTION</text>
                            <text x="390" y="108" font-size="15" fill="#263b32">PK id_inscription</text>
                            <text x="390" y="140" font-size="15" fill="#263b32">FK id_etudiant</text>
                            <text x="390" y="172" font-size="15" fill="#263b32">date_inscription</text>

                            <path d="M280 140 H370" stroke="#347a54"
                                  stroke-width="2.5" fill="none"/>
                            <path d="M360 132 L370 140 L360 148"
                                  stroke="#347a54" stroke-width="2.5" fill="none"/>

                            <text x="325" y="125" text-anchor="middle"
                                  font-size="12" fill="#347a54">1,N</text>
                            <text x="325" y="260" text-anchor="middle"
                                  font-size="14" fill="#263b32">Une clé étrangère relie les deux tables.</text>
                        </svg>

                        <p>
                            <strong>PK</strong> signifie Primary Key et
                            <strong>FK</strong> signifie Foreign Key.
                        </p>
                    `
                },

                {
                    id: "associations-normalisation",
                    titre: "2.2 - Associations et normalisation",

                    contenu: `
                        <h2>Les types d'associations</h2>

                        <h3>1. Relation un-à-un (1:1)</h3>
                        <p>
                            Une ligne d'une table est associée à une seule ligne de
                            l'autre table, et inversement. Exemple : une personne et
                            son dossier individuel, selon les règles de l'application.
                        </p>

                        <h3>2. Relation un-à-plusieurs (1:N)</h3>
                        <p>
                            Une ligne d'une table peut être liée à plusieurs lignes
                            d'une autre table. Exemple : un département possède
                            plusieurs étudiants. La clé étrangère se trouve
                            généralement du côté plusieurs.
                        </p>

                        <h3>3. Relation plusieurs-à-plusieurs (N:M)</h3>
                        <p>
                            Plusieurs étudiants peuvent suivre plusieurs matières.
                            On crée une table d'association, par exemple INSCRIPTION,
                            qui contient les clés étrangères des deux tables.
                        </p>

                        <h2>Pourquoi normaliser une base de données ?</h2>

                        <p>
                            La normalisation vise à limiter les répétitions inutiles
                            et à éviter les anomalies lors des insertions,
                            modifications et suppressions.
                        </p>

                        <ul>
                            <li><strong>1FN :</strong> chaque attribut contient une valeur atomique.</li>
                            <li><strong>2FN :</strong> être en 1FN et éviter les dépendances partielles par rapport à une clé composée.</li>
                            <li><strong>3FN :</strong> être en 2FN et éviter les dépendances transitives inappropriées entre attributs non-clés.</li>
                        </ul>

                        <h3>Exemple de mauvaise conception</h3>

                        <p>
                            Si le nom du département est recopié dans chaque ligne
                            d'étudiant, une modification du nom doit être répétée
                            plusieurs fois.
                        </p>

                        <p>
                            Une meilleure conception utilise deux tables :
                            DEPARTEMENT et ETUDIANT. La table ETUDIANT référence
                            le département à l'aide d'une clé étrangère.
                        </p>

                        <div style="padding:16px;background:#dce9e0;border-radius:8px">
                            <strong>À retenir :</strong>
                            les clés assurent l'identification et les liens entre
                            les données. La normalisation améliore leur organisation.
                        </div>
                    `
                }
            ],

            quiz: [
                {
                    question: "Quel est le rôle d'une clé primaire ?",
                    options: [
                        "Autoriser les doublons",
                        "Identifier chaque ligne de façon unique",
                        "Supprimer toutes les relations",
                        "Stocker uniquement du texte"
                    ],
                    bonneReponse: 1
                },
                {
                    question: "Où place-t-on généralement la clé étrangère dans une relation 1:N ?",
                    options: [
                        "Du côté N",
                        "Du côté 1 uniquement",
                        "Dans une image",
                        "Elle n'est jamais nécessaire"
                    ],
                    bonneReponse: 0
                },
                {
                    question: "Quel est l'objectif principal de la normalisation ?",
                    options: [
                        "Augmenter les doublons",
                        "Éviter toute utilisation de clés",
                        "Réduire les redondances et les anomalies",
                        "Remplacer SQL par HTML"
                    ],
                    bonneReponse: 2
                }
            ]
        },

        /* =====================================
           MODULE 3 : CREATION ET DEFINITION SQL
        ===================================== */
        {
            id: "creation-sql",
            titre: "Module 3 : Création des bases et SQL",

            parties: [
                {
                    id: "definition-sql",
                    titre: "3.1 - SQL et création des tables",

                    contenu: `
                        <h2>Qu'est-ce que SQL ?</h2>

                        <p>
                            SQL signifie <strong>Structured Query Language</strong>.
                            C'est un langage utilisé pour définir des structures
                            relationnelles et manipuler les données d'un SGBD relationnel.
                        </p>

                        <h3>Les grandes familles de commandes</h3>

                        <ul>
                            <li><strong>DDL :</strong> définition des structures, par exemple CREATE et ALTER.</li>
                            <li><strong>DML :</strong> manipulation des données, par exemple INSERT, UPDATE et DELETE.</li>
                            <li><strong>DQL :</strong> interrogation des données, notamment SELECT.</li>
                            <li><strong>DCL :</strong> gestion des droits, notamment GRANT et REVOKE.</li>
                            <li><strong>TCL :</strong> contrôle des transactions, notamment COMMIT et ROLLBACK.</li>
                        </ul>

                        <h3>Créer une base de données</h3>

                        <pre><code>CREATE DATABASE universite;
USE universite;</code></pre>

                        <p>
                            La commande CREATE DATABASE crée une base appelée
                            universite. Sur MySQL, USE permet de sélectionner
                            cette base pour les commandes suivantes.
                        </p>

                        <h3>Créer une table</h3>

                        <pre><code>CREATE TABLE Etudiant (
    id INT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE,
    age INT CHECK (age >= 0)
);</code></pre>

                        <p>Explication des éléments :</p>

                        <ul>
                            <li><code>INT</code> : nombre entier.</li>
                            <li><code>VARCHAR(100)</code> : chaîne de caractères de longueur variable.</li>
                            <li><code>PRIMARY KEY</code> : clé primaire.</li>
                            <li><code>NOT NULL</code> : valeur obligatoire.</li>
                            <li><code>UNIQUE</code> : interdit les doublons dans la colonne, selon les règles du SGBD.</li>
                            <li><code>CHECK</code> : impose une condition aux valeurs.</li>
                        </ul>

                        <h3>Modifier une table</h3>

                        <pre><code>ALTER TABLE Etudiant
ADD telephone VARCHAR(20);</code></pre>

                        <p>
                            ALTER TABLE modifie la structure d'une table existante.
                            La syntaxe précise peut varier selon le SGBD.
                        </p>

                        <h3>Vidéo : créer et modifier des tables MySQL</h3>

                        <div style="position:relative;width:100%;aspect-ratio:16/9">
                            <iframe
                            class="video-cours"
                                src="https://www.youtube-nocookie.com/embed/rYdTi9xljCw?enablejsapi=1"
                                title="Gestion des bases et tables avec MySQL"
                                loading="lazy"
                                allowfullscreen
                                style="position:absolute;inset:0;width:100%;height:100%;border:0">
                            </iframe>
                        </div>
                    `
                },

                {
                    id: "contraintes-types",
                    titre: "3.2 - Types de données et contraintes",

                    contenu: `
                        <h2>Choisir le type de données</h2>

                        <p>
                            Chaque colonne doit avoir un type adapté à la nature
                            de l'information qu'elle stocke.
                        </p>

                        <ul>
                            <li><code>INT</code> : nombres entiers.</li>
                            <li><code>DECIMAL(10,2)</code> : valeurs décimales exactes, adaptées aux montants.</li>
                            <li><code>VARCHAR(n)</code> : texte de longueur variable.</li>
                            <li><code>DATE</code> : date.</li>
                            <li><code>DATETIME</code> ou <code>TIMESTAMP</code> : date et heure, selon les besoins.</li>
                            <li><code>BOOLEAN</code> : valeur logique, avec une représentation dépendant du SGBD.</li>
                        </ul>

                        <h3>Les contraintes principales</h3>

                        <pre><code>CREATE TABLE Cours (
    id INT PRIMARY KEY,
    titre VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE
);

CREATE TABLE Inscription (
    id_etudiant INT,
    id_cours INT,
    date_inscription DATE NOT NULL,

    PRIMARY KEY (id_etudiant, id_cours),

    FOREIGN KEY (id_etudiant)
        REFERENCES Etudiant(id),

    FOREIGN KEY (id_cours)
        REFERENCES Cours(id)
);</code></pre>

                        <p>
                            La table INSCRIPTION utilise une clé primaire composée :
                            le couple id_etudiant, id_cours doit être unique.
                        </p>

                        <h3>Intégrité référentielle</h3>

                        <p>
                            Une clé étrangère empêche normalement de référencer
                            un étudiant ou un cours inexistant. Les règles de
                            suppression et de mise à jour peuvent être précisées
                            avec des options comme RESTRICT ou CASCADE.
                        </p>

                        <p>
                            Attention : les comportements précis des contraintes
                            et les types disponibles varient selon le SGBD.
                        </p>
                    `
                }
            ],

            quiz: [
                {
                    question: "Quelle commande crée une table ?",
                    options: [
                        "MAKE TABLE",
                        "CREATE TABLE",
                        "NEW DATABASE",
                        "INSERT TABLE"
                    ],
                    bonneReponse: 1
                },
                {
                    question: "Quelle contrainte interdit une valeur NULL ?",
                    options: [
                        "UNIQUE",
                        "FOREIGN KEY",
                        "NOT NULL",
                        "ORDER BY"
                    ],
                    bonneReponse: 2
                },
                {
                    question: "Quelle commande permet d'ajouter une colonne à une table existante ?",
                    options: [
                        "ALTER TABLE",
                        "SELECT",
                        "COMMIT",
                        "GROUP BY"
                    ],
                    bonneReponse: 0
                }
            ]
        },

        /* =====================================
           MODULE 4 : MANIPULATION DES DONNEES
        ===================================== */
        {
            id: "manipulation-sql",
            titre: "Module 4 : Manipulation et interrogation des données",

            parties: [
                {
                    id: "crud-select",
                    titre: "4.1 - INSERT, SELECT, UPDATE et DELETE",

                    contenu: `
                        <h2>Les opérations CRUD</h2>

                        <p>
                            CRUD désigne quatre opérations fondamentales :
                            Create, Read, Update et Delete.
                        </p>

                        <h3>1. Ajouter une ligne avec INSERT</h3>

                        <pre><code>INSERT INTO Etudiant (id, nom, email, age)
VALUES (1, 'Amine', 'amine@example.com', 21);</code></pre>

                        <h3>2. Lire les données avec SELECT</h3>

                        <pre><code>SELECT * FROM Etudiant;

SELECT nom, email
FROM Etudiant;</code></pre>

                        <p>
                            SELECT permet de récupérer les colonnes souhaitées.
                            L'astérisque signifie que toutes les colonnes sont demandées.
                        </p>

                        <h3>3. Filtrer avec WHERE</h3>

                        <pre><code>SELECT *
FROM Etudiant
WHERE age >= 20;</code></pre>

                        <p>
                            WHERE sélectionne uniquement les lignes qui respectent
                            la condition. On peut combiner des conditions avec
                            AND, OR et NOT.
                        </p>

                        <h3>4. Modifier avec UPDATE</h3>

                        <pre><code>UPDATE Etudiant
SET age = 22
WHERE id = 1;</code></pre>

                        <p>
                            Il faut vérifier la condition WHERE avant d'exécuter
                            UPDATE. Sans condition, plusieurs lignes, voire toutes
                            les lignes, peuvent être modifiées.
                        </p>

                        <h3>5. Supprimer avec DELETE</h3>

                        <pre><code>DELETE FROM Etudiant
WHERE id = 1;</code></pre>

                        <p>
                            DELETE supprime les lignes ciblées, mais conserve
                            la structure de la table. Sans WHERE, toutes les lignes
                            peuvent être supprimées.
                        </p>

                        <div style="padding:16px;background:#f4e5df;border-radius:8px">
                            <strong>Conseil :</strong>
                            avant un UPDATE ou un DELETE, exécute un SELECT avec
                            la même condition pour vérifier les lignes concernées.
                        </div>
                    `
                },

                {
                    id: "jointures-agregations",
                    titre: "4.2 - Jointures et fonctions d'agrégation",

                    contenu: `
                        <h2>Pourquoi utiliser une jointure ?</h2>

                        <p>
                            Les données d'une application sont souvent réparties
                            entre plusieurs tables. Une jointure permet de réunir
                            les informations correspondantes.
                        </p>

                        <h3>Exemple de jointure interne</h3>

                        <pre><code>SELECT Etudiant.nom, Cours.titre
FROM Inscription
INNER JOIN Etudiant
    ON Inscription.id_etudiant = Etudiant.id
INNER JOIN Cours
    ON Inscription.id_cours = Cours.id;</code></pre>

                        <p>
                            INNER JOIN retourne les lignes qui possèdent des
                            correspondances dans les tables jointes.
                        </p>

                        <h3>Différence entre INNER JOIN et LEFT JOIN</h3>

                        <ul>
                            <li><strong>INNER JOIN :</strong> conserve les correspondances.</li>
                            <li><strong>LEFT JOIN :</strong> conserve toutes les lignes de la table de gauche, même sans correspondance à droite.</li>
                        </ul>

                        <svg viewBox="0 0 600 250"
                             role="img"
                             aria-label="Comparaison entre jointure interne et jointure gauche"
                             style="width:100%;height:auto;display:block;margin:25px auto">

                            <text x="150" y="25" text-anchor="middle"
                                  font-size="17" fill="#263b32">INNER JOIN</text>

                            <circle cx="125" cy="100" r="58"
                                    fill="#dce9e0" stroke="#347a54" stroke-width="2"/>
                            <circle cx="175" cy="100" r="58"
                                    fill="#f4e5df" stroke="#c87d65" stroke-width="2"/>

                            <path d="M150 47
                                     A58 58 0 0 1 150 153
                                     A58 58 0 0 1 150 47 Z"
                                  fill="#6b9784" opacity="0.9"/>

                            <text x="125" y="105" text-anchor="middle"
                                  font-size="13" fill="#263b32">A</text>
                            <text x="175" y="105" text-anchor="middle"
                                  font-size="13" fill="#263b32">B</text>

                            <text x="450" y="25" text-anchor="middle"
                                  font-size="17" fill="#263b32">LEFT JOIN</text>

                            <circle cx="425" cy="100" r="58"
                                    fill="#dce9e0" stroke="#347a54" stroke-width="2"/>
                            <circle cx="475" cy="100" r="58"
                                    fill="#f4e5df" stroke="#c87d65" stroke-width="2"/>

                            <text x="425" y="105" text-anchor="middle"
                                  font-size="13" fill="#263b32">A</text>
                            <text x="475" y="105" text-anchor="middle"
                                  font-size="13" fill="#263b32">B</text>

                            <text x="150" y="195" text-anchor="middle"
                                  font-size="13" fill="#263b32">Seulement les correspondances</text>
                            <text x="450" y="195" text-anchor="middle"
                                  font-size="13" fill="#263b32">Toutes les lignes de A</text>
                            <text x="300" y="232" text-anchor="middle"
                                  font-size="12" fill="#537765">Schéma conceptuel simplifié</text>
                        </svg>

                        <h3>Fonctions d'agrégation</h3>

                        <ul>
                            <li><code>COUNT()</code> : compter des lignes ou des valeurs.</li>
                            <li><code>SUM()</code> : calculer une somme.</li>
                            <li><code>AVG()</code> : calculer une moyenne.</li>
                            <li><code>MIN()</code> : obtenir la valeur minimale.</li>
                            <li><code>MAX()</code> : obtenir la valeur maximale.</li>
                        </ul>

                        <pre><code>SELECT COUNT(*) AS nombre_etudiants
FROM Etudiant;

SELECT AVG(age) AS age_moyen
FROM Etudiant;</code></pre>

                        <h3>GROUP BY et HAVING</h3>

                        <pre><code>SELECT id_cours, COUNT(*) AS total
FROM Inscription
GROUP BY id_cours
HAVING COUNT(*) >= 2;</code></pre>

                        <p>
                            GROUP BY regroupe les lignes selon une ou plusieurs
                            colonnes. HAVING filtre les groupes après l'agrégation,
                            tandis que WHERE filtre les lignes avant le regroupement.
                        </p>

                        <h3>Vidéo : les jointures SQL</h3>

                        <div style="position:relative;width:100%;aspect-ratio:16/9">
                            <iframe
                            class="video-cours"
                                src="https://www.youtube-nocookie.com/embed/0Au1lJ1C_us?enablejsapi=1"
                                title="Tutoriel SQL : jointure de deux tables"
                                loading="lazy"
                                allowfullscreen
                                style="position:absolute;inset:0;width:100%;height:100%;border:0">
                            </iframe>
                        </div>
                    `
                }
            ],

            quiz: [
                {
                    question: "Quelle commande permet de consulter des données ?",
                    options: [
                        "DELETE",
                        "SELECT",
                        "DROP",
                        "ALTER"
                    ],
                    bonneReponse: 1
                },
                {
                    question: "Quelle jointure conserve toutes les lignes de la table de gauche ?",
                    options: [
                        "INNER JOIN",
                        "CROSS JOIN uniquement",
                        "LEFT JOIN",
                        "Aucune jointure"
                    ],
                    bonneReponse: 2
                },
                {
                    question: "Quelle clause filtre les groupes après GROUP BY ?",
                    options: [
                        "WHERE",
                        "ORDER BY",
                        "HAVING",
                        "INSERT"
                    ],
                    bonneReponse: 2
                }
            ]
        },

        /* =====================================
           MODULE 5 : TRANSACTIONS ET SECURITE
        ===================================== */
        {
            id: "transactions-securite",
            titre: "Module 5 : Transactions, sécurité et optimisation",

            parties: [
                {
                    id: "transactions-acid",
                    titre: "5.1 - Transactions et propriétés ACID",

                    contenu: `
                        <h2>Qu'est-ce qu'une transaction ?</h2>

                        <p>
                            Une transaction est un ensemble d'opérations qui doit
                            être traité comme une unité logique. Elle permet de
                            préserver la cohérence des données lors d'opérations
                            liées entre elles.
                        </p>

                        <h3>Exemple : transfert bancaire</h3>

                        <p>
                            Un transfert de 100 unités entre deux comptes comprend
                            deux opérations :
                        </p>

                        <ol>
                            <li>Retirer 100 unités du compte A.</li>
                            <li>Ajouter 100 unités au compte B.</li>
                        </ol>

                        <p>
                            Si le retrait réussit mais que le dépôt échoue,
                            la transaction doit pouvoir être annulée pour éviter
                            un état incohérent.
                        </p>

                        <h3>Exemple SQL</h3>

                        <pre><code>START TRANSACTION;

UPDATE Compte
SET solde = solde - 100
WHERE id = 1;

UPDATE Compte
SET solde = solde + 100
WHERE id = 2;

COMMIT;</code></pre>

                        <p>
                            <code>COMMIT</code> valide la transaction.
                            <code>ROLLBACK</code> annule les modifications
                            non validées lorsque le SGBD et le contexte le permettent.
                        </p>

                        <h3>Les propriétés ACID</h3>

                        <ul>
                            <li><strong>Atomicité :</strong> toutes les opérations réussissent ou sont annulées.</li>
                            <li><strong>Cohérence :</strong> les règles d'intégrité sont respectées.</li>
                            <li><strong>Isolation :</strong> les transactions concurrentes sont contrôlées.</li>
                            <li><strong>Durabilité :</strong> les changements validés sont conservés selon les garanties du SGBD.</li>
                        </ul>

                        <div style="padding:16px;background:#dce9e0;border-radius:8px">
                            <strong>À retenir :</strong>
                            COMMIT valide une transaction ; ROLLBACK permet de
                            revenir sur les modifications non validées.
                        </div>
                    `
                },

                {
                    id: "securite-index-sauvegarde",
                    titre: "5.2 - Sécurité, index et sauvegardes",

                    contenu: `
                        <h2>Sécuriser une base de données</h2>

                        <p>
                            Les données doivent être protégées contre les accès
                            non autorisés, les modifications accidentelles et les
                            pertes de données.
                        </p>

                        <h3>Principes de sécurité</h3>

                        <ul>
                            <li>Attribuer à chaque utilisateur uniquement les droits nécessaires.</li>
                            <li>Utiliser des mots de passe robustes et une authentification adaptée.</li>
                            <li>Protéger les connexions réseau.</li>
                            <li>Maintenir le SGBD à jour.</li>
                            <li>Prévoir des sauvegardes régulières et tester les restaurations.</li>
                        </ul>

                        <h3>Injection SQL</h3>

                        <p>
                            Une injection SQL survient lorsqu'une entrée utilisateur
                            non sécurisée modifie la structure d'une requête SQL.
                            Pour l'éviter, on utilise notamment des requêtes
                            paramétrées plutôt que de concaténer directement
                            les entrées utilisateur.
                        </p>

                        <h3>À quoi sert un index ?</h3>

                        <p>
                            Un index permet au SGBD de retrouver certaines données
                            plus rapidement. Il peut améliorer les recherches,
                            mais consomme de l'espace et peut ralentir certaines
                            opérations d'écriture.
                        </p>

                        <pre><code>CREATE INDEX idx_etudiant_nom
ON Etudiant(nom);</code></pre>

                        <h3>Sauvegarde et restauration</h3>

                        <p>
                            Une sauvegarde est une copie des données et, selon
                            la méthode choisie, d'autres éléments nécessaires
                            à leur restauration. Une bonne stratégie définit
                            la fréquence des sauvegardes, leur stockage et
                            des tests réguliers de restauration.
                        </p>

                        <h3>Résumé</h3>

                        <ul>
                            <li>Les transactions préservent la cohérence des opérations.</li>
                            <li>Les droits limitent les accès aux données.</li>
                            <li>Les index peuvent accélérer certaines requêtes.</li>
                            <li>Les sauvegardes permettent de récupérer les données après un incident.</li>
                        </ul>
                    `
                }
            ],

            quiz: [
                {
                    question: "Que signifie la propriété A d'ACID ?",
                    options: [
                        "Accessibilité",
                        "Atomicité",
                        "Authentification",
                        "Automatisation"
                    ],
                    bonneReponse: 1
                },
                {
                    question: "Quelle commande valide une transaction ?",
                    options: [
                        "ROLLBACK",
                        "DELETE",
                        "COMMIT",
                        "SELECT"
                    ],
                    bonneReponse: 2
                },
                {
                    question: "Quel est l'objectif principal d'un index ?",
                    options: [
                        "Supprimer toutes les clés étrangères",
                        "Accélérer certaines recherches",
                        "Remplacer les sauvegardes",
                        "Empêcher toutes les modifications"
                    ],
                    bonneReponse: 1
                }
            ]
        }
    ],

    /* =====================================
       QUIZ FINAL DU COURS
    ===================================== */
    quizFinal: [
        {
            question: "Quelle affirmation distingue correctement une BDD d'un SGBD ?",
            options: [
                "Une BDD est un logiciel et le SGBD est une table",
                "La BDD contient les données et le SGBD les gère",
                "Les deux termes désignent toujours exactement la même chose",
                "Un SGBD sert uniquement à afficher des images"
            ],
            bonneReponse: 1
        },
        {
            question: "Quel élément identifie de façon unique chaque ligne d'une table ?",
            options: [
                "Une clé primaire",
                "Une clé étrangère uniquement",
                "Une commande UPDATE",
                "Une fonction AVG"
            ],
            bonneReponse: 0
        },
        {
            question: "Quelle commande ajoute une nouvelle ligne à une table ?",
            options: [
                "ALTER",
                "SELECT",
                "INSERT INTO",
                "ROLLBACK"
            ],
            bonneReponse: 2
        },
        {
            question: "Quelle clause filtre les lignes avant le regroupement ?",
            options: [
                "HAVING",
                "WHERE",
                "GROUP BY",
                "COMMIT"
            ],
            bonneReponse: 1
        },
        {
            question: "Que fait LEFT JOIN ?",
            options: [
                "Supprime les lignes de gauche sans correspondance",
                "Conserve toutes les lignes de gauche et ajoute les correspondances de droite",
                "Supprime automatiquement une table",
                "Trie toujours les résultats par ordre alphabétique"
            ],
            bonneReponse: 1
        },
        {
            question: "Quel est le rôle de ROLLBACK ?",
            options: [
                "Créer un index",
                "Ajouter une colonne",
                "Annuler les modifications non validées d'une transaction",
                "Créer une nouvelle base"
            ],
            bonneReponse: 2
        },
        {
            question: "Pourquoi utilise-t-on des requêtes paramétrées ?",
            options: [
                "Pour faciliter la prévention des injections SQL",
                "Pour supprimer toutes les contraintes",
                "Pour désactiver le SGBD",
                "Pour remplacer les clés primaires"
            ],
            bonneReponse: 0
        }
    ]
},

"electricite-electronique": {
    titre: "Électricité et Électronique",
    matiere: "Ingénierie des Systèmes Informatiques : Systèmes Embarqués et IoT",
    niveau: "Licence - Intermédiaire",
    modules: [

        // ==================================================
        // MODULE 1 : GRANDEURS ELECTRIQUES
        // ==================================================
        {
            id: "grandeurs-electriques",
            titre: "Module 1 : Grandeurs électriques et lois fondamentales",
            parties: [
                {
                    id: "introduction-electricite",
                    titre: "1.1 - Introduction à l'électricité",
                    contenu: `
                    <h2>1. Introduction à l'électricité</h2>

                    <p>L'électricité est liée au déplacement et à la présence des charges électriques. Elle permet d'alimenter les ordinateurs, les cartes électroniques, les capteurs et les objets connectés.</p>

                    <h3>Les quatre grandeurs essentielles</h3>
                    <ul>
                        <li><strong>Tension (U ou V) :</strong> différence de potentiel électrique entre deux points. Unité : volt (V).</li>
                        <li><strong>Intensité (I) :</strong> quantité de charge qui traverse un point par unité de temps. Unité : ampère (A).</li>
                        <li><strong>Résistance (R) :</strong> opposition au passage du courant. Unité : ohm (Ω).</li>
                        <li><strong>Puissance (P) :</strong> énergie électrique transférée par unité de temps. Unité : watt (W).</li>
                    </ul>

                    <h3>Schéma d'un circuit simple</h3>
                    <figure>
                      <svg viewBox="0 0 340 180" width="100%" role="img" aria-label="Circuit électrique avec pile, résistance et courant">
                        <rect x="8" y="8" width="324" height="164" rx="12" fill="#edf5ef" stroke="#739786"/>
                        <path d="M75 55 H140 M200 55 H270 V130 H75 V55" fill="none" stroke="#263f32" stroke-width="3"/>
                        <rect x="140" y="43" width="60" height="24" rx="3" fill="#d9e9df" stroke="#263f32" stroke-width="2"/>
                        <text x="170" y="59" font-size="12" text-anchor="middle" fill="#263f32">R</text>
                        <line x1="75" y1="105" x2="75" y2="145" stroke="#263f32" stroke-width="3"/>
                        <line x1="63" y1="113" x2="87" y2="113" stroke="#263f32" stroke-width="3"/>
                        <line x1="67" y1="123" x2="83" y2="123" stroke="#263f32" stroke-width="2"/>
                        <path d="M110 130 H145" stroke="#287d55" stroke-width="3"/>
                        <path d="M137 124 L147 130 L137 136" fill="none" stroke="#287d55" stroke-width="3"/>
                        <text x="170" y="99" font-size="12" text-anchor="middle" fill="#263f32">Courant I</text>
                        <text x="105" y="34" font-size="12" fill="#263f32">Résistance</text>
                        <text x="93" y="157" font-size="12" fill="#263f32">Pile</text>
                      </svg>
                      <figcaption>Un circuit fermé permet au courant de circuler.</figcaption>
                    </figure>

                    <h3>Courant continu et courant alternatif</h3>
                    <p><strong>Courant continu (DC) :</strong> le courant circule dans un sens donné. Il est utilisé par les piles, batteries et de nombreuses cartes électroniques.</p>
                    <p><strong>Courant alternatif (AC) :</strong> la tension et le courant varient périodiquement. Le réseau électrique domestique est un exemple de source alternative.</p>

                    <h3>Pourquoi ces notions sont-elles importantes en IoT ?</h3>
                    <p>Un capteur peut fournir une tension analogique, un microcontrôleur mesure cette tension et un programme exploite la mesure. Une mauvaise alimentation ou une tension trop élevée peut endommager le matériel.</p>
                    `
                },
                {
                    id: "loi-ohm-puissance",
                    titre: "1.2 - Loi d'Ohm et puissance électrique",
                    contenu: `
                    <h2>2. Loi d'Ohm</h2>
                    <p>Pour une résistance ohmique dans des conditions données, la loi d'Ohm relie la tension, le courant et la résistance.</p>

                    <div class="formule"><strong>U = R × I</strong></div>
                    <ul>
                        <li>I = U / R</li>
                        <li>R = U / I</li>
                    </ul>

                    <h3>Exemple de calcul</h3>
                    <p>Une résistance de 220 Ω est alimentée sous 5 V. Quel courant la traverse ?</p>
                    <pre><code>I = U / R
I = 5 / 220
I ≈ 0,0227 A = 22,7 mA</code></pre>

                    <h3>Puissance électrique</h3>
                    <p>La puissance consommée par une résistance peut être calculée avec :</p>
                    <div class="formule"><strong>P = U × I</strong></div>
                    <p>On peut également utiliser P = R × I² ou P = U² / R pour une résistance.</p>

                    <p>Dans notre exemple, P = 5 × 0,0227 ≈ 0,114 W. Une résistance doit être choisie avec une puissance nominale suffisante et une marge de sécurité.</p>

                    <h3>Vidéo : loi d'Ohm</h3>
                    <p>Regarde cette leçon pour revoir la tension, le courant et la résistance.</p>
                   
<h3>Vidéo : la loi d'Ohm</h3>

<iframe
class="video-cours"
    src="https://www.youtube-nocookie.com/embed/BBEh1aG8O2Y?enablejsapi=1"
    title="La loi d'Ohm pour les débutants en électricité"
    loading="lazy"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen
    style="width:100%; aspect-ratio:16/9; border:0; border-radius:12px;">
</iframe>
`
                }
            ],
            quiz: [
                {
                    question: "Quelle est l'unité de la résistance électrique ?",
                    options: ["Le volt", "L'ohm", "L'ampère"],
                    bonneReponse: 1
                },
                {
                    question: "Une résistance de 100 Ω est alimentée sous 10 V. Quel courant la traverse ?",
                    options: ["0,1 A", "10 A", "1000 A"],
                    bonneReponse: 0
                },
                {
                    question: "Quelle formule exprime la puissance électrique ?",
                    options: ["P = U × I", "P = U + I", "P = R / I"],
                    bonneReponse: 0
                }
            ]
        },

        // ==================================================
        // MODULE 2 : COMPOSANTS ELECTRONIQUES
        // ==================================================
        {
            id: "composants-electroniques",
            titre: "Module 2 : Les composants électroniques",
            parties: [
                {
                    id: "composants-passifs",
                    titre: "2.1 - Résistances, condensateurs et bobines",
                    contenu: `
                    <h2>1. Les composants passifs</h2>
                    <p>Les composants passifs permettent notamment de limiter le courant, stocker temporairement de l'énergie ou filtrer les signaux.</p>

                    <h3>La résistance</h3>
                    <p>Elle limite le courant et provoque une chute de tension dans un circuit. Elle est notamment utilisée pour protéger une LED ou réaliser un diviseur de tension.</p>

                    <h3>Le condensateur</h3>
                    <p>Il stocke de l'énergie dans un champ électrique. Il peut lisser une alimentation, réduire certaines perturbations ou participer à un filtre.</p>
                    <p>La relation fondamentale est <strong>Q = C × U</strong>, où Q est la charge en coulombs et C la capacité en farads.</p>

                    <h3>La bobine ou inductance</h3>
                    <p>Elle stocke de l'énergie dans un champ magnétique et s'oppose aux variations rapides du courant. On la retrouve dans les filtres et les convertisseurs d'alimentation.</p>

                    <h3>Comparaison</h3>
                    <table>
                      <thead><tr><th>Composant</th><th>Symbole de grandeur</th><th>Unité</th><th>Utilisation</th></tr></thead>
                      <tbody>
                        <tr><td>Résistance</td><td>R</td><td>Ω</td><td>Limiter le courant</td></tr>
                        <tr><td>Condensateur</td><td>C</td><td>F</td><td>Filtrage, stockage</td></tr>
                        <tr><td>Bobine</td><td>L</td><td>H</td><td>Filtrage, conversion</td></tr>
                      </tbody>
                    </table>

                    <h3>Application aux systèmes embarqués</h3>
                    <p>Un condensateur de découplage placé près de l'alimentation d'un circuit intégré aide à réduire les variations rapides de tension. Sa valeur et son emplacement doivent respecter les recommandations du fabricant.</p>
                    `
                },
                {
                    id: "diodes-transistors",
                    titre: "2.2 - Diodes, LED et transistors",
                    contenu: `
                    <h2>2. Les composants semi-conducteurs</h2>

                    <h3>La diode</h3>
                    <p>Une diode conduit principalement dans le sens passant et bloque le courant dans le sens inverse, dans les limites de ses caractéristiques.</p>

                    <h3>La LED</h3>
                    <p>Une LED est une diode qui émet de la lumière lorsqu'elle est polarisée dans le sens passant. Elle possède une anode et une cathode.</p>
                    <p>Une résistance de limitation est généralement nécessaire. Par exemple, pour une alimentation de 5 V, une LED avec une chute de tension de 2 V et un courant visé de 10 mA :</p>
                    <pre><code>R = (Valimentation - VLED) / I
R = (5 - 2) / 0,010
R = 300 Ω</code></pre>
                    <p>On peut choisir une valeur normalisée adaptée, comme 330 Ω, après vérification du courant réel et des caractéristiques de la LED.</p>

                    <h3>Le transistor</h3>
                    <p>Un transistor peut fonctionner comme interrupteur électronique ou amplificateur. Dans un système embarqué, un transistor ou un MOSFET adapté peut permettre à une sortie de commande de piloter une charge plus importante que ce que la broche du microcontrôleur peut fournir.</p>

                    <h3>Schéma conceptuel d'une commande</h3>
                    <figure>
                      <svg viewBox="0 0 340 150" width="100%" role="img" aria-label="Microcontrôleur commandant une charge via un transistor">
                        <rect x="10" y="35" width="105" height="65" rx="8" fill="#e1eee6" stroke="#49735e" stroke-width="2"/>
                        <text x="62" y="61" text-anchor="middle" font-size="12" fill="#263f32">Microcontrôleur</text>
                        <text x="62" y="79" text-anchor="middle" font-size="11" fill="#263f32">GPIO</text>
                        <path d="M115 67 H155" stroke="#263f32" stroke-width="2.5"/>
                        <path d="M147 61 L157 67 L147 73" fill="none" stroke="#263f32" stroke-width="2.5"/>
                        <rect x="158" y="40" width="70" height="55" rx="8" fill="#f8eadb" stroke="#b67b4f" stroke-width="2"/>
                        <text x="193" y="63" text-anchor="middle" font-size="12" fill="#704524">Transistor</text>
                        <text x="193" y="79" text-anchor="middle" font-size="10" fill="#704524">Commande</text>
                        <path d="M228 67 H258" stroke="#263f32" stroke-width="2.5"/>
                        <path d="M250 61 L260 67 L250 73" fill="none" stroke="#263f32" stroke-width="2.5"/>
                        <rect x="260" y="40" width="70" height="55" rx="8" fill="#e7e9f8" stroke="#747db6" stroke-width="2"/>
                        <text x="295" y="63" text-anchor="middle" font-size="12" fill="#353d78">Charge</text>
                        <text x="295" y="79" text-anchor="middle" font-size="10" fill="#353d78">Moteur, etc.</text>
                        <text x="170" y="125" text-anchor="middle" font-size="11" fill="#263f32">Schéma fonctionnel simplifié</text>
                      </svg>
                    </figure>
                    <p><strong>Attention :</strong> le schéma est fonctionnel et ne constitue pas un câblage complet. Le choix du transistor, de l'alimentation et des protections dépend de la charge.</p>
                    `
                }
            ],
            quiz: [
                {
                    question: "Quel composant est utilisé pour limiter le courant dans une LED ?",
                    options: ["Une résistance", "Une antenne", "Un fusible logiciel"],
                    bonneReponse: 0
                },
                {
                    question: "Quel est le rôle possible d'un condensateur ?",
                    options: ["Stocker de l'énergie électrique", "Exécuter un programme", "Mesurer une adresse IP"],
                    bonneReponse: 0
                },
                {
                    question: "À quoi peut servir un transistor dans un système embarqué ?",
                    options: ["À commander une charge", "À remplacer tous les capteurs", "À créer automatiquement une connexion Wi-Fi"],
                    bonneReponse: 0
                }
            ]
        },

        // ==================================================
        // MODULE 3 : CIRCUITS ELECTRIQUES
        // ==================================================
        {
            id: "circuits-electriques",
            titre: "Module 3 : Analyse des circuits électriques",
            parties: [
                {
                    id: "series-parallele",
                    titre: "3.1 - Associations en série et en parallèle",
                    contenu: `
                    <h2>1. Circuits en série et en parallèle</h2>

                    <h3>Résistances en série</h3>
                    <p>Le même courant traverse chaque résistance. La résistance équivalente est la somme des résistances :</p>
                    <div class="formule"><strong>R équivalente = R1 + R2 + ... + Rn</strong></div>
                    <p>Exemple : deux résistances de 100 Ω et 220 Ω en série donnent 320 Ω.</p>

                    <h3>Résistances en parallèle</h3>
                    <p>La tension est identique aux bornes des branches en parallèle. Pour deux résistances :</p>
                    <div class="formule"><strong>1 / R équivalente = 1 / R1 + 1 / R2</strong></div>
                    <p>Exemple : deux résistances de 100 Ω en parallèle donnent une résistance équivalente de 50 Ω.</p>

                    <h3>Diviseur de tension</h3>
                    <p>Deux résistances en série peuvent fournir une tension intermédiaire :</p>
                    <pre><code>Vsortie = Ventree × R2 / (R1 + R2)</code></pre>
                    <p>Avec Ventree = 5 V, R1 = 10 kΩ et R2 = 10 kΩ, la sortie idéale vaut 2,5 V, si la charge ne perturbe pas le diviseur.</p>

                    <h3>Pourquoi est-ce utile en IoT ?</h3>
                    <p>Un diviseur de tension peut adapter un signal à une entrée de mesure, mais il faut vérifier l'impédance, les limites de tension et les caractéristiques de l'entrée du microcontrôleur. Il ne remplace pas automatiquement un circuit d'adaptation adapté.</p>
                    `
                },
                {
                    id: "kirchhoff-filtres",
                    titre: "3.2 - Lois de Kirchhoff et filtres RC",
                    contenu: `
                    <h2>2. Lois de Kirchhoff</h2>

                    <h3>Loi des nœuds</h3>
                    <p>La somme des courants entrants dans un nœud est égale à la somme des courants sortants.</p>
                    <pre><code>I1 + I2 = I3</code></pre>

                    <h3>Loi des mailles</h3>
                    <p>Dans une maille fermée, la somme algébrique des tensions est nulle.</p>
                    <pre><code>Usource - U1 - U2 = 0</code></pre>

                    <h3>Filtre RC</h3>
                    <p>Un filtre RC utilise une résistance et un condensateur. Il peut atténuer certaines variations rapides d'un signal.</p>
                    <p>Pour un filtre RC passe-bas du premier ordre, la fréquence de coupure idéale est :</p>
                    <div class="formule"><strong>fc = 1 / (2 × π × R × C)</strong></div>
                    <p>Avec R = 1 kΩ et C = 100 µF, on obtient fc ≈ 1,59 Hz.</p>

                    <p>Ce type de filtre peut être utile pour lisser un signal lent ou réduire certaines fluctuations. Il ne supprime pas toutes les perturbations et doit être choisi selon la fréquence utile du signal.</p>

                   `
                }
            ],
            quiz: [
                {
                    question: "Comment calcule-t-on la résistance équivalente de résistances en série ?",
                    options: ["On additionne les résistances", "On multiplie toujours les résistances", "On prend toujours la plus petite"],
                    bonneReponse: 0
                },
                {
                    question: "Dans un montage en parallèle, quelle grandeur est identique aux bornes de chaque branche idéale ?",
                    options: ["La tension", "La résistance", "La puissance"],
                    bonneReponse: 0
                },
                {
                    question: "Que décrit la loi des nœuds de Kirchhoff ?",
                    options: ["La conservation du courant à un nœud", "La vitesse du processeur", "La fréquence Wi-Fi"],
                    bonneReponse: 0
                }
            ]
        },

        // ==================================================
        // MODULE 4 : ELECTRONIQUE NUMERIQUE
        // ==================================================
        {
            id: "electronique-numerique",
            titre: "Module 4 : Électronique numérique et systèmes embarqués",
            parties: [
                {
                    id: "binaire-logique",
                    titre: "4.1 - Binaire et portes logiques",
                    contenu: `
                    <h2>1. De l'analogique au numérique</h2>
                    <p>Un signal analogique peut prendre une plage continue de valeurs. Un signal numérique est représenté par des niveaux discrets, souvent associés aux états logiques 0 et 1.</p>

                    <h3>Le système binaire</h3>
                    <p>Le binaire utilise uniquement les chiffres 0 et 1. Un bit représente un chiffre binaire. Un octet contient 8 bits.</p>
                    <p>Exemple : le nombre décimal 5 s'écrit 101 en binaire.</p>

                    <h3>Portes logiques</h3>
                    <ul>
                        <li><strong>ET (AND) :</strong> la sortie vaut 1 si toutes les entrées valent 1.</li>
                        <li><strong>OU (OR) :</strong> la sortie vaut 1 si au moins une entrée vaut 1.</li>
                        <li><strong>NON (NOT) :</strong> inverse l'état logique de l'entrée.</li>
                        <li><strong>OU exclusif (XOR) :</strong> la sortie vaut 1 si les deux entrées sont différentes.</li>
                    </ul>

                    <h3>Table de vérité de ET</h3>
                    <table>
                      <thead><tr><th>A</th><th>B</th><th>A ET B</th></tr></thead>
                      <tbody>
                        <tr><td>0</td><td>0</td><td>0</td></tr>
                        <tr><td>0</td><td>1</td><td>0</td></tr>
                        <tr><td>1</td><td>0</td><td>0</td></tr>
                        <tr><td>1</td><td>1</td><td>1</td></tr>
                      </tbody>
                    </table>

                    <p>Ces notions sont utilisées dans les circuits logiques, les processeurs, les contrôleurs et les systèmes numériques.</p>
                    `
                },
                {
                    id: "gpio-adc-pwm",
                    titre: "4.2 - GPIO, ADC et PWM",
                    contenu: `
                    <h2>2. Les interfaces d'un microcontrôleur</h2>

                    <h3>GPIO</h3>
                    <p>Une broche GPIO peut être configurée en entrée ou en sortie numérique. Elle permet, par exemple, de lire un bouton ou de commander une LED.</p>

                    <h3>Convertisseur analogique-numérique (ADC)</h3>
                    <p>Un ADC convertit une tension analogique en une valeur numérique. Avec un convertisseur idéal de N bits, on dispose de 2<sup>N</sup> codes possibles.</p>
                    <p>Un ADC de 10 bits fournit 1024 codes, de 0 à 1023. La tension représentée dépend de la référence de tension, de la résolution et de l'architecture du convertisseur.</p>

                    <h3>PWM : modulation de largeur d'impulsion</h3>
                    <p>La PWM génère un signal qui alterne entre deux niveaux. Le rapport cyclique est la proportion de la période pendant laquelle le signal est à l'état haut.</p>
                    <pre><code>Rapport cyclique = Temps à l'état haut / Période × 100 %</code></pre>
                    <p>Une PWM peut contrôler la luminosité apparente d'une LED ou la vitesse d'un moteur, à condition d'utiliser un circuit de commande adapté à la charge.</p>

                    <h3>Illustration d'un signal PWM</h3>
                    <figure>
                      <svg viewBox="0 0 340 145" width="100%" role="img" aria-label="Signal PWM avec rapport cyclique de cinquante pour cent">
                        <rect x="8" y="8" width="324" height="129" rx="10" fill="#f0f4fa" stroke="#9aaec7"/>
                        <path d="M30 25 V112 H310" fill="none" stroke="#52667e" stroke-width="1.5"/>
                        <path d="M30 42 H85 V95 H140 V42 H195 V95 H250 V42 H305" fill="none" stroke="#267e59" stroke-width="3"/>
                        <text x="38" y="20" font-size="10" fill="#263f32">Niveau haut</text>
                        <text x="38" y="126" font-size="10" fill="#263f32">Temps</text>
                        <text x="170" y="70" font-size="12" fill="#263f32">PWM</text>
                      </svg>
                      <figcaption>Un signal PWM alterne entre un niveau haut et un niveau bas.</figcaption>
                    </figure>

                    <h3>Vidéo : ADC et PWM</h3>
                    <p>Cette vidéo explique l'utilisation d'entrées analogiques et de la PWM sur Arduino. Elle est en anglais.</p>
                    <iframe src="https://www.youtube-nocookie.com/embed/GQV0ElK0Nv4?enablejsapi=1" 
                    class="video-cours"
                    title="Arduino : ADC, PWM et signaux électroniques" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="width:100%; aspect-ratio:16/9; border:0; border-radius:12px;"></iframe>
                    `
                }
            ],
            quiz: [
                {
                    question: "Combien de codes différents peut représenter un ADC idéal de 10 bits ?",
                    options: ["10", "100", "1024"],
                    bonneReponse: 2
                },
                {
                    question: "À quoi sert une broche GPIO configurée en entrée ?",
                    options: ["À lire un état logique", "À augmenter automatiquement la tension d'alimentation", "À remplacer une batterie"],
                    bonneReponse: 0
                },
                {
                    question: "Que permet notamment la PWM ?",
                    options: ["De contrôler la puissance moyenne appliquée à une charge adaptée", "De convertir directement toute tension en Wi-Fi", "De supprimer le besoin d'alimentation"],
                    bonneReponse: 0
                }
            ]
        },

        // ==================================================
        // MODULE 5 : CAPTEURS, ACTIONNEURS ET IOT
        // ==================================================
        {
            id: "capteurs-actionneurs-iot",
            titre: "Module 5 : Capteurs, actionneurs et Internet des objets",
            parties: [
                {
                    id: "capteurs-electroniques",
                    titre: "5.1 - Capteurs et acquisition des données",
                    contenu: `
                    <h2>1. Les capteurs électroniques</h2>
                    <p>Un capteur transforme une grandeur physique en un signal exploitable par un système électronique.</p>

                    <h3>Exemples de capteurs</h3>
                    <ul>
                        <li>Température : thermistance, capteur intégré ou capteur numérique.</li>
                        <li>Lumière : photorésistance ou photodiode.</li>
                        <li>Distance : capteur ultrasonique ou télémètre.</li>
                        <li>Humidité : capteur analogique ou numérique.</li>
                        <li>Mouvement : accéléromètre ou gyroscope.</li>
                    </ul>

                    <h3>Capteurs analogiques et numériques</h3>
                    <p>Un capteur analogique fournit un signal variable qui peut nécessiter un conditionnement et une conversion ADC. Un capteur numérique transmet une donnée selon une interface définie, par exemple I²C, SPI ou UART.</p>

                    <h3>Chaîne d'acquisition</h3>
                    <figure>
                      <svg viewBox="0 0 340 200" width="100%" role="img" aria-label="Chaîne de mesure d'un capteur vers une application IoT">
                        <rect x="15" y="20" width="135" height="43" rx="8" fill="#e3efe7" stroke="#59806a" stroke-width="2"/>
                        <text x="82" y="38" text-anchor="middle" font-size="12" fill="#263f32">Grandeur physique</text>
                        <text x="82" y="52" text-anchor="middle" font-size="10" fill="#263f32">Température, lumière...</text>
                        <path d="M82 63 V84" stroke="#263f32" stroke-width="2"/>
                        <path d="M76 78 L82 86 L88 78" fill="none" stroke="#263f32" stroke-width="2"/>
                        <rect x="15" y="87" width="135" height="35" rx="8" fill="#e7e9f8" stroke="#747db6" stroke-width="2"/>
                        <text x="82" y="108" text-anchor="middle" font-size="12" fill="#353d78">Capteur</text>
                        <path d="M150 105 H187" stroke="#263f32" stroke-width="2"/>
                        <path d="M179 99 L189 105 L179 111" fill="none" stroke="#263f32" stroke-width="2"/>
                        <rect x="190" y="87" width="135" height="35" rx="8" fill="#f8eadb" stroke="#b67b4f" stroke-width="2"/>
                        <text x="257" y="108" text-anchor="middle" font-size="12" fill="#704524">Microcontrôleur</text>
                        <path d="M257 122 V143" stroke="#263f32" stroke-width="2"/>
                        <path d="M251 137 L257 145 L263 137" fill="none" stroke="#263f32" stroke-width="2"/>
                        <rect x="190" y="147" width="135" height="35" rx="8" fill="#e3efe7" stroke="#59806a" stroke-width="2"/>
                        <text x="257" y="168" text-anchor="middle" font-size="12" fill="#263f32">Réseau / Application</text>
                      </svg>
                      <figcaption>Le microcontrôleur traite les données avant leur transmission éventuelle.</figcaption>
                    </figure>

                    <h3>Échantillonnage</h3>
                    <p>Un système d'acquisition mesure le signal à des instants déterminés. La fréquence d'échantillonnage doit être adaptée à la vitesse de variation du phénomène et aux objectifs de mesure.</p>
                    `
                },
                {
                    id: "actionneurs-communication",
                    titre: "5.2 - Actionneurs et objets connectés",
                    contenu: `
                    <h2>2. Des mesures aux actions</h2>
                    <p>Un actionneur convertit une commande en action physique. Exemples : LED, relais, moteur, buzzer, vanne et ventilateur.</p>

                    <h3>Le rôle du microcontrôleur</h3>
                    <ol>
                      <li>Lire les données d'un ou plusieurs capteurs.</li>
                      <li>Traiter les mesures et appliquer une logique de décision.</li>
                      <li>Commander un actionneur par une sortie ou un circuit de puissance.</li>
                      <li>Transmettre éventuellement les données à une application.</li>
                    </ol>

                    <h3>Communication IoT</h3>
                    <p>Les objets connectés peuvent communiquer en Wi-Fi, Bluetooth Low Energy, Zigbee, LoRaWAN ou par d'autres technologies selon leur portée, leur consommation et leur débit.</p>
                    <p>Des protocoles applicatifs comme MQTT ou HTTP peuvent transporter des données vers un serveur ou une plateforme IoT.</p>

                    <h3>Exemple : surveillance de température</h3>
                    <p>Un capteur mesure la température. Le microcontrôleur compare la mesure à un seuil. Si la température dépasse ce seuil, il peut commander un ventilateur et transmettre une alerte.</p>

                    <h3>Points à vérifier</h3>
                    <ul>
                      <li>Compatibilité des tensions entre capteur et carte.</li>
                      <li>Courant maximal admissible sur les broches.</li>
                      <li>Consommation et autonomie de la batterie.</li>
                      <li>Fiabilité de la communication et protection des données.</li>
                    </ul>
                    `
                }
            ],
            quiz: [
                {
                    question: "Quel est le rôle d'un capteur ?",
                    options: ["Mesurer une grandeur physique et produire un signal", "Stocker uniquement des pages Web", "Remplacer le système d'exploitation"],
                    bonneReponse: 0
                },
                {
                    question: "Quel protocole est souvent utilisé pour la messagerie IoT légère de type publication/abonnement ?",
                    options: ["MQTT", "HDMI", "VGA"],
                    bonneReponse: 0
                },
                {
                    question: "Pourquoi faut-il vérifier le courant maximal d'une broche GPIO ?",
                    options: ["Pour éviter d'endommager le microcontrôleur", "Pour accélérer le Wi-Fi", "Pour augmenter la mémoire RAM"],
                    bonneReponse: 0
                }
            ]
        },

        // ==================================================
        // MODULE 6 : MINI-PROJET
        // ==================================================
        {
            id: "mini-projet-embarque",
            titre: "Module 6 : Mini-projet de système embarqué",
            parties: [
                {
                    id: "projet-led",
                    titre: "6.1 - Commander une LED avec un microcontrôleur",
                    contenu: `
                    <h2>Mini-projet : commander une LED</h2>
                    <p><strong>Objectif :</strong> comprendre le lien entre alimentation, résistance, sortie numérique et programme embarqué.</p>

                    <h3>Matériel pédagogique</h3>
                    <ul>
                      <li>Une carte de développement compatible Arduino.</li>
                      <li>Une LED adaptée à la tension du circuit.</li>
                      <li>Une résistance de limitation calculée.</li>
                      <li>Une plaque d'essai et des fils de connexion.</li>
                    </ul>

                    <h3>Principe</h3>
                    <p>La sortie numérique commande l'état de la LED. La résistance limite le courant. La broche choisie et les limites électriques doivent correspondre à la documentation de la carte.</p>

                    <h3>Exemple de programme Arduino</h3>
                    <pre><code>const int ledPin = 8;

void setup() {
  pinMode(ledPin, OUTPUT);
}

void loop() {
  digitalWrite(ledPin, HIGH);
  delay(1000);

  digitalWrite(ledPin, LOW);
  delay(1000);
}</code></pre>

                    <p>Le programme allume la LED pendant une seconde, puis l'éteint pendant une seconde, et recommence.</p>

                    <h3>Explication du programme</h3>
                    <ul>
                      <li><code>ledPin</code> contient le numéro de la broche utilisée.</li>
                      <li><code>setup()</code> s'exécute au démarrage.</li>
                      <li><code>pinMode()</code> configure la broche en sortie.</li>
                      <li><code>digitalWrite()</code> place la sortie à l'état haut ou bas.</li>
                      <li><code>delay(1000)</code> attend environ 1000 millisecondes.</li>
                    </ul>

                    <p>Ce code est un exemple pédagogique : adapte le numéro de broche, le câblage et la résistance à la carte réellement utilisée.</p>
                    `
                },
                {
                    id: "securite-mesures",
                    titre: "6.2 - Mesures et sécurité électrique",
                    contenu: `
                    <h2>Mesurer et sécuriser un circuit</h2>

                    <h3>Utilisation du multimètre</h3>
                    <ul>
                      <li><strong>Tension :</strong> mesurer en parallèle entre les deux points concernés.</li>
                      <li><strong>Courant :</strong> insérer l'appareil en série, en choisissant la borne et le calibre appropriés.</li>
                      <li><strong>Résistance :</strong> mesurer sur un circuit hors tension, en isolant si nécessaire le composant pour obtenir une mesure correcte.</li>
                    </ul>

                    <h3>Précautions importantes</h3>
                    <ul>
                      <li>Couper l'alimentation avant de modifier le câblage.</li>
                      <li>Vérifier la polarité des LED, diodes et condensateurs polarisés.</li>
                      <li>Ne jamais dépasser les tensions ou courants admissibles des composants.</li>
                      <li>Ne jamais mesurer un courant en plaçant le multimètre configuré en ampèremètre directement aux bornes d'une alimentation.</li>
                      <li>Les expériences de ce cours doivent se limiter à des circuits basse tension sécurisés. Ne pas manipuler le secteur sans formation, équipement et supervision appropriés.</li>
                    </ul>

                    <h3>Exercice de synthèse</h3>
                    <p>Tu dois concevoir un objet connecté qui mesure la luminosité et allume une LED lorsqu'il fait sombre.</p>
                    <ol>
                      <li>Choisir un capteur de lumière.</li>
                      <li>Déterminer si sa sortie est analogique ou numérique.</li>
                      <li>Choisir une carte compatible avec le capteur.</li>
                      <li>Vérifier la compatibilité des tensions et le courant de la LED.</li>
                      <li>Programmer la lecture du capteur et la commande de la LED.</li>
                      <li>Tester plusieurs niveaux de luminosité et documenter les résultats.</li>
                    </ol>
                    <p>Ce mini-projet réunit les notions de circuits, capteurs, conversion des signaux et programmation embarquée.</p>
                    `
                }
            ],
            quiz: [
                {
                    question: "Pourquoi place-t-on une résistance en série avec une LED dans un montage courant ?",
                    options: ["Pour limiter le courant", "Pour créer un réseau Wi-Fi", "Pour mesurer la température"],
                    bonneReponse: 0
                },
                {
                    question: "Comment mesure-t-on généralement une tension avec un multimètre ?",
                    options: ["En parallèle entre deux points", "En série uniquement", "En retirant toujours la batterie du multimètre"],
                    bonneReponse: 0
                },
                {
                    question: "Que faut-il vérifier avant de connecter un capteur à une carte ?",
                    options: ["La compatibilité des tensions et des interfaces", "La couleur de l'écran uniquement", "Le nom du fichier HTML"],
                    bonneReponse: 0
                }
            ]
        }
    ],

    quizFinal: [
        {
            question: "Quelle relation représente la loi d'Ohm ?",
            options: ["U = R × I", "U = R + I", "U = I / R"],
            bonneReponse: 0
        },
        {
            question: "Quel composant est généralement utilisé pour limiter le courant d'une LED ?",
            options: ["Un condensateur seul", "Une résistance", "Une antenne"],
            bonneReponse: 1
        },
        {
            question: "Quelle est la résistance équivalente de deux résistances de 100 Ω en série ?",
            options: ["50 Ω", "100 Ω", "200 Ω"],
            bonneReponse: 2
        },
        {
            question: "Que réalise un ADC ?",
            options: ["La conversion d'un signal analogique en valeur numérique", "La conversion d'un programme en résistance", "La transmission obligatoire par Wi-Fi"],
            bonneReponse: 0
        },
        {
            question: "Quel composant permet de mesurer une grandeur physique comme la température ?",
            options: ["Un capteur", "Une résistance de protection seule", "Un connecteur USB seul"],
            bonneReponse: 0
        },
        {
            question: "À quoi peut servir la PWM dans un système embarqué ?",
            options: ["À régler la commande d'une charge compatible", "À remplacer toutes les alimentations", "À augmenter la tension sans circuit"],
            bonneReponse: 0
        },
        {
            question: "Quel protocole est souvent employé pour transmettre des messages dans des systèmes IoT ?",
            options: ["MQTT", "JPEG", "HDMI"],
            bonneReponse: 0
        },
        {
            question: "Quelle précaution est essentielle avant de mesurer une résistance avec un multimètre ?",
            options: ["Mettre le circuit hors tension", "Augmenter la tension au maximum", "Court-circuiter l'alimentation"],
            bonneReponse: 0
        }
    ]
}

};
