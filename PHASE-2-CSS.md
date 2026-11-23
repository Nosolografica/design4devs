# Fase 2 — Consolidación segura del CSS

## Cambios aplicados

- Se han sustituido custom properties abreviadas por nombres semánticos en inglés y se han actualizado sus referencias en CSS, HTML y JavaScript.
- Se han reunido los tokens del tema claro en un único bloque `:root`.
- Se han reunido los tokens de tema oscuro del sistema y del tema oscuro explícito en sus respectivos bloques.
- Se han integrado las declaraciones de `body` en una única regla base.
- Se ha eliminado una repetición exacta de `.hero progress` que declaraba el mismo `accent-color`.
- Se han sustituido los encabezados cronológicos de las rondas históricas por comentarios funcionales, sin reordenar reglas.

## Criterio de preservación

No se han fusionado reglas repetidas que contienen propiedades distintas o valores en conflicto. Tampoco se han reordenado bloques de componentes: hacerlo sin una comparación visual real podría alterar la cascada. Se ha mantenido el orden de las reglas restantes.

## Validación estática

- CSS analizado con `tinycss2`, sin errores sintácticos.
- Comparación de declaraciones por selector, propiedad y contexto `@media`, normalizando los nombres anteriores y nuevos de las custom properties: **0 diferencias** en los valores declarados.
- Referencias a los nombres antiguos de custom properties: no quedan en `index.html`, `styles.css`, `app.js` ni `content.js`.
- Los dos archivos JavaScript superan la comprobación sintáctica con Node.js.
- Los enlaces locales a la hoja CSS y a los dos scripts siguen presentes en el HTML.

## Limitación

La validación visual automatizada en navegador no ha podido ejecutarse en este entorno. La equivalencia visual y la interacción deben confirmarse en el navegador de destino antes de dar esta fase por cerrada. La consolidación de los selectores históricos restantes queda pendiente de esa comparación.
