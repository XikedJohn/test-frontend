'use strict';

const canvas = document.getElementById('canvas');

// Renderizado de la cuadrícula de dibujo
function renderCanvasGrid() {
    const maxColumns = 100;
    const cellSize = window.innerWidth / maxColumns;

    let rowCounter = 1;

    // Mientras no se supere el alto de la ventana se generan filas de celdas
    while (canvas.offsetHeight + cellSize < window.innerHeight) {
        const newRow = document.createElement('div');
    
        newRow.setAttribute('id', `row-${rowCounter}`);
        newRow.classList.add('canvasRow');
    
        for (let cellIndex = 1; cellIndex <= maxColumns; cellIndex++) {
            const newCell = document.createElement('div');
    
            newCell.setAttribute('id', `cell-${cellIndex}r${rowCounter}`);
            newCell.setAttribute('style', `width: ${cellSize}px; height: ${cellSize}px`);
            newCell.classList.add('canvasCell');
    
            newRow.appendChild(newCell);
        }
    
        canvas.appendChild(newRow);
        rowCounter++;
    }
}

// Inicialización de "pincel" y funcionalidad para colorear las celdas
function initBrush() {
    // Creación del selector de colores
    const colors = ['red', 'blue', 'green', 'yellow', 'violet'];
    const colorPicker = document.getElementById('colorPicker');
    const toggleSelector = (showSelector = true) => {
        colorPicker.style.opacity = showSelector ? '1' : '0';
        colorPicker.style.visibility = showSelector ? 'visible' : 'hidden';
    };

    let selectedColor = colors[0];

    colors.forEach(color => {
        const colorOption = document.createElement('div');

        colorOption.classList.add('colorOption', color);
        colorOption.style.backgroundColor = color;

        color === selectedColor && colorOption.classList.add('selected');

        colorPicker.appendChild(colorOption);
    });

    colorPicker.addEventListener('click', e => {
        const {classList} = e.target;

        if (classList.contains('colorOption')) {
            const colorPicked = colors.find(color => classList.contains(color));

            if (selectedColor !== colorPicked) {
                const currentColorOption = document.querySelector(`.colorOption.${selectedColor}`);

                selectedColor = colorPicked;

                currentColorOption.classList.remove('selected');
                classList.add('selected');
            }
        }

        toggleSelector(false);
    });

    colorPicker.addEventListener('mouseleave', toggleSelector.bind(null, false));

    // Función que rellena las celdas con el color seleccionado
    // Si se pinta con el mismo color se borra y si se pinta con un color diferente se reemplaza
    function fillCell(event) {
        const {classList, style} = event.target;

        if (classList.contains('canvasCell')) {
            const isPainted = classList.contains('painted');
            const colorToReplace = style.backgroundColor !== selectedColor;
    
            style.backgroundColor = !isPainted || colorToReplace ? selectedColor : null;
            isPainted && !colorToReplace ? classList.remove('painted') : classList.add('painted');
        }
    }

    // Presionar el click izquierdo colorea las celdas por donde pase el puntero
    canvas.addEventListener('mousedown', e => {
        e.preventDefault();

        if (e.button === 0) {
            fillCell(e);
            canvas.addEventListener('mouseover', fillCell);
        }
    });

    // Soltar el click izquierdo deja de colorear las celdas por donde pase el puntero
    canvas.addEventListener('mouseup', () => canvas.removeEventListener('mouseover', fillCell));

    // Presionar el click derecho abre el selector de colores
    canvas.addEventListener('contextmenu', e => {
        const {pageX, pageY, target} = e;

        e.preventDefault();

        if (target.classList.contains('canvasCell')) {
            const {innerWidth, innerHeight} = window;
            const {offsetWidth, offsetHeight, style, halfWidth = offsetWidth / 2} = colorPicker;

            // Posicionamiento del selector evitando que supere los bordes de la ventana
            style.top = `${pageY + offsetHeight < innerHeight ? pageY : pageY - offsetHeight}px`;
            style.left = `${pageX - halfWidth < 0 ? 5 : pageX + halfWidth > innerWidth ? innerWidth - offsetWidth - 5 : pageX - halfWidth}px`;
            toggleSelector();
        }
    });
}

renderCanvasGrid();
initBrush();
