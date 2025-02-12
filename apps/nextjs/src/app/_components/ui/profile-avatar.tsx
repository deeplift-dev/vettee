import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

interface ProfileAvatarProps {
  profile: {
    firstName: string;
    lastName: string;
    image?: string | null;
  };
  showOnlineStatus?: boolean;
}

export default function ProfileAvatar({
  profile,
  showOnlineStatus = true,
}: ProfileAvatarProps) {
  const getInitials = (firstName: string, lastName: string) => {
    if (!firstName && !lastName) return "";
    return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`;
  };

  return (
    <div className="relative rounded-full border border-white/40">
      <Avatar>
        <AvatarImage src={profile.image ?? undefined} alt={profile.firstName} />
        <AvatarFallback>
          {getInitials(profile.firstName, profile.lastName)}
        </AvatarFallback>
      </Avatar>
      {/* {showOnlineStatus && (
        <span className="size-3 border-background absolute bottom-0 end-0 rounded-full border-2 bg-emerald-500">
          <span className="sr-only">Online</span>
        </span>
      )} */}
    </div>
  );
}
