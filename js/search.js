(function () {
    const input = document.getElementById('search-input');
    const levelSelect = document.getElementById('filter-level');
    const subjectSelect = document.getElementById('filter-subject');
    const resetBtn = document.getElementById('reset-filters');
    const cards = document.querySelectorAll('.course-card');
    const noResults = document.getElementById('no-results');

    function normalize(text) {
        return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }
    function filterCourses() {
        const query = normalize(input.value.trim());
        const level = levelSelect.value;
        const subject = subjectSelect.value;
        let visible = 0;
        cards.forEach(function (card) {
            const matchText = normalize(card.textContent + ' ' + card.dataset.id).includes(query);
            const matchLevel = !level || card.dataset.niveau === level;
            const matchSubject = !subject || card.dataset.matiere === subject;
            const show = matchText && matchLevel && matchSubject;
            card.style.display = show ? '' : 'none';
            if (show) visible++;
        });
        noResults.style.display = visible === 0 ? 'block' : 'none';
    }
    input.addEventListener('input', filterCourses);
    levelSelect.addEventListener('change', filterCourses);
    subjectSelect.addEventListener('change', filterCourses);
    resetBtn.addEventListener('click', function () {
        input.value = '';
        levelSelect.value = '';
        subjectSelect.value = '';
        filterCourses();
    });
})();