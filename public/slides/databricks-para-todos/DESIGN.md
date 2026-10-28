# DESIGN.md: presentaciones animadas (estilo "Databricks, desde cero")

Creado 24-oct-2026 · referencia: `index.html` + `deck.css` + `deck.js` de esta carpeta (v1.2). Daniel aprobó este estilo para futuras presentaciones animadas.

## Cómo empezar una nueva
1. Copiar esta carpeta completa (`index.html`, `deck.css`, `deck.js`, `assets/`) a la carpeta del nuevo deck.
2. Reemplazar las `<section class="slide">` de `index.html`; el motor (`deck.js`) y los estilos (`deck.css`) se reutilizan tal cual.
3. Los contenidos de los popups viven en `deck.js` (`MODAL`, `IND`). Se cambian o se vacían según el tema.
4. Verificar con Playwright (`_kit/.venv`, snap con el estilo `.a{animation-duration:.01s}` para ver el estado final). El panel del navegador oculto no anima bien.

## Formato
- Un solo HTML, lienzo fijo **1920×1080** que escala a la ventana (`#stage` con translate + scale).
- Navegación: ← → / espacio, **R** repite la animación, **F** pantalla completa, **Esc** cierra el popup. Hash `#n` por slide.
- Transición entre slides: círculo del color de la slide entrante (`data-wipe`) que crece desde abajo con un logo al centro y se retira hacia arriba (~1 s). **El logo es el de la marca protagonista del deck**: Databricks solo en decks de Databricks; en decks propios o genéricos, el de Data Wizard en un círculo blanco.
- Pie en cada slide (salvo `.no-foot`): logo TPT rehecho · título del deck · número.
- **Sin versión ni fechas visibles** en pantalla; solo en un comentario HTML.

## Paleta y tipografía
- Fondo crema/oat `#F9F7F4`, alterno `#EEEDE9`; slides oscuras navy `#1B3139`.
- Acentos: lava `#FF3621` (marca Databricks, uso puntual), azul `#2272B4`, verde `#00A972`, amarillo `#FFAB00`, violeta `#6B5FD6`.
- DM Sans (800 títulos, 500 texto) + DM Mono (kickers, etiquetas). Montserrat solo para el logo TPT.
- Kicker con barra de color (`--acc` por slide), títulos de 72 a 112 px, tarjetas blancas de radio 26 con sombra suave.

## Ilustración: flat design estilo Google
- Personajes con `person()` (`data-person="style:…;shirt:…;prop:…;skin:0-3"`): sin rostro, formas planas. Estilos de pelo short, long, bun, curly, side, bald o helmet. Props laptop, tablet, clip, point, wave, think o both.
- Íconos de producto dibujados desde cero (`ICON` en `deck.js`, `data-icon="…"`). **Nunca emojis**: todo ícono es SVG flat.
- Escenas por tema (`SCENE`): fondos planos con una animación en loop (turbinas, camión, bombeo, pulsos).

## Animación ("corto animado")
- Entrada por elemento: clase `.a` + `data-fx` (up, down, left, right, pop, drop, growx, growy, spin, draw, blur, type, flip, fade) + `style="--d:1.2s"` para encadenar.
- Loops que corren solo en la slide activa: `.loop` + float, bob, spin, pulse, blink, wiggle, march (línea punteada que avanza) o flow (partícula sobre `offset-path`).
- En SVG: anidar `<g transform>` → `<g class="a">` (la animación pisa el transform). Con `transform-origin` en px usar `transform-box: view-box` (ya resuelto en `deck.css`).

## Logos (siempre oficiales)
- Databricks: vector oficial de la marca outline (`DB_MARK`, `data-dbmark`) y `databricks-wordmark.png`. No dibujar versiones propias.
- TPT: ícono recortado del PNG oficial (`assets/tpt-icon.png`) + texto vivo, con **"TI" en negro** (no cian).
- Data Wizard: `datawizard-logo.png`; con texto, `Outputs/databricks/asset/img/datawizard-logo-texto.png`.
- Otras marcas: archivos de `assets/` o simple-icons (`data-si="…"`, requiere internet).
- Imágenes que inserta el JS: reutilizar el `src` de una `<img>` estática (p. ej. `#omni-logo`, `#tpt-icon-src`) para que funcionen al abrir el archivo suelto.

## Patrones de slide que funcionaron
Portada con marca que se dibuja · problema con personajes y burbujas · historia con barra de capítulos · línea de tiempo alternada arriba/abajo · comparación A + B = C · stack interactivo con popups (piezas + estado + **ejemplo**) · flujo por roles con partículas · grilla de industrias clicable · 4C en slide oscura · "taxímetro" con contador · camino por etapas con personaje caminando · ciudad nocturna con hitos que pasan · cierre con confeti.
