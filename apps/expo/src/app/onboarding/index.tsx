import React from "react";
import { Link } from "expo-router";
import { Button, ButtonText, View, VStack } from "@gluestack-ui/themed";

import MarqueeCarousel from "~/components/features/onboarding/marquee-carousel";
import { PageContainer } from "~/components/ui/page-container";
import { theme } from "~/styles";

const Index = () => {
  return (
    <PageContainer>
      <VStack>
        <MarqueeCarousel />
        <GetStarted />
      </VStack>
    </PageContainer>
  );
};

const GetStarted = () => {
  return (
    <View px="$12">
      <Link href="/auth/" asChild>
        <Button
          bg={theme.colors.primary}
          size="xl"
          height={55}
          rounded="$full"
          boxShadow="lg"
          shadowColor="$indigo700"
        >
          <ButtonText color="$black">Get started</ButtonText>
        </Button>
      </Link>
    </View>
  );
};

export default Index;
