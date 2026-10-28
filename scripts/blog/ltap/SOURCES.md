# LTAP infographic and article source notes

Version 1.2 · Created and updated 2026-10-28.

Original English infographic, 1280 × 960, 100 frames × 100 ms, 10-second infinite loop. Shares the Genie infographic's dark teal dotted background, vermilion product panel, cream governance strip, Arial typography and animated packets. Generated from code, with no reference GIF frames reused.

## Official references checked 2026-10-28

- Architecture, logical copy, single writer, and AWS release matrix: https://docs.databricks.com/aws/en/oltp/projects/ltap-overview
- Lakebase compute, WAL commit, safekeepers and pageservers: https://docs.databricks.com/aws/en/oltp/projects/architecture
- Storage transcoding and analytical reads: https://www.databricks.com/blog/lakebase-ltap-rethinking-database-storage
- Connect and tools: https://docs.databricks.com/aws/en/oltp/projects/connect
- Direct workspace SQL connection versus registered catalog: https://docs.databricks.com/aws/en/oltp/projects/query-sql-editor
- Registration, serverless requirement, read-only analytical catalog and separate Postgres privileges: https://docs.databricks.com/aws/en/oltp/projects/register-uc
- CDF configuration, preview, approximate batching and medallion pipelines: https://docs.databricks.com/aws/en/oltp/projects/lakebase-cdf
- Managed copies, synchronization and optional Beta Direct Writes: https://docs.databricks.com/aws/en/oltp/projects/sync-tables
- General RT Beta, surfaces and limitations: https://docs.databricks.com/aws/en/compute/sql-warehouse/real-time
- Application deployment choices: https://docs.databricks.com/aws/en/oltp/projects/build-applications
- Separate application and database compute: https://docs.databricks.com/aws/en/oltp/projects/databricks-apps
- Persistent Apps resources: https://docs.databricks.com/aws/en/dev-tools/databricks-apps/lakebase

## Interpretation boundaries

- LTAP is an architecture, not a universal GA switch. The AWS matrix lists live Lakebase reads through Lakehouse//RT as Private Preview; the general RT warehouse is Beta. Do not collapse those scopes.
- Gold packets depict application writes, the storage foundation, analytical reads and optional CDF output. Mint packets depict an illustrative serving path from prepared lakehouse results to Lakebase. Separate paths are not one transaction.
- CDF produces change-history Delta tables. It is not the current-state analytical read path and does not claim zero latency.
- Synced tables create managed copies using synchronization pipelines. The one-logical-copy architecture claim does not mean every direction and derived dataset is physically copy-free.
- Direct Writes accelerates initial loads and full refreshes; it is not a general-purpose application writer and does not accelerate every incremental update.
- Unity Catalog governs registered analytical access; direct Postgres access uses Postgres roles and grants.
- Backend responsibilities, sample use cases and PoC measurements are editorial architecture examples. No latency or cost guarantees are made.
- No promise is made that external databases lose their integration requirements, or that all capabilities are available on Azure/GCP.

## Artwork

SVG artwork is preserved under `public/images/blog/databricks-ltap/icons/`. It is fitted proportionally with transparent padding, with aspect ratio preserved. Python uses the original two-snake paths with a corrected viewBox and flat blue/yellow fills; its shadow is omitted. All files were downloaded from first-party sources on 2026-10-28:

| File | Official source |
| --- | --- |
| `databricks.svg` | https://www.databricks.com/sites/default/files/2024-10/Databricks-Logo-Icon.svg |
| `databricks-apps.svg` | https://www.databricks.com/sites/default/files/2025-06/appsIcon-orange.svg |
| `lakehouse.svg` | https://www.databricks.com/sites/default/files/2025-05/primary-icon-orange-lakehouse.svg |
| `unity-catalog.svg` | https://www.databricks.com/sites/default/files/2025-02/primary-icon-orange-governance.svg |
| `postgresql.svg` | https://wiki.postgresql.org/images/a/a4/PostgreSQL_logo.3colors.svg |
| `python.svg` | https://s3.dualstack.us-east-2.amazonaws.com/pythondotorg-assets/media/files/python-logo-only.svg |
| `nodejs.svg` | https://nodejs.org/static/logos/jsIconGreen.svg |

Databricks assets are linked from its official Lakebase, Unity Catalog and press-kit pages. The governance icon beside Unity Catalog is Databricks' official governance illustration, not a distinct Unity Catalog wordmark. PostgreSQL's elephant identifies the Postgres engine inside the Lakebase panel; it is not presented as a Lakebase-specific logo. Python and Node.js identify example backend technologies, not requirements for using LTAP. Node.js is a JavaScript runtime.

Brand references: https://www.databricks.com/company/newsroom/press-kit · https://www.python.org/community/logos/ · https://nodejs.org/en/about/branding · https://wiki.postgresql.org/wiki/Logo

This revision replaces the earlier community-sourced Databricks icons in the LTAP graphic with first-party assets. Layout and other shapes remain original code-native artwork. Logos identify technologies; they do not imply sponsorship or endorsement.

## Rebuild

From repository root: `node scripts/blog/ltap/render.mjs`.

Requires installed `sharp` and Python 3 with Pillow. Set `PYTHON` to an interpreter with Pillow if the default lacks it. On other operating systems set `LTAP_FONT_REGULAR` and `LTAP_FONT_BOLD` to compatible sans fonts.

Outputs: `src/assets/ltap-explained.png` (catalog poster), `public/images/blog/databricks-ltap/ltap-explained.png`, and `public/images/blog/databricks-ltap/ltap-explained.gif`. Update the two articles, diagram and this source record together when product status changes.

Revision 1.2: restored the original warehouse/lightning pictogram beside Lakehouse//RT, at the user’s request. This pictogram comes from the previously attributed community collection in scripts/blog/genie/SOURCES.md; it is not claimed as an official standalone RT logo. Python is a flat adaptation of official paths; Node.js uses the official flat JS mark.
