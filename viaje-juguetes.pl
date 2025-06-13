% Imports
:- use_module(library(clpz)).

% Almacenamos la nafta que consume cada juguete en su viaje
nafta(buzz, 1).
nafta(woody, 2).
nafta(rex, 4).
nafta(hamm, 5).

% Predicado que representa la ida de un viaje, donde dos juguetes van hacia el lado derecho
viaje_ida(Juguete1, Juguete2, NaftaDisponible, NaftaRestante) :- 
    % Obtenemos cuanta nafta gasta cada uno
    nafta(Juguete1, Nafta1),
    nafta(Juguete2, Nafta2),

    % Calculamos cuanta nafta va a quedar despues de su viaje
    NaftaRestante #= NaftaDisponible - max(Nafta1, Nafta2),

    % Verificamos que les alcance la nafta para el viaje
    NaftaRestante #>= 0,
    !.
    
% Predicado que representa la vuelta de un viaje, donde un juguete van hacia el lado izquierdo
viaje_vuelta(Juguete, NaftaDisponible, NaftaRestante) :-
    % Obtenemos cuanta nafta gasta
    nafta(Juguete, Nafta),

    % Calculamos cuanta nafta va a quedar despues de su viaje
    NaftaRestante #= NaftaDisponible - Nafta,

    % Verificamos que le alcance la nafta para el viaje
    NaftaRestante #>= 0,
    !.