---
title: 'Guía de estilo Markdown'
description: 'Ejemplos de sintaxis básica de Markdown que puedes usar al escribir contenido en Astro.'
pubDate: 'Jun 19 2024'
heroImage: '../../../assets/blog-placeholder-2.jpg'
---

Aquí tienes una muestra de sintaxis básica de Markdown que puedes usar al escribir contenido en Astro.

## Encabezados

Los siguientes elementos HTML `<h1>`—`<h6>` representan seis niveles de encabezados. `<h1>` es el nivel más alto y `<h6>` el más bajo.

# H1

## H2

### H3

#### H4

##### H5

###### H6

## Párrafo

Xerum, quo qui aut unt expliquam qui dolut labo. Aque venitatiusda cum, voluptionse latur sitiae dolessi aut parist aut dollo enim qui voluptate ma dolestendit peritin re plis aut quas inctum laceat est volestemque commosa as cus endigna tectur, offic to cor sequas etum rerum idem sintibus eiur? Quianimin porecus evelectur, cum que nis nust voloribus ratem aut omnimi, sitatur? Quiatem. Nam, omnis sum am facea corem alique molestrunt et eos evelece arcillit ut aut eos eos nus, sin conecerem erum fuga. Ri oditatquam, ad quibus unda veliamenimin cusam et facea ipsamus es exerum sitate dolores editium rerore eost, temped molorro ratiae volorro te reribus dolorer sperchicium faceata tiustia prat.

Itatur? Quiatae cullecum rem ent aut odis in re eossequodi nonsequ idebis ne sapicia is sinveli squiatum, core et que aut hariosam ex eat.

## Imágenes

### Sintaxis

```markdown
![Texto alternativo](./ruta/absoluta/o/relativa/de/imagen)
```

### Resultado

![blog placeholder](../../../assets/blog-placeholder-about.jpg)

## Citas

El elemento blockquote representa contenido citado de otra fuente, opcionalmente con una cita dentro de un elemento `footer` o `cite`, y opcionalmente con cambios en línea como anotaciones y abreviaturas.

### Cita sin atribución

#### Sintaxis

```markdown
> Tiam, ad mint andaepu dandae nostion secatur sequo quae.  
> **Nota** que puedes usar _Markdown_ dentro de una cita.
```

#### Resultado

> Tiam, ad mint andaepu dandae nostion secatur sequo quae.  
> **Nota** que puedes usar _Markdown_ dentro de una cita.

### Cita con atribución

#### Sintaxis

```markdown
> Don't communicate by sharing memory, share memory by communicating.<br>
> — <cite>Rob Pike[^1]</cite>
```

#### Resultado

> Don't communicate by sharing memory, share memory by communicating.<br>
> — <cite>Rob Pike[^1]</cite>

[^1]: La cita anterior es un extracto de la [charla](https://www.youtube.com/watch?v=PAAkCSZUG1c) de Rob Pike durante Gopherfest, 18 de noviembre de 2015.

## Tablas

### Sintaxis

```markdown
| Cursiva   | Negrita | Código |
| --------- | ------- | ------ |
| _cursiva_ | **bold** | `code` |
```

### Resultado

| Cursiva   | Negrita | Código |
| --------- | ------- | ------ |
| _cursiva_ | **bold** | `code` |

## Bloques de código

### Sintaxis

Podemos usar 3 backticks ``` en una nueva línea para abrir el bloque y 3 backticks para cerrar. Para resaltar sintaxis de un lenguaje, escribe el nombre del lenguaje después de los primeros 3 backticks, por ejemplo: html, javascript, css, markdown, typescript, txt, bash.

````markdown
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Example HTML5 Document</title>
  </head>
  <body>
    <p>Test</p>
  </body>
</html>
```
````

### Resultado

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Example HTML5 Document</title>
  </head>
  <body>
    <p>Test</p>
  </body>
</html>
```

## Tipos de listas

### Lista ordenada

#### Sintaxis

```markdown
1. Primer elemento
2. Segundo elemento
3. Tercer elemento
```

#### Resultado

1. Primer elemento
2. Segundo elemento
3. Tercer elemento

### Lista desordenada

#### Sintaxis

```markdown
- Elemento de lista
- Otro elemento
- Y otro más
```

#### Resultado

- Elemento de lista
- Otro elemento
- Y otro más

### Lista anidada

#### Sintaxis

```markdown
- Fruta
  - Manzana
  - Naranja
  - Banana
- Lácteos
  - Leche
  - Queso
```

#### Resultado

- Fruta
  - Manzana
  - Naranja
  - Banana
- Lácteos
  - Leche
  - Queso

## Otros elementos — abbr, sub, sup, kbd, mark

### Sintaxis

```markdown
<abbr title="Graphics Interchange Format">GIF</abbr> es un formato de imagen bitmap.

H<sub>2</sub>O

X<sup>n</sup> + Y<sup>n</sup> = Z<sup>n</sup>

Presiona <kbd>CTRL</kbd> + <kbd>ALT</kbd> + <kbd>Delete</kbd> para finalizar la sesión.

La mayoría de las <mark>salamandras</mark> son nocturnas y cazan insectos, lombrices y otras criaturas pequeñas.
```

### Resultado

<abbr title="Graphics Interchange Format">GIF</abbr> es un formato de imagen bitmap.

H<sub>2</sub>O

X<sup>n</sup> + Y<sup>n</sup> = Z<sup>n</sup>

Presiona <kbd>CTRL</kbd> + <kbd>ALT</kbd> + <kbd>Delete</kbd> para finalizar la sesión.

La mayoría de las <mark>salamandras</mark> son nocturnas y cazan insectos, lombrices y otras criaturas pequeñas.
