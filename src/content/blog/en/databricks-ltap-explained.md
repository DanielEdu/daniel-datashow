---
title: 'Databricks LTAP: what changes for ETL, backends and Lakebase'
description: 'How to use LTAP and where its capabilities appear. Understand the application and analytics paths, what happens to ETL and ELT, and what your backend still owns.'
pubDate: '2026-10-28T13:00:00-05:00'
updatedDate: '2026-10-28T13:00:00-05:00'
heroImage: '../../../assets/ltap-explained.png'
heroAnimation: '/images/blog/databricks-ltap/ltap-explained.gif'
heroAlt: 'Animated diagram: an application keeps its backend and writes to Lakebase Postgres; LTAP shares a storage foundation with analytics. Separate paths show Change Data Feed, transformations and synced tables serving application reads.'
---

**LTAP brings transactions and analytics together through shared storage. Your backend still runs application logic, and data teams still define transformations.** The connection between those workloads is what changes.

*Official references checked October 28, 2026. Availability refers to AWS and varies by cloud and region. Conceptual English infographic. [Versión en español](/es/blog/databricks-ltap-explained/) · [Download GIF](/images/blog/databricks-ltap/ltap-explained.gif).*

## What LTAP is

**Lake Transactional/Analytical Processing** is an architecture pairing Postgres transactions with lakehouse analytics over a shared storage foundation. Each workload keeps a specialized engine. Lakebase supplies the transactional side. [LTAP overview](https://docs.databricks.com/aws/en/oltp/projects/ltap-overview).

Consider an ordering app. Saving one purchase and analyzing regional sales require different access patterns. A traditional design maintains a bridge from the operational database to analytics. LTAP aims to remove that copying bridge for the data covered by its architecture.

| Claim | Practical meaning |
| --- | --- |
| Unified OLTP and OLAP | Shared logical data with specialized compute. |
| One copy | One **logical** copy; caches and physical representations can differ. |
| No ETL | Removal of the operational-to-analytics copying bridge, not every business transformation. |
| LTAP equals Lakebase | LTAP is the architecture; Lakebase is the participating Postgres database. |
| Both sides can write | Each table has one writer; do not assume unrestricted bidirectional writes. |

Capabilities are adopted independently. A Lakebase deployment does not automatically include every LTAP feature. [Scope and capabilities](https://docs.databricks.com/aws/en/oltp/projects/ltap-overview).

## What happens underneath

Lakebase separates Postgres compute from storage. **Safekeepers** durably record the write-ahead log, or WAL; **pageservers** reconstruct pages and persist them asynchronously. Transaction commit and later materialization are different steps. [Lakebase architecture](https://docs.databricks.com/aws/en/oltp/projects/architecture).

LTAP adds row-to-column transcoding in storage, producing Parquet readable through table formats such as Delta and Iceberg. Analytical reads can combine columnar data with recent changes for a consistent view. This technical conversion preserves data meaning; it does not define your company's net revenue. [Engineering explanation](https://www.databricks.com/blog/lakebase-ltap-rethinking-database-storage).

## Where you interact with it

You use the surfaces implementing each capability rather than a single LTAP console:

| Surface | What you do |
| --- | --- |
| Lakebase App | Select project, branch and database; open Connect, SQL Editor or Tables Editor. |
| Backend or Postgres client | Read and write using Postgres drivers, `psql` or compatible tools. |
| Catalog Explorer | Register a database as a read-only catalog and discover its objects. |
| SQL Editor, notebooks and dashboards | Consume data using compute compatible with the selected path. |
| Lakebase CDF | Configure a change stream into Delta tables. |
| Create → Synced table | Serve prepared Unity Catalog data through Lakebase. |

See the [connection guide](https://docs.databricks.com/aws/en/oltp/projects/connect). The workspace SQL Editor also supports a **direct Lakebase connection**: choose Lakebase Postgres in the compute selector, then project and branch. This runs Postgres and does not by itself demonstrate a shared-storage analytical read. [Workspace SQL Editor](https://docs.databricks.com/aws/en/oltp/projects/query-sql-editor).

For registration, use **Catalog Explorer → Create a catalog → Lakebase Postgres → Autoscaling**, then select project, branch and database. The resulting catalog is read-only and requires serverless compute for browsing and queries. Writes remain on the Postgres connection. [Unity Catalog registration](https://docs.databricks.com/aws/en/oltp/projects/register-uc).

## Two data paths

### The application produces data

Illustrative example: a backend validates an order and writes its own Lakebase table. You then need either current-state analytics or downstream processing of changes.

- **Current state:** Lakehouse//RT querying live Lakebase is the documented LTAP path, listed as **Private Preview** in the AWS capability matrix.
- **Change history:** Lakebase Change Data Feed publishes row changes into Unity Catalog Delta tables for downstream silver and gold processing. It is **Public Preview**; documented batches are roughly 15 seconds apart, which is not an SLA.

Configure CDF under **Branch overview → Lakebase CDF**. Participating tables require `REPLICA IDENTITY FULL`. [Lakebase CDF setup](https://docs.databricks.com/aws/en/oltp/projects/lakebase-cdf).

### The lakehouse prepares data for the application

Illustrative example: a job computes recommendations into a gold table. A **synced table** serves them through Lakebase for customer lookups. The lakehouse owns their production.

Synced tables create a **managed copy** with synchronization pipelines. This path cannot be described as universally copy-free. Optional **LTAP Direct Writes**, in Beta, accelerates initial loads and full refreshes by writing into storage directly. It does not turn all incremental updates into direct bulk writes. Select it when creating a synced table. [Synced tables and Direct Writes](https://docs.databricks.com/aws/en/oltp/projects/sync-tables).

## Do ETL and ELT disappear?

**Business transformations still need an implementation.** ETL transforms before loading; ELT loads before transforming. Changing access to operational data does not remove that design choice.

Our order example still needs customer deduplication, currency conversion, refund handling, joins to campaign or ERP data, business history and model datasets. These are decisions in the example, not automatic LTAP features. Lakebase CDF explicitly documents bronze-to-silver-to-gold processing as a use case. [CDF for ETL](https://docs.databricks.com/aws/en/oltp/projects/lakebase-cdf).

If a source database stays outside Lakebase, design its integration separately. An LTAP announcement is insufficient grounds to remove its CDC, connectors or quality controls.

## Does the backend disappear or move into Lakebase?

**Lakebase can host persistent state. Server code still needs an application runtime.** Applications can run in Databricks Apps or on external infrastructure and connect to Lakebase. [Building applications](https://docs.databricks.com/aws/en/oltp/projects/build-applications).

In an ordering app, the backend still owns authentication, action authorization, purchase rules, idempotency, service integrations and HTTP responses. Replacing a database does not implement those rules.

| Component | Responsibility in this example |
| --- | --- |
| Frontend | Capture the purchase and display the result. |
| Backend in Apps or external infrastructure | Validate the operation and coordinate services. |
| Lakebase | Persist orders and execute Postgres transactions. |
| Lakehouse | Prepare metrics, analysis and models. |

Adding Lakebase as a **Databricks Apps resource** preserves database state across deployments. Application compute and database compute are separate resources. [Apps integration](https://docs.databricks.com/aws/en/oltp/projects/databricks-apps), [database resources](https://docs.databricks.com/aws/en/dev-tools/databricks-apps/lakebase).

Moving from a different database requires evaluating data, SQL, extensions and connections. LTAP's connection continuity applies to applications **already using Lakebase**.

## Use cases to evaluate

These are design examples, not latency guarantees:

| Case | Proposed path | What to measure |
| --- | --- | --- |
| Orders and inventory | App writes Lakebase; analytics observes orders and stock. | Freshness, consistency and purchase latency under load. |
| Personalization | Lakehouse computes recommendations; synced tables serve them. | Refresh lag and customer lookup latency. |
| Fraud operations | Lakehouse prepares scores; app records decisions. | Score freshness, traceability and failure behavior. |
| Support tools | Backend combines prepared profiles with operational tickets. | User permissions and consistency between datasets. |
| Stateful agent | App persists sessions and actions; downstream jobs analyze history. | User isolation, retention and recovery. |

## Availability is capability-specific

| AWS capability, Oct 28, 2026 | Documented status |
| --- | --- |
| Lakebase registration in Unity Catalog | GA |
| Synced tables | GA |
| LTAP Direct Writes | Beta |
| Lakebase Change Data Feed | Public Preview |
| Lakehouse//RT **querying live Lakebase** | Private Preview |
| Lakehouse//RT for compatible Unity Catalog tables | Beta |

The [LTAP matrix](https://docs.databricks.com/aws/en/oltp/projects/ltap-overview) and [Lakehouse//RT guide](https://docs.databricks.com/aws/en/compute/sql-warehouse/real-time) describe different scopes. Enabling RT does not automatically grant the live Lakebase preview. The general RT guide also lists Genie and Genie Agents as unsupported today.

Test both access paths: **Unity Catalog governs registered analytical access**, while **Postgres roles govern direct connections**. [Access permissions](https://docs.databricks.com/aws/en/oltp/projects/register-uc).

## How I would run a PoC

Choose one operation and one question: “record an order” and “show orders by region.” Assign each table's writer and confirm the available path with the account team. Measure application p95 latency, analytical freshness, result quality and the combined cost of app, database, queries and synchronization.

Without live-read preview access, I would test CDF if enabled, explicitly identifying it as a change-stream evaluation. Add recommendations through synced tables as the second path. That demonstrates which bridge becomes simpler and which application and data responsibilities remain.

Continue with [Genie: One, Agents and Code](/en/blog/databricks-genie-explained/) or share your experience in [Data Wizard](https://www.datawizard.tech/).

*Original Daniel DataShow infographic. Conceptual arrows do not represent one distributed transaction or a latency promise. Reproducible generator and references are in `scripts/blog/ltap/`.*

*Logos and icons come from official [Databricks](https://www.databricks.com/company/newsroom/press-kit), [PostgreSQL](https://wiki.postgresql.org/wiki/Logo), [Python](https://www.python.org/community/logos/) and [Node.js](https://nodejs.org/en/about/branding) sources. Python and Node.js illustrate backend technology choices; Node.js is a JavaScript runtime.*
