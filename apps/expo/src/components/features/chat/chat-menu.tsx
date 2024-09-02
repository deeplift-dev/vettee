import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { ScrollView } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useRouter } from "expo-router";
import { View } from "@gluestack-ui/themed";
import BottomSheet from "@gorhom/bottom-sheet";
import { formatDistanceToNow } from "date-fns";
import { Settings2Icon, XIcon } from "lucide-react-native";

import type { RouterOutputs } from "~/utils/api";
import Text from "~/components/ui/text";
import { api } from "~/utils/api";

interface ChatMenuProps {
  animalId: string;
}

interface ChatMenuRef {
  open: () => void;
  close: () => void;
}

type ConversationsResponse = RouterOutputs["conversation"]["listForAnimal"];
const ChatMenu = forwardRef<ChatMenuRef, ChatMenuProps>((props, ref) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  useImperativeHandle(ref, () => ({
    open: () => {
      bottomSheetRef.current?.expand();
    },
    close: () => {
      bottomSheetRef.current?.close();
    },
  }));

  const closeBottomSheet = () => {
    bottomSheetRef.current?.close();
  };

  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={["40%"]}
      enablePanDownToClose={true}
      onClose={closeBottomSheet}
      handleComponent={null}
      onChange={(index) => setIsOpen(index === 0 ? true : false)}
    >
      <View className="z-20 flex flex-row items-center justify-between border-b border-gray-200 bg-white px-4 py-4">
        <TouchableOpacity
          className="border-t border-gray-800 shadow"
          onPress={closeBottomSheet}
        >
          <XIcon size={26} color="black" />
        </TouchableOpacity>
        <Text className="text-center font-bold">Menu</Text>
        <View>
          <Settings2Icon size={26} color="black" />
        </View>
      </View>
      <View className="flex flex-col gap-6 p-4">
        <View className="flex flex-row items-center justify-between">
          <Text className="font-bold">Recent Conversations</Text>
        </View>
        {props.animalId && (
          <RecentConversationsList
            animalId={props.animalId}
            refetchConversations={isOpen}
          />
        )}
        <View className="flex flex-row items-center justify-between">
          <Text className="font-bold">Quick Actions</Text>
        </View>
      </View>
    </BottomSheet>
  );
});

const RecentConversationsList = ({
  animalId,
  refetchConversations,
}: {
  animalId: string;
  refetchConversations: boolean;
}) => {
  const router = useRouter();
  const {
    data: conversationsResponse,
    isLoading: conversationsLoading,
    isRefetching: conversationsRefetching,
    refetch,
  } = api.conversation.listForAnimal.useQuery(
    {
      limit: 5,
      page: 1,
      animalId,
    },
    {
      enabled: false, // Initially disable the query
    },
  );
  const conversations: ConversationsResponse["data"] =
    conversationsResponse?.data ?? [];

  // Use useFocusEffect to refetch when the component becomes visible
  React.useEffect(() => {
    if (refetchConversations) {
      refetch();
    }
  }, [refetch, refetchConversations]);

  if (!conversations || conversationsLoading || conversationsRefetching) {
    return <ConversationListSkeleton />;
  }

  if (conversations.length < 1) {
    return <Text>No conversations</Text>;
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {conversations.map((conversation) => (
        <View key={conversation.id} className="mr-4">
          <TouchableOpacity
            onPress={() =>
              router.replace(
                `/(tabs)/chat?conversationId=${conversation.id}&animalId=${conversation.animalId}`,
              )
            }
          >
            <ConversationCard conversation={conversation} />
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const ConversationCard = ({
  conversation,
}: {
  conversation: ConversationsResponse["data"][number];
}) => {
  const formattedDate = formatDistanceToNow(new Date(conversation.createdAt), {
    addSuffix: true,
  });
  return (
    <View className="w-52 rounded-2xl border border-gray-200 p-4">
      <Text className="font-medium">{conversation.title}</Text>
      <Text className="text-slate-700">{formattedDate}</Text>
    </View>
  );
};

const duration = 2000;
const easing = Easing.bezier(0.25, -0.5, 0.25, 1);

const ConversationSkeleton = () => {
  const sv = useSharedValue<number>(0);
  React.useEffect(() => {
    sv.value = withRepeat(
      withSequence(
        withTiming(1, { duration: duration / 2, easing }),
        withTiming(0.5, { duration: duration / 2, easing }),
      ),
      -1,
      true,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: sv.value,
  }));

  return (
    <Animated.View
      className="mr-4 w-52 rounded-2xl border border-gray-200 p-4"
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
    >
      <Animated.View style={[animatedStyle]}>
        <View className="mb-2 h-4 w-3/4 rounded bg-gray-200" />
        <View className="h-3 w-1/2 rounded bg-gray-200" />
      </Animated.View>
    </Animated.View>
  );
};

const ConversationListSkeleton = () => {
  return (
    <View style={{ flexDirection: "row" }}>
      {[...Array(3)].map((_, index) => (
        <View
          key={`skeleton-${index}`}
          style={{ marginRight: index < 2 ? 8 : 0 }}
        >
          <ConversationSkeleton />
        </View>
      ))}
    </View>
  );
};

ChatMenu.displayName = "ChatMenu";

export default ChatMenu;
