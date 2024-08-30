import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Avatar, AvatarImage } from "@gluestack-ui/themed";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import LogoText from "~/components/ui/logo/logo-text";
import Text from "~/components/ui/text";
import { downloadPresignedUrl } from "~/utils/helpers/images";

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
      className="flex flex-row items-center gap-2 rounded-full border border-slate-300 bg-white p-1"
    >
      <AnimalAvatar animal={animal} />
      <Text fontSize={14} className="font-medium">
        {animal.name}
      </Text>
    </TouchableOpacity>
  );
};

interface AnimalAvatarProps {
  animal: Animal;
}

const AnimalAvatar: React.FC<AnimalAvatarProps> = ({ animal }) => {
  const [imageUrl, setImageUrl] = React.useState(null);
  const supabase = useSupabaseClient();
  React.useEffect(() => {
    const fetchImageUrl = async () => {
      if (animal.avatarUrl) {
        const url = await downloadPresignedUrl(
          supabase,
          animal.avatarUrl,
          "animal-profiles",
        );
        setImageUrl(url);
      }
    };

    fetchImageUrl();
  }, [animal.avatarUrl, supabase]);
  return (
    <Avatar bgColor="$green200" size="sm" borderRadius="$full">
      <AvatarImage
        source={{
          uri: imageUrl ?? "",
        }}
      />
    </Avatar>
  );
};
