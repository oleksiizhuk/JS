// Грамматический разбор текстов курса (уровень C1) — режим «📐 Grammar».
// Точка: quote — цитата из текста, конструкция выделена **так**; rule — что это
// и как работает; pattern — формула; examples — ещё примеры; trap — где B2
// ошибается; task — «сначала попробуй сам, потом раскрой ответ».
// Ключ GRAMMAR — id раздела из units.ts (текст Section 2 = радиопередача о Lena Horne).

export type GrammarPoint = {
  id: string;
  title: string;
  title_en: string;
  quote: string;
  rule: string;
  rule_en: string;
  pattern: string;
  examples: string[];
  trap: string;
  trap_en: string;
  task: { q: string; q_en: string; a: string; note?: string; note_en?: string };
};

// Исходный текст раздела: конструкции размечены [[id|фраза]], id — из GRAMMAR[unit].
// Клик по фразе на странице ведёт к карточке с этим правилом.
export type GrammarText = { speaker?: string; text: string }[];

export const GRAMMAR_TEXTS: Record<string, GrammarText> = {
  s2: [
    {
      speaker: "Radio announcer",
      text: "Last month, the renowned and much-loved singer Lena Horne died in New York, [[reduced-relatives|aged 92]]. This Afro-American singer and civil activist worked in America in the Golden era of stage and screen, meeting [[such-as-comment|such great names as]] Billie Holiday and Duke Ellington. We have with us here in the studio Joel Lightwater to tell us more about Lena Horne's remarkable life.",
    },
    {
      speaker: "Joel Lightwater",
      text: "Thank you, John. Lena Horne was born in 1917 to a Brooklyn family, [[reduced-relatives|described by a prominent writer]] as the 'Talented Tenth' – a name which was given to those members of the African American community who were educated and socially prominent. Her family were activists in African-American rights – her grandmother, Cora Calhoun, was in fact the founding member of the N.A.A.C.P., that is, the National Association for the Advancement of Coloured People. Indeed, at the age of two, Lena was photographed parading in a protest.",
    },
    {
      text: "Her childhood was split between her grandparents' town house in Brooklyn, and her mother's lodgings in Harlem, [[having-left|her father having left the family]] when Lena was only three years old. She went to school at Brooklyn Girls High, but when she started singing at the famous Cotton Club at the age of 16, she dropped out without a diploma.",
    },
    {
      text: "All her life, Lena's mother Edna [[had-come-before|had hoped]] that Lena could use her performances to break down race barriers. This was not an easy thing to do in the race-conscious culture of the time. At one point Lena was advised to advertise her creamy complexion as Latin, [[such-as-comment|something she refused to do]]; while later in her career, studio executives in Hollywood [[subjunctive|suggested that she darken]] her skin colour with make-up.",
    },
    {
      text: "[[reduced-relatives|Matters relating to]] racial equality were always high up on Lena's priorities. During World War II, when she was entertaining soldiers and prisoners of war, she noticed that [[was-being-asked|she was always being asked]] to perform for groups which segregated in terms of colour. [[reduced-relatives|In the rare instances where]] she sang for mixed groups, white German prisoners of war were seated in front of the African American servicemen. She soon refused to perform for such occasions, and, [[since-present-perfect|since]] the US Army refused to allow integrated audiences, she put on her own show for a mixed-colour audience.",
    },
    {
      text: "After the war years, Lena had the opportunity to move into the glamorous world of Hollywood, and she was [[to-be-signed|the first African American to be signed]] on a long-term studio contract. However, this was an age when the colour barrier was still strong. Black actors rarely had the chance to play anything more than maids and butlers. Although Lena was beginning to achieve a high level of notoriety, she found that she rarely had the chance to act, and many of her lines were cut during the editing process. [[inversion-only|Only in two incidences did she play]] a character that was central to the plot.",
    },
    {
      text: "But Lena's elegance and powerful voice were [[had-come-before|unlike anything that had come before]], and both the public and the executives in the entertainment industry began to take note. [[by-mid-40s|By the mid-'40s]], Horne was the highest paid black actor in the country, and her songs were instant classics.",
    },
    {
      text: "However, Horne's great fame [[prevent-from|could not prevent the wheels of the anti-Communist machine from bearing down on her]]. During the 1950s, she was marked as a Communist sympathiser as a result of her civil rights activism. She soon [[prevent-from|found herself blacklisted]] and unable to work on television or in the movies. At this time, however, she continued to sing in nightclubs, and made some of her best recordings. In the 60s, she was once again back in the public eye.",
    },
    {
      text: "[[since-present-perfect|Since the 16-year-old danced]] her first steps on the stage of the Cotton Club, [[since-present-perfect|much has changed]]. Thanks to her continued musical, theatrical and political efforts, she paved the way for many other non-whites in the entertainment industry. But [[what-clause|what she will be remembered for most of all must be]] her ability to move generations of audiences with her shimmering resonant voice, singing the classic greats, like \"Black Coffee\" and the unforgettable \"Stormy Weather.\"",
    },
  ],
};

export const GRAMMAR: Record<string, GrammarPoint[]> = {
  s2: [
    {
      id: "having-left",
      title: "Причастный оборот со своим подлежащим: her father having left",
      title_en: "Participle clause with its own subject: her father having left",
      quote:
        "Her childhood was split between her grandparents' town house in Brooklyn, and her mother's lodgings in Harlem, **her father having left the family** when Lena was only three years old.",
      rule:
        "«Абсолютная» конструкция: у причастия своё подлежащее (her father), не совпадающее с подлежащим главного предложения (her childhood). having + V3 говорит, что действие случилось РАНЬШЕ главного и объясняет его причину: = because her father had left the family. Это письменный, формальный стиль; в разговоре скажут просто because her father had left.",
      rule_en:
        "An 'absolute' clause: the participle has its own subject (her father), different from the main-clause subject (her childhood). having + V3 marks an action that happened EARLIER and explains the cause: = because her father had left the family. Written, formal register; in speech you would just say because her father had left.",
      pattern: "[own subject] + having + V3, main clause   /   main clause, [own subject] + having + V3",
      examples: [
        "The rain having stopped, we went out.",
        "The meeting having ended early, everyone left.",
        "Having finished the report, she went home.  (no own subject → she both finished and went)",
      ],
      trap:
        "Без своего подлежащего причастие относится к подлежащему главной части. «Having left the family, her childhood was split…» — ошибка: получается, что семью бросило детство (dangling participle). Либо добавь подлежащее (her father having left), либо перестрой предложение.",
      trap_en:
        "Without its own subject the participle attaches to the main-clause subject. 'Having left the family, her childhood was split…' is wrong — it says the childhood left the family (a dangling participle). Either add the subject (her father having left) or rebuild the sentence.",
      task: {
        q: "Перепиши через having: Because the manager had approved the budget, the team started hiring.",
        q_en: "Rewrite with having: Because the manager had approved the budget, the team started hiring.",
        a: "The manager having approved the budget, the team started hiring.",
        note: "Подлежащие разные (the manager / the team), поэтому the manager остаётся перед having.",
        note_en: "The subjects differ (the manager / the team), so the manager stays in front of having.",
      },
    },
    {
      id: "to-be-signed",
      title: "the first … to be signed: инфинитив после the first / the only / превосходной степени",
      title_en: "the first … to be signed: infinitive after the first / the only / a superlative",
      quote: "she was **the first African American to be signed** on a long-term studio contract.",
      rule:
        "После the first / the second / the last / the only / превосходной степени (the youngest) вместо придаточного who was signed ставят инфинитив. Если существительное само действует — активный инфинитив (the first to arrive); если действие совершают над ним — пассивный: to be + V3 (to be signed = «которого подписали»). Та же схема даёт to be issued: documents to be issued next week = документы, которые выдадут / должны быть выданы — инфинитив после существительного часто значит «предстоит, должен».",
      rule_en:
        "After the first / the second / the last / the only / a superlative (the youngest) the relative clause who was signed is replaced by an infinitive. If the noun does the action — active infinitive (the first to arrive); if the action is done to it — passive: to be + V3 (to be signed). The same pattern gives to be issued: documents to be issued next week = documents that will / must be issued — an infinitive after a noun often means 'due to, to be done'.",
      pattern: "the first / only / last / -est + noun + to + V (active)   |   to be + V3 (passive)",
      examples: [
        "She was the youngest player to be selected for the team.",
        "He was the last to leave.",
        "There are three forms to be filled in.  (= that must be filled in)",
        "This is the only file to be updated automatically.",
      ],
      trap:
        "«the first African American who was signed» — грамматично, но тяжело; на C1 ждут инфинитив. Выбирай залог по смыслу: the first person to walk on the Moon (сам шёл) vs the first film to be shot in colour (фильм снимали). И не путай с инфинитивом цели: I went there to be seen — «чтобы меня увидели».",
      trap_en:
        "'the first African American who was signed' is grammatical but heavy; C1 expects the infinitive. Pick the voice by meaning: the first person to walk on the Moon (he walked) vs the first film to be shot in colour (the film was shot). Don't confuse it with the infinitive of purpose: I went there to be seen — 'so that people would see me'.",
      task: {
        q: "Сократи: The report was the only document which was signed by the CEO.",
        q_en: "Shorten: The report was the only document which was signed by the CEO.",
        a: "The report was the only document to be signed by the CEO.",
        note: "Документ подписывали → пассив to be signed. Для сравнения: Armstrong was the first person to walk on the Moon — актив.",
        note_en: "The document was signed by someone → passive to be signed. Compare: Armstrong was the first person to walk on the Moon — active.",
      },
    },
    {
      id: "had-come-before",
      title: "Past Perfect в придаточном: anything that had come before; had hoped",
      title_en: "Past Perfect in a relative clause: anything that had come before; had hoped",
      quote:
        "Lena's elegance and powerful voice were **unlike anything that had come before**. / All her life, Lena's mother Edna **had hoped** that Lena could use her performances to break down race barriers.",
      rule:
        "Точка отсчёта — прошлое (were, Past Simple), а «до этого» — ещё более раннее прошлое → Past Perfect (had come). Русский такого различия не делает («не похожи ни на что, что было раньше»), поэтому B2 ставит was/came. Сигналы: before, until then, by that time, ever/never. Второй случай: had hoped — надежда началась раньше и тянулась до момента в прошлом; had hoped / had expected / had planned часто намекают, что надежда не (полностью) сбылась.",
      rule_en:
        "The reference point is in the past (were, Past Simple), and 'before that' is an even earlier past → Past Perfect (had come). Russian doesn't mark this, so B2 speakers write was/came. Signals: before, until then, by that time, ever/never. The second case: had hoped — the hope began earlier and lasted up to a past moment; had hoped / had expected / had planned often imply the hope was not (fully) realised.",
      pattern: "past reference point (Past Simple) … that / which + had + V3 (earlier)",
      examples: [
        "It was the best film I had ever seen.",
        "She recognised the man who had helped her years before.",
        "We had hoped to finish by Friday, but the client changed the brief.  (unfulfilled hope)",
      ],
      trap:
        "Не ставь Past Perfect везде: если порядок ясен из after/before между двумя действиями, Past Simple допустим (After she left, he called). Но anything / nothing / ever … before + точка в прошлом — только had + V3.",
      trap_en:
        "Don't use Past Perfect everywhere: when after/before already shows the order of two actions, Past Simple is fine (After she left, he called). But anything / nothing / ever … before + a past reference point — only had + V3.",
      task: {
        q: "Раскрой скобки: Nothing like this ___ (happen) before, so the crowd was stunned.",
        q_en: "Open the brackets: Nothing like this ___ (happen) before, so the crowd was stunned.",
        a: "had happened",
        note: "was stunned — точка в прошлом; before — сигнал более раннего прошлого.",
        note_en: "was stunned is the past reference point; before signals an earlier past.",
      },
    },
    {
      id: "inversion-only",
      title: "Инверсия после Only + обстоятельство: Only in two instances did she play",
      title_en: "Inversion after Only + adverbial: Only in two instances did she play",
      quote: "**Only in two incidences did she play** a character that was central to the plot.",
      rule:
        "Если предложение начинается с ограничительного или отрицательного обстоятельства (Only in…, Only then, Only after, Never, Rarely, Seldom, Not until, No sooner, Under no circumstances, Little), вспомогательный глагол встаёт ПЕРЕД подлежащим, как в вопросе: did she play, а не she played. В Past Simple вспомогательного нет — появляется did + базовая форма. Это эмфаза, формальная речь и письмо.",
      rule_en:
        "When a sentence opens with a restrictive or negative adverbial (Only in…, Only then, Only after, Never, Rarely, Seldom, Not until, No sooner, Under no circumstances, Little), the auxiliary goes BEFORE the subject, as in a question: did she play, not she played. Past Simple has no auxiliary, so did + base form appears. It's emphatic, formal speech and writing.",
      pattern: "Only + adverbial / Never / Rarely / Not until X + AUX + subject + verb",
      examples: [
        "Only after the war did she return to the stage.",
        "Not until 1960 was she allowed back on TV.",
        "Rarely have I seen such talent.",
        "Never did he admit the mistake.",
      ],
      trap:
        "Only + подлежащее — без инверсии: Only Lena played the lead (only относится к Lena). Инверсия только когда only стоит перед обстоятельством (времени, места, условия). И после did — базовая форма: did she play, не did she played. Кстати, в тексте incidences — редкое слово; обычно говорят instances.",
      trap_en:
        "Only + subject — no inversion: Only Lena played the lead (only modifies Lena). Invert only when only precedes an adverbial (time, place, condition). And after did comes the base form: did she play, not did she played. By the way, incidences in the text is rare; instances is the usual word.",
      task: {
        q: "Начни с Only when: She realised the truth only when she read the letter.",
        q_en: "Start with Only when: She realised the truth only when she read the letter.",
        a: "Only when she read the letter did she realise the truth.",
        note: "Инверсия — в ГЛАВНОЙ части (did she realise), а не внутри when-придаточного.",
        note_en: "The inversion is in the MAIN clause (did she realise), not inside the when-clause.",
      },
    },
    {
      id: "subjunctive",
      title: "suggested that she darken: сослагательное после suggest / insist / demand",
      title_en: "suggested that she darken: the subjunctive after suggest / insist / demand",
      quote: "studio executives in Hollywood **suggested that she darken** her skin colour with make-up.",
      rule:
        "После глаголов требования и предложения (suggest, recommend, insist, demand, propose, request, а также it is essential / vital that) в that-придаточном стоит голая базовая форма: darken, а не darkens / darkened. Это mandative subjunctive — стандарт в американском и формальном британском английском. Британский разговорный вариант — should darken. Рядом в тексте другой глагол с другой схемой: Lena was advised to advertise… — advise берёт object + to-infinitive.",
      rule_en:
        "After verbs of demand and suggestion (suggest, recommend, insist, demand, propose, request, also it is essential / vital that) the that-clause takes the bare base form: darken, not darkens / darkened. This is the mandative subjunctive — standard in American and formal British English. Colloquial British uses should darken. Nearby in the text, a verb with a different pattern: Lena was advised to advertise… — advise takes object + to-infinitive.",
      pattern: "suggest / recommend / insist / demand + that + subject + V1   (or should + V1)",
      examples: [
        "The doctor recommended that he stop smoking.",
        "They insisted that the meeting be postponed.  (be, not is)",
        "I suggest (that) we leave early.",
        "It is essential that every applicant submit two references.",
      ],
      trap:
        "«suggested her to darken» — самая частая ошибка: suggest НЕ берёт object + to. Варианты: suggest doing / suggest that sb (should) do. В пассиве видно особенно хорошо: that the contract be signed, а не is signed.",
      trap_en:
        "'suggested her to darken' is the classic mistake: suggest does NOT take object + to. Options: suggest doing / suggest that sb (should) do. The passive shows it clearly: that the contract be signed, not is signed.",
      task: {
        q: "Исправь: The lawyer suggested her to sign the contract.",
        q_en: "Correct: The lawyer suggested her to sign the contract.",
        a: "The lawyer suggested that she sign the contract.  /  The lawyer suggested signing the contract.",
        note: "Оба варианта верны; в британском разговорном — suggested that she should sign.",
        note_en: "Both are correct; colloquial British — suggested that she should sign.",
      },
    },
    {
      id: "was-being-asked",
      title: "was always being asked: Past Continuous Passive + always",
      title_en: "was always being asked: Past Continuous Passive + always",
      quote:
        "when she was entertaining soldiers and prisoners of war, she noticed that **she was always being asked** to perform for groups which segregated in terms of colour.",
      rule:
        "was / were + being + V3 — пассив в длительной форме: действие совершали над ней, и оно длилось или повторялось. always / constantly + continuous = «вечно, постоянно» с оттенком раздражения. Фон задаёт Past Continuous в активе (was entertaining), а на его фоне — noticed (Past Simple).",
      rule_en:
        "was / were + being + V3 — the passive in the continuous: the action was done to her, and it was ongoing or repeated. always / constantly + continuous = 'forever, constantly' with a note of irritation. The background is Past Continuous active (was entertaining), against which noticed (Past Simple) happens.",
      pattern: "was / were + (always) + being + V3",
      examples: [
        "The road was being repaired when we passed.",
        "He's always being told what to do.",
        "I was constantly being interrupted during the talk.",
      ],
      trap:
        "B2 тянет к «she was always asked» — это тоже верно, но нейтрально: факт без процесса и эмоции. being добавляет повторяемость и раздражение. Не путай being asked (Continuous) с been asked (Perfect: has been asked).",
      trap_en:
        "B2 speakers reach for 'she was always asked' — also correct, but neutral: a fact, no process, no emotion. being adds repetition and irritation. Don't confuse being asked (Continuous) with been asked (Perfect: has been asked).",
      task: {
        q: "Past Continuous Passive с constantly: People kept interrupting me during the talk.",
        q_en: "Past Continuous Passive with constantly: People kept interrupting me during the talk.",
        a: "I was constantly being interrupted during the talk.",
      },
    },
    {
      id: "reduced-relatives",
      title: "Сокращённые придаточные: described by…, matters relating to…, aged 92",
      title_en: "Reduced relative clauses: described by…, matters relating to…, aged 92",
      quote:
        "a Brooklyn family, **described by a prominent writer** as the 'Talented Tenth' / **Matters relating to** racial equality were always high up on Lena's priorities / Lena Horne died in New York, **aged 92**.",
      rule:
        "who / which + be выбрасывают, остаётся причастие: (which was) described → described; (which relate) → relating; (who was) aged 92 → aged 92. V3 — пассив (над существительным что-то сделали), V-ing — актив (оно само делает). Именно эта плотность и делает текст «C1»: в каждом предложении по 2–3 свёрнутых придаточных.",
      rule_en:
        "who / which + be is dropped, leaving the participle: (which was) described → described; (which relate) → relating; (who was) aged 92 → aged 92. V3 = passive (something was done to the noun), V-ing = active (the noun does it). This density is exactly what makes the text 'C1': two or three folded clauses per sentence.",
      pattern: "noun + V3 … (passive)   |   noun + V-ing … (active)",
      examples: [
        "The people (who were) invited to the party all came.",
        "Students (who are) wishing to apply should write to the office.",
        "The singer, (who was) born in 1917, died aged 92.",
      ],
      trap:
        "Направление причастия: the letter sending ✗ → the letter sent (письмо отправили). aged 92 — прилагательное, не глагол: at aged 92 ✗ → at the age of 92 или просто aged 92. Ещё из текста: in the rare instances where she sang — после instances / cases / situations ставят where, не when.",
      trap_en:
        "Participle direction: the letter sending ✗ → the letter sent (the letter was sent). aged 92 is an adjective, not a verb: at aged 92 ✗ → at the age of 92 or simply aged 92. Also from the text: in the rare instances where she sang — after instances / cases / situations use where, not when.",
      task: {
        q: "Сократи оба придаточных: The exhibition, which was opened by the mayor, attracted people who were interested in art.",
        q_en: "Reduce both clauses: The exhibition, which was opened by the mayor, attracted people who were interested in art.",
        a: "The exhibition, opened by the mayor, attracted people interested in art.",
      },
    },
    {
      id: "since-present-perfect",
      title: "Since the 16-year-old danced…, much has changed",
      title_en: "Since the 16-year-old danced…, much has changed",
      quote: "**Since the 16-year-old danced** her first steps on the stage of the Cotton Club, **much has changed**.",
      rule:
        "since + точка в прошлом (Past Simple: danced) → главная часть в Present Perfect (has changed), потому что период тянется до сих пор. Бонус: the 16-year-old — составное слово через дефисы и БЕЗ -s (year, а не years); здесь оно работает как существительное («шестнадцатилетняя»). Не путать с другим since в тексте: since the US Army refused to allow integrated audiences = because — там никаких ограничений на время.",
      rule_en:
        "since + a point in the past (Past Simple: danced) → the main clause in Present Perfect (has changed), because the period runs up to now. Bonus: the 16-year-old — hyphenated and WITHOUT -s (year, not years); here it works as a noun ('the sixteen-year-old girl'). Don't confuse it with the other since in the text: since the US Army refused to allow integrated audiences = because — no tense restriction there.",
      pattern: "Since + S + Past Simple, S + has / have + V3",
      examples: [
        "Since she left, the office has been quiet.",
        "Much has happened since we last met.",
        "a five-year-old boy / a ten-minute break  (no -s)",
      ],
      trap:
        "Since she has left… ✗ — в since-части Past Simple. 16-years-old girl ✗ — без -s. Much has changed — much с неисчисляемым «многое»; в утверждениях much звучит книжно, в речи — a lot has changed.",
      trap_en:
        "Since she has left… ✗ — the since-clause takes Past Simple. 16-years-old girl ✗ — no -s. Much has changed — much as 'a great deal'; in affirmative sentences much sounds bookish, in speech say a lot has changed.",
      task: {
        q: "Одно предложение с since: We moved here in 2019. A lot changed.",
        q_en: "One sentence with since: We moved here in 2019. A lot changed.",
        a: "A lot has changed since we moved here in 2019.",
      },
    },
    {
      id: "prevent-from",
      title: "could not prevent X from bearing down; found herself blacklisted",
      title_en: "could not prevent X from bearing down; found herself blacklisted",
      quote:
        "Horne's great fame **could not prevent the wheels** of the anti-Communist machine **from bearing down on her**. / She soon **found herself blacklisted** and unable to work.",
      rule:
        "prevent / stop / keep / discourage + object + from + V-ing — единственная схема, никаких to. Метафора the wheels of the machine bearing down on her — «колёса машины наезжают». find oneself + V3 / adjective = «оказаться в положении»: found herself blacklisted, found herself unable to work.",
      rule_en:
        "prevent / stop / keep / discourage + object + from + V-ing — the only pattern, no to. The metaphor the wheels of the machine bearing down on her — the wheels 'roll over' her. find oneself + V3 / adjective = 'end up in a situation': found herself blacklisted, found herself unable to work.",
      pattern: "prevent + sb / sth + from + V-ing   |   find oneself + V3 / adjective",
      examples: [
        "Nothing could stop him from leaving.",
        "The noise kept me from sleeping.",
        "After the merger she found herself reporting to a former colleague.",
      ],
      trap:
        "prevent him to leave ✗, prevent that he leaves ✗. У avoid другая схема — без from: avoid doing. Разница: prevent — не дать случиться, avoid — самому уклониться.",
      trap_en:
        "prevent him to leave ✗, prevent that he leaves ✗. avoid has a different pattern — no from: avoid doing. The difference: prevent = stop something happening, avoid = stay away from it yourself.",
      task: {
        q: "Через prevent: The rain didn't allow us to go out.",
        q_en: "With prevent: The rain didn't allow us to go out.",
        a: "The rain prevented us from going out.",
      },
    },
    {
      id: "what-clause",
      title: "What she will be remembered for … must be: what-подлежащее и must как вывод",
      title_en: "What she will be remembered for … must be: a what-clause subject and deductive must",
      quote: "But **what she will be remembered for most of all must be** her ability to move generations of audiences with her shimmering resonant voice.",
      rule:
        "What she will be remembered for = «то, за что её будут помнить» — целое придаточное работает подлежащим. Предлог остаётся в конце (remembered FOR) — это нормально даже в формальном письме. must be здесь — не «должна», а логический вывод: «наверняка это её голос». Схема: What-clause + must be / is + именная часть.",
      rule_en:
        "What she will be remembered for = 'the thing she will be remembered for' — a whole clause acting as the subject. The preposition stays at the end (remembered FOR) — fine even in formal writing. must be here is not obligation but deduction: 'it is surely her voice'. Pattern: What-clause + must be / is + noun phrase.",
      pattern: "What + S + V (+ preposition) + is / must be + …",
      examples: [
        "What I like most about the job is the people.",
        "What she was famous for was her voice.",
        "What matters most must be the result, not the process.",
      ],
      trap:
        "That she will be remembered for… ✗ — that не значит «то, что». Не переводи must как «должна»: с be + существительное это почти всегда вывод (This must be the place). Вынести предлог вперёд (for what she will be remembered) — грамматично, но звучит неестественно.",
      trap_en:
        "That she will be remembered for… ✗ — that can't mean 'the thing that'. Don't read must as obligation: with be + noun it is almost always deduction (This must be the place). Fronting the preposition (for what she will be remembered) is grammatical but sounds unnatural.",
      task: {
        q: "Начни с What: She was admired most of all for her honesty.",
        q_en: "Start with What: She was admired most of all for her honesty.",
        a: "What she was admired for most of all was her honesty.",
      },
    },
    {
      id: "such-as-comment",
      title: "such great names as …; something she refused to do",
      title_en: "such great names as …; something she refused to do",
      quote:
        "meeting **such great names as** Billie Holiday and Duke Ellington / advertise her creamy complexion as Latin, **something she refused to do**.",
      rule:
        "such + существительное + as + примеры = like, только формальнее и без оттенка сравнения. something (which) she refused to do — «комментирующее» приложение ко всему предыдущему предложению; which опущено, потому что оно дополнение (refused to do IT). В речи чаще: …, which she refused to do.",
      rule_en:
        "such + noun + as + examples = like, only more formal and without a comparison flavour. something (which) she refused to do is a 'comment' apposition on the whole previous clause; which is dropped because it is the object (refused to do IT). In speech: …, which she refused to do.",
      pattern: "such + noun phrase + as + X, Y   |   …, something / a thing (that) + S + V",
      examples: [
        "He worked with such stars as Sinatra and Fitzgerald.",
        "They cancelled the show, something the fans never forgave.",
        "She was offered a raise, an offer she accepted at once.",
      ],
      trap:
        "such as great names ✗ — порядок such + noun + as. something what she refused ✗ — what здесь невозможен. И запятая перед something обязательна: это приложение, а не продолжение фразы.",
      trap_en:
        "such as great names ✗ — the order is such + noun + as. something what she refused ✗ — what is impossible here. The comma before something is required: it's an apposition, not a continuation of the phrase.",
      task: {
        q: "Одно предложение с something: He was asked to lie for the company. He refused.",
        q_en: "One sentence with something: He was asked to lie for the company. He refused.",
        a: "He was asked to lie for the company, something he refused to do.",
      },
    },
    {
      id: "by-mid-40s",
      title: "By the mid-'40s, Horne was the highest paid…: by + время",
      title_en: "By the mid-'40s, Horne was the highest paid…: by + time",
      quote: "**By the mid-'40s**, Horne **was** the highest paid black actor in the country, and her songs were instant classics.",
      rule:
        "by + момент = «к этому времени, не позже». С состоянием — Past Simple (was the highest paid); с завершённым действием к моменту в прошлом — Past Perfect (By 1945 she had made three films). Мелочи: the mid-'40s — апостроф заменяет 19, mid- через дефис; the highest paid = the highest-paid (составная превосходная степень).",
      rule_en:
        "by + a point in time = 'by then, no later than'. With a state — Past Simple (was the highest paid); with an action completed before a past moment — Past Perfect (By 1945 she had made three films). Details: the mid-'40s — the apostrophe replaces 19, mid- is hyphenated; the highest paid = the highest-paid (a compound superlative).",
      pattern: "By + past time + Past Simple (state)   |   Past Perfect (completed action)",
      examples: [
        "By 1950 she had made three films.",
        "By then, he was a star.",
        "By the time we arrived, the show had started.",
      ],
      trap:
        "by ≠ until: by Friday — не позже пятницы (дедлайн), until Friday — вплоть до пятницы (длительность). Десятилетия: in the 1940s / the '40s — без апострофа перед s; 1940's ✗ (частая ошибка даже у носителей).",
      trap_en:
        "by ≠ until: by Friday — no later than Friday (a deadline), until Friday — all the way to Friday (duration). Decades: in the 1940s / the '40s — no apostrophe before s; 1940's ✗ (a common error even among natives).",
      task: {
        q: "By 1945 + Past Perfect с become: She started acting in 1938. In 1945 she was already famous.",
        q_en: "By 1945 + Past Perfect with become: She started acting in 1938. In 1945 she was already famous.",
        a: "By 1945 she had become famous.",
      },
    },
  ],
};
