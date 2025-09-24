# 📚 Biblioteca Beltrán

Una biblioteca digital moderna y responsiva que consume información desde la API de Google Books. Desarrollada con HTML, CSS y JavaScript puro, con enfoque mobile-first.

## 🚀 Características

- **Diseño Mobile-First**: Optimizado para dispositivos móviles con diseño responsivo
- **Modo Oscuro/Claro**: Switch para cambiar entre temas
- **API de Google Books**: Contenido dinámico desde la API oficial de Google
- **Navegación Intuitiva**: Menú hamburguesa para móviles, navegación completa para desktop
- **Carrusel Interactivo**: Libros destacados con navegación automática
- **Géneros Categorizados**: Exploración por géneros literarios
- **Autores Populares**: Lista de los autores más reconocidos
- **Formulario de Contacto**: Con validación y oficinas en múltiples países

## 📱 Páginas Incluidas

### 1. Home Page (`index.html`)
- Navbar con logo y menú hamburguesa
- Carrusel de 5 libros destacados
- Grid de 8 géneros destacados (expandible)
- Lista de 15 autores populares
- Footer con switch de tema

### 2. List Page (`list.html`)
- Vista de tarjetas de libros
- Información: título, autor, rating con estrellas
- Botón "Ver" para acceder al detalle
- Paginación con "Cargar más"

### 3. Book Page (`book.html`)
- Vista detallada del libro seleccionado
- Imagen grande de portada
- Información completa: autor, rating, descripción
- Metadatos: año de publicación, páginas

### 4. Contact Page (`contact.html`)
- Formulario de contacto con validación
- Sección de oficinas en 4 ciudades (Comentado en el código)
- Información de contacto completa (Comentado en el código)

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica y accesible
- **CSS3**: 
  - Variables CSS para temas
  - Flexbox y Grid para layouts
  - Media queries para responsividad
  - Animaciones y transiciones
- **JavaScript ES6+**:
  - Fetch API para consumo de datos
  - Async/await para operaciones asíncronas
  - LocalStorage para persistencia del tema
  - Manipulación dinámica del DOM

## 📁 Estructura del Proyecto

```
biblioteca-beltran/
├── index.html              # Página principal
├── list.html               # Lista de libros
├── book.html               # Detalle de libro
├── contact.html            # Página de contacto
├── README.md               # Documentación
├── assets/
│   ├── css/
│   │   └── styles.css      # Estilos principales
│   ├── js/
│   │   └── main.js         # JavaScript principal
│   └── img/
│       └── default-cover.jpg # Imagen por defecto
```

## 🚀 Instalación y Uso

1. **Clonar o descargar** el proyecto
2. **Abrir** `index.html` en un navegador web
3. **Disfrutar** de la biblioteca digital

### Servidor Local (Recomendado)

Para evitar problemas de CORS con la API de Google Books, es recomendable usar un servidor local:

```bash
# Con Python 3
python -m http.server 8000

# Con Node.js (si tienes http-server instalado)
npx http-server

# Con PHP
php -S localhost:8000
```

Luego visitar `http://localhost:8000`

## 🎨 Características de Diseño

### Modo Claro
- Fondo blanco con acentos azules
- Texto oscuro para máxima legibilidad
- Sombras sutiles para profundidad

### Modo Oscuro
- Fondo oscuro con acentos azul claro
- Texto claro para contraste
- Sombras más pronunciadas

### Responsividad
- **Mobile**: 1 columna, menú hamburguesa
- **Tablet**: 2 columnas, navegación horizontal
- **Desktop**: 3-4 columnas, navegación completa

## 🔧 Funcionalidades JavaScript

### API de Google Books
- Búsqueda de libros por término
- Obtención de detalles por ID
- Manejo de errores y fallbacks

### Gestión de Estado
- Tema persistente en LocalStorage
- Navegación entre páginas
- Estado del carrusel

### Interactividad
- Carrusel automático con controles manuales
- Expansión de géneros
- Formulario con validación
- Switch de tema en tiempo real

## 📊 Géneros Incluidos

- Ficción
- Ciencia Ficción
- Romance
- Misterio
- Fantasía
- Historia
- Biografía
- Ciencia
- Tecnología
- Filosofía
- Psicología
- Cocina
- Viajes
- Arte
- Música
- Deportes

## 🔒 Consideraciones de Privacidad

- No se almacenan datos personales
- El formulario de contacto es simulado
- No se requieren cookies de tracking
- Cumple con estándares de accesibilidad web

## 🐛 Solución de Problemas

### La API no funciona
- Verificar conexión a internet
- Usar servidor local para evitar CORS
- Los libros de ejemplo se mostrarán como fallback

### Imágenes no se cargan
- El sistema usa imágenes por defecto automáticamente
- Verificar conexión a internet para imágenes de Google

### Modo oscuro no persiste
- Verificar que el navegador soporte LocalStorage
- Limpiar datos del navegador si es necesario

## Diseño de la página
- El link a la página donde se planteó el diseño es: https://miro.com/app/board/uXjVI409V2c=/
- Sin embargo, adjunto una imagen de la vista por si no se tiene acceso al Miro.

![Mockup mobile de la página](https://drive.google.com/uc?export=view&id=1nKL7342J7wz9LeZ8m8LRzxHDYyQlL4M0)

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request
