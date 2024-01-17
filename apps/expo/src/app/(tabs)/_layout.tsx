import { Redirect, Stack, Tabs } from "expo-router";
import {
  FontAwesome5,
  Fontisto,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useSessionContext, useUser } from "@supabase/auth-helpers-react";

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

  if (!isAuthed) {
    return <Redirect href="/auth/" />;
  }

  /**
   * If the user is authenticated, but has not onboarded, redirect them to the onboarding flow.
   */
  const { data: profile, isLoading: loadingProfile } =
    api.profile.byId.useQuery({ id: session.user.id });

  if (loadingProfile) {
    return <LoadingFullscreen />;
  }

  const hasOnboarded = profile?.[0]?.onboardedAt;

  if (!hasOnboarded) {
    return <Redirect href="/onboarding/account" />;
  }

  return (
    <Stack>
      <Stack.Screen
        // Name of the route to hide.
        name="index"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cards" size={30} color={color} />
          ),
        }}
        // options={{
        //   // This tab will no longer show up in the tab bar.
        //   href: null,
        // }}
      />
      <Stack.Screen
        // Name of the route to hide.
        name="camera"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => (
            <Fontisto name="camera" size={35} color={color} />
          ),
        }}
        // options={{
        //   // This tab will no longer show up in the tab bar.
        //   href: null,
        // }}
      />
      <Stack.Screen
        // Name of the route to hide.
        name="settings"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="user-circle" size={30} color={color} />
          ),
        }}
        // options={{
        //   // This tab will no longer show up in the tab bar.
        //   href: null,
        // }}
      />
      <Stack.Screen
        name="modal"
        options={{
          // Set the presentation mode to modal for our modal route.
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
