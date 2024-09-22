import { Box, Text, VStack, View } from "@gluestack-ui/themed";
import Constants from "expo-constants";
import { Link, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { TouchableOpacity } from "react-native-gesture-handler";

import { supabase } from "~/utils/supabase";

const SettingsItems = [
  { label: "Profile", href: "/settings/profile" },
  { label: "Account", href: "/settings/account" },
];

export default function TopMenu() {
  // If the page was reloaded or navigated to directly, then the modal should be presented as
  // a full screen page. You may need to change the UI to account for this.
  const isPresented = router.canGoBack();
  return (
    <View flex={1} flexDirection="column" w="$full">
      <View flex={1} w="$full" p="$4" flexDirection="column">
        <View flexDirection="row-reverse">
          {isPresented && (
            <Link href="../">
              <Text size="lg" color="$black">
                Close
              </Text>
            </Link>
          )}
        </View>
        <ModalHeading>Settings</ModalHeading>
        <SettingsMenus />
      </View>
      {/* Use `../` as a simple way to navigate to the root. This is not analogous to "goBack". */}
      {/* Native modals have dark backgrounds on iOS, set the status bar to light content. */}
      <StatusBar style="light" />
    </View>
  );
}

const SettingsMenus = () => {
  const version = Constants?.expoConfig?.version;

  return (
    <VStack w="$full" h="$4/5" justifyContent="space-between">
      <VStack w="$full">
        {/* <View
          mb="$2"
          borderRadius={10}
          px="$4"
          py="$4"
          bg="$blueGray200"
          w="$full"
        >
          <Text w="$full" fontFamily="$mono">
            Account
          </Text>
        </View>
        <View mb="$2" px="$4" py="$4" bg="$blueGray200" w="$full">
          <Text w="$full" fontFamily="$mono">
            Security & Privacy
          </Text>
        </View> */}
        <TouchableOpacity onPress={() => supabase.auth.signOut()}>
          <View px="$4" py="$4" bg="$blueGray200" w="$full">
            <Text w="$full" fontFamily="$mono">
              Logout
            </Text>
          </View>
        </TouchableOpacity>
      </VStack>
      <Box>
        <Text w="$full" size="xs" textAlign="center">
          Version {version}
        </Text>
      </Box>
    </VStack>
  );
};

interface ModalHeadingProps {
  children: React.ReactNode;
}

const ModalHeading = ({ children }: ModalHeadingProps) => {
  return (
    <Text mb="$6" size="3xl" color="$black" fontFamily="$mono">
      {children}
    </Text>
  );
};