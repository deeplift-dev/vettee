import { Text as TextBase } from "react-native";

type variant = "body" | "title" | "subtitle" | "fine-print";
type fontWeight = "200" | "300" | "400" | "500" | "600" | "700" | "logo";

export default function Text({
  children,
  className,
  fontWeight,
  variant,
  fontSize,
}: {
  children: React.ReactNode;
  className?: string;
  fontWeight?: fontWeight;
  variant?: variant;
  fontSize?: number;
}) {
  let fontFamily;
  switch (fontWeight) {
    case "300":
      fontFamily = "BasierCircle-Regular";
      break;
    case "400":
      fontFamily = "BasierCircle-Regular";
      break;
    case "500":
      fontFamily = "BasierCircle-Medium";
      break;
    case "600":
      fontFamily = "BasierCircle-Medium";
      break;
    case "700":
      fontFamily = "BasierCircle-Medium";
      break;
    case "logo":
      fontFamily = "Unbounded_600SemiBold";
      break;
    default:
      fontFamily = "BasierCircle-Regular";
  }

  let _fontSize;
  switch (variant) {
    case "body":
      _fontSize = 16;
      break;
    case "title":
      _fontSize = 24;
      fontFamily = "Figtree_400Regular";
      break;
    case "subtitle":
      _fontSize = 20;
      fontFamily = "Figtree_400Regular";
      break;
    case "fine-print":
      _fontSize = 12;
      break;
    default:
      _fontSize = fontSize ?? 16;
  }

  return (
    <TextBase style={{ fontFamily, fontSize: _fontSize }} className={className}>
      {children}
    </TextBase>
  );
}
