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
  it: string[]; // примеры из IT / рабочего контекста
  me: string[]; // примеры «о себе» для собеседования
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
  s3: [
    {
      text: "I’m backstage at a small theatre, talking to a children's entertainer. [[present-perfect-over|Has the job changed over twenty years?]] '[[echo-answer|It certainly has]]. There's more rowdiness now — kids arrive [[dependent-prepositions|high on sugar]] and phones.' How do you [[dependent-prepositions|cope with]] that?",
    },
    {
      text: "'With a rowdy kid, we [[phrasal-separability|bring the parent up]] on stage and [[let-watch-bare-inf|let the child watch them squirm]]. [[embedded-question|You never know what they’re going to come up with]], but I’m [[dependent-prepositions|up for]] that. [[onus-to-inf|The onus is on me to keep control]], and you [[or-otherwise|can’t diverge from the script too far or the whole room goes with you]].'",
    },
    {
      text: "The corporate side, [[spoken-markers|he admits]], is very lucrative. '[[what-cleft|But what has also driven me is the fact that I was dyslexic]]. School was a tough crowd. [[spoken-markers|Adults are worse, mind]] — they [[phrasal-separability|get boozed up]] at Christmas parties and heckle.'",
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
      it: [
        "The API having changed in v3, we had to rewrite the client.",
        "The tests having passed, the pipeline deployed the build automatically.",
      ],
      me: [
        "My contract having ended in May, I started looking for a new role.",
        "Having spent five years in React, I moved on to React Native.",
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
      it: [
        "This was the first service to be migrated to TypeScript.",
        "There are still two PRs to be reviewed before the release.",
        "The only test to be skipped is the flaky one.",
      ],
      me: [
        "I was the first developer to be hired on that team.",
        "I was the only candidate to be invited to the final round.",
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
      it: [
        "The new architecture was unlike anything the team had built before.",
        "We had hoped to ship by Friday, but a blocker came up.",
      ],
      me: [
        "By the time I joined, the codebase had already grown to 200k lines.",
        "I had hoped to become a team lead earlier, but the company froze promotions.",
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
        "Если предложение начинается с ограничительного или отрицательного обстоятельства (Only in…, Only then, Only after, Never, Rarely, Seldom, Not until, No sooner, Under no circumstances, Little — как в Little did she know), вспомогательный глагол встаёт ПЕРЕД подлежащим, как в вопросе: did she play, а не she played. В Past Simple вспомогательного нет — появляется did + базовая форма. Это эмфаза, формальная речь и письмо.",
      rule_en:
        "When a sentence opens with a restrictive or negative adverbial (Only in…, Only then, Only after, Never, Rarely, Seldom, Not until, No sooner, Under no circumstances, Little — as in Little did she know), the auxiliary goes BEFORE the subject, as in a question: did she play, not she played. Past Simple has no auxiliary, so did + base form appears. It's emphatic, formal speech and writing.",
      pattern: "Only + adverbial / Never / Rarely / Not until X + AUX + subject + verb",
      examples: [
        "Only after the war did she return to the stage.",
        "Not until 1960 was she allowed back on TV.",
        "Rarely have I seen such talent.",
        "Never did he admit the mistake.",
      ],
      it: [
        "Only after we added caching did the response time drop below 100 ms.",
        "Not until the logs were enabled did we find the memory leak.",
      ],
      me: [
        "Only when I started mentoring juniors did I realise how much I knew.",
        "Never have I worked on a project without automated tests.",
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
      it: [
        "The reviewer suggested that we extract the hook into a separate file.",
        "The client insisted that the app be released before Black Friday.",
      ],
      me: [
        "My manager recommended that I take the AWS certification.",
        "I suggested that we switch to TypeScript, and the team agreed.",
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
      it: [
        "While the feature was being tested, the API was constantly being changed.",
        "The build was being deployed when the outage started.",
      ],
      me: [
        "In my last job I was constantly being pulled into meetings.",
        "I was being interviewed by three people at once.",
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
        "Придаточное who / which … сворачивают в причастие. Пассив: who / which + be выбрасывают, остаётся V3: (which was) described → described; (who was) aged 92 → aged 92. Актив: which выбрасывают, а глагол превращают в V-ing: (which relate) → relating. Итого: V3 — над существительным что-то сделали, V-ing — оно само делает. Именно эта плотность и делает текст «C1»: в каждом предложении по 2–3 свёрнутых придаточных.",
      rule_en:
        "The who / which clause is folded into a participle. Passive: who / which + be is dropped, leaving V3: (which was) described → described; (who was) aged 92 → aged 92. Active: which is dropped and the verb turns into V-ing: (which relate) → relating. So: V3 = something was done to the noun, V-ing = the noun does it. This density is exactly what makes the text 'C1': two or three folded clauses per sentence.",
      pattern: "noun + V3 … (passive)   |   noun + V-ing … (active)",
      examples: [
        "The people (who were) invited to the party all came.",
        "Students wishing to apply should write to the office.  (= who wish to apply)",
        "The singer, (who was) born in 1917, died aged 92.",
      ],
      it: [
        "Components rendered on the server can't use browser APIs.",
        "Any request exceeding 5 seconds is cancelled.",
        "The bug, reported last week, is fixed in 2.3.1.",
      ],
      me: [
        "I'm a frontend developer based in Kyiv, working mainly with React Native.",
        "Most of the apps built by our team are e-commerce.",
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
      it: [
        "Since we migrated to TypeScript, the number of runtime errors has dropped by half.",
        "A lot has changed in React since hooks arrived.",
      ],
      me: [
        "Since I joined the company, I've shipped three mobile apps.",
        "I've been doing frontend since 2018.  (a period up to now → have been + -ing)",
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
      it: [
        "Type checking prevents a lot of bugs from reaching production.",
        "Rate limiting stops one client from overloading the API.",
        "After the merger we found ourselves maintaining two codebases.",
      ],
      me: [
        "A tight deadline didn't prevent me from writing tests.",
        "I found myself leading the project after the team lead left.",
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
      it: [
        "What makes React Native attractive is one codebase for two platforms.",
        "What the app was criticised for was slow startup.",
      ],
      me: [
        "What I'm best at is turning vague requirements into a clear plan.",
        "What I'm looking for in a new job is a strong engineering culture.",
      ],
      trap:
        "That she will be remembered for… ✗ — that вводит целый факт (That she left surprised me = то, что она ушла), а «то, за что / та вещь, которую» передаёт только what. Не переводи must как «должна»: с be + существительное это почти всегда вывод (This must be the place). Вынести предлог вперёд (for what she will be remembered) — грамматично, но звучит неестественно.",
      trap_en:
        "That she will be remembered for… ✗ — that introduces a whole fact (That she left surprised me), while 'the thing that' is only what. Don't read must as obligation: with be + noun it is almost always deduction (This must be the place). Fronting the preposition (for what she will be remembered) is grammatical but sounds unnatural.",
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
      it: [
        "We rely on such tools as ESLint, Prettier and Vitest.",
        "The library dropped support for Node 16, something many teams weren't ready for.",
      ],
      me: [
        "I've worked with such frameworks as React, Next.js and Expo.",
        "I was offered a lead role, something I hadn't planned for.",
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
      it: [
        "By the end of the sprint, we had closed forty tickets.",
        "By 2024 most of our services were running on Kubernetes.",
      ],
      me: [
        "By the time I turned 30, I had worked in three countries.",
        "By next year I'll have finished my English course.  (future: will have + V3)",
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
  s3: [
    {
      id: "echo-answer",
      title: "It certainly has: короткий ответ-эхо через вспомогательный глагол",
      title_en: "It certainly has: the short echo answer with an auxiliary",
      quote: "Has the job changed over twenty years? '**It certainly has**. There's more rowdiness now.'",
      rule: "В ответе повторяют только вспомогательный глагол вопроса (has), а не смысловой (changed): It has. / It certainly has. / It has indeed. Полное «Yes, it has changed» звучит как перевод. Наречие (certainly, definitely, really) встаёт между подлежащим и вспомогательным. Та же механика в согласии: So do I. / Neither have I. / I'm afraid it isn't.",
      rule_en: "The answer repeats only the auxiliary from the question (has), not the main verb (changed): It has. / It certainly has. / It has indeed. The full 'Yes, it has changed' sounds translated. The adverb (certainly, definitely, really) goes between the subject and the auxiliary. The same mechanism works for agreement: So do I. / Neither have I. / I'm afraid it isn't.",
      pattern: "Aux + subject + verb? → Subject + (adverb) + aux.   |   So / Neither + aux + subject.",
      examples: [
        "— Does she still work here? — She certainly does.",
        "— Have you finished? — I have, actually.",
        "— I can't stand Mondays. — Neither can I.",
      ],
      it: [
        "— Did the deploy go through? — It did, but the smoke tests haven't run yet.",
        "— Is the API still rate-limited? — It certainly is.",
      ],
      me: [
        "— Have you worked with TypeScript in production? — I certainly have, for the last three years.",
        "— So you've led a team before? — I have, a team of four.",
      ],
      trap: "Вспомогательный глагол должен совпадать с вопросом: Has it changed? → It has (не It is / It did). Если вопрос в Past Simple без вспомогательного (Did it change?), в ответе появляется did: It certainly did. Ответ «Yes, it changed» грамматичен, но не разговорный.",
      trap_en: "The auxiliary must match the question: Has it changed? → It has (not It is / It did). If the question is Past Simple (Did it change?), the answer uses did: It certainly did. 'Yes, it changed' is grammatical but not how people speak.",
      task: {
        q: "Ответь коротко с certainly: — Did the new hire pass probation?",
        q_en: "Answer briefly with certainly: — Did the new hire pass probation?",
        a: "— He certainly did.",
        note: "Вопрос в Past Simple → did; смысловой глагол pass не повторяем.",
        note_en: "The question is Past Simple → did; the main verb pass is not repeated.",
      },
    },
    {
      id: "present-perfect-over",
      title: "Has the job changed over twenty years?: Present Perfect + over / in the last…",
      title_en: "Has the job changed over twenty years?: Present Perfect + over / in the last…",
      quote: "**Has the job changed over twenty years?** 'It certainly has.'",
      rule: "Период, который дотягивается до сейчас (over twenty years, in the last decade, since 2010, so far, lately) → Present Perfect. Past Simple (Did the job change…?) отрезал бы период в прошлом и звучал бы как «когда-то, в те двадцать лет». Over + отрезок времени = «за», in the last / past + отрезок = «за последние».",
      rule_en: "A period that reaches up to now (over twenty years, in the last decade, since 2010, so far, lately) takes Present Perfect. Past Simple (Did the job change…?) would cut the period off in the past and sound like 'back then, during those twenty years'. Over + a span = 'in the course of', in the last / past + a span = 'in the most recent'.",
      pattern: "Has / Have + subject + V3 + over / in the last / since / so far …?",
      examples: [
        "How has the city changed over the last ten years?",
        "I've learnt a lot in the past few months.",
        "Have you seen him lately?",
      ],
      it: [
        "How has the codebase changed over the last two years?",
        "We've had three outages in the past month.",
        "So far the migration has gone smoothly.",
      ],
      me: [
        "Over the last five years I've moved from jQuery to React Native.",
        "I've worked in three countries in the past decade.",
        "What have you been working on lately? — Mostly mobile.",
      ],
      trap: "Over the last years без числа ✗ → over the last few years / over recent years. И не смешивай: «I've moved to Kyiv in 2021» ✗ — с конкретной датой Past Simple.",
      trap_en: "Over the last years without a number ✗ → over the last few years / over recent years. And don't mix them: 'I've moved to Kyiv in 2021' ✗ — with a specific date use Past Simple.",
      task: {
        q: "Поставь глагол: How much ___ (the team / grow) over the last year?",
        q_en: "Fill in: How much ___ (the team / grow) over the last year?",
        a: "has the team grown",
      },
    },
    {
      id: "what-cleft",
      title: "What has also driven me is the fact that…: what-cleft для акцента",
      title_en: "What has also driven me is the fact that…: the what-cleft for emphasis",
      quote: "'**But what has also driven me is the fact that** I was dyslexic. School was a tough crowd.'",
      rule: "Cleft-предложение «раскалывает» простую мысль (Being dyslexic drove me) на две части, чтобы вынести главное в конец, под ударение: What has driven me | is | the fact that I was dyslexic. После is может стоять существительное, инфинитив (What I want is to finish) или, как здесь, the fact that + придаточное — «то, что». В Section 2 та же конструкция была в письменном тексте (what she will be remembered for); в речи её используют не реже.",
      rule_en: "A cleft sentence 'splits' a plain thought (Being dyslexic drove me) in two so the key part lands at the end, under stress: What has driven me | is | the fact that I was dyslexic. After is you can have a noun, an infinitive (What I want is to finish) or, as here, the fact that + clause. Section 2 had the same structure in writing (what she will be remembered for); in speech it is just as common.",
      pattern: "What + S + V + is / was + noun / to-infinitive / the fact that + clause",
      examples: [
        "What annoys me is the noise.",
        "What I'd like is a straight answer.",
        "What worries them is the fact that nobody has tested it.",
      ],
      it: [
        "What slows the app down is the fact that every screen refetches the user.",
        "What I like about Expo is the build pipeline.",
        "What we need is a staging environment.",
      ],
      me: [
        "What has driven my career is the fact that I started late and had to catch up.",
        "What I'm proudest of is shipping the app on time with a team of two.",
        "What I'm looking for now is more architectural responsibility.",
      ],
      trap: "После what — глагол в единственном числе (What has driven me), даже если дальше множественное. «That has driven me is…» ✗. И не роняй the fact: «is that I was dyslexic» возможно, но после существительных-эмоций (the fact / the reason / the problem) that-clause обычно нужна опора.",
      trap_en: "After what the verb is singular (What has driven me), even if a plural follows. 'That has driven me is…' ✗. And don't drop the fact carelessly: 'is that I was dyslexic' works, but after nouns like the fact / the reason / the problem the that-clause usually needs that support.",
      task: {
        q: "Перестрой с What: The lack of documentation frustrates me most.",
        q_en: "Rebuild with What: The lack of documentation frustrates me most.",
        a: "What frustrates me most is the lack of documentation.",
      },
    },
    {
      id: "embedded-question",
      title: "You never know what they’re going to come up with: вопрос внутри предложения",
      title_en: "You never know what they’re going to come up with: the embedded question",
      quote: "'**You never know what they’re going to come up with**, but I’m up for that.'",
      rule: "Вопрос, встроенный в другое предложение (после know, wonder, ask, tell me, I'm not sure), теряет порядок вопроса: what they are going to…, а не what are they going to…. Вспомогательные do/does/did исчезают: I don't know what he wants. Предлог фразового глагола остаётся в конце (come up with). You здесь — «люди вообще», безличное, как русское «никогда не знаешь».",
      rule_en: "A question embedded in another sentence (after know, wonder, ask, tell me, I'm not sure) loses question word order: what they are going to…, not what are they going to…. The auxiliaries do/does/did disappear: I don't know what he wants. The phrasal verb's preposition stays at the end (come up with). You here means 'people in general', like 'one'.",
      pattern: "know / wonder / not sure + question word + subject + verb (no inversion, no do)",
      examples: [
        "I wonder where she went.",
        "Do you know what time the show starts?",
        "Tell me what you're looking for.",
      ],
      it: [
        "I'm not sure what the client expects from the MVP.",
        "Nobody knows why the build takes twenty minutes.",
        "Can you tell me which endpoint the app calls first?",
      ],
      me: [
        "I'd like to know what the team's release process looks like.",
        "I'm not sure what salary range you have in mind.",
        "You never know what a user is going to tap.",
      ],
      trap: "«You never know what are they going to do» ✗ и «I don't know what does he want» ✗ — самые частые ошибки русскоязычных. Yes/no-вопрос внутри — через if / whether: I don't know if he's coming.",
      trap_en: "'You never know what are they going to do' ✗ and 'I don't know what does he want' ✗ — the most common Russian-speaker errors. An embedded yes/no question takes if / whether: I don't know if he's coming.",
      task: {
        q: "Исправь: I have no idea what time does the meeting start.",
        q_en: "Correct: I have no idea what time does the meeting start.",
        a: "I have no idea what time the meeting starts.",
      },
    },
    {
      id: "let-watch-bare-inf",
      title: "let the child watch them squirm: let / make / watch + object + голый инфинитив",
      title_en: "let the child watch them squirm: let / make / watch + object + bare infinitive",
      quote: "'…we bring the parent up on stage and **let the child watch them squirm**.'",
      rule: "Две конструкции в одной фразе. let / make / have + кто + V1 без to: let the child watch, make him apologise. Глаголы восприятия see / watch / hear / feel + кто + V1 (действие целиком: watch them squirm) или + V-ing (в процессе: I saw him crossing the road). Squirm — «ёрзать, корчиться от неловкости».",
      rule_en: "Two patterns in one phrase. let / make / have + someone + bare V1: let the child watch, make him apologise. Perception verbs see / watch / hear / feel + someone + V1 (the whole action: watch them squirm) or + V-ing (in progress: I saw him crossing the road). Squirm = wriggle with embarrassment.",
      pattern: "let / make / have + object + V1   |   see / watch / hear + object + V1 (whole) / V-ing (in progress)",
      examples: [
        "Let me check.",
        "They made us wait an hour.",
        "I heard the door slam. / I heard someone playing the piano upstairs.",
      ],
      it: [
        "Let the CI run the tests before you merge.",
        "The PM made us rewrite the spec twice.",
        "I watched the memory usage climb until the app crashed.",
      ],
      me: [
        "My first lead let me own a feature end to end.",
        "I'd rather have someone review my code than merge blind.",
        "I've seen teams burn out on unrealistic deadlines.",
      ],
      trap: "let him to do ✗, make him to do ✗ — без to. Но в пассиве to возвращается: He was made to apologise. Allow берёт to: allow him to do. Help — как угодно: help him (to) do.",
      trap_en: "let him to do ✗, make him to do ✗ — no to. But the passive brings to back: He was made to apologise. Allow takes to: allow him to do. Help takes either: help him (to) do.",
      task: {
        q: "Исправь: The teacher let the kids to leave early and made them to promise to be quiet.",
        q_en: "Correct: The teacher let the kids to leave early and made them to promise to be quiet.",
        a: "The teacher let the kids leave early and made them promise to be quiet.",
      },
    },
    {
      id: "phrasal-separability",
      title: "bring the parent up / come up with / boozed up: разделяемые и неразделяемые фразовые",
      title_en: "bring the parent up / come up with / boozed up: separable and inseparable phrasals",
      quote: "'…we **bring the parent up** on stage…' / '…they **get boozed up** at Christmas parties.'",
      rule: "У глагола с частицей (bring up, pick up, turn down) дополнение-существительное может стоять и до, и после частицы: bring the parent up = bring up the parent. Но местоимение — только между: bring them up, никогда bring up them. Трёхчастные (come up with, put up with, look forward to) не разделяются вовсе: come up with an idea / come up with it. Boozed up — причастие-прилагательное от booze (выпивка): get boozed up = напиться.",
      rule_en: "With a verb + particle (bring up, pick up, turn down) a noun object can go before or after the particle: bring the parent up = bring up the parent. A pronoun goes only in the middle: bring them up, never bring up them. Three-part phrasals (come up with, put up with, look forward to) never split: come up with an idea / come up with it. Boozed up is a participle adjective from booze: get boozed up = get drunk.",
      pattern: "V + noun + particle / V + particle + noun   |   V + pronoun + particle   |   V + particle + prep + object (never split)",
      examples: [
        "Turn the music down. / Turn it down.",
        "She came up with a brilliant plan.",
        "I can't put up with the noise any longer.",
      ],
      it: [
        "Roll the release back. / Roll it back.",
        "We came up with a workaround in an hour.",
        "Set the environment up before you clone the repo.",
      ],
      me: [
        "I picked React Native up on the job. / I picked it up quickly.",
        "I've had to put up with legacy code on every project.",
        "Give me a vague brief and I'll come up with three options.",
      ],
      trap: "bring up them ✗, pick up it ✗. Bring up ещё значит «воспитывать» и «поднять тему»: I was brought up in Leeds / Don't bring it up at dinner — контекст решает.",
      trap_en: "bring up them ✗, pick up it ✗. Bring up also means 'raise (a child)' and 'raise (a topic)': I was brought up in Leeds / Don't bring it up at dinner — context decides.",
      task: {
        q: "Замени существительное местоимением: Could you turn the volume down? → Could you ___?",
        q_en: "Replace the noun with a pronoun: Could you turn the volume down? → Could you ___?",
        a: "Could you turn it down?",
      },
    },
    {
      id: "onus-to-inf",
      title: "The onus is on me to keep control: ответственность + to-инфинитив",
      title_en: "The onus is on me to keep control: responsibility + to-infinitive",
      quote: "'**The onus is on me to keep control**, and you can’t diverge from the script too far.'",
      rule: "Onus — «бремя, обязанность», всегда в единственном числе и почти всегда в схеме the onus is on somebody to do something. Разговорные синонимы: It's on you to… / It's up to you to… / It's your job to…. Инфинитив с to называет, что именно нужно сделать.",
      rule_en: "Onus = burden, obligation; always singular and almost always in the pattern the onus is on somebody to do something. Spoken equivalents: It's on you to… / It's up to you to… / It's your job to…. The to-infinitive names what has to be done.",
      pattern: "The onus / responsibility is on + sb + to + V   |   It's up to + sb + to + V",
      examples: [
        "The onus is on the buyer to check the goods.",
        "It's up to you to decide.",
        "It's on the landlord to fix the boiler.",
      ],
      it: [
        "The onus is on the PR author to keep the diff small.",
        "It's up to the reviewer to check the edge cases.",
        "The onus of proof is on whoever claims the bug is fixed.",
      ],
      me: [
        "As the only frontend dev, the onus was on me to set the code standards.",
        "I think it's on the senior to make juniors comfortable asking questions.",
        "It's up to me to keep my skills current.",
      ],
      trap: "the onus is on me keeping ✗ и the onus is on me that I keep ✗ — только to-инфинитив. Up to ≠ up for: It's up to you (решать тебе) / I'm up for it (я за, готов).",
      trap_en: "the onus is on me keeping ✗ and the onus is on me that I keep ✗ — only the to-infinitive. Up to ≠ up for: It's up to you (your decision) / I'm up for it (I'm keen).",
      task: {
        q: "Скажи через onus: The seller must prove the item was delivered.",
        q_en: "Say it with onus: The seller must prove the item was delivered.",
        a: "The onus is on the seller to prove the item was delivered.",
      },
    },
    {
      id: "or-otherwise",
      title: "…or the whole room goes with you: or = «иначе» после can’t / must / императива",
      title_en: "…or the whole room goes with you: or = 'otherwise' after can’t / must / an imperative",
      quote: "'…you **can’t diverge from the script too far or the whole room goes with you**.'",
      rule: "После запрета, совета или приказа or (else) значит «иначе, а не то»: Don't be late or we'll leave without you. Последствие ставят в Present Simple или will; здесь Present Simple (goes) — «так бывает всегда». You опять безличное. Too far — «слишком далеко»: too + наречие после глагола.",
      rule_en: "After a prohibition, a piece of advice or an order, or (else) means 'otherwise': Don't be late or we'll leave without you. The consequence takes Present Simple or will; here Present Simple (goes) = 'that's what always happens'. You is generic again. Too far = too + adverb after the verb.",
      pattern: "Imperative / can't / must + …, or (else) + consequence (Present Simple / will)",
      examples: [
        "Hurry up or you'll miss the train.",
        "You can't skip breakfast or you crash by eleven.",
        "Pay by Friday, or else the booking is cancelled.",
      ],
      it: [
        "Pin the dependency versions or the build breaks on a random Tuesday.",
        "You can't ship without tests or every hotfix turns into a weekend.",
        "Rotate the token or the integration stops working next month.",
      ],
      me: [
        "I keep a to-do list or things fall through the cracks.",
        "You have to say no sometimes or you end up owning everything.",
        "Take breaks or you burn out — I learnt that the hard way.",
      ],
      trap: "Otherwise — синоним, но он начинает новое предложение: …, otherwise the room goes with you. Or else отдельно звучит как угроза (Do it. Or else.). Не ставь or после утверждения без запрета: «I go to bed early or I'm tired» ✗ → «…, otherwise I'm tired».",
      trap_en: "Otherwise is a synonym but starts a new clause: …, otherwise the room goes with you. Or else on its own sounds like a threat (Do it. Or else.). Don't use or after a plain statement with no prohibition: 'I go to bed early or I'm tired' ✗ → '…, otherwise I'm tired'.",
      task: {
        q: "Одно предложение с or: Write the tests first. If you don't, you'll forget them.",
        q_en: "One sentence with or: Write the tests first. If you don't, you'll forget them.",
        a: "Write the tests first or you'll forget them.",
      },
    },
    {
      id: "spoken-markers",
      title: "he admits / …, mind: вставные фразы и маркеры разговорного британского",
      title_en: "he admits / …, mind: comment clauses and spoken British markers",
      quote: "The corporate side, **he admits**, is very lucrative. / '**Adults are worse, mind** — they get boozed up at Christmas parties.'",
      rule: "Две приметы речи. 1) Вставная фраза посреди предложения: The corporate side, he admits, is… — говорящий комментирует, не прерывая мысль; в письме её выделяют запятыми. 2) Mind в конце (= mind you) — британское «правда, заметь, хотя»: уступка после утверждения. Adults are worse, mind = «взрослые, правда, хуже». Рядом high on sugar and phones — шутливое «под кайфом от».",
      rule_en: "Two features of speech. 1) A comment clause in the middle: The corporate side, he admits, is… — the speaker comments without breaking the thought; in writing it takes commas. 2) Mind at the end (= mind you) is British for 'though, admittedly': a concession after a statement. Adults are worse, mind = 'adults, mind you, are worse'. Nearby, high on sugar and phones is a jokey 'buzzing on'.",
      pattern: "…, he admits / she says / I think, …   |   statement, mind. / Mind you, statement.",
      examples: [
        "The food, I must admit, was excellent.",
        "It's a good car. Expensive, mind.",
        "Mind you, he did warn us.",
      ],
      it: [
        "The framework, I'll admit, has a steep learning curve.",
        "The rewrite went well. Took twice as long as planned, mind.",
        "Mind you, nobody had read the RFC.",
      ],
      me: [
        "I'm strongest, I'd say, on the mobile side.",
        "I enjoy code review. Not at six on a Friday, mind.",
        "Mind you, I've never worked in a company that size.",
      ],
      trap: "Mind без you в конце — только разговорный BrE; в письме и в AmE скажи though / however. Не путай с never mind (не важно) и mind the gap (осторожно). Вставная фраза ставится после первого смыслового блока, не в случайном месте: The corporate, he admits, side ✗.",
      trap_en: "Mind without you at the end is spoken BrE only; in writing and in AmE use though / however. Don't confuse it with never mind (it doesn't matter) or mind the gap (watch out). A comment clause goes after the first sense unit, not anywhere: The corporate, he admits, side ✗.",
      task: {
        q: "Добавь уступку через mind: The hotel was lovely. It was noisy.",
        q_en: "Add a concession with mind: The hotel was lovely. It was noisy.",
        a: "The hotel was lovely. Noisy, mind.",
        note: "Или: Mind you, it was noisy.",
        note_en: "Or: Mind you, it was noisy.",
      },
    },
    {
      id: "dependent-prepositions",
      title: "high on / cope with / up for / diverge from: закреплённые предлоги",
      title_en: "high on / cope with / up for / diverge from: dependent prepositions",
      quote: "'…kids arrive **high on sugar** and phones.' How do you **cope with** that? '…but I’m **up for** that.'",
      rule: "Предлог приклеен к слову, и его нельзя вывести из перевода: cope WITH (справляться с — совпало), но high ON (а не from), up FOR (готов на), diverge FROM, depend ON, good AT, interested IN. Учить как одно слово. Up for в разговоре: I'm up for it — «я за».",
      rule_en: "The preposition is glued to the word and can't be guessed from translation: cope WITH (matches Russian), but high ON (not from), up FOR (keen on), diverge FROM, depend ON, good AT, interested IN. Learn them as one unit. Up for in speech: I'm up for it = count me in.",
      pattern: "adjective / verb + fixed preposition: cope with · high on · up for · diverge from · depend on · good at",
      examples: [
        "I can't cope with the heat.",
        "Anyone up for a curry?",
        "The results diverge from what the model predicted.",
      ],
      it: [
        "The team coped with the outage without waking the on-call.",
        "Are you up for pairing on this bug after lunch?",
        "The prod config diverges from staging in three places.",
      ],
      me: [
        "I cope well with shifting priorities.",
        "I'm up for relocating if the role is right.",
        "I'm good at breaking a vague ticket down into tasks.",
      ],
      trap: "cope up with ✗ (индийский английский, в Британии режет слух). Up for ≠ up to: What are you up to? = «что затеял?». High from sugar ✗ → high on. Depend of ✗ → depend on.",
      trap_en: "cope up with ✗ (Indian English; grates in Britain). Up for ≠ up to: What are you up to? = what are you doing / plotting? High from sugar ✗ → high on. Depend of ✗ → depend on.",
      task: {
        q: "Вставь предлоги: How do you cope ___ stress? Are you up ___ a run tomorrow?",
        q_en: "Fill in the prepositions: How do you cope ___ stress? Are you up ___ a run tomorrow?",
        a: "cope with · up for",
      },
    },
  ],
};
