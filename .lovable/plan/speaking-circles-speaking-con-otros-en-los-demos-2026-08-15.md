# Speaking Circles ("Speaking con otros") en los demos

Maqueta navegable del speaking grupal, siguiendo el documento de investigación. Todo simulado: compañeros, disponibilidad y sesión son ficticios, sin audio real ni base de datos. Se activa y desactiva desde el modo debug, igual que el Speaking individual.

## Activación

- Nuevo botón flotante de debug **Círculos** (junto al de Speaking), visible solo tras los 7 toques que ya muestran el modo debug.
- Bandera `DEBUG_CIRCLES`, apagada por defecto. Al apagar el modo debug también se apaga y desaparece todo rastro en la interfaz.
- Sin activarlo, ni Práctica ni Inicio muestran nada nuevo.

## Dentro de Práctica

Debajo de la estantería de Speaking individual, una tarjeta:

```text
Speaking con otros
Practica conversaciones reales con alumnos de un nivel parecido al tuyo.
3 alumnos B1 disponibles ahora
[ Practicar ahora ]  [ Programar práctica ]
```

El nivel mostrado sale del nivel del alumno en el demo; la disponibilidad es simulada y varía para que se sienta viva.

## Primer uso (onboarding, 3 pasos)

1. Qué es: sesiones cortas, actividades guiadas, horarios flexibles, sin profesor.
2. Disponibilidad: días (L–D) y momentos (mañana/tarde/noche).
3. Intereses opcionales, con "Cualquier tema".

No se pregunta el nivel: se muestra "Te agruparemos con alumnos B1" con un enlace "¿por qué?". Las respuestas se guardan localmente en el demo.

## Landing de Speaking con otros

- **Practicar ahora** y **Programar práctica** como acciones principales.
- **Próximas prácticas** con las sesiones agendadas.
- **Mi círculo**: 8–12 miembros simulados de nivel similar, cuántos quieren practicar esta semana, chat de círculo simulado (mensajes de ejemplo, se puede escribir y aparecen respuestas guionadas).
- **Historial** de prácticas anteriores con minutos acumulados.

## Camino "Practicar ahora"

Pantalla de búsqueda con contador "2 de 3 encontrados", y dos desenlaces:

- Se llega al cupo → sala de sesión.
- No hay gente → "ya te anotamos como disponible", con salida a Speaking individual (nunca un callejón sin salida).

## Camino "Programar"

Primero horarios sugeridos con número de interesados ("Hoy 8:00 p. m. · 2 interesados"), y solo después "Proponer otro horario". Al confirmar aparece en Próximas prácticas y en Inicio.

## Sala de práctica (simulada)

- Participantes con avatares de mascota, micrófono obligatorio / cámara opcional (indicadores, sin captura real).
- **Misión** de la sesión: objetivo comunicativo, frases útiles y rondas con temporizador.
- Turnos sugeridos con señales suaves ("Suggested speaker: Andrea", "Jorge hasn't spoken much yet"), nunca bloqueo de micrófono.
- Menú "•••" con Reportar / Bloquear / Silenciar / Salir siempre a un toque.
- Las intervenciones de los compañeros son guionadas; el reloj y las rondas avanzan solos.

## Cierre de sesión

Minutos practicados, funciones comunicativas trabajadas, valoración con caritas, "¿practicarías con este grupo?" y salida a la próxima oportunidad. Suma los minutos al total del mes en el historial.

## Tarjetas en Inicio

- Si hay sesión próxima: "Tu próxima práctica · Hoy 8:30 p. m. · [Ver]".
- Si hay gente disponible: "3 personas de tu nivel quieren practicar ahora · [Unirme]".
- Si no hay nada relevante, no se muestra tarjeta.

## Lo que no se hace

Ni matching real, ni presencia entre usuarios, ni audio/video en vivo, ni tablas nuevas ni notificaciones. Es la maqueta del flujo, del mismo tipo que el resto del demo.

## Detalles técnicos

- Todo en `src/assets/demo-app.html`: nueva bandera `DEBUG_CIRCLES` junto a `DEBUG_SPEAKING`, botón `.debug-fab.circles`, y funciones `circlesShelfHTML()`, `openCircles()`, `circlesOnboarding()`, `circlesMatching()`, `circlesRoom()`, `circlesRecap()`.
- Estado simulado (perfil de disponibilidad, círculo, sesiones agendadas, historial) en `localStorage` bajo una clave propia, borrable con el botón de reset de debug.
- Nombres, temas y guiones de conversación en una tabla de datos dentro del mismo archivo, por nivel A1–C1.
- Las tarjetas de Inicio se pintan en el render existente de la ruta, condicionadas a `DEBUG_CIRCLES`.
- Se reutilizan estilos ya existentes (`.sp-*`, `.pr-*`, hojas/overlay) más un bloque `.sc-*` nuevo; sin cambios de backend.
