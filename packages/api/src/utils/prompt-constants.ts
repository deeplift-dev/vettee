import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";

export const initThreadPrompt = (
  species: string,
  animalName: string,
  animalAge: number,
) => `
You are assisting a person with questions about their ${species} called ${animalName} who was born in ${animalAge}. I am going to also provide you with some key
pieces of information about ${animalName} that you should know.
`;

export const getConversationTitlePrompt = (
  messages: ChatCompletionMessageParam[],
  species: string,
  name: string,
) =>
  `Generate a conversation title for a conversation about an ${species} named ${name}. The title should be short (under 40 characters) and accurately summarize the conversation based SOLELY on the following messages. Do not use any information not present in these messages. No word play, puns, or year of birth. Return only the title, without quotes. Here are the specific messages to consider:\n\n${messages
    .slice(1)
    .map((m) => `${m.role}: ${m.content}`)
    .join(
      "\n",
    )}\n\nBased strictly on these messages, generate an appropriate title.`;
