import init, { MachineBuilder } from './scryer-pkg/scryer_prolog.js';

main();

async function main() {
    // Inicializamos el modulo WebAssembly
    await init();

    // Buscamos los elementos que para interactuar con los escapes
    const nafta_input = document.getElementById('nafta-disponible');
    const boton_ejecutar = document.getElementById('run-escape');
    const soluciones_html = document.getElementById('escape-solution');

    // Carga inicial del archivo .pl
    const juguetesPl = await fetch('juguetes.pl').then(r => r.text());

    // Ejecutar la solución del problema
    boton_ejecutar.addEventListener('click', async () => {
        // Validamos que el valor pasado de nafta sea valido
        const naftaDisponible = parseInt(nafta_input.value, 10);

        if (isNaN(naftaDisponible) || naftaDisponible < 0) {
            const noSoluciones = document.createElement('div');
            noSoluciones.classList.add('no-solutions');
            noSoluciones.textContent = 'Por favor, ingresa un valor válido para los litros de nafta disponible (un número mayor o igual a 0).';
            soluciones_html.appendChild(noSoluciones);
        } else {
            // Mensaje que mostramos mientras se procesa la consulta
            soluciones_html.innerHTML = '<div class="loading-message">Resolviendo el problema...</div>';

            // Creamos los elementos para poder ejecutar prolog
            const builder = new MachineBuilder();
            const machine = builder.build();

            // Consultamos al modulo prolog
            machine.consultModuleString('user', juguetesPl);

            // Ejecutamos la consulta con el valor de nafta obtenido
            const query = `escape_zurg(${naftaDisponible}, Viajes).`;
            console.log('Ejecutando consulta: ', query);
            const answers = machine.runQuery(query);

            // Limpiamos mensaje de procesamiento
            soluciones_html.innerHTML = '';
            const soluciones_formateadas = [];

            // Formateamos las soluciones
            for (const solucion of answers) {
                // Filtramos el resultado final que siempre es 'false' cuando no encuentra mas soluciones
                if(solucion !== false) {
                    console.log(solucion);
                    const viajes = solucion.bindings['Viajes'].list;

                    const viajes_formateados = viajes.map(viaje => {
                        let viaje_formateado = '';
                        // Primer juguete
                        const viajero1 = viaje.args[0].atom;
                        
                        if (viaje.functor === 'b-->') {
                            // Viaje de ida, hay dos jueguetes viajando
                            const viajero2 = viaje.args[1].atom;

                            viaje_formateado = `<b>${viajero1}</b> y <b>${viajero2}</b> viajan al lado derecho`;
                        } else if (viaje.functor === 'b<--') {
                            // Viaje de vuelta, solo viaja un juguete
                            viaje_formateado = `<b>${viajero1}</b> regresa al lado izquierdo`;
                        }
                        return viaje_formateado;
                    });

                    soluciones_formateadas.push(viajes_formateados);
                }
            }
            
            if(soluciones_formateadas.length === 0) {
                //No se encontraron soluciones
                const noSoluciones = document.createElement('div');
                noSoluciones.classList.add('no-solutions');
                noSoluciones.textContent = `No se encontraron soluciones para un viaje con ${naftaDisponible} litros de nafta.`;
                soluciones_html.appendChild(noSoluciones);
            } else {
                let numSolucion = 1;
                for (const solucion of soluciones_formateadas) {
                    const unaSolucion = document.createElement('div');
                    unaSolucion.classList.add("solution-item");

                    const tituloSolucion = document.createElement('h3');
                    tituloSolucion.textContent = `Solución N° ${numSolucion}:`;
                    unaSolucion.appendChild(tituloSolucion);

                    const newPre = document.createElement('pre');
                    newPre.innerHTML = solucion.join('<br>');
                    unaSolucion.appendChild(newPre);
                    soluciones_html.appendChild(unaSolucion);

                    numSolucion++;
                }
            }
        }
    });
}