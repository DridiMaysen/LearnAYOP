// Petit utilitaire pour appeler les scripts PHP en AJAX de façon sécurisée.
// Il lit le jeton CSRF dans <meta name="csrf-token"> et l'envoie en en-tête.
//
// Exemple d'utilisation plus tard (enregistrer la progression) :
//   apiPost('api/progression.php', { cours: 'C002', element: 'partie-definition-sgbd' })
//       .then(function (reponse) { console.log(reponse); });
(function () {
    function jeton() {
        var m = document.querySelector('meta[name="csrf-token"]');
        return m ? m.content : '';
    }

    window.apiPost = function (url, donnees) {
        return fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': jeton() },
            body: JSON.stringify(donnees || {})
        }).then(function (reponse) {
            if (reponse.status === 401) { location.href = 'login.php'; return Promise.reject(); }
            return reponse.json();
        });
    };

    window.apiGet = function (url) {
        return fetch(url, { credentials: 'same-origin' }).then(function (reponse) {
            if (reponse.status === 401) { location.href = 'login.php'; return Promise.reject(); }
            return reponse.json();
        });
    };
})();