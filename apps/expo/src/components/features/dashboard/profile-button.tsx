import { Link } from "expo-router";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  VStack,
} from "@gluestack-ui/themed";
import { useUser } from "@supabase/auth-helpers-react";

export default function ProfileButton() {
  const user = useUser();
  console.log("user", user?.user_metadata.picture);
  return (
    <Link href="/modal">
      <Avatar bgColor="$green200" size="md" borderRadius="$full">
        <AvatarFallbackText color="$black">
          Sandeep Srivastava
        </AvatarFallbackText>
        <AvatarImage src={user?.user_metadata.picture} />
      </Avatar>
    </Link>
  );
}
