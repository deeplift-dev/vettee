export const initThreadPrompt = (
  species: string,
  animalName: string,
  animalAge: number,
) => `
You are assisting a person with questions about their ${species} called ${animalName} who was born in ${animalAge}. I am going to also provide you with some key
pieces of information about ${animalName} that you should know.
`;
