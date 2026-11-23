/*
 * Static content and reference data.
 * Loaded before app.js as a classic script to preserve file:// compatibility.
 * Public data contract: descriptive UPPER_SNAKE_CASE globals consumed by app.js.
 * Keep user-facing Spanish copy and existing option values unchanged.
 */

var USER_INTERESTS = { code: "Me gusta programar", people: "Me gusta entender a las personas", visual: "Me gusta lo visual" };

var PROFESSIONAL_PROFILES = [
  ["Diseñador gráfico (graphic designer)", "Identidad de marca, logotipos y piezas impresas o para redes.", "Illustrator, Photoshop, Affinity, Figma", ["visual"]],
  ["Investigador UX (UX researcher)", "Entrevista y observa a usuarios para saber qué necesitan.", "Entrevistas, encuestas, pruebas de usabilidad, análisis de datos", ["people"]],
  ["Diseñador UX (UX designer)", "Organiza la información y los flujos para que el producto se entienda.", "Figma, FigJam, wireframes, prototipado, pruebas con usuarios", ["people", "visual"]],
  ["Diseñador UI (UI designer)", "Define el aspecto de las pantallas: color, tipografía y componentes.", "Figma, sistemas de diseño, tokens, CSS básico, WCAG", ["visual"]],
  ["Diseñador de producto (product designer)", "Une UX, UI y negocio. Diseña una funcionalidad de principio a fin.", "Figma, prototipado, datos, pruebas con usuarios", ["people", "visual"]],
  ["Desarrollador front-end (front-end developer)", "Convierte los diseños en páginas que funcionan en el navegador.", "HTML semántico, CSS (flexbox y grid), JavaScript, TypeScript, React, Git, DevTools", ["code", "visual"]],
  ["Ingeniero de diseño (design engineer)", "Perfil híbrido: prototipa en código y mantiene componentes.", "Figma, CSS, JavaScript, TypeScript, React, Storybook, tokens", ["code", "visual"]],
  ["Redactor UX (UX writer)", "Escribe los textos de la interfaz: botones, errores y mensajes.", "Figma, guías de voz y tono, microcopy", ["people"]],
  ["Especialista en accesibilidad (accessibility specialist)", "Revisa que cualquier persona pueda usar el producto.", "WCAG, lectores de pantalla, axe, HTML semántico, ARIA", ["code", "people"]],
  ["Diseñador de sistemas de diseño (design systems designer)", "Mantiene los componentes y reglas que usa todo el equipo.", "Figma, tokens, documentación, Storybook, CSS", ["code", "visual"]]
];

var SVG_FILTERS = { n: "none", p: "url(#f-p)", d: "url(#f-d)", r: "url(#f-r)" };

var ACCESSIBILITY_EXAMPLES = [
  ['<img src="grafico-ventas.png">', false, "La imagen no tiene texto alternativo (alt)."],
  ['<label for="email">Correo</label>\n<input id="email" type="email">', true, "El campo tiene una etiqueta asociada."],
  ['<div onclick="enviar()">Enviar</div>', false, "Un div no recibe el foco ni se activa con teclado. Usa un button."],
  ['<a href="/informe">Haz clic aquí</a>', false, "El texto del enlace no dice a dónde lleva."],
  ['color: #9AA3AE;\nbackground: #FFFFFF;  /* ≈ 2,5 a 1 */', false, "El contraste es de unos 2,5 a 1 y no llega a 4,5 a 1."],
  ['<img src="logo.svg" alt="Acme, ir al inicio">', true, "El alt describe la función de la imagen."]
];

var NIELSEN_HEURISTICS = ["Visibilidad del estado del sistema", "Consistencia y estándares", "Ayudar a recuperarse de errores", "Reconocer antes que recordar", "Diseño estético y minimalista", "Prevención de errores", "Flexibilidad y eficiencia", "Ayuda y documentación"];

var USABILITY_CASES = [
  ["Subes un archivo grande y la pantalla no muestra ningún progreso.", 0],
  ["El botón «Guardar» es verde en una pantalla y gris en otra.", 1],
  ["Un error dice solo «Error 0x80004005».", 2],
  ["Para continuar hay que recordar un código que se vio en la pantalla anterior.", 3],
  ["Una página con ocho banners y textos que no aportan nada a tu tarea.", 4]
];

var COLOR_HARMONIES = {
  mono: [[], "Un solo tono con distintas luminosidades. Sobrio y coherente, pero con poco contraste."],
  comp: [[180], "Opuestos en la rueda (180°). Máximo contraste: úsalos como color y acento."],
  ana: [[-30, 30], "Vecinos en la rueda. Calmados y armoniosos."],
  split: [[150, 210], "Un color y los vecinos de su opuesto. Contraste sin tanta tensión."],
  tri: [[120, 240], "Tres tonos equidistantes. Vivos: deja que domine uno."],
  tet: [[90, 180, 270], "Cuatro tonos formando un rectángulo. Rica, pero difícil de equilibrar."]
};

var COLOR_MEANINGS = [
  ["Rojo", "#C0392B", "Energía, pasión, urgencia y peligro.", "En Asia oriental es suerte y celebración. En los mercados occidentales indica pérdidas; en China, ganancias."],
  ["Naranja", "#E67E22", "Calidez, entusiasmo y cercanía.", "Muy llamativo: funciona mejor como acento que como base."],
  ["Amarillo", "#F1C40F", "Optimismo, atención y advertencia.", "Sobre blanco casi no tiene contraste; el texto encima debe ser oscuro."],
  ["Verde", "#2E7551", "Naturaleza, salud, dinero y «correcto».", "No lo uses como único indicador de éxito: el rojo y el verde se confunden en el daltonismo."],
  ["Azul", "#4A66AC", "Confianza, calma y tecnología.", "Es el color más usado en bancos y software, así que diferencia poco."],
  ["Morado", "#7A4B9B", "Creatividad, lujo y espiritualidad.", "En contextos religiosos hispanos se asocia a la Cuaresma y al duelo."],
  ["Negro", "#14202B", "Elegancia, potencia y seriedad.", "En Occidente es luto; en moda y lujo, sofisticación."],
  ["Blanco", "#FFFFFF", "Limpieza, simplicidad y vacío.", "En parte de Asia oriental se asocia al duelo."]
];

var FONT_CATEGORIES = {
  serif: ["Serif", "Georgia,'Times New Roman',serif", 400, "Georgia, Times, Garamond", "Tradición, seriedad y fiabilidad. Aire editorial.", "Medios, libros, marcas clásicas y titulares con carácter.", "Muy cómoda en papel; en pantalla funciona bien a tamaños medios y grandes.", "Recomendada para leer en papel"],
  sans: ["Sans serif", "Montserrat,'Helvetica Neue',Helvetica,Arial,sans-serif", 400, "Helvetica, Montserrat, Arial", "Modernidad, claridad y neutralidad.", "Interfaces y texto en pantalla. Es la opción más segura.", "La preferida en pantallas, también a tamaños pequeños.", "Recomendada para leer en pantalla"],
  mono: ["Monoespaciada", "Consolas,'Courier New',monospace", 400, "Consolas, Courier, Fira Code", "Técnico, preciso y «de código».", "Código, datos y marcas tecnológicas.", "Cansa en párrafos largos: resérvala para código y datos."],
  display: ["Display", "'Abril Fatface',Georgia,serif", 400, "Abril Fatface, Bungee, Righteous", "Expresiva, llamativa y con mucha personalidad.", "Titulares grandes y carteles. Nunca para párrafos.", "Solo se lee bien a tamaños grandes y en frases cortas."],
  script: ["Manuscrita", "'Brush Script MT','Segoe Script',cursive", 400, "Brush Script, Pacifico, Lobster", "Personal, cálida y elegante.", "Detalles breves: firmas, invitaciones, logotipos.", "Difícil de leer en bloque: úsala en pocas palabras."]
};

var LAYOUT_PRESETS = { art: [[[12, "Cabecera", 48]], [[8, "Contenido", 130], [4, "Lateral", 130]]], tri: [[[4, "Tarjeta 1", 110], [4, "Tarjeta 2", 110], [4, "Tarjeta 3", 110]]], hero: [[[7, "Texto y botón", 160], [5, "Imagen", 160]]] };

var SHAPE_COLORS = { blue: "#4A66AC", terra: "#B5502F", green: "#2E7551" };

var SHAPE_CLIP_PATHS = { flat: "none", diag: "polygon(0 14%, 100% 0, 100% 100%, 0 100%)", wave: "ellipse(80% 100% at 50% 100%)" };

var GLOSSARY_TERMS = [
["ux","UX (experiencia de usuario)","UX|experiencia de usuario","Todo lo que vive una persona al usar un producto: si lo encuentra, lo entiende y le resulta agradable o frustrante."],
["ui","UI (interfaz de usuario)","UI|interfaz de usuario","La parte visible y manipulable de un producto: pantallas, botones, textos y colores."],
["wireframe","Wireframe","wireframes?","Boceto en blanco y negro de una pantalla que fija la estructura y el contenido antes de diseñar el aspecto."],
["prototipo","Prototipo","prototipos?|prototipado","Versión navegable, aunque esté sin terminar, para probar una idea con personas antes de programarla."],
["usabilidad","Usabilidad","usabilidad","Facilidad con que una persona logra su objetivo: eficacia, rapidez y pocos errores."],
["accesibilidad","Accesibilidad","accesibilidad|accesible","Que el producto pueda ser usado por todas las personas, también las que tienen una discapacidad o usan tecnologías de apoyo."],
["wcag","WCAG","WCAG","Pautas de Accesibilidad para el Contenido Web del W3C, con niveles A, AA y AAA. El nivel AA es el que se exige habitualmente."],
["contraste","Ratio de contraste","ratio de contraste|contraste","Relación entre la luminosidad de dos colores, de 1:1 (iguales) a 21:1 (negro sobre blanco)."],
["jerarquia","Jerarquía visual","jerarquía visual|jerarquía","Orden en que el ojo lee los elementos, determinado por tamaño, peso, color y posición."],
["gestalt","Gestalt","Gestalt","Escuela de psicología de la percepción que describe cómo agrupamos lo que vemos."],
["proximidad","Proximidad","proximidad","Principio de Gestalt: lo que está cerca se percibe como un grupo."],
["semejanza","Semejanza","semejanza","Principio de Gestalt: lo que se parece en color, forma o tamaño se percibe como relacionado."],
["region-comun","Región común","región común","Principio de Gestalt: lo que está dentro de una misma caja se percibe como grupo."],
["cierre","Cierre","cierre","Principio de Gestalt: el cerebro completa las formas que están incompletas."],
["continuidad","Continuidad","continuidad","Principio de Gestalt: el ojo sigue líneas y curvas suaves."],
["figura-fondo","Figura y fondo","figura y fondo","Principio de Gestalt: separamos lo que miramos (figura) de lo que queda detrás (fondo)."],
["espacio-blanco","Espacio en blanco","espacio en blanco|espacio negativo","Espacio vacío alrededor de los elementos. No se desperdicia: separa, agrupa y deja respirar."],
["hsl","HSL","HSL","Modelo de color con tono (H), saturación (S) y luminosidad (L). Es más intuitivo que RGB para ajustar colores."],
["tono","Tono (hue)","tono|hue|matiz","Posición del color en la rueda, de 0° a 360°: 0° es rojo, 120° verde y 240° azul."],
["saturacion","Saturación","saturación","Intensidad del color. Al 0 % es un gris; al 100 %, el color más vivo."],
["luminosidad","Luminosidad","luminosidad","Cuánta luz tiene un color, de 0 % (negro) a 100 % (blanco)."],
["acento","Color de acento","color de acento","Color que se usa poco y a propósito para llamar la atención sobre lo importante."],
["complementarios","Colores complementarios","complementaria|complementarios","Colores opuestos en la rueda (180°). Contrastan mucho y funcionan bien como acento."],
["analogos","Colores análogos","análoga|análogos","Colores vecinos en la rueda. Dan armonía y calma."],
["triada","Tríada","tríada|triádica","Tres colores separados 120° en la rueda. Son muy vivos y conviene que domine uno."],
["60-30-10","Regla 60-30-10","60-30-10","Reparto orientativo del color: 60 % dominante, 30 % secundario y 10 % acento."],
["serif","Serif","serif","Tipografía con remates (serifas) en los extremos de las letras, como Georgia o Fraunces."],
["sans-serif","Sans serif","sans serif|sans-serif|palo seco","Tipografía sin remates, como Trebuchet o Arial. En España también se llama «de palo seco»."],
["escala-modular","Escala modular","escala modular|escalas modulares","Serie de tamaños en la que cada uno es el anterior multiplicado por una razón fija, por ejemplo 1,25."],
["interlineado","Interlineado","interlineado|line-height","Distancia entre las líneas de texto. En CSS, line-height; para texto corrido suele ir entre 1,4 y 1,7."],
["medida","Medida (longitud de línea)","longitud de línea|ancho de línea","Número de caracteres por línea. Entre 45 y 75 suele ser cómodo."],
["rem","rem","rem","Unidad CSS relativa al tamaño de fuente de la raíz. Permite que el texto crezca si la persona amplía su tamaño."],
["grid","Cuadrícula (grid)","cuadrícula|grid|retícula|rejilla","Estructura de columnas y filas que ordena la página. En CSS, display: grid."],
["breakpoint","Breakpoint","breakpoints?|punto de ruptura","Ancho de pantalla a partir del cual cambia el diseño."],
["responsive","Responsive","responsive","Diseño que se adapta al tamaño de pantalla."],
["area-tactil","Área táctil","área táctil|área pulsable|áreas pulsables|target size","Tamaño de la zona que se puede pulsar. WCAG 2.2 pide al menos 24 × 24 px y 44 px es lo recomendable."],
["alt","Texto alternativo (alt)","texto alternativo","Descripción en texto de una imagen para lectores de pantalla. Si la imagen es decorativa, el alt va vacío."],
["lector-pantalla","Lector de pantalla","lectores? de pantalla","Software que lee en voz alta lo que hay en pantalla, como NVDA, JAWS o VoiceOver."],
["foco","Foco","foco","Elemento que recibe el teclado en cada momento. Debe verse siempre con claridad."],
["daltonismo","Daltonismo","daltonismo|protanopía|deuteranopía|tritanopía","Dificultad para distinguir ciertos colores, sobre todo rojo y verde. Por eso el color no debe ser la única pista."],
["token","Token de diseño","tokens?","Valor con nombre (color, espacio, radio) guardado en un solo sitio y reutilizado. En CSS, variables como --color-primario."],
["sistema-diseno","Sistema de diseño","sistemas? de diseño|design systems?","Conjunto de tokens, componentes, reglas y documentación que usa un equipo para construir de forma coherente."],
["componente","Componente","componentes?","Pieza reutilizable de interfaz: un botón, una tarjeta, un campo de formulario."],
["atomic","Atomic Design","Atomic Design","Método de Brad Frost que organiza la interfaz en átomos, moléculas, organismos, plantillas y páginas."],
["heuristica","Heurística","heurísticas?","Regla general de experiencia, no una ley, para detectar problemas de usabilidad. Las más conocidas son las 10 de Nielsen."],
["prueba-usabilidad","Prueba de usabilidad","pruebas? de usabilidad|test de usabilidad","Observar a personas reales intentando usar un producto para descubrir dónde se atascan."],
["ley-hick","Ley de Hick","ley de Hick","El tiempo para decidir crece con el número de opciones."],
["ley-fitts","Ley de Fitts","ley de Fitts","El tiempo para alcanzar un objetivo depende de su distancia y su tamaño: lo grande y cercano se pulsa antes."],
["ley-jakob","Ley de Jakob","ley de Jakob","Los usuarios esperan que tu producto funcione como los que ya conocen."],
["ley-miller","Ley de Miller","ley de Miller","La memoria de trabajo retiene unos 7 elementos, con una variación de más o menos 2."],
["microcopy","Microcopy (UX writing)","microcopy|UX writing","Los textos pequeños de la interfaz: botones, errores y ayudas."],
["figma","Figma","Figma","Herramienta de diseño de interfaces en el navegador, estándar en la industria."],
["dark-patterns","Dark patterns","dark patterns|patrones oscuros","Trucos de diseño que empujan al usuario a hacer algo que no quería."],
["tema-oscuro","Tema oscuro","modo oscuro|tema oscuro","Versión de la interfaz con fondos oscuros y texto claro."]
].sort(function (a, b) { return a[1].localeCompare(b[1], "es"); });

var CONTRAST_EXAMPLES = [["#000000", "#FFFFFF", "Negro 100 % sobre blanco", "Cumple, pero deslumbra"], ["#1F2A37", "#F8FAFC", "Casi negro sobre casi blanco", "Recomendado para lectura", 1], ["#8D95A8", "#FFFFFF", "Gris medio sobre blanco", "No cumple AA en texto normal"], ["#F3B824", "#4A66AC", "Azul y su complementario", "Vibra: cansa y se lee mal"]];

var FONT_WEIGHT_NAMES = { 100: "Thin", 200: "ExtraLight", 300: "Light", 400: "Regular", 500: "Medium", 600: "SemiBold", 700: "Bold", 800: "ExtraBold", 900: "Black" };

var GOOGLE_FONT_CATALOG = {
  fr: ["Fraunces", "Fraunces:ital,wght@0,100..900;1,100..900", 100, 900, 0, 1, "serif"],
  in: ["Inter", "Inter:ital,wght@0,100..900;1,100..900", 100, 900, 0, 1, "sans-serif"],
  pf: ["Playfair Display", "Playfair+Display:ital,wght@0,400..900;1,400..900", 400, 900, 0, 1, "serif"],
  ss: ["Source Sans 3", "Source+Sans+3:ital,wght@0,200..900;1,200..900", 200, 900, 0, 1, "sans-serif"],
  cr: ["Crimson Pro", "Crimson+Pro:ital,wght@0,200..900;1,200..900", 200, 900, 0, 1, "serif"],
  wk: ["Work Sans", "Work+Sans:ital,wght@0,100..900;1,100..900", 100, 900, 0, 1, "sans-serif"],
  br: ["Bricolage Grotesque", "Bricolage+Grotesque:wdth,wght@75..100,200..800", 200, 800, 75, 0, "sans-serif", 100],
  sg: ["Space Grotesk", "Space+Grotesk:wght@300..700", 300, 700, 0, 0, "sans-serif"],
  dm: ["DM Sans", "DM+Sans:ital,wght@0,100..1000;1,100..1000", 100, 900, 0, 1, "sans-serif"],
  ar: ["Archivo", "Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,100..900", 100, 900, 62, 1, "sans-serif", 125],
  lf: ["Libre Franklin", "Libre+Franklin:ital,wght@0,100..900;1,100..900", 100, 900, 0, 1, "sans-serif"],
  jb: ["JetBrains Mono", "JetBrains+Mono:ital,wght@0,100..800;1,100..800", 100, 800, 0, 1, "monospace"],
  rm: ["Roboto Mono", "Roboto+Mono:ital,wght@0,100..700;1,100..700", 100, 700, 0, 1, "monospace"],
  an: ["Anybody", "Anybody:wdth,wght@50..150,100..900", 100, 900, 50, 0, "sans-serif", 150],
  lo: ["Lora", "Lora:ital,wght@0,400..700;1,400..700", 400, 700, 0, 1, "serif"],
  bs: ["Big Shoulders Display", "Big+Shoulders+Display:wght@100..900", 100, 900, 0, 0, "sans-serif"],
  mw: ["Merriweather", "Merriweather:ital,wght@0,300..900;1,300..900", 300, 900, 0, 1, "serif"],
  sy: ["Syne", "Syne:wght@400..800", 400, 800, 0, 0, "sans-serif"]
};

var FONT_PAIRINGS = {
  ed: [["fr", "in", "Editorial cálida: la serif con carácter aporta personalidad y la sans neutra deja leer."], ["pf", "ss", "Editorial elegante: contraste alto en el titular, texto muy legible."], ["cr", "wk", "Editorial sobria: serif de lectura suave con una sans amable."]],
  mo: [["br", "in", "Moderna con personalidad: titular expresivo y texto neutro."], ["sg", "dm", "Tecnológica y amable: formas geométricas redondeadas."], ["ar", "lf", "Institucional: dos sans clásicas con ejes de ancho para titulares."]],
  te: [["jb", "in", "Técnica: ambiente de código con texto limpio."], ["rm", "wk", "Técnica y cercana: monoespaciada con una sans redondeada."], ["jb", "lf", "Técnica seria: contraste entre código y texto institucional."]],
  co: [["an", "lo", "Contraste fuerte: titular llamativo y serif tranquila para leer."], ["bs", "mw", "Deportiva y editorial: titular condensado y serif robusta."], ["sy", "cr", "Artística: titular singular y texto sereno."]]
};

var RULE_GROUPS = [["standard", "Normas", "Obligatorias o legales."], ["law", "Leyes y principios", "Describen cómo percibimos y decidimos. Salen de la psicología."], ["evidence", "Evidencias", "Salen de estudios y datos."], ["convention", "Convenciones", "Práctica extendida: útil, pero no obligatoria."]];

var DESIGN_RULES = { standard: [], law: [], evidence: [], convention: [] };
