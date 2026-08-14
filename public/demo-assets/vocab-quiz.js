// LOS ITEMS DE "¿PARA QUE SE USA?" — el tercero de los tres quizzes que puede
// tocarle a una palabra en el examen del tema. Los otros dos salen solos de
// vocab.js (escuchar y elegir el español; escuchar y escribirla en inglés), asi
// que aqui solo vive lo que hay que escribir a mano.
//
// Va en archivo aparte por lo mismo que vocab.js: la pagina del demo se sirve
// con `no-store` y todo lo incrustado en ella viaja de nuevo en cada visita.
// Se carga por `<base href="/demo-assets/">`, igual que vocab.js.
//
// FORMATO. Un objeto por palabra, con la palabra INGLESA como clave — que es
// unica en toda la biblioteca, y por eso puede serlo aqui:
//
//   'thank you': { q: 'para agradecer', d: ['para pedir permiso', ...] }
//
//   q = el uso correcto.  d = TRES usos falsos, escritos PARA ESA palabra.
//
// TRES REGLAS AL AÑADIR:
//  1. Los falsos tienen que ser usos de verdad, del mismo mundo que el correcto.
//     "para agradecer" contra "para hablar de frutas" no es una pregunta: es un
//     regalo. Lo bueno es que los cuatro suenen posibles.
//  2. Solo palabras donde "¿para que se usa?" sea una pregunta de verdad:
//     saludos, frases, muletillas, conectores, verbos. Un sustantivo concreto
//     (banana, turquesa, iguana) no la necesita: se queda con los otros dos
//     tipos y no pasa nada.
//  3. Español latino neutro, igual que vocab.js.
//
// Al editar, subir el ?v= del <script> en demo-app.html.

window.VOCAB_USE = {
  'thank you': { q: 'para agradecer', d: [
    'para pedir permiso', 'para pedir perdón', 'para despedirse'] },
  'please': { q: 'para pedir algo con cortesía', d: [
    'para agradecer algo que te dieron', 'para saludar al llegar', 'para aceptar una invitación'] },
  'excuse me': { q: 'para llamar la atención de alguien antes de hablarle', d: [
    'para agradecer un favor', 'para presentarte a alguien nuevo', 'para despedirte de un grupo'] },
  'sorry': { q: 'para disculparte por algo que hiciste', d: [
    'para agradecer un regalo', 'para pedir la cuenta', 'para saludar por la mañana'] },
  "you're welcome": { q: 'para responder cuando alguien te da las gracias', d: [
    'para responder cuando alguien te saluda', 'para invitar a alguien a pasar', 'para pedir ayuda'] },
  'good night': { q: 'para despedirte cuando ya es de noche', d: [
    'para saludar al llegar de noche', 'para desear buen viaje', 'para brindar con alguien'] },
  'nice to meet you': { q: 'para decirle a alguien que te alegra conocerlo', d: [
    'para despedirte de alguien que ya conocías', 'para agradecer una invitación', 'para felicitar a alguien'] },
  'take care': { q: 'para despedirte deseándole bien a alguien', d: [
    'para pedirle a alguien que tenga cuidado con un peligro', 'para agradecer un favor', 'para saludar a alguien que llega'] },
};
