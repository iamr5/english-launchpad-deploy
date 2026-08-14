"""Genera src/content/speaking_bank.js: 500 ítems por nivel (A1–C1).

Cada ítem lleva ahora su traducción al español (`es`, `promptEs`, `taskEs`) y una
glosa de palabras clave (`gloss`), para que el alumno entienda lo que dice.
Las traducciones se escriben a mano sobre las matrices (frames, contextos y
frases modelo) y se propagan al banco completo: nada de traducción automática.
"""
import json
from pathlib import Path

levels = [('modulo-1', 'A1'), ('modulo-2', 'A2'), ('modulo-3', 'B1'), ('modulo-4', 'B2'), ('modulo-5', 'C1')]

frames = {
'A1': ['Introduce yourself to {person}.','Say where you live and work in {place}.','Describe your normal morning before {event}.','Ask for help with {object}.','Say what you like about {topic}.','Give three simple instructions about {process}.','Describe {object} using colors, size and location.','Tell {person} what time {event} starts.','Order or request {object} politely.','Spell and confirm important information about {topic}.','Say what you can and cannot do during {event}.','Describe your family or team to {person}.','Explain where {place} is.','Invite {person} to {event}.','Say how often you do {process}.','Describe today’s weather and your plans for {event}.','Ask and answer two questions about {topic}.','Say what you need for {process}.','Explain a simple safety rule about {object}.','Leave a short voice message for {person}.'],
'A2': ['Describe what happened during {event}.','Compare two options for {object}.','Explain your plans for {event}.','Give directions to {place}.','Make a polite request to {person} about {object}.','Describe a problem with {object} and the solution.','Tell a short story connected to {topic}.','Explain how to complete {process}.','Recommend a place or activity to {person}.','Describe changes in {place}.','Report a delay involving {event}.','Arrange a meeting with {person}.','Explain a rule related to {process}.','Describe your experience using {object}.','Talk about a goal related to {topic}.','Explain what you were doing during {event}.','Offer and respond to help with {process}.','Summarize a simple message from {person}.','Describe advantages and disadvantages of {object}.','Record an update for {person} about {event}.'],
'B1': ['Explain a problem you solved during {event}.','Give and justify your opinion about {topic}.','Describe a project involving {process}.','Compare alternatives for {object} and recommend one.','Report the causes and effects of {event}.','Explain a process to a new colleague at {place}.','Handle a disagreement with {person}.','Describe lessons learned from {event}.','Present progress on {topic}.','Respond to a complaint about {object}.','Explain a decision related to {process}.','Tell a detailed story about {event}.','Discuss risks connected to {object}.','Propose improvements for {place}.','Summarize a conversation with {person}.','Explain how {topic} has changed.','Give advice to someone preparing for {event}.','Describe evidence supporting an idea about {topic}.','Negotiate a practical change with {person}.','Record a structured status update about {process}.'],
'B2': ['Present and defend a proposal about {topic}.','Explain a complex process involving {object}.','Compare competing solutions for {process}.','Report an incident during {event} with causes and prevention.','Persuade {person} to change a decision about {topic}.','Lead a short briefing at {place}.','Explain uncertainty and assumptions about {object}.','Respond diplomatically to criticism from {person}.','Summarize technical information about {process} for a non-specialist.','Discuss ethical implications of {topic}.','Negotiate scope, time and quality for {event}.','Explain a trend affecting {place}.','Present risks and mitigations for {process}.','Challenge an idea politely in a meeting with {person}.','Give a balanced recommendation about {object}.','Describe a failure and corrective action during {event}.','Explain data or evidence related to {topic}.','Adapt instructions about {process} for a new team.','Handle difficult follow-up questions from {person}.','Deliver an executive update about {event}.'],
'C1': ['Deliver a nuanced argument about {topic}.','Present a strategic recommendation involving {process}.','Explain a highly complex issue about {object} to mixed audiences.','Respond persuasively to strong objections from {person}.','Lead a crisis briefing after {event}.','Evaluate assumptions behind a decision about {topic}.','Synthesize conflicting evidence about {process}.','Negotiate a high-stakes agreement with {person}.','Present a failure transparently and defend the response to {event}.','Explain long-term implications for {place}.','Reframe a difficult question about {object}.','Facilitate a disagreement between teams about {process}.','Deliver a concise board-level update on {topic}.','Argue both sides before recommending action about {object}.','Explain a technical trade-off without oversimplifying {process}.','Respond to an ethical challenge involving {event}.','Present a scenario analysis about {topic}.','Challenge an expert’s claim respectfully about {object}.','Close a complex negotiation with {person}.','Give a compelling final presentation about {process}.'],
}

frames_es = {
'A1': ['Preséntate ante {person}.','Di dónde vives y trabajas en {place}.','Describe tu mañana normal antes de {event}.','Pide ayuda con {object}.','Di qué te gusta de {topic}.','Da tres instrucciones simples sobre {process}.','Describe {object} con colores, tamaño y ubicación.','Dile a {person} a qué hora empieza {event}.','Pide {object} con cortesía.','Deletrea y confirma información importante sobre {topic}.','Di qué puedes y qué no puedes hacer durante {event}.','Describe tu familia o tu equipo a {person}.','Explica dónde queda {place}.','Invita a {person} a {event}.','Di con qué frecuencia haces {process}.','Describe el clima de hoy y tus planes para {event}.','Haz y responde dos preguntas sobre {topic}.','Di qué necesitas para {process}.','Explica una regla simple de seguridad sobre {object}.','Deja un mensaje de voz corto para {person}.'],
'A2': ['Describe qué pasó durante {event}.','Compara dos opciones para {object}.','Explica tus planes para {event}.','Da indicaciones para llegar a {place}.','Haz una petición cortés a {person} sobre {object}.','Describe un problema con {object} y su solución.','Cuenta una historia corta relacionada con {topic}.','Explica cómo completar {process}.','Recomienda un lugar o una actividad a {person}.','Describe los cambios en {place}.','Reporta un retraso relacionado con {event}.','Coordina una reunión con {person}.','Explica una regla relacionada con {process}.','Describe tu experiencia usando {object}.','Habla de una meta relacionada con {topic}.','Explica qué estabas haciendo durante {event}.','Ofrece y responde a una ayuda con {process}.','Resume un mensaje simple de {person}.','Describe ventajas y desventajas de {object}.','Graba una actualización para {person} sobre {event}.'],
'B1': ['Explica un problema que resolviste durante {event}.','Da y justifica tu opinión sobre {topic}.','Describe un proyecto que involucra {process}.','Compara alternativas para {object} y recomienda una.','Reporta las causas y los efectos de {event}.','Explica un proceso a un colega nuevo en {place}.','Maneja un desacuerdo con {person}.','Describe las lecciones aprendidas de {event}.','Presenta el avance sobre {topic}.','Responde a un reclamo sobre {object}.','Explica una decisión relacionada con {process}.','Cuenta una historia detallada sobre {event}.','Comenta los riesgos relacionados con {object}.','Propón mejoras para {place}.','Resume una conversación con {person}.','Explica cómo ha cambiado {topic}.','Da un consejo a alguien que se prepara para {event}.','Describe evidencia que respalda una idea sobre {topic}.','Negocia un cambio práctico con {person}.','Graba una actualización de estado ordenada sobre {process}.'],
'B2': ['Presenta y defiende una propuesta sobre {topic}.','Explica un proceso complejo que involucra {object}.','Compara soluciones que compiten para {process}.','Reporta un incidente durante {event} con causas y prevención.','Convence a {person} de cambiar una decisión sobre {topic}.','Dirige una reunión informativa corta en {place}.','Explica la incertidumbre y los supuestos sobre {object}.','Responde con diplomacia a una crítica de {person}.','Resume información técnica sobre {process} para alguien que no es especialista.','Discute las implicancias éticas de {topic}.','Negocia alcance, tiempo y calidad para {event}.','Explica una tendencia que afecta a {place}.','Presenta riesgos y medidas de mitigación para {process}.','Cuestiona una idea con cortesía en una reunión con {person}.','Da una recomendación equilibrada sobre {object}.','Describe una falla y la acción correctiva durante {event}.','Explica datos o evidencia relacionados con {topic}.','Adapta instrucciones sobre {process} para un equipo nuevo.','Maneja preguntas difíciles de seguimiento de {person}.','Entrega una actualización ejecutiva sobre {event}.'],
'C1': ['Desarrolla un argumento con matices sobre {topic}.','Presenta una recomendación estratégica que involucra {process}.','Explica un asunto muy complejo sobre {object} a públicos distintos.','Responde de forma persuasiva a objeciones fuertes de {person}.','Dirige una reunión de crisis después de {event}.','Evalúa los supuestos detrás de una decisión sobre {topic}.','Sintetiza evidencia contradictoria sobre {process}.','Negocia un acuerdo de alto riesgo con {person}.','Presenta una falla con transparencia y defiende la respuesta ante {event}.','Explica las implicancias de largo plazo para {place}.','Replantea una pregunta difícil sobre {object}.','Facilita un desacuerdo entre equipos sobre {process}.','Entrega una actualización breve a nivel directorio sobre {topic}.','Argumenta ambos lados antes de recomendar una acción sobre {object}.','Explica un trade-off técnico sin simplificar de más {process}.','Responde a un desafío ético relacionado con {event}.','Presenta un análisis de escenarios sobre {topic}.','Cuestiona con respeto la afirmación de un experto sobre {object}.','Cierra una negociación compleja con {person}.','Da una presentación final convincente sobre {process}.'],
}

contexts = [
 {'person':'a new colleague','place':'your office','event':'a team meeting','object':'a project document','topic':'learning English','process':'checking a report'},
 {'person':'a client','place':'a construction site','event':'a safety inspection','object':'a protective helmet','topic':'workplace safety','process':'inspecting materials'},
 {'person':'your manager','place':'a power plant','event':'a maintenance shutdown','object':'a control panel','topic':'energy efficiency','process':'testing a system'},
 {'person':'an international supplier','place':'a logistics center','event':'a delivery review','object':'a technical drawing','topic':'quality control','process':'verifying measurements'},
 {'person':'a multidisciplinary team','place':'a software lab','event':'a product demonstration','object':'a monitoring dashboard','topic':'responsible automation','process':'diagnosing a fault'},
]
contexts_es = [
 {'person':'un colega nuevo','place':'tu oficina','event':'una reunión de equipo','object':'un documento del proyecto','topic':'aprender inglés','process':'revisar un informe'},
 {'person':'un cliente','place':'una obra de construcción','event':'una inspección de seguridad','object':'un casco de protección','topic':'la seguridad en el trabajo','process':'inspeccionar materiales'},
 {'person':'tu jefe','place':'una central eléctrica','event':'una parada de mantenimiento','object':'un tablero de control','topic':'la eficiencia energética','process':'probar un sistema'},
 {'person':'un proveedor internacional','place':'un centro logístico','event':'una revisión de entregas','object':'un plano técnico','topic':'el control de calidad','process':'verificar medidas'},
 {'person':'un equipo multidisciplinario','place':'un laboratorio de software','event':'una demostración de producto','object':'un tablero de monitoreo','topic':'la automatización responsable','process':'diagnosticar una falla'},
]

model_sentences = {
'A1':['Hello, I am ready to speak clearly about {topic}.','I work at {place} and I use {object} every day.','First, I check {object}, and then I start {process}.','Could you help me with {object}, please?','The most important thing about {topic} is clear communication.'],
'A2':['Yesterday, I discussed {topic} with {person} at {place}.','We are going to improve {process} before {event}.','This {object} is safer and easier to use than the old one.','Could you please review {object} before {event}?','The problem happened during {process}, but our team fixed it.'],
'B1':['The main problem during {event} was solved by improving {process}.','In my opinion, {topic} matters because it affects people and results.','If we checked {object} earlier, we would reduce the risk.','I recommend changing {process} after reviewing the available evidence.','Although the plan was difficult, the team completed {event} successfully.'],
'B2':['The evidence indicates that improving {process} would reduce the principal risk.','Although {person} raised a valid concern, the proposed solution remains practical.','We should compare the long-term impact of {object} before making a final decision.','The incident during {event} revealed a weakness that requires corrective action.','Our recommendation balances safety, cost and operational continuity at {place}.'],
'C1':['While the evidence is not conclusive, it strongly suggests that {process} requires revision.','Provided the assumptions remain valid, the proposal offers the most defensible course of action.','The apparent simplicity of {object} conceals a more consequential strategic trade-off.','We acknowledge the objection raised by {person}; nevertheless, the broader evidence supports our recommendation.','Had the warning signs before {event} been addressed, the resulting disruption might have been avoided.'],
}
model_sentences_es = {
'A1':['Hola, estoy listo para hablar con claridad sobre {topic}.','Trabajo en {place} y uso {object} todos los días.','Primero reviso {object} y después empiezo con {process}.','¿Podrías ayudarme con {object}, por favor?','Lo más importante sobre {topic} es la comunicación clara.'],
'A2':['Ayer conversé sobre {topic} con {person} en {place}.','Vamos a mejorar {process} antes de {event}.','{object} es más seguro y más fácil de usar que el anterior.','¿Podrías revisar {object} antes de {event}, por favor?','El problema ocurrió durante {process}, pero nuestro equipo lo resolvió.'],
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

# Glosario de palabras clave: sólo términos que aparecen en las frases modelo.
GLOSS = {
 'hello':'hola','ready':'listo/a','speak':'hablar','clearly':'con claridad','about':'sobre','work':'trabajar','office':'oficina',
 'use':'usar','every':'cada','day':'día','first':'primero','check':'revisar','then':'entonces','start':'empezar','could':'podría',
 'help':'ayudar','please':'por favor','most':'más','important':'importante','thing':'cosa','clear':'claro','communication':'comunicación',
 'yesterday':'ayer','discussed':'conversé / discutí','improve':'mejorar','before':'antes de','safer':'más seguro','easier':'más fácil',
 'than':'que (comparación)','old':'antiguo','review':'revisar','problem':'problema','happened':'ocurrió','during':'durante','team':'equipo',
 'fixed':'arregló','main':'principal','solved':'resolvió','improving':'mejorar (gerundio)','opinion':'opinión','matters':'importa',
 'because':'porque','affects':'afecta','people':'personas','results':'resultados','earlier':'antes','would':'condicional (–ría)',
 'reduce':'reducir','risk':'riesgo','recommend':'recomiendo','changing':'cambiar','after':'después de','reviewing':'revisar (gerundio)',
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
lines.append("// Banco de Speaking generado desde matrices comunicativas revisables: 500 ítems por nivel.\n")
lines.append("// Cada ítem incluye traducción al español (es / promptEs / taskEs) y glosa de palabras clave.\n")
lines.append("const SPEAKING_BANK = {};\n")
minw_std = {'A1':10,'A2':16,'B1':28,'B2':42,'C1':60}
minw_free = {'A1':12,'A2':20,'B1':35,'B2':55,'C1':75}

for mod, lvl in levels:
    lines.append(f"SPEAKING_BANK['{mod}'] = [];\n")
    idx = 0
    for mode_i, mode in enumerate(['repeat','read','guided','dialogue','free']):
        for fi, frame in enumerate(frames[lvl]):
            for ci, ctx in enumerate(contexts):
                ctx_es = contexts_es[ci]
                idx += 1
                eid = f"sp-{lvl.lower()}-{idx:03d}"
                prompt = frame.format(**ctx)
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
                domain = 'engineering' if ci in (1,2,3,4) and (fi + mode_i) % 2 == 0 else 'general'
                vals = {
                    'id': eid, 'mode': mode, 'level': lvl,
                    'prompt': prompt, 'promptEs': prompt_es,
                    'task': task, 'taskEs': task_es,
                    'target': target, 'es': target_es,
                    'modelEs': sent_es,
                    'gloss': gloss_for(target or sent),
                    'hint': hints[lvl], 'minWords': minw, 'domain': domain,
                    'skill': ('pronunciation' if mode in ('repeat','read') else 'spoken-interaction'),
                    'acceptedVariants': ([sent.replace('I am', "I'm")] if target else []),
                    'requirements': requirements[lvl],
                    'passScore': 70 if lvl in ('A1','A2','B1') else 72,
                    'cefrObjective': f'{lvl} spoken production and interaction',
                }
                lines.append("SPEAKING_BANK['%s'].push(%s);\n" % (mod, json.dumps(vals, ensure_ascii=False, separators=(',', ':'))))
    lines.append(f"if (SPEAKING_BANK['{mod}'].length !== 500) throw new Error('Banco {lvl} incompleto');\n")

lines.append("\nconst _spIds = new Set();\nfor (const _items of Object.values(SPEAKING_BANK)) for (const _q of _items) { if (_spIds.has(_q.id)) throw new Error('ID speaking duplicado: '+_q.id); _spIds.add(_q.id); if (!_q.prompt || !_q.promptEs || !_q.level || !_q.mode) throw new Error('Speaking inválido: '+_q.id); if (_q.target && !_q.es) throw new Error('Falta traducción: '+_q.id); }\n")
lines.append("if (_spIds.size !== 2500) throw new Error('El banco de Speaking debe tener 2500 ejercicios');\n")
lines.append("if (typeof window !== 'undefined') window.SPEAKING_BANK = SPEAKING_BANK;\n")
Path('src/content/speaking_bank.js').write_text(''.join(lines), encoding='utf-8')
print('generated', sum(1 for l in lines if '.push(' in l), 'items')
