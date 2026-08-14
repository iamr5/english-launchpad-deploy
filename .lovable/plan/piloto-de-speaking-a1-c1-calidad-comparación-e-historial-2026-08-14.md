# Piloto de Speaking A1–C1: calidad, comparación e historial

## Objetivo
Convertir Speaking en un laboratorio de calidad oculto: no aparecerá en la ruta ni para alumnos normales. Solo se mostrará después de activar funciones debug y pulsar un nuevo control **Activar Speaking**.

Cada intento se grabará una sola vez y se evaluará en paralelo con reconocimiento local y con IA, mostrando claramente cuánto mejora la transcripción y la calificación. El alumno podrá escucharse, comparar con el modelo y reintentar hasta aprobar.

## Experiencia del piloto

1. Mantener Speaking fuera de la ruta de aprendizaje y ocultarlo también de Práctica por defecto.
2. Al tocar 7 veces el fondo, mostrar los controles debug actuales y un botón adicional para activar/desactivar Speaking.
3. Tras activarlo, mostrar la biblioteca de Speaking por niveles A1, A2, B1, B2 y C1, sin cargar el banco completo.
4. Antes del primer ejercicio, mostrar una pantalla previa que explique el uso del micrófono. El navegador pedirá permiso solo después de que el usuario pulse **Permitir micrófono**.
5. Diferenciar los estados de permiso: pendiente, permitido, denegado y micrófono no disponible. Nunca calificar con 0% una grabación que no comenzó.
6. En cada intento:
   - escuchar la pronunciación modelo;
   - grabar y ver un estado claro de escucha;
   - detener y reproducir la propia grabación;
   - ejecutar reconocimiento local e IA en paralelo sobre el mismo intento;
   - ver ambas transcripciones y sus diferencias;
   - resaltar palabra por palabra lo correcto, omitido, sustituido o añadido;
   - recibir feedback de pronunciación, fluidez y gramática;
   - escuchar nuevamente el modelo y la propia voz antes de reintentar.
7. Si no aprueba, mantener el mismo ejercicio y ofrecer **Reintentar** como acción principal. **Continuar** solo se habilita al aprobar; en debug habrá una acción secundaria explícita para saltar.
8. Registrar cada intento, no solo el resultado final: fecha, nivel, ejercicio, número de intento, duración, transcripción local, transcripción IA, diferencias, puntajes, palabras problemáticas y resultado.
9. Añadir un historial del piloto por nivel y ejercicio, con reproducción del audio guardado y evolución entre intentos.

## Banco de contenido

Crear un banco inicial de **2.500 ejercicios**, 500 por nivel A1–C1, repartidos entre:

- repetición controlada;
- lectura en voz alta;
- respuesta guiada;
- situaciones y diálogos;
- habla libre;
- inglés general y una proporción de inglés para ingeniería.

Cada ítem tendrá objetivo MCER, habilidad, vocabulario/gramática esperados, variantes aceptables, criterios de aprobación, pistas de pronunciación y metadatos para evitar repeticiones. Se validarán IDs únicos, campos obligatorios, distribución por nivel/modo, duplicados y dificultad. El contenido seguirá sirviéndose por nivel y bajo demanda para no afectar la carga del demo.

## Evaluación y calidad

- Capturar WAV completo desde el inicio únicamente después del permiso.
- Lanzar simultáneamente el reconocimiento del navegador y la grabación que se envía al evaluador IA.
- Usar todas las alternativas que entrega el reconocimiento local y una comparación tolerante a contracciones, puntuación y pequeñas variaciones válidas.
- Para frases objetivo, calcular alineación de palabras en vez del conteo simple actual; mostrar omisiones, sustituciones y palabras extra.
- Para respuestas abiertas, evaluar contra instrucciones y criterios del nivel, no contra una única frase literal.
- No afirmar que una palabra fue “mal pronunciada” solo por una transcripción distinta: marcarla como **palabra para revisar** y usar señales comparativas de ambos motores.
- Mantener visibles los dos resultados en debug: **Local** e **IA**, diferencia de transcripción, diferencia de aprobación y latencia de cada motor.
- Añadir métricas agregadas de concordancia para decidir más adelante qué ejercicios realmente necesitan IA.

## Historial, audio y privacidad

- Crear una tabla de intentos vinculada a la cuenta del alumno, protegida para que cada usuario solo acceda a sus propios datos.
- Crear almacenamiento privado para los WAV; entregar enlaces temporales únicamente al propietario.
- Guardar el audio durante **30 días por defecto**, permitir borrarlo desde el historial y conservar después solo las métricas/texto. Esta retención quedará centralizada para poder cambiarla.
- Si el tester no inició sesión, permitir probar la interfaz pero explicar que el intento no se guardará en la cuenta.
- No reutilizar el almacenamiento general de marca ni exponer URLs públicas.

## Costos y controles

Como el modo elegido ejecuta IA en **todos** los intentos, cada reintento genera una nueva transcripción y evaluación. Se añadirá:

- conteo de uso y costo estimado por intento/sesión/usuario;
- duración y tamaño de audio para medir el costo real;
- límites configurables de duración y consumo diario para evitar abuso;
- errores explícitos por falta de créditos o límite, sin convertirlos en una aprobación;
- medición comparativa local vs. IA para decidir, con datos reales, dónde la IA agrega suficiente calidad.

La cifra final de costo no se prometerá antes de medir: el piloto registrará consumo real del gateway y permitirá calcular costo por 100 intentos y por alumno activo.

## Cambios técnicos

- Extender la configuración del demo con una bandera `speaking`, desactivada por defecto, y conectarla al nuevo botón debug.
- Mantener el índice liviano en el bundle y cargar ejercicios por nivel desde `/api/course/speaking`.
- Rehacer el flujo de grabación/evaluación para que permiso, captura, reproducción, comparación y reintento sean estados explícitos.
- Ampliar la respuesta del evaluador para devolver criterios y feedback estructurado, y separar transcripción de inferencias de pronunciación.
- Añadir endpoints autenticados para crear/listar/borrar intentos y reproducir audio privado.
- Crear tabla, permisos, políticas por usuario y bucket privado para el historial.
- Añadir validadores y pruebas del banco de 2.500 ítems, comparación de palabras, permisos, reintentos, errores y persistencia.

## Validación

- Verificar que Speaking no aparece en la ruta ni en Práctica sin debug.
- Verificar activación/desactivación desde el nuevo control debug y persistencia solo durante la sesión de prueba.
- Probar permiso pendiente, permitido, denegado y dispositivo sin micrófono.
- Probar el mismo audio con ambos motores y confirmar que se muestran ambos resultados.
- Confirmar que un fallo obliga a reintentar y que un éxito permite avanzar.
- Confirmar reproducción del modelo y del audio propio antes y después de guardar.
- Confirmar historial privado, borrado y acceso únicamente del propietario.
- Validar carga rápida con 2.500 ejercicios y pruebas responsive en escritorio y móvil.
