# Authoring reading & writing items

This is the spec for adding **reading** (comprehension `mc`) and **writing** (free-text
`writing`) items to a microlección's theory blocks.

**Read the model items before writing yours**, in `src/content/data.js`:

- **`microlection2` and `microlection3` are the current model.** Copy their difficulty and
  their item shapes. They were revised against §5.0 and are what "right" looks like.
- **`microlection1` is the origin of the rules but NOT the model for item difficulty.** Its
  reading items ask the student to justify grammar rules in long explanatory Spanish —
  exactly what §5.0 now bans. Take its *sourcing* and *distractor logic* from it; take the
  shape of your questions from `microlection2`/`microlection3`. Do not touch it.

Everything below is a hard rule unless it says otherwise. The rules exist because each
item is generated *from the theory block directly above it*, not from the topic in
general and not from the module.

---

## 1. What you are producing

For each `type: 'teoria'` block in the target microlección, add to its `miniQuiz` array:

- **exactly 2 reading items** (`mc`), and
- **1 writing item** (`writing`) — unless rule §7.4 says to skip it.

Keep every existing item. You are appending, not rewriting. The only deletion allowed is
under §7.5.

## 2. Files

Edit **both** copies. They are two builds of the same course:

| File | Notes |
|---|---|
| `src/content/data.js` | Source of truth. Uses `{{mascot}}`, `{{mascotKind}}`, `{{mascotEmoji}}`, `{{audience}}` placeholders in prose. |
| `public/app/data.js` | Legacy hard-coded build (mascot is "Ozzy", client is TuRuta). |

The two files differ **only** in that branding prose. Quiz items never contain mascot
placeholders, so **the lines you add are byte-identical in both files**. Add them to both,
at the same place in the same block.

Do **not** touch `data_modulo3.js`, `data_modulo4.js`, `data_modulo5.js`
(separate demo datasets), `placement_items.js`, or anything under `src/assets/` or
`public/app/index.html` — the engine already supports both item types.

## 3. The constructors

Both are defined at the top of `data.js`.

```js
mc(question, options, correctIndex)
writing(question, accepted, extra)   // extra = { hint, reject, strict }
```

For `writing`:

- `accepted` — string or array. **`accepted[0]` is canonical**: it's what the student is
  shown when they fail, so write it complete and correctly punctuated even though the
  grader ignores case and punctuation. Add further entries only for genuine variants
  (`"I work everyday."` alongside `"...every day."`) — never for near-misses you want to
  reject.
  **Contraction variants: only for the ones `W_CONTR` actually covers.** The grader expands
  contractions during normalization (§4), so `"I'm tired."` and `"I am tired."` reduce to
  the same string and the second entry is a no-op. `microlection1` contains a few of these;
  don't copy the pattern.
  **But `W_CONTR` is incomplete, and the gap bites.** Among the *will* contractions it maps
  only `i'll`. Verified:

  | | |
  |---|---|
  | `"I'll help you."` → `i will help you` | ✅ same as the long form — variant is a no-op |
  | `"We won't win."` → `we won t win` | ❌ **differs** from `we will not win` |
  | `"She'll help."` → `she ll help` | ❌ **differs** from `she will help` |

  So for `won't`, `she'll`, `we'll`, `they'll`, `you'll`, `he'll` you **must** list both
  forms in `accepted`, or one of them is marked wrong. Check the `W_CONTR` table in
  `public/app/index.html` before assuming any contraction round-trips.
- `reject` — `[[respuesta, motivo], …]`. Predictable wrong answers, each marked wrong with
  a specific explanation instead of the generic *"Casi —"*.
- `hint` — help text under the box while typing. See §7.3 for when to include it.
- `strict` — `true` disables typo tolerance. Only for items where spelling *is* the thing
  being assessed (e.g. a pronunciation/spelling lesson).
  **`strict` does not disable normalization.** `wNorm` still runs first, so casing, accents
  and punctuation remain ungradeable even with `strict: true`, and **any phonetic symbol is
  destroyed**: `"θanks"` normalizes to `"anks"`, because everything outside `a-z0-9`
  becomes a space. Never ask a student to type a transcription — it isn't merely ungraded,
  it's graded against a mangled string. Symbols like θ or /ɪd/ are safe in `mc` and `tap`
  items, which are only displayed, never normalized.

## 4. How the app consumes them (so you don't design around problems that don't exist)

- **Options are shuffled at display** (`renderMC`, `index.html:2245`) and **question order
  is shuffled per round** (`startRound`, `index.html:2565`). So: always write the correct
  option **first** (`correctIndex: 0`), and don't worry about where in the array you insert
  an item. Position carries no meaning for the student.
- **Skill bars**: `qSkill()` maps `mc` → **Reading**, `rebuild` → **Listening**, everything
  else (`tap`, `writing`) → **Writing**. This is why comprehension items are `mc` and why
  the new type feeds the Writing bar automatically.
- **The grader** (`gradeWriting`, `index.html:2332`) normalizes away case, accents,
  punctuation and extra spaces, expands contractions, and forgives **one** typo — but never
  when the difference is an inflection (`s/es/d/ed/ing/ies`), never on words ≤3 characters,
  and never when what the student typed is itself a real word from the course. You do not
  need to defend against `He work` passing as a typo; that's handled.
- Blocks unlock in order (`requiresQuizToUnlockNext: true`), so "already taught" in §7.2 is
  guaranteed, not probable.

---

## 5. The rules for reading items

### 5.0 Level calibration: easy language, real reading work

This overrides every other rule in this section, and it cuts **both ways**. The English and
the Spanish both stay at the module's level — but the *task* must still require reading.
Getting one side right and the other wrong is the most common failure here.

**Which level.** The course has five modules and they are not all the same level:

| Module | File | Level |
|---|---|---|
| 1 · Primeros pasos | `data.js` | **A1** |
| 2 · A2 en acción | `data.js` | **A2** |
| 3 · Rumbo al B1 | `data_modulo3.js` | **B1** |
| 4 · Nivel B2 (FCE) | `data_modulo4.js` | **B2** |
| 5 · Nivel C1 (IELTS/TOEFL) | `data_modulo5.js` | **C1** |

The bans below hold at every level; what moves is the ceiling:

| | A1 (mod. 1) | A2 (mod. 2) | B1 (mod. 3) | B2–C1 (mod. 4–5) |
|---|---|---|---|---|
| Passage | 3–4 sentences, 15–30 words | 4–6 sentences, 25–50 | 5–7 sentences, 40–70 | 6–9 sentences, 60–110 |
| Tense | present only | past, future, continuous, often mixed | + perfect, conditionals, reported speech | any, incl. hypotheticals and hedged claims |
| Options | 3–8 words, no subordinate clauses | up to ~12 words, one subordinate clause | full clauses; may paraphrase rather than quote | may require weighing two readings of the same sentence |
| Question | who/what/where, one relation | compare two things, order events, infer a stated cause | infer an unstated attitude, intention or consequence | identify stance, implication, or which of two claims the text supports |

The task gets harder, the metalanguage does not. "¿Qué pasó primero?" is A2; "¿qué da a
entender que no piensa volver?" is B1; "¿con cuál de estas dos afirmaciones estaría de
acuerdo quien escribe?" is B2/C1. **"¿Por qué este verbo lleva -ed?" stays banned at every
level** — at B2 a metalinguistic question is not more advanced, it is just the wrong
instrument.

At B1 and above, one further shift: the correct answer should usually be a **paraphrase**
of what the text says rather than a restatement of its words, so that matching vocabulary
between option and passage stops being a shortcut to the answer.

**Too hard — banned.** These raise the *language* instead of the task:

- Riddle or metaphor stems: *"¿Qué palabra se esconde dentro de 'it's'?"* is a puzzle.
- Stems asking the student to justify a rule: *"¿Por qué las tres oraciones usan 'are' si
  una dice somos y otra estamos?"*
- Options that are grammar explanations: *"Porque en inglés 'to be' cubre ser y estar, y
  con 'we' siempre es 'are'."*

If the Spanish the student must read is harder than the English being tested, the item is
measuring metalanguage, not reading.

**Too easy — also banned.** These drop the *task* to nothing:

- One-sentence translation: *"We are at home." — ¿Qué significa?* → `Estamos en casa.`
  The answer is a word-for-word swap; nothing was read.
- Single-fact lookup where the answer is a copy of one sentence: *"I'm at the bus station."
  — ¿Dónde está?* → `En la estación.`
- Nonsense distractors the student eliminates without reading — `she are`, `she am`,
  `Somos una casa.` If three options are impossible, the item is a one-option question.

**Where difficulty comes from.** Not vocabulary, not grammar — these three:

1. **Competing referents.** Put 2+ people or things in the passage so a pronoun has to be
   resolved against a real alternative. *"Rosa is my sister and Luis is my brother. She's my
   friend and he's tired."* — ¿Quién está cansado?
2. **Answers that span two sentences.** The correct option combines facts the text states
   separately; no single sentence contains it. *"My sister isn't ready. My brothers aren't
   here. I'm not ready today."* — ¿Quiénes no están listos? → `La hermana y quien escribe.`
3. **Distractors that are all true-sounding.** Every option must be built from the text's
   own world, and at least two should mention something the text really says — just not the
   thing that was asked. *"…The hospital is in Lima. It is very big."* — ¿Qué es muy grande?
   → `El hospital.` / `Lima.` / `La hermana.` — Lima is genuinely in the text.

**Calibration:**

| | Item | Verdict |
|---|---|---|
| ✗ | ¿Qué palabra se esconde dentro de "she's"? | riddle |
| ✗ | ¿Por qué las tres oraciones usan "are"? | metalanguage |
| ✗ | "We are at home." ¿Qué significa? | translation, not reading |
| ✓ | "My brother and I are Peruvian. We are friends. Today we are at home." ¿Qué es cierto solo hoy? | must read three sentences and spot *today* |
| ✓ | "…Luis and Juan are teachers too. They are in the park." ¿A quiénes se refiere "they"? | must resolve across a four-person group |

**`¿Qué significa X?` is a last resort**, allowed only when the *form itself* is the lesson
(a contraction, say) and only if the distractors are plausible readings rather than
impossible forms. Prefer a question about what happens in the text.

### 5.1 One pair per theory block, built from that block's single claim

Every theory block asserts exactly one new thing. Turn it into two items with different
jobs:

- **A — resolve.** Who or what does the text refer to? (who is it about, who does the
  pronoun include, who is being addressed, what does `it` point to)
- **B — meaning.** What does this sentence or phrase mean in Spanish? What fact does the
  text state? Per §5.0, B asks for meaning, **not** for a justification of the rule. The
  block's claim is still what B targets — you reach it through what the sentence *means*,
  not through why it's built that way.

From `microlection1`:

| Block | Claim | A — resolve | B — justify / contrast |
|---|---|---|---|
| 1 · I | I + base verb | who is the text about → the writer | what the tense means → routine |
| 1b · I am | states take `am` | which clause is feeling, which is doing | why is he hungry (inference over both sentences) |
| 2 · we | we = I + my group | who "we" includes, from the antecedent | I vs. we in one text |
| 3 · you | you = tú *and* ustedes | notice to the whole team → ustedes | teacher to one student → tú |
| 4 · they | they for any group, gender-free | who "they" is → an outside group | why "they" for Rosa+Carmen → gender is irrelevant |
| 5 · he/she/it | -s on 3rd sg.; `it` for things | why `cooks` takes -s and `wash` doesn't | what is red → the phone, not the sister |

If a block teaches two things (like block 5: the `-s` rule *and* `it`), split the pair
across them rather than doubling on one.

**When the claim is orthographic or phonetic, the pair does NOT chase it.** Some blocks
teach something that changes no meaning at all — `a` vs `an`, `th` vs `t`, `ch` vs `sh`. A
comprehension item cannot test those: the only question you can build is *"which words in
the text are spelled with X?"*, which the student answers by looking at the letters without
understanding anything — a §5.0 lookup. In those blocks the reading pair tests **what the
passage means**, and the claim stays with the `tap` and `mc` drills that already carry it
(they usually number five or more). Say in your report that you did this and why.

### 5.2 Build the passage from the block's own examples

Nearly every English sentence in the 12 reference items is lifted **verbatim from the
theory table directly above it**. The passage's job is to put already-seen sentences into a
situation — never to teach new English.

New material is restricted to four slots:

1. a Peruvian proper noun — *Lima, Trujillo, Rosa, Milagros, Luis, Juan*
2. a time or place adjunct — *on Sundays, at night, today, every day, at 3 p.m., downtown*
3. a kinship noun — *my brother, my cousins, my sister, my brothers*
4. a high-frequency function word needed to join the sentences — *and, but, too, all, here,
   there*

Nothing else enters the passage. Note that slot 2 is doing real work under §5.0: a
*today* / *every day* contrast is the cheapest way to make a passage require reading
without adding a single new content word.

### 5.2b Blocks with no table — the fallback source

Only `microlection1` and `microlection2` have `| Español | Inglés |` tables.
`microlection3`'s table is English-only, and **`microlection4` through `microlection10` have
no tables at all** — their theory blocks are prose, often giving only patterns
(`This is ___`, `It is ___`) rather than complete sentences. §5.2 still holds; the source
just moves. In priority order, take your English from:

1. **Complete example sentences in the block's own prose**, including inside a `> 💡`
   callout — *"This is a tree. It is tall. That is a bus."*
2. **The block's existing `miniQuiz`** — the richest source in a table-less lesson. Every
   `mc` correct option, every `rebuild` `correctSentence`, and every `tap` `sentenceTokens`
   (with `correctedToken` substituted in) is a sentence the lesson has already committed to.
   `microlection4` block 1 gives no example sentence in prose, but its quiz supplies
   *This is a book*, *It is new*, *This is a phone*.
3. **Earlier blocks of the same microlección**, for a contrast item (§5.6).

Where the prose gives a pattern with a blank, fill it with a noun that already appears in
that block's own quiz items — never one you picked freely.

**Hard check:** every English sentence in your passage must be traceable to one of those
three sources. If you can't point at where a sentence came from, it doesn't go in.

### 5.3 Comprehension must never depend on an unglossed word

Where a genuinely new content word is unavoidable (`cooks`, `wash the dishes`, `buys`), the
**question must be structural**, so a student who doesn't know the word still answers
correctly:

> *"In my house, my sister cooks and my brothers wash the dishes." — ¿Por qué "cooks" lleva
> -s y "wash" no?*

is settled by *my sister* (one) vs. *my brothers* (several). You never need to know what
cooking is. The unknown word is never the thing being asked about.

### 5.4 One distractor is the misconception the theory pre-empts

State it as a **plausible reading of the text**, never as a grammar claim (§5.0). Not
*"Porque son mujeres y 'they' es solo femenino"* — instead put a mixed group in the passage
and offer *"Solo a los maestros hombres."* as an option. Same misconception, tested by
reading rather than by asking about the rule.

If the block's prose says "watch out for X", X becomes a wrong option:

- block 3 → *"A una sola persona, porque 'you' solo significa 'tú'."*
- block 4 → *"Porque son mujeres y 'they' es solo femenino."* (Rosa and Carmen are named
  female precisely so the misconception is live)
- block 5 → *"La hermana, porque es lo primero que se menciona."* (first-mention heuristic)
- block 5 → *"Porque cocinar es una tarea más importante que lavar."* (reading a
  grammatical fact as a semantic one)

### 5.5 The other distractors come from the lesson's own inventory

Wrong options are the *other persons/forms the lesson itself names* — written in Spanish as
descriptions of people or situations, **never as English pronouns**: *un amigo que no está
presente*, *un grupo de compañeros*, *la persona a la que le escribe*. For a
tense/meaning item, they're the tenses not being taught, likewise described: *el año
pasado*, *el próximo mes*, *cosas que nunca hace*.

### 5.6 Resolve items may reference untaught material; contrast items may not

Block 1's distractors describe we/you/they/he four blocks early — harmless, because the
student only has to see that the text says *I*; they never have to recognize the
alternatives. But block 2's contrast item (*I* vs. *we*) and block 5's (singular vs. plural
subject) require actually knowing both sides, so both are drawn from blocks already
completed.

**Rule: a contrast item may only contrast things the student has already been taught in
this microlección or an earlier one.**

### 5.7 When the form is ambiguous, use a minimal pair

Block 3's claim is that `you` is formally ambiguous, so no text-only item can test it. The
answer is two items with near-identical English and opposite correct answers, differing
only in the Spanish situational frame:

> *Un aviso para TODO el equipo del hospital dice: "You work here on weekends. You start at
> 8." — ¿A quién se dirige?*
>
> *Un profesor le dice a UN alumno: "You study medicine and you work here on Saturdays." —
> ¿Qué significa "you" aquí?*

Note these two **break the stem format** (§5.9) — the frame has to come first — and use
emphatic caps (`TODO`, `UN`) to carry the cue. Use this shape only when the block's point
genuinely is that form alone can't disambiguate.

### 5.8 Stay inside the lesson's own progression

`microlection1`'s passages walk the same near→far path the lesson announces in its
`sneakPeek` block: *yo → yo y mi hermano → el equipo / el alumno → mis primos → mi hermana,
mis hermanos → it*. No reading item introduces a person, place, or situation from outside
that progression, and the last item lands where the `resumen` and `cierre` land.

Read the target microlección's `mision`, `intro`, `sneakPeek`, `resumen` and `cierre`
blocks before writing. Your items must sit inside the world they establish.

### 5.9 Format contract

- Stem in Spanish; passage in English inside straight double quotes; joined by ` — `.
- Three passage shapes, all validated. Pick by what the content needs:
  1. **Narrative** — `Lee: "<passage>" — ¿<question>?` The default, for declarative content.
  2. **Situational frame** — a short Spanish line before the quote naming the speaker and
     the addressee: *Una profesora le dice a TODO el salón: "You are ready."* Use when the
     addressee is what makes the item answerable — questions, notices, `you`. Emphatic caps
     (`TODO`, `UN`) carry the cue.
  3. **Labelled dialogue** — speaker names inside the English quote: *"Rosa: Good evening.
     Nice to meet you. Milagros: Nice to meet you, too."* Use when the block's material is
     one-line utterances (a phrasebook) or when three or more speakers are needed; the
     Spanish frame does not scale past two. The names are §5.2 slot-1 proper nouns; no other
     new English enters.
- Passage: 3–4 short sentences, roughly 15–30 words. Two sentences is usually too little to
  read; the second and third are where the competing referent and the spanning answer live
  (§5.0).
- **Repeat the passage in full in every item that uses it.** Question order is shuffled, so
  a stem that says *"(mismo texto)"* or *"según el texto de arriba"* will appear alone and
  become unanswerable.
- Exactly 4 options, short and concrete — no subordinate clauses, no grammar explanations
  (§5.0). Around 3–8 words each.
- All four options must be the same kind of thing and roughly the same length, so neither
  length nor shape gives the answer away.
- Correct answer written first → `correctIndex: 0`.

---

## 6. Register and voice

Match the course, which is Peruvian, warm, and second-person. Existing prose uses *"ese
patita"*, *"chismear"*, *"¡Paja, no!"*, *"pe"*, emoji, and a mascot who addresses the
student directly. Item stems are more neutral than the theory prose — they don't joke — but
they stay in that world: Peruvian names and places, everyday work/study/family situations,
buses, hospitals, downtown. Never invent a US/UK setting.

Use `{{mascot}}` only if you write prose (you normally won't). Never hard-code "Ozzy" in
`src/content/data.js`.

---

## 7. The writing item contract

### 7.1 Prompt and answer come from the theory table

Format is always:

```js
writing('Escríbelo en inglés: "<oración en español>"', ['<English>.'], { … })
```

The Spanish sentence is lifted **verbatim from the block's theory table**, and
`accepted[0]` is that table's English cell, verbatim, with a final period.

**When the block has no Spanish/English table** (§5.2b — i.e. `microlection3` onward), you
write the Spanish prompt yourself, but `accepted[0]` is **not** yours to invent: it must be
an English sentence that already appears in the block, sourced by §5.2b's priority order.
Keep the Spanish prompt short and unambiguous, so exactly one English sentence answers it —
if two different English sentences would both be correct translations, rewrite the prompt or
add the second to `accepted`.

### 7.2 `reject` targets the error the block's own `tap` items drill

The writing item is the *productive* counterpart of the recognition error the taps test.
Block 1's taps catch `I ... studies`; block 1's writing item rejects `I works every day.`
with *"Ojo: la -s es sólo para he/she/it."* Each reason is one clause that names the rule
and gives the correct form.

### 7.3 `hint` only where the block introduces a new rule

Present in blocks 1, 1b and 5 — the blocks that teach something new. Omitted in blocks 2
and 4, whose rule is just block 1 restated. Don't hint at a rule the student has already
practiced.

**In a review or assessment lesson, omit hints entirely** — and say so in your report. This
test would zero them out mechanically anyway (nothing in a review is new), but the reason
is better than the accident: the point of a review block is to check what survived without
scaffolding. The `reject` reasons still carry the correction after the student answers,
which is where the teaching belongs in a review.

### 7.4 Skip the writing item when it would duplicate one you've already written

Block 3 (`you`) has **no** writing item, because *You work here.* would exercise exactly
what block 1's *I work every day.* already exercises — the unchanged base verb — with only
the pronoun swapped. The six writing items in `microlection1` cover six *distinct*
productive contrasts: base verb, `am` + state, `we`, `they`, `-ies`, `-es`.

Before adding a writing item, ask: **does this make the student produce a form no earlier
item in this microlección already made them produce?** If not, skip it and say so in your
report.

### 7.5 Removing an existing item

Allowed only when the new items make an old one redundant — a pure translation drill whose
answer sits verbatim in the theory table, on a rule the block already drills several times.
This happened once in `microlection1` (`'"Ella come pizza."'` was dropped from block 5).
If you do it, name the item and the reason in your report.

---

## 8. Special cases in module 1

- **`microlection8` — "Pronunciando como se debe."** Spelling and sound *are* the content
  here. Writing items in this lesson should generally use `strict: true`; reading items
  should test the sound/spelling relationship being taught, not general comprehension.
- **`microlection9` — "Evaluación Final del Módulo 1."** This is an assessment lesson.
  Check its theory blocks before assuming the pattern applies; if the blocks are review
  rather than new teaching, items should draw on the whole module rather than one block —
  flag this rather than forcing the template.
- **`microlection7` (7 blocks) and `microlection10` (6 blocks)** are the largest; budget
  accordingly.

---

## 8b. Special cases in module 2 (A2)

- **`modulo2-3`, `modulo2-4`, `modulo2-8`, `modulo2-12`** have no Spanish/English tables —
  §5.2b governs their sourcing. `modulo2-8` and `modulo2-2` are the largest at 6 blocks.
- **`modulo2-12` — "Escritura básica de correos y notas."** Writing *is* the subject here, so
  the writing item is the natural centre of each block rather than an afterthought — but the
  grader compares one normalized line, so a whole email cannot be graded. Target the single
  line the block teaches (a greeting, a sign-off, a `look forward to + -ing` clause), and
  note that §4's normalizer erases the capitalization that formal register depends on.
- **`modulo2-4` — Comparativos.** A comparison needs two things to compare, so this lesson
  is the best fit in the module for §5.0's competing-referents technique; a passage with two
  priced or sized items makes the reading task do the work.
- **Past-tense lessons (`modulo2-2`, `modulo2-8`)** unlock a difficulty source unavailable in
  module 1: a passage where events happen in an order the question asks about.

## 9. Procedure

For each theory block, in order:

1. Read the block's `markdown` and identify **the one claim** it makes.
2. Read the block's existing `miniQuiz` to see which errors are already drilled (the `tap`
   items) and which sentences are already used.
3. Read the microlección's `mision` / `intro` / `sneakPeek` for the world and progression.
4. Write item **A** (resolve) and item **B** (justify/contrast) per §5.
5. Write the writing item per §7, or skip it per §7.4.
6. Insert into `miniQuiz` in `src/content/data.js`, then the **identical** lines into
   `public/app/data.js`.

## 10. Verification before you report

- [ ] `node --check src/content/data.js` and `node --check public/app/data.js` both pass.
- [ ] `diff src/content/data.js public/app/data.js` shows **only** the pre-existing
      mascot/branding differences — none of your new lines.
- [ ] Every theory block in the target microlección has exactly 2 reading items, and 1
      writing item or a stated reason for skipping.
- [ ] Every English **sentence** in every passage is traceable to the block's prose, its
      existing `miniQuiz`, or an earlier block (§5.2 / §5.2b) — and every word outside those
      sentences is from an allowed slot in §5.2. Be ready to name the source for each.
- [ ] No item is answerable without reading the passage: no one-sentence translation, no
      single-fact lookup, no impossible distractors (§5.0).
- [ ] Every item repeats its passage in full — no "según el texto de arriba" (§5.9).
- [ ] Every item's correct answer is at index 0.
- [ ] No existing item was modified or deleted (except under §7.5, named in your report).
- [ ] Options are 4 full Spanish clauses, not bare words.
- [ ] No hard-coded mascot name in `src/content/data.js`.

## 11. Report back

- Per block: the claim you identified, and one line each on what A and B test.
- Any writing item skipped, with the duplicate it would have created.
- Any item deleted, with the reason.
- Anything where the spec didn't fit the block, and what you did instead. **Say this rather
  than forcing the template** — those cases are the most useful signal for the next batch.

---

## Worked example — `microlection1`, block 4 (`they`)

> ⚠️ `microlection1` predates §5.0 and is **not** the model for item B. Its B items ask the
> student to justify a rule (*"¿Por qué se usa 'they' y no otra palabra?"*) with long
> explanatory options — exactly what §5.0 now bans. Copy this example's **sourcing**
> (§5.2), **distractor logic** (§5.4–§5.6) and **writing contract** (§7). For item B's
> shape, follow §5.0 and look at `microlection2` / `microlection3` instead.

Theory claim: *they* is used for any outside group, and English doesn't mark its gender.

```js
mc('Lee: "My cousins live in Trujillo. They sing nicely and they play football." — ¿De quiénes habla el texto?', [
  'De un grupo ajeno a quien escribe: sus primos.',
  'Del grupo al que pertenece quien escribe.',
  'De la persona que está leyendo el texto.',
  'De una sola persona que no está presente.'], 0),
mc('Lee: "Rosa and Carmen sing nicely. They play football on Sundays." — ¿Por qué se usa "they" y no otra palabra?', [
  'Porque "they" vale para cualquier grupo, sean hombres o mujeres.',
  'Porque son mujeres y "they" es solo femenino.',
  'Porque están presentes en la conversación.',
  'Porque son exactamente dos personas.'], 0),
writing('Escríbelo en inglés: "Ellos cantan bonito."', ['They sing nicely.'],
  { reject: [['They sings nicely.', 'Con "they" el verbo no cambia: sing.']] }),
```

Why each piece is what it is:

- *They sing nicely* / *They play football* are the theory table's two rows, verbatim (§5.2).
- *My cousins*, *Trujillo*, *Rosa and Carmen*, *on Sundays* are the only additions — one
  kinship noun, one Peruvian place, two Peruvian names, one time adjunct (§5.2).
- Item A resolves the referent; item B justifies the choice of form (§5.1).
- A's distractors are the lesson's other persons, described not named — *we*, *you*, *he*
  (§5.5) — and A is a resolve item, so referencing block 5's *he* before it's taught is fine
  (§5.6).
- B's first distractor is exactly the misconception *"no importa el género"* exists to
  correct, and the names are female so it bites (§5.4).
- The writing item's Spanish is the table's row verbatim; its `reject` mirrors the block's
  own tap on `They ... plays` (§7.1, §7.2); no `hint`, because "the verb doesn't change" is
  block 1's rule restated (§7.3).
