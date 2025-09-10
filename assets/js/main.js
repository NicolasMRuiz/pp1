// Configuración de la API de Google Books
const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1';

// Estado global de la aplicación
let currentTheme = localStorage.getItem('theme') || 'light';
let currentPage = 1;
let booksPerPage = 12;
let currentSearch = '';
let currentGenre = '';

// Géneros predefinidos con términos de búsqueda
const GENRES = {
    'Ficción': 'fiction',
    'Ciencia Ficción': 'science fiction',
    'Romance': 'romance',
    'Misterio': 'mystery',
    'Fantasía': 'fantasy',
    'Historia': 'history',
    'Biografía': 'biography',
    'Ciencia': 'science',
    'Tecnología': 'technology',
    'Filosofía': 'philosophy',
    'Psicología': 'psychology',
    'Cocina': 'cooking',
    'Viajes': 'travel',
    'Arte': 'art',
    'Música': 'music',
    'Deportes': 'sports'
};

// Autores populares predefinidos
const POPULAR_AUTHORS = [
    'J.K. Rowling',
    'Stephen King',
    'Agatha Christie',
    'William Shakespeare',
    'Jane Austen',
    'Charles Dickens',
    'Mark Twain',
    'Ernest Hemingway',
    'F. Scott Fitzgerald',
    'Virginia Woolf',
    'George Orwell',
    'Aldous Huxley',
    'J.R.R. Tolkien',
    'C.S. Lewis',
    'Harper Lee'
];

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeNavigation();
    initializeEventListeners();
    
    // Cargar contenido según la página actual
    const path = window.location.pathname;
    if (path.endsWith('/index.html') || path === '/' || path.endsWith('/pp1/')) {
    loadHomePage();
    } else if (path.includes('/list.html')) {
        loadListPage();
    } else if (path.includes('/book.html')) {
        loadBookPage();
    } else if (path.includes('/contact.html')) {
        loadContactPage();
    }
});

// Inicializar tema
function initializeTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    const themeSwitch = document.getElementById('theme-switch');
    if (themeSwitch) {
        themeSwitch.checked = currentTheme === 'dark';
    }
}

// Inicializar navegación
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
}

// Inicializar event listeners
function initializeEventListeners() {
    // Theme switch
    const themeSwitch = document.getElementById('theme-switch');
    if (themeSwitch) {
        themeSwitch.addEventListener('change', toggleTheme);
    }
    
    // Formulario de contacto
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
    
    // Botón "Ver más" géneros
    const btnMore = document.querySelector('.btn-more');
    if (btnMore) {
        btnMore.addEventListener('click', toggleGenres);
    }
}

// Cambiar tema
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
}

// Cargar página de inicio
async function loadHomePage() {
    try {
        // Cargar libros destacados para el carrusel
        await loadFeaturedBooks();
        
        // Cargar géneros
        await loadGenres();
        
        // Cargar autores populares
        loadPopularAuthors();
        
    } catch (error) {
        console.error('Error cargando página de inicio:', error);
        showError('Error al cargar la página de inicio');
    }
}

// Cargar libros destacados
async function loadFeaturedBooks() {
    const carouselContainer = document.querySelector('.carousel-container');
    if (!carouselContainer) return;
    
    try {
        const featuredBooks = await searchBooks('bestseller', 5);
        displayCarousel(featuredBooks);
    } catch (error) {
        console.error('Error cargando libros destacados:', error);
        // Mostrar libros de ejemplo si falla la API
        displayCarousel(getSampleBooks());
    }
}

// Mostrar carrusel
function displayCarousel(books) {
    const carouselContainer = document.querySelector('.carousel-container');
    if (!carouselContainer) return;
    
    carouselContainer.innerHTML = '';
    
    books.forEach((book, index) => {
        const carouselItem = document.createElement('div');
        carouselItem.className = 'carousel-item';
        
        const imageUrl = book.volumeInfo.imageLinks?.thumbnail || 
                        book.volumeInfo.imageLinks?.smallThumbnail || 
                        'assets/img/default-cover.jpg';
        
        carouselItem.innerHTML = `
            <img src="${imageUrl}" alt="${book.volumeInfo.title}" onerror="this.src='assets/img/default-cover.jpg'">
            <div class="carousel-overlay">
                <div class="carousel-title">${book.volumeInfo.title}</div>
                <div class="carousel-author">${book.volumeInfo.authors?.join(', ') || 'Autor desconocido'}</div>
            </div>
        `;
        
        carouselItem.addEventListener('click', () => {
            window.location.href = `book.html?id=${book.id}`;
        });
        
        carouselContainer.appendChild(carouselItem);
    });
    
    // Inicializar navegación del carrusel
    initializeCarouselNavigation();
}

// Inicializar navegación del carrusel
function initializeCarouselNavigation() {
    const carousel = document.querySelector('.carousel');
    const container = document.querySelector('.carousel-container');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    
    if (!carousel || !container || !prevBtn || !nextBtn) return;
    
    let currentIndex = 0;
    const totalItems = container.children.length;
    
    function updateCarousel() {
        const translateX = -currentIndex * 100;
        container.style.transform = `translateX(${translateX}%)`;
    }
    
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        updateCarousel();
    });
    
    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
    });
    
    // Auto-play
    setInterval(() => {
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
    }, 5000);
}

// Cargar géneros
async function loadGenres() {
    const genresGrid = document.querySelector('.genres-grid');
    const genresExpanded = document.querySelector('.genres-expanded');
    if (!genresGrid) return;
    
    const genreEntries = Object.entries(GENRES);
    const initialGenres = genreEntries.slice(0, 8);
    const remainingGenres = genreEntries.slice(8);
    
    // Mostrar géneros iniciales
    genresGrid.innerHTML = '';
    for (const [genreName, searchTerm] of initialGenres) {
        const genreCard = await createGenreCard(genreName, searchTerm);
        genresGrid.appendChild(genreCard);
    }
    
    // Preparar géneros expandidos
    if (genresExpanded && remainingGenres.length > 0) {
        genresExpanded.innerHTML = '';
        for (const [genreName, searchTerm] of remainingGenres) {
            const genreCard = await createGenreCard(genreName, searchTerm);
            genresExpanded.appendChild(genreCard);
        }
    }
}

// Crear tarjeta de género
async function createGenreCard(genreName, searchTerm) {
    const genreCard = document.createElement('div');
    genreCard.className = 'genre-card';
    
    try {
        // Buscar un libro representativo del género
        const books = await searchBooks(searchTerm, 1);
        const book = books[0];
        const imageUrl = book?.volumeInfo.imageLinks?.thumbnail || 
                        book?.volumeInfo.imageLinks?.smallThumbnail || 
                        'assets/img/default-cover.jpg';
        
        genreCard.innerHTML = `
            <img src="${imageUrl}" alt="${genreName}" class="genre-image" onerror="this.src='assets/img/default-cover.jpg'">
            <div class="genre-name">${genreName}</div>
        `;
    } catch (error) {
        genreCard.innerHTML = `
            <img src="assets/img/default-cover.jpg" alt="${genreName}" class="genre-image">
            <div class="genre-name">${genreName}</div>
        `;
    }
    
    genreCard.addEventListener('click', () => {
        window.location.href = `list.html?genre=${encodeURIComponent(genreName)}&search=${encodeURIComponent(searchTerm)}`;
    });
    
    return genreCard;
}

// Alternar géneros expandidos
function toggleGenres() {
    const genresExpanded = document.querySelector('.genres-expanded');
    const btnMore = document.querySelector('.btn-more');
    
    if (genresExpanded && btnMore) {
        genresExpanded.classList.toggle('active');
        btnMore.textContent = genresExpanded.classList.contains('active') ? 'Ver menos' : 'Ver más';
    }
}

// Cargar autores populares
function loadPopularAuthors() {
    const authorsList = document.querySelector('.authors-list');
    if (!authorsList) return;
    
    authorsList.innerHTML = '';
    
    POPULAR_AUTHORS.forEach((author, index) => {
        const authorItem = document.createElement('div');
        authorItem.className = 'author-item';
        
        authorItem.innerHTML = `
            <div class="author-number">${index + 1}</div>
            <div class="author-name">${author}</div>
        `;
        
        authorItem.addEventListener('click', () => {
            window.location.href = `list.html?author=${encodeURIComponent(author)}`;
        });
        
        authorsList.appendChild(authorItem);
    });
}

// Cargar página de lista
async function loadListPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const genre = urlParams.get('genre');
    const author = urlParams.get('author');
    const search = urlParams.get('search');
    
    // Actualizar título de la página
    const pageTitle = document.querySelector('h1');
    if (pageTitle) {
        if (genre) {
            pageTitle.textContent = `Libros de ${genre}`;
        } else if (author) {
            pageTitle.textContent = `Libros de ${author}`;
        } else {
            pageTitle.textContent = 'Todos los libros';
        }
    }
    
    try {
        let searchTerm = '';
        if (genre && search) {
            searchTerm = search;
        } else if (author) {
            searchTerm = `inauthor:"${author}"`;
        } else {
            searchTerm = 'bestseller';
        }
        
        await loadBooks(searchTerm);
    } catch (error) {
        console.error('Error cargando lista de libros:', error);
        showError('Error al cargar los libros');
    }
}

// Cargar libros
async function loadBooks(searchTerm, page = 1) {
    const booksGrid = document.querySelector('.books-grid');
    if (!booksGrid) return;
    
    try {
        const startIndex = (page - 1) * booksPerPage;
        const books = await searchBooks(searchTerm, booksPerPage, startIndex);
        
        if (page === 1) {
            booksGrid.innerHTML = '';
        }
        
        if (books.length === 0) {
            booksGrid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; color: var(--text-secondary);">No se encontraron libros</p>';
            return;
        }
        
        books.forEach(book => {
            const bookCard = createBookCard(book);
            booksGrid.appendChild(bookCard);
        });
        
        // Mostrar botón "Cargar más" si hay más libros
        if (books.length === booksPerPage) {
            showLoadMoreButton(searchTerm, page + 1);
        }
        
    } catch (error) {
        console.error('Error cargando libros:', error);
        showError('Error al cargar los libros');
    }
}

// Crear tarjeta de libro
function createBookCard(book) {
    const bookCard = document.createElement('div');
    bookCard.className = 'book-card';
    
    const imageUrl = book.volumeInfo.imageLinks?.thumbnail || 
                    book.volumeInfo.imageLinks?.smallThumbnail || 
                    'assets/img/default-cover.jpg';
    
    const rating = book.volumeInfo.averageRating || 0;
    const stars = generateStars(rating);
    
    bookCard.innerHTML = `
        <img src="${imageUrl}" alt="${book.volumeInfo.title}" class="book-cover" onerror="this.src='assets/img/default-cover.jpg'">
        <div class="book-info">
            <div>
                <div class="book-title">${book.volumeInfo.title}</div>
                <div class="book-author">${book.volumeInfo.authors?.join(', ') || 'Autor desconocido'}</div>
                <div class="book-rating">
                    <div class="stars">${stars}</div>
                    <span>(${rating.toFixed(1)})</span>
                </div>
            </div>
            <div class="book-actions">
                <button class="btn-view" onclick="window.location.href='book.html?id=${book.id}'">Ver</button>
            </div>
        </div>
    `;
    
    return bookCard;
}

// Generar estrellas de rating
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '';
    
    // Estrellas llenas
    for (let i = 0; i < fullStars; i++) {
        stars += '<span class="star">★</span>';
    }
    
    // Media estrella
    if (hasHalfStar) {
        stars += '<span class="star">☆</span>';
    }
    
    // Estrellas vacías
    for (let i = 0; i < emptyStars; i++) {
        stars += '<span class="star empty">☆</span>';
    }
    
    return stars;
}

// Mostrar botón "Cargar más"
function showLoadMoreButton(searchTerm, nextPage) {
    const booksGrid = document.querySelector('.books-grid');
    if (!booksGrid) return;
    
    // Remover botón anterior si existe
    const existingBtn = document.querySelector('.load-more-btn');
    if (existingBtn) {
        existingBtn.remove();
    }
    
    const loadMoreBtn = document.createElement('button');
    loadMoreBtn.className = 'btn-more load-more-btn';
    loadMoreBtn.textContent = 'Cargar más libros';
    loadMoreBtn.style.gridColumn = '1 / -1';
    
    loadMoreBtn.addEventListener('click', () => {
        loadBooks(searchTerm, nextPage);
    });
    
    booksGrid.appendChild(loadMoreBtn);
}

// Cargar página de libro individual
async function loadBookPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');
    
    if (!bookId) {
        showError('ID de libro no proporcionado');
        return;
    }
    
    try {
        const book = await getBookById(bookId);
        displayBookDetail(book);
    } catch (error) {
        console.error('Error cargando libro:', error);
        showError('Error al cargar el libro');
    }
}

// Mostrar detalle del libro
function displayBookDetail(book) {
    const bookDetail = document.querySelector('.book-detail');
    if (!bookDetail) return;
    
    const imageUrl = book.volumeInfo.imageLinks?.thumbnail || 
                    book.volumeInfo.imageLinks?.smallThumbnail || 
                    'assets/img/default-cover.jpg';
    
    const rating = book.volumeInfo.averageRating || 0;
    const stars = generateStars(rating);
    
    bookDetail.innerHTML = `
        <div class="book-header">
            <img src="${imageUrl}" alt="${book.volumeInfo.title}" class="book-cover-large" onerror="this.src='assets/img/default-cover.jpg'">
            <div class="book-meta">
                <h2>${book.volumeInfo.title}</h2>
                <p><strong>Autor:</strong> ${book.volumeInfo.authors?.join(', ') || 'Autor desconocido'}</p>
                <div class="book-rating">
                    <div class="stars">${stars}</div>
                    <span>(${rating.toFixed(1)})</span>
                </div>
                ${book.volumeInfo.publishedDate ? `<p><strong>Publicado:</strong> ${new Date(book.volumeInfo.publishedDate).getFullYear()}</p>` : ''}
                ${book.volumeInfo.pageCount ? `<p><strong>Páginas:</strong> ${book.volumeInfo.pageCount}</p>` : ''}
            </div>
        </div>
        <div class="book-description">
            ${book.volumeInfo.description || 'No hay descripción disponible para este libro.'}
        </div>
    `;
}

// Cargar página de contacto
function loadContactPage() {
    // La página de contacto se carga estáticamente desde el HTML
    // Solo necesitamos manejar el formulario
}

// Manejar envío del formulario de contacto
function handleContactSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    // Validación básica
    if (!name || !email || !subject || !message) {
        showError('Por favor completa todos los campos');
        return;
    }
    
    if (!isValidEmail(email)) {
        showError('Por favor ingresa un email válido');
        return;
    }
    
    // Simular envío
    showSuccess('Mensaje enviado correctamente. Te responderemos pronto.');
    event.target.reset();
}

// Validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Funciones de la API de Google Books
async function searchBooks(query, maxResults = 10, startIndex = 0) {
    try {
        const response = await fetch(
            `${GOOGLE_BOOKS_API}/volumes?q=${encodeURIComponent(query)}&maxResults=${maxResults}&startIndex=${startIndex}`
        );
        
        if (!response.ok) {
            throw new Error('Error en la respuesta de la API');
        }
        
        const data = await response.json();
        return data.items || [];
    } catch (error) {
        console.error('Error buscando libros:', error);
        throw error;
    }
}

async function getBookById(bookId) {
    try {
        const response = await fetch(`${GOOGLE_BOOKS_API}/volumes/${bookId}`);
        
        if (!response.ok) {
            throw new Error('Error en la respuesta de la API');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error obteniendo libro:', error);
        throw error;
    }
}

// Libros de ejemplo para fallback
function getSampleBooks() {
    return [
        {
            id: 'sample1',
            volumeInfo: {
                title: 'El Señor de los Anillos',
                authors: ['J.R.R. Tolkien'],
                imageLinks: { thumbnail: 'assets/img/default-cover.jpg' },
                averageRating: 4.5
            }
        },
        {
            id: 'sample2',
            volumeInfo: {
                title: 'Harry Potter y la Piedra Filosofal',
                authors: ['J.K. Rowling'],
                imageLinks: { thumbnail: 'assets/img/default-cover.jpg' },
                averageRating: 4.8
            }
        },
        {
            id: 'sample3',
            volumeInfo: {
                title: '1984',
                authors: ['George Orwell'],
                imageLinks: { thumbnail: 'assets/img/default-cover.jpg' },
                averageRating: 4.3
            }
        }
    ];
}

// Funciones de utilidad
function showError(message) {
    // Implementar notificación de error
    alert(message);
}

function showSuccess(message) {
    // Implementar notificación de éxito
    alert(message);
}

// Función para manejar errores de imagen
function handleImageError(img) {
    img.src = 'assets/img/default-cover.jpg';
} 
