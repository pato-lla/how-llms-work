# Propuesta técnica: i18n, tema claro/oscuro y Mermaid

## Objetivo

Convertir el sitio en una experiencia más accesible para ti sin romper el diseño actual:

- Soporte multidioma con selector de idioma.
- Traducción inicial `en` y `es`, preparada para crecer a más idiomas.
- Selector de tema `light / dark` con persistencia.
- Revisión del diagrama Mermaid para que se renderice de forma fiel y consistente.

La idea es hacer cambios pequeños y estructurados, evitando una reescritura completa del sitio.

---

## Diagnóstico rápido del proyecto

El repositorio tiene una arquitectura muy simple:

- HTML estático por página/sección.
- JS propio para interacción y animaciones.
- CSS global por página.

Las piezas más relevantes para este trabajo son:

- [`index.html`](/Users/patocl/_Proyects/personal/how-llms-work/index.html)
- [`how-to-use-llms/index.html`](/Users/patocl/_Proyects/personal/how-llms-work/how-to-use-llms/index.html)
- [`neural-networks/index.html`](/Users/patocl/_Proyects/personal/how-llms-work/neural-networks/index.html)

### Inventario real de superficies

No conviene tratar este repo como una sola página. Hay varias superficies distintas:

- `index.html`: primera parte / landing principal del sitio.
- `how-to-use-llms/`: segunda parte, la guía práctica más larga.
- `neural-networks/`: tercera parte, explicación de redes neuronales.
- `v1.html`: versión anterior o legacy.
- `report.html` y `council_report.md`: artefactos de verificación y reporte.
- `docs/`: documentación del plan y, si queremos, futuros materiales de soporte.

Conclusión: el plan sí puede cubrir el sitio completo, pero la implementación debe hacerse por superficies, no como si todo viviera en una sola app.

La página más clara para empezar la expansión funcional es `how-to-use-llms`, porque ya tiene bastante contenido, navegación interna y un bloque Mermaid que puede servir como piloto.

---

## Decisiones de arquitectura

### 1) i18n basada en catálogos de traducción

Para no meter el texto traducido directamente en el HTML, propongo moverlo a catálogos tipo JSON.

Ejemplo de estructura:

```text
docs/
locales/
  en/
    how-to-use-llms.json
    index.json
  es/
    how-to-use-llms.json
    index.json
src/
  i18n.js
```

Ventajas:

- El HTML queda limpio.
- El idioma se puede cambiar sin recargar toda la lógica.
- Añadir un tercer idioma después es solo crear otro catálogo.
- Se puede reutilizar el mismo sistema en las tres páginas del sitio.

### 2) Marcado por claves, no por texto suelto

En el HTML, cada nodo traducible debería llevar una clave estable, por ejemplo:

```html
<h1 data-i18n="hero.title"></h1>
<p data-i18n="hero.subtitle"></p>
```

Para contenido con negritas, enlaces o formato complejo, usaría una variante:

```html
<p data-i18n-html="sections.intro.body1"></p>
```

Así evitamos interpolar HTML a mano por todos lados.

### 3) Selector de idioma en la navegación

El selector debería vivir en el nav superior y guardar la preferencia en `localStorage`.

Orden de decisión del idioma:

1. Preferencia guardada por el usuario.
2. Idioma del navegador.
3. Fallback a inglés.

### 4) Tema claro/oscuro con variables CSS

La forma menos invasiva es mantener el diseño actual y cambiar solo variables:

- `data-theme="light"`
- `data-theme="dark"`

Con esto, colores, fondos, bordes, sombras y estados pueden cambiar sin tocar el layout.

También conviene respetar:

- `prefers-color-scheme`
- la preferencia persistida por usuario

### 5) Mermaid con tema sincronizado

Para Mermaid hay dos objetivos:

- Que el diagrama se vea bien en light y dark.
- Que el render no dependa de estilos inconsistentes o de un init parcial.

La propuesta es:

- Inicializar Mermaid una sola vez con tema dinámico.
- Re-renderizar cuando cambie el tema.
- Definir `themeVariables` para que colores y líneas coincidan con la identidad visual del sitio.

Si el diagrama actual está escrito de forma frágil, lo mejor es:

- simplificarlo,
- validar la sintaxis Mermaid,
- y, si hace falta, dividirlo en diagramas más pequeños.

---

## Propuesta funcional

### A. Internacionalización

#### Alcance

- Traducir contenido visible de navegación, hero, secciones, botones, badges, mensajes, labels y ctas.
- Mantener nombres de producto, modelos y marcas en su forma original cuando tenga sentido.
- Adaptar textos para que el español suene natural, no literal.

#### Componentes necesarios

- Un helper `i18n.js` que:
  - cargue catálogos,
  - devuelva traducciones por clave,
  - actualice nodos con `data-i18n`,
  - actualice nodos con `data-i18n-html`.
- Un selector de idioma en cada página o en el layout común.
- Persistencia de preferencia.

#### Estrategia de traducción

No traduciría todo al mismo tiempo si el sitio es muy grande. Haría esto:

1. Traducir el shell compartido.
2. Traducir `how-to-use-llms`.
3. Traducir `index.html`.
4. Traducir `neural-networks`.

Eso reduce riesgo y permite revisar calidad por bloque.

### B. Tema claro/oscuro

#### Alcance

- Añadir toggle visible en la navegación.
- Definir dos sets de variables.
- Ajustar fondos, cards, bordes, textos secundarios, highlights y sombras.

#### Reglas de diseño

- No cambiar spacing ni layout salvo que el contraste lo exija.
- Mantener el carácter visual actual.
- Evitar que el dark mode se vea simplemente como “invertido”.

#### Persistencia

- Guardar tema en `localStorage`.
- Respetar la preferencia del sistema si no hay selección previa.

### C. Mermaid

#### Problema probable

Si un diagrama no se renderiza fielmente, suele venir de una de estas causas:

- sintaxis Mermaid demasiado compleja,
- estilos CSS que interfieren,
- falta de inicialización específica por tema,
- labels demasiado largos para el layout,
- o una combinación de todo lo anterior.

#### Solución propuesta

- Verificar qué versión de Mermaid se está usando.
- Alinear el tema del diagrama con el tema global.
- Reducir el diagrama a nodos y enlaces claros.
- Si el diagrama es muy ancho, dividirlo o usar otro tipo de layout.

#### Criterio de éxito

- Se ve igual de legible en light y dark.
- No se rompe al cambiar idioma.
- No depende de hacks visuales en CSS.

---

## Orden de implementación recomendado

### Fase 1: base técnica

- Crear helpers comunes.
- Añadir detección de idioma y tema.
- Añadir persistencia.
- Preparar el nav para ambos toggles.

Primera prioridad:

- `how-to-use-llms`

Segunda prioridad:

- `index.html`
- `neural-networks`

Tercera prioridad:

- `v1.html` solo si quieres mantenerla alineada.
- `report.html` y artefactos de verificación solo si quieres presentarlos al usuario final.

### Fase 2: i18n de `how-to-use-llms`

- Extraer strings.
- Crear `en` y `es`.
- Traducir y revisar la versión española.
- Verificar que el diseño no se desajusta con textos más largos.

### Fase 3: tema

- Completar variables CSS.
- Probar contraste.
- Ajustar componentes delicados: badges, cards, code blocks, enlaces y paneles.

### Fase 4: Mermaid

- Revisar el diagrama problemático.
- Corregir sintaxis y layout.
- Sincronizar con tema global.

### Fase 5: extender al resto del sitio

- Repetir el patrón en `index.html`.
- Repetir el patrón en `neural-networks`.
- Unificar comportamiento en todo el sitio.

---

## Riesgos y cómo los mitigaría

### Texto traducido más largo

Riesgo:

- El español suele ocupar más espacio que el inglés.

Mitigación:

- Probar especialmente títulos, chips, badges, botones y navegación.
- Permitir saltos controlados y `min/max-width` donde haga falta.

### HTML con contenido rico

Riesgo:

- Algunas frases usan énfasis, links o pequeñas piezas HTML.

Mitigación:

- Separar `data-i18n` de `data-i18n-html`.
- Mantener los snippets complejos en claves específicas.

### Mermaid inconsistente

Riesgo:

- Un render bonito en un tema puede romperse en el otro.

Mitigación:

- Definir tokens de color para Mermaid.
- Re-render explícito al cambiar tema.
- Simplificar el grafo si hace falta.

---

## Resultado esperado

Al terminar, el sitio debería tener:

- selector de idioma funcional,
- versión española natural y usable,
- tema claro y oscuro sin romper el diseño,
- Mermaid consistente,
- base escalable para añadir más idiomas más adelante.

---

## Siguiente paso sugerido

Si te parece bien esta dirección, el siguiente paso práctico sería:

1. Definir la estructura exacta de archivos para i18n.
2. Implementar el sistema en `how-to-use-llms` como piloto.
3. Replicar la solución al resto del sitio.
