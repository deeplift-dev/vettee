import { Platform } from "react-native";
import { Link } from "expo-router";
import {
  Button,
  ButtonText,
  KeyboardAvoidingView,
  View,
  VStack,
} from "@gluestack-ui/themed";
import create from "zustand";

import AuthSheet from "~/components/features/auth/sheets/auth-sheet";
import MarqueeCarousel from "~/components/features/onboarding/marquee-carousel";
import { PageContainer } from "~/components/ui/page-container";
import { theme } from "~/styles";

interface Store {
  activeSlide: number | null;
  autoPlay: boolean;
  setActiveSlide: (activeSlide: number) => void;
  setAutoPlay: (autoPlay: boolean) => void;
}

const useStore = create<Store>((set) => ({
  autoPlay: true,
  activeSlide: null,
  setActiveSlide: (activeSlide) => set({ activeSlide }),
  setAutoPlay: (autoPlay) => set({ autoPlay }),
}));

const Index = () => {
  const { activeSlide, autoPlay, setActiveSlide, setAutoPlay } = useStore(
    (state) => ({
      activeSlide: state.activeSlide,
      autoPlay: state.autoPlay,
      setActiveSlide: state.setActiveSlide,
      setAutoPlay: state.setAutoPlay,
    }),
  );

  return (
    <VStack>
      <MarqueeCarousel autoPlay={autoPlay} activeSlide={activeSlide} />
      <GetStarted
        openSheet={() => {
          setAutoPlay(false);
          setActiveSlide(0);
        }}
      />
    </VStack>
  );
};

interface GetStartedProps {
  openSheet: () => void;
}

const GetStarted = ({ openSheet }: GetStartedProps) => {
  return (
    <AuthSheet
      trigger={
        <View px="$12">
          <Button
            bg={theme.colors.primary}
            onPress={() => openSheet()}
            size="xl"
            height={55}
            rounded="$full"
            boxShadow="lg"
            shadowColor="$indigo700"
          >
            <ButtonText color="$black">Get started</ButtonText>
          </Button>
        </View>
      }
    />
  );
};

export default Index;
