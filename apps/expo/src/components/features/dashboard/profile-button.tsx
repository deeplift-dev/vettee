import { Link } from "expo-router";
import { Avatar, AvatarFallbackText, AvatarImage } from "@gluestack-ui/themed";
import { useUser } from "@supabase/auth-helpers-react";

import { api } from "~/utils/api";

export default function ProfileButton() {
  const user = useUser();

  const { data: [profile] = [undefined] } = api.profile.byId.useQuery(
    { id: user?.id },
    { enabled: !!user },
  );

  if (!user) {
    return null;
  }

  const name =
    `${profile?.firstName} ${profile?.lastName}` ||
    user?.user_metadata.full_name ||
    "Unknown";

  return (
    <Link href="/(tabs)/settings">
      <Avatar bgColor="$green200" size="md" borderRadius="$full">
        <AvatarImage source={{ uri: user?.user_metadata.avatar_url }} />
        <AvatarFallbackText color="$black">{name}</AvatarFallbackText>
      </Avatar>
    </Link>
  );
}
