import React from "react";
import { View } from "react-native";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";
import { MessageSquareTextIcon } from "lucide-react-native";

import Thinking from "~/components/ui/loaders/thinking";
import Text from "~/components/ui/text";

const ConversationTitle = ({
  loading,
  title,
}: {
  loading: boolean;
  title: string | null;
}) => {
  if (!title) {
    return null;
  }

  return (
    <Animated.View
      className="relative px-4 py-3"
      entering={FadeInDown.duration(500)}
      exiting={FadeOutUp.duration(500)}
    >
      <View className="relative flex flex-row items-center gap-x-2 rounded-lg border border-slate-300 bg-white px-2 py-3">
        {!loading && (
          <Animated.View
            className="flex flex-row items-center gap-x-2"
            entering={FadeInDown.duration(300)}
            exiting={FadeOutUp.duration(300)}
          >
            <MessageSquareTextIcon size={16} className="text-slate-500" />
            {typeof title === "string" && (
              <Text fontSize={14} className="text-slate-700">
                {title}
              </Text>
            )}
          </Animated.View>
        )}
        {loading && (
          <Animated.View
            className="flex flex-row items-center gap-x-2"
            entering={FadeInDown.duration(300)}
            exiting={FadeOutUp.duration(300)}
          >
            <Thinking size={16} color="#808080" />
            <Text fontSize={14} className="text-slate-500">
              Updating title
            </Text>
          </Animated.View>
        )}
      </View>
    </Animated.View>
  );
};

export default ConversationTitle;
