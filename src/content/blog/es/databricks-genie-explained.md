---
title: 'Databricks Genie: One, Agents y Code, sin confundirlos'
description: 'Qué hace cada experiencia de Genie, cómo se complementan y cómo separar su consumo de IA del cómputo. Guía con infografía animada y referencias de octubre de 2026.'
pubDate: '2026-10-28T12:00:00-05:00'
updatedDate: '2026-10-28T12:00:00-05:00'
heroImage: '../../../assets/genie-explained.png'
heroAnimation: '/images/blog/databricks-genie/genie-explained.gif'
heroAlt: 'Diagrama animado en inglés: usuarios de negocio, expertos de datos y desarrolladores trabajan con Genie One, Genie Agents y Genie Code sobre Unity Catalog; el consumo de IA y el cómputo se facturan por separado.'
---

**Genie es una familia de experiencias de IA sobre tus datos.** Genie One acerca esa experiencia al negocio, Genie Agents aporta entornos preparados para un dominio y Genie Code ayuda al equipo técnico a construir. Los tres comparten una base gobernada. [Panorama oficial de Genie](https://docs.databricks.com/aws/en/genie/).

*Referencias revisadas el 28 de octubre de 2026. La animación está en inglés y es una explicación conceptual; el artículo también está disponible en [inglés](/en/blog/databricks-genie-explained/). [Descargar el GIF](/images/blog/databricks-genie/genie-explained.gif).*

## Qué significa cada nombre hoy

| Experiencia | Para quién | Qué resuelve |
| --- | --- | --- |
| **Genie One** | Usuarios de negocio | Una entrada sencilla para preguntar, explorar dashboards y usar aplicaciones. |
| **Genie Agents** | Expertos que preparan el contexto y personas que lo consultan | Preguntas sobre un dominio con datos, reglas y ejemplos seleccionados. |
| **Genie Code** | Ingeniería, analítica y ciencia de datos | Construcción y asistencia técnica dentro del workspace. |

Hay dos cambios de nombre que conviene reconocer al leer material anterior: **Databricks One → Genie One** y **Genie Spaces → Genie Agents**. Las referencias actuales los indican expresamente. [Genie One](https://docs.databricks.com/aws/en/genie-one/), [Genie Agents](https://docs.databricks.com/aws/en/genie-agents/).

## Genie One: la entrada para negocio

Desde una misma interfaz puedes conversar con los datos, abrir dashboards de AI/BI y trabajar con Databricks Apps. Existe una experiencia por workspace y otra a nivel de cuenta; el acceso a los activos sigue dependiendo de lo que se haya compartido y de los permisos del usuario. [Usar Genie One](https://docs.databricks.com/aws/en/genie-one/).

El chat busca primero un Genie Agent pertinente. Si no encuentra uno, busca otros activos relevantes. También puede incorporar fuentes externas y tareas programadas. **Genie Ontology** aporta contexto de negocio compartido con Genie Code; no es una cuarta interfaz de usuario. [Chat y Ontology](https://docs.databricks.com/aws/en/genie-one/chat).

## Genie Agents: preparar el significado del negocio

Un agente reúne datasets de Unity Catalog, ejemplos SQL e instrucciones para un dominio. Devuelve consultas, tablas y visualizaciones. El trabajo del experto consiste en preparar qué significa cada pregunta dentro de la organización. [Qué es un Genie Agent](https://docs.databricks.com/aws/en/genie-agents/).

Por ejemplo, «ventas» podría significar ventas brutas, ventas netas o facturas cobradas. Definir joins, medidas, filtros y ejemplos evita dejar esas decisiones implícitas. Las funciones SQL y los ejemplos parametrizados pueden formar parte de los activos de confianza. [Ajustar la calidad](https://docs.databricks.com/aws/en/genie-agents/tune-quality).

## Genie Code: construir con contexto técnico

Genie Code puede planificar y ejecutar tareas, apoyándose en el código y los activos del workspace. Sus capacidades agénticas dependen de la configuración de IA y de la disponibilidad geográfica. [Genie Code](https://docs.databricks.com/aws/en/genie-code/).

Ayuda a generar, explicar, optimizar y corregir código en superficies como notebooks, editor SQL y dashboards. La documentación recomienda revisar el código generado antes de ejecutarlo. Un prompt útil sería: «Explica este pipeline, identifica el cuello de botella y propón un cambio con una comprobación». [Capacidades actuales](https://docs.databricks.com/aws/en/genie-code/features-capabilities).

## Cómo te ayudan juntos

Imagina un equipo de ventas que quiere entender por qué cayó el margen:

1. El equipo de datos publica definiciones y ejemplos en un **Genie Agent**.
2. La gerente pregunta desde **Genie One** y explora la respuesta.
3. Un ingeniero usa **Genie Code** para investigar y mejorar el proceso que prepara esos datos.

Es un ejemplo de organización del trabajo, no una secuencia obligatoria. Para un piloto, elegiría un dominio acotado y preguntas representativas. Revisaría resultados y SQL con sus responsables antes de ampliarlo. Los benchmarks y la monitorización permiten evaluar el agente con preguntas conocidas. [Probar y monitorizar](https://docs.databricks.com/aws/en/genie-agents/monitor).

## Cómo se factura

Hay que separar **el trabajo del modelo** de **los recursos que ejecutan las consultas o procesos**.

| Concepto | Situación documentada al 28-oct-2026 |
| --- | --- |
| Genie Code | Pago por uso de IA; 150 DBU gratuitas por usuario al mes y cobro del exceso. |
| Genie One y Genie Agents | Promoción gratuita para usuarios hasta el **31-ene-2027**. Los service principals quedan excluidos. |
| Cómputo de ejecución | SQL warehouses y otros recursos consumidos se facturan aparte del uso de Genie. |

La gratuidad temporal no equivale a que todo el flujo sea gratis. El precio monetario depende del SKU y de las condiciones aplicables a tu cuenta; consulta la [tarifa vigente](https://www.databricks.com/product/pricing/genie) y la [documentación de consumo](https://docs.databricks.com/aws/en/genie/monitor-cost).

**Ejemplo ilustrativo:** si un usuario consume 200 DBU elegibles de Genie Code en un mes, 150 entran en su franquicia y 50 la exceden. Esto no calcula el precio en dólares ni incluye el cómputo.

Los administradores pueden configurar presupuestos de Genie mediante **Unity Gateway**, con alertas o bloqueo aproximado. Esos presupuestos siguen el consumo de LLM, no el SQL warehouse, y no garantizan un tope absoluto en la factura. [Presupuestos y límites](https://docs.databricks.com/aws/en/genie/budgets).

Para separar productos al analizar el consumo, usa `usage_metadata.genie.surface` y filtra `billing_origin_product = 'GENIE'` en `system.billing.usage`. Las filas de uso gratuito tienen un tratamiento distinto. [Monitorizar el coste](https://docs.databricks.com/aws/en/genie/monitor-cost).

## Cómo empezaría

Elegiría una pregunta real y repetida, como «¿cómo evolucionó el margen por región?». Prepararía las definiciones, validaría los permisos y mediría cuántas respuestas resultan útiles sin correcciones. Después compararía esa mejora con el consumo observado. Un presupuesto con solo alertas **no bloquea** el gasto; hay que configurar explícitamente esa acción si se necesita. [Preguntas sobre costes](https://docs.databricks.com/aws/en/genie/genie-cost-budgets-faq).

La disponibilidad de funciones concretas debe revisarse por separado: por ejemplo, la documentación marca la búsqueda web como **Beta** y la ejecución de código de Genie One como **Public Preview**. Evita atribuir el mismo estado a toda la familia. [Funciones del chat](https://docs.databricks.com/aws/en/genie-one/chat).

Si quieres compartir experiencias de uso, nos encontramos en [Data Wizard](https://www.datawizard.tech/).

*Infografía original de Daniel DataShow. Iconos obtenidos de [Databricks Architecture Icons](https://oieduardorabelo.github.io/databricks-architecture-icons/), colección comunitaria no oficial. Las capacidades y los costes se contrastaron con las fuentes oficiales enlazadas, no con el catálogo de iconos.*
