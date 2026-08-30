// 1. Capturamos los elementos del HTML mediante su ID
const btnInicio = document.getElementById('btn-inicio');
const btnPerros = document.getElementById('btn-perros');

const seccionInicio = document.getElementById('seccion-inicio');
const seccionPerros = document.getElementById('seccion-perros');

// 2. Escuchamos el clic en el botón de "Inicio"
btnInicio.addEventListener('click', () => {
    // Mostramos inicio y ocultamos perros
    seccionInicio.className = 'section-visible';
    seccionPerros.className = 'section-hidden';
    
    // Cambiamos el estilo de los botones (activo / inactive)
    btnInicio.className = 'btn-active';
    btnPerros.className = 'btn-inactive';
});

// 3. Escuchamos el clic en el botón de "Perros en Adopción"
btnPerros.addEventListener('click', () => {
    // Ocultamos inicio y mostramos perros
    seccionInicio.className = 'section-hidden';
    seccionPerros.className = 'section-visible';
    
    // Cambiamos el estilo de los botones (activo / inactive)
    btnInicio.className = 'btn-inactive';
    btnPerros.className = 'btn-active';
});
