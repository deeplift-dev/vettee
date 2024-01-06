import * as React from "react";
import { Dimensions } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import { Text, View } from "@gluestack-ui/themed";

import { theme } from "~/styles";
import AnimalDash from "./cards/animal-dash";
import AnimalsCard from "./cards/animals-card";
import ChatCard from "./cards/chat-card";
import IntroCard from "./cards/intro-card";
import VetCard from "./cards/vet-card";

type Cards = "intro" | "chat" | "vet" | "animals" | "animal-dash";

const PAGE_WIDTH = Dimensions.get("window").width;
const PAGE_HEIGHT = Dimensions.get("window").height;

function ParallaxCarousel() {
  const [isVertical, setIsVertical] = React.useState(false);
  const [autoPlay, setAutoPlay] = React.useState(true);
  const [pagingEnabled, setPagingEnabled] = React.useState<boolean>(true);
  const [snapEnabled, setSnapEnabled] = React.useState<boolean>(true);
  const progressValue = useSharedValue<number>(0);

  const cards: Cards[] = ["intro", "animal-dash", "chat", "vet", "animals"];

  return (
    <View height="90%">
      <Carousel
        width={PAGE_WIDTH}
        height={PAGE_HEIGHT * 0.8}
        style={{
          width: PAGE_WIDTH,
        }}
        loop
        pagingEnabled={pagingEnabled}
        snapEnabled={snapEnabled}
        autoPlay={autoPlay}
        autoPlayInterval={12000}
        onProgressChange={(_, absoluteProgress) =>
          (progressValue.value = absoluteProgress)
        }
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 1,
          parallaxScrollingOffset: 0,
        }}
        data={cards}
        renderItem={({ index }) => {
          return <CarouselItems activeCard={cards[index] ?? "chat"} />;
        }}
      />
      {!!progressValue && (
        <View
          style={
            isVertical
              ? {
                  flexDirection: "column",
                  justifyContent: "space-between",
                  width: 10,
                  alignSelf: "center",
                  position: "absolute",
                  right: 5,
                  top: 40,
                }
              : {
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: 90,
                  marginTop: 20,
                  alignSelf: "center",
                }
          }
        >
          {cards.map((backgroundColor, index) => {
            return (
              <PaginationItem
                backgroundColor={theme.colors.secondary}
                animValue={progressValue}
                index={index}
                key={index}
                isRotate={isVertical}
                length={cards.length}
              />
            );
          })}
        </View>
      )}
    </View>
  );
}

const PaginationItem: React.FC<{
  index: number;
  backgroundColor: string;
  length: number;
  animValue: Animated.SharedValue<number>;
  isRotate?: boolean;
}> = (props) => {
  const { animValue, index, length, backgroundColor, isRotate } = props;
  const width = 10;

  const animStyle = useAnimatedStyle(() => {
    let inputRange = [index - 1, index, index + 1];
    let outputRange = [-width, 0, width];

    if (index === 0 && animValue?.value > length - 1) {
      inputRange = [length - 1, length, length + 1];
      outputRange = [-width, 0, width];
    }

    return {
      transform: [
        {
          translateX: interpolate(
            animValue?.value,
            inputRange,
            outputRange,
            Extrapolate.CLAMP,
          ),
        },
      ],
    };
  }, [animValue, index, length]);
  return (
    <View
      style={{
        backgroundColor: "lightgray",
        width,
        height: width,
        borderRadius: 50,
        overflow: "hidden",
        transform: [
          {
            rotateZ: isRotate ? "90deg" : "0deg",
          },
        ],
      }}
    >
      <Animated.View
        style={[
          {
            borderRadius: 50,
            backgroundColor,
            flex: 1,
          },
          animStyle,
        ]}
      />
    </View>
  );
};

interface CarouselItemsProps {
  activeCard: Cards;
}

const CarouselItems = ({ activeCard }: CarouselItemsProps) => {
  switch (activeCard) {
    case "intro":
      return <IntroCard />;
    case "chat":
      return <ChatCard />;
    // case "vet":
    //   return <VetCard />;
    case "animals":
      return <AnimalsCard />;
    case "animal-dash":
      return <AnimalDash />;
    default:
      return <IntroCard />;
  }
};

export default ParallaxCarousel;
