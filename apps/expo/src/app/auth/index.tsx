import { useRouter } from "expo-router";
import { View, VStack } from "@gluestack-ui/themed";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { create } from "zustand";

import AuthSheet from "~/components/features/auth/sheets/auth-sheet";
import MarqueeCarousel from "~/components/features/onboarding/marquee-carousel";
import { BaseButton } from "~/components/ui/buttons/base-button";

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
  const { session, isLoading } = useSessionContext();
  const { activeSlide, autoPlay, setActiveSlide, setAutoPlay } = useStore(
    (state) => ({
      activeSlide: state.activeSlide,
      autoPlay: state.autoPlay,
      setActiveSlide: state.setActiveSlide,
      setAutoPlay: state.setAutoPlay,
    }),
  );
  const router = useRouter();

  if (session) {
    router.replace("/(tabs)");
  }

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
          <BaseButton onPress={openSheet}>Get started</BaseButton>
        </View>
      }
    />
  );
};

export default Index;
