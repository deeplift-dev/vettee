import { Text, View } from "react-native";
import Swiper from 'react-native-deck-swiper'
import Animated, { Easing, FadeIn } from "react-native-reanimated";

export default function WaresDeck() {
  return (
    <Animated.View entering={FadeIn.duration(1000).easing(Easing.ease).overshootClamping(30)} className="flex bg-black flex-row justify-center items-center w-full">
        <Swiper
            cards={['DO', 'MORE', 'OF', 'WHAT', 'MAKES', 'YOU', 'HAPPY']}
            renderCard={(card) => {
                return (
                    <View className="flex align-middle self-center rounded-lg p-4 w-5/6 bg-gray-800 h-2/3 shadow-lg border-2 border-white">
                        <Text className="text-white text-4xl font-bold">{card}</Text>
                    </View>
                )
            }}
            onSwiped={(cardIndex) => {console.log(cardIndex)}}
            onSwipedAll={() => {console.log('onSwipedAll')}}
            cardIndex={0}
            backgroundColor={'black'}
            stackSize= {3}>
        </Swiper>
    </Animated.View>
  );
}