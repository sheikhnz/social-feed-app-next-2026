import Image from "next/image";
import { getUserName, getUserInitial } from "@/lib/utils/user";

interface UserAvatarProps {
  user?: {
    firstName?: string | null;
    lastName?: string | null;
    name?: string | null;
    image?: string | null;
  } | null;
  size?: number;
  className?: string;
  fallbackClassName?: string;
}

export const UserAvatar = ({ user, size = 32, className = "", fallbackClassName = "bg-blue-500 text-white" }: UserAvatarProps) => {
  const userName = user?.name || getUserName(user?.firstName, user?.lastName);
  const userInitial = getUserInitial(userName);
  const userImage = user?.image;

  if (userImage) {
    return (
      <Image
        src={userImage}
        alt={userName}
        width={size}
        height={size}
        className={`rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full font-semibold ${fallbackClassName} ${className}`}
      style={{ width: size, height: size, fontSize: Math.max(12, size * 0.4) }}
    >
      {userInitial}
    </div>
  );
};
