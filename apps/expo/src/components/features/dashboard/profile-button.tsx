import { Link } from "expo-router";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  VStack,
} from "@gluestack-ui/themed";
import { useUser } from "@supabase/auth-helpers-react";

import { api } from "~/utils/api";

export default function ProfileButton() {
  const user = useUser();

  if (!user) {
    return null;
  }

  const { data: [profile] = [undefined] } = api.profile.byId.useQuery({
    id: user?.id,
  });

  const name =
    `${profile?.firstName} ${profile?.lastName}` ||
    user?.user_metadata.full_name ||
    "Unknown";

  console.log("user", user);
  return (
    <Link href="/modal">
      <Avatar bgColor="$green200" size="md" borderRadius="$full">
        <AvatarImage source={{ uri: user?.user_metadata.avatar_url }} />
        <AvatarFallbackText color="$black">{name}</AvatarFallbackText>
      </Avatar>
    </Link>
  );
}
