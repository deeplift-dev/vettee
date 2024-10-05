import { useEffect, useState } from "react";
import { Redirect, Stack, useLocalSearchParams } from "expo-router";
import { useSessionContext } from "@supabase/auth-helpers-react";

import LoadingFullscreen from "~/components/ui/loading-fullscreen";
import { api } from "~/utils/api";

export default function Layout() {
  const { session, isLoading } = useSessionContext();
  const searchParams = useLocalSearchParams();
  const [isAuthed, setIsAuthed] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setIsAuthed(true);
    } else {
      setIsAuthed(false);
    }
  }, [session]);

  const {
    data: profile,
    isLoading: loadingProfile,
    error: profileError,
  } = api.profile.byId.useQuery(
    { id: session?.user?.id },
    { enabled: isAuthed },
  );

  useEffect(() => {
    if (profile) {
      const onboarded =
        profile?.[0]?.onboardedAt ||
        (searchParams?.params?.onboardingSuccess === "true" &&
          searchParams?.screen === "index");
      setHasOnboarded(!!onboarded);
    }
  }, [profile, searchParams]);

  if (loadingProfile) {
    return <LoadingFullscreen />;
  }
  console.log("is authed", isAuthed);

  if (!isAuthed) {
    return <Redirect href="/auth/" />;
  }

  if (profileError) {
    return <Redirect href="/onboarding/account" />;
  }

  // if (isLoading || loadingProfile) {
  //   return <LoadingFullscreen />;
  // }

  // if (error) {
  //   console.error("Error fetching profile:", error);
  // }

  // if (!hasOnboarded) {
  //   return <Redirect href="/onboarding/account" />;
  // }

  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="animal-create"
        options={{
          headerShown: false,
          presentation: "containedModal",
        }}
      />
      <Stack.Screen
        name="chat"
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="animal/[slug]"
        options={{
          headerShown: true,
          headerTransparent: true,
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerTitle: "",
          headerBackTitle: "",
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          headerShown: false,
          title: "Settings",
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
