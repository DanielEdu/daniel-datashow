---
title: 'Lakehouse Federation: types, flow and when to use it on Databricks'
description: 'Query federation and catalog federation explained: how a federated query flows, which sources each type supports, when it fits and when to ingest with Lakeflow Connect instead.'
pubDate: '2026-10-30T13:00:00-05:00'
updatedDate: '2026-10-30T13:00:00-05:00'
heroImage: '../../../assets/federation-explained.png'
heroAnimation: '/images/blog/databricks-lakehouse-federation/federation-explained.gif'
heroAlt: 'Animated diagram: a SQL query enters Lakehouse Federation in Unity Catalog, passes through a connection, a foreign catalog and grants, and is answered either by pushdown to the source database or by reading files directly in object storage. Below: when to use it, when to prefer ingestion, and its limits.'
---

**Lakehouse Federation lets you query data that lives outside Databricks without copying it, with Unity Catalog governance on top.** It is read-only and comes in two types with different mechanics: one delegates the query to the source database, the other reads the files directly.

*Official references checked October 30, 2026. Supported sources can vary by cloud. Conceptual English infographic. [Versión en español](/es/blog/databricks-lakehouse-federation-explained/) · [Download GIF](/images/blog/databricks-lakehouse-federation/federation-explained.gif).*

## What Lakehouse Federation is

It is Databricks' platform for governed access to external data without migrating it. Each source appears in Unity Catalog as a **foreign catalog**: a read-only catalog of schemas and tables you can query, grant and audit like any other UC object. [Lakehouse Federation](https://docs.databricks.com/aws/en/query-federation/).

Example: your orders still live in PostgreSQL and your customers are already a gold table in Unity Catalog. With federation, one query joins them:

```sql
SELECT c.segment, SUM(o.amount)
FROM pg.sales.orders o           -- foreign catalog (PostgreSQL)
JOIN main.gold.customers c       -- Unity Catalog table
  ON o.cust_id = c.id
GROUP BY 1;
```

## The two federation types

| | **Query federation** | **Catalog federation** |
| --- | --- | --- |
| How it reaches data | JDBC to the source database | Reads files directly in object storage |
| Who executes | Source engine (pushdown) plus Databricks compute | Databricks compute only |
| What you need | Connection with host and credentials | Connection to the external catalog + storage credential and external location |
| Built for | Ad hoc reporting, BI and PoCs on operational databases | Incremental migration to Unity Catalog or a lasting hybrid model |
| Writes | No, read-only | No, read-only (except the legacy internal Hive metastore) |

### Query federation

Databricks translates the parts of your query it can delegate (filters, projections, aggregates, `LIMIT`…) and **pushes them down to the source database**; the rest runs on Databricks. Pushdown support varies by source: on PostgreSQL, for example, filters, aggregates and projections are delegated, while many functions are only delegated inside filters. [PostgreSQL pushdown](https://docs.databricks.com/aws/en/query-federation/postgresql).

Listed sources: **MySQL, PostgreSQL, Teradata, Oracle, Amazon Redshift, Salesforce Data 360, Snowflake, Microsoft SQL Server, Azure Synapse, Google BigQuery and Databricks** (another workspace).

### Catalog federation

Here Databricks doesn't ask the external engine to read the data: it asks the external catalog for metadata and **reads the tables straight from storage** with its own compute. That is usually cheaper and faster than going through the external system. [Catalog federation](https://docs.databricks.com/aws/en/query-federation/catalog-federation).

Listed sources: **legacy Databricks Hive metastore, external Hive metastore, AWS Glue, Salesforce Data 360 (file sharing), Snowflake, Palantir Foundry and Workday Data Connect**.

For Hive metastore federation, every table must sit under the configured **authorized paths**. This prevents anyone from redirecting a table's location to storage they shouldn't reach.

## How a federated query flows

The GIF shows four steps. The first three happen once; the fourth happens on every query.

1. **Connection.** A Unity Catalog object holding source type, host, port and credentials (preferably via `secret()`), or the external catalog endpoint.
2. **Foreign catalog.** Mirrors the source's schemas and tables inside Unity Catalog. Catalog federation also ties it to an external location.
3. **Grants.** `USE CATALOG`, `USE SCHEMA` and `SELECT`, just like any UC table. Lineage and audit are recorded.
4. **Query.** Unity Catalog checks permissions, then either pushes SQL to the source engine (query federation) or reads the files directly (catalog federation).

In SQL, setting up a PostgreSQL source looks like this:

```sql
CREATE CONNECTION pg_sales TYPE postgresql
OPTIONS (
  host 'pg.mycompany.internal',
  port '5432',
  user secret('federation', 'pg_user'),
  password secret('federation', 'pg_password')
);

CREATE FOREIGN CATALOG pg
USING CONNECTION pg_sales
OPTIONS (database 'sales');

GRANT USE CATALOG, USE SCHEMA, SELECT ON CATALOG pg TO `analysts`;
```

In the UI: **Catalog → add → Create a connection**, pick the type, fill in authentication, and the same wizard creates the foreign catalog and assigns privileges.

**Compute requirements for query federation** (PostgreSQL reference): Databricks Runtime 13.3 LTS or later in Standard or Dedicated access mode, or a Pro or Serverless SQL warehouse. Compute needs network connectivity to the source database.

## When to use it

- **Ad hoc queries on live operational data** without waiting for a pipeline.
- **BI dashboards and PoCs** to prove value before investing in ingestion.
- **Incremental migration to Unity Catalog**: catalog federation lets some workloads keep reading Hive metastore or Glue without code changes.
- **A long-term hybrid model**: some data stays in its catalog and is governed alongside what is already in UC.
- **Joining** an external table with lakehouse data in one governed query.

## When not to use it

- **High volume and low latency.** If the source also has a **Lakeflow Connect** connector, Databricks recommends it when performance on higher data volumes and lower latency are priorities.
- **The same heavy query runs all day.** Every run hits the source again; ingesting or materializing usually wins. *(Editorial judgment.)*
- **The operational database can't absorb analytic load.** With query federation, pushdown runs on the source engine and competes with the application. *(Editorial judgment.)*
- **You need to write.** Federation is read-only; for writes Databricks points to Spark data sources.
- **The source isn't listed.** Spark data sources or other integration options apply there too.

## Limits worth knowing

| Topic | What to know |
| --- | --- |
| Writes | Read-only. The exception is the legacy internal Databricks Hive metastore. |
| Pushdown | Varies by source and function; check each connector page. |
| Metadata | Refreshed when queried from Databricks. Access that bypasses Databricks Runtime can leave it stale; use `REFRESH FOREIGN CATALOG`, `SCHEMA` or `TABLE`, optionally scheduled in a Lakeflow Job. |
| First access | The first query on a new foreign catalog triggers a full refresh unless you refresh beforehand. |
| Security | An unsecured Hive metastore lets users redirect table paths; configure authorized paths carefully. |

## How I would run a PoC

Pick one operational source and one concrete business question. Answer it first with query federation and measure three things: response time, load generated on the source, and how much of the query was pushed down (the execution plan shows it). If the question becomes recurring or volume grows, compare against ingestion with Lakeflow Connect. Federate to explore, ingest what consolidates: that is usually a good balance.

Continue with [LTAP: applications and analytics on shared storage](/en/blog/databricks-ltap-explained/) and share your experience at [Data Wizard](https://www.datawizard.tech/).

*Original infographic by Daniel DataShow ([LinkedIn](https://www.linkedin.com/in/danielportugalr)). Conceptual arrows: no latency or cost promise. Sources and reproducible generator in `scripts/blog/federation/`.*

*Icons and logos from official sources: [Databricks](https://www.databricks.com/company/newsroom/press-kit), [PostgreSQL](https://wiki.postgresql.org/wiki/Logo), [AWS Architecture Icons](https://aws.amazon.com/architecture/icons/), [Azure Architecture Icons](https://learn.microsoft.com/en-us/azure/architecture/icons/), [Apache Hive](https://hive.apache.org/) and [Snowflake](https://www.snowflake.com/brand-guidelines/). Sources without an available official logo appear as text. Logos identify technologies and imply no sponsorship.*
