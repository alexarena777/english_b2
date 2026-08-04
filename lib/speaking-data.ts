export interface SpeakingPrompt {
  id: string;
  part: "Interview" | "Long turn" | "Collaborative task" | "Discussion";
  title: string;
  prompt: string;
  questions: string[];
  usefulLanguage: string[];
  preparationSeconds: number;
  targetSeconds: number;
}

export const speakingPrompts: SpeakingPrompt[] = [
  {
    id: "sp-interview-routine",
    part: "Interview",
    title: "Learning routines",
    prompt: "Talk about how you currently study English and what you would like to improve.",
    questions: [
      "When and where do you usually study?",
      "Which activity helps you most?",
      "What would make your routine more effective?",
    ],
    usefulLanguage: ["I tend to…", "What helps me most is…", "I’d like to become better at…"],
    preparationSeconds: 15,
    targetSeconds: 60,
  },
  {
    id: "sp-long-turn-travel",
    part: "Long turn",
    title: "Two ways of travelling",
    prompt: "Compare travelling alone with travelling in a group and say which experience can teach a person more.",
    questions: [
      "What might people enjoy in each situation?",
      "What difficulties could they face?",
      "Which option develops more independence?",
    ],
    usefulLanguage: ["Both situations…", "Whereas…", "The main advantage would be…"],
    preparationSeconds: 30,
    targetSeconds: 90,
  },
  {
    id: "sp-collaborative-college",
    part: "Collaborative task",
    title: "Improving student life",
    prompt: "A college wants to improve student wellbeing. Consider the ideas and decide which would have the greatest impact.",
    questions: [
      "A quiet study room",
      "More sports activities",
      "Free counselling sessions",
      "A student social club",
    ],
    usefulLanguage: ["Shall we start with…?", "That could work because…", "I’d prioritise…"],
    preparationSeconds: 30,
    targetSeconds: 120,
  },
  {
    id: "sp-discussion-technology",
    part: "Discussion",
    title: "Technology and attention",
    prompt: "Do digital tools make it easier or harder for people to concentrate? Give a balanced answer.",
    questions: [
      "How have study habits changed?",
      "Who is responsible for managing distractions?",
      "Can technology also improve concentration?",
    ],
    usefulLanguage: ["On the one hand…", "It depends largely on…", "Overall, I would argue…"],
    preparationSeconds: 20,
    targetSeconds: 90,
  },
  {
    id: "sp-long-turn-work",
    part: "Long turn",
    title: "Learning at work",
    prompt: "Compare learning from a colleague with learning through an online course. Say which is more useful for a new employee.",
    questions: [
      "What kind of support is available?",
      "How flexible is each method?",
      "Which creates more confidence?",
    ],
    usefulLanguage: ["In contrast to…", "A key difference is…", "For a newcomer, I’d choose…"],
    preparationSeconds: 30,
    targetSeconds: 90,
  },
  {
    id: "sp-discussion-environment",
    part: "Discussion",
    title: "Everyday environmental choices",
    prompt: "Which everyday actions can genuinely reduce a person’s environmental impact? Explain which changes are realistic.",
    questions: [
      "Transport choices",
      "Food and shopping habits",
      "Energy use at home",
    ],
    usefulLanguage: ["A realistic first step is…", "This would only work if…", "The greatest impact might come from…"],
    preparationSeconds: 20,
    targetSeconds: 90,
  },
];
