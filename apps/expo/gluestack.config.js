import { config as defaultConfig } from "@gluestack-ui/config";
import { createConfig } from "@gluestack-ui/themed";

const config = createConfig({
  ...defaultConfig,
  tokens: {
    ...defaultConfig.tokens,
    fonts: {
      body: "Outfit_400Regular",
      heading: "Oddval-Medium",
      mono: "Outfit_600SemiBold",
    },
  },
});

export default config;
