document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchInput');
    const genreLinks = document.querySelectorAll('.genre-link');
    const booksGrid = document.getElementById('booksGrid');

    const allBookCards = Array.from(booksGrid.children);
    let selectedGenre = 'all';

    searchInput.addEventListener('input', function () {
        filterBooks();
    });

    genreLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            selectedGenre = e.target.dataset.genre;
            filterBooks();
        });
    });

    function filterBooks() {
        const query = searchInput.value.toLowerCase();

        const filteredBooks = allBookCards.filter(bookCard => {
            const title = bookCard.querySelector('h3').innerText.toLowerCase();
            const genre = bookCard.querySelector('p:nth-of-type(2)').innerText.toLowerCase();

            const matchesGenre = selectedGenre === 'all' || genre === selectedGenre;
            const matchesQuery = title.includes(query);

            return matchesGenre && matchesQuery;
        });

        booksGrid.innerHTML = '';
        if (filteredBooks.length > 0) {
            filteredBooks.forEach(bookCard => booksGrid.appendChild(bookCard));
        } else {
            booksGrid.innerHTML = '<p>No books found.</p>';
        }
    }
});
