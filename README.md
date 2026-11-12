# Seguimiento de ciclo · maíz (prototipo)

Prototipo funcional de la pantalla de captura del **seguimiento de ciclo** de REDMAÍZ: la entrevista que el técnico hace al cierre del ciclo a los productores de su muestra.

**Demo:** https://rubenugu.github.io/seguimiento-ciclo-maiz/

Todos los datos son de ejemplo. Lo capturado se guarda solo en el navegador de quien lo usa (`localStorage`); no hay servidor ni base de datos.

## Qué hace

- Una sola página con los 4 pasos: siembra y suelo, prácticas del ciclo, cosecha y destino, resultado.
- Prácticas con costo de toda la parcela: gasto en insumo más jornales al valor fijo del estado.
- El insumo define si la práctica cuenta como manejo biológico o químico.
- Resultado calculado al momento: rendimiento, costo por hectárea y por kilo, ingreso por venta y reparto del gasto por tipo de manejo.
- Validaciones antes de enviar: destinos que sumen 100 %, precio en destinos de venta, hectáreas cosechadas dentro de la parcela, rangos de suelo.
- Al enviar, el seguimiento se bloquea.
- Responsiva: menú lateral fijo en computadora, menú deslizable y barra inferior en celular; la tabla de prácticas pasa a tarjetas cuando no cabe.
- Funciona sin conexión después de la primera visita (service worker).

## Estructura

```
index.html   marcado de la pantalla
styles.css   estilos (tokens de REDMAÍZ)
app.js       catálogos, cálculos y comportamiento
sw.js        caché para uso sin conexión
assets/      logo, fondo del encabezado, fuentes e íconos tomados de la app
```

Sin dependencias ni compilación. Para probar en local:

```bash
python -m http.server 4310
```

## Pendiente de definir

- Catálogos de prácticas e insumos: son un borrador; los definen los agrónomos.
- Valor del jornal por estado: aquí está fijo en $250 (Oaxaca).
- Tecnología para la captura sin conexión en la app real (PWA dentro de REDMAÍZ o app nativa).
