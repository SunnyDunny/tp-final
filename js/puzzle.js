// Arreglo de imágenes a utilizar en los puzzles
const images = [
    '../juego/imagenes/da-vinci-retrato.jpg', // Ruta de la primera imagen
    '../juego/imagenes/frida-kahlo.jpg', // Ruta de la segunda imagen
    '../juego/imagenes/van-gogh.jpg'  // Y así sucesivamente...
  ];
  let currentPuzzleIndex = 0; // Índice de la imagen actual
  
  const container = document.getElementById("puzzle-container");
  const gridSize = 3; // Usaremos una cuadrícula 3x3
  let emptyIndex;
  let pieces = [];
  
  // Función para inicializar (o reinicializar) el rompecabezas
  function iniciarPuzzle() {
    container.innerHTML = '';
    pieces = [];
    const totalPiezas = gridSize * gridSize;
    emptyIndex = totalPiezas - 1; // La última posición será vacía
    const imagenURL = images[currentPuzzleIndex];
  
    // Crear las piezas del puzzle
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
        
        // Usamos función normal para obtener el índice actual
        pieza.addEventListener("click", function () {
          const currentIndex = pieces.indexOf(this);
          moverPieza(currentIndex);
        });
      } else {
        pieza.classList.add("empty");
      }
      pieces.push(pieza);
    }
  
    // Mezclar las piezas de forma aleatoria
    pieces.sort(() => Math.random() - 0.5);
    container.innerHTML = '';
    pieces.forEach((pieza, idx) => {
      container.appendChild(pieza);
      if (pieza.classList.contains("empty")) {
        emptyIndex = idx;
      }
    });
  }
  
  // Función para mover una pieza (si es adyacente al espacio vacío)
  function moverPieza(indice) {
    const filaEmpty = Math.floor(emptyIndex / gridSize);
    const colEmpty = emptyIndex % gridSize;
    const filaPieza = Math.floor(indice / gridSize);
    const colPieza = indice % gridSize;
    const distancia = Math.abs(filaEmpty - filaPieza) + Math.abs(colEmpty - colPieza);
  
    if (distancia === 1) {
      // Intercambia las posiciones en el arreglo
      [pieces[emptyIndex], pieces[indice]] = [pieces[indice], pieces[emptyIndex]];
  
      // Renderiza de nuevo el contenedor
      container.innerHTML = '';
      pieces.forEach((pieza, idx) => {
        container.appendChild(pieza);
        if (pieza.classList.contains("empty")) {
          emptyIndex = idx;
        }
      });
  
      comprobarVictoria();
    }
  }
  
  // Función para comprobar si el puzzle está resuelto y pasar al siguiente
  function comprobarVictoria() {
    for (let i = 0; i < pieces.length; i++) {
      if (!pieces[i].classList.contains("empty") && pieces[i].dataset.posicionOriginal != i) {
        return;
      }
    }
    // El rompecabezas se ha resuelto
    setTimeout(() => {
      alert("¡Felicidades, has resuelto el rompecabezas!");
      
      // Añade la clase "fade" para iniciar el efecto de desvanecimiento
      container.classList.add("fade");
      
      // Usa el evento 'transitionend' para esperar a que termine la transición
      container.addEventListener("transitionend", function handler() {
        // Remueve la clase para preparar el fade in en el nuevo puzzle
        container.classList.remove("fade");
        
        // Actualiza el índice para la siguiente imagen (ciclando mediante módulo)
        currentPuzzleIndex = (currentPuzzleIndex + 1) % images.length;
        
        // Reinicializa el rompecabezas con la nueva imagen
        iniciarPuzzle();
        
        // Remueve este manejador para evitar llamadas duplicadas
        container.removeEventListener("transitionend", handler);
      });
      
    }, 100);
  }
  
  // Inicializar el puzzle una vez que el DOM esté listo
  document.addEventListener("DOMContentLoaded", () => {
    iniciarPuzzle();
  });
  