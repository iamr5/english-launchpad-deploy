"""Genera src/content/speaking_bank.js: 500 ítems por nivel (A1–C1).

Cada nivel tiene sus propios contextos, enunciados y frases modelo, alineados al
sílabo Cambridge/MCER: A1 y A2 hablan de la vida cotidiana; la ingeniería entra
poco a poco desde B1 (0% en A1, ~10% A2, ~25% B1, ~40% B2, ~50% C1).

Cada ítem lleva su traducción al español (`es`, `promptEs`, `taskEs`) y una glosa
de palabras clave (`gloss`). Las traducciones se escriben a mano sobre las
matrices y se propagan al banco completo: nada de traducción automática.
"""
import json
from collections import Counter
from pathlib import Path

levels = [('modulo-1', 'A1'), ('modulo-2', 'A2'), ('modulo-3', 'B1'), ('modulo-4', 'B2'), ('modulo-5', 'C1')]

# ---------------------------------------------------------------- enunciados
# A1 y A2: temas personales y cotidianos. B1+ sube a trabajo, opinión y análisis.
frames = {
'A1': ['Introduce yourself to {person}.','Say your name, your age and where you live.','Say where you live and who lives with you.','Describe your normal morning before {event}.','Say what you eat for {object}.','Say what you like about {topic}.','Describe {object} using colors and size.','Tell {person} what time {event} starts.','Ask for {object} politely.','Spell your name and your email for {person}.','Count from one to ten and say a phone number.','Describe your family to {person}.','Say where {place} is.','Invite {person} to {event}.','Say what you do every day at {place}.','Describe today’s weather and your plans.','Ask two simple questions to {person}.','Say what you need for {process}.','Say what you can and cannot do today.','Leave a short voice message for {person}.'],
'A2': ['Describe what you did during {event}.','Compare two options for {object}.','Explain your plans for {event}.','Give directions to {place}.','Make a polite request to {person} about {object}.','Describe a small problem with {object} and how you fixed it.','Tell a short story about {topic}.','Explain step by step how to do {process}.','Recommend {place} to {person}.','Describe how {place} has changed.','Say that you will be late for {event} and why.','Arrange a time to meet {person}.','Explain a simple rule about {process}.','Describe your experience using {object}.','Talk about a goal related to {topic}.','Say what you were doing during {event}.','Offer help to {person} with {process}.','Repeat a simple message from {person}.','Say the good and bad points of {object}.','Record a short update for {person} about {event}.'],
'B1': ['Explain a problem you solved during {event}.','Give and justify your opinion about {topic}.','Describe a project involving {process}.','Compare alternatives for {object} and recommend one.','Report the causes and effects of {event}.','Explain a process to a new colleague at {place}.','Handle a disagreement with {person}.','Describe lessons learned from {event}.','Present progress on {topic}.','Respond to a complaint about {object}.','Explain a decision related to {process}.','Tell a detailed story about {event}.','Discuss risks connected to {object}.','Propose improvements for {place}.','Summarize a conversation with {person}.','Explain how {topic} has changed.','Give advice to someone preparing for {event}.','Describe evidence supporting an idea about {topic}.','Negotiate a practical change with {person}.','Record a structured status update about {process}.'],
'B2': ['Present and defend a proposal about {topic}.','Explain a complex process involving {object}.','Compare competing solutions for {process}.','Report an incident during {event} with causes and prevention.','Persuade {person} to change a decision about {topic}.','Lead a short briefing at {place}.','Explain uncertainty and assumptions about {object}.','Respond diplomatically to criticism from {person}.','Summarize technical information about {process} for a non-specialist.','Discuss ethical implications of {topic}.','Negotiate scope, time and quality for {event}.','Explain a trend affecting {place}.','Present risks and mitigations for {process}.','Challenge an idea politely in a meeting with {person}.','Give a balanced recommendation about {object}.','Describe a failure and corrective action during {event}.','Explain data or evidence related to {topic}.','Adapt instructions about {process} for a new team.','Handle difficult follow-up questions from {person}.','Deliver an executive update about {event}.'],
'C1': ['Deliver a nuanced argument about {topic}.','Present a strategic recommendation involving {process}.','Explain a highly complex issue about {object} to mixed audiences.','Respond persuasively to strong objections from {person}.','Lead a crisis briefing after {event}.','Evaluate assumptions behind a decision about {topic}.','Synthesize conflicting evidence about {process}.','Negotiate a high-stakes agreement with {person}.','Present a failure transparently and defend the response to {event}.','Explain long-term implications for {place}.','Reframe a difficult question about {object}.','Facilitate a disagreement between teams about {process}.','Deliver a concise board-level update on {topic}.','Argue both sides before recommending action about {object}.','Explain a technical trade-off without oversimplifying {process}.','Respond to an ethical challenge involving {event}.','Present a scenario analysis about {topic}.','Challenge an expert’s claim respectfully about {object}.','Close a complex negotiation with {person}.','Give a compelling final presentation about {process}.'],
}

frames_es = {
'A1': ['Preséntate ante {person}.','Di tu nombre, tu edad y dónde vives.','Di dónde vives y con quién vives.','Describe tu mañana normal antes de {event}.','Di qué comes en {object}.','Di qué te gusta de {topic}.','Describe {object} con colores y tamaño.','Dile a {person} a qué hora empieza {event}.','Pide {object} con cortesía.','Deletrea tu nombre y tu correo para {person}.','Cuenta del uno al diez y di un número de teléfono.','Describe a tu familia ante {person}.','Di dónde queda {place}.','Invita a {person} a {event}.','Di qué haces todos los días en {place}.','Describe el clima de hoy y tus planes.','Hazle dos preguntas simples a {person}.','Di qué necesitas para {process}.','Di qué puedes y qué no puedes hacer hoy.','Deja un mensaje de voz corto para {person}.'],
'A2': ['Describe qué hiciste durante {event}.','Compara dos opciones para {object}.','Explica tus planes para {event}.','Da indicaciones para llegar a {place}.','Haz una petición cortés a {person} sobre {object}.','Describe un problema pequeño con {object} y cómo lo resolviste.','Cuenta una historia corta sobre {topic}.','Explica paso a paso cómo hacer {process}.','Recomienda {place} a {person}.','Describe cómo ha cambiado {place}.','Avisa que llegarás tarde a {event} y por qué.','Coordina una hora para verte con {person}.','Explica una regla simple sobre {process}.','Describe tu experiencia usando {object}.','Habla de una meta relacionada con {topic}.','Di qué estabas haciendo durante {event}.','Ofrécele ayuda a {person} con {process}.','Repite un mensaje simple de {person}.','Di lo bueno y lo malo de {object}.','Graba una actualización corta para {person} sobre {event}.'],
'B1': ['Explica un problema que resolviste durante {event}.','Da y justifica tu opinión sobre {topic}.','Describe un proyecto que involucra {process}.','Compara alternativas para {object} y recomienda una.','Reporta las causas y los efectos de {event}.','Explica un proceso a un colega nuevo en {place}.','Maneja un desacuerdo con {person}.','Describe las lecciones aprendidas de {event}.','Presenta el avance sobre {topic}.','Responde a un reclamo sobre {object}.','Explica una decisión relacionada con {process}.','Cuenta una historia detallada sobre {event}.','Comenta los riesgos relacionados con {object}.','Propón mejoras para {place}.','Resume una conversación con {person}.','Explica cómo ha cambiado {topic}.','Da un consejo a alguien que se prepara para {event}.','Describe evidencia que respalda una idea sobre {topic}.','Negocia un cambio práctico con {person}.','Graba una actualización de estado ordenada sobre {process}.'],
'B2': ['Presenta y defiende una propuesta sobre {topic}.','Explica un proceso complejo que involucra {object}.','Compara soluciones que compiten para {process}.','Reporta un incidente durante {event} con causas y prevención.','Convence a {person} de cambiar una decisión sobre {topic}.','Dirige una reunión informativa corta en {place}.','Explica la incertidumbre y los supuestos sobre {object}.','Responde con diplomacia a una crítica de {person}.','Resume información técnica sobre {process} para alguien que no es especialista.','Discute las implicancias éticas de {topic}.','Negocia alcance, tiempo y calidad para {event}.','Explica una tendencia que afecta a {place}.','Presenta riesgos y medidas de mitigación para {process}.','Cuestiona una idea con cortesía en una reunión con {person}.','Da una recomendación equilibrada sobre {object}.','Describe una falla y la acción correctiva durante {event}.','Explica datos o evidencia relacionados con {topic}.','Adapta instrucciones sobre {process} para un equipo nuevo.','Maneja preguntas difíciles de seguimiento de {person}.','Entrega una actualización ejecutiva sobre {event}.'],
'C1': ['Desarrolla un argumento con matices sobre {topic}.','Presenta una recomendación estratégica que involucra {process}.','Explica un asunto muy complejo sobre {object} a públicos distintos.','Responde de forma persuasiva a objeciones fuertes de {person}.','Dirige una reunión de crisis después de {event}.','Evalúa los supuestos detrás de una decisión sobre {topic}.','Sintetiza evidencia contradictoria sobre {process}.','Negocia un acuerdo de alto riesgo con {person}.','Presenta una falla con transparencia y defiende la respuesta ante {event}.','Explica las implicancias de largo plazo para {place}.','Replantea una pregunta difícil sobre {object}.','Facilita un desacuerdo entre equipos sobre {process}.','Entrega una actualización breve a nivel directorio sobre {topic}.','Argumenta ambos lados antes de recomendar una acción sobre {object}.','Explica un trade-off técnico sin simplificar de más {process}.','Responde a un desafío ético relacionado con {event}.','Presenta un análisis de escenarios sobre {topic}.','Cuestiona con respeto la afirmación de un experto sobre {object}.','Cierra una negociación compleja con {person}.','Da una presentación final convincente sobre {process}.'],
}

# ------------------------------------------------------------------ contextos
# Dos familias por nivel: general (vida cotidiana / trabajo común) e ingeniería.
# En A1 la familia de ingeniería no se usa (proporción 0).
contexts_general = {
'A1': [
 {'person':'a new friend','place':'your house','event':'breakfast','object':'a cup of coffee','topic':'your family','process':'making breakfast'},
 {'person':'your teacher','place':'your school','event':'your English class','object':'a red notebook','topic':'your favorite food','process':'doing your homework'},
 {'person':'a neighbor','place':'the market','event':'lunch','object':'a small bag','topic':'your city','process':'buying fruit'},
 {'person':'a new colleague','place':'your office','event':'a coffee break','object':'a blue pen','topic':'learning English','process':'starting your day'},
 {'person':'a doctor','place':'the park','event':'the weekend','object':'a bottle of water','topic':'your daily routine','process':'walking to work'},
],
'A2': [
 {'person':'a friend','place':'a nice restaurant','event':'a weekend trip','object':'an old phone','topic':'your last vacation','process':'booking a hotel'},
 {'person':'a shop assistant','place':'the city center','event':'a birthday party','object':'a new jacket','topic':'your free time','process':'changing a ticket'},
 {'person':'a taxi driver','place':'the bus station','event':'a doctor’s appointment','object':'a suitcase','topic':'living in a big city','process':'getting to the airport'},
 {'person':'your teammate','place':'your office','event':'a training session','object':'a laptop','topic':'your job','process':'sending a short email'},
 {'person':'a landlord','place':'your apartment','event':'a family dinner','object':'a broken lamp','topic':'saving money','process':'paying a bill'},
],
'B1': [
 {'person':'a new colleague','place':'your office','event':'a team meeting','object':'a monthly report','topic':'learning English at work','process':'planning your week'},
 {'person':'a customer','place':'a training center','event':'a job interview','object':'a written proposal','topic':'teamwork','process':'preparing a presentation'},
 {'person':'your manager','place':'a partner company','event':'a deadline change','object':'a shared calendar','topic':'work-life balance','process':'organizing a schedule'},
 {'person':'a university friend','place':'a conference','event':'a group project','object':'a survey','topic':'studying abroad','process':'collecting feedback'},
 {'person':'a supplier','place':'a warehouse','event':'a delivery delay','object':'an order list','topic':'customer service','process':'tracking an order'},
],
'B2': [
 {'person':'a department head','place':'headquarters','event':'a quarterly review','object':'a budget proposal','topic':'remote work','process':'allocating resources'},
 {'person':'a demanding client','place':'a client office','event':'a contract negotiation','object':'a service agreement','topic':'professional ethics','process':'handling a complaint'},
 {'person':'a journalist','place':'an industry forum','event':'a public presentation','object':'a market study','topic':'artificial intelligence at work','process':'analyzing data'},
 {'person':'a new team','place':'a regional branch','event':'a reorganization','object':'a training plan','topic':'leadership','process':'onboarding new staff'},
 {'person':'an auditor','place':'a partner office','event':'an internal audit','object':'a compliance report','topic':'transparency','process':'documenting decisions'},
],
'C1': [
 {'person':'the board','place':'headquarters','event':'a strategic review','object':'a five-year plan','topic':'organizational change','process':'reallocating investment'},
 {'person':'a regulator','place':'a public hearing','event':'a policy debate','object':'a legal opinion','topic':'corporate responsibility','process':'assessing compliance'},
 {'person':'a skeptical investor','place':'an international summit','event':'a funding round','object':'a valuation model','topic':'long-term risk','process':'stress-testing assumptions'},
 {'person':'a rival executive','place':'a negotiation table','event':'a merger discussion','object':'a confidential memo','topic':'market consolidation','process':'building consensus'},
 {'person':'an expert panel','place':'a research institute','event':'a peer review','object':'a contested study','topic':'evidence and uncertainty','process':'reconciling conflicting data'},
],
}
contexts_general_es = {
'A1': [
 {'person':'un amigo nuevo','place':'tu casa','event':'el desayuno','object':'una taza de café','topic':'tu familia','process':'preparar el desayuno'},
 {'person':'tu profesor','place':'tu escuela','event':'tu clase de inglés','object':'un cuaderno rojo','topic':'tu comida favorita','process':'hacer la tarea'},
 {'person':'un vecino','place':'el mercado','event':'el almuerzo','object':'una bolsa pequeña','topic':'tu ciudad','process':'comprar fruta'},
 {'person':'un colega nuevo','place':'tu oficina','event':'la pausa del café','object':'un lapicero azul','topic':'aprender inglés','process':'empezar tu día'},
 {'person':'un doctor','place':'el parque','event':'el fin de semana','object':'una botella de agua','topic':'tu rutina diaria','process':'caminar al trabajo'},
],
'A2': [
 {'person':'un amigo','place':'un restaurante bonito','event':'un viaje de fin de semana','object':'un celular viejo','topic':'tus últimas vacaciones','process':'reservar un hotel'},
 {'person':'un vendedor','place':'el centro de la ciudad','event':'una fiesta de cumpleaños','object':'una casaca nueva','topic':'tu tiempo libre','process':'cambiar un pasaje'},
 {'person':'un taxista','place':'el terminal de buses','event':'una cita médica','object':'una maleta','topic':'vivir en una ciudad grande','process':'llegar al aeropuerto'},
 {'person':'tu compañero de equipo','place':'tu oficina','event':'una capacitación','object':'una laptop','topic':'tu trabajo','process':'enviar un correo corto'},
 {'person':'el dueño del departamento','place':'tu departamento','event':'una cena familiar','object':'una lámpara malograda','topic':'ahorrar dinero','process':'pagar un recibo'},
],
'B1': [
 {'person':'un colega nuevo','place':'tu oficina','event':'una reunión de equipo','object':'un informe mensual','topic':'aprender inglés en el trabajo','process':'planificar tu semana'},
 {'person':'un cliente','place':'un centro de capacitación','event':'una entrevista de trabajo','object':'una propuesta escrita','topic':'el trabajo en equipo','process':'preparar una presentación'},
 {'person':'tu jefe','place':'una empresa aliada','event':'un cambio de plazo','object':'un calendario compartido','topic':'el equilibrio entre trabajo y vida','process':'organizar un cronograma'},
 {'person':'un amigo de la universidad','place':'un congreso','event':'un trabajo grupal','object':'una encuesta','topic':'estudiar en el extranjero','process':'recoger comentarios'},
 {'person':'un proveedor','place':'un almacén','event':'un retraso de entrega','object':'una lista de pedidos','topic':'la atención al cliente','process':'hacer seguimiento a un pedido'},
],
'B2': [
 {'person':'un jefe de área','place':'la sede central','event':'una revisión trimestral','object':'una propuesta de presupuesto','topic':'el trabajo remoto','process':'asignar recursos'},
 {'person':'un cliente exigente','place':'la oficina del cliente','event':'una negociación de contrato','object':'un acuerdo de servicio','topic':'la ética profesional','process':'atender un reclamo'},
 {'person':'un periodista','place':'un foro del sector','event':'una presentación pública','object':'un estudio de mercado','topic':'la inteligencia artificial en el trabajo','process':'analizar datos'},
 {'person':'un equipo nuevo','place':'una sede regional','event':'una reorganización','object':'un plan de capacitación','topic':'el liderazgo','process':'integrar personal nuevo'},
 {'person':'un auditor','place':'la oficina de un aliado','event':'una auditoría interna','object':'un informe de cumplimiento','topic':'la transparencia','process':'documentar decisiones'},
],
'C1': [
 {'person':'el directorio','place':'la sede central','event':'una revisión estratégica','object':'un plan a cinco años','topic':'el cambio organizacional','process':'reasignar la inversión'},
 {'person':'un regulador','place':'una audiencia pública','event':'un debate de políticas','object':'una opinión legal','topic':'la responsabilidad corporativa','process':'evaluar el cumplimiento'},
 {'person':'un inversionista escéptico','place':'una cumbre internacional','event':'una ronda de financiamiento','object':'un modelo de valorización','topic':'el riesgo de largo plazo','process':'poner a prueba los supuestos'},
 {'person':'un ejecutivo rival','place':'la mesa de negociación','event':'una conversación de fusión','object':'un memo confidencial','topic':'la consolidación del mercado','process':'construir consenso'},
 {'person':'un panel de expertos','place':'un instituto de investigación','event':'una revisión por pares','object':'un estudio cuestionado','topic':'la evidencia y la incertidumbre','process':'conciliar datos contradictorios'},
],
}

contexts_eng = {
'A1': contexts_general['A1'],
'A2': [
 {'person':'a workmate','place':'the workshop','event':'the safety talk','object':'a yellow helmet','topic':'safety at work','process':'checking your tools'},
 {'person':'the site guard','place':'the site entrance','event':'the morning shift','object':'a pair of gloves','topic':'your work uniform','process':'signing the entry list'},
 {'person':'a driver','place':'the storeroom','event':'a delivery','object':'a box of materials','topic':'your work schedule','process':'counting the materials'},
 {'person':'a technician','place':'the machine room','event':'a short repair','object':'a broken switch','topic':'keeping things clean','process':'cleaning a machine'},
 {'person':'your supervisor','place':'the office at the plant','event':'the daily report','object':'a paper form','topic':'your tasks today','process':'filling in a simple form'},
],
'B1': [
 {'person':'a site foreman','place':'a construction site','event':'a safety inspection','object':'a protective helmet','topic':'workplace safety','process':'inspecting materials'},
 {'person':'a maintenance technician','place':'a power plant','event':'a maintenance shutdown','object':'a control panel','topic':'energy efficiency','process':'testing a system'},
 {'person':'an equipment supplier','place':'a logistics center','event':'a delivery review','object':'a technical drawing','topic':'quality control','process':'verifying measurements'},
 {'person':'a software engineer','place':'a testing lab','event':'a product demonstration','object':'a monitoring dashboard','topic':'automation at work','process':'diagnosing a fault'},
 {'person':'a field crew','place':'a water treatment plant','event':'a routine check','object':'a pressure gauge','topic':'preventive maintenance','process':'reading instruments'},
],
'B2': [
 {'person':'a project engineer','place':'a construction site','event':'a safety incident','object':'a structural design','topic':'risk management','process':'reviewing a method statement'},
 {'person':'a plant manager','place':'a power plant','event':'an unplanned shutdown','object':'a control system','topic':'energy efficiency','process':'root cause analysis'},
 {'person':'a quality inspector','place':'a manufacturing line','event':'a batch rejection','object':'a tolerance specification','topic':'quality assurance','process':'calibrating equipment'},
 {'person':'a systems architect','place':'a software lab','event':'a production release','object':'a monitoring dashboard','topic':'responsible automation','process':'load testing a system'},
 {'person':'an environmental officer','place':'a mining operation','event':'an environmental audit','object':'an emissions report','topic':'sustainable operations','process':'measuring emissions'},
],
'C1': [
 {'person':'the technical committee','place':'a megaproject site','event':'a structural failure','object':'a seismic design criterion','topic':'engineering ethics','process':'independent design review'},
 {'person':'the operations director','place':'a national grid control room','event':'a grid-wide outage','object':'a redundancy scheme','topic':'critical infrastructure','process':'contingency planning'},
 {'person':'a chief safety officer','place':'a refinery','event':'a process safety event','object':'a hazard analysis','topic':'safety culture','process':'quantitative risk assessment'},
 {'person':'a research lead','place':'an R&D center','event':'a technology transfer','object':'a patented process','topic':'innovation strategy','process':'scaling a prototype'},
 {'person':'a government regulator','place':'a public utility','event':'a tariff review','object':'a technical feasibility study','topic':'infrastructure policy','process':'modeling long-term demand'},
],
}
contexts_eng_es = {
'A1': contexts_general_es['A1'],
'A2': [
 {'person':'un compañero de trabajo','place':'el taller','event':'la charla de seguridad','object':'un casco amarillo','topic':'la seguridad en el trabajo','process':'revisar tus herramientas'},
 {'person':'el vigilante','place':'la entrada de la obra','event':'el turno de la mañana','object':'un par de guantes','topic':'tu uniforme de trabajo','process':'firmar la lista de ingreso'},
 {'person':'un chofer','place':'el almacén','event':'una entrega','object':'una caja de materiales','topic':'tu horario de trabajo','process':'contar los materiales'},
 {'person':'un técnico','place':'la sala de máquinas','event':'una reparación corta','object':'un interruptor malogrado','topic':'mantener todo limpio','process':'limpiar una máquina'},
 {'person':'tu supervisor','place':'la oficina de la planta','event':'el reporte diario','object':'un formato en papel','topic':'tus tareas de hoy','process':'llenar un formato simple'},
],
'B1': [
 {'person':'un maestro de obra','place':'una obra de construcción','event':'una inspección de seguridad','object':'un casco de protección','topic':'la seguridad en el trabajo','process':'inspeccionar materiales'},
 {'person':'un técnico de mantenimiento','place':'una central eléctrica','event':'una parada de mantenimiento','object':'un tablero de control','topic':'la eficiencia energética','process':'probar un sistema'},
 {'person':'un proveedor de equipos','place':'un centro logístico','event':'una revisión de entregas','object':'un plano técnico','topic':'el control de calidad','process':'verificar medidas'},
 {'person':'un ingeniero de software','place':'un laboratorio de pruebas','event':'una demostración de producto','object':'un tablero de monitoreo','topic':'la automatización en el trabajo','process':'diagnosticar una falla'},
 {'person':'una cuadrilla de campo','place':'una planta de tratamiento de agua','event':'una revisión de rutina','object':'un manómetro','topic':'el mantenimiento preventivo','process':'leer instrumentos'},
],
'B2': [
 {'person':'un ingeniero de proyecto','place':'una obra de construcción','event':'un incidente de seguridad','object':'un diseño estructural','topic':'la gestión de riesgos','process':'revisar un procedimiento de trabajo'},
 {'person':'el jefe de planta','place':'una central eléctrica','event':'una parada no programada','object':'un sistema de control','topic':'la eficiencia energética','process':'el análisis de causa raíz'},
 {'person':'un inspector de calidad','place':'una línea de manufactura','event':'el rechazo de un lote','object':'una especificación de tolerancia','topic':'el aseguramiento de la calidad','process':'calibrar equipos'},
 {'person':'un arquitecto de sistemas','place':'un laboratorio de software','event':'un pase a producción','object':'un tablero de monitoreo','topic':'la automatización responsable','process':'probar el sistema bajo carga'},
 {'person':'un responsable ambiental','place':'una operación minera','event':'una auditoría ambiental','object':'un reporte de emisiones','topic':'las operaciones sostenibles','process':'medir emisiones'},
],
'C1': [
 {'person':'el comité técnico','place':'la obra de un megaproyecto','event':'una falla estructural','object':'un criterio de diseño sísmico','topic':'la ética en la ingeniería','process':'una revisión de diseño independiente'},
 {'person':'el director de operaciones','place':'la sala de control del sistema eléctrico','event':'un apagón general','object':'un esquema de redundancia','topic':'la infraestructura crítica','process':'la planificación de contingencias'},
 {'person':'el jefe de seguridad','place':'una refinería','event':'un evento de seguridad de procesos','object':'un análisis de peligros','topic':'la cultura de seguridad','process':'la evaluación cuantitativa de riesgos'},
 {'person':'el líder de investigación','place':'un centro de I+D','event':'una transferencia tecnológica','object':'un proceso patentado','topic':'la estrategia de innovación','process':'escalar un prototipo'},
 {'person':'un regulador del Estado','place':'una empresa de servicios públicos','event':'una revisión tarifaria','object':'un estudio de factibilidad técnica','topic':'la política de infraestructura','process':'modelar la demanda de largo plazo'},
],
}

# --------------------------------------------------------------- frases modelo
model_sentences = {
'A1':['Hello, my name is Ana. Nice to meet you.','I live near {place} and I like it.','I have {object} every day.','Can you help me, please?','I like {topic} very much.'],
'A2':['Yesterday I talked about {topic} with {person}.','We are going to visit {place} before {event}.','This {object} is better than the old one.','Could you please help me with {process}?','There was a problem during {event}, but we fixed it.'],
'B1':['The main problem during {event} was solved by improving {process}.','In my opinion, {topic} matters because it affects people and results.','If we checked {object} earlier, we would reduce the risk.','I recommend changing {process} after reviewing the available evidence.','Although the plan was difficult, the team completed {event} successfully.'],
'B2':['The evidence indicates that improving {process} would reduce the principal risk.','Although {person} raised a valid concern, the proposed solution remains practical.','We should compare the long-term impact of {object} before making a final decision.','The incident during {event} revealed a weakness that requires corrective action.','Our recommendation balances safety, cost and operational continuity at {place}.'],
'C1':['While the evidence is not conclusive, it strongly suggests that {process} requires revision.','Provided the assumptions remain valid, the proposal offers the most defensible course of action.','The apparent simplicity of {object} conceals a more consequential strategic trade-off.','We acknowledge the objection raised by {person}; nevertheless, the broader evidence supports our recommendation.','Had the warning signs before {event} been addressed, the resulting disruption might have been avoided.'],
}
model_sentences_es = {
'A1':['Hola, me llamo Ana. Mucho gusto.','Vivo cerca de {place} y me gusta.','Tomo/como {object} todos los días.','¿Me puedes ayudar, por favor?','Me gusta mucho {topic}.'],
'A2':['Ayer hablé sobre {topic} con {person}.','Vamos a visitar {place} antes de {event}.','{object} es mejor que el anterior.','¿Podrías ayudarme con {process}, por favor?','Hubo un problema durante {event}, pero lo resolvimos.'],
'B1':['El problema principal durante {event} se resolvió mejorando {process}.','En mi opinión, {topic} importa porque afecta a las personas y a los resultados.','Si hubiéramos revisado {object} antes, habríamos reducido el riesgo.','Recomiendo cambiar {process} después de revisar la evidencia disponible.','Aunque el plan fue difícil, el equipo completó {event} con éxito.'],
'B2':['La evidencia indica que mejorar {process} reduciría el riesgo principal.','Aunque {person} planteó una preocupación válida, la solución propuesta sigue siendo práctica.','Deberíamos comparar el impacto de largo plazo de {object} antes de tomar una decisión final.','El incidente durante {event} reveló una debilidad que exige una acción correctiva.','Nuestra recomendación equilibra seguridad, costo y continuidad operativa en {place}.'],
'C1':['Si bien la evidencia no es concluyente, sugiere con fuerza que {process} requiere una revisión.','Siempre que los supuestos sigan siendo válidos, la propuesta ofrece el curso de acción más defendible.','La aparente simplicidad de {object} esconde un trade-off estratégico de mayor consecuencia.','Reconocemos la objeción planteada por {person}; sin embargo, la evidencia más amplia respalda nuestra recomendación.','Si se hubieran atendido las señales de alerta antes de {event}, la interrupción resultante podría haberse evitado.'],
}

hints = {'A1':'Habla despacio y marca cada palabra importante.','A2':'Conecta las ideas con and, but, because y then.','B1':'Organiza tu respuesta en situación, acción y resultado.','B2':'Usa conectores y explica la razón detrás de tu recomendación.','C1':'Matiza, concede un punto contrario y cierra con una conclusión clara.'}
requirements = {'A1':['present simple','basic personal vocabulary'],'A2':['past and future forms','common linking words'],'B1':['connected discourse','reasons and examples'],'B2':['clear argument structure','technical and general vocabulary'],'C1':['nuance and precision','complex cohesive discourse']}

TASKS = {
 'repeat': ('Repeat the model sentence accurately.', 'Repite la frase modelo tal cual, con buena pronunciación.'),
 'read': ('Read the model text aloud with clear rhythm.', 'Lee el texto en voz alta con ritmo claro.'),
}
TASK_SUFFIX = {
 'guided': (' Include the key information requested and at least two connected ideas.', ' Incluye la información pedida y al menos dos ideas conectadas.'),
 'dialogue': (' Respond as if you were speaking directly to the other person.', ' Responde como si estuvieras hablando directamente con la otra persona.'),
 'free': (' Develop your answer with examples and a clear conclusion.', ' Desarrolla tu respuesta con ejemplos y una conclusión clara.'),
}

# Cuántos ítems de cada modo por nivel: A1–A2 casi todo repetir y leer;
# el habla libre y el diálogo largo llegan desde B1.
mode_mix = {
 'A1': [('repeat',200),('read',150),('guided',100),('dialogue',50),('free',0)],
 'A2': [('repeat',150),('read',150),('guided',120),('dialogue',60),('free',20)],
 'B1': [('repeat',100),('read',100),('guided',130),('dialogue',100),('free',70)],
 'B2': [('repeat',70),('read',80),('guided',120),('dialogue',110),('free',120)],
 'C1': [('repeat',50),('read',60),('guided',110),('dialogue',120),('free',160)],
}
MODE_ORDER = ['repeat','read','guided','dialogue','free']
eng_ratio = {'A1':0, 'A2':10, 'B1':25, 'B2':40, 'C1':50}  # porcentaje de ítems de ingeniería
minw_std = {'A1':6,'A2':12,'B1':25,'B2':40,'C1':55}
minw_free = {'A1':8,'A2':15,'B1':32,'B2':50,'C1':70}
max_target_words = {'A1':14, 'A2':24, 'B1':60, 'B2':70, 'C1':90}

# Glosario de palabras clave: sólo términos que aparecen en las frases modelo.
GLOSS = {
 'hello':'hola','my':'mi','name':'nombre','is':'es','nice':'gusto / agradable','meet':'conocer','you':'tú / usted',
 'live':'vivo','near':'cerca de','like':'gustar','have':'tener / tomar','every':'cada','day':'día','can':'poder',
 'help':'ayudar','please':'por favor','very':'muy','much':'mucho','talked':'hablé','yesterday':'ayer','with':'con',
 'going':'vamos a','visit':'visitar','before':'antes de','this':'este/a','better':'mejor','than':'que (comparación)',
 'old':'antiguo','one':'uno','could':'podría','there':'había / hay','was':'fue / era','problem':'problema',
 'during':'durante','but':'pero','we':'nosotros','fixed':'arreglamos','ready':'listo/a','speak':'hablar',
 'clearly':'con claridad','about':'sobre','work':'trabajar','office':'oficina','use':'usar','first':'primero',
 'check':'revisar','then':'entonces','start':'empezar','most':'más','important':'importante','thing':'cosa',
 'clear':'claro','communication':'comunicación','discussed':'conversé / discutí','improve':'mejorar','safer':'más seguro',
 'easier':'más fácil','review':'revisar','happened':'ocurrió','team':'equipo','main':'principal','solved':'resolvió',
 'improving':'mejorar (gerundio)','opinion':'opinión','matters':'importa','because':'porque','affects':'afecta',
 'people':'personas','results':'resultados','earlier':'antes','would':'condicional (–ría)','reduce':'reducir',
 'risk':'riesgo','recommend':'recomiendo','changing':'cambiar','after':'después de','reviewing':'revisar (gerundio)',
 'available':'disponible','evidence':'evidencia','although':'aunque','plan':'plan','difficult':'difícil','completed':'completó',
 'successfully':'con éxito','indicates':'indica','principal':'principal','raised':'planteó','valid':'válida','concern':'preocupación',
 'proposed':'propuesta','solution':'solución','remains':'sigue siendo','practical':'práctica','should':'deberíamos','compare':'comparar',
 'long-term':'de largo plazo','impact':'impacto','making':'tomar (hacer)','final':'final','decision':'decisión','incident':'incidente',
 'revealed':'reveló','weakness':'debilidad','requires':'exige','corrective':'correctiva','action':'acción','recommendation':'recomendación',
 'balances':'equilibra','safety':'seguridad','cost':'costo','operational':'operativa','continuity':'continuidad','while':'si bien',
 'conclusive':'concluyente','strongly':'con fuerza','suggests':'sugiere','revision':'revisión','provided':'siempre que',
 'assumptions':'supuestos','proposal':'propuesta','offers':'ofrece','defensible':'defendible','course':'curso','apparent':'aparente',
 'simplicity':'simplicidad','conceals':'esconde','consequential':'de consecuencias','strategic':'estratégico','trade-off':'compensación / trade-off',
 'acknowledge':'reconocemos','objection':'objeción','nevertheless':'sin embargo','broader':'más amplia','supports':'respalda',
 'warning':'advertencia','signs':'señales','addressed':'atendido','resulting':'resultante','disruption':'interrupción','avoided':'evitado',
 'might':'podría','project':'proyecto','document':'documento','construction':'construcción','site':'obra','protective':'de protección',
 'helmet':'casco','power':'energía','plant':'planta','control':'control','panel':'tablero','logistics':'logística','center':'centro',
 'technical':'técnico','drawing':'plano / dibujo','software':'software','lab':'laboratorio','monitoring':'monitoreo','dashboard':'tablero',
 'learning':'aprender','english':'inglés','workplace':'lugar de trabajo','energy':'energía','efficiency':'eficiencia','quality':'calidad',
 'responsible':'responsable','automation':'automatización','checking':'revisar','report':'informe','inspecting':'inspeccionar',
 'materials':'materiales','testing':'probar','system':'sistema','verifying':'verificar','measurements':'medidas','diagnosing':'diagnosticar',
 'fault':'falla','colleague':'colega','client':'cliente','manager':'jefe','international':'internacional','supplier':'proveedor',
 'multidisciplinary':'multidisciplinario','meeting':'reunión','inspection':'inspección','maintenance':'mantenimiento','shutdown':'parada',
 'delivery':'entrega','product':'producto','demonstration':'demostración','new':'nuevo','your':'tu','our':'nuestro','their':'su',
 'house':'casa','school':'escuela','market':'mercado','park':'parque','friend':'amigo','family':'familia','food':'comida',
 'coffee':'café','water':'agua','cup':'taza','bottle':'botella','bag':'bolsa','pen':'lapicero','notebook':'cuaderno',
 'city':'ciudad','routine':'rutina','breakfast':'desayuno','lunch':'almuerzo','weekend':'fin de semana','weather':'clima',
 'trip':'viaje','hotel':'hotel','phone':'celular','laptop':'laptop','ticket':'pasaje','airport':'aeropuerto','money':'dinero',
 'job':'trabajo','time':'tiempo / hora','free':'libre','vacation':'vacaciones','helmet':'casco','gloves':'guantes',
 'tools':'herramientas','shift':'turno','machine':'máquina','clean':'limpio / limpiar','form':'formato','supervisor':'supervisor',
}


def gloss_for(sentence: str):
    """Palabras clave de la frase con su significado, sin repetir y en orden."""
    out, seen = [], set()
    for raw in sentence.split():
        w = raw.strip('.,;:¿?¡!()"“”').lower()
        if not w or w in seen:
            continue
        es = GLOSS.get(w)
        if not es:
            continue
        seen.add(w)
        out.append({'w': raw.strip('.,;:¿?¡!()"“”'), 'es': es})
    return out[:10]


lines = []
lines.append("// Banco de Speaking: 500 ítems por nivel, con contextos propios de cada nivel MCER.\n")
lines.append("// A1–A2 son de vida cotidiana; la ingeniería crece desde B1 (0/10/25/40/50%).\n")
lines.append("// Cada ítem incluye traducción al español (es / promptEs / taskEs) y glosa de palabras clave.\n")
lines.append("const SPEAKING_BANK = {};\n")

resumen = {}
for mod, lvl in levels:
    lines.append(f"SPEAKING_BANK['{mod}'] = [];\n")
    idx = 0
    cuenta = Counter()
    for mode in MODE_ORDER:
        total = dict(mode_mix[lvl])[mode]
        for n in range(total):
            idx += 1
            fi = n % len(frames[lvl])
            ci = (n // len(frames[lvl])) % 5
            usa_ing = (idx * 100 // 500) % 100 < eng_ratio[lvl] if eng_ratio[lvl] else False
            usa_ing = (n % 100) < eng_ratio[lvl]
            ctx = (contexts_eng if usa_ing else contexts_general)[lvl][ci]
            ctx_es = (contexts_eng_es if usa_ing else contexts_general_es)[lvl][ci]
            eid = f"sp-{lvl.lower()}-{idx:03d}"
            prompt = frames[lvl][fi].format(**ctx)
            prompt_es = frames_es[lvl][fi].format(**ctx_es)
            si = (fi + ci) % 5
            sent = model_sentences[lvl][si].format(**ctx)
            sent_es = model_sentences_es[lvl][si].format(**ctx_es)
            if mode == 'repeat':
                task, task_es = TASKS['repeat']; target, target_es = sent, sent_es; minw = 0
            elif mode == 'read':
                task, task_es = TASKS['read']
                sj = (fi + ci + 1) % 5
                target = sent + ' ' + model_sentences[lvl][sj].format(**ctx)
                target_es = sent_es + ' ' + model_sentences_es[lvl][sj].format(**ctx_es)
                minw = 0
            else:
                suf_en, suf_es = TASK_SUFFIX[mode]
                task = prompt + suf_en; task_es = prompt_es + suf_es
                target, target_es = '', ''
                minw = (minw_free if mode == 'free' else minw_std)[lvl]
            domain = 'engineering' if usa_ing else 'general'
            cuenta[mode] += 1
            cuenta[domain] += 1
            vals = {
                'id': eid, 'mode': mode, 'level': lvl,
                'prompt': prompt, 'promptEs': prompt_es,
                'task': task, 'taskEs': task_es,
                'target': target, 'es': target_es,
                'modelEs': sent_es,
                'gloss': gloss_for(target or sent),
                'hint': hints[lvl], 'minWords': minw, 'domain': domain,
                'skill': ('pronunciation' if mode in ('repeat', 'read') else 'spoken-interaction'),
                'acceptedVariants': ([sent.replace('I am', "I'm")] if target else []),
                'requirements': requirements[lvl],
                'passScore': 70 if lvl in ('A1', 'A2', 'B1') else 72,
                'cefrObjective': f'{lvl} spoken production and interaction',
                'order': MODE_ORDER.index(mode),
            }
            tope = max_target_words[lvl] * (2 if mode == 'read' else 1)
            if target and len(target.split()) > tope:
                raise SystemExit(f'{eid}: frase modelo demasiado larga para {lvl}')
            lines.append("SPEAKING_BANK['%s'].push(%s);\n" % (mod, json.dumps(vals, ensure_ascii=False, separators=(',', ':'))))
    if idx != 500:
        raise SystemExit(f'{lvl}: {idx} ítems, se esperaban 500')
    if lvl == 'A1' and cuenta['engineering']:
        raise SystemExit('A1 no debe tener ejercicios de ingeniería')
    resumen[lvl] = dict(cuenta)
    lines.append(f"if (SPEAKING_BANK['{mod}'].length !== 500) throw new Error('Banco {lvl} incompleto');\n")

lines.append("\nconst _spIds = new Set();\nfor (const _items of Object.values(SPEAKING_BANK)) for (const _q of _items) { if (_spIds.has(_q.id)) throw new Error('ID speaking duplicado: '+_q.id); _spIds.add(_q.id); if (!_q.prompt || !_q.promptEs || !_q.level || !_q.mode) throw new Error('Speaking inválido: '+_q.id); if (_q.target && !_q.es) throw new Error('Falta traducción: '+_q.id); }\n")
lines.append("if (_spIds.size !== 2500) throw new Error('El banco de Speaking debe tener 2500 ejercicios');\n")
lines.append("if (typeof window !== 'undefined') window.SPEAKING_BANK = SPEAKING_BANK;\n")
Path('src/content/speaking_bank.js').write_text(''.join(lines), encoding='utf-8')
for lvl, c in resumen.items():
    print(lvl, {k: c.get(k, 0) for k in MODE_ORDER}, 'ing:', c.get('engineering', 0))
print('generated', sum(1 for l in lines if '.push(' in l), 'items')
