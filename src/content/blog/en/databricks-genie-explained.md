---
title: 'Databricks Genie explained: One, Agents and Code'
description: 'Understand the Genie experiences, how they work together, and how AI usage differs from execution compute. Includes an animated infographic and October 2026 references.'
pubDate: '2026-10-28T12:00:00-05:00'
updatedDate: '2026-10-28T12:00:00-05:00'
heroImage: '../../../assets/genie-explained.png'
heroAnimation: '/images/blog/databricks-genie/genie-explained.gif'
heroAlt: 'Animated English diagram: business users, data experts and developers use Genie One, Genie Agents and Genie Code over Unity Catalog; AI consumption and execution compute are billed separately.'
---

**Genie is a family of AI experiences grounded in your data.** Genie One serves business users, Genie Agents provide curated domain environments, and Genie Code supports technical work. They share a governed foundation. [Official Genie overview](https://docs.databricks.com/aws/en/genie/).

*References checked on October 28, 2026. The animation is a conceptual explanation. Read this article in [Spanish](/es/blog/databricks-genie-explained/) or [download the GIF](/images/blog/databricks-genie/genie-explained.gif).*

## What each name means today

| Experience | Audience | Main purpose |
| --- | --- | --- |
| **Genie One** | Business users | A simple entry point for questions, dashboards and apps. |
| **Genie Agents** | Domain experts and the people using their curated context | Domain-specific questions over selected data, rules and examples. |
| **Genie Code** | Engineers, analysts and data scientists | Building and technical assistance inside the workspace. |

Two name changes matter when reading older material: **Databricks One → Genie One** and **Genie Spaces → Genie Agents**. Both are explicitly documented. [Genie One](https://docs.databricks.com/aws/en/genie-one/), [Genie Agents](https://docs.databricks.com/aws/en/genie-agents/).

## Genie One: the business entry point

Use one interface to ask questions, explore AI/BI dashboards and open Databricks Apps. Workspace-level and account-level experiences are available; shared assets and the user's permissions still determine access. [Using Genie One](https://docs.databricks.com/aws/en/genie-one/).

Chat looks for a relevant Genie Agent first, then searches other assets if no match is found. External sources and scheduled tasks extend that experience. **Genie Ontology** provides business context shared with Genie Code; it is not a fourth user interface. [Chat and Ontology](https://docs.databricks.com/aws/en/genie-one/chat).

## Genie Agents: make business meaning explicit

An agent combines Unity Catalog datasets, SQL examples and instructions for a domain. It can return queries, result tables and visualizations. Experts prepare the meaning behind the business question. [Genie Agents overview](https://docs.databricks.com/aws/en/genie-agents/).

For example, “sales” might mean gross sales, net sales or collected invoices. Define joins, measures, filters and examples rather than leaving those choices implicit. SQL functions and parameterized examples can become trusted assets. [Tuning answer quality](https://docs.databricks.com/aws/en/genie-agents/tune-quality).

## Genie Code: build with technical context

Genie Code can plan and execute tasks using workspace code and assets. Its agentic capabilities depend on AI configuration and geographic availability. [Genie Code](https://docs.databricks.com/aws/en/genie-code/).

It helps generate, explain, optimize and fix code across surfaces such as notebooks, the SQL editor and dashboards. Databricks recommends reviewing generated code before running it. A useful prompt might be: “Explain this pipeline, identify the bottleneck, and propose a change with a validation step.” [Current capabilities](https://docs.databricks.com/aws/en/genie-code/features-capabilities).

## How they help together

Imagine a sales team investigating a margin decline:

1. Data experts curate definitions and examples in a **Genie Agent**.
2. A manager asks a question through **Genie One** and explores the answer.
3. An engineer uses **Genie Code** to investigate and improve the process preparing that data.

This is an illustrative workflow, not a mandatory execution sequence. For a pilot, I would choose a narrow domain and representative questions. Domain owners should review results and SQL before expansion. Benchmarks and monitoring help evaluate an agent against known questions. [Testing and monitoring](https://docs.databricks.com/aws/en/genie-agents/monitor).

## How billing works

Separate **model consumption** from **the resources executing queries and processes**.

| Component | Documented position on Oct 28, 2026 |
| --- | --- |
| Genie Code | Usage-based AI billing; 150 free DBUs per user per month, with overage billed. |
| Genie One and Genie Agents | Free promotion for users through **Jan 31, 2027**. Service principals are excluded. |
| Execution compute | SQL warehouses and other consumed resources are billed separately from Genie usage. |

A temporary promotion does not make the whole workflow free. Monetary cost depends on the applicable SKU and account terms. Check [current pricing](https://www.databricks.com/product/pricing/genie) and the [consumption documentation](https://docs.databricks.com/aws/en/genie/monitor-cost).

**Illustrative example:** a user consuming 200 eligible Genie Code DBUs in a month uses 150 within the allowance and exceeds it by 50. This is not a dollar estimate and excludes compute.

Admins can configure Genie budgets through **Unity Gateway**, with alerts or approximate blocking. Those budgets track LLM usage rather than warehouse execution and do not guarantee an absolute invoice cap. [Budgets and controls](https://docs.databricks.com/aws/en/genie/budgets).

To distinguish products in consumption analysis, inspect `usage_metadata.genie.surface` and filter `billing_origin_product = 'GENIE'` in `system.billing.usage`. Free-usage records require separate treatment. [Monitoring cost](https://docs.databricks.com/aws/en/genie/monitor-cost).

## Where I would start

Pick a recurring question such as “How has margin changed by region?” Prepare definitions, validate access and measure how often answers are useful without corrections. Compare that improvement with observed consumption. An alert-only budget **does not block** spending; blocking must be explicitly configured when needed. [Cost FAQ](https://docs.databricks.com/aws/en/genie/genie-cost-budgets-faq).

Check availability feature by feature. For example, the docs mark web search as **Beta** and Genie One code execution as **Public Preview**. Do not assign one release status to the whole family. [Chat capabilities](https://docs.databricks.com/aws/en/genie-one/chat).

Share your experience with the [Data Wizard community](https://www.datawizard.tech/).

*Original infographic by Daniel DataShow. Icons from [Databricks Architecture Icons](https://oieduardorabelo.github.io/databricks-architecture-icons/), an unofficial community collection. Product and cost claims were checked against the linked official sources, not the icon catalog.*
