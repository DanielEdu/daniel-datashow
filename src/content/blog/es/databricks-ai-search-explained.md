---
title: 'Databricks AI Search: cómo funciona, cuánto cuesta y quién lo consume'
description: 'Qué es Databricks AI Search (antes Vector Search), cómo entra la información a un índice, cómo responde una consulta con búsqueda vectorial, híbrida y reranking, cómo se factura y qué agentes, apps y consultas SQL lo consumen.'
pubDate: '2026-11-03T13:00:00-05:00'
updatedDate: '2026-11-03T13:00:00-05:00'
heroImage: '../../../assets/ai-search-explained.png'
heroAnimation: '/images/blog/databricks-ai-search/ai-search-explained.gif'
heroAlt: 'Diagrama animado: una tabla fuente alimenta índices Delta Sync o Direct Vector Access; el endpoint de AI Search embebe la pregunta, busca por similitud y por palabras clave, fusiona con RRF, reordena con un reranker y entrega los resultados a agentes, clientes MCP, SQL y aplicaciones. Abajo, de qué se compone el costo.'
---

**Databricks AI Search es el motor de recuperación de la plataforma: encuentra los documentos más parecidos a una pregunta combinando búsqueda vectorial, búsqueda por palabras clave y reranking, sobre tablas gobernadas por Unity Catalog.** Es la pieza que alimenta RAG, buscadores de producto, recomendadores y agentes.

*Fuentes oficiales revisadas el 3 de noviembre de 2026. Disponibilidad y funciones pueden variar por nube y región. Infografía conceptual en inglés. [English version](/en/blog/databricks-ai-search-explained/) · [Descargar GIF](/images/blog/databricks-ai-search/ai-search-explained.gif).*

## Qué es (y por qué ya no se llama Vector Search)

Antes se llamaba **Databricks Vector Search** (y antes, Mosaic AI Vector Search). Cambió de nombre porque dejó de ser solo vectorial: hoy combina similitud semántica, búsqueda por palabras clave BM25 y reranking. Las rutas REST, los grupos de la CLI y la función SQL todavía usan el nombre `vector-search` / `vector_search`. [Databricks AI Search](https://docs.databricks.com/aws/en/vector-search/vector-search).

Tiene dos piezas:

- **Índice:** guarda los vectores (embeddings) y los metadatos de cada fila. Es un objeto de Unity Catalog: para consultarlo necesitas `SELECT`.
- **Endpoint:** el cómputo serverless que sirve las consultas. Un endpoint puede alojar hasta 50 índices y escala con el tamaño y la concurrencia.

## Cómo entra la información

Partes de una tabla fuente: **Delta, streaming table, materialized view** (con metadatos externos habilitados) o **tabla administrada Iceberg v3**. En endpoints Standard, la tabla necesita **Change Data Feed** para que el índice pueda seguir sus cambios.

| Tipo de índice | Qué le das | Cómo se mantiene al día |
| --- | --- | --- |
| **Delta Sync con embeddings administrados** | Texto | Databricks calcula los embeddings con un endpoint de Foundation Model APIs o de Model Serving y sigue a la tabla. |
| **Delta Sync con embeddings propios** | Una columna con tus vectores | Sigue a la tabla; no se puede convertir luego a administrado. |
| **Direct Vector Access** | Vectores vía API | Sin sincronización automática: insertas y actualizas por REST o SDK. |
| **Índice de texto completo** (Beta) | Texto, sin embeddings | BM25 sobre un endpoint Storage-optimized, con sincronización triggered. |

La sincronización puede ser **triggered** (la lanzas tú, la opción más económica) o **continuous** (casi en tiempo real; cuesta más porque mantiene un clúster de streaming). Los endpoints Storage-optimized no admiten sincronización continua.

## Cómo responde una consulta

El GIF sigue una pregunta real de soporte, `refund for SKU-4471?`, de punta a punta:

1. **Embed query:** la pregunta se convierte en vector con el mismo modelo del índice.
2. **ANN:** búsqueda aproximada de vecinos más cercanos con **HNSW** y distancia **L2** (para similitud coseno, normaliza tus embeddings).
3. **BM25:** en modo `hybrid`, en paralelo busca coincidencias exactas de palabras. Aquí es donde `SKU-4471` gana: la similitud semántica sola maneja mal los identificadores.
4. **RRF merge:** las dos listas se fusionan con *Reciprocal Rank Fusion*.
5. **Rerank:** opcionalmente, un reranker reordena los resultados mirando las columnas que le indiques. Mejora la calidad a cambio de algo de latencia.

Además puedes **filtrar** por cualquier columna de la tabla fuente, por ejemplo `region = 'PE'`. La sintaxis cambia según el endpoint: diccionario en Standard, texto tipo SQL en Storage-optimized. [Consultar un índice](https://docs.databricks.com/aws/en/vector-search/query-vector-search).

## Dos tipos de endpoint

| | **Standard** | **Storage-optimized** |
| --- | --- | --- |
| Escala (768 dimensiones) | ≈320 millones de vectores | Más de 1.000 millones |
| Indexación | Base | 10 a 20 veces más rápida |
| Latencia | La más baja | Unos 250 ms más |
| Alto QPS | Sí | No |
| Sincronización continua | Sí | No |

Regla práctica: **Standard** para baja latencia y mucho tráfico; **Storage-optimized** para colecciones muy grandes donde importa más el costo por vector que los milisegundos.

## Quién consume el índice

| Consumidor | Cómo se conecta | Estado |
| --- | --- | --- |
| **Agentes en Python** | `VectorSearchRetrieverTool` de AI Bridge (`databricks-langchain` o `databricks-openai`). Es lo que Databricks recomienda para agentes nuevos. | — |
| **Clientes MCP** (Claude Code, Cursor u otros) | Servidor MCP administrado en `/api/2.0/mcp/ai-search/{catalog}/{schema}/{index}`. Requiere embeddings administrados. | Public Preview |
| **SQL** | Función `vector_search()` en Databricks SQL y notebooks; no está disponible en SQL warehouses clásicos. | Public Preview |
| **Apps y servicios** | REST API o el SDK `databricks-ai-search` (`AISearchClient`), desde Databricks Apps o desde fuera. | — |

Knowledge Assistant, que usaba índices de AI Search como fuente, hoy figura como oferta *legacy*; para agentes low-code sobre documentos, Databricks dirige a **Genie Agents**. [Conectar agentes a datos no estructurados](https://docs.databricks.com/aws/en/agents/agent-framework/unstructured-retrieval-tools), [servidores MCP administrados](https://docs.databricks.com/aws/en/generative-ai/mcp/managed-mcp).

## Cómo interactuar con él

Puedes crear endpoints e índices desde la interfaz del workspace, el SDK de Python, la REST API, la CLI (`vector-search-endpoints`, `vector-search-indexes`), Terraform o Declarative Automation Bundles.

Consultar desde Python:

```python
from databricks.ai_search.client import AISearchClient

index = AISearchClient().get_index(index_name="main.soporte.kb_index")
results = index.similarity_search(
    query_text="refund for SKU-4471?",
    columns=["id", "chunk_text"],
    num_results=3,
    query_type="hybrid",
)
```

Consultar desde SQL:

```sql
SELECT * FROM vector_search(
  index => 'main.soporte.kb_index',
  query_text => 'refund for SKU-4471?',
  num_results => 3
);
```

En producción, Databricks recomienda autenticar con un **service principal** en vez de un token personal: puede ahorrar hasta 100 ms por consulta.

## Cuánto cuesta

La factura se mide en **unidades de vector search**:

- Una unidad **Standard** cubre hasta **2 millones** de vectores de 768 dimensiones (o equivalente).
- Una unidad **Storage-optimized** cubre hasta **64 millones**.
- Todo endpoint tiene un mínimo de una unidad y escala con el tamaño total de sus índices y con el QPS.

Lo que conviene saber:

- **Solo se cobra cuando existe un índice.** Al borrar el último, el cobro se detiene 24 horas después.
- **La sincronización continua cuesta más** que la triggered, porque mantiene un clúster de streaming.
- **Los embeddings administrados** se calculan en un endpoint de Foundation Model APIs o Model Serving, que se factura según ese servicio.
- **Varios índices con poco tráfico** conviene agruparlos en un mismo endpoint, para no pagar varias bases.

Para vigilarlo: `system.billing.usage` filtrando `billing_origin_product = 'VECTOR_SEARCH'`, separando ingesta, serving y almacenamiento. Los precios vigentes están en la página de precios de Databricks; el GIF no muestra montos a propósito. [Gestión de costos](https://docs.databricks.com/aws/en/vector-search/vector-search-cost-management).

## Casos de uso

- **RAG y chatbots de soporte:** respuestas con citas sobre manuales, políticas y tickets.
- **Búsqueda de producto:** la búsqueda híbrida resuelve SKUs, códigos y nombres exactos que la similitud sola no encuentra.
- **Recomendadores:** "productos parecidos a este" a partir de embeddings de catálogo o comportamiento.
- **Imagen y video:** similitud sobre embeddings visuales.
- **Agentes:** la herramienta de recuperación que un agente llama antes de responder o actuar.

## Límites a tener presentes

- **No hay seguridad a nivel de fila o columna dentro del índice.** Si distintos usuarios deben ver distintos documentos, aplica filtros desde la aplicación o separa índices.
- El modo de búsqueda **no se hereda** del índice: si quieres búsqueda híbrida, pásala en cada consulta (`query_type="hybrid"`).
- La capacidad del índice se dimensiona con la tabla fuente al crearlo; una fuente de prueba muy pequeña puede quedarse corta.
- Límites por defecto: 50 índices por endpoint, 50 columnas por índice, filas de hasta 100 KB en Delta Sync y embeddings de hasta 4.096 dimensiones.

## Cómo plantearía una PoC

Tomaría un corpus acotado, por ejemplo políticas de devolución y fichas de producto, con un índice Delta Sync de embeddings administrados en un endpoint Standard y sincronización triggered. Armaría 30 a 50 preguntas reales con su respuesta esperada y compararía tres configuraciones: `ann`, `hybrid` y `hybrid` con reranker. Mediría acierto en el top 3, latencia p95 y el consumo en `system.billing.usage`. Si el corpus crece a cientos de millones de fragmentos, repetiría la prueba en Storage-optimized.

Puedes seguir con [Lakehouse Federation: tipos, flujo y cuándo usarla](/es/blog/databricks-lakehouse-federation-explained/) y compartir tu experiencia en [Data Wizard](https://www.datawizard.tech/).

*Infografía original de Daniel DataShow ([LinkedIn](https://www.linkedin.com/in/danielportugalr)). Flechas conceptuales: no representan una promesa de latencia ni de costo. Fuentes y generador reproducible en `scripts/blog/ai-search/`.*

*Íconos oficiales de [Databricks](https://www.databricks.com/company/newsroom/press-kit). MCP aparece como texto porque no se usó un logo oficial. Los logos identifican tecnologías y no implican patrocinio.*
