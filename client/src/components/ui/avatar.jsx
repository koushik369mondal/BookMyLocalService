import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cn, getUserInitials } from '@/lib/utils';

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

function UserAvatar({ user, src, name, className, fallbackClassName, imageClassName }) {
  const avatarSrc = src || user?.avatar;
  const displayName = name || user?.fullName || user?.name || "User";
  const initials = getUserInitials(displayName);

  return (
    <Avatar className={className}>
      {avatarSrc ? (
        <AvatarImage src={avatarSrc} alt={displayName} className={imageClassName} />
      ) : null}
      <AvatarFallback className={fallbackClassName}>
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}

export { Avatar, AvatarImage, AvatarFallback, UserAvatar };
