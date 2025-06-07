% Imports
:- use_module(library(clpz)).
:- use_module(library(lists)).

% Almacenamos la nafta que consume cada juguete en su viaje
nafta(buzz, 1).
nafta(woody, 2).
nafta(rex, 4).
nafta(hamm, 5).

% Predicado que resuelve el problema de los viajes de los juguetes para escapar de Zurg
escape_zurg(NaftaDisponible, Viajes) :-
    Juguetes = [buzz, woody, rex, hamm],
    
    % El viaje empezara con todos los juguetes del lado izquierdo y ninguno del derecho
    viaje_ida(Juguetes, [], NaftaDisponible, Viajes).

% Predicado que representa la ida de un viaje, donde dos juguetes van hacia el lado derecho
viaje_ida(LadoIzq, LadoDer, NaftaDisponible, Viajes) :- 
    % Se eligen los dos juguetes que realizarán el viaje
    select(Juguete1, LadoIzq, LadoIzq2),
    select(Juguete2, LadoIzq2, LadoIzqFinal),

    % Obtenemos cuanta nafta gasta cada uno
    nafta(Juguete1, Nafta1),
    nafta(Juguete2, Nafta2),
    
    % Para evitar viajes repetidos, restringimos que el juguete 2 sea el mas costoso
    Nafta1 #=< Nafta2,

    % Calculamos cuanta nafta va a quedar despues de su viaje
    NaftaRestante #= NaftaDisponible - Nafta2,

    % Verificamos que les alcance la nafta para el viaje
    NaftaRestante #>= 0,

    % Juguetes que quedan del lado derecho despues del viaje
    LadoDerFinal = [Juguete1, Juguete2 | LadoDer],

    % Guardamos el viaje que se realizó
    Viajes = ['b-->'(Juguete1, Juguete2) | RestoViajes],

    % Ahora realizamos la vuelta de un juguete para llevar el barco y que vengan mas juguetes
    viaje_vuelta(LadoIzqFinal, LadoDerFinal, NaftaRestante, RestoViajes).

% Predicado que representa la vuelta de un viaje, donde un juguete van hacia el lado izquierdo
viaje_vuelta([], _, _, []). % No queda nadie del lado izquierdo, se termino el viaje

viaje_vuelta(LadoIzq, LadoDer, NaftaDisponible, Viajes) :-
    % Se elige el juguete que realizara el viaje
    select(Juguete, LadoDer, LadoDerFinal),

    % Obtenemos cuanta nafta gasta
    nafta(Juguete, Nafta),

    % Calculamos cuanta nafta va a quedar despues de su viaje
    NaftaRestante #= NaftaDisponible - Nafta,

    % Verificamos que le alcance la nafta para el viaje
    NaftaRestante #>= 0,

    % Juguetes que quedan del lado izquierdo despues del viaje
    LadoIzqFinal = [Juguete | LadoIzq],

    % Guardamos el viaje que se realizo
    Viajes = ['b<--'(Juguete) | RestoViajes],

    % Ahora realizamos la ida de dos juguetes para que viajen al lado derecho
    viaje_ida(LadoIzqFinal, LadoDerFinal, NaftaRestante, RestoViajes).