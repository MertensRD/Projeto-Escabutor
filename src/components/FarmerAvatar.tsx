/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, Sprout } from 'lucide-react';

interface FarmerAvatarProps {
  src?: string;
  avatarUrl?: string;
  alt?: string;
  name?: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const FarmerAvatar: React.FC<FarmerAvatarProps> = ({
  src,
  avatarUrl,
  alt,
  name,
  className = '',
  size = 'md'
}) => {
  const [hasError, setHasError] = useState(false);
  const resolvedSrc = src || avatarUrl || '';
  const resolvedAlt = alt || name || 'Agricultor';

  const getDimensions = () => {
    switch (size) {
      case 'xs':
        return 'h-6 w-6 text-[10px]';
      case 'sm':
        return 'h-7 w-7 text-xs';
      case 'md':
        return 'h-10 w-10 text-sm';
      case 'lg':
        return 'h-13 w-13 text-base';
      case 'xl':
        return 'h-20 w-20 text-xl';
      default:
        return 'h-10 w-10 text-sm';
    }
  };

  if (hasError || !resolvedSrc) {
    const initial = resolvedAlt ? resolvedAlt.trim().charAt(0).toUpperCase() : 'A';
    return (
      <div
        className={`flex shrink-0 items-center justify-center rounded-full bg-emerald-800 font-bold text-white shadow-xs border border-emerald-600 ${getDimensions()} ${className}`}
        aria-label={resolvedAlt}
      >
        <span>{initial}</span>
      </div>
    );
  }

  return (
    <img
      src={resolvedSrc}
      alt={resolvedAlt}
      className={`rounded-full object-cover shrink-0 ${getDimensions()} ${className}`}
      onError={() => setHasError(true)}
      loading="lazy"
      referrerPolicy="no-referrer"
    />
  );
};
