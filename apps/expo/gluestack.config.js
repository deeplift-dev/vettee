import { config as defaultConfig } from "@gluestack-ui/config";
import { createConfig } from "@gluestack-ui/themed";

const config = createConfig({
  ...defaultConfig,
  tokens: {
    ...defaultConfig.tokens,
    fonts: {
      body: "Saans-Regular",
      heading: "Oddval-Medium",
      mono: "Saans-Medium",
    },
  },
});

export default config;
