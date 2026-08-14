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
//     regalo. Lo bueno es que los cuatro suenen posibles y solo uno encaje.
//  2. Solo palabras donde "¿para que se usa?" sea una pregunta de verdad:
//     saludos, frases, muletillas, conectores, verbos. Un sustantivo concreto
//     (banana, turquesa, iguana) no la necesita: se queda con los otros dos
//     tipos y no pasa nada.
//  3. Español latino neutro, igual que vocab.js.
//
// Al editar, subir el ?v= del <script> en demo-app.html.

window.VOCAB_USE = {

  //== BASICOS · Saludos y cortesía ==========================================
  'hello': { q: 'para saludar a alguien', d: [
    'para despedirte', 'para agradecer un favor', 'para pedir disculpas'] },
  'hi': { q: 'para saludar de manera informal, entre amigos', d: [
    'para saludar con mucho respeto a alguien mayor', 'para despedirte al final del día', 'para presentar a otra persona'] },
  'good morning': { q: 'para saludar durante la mañana', d: [
    'para saludar después del almuerzo', 'para despedirte ya de noche', 'para desear buen viaje'] },
  'good afternoon': { q: 'para saludar durante la tarde', d: [
    'para saludar apenas amanece', 'para despedirte a medianoche', 'para agradecer la comida'] },
  'good evening': { q: 'para saludar al llegar cuando ya cayó la noche', d: [
    'para despedirte cuando te vas a dormir', 'para saludar a primera hora del día', 'para pedir la cuenta'] },
  'good night': { q: 'para despedirte cuando ya es de noche', d: [
    'para saludar al llegar de noche', 'para desear buen viaje', 'para brindar con alguien'] },
  'How are you?': { q: 'para preguntarle a alguien cómo está', d: [
    'para preguntar dónde vive alguien', 'para preguntar la hora', 'para pedir ayuda'] },
  "I'm fine": { q: 'para responder que estás bien', d: [
    'para responder que no entendiste', 'para pedir que repitan', 'para despedirte'] },
  'And you?': { q: 'para devolverle la misma pregunta a la otra persona', d: [
    'para cambiar de tema', 'para pedir permiso', 'para dar las gracias'] },
  "What's your name?": { q: 'para preguntar cómo se llama alguien', d: [
    'para preguntar de dónde es alguien', 'para preguntar qué edad tiene', 'para preguntar a qué se dedica'] },
  'My name is': { q: 'para decir cómo te llamas', d: [
    'para decir dónde vives', 'para decir qué edad tienes', 'para decir qué te gusta'] },
  'nice to meet you': { q: 'para decirle a alguien que te alegra conocerlo', d: [
    'para despedirte de alguien que ya conocías', 'para agradecer una invitación', 'para felicitar a alguien'] },
  'welcome': { q: 'para recibir a alguien que llega', d: [
    'para despedir a alguien que se va', 'para agradecer un regalo', 'para pedir un favor'] },
  'please': { q: 'para pedir algo con cortesía', d: [
    'para agradecer algo que te dieron', 'para saludar al llegar', 'para aceptar una invitación'] },
  'thank you': { q: 'para agradecer', d: [
    'para pedir permiso', 'para pedir perdón', 'para despedirse'] },
  'thanks a lot': { q: 'para agradecer con más énfasis', d: [
    'para agradecer apenas, sin darle importancia', 'para disculparte', 'para felicitar a alguien'] },
  "you're welcome": { q: 'para responder cuando alguien te da las gracias', d: [
    'para responder cuando alguien te saluda', 'para invitar a alguien a pasar', 'para pedir ayuda'] },
  'sorry': { q: 'para disculparte por algo que hiciste', d: [
    'para agradecer un regalo', 'para pedir la cuenta', 'para saludar por la mañana'] },
  'excuse me': { q: 'para llamar la atención de alguien antes de hablarle', d: [
    'para agradecer un favor', 'para presentarte a alguien nuevo', 'para despedirte de un grupo'] },
  'yes': { q: 'para afirmar o aceptar algo', d: [
    'para negar algo', 'para preguntar algo', 'para dudar de algo'] },
  'no': { q: 'para negar o rechazar algo', d: [
    'para aceptar una invitación', 'para saludar', 'para pedir permiso'] },
  'goodbye': { q: 'para despedirte', d: [
    'para saludar al llegar', 'para agradecer', 'para presentarte'] },
  'bye': { q: 'para despedirte de manera informal', d: [
    'para despedirte con mucha formalidad', 'para pedir disculpas', 'para dar las gracias'] },
  'see you later': { q: 'para despedirte de alguien a quien verás pronto', d: [
    'para despedirte de alguien a quien no verás en años', 'para saludar por la mañana', 'para agradecer un favor'] },
  'see you tomorrow': { q: 'para despedirte de alguien a quien verás al día siguiente', d: [
    'para despedirte para siempre', 'para saludar al entrar', 'para preguntar qué día es'] },
  'take care': { q: 'para despedirte deseándole bien a alguien', d: [
    'para avisarle a alguien de un peligro cercano', 'para agradecer un favor', 'para saludar a alguien que llega'] },
  'Have a good day': { q: 'para desearle un buen día a alguien que se va', d: [
    'para preguntar qué día es hoy', 'para pedir un día libre', 'para saludar de noche'] },

  //== BASICOS · Tiempo ======================================================
  'What time is it?': { q: 'para preguntar la hora', d: [
    'para preguntar qué día es', 'para preguntar cuánto cuesta algo', 'para preguntar dónde queda un lugar'] },
  "o'clock": { q: 'para decir una hora en punto, como three o’clock', d: [
    'para decir los minutos que faltan para la hora', 'para decir la fecha', 'para decir cuántas horas duró algo'] },
  'half past': { q: 'para decir que ya pasaron treinta minutos de esa hora', d: [
    'para decir que faltan quince minutos para la hora', 'para decir que es mediodía', 'para decir que algo dura media hora'] },
  'a quarter past': { q: 'para decir que ya pasaron quince minutos de esa hora', d: [
    'para decir que faltan quince minutos para la hora', 'para decir que ya pasó media hora', 'para pedir un cuarto de kilo'] },
  'a quarter to': { q: 'para decir que faltan quince minutos para esa hora', d: [
    'para decir que ya pasaron quince minutos de la hora', 'para decir que faltan treinta minutos', 'para decir que son las doce'] },
  'on time': { q: 'para decir que algo llegó a la hora acordada', d: [
    'para decir que algo llegó tarde', 'para decir que algo se canceló', 'para decir cuánto duró algo'] },

  //== BASICOS · Días de la semana ===========================================
  'What day is it today?': { q: 'para preguntar en qué día de la semana estamos', d: [
    'para preguntar la hora', 'para preguntar cuántos días faltan', 'para preguntar cómo está el clima'] },

  //== BASICOS · Emergencias =================================================
  "I don't understand": { q: 'para avisar que no entendiste lo que te dijeron', d: [
    'para avisar que no escuchaste el sonido', 'para negarte a hacer algo', 'para decir que no estás de acuerdo'] },
  'Can you repeat that?': { q: 'para pedir que digan otra vez lo que dijeron', d: [
    'para pedir que hablen más despacio', 'para pedir que te lo escriban', 'para pedir ayuda con una maleta'] },
  'More slowly, please': { q: 'para pedir que hablen más despacio', d: [
    'para pedir que repitan lo dicho', 'para pedir que hablen más fuerte', 'para pedir que esperen un momento'] },
  "I'm lost": { q: 'para avisar que no sabes dónde estás', d: [
    'para avisar que se te perdió un objeto', 'para avisar que no entiendes el idioma', 'para avisar que vas a llegar tarde'] },
  'I need help': { q: 'para pedir ayuda', d: [
    'para ofrecerle ayuda a alguien', 'para agradecer la ayuda recibida', 'para rechazar la ayuda'] },
  'Can you help me?': { q: 'para pedirle ayuda a una persona en concreto', d: [
    'para ofrecerte a ayudar tú', 'para agradecer un favor', 'para disculparte'] },
  'Help!': { q: 'para gritar pidiendo auxilio en una emergencia', d: [
    'para llamar al mesero', 'para saludar de lejos', 'para pedir un favor pequeño'] },
  'Call the police': { q: 'para pedir que llamen a la policía', d: [
    'para pedir que llamen una ambulancia', 'para pedir que llamen un taxi', 'para pedir la cuenta'] },
  'police': { q: 'para nombrar a quienes se ocupan de un robo o un delito', d: [
    'para nombrar a quienes apagan incendios', 'para nombrar a quienes atienden en el hospital', 'para nombrar a quienes reparten el correo'] },
  'ambulance': { q: 'para nombrar el vehículo que lleva enfermos al hospital', d: [
    'para nombrar el vehículo que apaga incendios', 'para nombrar el carro de la policía', 'para nombrar el bus del colegio'] },
  'firefighters': { q: 'para nombrar a quienes apagan los incendios', d: [
    'para nombrar a quienes atienden a los enfermos', 'para nombrar a quienes detienen a los ladrones', 'para nombrar a quienes arreglan las calles'] },
  'fire': { q: 'para avisar que algo se está quemando', d: [
    'para avisar que hay una inundación', 'para avisar que alguien se desmayó', 'para avisar que hubo un robo'] },
  'accident': { q: 'para nombrar algo malo que pasó sin que nadie lo quisiera', d: [
    'para nombrar algo que alguien hizo a propósito', 'para nombrar una celebración', 'para nombrar una cita médica'] },
  'danger': { q: 'para avisar que algo puede hacerte daño', d: [
    'para avisar que algo está prohibido por ley', 'para avisar que algo cuesta caro', 'para avisar que algo está cerrado'] },
  'emergency exit': { q: 'para señalar la puerta por donde salir si pasa algo grave', d: [
    'para señalar la entrada principal', 'para señalar dónde queda el baño', 'para señalar la salida al estacionamiento'] },
  'I need a doctor': { q: 'para pedir atención médica', d: [
    'para pedir una medicina en la farmacia', 'para pedir un taxi', 'para pedir la cuenta'] },
  'I feel sick': { q: 'para decir que te sientes mal del cuerpo', d: [
    'para decir que estás triste', 'para decir que tienes hambre', 'para decir que estás cansado de esperar'] },
  'It hurts here': { q: 'para señalar en qué parte del cuerpo te duele', d: [
    'para decir que algo te da miedo', 'para decir que algo pesa mucho', 'para decir dónde vives'] },
  "I'm allergic": { q: 'para avisar que algo te hace daño al comerlo o tocarlo', d: [
    'para avisar que algo no te gusta', 'para avisar que estás a dieta', 'para avisar que ya comiste'] },
  'I lost my passport': { q: 'para avisar que se te perdió el documento con el que viajas', d: [
    'para avisar que te robaron el celular', 'para avisar que perdiste el vuelo', 'para avisar que no encuentras el hotel'] },
  'They stole my phone': { q: 'para denunciar que te robaron el celular', d: [
    'para avisar que se te perdió el celular', 'para decir que se te descargó el celular', 'para pedir prestado un celular'] },
  "I don't speak English well": { q: 'para avisar que apenas te defiendes en inglés', d: [
    'para avisar que no oyes bien', 'para pedir que hablen más fuerte', 'para avisar que no quieres hablar'] },
  'Do you speak Spanish?': { q: 'para preguntar si la otra persona habla español', d: [
    'para avisar que tú hablas español', 'para pedir que hablen más despacio', 'para preguntar de dónde es alguien'] },
  'How do you say this?': { q: 'para preguntar cómo se dice algo en el otro idioma', d: [
    'para preguntar qué significa una palabra que oíste', 'para preguntar cómo se escribe tu nombre', 'para preguntar dónde queda un lugar'] },
  'What does it mean?': { q: 'para preguntar el significado de algo que oíste', d: [
    'para preguntar cómo se dice algo en inglés', 'para preguntar quién lo dijo', 'para preguntar cuánto cuesta'] },
  'What happened?': { q: 'para preguntar qué fue lo que pasó', d: [
    'para preguntar qué va a pasar mañana', 'para preguntar dónde estamos', 'para preguntar quién es alguien'] },
  'Excuse me, where is the bathroom?': { q: 'para preguntar por el baño con cortesía', d: [
    'para pedir la cuenta', 'para preguntar la hora', 'para pedir permiso para pasar'] },
  "It's an emergency": { q: 'para avisar que algo es urgente y no puede esperar', d: [
    'para avisar que algo puede esperar hasta mañana', 'para pedir un favor pequeño', 'para avisar que vas a llegar tarde'] },
  'Wait a moment': { q: 'para pedir que esperen un poco', d: [
    'para pedir que se apuren', 'para pedir que se vayan', 'para pedir que repitan'] },
  'Stop!': { q: 'para pedir que algo se detenga de inmediato', d: [
    'para pedir que sigan adelante', 'para pedir que hablen más alto', 'para pedir permiso'] },
  'Careful!': { q: 'para avisarle a alguien de un peligro que tiene cerca', d: [
    'para felicitar a alguien', 'para pedir silencio', 'para llamar a alguien que está lejos'] },

  //== BASICOS · En la calle =================================================
  'How do I get there?': { q: 'para preguntar el camino hasta un lugar', d: [
    'para preguntar cuánto cuesta el pasaje', 'para preguntar a qué hora abre', 'para preguntar quién vive ahí'] },
  "It's two blocks away": { q: 'para decir a qué distancia queda algo', d: [
    'para decir a qué hora llega algo', 'para decir cuánto cuesta algo', 'para decir de quién es algo'] },
  'straight ahead': { q: 'para indicar que se sigue de frente, sin doblar', d: [
    'para indicar que hay que doblar en la esquina', 'para indicar que hay que regresar', 'para indicar que hay que cruzar la calle'] },
  'to cross': { q: 'para decir que pasas de un lado al otro de la calle', d: [
    'para decir que caminas por la acera', 'para decir que doblas en la esquina', 'para decir que subes al bus'] },
  'to turn': { q: 'para decir que cambias de dirección en una esquina', d: [
    'para decir que sigues de frente', 'para decir que te detienes', 'para decir que retrocedes'] },
  'next to': { q: 'para decir que algo está justo al lado de otra cosa', d: [
    'para decir que está enfrente, del otro lado', 'para decir que está detrás', 'para decir que está lejos'] },
  'in front of': { q: 'para decir que algo está enfrente de otra cosa', d: [
    'para decir que está detrás', 'para decir que está al lado', 'para decir que está adentro'] },
  'behind': { q: 'para decir que algo está detrás de otra cosa', d: [
    'para decir que está delante', 'para decir que está encima', 'para decir que está en medio de otras dos'] },
  'between': { q: 'para decir que algo está en medio de otras dos cosas', d: [
    'para decir que está al lado de una sola cosa', 'para decir que está debajo', 'para decir que está lejos de todo'] },

  //== BASICOS · Trabajo y estudio ===========================================
  'to start': { q: 'para decir que algo empieza', d: [
    'para decir que algo termina', 'para decir que algo se repite', 'para decir que algo se cancela'] },
  'to finish': { q: 'para decir que algo llega a su fin', d: [
    'para decir que algo empieza', 'para decir que algo sigue en marcha', 'para decir que algo se aplaza'] },
  'to study': { q: 'para decir que le dedicas tiempo a aprender algo', d: [
    'para decir que se lo enseñas a otros', 'para decir que descansas', 'para decir que trabajas por un sueldo'] },
  'to learn': { q: 'para decir que algo nuevo se te queda', d: [
    'para decir que ya lo sabías de antes', 'para decir que se lo enseñas a alguien', 'para decir que lo olvidaste'] },
  'to practice': { q: 'para decir que repites algo para hacerlo mejor', d: [
    'para decir que lo haces por primera vez', 'para decir que dejas de hacerlo', 'para decir que se lo pides a otro'] },
  'to explain': { q: 'para decir que aclaras algo para que otro lo entienda', d: [
    'para decir que preguntas algo que no entiendes', 'para decir que te quedas callado', 'para decir que lo repites igual'] },
  'to understand': { q: 'para decir que te quedó claro lo que oíste', d: [
    'para decir que no te quedó nada claro', 'para decir que lo aprendiste de memoria', 'para decir que se lo explicaste a alguien'] },
  'to read': { q: 'para decir que pasas la vista por un texto y lo entiendes', d: [
    'para decir que pones palabras en un papel', 'para decir que escuchas a alguien', 'para decir que hablas en voz alta'] },
  'to write': { q: 'para decir que pones palabras en un papel o en la pantalla', d: [
    'para decir que lees un texto', 'para decir que haces un dibujo', 'para decir que lo dices en voz alta'] },

  //== PALABRAS QUE ENLAZAN · Verbos esenciales ==============================
  // Aqui el tipo 3 es el que mas ensaña: traducir `to see` y `to look` da la
  // misma palabra en español, y la diferencia solo se ve en el uso.
  'to be': { q: 'para decir cómo es o cómo está algo o alguien', d: [
    'para decir que algo te pertenece', 'para decir que te desplazas a un lugar', 'para decir que algo se acabó'] },
  'to have': { q: 'para decir que algo es tuyo o que lo llevas contigo', d: [
    'para decir cómo eres', 'para decir a dónde vas', 'para decir qué opinas'] },
  'to do': { q: 'para hablar de hacer una actividad o una tarea en general', d: [
    'para hablar de fabricar o preparar algo concreto', 'para hablar de ir a un lugar', 'para hablar de tener algo'] },
  'to make': { q: 'para hablar de fabricar o preparar algo concreto, como la comida', d: [
    'para hablar de una actividad en general', 'para hablar de tener algo', 'para hablar de mirar algo'] },
  'to go': { q: 'para decir que te desplazas hacia otro lugar', d: [
    'para decir que te acercas a donde está quien habla', 'para decir que te quedas donde estás', 'para decir dónde vives'] },
  'to come': { q: 'para decir que te acercas al lugar donde está quien habla', d: [
    'para decir que te alejas hacia otro lugar', 'para decir que te quedas quieto', 'para decir que regresas mañana'] },
  'to want': { q: 'para decir lo que deseas', d: [
    'para decir lo que te hace falta sin remedio', 'para decir lo que ya tienes', 'para decir lo que no te gusta'] },
  'to need': { q: 'para decir que algo te hace falta de verdad', d: [
    'para decir que algo te gustaría, sin más', 'para decir que algo te sobra', 'para decir que algo te agrada'] },
  'to like': { q: 'para decir que algo te agrada', d: [
    'para decir que algo te molesta', 'para decir que algo te hace falta', 'para decir que algo te pertenece'] },
  'to love': { q: 'para decir que algo o alguien te importa muchísimo', d: [
    'para decir que algo te agrada un poco', 'para decir que algo no te interesa', 'para decir que algo te da miedo'] },
  'to know': { q: 'para decir que tienes un dato o que conoces algo', d: [
    'para decir que le estás dando vueltas a algo', 'para decir que lo estás aprendiendo', 'para decir que lo preguntaste'] },
  'to think': { q: 'para decir lo que opinas o que le estás dando vueltas a algo', d: [
    'para decir un dato que ya sabes seguro', 'para repetir lo que oíste de otro', 'para decir lo que deseas'] },
  'to believe': { q: 'para decir que das algo por cierto aunque no lo hayas comprobado', d: [
    'para decir que lo comprobaste tú mismo', 'para decir que lo dudas por completo', 'para decir que lo olvidaste'] },
  'to say': { q: 'para contar las palabras exactas que alguien soltó', d: [
    'para hablar con alguien de un tema', 'para preguntar algo', 'para escuchar a alguien'] },
  'to speak': { q: 'para hablar de usar un idioma o de dirigirte a alguien', d: [
    'para hablar de escribir un texto', 'para hablar de escuchar en silencio', 'para hablar de leer en voz baja'] },
  'to talk': { q: 'para hablar de conversar con alguien', d: [
    'para repetir las palabras exactas de alguien', 'para escuchar sin responder', 'para escribir un mensaje'] },
  'to ask': { q: 'para pedir un dato que no tienes', d: [
    'para dar la respuesta', 'para contar algo que pasó', 'para agradecer'] },
  'to answer': { q: 'para dar la respuesta a lo que te preguntaron', d: [
    'para hacer la pregunta', 'para cambiar de tema', 'para quedarte callado'] },
  'to see': { q: 'para hablar de lo que entra por los ojos sin buscarlo', d: [
    'para hablar de poner los ojos en algo a propósito', 'para hablar de lo que entra por los oídos', 'para hablar de tocar algo'] },
  'to look': { q: 'para hablar de poner los ojos en algo a propósito', d: [
    'para hablar de lo que ves sin querer', 'para hablar de escuchar con atención', 'para hablar de buscar con las manos'] },
  'to listen': { q: 'para hablar de ponerle atención a un sonido', d: [
    'para hablar del sonido que te llega sin buscarlo', 'para hablar de mirar algo', 'para hablar de hablar en voz alta'] },
  'to hear': { q: 'para hablar del sonido que te llega sin buscarlo', d: [
    'para hablar de escuchar con atención', 'para hablar de ver algo', 'para hablar de decir algo'] },
  'to give': { q: 'para decir que le pasas algo a alguien', d: [
    'para decir que alguien te pasa algo a ti', 'para decir que se lo prestas un rato', 'para decir que se lo quitas'] },
  'to take': { q: 'para decir que agarras algo y te lo llevas', d: [
    'para decir que se lo entregas a alguien', 'para decir que lo dejas donde estaba', 'para decir que lo compras'] },

  //== PALABRAS QUE ENLAZAN · Verbos de todos los días =======================
  'to get': { q: 'para decir que consigues algo', d: [
    'para decir que lo regalas', 'para decir que lo pierdes', 'para decir que lo devuelves'] },
  'to put': { q: 'para decir que colocas algo en un sitio', d: [
    'para decir que lo sacas de ahí', 'para decir que lo botas', 'para decir que lo buscas'] },
  'to find': { q: 'para decir que aparece lo que buscabas', d: [
    'para decir que se te perdió', 'para decir que lo sigues buscando', 'para decir que lo escondiste'] },
  'to open': { q: 'para decir que algo deja de estar cerrado', d: [
    'para decir que algo queda cerrado', 'para decir que algo se rompe', 'para decir que algo se guarda'] },
  'to close': { q: 'para decir que algo queda cerrado', d: [
    'para decir que algo se abre', 'para decir que algo se enciende', 'para decir que algo se llena'] },
  'to stop': { q: 'para decir que algo se detiene', d: [
    'para decir que algo sigue en marcha', 'para decir que algo empieza', 'para decir que algo se repite'] },
  'to change': { q: 'para decir que algo pasa a ser distinto', d: [
    'para decir que algo sigue igual', 'para decir que algo se acaba', 'para decir que algo se guarda'] },
  'to bring': { q: 'para decir que traes algo hacia donde estás', d: [
    'para decir que te lo llevas de aquí', 'para decir que lo dejas donde estaba', 'para decir que lo buscas'] },
  'to carry': { q: 'para decir que llevas algo encima de un lado a otro', d: [
    'para decir que lo dejas quieto', 'para decir que lo empujas con el pie', 'para decir que lo compras'] },
  'to leave': { q: 'para decir que te vas de un lugar', d: [
    'para decir que llegas a un lugar', 'para decir que te quedas', 'para decir que regresas'] },
  'to stay': { q: 'para decir que te quedas donde estás', d: [
    'para decir que te vas', 'para decir que llegas', 'para decir que sales a caminar'] },
  'to live': { q: 'para decir dónde tienes tu casa, o que estás vivo', d: [
    'para decir dónde trabajas', 'para decir a dónde viajas', 'para decir dónde pasas las vacaciones'] },
  'to work': { q: 'para decir que haces tu labor, normalmente por un sueldo', d: [
    'para decir que descansas', 'para decir que aprendes algo nuevo', 'para decir que juegas'] },
  'to use': { q: 'para decir que te sirves de algo para hacer una tarea', d: [
    'para decir que lo guardas sin tocarlo', 'para decir que lo regalas', 'para decir que lo rompes'] },
  'to happen': { q: 'para decir que algo ocurre', d: [
    'para decir que alguien lo provocó a propósito', 'para decir que algo se planea', 'para decir que algo se cancela'] },
  'to remember': { q: 'para decir que algo te vuelve a la cabeza', d: [
    'para decir que se te fue de la cabeza', 'para decir que lo estás aprendiendo', 'para decir que lo anotaste'] },
  'to forget': { q: 'para decir que algo se te fue de la cabeza', d: [
    'para decir que lo tienes presente', 'para decir que lo repasaste', 'para decir que lo escribiste'] },
  'to show': { q: 'para decir que le pones algo delante a alguien para que lo vea', d: [
    'para decir que lo escondes', 'para decir que lo miras tú solo', 'para decir que lo cuentas sin enseñarlo'] },
  'to keep': { q: 'para decir que te quedas con algo y lo conservas', d: [
    'para decir que lo devuelves', 'para decir que lo botas', 'para decir que lo prestas'] },
  'to break': { q: 'para decir que algo se parte o deja de servir', d: [
    'para decir que algo se arregla', 'para decir que algo se guarda', 'para decir que algo se limpia'] },
  'to touch': { q: 'para decir que pones la mano sobre algo', d: [
    'para decir que lo miras de lejos', 'para decir que lo hueles', 'para decir que lo escuchas'] },
  'to follow': { q: 'para decir que vas detrás de alguien o que haces lo que indica', d: [
    'para decir que vas delante', 'para decir que te quedas parado', 'para decir que te devuelves'] },
  'to decide': { q: 'para decir que te quedas con una opción entre varias', d: [
    'para decir que lo dejas para después', 'para decir que se lo preguntas a otro', 'para decir que dudas de todo'] },
  'to repeat': { q: 'para decir que algo se hace o se dice otra vez', d: [
    'para decir que se hace por primera vez', 'para decir que se deja de hacer', 'para decir que se hace al revés'] },
  'to continue': { q: 'para decir que algo sigue sin parar', d: [
    'para decir que algo se detiene', 'para decir que algo empieza de cero', 'para decir que algo se acabó'] },

  //== PALABRAS QUE ENLAZAN · Preguntas ======================================
  'what': { q: 'para preguntar por una cosa', d: [
    'para preguntar por una persona', 'para preguntar por un lugar', 'para preguntar por un momento'] },
  'who': { q: 'para preguntar por una persona', d: [
    'para preguntar por una cosa', 'para preguntar por un motivo', 'para preguntar por una cantidad'] },
  'when': { q: 'para preguntar por el momento', d: [
    'para preguntar por el lugar', 'para preguntar por el motivo', 'para preguntar por la manera'] },
  'where': { q: 'para preguntar por el lugar', d: [
    'para preguntar por el momento', 'para preguntar por la persona', 'para preguntar por el precio'] },
  'why': { q: 'para preguntar el motivo', d: [
    'para preguntar la manera', 'para preguntar el lugar', 'para preguntar la cantidad'] },
  'how': { q: 'para preguntar de qué manera se hace algo', d: [
    'para preguntar el motivo', 'para preguntar quién lo hizo', 'para preguntar en qué momento'] },
  'how much': { q: 'para preguntar el precio, o la cantidad de algo que no se cuenta de uno en uno', d: [
    'para preguntar cuántas unidades hay', 'para preguntar cuánto tiempo dura', 'para preguntar cada cuánto pasa'] },
  'how many': { q: 'para preguntar cuántas unidades hay', d: [
    'para preguntar el precio', 'para preguntar cuánto tiempo dura', 'para preguntar de qué manera'] },
  'how long': { q: 'para preguntar cuánto tiempo dura algo', d: [
    'para preguntar cada cuánto ocurre', 'para preguntar cuántas unidades hay', 'para preguntar el precio'] },
  'how often': { q: 'para preguntar cada cuánto ocurre algo', d: [
    'para preguntar cuánto tiempo dura', 'para preguntar a qué hora empieza', 'para preguntar el precio'] },
  'which': { q: 'para preguntar cuál, entre varias opciones a la vista', d: [
    'para preguntar por alguien que no conoces', 'para preguntar el motivo', 'para preguntar el lugar'] },
  'whose': { q: 'para preguntar de quién es algo', d: [
    'para preguntar quién lo hizo', 'para preguntar dónde está', 'para preguntar cuánto cuesta'] },
  'Where are you from?': { q: 'para preguntar de qué país o ciudad es alguien', d: [
    'para preguntar dónde vive ahora', 'para preguntar a dónde va', 'para preguntar cómo se llama'] },
  'How old are you?': { q: 'para preguntar la edad', d: [
    'para preguntar el nombre', 'para preguntar qué día es hoy', 'para preguntar cuánto tiempo lleva aquí'] },
  'What do you do?': { q: 'para preguntar a qué se dedica alguien', d: [
    'para preguntar qué está haciendo en este momento', 'para preguntar qué hace los domingos', 'para preguntar dónde vive'] },
  'Where do you live?': { q: 'para preguntar dónde vive alguien', d: [
    'para preguntar de qué país es', 'para preguntar a dónde va', 'para preguntar dónde trabaja'] },
  'Can I come in?': { q: 'para pedir permiso para entrar', d: [
    'para pedirle a alguien que salga', 'para preguntar si hay alguien adentro', 'para avisar que ya llegaste'] },
  'Is there a bathroom?': { q: 'para preguntar si en ese sitio hay baño', d: [
    'para preguntar por dónde se llega al baño', 'para pedir papel', 'para pedir permiso para entrar'] },
  'Do you have change?': { q: 'para preguntar si tienen billetes o monedas más pequeños', d: [
    'para preguntar el precio', 'para pedir un descuento', 'para preguntar si aceptan tarjeta'] },

  //== PALABRAS QUE ENLAZAN · Frecuencia =====================================
  'always': { q: 'para decir que algo pasa todas las veces, sin excepción', d: [
    'para decir que no pasa ninguna vez', 'para decir que pasa de vez en cuando', 'para decir que pasó una sola vez'] },
  'never': { q: 'para decir que algo no pasa ninguna vez', d: [
    'para decir que pasa siempre', 'para decir que pasa casi siempre', 'para decir que pasa algunas veces'] },
  'sometimes': { q: 'para decir que algo pasa algunas veces', d: [
    'para decir que pasa todas las veces', 'para decir que no pasa nunca', 'para decir que pasa cada día'] },
  'often': { q: 'para decir que algo pasa muchas veces', d: [
    'para decir que pasa muy pocas veces', 'para decir que no pasa nunca', 'para decir que pasó una sola vez'] },
  'usually': { q: 'para decir lo que pasa por costumbre, casi siempre', d: [
    'para decir lo que pasó una sola vez', 'para decir lo que no pasa nunca', 'para decir lo que pasará mañana'] },
  'rarely': { q: 'para decir que algo pasa muy pocas veces', d: [
    'para decir que pasa a menudo', 'para decir que pasa siempre', 'para decir que pasa cada semana'] },
  'once in a while': { q: 'para decir que algo pasa cada cierto tiempo, sin regla fija', d: [
    'para decir que pasa todos los días', 'para decir que no pasa nunca', 'para decir que pasa dos veces por semana'] },
  'daily': { q: 'para decir que algo pasa cada día', d: [
    'para decir que pasa cada semana', 'para decir que pasa una vez al mes', 'para decir que pasó ayer'] },
  'weekly': { q: 'para decir que algo pasa cada semana', d: [
    'para decir que pasa cada día', 'para decir que pasa cada año', 'para decir que pasó el fin de semana'] },
  'twice a week': { q: 'para decir que algo pasa dos veces por semana', d: [
    'para decir que pasa todos los días', 'para decir que pasa cada dos semanas', 'para decir que pasa dos veces al año'] },
  'again': { q: 'para decir que algo vuelve a pasar', d: [
    'para decir que pasa por primera vez', 'para decir que ya no pasa', 'para decir que pasa siempre'] },
  'already': { q: 'para decir que algo ya está hecho, incluso antes de lo esperado', d: [
    'para decir que todavía no pasa', 'para decir que pasará mañana', 'para decir que pasa siempre'] },
  'still': { q: 'para decir que algo sigue pasando hasta ahora', d: [
    'para decir que ya terminó', 'para decir que todavía no empieza', 'para decir que pasa a veces'] },
  'almost': { q: 'para decir que faltó muy poco para algo', d: [
    'para decir que pasó del todo', 'para decir que no pasó nada', 'para decir que pasó de más'] },

  //== PALABRAS QUE ENLAZAN · Cantidad e intensidad ==========================
  'a lot': { q: 'para decir que hay mucha cantidad', d: [
    'para decir que hay poca', 'para decir que no hay nada', 'para decir que hay lo justo'] },
  'a little': { q: 'para decir que hay poca cantidad de algo', d: [
    'para decir que hay muchísimo', 'para decir que no hay nada', 'para decir que sobra'] },
  'many': { q: 'para decir que hay muchas cosas de las que se cuentan una a una', d: [
    'para decir que hay pocas', 'para decir que hay demasiada agua o azúcar', 'para decir que no hay ninguna'] },
  'few': { q: 'para decir que hay pocas cosas contadas', d: [
    'para decir que hay muchas', 'para decir que hay de sobra', 'para decir que no queda ninguna'] },
  'too much': { q: 'para decir que hay más de lo que conviene', d: [
    'para decir que hay justo lo necesario', 'para decir que falta', 'para decir que no hay nada'] },
  'enough': { q: 'para decir que hay lo necesario, ni más ni menos', d: [
    'para decir que sobra', 'para decir que falta', 'para decir que no hay nada'] },
  'more': { q: 'para pedir o señalar una cantidad mayor', d: [
    'para señalar una cantidad menor', 'para decir que sigue igual', 'para decir que se acabó'] },
  'less': { q: 'para señalar una cantidad menor', d: [
    'para señalar una cantidad mayor', 'para decir que sigue igual', 'para decir que sobra'] },
  'at least': { q: 'para señalar el mínimo que hay o que hace falta', d: [
    'para señalar el máximo posible', 'para dar la cantidad exacta', 'para decir que no hay nada'] },
  'about': { q: 'para dar una cantidad aproximada', d: [
    'para dar la cantidad exacta', 'para dar el máximo', 'para decir que no se sabe nada'] },
  'only': { q: 'para decir que no hay nada más que eso', d: [
    'para decir que hay de más', 'para decir que hay varios', 'para decir que falta'] },
  'quite': { q: 'para subir un poco el tono de una cualidad, sin exagerar', d: [
    'para llevarla al extremo', 'para bajarla del todo', 'para negarla'] },
  'very': { q: 'para subir mucho el tono de una cualidad', d: [
    'para bajarlo', 'para dejarlo igual', 'para negar la cualidad'] },
  'maybe': { q: 'para decir que algo es posible pero no seguro', d: [
    'para decir que es seguro', 'para decir que es imposible', 'para decir que ya pasó'] },
  'everything': { q: 'para hablar de todas las cosas', d: [
    'para hablar de una sola cosa', 'para hablar de ninguna cosa', 'para hablar de todas las personas'] },
  'nothing': { q: 'para decir que no hay ninguna cosa', d: [
    'para decir que están todas', 'para decir que hay una', 'para decir que no hay nadie'] },
  'something': { q: 'para hablar de una cosa sin decir cuál', d: [
    'para hablar de todas las cosas', 'para hablar de ninguna', 'para hablar de una persona sin decir quién'] },
  'everybody': { q: 'para hablar de todas las personas', d: [
    'para hablar de una sola persona', 'para hablar de ninguna persona', 'para hablar de todas las cosas'] },
  'somebody': { q: 'para hablar de una persona sin decir quién', d: [
    'para hablar de todas las personas', 'para hablar de ninguna persona', 'para hablar de una cosa sin decir cuál'] },
  'nobody': { q: 'para decir que no hay ninguna persona', d: [
    'para decir que están todas', 'para decir que hay alguien', 'para decir que no hay ninguna cosa'] },

  //== PALABRAS QUE ENLAZAN · Conectores =====================================
  'and': { q: 'para sumar una cosa a otra', d: [
    'para elegir entre dos', 'para oponer una a la otra', 'para dar el motivo'] },
  'or': { q: 'para presentar dos opciones entre las que se elige', d: [
    'para sumar una cosa a otra', 'para dar el motivo', 'para marcar el final'] },
  'but': { q: 'para oponer algo a lo que se acaba de decir', d: [
    'para sumar algo parecido', 'para dar el motivo', 'para poner un ejemplo'] },
  'because': { q: 'para dar el motivo de algo', d: [
    'para dar el resultado', 'para poner una condición', 'para sumar otra idea'] },
  'so': { q: 'para presentar el resultado de lo anterior', d: [
    'para presentar el motivo', 'para presentar una condición', 'para presentar un ejemplo'] },
  'if': { q: 'para poner una condición', d: [
    'para dar el motivo', 'para dar el resultado', 'para marcar el momento'] },
  'also': { q: 'para sumar otra cosa a lo dicho', d: [
    'para quitar algo de lo dicho', 'para oponerse a lo dicho', 'para cerrar el tema'] },
  'besides': { q: 'para añadir un motivo más a lo ya dicho', d: [
    'para quitarle fuerza a lo dicho', 'para poner una condición', 'para dar el resultado'] },
  'however': { q: 'para contradecir lo anterior, en un tono más formal', d: [
    'para sumar otra idea igual', 'para dar el resultado', 'para poner un ejemplo'] },
  'although': { q: 'para admitir algo que va en contra y aun así seguir', d: [
    'para dar el motivo', 'para dar el resultado', 'para poner una condición'] },
  'instead': { q: 'para decir que una cosa reemplaza a la otra', d: [
    'para decir que las dos van juntas', 'para dar el motivo', 'para dar el resultado'] },
  'that is why': { q: 'para presentar la consecuencia de lo dicho', d: [
    'para presentar el motivo', 'para presentar una duda', 'para presentar un ejemplo'] },
  'in order to': { q: 'para explicar para qué se hace algo', d: [
    'para explicar por qué pasó', 'para poner una condición', 'para marcar el momento'] },
  'first of all': { q: 'para presentar lo primero de una lista', d: [
    'para presentar lo último', 'para añadir algo en medio', 'para cerrar el tema'] },
  'then': { q: 'para decir lo que viene después', d: [
    'para decir lo que venía antes', 'para decir que ocurren a la vez', 'para dar el motivo'] },
  'before': { q: 'para situar algo antes de otro momento', d: [
    'para situarlo después', 'para decir que ocurren a la vez', 'para decir cuánto duró'] },
  'after': { q: 'para situar algo después de otro momento', d: [
    'para situarlo antes', 'para decir que ocurren a la vez', 'para poner una condición'] },
  'while': { q: 'para decir que dos cosas pasan a la vez', d: [
    'para decir que una pasa antes', 'para decir que una pasa después', 'para dar el motivo'] },
  'during': { q: 'para decir en qué periodo ocurre algo', d: [
    'para decir en qué momento exacto empezó', 'para decir cuánto falta', 'para dar el motivo'] },
  'until': { q: 'para marcar el momento en que algo se detiene', d: [
    'para marcar el momento en que empieza', 'para decir cada cuánto pasa', 'para dar el motivo'] },
  'since': { q: 'para marcar desde cuándo pasa algo', d: [
    'para marcar hasta cuándo pasa', 'para decir cuánto falta', 'para decir cada cuánto pasa'] },
  'as soon as': { q: 'para decir que algo pasa justo después de otra cosa', d: [
    'para decir que pasa mucho después', 'para decir que pasa antes', 'para decir que no llega a pasar'] },
  'finally': { q: 'para presentar lo último de una serie', d: [
    'para presentar lo primero', 'para añadir algo en medio', 'para dar el motivo'] },
  'in the end': { q: 'para contar cómo terminó todo', d: [
    'para contar cómo empezó', 'para poner una condición', 'para dar un ejemplo'] },
  'both': { q: 'para referirte a las dos cosas o personas juntas', d: [
    'para referirte a una sola', 'para referirte a ninguna', 'para referirte a muchas'] },
  'with': { q: 'para decir que algo o alguien va acompañado', d: [
    'para decir que va sin compañía', 'para decir de quién es', 'para decir de dónde viene'] },
  'without': { q: 'para decir que algo falta o que se hace sin ello', d: [
    'para decir que está incluido', 'para decir que sobra', 'para decir dónde está'] },

  //== PERSONAS Y TRATO · Familia y parientes ================================
  'to be born': { q: 'para decir que alguien vino al mundo', d: [
    'para decir que alguien se hizo mayor', 'para decir que alguien se casó', 'para decir que alguien se mudó'] },
  'to grow up': { q: 'para decir que alguien se hace mayor con los años', d: [
    'para decir que alguien acaba de nacer', 'para decir que alguien creció de estatura esta semana', 'para decir que alguien envejeció de golpe'] },
  'to look like': { q: 'para decir que alguien se parece a otra persona', d: [
    'para decir que le cae bien', 'para decir que lo está mirando', 'para decir que lo cuida'] },
  'to take care of': { q: 'para decir que te haces cargo de alguien o algo', d: [
    'para decir que te pareces a alguien', 'para decir que lo dejas solo', 'para decir que lo visitas'] },

  //== PERSONAS Y TRATO · Gente cercana ======================================
  'to meet': { q: 'para decir que conoces a alguien por primera vez', d: [
    'para decir que quedas con un amigo de siempre', 'para decir que te despides', 'para decir que lo presentas a otro'] },
  'to introduce': { q: 'para decir que le presentas una persona a otra', d: [
    'para decir que la conociste tú', 'para decir que te despides de ella', 'para decir que hablas de ella a sus espaldas'] },
  'to make friends': { q: 'para decir que empiezas amistades nuevas', d: [
    'para decir que pierdes las que tenías', 'para decir que discutes con alguien', 'para decir que vives con alguien'] },
  'to trust': { q: 'para decir que crees en alguien y le dejas lo importante', d: [
    'para decir que dudas de esa persona', 'para decir que la conociste ayer', 'para decir que le pides un favor'] },
  'to get along': { q: 'para decir que dos personas se llevan bien', d: [
    'para decir que se pelean seguido', 'para decir que se acaban de conocer', 'para decir que viven juntas'] },
  'to argue': { q: 'para decir que dos personas discuten', d: [
    'para decir que se llevan bien', 'para decir que conversan de cualquier cosa', 'para decir que se despiden'] },

  //== PERSONAS Y TRATO · Sentimientos =======================================
  'to cry': { q: 'para decir que a alguien le salen las lágrimas', d: [
    'para decir que se ríe', 'para decir que grita de alegría', 'para decir que se queda callado'] },
  'to laugh': { q: 'para decir que algo te causa risa', d: [
    'para decir que te salen las lágrimas', 'para decir que sonríes sin ruido', 'para decir que te enojas'] },
  'to smile': { q: 'para decir que se te dibuja una sonrisa, sin ruido', d: [
    'para decir que sueltas una carcajada', 'para decir que lloras', 'para decir que saludas con la mano'] },
  'to miss someone': { q: 'para decir que sientes la falta de una persona lejana', d: [
    'para decir que se te olvidó su nombre', 'para decir que la buscas por la casa', 'para decir que no la soportas'] },
  'to cheer up': { q: 'para decir que alguien recupera el ánimo', d: [
    'para decir que se pone triste', 'para decir que se enoja', 'para decir que se calma'] },

  //== PERSONAS Y TRATO · Ocio y planes ======================================
  'Do you want to go out?': { q: 'para proponerle un plan a alguien', d: [
    'para preguntar si ya se va', 'para pedirle que salga del cuarto', 'para preguntar dónde estuvo'] },
  'What are you doing today?': { q: 'para preguntar por los planes de hoy', d: [
    'para preguntar qué hizo ayer', 'para preguntar a qué se dedica', 'para preguntar cómo está'] },
  'to plan': { q: 'para decir que preparas algo con antelación', d: [
    'para decir que lo dejas al azar', 'para decir que ya lo hiciste', 'para decir que lo cancelas'] },
  'to go out': { q: 'para decir que sales a hacer algo fuera de casa', d: [
    'para decir que te quedas en casa', 'para decir que llegas a casa', 'para decir que invitas a alguien'] },
  'to meet up': { q: 'para decir que quedas con alguien en un sitio', d: [
    'para decir que lo conoces por primera vez', 'para decir que te despides', 'para decir que lo llamas por teléfono'] },
  'to invite': { q: 'para decir que llamas a alguien a un plan tuyo', d: [
    'para decir que aceptas el plan de otro', 'para decir que lo rechazas', 'para decir que lo cancelas'] },
  'to celebrate': { q: 'para decir que festejas algo bueno', d: [
    'para decir que lo lamentas', 'para decir que lo preparas', 'para decir que lo olvidas'] },
  'to have fun': { q: 'para decir que la estás pasando bien', d: [
    'para decir que te aburres', 'para decir que trabajas', 'para decir que descansas'] },
  "Let's go!": { q: 'para animar al grupo a arrancar ya', d: [
    'para pedir que esperen', 'para despedirte', 'para preguntar a dónde van'] },
  'to win': { q: 'para decir que quedas por delante en un juego', d: [
    'para decir que quedas por detrás', 'para decir que empatan', 'para decir que no juegas'] },
  'to lose': { q: 'para decir que quedas por detrás en un juego', d: [
    'para decir que quedas por delante', 'para decir que se te perdió algo en la casa', 'para decir que te retiras'] },

  //== PERSONAS Y TRATO · Muletillas y expresiones ===========================
  'well': { q: 'para tomar aire antes de responder, mientras ordenas la idea', d: [
    'para cerrar la conversación', 'para negar lo dicho', 'para preguntar algo'] },
  'of course': { q: 'para decir que sí, que es evidente', d: [
    'para ponerlo en duda', 'para negarlo', 'para preguntar por qué'] },
  'Of course not': { q: 'para negar algo que te parece evidente', d: [
    'para aceptarlo sin dudar', 'para decir que no estás seguro', 'para pedir permiso'] },
  'right?': { q: 'para pedirle a la otra persona que confirme lo que dijiste', d: [
    'para responder que sí', 'para cambiar de tema', 'para pedir permiso'] },
  'really?': { q: 'para mostrar sorpresa por lo que te acaban de contar', d: [
    'para confirmar lo que tú dijiste', 'para negar algo', 'para despedirte'] },
  'I think so': { q: 'para decir que crees que sí, sin estar seguro', d: [
    'para decir que estás seguro del todo', 'para decir que crees que no', 'para decir que no tienes idea'] },
  "I don't think so": { q: 'para decir que crees que no, sin estar seguro', d: [
    'para decir que seguro que no', 'para decir que crees que sí', 'para decir que te da igual'] },
  "I don't know": { q: 'para decir que no tienes el dato', d: [
    'para decir que crees que sí', 'para decir que no estás de acuerdo', 'para decir que no entendiste'] },
  'I hope so': { q: 'para decir que ojalá pase', d: [
    'para decir que ya pasó', 'para decir que no te importa', 'para decir que es seguro'] },
  'It depends': { q: 'para decir que la respuesta cambia según el caso', d: [
    'para dar una respuesta cerrada', 'para negarlo todo', 'para cambiar de tema'] },
  "let's see": { q: 'para ganar un momento mientras miras o piensas', d: [
    'para dar la respuesta final', 'para despedirte', 'para negar lo dicho'] },
  'Let me think': { q: 'para pedir un momento antes de responder', d: [
    'para responder de inmediato', 'para pedir que repitan', 'para cerrar el tema'] },
  "that's right": { q: 'para confirmar que lo dicho es correcto', d: [
    'para corregir lo dicho', 'para ponerlo en duda', 'para preguntarlo'] },
  'exactly': { q: 'para confirmar con fuerza que es justo eso', d: [
    'para decir que es más o menos', 'para negarlo', 'para dudarlo'] },
  "you're right": { q: 'para reconocerle la razón a la otra persona', d: [
    'para quitársela', 'para dudar de lo que dice', 'para cambiar de tema'] },
  'I agree': { q: 'para decir que piensas lo mismo', d: [
    'para decir que piensas distinto', 'para decir que no entendiste', 'para pedir permiso'] },
  'I disagree': { q: 'para decir que piensas distinto', d: [
    'para decir que piensas lo mismo', 'para decir que no sabes', 'para felicitar'] },
  'Are you sure?': { q: 'para pedirle a alguien que confirme si está seguro', d: [
    'para confirmar tú mismo', 'para negar lo dicho', 'para agradecer'] },
  'What do you mean?': { q: 'para pedir que aclaren lo que quisieron decir', d: [
    'para avisar que ya entendiste', 'para dar tu opinión', 'para cambiar de tema'] },
  'no problem': { q: 'para quitarle importancia a algo o aceptar un favor sin queja', d: [
    'para avisar que hay un problema grave', 'para pedir disculpas', 'para despedirte'] },
  "don't worry": { q: 'para calmar a alguien que está preocupado', d: [
    'para preocuparlo', 'para pedirle un favor', 'para despedirte'] },
  'more or less': { q: 'para decir que algo es así a medias', d: [
    'para decir que es exacto', 'para negarlo', 'para preguntarlo'] },
  'anyway': { q: 'para retomar el hilo después de un rodeo', d: [
    'para empezar el rodeo', 'para dar el motivo', 'para poner un ejemplo'] },
  'in fact': { q: 'para reforzar lo dicho con un dato real', d: [
    'para poner en duda lo dicho', 'para cambiar de tema', 'para cerrar la conversación'] },
  'for example': { q: 'para presentar un caso que ilustra lo dicho', d: [
    'para dar el motivo', 'para dar el resultado', 'para cerrar la lista'] },
  'by the way': { q: 'para meter un tema nuevo que se te acaba de ocurrir', d: [
    'para volver al tema anterior', 'para cerrar la conversación', 'para dar el motivo'] },
  "that's all": { q: 'para avisar que no hay nada más que decir o pedir', d: [
    'para avisar que falta lo más importante', 'para empezar una lista', 'para pedir más'] },
  'What a pity!': { q: 'para lamentar algo que salió mal', d: [
    'para celebrar algo bueno', 'para dar las gracias', 'para pedir disculpas'] },
  'Congratulations!': { q: 'para felicitar a alguien por algo bueno que logró', d: [
    'para consolarlo por algo malo', 'para pedirle un favor', 'para despedirte'] },
  'Good luck!': { q: 'para desearle suerte a alguien antes de algo difícil', d: [
    'para felicitarlo cuando ya lo logró', 'para consolarlo si salió mal', 'para agradecerle'] },

  //== VIDA DIARIA · La casa y los quehaceres ================================
  'to move': { q: 'para decir que te vas a vivir a otra casa', d: [
    'para decir que cambias un mueble de sitio', 'para decir que sales de viaje', 'para decir que arreglas la casa'] },
  'to clean': { q: 'para decir que quitas la suciedad de un sitio', d: [
    'para decir que pones las cosas en su lugar', 'para decir que botas lo que sobra', 'para decir que arreglas algo roto'] },
  'to wash': { q: 'para decir que lavas algo con agua', d: [
    'para decir que le quitas el agua', 'para decir que le quitas las arrugas', 'para decir que lo barres'] },
  'to wash the dishes': { q: 'para decir que lavas los platos después de comer', d: [
    'para decir que lavas la ropa', 'para decir que pones la mesa', 'para decir que preparas la comida'] },
  'to do the laundry': { q: 'para decir que lavas la ropa', d: [
    'para decir que lavas los platos', 'para decir que le quitas las arrugas a la ropa', 'para decir que la guardas en el clóset'] },
  'to dry': { q: 'para decir que le quitas el agua a algo', d: [
    'para decir que lo mojas', 'para decir que lo lavas', 'para decir que lo planchas'] },
  'to iron': { q: 'para decir que le quitas las arrugas a la ropa con calor', d: [
    'para decir que la lavas', 'para decir que la secas', 'para decir que la doblas'] },
  'to sweep': { q: 'para decir que juntas la basura del piso con una escoba', d: [
    'para decir que pasas un trapo mojado por el piso', 'para decir que aspiras la alfombra', 'para decir que limpias el polvo de los muebles'] },
  'to mop': { q: 'para decir que pasas un trapo mojado por el piso', d: [
    'para decir que barres con una escoba', 'para decir que aspiras la alfombra', 'para decir que sacas la basura'] },
  'to vacuum': { q: 'para decir que limpias con una máquina que aspira', d: [
    'para decir que barres con una escoba', 'para decir que trapeas', 'para decir que lavas a mano'] },
  'to dust': { q: 'para decir que le quitas el polvo a los muebles', d: [
    'para decir que barres el piso', 'para decir que lavas las ventanas', 'para decir que sacas la basura'] },
  'to make the bed': { q: 'para decir que dejas la cama estirada al levantarte', d: [
    'para decir que te acuestas', 'para decir que cambias las sábanas', 'para decir que ordenas el cuarto'] },
  'to tidy up': { q: 'para decir que pones cada cosa en su lugar', d: [
    'para decir que quitas la suciedad', 'para decir que botas lo que no sirve', 'para decir que lavas'] },
  'to throw away': { q: 'para decir que te deshaces de algo que ya no sirve', d: [
    'para decir que lo guardas por si acaso', 'para decir que lo regalas', 'para decir que lo arreglas'] },
  'to take out the trash': { q: 'para decir que sacas la basura de la casa', d: [
    'para decir que la juntas del piso', 'para decir que lavas el bote', 'para decir que ordenas la cocina'] },
  'to fix': { q: 'para decir que dejas funcionando algo que estaba roto', d: [
    'para decir que lo rompes', 'para decir que lo botas', 'para decir que lo limpias'] },
  'to water the plants': { q: 'para decir que les echas agua a las plantas', d: [
    'para decir que las siembras', 'para decir que las podas', 'para decir que las cambias de maceta'] },

  //== VIDA DIARIA · Compras y dinero ========================================
  'to buy': { q: 'para decir que te llevas algo pagando por ello', d: [
    'para decir que se lo vendes a otro', 'para decir que lo devuelves', 'para decir que lo prestas'] },
  'to sell': { q: 'para decir que le entregas algo a alguien a cambio de dinero', d: [
    'para decir que lo compras tú', 'para decir que lo regalas', 'para decir que lo cambias'] },
  'to pay': { q: 'para decir que entregas el dinero que debes', d: [
    'para decir que recibes el vuelto', 'para decir que pides el precio', 'para decir que ahorras'] },
  'to cost': { q: 'para decir cuánto vale algo', d: [
    'para decir cuánto dinero tienes', 'para decir cuánto gastaste', 'para decir cuánto ahorraste'] },
  'How much is it?': { q: 'para preguntar el precio de algo', d: [
    'para preguntar cuántos quedan', 'para pedir un descuento', 'para preguntar si aceptan tarjeta'] },
  'to spend': { q: 'para decir que se te va el dinero en algo', d: [
    'para decir que lo guardas para después', 'para decir que lo ganas', 'para decir que lo prestas'] },
  'to save money': { q: 'para decir que guardas dinero para después', d: [
    'para decir que se te va en compras', 'para decir que lo prestas', 'para decir que lo pierdes'] },
  'to return': { q: 'para decir que llevas de vuelta algo que compraste', d: [
    'para decir que lo compras', 'para decir que lo cambias por otro color', 'para decir que lo regalas'] },
  'to look for': { q: 'para decir que andas buscando algo', d: [
    'para decir que ya lo encontraste', 'para decir que lo perdiste', 'para decir que lo escondiste'] },
  'to choose': { q: 'para decir que te quedas con una opción entre varias', d: [
    'para decir que las quieres todas', 'para decir que ninguna te sirve', 'para decir que lo pagas'] },

  //== VIDA DIARIA · Salud ===================================================
  'to hurt': { q: 'para decir que una parte del cuerpo te duele', d: [
    'para decir que ya te curaste', 'para decir que te sientes cansado', 'para decir que te caíste'] },
  'to feel': { q: 'para hablar de cómo te sientes por dentro', d: [
    'para hablar de cómo te ven los demás', 'para hablar de lo que tocas con la mano', 'para hablar de lo que opinas'] },
  'to breathe': { q: 'para decir que tomas y sueltas aire', d: [
    'para decir que soplas una vela', 'para decir que toses', 'para decir que hablas bajito'] },
  'to rest': { q: 'para decir que paras un rato para recuperarte', d: [
    'para decir que te duermes toda la noche', 'para decir que haces ejercicio', 'para decir que trabajas'] },
  'to get better': { q: 'para decir que alguien va mejorando de una enfermedad', d: [
    'para decir que empeora', 'para decir que se enfermó', 'para decir que fue al doctor'] },

  //== VIDA DIARIA · Aparatos e internet =====================================
  'to charge': { q: 'para decir que le devuelves la energía a la batería', d: [
    'para decir que la gastas', 'para decir que apagas el aparato', 'para decir que lo enciendes'] },
  'to turn on': { q: 'para decir que le das corriente a un aparato para que funcione', d: [
    'para decir que lo dejas sin funcionar', 'para decir que lo desenchufas', 'para decir que lo cargas'] },
  'to turn off': { q: 'para decir que dejas un aparato sin funcionar', d: [
    'para decir que lo pones en marcha', 'para decir que lo cargas', 'para decir que le subes el volumen'] },
  'to press': { q: 'para decir que empujas un botón con el dedo', d: [
    'para decir que giras una perilla', 'para decir que lo miras', 'para decir que lo enciendes'] },
  "It doesn't work": { q: 'para avisar que algo no funciona', d: [
    'para avisar que no lo sabes usar', 'para avisar que no tienes trabajo', 'para avisar que está apagado'] },
  'to log in': { q: 'para decir que entras a una cuenta con tu usuario y contraseña', d: [
    'para decir que sales de la cuenta', 'para decir que creas una cuenta nueva', 'para decir que cambias la contraseña'] },
  'to click': { q: 'para decir que tocas algo en la pantalla o con el ratón', d: [
    'para decir que escribes en el teclado', 'para decir que arrastras un archivo', 'para decir que lo lees'] },
  'to search': { q: 'para decir que buscas algo en internet', d: [
    'para decir que lo encuentras', 'para decir que lo publicas', 'para decir que lo guardas'] },
  'to download': { q: 'para decir que traes un archivo de internet a tu aparato', d: [
    'para decir que lo mandas a internet', 'para decir que lo borras', 'para decir que lo abres'] },
  'to install': { q: 'para decir que dejas un programa listo para usarse', d: [
    'para decir que lo quitas del aparato', 'para decir que lo pones al día', 'para decir que lo abres'] },
  'to update': { q: 'para decir que pones algo en su versión más nueva', d: [
    'para decir que lo instalas por primera vez', 'para decir que lo borras', 'para decir que lo apagas'] },
  'to delete': { q: 'para decir que quitas algo para siempre', d: [
    'para decir que lo guardas', 'para decir que lo escondes', 'para decir que lo copias'] },
  'to save': { q: 'para decir que dejas guardado un archivo o un cambio', d: [
    'para decir que lo borras', 'para decir que guardas dinero', 'para decir que lo compartes'] },
  'to send': { q: 'para decir que le haces llegar algo a alguien', d: [
    'para decir que lo recibes', 'para decir que lo guardas', 'para decir que lo borras'] },
  'to call': { q: 'para decir que llamas a alguien por teléfono', d: [
    'para decir que le escribes un mensaje', 'para decir que lo visitas', 'para decir que le contestas'] },
  'to post': { q: 'para decir que publicas algo para que otros lo vean', d: [
    'para decir que se lo mandas a una sola persona', 'para decir que lo guardas para ti', 'para decir que lo borras'] },

  //== VIDA DIARIA · Rutina y trámites =======================================
  'to wake up': { q: 'para decir que abres los ojos y dejas de dormir', d: [
    'para decir que sales de la cama', 'para decir que te duermes', 'para decir que te vistes'] },
  'to get up': { q: 'para decir que sales de la cama y te pones de pie', d: [
    'para decir que abres los ojos', 'para decir que te acuestas', 'para decir que te duermes'] },
  'to get ready': { q: 'para decir que te arreglas para salir', d: [
    'para decir que ya llegaste', 'para decir que te acuestas', 'para decir que descansas'] },
  'to leave home': { q: 'para decir que sales de tu casa', d: [
    'para decir que llegas a tu casa', 'para decir que te mudas', 'para decir que ordenas la casa'] },
  'to arrive': { q: 'para decir que llegas a un sitio', d: [
    'para decir que sales de ahí', 'para decir que vas de camino', 'para decir que te quedas'] },
  'to be late': { q: 'para decir que llegas después de la hora', d: [
    'para decir que llegas justo a tiempo', 'para decir que llegas antes', 'para decir que no vas'] },
  'to hurry': { q: 'para decir que te apuras porque no te da el tiempo', d: [
    'para decir que vas con calma', 'para decir que llegaste tarde', 'para decir que esperas'] },
  'to take a nap': { q: 'para decir que duermes un rato corto durante el día', d: [
    'para decir que duermes toda la noche', 'para decir que descansas sentado', 'para decir que te acuestas temprano'] },
  'to relax': { q: 'para decir que sueltas la tensión y te tranquilizas', d: [
    'para decir que te pones nervioso', 'para decir que te duermes', 'para decir que haces ejercicio'] },
  'to fill out': { q: 'para decir que escribes tus datos en un formulario', d: [
    'para decir que lo firmas', 'para decir que lo entregas', 'para decir que lo copias'] },
  'to sign': { q: 'para decir que pones tu firma en un papel', d: [
    'para decir que escribes tus datos', 'para decir que lo entregas', 'para decir que lo sellas'] },
  'to deliver': { q: 'para decir que dejas algo en manos de quien lo pidió', d: [
    'para decir que lo recibes', 'para decir que lo llenas', 'para decir que lo guardas'] },
  'to apply': { q: 'para decir que pides algo por la vía oficial', d: [
    'para decir que ya te lo dieron', 'para decir que lo renuevas', 'para decir que lo pagas'] },
  'to renew': { q: 'para decir que le das más tiempo de validez a un documento', d: [
    'para decir que lo pides por primera vez', 'para decir que se venció', 'para decir que lo firmas'] },

  //== COMIDA · Cocinar ======================================================
  'to cook': { q: 'para hablar de preparar comida, en general', d: [
    'para hablar de comerla', 'para hablar de comprarla', 'para hablar de servirla en el plato'] },
  'to bake': { q: 'para decir que cocinas algo en el horno, como el pan', d: [
    'para decir que lo cocinas en aceite caliente', 'para decir que lo cocinas en agua hirviendo', 'para decir que lo cocinas sobre las brasas'] },
  'to fry': { q: 'para decir que cocinas algo en aceite caliente', d: [
    'para decir que lo cocinas en agua hirviendo', 'para decir que lo cocinas en el horno', 'para decir que lo dejas crudo'] },
  'to boil': { q: 'para decir que cocinas algo en agua hirviendo', d: [
    'para decir que lo cocinas en aceite', 'para decir que lo metes al horno', 'para decir que lo congelas'] },
  'to grill': { q: 'para decir que cocinas algo sobre las brasas o la parrilla', d: [
    'para decir que lo hierves', 'para decir que lo fríes en aceite', 'para decir que lo picas'] },
  'to roast': { q: 'para decir que cocinas una pieza grande al horno, como un pollo', d: [
    'para decir que la hierves', 'para decir que la pasas por la sartén', 'para decir que la congelas'] },
  'to cut': { q: 'para decir que partes algo con un cuchillo', d: [
    'para decir que lo pelas', 'para decir que lo revuelves', 'para decir que lo aplastas'] },
  'to chop': { q: 'para decir que cortas algo en trozos pequeños', d: [
    'para decir que lo partes en dos', 'para decir que le quitas la cáscara', 'para decir que lo mezclas'] },
  'to mix': { q: 'para decir que juntas y revuelves varios ingredientes', d: [
    'para decir que los separas', 'para decir que los cortas', 'para decir que los sirves'] },
  'to add': { q: 'para decir que le echas un ingrediente más', d: [
    'para decir que se lo quitas', 'para decir que lo revuelves', 'para decir que lo pruebas'] },
  'to peel': { q: 'para decir que le quitas la cáscara a una fruta o verdura', d: [
    'para decir que la cortas en trozos', 'para decir que la lavas', 'para decir que la cocinas'] },
  'to season': { q: 'para decir que le pones sal y especias a la comida', d: [
    'para decir que la revuelves', 'para decir que la calientas', 'para decir que la pruebas'] },
  'to serve': { q: 'para decir que pones la comida en el plato de quien va a comer', d: [
    'para decir que la preparas', 'para decir que la guardas', 'para decir que la pruebas'] },
  'to heat': { q: 'para decir que pones algo más caliente', d: [
    'para decir que lo enfrías', 'para decir que lo cocinas desde crudo', 'para decir que lo congelas'] },
  'to freeze': { q: 'para decir que dejas algo bien frío para que dure', d: [
    'para decir que lo calientas', 'para decir que lo cocinas', 'para decir que lo dejas al aire'] },

  //== COMIDA · Bebidas y restaurante ========================================
  'to drink': { q: 'para hablar de tomar un líquido', d: [
    'para hablar de comer algo sólido', 'para hablar de servir la mesa', 'para hablar de brindar'] },
  'Cheers!': { q: 'para brindar antes del primer trago', d: [
    'para agradecer la comida', 'para pedir otra ronda', 'para despedirte de la mesa'] },
  'to order': { q: 'para decir que le pides al mesero lo que vas a comer', d: [
    'para decir que pagas la cuenta', 'para decir que reservas la mesa', 'para decir que pruebas el plato'] },
  'to try': { q: 'para decir que pruebas algo para saber cómo sabe', d: [
    'para decir que te lo comes entero', 'para decir que lo pides', 'para decir que lo cocinas'] },
  'takeout': { q: 'para pedir la comida y llevártela en vez de comer ahí', d: [
    'para pedir una mesa para comer ahí', 'para pedir que traigan la cuenta', 'para pedir una porción más'] },
  'The bill, please': { q: 'para pedir que traigan lo que hay que pagar', d: [
    'para pedir la carta', 'para pedir una mesa', 'para pedir otro plato'] },
  'What do you recommend?': { q: 'para pedirle al mesero que sugiera un plato', d: [
    'para preguntar el precio', 'para pedir la cuenta', 'para preguntar si hay mesa'] },
  'Are you ready to order?': { q: 'lo que dice el mesero para saber si ya eligieron', d: [
    'lo que dices tú para pedir la cuenta', 'lo que dices para reservar', 'lo que dice el mesero al despedirse'] },
  'Enjoy your meal': { q: 'para desearle buen provecho a quien va a comer', d: [
    'para agradecer la comida al terminar', 'para pedir la cuenta', 'para brindar'] },
  "I'm full": { q: 'para decir que ya no te cabe más comida', d: [
    'para decir que tienes mucha hambre', 'para decir que la comida estuvo rica', 'para pedir la cuenta'] },

  //== VIAJE =================================================================
  'to book': { q: 'para decir que apartas un lugar con antelación', d: [
    'para decir que lo pagas al llegar', 'para decir que lo cancelas', 'para decir que te registras al entrar'] },
  'to check in': { q: 'para decir que te registras al llegar al hotel o al aeropuerto', d: [
    'para decir que entregas la habitación al irte', 'para decir que reservas por internet', 'para decir que subes al avión'] },
  'to check out': { q: 'para decir que entregas la habitación y te vas del hotel', d: [
    'para decir que te registras al llegar', 'para decir que reservas la habitación', 'para decir que pides el desayuno'] },
  'to pack': { q: 'para decir que metes tus cosas en la maleta', d: [
    'para decir que las sacas al llegar', 'para decir que facturas el equipaje', 'para decir que compras una maleta'] },
  'to board': { q: 'para decir que subes al avión', d: [
    'para decir que bajas de él', 'para decir que pasas por seguridad', 'para decir que recoges la maleta'] },
  'to fly': { q: 'para decir que vas por el aire, en avión', d: [
    'para decir que vas por tierra', 'para decir que despegas', 'para decir que aterrizas'] },
  'to get on': { q: 'para decir que subes a un bus o a un tren', d: [
    'para decir que te bajas de él', 'para decir que lo esperas', 'para decir que pagas el pasaje'] },
  'to get off': { q: 'para decir que te bajas de un bus o de un tren', d: [
    'para decir que subes a él', 'para decir que lo pierdes', 'para decir que lo esperas'] },
  'to wait': { q: 'para decir que dejas pasar el tiempo hasta que algo llegue', d: [
    'para decir que te vas sin esperar', 'para decir que llegas tarde', 'para decir que te apuras'] },
  'to drive': { q: 'para decir que manejas un vehículo', d: [
    'para decir que viajas de pasajero', 'para decir que te subes al bus', 'para decir que caminas'] },
  'to park': { q: 'para decir que dejas el carro estacionado', d: [
    'para decir que arrancas', 'para decir que le pones gasolina', 'para decir que lo manejas'] },
  'to rent a car': { q: 'para decir que pagas por usar un carro unos días', d: [
    'para decir que lo compras', 'para decir que lo vendes', 'para decir que lo prestas'] },
  'to visit': { q: 'para decir que vas a ver un lugar o a una persona', d: [
    'para decir que vives ahí', 'para decir que te vas de ahí', 'para decir que trabajas ahí'] },
  'to take a photo': { q: 'para decir que haces una foto', d: [
    'para decir que la miras', 'para decir que la mandas', 'para decir que posas para ella'] },
  'to swim': { q: 'para decir que te mueves por el agua', d: [
    'para decir que te sumerges con tanque', 'para decir que caminas por la playa', 'para decir que te tiras al sol'] },
  'to dive': { q: 'para decir que te sumerges a mirar el fondo del mar', d: [
    'para decir que nadas en la superficie', 'para decir que pescas desde la orilla', 'para decir que navegas en barco'] },

  //== EL MUNDO ==============================================================
  'to feed': { q: 'para decir que le das de comer a un animal', d: [
    'para decir que lo sacas a pasear', 'para decir que lo bañas', 'para decir que comes tú'] },
  'to bark': { q: 'para nombrar el sonido que hace un perro', d: [
    'para nombrar el del gato', 'para nombrar el de un pájaro', 'para nombrar el de una puerta vieja'] },
  'to plant': { q: 'para decir que pones una semilla en la tierra', d: [
    'para decir que recoges lo sembrado', 'para decir que riegas', 'para decir que cortas una flor'] },
};
