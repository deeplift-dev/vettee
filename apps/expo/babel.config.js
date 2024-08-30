/** @type {import("@babel/core").ConfigFunction} */
module.exports = function (api) {
  api.cache.forever();

  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [require.resolve("react-native-reanimated/plugin")],
  };
};
