// LA BIBLIOTECA DE VOCABULARIO. Vive aqui, fuera de demo-app.html, y no dentro:
// la pagina del demo se sirve con `no-store` (ver src/lib/demo-page.ts), asi que
// todo lo que este incrustado en ella viaja de nuevo en cada visita. Como
// archivo suelto lo cachea el navegador una vez y ya. Se carga igual que
// mascot-tint.js, por `<base href="/demo-assets/">`.
//
// El curso no trae listas de palabras por ningun lado —sus bloques son teoria,
// titulo, resumen, mision, intro y cierre—, asi que esto va escrito a mano. Es
// el sitio a reemplazar cuando exista la lista de verdad: cambiando SOLO este
// arreglo cambia toda la pantalla. El render se adapta solo a cualquier
// cantidad de secciones, temas y palabras.
//
// Dos niveles: seccion (Basicos, Viaje…) y dentro los temas, que son las fichas
// que se ven al entrar. La palabra vive un nivel mas abajo, en la hoja.
// Formato de cada palabra: [ingles, español].
//
// TRES REGLAS QUE NO SE ROMPEN AL EDITAR:
//  1. Cero palabras en ingles repetidas en TODA la biblioteca. El lado izquierdo
//     es la clave con la que se guarda "escuchada", asi que un duplicado hace
//     que dos fichas distintas se marquen solas entre si.
//  2. Español latino neutro: sin jerga de un solo pais y sin nada que envejezca
//     (carro, celular, paradero, vuelto, ¿quieres salir?).
//  3. El lado en ingles lo lee un TTS. Que sea pronunciable: nada de "…" ni
//     abreviaturas raras.
//
// Al editar este archivo, subir el ?v= del <script> en demo-app.html para que
// nadie se quede con la copia vieja en cache.

window.VOCAB = [
  { s: 'Básicos', chips: [
    { n: 'Saludos y cortesía', e: '👋', w: [
      ['hello', 'hola'], ['goodbye', 'adiós'], ['please', 'por favor'],
      ['thank you', 'gracias'], ['sorry', 'perdón'], ['excuse me', 'disculpe'],
      ['yes', 'sí'], ['no', 'no'], ['nice to meet you', 'mucho gusto'] ] },
    // Del 0 al 20 uno por uno, las decenas, y unos compuestos que enseñan la
    // regla. Los 60 y pico que faltan se arman con lo que ya esta aqui.
    { n: 'Números', e: '🔢', w: [
      ['zero', 'cero'], ['one', 'uno'], ['two', 'dos'], ['three', 'tres'],
      ['four', 'cuatro'], ['five', 'cinco'], ['six', 'seis'], ['seven', 'siete'],
      ['eight', 'ocho'], ['nine', 'nueve'], ['ten', 'diez'], ['eleven', 'once'],
      ['twelve', 'doce'], ['thirteen', 'trece'], ['fourteen', 'catorce'],
      ['fifteen', 'quince'], ['sixteen', 'dieciséis'], ['seventeen', 'diecisiete'],
      ['eighteen', 'dieciocho'], ['nineteen', 'diecinueve'], ['twenty', 'veinte'],
      ['twenty-one', 'veintiuno'], ['twenty-five', 'veinticinco'],
      ['thirty', 'treinta'], ['thirty-five', 'treinta y cinco'],
      ['forty', 'cuarenta'], ['forty-two', 'cuarenta y dos'],
      ['fifty', 'cincuenta'], ['sixty', 'sesenta'], ['sixty-eight', 'sesenta y ocho'],
      ['seventy', 'setenta'], ['eighty', 'ochenta'], ['ninety', 'noventa'],
      ['ninety-nine', 'noventa y nueve'], ['one hundred', 'cien'] ] },
    { n: 'Tiempo', e: '🕐', w: [
      ['today', 'hoy'], ['tomorrow', 'mañana'], ['yesterday', 'ayer'],
      ['morning', 'la mañana'], ['afternoon', 'la tarde'], ['night', 'la noche'],
      ['now', 'ahora'], ['hour', 'hora'], ['minute', 'minuto'],
      ['day', 'día'], ['week', 'semana'], ['month', 'mes'], ['year', 'año'],
      ['early', 'temprano'], ['late', 'tarde'], ['weekend', 'fin de semana'] ] },
    // Lo que se necesita justo cuando algo sale mal, que es cuando menos sale
    // el idioma. Va en Basicos y no en un rincon por eso mismo.
    { n: 'Emergencias', e: '🆘', w: [
      ["I don't understand", 'no entiendo'],
      ['Can you repeat that?', '¿puede repetirlo?'],
      ['More slowly, please', 'más despacio, por favor'],
      ["I'm lost", 'estoy perdido'],
      ['I need help', 'necesito ayuda'],
      ['Help!', '¡auxilio!'],
      ['Call the police', 'llame a la policía'],
      ["I don't speak English well", 'no hablo bien inglés'],
      ['How do you say this?', '¿cómo se dice esto?'],
      ['What does it mean?', '¿qué significa?'],
      ['Excuse me, where is the bathroom?', 'disculpe, ¿dónde está el baño?'],
      ["It's an emergency", 'es una emergencia'],
      ['Careful!', '¡cuidado!'] ] },
    { n: 'En la calle', e: '🧭', w: [
      ['street', 'calle'], ['left', 'izquierda'], ['right', 'derecha'],
      ['near', 'cerca'], ['far', 'lejos'], ['bus', 'bus'],
      ['ticket', 'boleto'], ['map', 'mapa'], ['corner', 'esquina'] ] },
    { n: 'Comida', e: '🍽️', w: [
      ['water', 'agua'], ['bread', 'pan'], ['chicken', 'pollo'],
      ['rice', 'arroz'], ['coffee', 'café'], ['bill', 'la cuenta'],
      ['menu', 'carta'], ['hungry', 'con hambre'], ['delicious', 'delicioso'] ] },
    { n: 'Trabajo y estudio', e: '💼', w: [
      ['work', 'trabajo'], ['meeting', 'reunión'], ['email', 'correo'],
      ['help', 'ayuda'], ['question', 'pregunta'], ['answer', 'respuesta'],
      ['to learn', 'aprender'], ['easy', 'fácil'], ['difficult', 'difícil'] ] },
  ] },
  { s: 'Viaje', chips: [
    { n: 'En el aeropuerto', e: '✈️', w: [
      ['airport', 'aeropuerto'], ['flight', 'vuelo'], ['luggage', 'equipaje'],
      ['passport', 'pasaporte'], ['gate', 'puerta de embarque'], ['boarding pass', 'pase de abordar'],
      ['delayed', 'retrasado'], ['arrival', 'llegada'], ['departure', 'salida'],
      ['suitcase', 'maleta'] ] },
    { n: 'Hotel', e: '🏨', w: [
      ['room', 'habitación'], ['key', 'llave'], ['bed', 'cama'],
      ['towel', 'toalla'], ['booking', 'reserva'], ['floor', 'piso'],
      ['elevator', 'ascensor'], ['to check in', 'registrarse'],
      ['to check out', 'dejar la habitación'], ['front desk', 'recepción'] ] },
    { n: 'Transporte', e: '🚌', w: [
      ['train', 'tren'], ['taxi', 'taxi'], ['car', 'carro'],
      ['plane', 'avión'], ['station', 'estación'], ['stop', 'paradero'],
      ['driver', 'conductor'], ['to drive', 'manejar'], ['road', 'carretera'],
      ['traffic', 'tráfico'] ] },
  ] },
  { s: 'Vida diaria', chips: [
    { n: 'Casa y objetos', e: '🏠', w: [
      ['house', 'casa'], ['door', 'puerta'], ['window', 'ventana'],
      ['table', 'mesa'], ['chair', 'silla'], ['phone', 'celular'],
      ['keys', 'llaves'], ['bag', 'bolso'], ['lamp', 'lámpara'],
      ['kitchen', 'cocina'] ] },
    { n: 'Ropa', e: '👕', w: [
      ['shirt', 'camisa'], ['t-shirt', 'camiseta'], ['pants', 'pantalón'],
      ['dress', 'vestido'], ['skirt', 'falda'], ['jacket', 'chaqueta'],
      ['coat', 'abrigo'], ['socks', 'medias'], ['shoes', 'zapatos'],
      ['hat', 'gorro'], ['belt', 'cinturón'], ['sweater', 'suéter'] ] },
    { n: 'Compras y dinero', e: '💳', w: [
      ['money', 'dinero'], ['price', 'precio'], ['cheap', 'barato'],
      ['expensive', 'caro'], ['to buy', 'comprar'], ['to pay', 'pagar'],
      ['cash', 'efectivo'], ['card', 'tarjeta'], ['change', 'vuelto'],
      ['receipt', 'recibo'] ] },
    { n: 'Salud y cuerpo', e: '🩺', w: [
      ['head', 'cabeza'], ['hand', 'mano'], ['foot', 'pie'],
      ['pain', 'dolor'], ['doctor', 'doctor'], ['medicine', 'medicina'],
      ['sick', 'enfermo'], ['tired', 'cansado'], ['hospital', 'hospital'],
      ['to rest', 'descansar'] ] },
    { n: 'El clima', e: '🌦️', w: [
      ['weather', 'clima'], ['rain', 'lluvia'], ["it's raining", 'está lloviendo'],
      ['sun', 'sol'], ["it's sunny", 'está soleado'], ['cloudy', 'nublado'],
      ['wind', 'viento'], ["it's cold", 'hace frío'], ["it's hot", 'hace calor'],
      ['storm', 'tormenta'], ['umbrella', 'paraguas'], ['temperature', 'temperatura'] ] },
    { n: 'Tecnología', e: '🔌', w: [
      ['wifi', 'wifi'], ['password', 'contraseña'], ['charger', 'cargador'],
      ['battery', 'batería'], ['link', 'enlace'], ['app', 'aplicación'],
      ['screen', 'pantalla'], ['to download', 'descargar'], ['file', 'archivo'],
      ['account', 'cuenta'], ['to click', 'hacer clic'], ['signal', 'señal'] ] },
    { n: 'Rutina diaria', e: '🪥', w: [
      ['to wake up', 'despertarse'], ['to get up', 'levantarse'],
      ['to shower', 'ducharse'], ['to brush your teeth', 'lavarse los dientes'],
      ['to get dressed', 'vestirse'], ['to have breakfast', 'desayunar'],
      ['to have lunch', 'almorzar'], ['to have dinner', 'cenar'],
      ['to go to work', 'ir al trabajo'], ['to come home', 'llegar a casa'],
      ['to go to bed', 'acostarse'], ['to sleep', 'dormir'] ] },
    { n: 'Trámites', e: '📄', w: [
      ['appointment', 'cita'], ['document', 'documento'], ['bank', 'banco'],
      ['form', 'formulario'], ['ID card', 'carné'], ['signature', 'firma'],
      ['to sign', 'firmar'], ['office', 'oficina'], ['line', 'cola'],
      ['deadline', 'fecha límite'], ['fee', 'tarifa'], ['application', 'solicitud'] ] },
  ] },
  { s: 'Personas y trato', chips: [
    { n: 'Familia', e: '👨‍👩‍👧', w: [
      ['family', 'familia'], ['mother', 'mamá'], ['father', 'papá'],
      ['parents', 'papás'], ['brother', 'hermano'], ['sister', 'hermana'],
      ['siblings', 'hermanos'], ['son', 'hijo'], ['daughter', 'hija'],
      ['child', 'niño'], ['grandmother', 'abuela'], ['grandfather', 'abuelo'] ] },
    // El parentesco se separa de la familia directa a proposito: son muchas
    // palabras y casi todas se parecen entre si (tio/tia, primo/prima,
    // sobrino/sobrina). Juntas en una sola ficha se pisan.
    { n: 'Parientes', e: '👵', w: [
      ['uncle', 'tío'], ['aunt', 'tía'], ['cousin', 'primo'],
      ['nephew', 'sobrino'], ['niece', 'sobrina'], ['grandson', 'nieto'],
      ['granddaughter', 'nieta'], ['godmother', 'madrina'], ['godfather', 'padrino'],
      ['relative', 'pariente'], ['great-grandmother', 'bisabuela'], ['twin', 'gemelo'] ] },
    { n: 'Familia extendida', e: '💍', w: [
      ['girlfriend', 'novia'], ['boyfriend', 'novio'], ['wife', 'esposa'],
      ['husband', 'esposo'], ['partner', 'pareja'], ['mother-in-law', 'suegra'],
      ['father-in-law', 'suegro'], ['daughter-in-law', 'nuera'], ['son-in-law', 'yerno'],
      ['sister-in-law', 'cuñada'], ['brother-in-law', 'cuñado'], ['engaged', 'comprometido'] ] },
    { n: 'Gente cercana', e: '🧑‍🤝‍🧑', w: [
      ['friend', 'amigo'], ['best friend', 'mejor amigo'], ['neighbor', 'vecino'],
      ['boss', 'jefe'], ['coworker', 'compañero de trabajo'],
      ['classmate', 'compañero de clase'], ['teacher', 'profesor'],
      ['student', 'estudiante'], ['guest', 'invitado'], ['stranger', 'desconocido'] ] },
    { n: 'Sentimientos', e: '😊', w: [
      ['happy', 'feliz'], ['sad', 'triste'], ['angry', 'molesto'],
      ['scared', 'asustado'], ['nervous', 'nervioso'], ['calm', 'tranquilo'],
      ['excited', 'emocionado'], ['bored', 'aburrido'], ['proud', 'orgulloso'],
      ['worried', 'preocupado'] ] },
    { n: 'Describir', e: '📏', w: [
      ['big', 'grande'], ['small', 'pequeño'], ['new', 'nuevo'],
      ['old', 'viejo'], ['hot', 'caliente'], ['cold', 'frío'],
      ['fast', 'rápido'], ['slow', 'lento'], ['beautiful', 'bonito'],
      ['strong', 'fuerte'] ] },
    { n: 'Ocio y planes', e: '🎉', w: [
      ['Do you want to go out?', '¿quieres salir?'], ['free time', 'tiempo libre'],
      ['hobby', 'pasatiempo'], ['movie', 'película'], ['party', 'fiesta'],
      ['to go out', 'salir'], ['to meet up', 'reunirse'], ['to invite', 'invitar'],
      ['busy', 'ocupado'], ['music', 'música'], ['game', 'juego'],
      ['to travel', 'viajar'] ] },
    // Español latino y sin jerga: lo que se dice en cualquier pais de la region
    // sin sonar de uno solo, y sin nada que envejezca en dos años.
    { n: 'Muletillas y expresiones', e: '💬', w: [
      ['well', 'bueno'], ['of course', 'claro'], ['right?', '¿verdad?'],
      ['I think so', 'creo que sí'], ["I don't think so", 'creo que no'],
      ["let's see", 'a ver'], ["that's right", 'así es'],
      ['no problem', 'no hay problema'], ["don't worry", 'no te preocupes'],
      ['I agree', 'estoy de acuerdo'], ['more or less', 'más o menos'],
      ['by the way', 'por cierto'] ] },
  ] },
  { s: 'El mundo', chips: [
    { n: 'Colores', e: '🎨', w: [
      ['red', 'rojo'], ['blue', 'azul'], ['green', 'verde'],
      ['yellow', 'amarillo'], ['black', 'negro'], ['white', 'blanco'],
      ['orange', 'naranja'], ['purple', 'morado'], ['pink', 'rosado'],
      ['brown', 'marrón'], ['gray', 'gris'] ] },
    { n: 'Animales domésticos', e: '🐶', w: [
      ['dog', 'perro'], ['cat', 'gato'], ['bird', 'pájaro'],
      ['fish', 'pez'], ['rabbit', 'conejo'], ['horse', 'caballo'],
      ['cow', 'vaca'], ['hen', 'gallina'], ['pig', 'cerdo'],
      ['sheep', 'oveja'] ] },
    { n: 'Animales salvajes', e: '🦁', w: [
      ['lion', 'león'], ['tiger', 'tigre'], ['bear', 'oso'],
      ['wolf', 'lobo'], ['monkey', 'mono'], ['elephant', 'elefante'],
      ['snake', 'serpiente'], ['shark', 'tiburón'], ['eagle', 'águila'],
      ['fox', 'zorro'] ] },
  ] },
  { s: 'Palabras que enlazan', chips: [
    { n: 'Verbos esenciales', e: '⚡', w: [
      ['to be', 'ser o estar'], ['to have', 'tener'], ['to do', 'hacer'],
      ['to go', 'ir'], ['to want', 'querer'], ['to need', 'necesitar'],
      ['to know', 'saber'], ['to say', 'decir'], ['to see', 'ver'],
      ['to come', 'venir'], ['to give', 'dar'], ['to take', 'tomar'] ] },
    { n: 'Preguntas', e: '❓', w: [
      ['what', 'qué'], ['who', 'quién'], ['when', 'cuándo'],
      ['where', 'dónde'], ['why', 'por qué'], ['how', 'cómo'],
      ['how much', 'cuánto'], ['which', 'cuál'], ['whose', 'de quién'] ] },
    // Cambian el sentido de una frase mas que casi cualquier sustantivo, y se
    // apoyan directamente en los verbos esenciales de al lado.
    { n: 'Frecuencia y cantidad', e: '📊', w: [
      ['always', 'siempre'], ['never', 'nunca'], ['sometimes', 'a veces'],
      ['often', 'seguido'], ['usually', 'normalmente'], ['already', 'ya'],
      ['still', 'todavía'], ['almost', 'casi'], ['too much', 'demasiado'],
      ['enough', 'suficiente'], ['quite', 'bastante'], ['very', 'muy'],
      ['maybe', 'quizás'] ] },
    { n: 'Conectores', e: '🔗', w: [
      ['and', 'y'], ['but', 'pero'], ['because', 'porque'],
      ['also', 'también'], ['then', 'luego'], ['so', 'entonces'],
      ['however', 'sin embargo'], ['although', 'aunque'], ['or', 'o'],
      ['if', 'si'] ] },
  ] },
];
