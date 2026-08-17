# Feedback del sílabo: aplicar a /silabo-autonoma, /silabo-autonoma-1 y /silabo-cip

Los tres dosieres comparten estructura, así que cada cambio se aplica en los tres (en /silabo-cip con el copy institucional del Colegio de Ingenieros: colegiados, capítulos, área de capacitación).

## 1. Arranque con el dato de la práctica fuera del aula

El documento abre hoy con la propuesta de plataforma. Se añade antes un bloque corto de apertura con la idea que pidió el feedback: la práctica fuera del aula es lo que hace que las competencias se desarrollen y se mantengan.

La cifra irá con **fuente real citada al pie**. Antes de escribirla se busca y verifica un estudio publicado sobre práctica autónoma / tiempo de exposición fuera de clase. Si la evidencia no respalda un ~60%, se usa la cifra real del estudio y se ajusta la frase; no se publica un porcentaje sin respaldo.

## 2. Encuadre: complemento, no reemplazo

Se refuerza en portada y en el bloque de oportunidad que esto es **una herramienta digital para practicar y sostener el desarrollo de las competencias del área de idiomas de la universidad**, no un sustituto de la clase ni del docente. Misma idea, en una línea, en el cierre.

## 3. Cambridge por delante

En la sección de correspondencia con exámenes internacionales, el formato Cambridge deja de aparecer como nota al pie y pasa al titular/entradilla: el contenido se practica **en formato Cambridge**, con la correspondencia MCER como marco. Se mantiene la aclaración de que la certificación oficial la dan las instancias acreditadas.

## 4. Nivel A1 sin redacción en negativo

Las descripciones del tipo "Sin examen de referencia" se reescriben en positivo (por ejemplo: "Base previa a los exámenes Cambridge; prepara el terreno para KET/A2 Key").

## 5. Los cuatro formatos, mostrados y no solo contados

Hoy son cuatro tarjetas de texto con un número. Se convierten en tarjetas con una **maqueta esquemática en HTML/CSS de cada formato** (opción múltiple con sus alternativas, detección de error con la palabra marcada, escucha y reconstrucción con las fichas de palabras, producción escrita con el campo de respuesta), para que se vea de qué se trata cada ejercicio. Sin capturas ni iframes: peso cero añadido.

## 6. Volumen con más peso visual y ligado a la práctica

La banda de "volumen total" se rehace para que la cifra de 8 127 ejercicios sea el elemento dominante y se lea junto al mensaje de práctica sostenida, en vez de repetir los mismos cuatro números que ya están arriba.

## 7. Secciones que se quitan

- **07 · Valor para la universidad** ("Una misma herramienta, tres impactos distintos"): la sección 08 explica lo mismo mejor. La frase de cierre de 07 ("El producto no es otra plataforma de inglés…") se conserva reubicada en 08 para no perderla.
- **La ruta de lanzamiento de 4 pasos** del cierre (Alineamiento / Identidad / Activación / Lanzamiento): se elimina y el cierre queda con el titular, el párrafo y la línea final.

Se renumeran los rótulos de sección posteriores.

## Detalle técnico

- Archivos: `src/assets/silabo-autonoma.html`, `src/assets/silabo-autonoma-1.html`, `src/assets/silabo-cip.html`. Sin cambios en las rutas salvo ajustar la descripción social si cambia una cifra.
- Las maquetas de formato son CSS puro dentro del `<style>` existente, con estilos de impresión para que no se rompan al exportar a PDF.
- Verificación en navegador headless de las tres rutas: capturas de la apertura, la sección de formatos y el cierre, en escritorio y móvil, comprobando que los demos embebidos siguen cargando al hacer scroll.
