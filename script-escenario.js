const juguetes = ['Buzz', 'Woody', 'Rex', 'Hamm'];

const inicializar = () => {
    const ladoIzq = document.getElementById('lado-izq');
    const ladoDer = document.getElementById('lado-der');

    for (const juguete of juguetes) {
        const spanJugueteIzq = document.createElement('span');
        spanJugueteIzq.classList.add('toy-icon');
        spanJugueteIzq.textContent = juguete;

        const spanJugueteDer = document.createElement('span');
        spanJugueteDer.classList.add('toy-icon');
        spanJugueteDer.classList.add('gone');
        spanJugueteDer.textContent = juguete;

        spanJugueteIzq.addEventListener('click', () => {
            spanJugueteIzq.classList.toggle('selected');
        });

        spanJugueteDer.addEventListener('click', () => {
            spanJugueteDer.classList.toggle('selected');
        });
        
        ladoIzq.appendChild(spanJugueteIzq);
        ladoDer.appendChild(spanJugueteDer);
    }
}

// Inicializamos los juguetes
inicializar();