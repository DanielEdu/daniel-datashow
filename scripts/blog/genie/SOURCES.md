# Genie animation source notes

Version 1.0 · Created and updated 2026-10-28.

Original English 1280 × 960 infographic. Visual reference: the Lakeflow GIF supplied by Daniel. Dark teal cards, vermilion product panels, cream governance bar and moving packets; no frames from the reference are reused.

Product labels were checked against these official sources on 2026-10-28:

- https://docs.databricks.com/aws/en/genie/
- https://docs.databricks.com/aws/en/genie-one/
- https://docs.databricks.com/aws/en/genie-one/chat
- https://docs.databricks.com/aws/en/genie-agents/
- https://docs.databricks.com/aws/en/genie-agents/concepts
- https://docs.databricks.com/aws/en/genie-agents/tune-quality
- https://docs.databricks.com/aws/en/genie-agents/monitor
- https://docs.databricks.com/aws/en/genie-code/
- https://docs.databricks.com/aws/en/genie-code/features-capabilities
- https://docs.databricks.com/aws/en/genie/budgets
- https://docs.databricks.com/aws/en/genie/monitor-cost
- https://docs.databricks.com/aws/en/genie/genie-cost-budgets-faq
- https://www.databricks.com/product/pricing/genie

Artwork downloads: https://oieduardorabelo.github.io/databricks-architecture-icons/icons/svg/ (genie, genie-one, genie-agents, genie-code, unity-catalog, databricks, sql-warehouse). This is an **unofficial community collection**; its descriptions are not used to establish product names, availability or pricing. Original SVG files are preserved under public/images/blog/databricks-genie/icons/.

The picture is conceptual, not a required execution topology. Price details and temporary promotions belong in dated article text, not in the GIF. No rate in dollars is invented.

Rebuild from repository root: `node scripts/blog/genie/render.mjs`. Uses the installed sharp dependency and Python 3 with Pillow. On macOS, Arial is used; other systems can set GENIE_FONT_REGULAR and GENIE_FONT_BOLD to compatible font paths, and PYTHON to an interpreter with Pillow.

Outputs: 80 frames, 100 ms each, 8-second infinite loop; static PNG poster for reduced motion and blog cards. Update the GIF, poster and both languages together after rechecking sources.
