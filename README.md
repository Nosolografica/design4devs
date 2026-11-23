# Diseño para quien ya sabe programar

## Estructura de esta entrega

- `index.html`: estructura y contenido HTML original.
- `css/styles.css`: hoja de estilos extraída, normalizada y parcialmente consolidada.
- `js/content.js`: declaraciones de datos estáticos separadas de la lógica.
- `js/app.js`: comportamiento e interacciones de la aplicación.
- `CONVENTIONS.md`: norma de nomenclatura y calidad aprobada.
- `PHASE-2-CSS.md`: registro de cambios y validaciones de la consolidación CSS.

## Ejecución

Abre `index.html` directamente en un navegador moderno. Los scripts se cargan como scripts clásicos, sin módulos ni proceso de compilación. Se mantiene la carga de Google Fonts del original, por lo que esa tipografía externa requiere conexión a Internet; el resto de los archivos del proyecto es local.

## Estado de la refactorización

La primera extracción separó HTML, CSS, datos y lógica en los cuatro archivos acordados. En la consolidación CSS se han renombrado las custom properties abreviadas con nombres semánticos en inglés, se han agrupado los tokens de tema, se han integrado las declaraciones base de `body`, se ha eliminado una repetición idéntica y se han sustituido los comentarios cronológicos por secciones funcionales.

No se han reordenado reglas de componentes ni se han fusionado selectores con declaraciones en conflicto. El CSS conserva la cascada original en esos casos. Los IDs HTML y las funciones/variables JavaScript siguen pendientes de su migración coordinada; los atributos `data-*` y los alias de hashes también quedan para esa fase. La clave `diseno-progreso` de `localStorage` permanece intacta.

## Validación

La hoja CSS se ha analizado sin errores sintácticos. Una comparación de las declaraciones finales por selector, propiedad y contexto `@media`, normalizando los nombres antiguos y nuevos de custom properties, no detecta diferencias. Los dos archivos JavaScript superan `node --check`.

No se ha podido completar una prueba automatizada de renderizado en navegador en este entorno, por lo que la equivalencia visual y la interacción deben volver a comprobarse en el navegador de destino.
