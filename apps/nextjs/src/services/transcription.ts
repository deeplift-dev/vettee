import Replicate from "replicate";

const replicate = new Replicate();

const transcriptionService = {
  transcribe: async (formData: FormData) => {
    try {
      const file = formData.get("file") as File;

      const input = {
        file,
        prompt: "LLama, AI, Meta.",
        file_url: "",
        language: "en",
        num_speakers: 2,
      };

      let prediction = await replicate.deployments.predictions.create(
        "deeplift-dev",
        "vetski-transcriber",
        { input },
      );

      console.log(prediction);
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
};

export default transcriptionService;
