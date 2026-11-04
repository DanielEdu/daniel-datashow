# Databricks AI Search infographic and article source notes

Version 1.0 · Created and updated 2026-11-03.

Original English infographic, 1280 × 960, 150 frames × 80 ms, 12-second infinite loop. Same palette, typography and signature as the LTAP and Lakehouse Federation graphics. Timeline: a row lands in the source table (CDF) → the three ingestion paths deliver vectors and the cost meter grows a unit → a question is typed → embed → ANN (rings + nearest neighbours) and BM25 (keyword squares) → RRF merge → results appear and the reranker promotes the SKU match → results fan out to every consumer. The endpoint toggle alternates Standard / Storage-optimized each half-loop; use-case chips light in turn. Decision guidance and pricing detail live only in the articles. Generated from code, no reference GIF frames reused.

## Official references checked 2026-11-03

- Overview, rename, index types, endpoint types, search modes, limits (updated 2026-10-29): https://docs.databricks.com/aws/en/vector-search/vector-search
- Query an index: AISearchClient, query_type, reranker, filter syntax (updated 2026-10-29): https://docs.databricks.com/aws/en/vector-search/query-vector-search
- Cost management: vector search units, billing start/stop, sync cost, system.billing.usage (updated 2026-10-20): https://docs.databricks.com/aws/en/vector-search/vector-search-cost-management
- `vector_search()` SQL function, Public Preview (updated 2026-10-07): https://docs.databricks.com/aws/en/sql/language-manual/functions/vector_search
- Managed MCP servers, AI Search MCP path, Public Preview (updated 2026-10-23): https://docs.databricks.com/aws/en/generative-ai/mcp/managed-mcp
- Agents and unstructured retrieval, AI Bridge VectorSearchRetrieverTool (updated 2026-10-23): https://docs.databricks.com/aws/en/agents/agent-framework/unstructured-retrieval-tools
- Knowledge Assistant legacy status: https://docs.databricks.com/aws/en/agents/agent-bricks/knowledge-assistant

## Interpretation boundaries

- No prices are shown. Unit capacities (2M Standard / 64M Storage-optimized at 768 dims) come from the cost guide; rates are on Databricks' pricing page.
- "Embedding endpoint" cost: managed embeddings run on a Foundation Model APIs or Model Serving endpoint (index docs); that service's billing applies. The cost guide itself does not detail it.
- "Search mode is not inherited" comes from the Daniel DataShow vault note verified against Microsoft Learn on 2026-09-17.
- The question, table rows, scores and result order are illustrative. The vector space is a 2D sketch, not a real projection.
- MCP client names (Claude Code, Cursor) are examples of MCP clients named in the managed MCP docs.

## Artwork

Only official artwork. Databricks icons were downloaded from databricks.com on 2026-11-03 (slug → URL mapping from https://oieduardorabelo.github.io/databricks-architecture-icons/, which republishes unmodified Databricks files):

| File | Official source |
| --- | --- |
| `databricks.svg` | https://www.databricks.com/sites/default/files/2026-05/Databricks-Logo-Icon.svg |
| `ai-search.svg` | https://www.databricks.com/sites/default/files/2024-11/SearchDataIcon.svg |
| `unity-catalog.svg` | https://www.databricks.com/sites/default/files/2026-01/icon-unity-catalog.svg |
| `lakehouse-storage.svg` | https://www.databricks.com/sites/default/files/2023-02/icon-orange-Delta-Table.svg |
| `model-serving.svg` | https://www.databricks.com/sites/default/files/2025-05/CloudModelIcon.svg |
| `agent-bricks.svg` | https://www.databricks.com/sites/default/files/2026-01/icon-mosaic-ai-bricks.svg |
| `databricks-apps.svg` | https://www.databricks.com/sites/default/files/2025-06/appsIcon-orange.svg |
| `databricks-sql.svg` | https://www.databricks.com/sites/default/files/2026-01/icon-databricks-sql.svg |
| `rest-api.svg` | https://www.databricks.com/sites/default/files/2025-01/primary-icon-orange-webhook.svg |
| `system-tables.svg` | https://www.databricks.com/sites/default/files/2026-02/visibleIcon.svg |
| `serverless-compute.svg` | https://www.databricks.com/sites/default/files/2025-01/primary-icon-orange-scale.svg |
| `structured-streaming.svg`, `ai-functions.svg` | 2026-06/streamIcon.svg, 2025-08/primary-icon-orange-built-in-functions.svg (kept; not drawn) |

MCP is shown as a text monogram; no MCP logo is used. Signature: Daniel DataShow · linkedin.com/in/danielportugalr.

## Rebuild

From repository root: `node scripts/blog/ai-search/render.mjs` (Python with Pillow; select it with `PYTHON`). On other operating systems set `AIS_FONT_REGULAR`, `AIS_FONT_BOLD` and `AIS_FONT_MONO`.

Outputs: `src/assets/ai-search-explained.png`, `public/images/blog/databricks-ai-search/ai-search-explained.png` and `.gif`.
