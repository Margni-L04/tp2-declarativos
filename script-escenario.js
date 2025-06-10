const juguetes = [
    { nombre: 'Buzz', nafta: 1, urlImagen: 'Imagenes/buzz.jpg' },
    { nombre: 'Woody', nafta: 2, urlImagen: 'Imagenes/woody.png' },
    { nombre: 'Rex', nafta: 4, urlImagen: 'Imagenes/rex.jpg' },
    { nombre: 'Hamm', nafta: 5, urlImagen: 'Imagenes/hamm.jpg' }
];

const inicializar = () => {
    const ladoIzq = document.getElementById('lado-izq');
    const ladoDer = document.getElementById('lado-der');
    const bote = document.getElementById('bote');
    const botonConfirmar = document.getElementById('boton-confirmar');
    const botonResetear = document.getElementById('boton-resetear');
    const cajaMensaje = document.getElementById('caja-mensaje');

    let estamosIzq = true;
    let num = 0;

    for (const juguete of juguetes) {
        const spanJugueteIzq = document.createElement('span');
        spanJugueteIzq.classList.add('toy-icon');
        spanJugueteIzq.textContent = juguete.nombre;
        spanJugueteIzq.id = `juguete-I${num}`;
        spanJugueteIzq.style.backgroundImage = `url('${juguete.urlImagen}')`;

        const spanJugueteDer = document.createElement('span');
        spanJugueteDer.classList.add('toy-icon');
        spanJugueteDer.classList.add('gone');
        spanJugueteDer.textContent = juguete.nombre;
        spanJugueteDer.id = `juguete-D${num}`;
        spanJugueteDer.style.backgroundImage = `url('${juguete.urlImagen}')`;

        num++;

        spanJugueteIzq.addEventListener('click', () => {
            if (estamosIzq) {
                spanJugueteIzq.classList.toggle('selected');
            }
        });

        spanJugueteDer.addEventListener('click', () => {
            if (!estamosIzq) {
                spanJugueteDer.classList.toggle('selected');
            }
        });

        ladoIzq.appendChild(spanJugueteIzq);
        ladoDer.appendChild(spanJugueteDer);
    }

    botonConfirmar.addEventListener('click', () => {
        if (estamosIzq) {
            const juguetes_seleccionados = ladoIzq.querySelectorAll('.toy-icon.selected');

            if (juguetes_seleccionados.length === 2) {
                for (const cadaJuguete of juguetes_seleccionados) {
                    const idComplemento = (cadaJuguete.id).replace('-I', '-D');
                    const jugueteComplemento = document.getElementById(idComplemento);

                    cadaJuguete.classList.remove('selected');
                    cadaJuguete.classList.add('gone');

                    jugueteComplemento.classList.remove('gone');
                }

                cajaMensaje.innerHTML = 'Seleccione un juguete del lado derecho para iniciar el viaje';
                bote.classList.add('right');
                estamosIzq = false;
            } else {
                cajaMensaje.innerHTML = 'Se deben seleccionar dos juguetes del lado izquierdo para iniciar el viaje';
            }
        } else {
            const juguetes_seleccionados = ladoDer.querySelectorAll('.toy-icon.selected');

            if (juguetes_seleccionados.length === 1) {
                for (const cadaJuguete of juguetes_seleccionados) {
                    const idComplemento = (cadaJuguete.id).replace('-D', '-I');
                    const jugueteComplemento = document.getElementById(idComplemento);

                    cadaJuguete.classList.remove('selected');
                    cadaJuguete.classList.add('gone');

                    jugueteComplemento.classList.remove('gone');
                }

                cajaMensaje.innerHTML = 'Seleccione dos juguetes del lado izquierdo para iniciar el viaje';
                bote.classList.remove('right');
                estamosIzq = true;
            } else {
                cajaMensaje.innerHTML = 'Se debe seleccionar un juguetes del lado derecho para iniciar el viaje';
            }
        }
    });

    botonResetear.addEventListener('click', () => {
        const juguetes_izq = ladoIzq.querySelectorAll('.toy-icon');
        const juguetes_der = ladoDer.querySelectorAll('.toy-icon');

        for (const cadaJuguete of juguetes_izq) {
            cadaJuguete.classList.remove('selected');
            cadaJuguete.classList.remove('gone');
        }

        for (const cadaJuguete of juguetes_der) {
            cadaJuguete.classList.remove('selected');
            cadaJuguete.classList.add('gone');
        }

        cajaMensaje.innerHTML = 'Seleccione dos juguetes del lado izquierdo para iniciar el viaje';
        estamosIzq = true;
    });
}

// Inicializamos los juguetes
inicializar();