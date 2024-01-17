import { Link } from "expo-router";
import { Avatar, AvatarFallbackText, VStack } from "@gluestack-ui/themed";

export default function ProfileButton() {
  return (
    <Link href="/modal">
      <Avatar bgColor="$green200" size="md" borderRadius="$full">
        <AvatarFallbackText color="$black">
          Sandeep Srivastava
        </AvatarFallbackText>
      </Avatar>
    </Link>
  );
}
