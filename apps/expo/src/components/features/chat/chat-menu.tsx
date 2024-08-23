import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { ScrollView, TouchableWithoutFeedback } from "react-native";
import { useRouter } from "expo-router";
import { View } from "@gluestack-ui/themed";
import BottomSheet from "@gorhom/bottom-sheet";
import { formatDistanceToNow } from "date-fns";
import { XIcon } from "lucide-react-native";

import Text from "~/components/ui/text";

const ChatMenu = forwardRef((props, ref) => {
  const bottomSheetRef = useRef(null);
  const router = useRouter();

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

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={["40%"]}
      enablePanDownToClose={true}
      onClose={closeBottomSheet}
      handleComponent={null}
    >
      <View className="flex flex-row items-center justify-between border-b border-gray-200 bg-white px-4 py-4">
        <TouchableWithoutFeedback
          className="border-t border-gray-800 shadow"
          onPress={closeBottomSheet}
        >
          <XIcon size={26} color="black" />
        </TouchableWithoutFeedback>
        <Text className="text-center font-bold">Menu</Text>
        <View>
          <Text className="text-right">Reset</Text>
        </View>
      </View>
      <View className="flex flex-col gap-6 p-4">
        <View className="flex flex-row items-center justify-between">
          <Text className="font-bold">Recent Conversations</Text>
        </View>
        <RecentConversationsList />
        <View className="flex flex-row items-center justify-between">
          <Text className="font-bold">Quick Actions</Text>
        </View>
      </View>
    </BottomSheet>
  );
});

const RecentConversationsList = () => {
  const dummyConversations = [
    { id: 1, title: "Dog Training Tips", date: "2023-01-01" },
    { id: 2, title: "Cat Nutrition Advice", date: "2023-01-02" },
    { id: 3, title: "Bird Care Guidelines", date: "2023-01-03" },
  ];
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {dummyConversations.map((conversation) => (
        <View key={conversation.id} className="mr-4">
          <ConversationCard conversation={conversation} />
        </View>
      ))}
    </ScrollView>
  );
};

const ConversationCard = ({
  conversation,
}: {
  conversation: { id: number; title: string; date: string };
}) => {
  const formattedDate = formatDistanceToNow(new Date(conversation.date), {
    addSuffix: true,
  });
  return (
    <View className="rounded-2xl border border-gray-200 p-4">
      <Text variant="fine-print" className="font-medium">
        {conversation.title}
      </Text>
      <Text variant="fine-print" className="text-slate-700">
        {formattedDate}
      </Text>
    </View>
  );
};

ChatMenu.displayName = "ChatMenu";

export default ChatMenu;
