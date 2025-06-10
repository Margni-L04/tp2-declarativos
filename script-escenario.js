// Arreglo con informacion de los juguetes
const juguetes = [
    { nombre: 'Buzz', nafta: 1, urlImagen: 'Imagenes/buzz.jpg' },
    { nombre: 'Woody', nafta: 2, urlImagen: 'Imagenes/woody.png' },
    { nombre: 'Rex', nafta: 4, urlImagen: 'Imagenes/rex.jpg' },
    { nombre: 'Hamm', nafta: 5, urlImagen: 'Imagenes/hamm.jpg' }
];

// Informacion sobre la nafta
const totalNafta = 12;
let naftaUsada = 0;

const inicializar = () => {
    // Componentes del html para modificar
    const ladoIzq = document.getElementById('lado-izq');
    const ladoDer = document.getElementById('lado-der');
    const bote = document.getElementById('bote');
    const botonConfirmar = document.getElementById('boton-confirmar');
    const botonResetear = document.getElementById('boton-resetear');
    const botonVolverJugar = document.getElementById('boton-volver-jugar');
    const cajaNafta = document.getElementById('caja-nafta');
    const cajaMensaje = document.getElementById('caja-mensaje');
    const mensajeVictoria = document.getElementById('mensaje-victoria');

    // Informacion general
    let estamosIzq = true;
    let num = 0;

    // Carga de juguetes en ambos lados (solo visibles del lado izquierdo)
    for (const juguete of juguetes) {
        // Juguetes del lado izquierdo
        const spanJugueteIzq = document.createElement('span');
        spanJugueteIzq.classList.add('toy-icon');
        spanJugueteIzq.textContent = juguete.nombre;
        spanJugueteIzq.id = `juguete-I${num}`;
        spanJugueteIzq.style.backgroundImage = `url('${juguete.urlImagen}')`;

        // Juguetes del lado derecho
        const spanJugueteDer = document.createElement('span');
        spanJugueteDer.classList.add('toy-icon');
        spanJugueteDer.classList.add('gone');
        spanJugueteDer.textContent = juguete.nombre;
        spanJugueteDer.id = `juguete-D${num}`;
        spanJugueteDer.style.backgroundImage = `url('${juguete.urlImagen}')`;

        num++;

        // Agregamos la funcionalidad al hacer click en los juguetes cuando están activos del lado que corresponda
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

        // Agregamos los juguetes al html
        ladoIzq.appendChild(spanJugueteIzq);
        ladoDer.appendChild(spanJugueteDer);
    }

    // Creamos las cajas para indicar la nafta disponible
    for (let i = 0; i < totalNafta; i++) {
        const nafta = document.createElement('div');
        nafta.classList.add('fuel-cell');
        cajaNafta.appendChild(nafta);

        const imagenNafta = document.createElement('img');
        imagenNafta.src = 'Imagenes/nafta.png';
        imagenNafta.alt = 'Litro de nafta';
        nafta.appendChild(imagenNafta);     
    }

    // Obtenemos las naftas pues debemos modificar su estado cuando se realice un viaje
    const naftas = cajaNafta.querySelectorAll('.fuel-cell');

    // Funcionalidad del boton "Confirmar Viaje"
    botonConfirmar.addEventListener('click', () => {
        if (estamosIzq) {
            // Nos encontramos en el lado izquierdo, obtenemos los juguetes seleccionados
            const juguetes_seleccionados = ladoIzq.querySelectorAll('.toy-icon.selected');

            if (juguetes_seleccionados.length === 2) {
                // Se deben seleccionar exactamente dos juguetes para viajar
                const nombreJuguete1 = juguetes_seleccionados[0].textContent;
                const nombreJuguete2 = juguetes_seleccionados[1].textContent;
                const nafta1 = (juguetes.find(j => j.nombre === nombreJuguete1)).nafta;
                const nafta2 = (juguetes.find(j => j.nombre === nombreJuguete2)).nafta;
                const naftaViaje = Math.max(nafta1, nafta2);

                if(naftaUsada + naftaViaje <= totalNafta) {
                    // Tenemos suficiente nafta para el viaje
                    for (const cadaJuguete of juguetes_seleccionados) {
                        // Movemos los juguetes seleccionados al lado derecho
                        const idComplemento = (cadaJuguete.id).replace('-I', '-D');
                        const jugueteComplemento = document.getElementById(idComplemento);
    
                        cadaJuguete.classList.remove('selected');
                        cadaJuguete.classList.add('gone');
    
                        jugueteComplemento.classList.remove('gone');
                    }
                    
                    // Actualizamos estado del html
                    cajaMensaje.innerHTML = 'Seleccione un juguete del lado derecho para iniciar el viaje';
                    bote.classList.add('right');
                    estamosIzq = false;

                    // Actualizamos las naftas visibles
                    for (let i = naftaUsada; i < naftaUsada + naftaViaje; i++) {
                        naftas[i].classList.add('used');
                    }
                    naftaUsada += naftaViaje;

                    // Verificamos que no haya juguetes del lado izquierdo, lo que significa que ganamos
                    const escondidosIzq = ladoIzq.querySelectorAll('.toy-icon.gone').length;
                    if(escondidosIzq === juguetes.length) {
                        mensajeVictoria.classList.add('mostrar');
                    }

                } else {
                    cajaMensaje.innerHTML = 'No hay suficiente nafta para el viaje, seleccione otros juguetes del lado izquierdo';
                }
            } else {
                cajaMensaje.innerHTML = 'Se deben seleccionar dos juguetes del lado izquierdo para iniciar el viaje';
            }
        } else {
            // Nos encontramos en el lado derecho, obtenemos los juguetes seleccionados
            const juguetes_seleccionados = ladoDer.querySelectorAll('.toy-icon.selected');

            if (juguetes_seleccionados.length === 1) {
                // Se deben seleccionar exactamente un juguete para viajar
                const nombreJuguete = juguetes_seleccionados[0].textContent;
                const naftaViaje = (juguetes.find(j => j.nombre === nombreJuguete)).nafta;

                if(naftaUsada + naftaViaje <= totalNafta) {
                    // Tenemos suficiente nafta para el viaje
                    for (const cadaJuguete of juguetes_seleccionados) {
                        // Movemos los juguetes seleccionados al lado izquierdo
                        const idComplemento = (cadaJuguete.id).replace('-D', '-I');
                        const jugueteComplemento = document.getElementById(idComplemento);
    
                        cadaJuguete.classList.remove('selected');
                        cadaJuguete.classList.add('gone');
    
                        jugueteComplemento.classList.remove('gone');
                    }
                    
                    // Actualizamos estado del html
                    cajaMensaje.innerHTML = 'Seleccione dos juguetes del lado izquierdo para iniciar el viaje';
                    bote.classList.remove('right');
                    estamosIzq = true;

                    // Actualizamos las naftas visibles
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

    // Funcionalidad del boton "Resetear" y "Volver a Jugar"
    const resetear = () => {
        const juguetes_izq = ladoIzq.querySelectorAll('.toy-icon');
        const juguetes_der = ladoDer.querySelectorAll('.toy-icon');
    
        // Colocamos todos los juguetes del lado izquierdo sin estar seleccionados
        for (const cadaJuguete of juguetes_izq) {
            cadaJuguete.classList.remove('selected');
            cadaJuguete.classList.remove('gone');
        }
    
        // Eliminamos los juguetes del lado derecho, eliminando si se encuentran seleccionados
        for (const cadaJuguete of juguetes_der) {
            cadaJuguete.classList.remove('selected');
            cadaJuguete.classList.add('gone');
        }

        // Movemos el barco al lado izquierdo si está del lado derecho
        if(!estamosIzq) {
            bote.classList.remove('right');
        }
    
        // Actualizamos html
        cajaMensaje.innerHTML = 'Seleccione dos juguetes del lado izquierdo para iniciar el viaje';
        estamosIzq = true;
    
        // Volvemos a activar todas las naftas
        for (let i = 0; i < naftaUsada; i++) {
            naftas[i].classList.remove('used');
        }
    
        naftaUsada = 0;
    }

    botonResetear.addEventListener('click', () => {
        resetear();
    });

    botonVolverJugar.addEventListener('click', () => {
        resetear();
        mensajeVictoria.classList.remove('mostrar');
    });
}

// Inicializamos el escenario con los juguetes
inicializar();