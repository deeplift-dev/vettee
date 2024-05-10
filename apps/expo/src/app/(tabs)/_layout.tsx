import { Redirect, Stack, useLocalSearchParams } from "expo-router";
import { useSessionContext } from "@supabase/auth-helpers-react";

import LoadingFullscreen from "~/components/ui/loading-fullscreen";
import { api } from "~/utils/api";

export default function Layout() {
  const { session, isLoading } = useSessionContext();
  const searchParams = useLocalSearchParams();

  if (isLoading) {
    return <LoadingFullscreen />;
  }

  /**
   * If the user is not authenticated, redirect them to the onboarding flow.
   */
  const isAuthed = session?.user;

  if (!isAuthed) {
    return <Redirect href="/auth/" />;
  }

  /**
   * If the user is authenticated, but has not onboarded, redirect them to the onboarding flow.
   */
  const {
    data: profile,
    isLoading: loadingProfile,
    isPending,
    isSuccess,
  } = api.profile.byId.useQuery({ id: session.user.id });

  if (loadingProfile || isPending || !isSuccess) {
    return <LoadingFullscreen />;
  }

  const hasOnboarded =
    profile?.[0]?.onboardedAt ||
    (searchParams?.params?.onboardingSuccess === "true" &&
      searchParams?.screen === "index");

  if (!hasOnboarded) {
    return <Redirect href="/onboarding/account" />;
  }

  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="animal-create"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="chat"
        options={{
          headerShown: false,
          presentation: "transparentModal",
          animation: "fade",
        }}
      />
    </Stack>
  );
}
