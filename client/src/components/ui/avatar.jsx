import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cn, getUserInitials } from '@/lib/utils';
import { getOptimizedImageUrl, getProviderImage } from '@/utils/imageUtils';
import { ProviderAvatar } from "@/components/common/ProviderAvatar";

function Avatar({ className, ...props }) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn('relative flex size-8 shrink-0 overflow-hidden rounded-full', className)}
      {...props}
    />
  );
}

function AvatarImage({ className, ...props }) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn('aspect-square size-full object-cover', className)}
      {...props}
    />
  );
}

function AvatarFallback({ className, ...props }) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn('bg-[#8C4B3E] text-white flex size-full items-center justify-center rounded-full text-xs font-extrabold uppercase select-none', className)}
      {...props}
    />
  );
}

function UserAvatar({ user, src, name, className, fallbackClassName, imageClassName, size = 160, ...props }) {
  const [imgError, setImgError] = React.useState(false);

  React.useEffect(() => {
    setImgError(false);
  }, [src, user?.avatar, user?.profileImage]);

  const rawAvatarSrc = src || user?.avatar || user?.profileImage || user?.providerProfileImage;
  const avatarSrc = imgError ? null : getOptimizedImageUrl(rawAvatarSrc, { width: size, height: size });
  const displayName = name || user?.fullName || user?.name || "User";
  const initials = getUserInitials(displayName);

  return (
    <Avatar className={className} {...props}>
      {avatarSrc ? (
        <AvatarImage
          src={avatarSrc}
          alt={displayName}
          className={imageClassName}
          onError={() => setImgError(true)}
        />
      ) : null}
      <AvatarFallback className={fallbackClassName}>
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}

export { Avatar, AvatarImage, AvatarFallback, UserAvatar, ProviderAvatar };
