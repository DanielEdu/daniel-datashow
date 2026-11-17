# DESIGN · Presentaciones animadas (Daniel Datashow / TPT)

Recreado 17-nov-2026 a partir del kit de «Databricks para todos». Daniel aprobó este estilo para todas las presentaciones animadas.

## Dónde vive todo
- Repo: `~/PROJECTS/PERSONAL/daniel-datashow` (GitHub `DanielEdu/daniel-datashow`, Astro, deploy automático a Vercel desde `main`).
- Cada deck: `public/slides/<slug>/` con `index.html`, `deck.css`, `deck.js`, `assets/` y `cover.jpg` (miniatura 1280×720).
- Se publica en `https://daniel-datashow.vercel.app/slides/<slug>/`.
- Catálogo: agregar una entrada en `src/data/presentaciones.ts` (slug, título, descripción es/en, categoría, fecha, tags, nº de slides).
- Referencias: `databricks-para-todos` (deck de Databricks, logo Databricks en la transición) y `del-papel-a-la-ia` (genérico, logo Data Wizard en la transición).

## Cómo empezar un deck nuevo
1. Copiar la carpeta de un deck de referencia a `public/slides/<slug-nuevo>/`.
2. Reemplazar las `<section class="slide">` de `index.html`. El motor (`deck.js`) y los estilos (`deck.css`) se reutilizan tal cual.
3. Los popups viven en `deck.js` (`MODAL`, `IND`); cambiarlos o vaciarlos según el tema. Cada pieza: `P(nombre, estado, descripción, nombreAnterior, logosHTML)` y cada popup lleva un **ejemplo concreto**.
4. Verificar con Playwright (`~/PROJECTS/Outputs/videos/_kit/.venv`): servir `public/slides` con `python3 -m http.server`, inyectar `.slide.active .a{animation-duration:.01s!important;animation-delay:0s!important}`, llamar `go(n, true)` y tomar captura. El panel del navegador oculto no anima bien.
5. `npm run build`, commit **sin coautor de Claude**, push a `main`.

## Formato
- Un solo HTML, lienzo fijo **1920×1080** que escala a la ventana (`#stage` con translate + scale).
- Navegación: ← → / espacio, **R** repite la animación, **F** pantalla completa, **Esc** cierra el popup. Hash `#n` por slide.
- Transición: círculo del color de la slide entrante (`data-wipe`) con un logo al centro. **El logo es el de la marca protagonista**: Databricks solo en decks de Databricks; en decks propios o genéricos, Data Wizard en círculo blanco.
- Pie en cada slide (salvo `.no-foot`): logo TPT rehecho (+ Data Wizard en decks personales; solo TPT en webinars de TPT) · título del deck · número.
- **Sin versión ni fechas visibles** en pantalla; solo en un comentario HTML.

## Paleta y tipografía
- Fondo crema `#F9F7F4`, alterno `#EEEDE9`; slides oscuras navy `#1B3139`.
- Acentos: lava `#FF3621` (marca Databricks, uso puntual), azul `#2272B4`, verde `#00A972`, amarillo `#FFAB00`, violeta `#6B5FD6`.
- Slides de TPT: paleta de la carta comercial (navy `#0a1440`, azul `#1c6fd6`, cian `#5fd3f3` / `#9be9fb`) y logo `tpt-logo-claro.png`.
- DM Sans (800 títulos, 500 texto) + DM Mono (kickers, etiquetas). Montserrat solo para los logos TPT y Data Wizard.

## Ilustración (flat design estilo Google)
- Personajes con `person()` (`data-person="style:…;shirt:…;prop:…;skin:0-3;pants:…"`): sin rostro, formas planas.
- Íconos de producto dibujados desde cero (`ICON` en `deck.js`, `data-icon="…"`). **Nunca emojis.**
- Logos oficiales siempre: archivos en `assets/` o simple-icons (`data-si="…"`, requiere internet). Si falta uno, descargar el oficial; nunca imitarlo.
- Imágenes insertadas por JS: reutilizar el `src` de una `<img>` estática (p. ej. `#omni-logo`, `#tpt-icon-src`, `#dw-src`).

## Animación
- Entrada: clase `.a` + `data-fx` (up, down, left, right, pop, drop, growx, growy, spin, draw, blur, type, flip, fade) + `style="--d:1.2s"`.
- Loops solo en la slide activa: `.loop` + float, bob, spin, pulse, blink, wiggle, march, flow (partícula sobre `offset-path`).
- En SVG: anidar `<g transform>` → `<g class="a">`. Con `transform-origin` en px usar `transform-box: view-box`.

## Patrones que funcionaron
Portada con marca que se dibuja · ponente con foto, QR y trayectoria · problema con personajes y burbujas · historia con barra de capítulos · línea de tiempo alternada · A + B = C · stack interactivo con popups · cifras + gráfica de barras + ranking con logos · flujo por roles con partículas · grilla de industrias clicable · 4C en slide oscura · «taxímetro» de costos · camino por etapas · ciudad nocturna con hitos · evento/CTA · cierre con confeti.
