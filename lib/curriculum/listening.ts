import type { Exercise, ListeningActivity } from "../types";

const createdAt = "2026-08-02T00:00:00.000Z";

function listeningQuestion(
  id: string,
  activityId: string,
  topic: string,
  prompt: string,
  options: string[],
  correctAnswer: string,
  explanation: string,
  presentation: "radio" | "select" = "radio",
): Exercise {
  return {
    id,
    passageId: activityId,
    type: "listening",
    section: "listening",
    topic,
    difficulty: "b2",
    level: "B2",
    question: prompt,
    instructions:
      presentation === "select"
        ? "Apri il menu e scegli l'opzione che corrisponde a ciò che hai sentito."
        : "Scegli la risposta corretta in base all'audio.",
    options: options.map((label, index) => ({ id: String(index), label })),
    correctAnswer,
    explanation,
    examples: [],
    tags: ["listening", "b2", topic],
    estimatedTime: 75,
    source: "original",
    createdAt,
    presentation,
  };
}

function sentenceCompletion(
  id: string,
  activityId: string,
  prompt: string,
  correctAnswer: string,
  explanation: string,
  acceptedAnswers: string[] = [],
): Exercise {
  return {
    id,
    passageId: activityId,
    type: "listening",
    section: "listening",
    topic: "sentence completion",
    difficulty: "b2",
    level: "B2",
    question: prompt,
    instructions: "Completa lo spazio con una o due parole ascoltate nella registrazione.",
    correctAnswer,
    acceptedAnswers,
    explanation,
    examples: [],
    tags: ["listening", "b2", "sentence-completion"],
    estimatedTime: 75,
    source: "original",
    createdAt,
  };
}

export const b2ListeningActivities: ListeningActivity[] = [
  {
    id: "listening-station-update",
    title: "A change to the evening service",
    kind: "Public announcement",
    level: "B2",
    duration: "1:35",
    maxListens: 2,
    transcript:
      "Good evening, passengers. Because of engineering work near Redhill, the 18:42 service to Brighton will leave approximately fifteen minutes late. It will depart from platform nine rather than platform six. Passengers for Gatwick Airport should remain on this train, but anyone travelling to stations between Redhill and Three Bridges will need to change at East Croydon and use the replacement coach service. The coach leaves from the main entrance, beside the taxi rank, not from the usual bus stop. If you require step-free access, please speak to a member of staff before boarding, as the lift on platform nine is currently out of service. First-class tickets will be accepted in standard class, since no first-class carriage is available this evening. We apologise for the disruption. Please check the information screens for further updates, as the departure time may change again if the engineering team finishes earlier than expected.",
    exercises: [
      listeningQuestion("listening-station-q1", "listening-station-update", "detail", "Which platform will the Brighton train use?", ["Platform 6", "Platform 9", "Platform 15"], "Platform 9", "The announcement corrects platform six to platform nine."),
      listeningQuestion("listening-station-q2", "listening-station-update", "purpose", "Who needs to change at East Croydon?", ["Passengers for Gatwick Airport", "Passengers for intermediate stations after Redhill", "All first-class passengers"], "Passengers for intermediate stations after Redhill", "Those travellers must use the replacement coach.", "select"),
      listeningQuestion("listening-station-q3", "listening-station-update", "detail", "Where does the replacement coach leave from?", ["Beside the taxi rank", "Platform six", "The usual bus stop"], "Beside the taxi rank", "The speaker says it leaves from the main entrance beside the taxi rank."),
      listeningQuestion("listening-station-q4", "listening-station-update", "inference", "Why should some passengers speak to staff before boarding?", ["The train has no seats", "The lift for platform nine is unavailable", "Their tickets are invalid"], "The lift for platform nine is unavailable", "This instruction is specifically for people needing step-free access.", "select"),
      listeningQuestion("listening-station-q5", "listening-station-update", "detail", "What may still change?", ["The destination", "The departure time", "The location of Gatwick Airport"], "The departure time", "The final sentence warns that timing may change again."),
    ],
  },
  {
    id: "listening-museum-volunteer",
    title: "Why I became a museum volunteer",
    kind: "Radio interview",
    level: "B2",
    duration: "2:20",
    maxListens: 2,
    transcript:
      "Interviewer: Today I'm speaking to Jonah Price, who volunteers at the City Transport Museum. Jonah, were you already an expert on old buses and trains? Jonah: Not at all. I joined because I had recently moved to the city and wanted to meet people. I work from home, so entire days could pass without a real conversation. The museum advertised for weekend guides, and I assumed they wanted someone with technical knowledge. In fact, they mainly wanted people who were curious and comfortable talking to visitors. Interviewer: Was the training difficult? Jonah: It was thorough rather than difficult. We learned the basic history, but we also practised telling short stories instead of repeating dates. The most useful session was about responding when you don't know an answer. You should never invent one; you note the question and ask a curator later. Interviewer: What surprised you about visitors? Jonah: Children often notice details adults miss. One child asked why the driver's seat on a very old bus was outside. I had walked past it for weeks without wondering. Questions like that make the role interesting. Interviewer: And has volunteering helped you settle in? Jonah: Definitely. I expected to learn about transport, but the real benefit has been feeling connected to the city. I now recognise regular visitors and have friends among the other guides.",
    exercises: [
      listeningQuestion("listening-museum-q1", "listening-museum-volunteer", "gist", "Why did Jonah first decide to volunteer?", ["He was a transport expert", "He wanted more social contact", "He needed a paid weekend job"], "He wanted more social contact", "Working from home left him with little conversation."),
      listeningQuestion("listening-museum-q2", "listening-museum-volunteer", "detail", "What quality did the museum mainly seek?", ["Mechanical training", "Curiosity and confidence with visitors", "Knowledge of every historical date"], "Curiosity and confidence with visitors", "Jonah contrasts these qualities with technical expertise.", "select"),
      listeningQuestion("listening-museum-q3", "listening-museum-volunteer", "detail", "What should a guide do when unsure of an answer?", ["Create a likely explanation", "Ignore the visitor", "Record the question and check it later"], "Record the question and check it later", "The training clearly warned against inventing an answer."),
      listeningQuestion("listening-museum-q4", "listening-museum-volunteer", "attitude", "What does Jonah admire about children?", ["They remember every date", "They observe unexpected details", "They prefer modern buses"], "They observe unexpected details", "He says children notice details that adults miss.", "select"),
      listeningQuestion("listening-museum-q5", "listening-museum-volunteer", "main idea", "What has been the greatest benefit for Jonah?", ["Learning to repair vehicles", "Feeling part of the city", "Receiving free transport"], "Feeling part of the city", "He explicitly identifies connection, regular visitors and friendships as the real benefit."),
    ],
  },
  {
    id: "listening-campus-energy",
    title: "Measuring energy on campus",
    kind: "Mini lecture",
    level: "B2",
    duration: "2:30",
    maxListens: 2,
    transcript:
      "Before we discuss the university's new energy plan, it is worth asking what our meters actually tell us. A monthly electricity bill gives a total, but it does not show which building used the energy or at what time. Last year, sensors were installed in twelve buildings and recorded demand every fifteen minutes. The project produced one surprising finding: our newest science building used the most electricity at night. Staff first assumed laboratory equipment was responsible. A closer check showed that the ventilation system was continuing to operate as if every room were full. Changing its schedule reduced night-time demand by nearly a third. This example shows why general campaigns asking people to switch off lights are not enough. Individual choices matter, but building systems can create far larger savings. The next stage is to publish simple dashboards for students and staff. These will compare similar buildings rather than create an unfair competition between, for example, a library and a laboratory. The aim is not to blame users. It is to help each department notice unusual patterns, test a change and see whether it works. Data becomes useful only when it leads to a practical question.",
    exercises: [
      listeningQuestion("listening-energy-q1", "listening-campus-energy", "main idea", "What is the speaker mainly explaining?", ["Why the university closed its laboratories", "How detailed energy data can guide practical changes", "Why monthly bills should be higher"], "How detailed energy data can guide practical changes", "The lecture moves from measurement to diagnosis and action."),
      listeningQuestion("listening-energy-q2", "listening-campus-energy", "detail", "What surprised the project team?", ["The oldest library used no power", "The new science building used most electricity at night", "Students refused to use the sensors"], "The new science building used most electricity at night", "This is introduced as the surprising finding.", "select"),
      listeningQuestion("listening-energy-q3", "listening-campus-energy", "detail", "What caused the unnecessary demand?", ["Laboratory equipment", "A ventilation schedule", "The student dashboard"], "A ventilation schedule", "The ventilation behaved as though rooms were occupied."),
      listeningQuestion("listening-energy-q4", "listening-campus-energy", "purpose", "Why will the dashboard compare similar buildings?", ["To create a fairer comparison", "To hide the science building", "To increase competition at any cost"], "To create a fairer comparison", "A laboratory and a library have different energy needs.", "select"),
      listeningQuestion("listening-energy-q5", "listening-campus-energy", "attitude", "How does the speaker view data?", ["Useful only when it prompts action", "More important than every human decision", "Too complex for departments"], "Useful only when it prompts action", "The closing sentence states this principle directly."),
    ],
  },
  {
    id: "listening-slow-travel",
    title: "Choosing the journey, not just the destination",
    kind: "Travel podcast",
    level: "B2",
    duration: "2:25",
    maxListens: 2,
    transcript:
      "Host: Many travellers say they want to slow down, but what does that mean in practice? Guest: It does not necessarily mean spending a month in one village. For me, it means making fewer rushed decisions. On my last trip, I chose two regions instead of five cities and travelled between them by local train. The train was slower, but I could see how the landscape changed and speak to people who used the route every day. Host: Was it more expensive? Guest: The tickets were cheaper, but staying longer in each place meant I paid for more nights. I saved money by renting a small apartment and cooking sometimes. The bigger change was psychological: I stopped treating every empty hour as a failure to see something. Host: Did you plan everything in advance? Guest: I booked the first three nights and the return train. The rest stayed flexible. That worked because I travelled outside peak season. In August, I would reserve more. Slow travel should not become another strict set of rules. It is simply a way to notice the journey and reduce the pressure to collect destinations. Host: Who might not enjoy it? Guest: Anyone with very limited holiday time may prefer a carefully planned short break. The important thing is choosing deliberately rather than copying someone else's ideal trip.",
    exercises: [
      listeningQuestion("listening-travel-q1", "listening-slow-travel", "gist", "What does slow travel mean to the guest?", ["Always staying for a month", "Making fewer rushed choices", "Avoiding every train"], "Making fewer rushed choices", "The guest defines it in terms of deliberate, less rushed decisions."),
      listeningQuestion("listening-travel-q2", "listening-slow-travel", "detail", "How did the guest reduce some costs?", ["By sleeping on trains", "By renting an apartment and cooking", "By travelling only in August"], "By renting an apartment and cooking", "Both choices are stated in the answer about cost.", "select"),
      listeningQuestion("listening-travel-q3", "listening-slow-travel", "attitude", "What psychological change did the guest notice?", ["Empty time no longer felt wasted", "Every hour needed an activity", "Planning became impossible"], "Empty time no longer felt wasted", "The guest stopped seeing an empty hour as a failure."),
      listeningQuestion("listening-travel-q4", "listening-slow-travel", "detail", "Why could some plans remain flexible?", ["The journey was outside peak season", "The guest had unlimited money", "The trains required no tickets"], "The journey was outside peak season", "The guest says August would require more reservations.", "select"),
      listeningQuestion("listening-travel-q5", "listening-slow-travel", "main idea", "What final advice does the guest give?", ["Copy experienced travellers", "Choose a style that suits your real situation", "Never take a short holiday"], "Choose a style that suits your real situation", "The conclusion values deliberate personal choice over an ideal copied from others."),
    ],
  },
  {
    id: "listening-remote-onboarding",
    title: "Starting a job from a distance",
    kind: "Workplace conversation",
    level: "B2",
    duration: "2:15",
    maxListens: 2,
    transcript:
      "Manager: How has your first week been, Priya? Priya: Better than I expected, although I still feel uncertain about who handles what. The organisation chart shows departments, but not the informal questions, like who knows the old booking system. Manager: That's fair. We used to give new staff a list of documents and assume they would ask if confused. It was not very effective, especially remotely. Priya: The short daily call with Daniel has helped. Because it is only fifteen minutes, I can save small questions for it without arranging a formal meeting. Manager: Good. He's your onboarding partner for the first month, but he isn't meant to replace the whole team. Tomorrow's project meeting should help you see how decisions are made. Priya: Should I prepare a presentation? Manager: No. Read the summary, then listen and ask questions. We don't expect you to offer solutions before you understand the background. Priya: That's reassuring. One practical issue: I can access the main drive but not the customer archive. Manager: Thanks for telling me. That is a permissions error, not part of the training. I'll contact technical support today. Please never share someone else's login as a shortcut, even if a deadline is close.",
    exercises: [
      listeningQuestion("listening-job-q1", "listening-remote-onboarding", "detail", "What information is missing from the organisation chart?", ["Department names", "Informal knowledge about who can help", "Priya's job title"], "Informal knowledge about who can help", "Priya distinguishes formal departments from practical knowledge."),
      listeningQuestion("listening-job-q2", "listening-remote-onboarding", "purpose", "Why is the daily call useful?", ["It replaces all team contact", "It provides a regular place for small questions", "It lasts the entire morning"], "It provides a regular place for small questions", "Priya can save questions for a brief scheduled call.", "select"),
      listeningQuestion("listening-job-q3", "listening-remote-onboarding", "attitude", "What does the manager expect in tomorrow's meeting?", ["A complete presentation", "Immediate solutions", "Listening and informed questions"], "Listening and informed questions", "The manager explicitly removes pressure to solve things immediately."),
      listeningQuestion("listening-job-q4", "listening-remote-onboarding", "detail", "Why can Priya not open the customer archive?", ["A permissions problem", "An unfinished training course", "A missing organisation chart"], "A permissions problem", "The manager identifies it as a technical access error.", "select"),
      listeningQuestion("listening-job-q5", "listening-remote-onboarding", "purpose", "What security warning does the manager give?", ["Do not save customer files", "Do not share another person's login", "Do not contact technical support"], "Do not share another person's login", "The manager rejects this shortcut even under deadline pressure."),
    ],
  },
  {
    id: "listening-community-garden",
    title: "A garden that changed its purpose",
    kind: "Local radio report",
    level: "B2",
    duration: "2:20",
    maxListens: 2,
    transcript:
      "Reporter: The Riverside Community Garden began with a simple aim: turn an unused car park into a place where residents could grow vegetables. Five years later, food production is only part of its role. Garden coordinator Elena Morris explains. Elena: At first, every plot was assigned to one household. That worked for experienced gardeners, but beginners sometimes felt embarrassed when plants failed. We now keep half the space for shared projects. People can join a group, learn from others and take home part of the harvest. Reporter: The garden also works with a nearby health centre. Doctors do not prescribe gardening as a medical treatment, but they may recommend the weekly social session to patients who feel isolated. Elena: We are careful with language. We cannot promise that gardening will cure anyone. What we can offer is a routine, gentle activity and regular contact with other people. Reporter: The greatest current challenge is water. The original design relied on a single outdoor tap. After two dry summers, volunteers installed tanks that collect rain from the tool shed roof. The supply is still limited, so plants that need less water are becoming more common. Elena: The garden has taught us to adapt. Success is not the biggest harvest; it is whether people and the space remain healthy together.",
    exercises: [
      listeningQuestion("listening-garden-q1", "listening-community-garden", "main idea", "How has the garden's purpose changed?", ["It now serves social and learning needs as well as growing food", "It has become a private car park again", "It grows food only for doctors"], "It now serves social and learning needs as well as growing food", "The report describes shared learning, health-centre links and food."),
      listeningQuestion("listening-garden-q2", "listening-community-garden", "detail", "Why were shared projects introduced?", ["Experienced gardeners wanted private land", "Beginners needed a less isolating way to learn", "The health centre demanded more vegetables"], "Beginners needed a less isolating way to learn", "Some beginners felt embarrassed when individual plots failed.", "select"),
      listeningQuestion("listening-garden-q3", "listening-community-garden", "attitude", "Why is Elena careful with language about health?", ["She does not want to make medical promises", "She dislikes the health centre", "She believes routine has no value"], "She does not want to make medical promises", "She distinguishes supportive activity from medical treatment."),
      listeningQuestion("listening-garden-q4", "listening-community-garden", "detail", "What did volunteers install after dry summers?", ["A second health centre", "Rainwater collection tanks", "More private plots"], "Rainwater collection tanks", "The tanks collect rain from the shed roof.", "select"),
      listeningQuestion("listening-garden-q5", "listening-community-garden", "main idea", "How does Elena define success?", ["Producing the maximum amount of food", "Keeping both people and the space healthy", "Owning the largest number of tools"], "Keeping both people and the space healthy", "Her final sentence rejects harvest size as the only measure."),
    ],
  },
  {
    id: "listening-sleep-memory",
    title: "Why revision needs sleep",
    kind: "Science podcast",
    level: "B2",
    duration: "2:25",
    maxListens: 2,
    transcript:
      "Presenter: Students often cut sleep when an exam approaches because every extra hour seems available for revision. Memory researcher Dr Hale says this can be a false economy. Dr Hale: Learning does not stop when you close the book. During sleep, the brain strengthens some of the connections created during the day. That does not mean you can play a recording beside your bed and learn a new language unconsciously. You need to engage with the material while awake. Sleep then helps organise what has already been studied. Presenter: Is one long sleep before the exam enough? Dr Hale: A single good night is better than none, but consistency matters more. If someone studies vocabulary across several days and sleeps adequately after each session, there are repeated opportunities to stabilise that learning. Presenter: What about short daytime naps? Dr Hale: They can help, particularly after concentrated practice, but they are not a complete replacement for night-time sleep. I also recommend a brief review before bed, not an exhausting three-hour session. The aim is to reactivate key ideas, then allow recovery. Presenter: So the most efficient student is not necessarily the one who studies longest? Dr Hale: Exactly. Effective learning alternates focused effort with genuine rest.",
    exercises: [
      listeningQuestion("listening-sleep-q1", "listening-sleep-memory", "main idea", "Why does Dr Hale call reduced sleep a false economy?", ["It saves no electricity", "It creates more study time but may weaken learning", "It makes books more expensive"], "It creates more study time but may weaken learning", "The apparent gain in hours can reduce memory processing."),
      listeningQuestion("listening-sleep-q2", "listening-sleep-memory", "detail", "What must happen before sleep can support learning?", ["The learner must actively study the material", "A recording must play all night", "The exam must be the next day"], "The learner must actively study the material", "Sleep organises material that was engaged with while awake.", "select"),
      listeningQuestion("listening-sleep-q3", "listening-sleep-memory", "detail", "Why is consistent sleep useful?", ["It provides repeated chances to stabilise learning", "It removes the need for revision", "It guarantees perfect results"], "It provides repeated chances to stabilise learning", "Each study-and-sleep cycle offers another consolidation opportunity."),
      listeningQuestion("listening-sleep-q4", "listening-sleep-memory", "attitude", "How does Dr Hale view naps?", ["Helpful but not a full replacement for night sleep", "Always harmful", "The only effective form of rest"], "Helpful but not a full replacement for night sleep", "This qualification is stated directly.", "select"),
      listeningQuestion("listening-sleep-q5", "listening-sleep-memory", "main idea", "What study pattern does Dr Hale recommend?", ["Continuous work without breaks", "Focused effort alternating with real recovery", "Only a long session before bed"], "Focused effort alternating with real recovery", "The final statement summarises the recommended balance."),
    ],
  },
  {
    id: "listening-course-information",
    title: "Weekend photography course",
    kind: "Course information",
    level: "B2",
    duration: "1:55",
    maxListens: 2,
    transcript:
      "Welcome to the information line for the City Photography Weekend. The course takes place on Saturday the twelfth and Sunday the thirteenth of September. Saturday begins at nine thirty in Room Four of the Arts Centre, where tutor Malik Evans will introduce techniques for photographing people in natural light. After lunch, the group will work outdoors in the market square. Please bring a light waterproof jacket, as the outdoor session will continue in gentle rain. On Sunday, participants meet at ten, not nine thirty, in the computer room. You will select and edit six images from the previous day. Any digital camera is suitable, including a phone with manual controls. Laptops are provided, so do not bring your own unless you prefer its editing software. The full fee is eighty-five pounds and includes lunch on Saturday. Students and Arts Centre members pay seventy pounds. Registration closes on the fifth of September, but places often fill earlier. The course is intended for people who understand basic camera controls; complete beginners should choose our introductory evening class instead. For accessibility questions, leave a message after the tone and a coordinator will call you back.",
    exercises: [
      listeningQuestion("listening-course-q1", "listening-course-information", "detail", "Where does Saturday's course begin?", ["The market square", "Room Four of the Arts Centre", "The computer room"], "Room Four of the Arts Centre", "The indoor introduction happens there before the market session."),
      listeningQuestion("listening-course-q2", "listening-course-information", "detail", "What should participants bring for the afternoon?", ["A waterproof jacket", "A laptop", "A printed photograph"], "A waterproof jacket", "The outdoor session continues in gentle rain.", "select"),
      listeningQuestion("listening-course-q3", "listening-course-information", "detail", "What time does Sunday begin?", ["9:00", "9:30", "10:00"], "10:00", "The speaker corrects the time: ten, not nine thirty."),
      listeningQuestion("listening-course-q4", "listening-course-information", "detail", "Who pays seventy pounds?", ["Everyone who registers early", "Students and Arts Centre members", "Complete beginners"], "Students and Arts Centre members", "The reduced fee applies to these two groups.", "select"),
      listeningQuestion("listening-course-q5", "listening-course-information", "purpose", "Who should choose a different class?", ["People with only basic camera knowledge", "People using phones", "Complete beginners"], "Complete beginners", "The weekend assumes basic controls; beginners are directed to an evening class."),
    ],
  },
  {
    id: "listening-accessible-app",
    title: "Designing an app everyone can use",
    kind: "Technology interview",
    level: "B2",
    duration: "2:30",
    maxListens: 2,
    transcript:
      "Interviewer: Today we are talking to product designer Lena Morris about accessibility. Lena, when does your team begin thinking about disabled users? Lena: At the first sketch, ideally. Accessibility becomes expensive when it is treated as a final repair. For example, if navigation depends entirely on colour, adding labels later may affect every screen. Interviewer: Do automated testing tools solve the problem? Lena: They are useful for finding missing labels or weak colour contrast, but they cannot tell us whether a task feels confusing. We invite people who use screen readers, voice control and keyboard navigation to test early versions. Their feedback often improves the product for everyone. Clear headings help a screen-reader user, but they also help a tired commuter find information quickly. Interviewer: What mistake do teams commonly make? Lena: They imagine one typical disabled user. In reality, needs vary and can also be temporary. Someone may have a broken arm, be holding a baby or be trying to hear audio in a noisy station. Interviewer: Is there ever a conflict between visual style and accessibility? Lena: There can be tension, but good design works within constraints. The goal is not to make every screen look identical. It is to ensure that appearance never becomes the only way to understand or operate something.",
    exercises: [
      listeningQuestion("listening-access-q1", "listening-accessible-app", "main idea", "What is Lena's main recommendation?", ["Consider accessibility from the beginning", "Use only automated tests", "Give every screen the same appearance"], "Consider accessibility from the beginning", "She says late accessibility work becomes an expensive repair."),
      listeningQuestion("listening-access-q2", "listening-accessible-app", "detail", "What can automated tools identify?", ["Every confusing task", "Missing labels and poor contrast", "A user's temporary injury"], "Missing labels and poor contrast", "Lena gives these as examples of issues tools can find.", "select"),
      listeningQuestion("listening-access-q3", "listening-accessible-app", "inference", "Why does Lena mention a tired commuter?", ["To show accessible clarity can benefit many users", "To criticise public transport", "To suggest commuters design the app"], "To show accessible clarity can benefit many users", "Clear headings help beyond the original accessibility case."),
      listeningQuestion("listening-access-q4", "listening-accessible-app", "detail", "What mistake do teams make?", ["They test with too many people", "They assume disabled users all have the same needs", "They use labels as well as colour"], "They assume disabled users all have the same needs", "Lena warns against imagining one typical user.", "select"),
      listeningQuestion("listening-access-q5", "listening-accessible-app", "attitude", "How does Lena view design constraints?", ["As a reason to remove visual style", "As something good design should work with", "As impossible to manage"], "As something good design should work with", "She accepts tension but believes design can respond constructively."),
    ],
  },
  {
    id: "listening-project-delay",
    title: "A difficult launch decision",
    kind: "Workplace conversation",
    level: "B2",
    duration: "2:15",
    maxListens: 2,
    transcript:
      "Maya: Have you seen the latest test report? The payment page still fails for some international cards. Tom: I have. The supplier thinks they can fix it by Thursday, so we could keep Monday's launch. Maya: That leaves almost no time to test the repair. The marketing campaign is already scheduled, but a failed payment is worse than a delayed announcement. Tom: I agree about the risk. My concern is the conference next Wednesday. We planned to demonstrate the live service there. Maya: Could we show a recorded walkthrough instead and explain that the final security checks are in progress? Tom: Possibly. It would be honest, although the sales team may be disappointed. How long a delay are you suggesting? Maya: One week. We keep the internal release on Monday, let staff test with real transactions, and open it to customers the following Monday. Tom: That sounds more controlled. We should not blame the supplier in the public message, though. The integration is our responsibility. Maya: Agreed. I'll ask marketing to pause the adverts, not cancel them. Can you tell the conference organiser that our session will focus on the design process rather than a live demonstration? Tom: Yes, and I will arrange a decision meeting for Friday morning. If Thursday's fix passes the first tests, we can confirm the revised plan then.",
    exercises: [
      listeningQuestion("listening-delay-q1", "listening-project-delay", "detail", "What problem remains?", ["Some international cards cannot complete payment", "The marketing campaign has no adverts", "The conference was cancelled"], "Some international cards cannot complete payment", "Maya refers to failures on the payment page."),
      listeningQuestion("listening-delay-q2", "listening-project-delay", "attitude", "Why does Maya oppose the original launch date?", ["She dislikes the supplier", "There would be too little time to test the fix", "She wants to cancel the product"], "There would be too little time to test the fix", "Her main concern is the lack of safe testing time.", "select"),
      listeningQuestion("listening-delay-q3", "listening-project-delay", "detail", "What could they present at the conference?", ["A recorded walkthrough", "A new payment supplier", "The marketing adverts"], "A recorded walkthrough", "Maya suggests this alternative to a live service."),
      listeningQuestion("listening-delay-q4", "listening-project-delay", "inference", "Why will the adverts be paused rather than cancelled?", ["The launch is delayed, not abandoned", "The adverts contain an error", "The sales team has left"], "The launch is delayed, not abandoned", "A pause fits the one-week revised plan.", "select"),
      listeningQuestion("listening-delay-q5", "listening-project-delay", "main idea", "What do Maya and Tom finally agree to do?", ["Prepare a controlled one-week delay", "Launch immediately without testing", "Publicly blame the supplier"], "Prepare a controlled one-week delay", "They plan internal testing, revised communication and a Friday decision."),
    ],
  },
  {
    id: "listening-clothing-swap",
    title: "The neighbourhood clothing exchange",
    kind: "Local radio report",
    level: "B2",
    duration: "2:20",
    maxListens: 2,
    transcript:
      "Presenter: This Saturday, Westfield Library is hosting its third clothing exchange. Organiser Priya Shah explains how it works. Priya: People can bring up to ten clean items in good condition between nine and eleven in the morning. Volunteers check them and give one token for each accepted item. The exchange opens at midday, and each token can be used for one item. Presenter: Can people bring anything? Priya: We accept adult and children's clothing, shoes and bags. We cannot take underwear, damaged items or school uniforms with a visible name. Last year some people arrived with bags of unsuitable clothes, so we have published photographs showing what good condition means. Presenter: What happens to items nobody chooses? Priya: Participants can collect them at four o'clock. Anything left after five is offered to two local charities, but they select only what they can use. We do not describe the event as a complete solution to textile waste. It is a practical way to extend the life of good clothing and start conversations about buying less. Presenter: Is there a cost? Priya: Entry is free. A repair volunteer will also demonstrate simple fixes, but those places must be booked because the table is small. People who bring no clothes may choose one item during the final half-hour if stock remains.",
    exercises: [
      listeningQuestion("listening-swap-q1", "listening-clothing-swap", "detail", "How many items may one person bring?", ["Five", "Ten", "An unlimited number"], "Ten", "Priya sets a maximum of ten accepted items."),
      listeningQuestion("listening-swap-q2", "listening-clothing-swap", "detail", "What is not accepted?", ["Children's clothing", "Bags", "Named school uniform"], "Named school uniform", "Visible names create a privacy issue, so those uniforms are excluded.", "select"),
      listeningQuestion("listening-swap-q3", "listening-clothing-swap", "purpose", "Why were example photographs published?", ["To clarify the required condition of clothes", "To advertise the charities", "To show the library entrance"], "To clarify the required condition of clothes", "Previous visitors had brought unsuitable items."),
      listeningQuestion("listening-swap-q4", "listening-clothing-swap", "attitude", "How does Priya describe the exchange?", ["A complete answer to textile waste", "A practical but limited action", "A way for charities to accept everything"], "A practical but limited action", "She explicitly says it is not a complete solution.", "select"),
      listeningQuestion("listening-swap-q5", "listening-clothing-swap", "detail", "When may people without tokens choose something?", ["At nine o'clock", "At midday", "During the final half-hour if items remain"], "During the final half-hour if items remain", "This is the final condition stated by Priya."),
    ],
  },
  {
    id: "listening-music-focus",
    title: "Can background music help you concentrate?",
    kind: "Psychology podcast",
    level: "B2",
    duration: "2:35",
    maxListens: 2,
    transcript:
      "Host: Many people put on music whenever they study, but does it improve concentration? Psychologist Dr Chen says the answer depends on the task. Dr Chen: For repetitive work, familiar music can improve mood and make the activity feel less tiring. But language-heavy tasks create competition. If you are reading a complex article while listening to a song with lyrics, both demand verbal attention. Host: So instrumental music is always safe? Dr Chen: Not necessarily. A dramatic piece with sudden changes may capture attention even without words. Volume matters too. The best background sound is usually predictable enough to remain in the background. Host: What about people who insist they cannot work in silence? Dr Chen: Habit is powerful. If someone always studies with music, silence may initially feel uncomfortable. That does not prove their performance is better with music. I suggest a small personal experiment: do similar tasks on different days, record how long they take and check the number of mistakes. Host: Is there one rule students can follow? Dr Chen: Match the sound to the purpose. Music may be fine while organising notes or practising a familiar skill. For learning difficult new material, quieter conditions often help. And if you spend five minutes choosing the perfect playlist every time, the music is already reducing your efficiency.",
    exercises: [
      listeningQuestion("listening-music-q1", "listening-music-focus", "main idea", "What determines whether music helps?", ["The relationship between the sound and the task", "The price of the headphones", "The time of the exam"], "The relationship between the sound and the task", "Dr Chen repeatedly matches sound conditions to task demands."),
      listeningQuestion("listening-music-q2", "listening-music-focus", "detail", "Why can songs with lyrics interfere with reading?", ["Both require verbal attention", "Lyrics are always unfamiliar", "Reading becomes physically tiring"], "Both require verbal attention", "Dr Chen describes competition for the same kind of attention.", "select"),
      listeningQuestion("listening-music-q3", "listening-music-focus", "inference", "Why might instrumental music still be distracting?", ["Sudden changes may attract attention", "It always contains hidden words", "It makes every task repetitive"], "Sudden changes may attract attention", "The absence of lyrics does not prevent dramatic sound from interrupting focus."),
      listeningQuestion("listening-music-q4", "listening-music-focus", "purpose", "Why does Dr Chen suggest a personal experiment?", ["To compare performance rather than rely on habit", "To create a public playlist", "To avoid checking mistakes"], "To compare performance rather than rely on habit", "She recommends timing similar tasks and counting errors.", "select"),
      listeningQuestion("listening-music-q5", "listening-music-focus", "attitude", "What does the final comment about playlists imply?", ["Preparation can become another form of distraction", "Every playlist improves efficiency", "Students should never organise notes"], "Preparation can become another form of distraction", "Spending too long choosing music already reduces productive time."),
    ],
  },
  {
    id: "listening-library-tour",
    title: "Welcome to the Riverside Library",
    kind: "Sentence completion · Cambridge Part 2",
    level: "B2",
    duration: "3:20",
    maxListens: 2,
    transcript:
      "Guide: Welcome to Riverside Library. Before the tour begins, I will explain the services available to new members and point out a few rules that are easy to miss. The library opens at eight thirty on weekdays and at ten on Saturdays. It is closed on Sundays, although books can still be returned through the metal drop box beside the main entrance. Please do not use that box for films or language equipment, as these items can be damaged. Your membership card allows you to borrow up to twelve items, including books, magazines and language courses. Standard loans last three weeks, but films must be returned after seven days. You can renew most items online unless another reader has reserved them. We send a reminder two days before an item is due, but members remain responsible for checking the date. On your right are the self-service machines. Staff at the information desk can show you how to use them today, and printed instructions are available in five languages. The quiet study area is on the second floor, beyond the local history room. Please remember that phone calls are only permitted in the entrance hall. The computers near the windows may be used without a reservation for up to forty minutes. Each member receives credit for twenty black-and-white printed pages per week; unused pages do not carry over to the following week. Colour printing is available, but there is a small charge. You will also find lockers beside the entrance. They require a one-pound coin, which is returned when the door is opened again. Lockers are emptied every evening, so please do not leave personal belongings in them overnight. If you need to work in a group, book one of the discussion rooms through our website. Bookings can be made up to fourteen days in advance, and each room holds a maximum of six people. The glass room is not soundproof, so it is better for quiet project work than for practising a presentation. The library also runs free workshops. This month's session on academic research takes place on the twenty-second, not the twentieth as printed in the old leaflet. Participants may bring a laptop, although the trainer will provide all the materials needed. Our weekly language exchange is held on Thursday evenings in the community room. There is no formal lesson: volunteers simply organise short conversations so that learners can practise with different partners. You do not need to register for that activity. If you have a question about borrowing, computer access or local archives, the help desk is staffed until seven on weekdays. After that time, security staff can assist with emergencies but cannot renew a loan. Finally, the café closes one hour before the rest of the building, so on weekdays its last orders are at six thirty. Hot food is served only until five, although drinks and cold snacks remain available. Visitors who need step-free access can use the lift behind the information desk. Now, if everyone is ready, we will begin the tour beside the new-book display.",
    exercises: [
      sentenceCompletion("listening-library-gap-1", "listening-library-tour", "The library opens at ___ on weekdays.", "8:30", "The guide says eight thirty.", ["eight thirty", "8.30"]),
      sentenceCompletion("listening-library-gap-2", "listening-library-tour", "Members may borrow a maximum of ___ items.", "12", "Membership allows up to twelve items.", ["twelve"]),
      sentenceCompletion("listening-library-gap-3", "listening-library-tour", "Films must be returned after ___ days.", "7", "Films have a shorter seven-day loan.", ["seven"]),
      sentenceCompletion("listening-library-gap-4", "listening-library-tour", "The quiet study area is on the ___ floor.", "second", "It is located on the second floor.", ["2nd", "2"]),
      sentenceCompletion("listening-library-gap-5", "listening-library-tour", "Discussion rooms can be reserved through the library's ___.", "website", "The guide tells groups to book through the website.", ["web site"]),
      sentenceCompletion("listening-library-gap-6", "listening-library-tour", "The academic research workshop is on the ___.", "22nd", "The speaker corrects the old leaflet and says the twenty-second.", ["twenty-second", "22"]),
      sentenceCompletion("listening-library-gap-7", "listening-library-tour", "Members receive credit for ___ black-and-white printed pages each week.", "20", "Each member receives credit for twenty black-and-white pages per week.", ["twenty"]),
      sentenceCompletion("listening-library-gap-8", "listening-library-tour", "The lockers require a refundable ___.", "one-pound coin", "The coin is returned when the locker is opened again.", ["one pound coin", "£1 coin", "1 pound coin"]),
      sentenceCompletion("listening-library-gap-9", "listening-library-tour", "The weekly language exchange takes place on ___ evenings.", "Thursday", "The guide says that the language exchange is held on Thursday evenings.", ["Thursdays"]),
      sentenceCompletion("listening-library-gap-10", "listening-library-tour", "On weekdays, the help desk is staffed until ___.", "7:00", "The help desk remains staffed until seven on weekdays.", ["seven", "7", "7.00"]),
    ],
  },
  {
    id: "listening-five-speakers-courses",
    title: "Why did they choose that course?",
    kind: "Multiple matching · Cambridge Part 3",
    level: "B2",
    duration: "2:35",
    maxListens: 2,
    transcript:
      "Speaker 1: I signed up for the evening cooking course because I had moved into my first flat and was tired of eating the same three meals. I did not expect to meet anyone, but the social side turned out to be a bonus. Speaker 2: My employer offered to pay for any course related to our work. I chose data visualisation because I often present figures to clients and wanted to make my reports clearer. Speaker 3: I had studied Italian online for months, but I kept avoiding real conversations. The weekend course included a homestay, so I had no choice but to speak. That pressure was exactly what I needed. Speaker 4: After an injury, I could no longer continue my usual running routine. A friend suggested photography because it would give me a reason to take gentle walks without focusing on exercise itself. Speaker 5: I already knew how to repair basic furniture, but I wanted a recognised qualification so that customers would trust me to take on larger restoration projects.",
    exercises: [
      listeningQuestion("listening-speakers-match-1", "listening-five-speakers-courses", "multiple matching", "Speaker 1 chose the course mainly to:", ["improve work presentations", "gain a professional certificate", "become more independent at home", "recover confidence after an injury", "force themselves to communicate", "meet new people", "prepare for university", "save money on travel"], "become more independent at home", "Cooking would replace the limited meals they relied on in their first flat.", "select"),
      listeningQuestion("listening-speakers-match-2", "listening-five-speakers-courses", "multiple matching", "Speaker 2 chose the course mainly to:", ["improve work presentations", "gain a professional certificate", "become more independent at home", "recover confidence after an injury", "force themselves to communicate", "meet new people", "prepare for university", "save money on travel"], "improve work presentations", "The speaker wants to communicate figures more clearly to clients.", "select"),
      listeningQuestion("listening-speakers-match-3", "listening-five-speakers-courses", "multiple matching", "Speaker 3 chose the course mainly to:", ["improve work presentations", "gain a professional certificate", "become more independent at home", "recover confidence after an injury", "force themselves to communicate", "meet new people", "prepare for university", "save money on travel"], "force themselves to communicate", "The homestay removes the option of avoiding real conversation.", "select"),
      listeningQuestion("listening-speakers-match-4", "listening-five-speakers-courses", "multiple matching", "Speaker 4 chose the course mainly to:", ["improve work presentations", "gain a professional certificate", "become more independent at home", "recover confidence after an injury", "force themselves to communicate", "meet new people", "prepare for university", "save money on travel"], "recover confidence after an injury", "Photography offers a gentle reason to walk after the injury.", "select"),
      listeningQuestion("listening-speakers-match-5", "listening-five-speakers-courses", "multiple matching", "Speaker 5 chose the course mainly to:", ["improve work presentations", "gain a professional certificate", "become more independent at home", "recover confidence after an injury", "force themselves to communicate", "meet new people", "prepare for university", "save money on travel"], "gain a professional certificate", "The qualification is intended to increase customers' trust.", "select"),
    ],
  },
];
