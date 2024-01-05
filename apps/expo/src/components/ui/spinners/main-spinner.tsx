import AnimatedLottieView from "lottie-react-native";

export default function MainSpinner() {
  return (
    <AnimatedLottieView
      autoPlay
      style={{
        width: 50,
        height: 50,
        backgroundColor: "transparent",
      }}
      source={require("../../../../assets/animations/spinner.json")}
    />
  );
}
