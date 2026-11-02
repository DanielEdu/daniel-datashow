---
title: 'Lakehouse Federation: tipos, flujo y cuándo usarla en Databricks'
description: 'Query federation y catalog federation explicadas: cómo fluye una consulta federada, qué fuentes soporta cada tipo, cuándo conviene y cuándo es mejor ingerir con Lakeflow Connect.'
pubDate: '2026-10-30T13:00:00-05:00'
updatedDate: '2026-10-30T13:00:00-05:00'
heroImage: '../../../assets/federation-explained.png'
heroAnimation: '/images/blog/databricks-lakehouse-federation/federation-explained.gif'
heroAlt: 'Diagrama animado: una consulta SQL entra a Lakehouse Federation en Unity Catalog, pasa por conexión, foreign catalog y permisos, y se resuelve con pushdown hacia la base de datos de origen o con lectura directa de archivos en object storage. Abajo, cuándo usarla, cuándo preferir ingesta y sus límites.'
---

**Lakehouse Federation te deja consultar datos que viven fuera de Databricks sin copiarlos, con el gobierno de Unity Catalog encima.** Es de solo lectura y existen dos tipos con mecánicas distintas: uno delega la consulta a la base de origen y el otro lee directamente los archivos.

*Fuentes oficiales revisadas el 30 de octubre de 2026. Las fuentes soportadas pueden variar por nube. Infografía conceptual en inglés. [English version](/en/blog/databricks-lakehouse-federation-explained/) · [Descargar GIF](/images/blog/databricks-lakehouse-federation/federation-explained.gif).*

## Qué es Lakehouse Federation

Es la plataforma de Databricks para acceder a datos externos de forma gobernada, sin migrarlos. Cada fuente aparece en Unity Catalog como un **foreign catalog**: un catálogo de solo lectura con esquemas y tablas que puedes consultar, permisionar y auditar como cualquier otro objeto de UC. [Lakehouse Federation](https://docs.databricks.com/aws/en/query-federation/).

Ejemplo: tus pedidos siguen en PostgreSQL y tus clientes ya están en una tabla gold de Unity Catalog. Con federación, una sola consulta los cruza:

```sql
SELECT c.segment, SUM(o.amount)
FROM pg.sales.orders o           -- foreign catalog (PostgreSQL)
JOIN main.gold.customers c       -- tabla de Unity Catalog
  ON o.cust_id = c.id
GROUP BY 1;
```

## Los dos tipos de federación

| | **Query federation** | **Catalog federation** |
| --- | --- | --- |
| Cómo llega al dato | JDBC hacia la base de origen | Lee los archivos directamente en object storage |
| Quién ejecuta | El motor de origen (pushdown) y el cómputo de Databricks | Solo el cómputo de Databricks |
| Qué necesitas | Conexión con host y credenciales | Conexión al catálogo externo + storage credential y external location |
| Pensado para | Reporting ad hoc, BI y PoCs sobre bases operativas | Migración gradual a Unity Catalog o modelo híbrido duradero |
| Escritura | No, solo lectura | No, solo lectura (salvo el Hive metastore interno legado) |

### Query federation

Databricks traduce las partes de tu consulta que puede delegar (filtros, proyecciones, agregaciones, `LIMIT`…) y las **empuja a la base de origen**; el resto se resuelve en Databricks. El soporte de pushdown cambia por fuente: en PostgreSQL, por ejemplo, filtros, agregados y proyecciones se delegan, mientras que muchas funciones solo se delegan dentro de filtros. [Pushdown en PostgreSQL](https://docs.databricks.com/aws/en/query-federation/postgresql).

Fuentes listadas: **MySQL, PostgreSQL, Teradata, Oracle, Amazon Redshift, Salesforce Data 360, Snowflake, Microsoft SQL Server, Azure Synapse, Google BigQuery y Databricks** (otro workspace).

### Catalog federation

Aquí Databricks no le pide nada al motor externo para leer los datos: consulta el catálogo externo para obtener metadatos y **lee las tablas directamente del almacenamiento** con su propio cómputo. Por eso suele ser más barato y rápido que pasar por el sistema externo. [Catalog federation](https://docs.databricks.com/aws/en/query-federation/catalog-federation).

Fuentes listadas: **Hive metastore legado de Databricks, Hive metastore externo, AWS Glue, Salesforce Data 360 (file sharing), Snowflake, Palantir Foundry y Workday Data Connect**.

En federación de Hive metastore, cada tabla debe estar dentro de los **authorized paths** configurados. Esa protección evita que alguien redirija la ubicación de una tabla hacia almacenamiento al que no debería llegar.

## Cómo fluye una consulta federada

El GIF lo muestra en cuatro pasos. Los tres primeros se hacen una sola vez; el cuarto ocurre en cada consulta.

1. **Conexión.** Objeto de Unity Catalog con el tipo de fuente, host, puerto y credenciales (mejor con `secret()`), o el endpoint del catálogo externo.
2. **Foreign catalog.** Refleja los esquemas y tablas de la fuente dentro de Unity Catalog. En catalog federation se asocia además a una external location.
3. **Permisos.** `USE CATALOG`, `USE SCHEMA` y `SELECT`, igual que con cualquier tabla de UC. Linaje y auditoría quedan registrados.
4. **Consulta.** Unity Catalog valida permisos y luego: o empuja SQL al motor de origen (query federation) o lee los archivos directamente (catalog federation).

En SQL, el setup de una fuente PostgreSQL se ve así:

```sql
CREATE CONNECTION pg_ventas TYPE postgresql
OPTIONS (
  host 'pg.miempresa.internal',
  port '5432',
  user secret('federation', 'pg_user'),
  password secret('federation', 'pg_password')
);

CREATE FOREIGN CATALOG pg
USING CONNECTION pg_ventas
OPTIONS (database 'sales');

GRANT USE CATALOG, USE SCHEMA, SELECT ON CATALOG pg TO `analistas`;
```

Desde la interfaz: **Catalog → agregar → Create a connection**, eliges el tipo, completas autenticación y en el mismo asistente creas el foreign catalog y asignas permisos.

**Requisitos de cómputo para query federation** (referencia PostgreSQL): Databricks Runtime 13.3 LTS o superior en modo Standard o Dedicated, o SQL warehouse Pro o Serverless. El cómputo necesita conectividad de red hacia la base de origen.

## Cuándo sí usarla

- **Consultas ad hoc sobre datos operativos vivos** sin esperar a construir un pipeline.
- **Dashboards de BI y PoCs** para validar valor antes de invertir en ingesta.
- **Migración incremental a Unity Catalog**: catalog federation permite que algunas cargas sigan leyendo el Hive metastore o Glue sin cambiar código.
- **Modelo híbrido de largo plazo**: parte de los datos se queda en su catálogo y se gobierna junto con lo que ya está en UC.
- **Cruzar** una tabla externa con datos del lakehouse en una sola consulta gobernada.

## Cuándo no usarla

- **Alto volumen y baja latencia.** Si la fuente también tiene conector de **Lakeflow Connect**, Databricks lo recomienda cuando el rendimiento sobre grandes volúmenes y la baja latencia son prioridad.
- **La misma consulta pesada se repite todo el día.** Cada ejecución vuelve a tocar la fuente; ingerir o materializar suele salir mejor. *(Criterio editorial.)*
- **La base operativa no aguanta carga analítica.** En query federation, el pushdown corre en el motor de origen y compite con la aplicación. *(Criterio editorial.)*
- **Necesitas escribir.** La federación es de solo lectura; para escribir, Databricks remite a Spark data sources.
- **La fuente no está en la lista.** También ahí la alternativa son Spark data sources u otros mecanismos de integración.

## Límites que conviene conocer

| Tema | Qué saber |
| --- | --- |
| Escritura | Solo lectura. La excepción es el Hive metastore interno legado de Databricks. |
| Pushdown | Varía por fuente y por función; revisa la página de cada conector. |
| Metadatos | Se refrescan al consultar desde Databricks. Accesos que no pasan por Databricks Runtime pueden dejarlos desactualizados; usa `REFRESH FOREIGN CATALOG`, `SCHEMA` o `TABLE`, incluso programado en un Lakeflow Job. |
| Primer acceso | La primera consulta a un foreign catalog nuevo dispara un refresco completo, salvo que refresques antes. |
| Seguridad | Un Hive metastore sin asegurar permite redirigir rutas de tablas; configura bien los authorized paths. |

## Cómo plantearía una PoC

Tomaría una fuente operativa y una pregunta de negocio concreta. Primero la resolvería con query federation para medir tres cosas: tiempo de respuesta, carga generada en la base de origen y qué parte de la consulta se delegó (el plan de ejecución lo muestra). Si la pregunta se vuelve recurrente o el volumen crece, compararía contra una ingesta con Lakeflow Connect. Federar para explorar e ingerir lo que se consolida suele ser un buen equilibrio.

Puedes seguir con [LTAP: aplicaciones y analítica sobre almacenamiento compartido](/es/blog/databricks-ltap-explained/) y compartir tu experiencia en [Data Wizard](https://www.datawizard.tech/).

*Infografía original de Daniel DataShow ([LinkedIn](https://www.linkedin.com/in/danielportugalr)). Flechas conceptuales: no representan una promesa de latencia ni de costo. Fuentes y generador reproducible en `scripts/blog/federation/`.*

*Íconos y logos obtenidos de fuentes oficiales: [Databricks](https://www.databricks.com/company/newsroom/press-kit), [PostgreSQL](https://wiki.postgresql.org/wiki/Logo), [AWS Architecture Icons](https://aws.amazon.com/architecture/icons/), [Azure Architecture Icons](https://learn.microsoft.com/en-us/azure/architecture/icons/), [Apache Hive](https://hive.apache.org/) y [Snowflake](https://www.snowflake.com/brand-guidelines/). Las fuentes sin logo oficial disponible aparecen como texto. Los logos identifican tecnologías y no implican patrocinio.*
