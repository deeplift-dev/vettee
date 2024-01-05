import type { ChatCompletion } from "openai/resources";

function formatToJson(chatCompletion: ChatCompletion) {
  const content = chatCompletion?.choices[0]?.message?.content;

  if (!content) {
    return null;
  }

  return JSON.parse(content.replace(/```json\n|\n```/g, ""));
}

export default formatToJson;
