# Astro Starter Kit: Blog

```sh
npm create astro@latest -- --template blog
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

Features:

- ✅ Minimal styling (make it your own!)
- ✅ 100/100 Lighthouse performance
- ✅ SEO-friendly with canonical URLs and OpenGraph data
- ✅ Sitemap support
- ✅ RSS Feed support
- ✅ Markdown & MDX support

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
├── public/
├── src/
│   ├── components/
│   ├── content/
│   ├── layouts/
│   └── pages/
├── astro.config.mjs
├── README.md
├── package.json
└── tsconfig.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

The `src/content/` directory contains "collections" of related Markdown and MDX documents. Use `getCollection()` to retrieve posts from `src/content/blog/`, and type-check your frontmatter using an optional schema. See [Astro's Content Collections docs](https://docs.astro.build/en/guides/content-collections/) to learn more.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Check out [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## Credit

This theme is based off of the lovely [Bear Blog](https://github.com/HermanMartinus/bearblog/).

## Presentaciones

Versión 1.0 · Creado y actualizado: 2026-10-27.

Este repositorio es la ubicación central de las presentaciones. Mantener una sola copia de cada deck en `public/slides/<slug>/` y registrarlo en `src/data/presentaciones.ts`. Editar y crear las presentaciones aquí para que queden agrupadas en la web.

- `databricks-para-todos/`
- `del-papel-a-la-ia/`
- `del-papel-a-la-ia-iquitos/`

La guía de diseño reutilizable está en `public/slides/databricks-para-todos/DESIGN.md`. Los archivos de `public/` forman parte del sitio publicado.

## Artículos con infografía animada

Versión 1.0 · Creado y actualizado: 2026-10-28.

Cada GIF explicativo nuevo corresponde a un artículo nuevo con el mismo slug en `src/content/blog/es/` y `src/content/blog/en/`. La infografía se escribe en inglés; ambos artículos enlazan las referencias oficiales vigentes y llevan fecha de revisión. Comprobar nombres, renombres, disponibilidad, facturación y promociones antes de publicar.

Usar `heroImage` para el PNG estático del catálogo, `heroAnimation` para el GIF original y `heroAlt` localizado. La vista del artículo permite pausar y descargar la animación; con movimiento reducido muestra el póster. El material queda centralizado en este repositorio. El ejemplo Genie y sus fuentes reproducibles viven en `scripts/blog/genie/`.

El artículo LTAP usa `scripts/blog/ltap/` para el generador y las fuentes, y `public/images/blog/databricks-ltap/` para los entregables. Reconstruir con `node scripts/blog/ltap/render.mjs` (Python con Pillow; se puede seleccionar con `PYTHON`).
