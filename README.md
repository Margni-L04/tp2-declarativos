# Trabajo Práctico N°2 ~ Lenguajes Declarativos

Bienvenidos al tp en el que presentamos un juego implementado en prolog. Usamos la librería WASM para la implementación del archivo prolog en la página web

El problema:
Buzz, Woody, Rex y Hamm tienen que escapar de Zurg. Ellos solo tienen que cruzar un último río antes de ser libres. Sin embargo, el barco puede contener como máximo a dos de ellos al mismo tiempo. Además, para cruzar el río es necesario cargar el tanque del barco con combustible. El problema es que nuestros amigos tienen solo 12 litros de combustible. Los juguetes consumen diferentes cantidades para cruzar el río (en cualquier dirección): 

- Buzz necesita 1 litro de combustible
- Woody necesita 2 litros de combustible
- Rex necesita 4 litros de combustible
- Hamm necesita 5 litros de combustible

Como solo puede haber dos juguetes en el barco al mismo tiempo, no pueden cruzar el río todos a la vez. Si dos juguetes viajan en el barco la cantidad de combustible que se usa es igual al máximo de los juguetes que viajan. Como necesitan el barco para cruzar el río, cada vez que dos han cruzado el río, alguien tiene que regresar y llevar el barco a los juguetes del otro lado que aún tienen que cruzar el puente. El problema ahora es: ¿en qué orden pueden los cuatro juguetes cruzar el río antes de quedarse sin combustible (es decir, consumiendo 12 litros o menos) para ser salvados de Zurg?