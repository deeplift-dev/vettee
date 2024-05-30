export const navigateToChat = (router: any, animalId: string) => {
  router.push({ pathname: `/chat`, params: { animalId } });
};
