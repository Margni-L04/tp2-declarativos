const juguetes = [
    { nombre: 'Buzz', nafta: 1, urlImagen: 'Imagenes/buzz.jpg' },
    { nombre: 'Woody', nafta: 2, urlImagen: 'Imagenes/woody.png' },
    { nombre: 'Rex', nafta: 4, urlImagen: 'Imagenes/rex.jpg' },
    { nombre: 'Hamm', nafta: 5, urlImagen: 'Imagenes/hamm.jpg' }
];

const totalNafta = 12;
let naftaUsada = 0;

const inicializar = () => {
    const ladoIzq = document.getElementById('lado-izq');
    const ladoDer = document.getElementById('lado-der');
    const bote = document.getElementById('bote');
    const botonConfirmar = document.getElementById('boton-confirmar');
    const botonResetear = document.getElementById('boton-resetear');
    const cajaNafta = document.getElementById('caja-nafta');
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

    for (let i = 0; i < totalNafta; i++) {
        const nafta = document.createElement('div');
        nafta.classList.add('fuel-cell');
        cajaNafta.appendChild(nafta);

        const imagenNafta = document.createElement('img');
        imagenNafta.src = 'Imagenes/nafta.png';
        imagenNafta.alt = 'Litro de nafta';
        nafta.appendChild(imagenNafta);     
    }

    const naftas = cajaNafta.querySelectorAll('.fuel-cell');

    botonConfirmar.addEventListener('click', () => {
        if (estamosIzq) {
            const juguetes_seleccionados = ladoIzq.querySelectorAll('.toy-icon.selected');

            if (juguetes_seleccionados.length === 2) {
                const nombreJuguete1 = juguetes_seleccionados[0].textContent;
                const nombreJuguete2 = juguetes_seleccionados[1].textContent;
                const nafta1 = (juguetes.find(j => j.nombre === nombreJuguete1)).nafta;
                const nafta2 = (juguetes.find(j => j.nombre === nombreJuguete2)).nafta;
                const naftaViaje = Math.max(nafta1, nafta2);

                if(naftaUsada + naftaViaje <= totalNafta) {

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

                    for (let i = naftaUsada; i < naftaUsada + naftaViaje; i++) {
                        naftas[i].classList.add('used');
                    }
                    naftaUsada += naftaViaje;
                } else {
                    cajaMensaje.innerHTML = 'No hay suficiente nafta para el viaje, seleccione otros juguetes del lado izquierdo';
                }
            } else {
                cajaMensaje.innerHTML = 'Se deben seleccionar dos juguetes del lado izquierdo para iniciar el viaje';
            }
        } else {
            const juguetes_seleccionados = ladoDer.querySelectorAll('.toy-icon.selected');

            if (juguetes_seleccionados.length === 1) {
                const nombreJuguete = juguetes_seleccionados[0].textContent;
                const naftaViaje = (juguetes.find(j => j.nombre === nombreJuguete)).nafta;

                if(naftaUsada + naftaViaje <= totalNafta) {
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

                    for (let i = naftaUsada; i < naftaUsada + naftaViaje; i++) {
                        naftas[i].classList.add('used');
                    }
                    naftaUsada += naftaViaje;
                } else {
                    cajaMensaje.innerHTML = 'No hay suficiente nafta para el viaje, seleccione otro juguete del lado derecho';
                }
            } else {
                cajaMensaje.innerHTML = 'Se debe seleccionar un juguete del lado derecho para iniciar el viaje';
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

        for (let i = 0; i < naftaUsada; i++) {
            naftas[i].classList.remove('used');
        }

        naftaUsada = 0;
    });
}

// Inicializamos los juguetes
inicializar();