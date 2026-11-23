# Diseño para quien ya sabe programar

## Estructura

- `index.html`: estructura y contenido semántico.
- `css/styles.css`: estilos, componentes, estados y responsive.
- `js/content.js`: catálogos y datos estáticos.
- `js/app.js`: estado, interacciones, renderizado y persistencia.
- `favicon.svg`: icono del sitio.

## Ejecución

Abre `index.html` directamente en un navegador moderno. Los scripts se cargan como scripts clásicos, sin módulos ni proceso de compilación, para conservar la ejecución mediante `file://`.

## Compatibilidad y conservación

- No se han introducido módulos, `let`, `const` ni funciones flecha. No obstante, `app.js` ya utiliza expresiones regulares Unicode con lookbehind y APIs modernas del navegador; por tanto, no debe describirse como plenamente compatible con ES5 ni con navegadores antiguos.
- No se incorpora jQuery ni dependencias nuevas. El helper `$` es un alias local de `document.querySelector`.
- Se conserva la clave `localStorage` `diseno-progreso`.
- Se mantienen los textos visibles, las opciones de los controles y los estilos existentes.
- Los identificadores antiguos de categorías de reglas se conservan como anclas de compatibilidad.

## Cambios de esta refactorización

- Los catálogos globales de `content.js` usan nombres descriptivos en `UPPER_SNAKE_CASE`.
- `app.js` consume esos nombres nuevos.
- Las categorías de reglas usan claves internas en inglés (`standard`, `law`, `evidence`, `convention`).
- Las etiquetas de categoría se identifican mediante `data-rule-category`, no leyendo el texto visible.
- Los textos y las etiquetas visibles no se han traducido ni reescrito.

## Validación realizada

Se han comprobado la sintaxis de ambos archivos JavaScript, las referencias entre los datos y la aplicación, la presencia de los archivos y rutas locales y la unicidad de los IDs del HTML; también se corrigieron los duplicados `tz` y `tu` que tenía la versión recibida. La validación estática no sustituye una prueba funcional en los navegadores de destino.
