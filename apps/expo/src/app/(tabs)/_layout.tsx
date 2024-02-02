import { Redirect, Stack } from "expo-router";
import { useSessionContext } from "@supabase/auth-helpers-react";

import LoadingFullscreen from "~/components/ui/loading-fullscreen";
import { api } from "~/utils/api";

export default function Layout() {
  const { session, isLoading, error } = useSessionContext();

  if (isLoading) {
    return <LoadingFullscreen />;
  }

  /**
   * If the user is not authenticated, redirect them to the onboarding flow.
   */
  const isAuthed = session?.user;

  console.log("is authed", isAuthed);

  console.log("user id", session?.user.id);

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
    isError,
    error: profileError,
  } = api.profile.byId.useQuery({ id: session.user.id });

  console.log(
    "loading profile",
    loadingProfile,
    isPending,
    isSuccess,
    session.user.id,
  );

  console.log("profile error", profileError);

  if (loadingProfile || isPending || !isSuccess) {
    return <LoadingFullscreen />;
  }

  console.log("profile", profile);

  const hasOnboarded = profile?.[0]?.onboardedAt;

  console.log("has onboarded", hasOnboarded);

  if (!hasOnboarded) {
    return <Redirect href="/onboarding/account" />;
  }

  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="modal"
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="animal-create"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
