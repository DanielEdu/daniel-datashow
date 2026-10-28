---
title: 'Databricks LTAP: qué cambia para ETL, el backend y Lakebase'
description: 'Cómo se usa LTAP, dónde aparece y cómo conecta aplicaciones con analítica. Qué ocurre con ETL y ELT, qué hace Lakebase y qué sigue siendo responsabilidad del backend.'
pubDate: '2026-10-28T13:00:00-05:00'
updatedDate: '2026-10-28T13:00:00-05:00'
heroImage: '../../../assets/ltap-explained.png'
heroAnimation: '/images/blog/databricks-ltap/ltap-explained.gif'
heroAlt: 'Diagrama animado: una aplicación conserva su backend y escribe en Lakebase Postgres; LTAP comparte la base de almacenamiento con analítica. Se muestran por separado Change Data Feed, transformaciones y tablas sincronizadas hacia la aplicación.'
---

**LTAP acerca las transacciones y la analítica mediante almacenamiento compartido. El backend sigue ejecutando la lógica de la aplicación, y los equipos de datos siguen definiendo sus transformaciones.** Lo que cambia es el trabajo necesario para conectar ambos mundos.

*Fuentes oficiales revisadas el 28 de octubre de 2026. Disponibilidad referida a AWS; puede variar por nube y región. Infografía conceptual en inglés. [English version](/en/blog/databricks-ltap-explained/) · [Descargar GIF](/images/blog/databricks-ltap/ltap-explained.gif).*

## Qué es LTAP y qué problema resuelve

**Lake Transactional/Analytical Processing** es una arquitectura: Postgres atiende operaciones sobre pocas filas y el lakehouse ejecuta analítica sobre grandes volúmenes. Comparten una base de almacenamiento, con motores especializados. Lakebase aporta el lado transaccional. [Arquitectura LTAP](https://docs.databricks.com/aws/en/oltp/projects/ltap-overview).

Piensa en una aplicación de pedidos. Registrar una compra y calcular la distribución de ventas por región son trabajos distintos. Tradicionalmente mantienes un puente entre la base operativa y el sistema analítico. LTAP busca quitar ese puente de copia para los datos cubiertos por su arquitectura.

## Qué es y qué no es

| Idea | Cómo interpretarla |
| --- | --- |
| Unir OLTP y OLAP | Compartir la base de datos lógica con cómputo especializado para cada carga. |
| «Una copia» | Una copia **lógica**; pueden existir cachés y representaciones físicas diferentes. |
| «Sin ETL» | Se refiere al puente de copia operativa hacia analítica, no a todas las transformaciones de una empresa. |
| LTAP y Lakebase | LTAP es la arquitectura; Lakebase es la base Postgres que participa en ella. |
| Escritura desde ambos lados | Cada tabla tiene un propietario de escritura; evita asumir escrituras bidireccionales libres. |

Las capacidades se adoptan por separado. Tener Lakebase no implica tener habilitadas todas las funciones LTAP. [Alcance y capacidades](https://docs.databricks.com/aws/en/oltp/projects/ltap-overview).

## Qué ocurre por debajo

Lakebase separa el cómputo Postgres del almacenamiento. Los **safekeepers** hacen durable el registro de cambios o WAL; los **pageservers** reconstruyen páginas y las persisten de forma asíncrona. Confirmar una transacción y materializar sus datos son pasos distintos. [Arquitectura de Lakebase](https://docs.databricks.com/aws/en/oltp/projects/architecture).

LTAP incorpora conversión de filas a formato columnar en esa capa de almacenamiento: Parquet, accesible mediante formatos de tabla como Delta e Iceberg. La lectura analítica puede combinar el material columnar con cambios recientes para obtener una vista consistente. Esta conversión técnica conserva el significado de los datos; no decide qué entiende tu empresa por «venta neta». [Explicación de ingeniería](https://www.databricks.com/blog/lakebase-ltap-rethinking-database-storage).

## Cómo interactúas y en qué partes aparece

No necesitas buscar una consola única llamada «LTAP». Trabajas con las superficies que implementan cada recorrido:

| Superficie | Qué haces allí |
| --- | --- |
| **Lakebase App** | Seleccionar proyecto, branch y base; abrir Connect, SQL Editor o Tables Editor. |
| **Tu backend o cliente Postgres** | Leer y escribir con drivers Postgres, `psql`, DBeaver u otros clientes compatibles. |
| **Catalog Explorer** | Registrar una base Lakebase y descubrir sus objetos como catálogo de solo lectura. |
| **SQL Editor, notebooks y dashboards** | Consumir los datos mediante el cómputo compatible con el recorrido elegido. |
| **Lakebase CDF** | Configurar un flujo de cambios hacia tablas Delta para procesos posteriores. |
| **Create → Synced table** | Llevar datos preparados en Unity Catalog a Lakebase para consultas de la aplicación. |

Lakebase reúne sus herramientas de conexión y edición en la [guía de conexiones](https://docs.databricks.com/aws/en/oltp/projects/connect). El SQL Editor del workspace también permite **conexión directa a Lakebase**: seleccionas Lakebase Postgres en el selector de cómputo y eliges proyecto y branch. Esa conexión ejecuta Postgres; no demuestra por sí sola una lectura LTAP desde almacenamiento compartido. [Conectar desde SQL Editor](https://docs.databricks.com/aws/en/oltp/projects/query-sql-editor).

Para registrar una base, abre **Catalog Explorer → Create a catalog → Lakebase Postgres → Autoscaling**, elige proyecto, branch y base. El catálogo registrado es de solo lectura y requiere cómputo serverless para explorarlo o consultarlo. La escritura continúa por la conexión Postgres. [Registrar en Unity Catalog](https://docs.databricks.com/aws/en/oltp/projects/register-uc).

## Dos recorridos que conviene separar

### 1. La aplicación produce el dato

Ejemplo ilustrativo: el backend valida un pedido y lo guarda en una tabla propia de Lakebase. Después necesitas consultar el estado actual o procesar sus cambios.

- **Estado actual para analítica:** Lakehouse//RT consultando Lakebase es el recorrido LTAP descrito para ello; está en **Private Preview** en la matriz AWS consultada.
- **Historial para procesos:** Lakebase Change Data Feed publica cambios de filas en tablas Delta de Unity Catalog. Puedes construir silver y gold desde ese historial. Es **Public Preview**; la documentación describe lotes aproximadamente cada 15 segundos, sin convertirlo en un SLA.

El CDF se configura desde **Branch overview → Lakebase CDF** y requiere `REPLICA IDENTITY FULL` en las tablas participantes. [Configurar Lakebase CDF](https://docs.databricks.com/aws/en/oltp/projects/lakebase-cdf).

### 2. El lakehouse prepara el dato para la aplicación

Ejemplo ilustrativo: un job calcula recomendaciones y publica una tabla gold. Una **synced table** sirve esos resultados en Lakebase para que el backend los busque por cliente. El lakehouse conserva la responsabilidad de producirlos.

Las synced tables crean una **copia administrada** y usan pipelines de sincronización; este recorrido no debe dibujarse como ausencia universal de copias. **LTAP Direct Writes**, opcional y en Beta, acelera cargas iniciales y refrescos completos escribiendo directamente al almacenamiento. No convierte todas las actualizaciones incrementales en cargas directas. Seleccionas la opción al crear la synced table. [Tablas sincronizadas y Direct Writes](https://docs.databricks.com/aws/en/oltp/projects/sync-tables).

## ¿Desaparecen ETL y ELT?

**Siguen haciendo falta cuando hay una transformación que el negocio necesita.** ETL transforma antes de cargar; ELT carga antes de transformar. Cambiar el acceso al dato operativo no elimina esa elección.

En nuestro ejemplo de pedidos, todavía alguien debe resolver:

- Deduplicación de clientes y validación de registros.
- Conversión de moneda y tratamiento de devoluciones.
- Cruces con campañas, ERP o fuentes externas.
- Métricas, histórico de negocio y datasets para modelos.

Estas son decisiones del diseño del ejemplo, no funciones que LTAP resuelva automáticamente. Lakebase CDF documenta expresamente su uso como entrada bronze para pipelines medallion. [CDF para ETL](https://docs.databricks.com/aws/en/oltp/projects/lakebase-cdf).

Para una base externa que permanece fuera de Lakebase, diseña su integración por separado. El anuncio de LTAP no permite quitar automáticamente su CDC, sus conectores o sus controles de calidad.

## ¿Desaparece el backend o se muda a Lakebase?

**Lakebase puede alojar el estado persistente; el código del servidor sigue necesitando un runtime.** Puedes ejecutar la aplicación en Databricks Apps o en infraestructura externa y conectarla a Lakebase. [Construir aplicaciones](https://docs.databricks.com/aws/en/oltp/projects/build-applications).

En una app de pedidos, el backend conserva autenticación, autorización de acciones, reglas de compra, idempotencia, integraciones y respuesta HTTP. Cambiar la base no implementa esas reglas.

| Componente | Responsabilidad en el ejemplo |
| --- | --- |
| Frontend | Capturar la compra y mostrar el resultado. |
| Backend en Apps o infraestructura externa | Validar la operación y coordinar servicios. |
| Lakebase | Persistir pedidos y atender transacciones Postgres. |
| Lakehouse | Preparar métricas, análisis y modelos. |

En **Databricks Apps**, agregar Lakebase como recurso permite persistir estado entre despliegues. El cómputo de la aplicación y el de la base son recursos distintos. [Apps con Lakebase](https://docs.databricks.com/aws/en/oltp/projects/databricks-apps), [recurso de base de datos](https://docs.databricks.com/aws/en/dev-tools/databricks-apps/lakebase).

Si partes de otra base, migrar datos, SQL, extensiones y conexiones es un proyecto que debes evaluar. La continuidad de conexión descrita por LTAP se refiere a aplicaciones **que ya usan Lakebase**.

## Casos de uso para evaluar

Los siguientes son ejemplos de diseño, no garantías de latencia:

| Caso | Recorrido propuesto | Qué mediría |
| --- | --- | --- |
| Pedidos e inventario | App escribe Lakebase; analítica observa ventas y stock. | Frescura, consistencia y latencia de la compra bajo carga. |
| Personalización | Lakehouse calcula recomendaciones; synced tables las sirven. | Retraso del refresco y tiempo de búsqueda por cliente. |
| Gestión de fraude | Scores preparados en el lakehouse y decisiones guardadas por la app. | Vigencia del score, trazabilidad y comportamiento ante fallos. |
| Herramienta de soporte | Backend combina perfil preparado con tickets operativos. | Permisos por usuario y coherencia entre ambos datos. |
| Agente con estado | App persiste sesiones y acciones; un proceso posterior analiza el historial. | Aislamiento de usuarios, retención y recuperación. |

## Disponibilidad: arquitectura y producto no tienen un único estado

| Capacidad en AWS, al 28-oct-2026 | Estado documentado |
| --- | --- |
| Registro de Lakebase en Unity Catalog | GA |
| Synced tables | GA |
| LTAP Direct Writes | Beta |
| Lakebase Change Data Feed | Public Preview |
| Lakehouse//RT **consultando Lakebase en vivo** | Private Preview |
| Lakehouse//RT como motor para tablas compatibles de Unity Catalog | Beta |

La [matriz LTAP](https://docs.databricks.com/aws/en/oltp/projects/ltap-overview) y la [guía de Lakehouse//RT](https://docs.databricks.com/aws/en/compute/sql-warehouse/real-time) describen alcances distintos. Habilitar RT no implica acceso automático a la preview de lectura en vivo de Lakebase. La guía general de RT tampoco incluye hoy Genie o Genie Agents entre las superficies soportadas.

También hay dos rutas de permisos: **Unity Catalog para el acceso analítico registrado** y **roles Postgres para conexiones directas**. Registra y prueba ambas. [Permisos de acceso](https://docs.databricks.com/aws/en/oltp/projects/register-uc).

## Cómo plantearía una PoC

Elegiría una operación y una pregunta: «registrar pedido» y «ver pedidos por región». Definiría el propietario de escritura de cada tabla y confirmaría con el equipo de cuenta el recorrido disponible. Después mediría latencia p95 de la app, frescura analítica, calidad del resultado y coste total de app, base, consultas y sincronización.

Para una PoC sin acceso a la preview de lectura en vivo, probaría CDF si está habilitado, dejando claro que evalúa un flujo de cambios. Añadiría recomendaciones mediante synced tables como segundo recorrido. Así se comprueba qué puente se simplifica y qué trabajo de aplicación y datos sigue siendo necesario.

Puedes continuar con [Genie: One, Agents y Code](/es/blog/databricks-genie-explained/) y compartir tu experiencia en [Data Wizard](https://www.datawizard.tech/).

*Infografía original de Daniel DataShow. Flechas conceptuales: no representan una única transacción distribuida ni una promesa de latencia. Fuentes y generador reproducible en `scripts/blog/ltap/`.*

*Logos e iconos obtenidos de las fuentes oficiales de [Databricks](https://www.databricks.com/company/newsroom/press-kit), [PostgreSQL](https://wiki.postgresql.org/wiki/Logo), [Python](https://www.python.org/community/logos/) y [Node.js](https://nodejs.org/en/about/branding). Python y Node.js aparecen como ejemplos de tecnologías backend; Node.js es un runtime de JavaScript.*
