# Lakehouse Federation infographic and article source notes

Version 1.1 · Created and updated 2026-10-30.

Original English infographic, 1280 × 960, 125 frames × 80 ms, 10-second infinite loop. Shares the Genie/LTAP dark teal dotted background, Arial typography and governance strip, with a more dynamic timeline: SQL typing, sequential step highlights, comet packets with trails, two execution lanes (SQL clauses pushed down; file blocks streamed into Databricks compute), source-tile scanning, result bars, lineage and governance pills. Decision guidance (when to use / when to ingest / limits) lives only in the articles, leaving the canvas to the flow. The active step uses a toned-down Databricks red. Generated from code, with no reference GIF frames reused.

## Official references checked 2026-10-30

- Overview, two federation types, source lists, read-only scope, Lakeflow Connect recommendation (page updated 2026-09-29): https://docs.databricks.com/aws/en/query-federation/
- Catalog federation, Databricks-only compute, authorized paths, metadata refresh, limitations: https://docs.databricks.com/aws/en/query-federation/catalog-federation
- PostgreSQL connector: compute requirements, privileges, CREATE CONNECTION / CREATE FOREIGN CATALOG syntax, pushdown matrix (page updated 2026-10-06): https://docs.databricks.com/aws/en/query-federation/postgresql

## Interpretation boundaries

- Source lists reflect the overview page on the check date; the page gives no GA/Preview status per source, so none is claimed. Availability can vary by cloud.
- "The same heavy joins run all day" and "The source can't absorb analytic load" are editorial guidance, labelled as such in both articles.
- Compute requirements quoted come from the PostgreSQL connector page; other connectors may differ.
- The SQL and result bars in the graphic are illustrative; no numbers are shown or claimed.
- Arrows are conceptual: gold = query/pushdown, mint = metadata and rows returned, white = setup connection.

## Artwork

Only official artwork is used. Where no first-party file could be obtained, the source is shown as a text label.

Databricks icons, downloaded from databricks.com on 2026-10-30 (slug → URL mapping from the community catalog https://oieduardorabelo.github.io/databricks-architecture-icons/, which republishes unmodified Databricks files):

| File | Official source |
| --- | --- |
| `databricks.svg` | https://www.databricks.com/sites/default/files/2026-05/Databricks-Logo-Icon.svg |
| `unity-catalog.svg` | https://www.databricks.com/sites/default/files/2026-01/icon-unity-catalog.svg |
| `lakehouse-federation.svg` | https://www.databricks.com/sites/default/files/2023-03/icon-orange-Network-Data-Sources.svg |
| `sql-warehouse.svg` | https://www.databricks.com/sites/default/files/2026-06/TableLightningIcon.svg |
| `lakehouse-storage.svg` | https://www.databricks.com/sites/default/files/2023-02/icon-orange-Delta-Table.svg |
| `data-lineage.svg` | https://www.databricks.com/sites/default/files/2025-01/primary-icon-orange-data-lineage.svg |
| `shield-check.svg` | https://www.databricks.com/sites/default/files/2026-06/ShieldCheckIcon.svg |
| `lakeflow-connect.svg` | https://www.databricks.com/sites/default/files/2023-09/primary-icon-orange-connectors.svg (kept for the articles; not drawn) |

Vendor marks:

| File | Official source |
| --- | --- |
| `postgresql.svg` | https://wiki.postgresql.org/images/a/a4/PostgreSQL_logo.3colors.svg |
| `logo-redshift.svg`, `logo-aws-glue.svg` | AWS Architecture Icons package (Icon-package_07312026), https://aws.amazon.com/architecture/icons/ |
| `logo-synapse.svg`, `logo-sqlserver.svg` | Azure Public Service Icons V24, https://learn.microsoft.com/en-us/azure/architecture/icons/ |
| `logo-hive.svg` | https://hive.apache.org/images/hive.svg |
| `logo-snowflake.svg` | https://www.snowflake.com/etc.clientlibs/snowflake-site/clientlibs/clientlib-react/resources/safari-pinned-tab.svg — monochrome mask filled with Snowflake brand blue #29B5E8 (https://www.snowflake.com/brand-guidelines/) |

Text-only (no first-party file obtainable on 2026-10-30): MySQL, Oracle, Teradata, BigQuery, Salesforce, Palantir, Workday. Logos identify technologies; they do not imply sponsorship or endorsement.

Signature: Daniel DataShow · linkedin.com/in/danielportugalr.

## Rebuild

From repository root: `node scripts/blog/federation/render.mjs`.

Requires installed `sharp` and Python 3 with Pillow (set `PYTHON` if the default lacks it). On other operating systems set `FED_FONT_REGULAR`, `FED_FONT_BOLD` and `FED_FONT_MONO`.

Outputs: `src/assets/federation-explained.png`, `public/images/blog/databricks-lakehouse-federation/federation-explained.png` and `.gif`.
