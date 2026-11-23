# Convenciones de nomenclatura y calidad del código

**Proyecto:** Diseño para quien ya sabe programar\
**Documento normativo para:** HTML, CSS y JavaScript\
**Idioma del código:** inglés\
**Objetivo:** establecer una nomenclatura semántica, coherente y estable
que permita mantener, ampliar y escalar el proyecto sin depender de
quien lo creó.

------------------------------------------------------------------------

## 1. Principios obligatorios

Estas reglas se aplican a todo código nuevo y a cualquier código que se
modifique durante la refactorización.

1.  **Significado antes que brevedad.** Los nombres deben describir la
    función, el contenido o el estado real del elemento.
2.  **Semántica antes que apariencia.** Un nombre identifica qué es o
    qué hace algo, no cómo se ve en un momento concreto.
3.  **Consistencia.** Un mismo concepto debe llamarse igual en todo el
    proyecto. No se crearán sinónimos para la misma función.
4.  **Nombres estables.** No se usarán nombres ligados al orden de
    aparición, a una ronda de cambios o a una versión temporal.
5.  **Legibilidad humana.** El código debe poder entenderse sin
    descifrar abreviaturas, rastrear parches o reconstruir mentalmente
    la cascada.
6.  **Cambios controlados.** Antes de renombrar un identificador, se
    localizarán y actualizarán todas sus referencias.
7.  **No romper el producto.** La refactorización debe conservar el
    diseño, el contenido, la interacción, la accesibilidad, la
    navegación y la persistencia existentes, salvo que se apruebe
    expresamente un cambio.
8.  **No introducir complejidad gratuita.** No se añadirán patrones,
    dependencias, herramientas ni capas de abstracción que no aporten
    una mejora real.

La calidad técnica, la mantenibilidad y la escalabilidad son requisitos
del proyecto, no mejoras opcionales.

------------------------------------------------------------------------

## 2. Idioma

-   Todo identificador nuevo o renombrado del código debe estar en
    **inglés**.
-   Se aplica a variables, funciones, constantes, clases, IDs, atributos
    `data-*`, custom properties, claves internas de objetos y nombres de
    archivos.
-   El texto visible para las personas usuarias puede permanecer en
    español. No se traducirá el contenido de la interfaz por el hecho de
    traducir los identificadores.
-   Los comentarios técnicos y la documentación pueden estar en español
    si eso facilita el mantenimiento del equipo. Deben ser claros,
    precisos y estar actualizados.
-   No se mezclarán idiomas dentro de un mismo identificador.

Ejemplos:

  Evitar               Preferir
  -------------------- -----------------------
  `modulo0`            `what-is-design`
  `tipografia`         `typography`
  `pintarProgreso()`   `renderProgress()`
  `guardar()`          `saveProgress()`
  `hecho`              `completedChallenges`
  `--color-fondo`      `--color-background`

------------------------------------------------------------------------

## 3. Convenciones por tecnología

### 3.1 HTML

-   IDs y clases: `kebab-case`.
-   Atributos personalizados: `data-kebab-case`.
-   Los IDs deben ser únicos en todo el documento.
-   Los nombres deben describir el contenido o el propósito del
    elemento.
-   Se utilizarán elementos HTML semánticos cuando correspondan (`nav`,
    `main`, `section`, `article`, `button`, `label`, etc.).
-   Los atributos `aria-*`, `for`, `href` y cualquier otra referencia a
    IDs deben mantenerse sincronizados al renombrar elementos.

Ejemplos:

``` html
<section id="what-is-design" aria-labelledby="what-is-design-title">
  <h2 id="what-is-design-title">Qué es diseñar</h2>
  <button class="button button-primary" type="button">
    Empezar
  </button>
</section>
```

Para identificar tipos o funciones que el JavaScript necesita reconocer,
se preferirán atributos explícitos:

``` html
<span class="note-label" data-note-type="evidence">Evidencia</span>
```

No se utilizará el texto visible como identificador lógico si puede
cambiar, traducirse o editarse.

### 3.2 CSS

-   Clases, IDs y custom properties: `kebab-case`.
-   Las custom properties globales deben tener nombres semánticos y
    prefijos coherentes.
-   Los nombres deben describir función, rol o estado, no el aspecto
    puntual ni el orden de creación.
-   Los estados se expresarán con el prefijo `is-` cuando sean clases de
    estado.
-   Los modificadores describirán una variante concreta y reconocible.
-   No se crearán selectores duplicados en sucesivas capas para corregir
    visualmente reglas anteriores. Cada componente debe tener una
    definición principal y las variantes necesarias agrupadas junto a
    ella.

Ejemplos:

``` css
:root {
  --color-brand: #4a66ac;
  --color-background: #ffffff;
  --color-text: #242852;
  --color-text-muted: #687080;
  --color-border: #d8dce5;
  --font-display: "Fraunces", serif;
  --space-unit: 0.5rem;
  --radius-card: 1rem;
}

.profile-card { ... }
.profile-card-visual { ... }
.profile-card-code { ... }

.nav-menu.is-open { ... }
.result.is-success { ... }
.result.is-error { ... }
```

No usar nombres como `--bl`, `--dk`, `--lt`, `--nv`, `--h2`, `--ac` o
`--ln`: son abreviaturas opacas.

#### Prefijos recomendados para custom properties

  -----------------------------------------------------------------------
  Prefijo                 Uso                     Ejemplos
  ----------------------- ----------------------- -----------------------
  `--color-`              Colores por función     `--color-background`,
                                                  `--color-brand`

  `--font-`               Familias y propiedades  `--font-body`,
                          tipográficas globales   `--font-display`

  `--space-`              Escala de espaciado     `--space-small`,
                                                  `--space-large`

  `--radius-`             Radios                  `--radius-card`,
                                                  `--radius-control`

  `--shadow-`             Sombras                 `--shadow-card`

  `--duration-`           Duraciones de           `--duration-fast`
                          transición              

  `--z-`                  Capas de apilamiento    `--z-navigation`,
                                                  `--z-overlay`
  -----------------------------------------------------------------------

Los prefijos son una guía, no una invitación a crear variables
innecesarias. Si un valor solo tiene sentido dentro de un componente,
puede ser una custom property local con un nombre específico, por
ejemplo `--topic-gradient`.

#### Estados y variantes

-   Estado: `.is-open`, `.is-active`, `.is-disabled`, `.is-success`,
    `.is-error`.
-   Elemento de componente: `.profile-card`, `.profile-card-title`.
-   Variante: `.button-primary`, `.topic-band-light`.
-   Evitar clases genéricas que puedan significar cosas distintas según
    el contexto, como `.on`, `.bg`, `.mt`, `.sh` o `.sub`.

No se impondrá BEM de forma mecánica. Se utilizará una convención
coherente y suficientemente explícita, sin añadir nombres interminables
ni complejidad artificial.

### 3.3 JavaScript

-   Variables y funciones: `camelCase`.
-   Constantes realmente inmutables y compartidas: `UPPER_SNAKE_CASE`.
-   Claves de objetos y propiedades: `camelCase`, salvo que exista un
    contrato externo que obligue a conservar otro formato.
-   Funciones: verbo + objeto o propósito.
-   Booleanos: nombres que expresen claramente una condición (`isOpen`,
    `hasCompleted`, `prefersReducedMotion`).
-   Colecciones: nombres plurales (`navLinks`, `profileCards`,
    `glossaryTerms`).
-   No usar nombres de una sola letra salvo convenciones locales muy
    conocidas y justificadas.

Ejemplos:

``` js
const COLOR_HARMONIES = [...];
const GLOSSARY_TERMS = [...];

var completedChallenges = {};
var currentView = "home";

function renderProgress() { ... }
function updateCornerRadius() { ... }
function saveProgress() { ... }
function getNumberValue() { ... }
```

No usar nombres opacos o ambiguos como `V`, `u`, `hecho`, `pinta`,
`viv`, `ctr`, `sel`, `REV` o `HE`.

#### Nombres de funciones

Usar verbos que describan la acción:

  Acción                   Convención
  ------------------------ --------------------------------
  Obtener un valor         `get...()`
  Calcular                 `calculate...()`
  Crear o construir        `build...()`
  Actualizar               `update...()`
  Renderizar en pantalla   `render...()`
  Guardar                  `save...()`
  Cargar                   `load...()`
  Comprobar                `check...()` o `validate...()`
  Gestionar navegación     `navigate...()` o `route...()`
  Convertir                `convert...()` o `to...()`

No usar `pintar` como verbo genérico para operaciones diferentes.
Distinguir entre calcular, generar HTML, actualizar el DOM y guardar
datos.

#### Selectores DOM

El atajo `$` puede conservarse si se documenta explícitamente como alias
de `document.querySelector`. No debe confundirse con jQuery.

Si se necesita seleccionar varios elementos, usar un nombre inequívoco,
por ejemplo `queryAll`, y mantener la misma convención en todo el
proyecto. No reutilizar `$$` con significados diferentes.

#### Datos y lógica

-   Los datos puros deben separarse de las funciones que los procesan
    cuando ello mejore la claridad.
-   Los arrays y objetos de contenido deben tener nombres descriptivos y
    una estructura consistente.
-   Evitar añadir datos mediante múltiples `push()` dispersos si pueden
    declararse juntos en una única estructura.
-   No duplicar catálogos, mapas o configuraciones equivalentes.
-   Evitar generar HTML con cadenas en múltiples lugares si una función
    clara y reutilizable puede centralizar esa responsabilidad.
-   No convertir automáticamente todo en clases u objetos complejos. La
    abstracción debe responder a una necesidad real.

------------------------------------------------------------------------

## 4. Nomenclatura semántica: reglas concretas

### 4.1 Prohibidos los números de orden

No utilizar números para distinguir elementos que tienen una identidad
propia.

Evitar:

-   `modulo1`, `modulo2`
-   `res1`, `res2`, `res3`
-   `btn1`, `btn2`
-   `hs1`, `hs2`
-   `tk1`, `tk2`
-   `lead2`, `cta2`
-   `ronda3`, `ronda12`

Preferir nombres basados en el contenido o la función:

-   `what-is-design`
-   `challenge-contrast-result`
-   `button-preview-primary`
-   `hero-show-subtitle`
-   `token-chips`
-   `reference-intro`

**Excepción:** los números pueden conservarse cuando forman parte de un
estándar, una escala, un valor técnico o un contrato externo real. No se
permiten como sustituto de una descripción semántica.

### 4.2 Prohibidas las abreviaturas opacas

Evitar abreviaturas cuyo significado no sea evidente para otra persona:
`pr`, `tk`, `hrp`, `cstage`, `gk1`, `pcol`, `viv`, etc.

Se permiten abreviaturas técnicas universales y reconocibles cuando
aportan claridad: `RGB`, `HSL`, `CSS`, `HTML`, `URL`, `SVG`, `WCAG`,
`DOM`.

### 4.3 Un concepto, un nombre

Si un mismo concepto aparece en distintos componentes, se debe utilizar
la misma raíz semántica.

Ejemplos:

-   El estado de éxito será `is-success`, no alternativamente `ok`, `y`,
    `good` o `passed`.
-   El estado de error será `is-error`, no `ko`, `er` o `n`.
-   Un botón compartido será `.button`, con variantes explícitas.
-   Una tarjeta compartida será `.card`, con modificadores o componentes
    específicos cuando su función sea distinta.

No unificar elementos que solo se parecen visualmente pero tienen
responsabilidades diferentes. La consistencia no consiste en llamar
igual a cosas distintas.

### 4.4 Los nombres no describen rondas de diseño

Los comentarios, selectores y bloques CSS no deben llamarse `Rediseño`,
`Ronda 3`, `Ronda 12`, `Nuevo`, `Fix final` o equivalentes.

Los comentarios deben identificar el área funcional:

``` css
/* Design tokens */
/* Navigation */
/* Interactive labs */
/* Glossary view */
/* Motion and accessibility */
```

------------------------------------------------------------------------

## 5. IDs, clases y referencias cruzadas

Los identificadores HTML pueden ser utilizados simultáneamente por CSS,
JavaScript, navegación, accesibilidad, enlaces externos y
almacenamiento. Por tanto:

1.  Antes de renombrar un ID, buscar todas sus apariciones y usos.
2.  Actualizar conjuntamente `id`, `href`, `for`, `aria-labelledby`,
    `aria-describedby`, `aria-controls`, selectores CSS y referencias
    JavaScript.
3.  Comprobar los IDs generados dinámicamente y los construidos por
    concatenación.
4.  Comprobar los enlaces internos y los hashes compartibles.
5.  No cambiar claves persistidas sin un mecanismo de migración.
6.  No cambiar valores de `<option>` sin revisar las funciones y clases
    que dependen de ellos.
7.  No eliminar clases añadidas dinámicamente por JavaScript sin
    comprobar sus reglas CSS y sus efectos.
8.  No asumir que un selector sin referencia literal está muerto: puede
    construirse dinámicamente o utilizarse desde accesibilidad, SVG o
    código indirecto.

Los IDs deben identificar elementos concretos. Las clases deben
representar patrones reutilizables, componentes, variantes o estados.

------------------------------------------------------------------------

## 6. CSS: organización y mantenimiento

El CSS debe estar organizado por función, nunca por cronología de
modificaciones.

Orden recomendado:

1.  Tokens globales y temas.
2.  Reset y estilos base.
3.  Tipografía y elementos HTML.
4.  Estructura y layout.
5.  Navegación y cabecera.
6.  Componentes compartidos.
7.  Componentes y laboratorios por área temática.
8.  Vistas generadas (glosario, reglas y recursos).
9.  Animaciones y estados.
10. Accesibilidad y preferencias de movimiento reducido.

Reglas:

-   Una definición principal por componente.
-   Variantes agrupadas junto al componente correspondiente.
-   Evitar redefinir el mismo selector en múltiples zonas del archivo.
-   Evitar duplicar propiedades para corregir reglas antiguas.
-   No utilizar `!important` como mecanismo habitual de resolución de
    conflictos.
-   No aumentar la especificidad para ganar una batalla contra reglas
    anteriores: resolver la causa.
-   Agrupar media queries de forma lógica y mantener coherencia entre
    temas.
-   No declarar varias veces los mismos tokens de tema en capas
    acumuladas.
-   Eliminar reglas sin uso solo después de comprobar que no se
    necesitan en estados dinámicos, responsive, accesibilidad o
    JavaScript.
-   No convertir estilos dinámicos legítimos en reglas estáticas si
    dependen de controles, datos o instancias concretas.

Los estilos inline solo se conservarán cuando sean realmente dinámicos o
específicos de una instancia. Los estilos de presentación constantes
deben vivir en CSS.

------------------------------------------------------------------------

## 7. JavaScript: organización y robustez

-   Evitar variables globales innecesarias.
-   Agrupar funciones por responsabilidad.
-   Separar datos, estado, lógica de interacción, renderizado y
    persistencia cuando aporte claridad.
-   Evitar funciones que hagan demasiadas cosas.
-   Evitar reasignar funciones como parche para añadir comportamientos.
    Integrar la responsabilidad en un único flujo explícito.
-   No depender del texto visible para identificar elementos o estados.
    Utilizar `data-*`, IDs semánticos o claves internas.
-   Evitar selectores y referencias mágicas dispersas.
-   Centralizar las claves de almacenamiento y los nombres de estados.
-   Mantener las funciones de conversión, cálculo y formato
    independientes de la manipulación del DOM cuando sea posible.
-   Manejar errores de almacenamiento y operaciones que puedan fallar.
-   No añadir listeners duplicados ni observadores que puedan evitarse.
-   Desconectar o limitar observadores cuando su ciclo de vida lo
    requiera.
-   Evitar duplicación de lógica entre controles equivalentes.

### Compatibilidad

La versión actual utiliza JavaScript de estilo ES5. No se debe migrar
automáticamente a `let`, `const`, funciones flecha, módulos ES u otras
características modernas solo por preferencia estética.

Antes de cambiar el nivel de compatibilidad, comprobar el contexto de
ejecución y justificar el beneficio. La refactorización puede mantener
ES5 si es lo más seguro para el proyecto.

jQuery no debe añadirse ni darse por existente si el proyecto no lo
utiliza. El símbolo `$` actual es un selector DOM propio, no una
dependencia de jQuery.

------------------------------------------------------------------------

## 8. Arquitectura y escalabilidad

La arquitectura debe permitir añadir nuevos temas, laboratorios, retos,
perfiles y recursos sin multiplicar parches ni provocar efectos
secundarios en áreas no relacionadas.

Criterios:

-   Cada archivo debe tener una responsabilidad reconocible.
-   Los datos de contenido deben poder localizarse y editarse sin
    recorrer funciones de interacción.
-   Los componentes repetidos deben compartir estructura y
    comportamiento cuando realmente sean equivalentes.
-   Las dependencias entre áreas deben ser explícitas.
-   Los nombres y las estructuras deben permitir incorporar nuevos
    contenidos sin renumerar elementos existentes.
-   No crear una arquitectura monolítica con cientos de
    responsabilidades mezcladas.
-   Tampoco fragmentar el proyecto en decenas de archivos diminutos sin
    una razón funcional.

La separación inicial propuesta para un proyecto pequeño puede ser:

``` text
project/
├── index.html
├── css/
│   └── styles.css
└── js/
    ├── content.js
    └── app.js
```

-   `index.html`: estructura y contenido semántico.
-   `styles.css`: tokens, estilos base, layout, componentes, vistas,
    estados y responsive.
-   `content.js`: datos puros de contenido y catálogos.
-   `app.js`: estado, navegación, interacciones, renderizado y
    persistencia.

Esta estructura es una referencia, no una obligación ciega. Si el
análisis demuestra que otra distribución es más adecuada, debe
justificarse antes de aplicarla.

------------------------------------------------------------------------

## 9. Formato y legibilidad

-   Indentación consistente de dos espacios en HTML, CSS y JavaScript.
-   Una declaración CSS por línea.
-   Una instrucción JavaScript por línea, salvo expresiones cortas cuya
    composición sea realmente más legible.
-   No comprimir funciones, objetos, arrays o bloques de reglas en
    líneas kilométricas.
-   Separar bloques lógicos con líneas en blanco.
-   Usar comillas de forma consistente dentro de cada archivo.
-   Mantener los comentarios breves, útiles y actualizados.
-   Evitar comentarios que repitan literalmente lo que ya expresa el
    código.
-   Eliminar comentarios obsoletos, duplicados o que describan una
    versión anterior.
-   Mantener las cadenas largas y plantillas HTML con formato legible.

El código debe poder revisarse visualmente en un editor normal, sin
tener que desplegar líneas gigantes o descifrar bloques comprimidos.

------------------------------------------------------------------------

## 10. Accesibilidad, navegación y persistencia

La refactorización no debe degradar:

-   Estructura semántica y jerarquía de encabezados.
-   Nombres accesibles y relaciones ARIA.
-   Navegación por teclado y estados de foco.
-   Enlace para saltar al contenido.
-   Preferencia `prefers-reduced-motion`.
-   Contraste y estados visuales.
-   Navegación por hash y restauración del scroll.
-   Glosario autoenlazado.
-   Vistas generadas dinámicamente.
-   Guardado y recuperación del progreso mediante `localStorage`.

Las claves existentes de `localStorage` y los datos ya guardados se
consideran contratos de compatibilidad. Si se renombran, debe existir
una migración que lea los datos antiguos, los transforme y preserve el
progreso. Nunca se debe borrar silenciosamente el progreso de una
persona usuaria.

------------------------------------------------------------------------

## 11. Qué no hacer

Queda expresamente prohibido:

-   Añadir una nueva capa CSS al final cada vez que se solicita un
    ajuste.
-   Resolver conflictos mediante parches acumulativos sin revisar la
    regla original.
-   Renombrar identificadores de forma aislada.
-   Cambiar textos visibles para adaptarlos a la lógica interna.
-   Eliminar código basándose únicamente en una búsqueda literal
    incompleta.
-   Cambiar el diseño o el comportamiento para simplificar la
    refactorización.
-   Introducir dependencias o frameworks sin autorización.
-   Reescribir todo el proyecto desde cero sin justificarlo.
-   Convertir código funcional en una arquitectura innecesariamente
    compleja.
-   Dar por terminado el trabajo solo porque la página carga.
-   Afirmar que algo funciona si no se ha probado.

------------------------------------------------------------------------

## 12. Criterios de aceptación

La refactorización solo se considerará terminada cuando se cumplan estos
criterios:

### Calidad técnica

-   HTML semántico y válido en la medida comprobable.
-   CSS organizado, sin capas históricas acumuladas ni redefiniciones
    innecesarias.
-   JavaScript estructurado por responsabilidades.
-   Identificadores claros, coherentes y en inglés.
-   Ausencia de errores nuevos en consola durante las pruebas
    realizadas.
-   Sin dependencias añadidas injustificadamente.

### Mantenibilidad

-   Otra persona puede localizar rápidamente estilos, datos y funciones.
-   Los nombres explican el propósito sin necesitar una leyenda.
-   Los cambios de un componente no provocan efectos colaterales en
    componentes no relacionados.
-   Las referencias cruzadas están sincronizadas.
-   No hay duplicaciones evitables ni parches que oculten el origen de
    un problema.

### Escalabilidad

-   Se pueden añadir nuevos contenidos y laboratorios siguiendo patrones
    existentes.
-   La ampliación no exige copiar bloques enteros ni acumular
    excepciones.
-   Las responsabilidades y dependencias están suficientemente
    separadas.
-   La estructura puede crecer sin convertirse en un archivo monolítico
    o en una colección caótica de archivos.

### Fidelidad funcional y visual

-   Se conserva el diseño y el contenido originales.
-   Se conservan controles, cálculos, previsualizaciones, retos,
    navegación, animaciones y persistencia.
-   Se mantienen los comportamientos responsive y accesibles.
-   Cualquier diferencia detectada se documenta y se corrige o se
    aprueba expresamente.

------------------------------------------------------------------------

## 13. Regla final de trabajo

Ante cualquier duda entre dos nombres, elegir el que describa mejor la
responsabilidad real y resulte más comprensible para una persona que no
haya participado en el desarrollo.

Ante cualquier duda sobre eliminar, simplificar o modificar una parte
del código, comprobar primero sus dependencias y efectos.

**El objetivo no es que el código parezca moderno ni que sea más corto.
El objetivo es que sea claro, coherente, robusto, mantenible y ampliable
por seres humanos.**
