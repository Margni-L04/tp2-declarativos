import init, { MachineBuilder } from './scryer-pkg/scryer_prolog.js';

// Arreglo con información de los juguetes
const juguetes = [
    { nombre: 'buzz', urlImagen: 'Imagenes/buzz.jpg' },
    { nombre: 'woody', urlImagen: 'Imagenes/woody.png' },
    { nombre: 'rex', urlImagen: 'Imagenes/rex.jpg' },
    { nombre: 'hamm', urlImagen: 'Imagenes/hamm.jpg' }
];

// Información sobre la nafta
const totalNafta = 12;
let naftaRestante = totalNafta;

// Variables de barra de progreso
let barraInterna;
let contadorNafta;

const actualizarContadorNafta = () => {
    contadorNafta.innerHTML = `
        <img src="https://iili.io/FKGJK4s.png" alt="Nafta">
        ${naftaRestante} / ${totalNafta}
    `;
}

const actualizarBarraProgreso = () => {
    const porcentajeRestante = ((naftaRestante) / totalNafta) * 100;
    barraInterna.style.width = `${porcentajeRestante}%`;
    actualizarContadorNafta();
}

const inicializar = async () => {
    // Inicializamos el modulo WebAssembly
    await init();

     // Componentes del html para modificar
    const ladoIzq = document.getElementById('lado-izq');
    const ladoDer = document.getElementById('lado-der');
    const bote = document.getElementById('bote');
    const botonConfirmar = document.getElementById('boton-confirmar');
    const botonResetear = document.getElementById('boton-resetear');
    const botonVolverJugar = document.getElementById('boton-volver-jugar');
    const cajaMensaje = document.getElementById('caja-mensaje');
    const mensajeVictoria = document.getElementById('mensaje-victoria');

    // Carga inicial del archivo .pl
    const viajeJuguetesPl = await fetch('viaje-juguetes.pl').then(r => r.text());

    // Informacion general
    let estamosIzq = true;
    let num = 0;
    let ordenJuguetesSeleccionados = [];

     // Carga de juguetes en ambos lados (solo visibles del lado izquierdo)
    for (const juguete of juguetes) {
        // Juguetes del lado izquierdo
        const spanIzq = document.createElement('span');
        spanIzq.classList.add('toy-icon');
        spanIzq.textContent = juguete.nombre;
        spanIzq.id = `juguete-I${num}`;
        spanIzq.style.backgroundImage = `url('${juguete.urlImagen}')`;

        // Juguetes del lado derecho
        const spanDer = document.createElement('span');
        spanDer.classList.add('toy-icon', 'gone');
        spanDer.textContent = juguete.nombre;
        spanDer.id = `juguete-D${num}`;
        spanDer.style.backgroundImage = `url('${juguete.urlImagen}')`;

        num++;
        
        // Agregamos la funcionalidad al hacer click en los juguetes cuando están activos del lado que corresponda
        spanIzq.addEventListener('click', () => {
            if (estamosIzq) {
                // Si estamos del lado izquierdo solo podemos tener dos juguetes seleccionados, si selecciona otro se cambia por el primero
                const estaSeleccionado = spanIzq.classList.contains('selected');
                
                if(estaSeleccionado) {
                    spanIzq.classList.remove('selected');
                    ordenJuguetesSeleccionados = ordenJuguetesSeleccionados.filter(j => j !== spanIzq);
                } else {

                    if (ordenJuguetesSeleccionados.length < 2) {
                        // Si hay menos de 2 seleccionados, simplemente lo agregamos a la lista
                        spanIzq.classList.add('selected');
                        ordenJuguetesSeleccionados.push(spanIzq);
                    } else {
                        // Quita el primer elemento (el más viejo)
                        const jugueteMasViejo = ordenJuguetesSeleccionados.shift(); 
                        jugueteMasViejo.classList.remove('selected');

                        // Añadimos el nuevo juguete como seleccionado
                        spanIzq.classList.add('selected');
                        ordenJuguetesSeleccionados.push(spanIzq);
                    }
                }
            }
        });

        spanDer.addEventListener('click', () => {
            if (!estamosIzq) {
                // Si estamos del lado derecho solo puede haber uno seleccionado, sacamos al seleccionado que está por el nuevo
                const jugueteSeleccionado = ladoDer.querySelector('.selected');

                if(jugueteSeleccionado && jugueteSeleccionado.textContent !== spanDer.textContent) {
                    // Hay un juguete seleccionado, y no es el mismo al que le hicieron click
                    jugueteSeleccionado.classList.remove('selected');
                }

                spanDer.classList.toggle('selected');
            }
        });

        // Agregamos los juguetes al html
        ladoIzq.appendChild(spanIzq);
        ladoDer.appendChild(spanDer);
    }
    
    //Creamos la barra para indicar la nafta disponible
    barraInterna = document.querySelector('.barra span');
    barraInterna.style.width = '100%';
    contadorNafta = document.getElementById('contador-nafta');
    actualizarContadorNafta();

    const realizarViaje = (nombresJuguetes) => {
        // Creamos los elementos para poder ejecutar prolog
        const builder = new MachineBuilder();
        const machine = builder.build();

        // Consultamos al modulo prolog
        machine.consultModuleString('user', viajeJuguetesPl);

        // Ejecutamos la consulta para ver si es una solucion valida
        let query;
        if(estamosIzq) {
            query = `viaje_ida(${nombresJuguetes[0]}, ${nombresJuguetes[1]}, ${naftaRestante}, NaftaRestante).`;
        } else {
            query = `viaje_vuelta(${nombresJuguetes[0]}, ${naftaRestante}, NaftaRestante).`;
        }
        console.log('Ejecutando consulta: ', query);
        const answers = machine.runQuery(query);

        for(const solucion of answers) {
            // Esta solución va a ser unica, pero necesitamos iterar por ese unico elemento
            if(solucion !== false) {
                for (const nombre of nombresJuguetes) {
                    const origen = estamosIzq ? ladoIzq : ladoDer;

                    // Buscar juguete en el lado correspondiente por nombre
                    const jugueteOrigen = Array.from(origen.querySelectorAll('.toy-icon')).find(el => el.textContent === nombre);
                    const idComplemento = estamosIzq ? jugueteOrigen.id.replace('-I', '-D') : jugueteOrigen.id.replace('-D', '-I');
                    const jugueteDestino = document.getElementById(idComplemento);

                    jugueteOrigen.classList.remove('selected');
                    jugueteOrigen.classList.add('gone');
                    jugueteDestino.classList.remove('gone');
                }

                const naftaViaje = parseInt(solucion.bindings['NaftaRestante'].integer);

                // Actualizamos estado del programa
                estamosIzq = !estamosIzq;
                bote.classList.toggle('right');
                naftaRestante -= (totalNafta - naftaViaje);
                actualizarBarraProgreso();

                const mensaje = estamosIzq
                    ? 'Seleccione dos juguetes del lado izquierdo para iniciar el viaje'
                    : 'Seleccione un juguete del lado derecho para iniciar el viaje';
                cajaMensaje.innerHTML = mensaje;

                // Verificamos si todos los juguetes estan del lado izquierdo, lo que significa que ganamos
                const escondidosIzq = ladoIzq.querySelectorAll('.toy-icon.gone').length;
                if (escondidosIzq === juguetes.length) {
                    mensajeVictoria.classList.add('mostrar');
                }
            } else {
                cajaMensaje.innerHTML = estamosIzq
                    ? 'No hay suficiente combustible para el viaje, seleccione otros juguetes'
                    : 'No hay suficiente combustible para el viaje, seleccione otro juguete';
            }
        }
    }

     // Funcionalidad del boton "Confirmar Viaje"
    botonConfirmar.addEventListener('click', () => {
        const origen = estamosIzq ? ladoIzq : ladoDer;
        const seleccionados = origen.querySelectorAll('.toy-icon.selected');

        if ((estamosIzq && seleccionados.length === 2) || (!estamosIzq && seleccionados.length === 1)) {
            const nombres = [...seleccionados].map(el => el.textContent);
            realizarViaje(nombres);
        } else {
            cajaMensaje.innerHTML = estamosIzq
                ? 'Debe seleccionar dos juguetes del lado izquierdo'
                : 'Debe seleccionar un juguete del lado derecho';
        }
    });

    // Funcionalidad de los botones de "Resetear" y "Volver a Jugar"
    const resetear = () => {
        const izq = ladoIzq.querySelectorAll('.toy-icon');
        const der = ladoDer.querySelectorAll('.toy-icon');

        izq.forEach(juguete => {
            juguete.classList.remove('selected', 'gone');
        });

        der.forEach(juguete => {
            juguete.classList.remove('selected');
            juguete.classList.add('gone');
        });

        if (!estamosIzq) {
            bote.classList.remove('right');
        }

        estamosIzq = true;
        naftaRestante = totalNafta;
        actualizarBarraProgreso();
        cajaMensaje.innerHTML = 'Seleccione dos juguetes del lado izquierdo para iniciar el viaje';
    }

    botonResetear.addEventListener('click', resetear);
    botonVolverJugar.addEventListener('click', () => {
        resetear();
        mensajeVictoria.classList.remove('mostrar');
    });

    actualizarBarraProgreso();
}

inicializar();
