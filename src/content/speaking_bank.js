// SPEAKING_BANK — la parte hablada del curso, A1 → C1.
//
// Va aparte del curso por lo mismo que el banco de práctica: no engorda la
// lección y se sirve bajo demanda (/api/course/speaking?ids=modulo-1).
//
// Cada ítem es un ejercicio de hablar. Tres modos, y el modo decide el coste:
//
//   repeat — repetir la frase modelo. Se corrige EN EL NAVEGADOR comparando
//            palabra por palabra con `target`. Coste cero.
//   read   — leer en voz alta un texto algo más largo. También local.
//   free   — respuesta libre. No hay frase objetivo: la evalúa la IA
//            (transcribe + puntúa pronunciación, fluidez y gramática).
//
// Campos:
//   id      único en todo el banco
//   mode    'repeat' | 'read' | 'free'
//   level   A1…C1 (informativo, para la ficha)
//   prompt  el enunciado en español
//   target  la frase en inglés que hay que decir (repeat/read)
//   task    lo que se le pide decir (free), en inglés, para el evaluador
//   hint    ayuda corta bajo el micrófono
//   minWords  mínimo razonable de palabras en las respuestas libres

const rep = (id, level, prompt, target, hint) => ({ id, mode: 'repeat', level, prompt, target, hint });
const read = (id, level, prompt, target, hint) => ({ id, mode: 'read', level, prompt, target, hint });
const free = (id, level, prompt, task, minWords, hint) => ({ id, mode: 'free', level, prompt, task, minWords: minWords || 12, hint });

const SPEAKING_BANK = {
  'modulo-1': [
    rep('sp-a1-1', 'A1', 'Preséntate. Di:', 'Hello, my name is Ana and I am an engineer.', 'La “h” de hello suena; la “i” de is es corta.'),
    rep('sp-a1-2', 'A1', 'Di de dónde eres:', 'I am from Peru and I live in Lima.', 'Peru se dice /peˈruː/, con la fuerza al final.'),
    rep('sp-a1-3', 'A1', 'Saluda a alguien nuevo:', 'Nice to meet you. How are you today?', 'Une “nice to” como si fuera una sola palabra.'),
    rep('sp-a1-4', 'A1', 'Habla de tu trabajo:', 'I work in a construction company.', 'Work suena /wɜːrk/, no “guork”.'),
    rep('sp-a1-5', 'A1', 'Di la hora a la que empiezas:', 'I start work at eight in the morning.', 'La “t” final de start casi se pierde delante de work.'),
    rep('sp-a1-6', 'A1', 'Habla de tu familia:', 'I have two brothers and one sister.', 'Brothers lleva la “th” suave, con la lengua entre los dientes.'),
    read('sp-a1-7', 'A1', 'Lee esto en voz alta:', 'My name is Carlos. I am thirty years old. I live in Arequipa with my family. I work as a civil engineer.', 'Sin prisa: mejor lento y claro que rápido y comido.'),
    read('sp-a1-8', 'A1', 'Lee esta rutina en voz alta:', 'Every day I wake up at six. I have breakfast, and then I go to the office by bus.', 'Marca la pausa en cada coma.'),
    free('sp-a1-9', 'A1', 'Cuéntanos quién eres, en inglés (unos 15 segundos):', 'Introduce yourself: name, city, job and one thing you like.', 10, 'Nombre, ciudad, trabajo y algo que te guste.'),
    free('sp-a1-10', 'A1', 'Describe tu día normal:', 'Describe your daily routine using the present simple.', 12, 'Usa I wake up… I go… I have…'),
  ],
  'modulo-2': [
    rep('sp-a2-1', 'A2', 'Cuenta qué hiciste ayer:', 'Yesterday I visited the site and checked the materials.', 'La “-ed” de visited suena /ɪd/: vi-si-ted.'),
    rep('sp-a2-2', 'A2', 'Habla de tus planes:', 'Next week I am going to travel to Cusco for work.', '“Going to” se dice rápido, casi “gonna”, pero pronúncialo entero.'),
    rep('sp-a2-3', 'A2', 'Compara dos cosas:', 'This machine is faster and cheaper than the old one.', 'Than suena flojo, sin fuerza.'),
    rep('sp-a2-4', 'A2', 'Pide algo con educación:', 'Could you send me the report before Friday, please?', 'Could you se une: /kʊdʒə/.'),
    rep('sp-a2-5', 'A2', 'Di lo que estás haciendo ahora:', 'I am working on the new project this month.', 'Working lleva la “-ing” nasal, sin “g” dura al final.'),
    read('sp-a2-6', 'A2', 'Lee este correo en voz alta:', 'Hi Peter, thanks for your email. I checked the drawings and I found two mistakes. Can we talk tomorrow at ten?', 'Sube un poco el tono al final de la pregunta.'),
    read('sp-a2-7', 'A2', 'Lee este aviso en voz alta:', 'Please wear your helmet at all times. Do not enter the area without permission.', 'Tono firme, es una instrucción de seguridad.'),
    free('sp-a2-8', 'A2', 'Cuenta un viaje que hiciste:', 'Talk about a trip you took: where, when, who with, and what you did.', 15, 'Usa pasado: went, stayed, visited…'),
    free('sp-a2-9', 'A2', 'Describe tu lugar de trabajo:', 'Describe your workplace and the people you work with.', 15, 'There is / there are te va a servir.'),
    free('sp-a2-10', 'A2', 'Habla de tus planes para este año:', 'Talk about your plans for this year using going to and will.', 15, 'Going to para lo decidido, will para lo probable.'),
  ],
  'modulo-3': [
    rep('sp-b1-1', 'B1', 'Habla de tu experiencia:', 'I have worked on three bridges since I graduated.', 'Have worked se dice ligado: /həv wɜːrkt/.'),
    rep('sp-b1-2', 'B1', 'Explica una causa:', 'The delay happened because the supplier arrived late.', 'Because pierde fuerza en la primera sílaba: b’cause.'),
    rep('sp-b1-3', 'B1', 'Da una recomendación:', 'You should double-check the measurements before we start.', 'Should tiene la “l” muda.'),
    rep('sp-b1-4', 'B1', 'Habla de algo hipotético:', 'If we had more time, we would test the whole system.', 'Would tampoco pronuncia la “l”.'),
    read('sp-b1-5', 'B1', 'Lee este reporte en voz alta:', 'The team finished the foundation last week. We are now waiting for the inspection, which should take two or three days.', 'Respira en la coma antes de which.'),
    read('sp-b1-6', 'B1', 'Lee esta explicación en voz alta:', 'When the pressure drops below the limit, the valve closes automatically and the alarm goes off.', 'Automatically lleva la fuerza en “ma”.'),
    free('sp-b1-7', 'B1', 'Explica un problema que resolviste en el trabajo:', 'Describe a problem you solved at work: what happened, what you did, and the result.', 25, 'Cuéntalo en tres partes: problema, acción, resultado.'),
    free('sp-b1-8', 'B1', 'Da tu opinión:', 'Say whether companies should let people work from home, and explain why.', 25, 'Di tu postura primero y luego dos razones.'),
    free('sp-b1-9', 'B1', 'Describe una obra o proyecto que conozcas:', 'Describe a project you know well: what it is, who it is for, and why it matters.', 25, 'Presente y pasado mezclados está bien.'),
  ],
  'modulo-4': [
    rep('sp-b2-1', 'B2', 'Presenta un avance:', 'We are currently ahead of schedule, although the budget is tight.', 'Although se dice /ɔːlˈðoʊ/, sin “g”.'),
    rep('sp-b2-2', 'B2', 'Suaviza una mala noticia:', 'Unfortunately, the results were not as good as we expected.', 'Marca la coma después de unfortunately.'),
    rep('sp-b2-3', 'B2', 'Propón una alternativa:', 'Rather than replacing the whole unit, we could repair the pump.', 'Rather lleva “th” suave.'),
    read('sp-b2-4', 'B2', 'Lee este párrafo técnico en voz alta:', 'The report concludes that the current design is safe, provided that maintenance is carried out every six months and the load never exceeds the stated limit.', 'Provided that abre una condición: bájale un poco el tono.'),
    free('sp-b2-5', 'B2', 'Explica un proceso de tu especialidad:', 'Explain a technical process from your field step by step, as if talking to a new colleague.', 40, 'First… then… after that… finally.'),
    free('sp-b2-6', 'B2', 'Defiende una decisión:', 'Defend a decision you made at work that other people disagreed with.', 40, 'Reconoce la otra postura antes de rebatirla.'),
    free('sp-b2-7', 'B2', 'Compara dos soluciones:', 'Compare two possible solutions to a problem and recommend one.', 40, 'On the one hand… on the other hand…'),
    free('sp-b2-8', 'B2', 'Reporta un incidente de seguridad:', 'Report a safety incident: what happened, the cause, and what you changed afterwards.', 40, 'Pasado y presente perfecto.'),
  ],
  'modulo-5': [
    rep('sp-c1-1', 'C1', 'Matiza una afirmación:', 'The evidence suggests, though it hardly proves, that the method is reliable.', 'Las comas son pausas reales aquí.'),
    rep('sp-c1-2', 'C1', 'Cierra una negociación:', 'Provided the terms remain as agreed, we are prepared to move forward.', 'Ritmo pausado, tono descendente al final.'),
    read('sp-c1-3', 'C1', 'Lee este párrafo en voz alta:', 'Had the maintenance schedule been followed, the failure would almost certainly have been avoided; the investigation, however, found no record of the last three inspections.', 'La inversión inicial exige que no te comas “had”.'),
    free('sp-c1-4', 'C1', 'Presenta un proyecto ante un cliente:', 'Present a project to a client: context, approach, risks and expected outcome.', 60, 'Estructura clara, sin muletillas.'),
    free('sp-c1-5', 'C1', 'Argumenta una postura discutible:', 'Argue for or against automating a process in your industry, addressing the strongest counterargument.', 60, 'Concede algo antes de rebatir.'),
    free('sp-c1-6', 'C1', 'Explica un fracaso y qué aprendiste:', 'Talk about a professional failure, what caused it, and what you would do differently.', 60, 'Condicionales del pasado: would have, should have.'),
    free('sp-c1-7', 'C1', 'Responde a una objeción difícil:', 'A client says your proposal is too expensive. Respond persuasively.', 60, 'Reconoce, reencuadra, cierra.'),
  ],
};

if (typeof window !== 'undefined') { window.SPEAKING_BANK = SPEAKING_BANK; }
