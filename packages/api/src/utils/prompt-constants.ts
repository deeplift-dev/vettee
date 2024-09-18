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
  `Generate a conversation title for a conversation with about an ${species} named ${name}. The title should be short and most importantly accurately summarise the conversation based on the messages provided. No word play or puns please. Keep it under 40 characters. Dont return the title in quotes. Only return the title. Don't use the year of birth in the title. Consider the following conversation context:\n\n${messages
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n")}
`;
