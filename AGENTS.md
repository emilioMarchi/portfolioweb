## Directrices para el Agente OpenCode (Context 7 Integration)

Este documento establece las reglas y mejores prácticas para el uso de Context 7 por parte del agente OpenCode, asegurando que siempre se utilice documentación actualizada y relevante.

### 1. Uso Prioritario de Context 7 para Documentación

Siempre que sea necesario consultar documentación sobre librerías, frameworks, APIs o cualquier tema de programación, la primera fuente a utilizar es Context 7. Esto incluye, pero no se limita a:

*   **Configuración de librerías:** Cómo instalar, configurar o inicializar una librería.
*   **Ejemplos de código:** Sintaxis, patrones de uso, casos de uso específicos.
*   **Solución de errores:** Información sobre errores comunes y sus soluciones.
*   **Actualizaciones:** Novedades sobre versiones o cambios en la API.
*   **Patrones de diseño:** Cómo implementar patrones específicos con una librería.

**Ejemplos de uso en prompts:**
*   `use context7 to show me how to set up middleware in Next.js 15 App Router`
*   `use context7 for Prisma query examples with relations`
*   `use context7 for the Supabase syntax for row-level security`
*   `use context7 with /supabase/supabase for authentication docs`
*   `use context7 with /vercel/next.js for app router setup`

### 2. Flujo de Trabajo para el Agente

Cuando se requiera información de documentación:

1.  **Resolución de ID (si es necesario):** Si no se conoce el `libraryId` exacto, se debe usar la herramienta `context7_resolve-library-id` para obtenerlo.
    *   `default_api.context7_resolve-library-id(libraryName="<nombre_libreria>", query="<tu_pregunta>")`
2.  **Consulta de Documentación:** Una vez obtenido el `libraryId`, se usa la herramienta `context7_query-docs` para obtener la información específica.
    *   `default_api.context7_query-docs(libraryId="<library_id_obtenido>", query="<tu_pregunta_específica>")`
3.  **Análisis y Aplicación:** Analizar la información y los snippets de código devueltos por Context 7 para aplicarlos de manera idiomática y correcta al proyecto.

### 3. Evitar Información Desactualizada

Context 7 debe ser el método preferido para obtener información actualizada, minimizando la dependencia en los datos de entrenamiento del modelo principal, que pueden no estar al día con las últimas versiones de librerías o frameworks.
