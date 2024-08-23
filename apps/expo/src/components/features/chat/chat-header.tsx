import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Avatar, AvatarImage } from "@gluestack-ui/themed";

import LogoText from "~/components/ui/logo/logo-text";
import Text from "~/components/ui/text";

interface Animal {
  type: string;
  name: string;
}

interface Profile {
  // Define the properties of the profile object here
}

interface ChatHeaderProps {
  animal: Animal;
  profile: Profile;
  onPressTalkingAbout: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  animal,
  profile,
  onPressTalkingAbout,
}) => {
  return (
    <View className="flex flex-row items-center justify-between border-b border-gray-200 p-2">
      <LogoText />
      <TalkingAboutButton animal={animal} onPress={onPressTalkingAbout} />
    </View>
  );
};

export default ChatHeader;

interface TalkingAboutButtonProps {
  animal: Animal;
  onPress: () => void;
}

const TalkingAboutButton: React.FC<TalkingAboutButtonProps> = ({
  animal,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex flex-row items-center gap-2 rounded-full bg-white p-1"
    >
      <AnimalAvatar animal={animal} />
      <Text variant="fine-print" className="font-medium">
        {animal.name}
      </Text>
    </TouchableOpacity>
  );
};

interface AnimalAvatarProps {
  animal: Animal;
}

const AnimalAvatar: React.FC<AnimalAvatarProps> = ({ animal }) => {
  return (
    <Avatar bgColor="$green200" size="sm" borderRadius="$full">
      <AvatarImage
        source={{
          uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbgLFeQcTbw1n6q4B8bgoVcc_5x9ftDEggUw&s",
        }}
      />
    </Avatar>
  );
};
