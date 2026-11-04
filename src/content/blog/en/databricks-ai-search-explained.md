---
title: 'Databricks AI Search: how it works, what it costs and who consumes it'
description: 'What Databricks AI Search (formerly Vector Search) is, how data gets into an index, how a query is answered with vector, hybrid and reranked search, how it is billed, and which agents, apps and SQL queries consume it.'
pubDate: '2026-11-03T13:00:00-05:00'
updatedDate: '2026-11-03T13:00:00-05:00'
heroImage: '../../../assets/ai-search-explained.png'
heroAnimation: '/images/blog/databricks-ai-search/ai-search-explained.gif'
heroAlt: 'Animated diagram: a source table feeds Delta Sync or Direct Vector Access indexes; the AI Search endpoint embeds the question, searches by similarity and by keywords, merges with RRF, reorders with a reranker and delivers results to agents, MCP clients, SQL and applications. Below: what the cost is made of.'
---

**Databricks AI Search is the platform's retrieval engine: it finds the documents closest to a question by combining vector search, keyword search and reranking over tables governed by Unity Catalog.** It powers RAG, product search, recommenders and agents.

*Official references checked November 3, 2026. Availability and features can vary by cloud and region. Conceptual English infographic. [Versión en español](/es/blog/databricks-ai-search-explained/) · [Download GIF](/images/blog/databricks-ai-search/ai-search-explained.gif).*

## What it is (and why it is no longer called Vector Search)

It used to be **Databricks Vector Search** (and before that, Mosaic AI Vector Search). The name changed because it is no longer only vector-based: it now combines semantic similarity, BM25 keyword search and reranking. REST paths, CLI groups and the SQL function still use `vector-search` / `vector_search`. [Databricks AI Search](https://docs.databricks.com/aws/en/vector-search/vector-search).

It has two parts:

- **Index:** stores the vectors (embeddings) and each row's metadata. It is a Unity Catalog object: querying it requires `SELECT`.
- **Endpoint:** the serverless compute that serves queries. One endpoint can host up to 50 indexes and scales with size and concurrency.

## How data gets in

You start from a source table: **Delta, streaming table, materialized view** (with external metadata enabled) or **managed Iceberg v3 table**. On Standard endpoints the table needs **Change Data Feed** so the index can follow its changes.

| Index type | What you provide | How it stays current |
| --- | --- | --- |
| **Delta Sync with managed embeddings** | Text | Databricks computes embeddings with a Foundation Model APIs or Model Serving endpoint and follows the table. |
| **Delta Sync with self-managed embeddings** | A column with your vectors | Follows the table; cannot later be converted to managed. |
| **Direct Vector Access** | Vectors through the API | No automatic sync: you upsert through REST or the SDK. |
| **Full-text index** (Beta) | Text, no embeddings | BM25 on a Storage-optimized endpoint with triggered sync. |

Sync can be **triggered** (you start it; the most economical option) or **continuous** (near real time; costs more because it keeps a streaming cluster). Storage-optimized endpoints do not support continuous sync.

## How a query is answered

The GIF follows a real support question, `refund for SKU-4471?`, end to end:

1. **Embed query:** the question becomes a vector using the index's model.
2. **ANN:** approximate nearest-neighbour search with **HNSW** and **L2** distance (normalize embeddings for cosine similarity).
3. **BM25:** in `hybrid` mode, exact keyword matches run in parallel. This is where `SKU-4471` wins: semantic similarity alone handles identifiers poorly.
4. **RRF merge:** both lists merge with *Reciprocal Rank Fusion*.
5. **Rerank:** optionally, a reranker reorders results using the columns you specify. Better quality, a bit more latency.

You can also **filter** on any source-table column, such as `region = 'PE'`. Syntax differs by endpoint: a dictionary on Standard, an SQL-like string on Storage-optimized. [Query an index](https://docs.databricks.com/aws/en/vector-search/query-vector-search).

## Two endpoint types

| | **Standard** | **Storage-optimized** |
| --- | --- | --- |
| Scale (768 dimensions) | ≈320 million vectors | Over 1 billion |
| Indexing | Baseline | 10–20× faster |
| Latency | Lowest | About 250 ms more |
| High QPS | Yes | No |
| Continuous sync | Yes | No |

Rule of thumb: **Standard** for low latency and heavy traffic; **Storage-optimized** for very large collections where cost per vector matters more than milliseconds.

## Who consumes the index

| Consumer | How it connects | Status |
| --- | --- | --- |
| **Python agents** | AI Bridge `VectorSearchRetrieverTool` (`databricks-langchain` or `databricks-openai`). Databricks' recommendation for new agents. | — |
| **MCP clients** (Claude Code, Cursor and others) | Managed MCP server at `/api/2.0/mcp/ai-search/{catalog}/{schema}/{index}`. Requires managed embeddings. | Public Preview |
| **SQL** | `vector_search()` in Databricks SQL and notebooks; not available on classic SQL warehouses. | Public Preview |
| **Apps and services** | REST API or the `databricks-ai-search` SDK (`AISearchClient`), from Databricks Apps or outside. | — |

Knowledge Assistant, which used AI Search indexes as a source, is now listed as a legacy offering; for low-code agents over documents Databricks points to **Genie Agents**. [Connect agents to unstructured data](https://docs.databricks.com/aws/en/agents/agent-framework/unstructured-retrieval-tools), [managed MCP servers](https://docs.databricks.com/aws/en/generative-ai/mcp/managed-mcp).

## How to interact with it

You can create endpoints and indexes from the workspace UI, the Python SDK, the REST API, the CLI (`vector-search-endpoints`, `vector-search-indexes`), Terraform or Declarative Automation Bundles.

Query from Python:

```python
from databricks.ai_search.client import AISearchClient

index = AISearchClient().get_index(index_name="main.support.kb_index")
results = index.similarity_search(
    query_text="refund for SKU-4471?",
    columns=["id", "chunk_text"],
    num_results=3,
    query_type="hybrid",
)
```

Query from SQL:

```sql
SELECT * FROM vector_search(
  index => 'main.support.kb_index',
  query_text => 'refund for SKU-4471?',
  num_results => 3
);
```

In production Databricks recommends authenticating with a **service principal** instead of a personal token: it can save up to 100 ms per query.

## What it costs

Billing is measured in **vector search units**:

- One **Standard** unit covers up to **2 million** 768-dimension vectors (or equivalent).
- One **Storage-optimized** unit covers up to **64 million**.
- Every endpoint has a one-unit minimum and scales with total index size and QPS.

Worth knowing:

- **You are billed only once an index exists.** After the last one is deleted, charges stop 24 hours later.
- **Continuous sync costs more** than triggered, because it keeps a streaming cluster.
- **Managed embeddings** are computed on a Foundation Model APIs or Model Serving endpoint, billed under that service.
- **Several low-traffic indexes** are best grouped on one endpoint to avoid paying multiple base costs.

To track it: `system.billing.usage` filtered on `billing_origin_product = 'VECTOR_SEARCH'`, split into ingest, serving and storage. Current rates are on Databricks' pricing page; the GIF deliberately shows no amounts. [Cost management](https://docs.databricks.com/aws/en/vector-search/vector-search-cost-management).

## Use cases

- **RAG and support chatbots:** cited answers over manuals, policies and tickets.
- **Product search:** hybrid search resolves SKUs, codes and exact names that similarity alone misses.
- **Recommenders:** "items like this one" from catalog or behaviour embeddings.
- **Image and video:** similarity over visual embeddings.
- **Agents:** the retrieval tool an agent calls before answering or acting.

## Limits to keep in mind

- **No row- or column-level security inside the index.** If users must see different documents, filter from the application or split indexes.
- Search mode is **not inherited** from the index: for hybrid search, pass it on every query (`query_type="hybrid"`).
- Index capacity is sized from the source table at creation; a tiny test source can fall short later.
- Default limits: 50 indexes per endpoint, 50 columns per index, rows up to 100 KB in Delta Sync and embeddings up to 4,096 dimensions.

## How I would run a PoC

Take a bounded corpus, for example return policies and product sheets, with a Delta Sync index using managed embeddings on a Standard endpoint and triggered sync. Write 30–50 real questions with expected answers and compare three setups: `ann`, `hybrid` and `hybrid` with reranker. Measure top-3 accuracy, p95 latency and consumption in `system.billing.usage`. If the corpus grows to hundreds of millions of chunks, repeat on Storage-optimized.

Continue with [Lakehouse Federation: types, flow and when to use it](/en/blog/databricks-lakehouse-federation-explained/) and share your experience at [Data Wizard](https://www.datawizard.tech/).

*Original infographic by Daniel DataShow ([LinkedIn](https://www.linkedin.com/in/danielportugalr)). Conceptual arrows: no latency or cost promise. Sources and reproducible generator in `scripts/blog/ai-search/`.*

*Official [Databricks](https://www.databricks.com/company/newsroom/press-kit) icons. MCP appears as text because no official logo was used. Logos identify technologies and imply no sponsorship.*
