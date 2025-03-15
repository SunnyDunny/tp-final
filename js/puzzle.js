    // Arreglo de imágenes a utilizar en los puzzles
    const images = [
        '../juego/imagenes/da-vinci-retrato.jpg', // Ruta de la primera imagen
        '../juego/imagenes/frida-kahlo.jpg', // Ruta de la segunda imagen
        '../juego/imagenes/van-gogh.jpg'  // Y así sucesivamente...
    ];

    let currentPuzzleIndex = 0; // Índice de la imagen actual

    const container = document.getElementById("puzzle-container");
    const gridSize = 3; // Usaremos un puzzle de 3x3
    let emptyIndex;
    let pieces = [];

    // Sistema de puntaje
    let score = 1000;

    function updateScoreDisplay() {
    document.getElementById("score").innerText = "Puntaje: " + score;
    }

    function actualizarPuntaje(valor) {
        score += valor;
        if (score < 0) score = 0;
        updateScoreDisplay();
        
        // Si se han acabado los puntos, termina el juego
        if (score === 0) {
          terminarJuego();
        }
}      

function terminarJuego() {
    // Aplicar el efecto fade para indicar el fin de la ronda
    container.classList.add("fade");
    
    setTimeout(() => {
      // Puede resultar conveniente mostrar un mensaje de "Game Over" o similar
      alert("¡Se acabaron los puntos! La ronda termina sin ganar.");
      
      // Cambiar a la siguiente imagen (se usa un bucle con módulo)
      currentPuzzleIndex = (currentPuzzleIndex + 1) % images.length;
      
      // Reinicializar el puzzle con la nueva imagen
      iniciarPuzzle();
      container.classList.remove("fade");
      
      // Opcional: Reiniciar el puntaje para la siguiente ronda
      score = 1000;
      updateScoreDisplay();
    }, 500); // El tiempo (500ms) coincide con la duración de la transición en el CSS
  }
  

    // Función para inicializar (o reinicializar) el puzzle
    function iniciarPuzzle() {
    container.innerHTML = '';
    pieces = [];
    const totalPiezas = gridSize * gridSize;
    emptyIndex = totalPiezas - 1; // La última celda es el espacio vacío
    const imagenURL = images[currentPuzzleIndex];

    for (let i = 0; i < totalPiezas; i++) {
        const pieza = document.createElement("div");
        if (i !== emptyIndex) {
        const row = Math.floor(i / gridSize);
        const col = i % gridSize;
        pieza.style.backgroundImage = `url(${imagenURL})`;
        pieza.style.backgroundPosition = `-${col * 100}px -${row * 100}px`;
        pieza.style.backgroundSize = `${gridSize * 100}px ${gridSize * 100}px`;
        pieza.dataset.posicionOriginal = i;
        pieza.classList.add("puzzle-piece");
        pieza.addEventListener("click", function () {
            const currentIndex = pieces.indexOf(this);
            moverPieza(currentIndex);
        });
        } else {
        pieza.classList.add("empty");
        }
        pieces.push(pieza);
    }

    // Mezclar las piezas de manera aleatoria
    pieces.sort(() => Math.random() - 0.5);
    container.innerHTML = '';
    pieces.forEach((pieza, idx) => {
        container.appendChild(pieza);
        if (pieza.classList.contains("empty")) {
        emptyIndex = idx;
        }
    });
    }

    // Función para mover una pieza si es adyacente a la celda vacía
    function moverPieza(indice) {
    const filaEmpty = Math.floor(emptyIndex / gridSize);
    const colEmpty = emptyIndex % gridSize;
    const filaPieza = Math.floor(indice / gridSize);
    const colPieza = indice % gridSize;
    const distancia = Math.abs(filaEmpty - filaPieza) + Math.abs(colEmpty - colPieza);

    if (distancia === 1) {
        // Intercambiamos las posiciones en el array
        [pieces[emptyIndex], pieces[indice]] = [pieces[indice], pieces[emptyIndex]];

        // Actualizamos el contenedor
        container.innerHTML = '';
        pieces.forEach((pieza, idx) => {
        container.appendChild(pieza);
        if (pieza.classList.contains("empty")) {
            emptyIndex = idx;
        }
        });

        // Descontamos puntos por movimiento
        actualizarPuntaje(-5);
        comprobarVictoria();
    }
    }

    // Función para comprobar si el puzzle está resuelto
    function comprobarVictoria() {
    for (let i = 0; i < pieces.length; i++) {
        if (!pieces[i].classList.contains("empty") && pieces[i].dataset.posicionOriginal != i) {
        return;
        }
    }
    // Si llegamos hasta aquí, el puzzle se ha resuelto.
    setTimeout(() => {
        container.classList.add("fade");
        setTimeout(() => {
        // Cambiar a la siguiente imagen (se utiliza un bucle con módulo)
        currentPuzzleIndex = (currentPuzzleIndex + 1) % images.length;
        iniciarPuzzle();
        container.classList.remove("fade");
        }, 500);
    }, 100);
    }

    // Función para mostrar la pista completa (overlay)
    function mostrarPista() {
    actualizarPuntaje(-20);
    const overlay = document.createElement("div");
    overlay.id = "hintOverlay";
    overlay.style.backgroundImage = `url(${images[currentPuzzleIndex]})`;
    container.appendChild(overlay);

    // El overlay se remueve después de 2 segundos
    setTimeout(() => {
        if (container.contains(overlay)) {
        container.removeChild(overlay);
        }
    }, 2000);
    }

    // Función para mostrar una sugerencia (resalta la ficha adyacente al hueco)
    function mostrarSugerencia() {
    actualizarPuntaje(-10);
    const filaEmpty = Math.floor(emptyIndex / gridSize);
    const colEmpty = emptyIndex % gridSize;
    
    // Posibles direcciones: arriba, abajo, izquierda, derecha
    const direcciones = [
        { dx: 0, dy: -1 },  
        { dx: 0, dy: 1 },   
        { dx: -1, dy: 0 },  
        { dx: 1, dy: 0 }    
    ];

    let indiceSugerido = null;
    for (const { dx, dy } of direcciones) {
        const nuevaFila = filaEmpty + dy;
        const nuevaCol = colEmpty + dx;
        if (nuevaFila >= 0 && nuevaFila < gridSize && nuevaCol >= 0 && nuevaCol < gridSize) {
        const indice = nuevaFila * gridSize + nuevaCol;
        if (!pieces[indice].classList.contains("empty")) {
            indiceSugerido = indice;
            break;
        }
        }
    }
    if (indiceSugerido !== null) {
        const piezaSugerida = pieces[indiceSugerido];
        piezaSugerida.classList.add("hint");
        setTimeout(() => {
        piezaSugerida.classList.remove("hint");
        }, 2000);
    }
    }

    // Asignar eventos a los botones de pista
    document.getElementById("hintBtn").addEventListener("click", mostrarPista);
    document.getElementById("sugerenciaBtn").addEventListener("click", mostrarSugerencia);

    // Inicializar el puzzle y el puntaje al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    iniciarPuzzle();
    updateScoreDisplay();
});