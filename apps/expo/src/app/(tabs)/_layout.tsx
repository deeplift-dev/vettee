import { Redirect, Tabs } from "expo-router";
import {
  FontAwesome5,
  Fontisto,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useSessionContext, useUser } from "@supabase/auth-helpers-react";

export default function Layout() {
  const { session, isLoading, error } = useSessionContext();
  const hasOnboarded = true;

  if (isLoading) {
    return;
  }

  const isAuthed = session?.user;

  if (!isAuthed) {
    return <Redirect href="/onboarding" />;
  }

  if (!hasOnboarded) {
    return <Redirect href="/onboarding/account" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "transparent",
          borderTopWidth: 0,
        },
      }}
    >
      <Tabs.Screen
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
      <Tabs.Screen
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
      <Tabs.Screen
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
    </Tabs>
  );
}
