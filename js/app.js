/*
 * Application behavior.
 * The $ helper is a local alias for document.querySelector, not jQuery.
 * JavaScript syntax remains ES5-compatible.
 */

var $ = function (s) { return document.querySelector(s); };

// Progreso en localStorage (puede fallar, por eso try/catch)
var hecho = {};
try { hecho = JSON.parse(localStorage.getItem("diseno-progreso") || "{}"); } catch (e) { hecho = {}; }
function guardar() { try { localStorage.setItem("diseno-progreso", JSON.stringify(hecho)); } catch (e) {} }
function pintarProgreso() {
  var n = ["contraste", "tipografia", "proximidad", "botones", "accesibilidad", "tema", "heuristicas"].filter(function (k) { return hecho[k]; }).length;
  $("#progtxt").textContent = "Retos superados: " + n + " de 7";
  $("#progbar").value = n;
}
$("#borrar").onclick = function () { hecho = {}; guardar(); location.reload(); };

// Menú: marca la sección visible
var enlaces = document.querySelectorAll("nav a");
if ("IntersectionObserver" in window) {
  var obs = new IntersectionObserver(function (items) {
    items.forEach(function (it) {
      if (it.isIntersecting) {
        enlaces.forEach(function (a) {
          if (a.getAttribute("href") === "#" + it.target.id) { a.setAttribute("aria-current", "true"); } else { a.removeAttribute("aria-current"); }
        });
      }
    });
  }, { rootMargin: "-30% 0px -60% 0px" });
  document.querySelectorAll("main section").forEach(function (s) { obs.observe(s); });
}

// Perfiles


var activos = {};
function pintarPerfiles() {
  var claves = Object.keys(activos), lista = [];
  PROFESSIONAL_PROFILES.forEach(function (p) {
    var c = p[3].filter(function (t) { return activos[t]; }).length;
    if (claves.length === 0 || c > 0) { lista.push({ p: p, c: c }); }
  });
  lista.sort(function (a, b) { return b.c - a.c; });
  $("#profs").innerHTML = lista.map(function (x) {
    var m = x.p[0].match(/^(.*?) \((.*)\)$/);
    var af = x.p[3].map(function (t) { return USER_INTERESTS[t].replace("Me gusta ", ""); }).join(", ");
    return '<article class="card prof k-' + x.p[3][0] + '"><span class="shs" role="img" aria-label="Afinidad: ' + af + '">' +
      x.p[3].map(function (t) { return '<span class="sh s-' + t + '"></span>'; }).join("") +
      '</span><h4>' + m[1] + "</h4><p>" + x.p[1] + "</p><small>" + x.p[2] + "</small></article>";
  }).join("");
  $("#cuenta").textContent = "Mostrando " + lista.length + " de " + PROFESSIONAL_PROFILES.length + " PROFESSIONAL_PROFILES" + (claves.length ? ", ordenados por afinidad." : ".");
}
Object.keys(USER_INTERESTS).forEach(function (k) {
  var b = document.createElement("button");
  b.className = "chip"; b.type = "button"; b.innerHTML = '<span class="sh s-' + k + '" aria-hidden="true"></span>' + USER_INTERESTS[k]; b.dataset.k = k;
  b.setAttribute("aria-pressed", "false");
  b.onclick = function () {
    if (activos[k]) { delete activos[k]; } else { activos[k] = true; }
    b.setAttribute("aria-pressed", activos[k] ? "true" : "false");
    pintarPerfiles();
  };
  $("#chips").appendChild(b);
});
var quitar = document.createElement("button");
quitar.className = "link"; quitar.type = "button"; quitar.textContent = "Quitar SVG_FILTERS";
quitar.onclick = function () {
  activos = {};
  document.querySelectorAll(".chip").forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
  pintarPerfiles();
};
$("#chips").appendChild(quitar);
pintarPerfiles();

// Reto 1: proximidad (se evalúa al mover los controles)
function actualizar1() {
  var d = +$("#dentro").value, e = +$("#entre").value, r = $("#res1");
  $("#vdentro").textContent = d; $("#ventre").textContent = e;
  var st = $("#stage1");
  st.style.display = "grid"; st.style.rowGap = e + "px";
  st.innerHTML = '<div class="g"><div class="fld">Nombre</div><div class="fld">Correo</div><div class="fld">Teléfono</div></div><div class="g"><div class="fld">Calle</div><div class="fld">Ciudad</div></div>';
  st.querySelectorAll(".g").forEach(function (g) { g.style.display = "grid"; g.style.gap = d + "px"; });
  st.setAttribute("aria-label", "Vista previa: dos grupos de campos con " + d + " píxeles dentro de cada grupo y " + e + " píxeles entre grupos");
  $("#css1").textContent = ".formulario { display: grid; row-gap: " + e + "px; }\n.grupo { display: grid; gap: " + d + "px; }";
  var msg, ok = false;
  if (d < 4) { msg = "✗ Aún no: los campos casi se tocan. Sube el espacio de dentro del grupo."; }
  else if (d > 24) { msg = "✗ Aún no: hay demasiado aire dentro del grupo y se pierde la sensación de bloque."; }
  else if (e < 2 * d) { msg = "✗ Aún no: se ve casi un único bloque. Aumenta el espacio entre grupos."; }
  else { ok = true; msg = "✓ Superado: el espacio entre grupos es el doble o más que el de dentro y se ven dos bloques."; }
  r.textContent = msg; r.className = "res " + (ok ? "ok" : "ko");
  if (ok && !hecho.proximidad) { hecho.proximidad = true; guardar(); pintarProgreso(); }
}
$("#dentro").oninput = actualizar1; $("#entre").oninput = actualizar1;
$("#reset1").onclick = function () { $("#dentro").value = 16; $("#entre").value = 16; actualizar1(); };

// Laboratorio: forma
function actualizar2() {
  var r = +$("#radio").value;
  $("#vradio").textContent = r;
  $("#card2").style.borderRadius = r + "px";
  $("#btn2").style.borderRadius = r + "px";
  $("#css2").textContent = ".tarjeta, .boton { border-radius: " + r + "px; }";
  $("#vibra").textContent = "Sensación habitual: " + (r <= 2 ? "serio, técnico, estable." : r <= 8 ? "neutro y profesional." : r <= 20 ? "amable y cercano." : "juguetón y blando.");
}
$("#radio").oninput = actualizar2;

actualizar1(); actualizar2(); pintarProgreso();

// ===== Utilidades de los temas nuevos =====
function V(id) { return +$("#" + id).value; }
function bind(ids, fn) {
  ids.forEach(function (i) {
    var e = $("#" + i);
    e.addEventListener("input", function () { var o = $("#v" + i); if (o) { o.textContent = e.value; } fn(); });
  });
  fn();
}
function reto(key, id, ok, msg) {
  var r = $("#" + id);
  r.textContent = (ok ? "✓ Superado: " : "✗ Aún no: ") + msg;
  r.className = "res " + (ok ? "ok" : "ko");
  if (ok && !hecho[key]) { hecho[key] = true; guardar(); pintarProgreso(); }
}
// Color: HSL a RGB, luminancia relativa y ratio de contraste (fórmula de WCAG)
function h2r(h, s, l) {
  s /= 100; l /= 100;
  var a = s * Math.min(l, 1 - l);
  var f = function (n) { var k = (n + h / 30) % 12; return Math.round(255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)))); };
  return [f(0), f(8), f(4)];
}
function lum(c) {
  var v = c.map(function (x) { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); });
  return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
}
function ratio(a, b) { var x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
function hex(c) { return "#" + c.map(function (x) { return ("0" + x.toString(16)).slice(-2); }).join("").toUpperCase(); }
function hsl(h, s, l) { return "hsl(" + h + ", " + s + "%, " + l + "%)"; }
function fx(n, d) { return n.toFixed(d).replace(".", ","); }

// ===== Color =====
bind(["hh", "ss", "ll"], function () {
  var h = V("hh"), sa = V("ss"), l = V("ll"), c = h2r(h, sa, l);
  $("#mixsw").style.background = hsl(h, sa, l);
  $("#mixcss").textContent = "color: " + hsl(h, sa, l) + ";\n/* " + hex(c) + " */";
  $("#mixinfo").textContent = "Contraste con blanco: " + fx(ratio(c, [255, 255, 255]), 1) + " a 1. Con negro: " + fx(ratio(c, [0, 0, 0]), 1) + " a 1.";
});
bind(["ctx", "cbg"], function () {
  var t = h2r(214, 20, V("ctx")), b = h2r(214, 45, V("cbg")), r = ratio(t, b);
  var pv = $("#ctprev"); pv.style.color = hsl(214, 20, V("ctx")); pv.style.background = hsl(214, 45, V("cbg"));
  $("#ctcss").textContent = "color: " + hsl(214, 20, V("ctx")) + ";\nbackground: " + hsl(214, 45, V("cbg")) + ";";
  $("#ctinfo").textContent = "Contraste: " + fx(r, 1) + " a 1" + (r >= 7 ? " (AAA)" : r >= 4.5 ? " (AA)" : r >= 3 ? " (solo texto grande)" : " (no cumple)");
  reto("contraste", "res2", r >= 4.5, "tienes " + fx(r, 1) + " a 1" + (r >= 4.5 ? ", cumple AA para texto normal." : " y necesitas 4,5 a 1."));
});
// ===== Tipografía =====
bind(["tb", "tq"], function () {
  var base = V("tb"), q = parseFloat($("#tq").value), names = ["Pequeño", "Texto", "Subtítulo", "Título 3", "Título 2", "Título 1"], h = "", css = ":root {\n";
  for (var i = -1; i <= 4; i++) {
    var px = base * Math.pow(q, i), n = names[i + 1];
    h += '<div style="font-size:' + px.toFixed(1) + 'px;line-height:1.2;margin-bottom:8px;' + (i >= 1 ? "font-family:var(--font-display);font-weight:600" : "") + '">' + n + ' <small style="font-size:.8rem;font-weight:400;color:var(--color-text-muted)">' + px.toFixed(1) + " px</small></div>";
    css += "  --texto-" + (i + 2) + ": " + (px / 16).toFixed(3) + "rem;\n";
  }
  $("#tscale").innerHTML = h; $("#tcss").textContent = css + "}";
});
bind(["rlh", "rme", "rsz"], function () {
  var lh = V("rlh"), me = V("rme"), sz = V("rsz"), p = $("#rpv");
  p.style.lineHeight = lh; p.style.maxWidth = me + "ch"; p.style.fontSize = sz + "px";
  var f = [];
  if (lh < 1.4 || lh > 1.7) { f.push("el interlineado debe estar entre 1,4 y 1,7 (tienes " + fx(lh, 2) + ")"); }
  if (me < 45 || me > 80) { f.push("el ancho de línea debe estar entre 45 y 80 caracteres (tienes " + me + ")"); }
  if (sz < 16) { f.push("el tamaño mínimo cómodo es 16 px (tienes " + sz + ")"); }
  var r3 = $("#res3"); r3.className = "res " + (f.length ? "ko" : "ok"); r3.textContent = (f.length ? "✗ Aún no: " + f.join("; ") + "." : "✓ El párrafo se lee cómodo.");
});

// ===== Interfaces =====
bind(["ip", "ig", "it"], function () {
  var pd = V("ip"), g = V("ig"), t = V("it"), c = $("#icard");
  c.style.padding = pd + "px"; c.style.gap = g + "px"; $("#ititle").style.fontSize = t + "px";
  $("#icss").textContent = ".tarjeta {\n  padding: " + pd + "px;\n  gap: " + g + "px;\n}\n.tarjeta h3 { font-size: " + t + "px; }";
  var m = pd % 8 === 0 && g % 8 === 0;
  $("#imul").textContent = m ? "✓ Espacios en múltiplos de 8." : "El espacio interior y el de entre elementos no son ambos múltiplos de 8 (opcional: 4 vale para ajustes finos).";
});
bind(["b1", "b2", "b3"], function () {
  ["b1", "b2", "b3"].forEach(function (i, k) { $("#pb" + (k + 1)).className = $("#" + i).value; });
  var f = ["b1", "b2", "b3"].filter(function (i) { return $("#" + i).value === "f"; });
  var ok = f.length === 1 && $("#b1").value === "f";
  reto("botones", "res4", ok, ok ? "solo «Guardar cambios» es el botón principal." : f.length === 0 ? "ninguno destaca: la acción principal debe ir rellena." : f.length > 1 ? "hay " + f.length + " botones rellenos y compiten entre sí." : "el botón principal es «Guardar cambios», no «" + (f[0] === "b2" ? "Cancelar" : "Eliminar cuenta") + "».");
});
bind(["rw"], function () {
  var w = V("rw"), cols = Math.max(1, Math.floor((w + 16) / 176)), pv = $("#rprev");
  pv.style.width = (w / 1200 * 100) + "%"; pv.style.gridTemplateColumns = "repeat(" + cols + ",1fr)";
  pv.innerHTML = new Array(7).join("<i></i>");
  $("#rcss").textContent = ".rejilla {\n  display: grid;\n  gap: 16px;\n  grid-template-columns:\n    repeat(auto-fit, minmax(160px, 1fr));\n}";
  $("#rinfo").textContent = "Con " + w + " px caben " + cols + (cols === 1 ? " columna." : " columnas.");
});

// ===== Accesibilidad =====

bind(["dt"], function () { $("#dstage").style.filter = SVG_FILTERS[$("#dt").value]; });

$("#rev").innerHTML = ACCESSIBILITY_EXAMPLES.map(function (r, i) {
  return '<div class="rev"><pre class="code"></pre><fieldset style="margin:0"><legend class="sub" style="margin-bottom:4px">Fragmento ' + (i + 1) + '</legend><label><input type="radio" name="r' + i + '" value="1"> Correcto</label><label><input type="radio" name="r' + i + '" value="0"> Con fallo</label></fieldset><p class="why" id="why' + i + '"></p></div>';
}).join("");
document.querySelectorAll("#rev pre").forEach(function (e, i) { e.textContent = ACCESSIBILITY_EXAMPLES[i][0]; });
$("#revbtn").onclick = function () {
  var ok = 0, sin = 0;
  ACCESSIBILITY_EXAMPLES.forEach(function (r, i) {
    var sel = document.querySelector('input[name="r' + i + '"]:checked'), w = $("#why" + i);
    if (!sel) { sin++; w.textContent = ""; return; }
    var bien = (sel.value === "1") === r[1];
    if (bien) { ok++; }
    w.className = "why " + (bien ? "ok" : "ko"); w.textContent = (bien ? "✓ " : "✗ ") + r[2];
  });
  if (sin) { $("#res5").className = "res ko"; $("#res5").textContent = "Responde los " + ACCESSIBILITY_EXAMPLES.length + " fragmentos antes de comprobar."; return; }
  reto("accesibilidad", "res5", ok === ACCESSIBILITY_EXAMPLES.length, ok + " de " + ACCESSIBILITY_EXAMPLES.length + " correctas." + (ok < ACCESSIBILITY_EXAMPLES.length ? " Revisa las explicaciones y cambia tus respuestas." : ""));
};

// ===== Sistemas de diseño =====
bind(["sp", "sr", "ss2"], function () {
  var h = V("sp"), r = V("sr"), u = V("ss2"), c = h2r(h, 55, 42), el = $("#sv");
  el.style.setProperty("--control-accent-color", hsl(h, 55, 42)); el.style.setProperty("--control-radius", r + "px"); el.style.setProperty("--control-spacing", u + "px");
  el.style.setProperty("--control-text-color", ratio(c, [255, 255, 255]) >= ratio(c, [20, 32, 43]) ? "#fff" : "#14202B");
  $("#scss").textContent = ":root {\n  --color-primario: " + hsl(h, 55, 42) + ";\n  --radio: " + r + "px;\n  --espacio: " + u + "px;\n}";
});
bind(["tlc", "tdk"], function () {
  var lc = h2r(214, 60, V("tlc")), ld = h2r(214, 60, V("tdk")), wl = [255, 255, 255], dk = h2r(222, 30, 12);
  var a = ratio(lc, wl), b = ratio(ld, dk);
  $("#thl").style.cssText = "background:#fff;color:" + hsl(214, 60, V("tlc")); $("#thd").style.cssText = "background:" + hsl(222, 30, 12) + ";color:" + hsl(214, 60, V("tdk"));
  $("#trl").textContent = "Contraste " + fx(a, 1) + " a 1"; $("#trd").textContent = "Contraste " + fx(b, 1) + " a 1";
  var f = []; if (a < 4.5) { f.push("el tema claro tiene " + fx(a, 1) + " a 1"); } if (b < 4.5) { f.push("el tema oscuro tiene " + fx(b, 1) + " a 1"); }
  reto("tema", "res6", f.length === 0, f.length ? f.join(" y ") + "." : "los dos temas cumplen AA con tokens distintos.");
});

// ===== Usabilidad =====


$("#heu").innerHTML = USABILITY_CASES.map(function (c, i) {
  var o = '<option value="">Elige una heurística</option>' + NIELSEN_HEURISTICS.map(function (h, k) { return '<option value="' + k + '">' + h + "</option>"; }).join("");
  return '<div class="rev"><p style="margin:0 0 12px"><strong>Caso ' + (i + 1) + ".</strong> " + c[0] + '</p><label for="h' + i + '" class="sub" style="font-weight:400">Heurística</label><select id="h' + i + '">' + o + '</select><p class="why" id="hw' + i + '"></p></div>';
}).join("");
$("#heubtn").onclick = function () {
  var ok = 0, sin = 0;
  USABILITY_CASES.forEach(function (c, i) {
    var v = $("#h" + i).value, w = $("#hw" + i);
    if (v === "") { sin++; w.textContent = ""; return; }
    var bien = +v === c[1]; if (bien) { ok++; }
    w.className = "why " + (bien ? "ok" : "ko"); w.textContent = bien ? "✓ Correcto: " + NIELSEN_HEURISTICS[c[1]] + "." : "✗ Piensa en qué necesitaría la persona en ese momento.";
  });
  if (sin) { $("#res7").className = "res ko"; $("#res7").textContent = "Elige una heurística en los " + USABILITY_CASES.length + " casos."; return; }
  reto("heuristicas", "res7", ok === USABILITY_CASES.length, ok + " de " + USABILITY_CASES.length + " correctas.");
};
// ===== Color: modelos, rueda, combinación y psicología =====
function rgb2hsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  var mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn, l = (mx + mn) / 2, h = 0, sa = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  if (d) { h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h = Math.round(h * 60); if (h < 0) { h += 360; } }
  return [h, Math.round(sa * 100), Math.round(l * 100)];
}
bind(["rr", "rg", "rb"], function () {
  var r = V("rr"), g = V("rg"), b = V("rb"), k = 1 - Math.max(r, g, b) / 255;
  var cmy = [r, g, b].map(function (x) { return k === 1 ? 0 : Math.round((1 - x / 255 - k) / (1 - k) * 100); });
  var hl = rgb2hsl(r, g, b);
  $("#rgbsw").style.background = "rgb(" + r + "," + g + "," + b + ")";
  $("#rgbout").textContent = "rgb(" + r + ", " + g + ", " + b + ")\n" + hex([r, g, b]) + "\n" + hsl(hl[0], hl[1], hl[2]) + "\ncmyk(" + cmy[0] + "%, " + cmy[1] + "%, " + cmy[2] + "%, " + Math.round(k * 100) + "%)";
});


function pintaPsi(i) {
  var c = COLOR_MEANINGS[i]; document.querySelectorAll("#psichips .chip").forEach(function (b, k) { b.setAttribute("aria-pressed", k === i ? "true" : "false"); });
  $("#psi").innerHTML = '<div class="pcol"><div class="sw" style="background:' + c[1] + '" role="img" aria-label="Muestra de ' + c[0].toLowerCase() + '"></div><div style="flex:1;min-width:14rem"><p><strong>' + c[0] + ".</strong> " + c[2] + "</p><p class='ui'><strong>Ojo:</strong> " + c[3] + "</p></div></div>";
}
COLOR_MEANINGS.forEach(function (c, i) {
  var b = document.createElement("button"); b.className = "chip"; b.type = "button"; b.setAttribute("aria-pressed", "false");
  b.innerHTML = '<span class="sh" style="background:' + c[1] + ';border-radius:50%;box-shadow:0 0 0 1px #14202B66"></span>' + c[0];
  b.onclick = function () { pintaPsi(i); }; $("#psichips").appendChild(b);
});
pintaPsi(4);

// ===== Tipografía: familias, voz y combinaciones =====

Object.keys(FONT_CATEGORIES).forEach(function (k) {
  var b = document.createElement("button"); b.className = "chip"; b.type = "button"; b.setAttribute("aria-pressed", "false"); b.textContent = FONT_CATEGORIES[k][0]; b.dataset.k = k;
  b.onclick = function () { pintaFam(k); }; $("#famchips").appendChild(b);
});
function pintaFam(k) {
  var f = FONT_CATEGORIES[k]; document.querySelectorAll("#famchips .chip").forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.k === k ? "true" : "false"); });
  $("#fam").innerHTML = '<div class="fam"><div><div class="aa" style="font-family:' + f[1] + '">Aa</div><p style="font-family:' + f[1] + ';font-size:1.3rem;margin:8px 0 0">Diseña con intención</p></div><div>' + (f[7] ? '<p class="recom"><span class="sh s-visual" aria-hidden="true"></span>' + f[7] + "</p>" : "") + '<p><strong>Ejemplos:</strong> ' + f[3] + "</p><p><strong>Sensación habitual:</strong> " + f[4] + "</p><p style='margin:0'><strong>Úsala para:</strong> " + f[5] + "</p><p style='margin:12px 0 0'><strong>Legibilidad:</strong> " + f[6] + "</p></div></div>";
}
pintaFam("serif");
bind(["msg"], function () {
  var m = $("#msg").value;
  $("#voz").innerHTML = Object.keys(FONT_CATEGORIES).map(function (k) { return '<div class="fr"><span style="font-family:' + FONT_CATEGORIES[k][1] + '">' + m + "</span><small>" + FONT_CATEGORIES[k][0] + "</small></div>"; }).join("");
});
// ===== Tamaño y jerarquía =====
bind(["cw"], function () {
  var w = V("cw"), px = Math.min(48, Math.max(24, 16 + 0.02 * w));
  $("#clprev").style.fontSize = px + "px";
  $("#clcss").textContent = "h1 {\n  font-size: clamp(1.5rem, 1rem + 2vw, 3rem);\n}";
  $("#clout").textContent = "Con " + w + " px de ancho: " + fx(px, 1) + " px (mínimo 24, máximo 48).";
});
bind(["hr"], function () {
  var r = V("hr"); $("#hrt").style.fontSize = (16 * r) + "px"; $("#hrt").style.display = "block";
  $("#hrout").textContent = "Título de " + fx(16 * r, 1) + " px sobre texto de 16 px (razón " + fx(r, 1) + "): " + (r < 1.2 ? "casi no hay jerarquía." : r <= 2.2 ? "jerarquía clara." : "contraste excesivo.");
});

// ===== Menú, color y recetas =====

// ===== Menú con desplegables =====
var grupos = document.querySelectorAll(".grp > button");
function cerrarMenus() { grupos.forEach(function (b) { b.setAttribute("aria-expanded", "false"); b.nextElementSibling.hidden = true; }); }
grupos.forEach(function (b) {
  b.onclick = function (e) {
    var abierto = b.getAttribute("aria-expanded") === "true"; cerrarMenus();
    if (!abierto) { b.setAttribute("aria-expanded", "true"); b.nextElementSibling.hidden = false; }
    e.stopPropagation();
  };
});
document.addEventListener("click", function (e) { if (!e.target.closest(".grp")) { cerrarMenus(); } });
document.addEventListener("keydown", function (e) { if (e.key === "Escape") { cerrarMenus(); } });
$(".navtoggle").onclick = function () { var o = $("#menu").classList.toggle("open"); this.setAttribute("aria-expanded", o ? "true" : "false"); };
window.addEventListener("hashchange", function () { cerrarMenus(); $("#menu").classList.remove("open"); $(".navtoggle").setAttribute("aria-expanded", "false"); });
function marcaGrupos() { grupos.forEach(function (b) { b.classList.toggle("on", !!b.parentElement.querySelector('a[aria-current="true"]')); }); }
new MutationObserver(marcaGrupos).observe($("nav"), { attributes: true, subtree: true, attributeFilter: ["aria-current"] });

// ===== Color: paleta y wireframe con la armonía elegida =====
function chipPal(c, rol) { return '<div class="pc"><i style="background:' + hex(c) + '"></i><span>' + hex(c) + "<small>" + rol + "</small></span></div>"; }
bind(["ha", "hm"], function () {
  var h = V("ha"), a = COLOR_HARMONIES[$("#hm").value], hs = [h].concat(a[0].map(function (o) { return (h + o + 360) % 360; })), dots = "";
  hs.forEach(function (x, i) {
    var t = x * Math.PI / 180;
    dots += '<i class="wd" style="left:' + (50 + 34.5 * Math.sin(t)) + "%;top:" + (50 - 34.5 * Math.cos(t)) + "%;background:" + hsl(x, 80, 55) + (i ? "" : ";width:40px;height:40px") + '"></i>';
  });
  $("#wdots").innerHTML = dots; $("#wcen").textContent = h + "°"; $("#hdesc").textContent = a[1];
  var acc = hs.length > 1 ? hs[1] : h, third = hs.length > 2 ? hs[2] : h;
  var domC = h2r(h, 30, 96), secC = h2r(h, 45, 32), acC = h2r(acc, 75, 62), thC = h2r(third, hs.length > 2 ? 70 : 55, hs.length > 2 ? 50 : 62);
  var dom = hsl(h, 30, 96), sec = hsl(h, 45, 32), ac = hsl(acc, 75, 62);
  $("#pal1").innerHTML = hs.map(function (x, i) { return chipPal(h2r(x, 80, 55), i ? "Armonía " + i : "Base"); }).join("");
  $("#pal2").innerHTML = chipPal(domC, "Dominante 60 %") + chipPal(secC, "Secundario 30 %") + chipPal(acC, "Acento 10 %");
  var bars = $("#hbar").children; bars[0].style.background = dom; bars[1].style.background = sec; bars[2].style.background = ac;
  $("#hbar").style.border = "1px solid var(--color-border)";
  $("#hcss").textContent = "--dominante: " + dom + ";\n--secundario: " + sec + ";\n--acento: " + ac + ";";
  var wf = $("#wf"); wf.style.background = dom; wf.style.color = sec;
  wf.querySelector(".wf-nav").style.background = sec; wf.querySelector(".wf-nav b").style.background = ac;
  wf.querySelector("h5").style.color = sec; wf.querySelector("p").style.color = sec;
  var bt = wf.querySelector(".wf-btn"); bt.style.background = ac; bt.style.color = "#14202B";
  wf.querySelector(".b1").style.fill = hex(thC); wf.querySelector(".b2").style.fill = sec; wf.querySelector(".b3").style.fill = ac; wf.querySelector(".c1").style.fill = hex(thC);
  var t = "";
  [95, 85, 75, 65, 55, 45, 35, 25, 15].forEach(function (l) {
    var c = h2r(h, 55, l), r = ratio(c, [255, 255, 255]), txt = r > ratio(c, [20, 32, 43]) ? "#fff" : "#14202B";
    t += '<div class="tn" style="background:' + hsl(h, 55, l) + ";color:" + txt + '" title="Luminosidad ' + l + " %. Contraste con blanco " + fx(r, 1) + ' a 1">' + fx(r, 1) + "</div>";
  });
  $("#tints").innerHTML = t;
});

// ===== Recetas =====
function escena(id) {
  return '<svg class="ph" viewBox="0 0 200 140" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="sk' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ACCBF9"/><stop offset="1" stop-color="#FDE7B8"/></linearGradient></defs><rect width="200" height="140" fill="url(#sk' + id + ')"/><circle cx="150" cy="40" r="18" fill="#E0A03A"/><path d="M0 140V95l40-35 35 30 35-45 45 50 45-30v75z" fill="#4A66AC"/><path d="M0 140v-30l50-20 50 25 60-20 40 15v30z" fill="#242852"/></svg>';
}

bind(["gc", "gp", "gg"], function () {
  var n = +$("#gc").value, g = V("gg"), filas = LAYOUT_PRESETS[$("#gp").value], cols = "", bl = "", css = [], tot = 0;
  for (var i = 0; i < n; i++) { cols += "<i></i>"; }
  filas.forEach(function (f) {
    var sp = f.map(function (b) { return Math.max(1, Math.round(b[0] * n / 12)); });
    sp[sp.length - 1] = Math.max(1, n - sp.slice(0, -1).reduce(function (a, b) { return a + b; }, 0));
    f.forEach(function (b, k) { bl += '<div style="grid-column:span ' + sp[k] + ";min-height:" + b[2] + 'px">' + b[1] + " · " + sp[k] + "</div>"; css.push(b[1].toLowerCase().split(" ")[0] + " { grid-column: span " + sp[k] + "; }"); });
  });
  var tpl = "repeat(" + n + ", 1fr)";
  ["#gcols", "#gblocks"].forEach(function (id) { $(id).style.gridTemplateColumns = tpl; $(id).style.gap = g + "px"; });
  $("#gcols").innerHTML = cols; $("#gblocks").innerHTML = bl;
  $("#gcss").textContent = ".maqueta {\n  display: grid;\n  grid-template-columns: " + tpl + ";\n  gap: " + g + "px;\n}\n" + css.join("\n");
  var u = bl.match(/span (\d+)/g).map(function (x) { return x; });
  $("#gout").textContent = n + " columnas con " + g + " px de hueco." + ($("#gp").value === "tri" && n % 3 !== 0 ? " Con " + n + " columnas las tres tarjetas no salen iguales." : "");
});
function heroHTML(l, sub, sec, soc) {
  var txt = '<div class="hh-t"><h5>Aprende diseño web</h5>' + (sub ? "<p>Material práctico para quien ya sabe programar.</p>" : "") + '<div class="hh-b"><span class="b1">Empezar</span>' + (sec ? '<span class="b2">Ver temario</span>' : "") + "</div>" + (soc ? "<small>★★★★★ Más de 2.000 alumnos</small>" : "") + "</div>";
  if (l === "split") { return '<div class="hh split">' + txt + '<div class="hh-i">' + escena("h1") + "</div></div>"; }
  if (l === "center") { return '<div class="hh center">' + txt + "</div>"; }
  return '<div class="hh bg">' + escena("h2") + '<div class="hh-o"></div>' + txt + "</div>";
}
bind(["hl", "hs1", "hs2", "hs3"], function () {
  var l = $("#hl").value;
  $("#hprev").innerHTML = heroHTML(l, $("#hs1").checked, $("#hs2").checked, $("#hs3").checked);
  $("#hcode").textContent = { split: ".hero {\n  display: grid;\n  grid-template-columns: 3fr 2fr;\n  align-items: center;\n  gap: 48px;\n}", center: ".hero {\n  max-width: 48rem;\n  margin-inline: auto;\n  text-align: center;\n}", bg: ".hero { position: relative; color: #fff; }\n.hero::before {\n  content: \"\"; position: absolute; inset: 0;\n  background: linear-gradient(90deg,\n    rgb(20 32 43 / .85), rgb(20 32 43 / .2));\n}" }[l];
  $("#hnote").textContent = { split: "Composición dividida: manda el texto y la imagen lo apoya.", center: "Centrado: ideal con un mensaje corto y una sola acción.", bg: "Con imagen de fondo, el degradado oscuro garantiza el contraste del texto (WCAG 1.4.3)." }[l];
});
bind(["fs", "fa", "fo"], function () {
  var f = $("#fs").value, a = $("#fa").value, o = V("fo"), p = $("#fprev");
  var forma = { rect: "border-radius: 0;", round: "border-radius: 24px;", circle: "border-radius: 50%;", diag: "clip-path: polygon(0 0, 100% 0,\n    100% 85%, 0 100%);", arch: "border-radius: 999px 999px 0 0;" }[f];
  var st = { rect: "border-radius:0", round: "border-radius:24px", circle: "border-radius:50%", diag: "clip-path:polygon(0 0,100% 0,100% 85%,0 100%)", arch: "border-radius:999px 999px 0 0" }[f];
  p.style.cssText = "aspect-ratio:" + (f === "circle" ? "1/1" : a) + ";" + st + ";width:" + (f === "circle" ? "70%" : "100%");
  p.innerHTML = escena("f") + '<div class="fov" style="background:linear-gradient(to top,rgba(20,32,43,' + (o / 100) + '),transparent 70%)"></div><span class="ftxt">Texto sobre la foto</span>';
  $("#fcss").textContent = ".foto {\n  aspect-ratio: " + (f === "circle" ? "1 / 1" : a.replace("/", " / ")) + ";\n  object-fit: cover;\n  " + forma + "\n}\n.foto::after {\n  background: linear-gradient(to top,\n    rgb(20 32 43 / " + (o / 100) + "), transparent 70%);\n}";
});


bind(["zd", "zc", "zo"], function () {
  var d = $("#zd").value, c = $("#zc").value, o = $("#zo").checked, bg = $("#zbg");
  bg.style.background = SHAPE_COLORS[c]; bg.style.clipPath = SHAPE_CLIP_PATHS[d]; $("#zcard").hidden = !o;
  $("#zcss").textContent = ".ruptura {\n  position: relative;\n}\n.ruptura::before {\n  content: \"\"; position: absolute; inset: 0;\n  background: " + SHAPE_COLORS[c] + ";\n  clip-path: " + SHAPE_CLIP_PATHS[d].replace(/, /g, ",\n    ") + ";\n}" + (o ? "\n.tarjeta { margin-bottom: -28px; /* se solapa */ }" : "");
});



// ===== Glosario =====


// ===== Contraste: ejemplos =====

function hexRgb(x) { return [1, 3, 5].map(function (i) { return parseInt(x.substr(i, 2), 16); }); }
$("#exs").innerHTML = CONTRAST_EXAMPLES.map(function (e) {
  var r = ratio(hexRgb(e[0]), hexRgb(e[1]));
  return '<figure class="ex' + (e[4] ? " rec" : "") + '"><div class="exb" style="background:' + e[1] + ";color:" + e[0] + '"><strong>Texto de ejemplo</strong><span>' + fx(r, 1) + ':1</span></div><figcaption><strong>' + e[2] + "</strong><span>" + e[3] + "</span></figcaption></figure>";
}).join("");

// ===== Tipografía: pesos y combinaciones de ejemplo =====

GLOSSARY_TERMS.push(
["peso-tipografico","Peso tipográfico","peso tipográfico|pesos tipográficos","Grosor de las letras, de 100 (fino) a 900 (negro). En CSS, font-weight."],
["cursiva","Cursiva","cursivas?|italic","Letra inclinada y redibujada, distinta de una simple inclinación artificial (oblique)."],
["condensada","Condensada","condensada|condensed","Variante de una tipografía con letras estrechas. Ahorra espacio."],
["expandida","Expandida","expandida|expanded","Variante de una tipografía con letras anchas. Da presencia a titulares."],
["typescript","TypeScript","TypeScript","JavaScript con tipos. Detecta errores antes de ejecutar el código."],
["git","Git","Git","Sistema de control de versiones: guarda la historia de un proyecto y permite colaborar."],
);


// ===== Degradados =====
bind(["gt", "ga", "gk1", "gk2"], function () {
  var t = $("#gt").value, a = V("ga"), c1 = $("#gk1").value, c2 = $("#gk2").value;
  var css = t === "linear" ? "linear-gradient(" + a + "deg, " + c1 + ", " + c2 + ")" : t === "radial" ? "radial-gradient(circle, " + c1 + ", " + c2 + ")" : "conic-gradient(from " + a + "deg, " + c1 + ", " + c2 + ", " + c1 + ")";
  $("#gprev").style.background = css; $("#gcsx").textContent = "background: " + css + ";";
  var r1 = ratio(hexRgb(c1), [255, 255, 255]), r2 = ratio(hexRgb(c2), [255, 255, 255]);
  $("#gmsg").textContent = "Texto blanco sobre el color 1: " + fx(r1, 1) + ":1. Sobre el color 2: " + fx(r2, 1) + ":1. " + (Math.min(r1, r2) >= 4.5 ? "Cumple 4,5:1 en los dos extremos." : "Algún extremo no llega a 4,5:1: pon una capa oscura o cambia el color.");
});
// ===== Combinaciones con tipografías variables =====


function cargaFuente(k) {
  var f = GOOGLE_FONT_CATALOG[k]; if (f.cargada) { return; } f.cargada = true;
  var l = document.createElement("link"); l.rel = "stylesheet"; l.href = "https://fonts.googleapis.com/css2?family=" + f[1] + "&display=swap"; document.head.appendChild(l);
}
function famCss(k) { return "'" + GOOGLE_FONT_CATALOG[k][0] + "', " + GOOGLE_FONT_CATALOG[k][6]; }
function pesoNombre(w) { return w + " · " + FONT_WEIGHT_NAMES[w]; }
$("#cp").onchange = function () {
  var p = $("#cp").value, more = $("#cpmore");
  if (!p) { more.hidden = true; $("#cprev").hidden = true; $("#ccodew").hidden = true; $("#chint").hidden = false; return; }
  $("#cc").innerHTML = FONT_PAIRINGS[p].map(function (c, i) { return '<option value="' + i + '">' + GOOGLE_FONT_CATALOG[c[0]][0] + " + " + GOOGLE_FONT_CATALOG[c[1]][0] + "</option>"; }).join("");
  more.hidden = false; $("#cprev").hidden = false; $("#ccodew").hidden = false; $("#chint").hidden = true; ajustaCombo();
};
function ajustaCombo() {
  var c = FONT_PAIRINGS[$("#cp").value][+$("#cc").value], t = GOOGLE_FONT_CATALOG[c[0]]; cargaFuente(c[0]); cargaFuente(c[1]);
  var w = $("#cw2"); w.min = Math.max(100, t[2]); w.max = Math.min(900, t[3]);
  if (+w.value < +w.min) { w.value = w.min; } if (+w.value > +w.max) { w.value = w.max; }
  $("#cin").textContent = "Peso disponible en esta tipografía: de " + t[2] + " a " + t[3] + ".";
  pintaCombo();
}
function pintaCombo() {
  var c = FONT_PAIRINGS[$("#cp").value][+$("#cc").value], w = +$("#cw2").value, z = V("csz");
  $("#vcw2").textContent = pesoNombre(w); $("#vcsz").textContent = z;
  $("#cprev").innerHTML = '<h4 class="cprev-t" style="font-family:' + famCss(c[0]) + ";font-weight:" + w + ";font-size:" + z + 'px">Diseña con intención</h4><p class="cp-body" style="font-family:' + famCss(c[1]) + '">Cada decisión de diseño debería poder explicarse con una frase. Si no puedes explicarla, probablemente no la necesitas.</p><p class="hint">' + c[2] + "</p>";
  $("#ccode").textContent = "h1 {\n  font-family: " + famCss(c[0]) + ";\n  font-weight: " + w + ";\n  font-size: " + z + "px;\n}\nbody { font-family: " + famCss(c[1]) + "; }";
}
$("#cc").onchange = ajustaCombo;
["cw2", "csz"].forEach(function (i) { $("#" + i).addEventListener("input", pintaCombo); });
// ===== Reto 2: cabecera =====
bind(["title-size", "tkk", "tw", "tx", "uppercase-toggle", "ti"], function () {
  var z = V("title-size"), k = V("tkk") / 100, w = V("tw"), a = V("tx"), up = $("#uppercase-toggle").checked, it = $("#ti").checked, e = $("#hdrt");
  $("#vtw").textContent = pesoNombre(w); $("#vtkk").textContent = fx(k, 2) + " em";
  e.style.cssText = "font-size:" + z + "px;font-weight:" + w + ";letter-spacing:" + k + "em;font-stretch:" + a + "%;font-style:" + (it ? "italic" : "normal") + ";text-transform:" + (up ? "uppercase" : "none");
  $("#tcode").textContent = ".cabecera h1 {\n  font-size: " + z + "px;\n  font-weight: " + w + ";\n  letter-spacing: " + k + "em;\n  font-stretch: " + a + "%;\n  font-style: " + (it ? "italic" : "normal") + ";\n  text-transform: " + (up ? "uppercase" : "none") + ";\n}";
  var rl = [
    [z >= 40 && z <= 96, "Tamaño de cabecera: entre 40 y 96 px (tienes " + z + ")."],
    [w >= 500 || (w >= 300 && z >= 72), "Peso suficiente para leerse sobre el fondo: 500 o más (300 si el título pasa de 72 px)."],
    [up ? k >= 0.04 : (k >= -0.03 && k <= 0.06), up ? "Las mayúsculas piden más espacio: kerning de 0,04 em o más." : "En minúsculas, kerning entre −0,03 y 0,06 em."],
    [!(a < 80 && z < 56) && !(a > 115 && (k > 0.04 || z > 72)), "Ancho: la condensada, a partir de 56 px; la expandida, sin kerning alto ni más de 72 px."],
    [!it || w >= 400, "Cursiva con peso de 400 o más: con pesos finos se pierde."]
  ];
  $("#checks").innerHTML = rl.map(function (r) { return '<li class="' + (r[0] ? "y" : "n") + '"><b>' + (r[0] ? "✓" : "✗") + "</b><span>" + r[1] + "</span></li>"; }).join("");
  var ok = rl.every(function (r) { return r[0]; }), mood = $("#mood");
  var com = [up ? "solemne e institucional" : "cercano y natural", w <= 300 ? "delicado y elegante" : w <= 500 ? "neutro y claro" : w <= 700 ? "seguro y firme" : "potente e impactante"];
  if (k > 0.08) { com.push("aireado, con aire de lujo"); } else if (k < 0) { com.push("compacto y urgente"); }
  if (a < 85) { com.push("ahorra espacio y suena deportivo o urgente"); } else if (a > 110) { com.push("amplio, moderno y tecnológico"); }
  if (it) { com.push("dinámico y personal"); }
  mood.hidden = !ok; mood.textContent = "Tu combinación comunica algo " + com.join(", ") + ".";
  reto("tipografia", "resT", ok, ok ? "la cabecera cumple todas las reglas." : "te faltan " + rl.filter(function (r) { return !r[0]; }).length + " reglas por cumplir.");
});
// ===== Retos con estilo propio =====
document.querySelectorAll("#vista-inicio h3").forEach(function (h) {
  if (/^Reto \d/.test(h.textContent)) {
    h.classList.add("reto-h");
    for (var e = h.nextElementSibling; e && e.tagName !== "H3"; e = e.nextElementSibling) { if (e.classList.contains("card")) { e.classList.add("reto-card"); break; } }
  }
});
GLOSSARY_TERMS.push(
["wcag-niveles","Niveles A, AA y AAA (WCAG)","AAA|nivel AA|nivel AAA|AA","Los tres niveles de exigencia de WCAG. A es el mínimo, AA el habitual y el que se exige por ley, y AAA el más estricto."],
["ratio-lectura","Cómo leer un ratio (4,5:1)","4,5:1|4,5 a 1|3:1|3 a 1|7:1|7 a 1|21:1|21 a 1","Un ratio compara la luminosidad de dos colores. 4,5:1 significa que el claro tiene 4,5 veces la luminosidad del oscuro (más una constante). Va de 1:1 (iguales) a 21:1 (negro sobre blanco)."],
["criterio-wcag","Criterio WCAG (1.4.3)","1\\.4\\.3|1\\.4\\.4|1\\.4\\.8|1\\.4\\.12|2\\.5\\.8","Cada requisito de WCAG tiene un número. 1.4.3 es el contraste mínimo, 1.4.4 el cambio de tamaño del texto y 2.5.8 el tamaño de los objetivos táctiles."],
["tipografia-variable","Tipografía variable","tipograf[ií]as? variables?|fuentes? variables?","Un único archivo de fuente con ejes ajustables, como el peso o el ancho, en lugar de un archivo por cada variante."],
["kerning","Kerning y tracking","kerning|tracking","Kerning es el ajuste del espacio entre dos letras concretas; tracking, el espacio entre todas las letras. En CSS, letter-spacing es tracking, aunque aquí lo llamamos kerning."],
["degradado","Degradado","degradados?|gradientes?","Transición suave entre colores. En CSS puede ser lineal, radial o cónico."]
);
GLOSSARY_TERMS.sort(function (a, b) { return a[1].localeCompare(b[1], "es"); });

// ===== Glosario: términos de esquemas y recetas =====
GLOSSARY_TERMS.push(
["linea","Línea","","Trazo que une, separa u orienta. En web: bordes, separadores, subrayados y trazos de iconos."],
["forma","Forma","","Área con contorno propio: círculo, cuadrado, triángulo. Cada una suele comunicar algo: el círculo suavidad, el cuadrado estabilidad y el triángulo dirección."],
["textura","Textura","","Sensación de superficie: grano, relieve o patrón. En web se consigue con imágenes, degradados o un ruido sutil."],
["imagen","Imagen","","Fotografía o ilustración. Debe apoyar el mensaje y llevar texto alternativo."],
["contraste-visual","Contraste (principio)","","Diferencia entre elementos, de tamaño, color o peso, que separa y destaca. No es el ratio de contraste de accesibilidad, que mide la luminosidad de dos colores."],
["equilibrio","Equilibrio","","Reparto del peso visual: simétrico (en espejo) o asimétrico (compensado)."],
["alineacion","Alineación","","Orden de los elementos a lo largo de ejes comunes. Es lo que hace que un diseño se vea limpio."],
["repeticion","Repetición y ritmo","","Uso repetido de colores, formas o espacios que da coherencia y crea ritmo."],
["enfasis","Énfasis","","Un punto de atención claro: lo más importante debe destacar por tamaño, color o posición."],
["unidad","Unidad","","Sensación de que todos los elementos pertenecen al mismo conjunto."],
["hero","Hero","hero","La primera pantalla de una página: titular, acción principal e imagen."],
["cta","CTA (llamada a la acción)","CTA|llamada a la acción","El botón o enlace que pide la acción principal, como «Empezar» o «Reservar»."],
["gutter","Gutter (hueco)","gutters?|medianil","Hueco entre las columnas de una retícula."],
["reticula","Retícula de columnas","retículas?|maqueta","Estructura de columnas con huecos sobre la que se coloca todo el contenido."],
["clip-path","clip-path","clip-path","Propiedad CSS que recorta un elemento con una forma, como un polígono o una elipse."],
["object-fit","object-fit","object-fit","Propiedad CSS que decide cómo se ajusta una imagen a su caja. Con cover llena la caja recortando lo que sobra."],
["ruptura","Zona de ruptura","zonas? de ruptura","Sección que cambia el ritmo de la página con otro color, un borde inclinado o curvo, o una tarjeta solapada."]
);
GLOSSARY_TERMS.sort(function (a, b) { return a[1].localeCompare(b[1], "es"); });
// ===== Glosario: términos nuevos =====
GLOSSARY_TERMS.push(
["elementos","Elementos del diseño","elementos del diseño","Materiales básicos de un diseño: línea, forma, color, textura, tipografía, espacio y tamaño."],
["principios","Principios del diseño","principios del diseño","Criterios para combinar los elementos: jerarquía, contraste, equilibrio, alineación, repetición y unidad."],
["rgb","RGB","RGB","Modelo de color aditivo de las pantallas: se mezclan luz roja, verde y azul, de 0 a 255 cada una."],
["hex","HEX","HEX","Forma de escribir un color RGB en hexadecimal, como #4A66AC."],
["cmyk","CMYK","CMYK","Modelo de color sustractivo de la impresión: cian, magenta, amarillo y negro."],
["rueda","Rueda cromática","rueda cromática|círculo cromático","Círculo que ordena los tonos y permite ver qué colores armonizan."],
["calidos-frios","Colores cálidos y fríos","cálidos|fríos","Rojos, naranjas y amarillos se perciben cálidos; azules, verdes y violetas, fríos."],
["tinte","Tinte","tintes?","Un color mezclado con blanco. Sirve para crear escalas de luminosidad de un mismo tono."],
["familia","Familia tipográfica","familias? tipográficas?","Conjunto de letras con un mismo diseño: serif, sans serif, monoespaciada, display o manuscrita."],
["monoespaciada","Monoespaciada","monoespaciadas?","Tipografía donde todas las letras ocupan el mismo ancho. Es la del código."],
["display","Tipografía display","display","Tipografía pensada para titulares grandes, con mucha personalidad."],
["clamp","clamp()","clamp\\(\\)","Función CSS que limita un valor entre un mínimo y un máximo y permite tamaños fluidos."]
);
GLOSSARY_TERMS.sort(function (a, b) { return a[1].localeCompare(b[1], "es"); });

(function () {
  var h = "", letra = "";
  GLOSSARY_TERMS.forEach(function (g) {
    var l = g[1][0].toUpperCase();
    if (l !== letra) { letra = l; h += '<h3 class="glh">' + l + "</h3>"; }
    h += '<div class="gi" id="glosario-' + g[0] + '"><h3>' + g[1] + "</h3><p>" + g[3] + "</p></div>";
  });
  $("#glos").innerHTML = h;
})();

// ===== Página de reglas: se genera leyendo las notas y las leyes del contenido =====


function slugKind(category) { return "rules-" + category; }
document.querySelectorAll("#vista-inicio .note").forEach(function (note) {
  var categoryLabel = note.querySelector(".tag");
  if (!categoryLabel) { return; }

  var category = categoryLabel.getAttribute("data-rule-category");
  var section = note.closest("section");
  if (!category || !DESIGN_RULES[category] || !section) { return; }

  var description = "";
  for (var i = 1; i < note.childNodes.length; i++) {
    description += note.childNodes[i].textContent;
  }

  DESIGN_RULES[category].push({
    title: section.querySelector("h2").textContent,
    description: description.trim(),
    sectionId: section.id
  });

  var content = document.createElement("span");
  while (note.childNodes.length > 1) {
    content.appendChild(note.childNodes[1]);
  }
  content.insertAdjacentHTML("beforeend", ' <a href="#' + slugKind(category) + '">Ver todas</a>');
  note.appendChild(content);
});
document.querySelectorAll("#vista-inicio .pr, #vista-inicio .ley").forEach(function (example) {
  var heading = example.querySelector("h4");
  var section = example.closest("section");
  var contentHost = example.querySelector(".prt") || example;
  var description = example.querySelector(".prt p") || example.querySelector(".lede");

  if (!heading || !section || !description) { return; }

  DESIGN_RULES.law.push({
    title: heading.firstChild.textContent,
    description: description.textContent,
    sectionId: section.id
  });
  contentHost.insertAdjacentHTML("beforeend", '<p class="ui"><a href="#rules-law">Ver todas las leyes</a></p>');
});

$("#reg").innerHTML = RULE_GROUPS.map(function (group) {
  var legacyId = {
    standard: "reglas-norma",
    law: "reglas-ley",
    evidence: "reglas-evidencia",
    convention: "reglas-convencion"
  }[group[0]];

  var items = DESIGN_RULES[group[0]].map(function (rule) {
    return '<div class="ri"><h3>' + rule.title + "</h3><p>" + rule.description +
      '</p><p class="ut"><a href="#' + rule.sectionId + '">Ver en el tema</a></p></div>';
  }).join("");

  return '<div class="rg" id="' + slugKind(group[0]) + '">' +
    '<span class="anchor-alias" id="' + legacyId + '" aria-hidden="true"></span>' +
    '<h3>' + group[1] + "</h3><p>" + group[2] + "</p>" + items + "</div>";
}).join("");

// ===== Resaltar términos del glosario en el contenido (el primero de cada sección) =====
(function () {
  var mapa = {}, partes = [];
  GLOSSARY_TERMS.forEach(function (g) { g[2].split("|").filter(Boolean).forEach(function (a) { mapa[a.toLowerCase()] = g; partes.push(a); }); });
  partes.sort(function (a, b) { return b.length - a.length; });
  var re = new RegExp("(?<![\\p{L}\\p{N}])(" + partes.join("|") + ")(?![\\p{L}\\p{N}])", "giu");
  var NO = /^(A|BUTTON|H1|H2|H3|H4|LABEL|OUTPUT|PRE|CODE|SVG|TEXTAREA|SELECT|OPTION|SUMMARY|SCRIPT|STYLE|LEGEND|SMALL)$/;
  document.querySelectorAll("#vista-inicio section").forEach(function (sec) {
    var usados = {}, nodos = [], w = document.createTreeWalker(sec, NodeFilter.SHOW_TEXT);
    while (w.nextNode()) {
      var t = w.currentNode, ok = true;
      for (var e = t.parentElement; e && e !== sec; e = e.parentElement) { if (NO.test(e.tagName) || e.id === "profs" || e.classList.contains("en") || e.classList.contains("tag") || e.classList.contains("sroot") || e.classList.contains("el") || e.classList.contains("topic")) { ok = false; break; } }
      if (ok && t.nodeValue.trim()) { nodos.push(t); }
    }
    nodos.forEach(function (t) {
      var txt = t.nodeValue, last = 0, frag = document.createDocumentFragment(), hit = false, m;
      re.lastIndex = 0;
      while ((m = re.exec(txt))) {
        var g = mapa[m[1].toLowerCase()]; if (!g || usados[g[0]]) { continue; }
        usados[g[0]] = true; hit = true;
        frag.appendChild(document.createTextNode(txt.slice(last, m.index)));
        var a = document.createElement("a"); a.className = "gl"; a.href = "#glosario-" + g[0]; a.title = g[3]; a.textContent = m[1];
        frag.appendChild(a); last = m.index + m[1].length;
      }
      if (hit) { frag.appendChild(document.createTextNode(txt.slice(last))); t.parentNode.replaceChild(frag, t); }
    });
  });
})();

// ===== Vistas: inicio, glosario y reglas (según el hash de la URL) =====

// ===== Cabecera: formas que se mueven al azar =====
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  var movs = document.querySelectorAll(".mv");
  var mover = function () {
    movs.forEach(function (m) { m.style.transform = "translate(" + ((Math.random() - 0.5) * 40) + "px," + ((Math.random() - 0.5) * 40) + "px) rotate(" + ((Math.random() - 0.5) * 50) + "deg)"; });
  };
  mover(); setInterval(mover, 4000);
}

// ===== Qué es diseñar: el texto se desordena y se recompone en cuatro disposiciones =====
(function () {
  var composicion = $("#composicion");
  if (!composicion || !composicion.animate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { return; }

  var DISPOSICIONES = ["center", "left", "right", "bottom"];
  var MOVIMIENTO = 3200, REPOSO = 7000;
  var indice = 0, pausado = false, visible = false, temporizador = null;

  // Cada palabra pasa a ser una pieza móvil; los enlaces del glosario se conservan
  function dividirPalabras(nodo) {
    Array.prototype.slice.call(nodo.childNodes).forEach(function (hijo) {
      if (hijo.nodeType === 1) { dividirPalabras(hijo); return; }
      if (hijo.nodeType !== 3) { return; }
      var fragmento = document.createDocumentFragment();
      hijo.nodeValue.split(/(\s+)/).forEach(function (trozo) {
        if (!trozo) { return; }
        if (/^\s+$/.test(trozo)) { fragmento.appendChild(document.createTextNode(" ")); return; }
        var palabra = document.createElement("span");
        palabra.className = "word"; palabra.textContent = trozo;
        fragmento.appendChild(palabra);
      });
      nodo.replaceChild(fragmento, hijo);
    });
  }

  // El título se divide en letras agrupadas por palabra y conserva su nombre accesible
  function dividirLetras(titulo) {
    var texto = titulo.textContent.trim(), n = 0;
    titulo.setAttribute("aria-label", texto);
    titulo.textContent = "";
    texto.split(/\s+/).forEach(function (palabra, i) {
      var grupo = document.createElement("span");
      grupo.className = "word-title"; grupo.setAttribute("aria-hidden", "true");
      palabra.split("").forEach(function (caracter) {
        var letra = document.createElement("span");
        letra.className = "letter"; letra.textContent = caracter; letra.style.setProperty("--index", n++);
        grupo.appendChild(letra);
      });
      if (i > 0) { titulo.appendChild(document.createTextNode(" ")); }
      titulo.appendChild(grupo);
    });
  }

  dividirLetras(composicion.querySelector("h2"));
  dividirPalabras(composicion.querySelector(".compose-text"));
  var piezas = Array.prototype.slice.call(composicion.querySelectorAll(".letter, .compose-text .word"));

  function azar(max) { return (Math.random() - 0.5) * 2 * max; }
  function posiciones() {
    return piezas.map(function (pieza) { var r = pieza.getBoundingClientRect(); return { x: r.left, y: r.top }; });
  }

  // Cambia de disposición: cada pieza parte de su sitio anterior, vaga al azar y aterriza en el nuevo
  function cambiar() {
    var antes = posiciones();
    indice = (indice + 1) % DISPOSICIONES.length;
    composicion.setAttribute("data-layout", DISPOSICIONES[indice]);
    var despues = posiciones();
    piezas.forEach(function (pieza, i) {
      var dx = antes[i].x - despues[i].x, dy = antes[i].y - despues[i].y;
      pieza.animate([
        { translate: dx + "px " + dy + "px", rotate: "0deg" },
        { translate: (dx * 0.6 + azar(140)) + "px " + (dy * 0.6 + azar(140)) + "px", rotate: azar(40) + "deg", offset: 0.35 },
        { translate: (dx * 0.25 + azar(140)) + "px " + (dy * 0.25 + azar(140)) + "px", rotate: azar(40) + "deg", offset: 0.7 },
        { translate: "0px 0px", rotate: "0deg" }
      ], { duration: MOVIMIENTO, delay: Math.random() * 400, easing: "cubic-bezier(.45,0,.2,1)", fill: "backwards" });
    });
  }

  // El texto queda quieto REPOSO ms entre movimientos; solo corre mientras se ve y no está en pausa
  function programar(espera) {
    clearTimeout(temporizador);
    if (pausado || !visible) { return; }
    temporizador = setTimeout(function () { cambiar(); programar(MOVIMIENTO + REPOSO); }, espera);
  }

  var boton = document.createElement("button");
  boton.type = "button"; boton.className = "link compose-pause"; boton.textContent = "Pausar animación";
  boton.onclick = function () {
    pausado = !pausado;
    boton.textContent = pausado ? "Reanudar animación" : "Pausar animación";
    programar(REPOSO);
  };
  composicion.querySelector(".compose-in").appendChild(boton);

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entradas) {
      visible = entradas[0].isIntersecting;
      programar(REPOSO);
    }, { threshold: 0.3 }).observe(composicion);
  } else {
    visible = true; programar(REPOSO);
  }
})();
// ===== Tokens: sin token y con token =====
var TKN = ["Botón", "Enlace", "Icono", "Título", "Borde", "Etiqueta"], tkDone = 0, tkTok = false;
function pintaTk() {
  $("#tk1").innerHTML = TKN.map(function (t, i) { return '<span class="tki" style="background:' + (i < tkDone ? "#2E7551" : "#4A66AC") + '">' + t + "</span>"; }).join("");
  $("#tk2").innerHTML = TKN.map(function (t) { return '<span class="tki">' + t + "</span>"; }).join("");
  $("#tk2").style.setProperty("--tool-accent-color", tkTok ? "#2E7551" : "#4A66AC");
  $("#tkc1").textContent = "Has cambiado " + tkDone + " de " + TKN.length + " sitios a mano, uno por uno.";
  $("#tkc2").innerHTML = "<code>--color-marca: " + (tkTok ? "#2E7551" : "#4A66AC") + ";</code> " + (tkTok ? "Un solo cambio y se actualizó todo." : "Un solo valor guardado.");
}
$("#tkb1").onclick = function () { if (tkDone < TKN.length) { tkDone++; } pintaTk(); };
$("#tkb2").onclick = function () { tkTok = !tkTok; pintaTk(); };
$("#tkb0").onclick = function () { tkDone = 0; tkTok = false; pintaTk(); };
pintaTk();
// ===== Leyes de UX: pruebas sencillas =====
bind(["hk"], function () {
  var n = V("hk"); $("#hkopts").innerHTML = new Array(n + 1).join("<i>Opción</i>");
  $("#hkout").textContent = n + " opciones: " + (n <= 4 ? "decides casi al instante." : n <= 9 ? "tardas un poco más." : "cuesta elegir. Agrupa o reduce.");
});
bind(["fk", "fkd"], function () {
  var w = V("fk"), d = V("fkd"), t = $("#fkt"), id = Math.log2(d / w + 1);
  t.style.width = w + "px"; t.style.left = (d / 600 * 70) + "%";
  $("#fkout").textContent = id < 2.5 ? "Fácil de pulsar." : id < 4 ? "Se puede, pero cuesta un poco." : "Difícil: agranda el botón o acércalo.";
});
bind(["jk"], function () {
  var u = $("#jk").value === "u"; $("#jbar").style.flexDirection = u ? "row" : "row-reverse";
  $("#jout").textContent = u ? "Lo encuentras sin pensar, porque está donde lo esperas." : "Tardas más: tu cabeza lo busca donde está en las demás webs.";
});
bind(["mk"], function () {
  var g = $("#mk").checked; $("#mnum").textContent = g ? "612 345 678" : "612345678";
  $("#mout").textContent = g ? "En bloques de tres se lee y se recuerda mejor." : "Nueve cifras seguidas cuestan más de leer y recordar.";
});
// ===== Padding óptico =====
bind(["pv", "ph", "pc"], function () {
  var v = V("pv"), h = V("ph"), c = $("#pc").value, e = $("#ppv"), card = c === "card";
  e.className = "pcomp " + c; e.style.padding = card ? v + "px" : v + "px " + h + "px";
  e.innerHTML = { btn: "Guardar", tag: "Diseño ×", fil: "● Recientes", card: "Título de la tarjeta<br><span style='font-weight:400;font-size:.9rem'>El contenido va aquí.</span>" }[c];
  var r = h / v;
  $("#pcs").textContent = card ? ".tarjeta { padding: " + v + "px; }" : "." + c + " { padding: " + v + "px " + h + "px; }  /* " + fx(r, 1) + " : 1 */";
  $("#pmsg").textContent = card ? "En contenedores se usa el mismo padding en los cuatro lados." : r < 1.5 ? "Casi igual en los cuatro lados: la geometría es correcta, pero se percibe más espacio arriba y abajo. Sube el horizontal." : r <= 2.5 ? "Cerca de 2 a 1: la proporción habitual en botones, etiquetas y SVG_FILTERS." : "Demasiado ancho: el componente se estira.";
});
// ===== Botón de copiar en todos los bloques de código =====
var ICO_COPY = '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg>';
var ICO_OK = '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l5 5L20 6"/></svg>';
function copiaFallback(t, ok) {
  var a = document.createElement("textarea"); a.value = t; a.style.position = "fixed"; a.style.opacity = "0"; document.body.appendChild(a); a.select();
  try { document.execCommand("copy"); } catch (e) {} document.body.removeChild(a); ok();
}
document.querySelectorAll("pre.code").forEach(function (pre) {
  var w = document.createElement("div"); w.className = "codewrap"; pre.parentNode.insertBefore(w, pre); w.appendChild(pre);
  var b = document.createElement("button"); b.type = "button"; b.className = "copy"; b.innerHTML = ICO_COPY + "<span>Copiar</span>"; b.setAttribute("aria-label", "Copiar código");
  b.onclick = function () {
    var t = pre.textContent, ok = function () { b.innerHTML = ICO_OK + "<span>Copiado</span>"; b.setAttribute("aria-label", "Código copiado"); setTimeout(function () { b.innerHTML = ICO_COPY + "<span>Copiar</span>"; b.setAttribute("aria-label", "Copiar código"); }, 1800); };
    if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(t).then(ok, function () { copiaFallback(t, ok); }); } else { copiaFallback(t, ok); }
  };
  w.appendChild(b);
});


// ===== Página de recursos: se genera con los enlaces del contenido =====
(function () {
  var grupos = [], idx = {};
  function add(secId, secTit, nombre, url, desc) {
    if (!idx[secId]) { idx[secId] = { id: secId, t: secTit, l: [] }; grupos.push(idx[secId]); }
    idx[secId].l.push({ n: nombre, u: url, d: desc });
  }
  document.querySelectorAll("#vista-inicio section").forEach(function (sec) {
    var tit = sec.querySelector("h2").textContent;
    sec.querySelectorAll(".ext li").forEach(function (li) {
      var a = li.querySelector("a"); if (!a) { return; }
      add(sec.id, tit, a.textContent, a.href, li.textContent.replace(a.textContent, "").replace(/^[:\s]+/, ""));
    });
  });
  $("#rec").innerHTML = grupos.map(function (g) {
    return '<div class="rec-g" id="recursos-' + g.id + '"><h3>' + g.t + "</h3><ul>" + g.l.map(function (r) {
      return '<li><a href="' + r.u + '" target="_blank" rel="noopener">' + r.n + "</a>" + (r.d ? "<br><span class='ut'>" + r.d.charAt(0).toUpperCase() + r.d.slice(1) + "</span>" : "") + "</li>";
    }).join("") + "</ul></div>";
  }).join("");
})();

var vistas = { inicio: $("#vista-inicio"), glosario: $("#vista-glosario"), reglas: $("#vista-reglas"), recursos: $("#vista-recursos") };
var vista = "inicio", ultimoHash = "", yInicio = 0, origen = { h: "", y: 0 }, restoreY = null;
window.addEventListener("scroll", function () { if (vista === "inicio") { yInicio = window.scrollY; } });
function route() {
  var h = location.hash.slice(1), v = /^glosario/.test(h) ? "glosario" : /^reglas/.test(h) ? "reglas" : /^recursos/.test(h) ? "recursos" : "inicio";
  if (vista === "inicio" && v !== "inicio") { origen = { h: ultimoHash, y: yInicio }; }
  if (v === "inicio") { ultimoHash = h; }
  vista = v;
  Object.keys(vistas).forEach(function (k) { vistas[k].hidden = k !== v; });
  $("header.hero").hidden = v !== "inicio"; $("#volverflot").hidden = v === "inicio";
  if (v !== "inicio") { enlaces.forEach(function (a) { if (a.getAttribute("href") === "#" + v) { a.setAttribute("aria-current", "true"); } else { a.removeAttribute("aria-current"); } }); }
  setTimeout(function () {
    var el = h ? document.getElementById(h) : null;
    if (v === "inicio" && restoreY !== null) { window.scrollTo(0, restoreY); restoreY = null; }
    else if (el) { el.scrollIntoView(); if (v !== "inicio") { el.classList.remove("flash"); void el.offsetWidth; el.classList.add("flash"); } }
    else { window.scrollTo(0, 0); }
  }, 0);
}
function volver() { restoreY = origen.y; location.hash = origen.h || "inicio"; }
document.querySelectorAll(".back,#volverflot").forEach(function (b) { b.onclick = volver; });
window.addEventListener("hashchange", route);
route();

/* ---- Microinteracciones ---- */
(function () {
  var RM = matchMedia("(prefers-reduced-motion:reduce)").matches;
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var COL = ["#E0A03A", "#B5502F", "#4A66AC", "#ACCBF9", "#7A4B9B"];

  // 1. Entrada al hacer scroll: una sola vez, títulos desde la izquierda, bloques escalonados
  if (!RM && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) { return; }
        var t = e.target; io.unobserve(t); t.classList.add("rv-in");
        setTimeout(function () { t.classList.remove("rv", "rv-in"); t.style.removeProperty("--animation-delay"); }, 1500);
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.1 });
    var add = function (list, base, step) {
      list.forEach(function (t, i) { t.classList.add("rv"); t.style.setProperty("--animation-delay", (base + Math.min(i, 6) * step) + "s"); io.observe(t); });
    };
    add($$(".topic h2"), 0, 0);
    add($$(".topic-in p"), 0.15, 0.1);
    add($$("#vista-inicio h3"), 0, 0);
    add($$(".pr"), 0, 0);
    [".sgrid", ".leyes", ".exg", ".cta2"].forEach(function (s) { $$(s).forEach(function (c) { add($$(":scope > *", c), 0, 0.08); }); });
  }

  // 2. «Empezar»: pulsación, contracción y expansión
  $$(".bt,#btn2").forEach(function (b) {
    b.addEventListener("click", function () { b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop"); });
  });

  // 3. Celebraciones con las figuras de la web
  var layer = document.createElement("div"); layer.className = "fx"; layer.setAttribute("aria-hidden", "true"); document.body.appendChild(layer);
  var MS = ["¡Bien!", "¡Vamos!", "¡Eso es!", "¡Así!"], MF = ["¡Reto superado!", "¡Lo has conseguido!", "¡Genial!"], mi = 0, lastBurst = 0, lastFinal = 0;
  function burst(el, big) {
    var r = el.getBoundingClientRect();
    var x = Math.min(Math.max(r.left + Math.min(r.width / 2, 140), 90), innerWidth - 90);
    var y = Math.min(Math.max(r.top + Math.min(r.height / 2, 60), 70), innerHeight - 70);
    var m = document.createElement("div"); m.className = "fxm" + (big ? " big" : "");
    m.textContent = (big ? MF : MS)[mi++ % (big ? MF.length : MS.length)];
    m.style.left = x + "px"; m.style.top = y + "px"; layer.appendChild(m);
    var ma = m.animate(RM ? [{ opacity: 0, transform: "translate(-50%,-90%)" }, { opacity: 1, transform: "translate(-50%,-90%)", offset: .2 }, { opacity: 1, transform: "translate(-50%,-90%)", offset: .85 }, { opacity: 0, transform: "translate(-50%,-90%)" }]
      : [{ opacity: 0, transform: "translate(-50%,-60%) scale(.8)" }, { opacity: 1, transform: "translate(-50%,-100%) scale(1)", offset: .22 }, { opacity: 1, transform: "translate(-50%,-110%) scale(1)", offset: .8 }, { opacity: 0, transform: "translate(-50%,-140%) scale(1)" }],
      { duration: big ? 1900 : 1100, easing: "ease-out" });
    ma.onfinish = function () { m.remove(); };
    if (RM) { return; }
    var n = big ? 34 : 10;
    for (var i = 0; i < n; i++) {
      var s = (big ? 8 : 6) + Math.random() * (big ? 12 : 7), p = document.createElement("i");
      p.className = "fxp s" + (i % 3); p.style.cssText = "left:" + x + "px;top:" + y + "px;width:" + s + "px;height:" + s + "px;margin:" + (-s / 2) + "px 0 0 " + (-s / 2) + "px;background:" + COL[i % 5];
      layer.appendChild(p);
      var a = Math.random() * 6.283, d = (big ? 110 : 50) + Math.random() * (big ? 170 : 60), dx = Math.cos(a) * d, dy = Math.sin(a) * d - (big ? 30 : 10), rot = (Math.random() - .5) * 540;
      p.animate([{ transform: "translate(0,0) scale(.3) rotate(0)", opacity: 1 },
        { transform: "translate(" + dx + "px," + dy + "px) scale(1) rotate(" + rot * .6 + "deg)", opacity: 1, offset: .55 },
        { transform: "translate(" + dx * 1.1 + "px," + (dy + 50) + "px) scale(.8) rotate(" + rot + "deg)", opacity: 0 }],
        { duration: (big ? 1500 : 800) + Math.random() * 300, easing: "cubic-bezier(.15,.8,.3,1)" }).onfinish = (function (q) { return function () { q.remove(); }; })(p);
    }
  }
  // acierto puntual: un resultado pasa a «correcto»
  var estado = new WeakMap();
  var mo = new MutationObserver(function (ms) {
    ms.forEach(function (mu) {
      var t = mu.target, ok = t.classList.contains("ok");
      if (ok && !estado.get(t) && Date.now() - lastFinal > 800 && Date.now() - lastBurst > 700) { lastBurst = Date.now(); burst(t, false); }
      estado.set(t, ok);
    });
  });
  $$("#vista-inicio .res, #vista-inicio .why").forEach(function (t) {
    if (t.closest(".demo")) { return; }
    estado.set(t, t.classList.contains("ok")); mo.observe(t, { attributes: true, attributeFilter: ["class"] });
  });
  // reto completado: se detecta cuando se guarda un reto nuevo
  var vistos = Object.keys(hecho).filter(function (k) { return hecho[k]; });
  var ancla = { contraste: "#res2", tipografia: "#resT", proximidad: "#res1", botones: "#res4", accesibilidad: "#res5", tema: "#res6", heuristicas: "#res7" };
  var guardarOrig = guardar;
  guardar = function () {
    guardarOrig.apply(this, arguments);
    Object.keys(hecho).forEach(function (k) {
      if (hecho[k] && vistos.indexOf(k) < 0) { vistos.push(k); lastFinal = Date.now(); var e = $(ancla[k]); if (e) { burst(e, true); } }
    });
  };

  // 4. Color: la saturación gobierna la energía del movimiento (amplitud y ritmo)
  function viv(el, s) {
    if (!el) { return; }
    s = Math.max(0, Math.min(1, s));
    el.style.setProperty("--animation-amplitude", s.toFixed(2)); el.style.setProperty("--animation-duration", (4.4 - 3.2 * s).toFixed(2) + "s");
    el.classList.toggle("vivo", s > 0.08);
  }
  function satRGB(r, g, b) {
    var mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    if (mx === mn) { return 0; }
    return (mx - mn) / 255 / (1 - Math.abs((mx + mn) / 255 - 1));
  }
  function vivir() {
    if ($("#mixsw")) { viv($("#mixsw"), +$("#ss").value / 100); }
    if ($("#rgbsw")) { viv($("#rgbsw"), satRGB(+$("#rr").value, +$("#rg").value, +$("#rb").value)); }
  }
  document.addEventListener("input", function (e) { if (/^(ss|hh|ll|rr|rg|rb)$/.test(e.target.id)) { vivir(); } });
  vivir();

  // 5. Gestalt: cada ejemplo reproduce la transición del panel izquierdo al derecho
  if (RM) { return; }
  function ctr(el) { var b = el.getBBox(); return [b.x + b.width / 2, b.y + b.height / 2]; }
  function sel(g, s, f) { return $$(s, g).filter(f || function () { return true; }); }
  function pasos(k, L, R) {
    var st = [], i;
    var small = function (e) { return +e.getAttribute("width") < 100; };
    if (k === "Proximidad" || k === "Simetría") {
      var a = sel(L, "circle,rect,polygon", small), b = sel(R, "circle,rect,polygon", small);
      for (i = 0; i < Math.min(a.length, b.length); i++) {
        var p = ctr(a[i]), q = ctr(b[i]);
        st.push({ el: b[i], from: { transform: "translate(" + (p[0] - q[0]) + "px," + (p[1] - q[1]) + "px)" }, d: i * 30 });
      }
      sel(R, "line").forEach(function (l) { st.push({ el: l, from: { opacity: "0" }, d: 700 }); });
    } else if (k === "Semejanza") {
      sel(R, "rect", function (e) { return +e.getAttribute("width") < 30; }).forEach(function (e, j) { st.push({ el: e, from: { transform: "scale(0)", transformBox: "fill-box", transformOrigin: "center" }, d: j * 70 }); });
    } else if (k === "Región común") {
      sel(R, "rect", function (e) { return +e.getAttribute("width") === 80; }).forEach(function (e, j) { st.push({ el: e, from: { opacity: "0" }, d: j * 250 }); });
    } else if (k === "Cierre") {
      sel(R, "circle", function (e) { return !e.getAttribute("stroke-dasharray"); }).forEach(function (e) { st.push({ el: e, from: { opacity: "0", transform: "scale(.6)", transformBox: "fill-box", transformOrigin: "center" }, d: 0 }); });
    } else if (k === "Continuidad") {
      sel(R, "path").forEach(function (e, j) { st.push({ el: e, from: { opacity: "0" }, d: j * 650 }); });
    } else if (k === "Figura y fondo") {
      var rs = sel(R, "rect"), o = rs.findIndex(function (e) { return e.getAttribute("fill") === "#242852"; });
      rs.slice(o).forEach(function (e, j) { st.push({ el: e, from: { opacity: "0" }, d: j === 0 ? 0 : 350 + j * 90 }); });
    }
    return st;
  }
  function play(art, k, svg) {
    var gs = $$(":scope > g", svg), L = gs[0], R = gs[1];
    if (k === "Dirección común") {
      sel(R, ":scope > g").forEach(function (g) {
        var odd = g.querySelector("path").getAttribute("stroke") !== "var(--color-brand)", s = odd ? -1 : 1;
        if (g.animate) { g.animate([{ translate: "0 0" }, { translate: (s * 8) + "px " + (s * -3.5) + "px" }, { translate: "0 0" }], { duration: 1500, iterations: 2, easing: "ease-in-out" }); }
      });
      return;
    }
    var st = pasos(k, L, R); if (!st.length) { return; }
    st.forEach(function (s) { s.el.style.transition = "none"; for (var p in s.from) { s.el.style[p] = s.from[p]; } });
    void svg.getBoundingClientRect();
    // se deja ver un momento el panel de partida antes de animar
    setTimeout(function () {
      st.forEach(function (s) {
        s.el.style.transition = "transform .9s cubic-bezier(.2,.7,.2,1) " + s.d + "ms,opacity .7s ease " + s.d + "ms";
        s.el.style.transform = ""; s.el.style.opacity = "";
        setTimeout(function () { s.el.style.transition = ""; s.el.style.transformBox = ""; s.el.style.transformOrigin = ""; }, s.d + 1100);
      });
    }, 900);
  }
  var PERIODO = 5600;
  $$(".pr").forEach(function (art) {
    var h = art.querySelector("h4"), svg = art.querySelector("svg"); if (!h || !svg) { return; }
    var k = h.firstChild.textContent.trim(), pausado = false, bucle = null;
    var b = document.createElement("button"); b.type = "button"; b.className = "link gplay";
    function etiquetar() {
      b.textContent = pausado ? "Reanudar animación" : "Pausar animación";
      b.setAttribute("aria-label", (pausado ? "Reanudar" : "Pausar") + " animación de «" + k + "»");
    }
    etiquetar();
    b.onclick = function () { pausado = !pausado; etiquetar(); };
    art.querySelector(".prt").appendChild(b);
    function paso() { if (!pausado) { play(art, k, svg); } }
    // la animación se repite mientras el ejemplo está a la vista
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) {
        clearInterval(bucle);
        if (es[0].isIntersecting) { paso(); bucle = setInterval(paso, PERIODO); }
      }, { threshold: 0.6 }).observe(svg);
    }
  });
})();
