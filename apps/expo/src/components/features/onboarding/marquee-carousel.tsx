import * as React from "react";
import { Dimensions } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import { View } from "@gluestack-ui/themed";

import IntroCard from "./cards/intro-card";

type Cards = "intro" | "chat" | "vet" | "animals" | "animal-dash";

const PAGE_WIDTH = Dimensions.get("window").width;
const PAGE_HEIGHT = Dimensions.get("window").height;

interface ParallaxCarouselProps {
  // Used to determine if the carousel should autoplay or not.
  autoPlay?: boolean;
}

function ParallaxCarousel({ autoPlay = true }: ParallaxCarouselProps) {
  const [isVertical, setIsVertical] = React.useState(false);
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
        pagingEnabled={false}
        snapEnabled={snapEnabled}
        autoPlay={false}
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
          return <CarouselItems activeCard={cards[index] ?? "intro"} />;
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
        ></View>
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
    // case "chat":
    //   return <ChatCard />;
    // case "vet":
    //   return <VetCard />;
    // case "animals":
    //   return <AnimalsCard />;
    // case "animal-dash":
    //   return <AnimalDash />;
    default:
      return <IntroCard />;
  }
};

export default ParallaxCarousel;
